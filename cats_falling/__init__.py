#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'cats-falling' """
	def get(self):
		path = '../_templates/cats-falling_www/index.html'
		self.render(path)

