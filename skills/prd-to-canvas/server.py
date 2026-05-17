"""
md-canvas server — local Flask server that turns md-canvas into a true editor:
canvas POST /api/save → server writes back to the .md file + auto git
commit + pull --rebase + push.

Usage:
  cd <your project root>
  python3 -m pip install flask              # if not already installed
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
import os
import pathlib
import re
import secrets
import subprocess
import sys
import threading
import time
import webbrowser
from urllib.parse import urlparse

try:
    from flask import Flask, request, jsonify, send_file, abort
except ImportError:
    sys.exit("error: flask not installed. run:  python3 -m pip install flask")

__version__ = "0.6.0"
DEFAULT_PORT = 7799
SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
TEMPLATE_PATH = SCRIPT_DIR / "templates" / "md-canvas.html"
EXCLUDE_DIRS = {".git", "node_modules", "dist", "build", "__pycache__",
                ".venv", "venv", ".next", ".turbo", "cleanup-backups",
                ".pytest_cache"}

app = Flask(__name__)
ROOT: pathlib.Path = pathlib.Path.cwd().resolve()

# Per-server-run CSRF token. Embedded in every canvas page; POST /api/save
# rejects requests that don't carry it. Defends against attacks where a
# malicious site you visit POSTs to your local server (server is bound to
# 127.0.0.1 but the browser will happily send same-origin-ish requests if
# the site embeds an iframe or fetch to localhost).
SESSION_TOKEN: str = secrets.token_urlsafe(32)


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
    # Inject the relative path + per-session CSRF token so canvas save() knows
    # what file to POST back and proves it was served by us.
    injection = (
        f"<script>"
        f"window.MD_CANVAS_PATH = {json.dumps(rel_path)};"
        f"window.MD_CANVAS_TOKEN = {json.dumps(SESSION_TOKEN)};"
        f"</script>"
    )
    html = html.replace("</head>", injection + "\n</head>", 1)
    return html


def git(*args: str, capture: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=capture,
                          text=True)


def preflight_git_check() -> list[str]:
    """Sanity-check user's git setup. Returns list of human-readable issues."""
    issues: list[str] = []

    # 1. Is cwd inside a git repo?
    r = git("rev-parse", "--git-dir")
    if r.returncode != 0:
        issues.append(
            "当前目录不是 git 仓库 → 保存只会写文件不会 push。\n"
            f"     如果想用 git 协作，先: cd <项目根> && git init"
        )
        return issues  # everything below requires being in a git repo

    # 2. Has any remote?
    r = git("remote")
    if not r.stdout.strip():
        issues.append(
            "没配 git remote → push 时会失败。\n"
            "     加远端仓库: git remote add origin <your-git-url>\n"
            "       例: GitHub  git@github.com:you/your-repo.git\n"
            "           GitLab  git@gitlab.com:you/your-repo.git\n"
            "           工蜂    git@git.code.tencent.com:you/your-repo.git"
        )

    # 3. Current branch has upstream?
    branch_r = git("rev-parse", "--abbrev-ref", "HEAD")
    branch = branch_r.stdout.strip() if branch_r.returncode == 0 else "?"
    if branch and branch != "HEAD":
        up_r = git("rev-parse", "--abbrev-ref", "@{u}")
        if up_r.returncode != 0:
            issues.append(
                f"当前分支 '{branch}' 没设 upstream → push 不知道推哪。\n"
                f"     设一次: git push -u origin {branch}"
            )
    elif branch == "HEAD":
        issues.append("当前是 detached HEAD 状态。先 git checkout <分支名>")

    # 4. Has identity?
    email = git("config", "user.email").stdout.strip()
    name = git("config", "user.name").stdout.strip()
    if not email or not name:
        issues.append(
            "git 身份没配 → commit 时会失败。\n"
            "     git config user.email <your-email>\n"
            "     git config user.name <your-name>"
        )

    return issues


