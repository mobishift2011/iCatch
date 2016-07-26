#-*- encoding: utf-8 -*-
from app.apis import api
from app.models import Alarm, AlarmStatus
from base import BaseResource

class AlarmResource(BaseResource):
    pass


api.register(Alarm, AlarmResource)