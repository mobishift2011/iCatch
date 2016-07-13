#-*- encoding: utf-8 -*-
from app.apis import api
from app.models import ConfigValue
from base import BaseResource
from utils import get_mail, test_mail
import traceback

class ConfigResource(BaseResource):
    def get_api_name(self):
        return 'config'

    def get_urls(self):
        urls = (
            ('/test_mail/', self.require_method(self.test_mail, ['POST'])),
        )

        return urls + super(ConfigResource, self).get_urls()

    def test_mail(self):
        status = True
        data = self.read_request_data()
        to = data.get('email_address')
        mail = get_mail(data)

        try:
            test_mail(to, mail=mail)
        except:
            traceback.print_exc()
            status = False

        return self.operationresponse(status=status)

api.register(ConfigValue, ConfigResource)