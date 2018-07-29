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
PORT = 5000

class IndexHandler(RequestHandler):
    def get(self):
        #f = open(HTTP_PATH + '/index.html', mode='rb')
        #self.write(f.read())
        #f.close()
        self.render(HTTP_PATH + '/index.html', PORT=PORT);

    def post(self):
        self.write('Client with ip <%s> sent <%s>' % (self.request.remote_ip, self.request.body))


class WSHandler(WebSocketHandler):
    def open(self, *args):
        self.stream.set_nodelay(True)
        ip = self.request.remote_ip
        user_id = -1
        user_hash = -1
        try:
            user_id = int(self.get_argument('id'))
            user_hash = int(self.get_argument('hash'))
        except:
            pass
        self.write_message('{"id":%s,"hash":%s,"ip":%s}' % 
            (user_id, user_hash, ip), binary=False)
        print('WS OPENED, IP: %s' % ip)

    def on_message(self, message):  
        print('WS GETS MESSAGE <%s>' % message)
        

    def on_close(self):
        print('WS CLOSED')



def main():
    global PORT
    PORT = int(os.environ.get("PORT", PORT))
    
    print('Server runs on port %s' % PORT)

    app = Application([
        (r'/ws', WSHandler),
        (r'/', IndexHandler),
        (r'/(.*)', StaticFileHandler, {"path": HTTP_PATH}),
    ],
        autoreload=True
    )

    app.listen(PORT)
    
    try:
        IOLoop.instance().start()  
    except KeyboardInterrupt:
        pass

    IOLoop.instance().stop()
    
    print('Server shutted down')

    time.sleep(1)

if '__main__' == __name__:
    main()