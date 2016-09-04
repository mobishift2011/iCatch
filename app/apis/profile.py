#-*- encoding: utf-8 -*-
from app import db, app
from app.apis import api
from app.models import Profile
from base import BaseResource
from flask import g, request
from os import path as op
import peewee
import uuid

class ProfileResource(BaseResource):
    def get_urls(self):
        url = (
            ('/upload/', self.require_method(self.upload, ['POST'])),
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

    def _upload(self, folder, file):
        filename = u'{}_{}'.format(file.filename, str(uuid.uuid4()))
        path = op.join(folder, filename)
        file.save(path)
        return filename

    def upload(self):
        result = {'status': 0, 'data': None}
        folder = app.config.get('PROFILE_UPLOAD_FOLDER')
        file = request.files['file']

        if not file:
            result['status'] = 1
            result['data'] = u'no file upload'
        elif(not op.exists(folder)):
            result['status'] = 2
            result['data'] = u'upload folder not exists'
        else:
            result['data'] = {'name': file.filename, 'path': self._upload(folder, file)}

        return self.response(result)

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