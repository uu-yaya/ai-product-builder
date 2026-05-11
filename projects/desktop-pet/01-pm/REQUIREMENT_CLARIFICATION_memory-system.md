# Requirement Clarification: Memory System

> Project: `desktop-pet`
> Thread: PM Strategy Thread
> Task: `T-010` in `TASK_BOARD.md` / user prompt label `T-00Y`
> Date: 2026-05-08
> Status: PM clarification draft
> Scope: 需求澄清与产品边界；不包含 UI 高保真设计或工程架构实现。

## 1. PM Conclusion

`desktop-pet` 的记忆系统 P0 不应定位为“观察玩家电脑的一切”，而应定位为“在用户可控边界内，让桌宠更懂玩家、游戏状态与打扰时机”。

P0 推荐采用 `Context Lite Memory`：

- 主数据源：first-party game events、用户主动对话与反馈。
- 辅助上下文：低敏 active app / window title / idle / full-screen game signal。
- 默认不做：Recall 式后台全屏截图、系统音频持续监听、键盘输入内容记录、跨 app 全文长期存储、默认云端上传 raw desktop context。
- 产品信任基础：长期记忆必须可见、可删、可禁用、可纠错，并能解释“这条记忆来自哪里”。

## 2. Sources Read

| Source | Used For |
|---|---|
| `00-context/PROJECT_CONTEXT.md` | 项目定位、目标用户、Discovery 阶段约束、AI 能力候选和隐私 Open Questions |
| `06-sync/SYNC_SUMMARY.md` | 当前项目状态、T-010 输入、记忆系统开放问题 |
| `06-sync/TASK_BOARD.md` | 任务映射；用户 prompt 的 `T-00Y` 对应任务板 `T-010` |
| `06-sync/group/2026-05-08T19-25-29_main_closeout-desktop-context-memory-frameworks.md` | Main Thread 对 P0 采集策略的收口结论 |
| `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` | Radar 对 macOS / Windows 上下文采集、OpenChronicle、Recall-like 框架与数据分级的调研 |
| `decisions/DECISION_LOG.md` | 当前决策日志；截至本文件写入时，未看到用户 prompt 所说的 P0 采集策略决策行 |

## 3. Known Information

| Category | Known Information | Type | Product Implication |
|---|---|---|---|
| Project positioning | 项目是多游戏可配置 AI 桌宠 SDK / 平台能力探索，不绑定单个游戏。 | Fact | 记忆系统应服务多游戏集成与复用，不能只写死单游戏数据结构。 |
| Current stage | 项目处于 Discovery，MVP 范围、北极星指标、技术栈、商业模式仍未确认。 | Fact | 本文件输出边界和待确认问题，不把所有能力写成已锁定需求。 |
| Main P0 decision | P0 采用 `Context Lite Memory`：first-party game events + 用户主动对话 + 低敏 active app / window title / idle context。 | Decision from sync/group | 采集白名单从游戏与用户主动输入开始，OS context 只做辅助。 |
| Radar conclusion | OpenChronicle 可作为 macOS 本地记忆层参考；Windows 需组合 UIA / WinEvent / Graphics Capture / UserActivity。 | Research fact | 不直接把业务绑定到单一 OS 记忆框架；跨平台能力要降级设计。 |
| Privacy stance | P0 不默认全屏截图、系统音频、键盘输入、跨 app 全文长期存储。 | Decision + recommendation | 默认体验必须避免“监控电脑”感知。 |
| Memory productization | 长期记忆需要 Memory Center：查看、删除、禁用、纠错、来源解释。 | Requirement direction | Memory Center 是信任基础，但具体 UI 由 Design Thread 定义。 |
| Business boundary | APB 文件不写公司机密、真实玩家数据、未脱敏日志、内部代号或合作方信息。 | Constraint | 文档与后续测试均使用抽象字段和合成样例。 |

## 4. Requirement Restatement

本次要澄清的是“桌宠记忆系统”在 MVP 与后续阶段应该采什么、不采什么、存多久、用户如何控制，以及这些边界如何分别服务游戏开发者集成和玩家使用。

