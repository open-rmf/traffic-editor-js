#!/usr/bin/env python3

from argparse import ArgumentParser
from glob import glob
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import sys


class TileServerRequestHandler(BaseHTTPRequestHandler):
    def __init__(self, _tile_dir):
        self.tile_dir = _tile_dir
       
    # magic so that our constructor works as intended
    def __call__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def is_valid_request(self, tokens):
        print(tokens)

        if len(tokens) != 4:
            return False

        if tokens[0] != 'tiles':
            return False

        if not tokens[1].isdigit():
            return False
        
        if not tokens[2].isdigit():
            return False
        
        filename_tokens = tokens[3].split('.')
        if len(filename_tokens) != 2:
            return False

        if not filename_tokens[0].isdigit():
            return False

        if filename_tokens[1] != 'png':
            return False

        return True
        
    def do_GET(self):
        # make sure this request looks like a tile request
        tokens = self.path[1:].split('/')
        if self.is_valid_request(tokens):
            tile_path = os.path.join(self.tile_dir, *tokens[1:])
            print(f'serving tile from {tile_path}')
            if os.path.exists(tile_path):
                self.send_response(200)
                self.send_header('content-type', 'image/png; charset=utf-8')
                self.send_header('access-control-allow-origin', '*')
                self.send_header('access-control-allow-credentials', 'true')
                self.end_headers()
                f = open(tile_path, 'rb')
                self.wfile.write(f.read())
                f.close()
            else:
                tile_path = os.path.join(self.tile_dir, '0', '0', '0.png')
                #self.send_response(404)
                self.send_response(200)
                self.send_header('content-type', 'image/png; charset=utf-8')
                self.send_header('access-control-allow-origin', '*')
                self.send_header('access-control-allow-credentials', 'true')
                self.end_headers()
                f = open(tile_path, 'rb')
                self.wfile.write(f.read())
                f.close()
        else:
            self.send_response(400)
            self.send_header('access-control-allow-origin', '*')
            self.send_header('access-control-allow-credentials', 'true')
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('access-control-allow-origin', '*')
        self.send_header('access-control-allow-credentials', 'true')
        self.send_header('access-control-allow-methods', 'GET, POST, OPTIONS')
        self.send_header('access-control-allow-headers', '*')
        self.end_headers()


def main():
    parser = ArgumentParser(description='RMF tile server')
    parser.add_argument('--tile_dir', type=str, help='Tile directory', default='.')
    args = parser.parse_args()
    print(f'serving tiles from directory {args.tile_dir}')

    # make sure that this directory has a '0' subdirectory...
    if not os.path.exists(os.path.join(args.tile_dir, '0')):
        print(f'could not find a "0" subdirectory in {args.tile_dir}')
        sys.exit(1)

    server = HTTPServer(
        ('127.0.0.1', 8800),
        TileServerRequestHandler(args.tile_dir))
    server.serve_forever()


if __name__ == '__main__':
    main()
