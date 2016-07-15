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
    title = CharField(max_length=64)
    type = CharField(max_length=32, null=True)
    value = TextField()

    def __unicode__(self):
        return self.title

    class Meta:
        indexes = (
            (('title', 'type'), True),
        )
        ordering = (('title', 'asc'),)


class Profile(db.Model):
    title = CharField(max_length=64, unique=True)
    description = CharField(max_length=255, null=True)
    addedBy = ForeignKeyField(User)
    dateAdded = DateTimeField(default=datetime.datetime.now)
    originpath = CharField(null=True)
    deleted = BooleanField(default=False)

    def __unicode__(self):
        return self.title

    def path(self):
        return self.originpath or op.join(g.config['UPLOAD_FOLDER'], 'profile', self.title)


class NotificationMessage(db.Model):
    title = CharField(max_length=255)
    content = TextField(null=True)
    dateAdded = DateTimeField(default=datetime.datetime.now)


class Notification(db.Model):
    notification = ForeignKeyField(NotificationMessage)
    user = ForeignKeyField(User)
    is_read = BooleanField(default=False)


class Command(db.Model):
    type = CharField(max_length=32)
    length = IntegerField(default=0)
    sensorID = CharField(max_length=255, null=True)
    uuid = UUIDField()
    content = TextField(null=True)
    timestamp = IntegerField()


class Computer(db.Model):
    sensorID = CharField(max_length=255)
    sensorVersion = CharField(max_length=64)
    os = CharField(max_length=64)
    status = CharField(max_length=32)
    ip = CharField(max_length=128)
    last_communicated_timestamp = IntegerField()
    start_timestamp = IntegerField()
    profile = ForeignKeyField(Profile)
    is_quarantine = BooleanField(default=False)


class Group(db.Model, InheritanceMixin):
    title = CharField(max_length=64)
    parent = ForeignKeyField('self', null=True)
    rule = CharField(max_length=255)
    order = IntegerField(default=0)


class ComputerGroup(db.Model):
    computer = ForeignKeyField(Computer)
    group = ForeignKeyField(Group)


class Alert(db.Model):
    alertID = CharField(max_length=255)
    sensorID = CharField(max_length=255)
    computer = ForeignKeyField(Computer)
    point = SmallIntegerField(null=True)
    type = SmallIntegerField()
    timestamp = IntegerField()


class AlertException(db.Model):
    alert = ForeignKeyField(Alert)
    description = CharField(max_length=255)
    type = CharField(max_length=32)


class EventObject(db.Model):
    type = CharField()
    content = TextField()


class Event(db.Model):
    eventID = CharField(max_length=255)
    sid = CharField(max_length=255)
    description = CharField(max_length=255)
    timestamp = IntegerField()
    point = SmallIntegerField()
    action = CharField(max_length=128)
    sourceObj = ForeignKeyField(EventObject, related_name='sourceObj')
    targetObj = ForeignKeyField(EventObject, related_name='targetObj')
    srcRelationShip = CharField(max_length=128, null=True)
    srcRelationObj = ForeignKeyField(EventObject, null=True, related_name='srcRelationObj')
    tarRelationShip = CharField(max_length=128, null=True)
    tarRelationObj = ForeignKeyField(EventObject, null=True, related_name='tarRelationObj')


class LoginLog(db.Model):
    username = CharField(max_length=128)
    sid = CharField(max_length=255)
    sensorID = CharField(max_length=255)
    ip = CharField(max_length=128)
    domain = CharField(max_length=255)
    timestamp = IntegerField()


class Log(db.Model):
    pass