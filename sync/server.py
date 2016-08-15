#-*- encoding: utf-8 -*-
from app import app
from sync.base import *
from SocketServer import StreamRequestHandler, ThreadingTCPServer
import pprint
import socket
import ssl


class SyncRequestHandler(StreamRequestHandler):
    def _handler(self):
        print 'Connected from ', self.client_address
        request = self.rfile.read()
        pprint.pprint(request)
        response = request#CmdProcessor(request).process()
        self.wfile.write(response)

    def handle(self):
        try:
            self._handler()
        except Exception, e:
            app.logger.error('sync error')


def serve():
    HOST = ''
    PORT = 9092
    server = ThreadingTCPServer((HOST, PORT), SyncRequestHandler)
    server.serve_forever()


def test():
    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
    context.load_cert_chain(
        certfile=os.path.expanduser('~/Desktop/server/server-cert.pem'),
        keyfile=os.path.expanduser('~/Desktop/server/server-key.pem')
    )

    sock = socket.socket()
    sock.bind(('127.0.0.1', 9999))
    sock.listen(5)

    def do_test(conn):
        conn.sendall('server send test')
        print 'send data ...'
        data = conn.recv(1024)
        print 'receive data:', data

    while True:
        c_sock, from_addr = sock.accept()
        print 'accepted...'
        conn = context.wrap_socket(c_sock, server_side=True)
        do_test(conn)


if __name__ == '__main__':
    #serve()
    test()
