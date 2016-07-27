#-*- encoding: utf-8 -*-
from app import db, redis_client
from app.apis import api
from base import BaseResource
import datetime
import json


class DataResource(BaseResource):
    def get_urls(self):
        return (
            ('/stats', self.get_stats),
        )

    def get_stats(self):
        key = 'stats'
        data = redis_client.get(key)
        if data:
            data = json.loads(data)
        
        return self.response(data)


class Data(db.Model):
    pass

api.register(Data, DataResource)