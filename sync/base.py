#-*- encoding: utf-8 -*-
import struct

class CmdProcessor(object):
    def __init__(self, data, type_byte=1, length_byte=4):
        self.message = data
        self.type = data[0: type_byte]
        self.length = data[type_byte: type_byte+length_byte]
        self.command = data[type_byte+length_byte:]


    def process(self):
        return 'test process'
        if(self.type == 0x00):
            return sensor_login(self.command)


def sensor_login(command):
    pass