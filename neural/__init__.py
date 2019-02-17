#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'neural' """
	def get(self):
		path = '../_templates/www_neural/index.html'
		self.render(path)

