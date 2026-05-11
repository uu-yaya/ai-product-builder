# Project Context

> 所有线程都会优先读本文件。仅完成项目初始化阶段的最小填写，后续随研究节奏增量更新。

## Quick Reference

| Item | Content | Notes |
|---|---|---|
| Project Name | AI Weekly Radar 2026 | 中文：2026 AI 趋势周报 |
| Project Slug | `ai-weekly-radar-2026` | 与目录同名 |
| Project Stage | Discovery | 仅完成项目骨架初始化，尚未启动首期研究 |
| Owner | Main Thread（待用户指定具体负责人） | |
| Start Date | 2026-04-28 | |
| Last Updated | 2026-04-28（当日三次更新：关闭剩余 OQ #5/#6/#7、落地节奏与中文源策略、确认基线合并方案） | |

## 1. Project Name

- 中文：2026 AI 趋势周报（AI Agent / AI Coding / 游戏 AI）
- 英文：AI Weekly Radar 2026
- 当前为正式名，非代号阶段。

## 2. Project Slug

`ai-weekly-radar-2026`，必须与 `projects/ai-weekly-radar-2026/` 目录名一致。

## 3. Project Stage

Discovery。

阶段判断依据：
- 仅完成 `_PROJECT_TEMPLATE` 复制与上下文初始化。
- 未产出任何周报、未确定信源池、未确定分发渠道。
- 用户明确指示"只初始化项目，不执行研究"。

## 4. Background

- 项目起源：用户希望以稳定节奏跟踪 2026 年 AI 领域三个重点方向的进展，沉淀可复用的趋势研究产物。
- 业务背景：2026 年 AI Agent 进入产品化期，AI Coding 工具进入主流研发流程，游戏 AI（NPC、玩法、生成式内容）开始进入商业化验证；信息密度高、噪声大，需要结构化筛选。
- 与其他 APB 工作流的关系：本项目是 `workspaces/ai-trend-radar/` 方法论的具体业务实例，所有真实周报产出落在本项目 `04-research/`，不写入 `workspaces/`。

## 5. Product Goal

- 北极星：每周稳定产出一份高质量、可复用、可检索的 AI 趋势周报。
- 业务目标（待首期数据后量化）：
  - 周报覆盖三大方向：AI Agent / AI Coding / 游戏 AI。
  - 单期周报阅读耗时控制在 10 分钟以内。
  - 至少 50% 条目附可执行下一步（试用、跟踪、引入项目）。
- 非目标：
  - 不做泛 AI 新闻搬运。
  - 不做学术综述。
  - 不做实时推送、不做日报。
  - 不构建产品形态（订阅站点、Newsletter 系统、APP）— 这是研究项目，不是产品项目。

## 6. Target Users

- 主要用户：项目负责人本人（产品 + 工程 + 研究复合视角）。
- 次要用户：APB 工作区其他线程（PM Strategy / Engineering Build），以周报作为决策与立项的输入。
- 反向用户：泛 AI 爱好者、媒体读者、求职者；本周报不做大众化科普。

## 7. Core Scenarios

- 每周一上午收口当周周报，覆盖窗口为执行当天向前回溯 7 天（含执行日）；节假日 / 工作冲突可顺延。
- 立项或方案评审前，回查周报历史，找最近 4–8 周相关条目作为决策证据。
- 看到一条单点信息时，可在周报检索系统里定位它属于哪个主题、是否已被收录。

### 首期特殊安排

- 首期文件：`AI_WEEKLY_REPORT_2026-W18.md`，Issue 字段标 `Baseline`。
- 首期 = 基线 + 7 天窗口，合并为同一份文档。
- Baseline 段：简要覆盖最近 30 天三大方向重要背景。
- Weekly 段：覆盖 2026-04-22 → 2026-04-28 的新增动态。
- 第 2 期起恢复"仅最近 7 天"默认范围，无 Baseline 段。

## 8. Key Features

- P0：周报模板与命名规范（`AI_WEEKLY_REPORT_<week>.md`）。
- P0：三大方向的信源池与去重策略。
- P0：每条信息的结构化字段（来源、日期、类型、影响、下一步）。
- P1：跨周主题串联（同一主题在多期周报中的演进线）。
- P1：季度回顾（每 12 周一次）。
- P2：检索索引（按主题 / 公司 / 模型 / 工具聚合）。

## 9. AI Capabilities

- 是否真的需要 AI：周报本身是研究产物，AI 仅作为研究辅助工具。
- 选择的方案（仅辅助层面）：
  - Search / Browse：抓取 GitHub Trending、产品发布、论文、YouTube。
  - LLM Prompt：摘要、去重、影响判断的草稿生成；最终判断必须由人完成。
  - 不引入 RAG / Fine-tuning / Agent 框架。