def friendly_git_error(stderr: str) -> str:
    """Translate common git errors to Chinese hints."""
    s = (stderr or "").lower()
    if "not a git repository" in s:
        return "当前目录不是 git 仓库（cd 到项目根再启 server）"
    if "no configured push destination" in s or "no upstream" in s:
        return ("当前分支没设 upstream。terminal 运行: "
                "git push -u origin <你的分支名>")
    if "permission denied" in s or "publickey" in s:
        return ("git 认证失败（SSH key 没配 / token 过期）。"
                "先在 terminal 试试 git push 能不能成")
    if "merge conflict" in s or "conflict" in s:
        return ("队友刚也改了这个文件且自动 merge 失败。"
                "terminal: git pull --rebase → 解 conflict → git push")
    if "rejected" in s and "non-fast-forward" in s:
        return ("远端有新提交还没拉。"
                "terminal: git pull --rebase 后再保存")
    return stderr.strip()[:300] or "未知 git 错误"


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


def _csrf_check() -> tuple[bool, str]:
    """Validate request origin + CSRF token. Returns (ok, error_msg)."""
    # 1. Token from header or body
    body = request.get_json(silent=True) or {}
    token = request.headers.get("X-MD-Canvas-Token") or body.get("token")
    if not token or not secrets.compare_digest(str(token), SESSION_TOKEN):
        return False, "CSRF token missing or mismatch"
    # 2. Origin / Referer must point at our own host (defense in depth)
    origin = request.headers.get("Origin", "")
    referer = request.headers.get("Referer", "")
    src = origin or referer
    if src:
        host = urlparse(src).hostname or ""
        if host not in ("127.0.0.1", "localhost"):
            return False, f"unexpected origin: {src}"
    return True, ""


@app.route("/api/save", methods=["POST"])
def api_save():
    ok, err = _csrf_check()
    if not ok:
        return jsonify(ok=False, stage="csrf", error=err), 403

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
        return jsonify(ok=False, stage="add",
                       error=friendly_git_error(r.stderr)), 200

    msg = f"edit {relpath} via md-canvas"
    r = git("commit", "-m", msg)
    if r.returncode != 0:
        out = (r.stdout + r.stderr).lower()
        # Nothing to commit means user opened + Cmd+S without changes
        if "nothing to commit" in out or "no changes added" in out:
            return jsonify(ok=True, stage="noop", saved_path=relpath,
                           note="no changes to commit"), 200
        return jsonify(ok=False, stage="commit",
                       error=friendly_git_error(r.stderr or r.stdout)), 200

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
            error=friendly_git_error(r.stderr or r.stdout),
        ), 200
    pulled = "Successfully rebased" in r.stdout or "Current branch" in r.stdout

    r = git("push")
    if r.returncode != 0:
        return jsonify(ok=False, stage="push", commit_sha=sha,
                       error=friendly_git_error(r.stderr or r.stdout)), 200

    return jsonify(ok=True, stage="done", saved_path=relpath,
                   commit_sha=sha, pulled=pulled, pushed=True), 200


@app.route("/api/status")
def api_status():
    """Quick health check so canvas can detect server-mode at load time
    and so a duplicate server startup can detect existing instance."""
    return jsonify(ok=True, root=str(ROOT), template_ok=TEMPLATE_PATH.exists(),
                   product="md-canvas-server", version=__version__,
                   pid=os.getpid())


