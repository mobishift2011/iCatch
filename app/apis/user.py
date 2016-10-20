#-*- encoding: utf-8 -*-
from app.apis import api, utils
from app.models import db, User, LoginLog
from base import BaseResource
from flask import g, request

import peewee

class UserResource(BaseResource):
    exclude = ('password',)

    def get_urls(self):
        return (
            ('/list', self.require_method(self.list, ['GET'])),
            ('/add', self.require_method(self.add, ['POST'])),
            ('/delete', self.require_method(self.delete, ['POST'])),
            ('/loginlog', self.require_method(self.loginlog, ['GET'])),
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
        raw_pwd = data['password']
        obj.set_password(raw_pwd)
        obj.email = obj.username
        obj.active = True
        obj.addedBy = g.user

        if not obj.addedBy.admin:
            return self.operationresponse('普通用户没有权限, 请联系管理员', False)

        if not utils.checkPassword(raw_pwd):
            return self.operationresponse('密码不符合要求', False)

        self.save_related_objects(obj, data)

        try:
            obj.save()
        except peewee.IntegrityError:
            return self.operationresponse('用户已存在', False)

        return self.operationresponse(self.serialize_object(obj), True)

    def delete(self):
        try:
            data = self.read_request_data()
        except:
            return self.response_bad_request()

        ids = data['ids'].split(',')
        if not g.user.admin:
            return self.operationresponse('普通用户没有权限, 请联系管理员', False)

        with db.database.transaction():
            User.update(active = False).where(User.id << ids).execute()

        return self.operationresponse(status = True)

    def loginlog(self):
        if not getattr(self, 'check_%s' % request.method.lower())():
            return self.response_forbidden()

        query = LoginLog.select()

        ordering = request.args.get('ordering') or '-id'
        if ordering:
            desc, column = ordering.startswith('-'), ordering.lstrip('-')
            if column in LoginLog._meta.fields:
                field = LoginLog._meta.fields[column]
                query = query.order_by(field.asc() if not desc else field.desc())

        # process any filters
        query = self.process_query(query)

        if self.paginate_by or 'limit' in request.args:
            return self.paginated_object_list(query)

        return self.response(self.serialize_query(query))

api.register(User, UserResource)