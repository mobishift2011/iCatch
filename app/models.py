# -*- encoding: utf-8 -*-
from . import db
from peewee import *
from flask import g
from flask_peewee.auth import BaseUser

import datetime
import os.path as op


class InheritanceMixin(object):
    def children(self):
        return []


class User(db.Model, BaseUser):
    username = CharField(unique=True)
    password = CharField()
    email = CharField(unique=True)
    active = BooleanField()
    admin = BooleanField(default=False)
    addedBy = ForeignKeyField('self', null=True)
    dateAdded = DateTimeField(default=datetime.datetime.now)

    def __unicode__(self):
        return self.username


class ConfigValue(db.Model):
    title = CharField(max_length=32)
    type = CharField(max_length=16, null=True)
    value = TextField()

    def __unicode__(self):
        return self.title


class Group(db.Model, InheritanceMixin):
    title = CharField(max_length=64)
    parent = ForeignKeyField('self', null=True)
    rule = CharField(max_length=255)
    order = IntegerField(default=0)


class Profile(db.Model):
    title = CharField(max_length=64, unique=True)
    description = CharField(max_length=255)
    addedBy = ForeignKeyField(User)
    dateAdded = DateTimeField(default=datetime.datetime.now)
    originpath = CharField(null=True)
    deleted = BooleanField(default=False)

    def __unicode__(self):
        return self.title

    def path(self):
        return self.originpath or op.join(g.config['UPLOAD_FOLDER'], 'profile', self.title)


class Computer(db.Model):
    profile = ForeignKeyField(Profile)


class ComputerGroup(db.Model):
    computer = ForeignKeyField(Computer)
    group = ForeignKeyField(Group)


class NotificationMessage(db.Model):
    title = CharField(max_length=255)
    content = TextField(null=True)
    dateAdded = DateTimeField(default=datetime.datetime.now)


class Notification(db.Model):
    notification = ForeignKeyField(NotificationMessage)
    user = ForeignKeyField(User)
    is_read = BooleanField(default=False)


class Log(db.Model):
    pass
