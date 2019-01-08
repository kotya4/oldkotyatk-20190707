#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'polar' """
	def get(self):
		path = '../_templates/www_polar/index.html'
		self.render(path)

