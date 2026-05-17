"""
md-canvas server — local Flask server that turns md-canvas into a true editor:
canvas POST /api/save → server writes back to the .md file + auto git
commit + pull --rebase + push.

Usage:
  cd <your project root>
  pip install flask
  python3 path/to/skills/prd-to-canvas/server.py

Then your browser auto-opens http://localhost:7799/. Pick any .md file
under your project root, edit in canvas, Cmd+S → file is saved + pushed.

Design:
  - Listens only on 127.0.0.1 (no external access)
  - Serves from current working directory
  - Excludes .git / node_modules / dist / build / __pycache__ / .venv
  - Renders canvas HTML by substituting __PRD_FILENAME__ / __PRD_TITLE__
    / __MARKDOWN_SOURCE_INLINE__ in templates/md-canvas.html
  - POST /api/save → writes file → git add → git commit → git pull --rebase
    → git push. Returns JSON with stage-by-stage status so canvas UI can
    show "保存中... 推送中... ✓ / ⚠ 冲突 / ✗ 推送失败"
  - If git pull --rebase conflicts, abort the rebase (so user's WAS-clean
    workdir is restored) and report the conflict to the canvas for manual
    resolution in terminal
"""
from __future__ import annotations
import argparse
import json
import pathlib
import re
import subprocess
import sys
import threading
import time
import webbrowser

try:
    from flask import Flask, request, jsonify, send_file, abort
except ImportError:
    sys.exit("error: flask not installed. run:  pip install flask")

DEFAULT_PORT = 7799
SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
TEMPLATE_PATH = SCRIPT_DIR / "templates" / "md-canvas.html"
EXCLUDE_DIRS = {".git", "node_modules", "dist", "build", "__pycache__",
                ".venv", "venv", ".next", ".turbo", "cleanup-backups",
                ".pytest_cache"}

app = Flask(__name__)
ROOT: pathlib.Path = pathlib.Path.cwd().resolve()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def safe_resolve(relpath: str) -> pathlib.Path:
    """Resolve relpath inside ROOT, refuse traversal."""
    p = (ROOT / relpath).resolve()
    if not str(p).startswith(str(ROOT) + "/") and p != ROOT:
        abort(403, "path escapes server root")
    return p


def discover_md_files() -> list[pathlib.Path]:
    out: list[pathlib.Path] = []
    for p in ROOT.rglob("*.md"):
        if any(part in EXCLUDE_DIRS for part in p.parts):
            continue
        out.append(p.relative_to(ROOT))
    return sorted(out)


def render_canvas_html(md_path: pathlib.Path, rel_path: str) -> str:
    if not TEMPLATE_PATH.exists():
        return f"<h1>500</h1><p>template not found: {TEMPLATE_PATH}</p>"
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    md_content = md_path.read_text(encoding="utf-8")
    safe_md = re.sub(r"(?i)</script>", r"<\/script>", md_content)
    html = (template
            .replace("__PRD_FILENAME__", md_path.name)
            .replace("__PRD_TITLE__", md_path.stem)
            .replace("__MARKDOWN_SOURCE_INLINE__", safe_md))
    # Inject the relative path so canvas save() knows what file to POST back
    injection = (f"<script>window.MD_CANVAS_PATH = "
                 f"{json.dumps(rel_path)};</script>")
    html = html.replace("</head>", injection + "\n</head>", 1)
    return html


def git(*args: str, capture: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=capture,
                          text=True)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    files = discover_md_files()
    head = (
        "<!doctype html><meta charset=utf-8>"
        "<title>md-canvas server</title>"
        "<style>"
        "body{font-family:-apple-system,PingFang SC,sans-serif;"
        "max-width:780px;margin:40px auto;padding:0 24px;"
        "color:#1a1a1a;background:#fffaf0}"
        "h1{font-family:Georgia,serif;font-size:24px}"
        ".meta{color:#6a6a6a;font-family:monospace;font-size:12px}"
        "ul{padding-left:0;list-style:none}"
        "li{padding:6px 0;border-top:1px solid #e5dcc4;"
        "font-family:monospace;font-size:13px}"
        "li:first-child{border-top:none}"
        "a{color:#4a7e3f;text-decoration:none}"
        "a:hover{text-decoration:underline}"
        ".dir{color:#9a9a9a;font-size:11px}"
        ".empty{color:#9a9a9a;font-style:italic;padding:20px 0}"
        "</style>"
    )
    rows = []
    for f in files:
        rel = str(f)
        parent = str(f.parent) if f.parent != pathlib.Path(".") else ""
        rows.append(
            f'<li><a href="/{rel}">{f.name}</a>'
            + (f' <span class="dir">{parent}/</span>' if parent else '')
            + '</li>'
        )
    if not rows:
        body = '<p class="empty">没有找到 .md 文件</p>'
    else:
        body = f'<ul>{"".join(rows)}</ul>'
    return (
        head
        + f"<h1>md-canvas</h1>"
        + f'<p class="meta">{ROOT} · {len(files)} 个 .md 文件</p>'
        + body
    )


