#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'DI' """
	def get(self):
		path = '../_templates/www_di/index.html'
		self.render(path)

