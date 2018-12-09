#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'wav' """
	def get(self):
		path = '../_templates/wav_www/index.html'
		self.render(path)

