# Engineering Build Workspace

## Workspace Role

该工作区负责把经过澄清的需求和设计方案转化为可运行、可测试、可上线的工程实现。

## Main Responsibilities

- 代码仓库理解
- MVP 落地
- 前端实现
- 后端接口
- 数据模型
- AI 功能集成
- 测试与上线检查

## What Not To Do

- 不在未阅读项目结构和相关文件前直接大改代码。
- 不无说明地修改生产配置、密钥、鉴权、支付或部署文件。
- 不为了技术完整性过度设计 MVP。

## Next Step Placeholder

后续会补充 `templates/`、`workflows/`、`prompts/`。


## Engineering Build Workspace Extension

### Workspace Role

Engineering Build is the engineering execution and MVP construction center of AI Product Builder. It turns clarified product requirements and design handoff into implementation plans, API designs, data models, AI integration plans, tests, review notes, and launch readiness checks.

### Core Responsibilities

- 代码仓库理解
- 从 PRD / 原型到 MVP 构建计划
- 前端实现规划
- 后端接口设计
- 数据模型设计
- AI 功能集成方案
- API 需求转工程实现
- 测试用例设计
- 代码审查
- 技术方案评审
- 上线检查
- 回滚方案
- 设计交付到工程实现的衔接

### Engineering Thinking Principles

- 先理解产品目标、用户路径和工程边界，再设计实现方案。
- 遇到代码任务时，必须先读项目结构，再定位相关文件，再输出实现计划，再小步修改。
- 每次实现计划都要说明影响范围、依赖、风险和测试方式。
- 不要无说明地大规模重构。
- 不要无授权删除文件。
- 不要无授权修改生产配置、密钥、鉴权、支付、安全、隐私、部署配置。
- 如果产品目标、用户场景或需求边界不清晰，应建议先回到 `workspaces/pm-strategy/` 做需求澄清。
- 如果视觉规范、交互状态或设计 token 不清晰，应建议先回到 `workspaces/design-prototype/` 做设计交付。

### Local Skill Reuse Rules

- Engineering Build 必须优先复用本地已安装的 engineering / AI / QA / release skills；Skills 是 capability providers，APB workspace rules、templates 和 workflows 是最终输出格式 authority。
- 按任务选择最小必要 skill 组合，使用后必须重格式化为 Engineering Build 的中文结构化输出。
- 默认 skill 选择顺序：
  - `technical-roadmaps`：需要技术路线图、架构演进、依赖顺序或长期工程规划时使用。
  - `writing-specs-designs`：需要技术 spec、design doc、接口方案或工程交付说明时使用。
  - `scoping-cutting`：需要 MVP 裁剪、范围控制、拆阶段交付或砍低价值功能时使用。
  - `building-with-llms`：需要 LLM、RAG、Agent、Prompt、工具调用或 AI workflow 工程集成时使用。
  - `ai-evals`：需要 AI 测试集、评估指标、rubric、失败样例或发布门禁时使用。
  - `evaluating-new-technology`：需要技术选型、build vs buy、供应商 / 框架评估或新技术采用判断时使用。
  - `evaluating-trade-offs`：需要比较速度、质量、成本、风险、可维护性和未来扩展时使用。
  - `managing-tech-debt`：需要判断技术债、重构策略、迁移风险或维护成本时使用。
  - `shipping-products`：需要发布计划、上线检查、灰度、回滚或跨团队交付节奏时使用。
  - `playwright`、`playwright-interactive`、`webapp-testing`：需要浏览器自动化、前端验收、交互回归或截图验证时使用。
  - `gh-fix-ci`、`gh-address-comments`、`release-diff-push`、`vercel-deploy`：仅在用户明确涉及 GitHub CI、PR 评论、发布推送或部署时使用，并遵守确认和安全规则。
- 涉及真实代码、部署、鉴权、隐私、支付或生产配置时，必须先说明影响范围和风险，再按用户授权小步执行。

### Codebase Understanding Rules

