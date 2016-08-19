#-*- encoding: utf-8 -*-
from base import *
import traceback

from gevent import monkey; monkey.patch_all()
from gevent.lock import BoundedSemaphore
import gevent

g_ssl_sock = None
sem = BoundedSemaphore(1)

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
    global g_ssl_sock
    with sem:
        if not g_ssl_sock:
            g_ssl_sock = get_ssl_sock()


def ssl_close():
    global g_ssl_sock
    with sem:
        if g_ssl_sock:
            g_ssl_sock.close()
            g_ssl_sock = None


def login_engine(ssl_sock):
    fmt = '=BI16s'
    data = struct.pack(fmt, 0x56, struct.calcsize(fmt), '')
    return ssl_sock.sendall(data)

def run():
    def from_engine():
        global g_ssl_sock

        while True:
            try:
                print '================from engine:================'
                ssl_connect()
                data = g_ssl_sock.recv(BUFFER_SIZE)

                if not data:
                    ssl_close()
                    gevent.sleep(5)
                else:
                    response = CmdProcessor(data).process()
                    if response is not None:
                        g_ssl_sock.sendall(response)
            except:
                traceback.print_exc()
                ssl_close()
                gevent.sleep(5)
                print '================================'


    def to_engine():
        while True:
            try:
                print '================to engine:================'
                ssl_connect()
                # g_ssl_sock.sendall(test_sensor_cmd())
                gevent.sleep(10)
            except:
                traceback.print_exc()
                ssl_close()
                gevent.sleep(5)
                print '================================'

    gevent.joinall([
        gevent.spawn(from_engine),
        gevent.spawn(to_engine)
    ])


def test_sensor_cmd():
    import binascii, uuid
    computer = Computer.get()
    sensorID = computer.sensorID
    commandID = str(uuid.uuid4())
    sensorID = binascii.unhexlify(sensorID.replace('-',''))
    commandID = binascii.unhexlify(commandID.replace('-', ''))
    cmd = CmdProcessor().sensor_pause(sensorID=sensorID, commandID=commandID)
    #cmd = CmdProcessor().sensor_update(sensorID=sensorID, commandID=commandID)
    return cmd


if __name__ == '__main__':
    #test:60.205.110.134:9999
    def test():
        filepath = os.path.expanduser('~/Desktop/alert_sample')

        with open(os.path.expanduser(filepath), 'rb') as f:
            data = f.readline()
            response = CmdProcessor(data).process()

    run()
    #test()
    #test_sensor_uninstall()