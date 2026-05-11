# PM Strategy Workspace

## Workspace Overview

`pm-strategy` 是 AI Product Builder 的产品策略与需求分析中心，负责把模糊想法转化为清晰、可评审、可拆解、可交付的产品输入。

## Directory Structure

```text
workspaces/pm-strategy/
├── AGENTS.md
├── README.md
├── templates/
├── workflows/
└── prompts/
```

## When to Use This Workspace

- 需求不清晰，需要澄清用户、场景、痛点和目标。
- 需要撰写 PRD、SRS、MRD 或用户故事。
- 需要判断某个 AI 功能是否真的需要 AI。
- 需要做竞品分析、用户旅程、MVP 范围或需求优先级。
- 需要把 PRD 拆成研发任务。
- 需要做产品评审和风险检查。

## Templates

- `templates/PRD_TEMPLATE.md`：产品需求文档模板。
- `templates/SRS_TEMPLATE.md`：软件需求规格说明模板。
- `templates/MRD_TEMPLATE.md`：市场需求文档模板。
- `templates/USER_STORY_TEMPLATE.md`：用户故事模板。
- `templates/COMPETITOR_ANALYSIS_TEMPLATE.md`：竞品分析模板。
- `templates/AI_FEATURE_EVALUATION_TEMPLATE.md`：AI 功能评估模板。
- `templates/DEVELOPMENT_TASK_BREAKDOWN_TEMPLATE.md`：研发任务拆解模板。

## Workflows

- `workflows/requirement-clarification.md`：模糊需求澄清流程。
- `workflows/prd-generation.md`：PRD 生成流程。
- `workflows/ai-feature-evaluation.md`：AI 功能方案判断流程。
- `workflows/competitor-analysis.md`：竞品分析流程。
- `workflows/user-journey-mapping.md`：用户旅程地图流程。
- `workflows/development-task-breakdown.md`：研发任务拆解流程。

## Prompts

- `prompts/requirement-clarification.md`：需求澄清 Prompt。
- `prompts/prd-generation.md`：PRD 写作 Prompt。
- `prompts/ai-feature-evaluation.md`：AI 功能评估 Prompt。
- `prompts/competitor-analysis.md`：竞品分析 Prompt。
- `prompts/user-journey-mapping.md`：用户旅程地图 Prompt。
- `prompts/development-task-breakdown.md`：研发任务拆解 Prompt。

## Example Commands

所有示例都以 `APB 模式：...` 起手，无需再指定工作区——APB 会自动路由到本工作区。

- `APB 模式：帮我澄清这个产品想法，并按 pm-strategy 的需求澄清流程输出。`
- `APB 模式：帮我写这个功能的 PRD，输出必须符合 PRD_TEMPLATE。`
- `APB 模式：评估这个 AI 功能是否真的需要 Agent，按 AI_FEATURE_EVALUATION_TEMPLATE 输出。`
- `APB 模式：帮我做竞品分析，并输出差异化机会和下一步行动。`
- `APB 模式：把这些需求按 RICE 和 P0/P1/P2 排优先级。`
- `APB 模式：把这份 PRD 按 DEVELOPMENT_TASK_BREAKDOWN_TEMPLATE 拆成研发任务。`

## Maintenance Rules

- 根规则放在仓库根 `AGENTS.md`，领域规则放在本工作区 `AGENTS.md`。
- 模板只放稳定结构，不塞具体项目内容。
- workflows 描述流程，prompts 提供可复制指令。
- 涉及最新外部信息时必须联网验证并标注来源。
- 不在本工作区处理高保真 UI、代码实现或 MCP 配置。
