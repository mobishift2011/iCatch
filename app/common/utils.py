# -*- encoding: utf-8 -*-
from app.models import *
import datetime
import json
import pytz
import sys
import time
import traceback

def try_format_value(v, length):
    flag = False
    i = 0
    result = ', '
    while i < 10:
        try:
            result = '%s' % json.dumps(str(v)[:length + i]) + ', '
            flag = True
        except:
            pass
        if flag:
            break
        i += 1
    return result

def _dict2str(kwargs, length=36):
    dict_str = "{"
    for k, v in kwargs.iteritems():
        dict_str += '\"%s\"' % str(k) + ':'
        if isinstance(v, dict):
            sub_str = _dict2str(v, length)
            dict_str += sub_str + ", "
        elif isinstance(v, (list, tuple)):
            dict_str += _list2str(v, length) + ", "
        else:
            dict_str += try_format_value(v, length)
    if dict_str.endswith(', '):
        return dict_str[:-2]+"}"
    else:
        return dict_str+"}"


def _list2str(kwargs, length=36):
    list_str = "["
    for item in kwargs:
        if isinstance(item, dict):
            sub_str = _dict2str(item, length)
            list_str += sub_str + ", "
        elif isinstance(item, list):
            list_str += _list2str(item, length) + ', '
        else:
            list_str += try_format_value(item, length)

    if list_str.endswith(', '):
        return list_str[:-2]+"]"
    else:
        return list_str+"]"

def _iter2str(kwargs, length=36):
    if isinstance(kwargs, dict):
        return _dict2str(kwargs, length)
    elif isinstance(kwargs, (list, tuple)):
        return _list2str(kwargs, length)
    return str(kwargs)

def format_exc_plus(limit):
    """ Print the usual traceback information, followed by a listing of
        all the local variables in each frame.
    """
    result = []
    tb = sys.exc_info()[2]
    f = tb.tb_frame
    while tb:
        f = tb.tb_frame
        tb = tb.tb_next
    stack = []
    n = 0
    while f is not None and (limit is None or n < limit):
        stack.append(f)
        f = f.f_back
        n += 1
    stack.reverse()
    result.append(traceback.format_exc())
    result.append("-*" * 50)
    result.append("\n")
    for frame in stack:
        result.append("Frame %s in %s at line %s" % (frame.f_code.co_name,
                                                     frame.f_code.co_filename,
                                                     frame.f_lineno))
        result.append('\n')
        for key, value in frame.f_locals.items():
            result.append("\t%20s = " % key),
            try:
                result.append(_iter2str(value))
                result.append('\n')
            except:
                result.append("<ERROR WHILE PRINTING VALUE>")
                result.append('\n')

    return ''.join(result)

def get_local_midnight():
    try:
        tz_str = ConfigValue.get(title='timezone').value
    except:
        tz_str = 'UTC'

    tz = pytz.timezone(tz_str)
    now = time.time()
    midnight_ts = now - now % (3600 * 24) + time.timezone
    return tz.localize(datetime.datetime.fromtimestamp(midnight_ts))