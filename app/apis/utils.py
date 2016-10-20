# -*- encoding: utf-8 -*-
from app import app
from app.models import *
from flask_mail import Mail
import json
import re

class Config():
    def get(self, title, default_value=None, value_type=None):
        try:
            config = ConfigValue.get(title=title)
        except:
            return default_value

        value = config.value

        if value_type == dict:
            value = json.loads(value)

        return value


config = Config()


def get_mail(default_config=None):
    email_config = default_config or config.get('email', default_value={}, value_type=dict)
    app.config.update({
        'MAIL_SERVER': email_config['smtp_server'],
        'MAIL_PORT': int(email_config['smtp_port']),
        'MAIL_USE_SSL': bool(int(email_config['smtp_ssl'])),
        'MAIL_USERNAME': email_config['email_address'],
        'MAIL_PASSWORD': email_config['email_password'],
        'MAIL_DEFAULT_SENDER': email_config['email_address'],
    })

    mail = Mail()
    mail.init_app(app)

    return mail


def test_mail(emails=[], mail=None):
    if not mail:
        mail = get_mail()

    if isinstance(emails, basestring):
        emails = [emails]

    with mail.record_messages() as outbox:
        subject = 'Testing'
        body = 'This is a test.'

        mail.send_message(
                subject=subject,
                body=body,
                recipients=emails
        )

        assert len(outbox) == 1
        assert outbox[0].subject == subject


def checklen(pwd):
    return len(pwd)>=8

def checkContainUpper(pwd):
    pattern = re.compile('[A-Z]+')
    match = pattern.findall(pwd)

    if match:
        return True
    else:
        return False

def checkContainNum(pwd):
    pattern = re.compile('[0-9]+')
    match = pattern.findall(pwd)
    if match:
        return True
    else:
        return False

def checkContainLower(pwd):
    pattern = re.compile('[a-z]+')
    match = pattern.findall(pwd)

    if match:
        return True
    else:
       return False

def checkSymbol(pwd):
    pattern = re.compile('([^a-z0-9A-Z])+')
    match = pattern.findall(pwd)

    if match:
        return True
    else:
        return False

def checkPassword(pwd):

    #判断密码长度是否合法
    lenOK=checklen(pwd)

    #判断是否包含大写字母
    upperOK=checkContainUpper(pwd)

    #判断是否包含小写字母
    lowerOK=checkContainLower(pwd)

    #判断是否包含数字
    numOK=checkContainNum(pwd)

    #判断是否包含符号
    symbolOK=checkSymbol(pwd)

    print(lenOK)
    print(upperOK)
    print(lowerOK)
    print(numOK)
    print(symbolOK)
    return (lenOK and upperOK and lowerOK and numOK and symbolOK)