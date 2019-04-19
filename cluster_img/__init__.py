#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
	""" heroku RequestHandler for 'cluster_img' """
	def get(self):
		path = '../_templates/www_cluster_img/index.html'
		self.render(path)

