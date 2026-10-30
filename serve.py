#!/usr/bin/env python3
"""Local preview for the static portfolio.

ThreadingHTTPServer matters here: NOVA Gear preloads 56 WebP frames at once,
and a single-threaded http.server can refuse connections under that burst.
"""

import http.server
import os

HOST = "127.0.0.1"
PORT = 4173

os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp",
        ".woff2": "font/woff2",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer((HOST, PORT), Handler) as server:
        print(f"FEN portfolio: http://{HOST}:{PORT}/")
        print("Ctrl+C to stop")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
