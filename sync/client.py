#-*- encoding: utf-8 -*-
from base import *
import pprint
import time
import traceback


def get_ssl_sock():
    DATAENGINE = app.config['DATAENGINE']
    SSL_KEY = DATAENGINE['ssl_key']
    SSL_CERT = DATAENGINE['ssl_cert']

    if not os.path.exists(SSL_KEY):
        raise Exception('no key')

    if not os.path.exists(SSL_CERT):
        raise Exception('no pem')

    host = DATAENGINE['host']
    port = DATAENGINE['port']
    address = (host, port)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    ssl_sock = ssl.wrap_socket(sock, keyfile=SSL_KEY, certfile=SSL_CERT)
    ssl_sock.connect(address)

    #pprint.pprint(ssl_sock.getpeercert())
    print 'login engine:', login_engine(ssl_sock)

    return ssl_sock


def ssl_connect():
    ssl_sock = get_ssl_sock()
    return ssl_sock


def ssl_close(ssl_sock):
    if ssl_sock:
        ssl_sock.close()
        ssl_sock = None


def login_engine(ssl_sock):
    fmt = '=BI16s'
    data = struct.pack(fmt, 0x56, struct.calcsize(fmt), '')
    return ssl_sock.sendall(data)


def run():
    ssl_sock = None

    while True:
        try:
            if ssl_sock is None:
                ssl_sock = ssl_connect()

            print '================================'
            data = ssl_sock.recv(BUFFER_SIZE)
            pprint.pprint(data)

            if not data:
                ssl_sock = ssl_close(ssl_sock)
                time.sleep(5)
            else:
                response = CmdProcessor(data).process()
                ssl_sock.sendall(response)
        except:
            traceback.print_exc()
            ssl_sock = ssl_close(ssl_sock)
            time.sleep(5)
            print '================================'


if __name__ == '__main__':
    #test:60.205.110.134:9999
    def test():
        filepath = os.path.expanduser('~/Desktop/alert_sample')

        with open(os.path.expanduser(filepath), 'rb') as f:
            data = f.readline()
            response = CmdProcessor(data).process()

    #test()
    run()