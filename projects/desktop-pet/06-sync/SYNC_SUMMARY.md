# Sync Summary

> Main Thread 维护。其他线程启动时优先读取本文件，而不是回看所有 `group/` 与 `dm/` 历史。

Last Updated: 2026-05-09

## 1. Current Project State

- 阶段：Discovery
- 主线程持有人：uu via Codex
- 当前焦点：收敛 desktop-pet MVP 路线、AI 必要性评估、记忆系统默认边界与低打扰机制
- 当前状态：项目已完成基础上下文初始化。陪伴类桌宠 / AI companion 市场功能调研、产品证据矩阵、最终功能点总结、运行性能调研、桌宠素材生成方案、PC 端上下文记忆框架调研、记忆系统 PM 需求澄清、Steam 桌宠类流行游戏调研均已有产物可供 T-001 使用。T-010 已完成并输出 `REQUIREMENT_CLARIFICATION_memory-system.md` 与 `PRIVACY_BOUNDARY_memory-system.md`；T-013 已修复性能研究 Markdown 表格渲染规则；T-014 已完成 Steam 桌宠流行游戏专题。北极星指标、MVP 路线、AI 是否必要、SDK vs 桌面应用边界、低打扰机制、商业模式、记忆系统默认开关与云端边界仍需 PM Strategy Thread + 用户澄清。

## 2. Latest Decisions

| Date | Decision | Source |
|---|---|---|
| 2026-04-28 | 项目从 `_PROJECT_TEMPLATE` 创建，定位为公司业务方向探索：游戏 AI 桌宠 SDK，并按 APB Safety Rules 脱敏处理 | `decisions/DECISION_LOG.md` |
| 2026-05-07 | 完成陪伴类桌宠 / AI companion 市场功能调研，作为 T-001 的输入 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` |
| 2026-05-07 | 独立 AI Trend Radar Thread session 已复核并改进市场调研文档，补充事实校正、来源核验和 PM Open Questions | `06-sync/group/2026-05-07T16-53-10_radar_companion-desktop-pet-research-review.md` |
| 2026-05-07 | 多 Radar agent 已完成产品证据矩阵补全：按“产品 + 单个 AI 功能点 / 体验参考点”拆行，并生成 xlsx 表格 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 完成待核验清单二次核实：新增 `核验结果` 与 `仍需跟进` sheet，并把核验状态写回主矩阵 | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 按用户长期输出规则完成产品证据矩阵中文化，功能点与功能解释优先使用中文，英文仅保留产品名与必要专业术语 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 优化产品证据矩阵 Excel 展示：连续相同 Product 纵向合并并居中显示 | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 精简产品证据矩阵展示列：删除平台、核验状态、核验后处理、功能归类、证据类型 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` |
| 2026-05-07 | 综合用户观点、AI 能力与非 AI 支撑，输出最终功能点总结表，补充体验好的非 AI 功能，并在文末附调研产品 URL 表 | `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` |
| 2026-05-08 | 将共同抚养 / Shared Pet Mode 补充为独立功能假设：桌宠可从个人陪伴对象扩展为双人或小队的共同记忆与关系资产 | `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` |
| 2026-05-08 | 为最终功能点总结补充 P0 / P1 / P2 优先级表，按 MVP 验证目标排序 | `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` |
| 2026-05-08 | 完成 PC 端上下文记忆框架调研：OpenChronicle 是 macOS 开源本地记忆层参考，Windows 需用 UI Automation / WinEvent / Graphics Capture / UserActivity 等组合；desktop-pet P0 建议采用 `Context Lite Memory`，不默认采用全量截图或 Recall 式记录 | `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` |
| 2026-05-08 | PM 完成记忆系统需求澄清与隐私边界：P0 采用白名单式采集，Memory Center 作为信任基础，但默认开关、保留期、云端 LLM 与跨游戏记忆仍待用户确认 | `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` |
| 2026-05-08 | 项目研究文档表格规则更新：`.md` 表格统一使用 GFM pipe table，不再写 HTML table；性能研究表格已验证可渲染 | `PROJECT_RULES.md` + `06-sync/group/2026-05-08T23-36-31_radar_markdown-table-rendering-fix.md` |
| 2026-05-09 | Steam 桌宠类流行游戏调研完成：Bongo Cat / Rusty / Desktop Mate 等证明流行桌宠多靠低打扰存在和清晰反馈闭环，AI 更像放大器而非入口；T-001 需要在 Bongo Cat / Rusty / Desktop Mate / SDK 四条 MVP 路线中收敛 | `04-research/TREND_RESEARCH_steam-popular-desktop-pet-games.md` |

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

