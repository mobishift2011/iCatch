# -*- encoding: utf-8 -*-
from peewee import BooleanField

def coerce(self, value):
    if value == 'true':
        return True
    elif value == 'false':
        return False
    else:
        try:
            return bool(int(value))
        except:
            return bool(value)

BooleanField.coerce = coerce