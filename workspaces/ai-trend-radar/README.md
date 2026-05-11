# AI Trend Radar Workspace

## Workspace Overview

`ai-trend-radar` 是 AI Product Builder 的 AI 趋势雷达与信息差挖掘中心，负责追踪 AI 新闻、产品发布、开源项目、论文、技术博客、YouTube 和社区信号，并转化为产品机会、学习计划和可落地 Demo idea。

## Directory Structure

```text
workspaces/ai-trend-radar/
├── AGENTS.md
├── README.md
├── templates/
├── workflows/
└── prompts/
```

## When to Use This Workspace

- 需要生成 AI 日报、周报或专题趋势报告。
- 需要研究 AI Agent、RAG、AI Coding、AI Design、多模态、Voice、Video、Hardware 等方向。
- 需要分析 YouTube、GitHub Trending、论文、技术博客或产品发布。
- 需要从趋势中提炼产品机会、Demo idea 或学习计划。
- 需要把外部信号同步给 PM、设计或工程工作区。

## Templates

- `templates/AI_DAILY_REPORT_TEMPLATE.md`：AI 日报模板。
- `templates/AI_WEEKLY_REPORT_TEMPLATE.md`：AI 周报模板。
- `templates/TREND_RESEARCH_TEMPLATE.md`：专题趋势研究模板。
- `templates/YOUTUBE_RESEARCH_TEMPLATE.md`：YouTube 研究模板。
- `templates/GITHUB_TRENDING_RESEARCH_TEMPLATE.md`：GitHub Trending / 开源项目研究模板。
- `templates/PAPER_TO_PRODUCT_INSIGHT_TEMPLATE.md`：论文转产品洞察模板。
- `templates/AI_PRODUCT_OPPORTUNITY_TEMPLATE.md`：AI 产品机会模板。
- `templates/DEMO_IDEA_TEMPLATE.md`：Demo idea 模板。

## Workflows

- `workflows/ai-daily-radar.md`：AI 日报流程。
- `workflows/ai-weekly-radar.md`：AI 周报流程。
- `workflows/trend-research.md`：专题趋势研究流程。
- `workflows/youtube-ai-research.md`：YouTube AI 信息挖掘流程。
- `workflows/github-trending-research.md`：GitHub Trending 研究流程。
- `workflows/paper-to-product-insight.md`：论文 / 技术博客转产品洞察流程。
- `workflows/product-opportunity-extraction.md`：产品机会提炼流程。
- `workflows/demo-idea-generation.md`：Demo idea 生成流程。

## Prompts

- `prompts/ai-daily-radar.md`：AI 日报 Prompt。
- `prompts/ai-weekly-radar.md`：AI 周报 Prompt。
- `prompts/trend-research.md`：专题趋势研究 Prompt。
- `prompts/youtube-ai-research.md`：YouTube AI 信息挖掘 Prompt。
- `prompts/github-trending-research.md`：GitHub Trending 研究 Prompt。
- `prompts/paper-to-product-insight.md`：论文转产品洞察 Prompt。
- `prompts/product-opportunity-extraction.md`：产品机会提炼 Prompt。
- `prompts/demo-idea-generation.md`：Demo idea 生成 Prompt。

## Recommended Sources

- OpenAI
- Anthropic
- Google DeepMind
- Meta AI
- Microsoft
- NVIDIA
- Hugging Face
- GitHub Trending
- arXiv
- Papers with Code
- Product Hunt
- Hacker News
- YouTube
- X / Twitter
- The Decoder
- Latent Space
- Ben's Bites

## Source Credibility Rules

- 官方博客、官方文档、论文、GitHub 仓库和产品发布页优先级最高。
- 可信媒体可用于补充背景，但关键事实需要交叉验证。
- YouTube、X / Twitter、Reddit 和社区讨论适合发现信号，不应直接当作事实。
- 所有最新信息必须标注来源、发布时间和可信度。
- 投资、医疗、法律或政策相关内容只做信息整理和风险提示。

## Example Commands

所有示例都以 `APB 模式：...` 起手，无需再指定工作区——APB 会自动路由到本工作区。

- `APB 模式：生成今天的 AI 日报，按 AI_DAILY_REPORT_TEMPLATE 输出，并标注来源与可信度。`
- `APB 模式：搜索最近一周 AI Agent 趋势，并按 AI_WEEKLY_REPORT_TEMPLATE 输出。`
- `APB 模式：调研这个 GitHub 项目，提炼产品机会和 Demo idea，按 GITHUB_TRENDING_RESEARCH_TEMPLATE 输出。`
- `APB 模式：分析这个 YouTube 视频对 AI 产品经理的价值，按 YOUTUBE_RESEARCH_TEMPLATE 输出，并区分事实/观点/推测。`
- `APB 模式：把这篇论文转成产品洞察和可验证 Demo，按 PAPER_TO_PRODUCT_INSIGHT_TEMPLATE 输出。`
- `APB 模式：从这些趋势中提炼产品机会，按 AI_PRODUCT_OPPORTUNITY_TEMPLATE 输出。`
- `APB 模式：基于以上信号生成一个可落地 Demo idea，按 DEMO_IDEA_TEMPLATE 输出。`

## Maintenance Rules

- 本工作区不保存真实 token、API key 或付费平台凭证。
- 不把未经验证的“最新消息”写成事实。
- 模板保持稳定，具体研究结果放到项目或报告产物中。
- 涉及具体研究任务时必须联网验证并标注来源。
- 趋势转 PRD、原型或 MVP 时，同步到对应工作区继续推进。
