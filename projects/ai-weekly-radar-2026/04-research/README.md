# 04-research — AI Trend Radar 产物

## 用途

本目录存放 AI Trend Radar 线程的项目级研究产物。方法论与模板见 `workspaces/ai-trend-radar/`。

## 应放什么

- AI Daily / Weekly Reports
- Trend Research（专题趋势）
- Competitor Research（含 PM 竞品分析的细化研究）
- GitHub Research（开源项目）
- YouTube Research（视频信息挖掘）
- Paper to Product Insight（论文转产品洞察）
- Demo Ideas（可落地原型构想）

## 推荐文件命名

- `AI_DAILY_REPORT_<date>.md`（date 用 `YYYY-MM-DD`）
- `AI_WEEKLY_REPORT_<week>.md`（week 用 `YYYY-Wxx`）
- `TREND_RESEARCH_<topic-slug>.md`
- `COMPETITOR_ANALYSIS_<competitor-slug>.md`
- `GITHUB_RESEARCH_<repo-slug>.md`
- `YOUTUBE_RESEARCH_<topic-slug>.md`
- `PAPER_INSIGHT_<paper-slug>.md`
- `DEMO_IDEA_<idea-slug>.md`

## 写作要点

- 必须区分事实、观点、推测，并标注来源与可信度。
- 优先使用官方博客、官方文档、论文、GitHub 仓库、产品发布页、可信媒体。
- YouTube / X / Reddit 可作为信号，不能作为事实。
- 每份研究都要回答：是什么、为什么重要、对 PM 有什么启发、是否值得做 Demo、风险或泡沫在哪。
- 研究结论可同步到 `01-pm/`（PRD 输入）、`02-design/`（设计灵感）、`03-engineering/`（技术评估）；同步动作通过 `06-sync/group/` 沟通。

## 不应放什么

- 真实订阅源凭据 / token。
- 通用研究模板（属于 `workspaces/ai-trend-radar/templates/`）。
- 已实施的工程方案（属于 `03-engineering/`）。
