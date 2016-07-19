import os
import sys
import subprocess
import uuid
import random
import string

debug = False

#todo: add crontab
#todo: config backup service
#todo: config nginx application/javascript gzip
#todo: basic info from db instead of configfile

#todo: http://askubuntu.com/questions/39922/how-do-you-select-the-fastest-mirror-from-the-command-line

def _call(cmd):
    if debug:
        print cmd
    else:
        subprocess.call(cmd, shell=True)


def setup():
    p = os.path.expanduser('~/config')
    if os.path.exists(p):
        return open(p).read().strip()
    result = raw_input('host:')
    _call("echo {} > ~/config".format(result))
    return result


def passwdgen():
    p = os.path.expanduser('~/password')
    if os.path.exists(p):
        return open(p).read().strip()
    size = 16
    chars = string.digits + string.ascii_letters
    result = ''.join(random.choice(chars) for x in range(size))
    _call("echo {} > ~/password".format(result))
    return result


def clientkeygen():
    p = os.path.expanduser('~/clientkey')
    if os.path.exists(p):
        return open(p).read().strip()
    result = uuid.uuid4()
    _call("echo {} > ~/clientkey".format(result))
    return result


def get_content(path):
    with open(path) as f:
        return f.read()


password = passwdgen()
clientkey = '{clientkey}'
host = '{host}'
prefix = host.replace('_', '')
local = False
print password
print clientkey
print host

def sshd():
    _call('sed -i_ "s/^Port 22$/Port 9089/g" /etc/ssh/sshd_config')

def basic():
    _call('apt-get update')
    _call('apt-get -y upgrade')
    _call('apt-get install -y zsh unzip openjdk-7-jdk python-pip nginx-full libevent-dev redis-server sysstat ntp unoconv libreoffice curl rdiff iotop iftop wget')
    _call('pip install supervisor decorator')
    subprocess.call(["/bin/bash", "-c", "debconf-set-selections <<< 'mysql-server mysql-server/root_password password {}' && "
          "debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password {}' && "
          "apt-get -y install mysql-server-5.6".format(password, password)])
    _call('update-java-alternatives -s java-1.7.0-openjdk-amd64')

def swap():
    import re
    content = get_content('/etc/fstab')
    if re.search(r'swap +swap', content):
        print 'swap already'
    else:
        _call('dd if=/dev/zero of=/var/swapfile bs=1024 count=2621440')
        _call('/sbin/mkswap /var/swapfile')
        _call('/sbin/swapon /var/swapfile')
        _call('/sbin/swapon -s')
        _call('echo "/var/swapfile swap swap defaults 0 0" >>/etc/fstab')

#create user & group
def adduser():
    _call('addgroup htadmin')
    _call('sudo adduser --home=/opt --shell=/bin/zsh --disabled-password --gecos "" --no-create-home --ingroup=htadmin htadmin')
    _call('echo htadmin:{} | chpasswd'.format(password))

#config data disk /opt
def disk():

    content = get_content('/etc/fstab')
    if '/dev/xvdb1' in content:
        return

    _call('mkdir /opt')
    _call('''fdisk /dev/xvdb << EOF
n
p
1


wq
EOF

mkfs.ext4 /dev/xvdb1''')
    #_call('fdisk /dev/xvdb')
    #_call('mkfs.ext4 /dev/xvdb1'):
    _call("echo '/dev/xvdb1  /opt ext4    barrier=0    0  0' >> /etc/fstab")
    _call('mount -a')

#mkdir
def dir():
    _call('chown htadmin:htadmin /opt')
    dirs = '''
/opt/mysql
/opt/log
/opt/log/htadmin
/opt/log/upload
/opt/log/cron
'''
    for item in dirs.splitlines():
        if item == '':
            continue
        _call("mkdir -p {}".format(item))
    _call('cd /opt && ls -d * | grep -v mysql | xargs -d "\n" chown -R htadmin:htadmin')

#todo: check redis, nginx etc.
def update_init_d():
    _call('wget https://gist.githubusercontent.com/zffl/5298022/raw/88d0d68c4af22a7474ad1d011659ea2d27e35b8d/supervisord.sh -O /etc/init.d/supervisord')
    _call('chmod +x /etc/init.d/supervisord')
    _call('update-rc.d supervisord defaults')
    _call('update-rc.d supervisord enable')

