#-*- encoding: utf-8 -*-
from . import app, db
from flask_peewee.auth import Auth
from models import User

class AdminAuth(Auth):
    def get_user_model(self):
        return User

auth = AdminAuth(app, db, prefix='')