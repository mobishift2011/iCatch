#-*- encoding: utf-8 -*-
from . import app
from auth import auth
from flask import render_template

@app.route('/')
@app.route('/overview/')
@auth.login_required
def index():
    return render_template('overview.html')


@app.route('/notification/center/')
@auth.login_required
def notification_center():
    return render_template('notification-center.html')


@app.route('/threats/')
@auth.login_required
def threats():
    return render_template('threats.html')


@app.route('/investigates/')
@auth.login_required
def analytics():
    return render_template('investigates.html')


@app.route('/computers/')
@auth.login_required
def machines():
    return render_template('computers.html')


@app.route('/settings/')
@auth.login_required
def settings():
    return render_template('settings.html')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html')


@app.route('/computer/detail/')
@auth.login_required
def computer_detail():
    return render_template('computer-detail.html')