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


def raw_uuid(data):
    if data:
        return binascii.unhexlify(data.replace('-',''))


def _prettify_uuid(raw_uuid):
    return str(uuid.UUID(binascii.hexlify(raw_uuid)))


class CmdMaker(object):
    def __init__(self):
        self.commandID = str(uuid.uuid4())
        self.timestamp = int(time.mktime(datetime.datetime.utcnow().utctimetuple()))
        self.user = g.user

    def make_cmd(self, type, sensorID, commandID, content=None, extra=None):
        self.sensorID = sensorID
        raw_sensorID = raw_uuid(self.sensorID)
        raw_commandID = raw_uuid(self.commandID)
        fmt = '=BI16s16s'

        if content:
            fmt = fmt + '{}s'.format(len(content))

        cmd_length = struct.calcsize(fmt)

        if content:
            data = struct.pack(fmt, type, cmd_length, raw_sensorID, raw_commandID, content)
        else:
            data = struct.pack(fmt, type, cmd_length, raw_sensorID, raw_commandID)


        return Command.insert(
            type = type,
            length = cmd_length,
            sensorID = self.sensorID,
            uuid = self.commandID,
            raw = binascii.hexlify(data),
            content = extra,
            user = g.user,
            timestamp = self.timestamp,
            sender = True
        ).execute()

    def sensor_update(self, sensorID):
        self.type = 0x41
        cmd = self.make_cmd(self.type, sensorID, self.commandID)
        return cmd

    def sensor_uninstall(self, sensorID):
        self.type = 0x42
        cmd = self.make_cmd(self.type, sensorID, self.commandID)
        return cmd

    def sensor_quarantine(self, sensorID):
        self.type = 0x43
        cmd = self.make_cmd(self.type, sensorID, self.commandID)
        return cmd

    def sensor_cancel_quarantine(self, sensorID):
        self.type = 0x44
        cmd = self.make_cmd(self.type, sensorID, self.commandID)
        return cmd

    def sensor_update_profile(self, sensorID, profile_id):
        self.type = 0x45
        profile_path = Profile.get(Profile.id==profile_id).originpath
        content = open(profile_path, 'rb').read()
        extra = json.dumps({'profile_id': profile_id})
        cmd = self.make_cmd(self.type, sensorID, self.commandID, content, extra=extra)
        return cmd

    def sensor_pause(self, sensorID):
        self.type = 0x46
        cmd = self.make_cmd(self.type, sensorID, self.commandID)
        return cmd

    def sensor_resume(self, sensorID):
        self.type = 0x47
        cmd = self.make_cmd(self.type, sensorID, self.commandID)
        return cmd

    def sensor_upgrade(self, sensorID, sensor_version, sensor_urls_dump):
        self.type = 0x41
        extra = json.dumps({'sensor': sensor_version})
        cmd = self.make_cmd(self.type, sensorID, self.commandID, sensor_urls_dump, extra=extra)
        return cmd

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
        print 'Receive handshake:', Command.update(status=-1).where(Command.uuid==_prettify_uuid(self.commandID)).execute()

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
                sensorID=_prettify_uuid(self.sensorID),
                defaults=kwargs
        )

        if not created:
            del kwargs['start_timestamp']
            for k, v in kwargs.iteritems():
                setattr(computer, k, v)

            computer.save()

    def sensor_off(self):
        Computer.update(status=ComputerStatus.off).where(Computer.sensorID == _prettify_uuid(self.sensorID)).execute()

    def sensor_process_result(self):
        """
        result:
        # 1: success
        # 2: fail
        """
        with db.database.transaction():
            result = bool(struct.unpack('=B', self.message)[0] == 1)
            Command.update(status=result).where(Command.uuid==_prettify_uuid(self.commandID)).execute()

            if result:
                cmd = Command.get(Command.uuid==_prettify_uuid(self.commandID))
                type = int(cmd.type)
                if type == 0x42:
                    Computer.update(status=ComputerStatus.uninstall).where(Computer.sensorID==_prettify_uuid(self.sensorID)).execute()
                elif type == 0x43:
                    Computer.update(is_quarantine=True).where(Computer.sensorID==_prettify_uuid(self.sensorID)).execute()
                elif type == 0x44:
                    Computer.update(is_quarantine=False).where(Computer.sensorID==_prettify_uuid(self.sensorID)).execute()
                elif type == 0x45:
                    profile_id = int(json.loads(cmd.content)['profile_id'])
                    Computer.update(profile=profile_id).where(Computer.sensorID==_prettify_uuid(self.sensorID)).execute()
                elif type == 0x46:
                    Computer.update(status=ComputerStatus.pause).where(Computer.sensorID==_prettify_uuid(self.sensorID)).execute()
                elif type == 0x47:
                    Computer.update(status=ComputerStatus.on).where(Computer.sensorID==_prettify_uuid(self.sensorID)).execute()

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
