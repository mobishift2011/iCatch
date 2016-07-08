#-*- encoding: utf-8 -*-
from . import app, db
from flask_peewee.auth import Auth
from models import User


auth = Auth(app, db, user_model=User, prefix='')