#-*- encoding: utf-8 -*-
from app import *
from app.auth import auth
from app.models import *
from flask_script import Manager
from hashlib import md5
from livereload import Server

import datetime
import random
import subprocess
import time
import traceback
import uuid
import os, os.path as op
current_path = op.abspath(op.dirname(__file__))
os.environ.setdefault('PYTHONPATH', '{};{}'.format(current_path, op.join(current_path, 'app')))

manager = Manager(app)

@manager.command
def runserver():
    port = 9091 if app.debug else 9091
    app.run(port=port)
    return
    server = Server(app.wsgi_app)
    server.serve(port=port)


@manager.command
def init():
    if not app.debug:
        return

    init_db()
    init_admin()
    prepare_test_data()


def _change_db(name):
    db.database.database = name
    db.database.connect()

@manager.command
def init_db():
    db_name = app.config['DATABASE']['name']
    _change_db('mysql')
    db.database.execute_sql('CREATE SCHEMA `{}` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;'.format(db_name))
    _change_db(db_name)
    try:
    	db.database.create_tables(db.Model.__subclasses__(), safe=True)
    except:
        import traceback;traceback.print_exc()


@manager.command
def drop_db():
    sql = 'drop database `%s`' % app.config['DATABASE']['name']
    db.database.execute_sql(sql)


def _exec_sql_file(filename, force=False, config={}):
    dbconfig = config or app.config.get('DATABASE')
    dbconfig['name'] = dbconfig.get('name') or dbconfig.get('db')
    sql = 'mysql -h{host} -u{user} -p{passwd} --default-character-set=utf8 {name} < {filename}'
    cmd = sql.format(filename=filename, **dbconfig)
    if force:
        cmd = cmd.replace('mysql -h', 'mysql -f -h')

    subprocess.check_output(cmd, stderr=subprocess.STDOUT, shell=True)


@manager.command
def init_sqls():
    fp = op.join(current_path, 'scripts/sqls')
    for f in os.listdir(fp):
        _exec_sql_file(op.join(fp, f))


def _init_admin():
    admin = app.config.get('admin', {})
    username = admin.get('username', 'admin')
    email = admin.get('email', 'admin@admin')
    admin = auth.User(username=username, email=email, admin=True, active=True)
    admin.set_password(app.config.get('password', 'sxKxlsa@!FC8ca7X'))
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

    _profile_test_data()
    _computer_test_data()
    _alarm_test_data()

def _profile_test_data():
    for i in xrange(16):
        Profile.create(
            title = 'Profile{}'.format(i),
            description = 'Profile Desc {}'.format(i),
            addedBy_id=1
        )
@manager.command
def _computer_test_data():
    oses = ['windows 7', 'windows 10', 'linux', 'ubuntu', 'Mac OS']
    statuses = ['on', 'off', 'resume', 'pause', 'uninstall']
    ips = ['192.168.20.1', '192.168.20.2', '192.168.20.3', '192.168.20.4']
    days = [1, 2, 3, 4, 5, 6, 7, 8]
    now = datetime.datetime.utcnow()
    versions = ['1.0', '2.0', '2.2', '3.0', '4.0', '5.0', '5.1', '6.0']

    try:
        profile = random.choice(Profile.select())
    except:
        profile = None

    print 'init computers ...'
    for i in xrange(108):
        Computer.create(
            sensorID = str(uuid.uuid4()),
            sensorVersion = random.choice(versions),
            os = random.choice(oses),
            status = random.choice(statuses),
            ip = random.choice(ips),
            last_communicated_timestamp = time.mktime(now.timetuple()),
            start_timestamp = time.mktime((now - datetime.timedelta(days=random.choice(days))).timetuple()),
            profile = profile,
            name = 'computer' + str(i),
            is_quarantine = random.choice([True, False])
        )

@manager.command
def _alarm_test_data():
    now = datetime.datetime.utcnow()
    coms = Computer.select()

    print 'init alarms ...'
    for i in xrange(2048):
        com = random.choice(coms)
        type = random.choice([AlarmType.file, AlarmType.action])
        path = os.path.abspath(os.path.dirname(__file__)+str(random.randint(0, 20))) if type.lower() == 'file' else None
        filemd5 = md5(path).hexdigest() if type.lower() == 'file' else None

        Alarm.create(
            alarmID = str(uuid.uuid4()),
            sensorID = com.sensorID,
            computer_id = com.id,
            point = random.randint(0, 100),
            type = type,
            status = random.choice(filter(lambda x: not x.startswith('__'), dir(AlarmStatus))),
            path = path,
            md5 = filemd5,
            has_solutions = random.choice([True, False]),
            timestamp = time.mktime((now - datetime.timedelta(
                days=random.randint(0, 100),
                hours=random.randint(0, 24),
                minutes=random.randint(0, 60),
            )).timetuple())
        )

    alarms = Alarm.select()

    print 'init alarm exceptions ...'
    for i in xrange(65535):
        alarm = random.choice(alarms)
        code = random.randint(-1, 10)
        point = random.randint(0, 100)

        ExceptionItem.create(
            alarm = alarm.id,
            code = code,
            point = point,
            description = 'This is exception, code:{}, point:{}'.format(code, point),
            timestamp = alarm.timestamp
        )

    print 'init event objs ...'
    for i in xrange(1024):
        type = random.choice(['file', 'process'])
        if type == 'file':
            content = {
                'IsPE':	random.randint(0, 1),
                'FilePath':	op.abspath(op.dirname(__file__)),
                'MD5': md5(op.abspath(op.dirname(__file__))).hexdigest(),
                'SHA256': '',
            }
        else:
            content = {
                'ProcessName': 'process{}'.format(random.randint(0,65565)),
                'ImagePath': '',
                'CommandLine': random.choice(['python', 'ls', 'cp', 'mv', 'node', 'cd', 'mkdir']),
                'ParentName': 'parent name',
                'Signer': str(uuid.uuid4()),
                'PID': random.randint(0,65565),
                'ParentPID': random.randint(0,65565)
            }

        try:
            EventObject.create(
                type = type,
                content = json.dumps(content)
            )
        except:
            traceback.print_exc()
            from pprint import pprint;import ipdb;ipdb.set_trace();
            pass

    eventOjbs = EventObject.select()

    print 'init event list ...'
    for i in xrange(65536):
        alarm = random.choice(alarms)
        event_id = str(uuid.uuid4())
        sourceObj = random.choice(eventOjbs)
        targetObj = None

        while True:
            eventObj = random.choice(eventOjbs)
            if eventObj is not sourceObj:
                targetObj = eventObj
                break

        Event.create(
            alarm = alarm,
            eventID = event_id,
            sid = str(uuid.uuid4()),
            description = 'This is test event: {}'.format(event_id),
            timestamp = alarm.timestamp - random.randint(0, 3600 * 24 * 3),
            point = random.randint(0, 100),
            action = random.choice(['copy', 'paste', 'process', 'spawn']),
            sourceObj = random.choice(eventOjbs),
            targetObj = targetObj
        )


if __name__ == '__main__':
    manager.run()
