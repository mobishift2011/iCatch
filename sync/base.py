#-*- encoding: utf-8 -*-
from app import app
from app.models import *

import binascii
import datetime
import json
import os
import socket
import ssl
import struct
import time

BUFFER_SIZE = 1024 * 18 # max 16k


class CmdProcessor(object):
    def __init__(self, data, type_byte=1, length_byte=4):
        self.cmd = data
        self.type = struct.unpack('B', data[0: type_byte])[0]
        self.length = struct.unpack('I', data[type_byte: type_byte+length_byte])[0]
        self.message = data[type_byte+length_byte:]

    def sensor_to_admin_handshake(self, sensorID, commandID):
        fmt = '=BI16s16s'
        data = struct.pack(fmt, 0x02, struct.calcsize(fmt), sensorID, commandID)
        return data

    def engine_to_admin_handshake(self, commandID):
        fmt = '=BI16s'
        data = struct.pack(fmt, 0x20, struct.calcsize(fmt), commandID)
        return data

    def insert_unknown_command(self):
        Command.insert(
            type = self.type,
            length = self.length,
            raw = self.cmd,
            timestamp = time.mktime(datetime.datetime.utcnow().timetuple())
        ).execute()

    def get_or_create_command(self):
        pass

    def process(self):
        if(self.type == 0x00):
            sensorID, commandID = sensor_login(self.message)
            return self.sensor_to_admin_handshake(sensorID, commandID)

        elif(self.type == 0x22):
            pass

        elif(self.type == 0x23):
            commandID = alarm_actions(self.message)
            return self.engine_to_admin_handshake(commandID)

        else:
            pass


def sensor_login(data):
    from pprint import pprint;import ipdb;ipdb.set_trace();
    data = struct.unpack('=16B1Q16B4H1B', data)
    sensorID = ','.join(str(i) for i in data[0:16])
    timestamp = data[17] / 1000

    sensorID, timestamp, commandID, version, os

    return sensorID, commandID


def alarm_files(data):
    pass


def alarm_actions(data):
    data = json.loads(data)
    Alarm.insert(
        alarmID = data['AlarmID'],
        sensorID = data['SnesorID'],
        type = 'Action',
        point = data['Point'],
        timestamp = int(data['Timestamp']) / 1000
    ).execute()
    return data.get('commandID', '')


def alarm_exceptions(data):
    pass