# 数据需求规格说明书（DRS）— desktop-pet Memory Dataset

> **文档性质**：正式评审稿（Data Requirement Specification）
> **目标读者**：Engineering / Design / 法务 / 项目决策方
> **基线**：基于 [`REQUIREMENT_CLARIFICATION_memory-dataset.md`](REQUIREMENT_CLARIFICATION_memory-dataset.md) v2.6（2026-05-12）
> **范围**：memory-dataset 分支数据需求层面；**不含** UI 设计、AI 模型选型、Engineering 实现细节
> **隐私基线**：项目级 [`01-pm/PRIVACY_BOUNDARY_memory-system.md`](../../PRIVACY_BOUNDARY_memory-system.md) § 2 硬约束
> **PRIVACY_BOUNDARY 修订提案状态**：Deferred（等 voice-interaction 分支启动后合并审议）
> **状态**：评审稿 v1.0

---

## 目录

- [§1 背景](#1-背景)
- [§2 数据需求总览](#2-数据需求总览)
- [§3 数据需求详解](#3-数据需求详解)
- [§4 附录](#4-附录)

---

## 1. 背景

### 1.1 项目定位

`desktop-pet` 是 C 端桌宠产品，桌宠"一只 instance 绑定一款游戏"（多游戏不共享 profile / 不跨游戏聚合）。核心体验是**"知心好友 + 游戏搭子"**：

- **知心好友**：长期记忆 / 个性化对话 / 情绪感知
- **游戏搭子**：对当下游戏场景有感、对游戏事件即时反应、复盘 / 庆祝 / 安慰

memory-dataset 分支的职责是**回答"桌宠需要什么数据"**，即记忆系统对桌宠层的产出契约。

### 1.2 范围边界（"脑" vs "嘴和耳"）

| 范围 | 归属 | 例子 |
|---|---|---|
| **数据感知**（内容层） | ✅ **本分支 memory-dataset** | 聊天文本（无论键盘 / STT 输入）、行为信号、游戏事件、屏幕语义、音频派生信号 |
| **I/O 通道**（设备 + 引擎） | ❌ voice-interaction 分支（未启动） | 麦克风 / STT 引擎 / TTS / 双向语音对话 / 声纹 |

> **判断依据**：用户记得朋友"听过 / 看过 / 知道什么"，但不会记得"朋友是用左耳还是右耳听到的"。

### 1.3 隐私底线（项目级硬约束）

来自 [`PRIVACY_BOUNDARY_memory-system.md`](../../PRIVACY_BOUNDARY_memory-system.md) § 2，本评审稿内所有数据需求**不放宽**以下任何一条：

| # | 硬约束 |
|---|---|
| 1 | 不默认 Recall 式后台全屏截图 |
| 2 | 不默认系统音频监听 |
| 3 | 不记录键盘输入内容 |
| 4 | 不长期存跨 app 全文 UI |
| 5 | 不上传 raw OS context |
| 6 | 不写敏感业务信息 |
| 7 | 不使用 Recall 作为数据源 |

部分模块（§ 3.7 VLM 视频扩展 / § 3.10 系统音频派生 / § 3.11 Playwright 受限放行 / § 3.12 OS Scripting Bridge / § 3.4 OS API / § 3.4 浏览器全方位）涉及**项目级 PRIVACY_BOUNDARY 修订提案**（Deferred 状态），各模块内附边界说明。

### 1.4 命名空间速查（三个独立体系，避免混用）

| 命名空间 | 含义 | 取值 | 允许采集 |
|---|---|---|---|
| **行为档 A** | Action 用户操作 | A1 派生 / A2 操作语义 / A3 编辑动作派生 | ✅ 全部允许 |
| **音频 A** | Audio 信号 | A0 派生 / A1 标识 / A2 内容 / A3 完整流 | ✅ A0 / A1；❌ A2 / A3 |
| **键盘 L** | 键盘分级 | L0 / L1 / L1.5 / L2 / L3 | ✅ L0 / L1 / L1.5；❌ L2 / L3 |

读到 A1 / A2 / A3 字面时**必须按上下文判断属哪个命名空间**。

### 1.5 数据来源 A / B 分类（核心架构原则）

| 类别 | 含义 | 是否进 memory schema | 消费方使用方式 |
|---|---|---|---|
| **A 类** | 记忆系统**直接产出** | ✅ 是 | query API 直接拿，无需二次加工 |
| **B 类** | memory 提供**前置数据**，消费方用 LLM / 代码**二次转换** | ❌ 否 | 拿前置数据 + 当下场景 → 动态生成 |

#### 三层数据架构

```
┌────────────────────────────────────────────────────────┐
│ Memory 采集层（A）                                       │
│ active_app / chat_text / game_event / behavior_*       │
│ idip_snapshot / audio_derived / mcp_* / os_api / 等等  │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Memory 派生层（A，含 AI 派生结果 stored）                  │
│ atomic_facts / episode / profile / emotion_signal      │
│ current_context / highlight_event / persona_assessment │
│ profile_meta / relationship_stats / 等等                │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ 消费侧动态生成（B，不进 memory schema）                   │
│ 日记正文 / 一句话画像卡片 / pet_observation             │
│ 桌宠对话回复 / 分享图文 / 人格结果页解释 / 等等          │
└────────────────────────────────────────────────────────┘
```

#### PM 红线

| # | 红线 | 理由 |
|---|---|---|
| 1 | memory 不存"桌宠语气"内容 | pet_observation / 对话 / 日记正文 / 分享文案受 IP 影响；stored 后换 IP 失效 |
| 2 | memory schema 字段必须 >1 消费方复用 | 单消费方一次性用进 B（不污染 schema） |
| 3 | AI 派生层级以 AI Eval § 3 各候选点为准 | atomic_facts / episode / profile / emotion / persona 进 A；对话 / 日记 / 卡片进 B |
| 4 | B 类生成不写回 memory（profile.summary 重写例外） | 受 IP / 场景影响，写回失效 |
| 5 | Persona 不作为陪伴策略驱动信号 / 不污染采集层 / 不含 game_id（单游戏前提） | 防过拟合 / 防架构耦合 |

---

## 2. 数据需求总览

### 2.1 模块全景表

> A / B 对应 § 1.5 来源分类；P0 最高优先级（不可缺）；P1 进 MVP；P2 探索。

| Index | 模块 | 子数据需求 | 来源 | 价值 | 优先级 |
|---|---|---|---|---|---|
| **3.1** | 聊天数据 chat | atomic_facts / episode / profile / emotion_signal / quote_eligible | A | "知心好友"核心；长期记忆、个性化对话、避免假记忆 | **P0** |
| **3.2** | 行为数据 - PC 进程 | active_app / idle_signal / app_switch / fullscreen | A | "在游戏中"vs"在工作中"判断；BOSS 战不打断 | **P0** |
| **3.3** | 行为数据 - UI & 用户操作 | window_title_redacted / 派生输入指标（A1） / 快捷键事件（A2） / 编辑动作（A3，L1.5） | A | 语义级"用户在做什么"；不触 keylog 红线 | **P0** + **P1** |
| **3.4** | APP 信号 - 6 通道 | MCP / OS API / 浏览器扩展 / OS Scripting Bridge / CLI / IFTTT | A | 接入工作 / 娱乐 app；元数据级；6 通道并存 | **P1**（MCP / OS API / 浏览器 / OSA） + **P2**（CLI / IFTTT） |
| **3.5** | 游戏数据 - idip 状态 | idip_snapshot / delta / anomaly / milestone | A | "游戏搭子"最高 ROI 源；首方合规 | **P0** |
| **3.6** | 游戏数据 - 实时事件 | game_session / game_event.stream / duration_signal / event_emotion_tag | A | 即时反应"刚死 / 刚通关"；事件级情绪锚（v2.6 新增） | **P0** |
| **3.7** | VLM 视觉理解 | semantic_tags / user_visible_summary（前台单 app 实例 opt-in） | A | 陪玩 / 陪看视频；三档混合（CNN + 量化 7-8B VLM + 云端兜底） | **P1** |
| **3.8** | 当前上下文 current_context | activity_topic / mood_estimate / interrupt_suitability / attention_target / confidence | A | 此刻该不该开口的统一决策入口 | **P0** |
| **3.9** | Profile 元字段 profile_meta | confidence / source_category / first_seen / user_corrected / decay_score / feedback_history | A | 区分"用户说过"vs"LLM 猜的"；避免假记忆 | **P0** |
| **3.10** | 系统音频派生信号 | A0（BPM / 能量 / 节拍） + A1（Now Playing 标识） | A | "随音乐舞动"愿景；不录原音频 | **P1** |
| **3.11** | Playwright 受限放行 | tool_call 一次性结果（曲名 / 收藏页 / 已登录页） | A | 用户主动查询的细节兜底 | **P2** |
| **3.12** | OS Scripting Bridge | osascript / PowerShell COM；仅读元数据 | A | 替代缺失 MCP 的工作 / 娱乐 app 通道 | **P1** |
| **3.13** | 高光事件 highlight_event | 高光记忆显式数据类（v2.6） | A | 日记沉淀 + 画像页"我们的高光记忆"模块 | **P1** |
| **3.14** | 用户偏好 user_preferences | 5 子对象（companion_style / emotion_response / content_type / diary_style / privacy_grants） | A | 画像页"陪伴方式 / 情绪偏好 / 内容偏好 / 日记风格 / 隐私授权" | **P1** |
| **3.15** | 用户画像 profile 扩展 | gameplay_motivation[] / gameplay_motivation_candidates[] / gameplay_style_tags[] | A | 画像页"游戏目标 / 游戏习惯"枚举标签 | **P1** |
| **3.16** | 游戏人格测定 game_persona_assessment | persona_label / similarity_breakdown / evidence_strength / user_feedback | A | 画像页"游戏人格测定"+ 分享卡片；接入公司既有平台 | **P1 候选**（待 4 条前置） |
| **3.17** | 关系成长视图 relationship_stats | companion_days / counts / relationship_level / milestone_unlocked（派生） | A | 画像页"关系成长系统"纪念性展示 | **P1** |
| **3.18** | B 类消费侧动态生成（**不进 memory schema**） | 日记正文 / pet_observation / 对话回复 / 分享卡片文案 / 等 8 项 | B | 受桌宠 IP / 场景影响每次生成 | 各消费方实现 |

### 2.2 6 通道接入总览（§ 3.4 展开）

| 通道编号 | 通道名 | 用途 | 优先级 | 详见 |
|---|---|---|---|---|
| **C-1** | MCP（APP 暴露的 MCP server） | 工作 / 娱乐 app 元数据 | P1 | § 3.4 子节 MCP |
| **C-2** | OS 级 API | UserActivity / Recent Files / Notification Center / Calendar / 设备状态 / Now Playing | P0-P1 | § 3.4 子节 OS API |
| **C-3** | 浏览器扩展 + Native Messaging | 6 类 tab 身份识别（视频 / 购物 / 阅读 / 学习 / 社交 / 工作） | P1 | § 3.4 子节 浏览器 |
| **C-4** | OS Scripting Bridge | macOS osascript / Windows PowerShell COM；仅读元数据 | P1 | § 3.12 |
| **C-5** | CLI 工具调用 | 公开 CLI 子集（用户授权 OAuth scope 内） | P1 子集 + P2 探索 | § 3.4 子节 CLI |
| **C-6** | IFTTT / Zapier / Make webhook | 用户自配置 webhook 桥接 | P2 探索 | § 3.4 子节 IFTTT |

每通道**独立开关 + 默认关闭 + Memory Center 可见 + 用户单独授权**。

### 2.3 信号分级总览

#### 行为档 A 分级（§ 3.3）

| 档 | 名称 | 允许 | 详见 |
|---|---|---|---|
| A1 | 派生输入指标（强度 / 节奏 / 切换 / 鼠标 burst / 多屏） | ✅ | § 3.3 |
| A2 | OS 级操作语义事件（save / copy / undo / fullscreen / lock / new_window / new_tab / app_install / window_arrange） | ✅ | § 3.3 |
| A3 | 编辑动作派生（IME / undo_redo rate / 编辑会话时长 / burst frequency） | ✅ | § 3.3 |

#### 音频 A 分级（§ 3.10）

| 档 | 名称 | 允许 | 详见 |
|---|---|---|---|
| A0 | 派生信号（BPM / 能量 / 节拍） | ✅ 用户授权 + UI 指示 | § 3.10 |
| A1 | Now Playing 标识（曲名 / 节目名 / 时长 / 时间戳） | ✅ 用户自选 | § 3.10 |
| A2 | 音频内容 / 语音识别 / 麦克风 | ❌ 任何优先级不允许 | — |
| A3 | 完整音频流持久化 | ❌ 不允许 | — |

#### 键盘 L 分级（§ 3.3）

| 档 | 名称 | 允许 | 详见 |
|---|---|---|---|
| L0 | 输入存在性 / 时间分布 | ✅ | § 3.3 |
| L1 | 桶化派生指标 | ✅ | § 3.3 |
| L1.5 | 操作语义事件 + 编辑动作派生 | ✅（v2.5 新增） | § 3.3 |
| L2 | 字符级原始按键流 | ❌ 任何形式不允许 | — |
| L3 | 含上下文的按键流 | ❌ 不允许 | — |

### 2.4 优先级总览

| 优先级 | 模块 |
|---|---|
| **P0** | § 3.1 聊天 / § 3.2 PC 进程 / § 3.3 行为（部分） / § 3.5 idip / § 3.6 实时事件 / § 3.8 current_context / § 3.9 profile_meta |
| **P1** | § 3.3 行为（A1-A3 全档） / § 3.4 MCP+OS API+浏览器 / § 3.7 VLM / § 3.10 音频派生 / § 3.12 OSA / § 3.13 高光 / § 3.14 偏好 / § 3.15 画像扩展 / § 3.16 人格测定（候选） / § 3.17 关系成长 |
| **P2** | § 3.4 CLI / IFTTT / § 3.11 Playwright |

---

## 3. 数据需求详解

> 每个模块包含：**说明**（用途 + 来源驱动）/ **字段表**（编号 / 字段 / A/B / 类型 / 派生方式 / 优先级 / 用途）/ **边界**（如有隐私 / 红线）/ **Schema 示例**（简化 JSON；完整 mock 索引见 § 4.4）。

---

### 3.1 聊天数据 chat

#### 说明

桌宠与用户对话的**三层抽象**：原子事实（atomic_facts）→ 情节摘要（episode）→ 用户画像（profile）；外加情绪推导（emotion_signal）。是"知心好友"维度的核心数据。

**采集源**：用户与桌宠的对话（首方），**不读取**用户与第三方 IM / 邮件的聊天。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `atomic_facts[]` | A | 数组（structured） | AI 派生层（LLM 抽取） | P0 | 短期对话引用："你刚说过 …" |
| 2 | `episode.title` + `episode.content` + `episode.time_range` + `episode.participants` | A | 对象 | AI 派生层（LLM 摘要） | P0 | 跨日 / 跨 session 召回 |
| 3 | `profile.summary` | A 常驻 + B 触发更新 | string | LLM 生成 + 用户点"重新总结"触发重写 | P0 | 风格定调 |
| 4 | `profile.interests[]` / `profile.preferences[]` | A | 数组 | LLM 抽取 + ✅ 用户可改 | P0 | 主动话题选取 |
| 5 | `profile.behavior_patterns[]` | A | 数组 | LLM 抽取 | P0 | 时机判断 |
| 6 | `profile.key_facts[]` | A | 数组 | LLM 候选 + ✅ 用户确认才生效 | P0 | 重要事实优先注入对话上下文 |
| 7 | `profile.personality_traits[]` | A | 数组 | LLM 推断 + ✅ 用户"不像我"标记（不可直接编辑） | P0 | 个性描述 |
| 8 | `emotion_signal` | A | enum (紧张/兴奋/沮丧/平静) | AI 派生（AI Eval § 3.4） | P0 | 决定语气 |
| 9 | `atomic_facts.quote_eligible`（v2.6 新增） | A | bool | 派生层 PII 检测（正则 + NER） | P0 | 日记引用原话的隐私安全开关 |

#### 边界

1. 采集源仅限**用户与桌宠的对话**；不读第三方 IM / 邮件。
2. 保留时长：`atomic_facts` ≤ 90 天可配置；`episode` ≤ 180 天可配置；`profile` 用户删除前保留。
3. 用户可在 Memory Center 按 segment 删除 / 纠错 / 标"不再这样记"。
4. 引用 `atomic_facts` 时必须使用 `quote_eligible = true` 的子集（PII 检测）。

#### Schema 示例

```json
{
  "data_source": "chat",
  "player_id": "player_a1c93f01",
  "atomic_facts": [
    {
      "fact": "用户喜欢稳定策略",
      "quote_eligible": true,
      "meta": {"confidence": 0.85, "source_category": "chat"}
    }
  ],
  "episode": {
    "title": "讨论刺客职业天赋树调整",
    "time_range": {"start": "2026-04-21T09:08Z", "end": "2026-04-21T09:15Z"},
    "participants": ["pet", "user"]
  },
  "emotion_signal": "兴奋"
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.1。

---

### 3.2 行为数据 - PC 传统进程

#### 说明

进程级行为状态，是"游戏搭子"的**基础设施**：判断"在游戏中 vs 在工作中" + 全屏不打断 + 离开识别 + 焦虑场景识别。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `active_app.name` / `bundle_id` / `process_id` | A | 对象 | OS 进程 API 采集 | P0 | "在游戏中"vs"在工作中" |
| 2 | `active_app.is_fullscreen` | A | bool | OS 窗口 API | P0 | 打扰决策："全屏 = 闭嘴" |
| 3 | `idle_signal`（>5min / >10min / >30min 分级） | A | enum | 派生（鼠标 / 键盘 idle 时间） | P0 | "用户离开"判断 |
| 4 | `app_switch_burst` | A | bool / int | 派生（短期切换频率） | P0 | "频繁切换 = 焦虑" |
| 5 | `recent_apps_top3` | A | string[] | 派生（最近 1h 时长 top3） | P0 | "看你今天一直在写代码" |

#### 边界

1. **不**采集 app 内的具体操作内容、文档正文、网页 URL（除非走 MCP 显式暴露）。
2. **不**长期保存原始 app 时间线；只保留状态级摘要。
3. 用户可在 Memory Center 关闭此类别。

#### Schema 示例

```json
{
  "data_source": "behavior_pc",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:15:00Z",
  "active_app": {"name": "VS Code", "bundle_id": "com.microsoft.VSCode", "is_fullscreen": false},
  "idle_signal": "active",
  "input_indicators": {
    "input_intensity_level": "high",
    "app_switch_rate_per_min": 2
  }
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.3。

---

### 3.3 行为数据 - mac / win API UI 信息 & 用户操作

#### 说明

**四源叠加方案**：让桌宠在不触碰键盘输入内容（L2 / L3 红线）的前提下，对"用户当前在做什么"达到 80%+ 感知。**字符级原始按键流（含 hash 后）任何优先级都不允许**。

行为档 A（与 § 3.10 音频 A 是独立命名空间）：
- **A1 派生信号**（强度 / 节奏 / 切换 / 鼠标 burst / 多屏等）
- **A2 操作语义事件**（save / copy_paste / undo / fullscreen / lock / new_window / new_tab / app_install / window_arrange）
- **A3 编辑动作派生**（IME 状态 / undo_redo 频率 / 编辑会话时长 / burst frequency）

#### 字段表（核心）

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `window_title_redacted` | A | string | OS 窗口 API + 脱敏 | P0 | "在 IDE 编辑代码文件" |
| 2 | `ui_text_snapshot`（白名单 app + opt-in） | A | string | OS Accessibility API + buffer | P1 | "屏幕上有错误弹窗" |
| 3 | `focused_element_role` | A | enum | OS 控件 API | P1 | "正在输入"不打扰 |
| 4 | A1 派生指标：`input_intensity_level` / `typing_rhythm_signal` / `mouse_activity_burst` / `mouse_region_heatmap_top3` / `scroll_intensity_signal` 等 | A | 各类型 | 派生（桶化） | P0 + P1 | 专注 vs 休息判断 |
| 5 | A2 语义事件：`semantic_events_v2_5[]`（save / copy / undo / fullscreen / lock / new_window / new_tab / app_install / window_arrange） | A | 数组 | OS Event API（NSApp / Win EVENT_SYSTEM_*） | P1 | "刚保存 / 刚切 app" |
| 6 | A3 编辑派生：`text_edit_action_burst` / `undo_redo_rate_per_min` / `ime_state` / `editing_session_duration_min` / `text_edit_burst_frequency` | A | 各类型 | 派生 | P1 | "在编辑长文档"等 |

#### 边界

1. **L2 / L3 红线**：字符级按键流任何形式不允许（含 hash / 脱敏后）；理由是品牌风险（杀软 / 媒体 / 应用商店）+ keystroke timing attack 不可控。
2. `ui_text_snapshot` 必须白名单 app + 用户 opt-in + 短期 buffer ≤5min；不长期保存。
3. 不读 app 内文档正文、聊天内容、密码框、网页 URL。

#### Schema 示例

```json
{
  "data_source": "behavior_ui",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:20:00Z",
  "window_title_redacted": "在 IDE 编辑代码文件",
  "semantic_events_v2_5": [
    {"type": "save", "at": "2026-04-21T09:19:33Z"},
    {"type": "copy_paste", "at": "2026-04-21T09:19:55Z"}
  ]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.4（A2）+ § 11.4.1（A3）。

---

### 3.4 APP 信号 - 6 通道并存

#### 说明

v2.5 从"仅 MCP"扩展为 **6 通道并存**：MCP 不再是唯一通道。每通道独立开关 + 默认关闭 + Memory Center 可见。

> v2.5 之前：MCP 是唯一接入通道，但生态早期 + 大量主流 app 没 MCP server，导致桌宠"看不见"用户工作 / 娱乐场景。v2.5 引入 5 个并行通道，每通道职责清晰、互相互补。

#### 通道总表

| 通道 | 用途 | 优先级 | 字段（关键） |
|---|---|---|---|
| **C-1 MCP** | app 自暴露 MCP server（最理想） | P1 | `mcp_app_id` / `summary` / `enabled_sources[]` |
| **C-2 OS API** | UserActivity / Recent Files / Notification Center / Calendar / 设备状态 / Now Playing | P0-P1 | 各 OS 公开 API 返回元数据 |
| **C-3 浏览器扩展** | 6 类 tab 身份识别（视频 / 购物 / 阅读 / 学习 / 社交 / 工作） | P1 | `tab_category` / `platform` / `url_domain` / `path_class_hint`（**不读页面内容**） |
| **C-4 OS Scripting Bridge** | macOS osascript / Windows PowerShell COM；仅读元数据 | P1 | 见 § 3.12 |
| **C-5 CLI** | 公开 CLI 子集（用户 OAuth 授权范围内） | P1 子集 + P2 探索 | `tool_name` / `command` / `output_metadata` |
| **C-6 IFTTT / Zapier** | 用户自配置 webhook | P2 探索 | `webhook_endpoint` / `payload_metadata` / 签名验证 |

#### 边界（共同）

1. 每通道**独立开关 + 默认关闭**；用户在 Memory Center 单独授权。
2. **不**采集：消息正文 / 邮件正文 / 文档正文 / 任何文件内容 / 网页内容。
3. 浏览器扩展**不允许 mcp-chrome 类全功能浏览器 MCP**（权限过大）；仅识别 tab 身份。
4. CLI **不调用修改状态类**（如 `spotify play`）；仅 read-only 子集。
5. IFTTT 仅接受用户主动配置 + 签名验证 + 元数据 payload；不接受任意 webhook。

#### Schema 示例（MCP + 浏览器扩展，简化）

```json
{
  "data_source": "mcp_summary",
  "player_id": "player_a1c93f01",
  "mcp_app_id": "dida365",
  "summary": "今天有 3 个待办：API 文档评审 / 周报 / ...",
  "enabled_sources": ["dida365", "feishu", "steam"]
}
```

```json
{
  "data_source": "browser_extension_v2_5",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-05-12T15:00:00Z",
  "active_tab_signal": {
    "tab_category": "video",
    "platform": "bilibili",
    "url_domain": "www.bilibili.com",
    "path_class_hint": "video_play_page"
  },
  "enabled_categories": ["video", "shopping"]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.5（MCP）+ § 11.12（OS API）+ § 11.13（浏览器）。

---

### 3.5 游戏数据 - idip 状态对比

#### 说明

idip 数据对比是"游戏搭子"维度的**最高 ROI 源**：直接来自首方、合规、不涉及隐私越界。提供状态 + delta + anomaly + milestone 四层。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `idip_snapshot` | A | 对象 | 游戏 SDK 推送 | P0 | 角色等级 / 段位 / 通关进度等基础状态 |
| 2 | `idip_delta` | A | 对象 | 派生（与上一时点对比） | P0 | "刚通关" / "段位掉了" / "装备升级" |
| 3 | `idip_anomaly` | A | 对象 | 派生（异常模式识别） | P0 | "3 次同一处失败" / "卡关 5min" |
| 4 | `idip_milestone[]` | A | 数组 | 派生（成就 / 突破点） | P0 | 桌宠主动祝贺的触发点 |
| 5 | `idip_field_metadata` | A | 对象 | 配置 | P0 | 字段语义说明（数字含义） |

#### 边界

1. PII / 敏感字段（真实账号、付费记录、实名信息）**不**进入桌宠记忆。
2. idip 字段语义由记忆系统侧声明（v2 锁定）。
3. **桌宠绑定单游戏**，数据 schema **不带 `game_id`**（多游戏不共享 profile）。

#### Schema 示例

```json
{
  "data_source": "game_idip",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-05-12T20:00:00Z",
  "idip_snapshot": {"level": 88, "rank": "钻石二", "weekly_quest_progress": 4},
  "idip_delta": {"level": "+1", "rank": "升 +1 段位"},
  "idip_milestone": [{"name": "首次到达钻石", "at": "2026-05-12T19:55:33Z"}]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.6。

---

### 3.6 游戏数据 - 实时事件

#### 说明

游戏内实时事件流（pub/sub），桌宠按事件即时反应（你刚死 / 你刚通关 / 你 idle 太久）。**v2.6 新增事件级情绪标签**（日记锚点）。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `game_session.start` / `game_session.end` | A | event | 游戏 SDK | P0 | 知道一局开始结束 |
| 2 | `game_session.in_game_time` | A | timestamp | 游戏 SDK 实时 | P0 | 游戏内时间 |
| 3 | `game_event.stream[]`（open / death / revive / settlement / ...） | A | 事件流 | 游戏 SDK pub/sub | P0 | 桌宠按事件反应 |
| 4 | `game_session.duration_signal`（>30min / >1h / >3h） | A | enum | 派生 | P0 | 健康提示触发 |
| 5 | **`event_emotion_tag`**（v2.6 新增） | A | enum (joy / frustrate / satisfy / sadness / neutral) | 派生层 AI（复用 § 3.1 emotion_signal 模型扩到事件级） | P0 | 日记 / 高光 / 复盘的事件级情绪锚点 |
| 6 | **`episode.highlight_score`**（v2.6 新增；派生到 § 3.1 episode） | A | float (0-1) | 派生层规则代码（idip_milestone × emotion_strength × user_action 加权） | P0 | 日记筛选阈值 + 高光候选输入 |

#### 边界

1. memory 应做去重 + 时序整理后再交付桌宠。
2. 推送式（pub/sub）优于轮询。
3. `event_emotion_tag` 与 § 3.8 `current_context.mood_estimate` 互补（事件级 vs 5min 滑窗级）。

#### Schema 示例

```json
{
  "data_source": "game_event",
  "player_id": "player_a1c93f01",
  "stream": [
    {"type": "death", "at": "2026-05-12T20:15:33Z", "event_emotion_tag": "frustrate"},
    {"type": "settlement", "at": "2026-05-12T20:30:00Z", "event_emotion_tag": "satisfy",
     "result": "win", "highlight_score": 0.82}
  ]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.7。

---

### 3.7 VLM 视觉理解

#### 说明

VLM 单 app 实例开关（类别含游戏 + 视频），仅在用户**逐 app 主动开启**时启用。**三档混合架构**（CNN 初筛 + 量化 7-8B VLM 兜底 + 云端最终兜底）。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `vlm_enabled_for_this_app_instance` | A | bool | 用户设置 | P1 | 每个 app 实例独立开关 |
| 2 | `app_category` | A | enum (game / video) | 用户配置 | P1 | 区分游戏类 vs 视频类规则 |
| 3 | `semantic_tags[]` | A | string[] (≤5) | VLM 派生 | P1 | 场景标签（boss_fight / low_hp / scene_funny / 等） |
| 4 | `user_visible_summary` | A | string (≤50 字) | VLM 派生 | P1 | "刚才那段是搞笑剧情" |

#### 边界

1. **依赖链**：§ 3.2 `active_app`（哪个 app）→ § 3.7 VLM 是否启动 → § 3.7 看到的场景标签。VLM **不靠画面猜 app 身份**。
2. **前置依赖**：`active_app` 匹配预设标识；不匹配 → VLM 不启动。
3. 视觉帧 buffer ≤ 60s；**不持久化原图**。
4. 默认本地推理；云端**两层授权**（onboarding 总开关 + 每次激活前用户显式确认本次上传）；任一缺失则降级 `unknown`。
5. 每次 VLM 激活时桌宠 UI 必须明显指示"正在看屏幕"。
6. 输出限制：`semantic_tags ≤ 5`；`user_visible_summary ≤ 50 字`；**不**输出用户身份 / 账号 / 聊天内容 / 字幕原文。
7. 跨实例隔离：每个 app 实例的 VLM 输出独立写入对应 app 记忆，**不跨实例聚合 / 不跨 app 推断**。

#### Schema 示例

```json
{
  "data_source": "game_vlm",
  "player_id": "player_a1c93f01",
  "vlm_enabled_for_this_app_instance": true,
  "app_category": "game",
  "snapshot_at": "2026-05-12T20:18:00Z",
  "semantic_tags": ["boss_fight", "low_hp"],
  "user_visible_summary": "BOSS 战残血，紧张时刻"
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.8。

---

### 3.8 当前上下文 current_context

#### 说明

桌宠决策需要**实时切面**（5-15min 滑窗），是"此刻该不该开口"的统一决策入口。把"打扰决策"集中到 `interrupt_suitability` 一个字段，避免每个调用点各自重算。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `activity_topic` | A | string | 派生（滑窗摘要） | P0 | 桌宠对话的话题锚 |
| 2 | `mood_estimate` | A | enum (紧张 / 平静 / 兴奋 / 沮丧) | 派生（滑窗 AI） | P0 | 决定语气 |
| 3 | `interrupt_suitability` | A | enum (high / medium / low) | 派生（综合判断） | P0 | 打扰决策唯一输入 |
| 4 | `attention_target` | A | enum (游戏 / IDE / 视频 / ...) | 派生（实时） | P0 | 桌宠决定看哪个屏幕方向 |
| 5 | `confidence` | A | float | 元字段 | P0 | 低置信时桌宠保守 |
| 6 | `trigger` | A | enum (activity_topic_change / mood_change / interrupt_change / heartbeat) | 系统 | P0 | 推送原因 |

#### 边界

1. 默认滑窗 **5 分钟**（v2 锁定）。
2. 推送策略：变化超阈值立即推送；无变化 30s 心跳。
3. `confidence` 字段防止 LLM 低信息密度时段过度推测。

#### Schema 示例

```json
{
  "data_source": "current_context",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-05-12T20:20:00Z",
  "activity_topic": "在打游戏 BOSS 战",
  "mood_estimate": "紧张",
  "interrupt_suitability": "low",
  "attention_target": "游戏",
  "confidence": 0.85,
  "trigger": "mood_change"
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.9。

---

### 3.9 Profile 元字段 profile_meta

#### 说明

每条 profile 字段附带元字段，**区分"用户说过"vs"LLM 猜的"**。一次假记忆穿帮 ≈ 5 次正向体验，这是体验底线，必须从 schema 解决。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `confidence` | A | float (0-1) | 派生（规则 + LLM 混合，min 保守） | P0 | 桌宠引用前判断"是否说出来" |
| 2 | `source_category` | A | enum (chat / user_confirmed / game_event / behavior / mcp / vlm / llm_inferred) | 系统 | P0 | Memory Center 来源解释 |
| 3 | `first_seen_at` / `last_confirmed_at` | A | timestamp | 系统 | P0 | 时效衰减 |
| 4 | `user_corrected` | A | bool | 用户操作 | P0 | 纠错过的不再自动写回 |
| 5 | `decay_score` | A | float | 派生（时间衰减） | P0 | 桌宠不用自己做衰减逻辑 |
| 6 | **`feedback_history[]`**（v2.6 新增） | A | 数组 [{feedback_type, at, weight_impact}] | 系统自动写 | P1 | 反馈反哺闭环（画像模块 15）|

#### Confidence 计算（v2 锁定）

```
confidence_rule（基于 source_category）:
  user_confirmed = 1.0
  game_event     = 0.9
  mcp            = 0.7
  chat           = 0.6
  behavior       = 0.5
  vlm            = 0.5
  llm_inferred   = 0.3

confidence_llm = LLM 自评 (0-1)

confidence = min(confidence_rule, confidence_llm) × decay_factor
```

#### Schema 示例

```json
{
  "value": "稳定策略",
  "meta": {
    "confidence": 0.7,
    "source_category": "chat",
    "first_seen_at": "2026-04-21T09:10:00Z",
    "last_confirmed_at": "2026-04-21T09:10:00Z",
    "user_corrected": false,
    "decay_score": 0.95,
    "feedback_history": [{"feedback_type": "correct", "at": "2026-04-22T10:00:00Z", "weight_impact": "+0.05"}]
  }
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.2 (profile + profile_meta)。

---

### 3.10 系统音频派生信号

#### 说明

实现"随音乐舞动"愿景。**只覆盖系统音频流的派生信号 + Now Playing 元数据**，不包含麦克风 / STT / TTS（归 voice-interaction 分支）。

音频 A 分级（与 § 3.3 行为档 A 是独立命名空间）：
- **A0**：派生信号（BPM / 能量 / 节拍点 / 静音状态） ✅ 用户授权 + UI 指示
- **A1**：Now Playing 标识（曲名 / 节目名 / 时长 / 时间戳） ✅
- **A2**：音频内容 / 语音识别 / 麦克风 ❌
- **A3**：完整音频流持久化 ❌

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | A0 `bpm` | A | float | 本地音频处理（aubio / BeatNet） | P1 | 节拍 sync |
| 2 | A0 `energy_curve` | A | float[] | 本地音频处理 | P1 | 强度变化 |
| 3 | A0 `beat_points[]` | A | timestamp[] | 本地音频处理 | P1 | 节拍点 |
| 4 | A0 `mute_state` | A | bool | OS API | P1 | 静音感知 |
| 5 | A1 `now_playing.title` / `artist` / `duration` / `position` | A | 对象 | OS MediaRemote (macOS) / SMTC (Win) | P1 | "刚才那首歌叫什么" |

#### 边界

1. A0 派生计算**必须本地**，**不持久化原始音频流**（仅保留派生标量）。
2. A0 不识别说话内容 / 不识别歌词 / 不识别人声 vs 乐器。
3. A0 启用时桌宠 UI 必须显示"已启用音频节拍监听"指示。
4. A2 / A3 任何优先级不允许；新增提议必须走项目级决策。
5. **必须**在 PRIVACY_BOUNDARY 修订提案（Deferred）中合并审议。

#### Schema 示例

```json
{
  "data_source": "audio_derived",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-05-12T21:00:00Z",
  "a0": {"bpm": 128, "energy_level": "high", "mute_state": false},
  "a1": {"title": "Don't Stop Me Now", "artist": "Queen", "duration_s": 209, "position_s": 33}
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.10。

---

### 3.11 Playwright 受限放行

#### 说明

从 v2.2 的"完全禁止"调整为 **P2 受限放行**：仅在用户**主动查询**时一次性返回（曲名 / 收藏列表 / 已登录页面数据）。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `tool_call_id` | A | string | 系统 | P2 | 一次性查询 ID |
| 2 | `result_snippet` | A | string | Playwright + 用户主动触发 | P2 | "刚才那首歌叫什么"答案 |
| 3 | `ttl_until` | A | timestamp | 系统（buffer ≤5min） | P2 | 短期 buffer |

#### 边界（7 条）

1. 仅在用户主动查询时触发（非后台轮询）。
2. OS keychain 凭证；不存明文 token。
3. tool_call 一次性结果；buffer ≤5min。
4. **不写入 long-term profile / atomic_facts / episode**（仅本次对话使用）。
5. 单 app 用户授权；不允许跨 app 抓取。
6. 全屏游戏中**不**触发 Playwright。
7. 失败回退"暂时没拿到"，不假装结果。

#### Schema 示例

```json
{
  "data_source": "playwright_tool_result",
  "player_id": "player_a1c93f01",
  "tool_call_id": "tc_20260512_001",
  "result_snippet": "刚才那首歌是 Queen - Don't Stop Me Now",
  "ttl_until": "2026-05-12T21:05:00Z"
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.11。

---

### 3.12 OS Scripting Bridge

#### 说明

C-4 通道：**macOS osascript / AppleScript + Windows PowerShell COM Automation**，替代缺失 MCP 的主要工作 / 娱乐 app 通道。仅读元数据；用户系统授权 + Memory Center 单 app 开关。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `bridge_kind` | A | enum (osascript_applescript / powershell_com) | 系统 | P1 | macOS / Win 平台 |
| 2 | `user_authorized_apps[]` | A | string[] | 用户授权 | P1 | 桌宠允许 OSA 接入的 app |
| 3 | `samples[]` | A | 数组 [{app, field, value, ttl_until}] | osascript / COM 调用 | P1 | 元数据样本 |
| 4 | `ui_indicator_shown_per_app[]` | A | string[] | 合规检查 | P1 | UI 启用指示 |

#### 边界

1. 仅读：`now_playing` / `recent_documents` / `unread_count` / `app_state` / `browser_current_tab` 等元数据；**不允许写**（如 `tell spotify to play`）。
2. **不读取**：消息正文 / 邮件正文 / 文档正文 / 任何文件内容。
3. 短期缓存 ≤1h；长期仅保留聚合摘要。
4. `ui_indicator_shown_per_app` 是合规检查项：启用 OSA 桥接时桌宠 UI 必须显示对应可见提示。
5. 与 § 3.10 A1 互补：A1 走 OS Now Playing（系统级），OSA 走 app 间脚本（app 级）。

#### Schema 示例

```json
{
  "data_source": "osa_bridge",
  "player_id": "player_a1c93f01",
  "bridge_kind": "osascript_applescript",
  "user_authorized_apps": ["Spotify", "Notes", "Outlook"],
  "samples": [
    {"app": "Spotify", "field": "now_playing", "value": "Queen - Don't Stop Me Now", "ttl_until": "2026-05-12T22:00:00Z"},
    {"app": "Notes", "field": "recent_documents", "value": ["读书笔记 / 项目计划"], "ttl_until": "2026-05-12T22:00:00Z"}
  ]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.14。

---

### 3.13 高光事件 highlight_event（v2.6 新增）

#### 说明

服务**日记沉淀**+ 画像页"我们的高光记忆"模块。现有 `episode`（叙事段落）+ `idip_milestone`（小颗粒成就）+ `game_event` 各自有用，但**没有显式"高光"数据类**导致下游各自重算口径不一致。

`highlight_event{}` 是 § 3.1 / § 3.5 / § 3.6 / § 3.7 / § 3.8 上层的合成抽象：从底层数据中**选 + 归类 + 加 PII 检测 + 标可分享性**，一次合成多方复用。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `highlight_id` | A | string | 系统 | P1 | 主键 |
| 2 | `title` | A | string | LLM 候选 + ✅ 用户可编辑 | P1 | 标题（≤20 字） |
| 3 | `time` | A | timestamp | 系统 | P1 | 事件时间 |
| 4 | `scene` | A | string | LLM 派生（active_app + window_title + game_vlm.tags 合成） | P1 | 场景描述 |
| 5 | `event_summary` | A | string | LLM 生成 + ✅ 用户可编辑 | P1 | 摘要（≤80 字；引用 atomic_facts 必须 quote_eligible=true） |
| 6 | `category` | A | enum (achievement / growth / emotion / social / collection / relationship) | LLM 推荐 + ✅ 用户可改 | P1 | 高光分类 |
| 7 | `tags[]` | A | string[] (≤5) | LLM 候选 + ✅ 用户可改 | P1 | 自由标签 |
| 8 | `source` | A | enum (idip_milestone / episode_highlight_score / user_starred / persona_result) | 系统 | P1 | 触发来源 |
| 9 | `privacy_level` | A | enum (private / shareable) | 用户默认（来自 user_preferences.privacy_grants）+ ✅ 可改 | P1 | 分享性 |
| 10 | `pinned` | A | bool | 用户输入 | P1 | 置顶 |
| 11 | `evidence_ids[]` | A | string[] | 系统（指向 episode / game_event / idip_milestone / atomic_facts ID） | P1 | 反查实证（分享卡片 / 复盘） |

#### 派生触发时机

| 触发 | 派生策略 |
|---|---|
| `idip_milestone` 命中 | 立即生成（`source = idip_milestone`） |
| `episode.highlight_score ≥ 阈值（默认 0.7）` | 立即生成（`source = episode_highlight_score`） |
| `game_persona_assessment` 完成 | 生成 1 条标记（`source = persona_result`，`category = growth`） |
| 用户在 Memory Center 主动收藏 | 立即写入（`source = user_starred`） |

#### 边界

1. **不含字段**：`game`（桌宠绑定单游戏前提）/ `pet_observation`（B 类，§ 3.18 处理，受桌宠 IP 影响每次按 IP 生成）。
2. `event_summary` 引用 atomic_facts 时必须使用 `quote_eligible = true` 的子集。
3. 用户编辑 title / event_summary / category / tags / privacy_level 后 `user_corrected = true`，LLM 不再覆盖。
4. 用户删除 → 软删除（标 `deleted_at`），保留可恢复 ≤30 天。

#### Schema 示例

```json
{
  "data_source": "highlight_event",
  "player_id": "player_a1c93f01",
  "highlight_id": "hl_2026042100001",
  "title": "首次单杀王者打野",
  "time": "2026-04-20T22:15:33Z",
  "scene": "王者荣耀 - 河道遭遇战",
  "event_summary": "在野区被对方打野针对 3 次后，第 4 次反蹲成功完成单杀",
  "category": "achievement",
  "tags": ["反蹲", "单杀", "首次"],
  "source": "idip_milestone",
  "privacy_level": "shareable",
  "pinned": true,
  "evidence_ids": ["game_event_2026042100872", "idip_milestone_2026042100015"]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.15。

---

### 3.14 用户偏好 user_preferences（v2.6 新增）

#### 说明

服务画像页**模块 4 / 5 / 6 / 9 / 14**（陪伴方式 / 情绪偏好 / 内容偏好 / 日记风格 / 隐私授权）。这些是**用户主动设置**，**不是采集数据**；但偏好需要持久化 + 与画像数据互通 + 受 PRIVACY_BOUNDARY 管控，因此放 memory 层（与 profile 并列）。

#### 5 子对象总览

| 子对象 | 服务画像模块 | LLM 介入 |
|---|---|---|
| `companion_style` | #4 宠物怎么陪我 | ❌ 禁止自动 |
| `emotion_response` | #5 情绪响应偏好 | ❌ 禁止自动 |
| `content_type` | #6 内容偏好 | ⚠️ 反馈学习推荐，**显式开关优先** |
| `diary_style` | #9 日记偏好 | ❌ 禁止自动 |
| `privacy_grants` | #14 隐私与授权 | ❌ **严格禁止自动**，✅ 强制用户主动 |

#### 字段表（精简，子对象详见 Schema 示例）

| 子对象 | 关键字段 | 类型 | 优先级 |
|---|---|---|---|
| `companion_style` | disturb_intensity / post_game_summary_freq / streak_loss_strategy / streak_win_strategy / idle_interact_freq / activity_remind_freq / reflection_granularity | enum × 7 | P1 |
| `emotion_response` | streak_loss_react / team_mate_impact_react / want_reflection_on_loss / accept_jokes / want_quiet_companion / love_encouragement | enum + bool × 6 | P1 |
| `content_type` | enabled[] / priority[] / feedback_signal[] | 数组 × 3 | P1 |
| `diary_style` | frequency / length / focus / perspective / quote_user_original / record_failure / shareable_version | enum + bool × 7 | P1 |
| `privacy_grants` | behavior_data / chat_content / diary / highlight / persona_assessment / cloud_sync 各项 | {granted: bool, granted_at, revoked_at} × 6 | P1 |

#### 边界

1. **`privacy_grants.*` 默认全 false**；用户在 Memory Center 隐私页主动勾选才开启；撤回时 `revoked_at = now`，不删历史数据。
2. `companion_style` / `emotion_response` / `diary_style` 任何字段 LLM **严格禁止自动猜测 / 写入**。
3. `content_type.enabled` 是用户显式开关；`feedback_signal` 仅用于权重学习，**不直接覆盖 enabled**。
4. **与 PRIVACY_BOUNDARY 关系**：user_preferences.privacy_grants 是项目级硬约束的**二级开关**，**不能放宽**硬约束（如不能通过它开启麦克风录制 — 麦克风归 voice-interaction）。

#### Schema 示例

```json
{
  "data_source": "user_preferences",
  "player_id": "player_a1c93f01",
  "schema_version": "0.1.0",
  "last_updated_at": "2026-05-12T14:30:00Z",
  "companion_style": {
    "disturb_intensity": "low",
    "post_game_summary_freq": "streak",
    "streak_loss_strategy": "comfort_first",
    "reflection_granularity": "brief"
  },
  "emotion_response": {
    "want_reflection_on_loss": false,
    "accept_jokes": true,
    "love_encouragement": true
  },
  "content_type": {
    "enabled": ["light_reflection", "emotion_companion", "diary"],
    "feedback_signal": [{"type": "tactical_advice", "action": "dislike", "at": "2026-05-10T20:01:00Z"}]
  },
  "diary_style": {"frequency": "event_driven", "length": "medium", "perspective": "pet_third_person"},
  "privacy_grants": {
    "behavior_data": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null},
    "persona_assessment": {"granted": false, "granted_at": null, "revoked_at": null}
  }
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.16。

---

### 3.15 用户画像 profile 扩展（v2.6 新增）

#### 说明

服务画像页**模块 2"我的游戏习惯"+ 模块 3"我的游戏目标"**。现有 `profile.interests` / `preferences` 是自由文本，画像页无法做"标签开关 / 多选 / 反馈"交互 → 补**枚举级标签**。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `profile.gameplay_motivation[]` | A | enum 多选 (rank / chill / social / collect / story / practice_char / play_with_friends) | ✅ 用户多选确认 | P1 | 模块 3"我的游戏目标" |
| 2 | `profile.gameplay_motivation_candidates[]` | A | enum 多选 | LLM 推断候选（与 #1 字段独立） | P1 | UI 展示候选给用户勾选 |
| 3 | `profile.gameplay_style_tags[]` | A | enum 多选 (outcome_sensitive_high/mid/low / solo_lean / squad_lean / growth_stage_early/mid/late) | LLM + behavior 派生 + ✅ 用户可改 | P1 | 模块 2"我的游戏习惯" |

#### 派生触发时机

| 字段 | 触发 |
|---|---|
| `gameplay_motivation_candidates[]` | 每 7 天 / chat 累计 ≥ N 条新对话 / 用户进画像页 |
| `gameplay_style_tags[]` | 每 N 局后增量更新；变化时通知 Memory Center 显示"画像更新了" |

#### 用户操作

1. **模块 3 流程**：UI 展示 candidates → 用户多选 → 写回 motivation[]（`user_corrected = true`）。
2. **模块 2 流程**：UI 展示 style_tags → 用户编辑覆盖 → `user_corrected = true`。
3. 用户标"不准" → 进 `profile_meta.feedback_history`，LLM 下次降权。

#### Schema 示例

```json
{
  "data_source": "profile",
  "player_id": "player_a1c93f01",
  "gameplay_motivation": ["rank", "play_with_friends"],
  "gameplay_motivation_candidates": ["rank", "play_with_friends", "practice_char"],
  "gameplay_style_tags": ["outcome_sensitive_high", "squad_lean", "growth_stage_mid"]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.2（扩展段）。

---

### 3.16 游戏人格测定 game_persona_assessment（v2.6 新增；P1 候选 — 待 4 条前置）

#### 说明

服务画像页**模块 10 / 11**"游戏人格测定 + 角色相似度"。**接入公司既有外部人格测定平台**（每游戏定制，非通用 MBTI）。memory 是结果存储方，不是计算方。

#### 前置 4 条件（升 P1 前必须满足）

| # | 条件 | 责任方 | 不通过 |
|---|---|---|---|
| 1 | 公司既有能力**输入字段清单**与 memory schema 对账 | Engineering + 公司平台对接 | 缺字段补字段（必须过 PRIVACY_BOUNDARY） |
| 2 | **最少数据量门槛** + **当前线上准确率**（用户反馈"像我"率 ≥70%） | 公司平台 + Engineering | 低于阈值不显示 / 准确率不达标 Beta 不上 |
| 3 | **重测策略**：游戏版本更新（meta 漂移）后旧结果如何处置 | 公司平台 | 需要 `persona_schema_version` 字段，旧版本标过期 |
| 4 | **法务 / 合规**：跨产品平台调用 + 账号体系打通 | 法务 + 公司平台 | 跨边界需用户显式同意 |

#### 4 条 PM 红线（任何情况下守住）

| # | 红线 | 理由 |
|---|---|---|
| 1 | **persona 不作为陪伴策略的直接驱动信号** | 桌宠陪伴只看 `user_preferences.companion_style` + `current_context` + `emotion_signal`，**不**读 persona_label 调语气；防过拟合 |
| 2 | **persona 不反向污染采集层** | persona 是消费层，不影响 memory 写入逻辑 |
| 3 | **桌宠绑定单游戏前提，schema 不含 game_id** | 跨游戏 persona 聚合不存在 |
| 4 | **`evidence_strength ≥ 3` 红线** | 必须 ≥3 条 game_event / idip_milestone 数据点支持，否则不展示 |

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `assessment_id` | A | string | 系统 | P1 候选 | 主键 |
| 2 | `persona_label` | A | string | 公司既有平台 | P1 候选 | 人格标签（如"团战指挥型"） |
| 3 | `persona_schema_version` | A | string | 公司平台 | P1 候选 | 分类体系版本（meta 漂移检测） |
| 4 | `similarity_breakdown[]` | A | 数组 [{candidate, score, evidence_ids[]}] | 公司平台 | P1 候选 | 候选人格相似度 + 证据 IDs |
| 5 | `assessment_at` | A | timestamp | 系统 | P1 候选 | 测定时间 |
| 6 | `data_window` | A | {from, to, session_count} | 系统 | P1 候选 | 测定数据窗口 |
| 7 | `user_feedback` | A | enum (accepted / rejected / not_like_me / null) | ✅ 用户 | P1 候选 | 反哺下次测定权重 |
| 8 | `evidence_strength` | A | int | 系统 | P1 候选 | 支持证据条数（**≥3 红线**） |
| 9 | `is_expired` | A | bool | 派生（基于 persona_schema_version） | P1 候选 | 旧版本测定过期标记 |

#### 接入流程

```
memory.game_event[] + memory.idip_milestone[] + memory.chat (部分)
                  │
                  ▼
        [ 公司既有人格测定平台 ]（外部，跨边界）
                  │
                  ▼
memory.game_persona_assessment{} (stored 结果)
                  │
                  ▼
画像页模块 10 / 11 UI 展示（B 类消费侧 LLM 生成"为什么像 TA"文案，见 § 3.18 #6）
```

#### 失败处理

1. 数据量 < `evidence_strength` 红线 → UI 显示"测定中（继续陪你玩更多游戏后再测）"，**不强行给结果**。
2. 公司平台调用失败 → 重试 ≤3 次 / 自动降级显示"测定服务繁忙"；**不**用 LLM 编造测定结果。
3. 用户反馈 `not_like_me` 率 > 30% → Engineering 告警 + 数据上报；不达标 Beta 下架。

#### Schema 示例

```json
{
  "data_source": "game_persona_assessment",
  "player_id": "player_a1c93f01",
  "assessment_id": "persona_2026051200001",
  "persona_label": "团战指挥型",
  "persona_schema_version": "honor_of_kings_persona_v2.3",
  "similarity_breakdown": [
    {"candidate": "团战指挥型", "score": 0.87, "evidence_ids": ["game_event_2026050800123", "idip_milestone_2026050900045", "game_event_2026051001288"]},
    {"candidate": "野区入侵型", "score": 0.42, "evidence_ids": ["game_event_2026050900076"]}
  ],
  "assessment_at": "2026-05-12T15:00:00Z",
  "data_window": {"from": "2026-04-12T00:00:00Z", "to": "2026-05-12T00:00:00Z", "session_count": 62},
  "user_feedback": null,
  "evidence_strength": 4,
  "is_expired": false
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.17。

---

### 3.17 关系成长视图 relationship_stats（v2.6 新增）

#### 说明

服务画像页**模块 12"关系成长系统"**。纯派生计数，**不是新原子数据**；memory 提供派生视图 API，消费方查询时实时算（或缓存）。

#### 字段表

| # | 字段 | A/B | 类型 | 派生方式 | 优先级 | 用途 |
|---|---|---|---|---|---|---|
| 1 | `companion_days` | A | int | `first_install_at` → `now`（按日历日） | P1 | 陪伴天数 |
| 2 | `co_game_session_count` | A | int | `count(game_event.session)` | P1 | 共同对局数 |
| 3 | `diary_count` | A | int | `count(episode WHERE highlight_score ≥ diary_threshold)` | P1 | 日记数 |
| 4 | `highlight_count` | A | int | `count(highlight_event WHERE deleted_at IS NULL)` | P1 | 高光数 |
| 5 | `persona_assessment_count` | A | int | `count(game_persona_assessment)` | P1 | 测定次数 |
| 6 | `relationship_level` | A | int | 上述指标加权派生（公式 Engineering 决） | P1 | 关系等级 |
| 7 | `milestone_unlocked[]` | A | string[] | 派生（7d / 30d / 100d / 365d / 首次高光 / 首次测定 等） | P1 | 已解锁里程碑 |
| 8 | `milestone_pending[]` | A | string[] | 派生（未达成清单） | P1 | 待解锁里程碑（纪念性） |

#### 边界

1. 派生视图，**不持久化原子存储**；查询时实时算 / 缓存。
2. relationship_level 计算公式建议**指数衰减**（首 30 天涨快，后续递减），避免老用户卡级。
3. milestone_unlocked 触发时通知 Memory Center 显示纪念卡片（**不强制弹窗**）。
4. **PM 边界**：纯纪念性，**不做强压力任务**；不出现"未完成任务 / 必须达成 X 才能解锁"压力 UI。

#### Schema 示例

```json
{
  "data_source": "relationship_stats",
  "player_id": "player_a1c93f01",
  "computed_at": "2026-05-12T16:00:00Z",
  "companion_days": 41,
  "co_game_session_count": 62,
  "diary_count": 18,
  "highlight_count": 7,
  "persona_assessment_count": 1,
  "relationship_level": 12,
  "milestone_unlocked": ["first_install", "companion_7d", "first_highlight", "companion_30d", "first_persona_assessment"],
  "milestone_pending": ["companion_100d", "highlight_count_10", "diary_count_30"]
}
```

> 完整 mock 见 REQUIREMENT_CLARIFICATION § 11.18。

---

### 3.18 B 类消费侧动态生成（**不进 memory schema**）

#### 说明

此节列出**所有不进 memory schema 但需要 memory 前置数据**的消费侧生成内容。Engineering / Design 接手时按本表实现各消费侧服务，**不要把这些写回 memory**（profile.summary 重写例外）。

#### B 类生成内容总表

| # | 内容 | 触发时机 | 前置数据（从 memory 拿什么） | 实现责任方 | 生成约束 |
|---|---|---|---|---|---|
| 1 | **日记正文** | 用户查看 / 定时 | `episode` (highlight_score) + `atomic_facts` (quote_eligible) + `event_emotion_tag` + `game_event` + `idip_milestone` + 桌宠 IP | 日记生成器 LLM agent | 受 `user_preferences.diary_style` 约束；引用原话必须 quote_eligible=true |
| 2 | **一句话画像卡片 / 总览页标语** | 画像页加载 | `profile.summary` + `relationship_stats` + 桌宠 IP | UI Composer（LLM 或模板） | ≤30 字 |
| 3 | **高光记忆"宠物视角观察" `pet_observation`** | 高光页加载 / 分享时 | `highlight_event.*`（含 evidence_ids 反查）+ 桌宠 IP | 消费侧 LLM | 不写回 memory；不同 IP 输出不同；每次按 IP 生成 |
| 4 | **桌宠实时对话回复** | 实时交互 | memory 全套（profile / current_context / episode / atomic_facts / emotion / persona_label / highlight_event ）+ 桌宠 IP | 桌宠 agent LLM | 受 PRIVACY_BOUNDARY 全部硬约束 + user_preferences 约束 |
| 5 | **高光分享卡片图文** | 用户分享 | `highlight_event` (privacy_level = shareable) + 分享模板 + 桌宠 IP | 分享服务 | privacy_level = private 的不可分享 |
| 6 | **人格测定结果页解释文案**（"为什么像 TA"） | 测定完成 / 查看 | `game_persona_assessment.similarity_breakdown[]` + 反查 evidence_ids → `game_event` / `idip_milestone` + 桌宠 IP | UI Composer | 必须基于 evidence_ids 实证；**禁止 LLM 编造证据** |
| 7 | **关系等级 / 里程碑卡片文案** | 升级时 / 查看时 | `relationship_stats.milestone_unlocked[]` + 桌宠 IP | UI Composer | 纪念语气，非任务压力 |
| 8 | **profile.summary 重写**（用户点"重新总结一下我"） | 用户点击按钮 / 周期性 | profile 全字段 + 最近 episode + highlight_event | LLM agent | **例外**：写回 memory.profile.summary（A 常驻 + B 触发更新混合） |

#### PM 红线（消费侧 B 类生成）

| # | 红线 | 理由 |
|---|---|---|
| 1 | **B 类生成默认不写回 memory**（例外见 #8） | 受 IP / 场景影响，写回失效 |
| 2 | **桌宠 IP 语气内容只走 B 类** | pet_observation / 对话 / 日记正文 / 分享文案 / 卡片文案 全部按 IP 实时生成 |
| 3 | **必须基于 memory 实证，禁止 LLM 编造** | 引用 highlight_event 必须用 evidence_ids 回溯；人格"为什么像"必须基于 similarity_breakdown.evidence_ids；日记记录必须基于 atomic_facts (quote_eligible) |
| 4 | **B 类生成失败不静默兜底** | LLM 推理失败 → UI 显示"内容生成中"或"暂时不可用"；不允许"假装生成成功" |

---

## 4. 附录

### 4.1 PRIVACY_BOUNDARY 关系汇总

| 模块 | 与 PRIVACY_BOUNDARY § 2 硬约束的关系 | 修订提案（Deferred）涉及 |
|---|---|---|
| § 3.1 chat | ✅ 不冲突（chat 是用户与桌宠对话，首方） | 否 |
| § 3.2 PC 进程 | ✅ 不冲突（进程级元数据） | 否 |
| § 3.3 行为 - UI & 用户操作 | ⚠️ #3 不记录键盘输入内容 — 已守住（L2 / L3 红线） | 否（已锁 L0-L1.5） |
| § 3.4 6 通道 | ⚠️ #4 #5 部分相邻；每通道独立开关 + 仅元数据 | **是**（v2.5 五项之 OS API / 浏览器全方位 / OSA / CLI / IFTTT） |
| § 3.5 idip | ✅ 不冲突（首方游戏数据） | 否 |
| § 3.6 实时事件 | ✅ 不冲突 | 否 |
| § 3.7 VLM 视觉 | ⚠️ #1 不默认全屏截图 — 仅用户显式开 + 前台 + 短期 buffer + 不持久化原图 | **是**（v2.3 VLM 视频扩展） |
| § 3.8 current_context | ✅ 不冲突 | 否 |
| § 3.9 profile_meta | ✅ 不冲突 | 否 |
| § 3.10 系统音频 | ⚠️ #2 不默认系统音频监听 — A0 派生 + A1 标识允许；A2 / A3 ❌ | **是**（v2.3 音频 A0-A3 分级） |
| § 3.11 Playwright | ⚠️ #4 不长期存跨 app 全文 UI — 7 条边界守住 | **是**（v2.3 Playwright 受限放行） |
| § 3.12 OSA | ⚠️ #4 #5 部分相邻；仅读元数据；用户系统授权 | **是**（v2.5 OS Scripting Bridge） |
| § 3.13 highlight_event | ✅ 不冲突（合成层） | 否 |
| § 3.14 user_preferences | ✅ 不冲突；是 PRIVACY_BOUNDARY 二级开关 UI 落地 | 否 |
| § 3.15 profile 扩展 | ✅ 不冲突 | 否 |
| § 3.16 persona | ⚠️ 跨产品平台调用 — 需用户显式同意（前置条件 #4） | 否（外部平台接入边界） |
| § 3.17 relationship_stats | ✅ 不冲突（派生计数） | 否 |
| § 3.18 B 类消费侧 | ✅ 不冲突（不存储） | 否 |

> **PRIVACY_BOUNDARY 修订提案当前状态：Deferred**（2026-05-12 Main Thread 收口），等 voice-interaction 分支启动时合并审议。审议结果决定 § 3.4 / § 3.7 / § 3.10 / § 3.11 / § 3.12 是否在项目级文件落地。

### 4.2 决策点 / 悬挂项

| # | 决策点 | 责任方 | 状态 |
|---|---|---|---|
| 1 | § 3.16 升 P1 的前置 4 条件（公司平台对接 / 准确率门槛 / 重测策略 / 法务合规） | Engineering + 法务 + 公司平台对接 | ⏳ 待答 |
| 2 | `user_preferences{}` 实现放 memory 层（与 profile 并列）还是独立 settings 层 | Engineering | ⏳ 待定 |
| 3 | `profile.summary` 是否进 MVP 一句话画像卡片 | Design | ⏳ 待定 |
| 4 | PRIVACY_BOUNDARY 修订提案（Deferred）合并审议时机 | Main Thread + voice-interaction 分支启动后 | ⏳ 等待 |
| 5 | `relationship_level` 计算公式 + 缓存策略 | Engineering | ⏳ 待定（PM 不锁） |
| 6 | § 3.7 VLM 模型选型：MiniCPM-V 4.5 (8B int4) 商用条款法务核验 / 不过切 Qwen2.5-VL-7B | 法务 + Engineering | ⏳ 待答 |

### 4.3 文档基线版本

| 项 | 版本 |
|---|---|
| REQUIREMENT_CLARIFICATION_memory-dataset.md | **v2.6**（2026-05-12，commit 86b9627） |
| PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL | **v2.5.1 Deferred**（2026-05-12，commit a9104a2） |
| AI_FEATURE_EVALUATION_memory-dataset.md | **v3**（2026-05-12，commit a9104a2） |
| 本评审稿（DATA_REQUIREMENT_SPECIFICATION） | **v1.0**（2026-05-12，本次新增） |

### 4.4 完整 mock schema 索引

| 模块 | 完整 mock 位置 |
|---|---|
| § 3.1 chat | [REQUIREMENT_CLARIFICATION § 11.1](REQUIREMENT_CLARIFICATION_memory-dataset.md) |
| § 3.1 profile + profile_meta | REQUIREMENT_CLARIFICATION § 11.2 |
| § 3.2 behavior_pc | REQUIREMENT_CLARIFICATION § 11.3 |
| § 3.3 behavior_ui (A2) | REQUIREMENT_CLARIFICATION § 11.4 |
| § 3.3 behavior_edit (A3) | REQUIREMENT_CLARIFICATION § 11.4.1 |
| § 3.4 MCP | REQUIREMENT_CLARIFICATION § 11.5 |
| § 3.5 game_idip | REQUIREMENT_CLARIFICATION § 11.6 |
| § 3.6 game_event | REQUIREMENT_CLARIFICATION § 11.7 |
| § 3.7 game_vlm | REQUIREMENT_CLARIFICATION § 11.8 |
| § 3.8 current_context | REQUIREMENT_CLARIFICATION § 11.9 |
| § 3.10 audio_derived | REQUIREMENT_CLARIFICATION § 11.10 |
| § 3.11 playwright_tool_result | REQUIREMENT_CLARIFICATION § 11.11 |
| § 3.4 OS API（6 类） | REQUIREMENT_CLARIFICATION § 11.12 |
| § 3.4 浏览器扩展 | REQUIREMENT_CLARIFICATION § 11.13 |
| § 3.12 OSA Bridge | REQUIREMENT_CLARIFICATION § 11.14 |
| § 3.13 highlight_event（v2.6） | REQUIREMENT_CLARIFICATION § 11.15 |
| § 3.14 user_preferences（v2.6） | REQUIREMENT_CLARIFICATION § 11.16 |
| § 3.16 game_persona_assessment（v2.6） | REQUIREMENT_CLARIFICATION § 11.17 |
| § 3.17 relationship_stats（v2.6） | REQUIREMENT_CLARIFICATION § 11.18 |
| 顶层 mock_metadata | REQUIREMENT_CLARIFICATION § 11.0 |

### 4.5 评审 checklist

> 评审会前请评审人按此 checklist 检查；评审会按此 checklist 逐条过。

#### 4.5.1 数据需求完整性

- [ ] § 2.1 模块全景表 18 个模块是否覆盖日记 + 用户画像页 15 模块全部消费方需求？
- [ ] 是否有遗漏的数据维度？（"游戏搭子"+ "知心好友"两个产品定位的数据底盘是否完整？）
- [ ] A 类 / B 类划分是否合理？是否有 A 类字段实际应该是 B 类（受 IP / 场景影响）？反之？

#### 4.5.2 PRIVACY_BOUNDARY 合规

- [ ] § 4.1 关系汇总表中所有"⚠️"项是否在分支文档已锁定执行细则？
- [ ] PRIVACY_BOUNDARY 修订提案（Deferred）涉及的 5 个模块是否都已在分支立场 + 项目级 Defer 状态对齐？
- [ ] § 3.14 `privacy_grants{}` 默认全 false 是否充分保护用户？

#### 4.5.3 PM 红线守住

- [ ] § 1.5 PM 红线 5 条是否在所有详解模块守住？
- [ ] § 3.16 persona 4 条红线是否在 schema + 派生流程中都有强制性体现？
- [ ] § 3.7 VLM 三档混合架构 + 两层授权是否清晰？
- [ ] § 3.18 B 类生成 4 条红线是否给消费侧实现方足够约束？

#### 4.5.4 决策点闭环

- [ ] § 4.2 6 条悬挂项是否都有明确责任方 + 触发时机？
- [ ] § 3.16 升 P1 前置 4 条件是否准备好评审会上同步答复？
- [ ] `user_preferences` 实现位置（memory vs settings）是否在评审会上拍板？

#### 4.5.5 mock schema 可实现性

- [ ] § 4.4 mock 索引指向的字段是否 Engineering 能直接实现？
- [ ] 派生字段（如 highlight_score / event_emotion_tag / relationship_level）的计算公式是否在 Engineering 接手前足够清晰？

---

**本评审稿结束。** 评审通过后由 Main Thread 写回 `decisions/DECISION_LOG.md` 留痕，并触发 Engineering / Design 按本规格落地。