#create supervisord.conf
supervisor_template = '''
[unix_http_server]
file=/tmp/supervisor.sock

[inet_http_server]
port=127.0.0.1:9001
username=htadmin
password=htadmin

[supervisord]
user=htadmin
logfile=/tmp/supervisord.log
logfile_maxbytes=50MB
logfile_backups=10
loglevel=info
pidfile=/tmp/supervisord.pid
nodaemon=false
minfds=1024
minprocs=200

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///tmp/supervisor.sock
serverurl=http://127.0.0.1:9001
username=htadmin
password=htadmin
prompt=mysupervisor
history_file=~/.sc_history

[program:htadmin]
environment=HOME=/opt,USER=htadmin
command=/opt/web/htadmin web_
nodaemon=true
autorestart=true
stopsignal=QUIT
stdout_logfile=/opt/log/htadmin/info.log
stderr_logfile=/opt/log/htadmin/error.log

[include]
files = /etc/supervisord/*.conf
'''

def supervisor():
    _write_file('/etc/supervisord.conf', supervisor_template.format(user='htadmin', home='/opt'))

def _write_file(file, content):
    #_call('cat > {} <<DELIM{}'.format(file, content))
    with open(file, 'w') as f:
        f.write(content)

#fix this
mysql_template = '''
[client]
port        = 3306
socket      = /var/run/mysqld/mysqld.sock
default-character-set=utf8

[mysqld_safe]
socket      = /var/run/mysqld/mysqld.sock
nice        = 0

[mysqld]
sql-mode = 'TRADITIONAL'
user        = mysql
pid-file    = /var/run/mysqld/mysqld.pid
socket      = /var/run/mysqld/mysqld.sock
port        = 3306
basedir     = /usr
datadir     = /opt/mysql
tmpdir      = /tmp
lc-messages-dir = /usr/share/mysql
skip-external-locking
bind-address        = 127.0.0.1
key_buffer      = 16M
max_allowed_packet  = 16M
thread_stack        = 192K
thread_cache_size       = 8
myisam-recover         = BACKUP
query_cache_limit   = 1M
query_cache_size        = 16M
general_log_file        = /var/log/mysql/mysql.log
general_log             = 1
slow-query-log = 1
log_bin         = 1
expire_logs_days    = 10
max_binlog_size         = 100M
character_set_server = utf8

[mysqldump]
quick
quote-names
max_allowed_packet  = 16M

[mysql]
default-character-set=utf8

[isamchk]
key_buffer      = 16M

!includedir /etc/mysql/conf.d/'''

apparmor_template = '''
# vim:syntax=apparmor
# Last Modified: Tue Jun 19 17:37:30 2007
#include <tunables/global>

/usr/sbin/mysqld {
  #include <abstractions/base>
  #include <abstractions/nameservice>
  #include <abstractions/user-tmp>
  #include <abstractions/mysql>
  #include <abstractions/winbind>

  capability dac_override,
  capability sys_resource,
  capability setgid,
  capability setuid,

  network tcp,

  /etc/hosts.allow r,
  /etc/hosts.deny r,

  /etc/mysql/*.pem r,
  /etc/mysql/conf.d/ r,
  /etc/mysql/conf.d/* r,
  /etc/mysql/*.cnf r,
  /usr/lib/mysql/plugin/ r,
  /usr/lib/mysql/plugin/*.so* mr,
  /usr/sbin/mysqld mr,
  /usr/share/mysql/** r,
  /var/log/mysql.log rw,
  /var/log/mysql.err rw,
  /opt/mysql/ r,
  /opt/mysql/** rwk,
  /var/log/mysql/ r,
  /var/log/mysql/* rw,
  /var/run/mysqld/mysqld.pid w,
  /var/run/mysqld/mysqld.sock w,
  /run/mysqld/mysqld.pid w,
  /run/mysqld/mysqld.sock w,

  /sys/devices/system/cpu/ r,

  # Site-specific additions and overrides. See local/README for details.
  #include <local/usr.sbin.mysqld>
}
'''

def mysql():
    _call('service mysql stop')
    #_call("sed -i 's/\/var\/log\/mysql/\/opt\/mysql/g' /etc/mysql/my.cnf")
    #_call("sed -i 's/\/var\/log\/mysql/\/opt\/mysql/g' /etc/apparmor.d/usr.sbin.mysqld")
    _call('cp -r -p /var/lib/mysql /opt/')
    _write_file('/etc/mysql/my.cnf', mysql_template)
    _write_file('/etc/apparmor.d/usr.sbin.mysqld', apparmor_template)
    #_call('chown -R mysql:mysql /opt/mysql')
    _call('service mysql start')

