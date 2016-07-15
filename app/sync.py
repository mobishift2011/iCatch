#-*- encoding: utf-8 -*-
from app import app


def main():
    de = app.config['DATAENGINE']
    host = de['host']
    port = de['port']





if __name__ == '__main__':
    main()