本文件不直接决定：

- Memory Center 的页面布局、组件和视觉方案。
- `Context Capture Adapter` 的具体技术架构。
- 模型、数据库、SDK API 的最终实现。
- 是否接入真实游戏、真实玩家数据或生产环境。

## 5. User Scenarios And Memory Semantics

### 5.1 Game Developer Integration

| Scenario | Developer Job To Be Done | Memory Means For Developer | P0 Requirement | Non-goal |
|---|---|---|---|---|
| SDK 接入评估 | 判断桌宠是否能读取游戏状态并安全形成陪伴记忆。 | 可配置、可审计的数据事件 schema。 | 提供 first-party game event 分类：进度、成就、失败、组队、活动、任务状态、用户授权偏好。 | 不要求开发者开放完整游戏日志或内部运营数据。 |
| 数据边界配置 | 控制哪些事件可用于桌宠记忆、哪些只用于即时反馈。 | 数据权限与保留期策略。 | 每类 game event 必须能声明 sensitivity、retention、user_visible、memory_writable。 | 不默认把所有 telemetry 写入长期记忆。 |
| 调试与验收 | 验证某条记忆为什么生成、是否可删除或纠错。 | 可追溯的 memory provenance。 | P0 至少保留“来源类别 + 时间 + 触发规则 / 用户确认状态”。 | 不暴露真实玩家个人资料或完整原始日志。 |
| 多游戏复用 | 不同游戏用同一套记忆能力，但事件名可映射。 | 跨游戏抽象记忆类型。 | 记忆类型优先抽象为 `user_preference`、`game_progress_signal`、`pet_relationship`、`notification_policy`。 | 不把单个游戏的内部术语写成通用 PM 需求。 |

### 5.2 Player Usage

| Scenario | Player Job To Be Done | Memory Means For Player | P0 Requirement | Non-goal |
|---|---|---|---|---|
| 个性化陪伴 | 桌宠记得称呼、语气偏好、最近游戏状态。 | 被理解，而不是被监控。 | 只把用户主动说过的信息和授权游戏事件写入长期记忆。 | 不默认读取聊天、文档、网页正文。 |
| 低打扰出现 | 桌宠知道什么时候该安静。 | 控制感和尊重。 | 使用 active app / full-screen / idle 等低敏信号判断打扰时机。 | 不通过键盘输入、系统音频或持续截图判断用户状态。 |
| 游戏内外连续性 | 游戏结束后桌宠能轻量承接互动。 | 游戏经历和关系连续。 | 允许游戏事件生成摘要记忆，如“最近常玩某类活动”“偏好安静提醒”。 | 不把每局完整战斗日志长期保存。 |
| 记忆控制 | 玩家能查看、删除、禁用、纠错记忆。 | 透明和可撤回。 | P0 / P1 必须定义 Memory Center 的需求能力。 | 本文不设计具体 UI。 |

## 6. Data Collection Scope

### 6.1 P0 Collect

| Data | Examples | Source | Default | Storage Intent | Notes |
|---|---|---|---|---|---|
| 用户主动对话与反馈 | 昵称、称呼、语气偏好、想少打扰、明确说“记住这个” | Pet chat / settings | On | 可进入长期记忆 | 必须支持删除和纠错。 |
| First-party game events | 登录、关卡、成就、失败、组队、活动提醒、任务状态、游戏内召唤桌宠 | Game SDK | On only after game integration consent | 短期 raw event + 长期摘要 | P0 主数据源；事件必须是脱敏抽象字段。 |
| Pet interaction events | 召唤、隐藏、关闭、拒绝提醒、喜欢 / 不喜欢某类反馈 | Desktop pet runtime | On | 用于偏好和通知策略 | 不应记录敏感输入内容。 |
| 低敏 active app context | app name、process / bundle id、是否全屏、idle / active | OS focus APIs | Optional On in P0, local-first | 主要用于打扰时机，不默认长期保存原始标题 | 需要 blocklist 和 redaction。 |
| 低敏 window title | 游戏 / launcher / 已允许 app 的窗口标题 | OS window APIs | Optional On in P0, local-first | 只写短期 buffer；长期只保留脱敏摘要 | 标题可能包含文件名或聊天对象，默认不原文长期保存。 |

