# 04-research — AI Trend Radar 产物

## 用途

本目录存放 AI Trend Radar 线程的项目级研究产物。方法论与模板见 `workspaces/ai-trend-radar/`。

## 当前目录结构

本项目的研究文档按“同一研究任务 / 同一问题域放在同一文件夹”管理。顶层只保留索引和分支入口，不再平铺研究正文。

| Folder | Scope | Main Inputs / Outputs |
|---|---|---|
| `companion-product-market/` | 陪伴类桌宠 / AI companion 市场、功能矩阵、最终功能点总结 | T-002 至 T-008、T-015 |
| `steam-and-embedded-companion/` | Steam 桌宠、免费 / 开源替代、游戏内嵌伴侣、Steam 已发行游戏对标 | T-014、T-016 至 T-019 |
| `performance-benchmark/` | 桌宠性能占用、性能指标学习、Steam 桌宠测试方法论和 CSV 模板 | T-013 |
| `context-memory-frameworks/` | PC 端上下文采集、记忆系统框架、OpenChronicle / Windows 对标 | T-009 |
| `asset-generation/` | 自定义桌宠素材生成、Codex / Skill 实现参考 | asset generation research |
| `branches/` | 未来新支路研究入口，按 `<branch-slug>/` 新建 | 见 `branches/README.md` |

## 新支路规则

当同一个 project 内出现新的产品问题、能力方向或验证支路时，不要继续把文件散放到 `04-research/` 根目录。请使用：

```text
04-research/branches/<branch-slug>/
```

同一个 `<branch-slug>` 应在 `01-pm/branches/`、`02-design/branches/`、`03-engineering/branches/`、`04-research/branches/` 中保持一致，方便跨角色查找。

## 应放什么

- AI Daily / Weekly Reports
- Trend Research（专题趋势）
- Competitor Research（含 PM 竞品分析的细化研究）
- GitHub Research（开源项目）
- YouTube Research（视频信息挖掘）
- Paper to Product Insight（论文转产品洞察）
- Demo Ideas（可落地原型构想）

## 推荐文件命名

在主题文件夹或 `branches/<branch-slug>/` 内继续使用以下文件名规则：

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
- 每个主题文件夹建议保留 `README.md`，说明该文件夹对应的任务、输入、输出和下游使用方式。

## 不应放什么

- 真实订阅源凭据 / token。
- 通用研究模板（属于 `workspaces/ai-trend-radar/templates/`）。
- 已实施的工程方案（属于 `03-engineering/`）。
