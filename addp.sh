#!/bin/bash

file="_templates"

if [ ! -d $file ]; then
    echo "File not found!"
    exit 1
fi

proj_name="hello"

src="#!/usr/bin/env python3
from tornado.web import RequestHandler

class Handler(RequestHandler):
\"\"\" heroku RequestHandler for /${proj_name}.html \"\"\"
\tdef get(self):
\t\tpath = '../_templates/${proj_name}_www/index.html'
\t\tself.render(path)\n"

echo -e "$src"



    
        
        