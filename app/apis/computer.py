#-*- encoding: utf-8 -*-
from app import app
from app.apis import api
from app.models import db, Computer, Profile, Alarm, AlarmStatus
from base import BaseResource
from flask import request
from sync.base import CmdMaker

import json
import os
import os.path as op

class ComputerResource(BaseResource):
    def get_urls(self):
        urls = (
            ('/', self.require_method(self.api_list, ['GET'])),
            ('/<pk>/', self.require_method(self.api_detail, ['GET', 'POST'])),
            ('/sensor/', self.require_method(self.sensor_list, ['GET'])),
            ('/uninstall/', self.require_method(self.uninstall, ['GET'])),
            ('/pause/', self.require_method(self.pause, ['GET'])),
            ('/resume/', self.require_method(self.resume, ['GET'])),
            ('/quarantine/', self.require_method(self.quarantine, ['GET'])),
            ('/quarantine/cancel/', self.require_method(self.cancel_quarantine, ['GET'])),
            ('/addProfile/', self.require_method(self.add_profile, ['GET'])),
            ('/upgrade/', self.require_method(self.upgrade, ['GET'])),
        )

        return urls

    def process_query(self, query):
        query = super(ComputerResource, self).process_query(query)
        alarm_id = request.args.get('alarm_id')

        if alarm_id:
            query = query.join(Alarm).where(Alarm.alarmID==alarm_id)
            is_current = bool(int(request.args.get('is_current', False)))

            if is_current:
                query = query.where(Alarm.status.in_([AlarmStatus.new, AlarmStatus.unsolved]))
            else:
                query = query.where(Alarm.status.not_in([AlarmStatus.new, AlarmStatus.unsolved]))

            query = query.group_by(Computer.id)

        return query

    def serialize_query(self, query):
        results = super(ComputerResource, self).serialize_query(query)
        patchs = {
            Profile: ['id', 'title'],
        }

        self.serialize_patch_foreignkey(results, patchs)
        return results

    def sensor_list(self):
        if request.args.get('upgrade'):
            """Sensors for upgrade"""
            return self.sensor_packages()

        query = Computer.select(Computer.sensorVersion).distinct().order_by('sensorVersion')
        results = [item.sensorVersion for item in query]
        return self.response(results)

    def sensor_packages(self):
        path = app.config['SENSOR_PATH']
        package_with_urls = [item for item in os.listdir(path) if os.path.isdir(os.path.join(path, item))]
        return self.response(package_with_urls)

    def _sensor_op(self, cmd, *args):
        result = True
        ids = [int(id) for id in request.args.get('ids', '').split(',')]

        try:
            with db.database.transaction():
                for item in Computer.select(Computer.sensorID).where(Computer.id << ids):
                    cm = getattr(CmdMaker(), 'sensor_{}'.format(cmd))(item.sensorID, *args)
        except:
            import traceback; traceback.print_exc()
            app.logger.error('sensor {}'.format(cmd))
            result = False

        return self.response({'status': result})

    def uninstall(self):
        return self._sensor_op('uninstall')

    def pause(self):
        return self._sensor_op('pause')

    def resume(self):
        return self._sensor_op('resume')

    def quarantine(self):
        return self._sensor_op('quarantine')

    def cancel_quarantine(self):
        return self._sensor_op('cancel_quarantine')

    def add_profile(self):
        profile_id = int(request.args.get('profileId'))
        return self._sensor_op('update_profile', profile_id)

    def upgrade(self):
        path = app.config['SENSOR_PATH']
        sensor = request.args.get('sensor')
        url_prefix = app.config['SENSOR_URL']
        items = [{'FileName': item, 'URL': op.join(url_prefix, sensor, item)} for item in os.listdir(op.join(path, sensor))]
        data = {'Version': sensor, 'FileList': items}
        return self._sensor_op('upgrade', sensor, json.dumps(data))

api.register(Computer, ComputerResource)