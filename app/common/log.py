# -*- encoding: utf-8 -*-
from app import app
from app.models import ErrorLog, LoginLog
from flask import request, g
import collections
import datetime
import json
import logging

logger = logging.getLogger('gllue.peewee')
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())

class WebPeeweeHandler(logging.Handler):
    def emit(self, record):
        from app.common import utils
        context = {}
        exc_text = utils.format_exc_plus(limit=1)
        try:
            email = g.user.email
            context = collections.OrderedDict()
            context['url'] = request.url
            context['user'] = email
            context['remote_addr'] = request.remote_addr
            if hasattr(g, 'extra'):
                context['extra'] = g.extra
            context['form'] = request.form
        except:
            pass
        self.format(record)
        module, line, function = app.logger.findCaller()
        kwargs = {
            'appname': record.name,
            'level': record.levelname,
            'message': getattr(record, 'message', None),
            'exc_text': exc_text,
            'context': json.dumps(context, indent=2),
            'function': function,
            'module': module,
            'sync': False,
            'dateAdded': datetime.datetime.now()
        }

        try:
            errorlog_id = ErrorLog.insert(**kwargs).execute()
            g.errorlog = errorlog_id
        except:
            print context
            print record.exc_text

db_handler = WebPeeweeHandler()
db_handler.setLevel(logging.DEBUG)
app.logger.addHandler(db_handler)

def log_login(request, email, valid):
    data = '{}\n{}\n'.format(request.headers, request.form)
    LoginLog.insert(user=g.user, email=email, ip=request.remote_addr, ua=request.headers.get('User-Agent'), data=data,
                    success=valid, dateAdded=datetime.datetime.now()).execute()