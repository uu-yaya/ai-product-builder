# Privacy Boundary: Memory System

> Project: `desktop-pet`
> Thread: PM Strategy Thread
> Task: `T-010` in `TASK_BOARD.md` / user prompt label `T-00Y`
> Date: 2026-05-08
> Status: PM privacy boundary draft
> Scope: 产品隐私边界与数据处理原则；不包含法务条款、工程实现或 UI 视觉设计。

## 1. Boundary Summary

记忆系统采用白名单式采集：默认只允许 first-party game events、用户主动对话 / 反馈、桌宠互动偏好，以及低敏 active app / window title / idle context 进入 P0 能力范围。

任何未列入白名单的数据都不应默认采集、上传或写入长期记忆。

## 2. Hard Constraints

| Constraint | Requirement |
|---|---|
| 不默认 Recall 式后台截图 | 不做后台全屏定时截图、持续屏幕录制、自动 OCR 时间线或跨 app 视觉记忆。 |
| 不默认系统音频监听 | 不持续监听系统音频、麦克风、语音聊天、会议内容或游戏语音。 |
| 不记录键盘输入内容 | 不记录用户键盘输入正文、密码、聊天内容、快捷键序列或 keylogging 类数据。 |
| 不长期存跨 app 全文 | 不默认读取或长期保存文档、网页、聊天、IDE、终端等第三方 app 的全文 UI。 |
| 不上传 raw OS context | active app、window title、UI text、截图、音频等原始桌面上下文默认不得上传云端。 |
| 不写敏感业务信息 | 不写公司机密、真实玩家数据、未脱敏日志、内部代号、合作方信息或 IP 授权细节。 |
| 不使用 Recall 作为数据源 | Windows Recall 可作为生态参考，但不作为桌宠读取用户电脑历史的数据源。 |

## 3. Data Collection Whitelist

### 3.1 P0 Whitelist

| Data Category | Examples | Sensitivity | Default Handling | Long-term Memory Rule | Cloud Boundary |
|---|---|---:|---|---|---|
| 用户主动对话 / 反馈 | “叫我某个昵称”、语气偏好、明确要求记住的信息 | S0 | 可采集 | 可长期保存，用户可查看 / 修改 / 删除 | 仅在对话或模型调用必要时发送最小上下文；不得发送敏感信息。 |
| First-party game events | 关卡、成就、失败、组队、活动、任务状态、游戏内召唤 | S1 | 游戏侧授权后采集 | 原始事件短期保留，长期只保存摘要或偏好信号 | 默认不上传 raw event；如游戏服务端已有合规链路，应与桌宠记忆权限隔离。 |
| Pet interaction events | 召唤、隐藏、关闭、拒绝提醒、喜欢 / 不喜欢反馈 | S1 | 可采集 | 可形成通知策略与互动偏好 | 只上传脱敏摘要或用户确认内容。 |
| Active app | app name、bundle id / process id、是否游戏 / launcher | S2 | P0 可选开关；local-first | 仅生成低敏状态摘要，不长期保存完整历史 | 不上传 raw app history。 |
| Window title | 已允许 app 的窗口标题、游戏标题、launcher 页面标题 | S2 but can become sensitive | P0 可选开关；需 blocklist / redaction | 默认不长期保存原文；只保存脱敏摘要 | 不上传 raw title。 |
| Idle / full-screen signal | idle 10 min、全屏游戏中、勿扰状态 | S2 | 可采集 | 可长期保存为通知策略 | 可作为脱敏状态使用，不上传原始时间线。 |

### 3.2 P1 / P2 Only With Explicit Consent

| Data Category | Allowed Condition | Storage Boundary | Cloud Boundary |
|---|---|---|---|
| Structured UI text | 用户开启增强上下文，并限定 allowlist app 或用户主动提问 | 短期 buffer；长期只保存摘要和来源 | 默认不上传原文；必要时发送用户确认的脱敏片段。 |
| 用户主动截图 / 框选 | 用户点击主动触发，并看到预览 / 确认 | 默认不保存原图；只保存摘要；原图短期保留需单独确认 | 不上传原图；如需视觉模型，必须用户确认。 |
| UserActivity metadata | First-party game / desktop-pet 自己声明活动 | 可作为 game event 辅助 | 只传递脱敏 activity id / state。 |
| Memory export / sync | 用户主动开启同步或导出 | 导出格式应可读、可删除 | 云同步必须单独 opt-in，且不包含 raw OS context。 |

### 3.3 Not In Product Scope By Default

| Data Category | Status |
|---|---|
| 全屏定时截图 / 持续屏幕录制 | Not allowed by default |
| 系统音频 / 麦克风持续监听 | Not allowed by default |
| 键盘输入内容 / keylogger | Not allowed |
| 浏览器隐私窗口 / 密码管理器 / 银行 / 系统隐私设置 | Default blocklist |
| 第三方聊天、文档、邮箱、终端全文 | Not allowed by default |
| 未脱敏真实玩家数据、公司资料、内部代号 | Not allowed in repo, logs, prompts, or sync messages |

## 4. Local Storage Vs Cloud Sync

### 4.1 Local-first Boundary

| Data | Local Storage | Default Retention | Notes |
|---|---|---|---|
| Raw game events | Local short-term buffer | Recommended <= 24h before summary / deletion | Debug data must be synthetic or redacted. |
| Raw active app / window title events | Local short-term buffer | Recommended <= 24h | Long-term memory should store summary, not full timeline. |
| User preference memory | Local long-term memory | Until user deletes or retention expires | User visible and editable. |
| Game signal memory | Local long-term summary | Recommended 30-90 days by default | Per-game delete and disable should be supported. |
| Screenshot original | Local temporary only if user explicitly confirms | Default no long-term retention | Prefer summary-only. |
| Structured UI text raw | Local short-term buffer | Short-lived only | Not a default P0 source. |

