#-*- encoding: utf-8 -*-
from app.apis import api
from app.models import Computer
from base import BaseResource
from peewee import fn

class ComputerResource(BaseResource):
    def get_urls(self):
        urls = (
            ('/', self.require_method(self.api_list, ['GET'])),
            ('/<pk>/', self.require_method(self.api_detail, ['GET', 'POST'])),
            ('/sensor/', self.require_method(self.sensor_list, ['GET'])),
        )

        return urls

    def sensor_list(self):
        query = Computer.select(Computer.sensorVersion).distinct().order_by('sensorVersion')
        results = [item.sensorVersion for item in query]
        return self.response(results)


api.register(Computer, ComputerResource)