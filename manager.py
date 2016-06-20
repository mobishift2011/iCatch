#-*- encoding: utf-8 -*-
import os, os.path as op
current_path = op.abspath(op.dirname(__file__))
os.environ.setdefault('PYTHONPATH', '{};{}'.format(current_path, op.join(current_path, 'app')))

from app import *
from app.auth import auth
from flask_script import Manager
from livereload import Server

manager = Manager(app)

@manager.command
def runserver():
    port = 9090
    app.run(port=port)
    return
    server = Server(app.wsgi_app)
    server.serve(port=port)


@manager.command
def init_db():
    # db_name = app.config['DATABASE']['name']
    # db.database.execute('CREATE SCHEMA `{}` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;'.format(db_name))
    auth.User.create_table(fail_silently=True)
    for model in db.Model.__subclasses__():
        model.create_table(fail_silently=True)


def _init_admin():
    admin = app.config.get('admin', {})
    username = admin.get('username', 'admin')
    email = admin.get('email', 'admin@admin')
    admin = auth.User(username=username, email=email, admin=True, active=True)
    admin.set_password(app.config.get('password', 'admin123'))
    admin.save()


@manager.command
def init_admin():
    if not app.debug:
        return

    _init_admin()


if __name__ == '__main__':
    manager.run()