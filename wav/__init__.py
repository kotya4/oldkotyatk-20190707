#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'wav' """
	def get(self):
		path = '../_templates/www_wav/index.html'
		self.render(path)

