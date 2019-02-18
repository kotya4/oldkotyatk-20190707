#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'automat' """
	def get(self):
		path = '../_templates/www_automat/index.html'
		self.render(path)

