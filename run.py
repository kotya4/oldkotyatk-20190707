#!/usr/bin/python3
from tornado.web import Application, StaticFileHandler
from tornado.ioloop import IOLoop, PeriodicCallback
import time, os
import zaripova
import matrices
import tetra
import index

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
    app = Application([
        (r'/', index.Handler),
        (r'/zaripova', zaripova.Handler),
        (r'/tetra', tetra.Handler),
        (r'/matrices', matrices.Handler),
        (r'/(.*)', StaticFileHandler, {'path': '_templates'}),
    ],
        autoreload=True,
        debug=True
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