def _probe_port(port: int) -> dict | None:
    """Return JSON dict if port responds as another md-canvas-server, None
    if free/unknown. Used to detect duplicate-start vs port-collision."""
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.3)
    try:
        s.connect(("127.0.0.1", port))
        s.close()
    except (ConnectionRefusedError, OSError):
        return None  # nothing on this port
    # Something IS listening. Try our /api/status to see if it's us.
    try:
        from urllib.request import urlopen
        from urllib.error import URLError
        with urlopen(f"http://127.0.0.1:{port}/api/status", timeout=1) as r:
            return json.loads(r.read().decode())
    except (URLError, json.JSONDecodeError, OSError):
        return {"product": "unknown"}  # something else on this port


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
    parser = argparse.ArgumentParser(
        prog="md-canvas-server",
        description=f"md-canvas server v{__version__} — local Flask "
                    "server bridging canvas HTML to your .md files + git.",
    )
    parser.add_argument("--port", type=int, default=DEFAULT_PORT,
                        help=f"listen port (default: {DEFAULT_PORT})")
    parser.add_argument("--root", type=str, default=None,
                        help="serve from this dir (default: cwd)")
    parser.add_argument("--no-browser", action="store_true",
                        help="don't auto-open browser on startup")
    parser.add_argument("--version", action="version",
                        version=f"md-canvas-server {__version__}")
    args = parser.parse_args()

    if args.root:
        ROOT = pathlib.Path(args.root).resolve()
    if not ROOT.exists():
        sys.exit(f"error: root {ROOT} does not exist")

    if not TEMPLATE_PATH.exists():
        sys.exit(f"error: template not found at {TEMPLATE_PATH}\n"
                 f"  did you move server.py out of skills/prd-to-canvas/?")

    # Idempotency: probe target port before binding
    probe = _probe_port(args.port)
    if probe and probe.get("product") == "md-canvas-server":
        url_existing = f"http://localhost:{args.port}/"
        print(f"ℹ  md-canvas-server 已在 :{args.port} 上跑（PID {probe.get('pid')}）")
        print(f"   serving:  {probe.get('root')}")
        print(f"   url:      {url_existing}")
        if not args.no_browser:
            threading.Thread(target=_open_browser, args=(url_existing,),
                             daemon=True).start()
        print(f"   已在浏览器打开。不再启第二个。Ctrl-C 退出此命令。")
        return
    if probe and probe.get("product") != "md-canvas-server":
        sys.exit(
            f"error: 端口 {args.port} 被别的进程占了（不是 md-canvas-server）。\n"
            f"  · 换端口:    python3 {sys.argv[0] or 'server.py'} --port 7800\n"
            f"  · 或先停掉占用进程: lsof -i :{args.port}"
        )

    url = f"http://localhost:{args.port}/"
    pid = os.getpid()
    script_path = pathlib.Path(sys.argv[0]).resolve() if sys.argv[0] else SCRIPT_DIR / "server.py"
    is_windows = sys.platform.startswith("win")
    py_cmd = "python" if is_windows else "python3"
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"  md-canvas server  v{__version__}")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"  serving:   {ROOT}")
    print(f"  template:  {TEMPLATE_PATH}")
    print(f"  url:       {url}")
    print(f"  PID:       {pid}")
    print(f"  platform:  {sys.platform}")
    print(f"")
    print(f"  📂 浏览器打开:   {url}")
    if is_windows:
        print(f"  ⛔ 停止 server:  Ctrl-C  或新 terminal: Stop-Process -Id {pid}")
        print(f"  🔁 再启 server:  {py_cmd} {script_path}")
        print(f"  ♾  后台保活:     Start-Process {py_cmd} -ArgumentList \"{script_path}\" -WindowStyle Hidden")
    else:
        print(f"  ⛔ 停止 server:  Ctrl-C  或 kill {pid}")
        print(f"  🔁 再启 server:  {py_cmd} {script_path}")
        print(f"  ♾  后台保活:     nohup {py_cmd} {script_path} > server.log 2>&1 &")
    print(f"")

    # Sanity-check git setup so user knows up front whether save+push will work
    issues = preflight_git_check()
    if issues:
        print()
        print("  ⚠  git 配置不完整，server 模式 Cmd+S 会失败：")
        for i, issue in enumerate(issues, 1):
            print(f"     {i}. {issue}")
        print()
        print("  → 修完后重启 server。或者继续跑（保存会失败但不影响只读浏览）")
    else:
        print(f"  git:       ✓ 已配 remote + upstream + 身份")

    if not args.no_browser:
        threading.Thread(target=_open_browser, args=(url,), daemon=True).start()

    app.run(host="127.0.0.1", port=args.port, debug=False)


if __name__ == "__main__":
    main()
