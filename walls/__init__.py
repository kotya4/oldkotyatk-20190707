#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'walls' """
	def get(self):
		path = '../_templates/www_walls/index.html'
		self.render(path)

