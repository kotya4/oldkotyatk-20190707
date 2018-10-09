#!/usr/bin/python3
from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.ioloop import IOLoop, PeriodicCallback
import time, sys, os

# constants
HTTP_PATH = os.path.dirname(sys.argv[0]) + '/www'
PDELAY = 1000

# handles index.html from 'www'
class IndexHandler(RequestHandler):
    def get(self):
        f = open(HTTP_PATH + '/index.html', mode='rb')
        self.write(f.read())
        f.close()
    def post(self):
        print('Client with ip <%s> sent <%s>' % (self.request.remote_ip, self.request.body))

# activates newrelic if exists
try:
    import newrelic.agent, tornado.gen
    @tornado.gen.coroutine
    @newrelic.agent.function_trace()
    def my_coroutine():
        yield tornado.gen.sleep(0)
except ImportError:
    pass

# executes every second
def periodic_func():
    print('A')
    #tbot.run()
    pass


def main():
    # starts the server
    port = int(os.environ.get('PORT', 5000))
    print('Server runs on port %s' % port)
    app = Application([
        (r'/', IndexHandler),
        (r'/(.*)', StaticFileHandler, {'path': HTTP_PATH}),
    ],
        autoreload=True
    )
    app.listen(port)
    # starts periodic callack with delay
    callback = PeriodicCallback(periodic_func, PDELAY)
    try:
        callback.start()
        IOLoop.instance().start()  
    except KeyboardInterrupt:
        pass
    # stops server
    IOLoop.instance().stop()
    print('Server shutted down')
    time.sleep(1)


if '__main__' == __name__:
    main()