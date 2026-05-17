"""Desktop pet diary agent demo server.

Single-file Flask app:
  - 4 endpoints (chat / diary / memory snapshot / tts)
  - Tool-calling loop against MiniMax (OpenAI-compatible)
  - Persistent memory in memory.json
  - CORS open for browser direct-call from md-canvas

Quick start:
  cp .env.example .env  &&  edit MINIMAX_API_KEY=
  pip install -r requirements.txt
  python server.py
"""

import json
import os
import pathlib
import time
from datetime import date, datetime

import requests
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

ROOT = pathlib.Path(__file__).parent
PERSONAS_DIR = ROOT / "personas"
MEMORY_FILE = ROOT / "memory.json"
AUDIO_DIR = ROOT / "audio"
AUDIO_DIR.mkdir(exist_ok=True)

env_file = ROOT / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

MINIMAX_API_KEY = os.environ.get("MINIMAX_API_KEY", "")
MINIMAX_GROUP_ID = os.environ.get("MINIMAX_GROUP_ID", "")
# Default to the 国内版 endpoint. Override with MINIMAX_BASE_URL=https://api.minimax.io for the international plan.
MINIMAX_BASE_URL = os.environ.get("MINIMAX_BASE_URL", "https://api.minimaxi.com").rstrip("/")
DEFAULT_MODEL = os.environ.get("MODEL", "MiniMax-M2.7")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# Memory --------------------------------------------------------------------

def load_memory():
    if not MEMORY_FILE.exists():
        return {"users": {}}
    return json.loads(MEMORY_FILE.read_text(encoding="utf-8"))


def save_memory(mem):
    MEMORY_FILE.write_text(
        json.dumps(mem, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def get_user(mem, user_id):
    if user_id not in mem["users"]:
        mem["users"][user_id] = {
            "preferences": {},
            "recent_diaries": [],
            "interactions": [],
        }
    return mem["users"][user_id]


# Persona -------------------------------------------------------------------

def load_persona(ip):
    f = PERSONAS_DIR / f"{ip}.md"
    if not f.exists():
        f = PERSONAS_DIR / "default.md"
    if f.exists():
        return f.read_text(encoding="utf-8")
    return f"你是一只游戏桌宠，IP 是 {ip}。"


# Tools ---------------------------------------------------------------------

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_user_preference",
            "description": "查询当前用户的偏好。不传 key 则返回全部偏好（dict）。",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "用户 id（由系统注入到上下文）"},
                    "key": {"type": "string", "description": "偏好键，如 favorite_hero / play_style / topics_to_avoid"},
                },
                "required": ["user_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "save_user_preference",
            "description": "学到/确认了用户的某项偏好，存进长期记忆，下次还能查到。",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "key": {"type": "string"},
                    "value": {"type": "string"},
                },
                "required": ["user_id", "key", "value"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_recent_diaries",
            "description": "翻这个用户最近 N 天的日记内容（按时间倒序）。",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "days": {"type": "integer", "default": 7},
                },
                "required": ["user_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_recent_interactions",
            "description": "翻最近 N 轮 user/pet 聊天历史。回答 “上次我们聊了什么” 时调用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "n": {"type": "integer", "default": 5},
                },
                "required": ["user_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "record_interaction_summary",
            "description": "把本轮关键信息提炼成一句话，落到长期记忆。仅在用户表达了新偏好/新事实时调用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "summary": {"type": "string"},
                },
                "required": ["user_id", "summary"],
            },
        },
    },
]


def exec_tool(name, args, mem):
    user_id = args.get("user_id")
    if not user_id:
        return {"error": "user_id required"}
    user = get_user(mem, user_id)
    if name == "get_user_preference":
        key = args.get("key")
        if key:
            return {"key": key, "value": user["preferences"].get(key)}
        return {"all": user["preferences"]}
    if name == "save_user_preference":
        user["preferences"][args["key"]] = args["value"]
        return {"saved": True, "key": args["key"], "value": args["value"]}
    if name == "get_recent_diaries":
        days = int(args.get("days", 7))
        return {"diaries": user["recent_diaries"][-days:]}
    if name == "get_recent_interactions":
        n = int(args.get("n", 5))
        return {"interactions": user["interactions"][-n:]}
    if name == "record_interaction_summary":
        user.setdefault("interaction_summaries", []).append({
            "ts": datetime.now().isoformat(timespec="seconds"),
            "summary": args["summary"],
        })
        user["interaction_summaries"] = user["interaction_summaries"][-50:]
        return {"recorded": True}
    return {"error": f"unknown tool {name}"}


