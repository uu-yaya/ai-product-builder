# Pet Agent Demo

桌宠 Diary 模块的 agent 后端 demo。本地一个 Python 文件跑起来，md-canvas 里的 Agent 实验块直接打 HTTP 过来测。

## 它做什么

| 能力 | 怎么实现 |
| --- | --- |
| 不同 IP 不同人设 | `personas/<ip>.md` 文件作为 system prompt，请求时按 `ip` 字段加载 |
| 长期记忆 | `memory.json` 存所有用户的偏好/日记/聊天历史 |
| 工具调用 | MiniMax 原生 function-calling，5 个工具读写 memory.json |
| 写日记 | `/agent/diary/generate` 触发，自动调工具拿背景再写 |
| 语音回复 | `/agent/voice/tts` 调 MiniMax TTS，落到 `audio/` 返回 url |

## 启动

```bash
cd projects/desktop-pet/03-engineering/branches/Diary/agent-demo
# key 已在 shell env 就跳过 .env 这步；否则：
cp .env.example .env  &&  vi .env

python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

跑起来后：

```
Pet agent serving on http://localhost:7788
  MiniMax base:   https://api.minimaxi.com
  MiniMax key:    OK
  MiniMax group:  missing (only TTS needs it)
  Personas:       ['妲己', '王昭君', 'default']
```

打开浏览器看 `http://localhost:7788/` 应该返回 endpoints 列表。

## 端点契约

### `POST /agent/chat`

```json
{
  "user_id": "u_001",
  "ip": "妲己",
  "user_message": "今天打 10 把输 8 把 wtf",
  "system_prompt_override": null,
  "model": "MiniMax-M2.7"
}
```

返回：
```json
{
  "reply_text": "...",
  "tool_calls": [
    {"name": "get_user_preference", "args": {...}, "result": {...}}
  ],
  "ip": "妲己",
  "user_id": "u_001",
  "duration_ms": 1234
}
```

### `POST /agent/diary/generate`

```json
{
  "user_id": "u_001",
  "ip": "妲己",
  "date": "2026-05-14",
  "hint": "(可选) 今天用户打了 LOL，4 胜 6 负"
}
```

返回 `{ diary_text, date, ip, tool_calls, duration_ms }`，并把日记落到 memory.json。

### `POST /agent/memory/snapshot`（PM 调试用）

```json
{ "user_id": "u_001" }
```

返回该用户当前的 `{ preferences, recent_diaries, interactions, interaction_summaries }`。也支持 `GET /agent/memory/snapshot?user_id=u_001`。

### `POST /agent/voice/tts`

```json
{ "text": "妲己今天等你好久啦", "voice": "female-chengshu" }
```

返回 `{ audio_url, duration_ms, bytes }`。在 md-canvas 里点 url 可以直接播放。

## 工具清单

LLM 在 `chat_loop` 里自己决定调哪个：

| 工具 | 触发时机 |
| --- | --- |
| `get_user_preference` | 用户问"你还记得我喜欢什么吗"、agent 要个性化输出前 |
| `save_user_preference` | 用户表达新偏好（"我喜欢辅助位"） |
| `get_recent_diaries` | "上次日记写了啥"、写新日记前补背景 |
| `get_recent_interactions` | "上次我们聊到哪了"、保持对话连续性 |
| `record_interaction_summary` | 本轮有值得长期留的事实（"明天有比赛"） |

## 怎么用 Agent 实验块测

参考同目录 `EXPERIMENT_TEMPLATES.md` — 一组复制即可粘到块里的预设。

## 限制（v1 故意没做）

- 单进程内存读写，没并发锁。
- TTS 没流式，整段合成完才返回。
- 工具迭代上限 4 轮，超了截断。
- memory.json 没压缩没分库，>1000 用户会慢。
- 没鉴权，demo 只跑 localhost。
