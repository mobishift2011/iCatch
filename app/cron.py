# -*- encoding: utf-8 -*-
from app import redis_client
from app.models import *
from app.common import utils
from peewee import fn
import datetime
import time
import json


def _get_past_utcts(days):
    midnight = utils.get_local_midnight()
    dt = midnight - datetime.timedelta(days=days)
    timestamp = time.mktime(dt.utctimetuple())
    return timestamp


def _get_3m_ago_ts():
    return _get_past_utcts(90)


def _get_2w_ago_ts():
    return _get_past_utcts(14)


def _most_alarmed_coms():
    ts = _get_3m_ago_ts()
    query = Alarm.select(Alarm.sensorID, fn.count(1).alias('count')) \
        .where(Alarm.timestamp > ts, Alarm.has_solutions == False).group_by(Alarm.sensorID).order_by(-fn.count(1))

    return [(item.sensorID, item.count) for item in query[0:10]]


def _daily_alarmed_coms():
    result = []
    mid_night = utils.get_local_midnight()
    timedelta = datetime.timedelta
    last_datetimes = [(mid_night - timedelta(days=i + 1), mid_night - timedelta(days=i)) for i in xrange(0, 14)]

    for item in last_datetimes:
        start_ts = time.mktime(item[0].utctimetuple())
        end_ts = time.mktime(item[1].utctimetuple())
        count = Alarm.select(fn.count(fn.distinct(Alarm.computer)).alias('count'))\
            .where(Alarm.timestamp >= start_ts, Alarm.timestamp < end_ts, Alarm.has_solutions == False).get().count

        result.append((item[0].strftime('%Y-%m-%d'), count))

    result.reverse()
    return result


def _most_alarmed_files():
    ts = _get_3m_ago_ts()
    query = Alarm.select(Alarm.md5, Alarm.sha256, fn.count(1).alias('count')) \
        .where(Alarm.type == AlarmType.file, Alarm.timestamp > ts, Alarm.has_solutions == False) \
            .group_by(Alarm.md5, Alarm.sha256).order_by(-fn.count(1))

    return [(item.md5, item.sha256, item.count) for item in query[0:10]]


def _daily_alarmed_files():
    result = []
    mid_night = utils.get_local_midnight()
    timedelta = datetime.timedelta
    last_datetimes = [(mid_night - timedelta(days=i + 1), mid_night - timedelta(days=i)) for i in xrange(0, 14)]

    for item in last_datetimes:
        start_ts = time.mktime(item[0].utctimetuple())
        end_ts = time.mktime(item[1].utctimetuple())
        count = Alarm.select()\
            .where(Alarm.type=='File', Alarm.timestamp >= start_ts, Alarm.timestamp < end_ts, Alarm.has_solutions == False)\
                .group_by(Alarm.md5, Alarm.sha256, Alarm.computer).count()

        result.append((item[0].strftime('%Y-%m-%d'), count))

    result.reverse()
    return result


def _os_alarmed_stats():
    ts = _get_3m_ago_ts()
    result = {}

    for item in Computer.select(Computer.os, fn.count(1).alias('count')).group_by(Computer.os):
        os = item.os
        total = item.count
        result.setdefault(os, {})
        result[os].setdefault('total', total)

        com_query = Computer.select(Computer.id).join(Alarm, on=Alarm.computer_id).where(Computer.os == item.os,
                                                                                         Alarm.timestamp > ts,
                                                                                         Alarm.has_solutions == False).distinct()
        alarmed_count = com_query.count()
        result[os]['alarmed'] = alarmed_count
        result[os]['without_alarmed'] = total - alarmed_count

    return result


def make_stats():
    dt = datetime.date.today()
    result = {
        'most_alarmed_coms': _most_alarmed_coms(),
        'daily_alarmed_coms': _daily_alarmed_coms(),
        'most_alarmed_files': _most_alarmed_files(),
        'daily_alarmed_files': _daily_alarmed_files(),
        'os_alarmed_stats': _os_alarmed_stats(),
        'date': str(dt)
    }

    redis_client.setex('stats', 3600 * 24 * 7, json.dumps(result))
    return result


def test():
    print make_stats()


if __name__ == '__main__':
    test()
