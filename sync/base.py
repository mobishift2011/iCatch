# -*- encoding: utf-8 -*-
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
import uuid

BUFFER_SIZE = 1024 * 18  # max 16k


class CmdProcessor(object):
    def __init__(self, data=None, type_byte=1, length_byte=4, sensor_byte=16, command_byte=16):
        if not data:
            return

        self.cmd = data
        meta_length = type_byte + length_byte + sensor_byte + command_byte
        self.type, self.length, self.sensorID, self.commandID = \
            struct.unpack('={}B{}I{}s{}s'.format(type_byte, length_byte / 4, sensor_byte, command_byte),
                          data[0: meta_length])

        self.message = data[meta_length:]

    def make_cmd(self, type, sensorID, commandID):
        self.sensorID = sensorID
        self.commandID = commandID

        fmt = '=BI16s16s'
        data = struct.pack(fmt, type, struct.calcsize(fmt), self.sensorID, self.commandID)
        return data

    def make_response_handshake(self, type):
        fmt = '=BI16s16s'
        data = struct.pack(fmt, type, struct.calcsize(fmt), self.sensorID, self.commandID)
        return data

    def sensor_handshake(self):
        return self.make_response_handshake(0x40)

    def engine_handshake(self):
        return self.make_response_handshake(0x50)

    def receive_handshake(self):
        print 'handshake from sensor:', self.type, self.sensorID, self.commandID

    def insert_unknown_command(self):
        Command.insert(
                type=self.type,
                length=self.length,
                raw=self.cmd,
                timestamp=time.mktime(datetime.datetime.utcnow().timetuple())
        ).execute()

    def process(self):
        if self.type == 0x00:
            self.sensor_login()
            return self.sensor_handshake()

        elif self.type == 0x01:
            self.sensor_process_result()
            return self.sensor_handshake()

        elif self.type == 0x02:
            self.receive_handshake()

        elif self.type == 0x03:
            self.sensor_off()

        elif self.type == 0x23:
            self.alarm_actions()
            return self.engine_handshake()

        else:
            pass

    def _prettify_uuid(self, raw_uuid):
        return str(uuid.UUID(binascii.hexlify(raw_uuid)))

    def sensor_login(self):
        data = json.loads(self.message)
        timestamp = int(data['Timestamp']) / 1000

        kwargs = {
            'sensorVersion': data.get('SensorVersion', ''),
            'name': data.get('ComputerName', ''),
            'os': data.get('OSType', ''),
            'status': ComputerStatus.on,
            'ip': data.get('IP', ''),
            'last_communicated_timestamp': timestamp,
            'start_timestamp': timestamp,
            # profile = ForeignKeyField(Profile, null=True)
        }

        computer, created = Computer.get_or_create(
                sensorID=self._prettify_uuid(self.sensorID),
                defaults=kwargs
        )

        if not created:
            del kwargs['start_timestamp']
            for k, v in kwargs.iteritems():
                setattr(computer, k, v)

            computer.save()

    def sensor_off(self):
        print 'off'
        print self._prettify_uuid(self.sensorID)
        Computer.update(status=ComputerStatus.off).where(Computer.sensorID == self._prettify_uuid(self.sensorID)).execute()

    def sensor_uninstall(self, sensorID, commandID):
        cmd = CmdProcessor().make_cmd(0x42, sensorID, commandID)
        return cmd

    def sensor_pause(self, sensorID, commandID):
        cmd = CmdProcessor().make_cmd(0x46, sensorID, commandID)
        return cmd

    def sensor_process_result(self):
        """
        result:
        # 1: success
        # 2: fail
        """
        result = struct.unpack('=B', self.message)[0]
        print result

    def _get_or_create_alarm(self, type, **kwargs):
        data = {
            'sensorID': self.sensorID,
            'type': type,
            'point': kwargs['Point'],
            'timestamp': int(kwargs['Timestamp']) / 1000
        }

        alarm, created = Alarm.get_or_creat(
            alarmID = kwargs['AlarmID'],
            defaults = data
        )

        return alarm, created

    def alarm_files(self):
        data = json.loads(self.message)
        alarm, created = self._get_or_create_alarm('File', **data)

    def alarm_actions(self):
        data = json.loads(self.message)
        alarm, created = self._get_or_create_alarm('Action', **data)
