# -*- encoding: utf-8 -*-
from app.apis import api
from app.models import Alarm, AlarmStatus, Computer
from base import BaseResource
from flask import request
from peewee import fn


class AlarmResource(BaseResource):
    def get_urls(self):
        return (
            ('/', self.require_method(self.api_list, ['GET'])),
            ('/<pk>/', self.require_method(self.api_detail, ['GET', 'POST', 'PUT'])),
            ('/computer/stats', self.computer_stats),
            ('/type/stats', self.type_stats)
        )

    def process_query(self, query):
        query = super(AlarmResource, self).process_query(query)
        status = request.args.get('status__in')
        not_status = request.args.get('status__nin')

        if status:
            query = query.where(Alarm.status.in_(status.split(',')))
        if not_status:
            query = query.where(Alarm.status.not_in(not_status.split(',')))

        return query

    def object_detail(self, obj):
        return self.response(self.serialize_object(obj))

    def edit(self, obj):
        try:
            data = self.read_request_data()
        except ValueError:
            return self.response_bad_request()

        if len(set(data) | set(['id', 'status'])) > 2:
            return self.response_bad_request()

        return super(AlarmResource, self).edit(obj)

    def computer_stats(self):
        all_count = Computer.select().count()
        with_alarm_count = Alarm.select(Alarm.computer).where(
                Alarm.status.in_([AlarmStatus.new, AlarmStatus.unsolved])).distinct().count()

        result = {
            'with_alarm': with_alarm_count,
            'without_alarm': (all_count - with_alarm_count),
        }
        return self.response(result)

    def type_stats(self):
        query = Alarm.select(Alarm.type, fn.count(Alarm.type).alias('count')).where(
            Alarm.status.in_([AlarmStatus.new, AlarmStatus.unsolved])).group_by(Alarm.type)

        result = {item.type: int(item.count) for item in query}
        return self.response(result)


api.register(Alarm, AlarmResource)