# MiniMax client ------------------------------------------------------------

def call_minimax(messages, tools=None, model=None, max_tokens=1024):
    if not MINIMAX_API_KEY:
        raise RuntimeError("MINIMAX_API_KEY 未设置。把 key 写进 shell env 或 .env 文件。")
    headers = {
        "Authorization": f"Bearer {MINIMAX_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": model or DEFAULT_MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
    }
    if tools:
        body["tools"] = tools
        body["tool_choice"] = "auto"
    r = requests.post(
        f"{MINIMAX_BASE_URL}/v1/chat/completions",
        json=body,
        headers=headers,
        timeout=120,
    )
    if r.status_code >= 400:
        raise RuntimeError(f"MiniMax {r.status_code}: {r.text[:500]}")
    return r.json()


def chat_loop(system_prompt, user_message, user_id, model=None, max_iter=4):
    """Run a tool-calling loop. Returns (final_text, tool_trace)."""
    mem = load_memory()
    messages = [
        {
            "role": "system",
            "content": system_prompt
            + f"\n\n# 系统注入上下文\n当前用户 user_id = `{user_id}`。"
            + "需要历史/偏好/日记时主动调用工具，不要假装记得。"
            + "学到新偏好或新事实时调用 save_user_preference 或 record_interaction_summary。",
        },
        {"role": "user", "content": user_message},
    ]
    tool_trace = []
    final_msg = {"content": ""}
    for _ in range(max_iter):
        data = call_minimax(messages, tools=TOOLS, model=model)
        msg = data["choices"][0]["message"]
        messages.append(msg)
        final_msg = msg
        tool_calls = msg.get("tool_calls") or []
        if not tool_calls:
            break
        for tc in tool_calls:
            name = tc["function"]["name"]
            try:
                args = json.loads(tc["function"]["arguments"] or "{}")
            except json.JSONDecodeError:
                args = {}
            args.setdefault("user_id", user_id)
            result = exec_tool(name, args, mem)
            tool_trace.append({"name": name, "args": args, "result": result})
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "content": json.dumps(result, ensure_ascii=False),
            })
    save_memory(mem)
    return (final_msg.get("content") or ""), tool_trace


# Endpoints -----------------------------------------------------------------

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "ok": True,
        "minimax_base_url": MINIMAX_BASE_URL,
        "minimax_key": "set" if MINIMAX_API_KEY else "MISSING",
        "minimax_group_id": "set" if MINIMAX_GROUP_ID else "missing (only needed for TTS)",
        "endpoints": [
            "POST /agent/chat",
            "POST /agent/diary/generate",
            "POST /agent/memory/snapshot  (or GET with ?user_id=)",
            "POST /agent/voice/tts",
        ],
        "personas_available": [p.stem for p in PERSONAS_DIR.glob("*.md")],
    })


