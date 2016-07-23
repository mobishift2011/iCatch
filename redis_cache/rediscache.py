"""
A simple redis-cache interface for storing python objects.
"""
from functools import wraps
import pickle
import json
import hashlib
import redis
import logging

DEFAULT_EXPIRY = 60 * 60 * 24


class CacheMissException(Exception):
    pass


class ExpiredKeyException(Exception):
    pass


class RedisNoConnException(Exception):
    pass


class DoNotCache(Exception):
    _result = None

    def __init__(self, result):
        super(DoNotCache, self).__init__()
        self._result = result

    @property
    def result(self):
        return self._result


class SimpleCache(object):
    def __init__(self,
                 limit=10000,
                 expire=DEFAULT_EXPIRY,
                 hashkeys=False,
                 namespace="SimpleCache"):

        self.limit = limit  # No of json encoded strings to cache
        self.expire = expire  # Time to keys to expire in seconds
        self.namespace = namespace

        try:
            from gllue.app import redis_client
            self.connection = redis_client
        except RedisNoConnException, e:
            self.connection = None
            pass

        # Should we hash keys? There is a very small risk of collision invloved.
        self.hashkeys = hashkeys

    def make_key(self, key):
        return key

    def namespace_key(self, namespace):
        return self.make_key(namespace + ':*')

    def get_set_name(self):
        return "{0}-keys".format(self.namespace)

    def store(self, key, value, expire=None):
        """
        Method stores a value after checking for space constraints and
        freeing up space if required.
        :param key: key by which to reference datum being stored in Redis
        :param value: actual value being stored under this key
        :param expire: time-to-live (ttl) for this datum
        """
        key = to_unicode(key)
        value = to_unicode(value)
        set_name = self.get_set_name()
        while self.connection.scard(set_name) >= self.limit:
            del_key = self.connection.spop(set_name)
            self.connection.delete(self.make_key(del_key))

        pipe = self.connection.pipeline()
        if expire is None:
            expire = self.expire
        if (isinstance(expire, int) and expire <= 0) or (expire is None):
            pipe.set(self.make_key(key), value)
        else:
            pipe.setex(self.make_key(key), expire, value)

        pipe.sadd(set_name, key)
        pipe.execute()


    def expire_all_in_set(self):
        """
        Method expires all keys in the namespace of this object.
        At times there is  a need to invalidate cache in bulk, because a
        single change may result in all data returned by a decorated function
        to be altered.
        Method returns a tuple where first value is total number of keys in
        the set of this object's namespace and second value is a number of
        keys successfully expired.
        :return: int, int
        """
        all_members = self.keys()
        keys  = [self.make_key(k) for k in all_members]

        with self.connection.pipeline() as pipe:
            for key in keys:
                pipe.delete(key)
            pipe.execute()

        return len(self), len(all_members)

    def expire_namespace(self, namespace):
        """
        Method expires all keys in the namespace of this object.
        At times there is  a need to invalidate cache in bulk, because a
        single change may result in all data returned by a decorated function
        to be altered.
        Method returns a tuple where first value is total number of keys in
        the set of this object's namespace and second value is a number of
        keys successfully expired.
        :return: int, int
        """
        namespace = self.namespace_key(namespace)
        all_members = list(self.connection.keys(namespace))
        with self.connection.pipeline() as pipe:
            pipe.delete(*all_members)
            pipe.execute()

        return len(self), len(all_members)

    def keys_by_pattern(self, pattern):
        return self.connection.keys(pattern)

    def expire_key(self, key):
        with self.connection.pipeline() as pipe:
            pipe.delete(key)
            pipe.execute()

    def isexpired(self, key):
        """
        Method determines whether a given key is already expired. If not expired,
        we expect to get back current ttl for the given key.
        :param key: key being looked-up in Redis
        :return: bool (True) if expired, or int representing current time-to-live (ttl) value
        """
        ttl = self.connection.pttl("SimpleCache-{0}".format(key))
        if ttl == -2: # not exist
            ttl = self.connection.pttl(self.make_key(key))
        elif ttl == -1:
            return True
        if not ttl is None:
            return ttl
        else:
            return self.connection.pttl("{0}:{1}".format(self.namespace, key))

    def store_json(self, key, value, expire=None):
        self.store(key, json.dumps(value), expire)

    def store_pickle(self, key, value, expire=None):
        self.store(key, pickle.dumps(value), expire)

    def get(self, key):
        key = to_unicode(key)
        if key:  # No need to validate membership, which is an O(1) operation, but seems we can do without.
            value = self.connection.get(self.make_key(key))
            if value is None:  # expired key
                if not key in self:  # If key does not exist at all, it is a straight miss.
                    raise CacheMissException

                self.connection.srem(self.get_set_name(), key)
                raise ExpiredKeyException
            else:
                return value

    def mget(self, keys):
        """
        Method returns a dict of key/values for found keys.
        :param keys: array of keys to look up in Redis
        :return: dict of found key/values
        """
        if keys:
            cache_keys = [self.make_key(to_unicode(key)) for key in keys]
            values = self.connection.mget(cache_keys)

            if None in values:
                pipe = self.connection.pipeline()
                for cache_key, value in zip(cache_keys, values):
                    if value is None:  # non-existant or expired key
                        pipe.srem(self.get_set_name(), cache_key)
                pipe.execute()

            return {k: v for (k, v) in zip(keys, values) if v is not None}

    def get_json(self, key):
        return json.loads(self.get(key))

    def get_pickle(self, key):
        return pickle.loads(self.get(key))

    def mget_json(self, keys):
        """
        Method returns a dict of key/values for found keys with each value
        parsed from JSON format.
        :param keys: array of keys to look up in Redis
        :return: dict of found key/values with values parsed from JSON format
        """
        d = self.mget(keys)
        if d:
            for key in d.keys():
                d[key] = json.loads(d[key]) if d[key] else None
            return d

    def invalidate(self, key):
        """
        Method removes (invalidates) an item from the cache.
        :param key: key to remove from Redis
        """
        key = to_unicode(key)
        pipe = self.connection.pipeline()
        pipe.srem(self.get_set_name(), key)
        pipe.delete(self.make_key(key))
        pipe.execute()

    def __contains__(self, key):
        return self.connection.sismember(self.get_set_name(), key)

    def __iter__(self):
        if not self.connection:
            return iter([])
        return iter(
            ["{0}:{1}".format(self.namespace, x)
                for x in self.connection.smembers(self.get_set_name())
            ])

    def __len__(self):
        return self.connection.scard(self.get_set_name())

    def keys(self):
        return self.connection.smembers(self.get_set_name())


    def flush(self):
        keys = list(self.keys())
        keys.append(self.get_set_name())
        with self.connection.pipeline() as pipe:
            pipe.delete(*keys)
            pipe.execute()

    def flush_namespace(self, space):
        namespace = self.namespace_key(space)
        setname = self.get_set_name()
        keys = list(self.connection.keys(namespace))
        with self.connection.pipeline() as pipe:
            pipe.delete(*keys)
            pipe.srem(setname, *space)
            pipe.execute()

    def get_hash(self, args):
        if self.hashkeys:
            key = hashlib.md5(json.dumps(args)).hexdigest()
        else:
            key = '|'.join([str(_) for _ in args])
        return key

