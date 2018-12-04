#!/usr/bin/python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
    """ Handles index.html """
    def get(self):
        self.render('../_templates/index_www/index.html')