### 6.2 P0 Do Not Collect By Default

| Data | Reason | Allowed Later? |
|---|---|---|
| Recall 式后台全屏截图 / 定时截图 | 隐私感知极强，可能采到聊天、文档、密码、公司资料。 | 仅 P2 用户主动截图 / 框选并预览确认。 |
| 系统音频持续监听 | 可能采到会议、语音聊天、家庭环境和敏感内容。 | 不进入 MVP；后续也需单独强 opt-in 与合规评审。 |
| 键盘输入内容记录 | 接近 keylogging，高风险且不符合桌宠 P0 价值验证。 | 不进入 MVP。 |
| 跨 app 全文 UI / 文档 / 网页长期存储 | 可能采到隐私和公司资料，且跨平台稳定性差。 | P1 仅 allowlist + 用户主动触发 + 短期 buffer。 |
| 浏览器隐私窗口、密码管理器、银行、系统隐私设置、公司文档类 app | 高敏场景。 | 默认 blocklist；不建议开放。 |
| Raw OS context 云端上传 | 容易越过用户预期与公司边界。 | P0 不允许；后续只能上传脱敏摘要且需用户确认。 |

### 6.3 P1 Collect Only With Explicit Opt-in

| Data | Examples | Requirement Boundary |
|---|---|---|
| Structured UI text | AX / UIA visible text、focused element、错误弹窗文字 | 仅 allowlist app；只保留短期 buffer；长期记忆只保存摘要和来源。 |
| 用户主动截图摘要 | 用户点击“让桌宠看看”或框选游戏结算页 / 错误弹窗 | 预览确认后处理；默认不长期保存原图，只保存用户可见摘要。 |
| UserActivity / app-defined activity metadata | 游戏关卡页、任务页、可恢复活动 | 仅 first-party app / game 主动声明，不读取系统全局历史。 |

### 6.4 P2 / Later Exploration

| Data Or Capability | PM Stance |
|---|---|
| Visual context on demand | 可作为“用户主动求助”能力探索，不作为 P0 桌宠记忆基础。 |
| Local semantic search over memory | 可以用于用户查询自己的记忆，但必须先完成查看 / 删除 / 纠错路径。 |
| Recommendation / personalization timing | 需要足够合规数据和评估闭环后再做，不在 P0 直接推荐。 |
| Recall integration | 只能评估 relaunch / DLP / capture protection 等生态能力，不把 Recall 当第三方数据源。 |

## 7. Memory Retention Strategy

### 7.1 Memory Layers

| Layer | Content | Default Retention | User Control | PM Rationale |
|---|---|---|---|---|
| Ephemeral raw event buffer | 最近 game events、pet interactions、active app changes、window title changes | 推荐 24 小时以内，或 session 结束后压缩删除 | 可关闭、立即清空 | 支持短期理解和去重，不把 raw context 变成永久监控记录。 |
| Short-term session memory | 最近一次游戏 / 桌宠互动 session 摘要 | 推荐 7 天，可配置 | 可逐条删除 | 支持连续对话和“刚才发生了什么”。 |
| Long-term user memory | 昵称、语气偏好、明确授权偏好、用户主动保存的信息 | 用户删除前保留；可设置自动过期 | 查看、修改、删除、禁用类别 | 直接服务陪伴关系。 |
| Long-term game signal memory | 常玩游戏类型、活动兴趣、失败 / 成功模式摘要、提醒偏好 | 推荐默认 30-90 天，可由用户设置 | 可按游戏清除或关闭 | 服务个性化反馈，但避免无限累积旧游戏状态。 |
| Notification policy memory | 勿扰时段、全屏安静、拒绝某类提醒、召回频率 | 用户删除前保留 | 可编辑、重置 | 直接降低打扰。 |
| Sensitive / high-risk captures | 用户主动截图原图、结构化 UI 原文 | 默认不长期保留；如保留需用户显式选择 | 可立即删除 | 原始高敏信息不应成为默认长期记忆。 |

