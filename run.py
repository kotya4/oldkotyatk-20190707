#!/usr/bin/env python3
from tornado.web import Application, StaticFileHandler, RequestHandler
from tornado.ioloop import IOLoop, PeriodicCallback
import time, os, datetime

import zaripova
import tetra
import matrices
import cats_falling
import wav
import perlin_surface
import polar
import maze

HANDLERS = [
    (r'/zaripova', zaripova.Handler),
    (r'/tetra', tetra.Handler),
    (r'/matrices', matrices.Handler),
    (r'/cats-falling', cats_falling.Handler),
    (r'/wav', wav.Handler),
    (r'/perlin_surface', perlin_surface.Handler),
    (r'/polar', polar.Handler),
    (r'/maze', maze.Handler),
]

UPTIME_STR = datetime.datetime.now().strftime('%b %Y')


class IndexHandler(RequestHandler):
    """ Loads information about all handlers """
    def initialize(self, handlers):
        self.projs = []
        for o in handlers:
            path = o[0]
            handler = o[1]
            try:
                disc = handler.get_disc()
            except AttributeError:
                disc = 'ОПИСАНИЕ ОТСУТСТВУЕТ'
            self.projs.append({ 'path': path, 'disc': disc })
    """ Draws index.html template """
    def get(self):
        self.render('_templates/index/index.html', projs=self.projs, uptime=UPTIME_STR)


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
    pass


if '__main__' == __name__:
    # starts the server
    port = int(os.environ.get('PORT', 5000))
    print('Server runs on port %s' % port)
    app = Application(HANDLERS + [
        (r'/', IndexHandler, { 'handlers': HANDLERS }),
        (r'/(.*)', StaticFileHandler, {'path': '_templates'}),
    ], autoreload=True, debug=True)
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

