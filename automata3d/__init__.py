#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'automata3d' """
	def get(self):
		path = '../_templates/www_automata3d/index.html'
		self.render(path)

