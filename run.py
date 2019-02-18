#!/usr/bin/env python3
from tornado.web import Application, StaticFileHandler, RequestHandler
from tornado.ioloop import IOLoop, PeriodicCallback
import time, os, datetime
import emojies


""" Some handlers includes """


import zaripova
import tetra
import matrices
import cats_falling
import wav
import perlin_surface
import polar
import maze
import walls
import valentine
import neural
import automat


""" Some functions """


# executes every second
def periodic_func():
    pass


# loads README.md from handler
def load_readme_from(handler):
    try:
        with open(handler[0][1:] + '/README.md', 'r') as f:
            raw = f.read()
            s = raw.find('#')           # start
            m = raw.find('\n', 1 + s)   # middle
            e = raw.find('#', m)        # end
            content = raw[m:e].replace('\n', ' ')
    except EnvironmentError:
        content = ' ' + emojies.get_one()
    return content


# gets discriptions for all handlers
def collect_information_about(handlers):
    projects = []
    for handler in handlers:
        path = handler[0]
        disc = load_readme_from(handler)
        projects.append({ 'path': path, 'disc': disc })
    return projects


""" Some constants """


UPTIME_STR = 'Feb 2019' #datetime.datetime.now().strftime('%b %Y')

HANDLERS = [
    (r'/automat', automat.Handler),
    (r'/neural', neural.Handler),
    (r'/walls', walls.Handler),
    (r'/perlin_surface', perlin_surface.Handler),
    (r'/maze', maze.Handler),
    (r'/polar', polar.Handler),
    (r'/wav', wav.Handler),
    (r'/zaripova', zaripova.Handler),
    (r'/valentine', valentine.Handler),
    (r'/tetra', tetra.Handler),
    (r'/matrices', matrices.Handler),
    (r'/cats_falling', cats_falling.Handler),
]

PROJECTS = collect_information_about(HANDLERS)


""" Some IndexHandlers """


class IndexHandler(RequestHandler):
    """ Draws index.html template """
    def get(self):
        self.render('_templates/index/index.html', projects=PROJECTS, uptime=UPTIME_STR)


""" Some newrelic activators """


# activates newrelic if exists
try:
    import newrelic.agent, tornado.gen
    @tornado.gen.coroutine
    @newrelic.agent.function_trace()
    def my_coroutine():
        yield tornado.gen.sleep(0)
except ImportError:
    pass


""" Some mains """


if '__main__' == __name__:

    # starts the server
    port = int(os.environ.get('PORT', 5000))
    print('Server runs on port %s' % port)
    app = Application(HANDLERS + [
        (r'/', IndexHandler),
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
