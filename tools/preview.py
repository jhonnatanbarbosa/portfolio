"""Preview site/ the way the server serves it.

    python tools/preview.py [port]

python -m http.server knows nothing of deploy/Caddyfile: /dead-saints-parade
is a 404 there, and a missing address gets Python's own unstyled error page.
This serves /foo as foo.html and answers a missing address with site/404.html
and a 404 status, as Caddy does. The redirects in the Caddyfile are not
reproduced.
"""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # try_files {path} {path}.html
        found = super().translate_path(path)
        if not os.path.exists(found) and os.path.isfile(found + ".html"):
            return found + ".html"
        return found

    def send_error(self, code, message=None, explain=None):
        # handle_errors: the studio's own page, still with a 404 status.
        page = SITE / "404.html"
        if code != 404 or not page.is_file():
            return super().send_error(code, message, explain)
        body = page.read_bytes()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
print("Serving %s at http://localhost:%d" % (SITE, port))
ThreadingHTTPServer(("", port), partial(Handler, directory=str(SITE))).serve_forever()
