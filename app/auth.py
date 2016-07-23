#-*- encoding: utf-8 -*-
from . import app, db, redis_client
from common.log import log_login
from flask import flash, g, request, redirect, render_template, url_for
from flask_peewee.auth import Auth
from models import User, LoginLog

import datetime

class HTAuth(Auth):
    MAX_LOGIN_ERROR = 10
    RETRY_INTERVAL = 60 * 60
    LOCK_INTERVAL = 60 * 60 * 24
    failure_key_format = u'login_failure_{}'

    def validate_lock(self):
        time_format = '%Y-%m-%d %H:%M:%S'
        failure_times = redis_client.lrange(self.failure_key, -self.MAX_LOGIN_ERROR, -1)

        if not failure_times:
            return False, ''

        last_time = datetime.datetime.strptime(failure_times[-1], time_format)
        now = datetime.datetime.now()

        if len(failure_times) < self.MAX_LOGIN_ERROR:
            recover_time = last_time + datetime.timedelta(seconds=self.RETRY_INTERVAL)
            message = u'您还有 %s 次机会重试' % (self.MAX_LOGIN_ERROR - len(failure_times))

            if now > recover_time:
                message = ''
                redis_client.delete(self.failure_key)

            return False, message
        else:
            unlock_time = last_time + datetime.timedelta(seconds=self.LOCK_INTERVAL)
            lock_message = u'对不起, 您的账号已被锁, 请于 %s 重试' % unlock_time

            if now < unlock_time:
                return True, lock_message
            else:
                redis_client.delete(self.failure_key)
                return False, ''

    def log_success(self, request, username):
        redis_client.delete(self.failure_key)
        log_login(request, username, True)

    def log_failure(self, request, username):
        redis_client.ltrim(self.failure_key, 1-self.MAX_LOGIN_ERROR, -1)
        redis_client.rpush(self.failure_key, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        log_login(request, username, False)

    def login(self):
        error = None
        Form = self.get_login_form()

        if request.method == 'POST':
            form = Form(request.form)
            next_url = request.form.get('next') or self.default_next_url
            if form.validate():
                self.failure_key = self.failure_key_format.format(form.username.data)
                is_lock, lock_message = self.validate_lock()

                if is_lock:
                    flash(lock_message)
                else:
                    authenticated_user = self.authenticate(
                        form.username.data,
                        form.password.data,
                    )

                    if authenticated_user:
                        self.login_user(authenticated_user)
                        self.log_success(request, form.username.data)
                        return redirect(next_url)
                    else:
                        self.log_failure(request, form.username.data)
                        is_lock, lock_message = self.validate_lock()
                        flash(u'用户名或密码不正确<br>%s' % lock_message)
        else:
            form = Form()
            next_url = request.args.get('next')

        return render_template(
            'auth/login.html',
            error=error,
            form=form,
            login_url=url_for('%s.login' % self.blueprint.name),
            next=next_url)

auth = HTAuth(app, db, user_model=User, prefix='')