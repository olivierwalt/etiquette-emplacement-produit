from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8006"))
DIST_DIR = Path(__file__).resolve().parent / "dist"


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    def end_headers(self):
        if self.path == "/" or self.path.endswith("index.html"):
            self.send_header("Cache-Control", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        super().end_headers()

    def do_GET(self):
        requested = (DIST_DIR / self.path.lstrip("/")).resolve()
        if not str(requested).startswith(str(DIST_DIR)) or not requested.is_file():
            self.path = "/index.html"
        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Étiquette emplacement produit listening on http://{HOST}:{PORT}", flush=True)
    server.serve_forever()
