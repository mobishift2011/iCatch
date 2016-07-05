from flask_peewee.rest import RestAPI
from app import app

api = RestAPI(app)

import user

api.setup()
