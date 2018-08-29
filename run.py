#!/usr/bin/python3
from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.websocket import WebSocketHandler
from tornado.ioloop import IOLoop, PeriodicCallback
from random import randint
import json
import time
import sys
import os
import re
import traceback

HTTP_PATH = 'www'

class IndexHandler(RequestHandler):
    def get(self):
        #self.render(HTTP_PATH + '/index.html');
        f = open(HTTP_PATH + '/index.html', mode='rb')
        self.write(f.read())
        f.close()

    def post(self):
        print('Client with ip <%s> sent <%s>' % (self.request.remote_ip, self.request.body))


def main():
    port = int(os.environ.get("PORT", 5000))
    print('Server runs on port %s' % port)
    app = Application([
        (r'/', IndexHandler),
        (r'/(.*)', StaticFileHandler, {"path": HTTP_PATH}),
    ],
        autoreload=True
    )
    app.listen(port)
    try:
        IOLoop.instance().start()  
    except KeyboardInterrupt:
        pass
    IOLoop.instance().stop()
    print('Server shutted down')
    time.sleep(1)

if '__main__' == __name__:
    main()