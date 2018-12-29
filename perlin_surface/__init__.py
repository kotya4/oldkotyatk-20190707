#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'perlin_surface' """
	def get(self):
		path = '../_templates/www_perlin_surface/index.html'
		self.render(path)