## 4. Active Tasks

| Task ID | Owner | Task | Status |
|---|---|---|---|
| T-001 | PM Strategy Thread | 基于 PROJECT_CONTEXT 输出 desktop-pet MVP 的需求澄清 + AI 必要性评估 | Backlog |
| T-011 | Engineering Build Thread | 设计跨平台 `Context Capture Adapter` 技术方案 | Backlog |
| T-012 | Design Prototype Thread | 设计 Memory Center 信息架构 | Backlog |

## 5. Blockers

- P0：无
- P1：无
- P2：无

## 6. Next Actions

| Next Action | Owner Thread | Input | Expected Output |
|---|---|---|---|
| 接手 T-001，结合项目上下文、功能总结、Steam 桌宠调研与记忆系统 PM 文档，收敛 MVP 路线、AI 必要性、低打扰机制、SDK vs 桌面应用边界 | PM Strategy Thread | `00-context/PROJECT_CONTEXT.md` + `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` + `04-research/TREND_RESEARCH_steam-popular-desktop-pet-games.md` + `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` | `01-pm/REQUIREMENT_CLARIFICATION_desktop-pet-mvp.md` + `01-pm/AI_FEATURE_EVALUATION_desktop-pet-mvp.md` |
| 接手 T-012，设计 Memory Center 的信息架构和用户控制路径 | Design Prototype Thread | `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` | `02-design/DESIGN_BRIEF_memory-center.md` |
| 接手 T-011，设计 `Context Capture Adapter`，避免业务直接绑定 AX / UIA / Recall | Engineering Build Thread | `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` 第 8-10 节 + PM 记忆系统文档 | `03-engineering/TECHNICAL_DESIGN_context-capture-adapter.md` |

## 7. Links to Important Messages

| Topic | File | Date |
|---|---|---|
| Companion desktop pet research completed | `06-sync/group/2026-05-07T16-41-29_radar_companion-desktop-pet-research.md` | 2026-05-07 |
| Companion desktop pet research independently reviewed | `06-sync/group/2026-05-07T16-53-10_radar_companion-desktop-pet-research-review.md` | 2026-05-07 |
| Product evidence matrix expanded by multiple Radar agents | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` | 2026-05-07 |
| Pending evidence items verified | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Product evidence matrix localized to Chinese-first output rule | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Product column cells merged in Excel evidence matrix | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Product evidence matrix display columns simplified | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | 2026-05-07 |
| Final AI + non-AI feature summary created with priority table, URL appendix and Shared Pet Mode | `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` | 2026-05-08 |
| Desktop context memory frameworks research completed | `06-sync/group/2026-05-08T18-53-39_radar_desktop-context-memory-frameworks.md` | 2026-05-08 |
| Memory system clarification completed by PM | `06-sync/group/2026-05-08T19-32-24_pm_completed-memory-system-clarification.md` | 2026-05-08 |
| Markdown table rendering fix completed | `06-sync/group/2026-05-08T23-36-31_radar_markdown-table-rendering-fix.md` | 2026-05-08 |
| Steam popular desktop pet games research completed | `06-sync/group/2026-05-09T_radar_steam-popular-desktop-pet-games.md` | 2026-05-09 |
| Main closeout for latest group scan | `06-sync/group/2026-05-09T10-22-35_main_closeout-group-scan.md` | 2026-05-09 |

## 维护规则

- Main Thread 应在每次有新决策、任务状态变化或阻塞产生时更新本文件。
- 不要让 `SYNC_SUMMARY.md` 变成长文档；超过 3 屏时归档当前快照到 `06-sync/group/<date>_sync-summary-snapshot.md`，再精简正文。
- 不要存放凭据、真实玩家数据、公司机密、未脱敏日志、内部代号或合作方信息。
