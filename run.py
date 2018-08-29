#!/usr/bin/env python
 
from http.server import BaseHTTPRequestHandler, HTTPServer
import os


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
    port = int(os.environ.get("PORT", 8081))
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('RUNNING SERVER ON PORT', port)
    httpd.serve_forever()
    print('hello')
 

if '__main__' == __name__:
    main()