#-*- encoding: utf-8 -*-
from app import db
from app.apis import api
from app.models import Profile
from base import BaseResource
from flask import g, request
import peewee

class ProfileResource(BaseResource):
    def get_urls(self):
        url = (
            ('/delete/', self.require_method(self.batch_delete, ['DELETE'])),
        )

        return url + super(ProfileResource, self).get_urls()

    def create(self):
        try:
            data = self.read_request_data()
        except ValueError:
            return self.response_bad_request()

        data['addedBy'] = g.user
        obj, models = self.deserialize_object(data, self.model())

        self.save_related_objects(obj, data)

        try:
            obj = self.save_object(obj, data)
        except peewee.IntegrityError as e:
            return self.operationresponse('Alreay Exists', status=False)

        return self.operationresponse(self.serialize_object(obj), status=True)

    def batch_delete(self):
        status = False

        try:
            ids = request.args['ids'].split(',')
        except ValueError:
            return self.response_bad_request()

        query = Profile.delete().where(Profile.id << ids)
        status = bool(query.execute())

        return self.operationresponse(status=status)




api.register(Profile, ProfileResource)