### 4.2 Cloud Sync Boundary

Cloud sync is not a P0 requirement. If later enabled, it must follow these rules:

- Default Off unless user or product policy explicitly enables it with clear consent.
- Only sync user-visible memory summaries, user preferences, and non-sensitive game signal summaries.
- Do not sync raw OS context, raw window title history, raw screenshots, raw UI text, system audio, keyboard content, or hidden debug logs.
- Provide per-category sync toggles and a full cloud delete path.
- Do not include company internal codenames, partner details, true player identifiers, or unredacted logs.
- If cloud LLM is used, send the minimum required memory context and prefer redacted summaries over raw events.

## 5. Delete / Disable / Correct Paths

| User Need | Requirement | Priority |
|---|---|---:|
| Stop all memory | A global memory toggle pauses new memory writes. | P0 |
| Stop OS context | A separate toggle disables active app / window title / idle context collection. | P0 |
| Stop game memory | Per-game memory toggles disable new game-event memory. | P0 |
| Delete one memory | User can delete a single memory entry. | P0 |
| Delete by category | User can delete all preferences, game memories, OS context summaries, or notification policies. | P0 |
| Delete by game | User can remove all memory tied to a selected game. | P1 |
| Delete all | User can reset all desktop-pet memory. | P0 |
| Correct wrong memory | User can edit, supersede, or mark a memory as wrong. | P0 |
| Pause temporarily | User can enter privacy mode for a session. | P0 |
| Audit source | User can see source category and time for each long-term memory. | P0 |
| Export | User can export user-visible memory in a readable format. | P1 |

Deletion rule: once a memory is deleted or disabled, it must stop being used for retrieval, generation, recommendations, reminders, and future summaries. Engineering should define whether tombstones are needed for abuse prevention or sync consistency, but tombstones must not preserve sensitive content.

Correction rule: corrected memory should supersede the old version. The product should not silently re-create the same wrong memory from stale raw events.

## 6. Memory Center Requirement Boundary

Memory Center is required as a trust surface, but this PM file only defines product capabilities.

Memory Center should let users:

- See what the pet remembers.
- Understand why a memory exists.
- Disable memory by category.
- Delete or reset memory.
- Correct wrong memory.
- Pause memory collection.
- See whether OS context is enabled.
- See whether cloud sync or cloud model context is enabled.

Memory Center should not expose:

- Raw screenshots by default.
- Raw window title timelines by default.
- Raw third-party UI text.
- Internal logs, internal project identifiers, partner identifiers, or real player data.

## 7. Company Business Constraints

| Constraint | Product Boundary |
|---|---|
| No sensitive upload | Do not upload raw desktop context, real player data, company docs, internal codenames, partner info, or unredacted logs. |
| No real player samples in APB docs | PM / Design / Engineering docs should use synthetic examples and abstract event names. |
| No hidden telemetry expansion | Adding a new memory source requires updating the whitelist and user-facing control requirements. |
| No production credential handling | Memory system docs and tests must not include tokens, API keys, secrets, or production endpoints. |
| No cross-game leakage by default | Memory from one game should not influence another game unless user and product policy explicitly allow shared memory. |
| No stealth permissions | OS permissions and enhanced context modes must be visible and reversible. |

## 8. Privacy Review Checklist

Before Engineering or Design expands the memory system beyond P0, the following must be answered:

- What exact data category is added?
- Is it S0 / S1 / S2 / S3 / S4 / S5?
- Is the source first-party, user-provided, OS-level, or third-party app content?
- Is it raw data, summary, embedding, or preference?
- Is it local-only, cloud-synced, or sent to a model?
- How long is it retained?
- Can the user view it?
- Can the user delete it?
- Can the user disable future collection?
- Can the user correct wrong memories?
- What is the default state?
- What happens in sensitive apps or privacy mode?

## 9. Open Questions

| # | Question | Owner |
|---:|---|---|
| 1 | 是否允许 P0 低敏 OS context 默认开启，还是必须默认关闭并由用户开启？ | User + PM + Design |
| 2 | 云端 LLM 是否允许接收脱敏记忆摘要？如允许，是否需要单独用户开关？ | User + PM + Engineering |
| 3 | Per-game memory 是否默认隔离，还是支持用户开启跨游戏共享偏好？ | User + PM |
| 4 | 长期 game signal 默认保留期应为 30 天、90 天，还是按游戏配置？ | User + PM |
| 5 | Engineering 是否需要为 Memory Center 提供 deletion tombstone？若需要，tombstone 字段不能保留敏感内容。 | Engineering |
| 6 | Design 是否把 Memory Center 作为 MVP 信任基础，而非后置设置页？ | Design + User |

## 10. Acceptance Criteria

- P0 数据采集白名单清晰，且默认不采集白名单外数据。
- 明确继承 Main 决策：不默认 Recall 式后台截图、系统音频监听、键盘输入记录。
- 明确 raw OS context local-first，不默认上传云端。
- 删除、禁用、纠错路径覆盖全局、类别、单条、按游戏和临时隐私模式。
- 公司业务约束明确：不上传敏感数据，不写内部代号，不写真实玩家数据。
- 后续新增数据源必须经过隐私清单审查，不能隐式扩大采集范围。
