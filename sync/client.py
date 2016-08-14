#-*- encoding: utf-8 -*-
from app import app
import socket
import ssl
import pprint

def get_ssl_sock():
    DATAENGINE = app.config['DATAENGINE']
    SSL_KEY = DATAENGINE['ssl_key']
    SSL_CERT = DATAENGINE['ssl_cert']

    host = DATAENGINE['host']
    port = DATAENGINE['port']
    address = (host, port)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    ssl_sock = ssl.wrap_socket(sock, ca_certs=SSL_CERT, cert_reqs=ssl.CERT_REQUIRED)
    sock.connect(address)

    return ssl_sock


def run():
    while True:
    ssl_sock = get_ssl_sock()
    # pprint.pprint(ssl_sock.getpeercert())
    ssl_sock.send(cmd)
    ssl_sock.close()


if __name__ == '__main__':
    #test:60.205.110.134:9999
    run()