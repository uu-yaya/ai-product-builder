# Design Prototype Workspace

## Workspace Role

该工作区负责将产品意图转化为清晰、可评审、可落地的体验与视觉原型。

## Main Responsibilities

- 设计灵感研究
- UI/UX 评审
- Figma Prompt
- 高保真交互原型
- 设计系统建议
- 页面视觉优化
- 小程序 / Web / App 原型

## What Not To Do

- 不照抄参考设计。
- 不跳过信息架构、视觉层级和移动端适配。
- 不替代产品需求澄清或工程实现计划。

## Next Step Placeholder

后续会补充 `templates/`、`workflows/`、`prompts/`。


## Design Prototype Workspace Extension

### Workspace Role

Design Prototype is the design taste, UI/UX review, Figma Prompt, and high-fidelity prototype center of AI Product Builder. It translates clarified product intent into structured experience design, visual direction, prototype instructions, and engineering-ready handoff notes.

### Core Responsibilities

- 设计灵感研究
- UI/UX 评审
- Figma Prompt 生成
- 高保真交互原型设计
- 设计系统建议
- 页面视觉优化
- 移动端 / Web / 小程序原型设计
- 信息架构设计
- 交互状态设计
- 空状态 / 加载状态 / 错误状态设计
- 微文案优化
- 设计到工程的交接说明

### Design Thinking Principles

- 设计前必须先确认目标用户、使用场景、产品目标、平台、视觉定位、内容优先级和关键操作路径。
- 如果需求本身不清晰，应建议先回到 `workspaces/pm-strategy/` 做需求澄清。
- 设计方案必须服务用户任务和产品目标，而不是只追求视觉风格。
- 先确定信息架构和用户路径，再进入页面布局、组件和视觉细节。
- 输出应能指导原型工具和后续工程实现。

### Local Skill Reuse Rules

- Design Prototype 必须优先复用本地已安装的 design / product / prototype skills；Skills 是 capability providers，APB workspace rules、templates 和 workflows 是最终输出格式 authority。
- 按任务选择最小必要 skill 组合，使用后必须重格式化为 Design Prototype 的中文结构化输出。
- 默认 skill 选择顺序：
  - `behavioral-product-design`：需要分析用户动机、行为阻力、习惯形成、激活路径或体验摩擦时使用。
  - `running-design-reviews`：需要 UI/UX 评审、设计 critique、问题优先级和修复建议时使用。
  - `product-taste-intuition`：需要产品品味、体验质量、视觉取舍或定性判断时使用。
  - `design-systems`：需要设计 token、组件规范、状态规范、设计系统治理时使用。
  - `design-engineering`：需要设计到工程交付、组件边界、实现可行性和 handoff 时使用。
  - `user-onboarding`：需要首访体验、activation、aha moment、新手引导或空状态设计时使用。
  - `positioning-messaging`、`brand-storytelling`、`launch-marketing`：需要页面文案、价值表达、品牌叙事或发布页面信息层级时使用。
  - `figma`、`figma-generate-design`、`figma-implement-design`、`figma-create-design-system-rules`：仅在用户提供 Figma 上下文、明确要求 Figma 工作流或需要设计系统规则时使用。
  - `imagegen`：仅在需要生成视觉资产、概念图、产品图、插画或原型素材时使用。
- 设计灵感研究涉及最新设计趋势、竞品界面或外部设计平台时，必须联网验证并标注来源。

### UX Evaluation Principles

- 检查信息架构、任务路径、信息密度、认知负担和关键操作是否清晰。
- 关注用户在首屏、转化节点、表单、反馈、异常状态中的体验。
- 检查空状态、加载状态、错误状态、禁用状态、成功状态和边界状态。
- 检查移动端适配、可访问性、触控区域、阅读顺序和反馈及时性。
- 结论必须包含问题、证据、影响和修复建议。

### Visual Design Principles

- 不要只说“高级、简洁、现代”，必须具体说明颜色、排版、组件、圆角、阴影、间距、图标、按钮、卡片、状态和动效。
- 关注视觉层级、留白、对齐、字体层级、色彩系统、组件状态、交互反馈、动效节奏和可访问性。
- 视觉风格必须和产品定位、用户预期、内容密度和平台习惯匹配。
- 组件设计要覆盖默认、悬停、按下、聚焦、禁用、加载、错误、成功等状态。

### Design Inspiration Research Rules

- 设计灵感研究必须提炼模式和原则，不得照抄具体作品。
- 可参考 Figma Community、Dribbble、Mobbin、Awwwards、Behance、Pinterest、Apple Human Interface Guidelines、Material Design、Linear、Notion、Raycast、Arc、Perplexity、ChatGPT、Framer 等来源。
- 必须说明适合参考什么、不适合照抄什么。
- 输出应包含视觉模式、交互模式、信息架构模式、可学习点、不可复制点和适配方式。
- 涉及最新设计趋势、竞品界面、设计网站内容或具体工具能力时，必须联网验证并标注来源。

### Figma Prompt Rules

- Figma Prompt 必须包含页面目标、平台、用户场景、视觉风格、布局结构、组件要求、交互状态、响应式规则、微文案、约束和输出格式。
- Prompt 可以输出英文版本，方便用于 Figma Make、Figma AI、v0、Cursor 或其他设计 / 原型工具。
- Prompt 必须具体，不使用空泛词替代设计细节。
- Prompt 应包含可迭代指令，用于后续细化视觉、交互、响应式或组件状态。

### High-fidelity Prototype Rules

- 高保真原型必须包含页面清单、用户路径、信息架构、视觉系统、页面级布局、组件级说明、交互状态、动效说明、空状态 / 加载状态 / 错误状态、验收标准。
- 原型输出应明确页面之间的跳转关系和关键用户任务。
- 页面布局必须说明首屏重点、内容分组、CTA、反馈和边界状态。
- 动效说明要克制，强调任务反馈、层级转换和状态变化。

### Design System Rules

- 设计系统必须定义视觉原则、品牌关键词、色彩 token、字体 token、间距 token、圆角 token、阴影 token、图标风格、组件规范、状态规范、动效规范和可访问性规范。
- token 命名应稳定、英文、可交付工程。
- 组件规范要说明用途、结构、状态、变体和使用边界。
- 设计系统先满足当前 MVP，不追求一次性完整平台化。

### Design Handoff Rules

- 设计交付必须能被 `workspaces/engineering-build/` 使用。
- 输出应包含设计 token、组件说明、状态说明、尺寸 / 间距建议、页面结构、数据展示规则和前端实现注意事项。
- 交付说明必须覆盖边界情况、异常状态和验收标准。
- 不实际写代码，只提供可实现的设计说明和工程协作输入。

### What Not To Do

- 不负责 PRD 策略主导。
- 不负责代码实现。
- 不负责 MCP 配置。
- 不真实拉取 Figma 文件。
- 不照抄设计平台或竞品的具体作品。
- 不在需求不清晰时强行输出高保真方案。

### Output Standards

- 默认中文输出。
- 文件名、目录名、模板文件名使用英文。
- 设计 Prompt 可提供英文版本。
- 输出结构化、可复制、可执行。
- 优先使用表格、清单、页面清单、组件清单和状态表。
- 明确区分设计原则、参考模式、具体方案和待确认问题。

### Done Definition

一次 Design Prototype 任务完成时，必须说明：

- 做了什么
- 输出了哪些设计产物
- 关键设计假设和待确认问题
- 不负责或未覆盖的范围
- 风险和下一步建议
