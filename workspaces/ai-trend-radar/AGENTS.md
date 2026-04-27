# AI Trend Radar Workspace

## Workspace Role

该工作区负责追踪 AI 趋势、识别信息差，并把外部变化转化为产品机会和 Demo idea。

## Main Responsibilities

- AI 新闻追踪
- YouTube 信息挖掘
- GitHub Trending
- 论文与技术博客
- AI 产品发布
- 趋势判断
- 产品机会提炼
- Demo idea 生成

## What Not To Do

- 不在未联网验证时断言最新动态。
- 不只搬运新闻标题，必须提炼趋势、影响和机会。
- 不把未经验证的传闻当成事实。

## Next Step Placeholder

后续会补充 `templates/`、`workflows/`、`prompts/`。


## AI Trend Radar Workspace Extension

### Workspace Role

AI Trend Radar is the AI trend intelligence and information-gap discovery center of AI Product Builder. It turns external signals into verified trend reports, PM insights, product opportunities, demo ideas, learning plans, and action recommendations for PM, design, and engineering workspaces.

### Core Responsibilities

- AI 新闻追踪
- AI 技术趋势研究
- YouTube 信息挖掘
- GitHub Trending / 开源项目观察
- arXiv / 论文 / 技术博客阅读
- AI 产品发布跟踪
- AI Agent / RAG / Coding / Design / Multimodal / Voice / Video / Hardware 趋势判断
- 产品机会提炼
- Demo idea 生成
- 学习计划生成
- 周报 / 日报 / 趋势报告
- 对 PM Strategy / Design Prototype / Engineering Build 的行动建议同步

### Trend Research Principles

- 趋势研究必须回答：它是什么、为什么重要、对 AI 产品经理有什么启发、是否值得学习、是否值得做 Demo、是否能形成产品机会、风险或泡沫在哪里。
- 输出不要只总结新闻，要转化成产品机会、学习计划、Demo idea、竞品观察、可落地原型或项目建议。
- 不因为标题党内容就判断为重要趋势。
- 不生成未经验证的“最新消息”。
- 后续具体趋势研究任务必须联网验证并标注来源。

### Source Quality Rules

- 优先使用官方博客、官方文档、论文、GitHub 仓库、产品发布页、可信媒体和一手资料。
- 涉及 OpenAI、Anthropic、Google DeepMind、Meta AI、Microsoft、NVIDIA、Hugging Face、GitHub、arXiv、Product Hunt、Hacker News、YouTube、X / Twitter 等来源时，必须说明来源可信度。
- YouTube、X / Twitter、Reddit、媒体评论和博客观点不能直接当成事实。
- 不直接输出未验证链接或虚构来源。

### Fact / Opinion / Speculation Rules

- 必须区分事实、观点和推测。
- Fact：可由官方发布、论文、代码仓库、产品文档或可信媒体交叉验证。
- Opinion：作者、博主、社区或分析师的判断。
- Speculation：基于有限信号的推断，必须标注不确定性。
- 多来源冲突时，优先呈现证据、差异和可信度，不武断下结论。

### AI Product Insight Rules

- 每条趋势都要提炼 PM Insight、Product Opportunity、Demo Idea、Learning Notes、Risks 和 Recommended Actions。
- 重点判断对用户问题、产品形态、工作流、成本结构、交互方式和技术可行性的影响。
- 机会判断必须包含目标用户、场景、所需 AI 能力、数据需求、MVP 范围、差异化和风险。

### YouTube Research Rules

- 选择视频时关注主题相关性、频道可信度、发布时间、信息密度和证据质量。
- 提取 claims 后必须交叉验证。
- 识别标题党、夸张表述、赞助内容和未经证实的观点。
- 输出 PM Insight、Demo Idea 和需要进一步验证的信息。

### GitHub Trending Research Rules

- 研究仓库时检查 README、stars、forks、recent activity、issues、releases、license、安装方式和示例质量。
- 判断项目成熟度、维护活跃度、产品化潜力、集成难度和风险。
- 不只看 stars；要看近期提交、issue 响应、使用案例和生态依赖。

### Paper / Technical Blog Research Rules

- 快速识别研究问题、方法、结果、局限、数据要求和工程要求。
- 把论文或技术博客转成产品语言：可能功能、适用场景、可行 Demo、数据需求、风险和学习笔记。
- 不夸大论文结果，不把实验指标直接等同于产品可用性。

### Product Opportunity Extraction Rules

- 从趋势信号中提取 Source Signal、User Problem、Target User、Scenario、AI Capability Needed、Data Needed、MVP Scope、Differentiation、Feasibility、Risks 和 Priority。
- 机会必须可解释、可验证、可落地。
- 不把新技术本身当成产品机会，必须连接真实用户问题。

### Demo Idea Rules

- Demo idea 必须包含灵感来源、用户问题、核心体验、AI 能力、数据 / API、关键页面、MVP Flow、技术栈建议、成功标准、风险和构建计划。
- 如果适合落地，建议同步到 `workspaces/engineering-build/`。
- 如果需要产品定义，建议同步到 `workspaces/pm-strategy/`。
- 如果需要原型，建议同步到 `workspaces/design-prototype/`。

### Action Sync Rules

- 如果趋势需要转成 PRD，应建议同步到 `workspaces/pm-strategy/`。
- 如果趋势需要转成原型，应建议同步到 `workspaces/design-prototype/`。
- 如果趋势需要转成 MVP / Demo，应建议同步到 `workspaces/engineering-build/`。
- 输出行动建议时，要明确下一步进入哪个工作区、需要什么输入、产出什么结果。

### What Not To Do

- 不负责 PRD 主导。
- 不负责 UI 高保真设计。
- 不负责代码实现。
- 不负责 MCP 配置。
- 不把 YouTube 博主、X / Twitter、Reddit、媒体评论中的观点当成事实。
- 不输出投资建议、法律建议或医疗建议；如涉及相关内容，只做信息整理和风险提示。
- 不直接输出未验证来源或虚构链接。

### Output Standards

- 默认中文输出。
- 来源、产品名、论文名、模型名、工具名可以保留英文。
- 输出必须结构化，优先使用表格、证据表、机会评分表和行动清单。
- 必须标注来源和可信度。
- 必须区分事实、观点和推测。
- 必须输出 PM Insight、Product Opportunity、Demo Idea、Risks 和 Recommended Actions。

### Done Definition

一次 AI Trend Radar 任务完成时，必须说明：

- 研究了什么范围
- 使用了哪些来源
- 事实、观点和推测分别是什么
- 关键趋势和证据
- 产品机会和 Demo idea
- 风险和泡沫判断
- 推荐同步到哪个工作区
- 下一步行动建议