@app.route("/<path:relpath>")
def serve_path(relpath: str):
    abs_path = safe_resolve(relpath)
    if not abs_path.exists():
        abort(404)
    if abs_path.is_dir():
        abort(404, "directories not served")
    if relpath.endswith(".md") or relpath.endswith(".markdown"):
        return render_canvas_html(abs_path, relpath)
    return send_file(abs_path)


@app.route("/api/save", methods=["POST"])
def api_save():
    data = request.get_json(silent=True) or {}
    relpath = data.get("path")
    content = data.get("content")
    if not isinstance(relpath, str) or not isinstance(content, str):
        return jsonify(ok=False, stage="validate",
                       error="missing path/content"), 400

    abs_path = safe_resolve(relpath)
    if abs_path.exists() and abs_path.is_dir():
        return jsonify(ok=False, stage="validate",
                       error="path is a directory"), 400

    # Stage 1: write file
    try:
        abs_path.parent.mkdir(parents=True, exist_ok=True)
        abs_path.write_text(content, encoding="utf-8")
    except Exception as e:
        return jsonify(ok=False, stage="write", error=str(e)), 500

    # Stage 2: git add + commit
    r = git("add", str(abs_path))
    if r.returncode != 0:
        return jsonify(ok=False, stage="add", error=r.stderr.strip()), 200

    msg = f"edit {relpath} via md-canvas"
    r = git("commit", "-m", msg)
    if r.returncode != 0:
        out = (r.stdout + r.stderr).lower()
        # Nothing to commit means user opened + Cmd+S without changes
        if "nothing to commit" in out or "no changes added" in out:
            return jsonify(ok=True, stage="noop", saved_path=relpath,
                           note="no changes to commit"), 200
        return jsonify(ok=False, stage="commit",
                       error=r.stderr.strip() or r.stdout.strip()), 200

    sha = git("rev-parse", "HEAD").stdout.strip()[:7]

    # Stage 3: pull --rebase → push. If rebase fails, abort to restore
    # the workdir to clean (post-commit) state and report conflict
    # so the user can resolve in terminal.
    pulled = False
    r = git("pull", "--rebase")
    if r.returncode != 0:
        git("rebase", "--abort")
        return jsonify(
            ok=False, stage="pull-rebase", conflict=True,
            commit_sha=sha,
            error="队友刚也改了这个文件且 git rebase 自动 merge 失败。"
                  "请到 terminal 手动: git pull --rebase → 解 conflict → git push",
        ), 200
    pulled = "Successfully rebased" in r.stdout or "Current branch" in r.stdout

    r = git("push")
    if r.returncode != 0:
        return jsonify(ok=False, stage="push", commit_sha=sha,
                       error=r.stderr.strip() or r.stdout.strip()), 200

    return jsonify(ok=True, stage="done", saved_path=relpath,
                   commit_sha=sha, pulled=pulled, pushed=True), 200


@app.route("/api/status")
def api_status():
    """Quick health check so canvas can detect server-mode at load time."""
    return jsonify(ok=True, root=str(ROOT), template_ok=TEMPLATE_PATH.exists())


# ---------------------------------------------------------------------------
# Entry
# ---------------------------------------------------------------------------

def _open_browser(url: str):
    time.sleep(0.8)
    try:
        webbrowser.open(url)
    except Exception:
        pass


def main():
    global ROOT
    parser = argparse.ArgumentParser(description="md-canvas server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--root", type=str, default=None,
                        help="serve from this dir (default: cwd)")
    parser.add_argument("--no-browser", action="store_true",
                        help="don't auto-open browser")
    args = parser.parse_args()

    if args.root:
        ROOT = pathlib.Path(args.root).resolve()
    if not ROOT.exists():
        sys.exit(f"error: root {ROOT} does not exist")

    if not TEMPLATE_PATH.exists():
        sys.exit(f"error: template not found at {TEMPLATE_PATH}\n"
                 f"  did you move server.py out of skills/prd-to-canvas/?")

    url = f"http://localhost:{args.port}/"
    print(f"md-canvas server")
    print(f"  serving:   {ROOT}")
    print(f"  template:  {TEMPLATE_PATH}")
    print(f"  url:       {url}")
    print(f"  (Ctrl-C to stop)")

    if not args.no_browser:
        threading.Thread(target=_open_browser, args=(url,), daemon=True).start()

    app.run(host="127.0.0.1", port=args.port, debug=False)


if __name__ == "__main__":
    main()
