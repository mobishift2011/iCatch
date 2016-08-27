# -*- encoding: utf-8 -*-
from app.apis import api
from app.apis.base import BaseSerializer
from app.models import *
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

    def serialize_query(self, query):
        results = super(AlarmResource, self).serialize_query(query)
        patchs = {
            Computer: ['id', 'name'],
        }

        self.serialize_patch_foreignkey(results, patchs)
        return results

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
        results = [self.serialize_object(obj)]
        patchs = {
            Computer: ['id', 'name', 'ip'],
        }
        self.serialize_patch_foreignkey(results, patchs)
        result = results[0]

        tz = ConfigValue.get(title='timezone').value
        process_timestamp = lambda x: BaseSerializer.process_timestamp(x, tz=tz).strftime('%Y-%m-%d %H:%M:%S')
        time_stat_q = Alarm.select(fn.Min(Alarm.timestamp).alias('earliest_found'), fn.Max(Alarm.timestamp).alias('latest_found')).where(Alarm.alarmID == obj.alarmID).get()
        time_stat = {
            'earliest_found': process_timestamp(time_stat_q.earliest_found),
            'latest_found': process_timestamp(time_stat_q.latest_found)
        }
        result.update(time_stat)

        return self.response(result)

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
                Alarm.computer.is_null(False),
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
