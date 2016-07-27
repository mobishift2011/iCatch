#-*- encoding: utf-8 -*-
import os, sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from flask_peewee.db import Database

import errno
import json
import redis

def config_from_jsonfile (app, silent=False):
    filename = os.environ.get('HT_CONFIG') or '/opt/web/config-ht.json'

    try:
        with open(filename) as json_file:
            obj = json.loads(json_file.read())
    except IOError as e:
        if silent and e.errno in (errno.ENOENT, errno.EISDIR):
            return False
        e.strerror = 'Unable to load configuration file (%s)' % e.strerror
        raise
    return app.config.from_mapping(obj)


app = Flask(__name__)
config_from_jsonfile(app)
app.debug = app.config.get('DEBUG', False)
app.config['SECRET_KEY'] = app.config['CLIENTKEY']
db = Database(app)

redis_url = os.environ.get('REDIS_URL') or app.config.get('REDIS_URL')
redis_client = redis.StrictRedis.from_url(redis_url)

from auth import auth
import models
import views
import apis