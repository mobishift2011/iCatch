#-*- encoding: utf-8 -*-
from app import app
from sync.base import *
from SocketServer import StreamRequestHandler, ThreadingTCPServer


class SyncRequestHandler(StreamRequestHandler):
    def _handler(self):
        print 'Connected from %s', self.client_address
        request = self.rfile.read()
        response = CmdProcessor(request).process()
        self.wfile.write(response)

    def handle(self):
        try:
            self._handler()
        except Exception, e:
            app.logger.error('sync error, server')


def serve():
    HOST = ''
    PORT = 9092
    server = ThreadingTCPServer((HOST, PORT), SyncRequestHandler)
    server.serve_forever()


if __name__ == '__main__':
    serve()