#!/usr/bin/env python3

from argparse import ArgumentParser
from glob import glob
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import sys


class MapServerRequestHandler(BaseHTTPRequestHandler):
    def __init__(self, _map_dir, _map_filename):
        self.map_dir = _map_dir
        self.map_filename = _map_filename
       
    # magic so that our constructor works as intended
    def __call__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path == '/map_file':
            self.send_response(200)
            self.send_header('content-type', 'text/plain; charset=utf-8')
            self.send_header('access-control-allow-origin', '*')
            self.send_header('access-control-allow-credentials', 'true')
            self.end_headers()
            f = open(self.map_filename, 'rb')
            self.wfile.write(f.read())
            f.close()
        else:
            image_filename = self.path.split('/')[-1]
            print(f'image filename: {image_filename}')
            if image_filename.endswith('.png'):
                image_path = os.path.join(self.map_dir, image_filename)
                if os.path.exists(image_path):
                    self.send_response(200)
                    self.send_header('content-type', 'text/plain; charset=utf-8')
                    self.send_header('access-control-allow-origin', '*')
                    self.send_header('access-control-allow-credentials', 'true')
                    self.end_headers()
                    f = open(image_path, 'rb')
                    self.wfile.write(f.read())
                    f.close()
                else:
                    self.send_response(404)
                    self.end_headers()
            else:
                self.send_response(400)
                self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('access-control-allow-origin', '*')
        self.send_header('access-control-allow-credentials', 'true')
        self.send_header('access-control-allow-methods', 'GET, POST, OPTIONS')
        self.send_header('access-control-allow-headers', '*')
        self.end_headers()

    def do_POST(self):
        if self.path == '/map_file':
            # todo: retrieve content-length and read only that many bytes
            body_len = int(self.headers['content-length'])
            post_body = self.rfile.read(body_len).decode('utf-8')
            print(f'received body: {post_body}')
            self.send_response(200)
            self.send_header('access-control-allow-origin', '*')
            self.send_header('access-control-allow-credentials', 'true')
            self.send_header('access-control-allow-methods', 'GET, POST, OPTIONS')
            self.send_header('access-control-allow-headers', '*')
            # self.send_header('content-type', 'text/plain; charset=utf-8')
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

def main():
    parser = ArgumentParser(description='Map file server')
    parser.add_argument('--map_dir', type=str, help='Map directory', default='.')
    args = parser.parse_args()
    print(f'serving map from directory {args.map_dir}')

    map_filenames = glob(os.path.join(args.map_dir, '*.building.yaml'))
    if not map_filenames:
        print(f'could not find a .building.yaml file in {args.map_dir}')
        sys.exit(1)
    
    map_filename = map_filenames[0]
    print(f'using {map_filename} as the map')

    server = HTTPServer(
        ('127.0.0.1', 8000),
        MapServerRequestHandler(args.map_dir, map_filename))
    server.serve_forever()


if __name__ == '__main__':
    main()
