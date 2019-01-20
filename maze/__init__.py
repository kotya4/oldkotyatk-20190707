#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'maze' """
	def get(self):
		path = '../_templates/www_maze/index.html'
		self.render(path)

