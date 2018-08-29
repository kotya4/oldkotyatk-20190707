#!/usr/bin/env python
 
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

from aiogram import Bot, types
from aiogram.dispatcher import Dispatcher
from aiogram.utils import executor

# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    # GET
    def do_GET(self):
        # Send response status code
        self.send_response(200)
        # Send headers
        self.send_header('Content-type','text/html')
        self.end_headers()
        # Send message back to client
        message = "Hello world!"
        # Write content as utf-8 data
        self.wfile.write(bytes(message, "utf8"))
        return


def main():
    """
    bot = Bot(token='646357441:AAGOwonTs3T9fZfN8KxCE22FMxtA-bWYhPI')
    dp = Dispatcher(bot)
    @dp.message_handler(commands=['start', 'help'])
    async def send_welcome(message: types.Message):
        await message.reply("Hi!\nI'm EchoBot!\nPowered by aiogram.")
    executor.start_polling(dp)
    """
    port = int(os.environ.get("PORT", 8081))
    server_address = ('', port)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('RUNNING SERVER ON PORT', port)
    httpd.serve_forever()
    print('hello')
 

if '__main__' == __name__:
    main()