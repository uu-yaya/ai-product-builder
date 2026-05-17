# Agent 实验块 模板

复制下面的各个场景到 md-canvas 的 Agent 实验块（slash `/agent`），按顺序跑可以体验完整的 memory / tool-calling / persona 切换流程。

每个场景列出：METHOD / URL / HEADERS / BODY / 变量 五块，逐行粘进去就行。

## 共用配置

| 字段 | 值 |
| --- | --- |
| 服务地址 | `http://localhost:7788` |
| HEADERS | `Content-Type: application/json` |

---

## 场景 1：初次见面（什么都没记，工具会发现 preferences 为空）

| 字段 | 值 |
| --- | --- |
| METHOD | `POST` |
| URL | `{{base}}/agent/chat` |
| HEADERS | `Content-Type: application/json` |
| BODY | `{"user_id": "{{uid}}", "ip": "{{ip}}", "user_message": "{{msg}}"}` |

变量：
- `base` = `http://localhost:7788`
- `uid` = `u_001`
- `ip` = `妲己`
- `msg` = `你好，你认识我吗？`

预期：tool_calls 里会看到 `get_user_preference` 被调，结果是 `{"all": {}}`，妲己回类似 "咦~ 第一次见面呢"。

---

## 场景 2：让 agent 记住你的偏好

变量改：
- `msg` = `记住，我是辅助玩家，喜欢瑶妹，最讨厌别人催我上分`

预期：tool_calls 里看到一次或多次 `save_user_preference`，每条偏好一条。
跑完后用「场景 6」snapshot 看一眼 memory，应该有 `favorite_hero: 瑶` 之类。

---

## 场景 3：测长期记忆是否生效

变量改：
- `msg` = `你还记得我喜欢的英雄吗？`

预期：tool_calls 看到 `get_user_preference(key="favorite_hero")`，结果带值，agent 回答里带"瑶"。

---

## 场景 4：触发桌宠主动写日记

| 字段 | 值 |
| --- | --- |
| METHOD | `POST` |
| URL | `{{base}}/agent/diary/generate` |
| BODY | `{"user_id": "{{uid}}", "ip": "{{ip}}", "date": "{{day}}", "hint": "{{hint}}"}` |

变量：
- `base` = `http://localhost:7788`
- `uid` = `u_001`
- `ip` = `妲己`
- `day` = `2026-05-14`
- `hint` = `今天打了 6 把，3 胜 3 负，最后一把残血翻盘`

预期：tool_calls 看到 `get_recent_interactions` / `get_user_preference`，diary_text 用人设语气写一段。

---

## 场景 5：换 IP，看人设漂移

把场景 1 的变量 `ip` 改成 `王昭君`，`msg` 改成 `你好，今天打输了`。

预期：reply_text 风格立刻从"嘤嘤嘤娇媚"变到"清冷古风"。memory 里 user_id 不变所以偏好依然能查到。

---

## 场景 6：PM 调试 — 看当前用户的全部记忆

| 字段 | 值 |
| --- | --- |
| METHOD | `POST` |
| URL | `{{base}}/agent/memory/snapshot` |
| BODY | `{"user_id": "{{uid}}"}` |

变量同上。返回 `{ preferences, recent_diaries, interactions, interaction_summaries }`。

---

## 场景 7：语音回复

注意：需要先在 `.env` 里填 `MINIMAX_GROUP_ID`。

| 字段 | 值 |
| --- | --- |
| METHOD | `POST` |
| URL | `{{base}}/agent/voice/tts` |
| BODY | `{"text": "{{text}}", "voice": "female-chengshu"}` |

变量：
- `base` = `http://localhost:7788`
- `text` = `妲己等你好久啦，今天不上分了陪我玩好不好`

返回 `audio_url`，直接在浏览器打开能播。

---

## 推荐跑法

1. 跑场景 1（建档）
2. 跑场景 2（投喂偏好）
3. 跑场景 6（看 memory.json 里真的有了）
4. 跑场景 3（验证下次能想起来）
5. 跑场景 4（让它写日记，看是不是用上了你说的偏好）
6. 跑场景 5（换 IP 看人设漂移）
7. 跑场景 7（语音）

每步看 tool_calls 数组——这是 agent "怎么想的" 的最直接观察口。