def get_cache_namespace(function):
    return '{}.{}'.format(function.__module__, function.__name__)

def get_cache_key(namespace, args_key):
    return '{namespace}:{key}'.format(namespace=namespace, key=args_key)

def cache_it(limit=10000, expire=DEFAULT_EXPIRY, cache=None, use_json=True, namespace=''):
    """
    Arguments and function result must be pickleable.
    :param limit: maximum number of keys to maintain in the set
    :param expire: period after which an entry in cache is considered expired
    :param cache: SimpleCache object, if created separately
    :return: decorated function
    """
    cache_ = cache  ## Since python 2.x doesn't have the nonlocal keyword, we need to do this
    expire_ = expire  ## Same here.
    def decorator(function):
        cache, expire = cache_, expire_
        namespace = get_cache_namespace(function)
        if cache is None:
            cache = SimpleCache(limit, expire, namespace=namespace)
        elif expire == DEFAULT_EXPIRY:
            # If the expire arg value is the default, set it to None so we store
            # the expire value of the passed cache object
            expire = None

        @wraps(function)
        def func(*args, **kwargs):
            ## Handle cases where caching is down or otherwise not available.
            if cache.connection is None:
                result = function(*args, **kwargs)
                return result

            fetcher = cache.get_json if use_json else cache.get_pickle
            storer = cache.store_json if use_json else cache.store_pickle

            ## Key will be either a md5 hash or just pickle object,
            ## in the form of `function name`:`key`
            args_key = cache.get_hash(list(args) + kwargs.values())
            cache_key = get_cache_key(namespace, args_key)

            try:
                return fetcher(cache_key)
            except (ExpiredKeyException, CacheMissException) as e:
                ## Add some sort of cache miss handing here.
                pass
            except:
                logging.exception("Unknown redis-simple-cache error. Please check your Redis free space.")

            try:
                result = function(*args, **kwargs)
            except DoNotCache as e:
                result = e.result
            else:
                try:
                    storer(cache_key, result, expire)
                except redis.ConnectionError as e:
                    logging.exception(e)

            return result
        return func
    return decorator



def cache_it_json(limit=10000, expire=DEFAULT_EXPIRY, cache=None, namespace=None):
    """
    Arguments and function result must be able to convert to JSON.
    :param limit: maximum number of keys to maintain in the set
    :param expire: period after which an entry in cache is considered expired
    :param cache: SimpleCache object, if created separately
    :return: decorated function
    """
    return cache_it(limit=limit, expire=expire, use_json=True, cache=cache, namespace=None)

def uncache_it(function):
    namespace = get_cache_namespace(function)
    cache = SimpleCache(namespace=namespace)
    cache.expire_all_in_set()

def uncache_it_with_args(function, *args, **kwargs):
    namespace = get_cache_namespace(function)
    cache = SimpleCache(namespace=namespace)
    args_key = cache.get_hash(list(args) + kwargs.values())
    cache_keys = '%s*' % get_cache_key(namespace, args_key)
    for cache_key in cache.keys_by_pattern(cache_keys):
        cache.expire_key(cache_key)

def to_unicode(obj, encoding='utf-8'):
    if isinstance(obj, basestring):
        if not isinstance(obj, unicode):
            obj = unicode(obj, encoding)
    return obj
