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
    db.database.create_tables(db.Model.__subclasses__(), safe=True)


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


@manager.command
def prepare_test_data():
    if not app.debug:
        return

    _computer_test_data()

def _computer_test_data():
    from app.models import *
    import datetime
    import random
    import time
    import uuid

    oses = ['windows 7', 'windows 10', 'linux', 'ubuntu', 'Mac OS']
    statuses = ['on', 'off', 'resume', 'pause', 'uninstall']
    ips = ['192.168.20.1', '192.168.20.2', '192.168.20.3', '192.168.20.4']
    days = [1, 2, 3, 4, 5, 6, 7, 8]
    now = datetime.datetime.utcnow()
    profiles = Profile.select()
    versions = ['1.0', '2.0', '2.2', '3.0', '4.0', '5.0', '5.1', '6.0']

    for i in xrange(16108):
        Computer.create(
            sensorID = str(uuid.uuid4()),
            sensorVersion = random.choice(versions),
            os = random.choice(oses),
            status = random.choice(statuses),
            ip = random.choice(ips),
            last_communicated_timestamp = time.mktime(now.timetuple()),
            start_timestamp = time.mktime((now - datetime.timedelta(days=random.choice(days))).timetuple()),
            profile = random.choice(profiles),
            is_quarantine = random.choice([True, False])
        )


if __name__ == '__main__':
    manager.run()