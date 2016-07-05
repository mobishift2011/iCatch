#-*- encoding: utf-8 -*-
from . import db
from peewee import *
from flask_peewee.auth import BaseUser

import datetime


class InheritanceMixin(object):
    def children(self):
        return []


class User(db.Model, BaseUser):
    username = CharField(unique=True)
    password = CharField()
    email = CharField(unique=True)
    active = BooleanField()
    admin = BooleanField(default=False)

    def __unicode__(self):
        return self.username


class Group(db.Model, InheritanceMixin):
    title = CharField(max_length=64)
    parent = ForeignKeyField('self', null=True)
    order = IntegerField(default=0)


class NotificationMessage(db.Model):
    title = CharField(max_length=255)
    content = TextField()
    date = DateTimeField(default=datetime.datetime.now)
#
#
# class Notification(db.Model):
#     notification = ForeignKeyField(NotificationMessage)
#     user = ForeignKeyField(User)
#     is_read = BooleanField(default=False)
#
#
# class Log(db.Model):
#     pass


class Note(db.Model):
    message = TextField()
    created = DateTimeField(default=datetime.datetime.now)