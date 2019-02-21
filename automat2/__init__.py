#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'automat2' """
	def get(self):
		path = '../_templates/www_automat2/index.html'
		self.render(path)

