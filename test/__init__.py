#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for /test.html """
	def get(self):
		path = '../_templates/test_www/index.html'
		self.render(path)

