#!/usr/bin/python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
    """ Handles tetra.html """
    def get(self):
        path = '../_templates/tetra_www/index.html'
        self.render(path)