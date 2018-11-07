#!/usr/bin/python3
from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.ioloop import IOLoop, PeriodicCallback
import time, sys, os
import zaripova


zaripova.init()


class Tetracube(RequestHandler):
    """ Handles tetra.html """
    
    def get(self):
        self.render('templates/tetra.html')


class ZaripovaHandler(RequestHandler):
    """ Handles zaripova.html """
    
    def get(self):
        text = { 'header': '', 'body': '' }
        page = self.get_argument('page', None)
        try:
            page = int(page)
            text = zaripova.gen(page + 4)
        except (ValueError, TypeError) as e:
            page = 'intro'
        self.render('templates/zaripova.html', header=text['header'], body=text['body'], page=page)


class IndexHandler(RequestHandler):
    """ Handles index.html """
    
    def get(self):
        self.render('templates/index.html')


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
    #print('A')
    #tbot.run()
    pass


def main():
    # starts the server
    port = int(os.environ.get('PORT', 5000))
    print('Server runs on port %s' % port)
    app = Application([
        (r'/', IndexHandler),
        (r'/zaripova', ZaripovaHandler),
        (r'/tetra', Tetracube),
        (r'/(.*)', StaticFileHandler, {'path': 'templates'}),
    ],
        autoreload=True
    )
    app.listen(port)
    # starts periodic callack with 1000ms delay
    callback = PeriodicCallback(periodic_func, 1000)
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