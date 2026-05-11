# Design Prototype Workspace

## Workspace Overview

`design-prototype` 是 AI Product Builder 的设计审美与高保真原型中心，负责把已澄清的产品意图转化为视觉方向、UI/UX 评审、Figma Prompt、高保真原型方案、设计系统和工程交付说明。

## Directory Structure

```text
workspaces/design-prototype/
├── AGENTS.md
├── README.md
├── templates/
├── workflows/
└── prompts/
```

## When to Use This Workspace

- 需要从产品需求生成高保真原型方案。
- 需要 UI/UX 评审、页面视觉优化或移动端适配建议。
- 需要 Figma Make、Figma AI、v0、Cursor 可用的设计 Prompt。
- 需要设计灵感研究并提炼设计模式。
- 需要定义设计系统、组件状态或设计 token。
- 需要把设计方案整理成交付工程的说明。

## Templates

- `templates/DESIGN_BRIEF_TEMPLATE.md`：设计简报模板。
- `templates/UI_AUDIT_TEMPLATE.md`：UI/UX 评审模板。
- `templates/FIGMA_PROMPT_TEMPLATE.md`：Figma Prompt 模板。
- `templates/HIGH_FIDELITY_PROTOTYPE_TEMPLATE.md`：高保真原型模板。
- `templates/DESIGN_SYSTEM_TEMPLATE.md`：设计系统模板。
- `templates/DESIGN_INSPIRATION_RESEARCH_TEMPLATE.md`：设计灵感研究模板。
- `templates/DESIGN_HANDOFF_TEMPLATE.md`：设计交付工程模板。

## Workflows

- `workflows/design-inspiration-research.md`：设计灵感研究流程。
- `workflows/ui-ux-design-review.md`：UI/UX 设计评审流程。
- `workflows/figma-prompt-generation.md`：Figma Prompt 生成流程。
- `workflows/high-fidelity-prototype-generation.md`：高保真原型生成流程。
- `workflows/design-system-definition.md`：设计系统定义流程。
- `workflows/design-handoff-to-engineering.md`：设计交付工程流程。

## Prompts

- `prompts/design-inspiration-research.md`：设计灵感研究 Prompt。
- `prompts/ui-ux-design-review.md`：UI/UX 评审 Prompt。
- `prompts/figma-prompt-generation.md`：Figma Prompt 生成 Prompt。
- `prompts/high-fidelity-prototype-generation.md`：高保真原型生成 Prompt。
- `prompts/design-system-definition.md`：设计系统定义 Prompt。
- `prompts/design-handoff-to-engineering.md`：设计交付工程 Prompt。

## Design Inspiration Sources

- Figma Community：适合参考组件组织、页面结构和设计系统表达；不适合直接复制视觉稿。
- Dribbble：适合参考视觉风格、排版和情绪板；不适合直接作为可用产品体验。
- Mobbin：适合参考成熟 App 的用户路径、信息架构和组件模式；不适合照搬品牌表达。
- Awwwards / Behance / Pinterest：适合参考创意表现、视觉气质和动效方向；不适合忽略可用性直接套用。
- Apple Human Interface Guidelines / Material Design：适合参考平台规范、可访问性和组件行为；不适合机械套用导致品牌缺失。
- Linear、Notion、Raycast、Arc、Perplexity、ChatGPT、Framer：适合参考效率工具、AI 产品和现代 SaaS 的信息组织、交互反馈和视觉克制。

## Example Commands

所有示例都以 `APB 模式：...` 起手，无需再指定工作区——APB 会自动路由到本工作区。

- `APB 模式：基于这个 PRD 生成高保真原型方案和 Figma Prompt。`
- `APB 模式：把这个页面需求转成 Figma Make Prompt，按 FIGMA_PROMPT_TEMPLATE 输出。`
- `APB 模式：评审这张页面截图，按 UI_AUDIT_TEMPLATE 输出。`
- `APB 模式：为这个 AI 产品找设计灵感，按 DESIGN_INSPIRATION_RESEARCH_TEMPLATE 输出，并提炼可复用模式与不可照抄的点。`
- `APB 模式：为这个项目定义设计系统，按 DESIGN_SYSTEM_TEMPLATE 输出。`
- `APB 模式：把这个设计方向整理成 Design Handoff，按 DESIGN_HANDOFF_TEMPLATE 输出。`

## Maintenance Rules

- 需求不清晰时，先回到 `workspaces/pm-strategy/` 澄清。
- 本工作区不负责代码实现、MCP 配置或真实 Figma 文件拉取。
- 模板保持稳定，项目细节放到具体项目目录。
- 设计灵感只提炼模式和原则，不照抄具体作品。
- 涉及最新设计趋势、工具能力或竞品界面时，需要联网验证并标注来源。