@app.route("/agent/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(force=True, silent=True) or {}
    user_id = payload.get("user_id", "u_anon")
    ip = payload.get("ip", "default")
    user_msg = payload.get("user_message", "")
    sys_override = payload.get("system_prompt_override")
    model = payload.get("model")
    if not user_msg:
        return jsonify({"error": "user_message required"}), 400
    t0 = time.time()
    system = sys_override or load_persona(ip)
    try:
        text, trace = chat_loop(system, user_msg, user_id, model=model)
    except Exception as e:
        return jsonify({"error": str(e)}), 502
    mem = load_memory()
    user = get_user(mem, user_id)
    user["interactions"].append({
        "ts": datetime.now().isoformat(timespec="seconds"),
        "user": user_msg,
        "pet": text,
    })
    user["interactions"] = user["interactions"][-50:]
    save_memory(mem)
    return jsonify({
        "reply_text": text,
        "tool_calls": trace,
        "ip": ip,
        "user_id": user_id,
        "duration_ms": int((time.time() - t0) * 1000),
    })


@app.route("/agent/diary/generate", methods=["POST", "OPTIONS"])
def diary():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(force=True, silent=True) or {}
    user_id = payload.get("user_id", "u_anon")
    ip = payload.get("ip", "default")
    day = payload.get("date", date.today().isoformat())
    extra = payload.get("hint", "")
    t0 = time.time()
    system = load_persona(ip) + (
        "\n\n# 今天的任务\n你要根据用户偏好和最近聊天，给用户写一篇 ~200 字的桌宠日记。"
        "第一人称，朋友视角，可以吐槽、安慰、庆祝、写小剧场。"
        "不写真实身份信息，不复述聊天原文，但可以提一个有记忆点的细节。"
        "先调 get_user_preference / get_recent_interactions 拿背景再写。"
    )
    user_msg = f"请写 {day} 的日记。" + (f"\n额外提示：{extra}" if extra else "")
    try:
        text, trace = chat_loop(system, user_msg, user_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 502
    mem = load_memory()
    user = get_user(mem, user_id)
    user["recent_diaries"].append({"date": day, "content": text})
    user["recent_diaries"] = user["recent_diaries"][-30:]
    save_memory(mem)
    return jsonify({
        "diary_text": text,
        "date": day,
        "ip": ip,
        "tool_calls": trace,
        "duration_ms": int((time.time() - t0) * 1000),
    })


@app.route("/agent/memory/snapshot", methods=["GET", "POST", "OPTIONS"])
def snapshot():
    if request.method == "OPTIONS":
        return "", 204
    if request.method == "GET":
        user_id = request.args.get("user_id", "u_anon")
    else:
        payload = request.get_json(force=True, silent=True) or {}
        user_id = payload.get("user_id", "u_anon")
    mem = load_memory()
    return jsonify(get_user(mem, user_id))


@app.route("/agent/voice/tts", methods=["POST", "OPTIONS"])
def tts():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(force=True, silent=True) or {}
    text = payload.get("text", "")
    voice = payload.get("voice", "female-chengshu")
    if not text:
        return jsonify({"error": "text required"}), 400
    if not MINIMAX_API_KEY:
        return jsonify({"error": "MINIMAX_API_KEY not set"}), 400
    if not MINIMAX_GROUP_ID:
        return jsonify({"error": "MINIMAX_GROUP_ID not set (TTS only)"}), 400
    headers = {
        "Authorization": f"Bearer {MINIMAX_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": "speech-02-hd",
        "text": text,
        "stream": False,
        "voice_setting": {"voice_id": voice, "speed": 1.0, "vol": 1.0, "pitch": 0},
        "audio_setting": {"sample_rate": 32000, "bitrate": 128000, "format": "mp3", "channel": 1},
    }
    url = f"{MINIMAX_BASE_URL}/v1/t2a_v2?GroupId={MINIMAX_GROUP_ID}"
    t0 = time.time()
    try:
        r = requests.post(url, json=body, headers=headers, timeout=60)
        if r.status_code >= 400:
            return jsonify({"error": f"MiniMax {r.status_code}: {r.text[:400]}"}), 502
        data = r.json()
        audio_hex = (data.get("data") or {}).get("audio")
        if not audio_hex:
            return jsonify({"error": "no audio in response", "raw": data}), 502
        audio_bytes = bytes.fromhex(audio_hex)
        fname = f"tts_{int(time.time() * 1000)}.mp3"
        (AUDIO_DIR / fname).write_bytes(audio_bytes)
        host = request.host_url.rstrip("/")
        return jsonify({
            "audio_url": f"{host}/audio/{fname}",
            "duration_ms": int((time.time() - t0) * 1000),
            "bytes": len(audio_bytes),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 502


@app.route("/audio/<path:fname>")
def serve_audio(fname):
    return send_from_directory(AUDIO_DIR, fname)


if __name__ == "__main__":
    print(f"Pet agent serving on http://localhost:7788")
    print(f"  MiniMax base:   {MINIMAX_BASE_URL}")
    print(f"  MiniMax key:    {'OK' if MINIMAX_API_KEY else 'MISSING (set in .env)'}")
    print(f"  MiniMax group:  {'OK' if MINIMAX_GROUP_ID else 'missing (only TTS needs it)'}")
    print(f"  Personas:       {[p.stem for p in PERSONAS_DIR.glob('*.md')]}")
    app.run(host="0.0.0.0", port=7788, debug=False)
