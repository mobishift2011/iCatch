# -*- encoding: utf-8 -*-
from . import db
from peewee import *
from peewee_patch import *
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


class ComputerStatus:
    on = 'on'
    off = 'off'
    pause = 'pause'
    uninstall = 'uninstall'

class Computer(db.Model):
    sensorID = CharField(max_length=255)
    sensorVersion = CharField(max_length=64)
    name = CharField(max_length=128)
    os = CharField(max_length=128)
    status = CharField(max_length=32)
    ip = CharField(max_length=128)
    last_communicated_timestamp = IntegerField()
    start_timestamp = IntegerField()
    profile = ForeignKeyField(Profile, null=True)
    is_quarantine = BooleanField(default=False)


class GroupAddOption:
    manual = 0
    rule = 1


class Group(db.Model, InheritanceMixin):
    title = CharField(max_length=64)
    parent = ForeignKeyField('self', null=True)
    addOpt = IntegerField()
    order = IntegerField(default=0)


class GroupRule(db.Model):
    group = ForeignKeyField(Group)
    key = CharField(max_length=64)
    op = CharField(max_length=64)
    value = CharField(max_length=255)


class ComputerGroup(db.Model):
    computer = ForeignKeyField(Computer)
    group = ForeignKeyField(Group)


class Command(db.Model):
    type = CharField(max_length=32)
    length = IntegerField(default=0)
    sensorID = CharField(max_length=255, null=True)
    uuid = UUIDField()
    content = TextField(null=True)
    raw = TextField()
    status = SmallIntegerField(null=True)
    user = ForeignKeyField(User, null=True)
    timestamp = IntegerField()
    sender = BooleanField(default=False)
    unknown = BooleanField(default=False)

    class Meta:
        indexes = (
            (('uuid',), False),
        )
        order_by = ('-timestamp',)


class AlarmStatus:
    new = 'new'
    unsolved = 'unsolved'
    solved = 'solved'
    whitelist = 'whitelist'
    exception = 'exception'

class AlarmType:
    file = 'File'
    action = 'Action'


class Alarm(db.Model):
    alarmID = CharField(max_length=255)
    sensorID = CharField(max_length=255)
    computer = ForeignKeyField(Computer, null=True)
    status = CharField(max_length=32, default='new')
    type = CharField(max_length=32)
    point = SmallIntegerField(null=True)
    description = CharField(null=True)
    filename = CharField(null=True)
    path = CharField(null=True)
    md5 = CharField(null=True)
    sha256 = CharField(null=True)
    timestamp = IntegerField()
    has_solutions = BooleanField(default=False)

    class Meta:
        indexes = (
            (('status',), False),
            (('md5', 'sha256'), False)
        )
        order_by = ('-timestamp',)


class ExceptionItem(db.Model):
    alarm = ForeignKeyField(Alarm)
    code = IntegerField()
    point = IntegerField()
    description = CharField(max_length=255)
    timestamp = IntegerField()


class EventObject(db.Model):
    type = CharField()
    content = TextField()
    relationType = CharField(max_length=32, null=True)
    relationObj = ForeignKeyField('self', null=True)


class Event(db.Model):
    alarm = ForeignKeyField(Alarm)
    eventID = CharField(max_length=255)
    sid = CharField(max_length=255)
    description = CharField(max_length=255, null=True)
    timestamp = IntegerField()
    point = SmallIntegerField(null=True)
    action = CharField(max_length=128)
    sourceObj = ForeignKeyField(EventObject, related_name='sourceObj', null=True)
    targetObj = ForeignKeyField(EventObject, related_name='targetObj', null=True)
    srcRelationShip = CharField(max_length=128, null=True)
    srcRelationObj = ForeignKeyField(EventObject, null=True, related_name='srcRelationObj')
    tarRelationShip = CharField(max_length=128, null=True)
    tarRelationObj = ForeignKeyField(EventObject, null=True, related_name='tarRelationObj')


class SensorLogin(db.Model):
    username = CharField(max_length=128)
    sid = CharField(max_length=255)
    sensorID = CharField(max_length=255)
    ip = CharField(max_length=128)
    domain = CharField(max_length=255)
    timestamp = IntegerField()


class LoginLog(db.Model):
    user = ForeignKeyField(User, null=True)
    email = CharField(max_length=50)
    ip = CharField(max_length=20, null=True)
    ua = CharField(null=True)
    data = CharField(max_length=1000)
    success = BooleanField()
    dateAdded = DateTimeField()

    class Meta:
        indexes = (
            (('email', 'dateAdded'), False),
        ),
        ordering = (('dateAdded', 'asc'),)


class UpdateLog(db.Model):
    user = ForeignKeyField(User)
    table = CharField(max_length=20)
    external_id = IntegerField()
    log = TextField(null=True)
    dateAdded = DateTimeField()

    class Meta:
        indexes = (
            (('table', 'external_id'), False),
        )


class ErrorLog(db.Model):
    appname = CharField(null=True)
    level = CharField(null=True)
    context = CharField(max_length=1000, null=True)
    message = CharField(max_length=1000, null=True)
    exc_text = TextField(null=True)
    module = CharField(null=True)
    function = CharField(null=True)
    sync = BooleanField()

    dateAdded = DateTimeField()

    class Meta:
        indexes = (
            (('sync',), False),
        )


# class OperationType:
#     CandidateList = 'CandidateList'
#     CandidateView = 'CandidateView'
#     CandidateContactInfo = 'CandidateContactInfo'
#     CandidateAttachmentView = 'CandidateAttachmentView'
#     CandidateAttachmentDownload = 'CandidateAttachmentDownload'
#     DocumentAttachmentDownload = 'DocumentAttachmentDownload'
#     ClientView = 'ClientView'
#     JobOrderView = 'JobOrderView'
#
#     __LIST__ = [CandidateList, CandidateView, CandidateContactInfo, CandidateAttachmentView, CandidateAttachmentDownload, DocumentAttachmentDownload]

class OperationLog(db.Model):
    user = ForeignKeyField(User, null=True)
    table = CharField(max_length=20)
    type = CharField(max_length=50)
    external_id = CharField(null=True)
    dateAdded = DateTimeField()

    class Meta:
        indexes = (
            (('table', 'external_id'), False),
        )