### 7.2 Memory Write Principles

- Raw event 不等于 memory：原始事件先进入短期 buffer，经过规则、用户确认或摘要后才可写入长期记忆。
- P0 长期记忆只允许来自用户主动输入、first-party game events、pet interaction preference，以及低敏 OS context 的脱敏摘要。
- Window title 原文默认不进长期记忆；如产生长期记忆，应压缩成低敏标签，例如“用户正在全屏游戏，不应打扰”。
- 高置信偏好才长期保存；低置信推断必须标注为 inferred，并允许用户纠错。
- 记忆更新必须支持 supersede / correction，不依赖悄悄覆盖。

## 8. User Control Requirements: Memory Center

> 本节只定义需求，不定义页面布局、视觉样式或组件方案。具体信息架构由 Design Prototype Thread 负责。

| Capability | P0 / P1 | Requirement |
|---|---:|---|
| 查看记忆 | P0 | 用户能看到长期记忆列表、类别、来源类别、生成时间、是否推断。 |
| 删除单条记忆 | P0 | 用户能删除任何长期记忆，删除后不再用于生成或推荐。 |
| 清空全部记忆 | P0 | 用户能一键重置桌宠记忆。 |
| 禁用类别 | P0 | 用户能关闭用户偏好、游戏事件记忆、OS context 辅助等类别。 |
| 纠错记忆 | P0 | 用户能把错误记忆改正或标记为“不再这样记”。 |
| 记忆来源解释 | P0 | 每条长期记忆至少说明来自“用户主动对话 / 游戏事件 / 桌宠互动 / 低敏 OS context 摘要”。 |
| 隐私模式 | P0 | 用户能临时暂停采集，暂停期间不写入新记忆。 |
| 按游戏管理 | P1 | 用户能按游戏查看和清除相关记忆。 |
| 导出记忆 | P1 | 用户能导出可读格式，用于迁移或审计。 |
| 高敏能力授权记录 | P1 | 如未来支持结构化 UI / 主动截图，用户能看到授权状态和最近使用记录。 |

## 9. AI Necessity And Scope Control

记忆系统涉及 AI，但 P0 不应默认做 Agent。更合理的分层是：规则系统负责采集边界和保留策略，LLM 只在需要自然语言摘要、偏好提取或对话调用记忆时进入，并且通过工具权限约束。

| Approach | Fit For Memory System | P0 Stance |
|---|---|---|
| Rule-based | 采集白名单、blocklist、retention、类别开关、勿扰策略、事件去重。 | 必要，作为 P0 基础。 |
| Search | 在用户可见的本地记忆中查找明确事实。 | 可用，但不是核心 AI 方案。 |
| RAG | 桌宠对话时检索已授权记忆和游戏说明。 | P1 评估；P0 可先用结构化查询。 |
| LLM Prompt | 把游戏事件 / 对话整理成自然语言摘要，生成陪伴式反馈。 | P0 可有限使用，但输入必须最小化和脱敏。 |
| Function Calling | 让 LLM 在明确权限内读取、写入、删除或更新记忆。 | P0 / P1 可用，但必须有 schema、权限校验和用户可见日志。 |
| Workflow | 固定的 ingest -> classify -> summarize -> store -> review 流程。 | 推荐作为 P0 / P1 的可观测编排方式。 |
| Agent | 多步自主规划、跨工具长期任务。 | 不建议 P0 使用；当前目标不需要自主 Agent。 |
| Fine-tuning | 稳定角色风格或记忆抽取任务的长期优化。 | 不进入 MVP，缺少合规数据和评估闭环。 |
| Recommendation System | 推荐互动时机、提醒内容或召回策略。 | P2，需数据规模和隐私评估。 |

