# 数据需求规格说明书（DRS）— desktop-pet Memory Dataset

> **文档性质**：正式评审稿（Data Requirement Specification）
> **目标读者**：Engineering / Design / 法务 / 项目决策方
> **隐私基线**：项目级 7 条硬约束（详见 §1.2）
> **状态**：评审稿 v2.0

---

## Executive Summary

本文档定义桌宠 `desktop-pet` 产品**记忆系统**所需数据的需求规格。

**产品定位**：桌宠绑定单游戏，提供两大体验 ——
- **知心好友**：长期记忆 + 个性化对话 + 情绪感知
- **游戏搭子**：游戏场景感知 + 事件即时反应 + 复盘 / 庆祝 / 安慰

**数据范围**：**14 个数据模块**（聊天 / 行为 / 游戏 / VLM 视觉理解 / MCP 接入 / 高光 / 偏好 / 画像 / 等），按来源分两类：

| 类别 | 含义 | 谁实现 |
|---|---|---|
| **记忆系统提供** | 数据底座 — 仅做采集 + 存储 + 用户主动输入；**不做派生** | 记忆系统团队 / OS / 游戏 SDK / 通道 SDK |
| **消费侧派生 / 生成** | 所有 LLM / 规则 / 计算 / 信号处理派生 + 实时动态生成 | 桌宠 agent / 日记生成器 / UI Composer / 公司既有外部平台 |

**隐私基线**：**7 条硬约束**（不全屏截图 / 不音频监听 / 不键盘 keylog / 不长期跨 app 全文 / 不上传 raw OS context / 不写敏感业务信息 / 不用 Recall 数据源）— 每个字段在字段表中独立标注"隐私边界"列。

**APP 接入**：通过 **MCP 通道**接入支持的 app（dida / feishu / steam 等）— 用户在 Memory Center 单 app 勾选启用，默认全关。

**优先级分布**：
- **P0**（必做）：聊天 / 行为基础 / 游戏 idip / 游戏事件 / 当前上下文 / Profile 元字段
- **P1**（进 MVP）：VLM 视觉理解 / MCP 接入 / 高光记忆 / 用户偏好 / 画像扩展 / 游戏人格测定（候选）

详细模块全景见 §2.1；详细字段定义见 §3。

---

## 目录

