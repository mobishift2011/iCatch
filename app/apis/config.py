#-*- encoding: utf-8 -*-
from app.apis import api
from app.models import ConfigValue
from base import BaseResource

class ConfigResource(BaseResource):
    def get_api_name(self):
        return 'config'

api.register(ConfigValue, ConfigResource)