#-*- encoding: utf-8 -*-
from app import app
from app.apis import api
from app.models import db, Computer, Profile
from base import BaseResource
from flask import request
from sync.base import CmdMaker

class ComputerResource(BaseResource):
    def get_urls(self):
        urls = (
            ('/', self.require_method(self.api_list, ['GET'])),
            ('/<pk>/', self.require_method(self.api_detail, ['GET', 'POST'])),
            ('/sensor/', self.require_method(self.sensor_list, ['GET'])),
            ('/uninstall/', self.require_method(self.uninstall, ['GET'])),
        )

        return urls

    def serialize_query(self, query):
        results = super(ComputerResource, self).serialize_query(query)
        patchs = {
            Profile: ['id', 'title'],
        }

        self.serialize_patch_foreignkey(results, patchs)
        return results

    def sensor_list(self):
        query = Computer.select(Computer.sensorVersion).distinct().order_by('sensorVersion')
        results = [item.sensorVersion for item in query]
        return self.response(results)

    def uninstall(self):
        result = True
        ids = [int(id) for id in request.args.get('ids', '').split(',')]

        try:
            with db.database.transaction():
                for item in Computer.select(Computer.sensorID).where(Computer.id << ids):
                    cm = CmdMaker().sensor_uninstall(item.sensorID)
        except:
            import traceback
            traceback.print_exc()
            app.logger.error('sensor uninstall')
            result = False

        return self.response({'status': result})

api.register(Computer, ComputerResource)