site_template = '''
server {
   gzip on;
   gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

   listen 80 default_server;
   #server_name ;
   location /{
        client_max_body_size 40m;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_redirect off;
        proxy_read_timeout 150;
        if (!-f $request_filename) {
            proxy_pass http://127.0.0.1:9090;
            break;
        }
    }
}
'''
def nginx():
    _write_file('/etc/nginx/sites-enabled/htadmin', site_template)
    _call('rm /etc/nginx/sites-enabled/default')
    _call('service nginx restart')

def webconfig():
    config = '''
{{
    "NAME": "Admin",
    "VERSION": 2.1,
    "DEBUG": false,
    "CLIENTKEY": "{clientkey}",
    "UPLOAD_FOLDER": "/opt/upload",
    "REDIS_URL": "redis://localhost:6379/0",
    "DATABASE": {
        "name": "htAdmin",
        "engine": "peewee.MySQLDatabase",
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "passwd": "{password}",
        "threadlocals": true
    },
    "DATAENGINE": {
        "host": "127.0.0.1",
        "port": 3309
    }
}}'''.format(password=password, clientkey=clientkey)
    #_call('cat > {} <<DELIM{}'.format('/opt/web/config.json', config))
    _write_file('/opt/web/config-ht.json', config)
    _call('chown htadmin:htadmin /opt/web/config-ht.json')
    _write_file('/etc/hostname', host)

def cron():
    _call("crontab -u htadmin /opt/web/cronfile")

def ossconfig():
    template = '''[OSSCredentials]
accessid = {}
accesskey = {}
'''
    accessid = '{oss_accessid}'
    accesskey = '{oss_accesskey}'
    if accessid and accesskey:
        _write_file('/opt/.osscredentials', template.format(accessid, accesskey))
        _call('cp /opt/.osscredentials /root/.osscredentials')
        _call('su -c "cd /opt && /opt/web/osscmd createbucket oss://{}db" htadmin'.format(prefix))
        _call('su -c "cd /opt && /opt/web/osscmd createbucket oss://{}upload" htadmin'.format(prefix))

def tools():
    _call("wget https://gist.githubusercontent.com/zffl/5948349/raw/69cf175a9fa60e8f520a6a490940a47c201e98b3/SimpleHTTPServerWithUpload.py -O /usr/lib/python2.7/SimpleHTTPServerWithUpload.py")

def pipconf():
    _call('mkdir -p /root/.pip')
    template = '''[global]
index-url=http://mirrors.aliyun.com/pypi/simple
'''
    _write_file('/root/.pip/pip.conf', template)


def copy_webfiles():
    #_call("{copy_file}")
    _call('wget http://112.124.219.41/htadminrelease/web_hr.tgz -O web_hr.tgz')
    _call('tar xzvf web_hr.tgz')
    _call('mv web /opt')

    # todo:
    # _call('wget wget http://112.124.219.41/htadminrelease/htadmin_deploy -O htadmin')

    _call('wget http://hub0.htadmin.com:8090/build/{version} -O htadmin')
    _call('mv htadmin /opt/web/htadmin')
    _call('chmod +x /opt/web/htadmin')
    _call('chown -R htadmin:htadmin /opt/web')


def all():
    if not local:
        sshd()
        disk()
        swap()

    pipconf()
    basic()
    adduser()
    dir()
    update_init_d()
    supervisor()
    mysql()
    nginx()
    tools()

def install():
    copy_webfiles()
    webconfig()
    #_call("rsync -z -e 'ssh -p 9998' -av --exclude '*.git' --exclude 'config.json' zffl@app.htadmin.com:/opt/web /opt/")
    _call("/opt/web/htadmin cron init")
    _call("mysql -uroot -p{password} htadmin < ~/client.sql".format(password=password))


def clean():
    _call('rm /root/createenv.py')
    _call('rm /root/web.tgz')

def post():
    cron()
    # if not local:
    #     ossconfig()
    clean()

def auto_install():
    all()
    # install()
    post()

    _call('reboot')


if __name__ == '__main__':
    if len(sys.argv) == 1:
        sys.exit()
    locals()[sys.argv[1]]()