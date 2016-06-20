#-*- encoding: utf-8 -*-
from flask import Flask
from flask_peewee.db import Database
from flask_peewee.rest import RestAPI

import errno
import json
import os

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

def init_apis(app):
    api = RestAPI(app)
    for model in db.Model.__subclasses__():
        api.register(model)
    api.register(auth.User)
    api.setup()

app = Flask(__name__)
config_from_jsonfile(app)
app.debug = app.config.get('DEBUG', False)
app.config['SECRET_KEY'] = app.config['CLIENTKEY']
db = Database(app)

from auth import auth
import models
import views

init_apis(app)