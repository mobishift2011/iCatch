# -*- encoding: utf-8 -*-
from app.models import *
import datetime
import pytz
import time

def get_local_midnight():
    try:
        tz_str = ConfigValue.get(title='timezone').value
    except:
        tz_str = 'UTC'

    tz = pytz.timezone(tz_str)
    now = time.time()
    midnight_ts = now - now % (3600 * 24) + time.timezone
    return tz.localize(datetime.datetime.fromtimestamp(midnight_ts))