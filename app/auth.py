#-*- encoding: utf-8 -*-
from . import app, db
from flask_peewee.auth import Auth

auth = Auth(app, db, prefix='')