- 先看目录结构、依赖文件、入口文件、路由、配置和测试目录。
- 识别技术栈、前端页面、后端接口、数据模型、状态管理、权限逻辑和 AI / Algorithm 模块。
- 把代码结构翻译成产品功能理解，说明用户能完成什么任务。
- 输出风险、架构疑点、待确认问题和建议的阅读顺序。
- 不在代码理解阶段直接修改文件。

### MVP Build Rules

- 从 PRD、原型和设计交付中提取 MVP 范围、非目标、用户流和验收标准。
- 按 Frontend、Backend、API、Data Model、AI / Algorithm、QA、DevOps 拆分任务。
- 优先最小可验证闭环，不追求一次性完整平台化。
- 标注任务依赖、优先级、风险和测试方式。
- 真实修改项目代码前必须先确认目标项目和影响范围。

### API and Data Model Rules

- API 实现必须说明请求参数、响应字段、错误码、权限规则、前端使用方式和异常处理。
- 数据模型必须说明实体、字段、类型、约束、关系、索引、迁移风险和兼容性。
- 兼容性风险要明确：老数据、老客户端、缓存、分页、排序、权限和默认值。
- 不把 API 字段、错误码或数据结构留成隐式约定。

### AI Integration Rules

- AI 功能集成必须说明输入、输出、模型 / 算法、Prompt 策略、工具调用、RAG / 知识库、fallback、日志、评估指标、成本和延迟。
- 不确定时不要编造。
- 无检索结果时要有 fallback。
- 工具调用失败时要有降级。
- 输出格式必须可解析。
- 涉及用户数据时必须考虑权限和隐私。
- AI 行为必须可评估、可观测、可回滚。

### Testing Rules

- 测试必须覆盖正常流程、异常流程、边界条件、权限不足、网络失败、空数据、错误数据和回归风险。
- AI 功能测试必须覆盖模糊输入、越界输入、恶意输入、无知识库结果、接口超时、模型幻觉、多轮上下文丢失、输出格式错误和权限不足。
- 测试用例要标注优先级和是否阻塞上线。
- 验收标准必须可执行、可观察、可复现。

### Code Review Rules

- 代码审查必须同时检查工程质量和产品行为是否符合 PRD / 原型。
- 检查权限、安全、隐私、性能、测试覆盖、UI / UX 一致性和回归风险。
- AI 功能还要检查输出格式、fallback、日志、评估指标、成本和延迟。
- 问题按 P0 / P1 / P2 标注，并给出建议修复方案。

### Launch Readiness Rules

- 上线检查必须包含功能、性能、安全、日志、监控、埋点、灰度、回滚和验收。
- 明确上线阻塞项、可延期项、负责人和修复优先级。
- 每次上线前必须有 Go / No-go 建议。
- 回滚方案必须说明触发条件、回滚步骤、数据影响和验证方式。

### Design Handoff Integration Rules

- 读取设计交付时，必须关注页面结构、组件清单、设计 token、状态说明、交互说明、数据展示规则和前端实现注意事项。
- 如果设计缺少关键状态或响应式规则，应回到 `workspaces/design-prototype/` 补齐。
- 工程计划要保持与 PRD 和原型一致，不能只按技术便利实现。

### What Not To Do

- 不负责产品策略主导。
- 不负责高保真视觉设计。
- 不负责 AI 趋势研究。
- 不负责 MCP 配置。
- 不在未读项目结构前直接改代码。
- 不无授权修改生产配置、密钥、鉴权、支付、安全、隐私或部署配置。
- 不把大规模重构伪装成小改动。

### Output Standards

- 默认中文输出。
- 代码、接口字段、配置键、命令、文件路径使用英文。
- 输出结构化、可复制、可执行。
- 优先使用表格、清单、任务拆解和 Mermaid 流程图。
- 明确区分事实、推断、计划、风险和待确认问题。
- 涉及真实项目代码修改时，先输出实现计划，再小步执行。

### Done Definition

一次 Engineering Build 任务完成时，必须说明：

- 做了什么
- 修改或计划涉及哪些模块 / 文件
- 影响范围和风险
- 测试方式和结果
- 没有做什么
- 待确认问题
- 下一步建议