- 数据来源：公开来源（产品页、论文、博客、GitHub、YouTube），不抓取付费墙、不爬取需要鉴权的内容。
- 失败处理：当某周三大方向的某一项无显著进展时，明确写"本周无重要更新"，不凑数。

## 10. Design Direction

- 周报为纯文本 Markdown，不做视觉设计。
- 信息架构：固定三段式（AI Agent / AI Coding / 游戏 AI），每段内固定字段。
- 平台 / 设备：本仓库内浏览，文件名稳定可被外部工具索引。
- 参考产品（仅提炼模式）：The Batch、Import AI、TLDR AI、Stratechery、Ben's Bites。

## 11. Tech Stack

- 内容：Markdown，存于 `04-research/`。
- 工具：浏览器 / 检索工具 / 本仓库 grep。
- 不引入数据库、网站、订阅系统、CI 自动化。
- 已有可复用模块：`workspaces/ai-trend-radar/` 方法论与模板。

## 12. Current Status

- 已完成（2026-04-28）：
  - 项目骨架初始化（复制模板、首批决策）。
  - 4 条 Open Questions 全部关闭。
  - 信源池清单写入 [00-context/LINKS.md](LINKS.md)（19 个信源 + 三级可信度分层）。
  - 周报模板写入 [04-research/AI_WEEKLY_REPORT_TEMPLATE.md](../04-research/AI_WEEKLY_REPORT_TEMPLATE.md)（10 字段：Title / Summary / Source / Category / Why it matters / Product opportunity / Technique / Confidence / Impact / Suggested action）。
- 进行中：无。
- 阻塞项：
  - 首期周报（基线 + 7 天窗口 2026-04-22 → 2026-04-28）尚未启动；执行时点由用户决定。
  - 三级信源不再视作阻塞 — 改为按主题临时检索（OQ #5 已 Resolved）。

## 13. Constraints

- 时间：每周可投入研究时长有限，周报必须可在 ≤2 小时内完成。
- 资源：单人项目，无外部协作。
- 数据可得性：仅使用公开来源；不依赖任何需要付费订阅或受限访问的数据。
- 合规 / 隐私：不收录涉密、未公开、内部传闻、未脱敏数据。
- 内容安全：不评价个体（个人攻击、未经证实的指控），仅评价产品 / 模型 / 项目本身。

## 14. Open Questions

| # | Question | Owner | Status | Resolution |
|---|---|---|---|---|
| 1 | 首期周报覆盖周次？ | Main Thread | Resolved 2026-04-28 | 7 天滚动窗口，结束日为执行当天（首期：2026-04-22 → 2026-04-28）|
| 2 | 三大方向各自的核心信源池清单？ | AI Trend Radar Thread | Resolved 2026-04-28 | 19 个信源 + 三级可信度分层，详见 [LINKS.md](LINKS.md) |
| 3 | 周报字段是否需要"信心度 / 影响等级"两列？ | AI Trend Radar Thread | Resolved 2026-04-28 | 是；最终字段 10 列，详见 [AI_WEEKLY_REPORT_TEMPLATE.md](../04-research/AI_WEEKLY_REPORT_TEMPLATE.md) |
| 4 | 是否需要做 1 期"基线周报"先锚定三大方向当前格局？ | Main Thread | Resolved 2026-04-28 | 是；基线 + 首期 7 天窗口合并为同一份首期文档（非两份） |
| 5 | 三级信源（YouTube / Reddit / X）的具体频道 / subreddit / List？ | AI Trend Radar Thread | Resolved 2026-04-28 | 不预设固定清单；按主题临时检索；连续 2–3 期持续有价值的源由 Radar Thread 提议升级写入 [LINKS.md §2.4](LINKS.md) 并在 `decisions/DECISION_LOG.md` 留痕 |
| 6 | 是否引入中文一级信源（机器之心、量子位、PaperWeekly）？ | Main Thread | Resolved 2026-04-28 | 不设为一级；机器之心 / 量子位 / PaperWeekly 加入二级 / 三级辅助源（[LINKS.md §2.7](LINKS.md)）；中文独家报道 Confidence 默认 中 / 低，需英文一手 / 多源验证才可上调 |
| 7 | 周报固定发布周几？ | Main Thread | Resolved 2026-04-28 | 每周一上午收口；窗口为执行当天向前回溯 7 天；节假日 / 冲突可顺延；命名仍按结束日所在 ISO 周（`AI_WEEKLY_REPORT_2026-Wxx.md`） |

## 15. Related Links

详见 `00-context/LINKS.md`（首期初始化阶段暂为空）。
