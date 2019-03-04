#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'raycaster' """
	def get(self):
		path = '../_templates/www_raycaster/index.html'
		self.render(path)

