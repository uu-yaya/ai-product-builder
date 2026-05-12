# Sync Summary

> Main Thread 维护。其他线程启动时优先读取本文件，而不是回看所有 `group/` 与 `dm/` 历史。

Last Updated: 2026-05-12

## 1. Current Project State

- 阶段：Discovery
- 主线程持有人：uu via Claude (claude.ai/code) + 历史 Codex 阶段
- 当前焦点：memory-dataset 分支 PM 立场升项目级（P0 6 条已 Accepted）；启动 Engineering Build Thread 接 schema；启动 Design Prototype Thread 接 Memory Center；PM 横向扩展（voice-interaction / companion-behavior 分支）；项目级 PRIVACY_BOUNDARY 修订（Deferred 等 voice-interaction 启动后合并审议）
- 当前状态：
  1. **memory-dataset 分支已完成 v2.5.1 + AI Eval v3**（详见 `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5.1 + `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v3）；v2.4 → v2.5 全量修订（**6 通道并存**：MCP + OS API + 浏览器扩展全方位 + OS Scripting Bridge + CLI + IFTTT；**档 A 完整**：A1 派生 + A2 操作语义 + A3 编辑动作派生；§10 键盘分级新增 L1.5；§13 项目级决策候选 11 → 15 条）→ v2.5.1 mock §11 同步补丁（schema_version 0.2.0 → 0.3.0；主文档 16 个数据章节 100% 有对应 mock）；用户 2026-05-11 / 5-12 多轮反馈已全部收口；分支本质从"被动 vs 主动"演化为"脑 vs 嘴和耳"（数据感知层 vs I/O 通道）。
  2. **Radar 已完成两批共 7 项调研**（5/11 三项：行为信号库 / 中国 app MCP / 跨数据源 mock；5/12 四项：音频派生库 / OS Now Playing API / 本地 VLM / 浏览器 tab 检测）；PM 答复 14 个 Radar 问题已就位。
  3. **P0 决策已升项目级 6 条**（VLM 三档混合 / 双轨分发 / MiniCPM-V 法务核验 / aubio IPC 隔离 / MAS MediaRemote 风险 / settings.json 联网放行补登）。
  4. **PRIVACY_BOUNDARY 修订提案 Deferred** — 等 voice-interaction 分支启动后合并审议（届时 STT / 麦克风边界变更需走同一份 amendment）。
  5. **未升项目级（仍以 PM 分支立场为准）的 9 条**：键盘 L0-L3 分级 / VLM 单 app 实例开关 / MCP 默认关 + 自选 / 多游戏 profile 不共享 / current_context 5min 滑窗 / 键盘研发自由度 / 音频 A0-A3 分级（warmup 5s 含在 VLM 三档决策内的部分） / Playwright 受限放行 / PM 字段命名 review 边界。
  6. **下一步阻塞**：T-001 MVP 整体澄清待 PM 横向扩展（仅 memory 一支不够）；T-011 Engineering / T-012 Design 待启动；19 条 §3 OQ 中至少 5 条已被 PM 分支立场解决但未升项目级（保留 Open 状态等用户授权统一升级）。

## 2. Latest Decisions

