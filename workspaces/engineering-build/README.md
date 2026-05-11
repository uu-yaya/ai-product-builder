# Engineering Build Workspace

## Workspace Overview

`engineering-build` 是 AI Product Builder 的工程落地与 MVP 构建中心，负责把 PRD、原型和设计交付转化为代码理解、实现计划、API 设计、数据模型、AI 集成方案、测试用例、代码审查和上线检查。

## Directory Structure

```text
workspaces/engineering-build/
├── AGENTS.md
├── README.md
├── templates/
├── workflows/
└── prompts/
```

## When to Use This Workspace

- 需要理解现有代码仓库并解释产品功能映射。
- 需要把 PRD / 原型转成 MVP 落地计划。
- 需要设计 API、数据模型或工程实现方案。
- 需要规划 AI 功能集成、RAG、工具调用、fallback 和评估。
- 需要生成测试用例、审查代码或做上线前检查。
- 需要把设计交付转成前端实现说明。

## Templates

- `templates/CODEBASE_UNDERSTANDING_TEMPLATE.md`：代码仓库理解模板。
- `templates/MVP_BUILD_PLAN_TEMPLATE.md`：MVP 落地计划模板。
- `templates/API_IMPLEMENTATION_PLAN_TEMPLATE.md`：API 工程实现计划模板。
- `templates/DATA_MODEL_TEMPLATE.md`：数据模型模板。
- `templates/AI_INTEGRATION_TEMPLATE.md`：AI 功能集成模板。
- `templates/TEST_CASE_TEMPLATE.md`：测试用例模板。
- `templates/CODE_REVIEW_TEMPLATE.md`：代码审查模板。
- `templates/LAUNCH_CHECKLIST_TEMPLATE.md`：上线检查模板。

## Workflows

- `workflows/codebase-understanding.md`：代码仓库理解流程。
- `workflows/mvp-build-from-prd.md`：从 PRD / 原型生成 MVP 落地计划流程。
- `workflows/api-design-to-implementation.md`：API 需求转工程实现流程。
- `workflows/ai-feature-integration.md`：AI 功能集成流程。
- `workflows/test-case-generation.md`：测试用例生成流程。
- `workflows/code-review.md`：代码审查流程。
- `workflows/launch-readiness-check.md`：上线前检查流程。

## Prompts

- `prompts/codebase-understanding.md`：代码仓库理解 Prompt。
- `prompts/mvp-build-from-prd.md`：MVP 落地计划 Prompt。
- `prompts/api-design-to-implementation.md`：API 工程实现 Prompt。
- `prompts/ai-feature-integration.md`：AI 功能集成 Prompt。
- `prompts/test-case-generation.md`：测试用例生成 Prompt。
- `prompts/code-review.md`：代码审查 Prompt。
- `prompts/launch-readiness-check.md`：上线前检查 Prompt。

## Engineering Guardrails

- 真实代码修改前必须先读项目结构、定位相关文件并输出实现计划。
- 不无授权删除文件或大规模重构。
- 不无授权修改生产配置、密钥、鉴权、支付、安全、隐私或部署配置。
- 每个实现计划必须说明影响范围、依赖、风险和测试方式。
- 需求不清晰时回到 `workspaces/pm-strategy/`；设计交付不清晰时回到 `workspaces/design-prototype/`。

## Example Commands

所有示例都以 `APB 模式：...` 起手，无需再指定工作区——APB 会自动路由到本工作区。

- `APB 模式：阅读当前代码仓库并从产品 + 工程视角解释，按 CODEBASE_UNDERSTANDING_TEMPLATE 输出，不要修改文件。`
- `APB 模式：基于这个 PRD 和设计交付，生成 MVP_BUILD_PLAN。`
- `APB 模式：为这个功能设计 API_PLAN 和 TEST_CASES。`
- `APB 模式：设计这个 AI 功能的工程集成方案，按 AI_INTEGRATION_TEMPLATE 输出，含 fallback / 评估 / 成本 / 延迟。`
- `APB 模式：评审这个实现方案的技术风险和上线检查项，按 LAUNCH_CHECKLIST_TEMPLATE 输出 Go/No-go 与回滚方案。`
- `APB 模式：评审这个 PR，按 CODE_REVIEW_TEMPLATE 输出，问题按 P0/P1/P2 标注。`

## Maintenance Rules

- 模板保持稳定，具体项目实现细节放到项目目录或实际代码仓库中。
- workflows 描述执行流程，prompts 提供可复制指令。
- 不在本工作区保存真实密钥、token 或生产配置。
- 不把工程计划和真实代码修改混为一步。
