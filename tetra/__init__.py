#!/usr/bin/python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
    """ Handles tetra.html """
    def get(self):
        path = '../_templates/www_tetra/index.html'
        self.render(path)