| Date | Decision | Source |
|---|---|---|
| 2026-04-28 | 项目从 `_PROJECT_TEMPLATE` 创建，定位为公司业务方向探索：游戏 AI 桌宠 SDK，并按 APB Safety Rules 脱敏处理 | `decisions/DECISION_LOG.md` |
| 2026-05-07 | 完成陪伴类桌宠 / AI companion 市场功能调研，作为 T-001 的输入 | `04-research/companion-product-market/TREND_RESEARCH_companion-desktop-pet-products.md` |
| 2026-05-07 | 独立 AI Trend Radar Thread session 已复核并改进市场调研文档，补充事实校正、来源核验和 PM Open Questions | `06-sync/group/2026-05-07T16-53-10_radar_companion-desktop-pet-research-review.md` |
| 2026-05-07 | 多 Radar agent 已完成产品证据矩阵补全：按“产品 + 单个 AI 功能点 / 体验参考点”拆行，并生成 xlsx 表格 | `04-research/companion-product-market/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 完成待核验清单二次核实：新增 `核验结果` 与 `仍需跟进` sheet，并把核验状态写回主矩阵 | `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 按用户长期输出规则完成产品证据矩阵中文化，功能点与功能解释优先使用中文，英文仅保留产品名与必要专业术语 | `04-research/companion-product-market/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 优化产品证据矩阵 Excel 展示：连续相同 Product 纵向合并并居中显示 | `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 精简产品证据矩阵展示列：删除平台、核验状态、核验后处理、功能归类、证据类型 | `04-research/companion-product-market/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 综合用户观点、AI 能力与非 AI 支撑，输出最终功能点总结表，补充体验好的非 AI 功能，并在文末附调研产品 URL 表 | `04-research/companion-product-market/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` |
| 2026-05-08 | 将共同抚养 / Shared Pet Mode 补充为独立功能假设：桌宠可从个人陪伴对象扩展为双人或小队的共同记忆与关系资产 | `04-research/companion-product-market/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` |
| 2026-05-08 | 为最终功能点总结补充 P0 / P1 / P2 优先级表，按 MVP 验证目标排序 | `04-research/companion-product-market/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` |
| 2026-05-08 | 完成 PC 端上下文记忆框架调研：OpenChronicle 是 macOS 开源本地记忆层参考，Windows 需用 UI Automation / WinEvent / Graphics Capture / UserActivity 等组合；desktop-pet P0 建议采用 `Context Lite Memory`，不默认采用全量截图或 Recall 式记录 | `04-research/context-memory-frameworks/TREND_RESEARCH_desktop-context-memory-frameworks.md` |
| 2026-05-08 | PM 完成记忆系统需求澄清与隐私边界：P0 采用白名单式采集，Memory Center 作为信任基础，但默认开关、保留期、云端 LLM 与跨游戏记忆仍待用户确认 | `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` |
| 2026-05-08 | 项目研究文档表格规则更新：`.md` 表格统一使用 GFM pipe table，不再写 HTML table；性能研究表格已验证可渲染 | `PROJECT_RULES.md` + `06-sync/group/2026-05-08T23-36-31_radar_markdown-table-rendering-fix.md` |
| 2026-05-09 | Steam 桌宠类流行游戏调研完成：Bongo Cat / Rusty / Desktop Mate 等证明流行桌宠多靠低打扰存在和清晰反馈闭环，AI 更像放大器而非入口；T-001 需要在 Bongo Cat / Rusty / Desktop Mate / SDK 四条 MVP 路线中收敛 | `04-research/steam-and-embedded-companion/TREND_RESEARCH_steam-popular-desktop-pet-games.md` |
| 2026-05-09 | 用户实测 13 款桌宠 / AI companion 已补充到功能总结与竞品矩阵，强化“低打扰 + 清晰反馈闭环”与“AI companion 向 memory + tools + embodied avatar + creator ecosystem 演进”的判断 | `06-sync/group/2026-05-09T19-25-43_radar_user-tested-desktop-pet-supplement.md` |
| 2026-05-09 | 免费 / 开源桌宠扩展完成：Steam 免费、itch.io、GitHub 开源与 Steam + GitHub 双轨分发是重要参考；Desktop Mate 主体免费这一点需在后续 Radar 或 PM 引用时注意修正 | `04-research/steam-and-embedded-companion/TREND_RESEARCH_PART_free-desktop-pet-alternatives.md` |
| 2026-05-11 | Scope 决策：desktop-pet 主研究场景收紧为“现有游戏内嵌桌宠 / 伴侣 / mascot / SDK 能力”，独立桌面桌宠应用降级为次要参考 | `decisions/DECISION_LOG.md` + `04-research/steam-and-embedded-companion/TREND_RESEARCH_PART_in-game-embedded-companion-references.md` |
| 2026-05-11 | Steam 内嵌伴侣对标完成：成功案例显示伴侣可承担装饰 / 任务 / UI / 旁白 / 工具五种职责；AI 伴侣上限可参考 inZOI / PUBG Ally，非 AI 底线可参考 Cult of the Lamb / FF14 Minions / Stardew Pet | `04-research/steam-and-embedded-companion/TREND_RESEARCH_PART_steam-games-with-embedded-companion.md` + `04-research/steam-and-embedded-companion/TREND_RESEARCH_PART_steam-games-with-embedded-companion-2.md` |
| 2026-05-11 | 项目目录规则更新：`04-research/` 按研究主题归档；未来同一 project 的新问题支路统一使用各角色目录下的 `branches/<branch-slug>/`，同一支路跨 PM / Design / Engineering / Research 保持同名 | `PROJECT_RULES.md` + `04-research/README.md` |
| 2026-05-11 | PM 启动 memory-dataset 分支：从 chat / 行为 / MCP / 游戏 / VLM / current_context / Playwright / audio A0 / profile_meta 等 11 类数据收敛桌宠对记忆系统的需求 | `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v1 → v2.4 |
| 2026-05-12 | Radar 完成两批共 7 项调研（5/11 三项：行为信号库 / 中国 app MCP / 跨数据源 mock；5/12 四项：音频派生库 / OS Now Playing API / 本地 VLM / 浏览器 tab 检测） | `06-sync/group/2026-05-11T17-52-51_radar_*.md` + `06-sync/group/2026-05-12T09-43-10_radar_*.md` + `04-research/branches/memory-dataset/*.{md,json}` |
| 2026-05-12 | PM 答复两批 Radar 共 14 个问题；MCP 接入清单锁 MVP 首批 3 个（dida / feishu / steam）+ P1 后半段 2 个（office / dingtalk）；番茄类 / 腾讯视频 / QQ 音乐等列入"不接入清单" | `06-sync/group/2026-05-11T18-00-35_pm_*.md` + `06-sync/group/2026-05-12T09-52-06_pm_*.md` |
| 2026-05-12 | **VLM §3.6 重写为三档混合架构**（CNN 初筛 + 2-4B VLM 兜底 + 云端最终兜底）；本地推理可用率目标从 70% 升 85%；MVP 首选 MiniCPM-V 4.5 + 备选 Qwen2.5-VL-7B | `decisions/DECISION_LOG.md` + `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v3 §3.6 |
| 2026-05-12 | **双轨分发立场**：MAS 版砍 macOS A1 MediaRemote、仅保留 MCP；Developer ID 自分发版完整功能 | `decisions/DECISION_LOG.md` |
| 2026-05-12 | **MiniCPM-V 4.5 商用条款必须法务核验**（不过则 MVP 主线切 Qwen2.5-VL-7B Apache 2.0）；**aubio GPL-3.0 必须 IPC 子进程隔离**（避免传染整个二进制） | `decisions/DECISION_LOG.md` |
| 2026-05-12 | `.claude/settings.json` 联网放行 1 + 28 域名白名单补登（之前已落地于 ai-weekly-radar-2026，本项目 DECISION_LOG 现补记） | `.claude/settings.json` + `decisions/DECISION_LOG.md` |
| 2026-05-12 | PRIVACY_BOUNDARY 修订提案 **Deferred** — 等 voice-interaction 分支启动后合并审议（届时 STT / 麦克风边界变更将走同一份 amendment） | `01-pm/branches/memory-dataset/PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md`（Status: Deferred） |
| 2026-05-12 | PM 完成 memory-dataset **v2.5 全量修订**（6 通道并存 + 档 A 完整 A1+A2+A3 + §10 L1.5 + OS Scripting Bridge + §13 项目级决策候选 11→15 条；§4.7.4 VLM 视频类保留 v2.4 不动） | `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5 + `06-sync/group/2026-05-12T11-39-26_pm_memory-dataset-v2.5-and-v2.5.1-completed.md` |
| 2026-05-12 | PM 完成 **v2.5.1 mock §11 同步补丁**（schema_version 0.2.0 → 0.3.0；§11.0 / §11.3 / §11.4 / §11.4.1 / §11.12 / §11.13 / §11.14 全部到位；6 类新通道 mock 字段层 100% 到位） | `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5.1 §11 + `06-sync/group/2026-05-12T11-39-26_pm_memory-dataset-v2.5-and-v2.5.1-completed.md` §3 |
| 2026-05-12 | Main Thread 收口 v2.5 / v2.5.1：DECISION_LOG 新增 2 条 Accepted（#12 6 通道并存 / #14 OS Scripting Bridge）+ 1 条里程碑 Accepted（v2.5 + v2.5.1 完成）；候选 #13 / #15 未升项目级，保留分支级立场 | `decisions/DECISION_LOG.md`（2026-05-12 ×3 新行） |

## 3. Open Questions

| # | Question | Owner Thread | Status |
|---|---|---|---|
| 1 | 北极星指标应选择游戏内日活召唤次数、玩家留存提升、游戏开发者集成时间缩短，还是用户新提出指标？ | PM Strategy Thread + User | Open |
| 2 | 核心场景应优先聚焦游戏内伴侣、游戏外召唤、集成 SDK 流程，还是三者组合？ | PM Strategy Thread + User | Open |
| 3 | AI 方案应在 Rule-based、Search、RAG、LLM Prompt、Function Calling、Agent、Workflow、Fine-tuning、Recommendation System 中如何分层选择？ | PM Strategy Thread | Open |
| 4 | Distribution 模式应是直接发布桌面应用、SDK 嵌入游戏、内部分发验证，还是多模式并行？ | PM Strategy Thread + User | Open |
| 5 | 数据隐私边界应如何定义：完全不上传、脱敏后上传、仅本地推理、混合方案，分别覆盖哪些能力？ | PM Strategy Thread + Engineering Build Thread + User | Open |
| 6 | MVP 是否必须包含游戏事件上下文，还是先做通用桌面陪伴体验？ | PM Strategy Thread + User | Open |
| 7 | 记忆、语音、screen / audio / screenshot 上下文是否进入 MVP，以及各自隐私边界是什么？ | PM Strategy Thread + User | Open |
| 8 | 记忆系统 P0 是否只允许 first-party game events、用户主动对话和低敏 OS context 进入长期记忆？ | PM Strategy Thread + Engineering Build Thread + User | Open |
| 9 | 是否需要独立 Memory Center，让用户查看、删除、禁用、纠错记忆并理解上下文来源？ | Design Prototype Thread + Engineering Build Thread + User | Open |
| 10 | P0 低敏 OS context 是默认开启，还是默认关闭后由用户 opt-in？ | PM Strategy Thread + Design Prototype Thread + Engineering Build Thread + User | Open |
| 11 | 多游戏记忆默认隔离，还是允许用户开启跨游戏共享偏好？ | PM Strategy Thread + User | Open |
| 12 | MVP 路线应优先验证哪条：极轻反馈（Bongo Cat）/ 屏幕底栏 idle（Rusty）/ IP 联动（Desktop Mate）/ 多游戏 SDK 闭环？ | PM Strategy Thread + User | Open |
| 13 | 桌宠是否需要 AI 才有差异化，还是 AI 只是强化游戏陪伴反馈的放大器？ | PM Strategy Thread | Open |
| 14 | 桌宠类商业模式应如何对齐游戏本体：免费名片 demo、一次性买断、IP DLC、F2P 抽卡，还是内部 SDK 能力沉淀？ | PM Strategy Thread + User | Open |
| 15 | MVP 主路线是否以游戏内嵌伴侣为准，而不是独立桌面应用？如果是，首个接入游戏类型应如何选择？ | PM Strategy Thread + User | Open |
| 16 | 伴侣职责矩阵应如何分档：装饰 / 任务 / UI / 旁白 / 工具，哪些进入 MVP？ | PM Strategy Thread + Design Prototype Thread | Open |
| 17 | desktop-pet 与 Tencent 内部 GiiNex / TRTC / ADP / GMES / F.A.C.U.L. 的边界是什么：backend、宿主层还是配置层？ | PM Strategy Thread + Engineering Build Thread + User | Open |
| 18 | 是否采用 Live2D + VRM 双轨美术管线，相关商业 License 与 IP 授权风险如何处理？ | Design Prototype Thread + Engineering Build Thread + User | Open |
| 19 | NVIDIA ACE / Inworld / Convai 等 middleware 是 backend 候选、竞品、还是暂不接入的上限参考？ | Engineering Build Thread + PM Strategy Thread | Open |

## 4. Active Tasks

| Task ID | Owner | Task | Status |
|---|---|---|---|
| T-001 | PM Strategy Thread | 基于 PROJECT_CONTEXT 输出 desktop-pet MVP 的需求澄清 + AI 必要性评估 | **In Progress**（memory 分支已 v2.5.1，含档 A + 6 通道并存 + OS Scripting Bridge + L1.5；MVP 整体澄清待 PM 横向扩展） |
| T-011 | Engineering Build Thread | 设计跨平台 `Context Capture Adapter` 技术方案（v2 含 audio + 多 OS 路径 + VLM 三档混合 + Tab Detection Adapter + A1 白名单） | Backlog（解锁 — P0 决策已升级，可启动） |
| T-012 | Design Prototype Thread | 设计 Memory Center / 桌宠设置面板信息架构（含 VLM 状态指示 / MCP 启停面板 / 键盘 L1 / 音频 A0 开关 / Onboarding 三选一 / 浏览器扩展引导） | Backlog（解锁 — 需求已就位，可启动） |
| T-028 | PM Strategy Thread | PM memory-dataset 分支需求澄清 + AI 必要性评估 + PRIVACY_BOUNDARY 修订提案 | **In Progress**（v2.5.1 + v3 已落盘 + group 通告已发；PRIVACY_BOUNDARY 提案 Deferred 等 voice-interaction 合并审议；6 通道并存 / OS Scripting Bridge 已升项目级 DECISION_LOG #12 / #14） |

## 5. Blockers

- P0：无
- P1：无
- P2：无

## 6. Next Actions

| Next Action | Owner Thread | Input | Expected Output |
|---|---|---|---|
| **Engineering Build Thread 接续 T-011**：基于 memory-dataset 分支 v2.5.1 + AI Eval v3 + Radar 两批 7 项调研，设计 Context Capture Adapter v2（macOS 14.2+ Tap / < 14.2 BlackHole / Win WASAPI；aubio IPC 隔离）+ VLM 混合架构（CNN 初筛 + MiniCPM-V 4.5 兜底 + 云端可选）+ Tab Detection Adapter（扩展 + Native Messaging + AX/UIA 兜底）+ A1 SourceAppUserModelId 白名单（QQ 音乐 / 网易云 / Apple Music / Spotify / Bilibili / foobar2000）+ **v2.5 新增 §4.4.6 OS API 6 通道 + §4.4.7 浏览器扩展全方位 + §4.12 OS Scripting Bridge + §4.3 档 A 字段（A1/A2/A3 用户操作）+ §10 L1.5 实现** + 回写 OQ #8 SLA 起点（实时 P99 ≤200ms、批量 ≤2s） | Engineering Build Thread | `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5.1 + `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v3 + `04-research/branches/memory-dataset/*.{md,json}`（7 份 Radar 产物） | `03-engineering/branches/memory-dataset/TECHNICAL_DESIGN_*.md` |
| **Design Prototype Thread 接续 T-012**：基于 memory-dataset 分支 v2.5.1 §13.4，设计 Memory Center + 桌宠设置面板信息架构（含 VLM 状态指示 / VLM 单 app 实例开关 / MCP 自选启停面板 / 键盘 L1 快捷键查看与关闭 / 音频 A0 节拍监听开关 / Onboarding VLM 硬件检测三选一 "①仅文本对话 / ②本地轻量识别 / ③启用云端兜底" / 浏览器扩展安装引导 / **v2.5 新增**：OS API 6 通道独立开关 / 浏览器扩展按 6 类 tab category 双层开关 / OS Scripting Bridge 单 app 授权面板 + UI 状态指示 / 键盘 L1.5 编辑动作监听开关 / 一键全局暂停） | Design Prototype Thread | `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5.1 §13.4 + `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` | `02-design/branches/memory-dataset/DESIGN_BRIEF_memory-center.md` |
| **PM Strategy Thread 横向扩展 T-001**：从 memory 单分支扩展到 MVP 整体澄清；启动 voice-interaction 分支处理 TTS / STT / 麦克风 / 音色 / 双向对话；考虑 companion-behavior 分支处理桌宠如何把数据转成对话 / 动作 / 舞蹈编排；最终输出 desktop-pet MVP 整体需求澄清 + AI 必要性评估 | PM Strategy Thread | `00-context/PROJECT_CONTEXT.md` + memory-dataset 分支已有产物 + 用户产品愿景（陪看 / 舞动 + 后续语音功能） | `01-pm/REQUIREMENT_CLARIFICATION_desktop-pet-mvp.md` + `01-pm/AI_FEATURE_EVALUATION_desktop-pet-mvp.md` + `01-pm/branches/voice-interaction/` |

## 7. Links to Important Messages

| Topic | File | Date |
|---|---|---|
| Companion desktop pet research completed | `06-sync/group/2026-05-07T16-41-29_radar_companion-desktop-pet-research.md` | 2026-05-07 |
| Companion desktop pet research independently reviewed | `06-sync/group/2026-05-07T16-53-10_radar_companion-desktop-pet-research-review.md` | 2026-05-07 |
| Product evidence matrix expanded by multiple Radar agents | `04-research/companion-product-market/TREND_RESEARCH_companion-desktop-pet-products.md` | 2026-05-07 |
| Pending evidence items verified | `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Product evidence matrix localized to Chinese-first output rule | `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Product column cells merged in Excel evidence matrix | `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Product evidence matrix display columns simplified | `04-research/companion-product-market/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Final AI + non-AI feature summary created with priority table, URL appendix and Shared Pet Mode | `04-research/companion-product-market/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` | 2026-05-08 |
| Desktop context memory frameworks research completed | `06-sync/group/2026-05-08T18-53-39_radar_desktop-context-memory-frameworks.md` | 2026-05-08 |
| Memory system clarification completed by PM | `06-sync/group/2026-05-08T19-32-24_pm_completed-memory-system-clarification.md` | 2026-05-08 |
| Markdown table rendering fix completed | `06-sync/group/2026-05-08T23-36-31_radar_markdown-table-rendering-fix.md` | 2026-05-08 |
| Steam popular desktop pet games research completed | `06-sync/group/2026-05-09T_radar_steam-popular-desktop-pet-games.md` | 2026-05-09 |
| Main closeout for latest group scan | `06-sync/group/2026-05-09T10-22-35_main_closeout-group-scan.md` | 2026-05-09 |
| User-tested desktop pet supplement completed | `06-sync/group/2026-05-09T19-25-43_radar_user-tested-desktop-pet-supplement.md` | 2026-05-09 |
| Free and open-source desktop pet alternatives completed | `06-sync/group/2026-05-09T_radar_free-desktop-pet-alternatives.md` | 2026-05-09 |
| In-game embedded companion scope correction completed | `06-sync/group/2026-05-09T_radar_in-game-embedded-companion-references.md` | 2026-05-09 |
| Steam games with embedded companion research completed | `06-sync/group/2026-05-09T_radar_steam-games-with-embedded-companion.md` | 2026-05-09 |
| Steam embedded companion research PART 2 completed | `06-sync/group/2026-05-09T_radar_steam-games-with-embedded-companion-2.md` | 2026-05-09 |
| Main closeout for embedded companion research batch | `06-sync/group/2026-05-11T14-32-41_main_closeout-embedded-companion-research.md` | 2026-05-11 |
| Main research folder reorganization | `06-sync/group/2026-05-11T14-44-19_main_research-folder-reorganization.md` | 2026-05-11 |
| Radar 第一批三项调研完成（行为信号库 / 中国 app MCP / 跨数据源 mock） | `06-sync/group/2026-05-11T17-52-51_radar_memory-dataset-three-research-completed.md` | 2026-05-11 |
| PM 答复 Radar 第一批 4 个问题（MCP 锁 3+2 / 番茄移除 / mock 5 处扩展 / 命名 review 边界） | `06-sync/group/2026-05-11T18-00-35_pm_memory-dataset-radar-ack.md` | 2026-05-11 |
| Radar 第二批四项调研完成（音频派生库 / OS Now Playing API / 本地 VLM / 浏览器 tab 检测） | `06-sync/group/2026-05-12T09-43-10_radar_memory-dataset-four-research-completed.md` | 2026-05-12 |
| PM 答复 Radar 第二批 10 个问题（VLM 三档混合 / 双轨分发 / 模型选型法务核验 / Tab 扩展锁定等） | `06-sync/group/2026-05-12T09-52-06_pm_memory-dataset-radar-batch2-ack.md` | 2026-05-12 |
| PRIVACY_BOUNDARY 修订提案（Status: Deferred — 等 voice-interaction 分支启动后合并审议） | `01-pm/branches/memory-dataset/PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md` | 2026-05-11 / Deferred 2026-05-12 |
| PM 完成 memory-dataset v2.5 全量修订 + v2.5.1 mock §11 同步补丁 | `06-sync/group/2026-05-12T11-39-26_pm_memory-dataset-v2.5-and-v2.5.1-completed.md` | 2026-05-12 |
| Main 收口 memory-dataset 两批 Radar + PM ack 四条群消息 | `06-sync/group/2026-05-12T11-45-00_main_closeout-memory-dataset-cycle.md` | 2026-05-12 |

## 维护规则

- Main Thread 应在每次有新决策、任务状态变化或阻塞产生时更新本文件。
- 不要让 `SYNC_SUMMARY.md` 变成长文档；超过 3 屏时归档当前快照到 `06-sync/group/<date>_sync-summary-snapshot.md`，再精简正文。
- 不要存放凭据、真实玩家数据、公司机密、未脱敏日志、内部代号或合作方信息。