## 10. Open Questions

| # | Question | Owner | Why It Matters |
|---:|---|---|---|
| 1 | 记忆系统第一性目标是“更懂玩家与游戏关系”，还是“更懂玩家当前电脑任务”？ | User + PM Strategy Thread | 决定 game events 与 OS context 的权重。 |
| 2 | P0 低敏 OS context 是否默认开启，还是默认关闭但引导用户打开？ | User + PM + Design + Engineering | 影响信任、转化和工程默认权限。 |
| 3 | First-party game event 的最小 schema 需要覆盖哪些事件类型？ | PM + Engineering | 影响 SDK 接入成本和多游戏复用。 |
| 4 | 长期 game signal 默认保留 30 天、90 天，还是按游戏配置？ | User + PM | 影响个性化质量与隐私感知。 |
| 5 | 是否把 Memory Center 作为 MVP 必备信任能力？ | User + Design + Engineering | 没有控制面板，记忆能力不应扩大采集范围。 |
| 6 | 云端 LLM 是否允许处理脱敏摘要？如允许，用户是否需要单独开关？ | User + PM + Engineering | 影响成本、延迟、合规和用户信任。 |
| 7 | 多游戏间记忆是否共享？例如一个游戏的偏好是否影响另一个游戏的桌宠行为？ | User + PM | 影响产品定位和数据隔离。 |
| 8 | `DECISION_LOG.md` 是否需要由 Main Thread 回填 P0 采集策略决策？ | Main Thread | 用户 prompt 与实际文件存在不一致，需要 Main 收口。 |

## 11. Risks And Mitigations

| Risk | Severity | Why | Mitigation |
|---|---:|---|---|
| 用户感知为监控电脑 | P0 | active app / window title 即使低敏也会被用户理解为桌面观察。 | 首次说明采什么 / 不采什么 / 存多久 / 如何删；P0 不做截图、音频、键盘输入。 |
| 采到敏感标题或游戏外隐私 | P0 | 窗口标题可能包含文件名、聊天对象、公司资料。 | blocklist、redaction、local-first、长期只存摘要、可关闭 OS context。 |
| 游戏事件过度采集 | P0 | 开发者可能把过细 telemetry 接入记忆系统。 | 事件 schema 白名单；每类事件声明 retention 和 memory_writable。 |
| 跨平台一致性不足 | P1 | macOS AX / Windows UIA 能力差异大，游戏窗口暴露弱。 | P0 不依赖 AX / UIA；只用 game events + window-level signal。 |
| 错误记忆破坏陪伴关系 | P1 | 陪伴产品“记错用户”会强烈伤害信任。 | 高置信写入、来源解释、纠错、删除、禁用类别。 |
| 合规边界不清 | P1 | 云同步、模型调用、日志留存可能引入额外义务。 | P0 local-first；云端只允许脱敏摘要和用户确认内容。 |
| 公司业务边界泄露 | P1 | 文档或日志可能写入内部代号、真实玩家数据、合作方信息。 | 所有文档使用抽象字段；测试用 synthetic data；不上传敏感数据。 |
| 过度设计 Agent / Recall | P2 | 会拖慢 MVP，并放大隐私与工程复杂度。 | P0 用 Rule-based + Workflow + limited LLM / Function Calling，不默认 Agent。 |

## 12. Acceptance Criteria

- PM 文档明确区分 P0 / P1 / P2 采集范围，并与 Main 的 `Context Lite Memory` 决策一致。
- P0 明确禁止默认 Recall 式后台截图、系统音频监听、键盘输入内容记录和 raw OS context 云端上传。
- 长短期记忆和用户可控保留期有清晰定义。
- Memory Center 需求仅描述用户控制能力，不进入 UI 设计。
- AI 方案没有默认 Agent，并显式比较 Rule-based、Search、RAG、LLM Prompt、Function Calling、Workflow、Agent、Fine-tuning、Recommendation System。
- 对 Design / Engineering / Main Thread 的待确认问题可直接用于下一轮任务。
