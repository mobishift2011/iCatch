#-*- encoding: utf-8 -*-
from . import db
from peewee import *

import datetime

class Note(db.Model):
    message = TextField()
    created = DateTimeField(default=datetime.datetime.now)

