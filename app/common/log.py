# -*- encoding: utf-8 -*-
from app.models import LoginLog
from flask import g
import datetime

def log_login(request, email, valid):
    data = '{}\n{}\n'.format(request.headers, request.form)
    LoginLog.insert(user=g.user, email=email, ip=request.remote_addr, ua=request.headers.get('User-Agent'), data=data,
                    success=valid, dateAdded=datetime.datetime.now()).execute()
