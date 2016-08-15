#-*- encoding: utf-8 -*-
from base import *
import pprint
import time


def run():
    ssl_sock = get_ssl_sock()

    while True:
        # pprint.pprint(ssl_sock.getpeercert())
        ssl_sock.send('client send test')
        print '=================='
        data = ssl_sock.recv(1024)
        pprint.pprint(data)

        if not data:
            time.sleep(5)
        else:
            response = CmdProcessor(data).process()
            #ssl_sock.sendall(response)

    ssl_sock.close()


if __name__ == '__main__':
    #test:60.205.110.134:9999
    def test():
        filepath = os.path.expanduser('~/Desktop/alert_sample')

        with open(os.path.expanduser(filepath), 'rb') as f:
            data = f.readline()
            response = CmdProcessor(data).process()

    #test()
    run()