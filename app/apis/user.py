#-*- encoding: utf-8 -*-
from app.apis import api
from app.models import User
from base import BaseResource
from flask import g, request

import peewee

class UserResource(BaseResource):
    exclude = ('password',)

    def get_urls(self):
        return (
            ('/list', self.require_method(self.list, ['GET'])),
            ('/add', self.require_method(self.add, ['POST'])),
            # ('/<pk>/', self.require_method(self.api_detail, ['GET', 'POST', 'PUT', 'DELETE'])),
            # ('/<pk>/delete/', self.require_method(self.post_delete, ['POST', 'DELETE'])),
        )

    def list(self):
        return self.api_list()

    def add(self):
        try:
            data = self.read_request_data()
        except:
            return self.response_bad_request()

        obj, models = self.deserialize_object(data, self.model())
        obj.set_password(data['password'])
        obj.email = obj.username
        obj.active = True
        obj.addedBy = g.user

        self.save_related_objects(obj, data)

        try:
            obj.save()
        except peewee.IntegrityError:
            return self.operationresponse('User Exists', False)

        return self.operationresponse(self.serialize_object(obj), True)


api.register(User, UserResource)