from flask_peewee.rest import RestAPI, Authentication
from app import app
from app.auth import auth
from flask_peewee.rest import RestResource as BaseResource

class LoginUserAuthentication(Authentication):
    def authorize(self):
        return auth.get_logged_in_user()

class RestResource(BaseResource):
    def operationresponse(self, data=None, status=True):
        res = {'status': status}
        field = 'data' if status else 'message'
        res[field] = data

        return self.response(res)

api = RestAPI(app, default_auth=LoginUserAuthentication())

import user
import config
import profile

api.setup()
