#-*- encoding: utf-8 -*-
from app.apis import api
from app.models import User
from flask_peewee.rest import RestResource

class UserResource(RestResource):
    exclude = ('password',)


api.register(User, UserResource)