- [§1 背景](#1-背景)
- [§2 数据需求总览](#2-数据需求总览)
- [§3 数据需求详解](#3-数据需求详解)
- [§4 PRIVACY_BOUNDARY 关系汇总](#4-privacy_boundary-关系汇总)

---

## 1. 背景

### 1.1 项目定位

`desktop-pet` 是 C 端桌宠产品，**桌宠 instance 绑定一款游戏**（多游戏不共享 profile / 不跨游戏聚合）。核心体验：

- **知心好友**：长期记忆 / 个性化对话 / 情绪感知
- **游戏搭子**：对当下游戏场景有感 / 对游戏事件即时反应 / 复盘 / 庆祝 / 安慰

memory-dataset 分支的职责是回答"桌宠需要什么数据"，即记忆系统对桌宠层的产出契约。

### 1.2 隐私底线

| # | 硬约束 |
|---|---|
| 1 | 不默认 Recall 式后台全屏截图 |
| 2 | 不默认系统音频监听 |
| 3 | 不记录键盘输入内容 |
| 4 | 不长期存跨 app 全文 UI |
| 5 | 不上传 raw OS context |
| 6 | 不写敏感业务信息 |
| 7 | 不使用 Recall 作为数据源 |

本评审稿内所有数据需求**不放宽**以上任何一条。§ 3.7 VLM 视觉理解涉及"不默认全屏截图"硬约束的边界修订，按本文档分支级约束实施（详见 § 4）。

### 1.3 数据来源分类架构原则

#### 1.3.1 两类定义

| 类别 | 含义 | 谁实现 | 消费方使用 |
|---|---|---|---|
| **记忆系统提供** | **数据底座** — 仅做采集 + 存储 + 用户主动输入；**不做派生** | 记忆系统团队 / OS / 游戏 SDK / 通道 SDK | query API 直接拿 |
| **消费侧派生 / 生成** | 所有 LLM / 规则 / 计算 / 信号处理派生 + 所有动态生成 | 消费方（桌宠 agent / 日记生成器 / UI Composer / 公司外部平台 等） | 拿前置数据后用 LLM / 代码计算 |

**核心原则**：记忆系统**不做派生**。任何需要 LLM 抽取 / 规则计算 / 信号处理 / 外部平台调用的字段都归消费侧。

## 2. 数据需求总览

### 2.1 模块全景表

> "来源"列：**记忆系统** = OS / 通道 / SDK 直采 + 用户输入；**消费侧** = LLM / 规则代码 / 信号处理 / 外部平台派生（详见 § 1.3）。

| Index | 模块 | 主要字段 | 来源 | 隐私底线（速览） | 优先级 |
|---|---|---|---|---|---|
| § 3.1 | 聊天数据 chat | atomic_facts / episode / profile / emotion_signal | 记忆系统 + 消费侧派生 | 只读用户和桌宠的对话；不读用户第三方 IM / 邮件；含个人身份信息的原话不引用进日记 | **P0** |
| § 3.2 | 行为数据 - PC 进程 | active_app / idle_signal / app_switch | 记忆系统 | 只看用户在用什么 app；不读 app 内容 | **P0** |
| § 3.3 | 行为数据 - UI & 用户操作 | window_title_redacted / A1 派生 / A2 OS 事件 / A3 编辑派生 | 记忆系统 + 消费侧派生 | 不记录用户按了什么键（即使 hash 后也不行）；窗口标题去除文件名 / 路径 / 用户名 | **P0 + P1** |
| § 3.4 | APP 信号源 - MCP 通道 | mcp_app_id / summary / enabled_sources | 记忆系统（用户 Memory Center 勾选启用 app） | 仅 app 元数据 / 摘要；**不读消息 / 邮件 / 文档正文** | **P1** |
| § 3.5 | 游戏数据 - idip 状态 | idip_snapshot / delta / anomaly / milestone | 记忆系统首方 SDK + 消费侧派生 | 首方游戏数据；不存真实账号 / 付费记录 / 实名信息 | **P0** |
| § 3.6 | 游戏数据 - 实时事件 | game_session / game_event.stream / event_emotion_tag | 记忆系统首方 SDK + 消费侧派生 | 首方游戏 SDK 推送的事件流 | **P0** |
| § 3.7 | VLM 视觉理解 | semantic_tags / user_visible_summary | 消费侧（三档混合 VLM 推理） | 用户单 app 显式开启（默认关）；只看前台窗口；不存原图；云端调用要用户每次确认 | **P1** |
| § 3.8 | 当前上下文 current_context | activity_topic / mood / interrupt / attention | 消费侧滑窗派生 | 派生切面（仅状态标签，不存原始内容） | **P0** |
| § 3.9 | profile_meta | confidence / source_category / user_corrected / feedback_history | 记忆系统 + 消费侧派生 | 每条画像标"是用户说的还是 LLM 猜的"；用户改过的不再自动覆盖 | **P0** |
| § 3.10 | 高光事件 highlight_event | title / scene / event_summary / category / tags / 等 | 消费侧 LLM 派生 + 用户编辑 | 引用对话原文要先过个人身份信息检测；用户标"私密"的不进分享卡片 | **P1** |
| § 3.11 | 用户偏好 user_preferences | 5 子对象（companion_style / emotion_response / content_type / diary_style / privacy_grants） | 记忆系统（用户主动输入） | 隐私授权默认关；必须用户主动勾选才开启；LLM 不准自动设置 | **P1** |
| § 3.12 | 用户画像 profile 扩展 | gameplay_motivation / candidates / style_tags | 消费侧派生 + 用户输入 | 用户确认过的标签 LLM 不再自动覆盖 | **P1** |
| § 3.13 | 游戏人格测定 game_persona_assessment | persona_label / similarity_breakdown / evidence_strength | 消费侧（公司既有外部平台） | 至少 3 条游戏数据支撑才出测定结果；跨产品平台调用需用户显式同意；测定结果不驱动桌宠陪伴策略 | **P1 候选**（待前置确认） |
| § 3.14 | 消费侧派生 / 生成清单（不进 memory schema） | 4 类工作清单（派生计算 / LLM 派生 / 外部平台派生 / 实时动态生成） | 消费侧 | 全部受隐私基线 7 条硬约束 + 用户偏好约束 | — |

### 2.2 数据接入开关（用户在 Memory Center 配置）

| 开关 | 用途 | 默认 |
|---|---|---|
| **🖥️ 屏幕感知** | 启用 VLM 视觉理解（看屏幕画面）+ UI 文本快照（读 OS 控件文本） | ❌ 关 |
| **🔌 MCP 配置** | 启用 MCP app 列表（用户单 app 勾选） | ❌ 关 |

两个开关都**默认关闭**，需用户主动勾选才生效。

### 2.3 优先级总览

| 优先级 | 模块 |
|---|---|
| **P0** | § 3.1 chat / § 3.2 PC 进程 / § 3.3 行为（部分） / § 3.5 idip / § 3.6 实时事件 / § 3.8 current_context / § 3.9 profile_meta |
| **P1** | § 3.3 全档 / § 3.4 MCP / § 3.7 VLM / § 3.10 高光 / § 3.11 偏好 / § 3.12 画像扩展 / § 3.13 persona（候选） |

---

## 3. 数据需求详解

> 每节结构：说明 / 字段表 / Schema 示例。

---

### 3.1 聊天数据 chat

桌宠与用户对话的**三层抽象**：原子事实（atomic_facts）→ 情节摘要（episode）→ 用户画像（profile）；外加情绪推导（emotion_signal）+ 元字段（profile_meta）。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `chat_text` 原文 | 聊天原文 | `"刚才那把翻盘了！"` | 记忆系统 | 桌宠 chat runtime 直采（首方对话 only；不读第三方 IM / 邮件 / 任何外部聊天记录） | 首方对话 only；不读第三方 IM / 邮件 | P0 | 给消费侧 LLM 提供原料 |
| 2 | `atomic_facts[]` | 原子事实 | `[{fact:"用户喜欢稳定策略", quote_eligible:true}]` | 消费侧派生 | **AI Agent**：LLM 抽取（本地 7B 优先）；**触发**：chat segment 闭合时；**输出 schema 约束**：`{fact, quote_eligible, meta}`；结果写回 memory 持久化 | 引用必须 `quote_eligible=true` | P0 | 短期对话引用 |
| 3a | `episode.title` | 情节标题 | `"讨论刺客职业天赋树调整"` | 消费侧派生 | **AI Agent**：LLM 摘要；**触发**：chat segment 闭合时聚合 N 条 atomic_facts → 摘要为 1 个 episode；写回 memory 持久化 | 同 atomic_facts | P0 | 跨日召回 |
| 3b | `episode.content` | 情节内容 | `"用户和桌宠讨论了刺客天赋..."` | 消费侧派生 | ↑ 同上 | 同 atomic_facts | P0 | ↑ 同上 |
| 3c | `episode.time_range` | 时间范围 | `{start: "2026-04-21T09:08Z", end: "2026-04-21T09:15Z"}` | 消费侧派生 | ↑ 同上 | 仅元数据 | P0 | ↑ 同上 |
| 3d | `episode.participants` | 参与方 | `["pet", "user"]` | 消费侧派生 | ↑ 同上 | 仅元数据 | P0 | ↑ 同上 |
| 4 | `profile.summary` | 用户画像摘要 | `"用户关注游戏更新内容..."` | 消费侧派生（触发更新） | **AI Agent**：LLM 生成（写回 memory 常驻）；**触发条件**：① 每周 1 次周期 / ② 用户点"重新总结一下我" / ③ 重大事件后（高光 ≥3 条新增 / 人格测定完成 / 段位大变） | 不含个人身份信息（受 quote_eligible 约束） | P0 | 风格定调 |
| 5a | `profile.interests[]` | 兴趣 | `["刺客职业", "刷副本"]` | 消费侧派生 + 用户可改 | **AI Agent**：LLM 从 atomic_facts + chat 抽取；**用户操作**：Memory Center UI 可增 / 删 / 标"不准"；用户改后 `user_corrected=true`，LLM 不再覆盖 | 不含个人身份信息 | P0 | 主动话题选取 |
| 5b | `profile.preferences[]` | 偏好 | `["稳定策略"]` | 消费侧派生 + 用户可改 | ↑ 同上 | 不含个人身份信息 | P0 | ↑ 同上 |
| 6 | `profile.behavior_patterns[]` | 行为模式 | `["晨会时间查询游戏信息"]` | 消费侧派生 | **AI Agent**：LLM 抽取（如"晨会摸鱼时间"）；**用户操作**：只读 / 可删，**不可编辑**（避免自夸 / 自贬污染） | 不含个人身份信息 | P0 | 时机判断 |
| 7 | `profile.key_facts[]` | 关键事实 | `["主玩荣耀王者钻石段位"]` | 消费侧派生 → 用户确认才生效 | **AI Agent**：LLM 候选；UI"OK / 不对"二选一；未确认前**不进对话引用**（避免桌宠引用错信息引爆体验） | 用户确认才生效 | P0 | 重要事实注入对话上下文 |
| 8 | `profile.personality_traits[]` | 个性特征 | `["谨慎型", "团队配合型"]` | 消费侧派生 + 用户"不像我"反馈 | **AI Agent**：LLM 推断；**用户操作**：不可直接编辑（避免主观偏差），仅可标"不像我" → 进 `profile_meta.feedback_history` 降权 | 用户可标"不像我"，进 feedback_history 降权 | P0 | 个性描述 |
| 9 | `emotion_signal` | 情绪信号 | `"兴奋"`（紧张/兴奋/沮丧/平静） | 消费侧派生 | **AI 推导**：本地轻量分类器 + 关键词规则 mix；输出枚举：紧张 / 兴奋 / 沮丧 / 平静；**触发**：chat 实时（每 segment） | 派生标量，不含内容 | P0 | 决定语气 |
| 10 | `atomic_facts.quote_eligible` | 原话可引用标记 | `true / false` | 消费侧派生 | **规则个人身份信息检测**：正则匹配（人名 / 邮箱 / 手机号 / 财务关键词）+ NER 实体识别（同事 / 公司 / 病情等）；**触发**：生产 atomic_facts 时同步打标 | 个人身份信息检测：人名/邮箱/手机/财务关键词 | P0 | 日记 / 高光引用原话的隐私安全开关 |

#### Schema 示例

```json
{
  "data_source": "chat",
  "player_id": "player_a1c93f01",
  "atomic_facts": [
    {"fact": "用户喜欢稳定策略", "quote_eligible": true,
     "meta": {"confidence": 0.85, "source_category": "chat"}}
  ],
  "episode": {
    "title": "讨论刺客职业天赋树调整",
    "time_range": {"start": "2026-04-21T09:08Z", "end": "2026-04-21T09:15Z"}
  },
  "emotion_signal": "兴奋"
}
```

---

### 3.2 行为数据 - PC 进程

进程级行为状态：判断"在游戏中 vs 在工作中" + 全屏不打断 + 离开识别。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1a | `active_app.name` | app 名 | `"VS Code"` | 记忆系统 | **OS 进程 API 直采**：macOS `NSWorkspace.frontmostApplication` / Windows `GetForegroundWindow` + `GetWindowThreadProcessId`；**触发**：每 1s 轮询 + active_app 变更立即推送 | 仅 OS 公开 API；不读 app 内容 | P0 | "在游戏中"vs"在工作中" |
| 1b | `active_app.bundle_id` | bundle ID | `"com.microsoft.VSCode"` | 记忆系统 | ↑ 同上 | 仅 OS 公开 API | P0 | ↑ 同上 |
| 1c | `active_app.process_id` | 进程 ID | `1234` | 记忆系统 | ↑ 同上 | 仅 OS 公开 API | P0 | ↑ 同上 |
| 2 | `active_app.is_fullscreen` | 全屏状态 | `false` | 记忆系统 | **OS 窗口 API 直采**：macOS `NSWindow.styleMask & NSWindowStyleMaskFullScreen` / Windows `GetWindowLong + WS_MAXIMIZE` + 屏幕分辨率比对 | 仅 OS 公开 API | P0 | 全屏 = 闭嘴 |
| 3 | `idle_signal`（active / >5min / >10min / >30min） | 闲置信号 | `active / >5min / >10min / >30min` | 消费侧派生 | **规则阈值分级**：基于 OS idle 时间（macOS `CGEventSourceSecondsSinceLastEventType(kCGAnyInputEventType)` / Windows `GetLastInputInfo`）；**触发**：每 30s 检查 + 状态变化立即推送 | 仅 OS idle 时间，不含输入内容 | P0 | "用户离开"判断 |
| 4 | `app_switch_burst` | app 切换 burst | `true / false` | 消费侧派生 | **滚动窗口统计**：5min 窗口内 active_app 切换次数 ≥N 触发 burst=true；**触发**：active_app 每次变化时增量更新 | 仅时序统计 | P0 | "频繁切换 = 焦虑" |
| 5 | `recent_apps_top3` | 最近 app top3 | `["VS Code", "Chrome", "Slack"]` | 消费侧派生 | **1h 滚动窗口聚合**：active_app 时序累计前台时长 → 按时长排序 top3；**触发**：每 5min 重算 + 按需 query | 仅时序统计 | P0 | "今天一直在写代码" |

#### Schema 示例

```json
{
  "data_source": "behavior_pc",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:15:00Z",
  "active_app": {"name": "VS Code", "bundle_id": "com.microsoft.VSCode", "is_fullscreen": false},
  "idle_signal": "active"
}
```

---

### 3.3 行为数据 - mac / win API & 用户操作

**四源叠加方案**：让桌宠在不触碰键盘输入内容（L2 / L3 红线）的前提下，对"用户当前在做什么"达到 80%+ 感知。

行为档 A 三档（与音频 A 是独立命名空间）：A1 派生指标 / A2 OS 操作语义事件 / A3 编辑动作派生 — **全部允许**。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `window_title_redacted` | 脱敏窗口标题 | `"在 IDE 编辑代码文件"` | 记忆系统 | **OS 窗口 API + 脱敏规则**：macOS `kAXTitleAttribute` / Windows `GetWindowText` 拿原标题 → 正则脱敏（去除文件名 / 路径 / URL query string / 用户名）→ 仅保留 app 类别 + 文件类型；**触发**：每 1s + 标题变化推送 | 脱敏：去文件名/路径/URL/用户名 | P0 | "在 IDE 编辑代码文件" |
| 2 | `is_fullscreen_game` | 游戏全屏 | `false` | 记忆系统 | 同 § 3.2 #2 OS 窗口 API 直采 | 仅 OS 公开 API | P0 | 全屏 = 闭嘴 |
| 3 | `ui_text_snapshot`（白名单 app + opt-in） | UI 文本快照 | `"屏幕上有错误弹窗"` | 记忆系统 | **OS Accessibility API 直采**：macOS NSAccessibility / Windows UIA；**条件**：白名单 app + 用户 opt-in + 短期 buffer ≤5min；**不持久化**（仅供消费侧实时 query） | 白名单 app + opt-in；buffer ≤5min；不长期保存；不读文档/聊天/密码框 | P1 | "屏幕上有错误弹窗" |
| 4 | `focused_element_role`（按钮 / 文本框 / 标题） | 当前焦点控件 | `button / text_field / title` | 记忆系统 | **OS 控件 API 直采**：macOS `AXFocusedUIElement` / Windows `UIAutomation.FocusedElement`；**触发**：实时（焦点变化推送） | 仅控件类型，不含内容 | P1 | "正在输入"不打扰 |
| 5a | `input_intensity_level` | 输入强度 (A1) | `low / mid / high` | 消费侧派生 | **桶化派生**：OS 原始键盘 / 鼠标事件 → 10s / 1min 滚动窗口 → 桶化为 low/mid/high 等级；**关键**：**仅统计事件次数 / 区域分布**，**绝不存原始按键内容**；**触发**：每 10s 增量更新 | 桶化派生；绝不存原始按键；不触 keylog L2 红线 | P0 | 专注 vs 休息判断 |
| 5b | `typing_rhythm_signal` | 打字节奏 (A1) | `steady / bursty / sparse` | 消费侧派生 | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 5c | `mouse_activity_burst` | 鼠标活动 burst (A1) | `true / false` | 消费侧派生 | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 5d | `mouse_region_heatmap_top3` | 鼠标热区 top3 (A1) | `["center", "top-right", "left"]` | 消费侧派生 | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 5e | `scroll_intensity_signal` | 滚动强度 (A1) | `none / low / mid / high` | 消费侧派生 | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 6 | `semantic_events_v2_5[]` | 操作语义事件 (A2) | `[{type:"save", at:"..."}]`；enum: save / copy_paste / undo_redo_burst / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install / window_arrangement | 记忆系统 | **OS Event API 直采**：macOS `NSEvent globalMonitor` + AppleScript Sysevents / Windows `SetWinEventHook(EVENT_SYSTEM_*)` + Shell Hooks；监听快捷键组合（Cmd+S / Cmd+C / Cmd+Z）+ 系统级动作（锁屏 / 新窗口 / app 安装）；**触发**：事件 pub/sub | OS event 仅快捷键组合识别；不含字符流 | P1 | "刚保存 / 刚切 app" |
| 7a | `text_edit_action_burst` | 编辑动作 burst (A3) | `true / false` | 消费侧派生 | **二阶统计派生**：基于 A2 semantic_events 中的 save / undo / redo 事件流 → 滚动窗口（1min / 5min / 整 session）→ 派生频率 / 时长 / IME 状态；**触发**：每 1min 增量更新 | 二阶统计；不含字符流 | P1 | "在密集编辑长文档" |
| 7b | `undo_redo_rate_per_min` | undo/redo 每分钟频率 (A3) | `5` | 消费侧派生 | ↑ 同上 | 同上 | P1 | "频繁 undo = 改 bug" |
| 7c | `ime_state` | 输入法状态 (A3) | `zh / en / off` | 消费侧派生 | ↑ 同上 | 同上（IME 状态非内容） | P1 | 中文 vs 英文输入 |
| 7d | `editing_session_duration_min` | 编辑会话时长（分钟） (A3) | `45` | 消费侧派生 | ↑ 同上 | 同上 | P1 | 长 session 识别 |
| 7e | `text_edit_burst_frequency` | 编辑突发频率 (A3) | `2.3` | 消费侧派生 | ↑ 同上 | 同上 | P1 | 编辑活跃度 |

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

---

### 3.4 APP 信号源 - MCP 通道

app 通过自暴露的 MCP server 向桌宠提供元数据 / 摘要。**用户在 Memory Center 单 app 勾选启用**，默认全关。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `mcp_app_id` | app 标识 | `"dida365"` | 记忆系统 | MCP SDK 直采（app 自身上报 ID） | 仅 app 元数据 | P1 | 标识哪个 app 的 MCP 数据 |
| 2 | `summary` | app 摘要 | `"今天有 3 个待办：API 文档评审 / 周报 / ..."` | 记忆系统 | app 主动通过 MCP server 暴露 + 可选消费侧 LLM 归并 | 仅 app 暴露的元数据 / 摘要；**不读消息 / 邮件 / 文档正文** | P1 | 桌宠对话引用（如"看你今天有 3 个待办"） |
| 3 | `enabled_sources[]` | 已启用 app 列表 | `["dida365", "feishu", "steam"]` | 记忆系统 | 用户在 Memory Center 主动勾选 | 用户主动输入；默认空 | P1 | 标识桌宠允许接入的 MCP app |

#### 边界

- **不允许** mcp-chrome 类全功能浏览器 MCP（权限过大）— 仅接受 app 主动暴露的标准 MCP server
- 每个 app 独立开关，用户在 Memory Center 单选启用 / 禁用
- 不接受 app 通过 MCP 推送的消息 / 邮件 / 文档正文 — 仅元数据 / 摘要

#### Schema 示例

```json
{
  "data_source": "mcp_summary",
  "mcp_app_id": "dida365",
  "summary": "今天有 3 个待办：API 文档评审 / 周报 / ...",
  "enabled_sources": ["dida365", "feishu", "steam"]
}
```

---

### 3.5 游戏数据 - idip 状态对比

idip 数据对比是"游戏搭子"的首方合规数据源。状态 + delta + anomaly + milestone 四层。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `idip_snapshot` | 状态快照 | `{level:88, rank:"钻石二"}` | 记忆系统 | **游戏 SDK 推送**（首方接入）：游戏侧通过 idip 接口推送当前状态键值对；**触发**：游戏定义（状态变化 push / 周期心跳 / 手动 query）；**字段语义**见 #5 | 首方游戏 SDK；不含个人身份信息 / 付费记录 / 实名 | P0 | 角色等级 / 段位 / 通关进度等基础状态 |
| 2 | `idip_delta` | 状态变化 | `{level:"+1", rank:"升 +1 段位"}` | 消费侧派生 | **规则代码 state diff**：缓存上一时点 idip_snapshot，新 snapshot 到达时逐字段对比 → 输出变化字段 + 变化量；**触发**：每次 idip_snapshot 更新 | 同上 | P0 | "刚通关" / "段位掉了" |
| 3 | `idip_anomaly` | 状态异常 | `[{type:"卡关", at:"..."}]` | 消费侧派生 | **规则代码异常模式识别**：基于 idip_delta 历史滑窗（如"N 分钟内同一字段反复回退" / "关键字段 X 分钟无变化"）；规则由 Engineering 配置；**触发**：每次 idip_delta 更新 | 同上 | P0 | "3 次同一处失败" / "卡关 5min" |
| 4 | `idip_milestone[]` | 状态突破点 | `[{name:"首次到达钻石"}]` | 消费侧派生 | **规则代码识别**：基于 idip_field_metadata 中标 `milestone_type` 的字段（如 `is_levelup` / `is_rank_breakthrough` / `is_first_clear`）+ 阈值规则；**触发**：每次 idip_delta 命中 milestone 条件 | 同上 | P0 | 桌宠主动祝贺触发点 |
| 5 | `idip_field_metadata` | 字段语义配置 | `{level:{type:"int", milestone_type:"is_levelup"}}` | 记忆系统 | **游戏侧声明的字段语义配置文件**（JSON Schema）：每个 idip 字段标 `field_name` / `display_name` / `type` / `unit` / `milestone_type`；游戏接入时一次性提交；**记忆系统侧只存配置，不解释** | 配置文件，无个人身份信息 | P0 | 字段语义说明（数字含义） |

#### Schema 示例

```json
{
  "data_source": "game_idip",
  "snapshot_at": "2026-05-12T20:00:00Z",
  "idip_snapshot": {"level": 88, "rank": "钻石二", "weekly_quest_progress": 4},
  "idip_delta": {"level": "+1", "rank": "升 +1 段位"},
  "idip_milestone": [{"name": "首次到达钻石", "at": "2026-05-12T19:55:33Z"}]
}
```

---

### 3.6 游戏数据 - 实时事件

游戏内实时事件流（pub/sub），桌宠按事件即时反应。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1a | `game_session.start` | 对局开始 | `"2026-05-12T20:00Z"` | 记忆系统 | **游戏 SDK 直采事件**：游戏侧在一局开始 / 结束时推送；**事件 schema**：`{session_id, start_at / end_at, result?, duration?}`；**触发**：游戏内动作 push | 首方游戏 SDK | P0 | 知道一局开始 |
| 1b | `game_session.end` | 对局结束 | `"2026-05-12T20:30Z"` | 记忆系统 | ↑ 同上 | 首方游戏 SDK | P0 | 知道一局结束 |
| 2 | `game_session.in_game_time` | 游戏内时间 | `"游戏内第 5 日"` | 记忆系统 | **游戏 SDK 实时推送**：游戏内时间（如"游戏内第 5 日"、"早晨 8 点"）；**触发**：游戏定义（部分游戏没有，本字段可缺） | 首方游戏 SDK | P0 | 游戏内时间 |
| 3 | `game_event.stream`（open / death / revive / settlement 等） | 游戏事件流 | `[{type:"death", at:"..."}]` | 记忆系统 | **游戏 SDK pub/sub**：游戏内关键事件流（生死 / 击杀 / 复活 / 结算 / 装备 / 任务等）；**事件 schema**：`{type, at, payload}`；**记忆系统**：去重 + 时序整理后再交付桌宠 | 首方游戏 SDK；记忆系统侧去重 + 时序整理 | P0 | 桌宠按事件反应 |
| 4 | `game_session.duration_signal`（active / >30min / >1h / >3h） | 时长分级信号 | `active / >30min / >1h / >3h` | 消费侧派生 | **规则阈值分级**：基于 `game_session.start` 时间戳，实时 = now - start；分级阈值可配置；**触发**：每 5min 重算 + session 期间持续 | 派生分级 | P0 | 健康提示触发 |
| 5 | `event_emotion_tag`（joy / frustrate / satisfy / sadness / neutral） | 事件情绪标签 | `joy / frustrate / satisfy / sadness / neutral` | 消费侧派生 | **AI 推断**：复用 § 3.1 emotion_signal 模型扩到事件级；输入：`game_event` + `idip_delta` + chat 上下文；输出：枚举情绪标签；**触发**：每次 game_event 命中关键类型（死亡 / 通关 / 结算 等） | 派生标量 | P0 | 日记 / 高光的事件级情绪锚点 |
| 6 | `episode.highlight_score`（0-1） | 情节高光分数 | `0.82` | 消费侧派生 | **规则加权派生**：`score = w1 × idip_milestone_hit + w2 × emotion_strength + w3 × user_action_signal`；权重由 Engineering 配置；**触发**：episode 闭合时计算并写入 episode 元字段 | 派生标量 | P0 | 日记筛选阈值（默认 ≥0.7）+ 高光候选输入 |

#### Schema 示例

```json
{
  "data_source": "game_event",
  "stream": [
    {"type": "death", "at": "2026-05-12T20:15:33Z", "event_emotion_tag": "frustrate"},
    {"type": "settlement", "at": "2026-05-12T20:30:00Z", "event_emotion_tag": "satisfy",
     "result": "win", "highlight_score": 0.82}
  ]
}
```

---

### 3.7 VLM 视觉理解

VLM 单 app 实例开关（类别含游戏 + 视频），仅在用户**逐 app 主动开启**时启用。**三档混合架构**（CNN 初筛 + 量化 7-8B VLM 兜底 + 云端最终兜底）。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `vlm_enabled_for_this_app_instance` | VLM 单 app 开关 | `true / false` | 记忆系统 | **用户输入**：在该 app 实例的桌宠设置面板手动开启；默认关闭；用户可一键关闭单 app / 全局关闭 | 用户单 app 显式开启（默认关） | P1 | 每个 app 实例独立开关 |
| 2 | `app_category` | app 类别 | `game / video` | 记忆系统 | **用户输入**：在桌宠设置加入白名单时选定（game / video） | 用户配置 | P1 | 区分游戏类 vs 视频类规则 |
| 3 | `semantic_tags[]`（≤5） | 场景语义标签 | `["boss_fight", "low_hp"]` | 消费侧派生 | **三档混合 VLM 推理**（三档混合架构）：① CNN 初筛（MobileNet / EfficientNet，~50ms / 帧）② 量化 7-8B VLM 兜底（MiniCPM-V 4.5 int4 / Qwen2.5-VL-7B Q4_K_M）③ 云端兜底（需 onboarding 总开关 + 每次激活前显式确认）；**输入**：active_app 前台窗口视觉帧 buffer ≤60s；**输出**：枚举 schema 约束（禁止自由文本） | 前台 + buffer ≤60s + 不持久化原图 + 云端两层授权 + UI 必须显示"正在看屏幕" | P1 | 场景标签（boss_fight / low_hp / scene_funny 等） |
| 4 | `user_visible_summary`（≤50 字） | 用户可见摘要 | `"BOSS 战残血，紧张时刻"` | 消费侧派生 | **VLM 推理**（同 #3 三档混合）：场景一句话用户可见描述；**强约束**：不输出用户身份 / 账号 / 聊天内容 / 字幕原文 / 他人信息（System prompt + 输出 schema + 后置过滤 + 输入预处理四重兜底） | 同上 + 强约束：不输出用户身份 / 账号 / 聊天 / 字幕原文 / 他人信息 | P1 | "刚才那段是搞笑剧情" |

#### Schema 示例

```json
{
  "data_source": "game_vlm",
  "vlm_enabled_for_this_app_instance": true,
  "app_category": "game",
  "snapshot_at": "2026-05-12T20:18:00Z",
  "semantic_tags": ["boss_fight", "low_hp"],
  "user_visible_summary": "BOSS 战残血，紧张时刻"
}
```

---

### 3.8 当前上下文 current_context

5-15min 滑窗实时切面，"此刻该不该开口"的统一决策入口。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `activity_topic` | 活动主题 | `"在打游戏 BOSS 战"` | 消费侧派生 | **AI Agent LLM 滑窗摘要**：5min 滑窗内 chat + behavior + active_app + game_event 合成；**触发**：变化超阈值立即推送 + 无变化每 30s 心跳 | 滑窗派生，不含原始内容 | P0 | 桌宠对话的话题锚 |
| 2 | `mood_estimate`（紧张 / 平静 / 兴奋 / 沮丧） | 情绪估计 | `紧张 / 平静 / 兴奋 / 沮丧` | 消费侧派生 | **AI 滑窗推导**：复用 § 3.1 emotion_signal 模型；输入 = chat emotion 累计 + idip_delta + behavior burst；**触发**：跨级变化立即推送 | 派生标量 | P0 | 决定语气 |
| 3 | `interrupt_suitability`（high / medium / low） | 打扰适宜度 | `high / medium / low` | 消费侧派生 | **多信号加权派生**：综合 is_fullscreen / idle_signal / typing_rhythm / game_event 当前节奏 / user_preferences.disturb_intensity → 加权打分 → 分级；**触发**：跨级变化立即推送 | 派生标量 | P0 | 打扰决策唯一输入（桌宠不自己判断打扰） |
| 4 | `attention_target`（游戏 / IDE / 视频 / ...） | 注意力目标 | `"游戏" / "IDE" / "视频"` | 消费侧派生 | **规则派生**：基于 active_app + window_title_redacted + app_category 映射到注意力目标枚举；**触发**：实时（active_app 变化推送） | 派生标量 | P0 | 桌宠决定看哪个屏幕方向 |
| 5 | `confidence` | 置信度 | `0.85` | 消费侧派生 | **规则**：基于滑窗内有效信号数量（chat 条数 / event 条数 / behavior 桶 / 时长完整度）；信号 < 阈值 → 低置信；**触发**：每次推送时同步计算 | 派生标量 | P0 | 低置信时桌宠保守 |
| 6 | `trigger`（activity_topic_change / mood_change / interrupt_change / heartbeat） | 推送原因 | `mood_change / heartbeat / 等` | 记忆系统 | **系统标签**：推送时由滑窗派生引擎标注推送原因；**触发**：每次 push 时设置 | 系统标签 | P0 | 标识推送原因 |

#### Schema 示例

```json
{
  "data_source": "current_context",
  "snapshot_at": "2026-05-12T20:20:00Z",
  "activity_topic": "在打游戏 BOSS 战",
  "mood_estimate": "紧张",
  "interrupt_suitability": "low",
  "attention_target": "游戏",
  "confidence": 0.85,
  "trigger": "mood_change"
}
```

---

### 3.9 Profile 元字段 profile_meta

每条 profile 字段附带元字段，**区分"用户说过"vs"LLM 猜的"**。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `confidence`（0-1） | 置信度 | `0.7` | 消费侧派生 | **规则映射 + LLM 自评混合公式（min 保守）**：详见下方计算公式；**触发**：profile 字段每次产出时同步计算；每日衰减更新 | 元字段 | P0 | 引用前判断"是否说出来" |
| 2 | `source_category`（chat / user_confirmed / game_event / behavior / mcp / vlm / llm_inferred） | 来源域 | `chat / user_confirmed / game_event / behavior / mcp / vlm / llm_inferred` | 记忆系统 | **系统记录**：每条 profile 字段生产时记录来源域 enum；**触发**：写入时标注 | 元字段：Memory Center 来源解释 | P0 | Memory Center 来源解释 |
| 3a | `first_seen_at` | 首次见时间 | `"2026-04-21T09:10:00Z"` | 记忆系统 | **系统时间戳**：写入时记录 first_seen；用户每次确认 / 行为再次验证时更新 last_confirmed | 系统时间戳 | P0 | 时效衰减起点 |
| 3b | `last_confirmed_at` | 末次确认时间 | `"2026-04-21T09:10:00Z"` | 记忆系统 | ↑ 同上 | 系统时间戳 | P0 | 时效衰减计算 |
| 4 | `user_corrected` | 用户已纠错标记 | `false` | 记忆系统 | **Memory Center UI 写入**：用户编辑 / 标"不准" / 删除时设 true；**重要**：LLM 写回前必检 user_corrected=false，否则跳过 | 用户操作标记 | P0 | 纠错锁定（LLM 不再自动写回） |
| 5 | `decay_score` | 衰减分 | `0.95` | 消费侧派生 | **规则时间衰减派生**：`decay = exp(-λ × (now - last_confirmed_at))`，λ 由 Engineering 配置；**触发**：每日批量重算 | 派生标量 | P0 | 桌宠不用自己做衰减逻辑 |
| 6 | `feedback_history[]` | 反馈历史 | `[{feedback_type:"correct", weight_impact:"+0.05"}]` | 记忆系统 | **系统自动写记录**：用户每次反馈（"不准" / "不像我" / "重要" 等）→ append `{feedback_type, at, weight_impact}` | 反馈记录，无原始内容 | P1 | 反馈反哺闭环 |

#### Confidence 计算公式（消费侧实现）

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
    "feedback_history": []
  }
}
```

---

### 3.10 高光事件 highlight_event

服务**日记沉淀 + 画像页"高光记忆"模块**。从底层数据合成抽象（episode / idip_milestone / game_event），一次合成多消费方复用。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `highlight_id` | 高光 ID | `"hl_2026042100001"` | 记忆系统 | **系统生成**：UUID（highlight 触发条件命中时分配） | 系统 UUID | P1 | 主键 |
| 2 | `title` | 标题 | `"首次单杀王者打野"` | 消费侧派生 → 用户可编辑覆盖 | **AI Agent**：LLM 基于 episode + idip_milestone 候选生成（≤20 字）；**用户操作**：UI 可编辑；编辑后 `user_corrected=true`，LLM 不再覆盖 | 引用 atomic_facts 必须 quote_eligible=true | P1 | 标题（≤20 字） |
| 3 | `time` | 时间 | `"2026-04-20T22:15:33Z"` | 记忆系统 | **系统直接**：上游 trigger event 的时间戳（idip_milestone.at / episode.time_range.end / user_starred_at） | 系统时间戳 | P1 | 事件时间 |
| 4 | `scene` | 场景 | `"王者荣耀 - 河道遭遇战"` | 消费侧派生 | **AI Agent LLM 合成**：输入 `active_app` + `window_title_redacted` + `game_vlm.semantic_tags`（VLM 启用时）→ 输出场景描述短句；**触发**：highlight 生成时一次性合成 | 不输出个人身份信息 | P1 | 场景描述 |
| 5 | `event_summary` | 事件摘要 | `"在野区被对方打野针对 3 次后..."` | 消费侧派生 → 用户可编辑覆盖 | **AI Agent**：LLM 生成（≤80 字）；输入 = episode.content + game_event + idip_milestone；**强约束**：引用 `atomic_facts` 必须 `quote_eligible=true`；用户编辑后覆盖 | 引用 atomic_facts 必须 quote_eligible=true | P1 | 摘要 |
| 6 | `category` | 分类 | `achievement / growth / emotion / social / collection / relationship` | 消费侧派生 → 用户可改 | **AI Agent LLM 分类**：输出枚举（achievement / growth / emotion / social / collection / relationship）；**输出 schema 强约束**（禁止自由文本）；用户改后覆盖 | enum 强约束 | P1 | 6 类枚举 |
| 7 | `tags[]` | 标签 | `["反蹲", "单杀", "首次"]` | 消费侧派生 → 用户可改 | **AI Agent LLM 候选**（≤5 条，去重）；用户改后覆盖 | 不输出个人身份信息 | P1 | 自由标签 |
| 8 | `source` | 触发源 | `idip_milestone / episode_highlight_score / user_starred / persona_result` | 记忆系统 | **系统标记触发源 enum**：根据 highlight 生成路径标注 → idip_milestone / episode_highlight_score / user_starred / persona_result | enum | P1 | 触发源 |
| 9 | `privacy_level` | 隐私级别 | `private / shareable` | 记忆系统 | **用户输入**：默认 `shareable`；用户可标 `private`；标 private 后不进 § 3.18 #5 分享卡片生成 | private 不可分享；用户可改 | P1 | private / shareable |
| 10 | `pinned` | 置顶 | `true / false` | 记忆系统 | **用户输入直接**：Memory Center UI 置顶操作 | 用户输入 | P1 | 置顶 bool |
| 11 | `evidence_ids[]` | 证据 IDs | `["game_event_xx", "idip_milestone_xx"]` | 记忆系统 | **系统直接**：highlight 生成时把上游 episode / game_event / idip_milestone / atomic_facts 的 ID 数组写入；供分享卡片 / 复盘 / persona 解释反查实证 | 指向 ID，不含原始内容 | P1 | 反查实证 |

#### Schema 示例

```json
{
  "data_source": "highlight_event",
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

---

### 3.11 用户偏好 user_preferences

画像页**模块 4 / 5 / 6 / 9 / 14**（陪伴方式 / 情绪偏好 / 内容偏好 / 日记风格 / 隐私授权）的持久层。**全部记忆系统提供**（用户主动输入直接存 + 系统反馈记录）。含 5 个子对象 / 22 个字段。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1a | `companion_style.disturb_intensity` | 打扰强度 | `low` | 记忆系统 | **Memory Center UI 写入**：用户在"宠物怎么陪我"面板设置；**LLM 严格禁止自动写入** | 用户主动输入 | P1 | 画像 #4 宠物怎么陪我 |
| 1b | `companion_style.post_game_summary_freq` | 赛后总结频率 | `streak` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 控制赛后是否总结 |
| 1c | `companion_style.streak_loss_strategy` | 连败策略 | `comfort_first` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 连败时先安慰 / 先复盘 / 沉默 |
| 1d | `companion_style.streak_win_strategy` | 连胜策略 | `celebrate` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 连胜时庆祝 / 平淡 / 沉默 |
| 1e | `companion_style.idle_interact_freq` | 空闲互动频率 | `mid` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 空闲桌面互动频率 |
| 1f | `companion_style.activity_remind_freq` | 活动提醒频率 | `low` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 活动提醒频率 |
| 1g | `companion_style.reflection_granularity` | 复盘颗粒度 | `brief` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | none / brief / detailed |
| 2a | `emotion_response.streak_loss_react` | 连败回应方式 | `gentle_encourage` | 记忆系统 | **Memory Center UI 写入**：用户在"情绪响应偏好"面板设置；**LLM 严格禁止自动写入** | 用户主动输入 | P1 | 画像 #5 情绪响应偏好 |
| 2b | `emotion_response.team_mate_impact_react` | 队友影响后反应 | `validate_user_feel` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 被队友坑后希望被怎么回应 |
| 2c | `emotion_response.want_reflection_on_loss` | 失败后想复盘 | `false` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 是否需要复盘 |
| 2d | `emotion_response.accept_jokes` | 接受玩笑 | `true` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 是否接受桌宠开玩笑 |
| 2e | `emotion_response.want_quiet_companion` | 希望安静陪伴 | `false` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 是否希望桌宠少说话 |
| 2f | `emotion_response.love_encouragement` | 喜欢被鼓励 | `true` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 是否需要桌宠主动鼓励 |
| 3a | `content_type.enabled[]` | 启用的内容类型 | `["light_reflection", "emotion_companion", "diary"]` | 记忆系统 | **Memory Center UI 写入**：用户显式勾选启用项 | 用户显式开关；**用户主动设置永远优先** | P1 | 画像 #6 内容偏好；枚举 8 类 |
| 3b | `content_type.priority[]` | 启用项优先级排序 | `["emotion_companion", "diary", "light_reflection"]` | 记忆系统 | **Memory Center UI 写入**：用户拖拽排序 | 用户主动输入 | P1 | 多内容竞争时优先输出顺序 |
| 3c | `content_type.feedback_signal[]` | 反馈记录 | `[{type:"tactical_advice", action:"dislike", at:"..."}]` | 记忆系统 | **系统自动写**：用户点赞 / 点踩反馈累计记录；用于权重学习推荐，**不直接覆盖 enabled** | 仅记录反馈行为；**显式开关优先** | P1 | 反馈学习辅助权重 |
| 4a | `diary_style.frequency` | 日记频率 | `event_driven` | 记忆系统 | **Memory Center UI 写入**：用户在"日记偏好"面板设置；**LLM 严格禁止自动写入** | 用户主动输入 | P1 | daily / weekly / event_driven / off |
| 4b | `diary_style.length` | 日记长度 | `medium` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | short / medium / long |
| 4c | `diary_style.focus` | 日记重点 | `emotion` | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | events / emotion / growth / mixed |
| 4d | `diary_style.quote_user_original` | 引用用户原话 | `true` | 记忆系统 | ↑ 同上 | 引用必须通过个人身份信息检测 | P1 | 是否允许日记引用对话原文 |
| 5a | `privacy_grants.behavior_data` | 行为数据授权 | `{granted: true, granted_at: "2026-04-01T10:00:00Z", revoked_at: null}` | 记忆系统 | **Memory Center 隐私页用户主动勾选**；**LLM 严格禁止自动设置**；撤回时 revoked_at = now，不删历史数据 | 默认 false；强制用户主动 | P1 | 画像 #14 行为数据采集授权 |
| 5b | `privacy_grants.chat_content` | 聊天内容授权 | 同 5a 格式 | 记忆系统 | ↑ 同上 | ↑ 同上 | P1 | 聊天内容入 memory 授权 |

#### Schema 示例

```json
{
  "data_source": "user_preferences",
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
    "feedback_signal": [{"type": "tactical_advice", "action": "dislike",
                        "at": "2026-05-10T20:01:00Z"}]
  },
  "diary_style": {"frequency": "event_driven", "length": "medium", "focus": "emotion"},
  "privacy_grants": {
    "behavior_data": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null},
    "chat_content": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null}
  }
}
```

---

### 3.12 用户画像 profile 扩展

画像页**模块 2 游戏习惯 + 模块 3 游戏目标**。补**枚举级标签**（现有 interests / preferences 是自由文本）。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `profile.gameplay_motivation[]`（多选） | 游戏动机（多选） | `["rank", "play_with_friends"]` | 记忆系统（用户多选确认结果） | **Memory Center UI 写入**：用户在画像页"游戏目标"区从候选 #2 中多选确认；写入后 `user_corrected=true` | 用户多选确认 | P1 | 模块 3"游戏目标"；枚举：rank / chill / social / collect / story / practice_char / play_with_friends |
| 2 | `profile.gameplay_motivation_candidates[]` | 游戏动机候选 | `["rank", "play_with_friends", "practice_char"]` | 消费侧派生 | **AI Agent LLM 推断**：输入 = chat（atomic_facts / interests）+ behavior_patterns；输出 = 候选枚举多选；**触发**：每 7 天 / chat 累计 ≥ N 条新对话 / 用户进画像页时 query | LLM 推断；UI 候选 | P1 | UI 展示候选给用户勾选；与 #1 字段独立 |
| 3 | `profile.gameplay_style_tags[]` | 游戏风格标签 | `["outcome_sensitive_high", "squad_lean", "growth_stage_mid"]` | 消费侧派生 → 用户可改 | **AI + 规则混合派生**：LLM 推断（基于行为风格描述）+ 规则派生（基于 idip_delta 胜负率 / behavior 单人多人偏好 / game_session 频次累计）；**触发**：每 N 局后 / 行为更新；变化时通知 Memory Center 显示"画像更新了" | LLM 派生 + 用户可改 | P1 | 模块 2"游戏习惯"；枚举：outcome_sensitive_high/mid/low / solo_lean / squad_lean / growth_stage_early/mid/late |

#### Schema 示例

```json
{
  "data_source": "profile",
  "gameplay_motivation": ["rank", "play_with_friends"],
  "gameplay_motivation_candidates": ["rank", "play_with_friends", "practice_char"],
  "gameplay_style_tags": ["outcome_sensitive_high", "squad_lean", "growth_stage_mid"]
}
```

---

### 3.13 游戏人格测定 game_persona_assessment

画像页**模块 10 / 11**"游戏人格测定 + 角色相似度"。**接入公司既有外部人格测定平台**（每游戏定制，非通用 MBTI）。memory 是结果存储方，不是计算方。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `assessment_id` | 测定 ID | `"persona_2026051200001"` | 记忆系统 | **系统生成**：UUID（测定触发时分配） | 系统 UUID | P1 候选 | 主键 |
| 2 | `persona_label` | 人格标签 | `"团战指挥型"` | 消费侧派生 | **公司既有外部人格测定平台**：跨边界调用（用户授权后） → 输入 memory.game_event + idip_milestone + chat（部分）→ 平台返回人格标签 → 写回 memory 持久化 | evidence_strength ≥ 3 红线；跨产品平台调用需用户显式同意 | P1 候选 | 人格标签（如"团战指挥型"） |
| 3 | `persona_schema_version` | 分类体系版本 | `"honor_of_kings_persona_v2.3"` | 消费侧派生 | **公司平台返回**：每次测定返回该游戏当前的分类体系版本号；用于本地检测旧版本结果过期 | 公司平台返回 | P1 候选 | 分类体系版本（防 meta 漂移） |
| 4 | `similarity_breakdown[]` | 相似度分解 | `[{candidate:"团战指挥型", score:0.87, evidence_ids:[...]}]` | 消费侧派生 | **公司平台计算返回**：候选人格 + 0-1 相似度分数 + 支持证据 IDs（指向 memory 内的 game_event / idip_milestone）；UI"为什么像 TA"基于此反查实证 | 同 persona_label | P1 候选 | [{candidate, score, evidence_ids[]}] |
| 5 | `assessment_at` | 测定时间 | `"2026-05-12T15:00:00Z"` | 记忆系统 | **系统时间戳**：测定调用完成时刻 | 系统时间戳 | P1 候选 | 测定时间 |
| 6 | `data_window` | 数据窗口 | `{from:"...", to:"...", session_count:62}` | 记忆系统 | **系统直接**：测定调用前由记忆系统侧统计当前可用数据窗口范围（from / to / session_count）并传给外部平台；同步写回 memory | 系统统计 | P1 候选 | {from, to, session_count} |
| 7 | `user_feedback`（accepted / rejected / not_like_me） | 用户反馈 | `accepted / rejected / not_like_me / null` | 记忆系统 | **用户输入直接**：UI 反馈按钮 → 写入；下次测定时作为权重输入传给外部平台 | 用户输入 | P1 候选 | 反哺下次测定权重 |
| 8 | `evidence_strength` | 证据强度 | `4`（≥3 红线） | 记忆系统 | **系统直接**：统计 `similarity_breakdown[0].evidence_ids` 数组长度；**强约束**：≥3 才允许 UI 展示结果，否则显示"测定中" | 系统统计；**≥3 红线** | P1 候选 | **≥3 红线** |
| 9 | `is_expired` | 已过期标记 | `false` | 消费侧派生 | **规则对比**：`persona_schema_version` vs 当前从公司平台拿到的最新版本号；不一致 → is_expired=true → UI 提示"旧版本测定，是否重测" | 派生标量 | P1 候选 | 旧版本测定过期标记 |

#### Schema 示例

```json
{
  "data_source": "game_persona_assessment",
  "assessment_id": "persona_2026051200001",
  "persona_label": "团战指挥型",
  "persona_schema_version": "honor_of_kings_persona_v2.3",
  "similarity_breakdown": [
    {"candidate": "团战指挥型", "score": 0.87,
     "evidence_ids": ["game_event_2026050800123", "idip_milestone_2026050900045",
                      "game_event_2026051001288"]}
  ],
  "assessment_at": "2026-05-12T15:00:00Z",
  "data_window": {"from": "2026-04-12T00:00:00Z", "to": "2026-05-12T00:00:00Z",
                  "session_count": 62},
  "user_feedback": null,
  "evidence_strength": 4,
  "is_expired": false
}
```

---

### 3.14 消费侧派生 / 生成清单

**所有派生 / 生成工作**清单。派生工作的责任归消费侧；结果是否写回 memory 是 Engineering 实现优化（详见 § 1.3.3），不改变归属。

#### 3.18.1 ① 派生计算（规则代码 / 计数 / 信号处理 / 加权派生）

| # | 字段 / 视图 | 触发 | 前置数据 | 实现 | 是否写回 memory |
|---|---|---|---|---|---|
| 1 | `idip_delta` / `idip_anomaly` / `idip_milestone` | idip_snapshot 更新 | idip_snapshot 当前 + 历史 | 规则代码（state diff / 模式识别） | ✅ 写回 |
| 2 | behavior A1 派生指标（input_intensity / typing_rhythm / mouse_burst 等） | 实时（高频） | OS 原始键盘 / 鼠标 / 多屏事件 | 桶化派生（10s / 1min 窗口） | ⚠️ short-term buffer |
| 3 | behavior A3 编辑动作派生（IME / undo_redo rate / 编辑会话时长） | 实时 | OS 编辑事件 | 二阶统计派生 | ⚠️ short-term buffer |
| 4 | audio A0（BPM / energy / beat_points / mute_state） | 音频开启时实时 | 系统音频流（本地，不持久化原音频） | 信号处理库（aubio / BeatNet / cpal） | ❌ 仅 short-term buffer ≤30s |
| 5 | `episode.highlight_score` | episode 闭合时 | idip_milestone + emotion_strength + user_action | 规则加权 | ✅ 写回 episode |
| 6 | `game_session.duration_signal` | game_session 期间 | game_session.start | 时间差派生 | ✅ 写回 |
| 7 | `idle_signal`（>5min / >10min / >30min） | 实时 | OS idle 时间 | 阈值分级 | ✅ 写回 |
| 8 | `app_switch_burst` / `recent_apps_top3` | 1h 滚动 | active_app 时序 | 滚动窗口统计 | ⚠️ short-term buffer |
| 9 | `profile_meta.confidence` / `decay_score` | profile 更新 / 周期性 | source_category + LLM 自评 + first_seen 时间 | 混合公式 + 时间衰减 | ✅ 写回 |

#### 3.18.2 ② LLM 派生（AI 抽取 / 摘要 / 推断 / 分类）

| # | 字段 | 触发 | 前置数据 | 实现 | 是否写回 memory |
|---|---|---|---|---|---|
| 1 | `atomic_facts[]` | chat segment 闭合 | chat_text 原文 + profile context | AI Agent（LLM 抽取） | ✅ 写回 |
| 2 | `episode.title / content` | chat segment 闭合 | atomic_facts + chat_text + game_event | AI Agent（LLM 摘要） | ✅ 写回 |
| 3 | `profile.summary / interests / preferences / behavior_patterns / personality_traits / key_facts` | episode 累积 / 周期性 / 用户触发 | episode + atomic_facts + behavior_patterns 累积 | AI Agent（LLM 生成 + 用户编辑覆盖） | ✅ 写回 |
| 4 | `profile.gameplay_motivation_candidates[]` | 每 7 天 / chat 累积阈值 | chat + behavior_patterns | AI Agent（LLM 推断） | ✅ 写回 |
| 5 | `profile.gameplay_style_tags[]` | 每 N 局后 / 行为更新 | behavior + idip + game_event | AI + 规则混合派生 | ✅ 写回 |
| 6 | `emotion_signal` | chat 实时 | chat_text 当前 segment | AI 推断 | ✅ 写回 |
| 7 | `event_emotion_tag` | game_event 触发 | game_event + idip_delta + chat 上下文 | AI 推断（复用 emotion_signal 模型） | ✅ 写回 |
| 8 | `current_context.*`（activity_topic / mood / interrupt / attention） | 5min 滑窗 / 变化触发 | behavior_pc + active_app + game_event + emotion + chat 滑窗 | AI Agent（滑窗推导） | ✅ 写回（变化推送 + 心跳） |
| 9 | `highlight_event` 的 `title / scene / event_summary / category / tags` | highlight 触发条件命中 | episode + idip_milestone + game_event + atomic_facts | AI Agent（LLM 合成 + 用户编辑覆盖） | ✅ 写回 |
| 10 | `atomic_facts.quote_eligible` | atomic_facts 生产时 | atomic_facts 内容 | 规则个人身份信息检测（正则 + NER）+ 可选 LLM 二次过滤 | ✅ 写回 |

#### 3.18.3 ③ 外部平台派生（VLM 模型 / 公司既有平台）

| # | 字段 | 触发 | 前置数据 | 实现 | 是否写回 memory |
|---|---|---|---|---|---|
| 1 | `game_vlm.semantic_tags[]` / `user_visible_summary` | VLM opt-in app 前台 | active_app + 视觉帧 buffer ≤60s | VLM 推理服务（CNN 初筛 + 量化 7-8B VLM + 云端兜底） | ✅ 写回（不存原图） |
| 2 | `game_persona_assessment.persona_label` / `persona_schema_version` / `similarity_breakdown` / `is_expired` | 用户主动测定 / 数据量首达标 / 重大版本更新 | game_event + idip_milestone + chat（部分） | 公司既有外部人格测定平台（跨边界，用户授权） | ✅ 写回 |

#### 3.18.4 ④ 实时动态生成（不进 memory schema，按桌宠 IP / 场景每次生成）

| # | 内容 | 触发 | 前置数据（从 memory 拿） | 实现 | 生成约束 |
|---|---|---|---|---|---|
| 1 | **日记正文** | 用户查看 / 定时 | `episode` (highlight_score) + `atomic_facts` (quote_eligible) + `event_emotion_tag` + `game_event` + `idip_milestone` + 桌宠 IP | 日记生成器 LLM agent | 受 `user_preferences.diary_style` 约束；引用原话必须 quote_eligible=true |
| 2 | **一句话画像卡片 / 总览页标语** | 画像页加载 | `profile.summary` + 桌宠 IP | UI Composer | ≤30 字 |
| 3 | **高光记忆"宠物视角观察" `pet_observation`** | 高光页加载 / 分享时 | `highlight_event.*` + 桌宠 IP | 消费侧 LLM | 不写回 memory；每次按 IP 重新生成 |
| 4 | **桌宠实时对话回复** | 实时交互 | memory 全套 + current_context + 桌宠 IP | 桌宠 agent LLM | 受 PRIVACY_BOUNDARY 全部硬约束 + user_preferences 约束 |
| 5 | **高光分享卡片图文** | 用户分享 | `highlight_event` (privacy_level = shareable) + 分享模板 + 桌宠 IP | 分享服务 | privacy_level = private 的不可分享 |
| 6 | **人格测定结果页解释文案**（"为什么像 TA"） | 测定完成 / 查看 | `game_persona_assessment.similarity_breakdown[]` + 反查 evidence_ids → game_event / idip_milestone + 桌宠 IP | UI Composer | 必须基于 evidence_ids 实证；**禁止 LLM 编造证据** |
| 7 | **profile.summary 重写**（用户点"重新总结一下我"） | 用户点击 / 周期性 | profile 全字段 + 最近 episode + highlight_event | LLM agent | **例外**：写回 memory.profile.summary（记忆系统常驻 + 消费侧触发更新） |

#### 3.18.5 红线

| # | 红线 |
|---|---|
| 1 | 记忆系统不做派生（派生工作责任归消费侧；写回 memory 是实现优化不改归属） |
| 2 | ④ 类（IP 实时生成）默认不写回 memory（例外见 #8） |
| 3 | 桌宠 IP 语气内容只走 ④ 类 |
| 4 | 必须基于 memory 实证，禁止 LLM 编造（pet_observation / persona 解释 / 日记正文 都必须有 evidence_ids 回溯）|
| 5 | 生成失败不静默兜底（UI 显示"内容生成中" / "暂时不可用"，不假装生成成功） |

---

## 4. PRIVACY_BOUNDARY 关系汇总

| 模块 | 与 PRIVACY_BOUNDARY § 2 硬约束的关系 | 修订提案（Deferred）涉及 |
|---|---|---|
| § 3.1 chat | ✅ 不冲突 | 否 |
| § 3.2 PC 进程 | ✅ 不冲突 | 否 |
| § 3.3 behavior - UI & 用户操作 | ⚠️ #3 不记录键盘输入 — 已守住（L2 / L3 红线） | 否 |
| § 3.4 MCP 通道 | ✅ 不冲突；用户单 app 勾选 + 仅 app 元数据 | 否 |
| § 3.5 idip | ✅ 不冲突 | 否 |
| § 3.6 实时事件 | ✅ 不冲突 | 否 |
| § 3.7 VLM | ⚠️ #1 不默认全屏截图 — 仅用户显式开 + 前台 + 短期 buffer + 不持久化原图 | **是**（v2.3 VLM 视频扩展） |
| § 3.8 current_context | ✅ 不冲突 | 否 |
| § 3.9 profile_meta | ✅ 不冲突 | 否 |
| § 3.10 highlight_event | ✅ 不冲突 | 否 |
| § 3.11 user_preferences | ✅ 不冲突；是 PRIVACY_BOUNDARY 二级开关 UI 落地 | 否 |
| § 3.12 profile 扩展 | ✅ 不冲突 | 否 |
| § 3.13 persona | ⚠️ 跨产品平台调用 — 需用户显式同意（前置 #4） | 否（外部平台接入边界） |
| § 3.14 消费侧派生 / 生成 | ✅ 不冲突（不存储原始 / 受 IP 约束） | 否 |

**当前状态**：涉及修订的模块（§ 3.7 VLM）按本文档分支级约束实施；项目级硬约束的最终修订待后续审议。

---
