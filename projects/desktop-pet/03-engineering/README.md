# 03-engineering — Engineering Build 产物

## 用途

本目录存放 Engineering Build 线程的项目级产物。方法论与模板见 `workspaces/engineering-build/`。

## 应放什么

- MVP Build Plan（从 PRD / 设计交付转工程计划）
- API Implementation Plan
- Data Model
- AI Integration（模型 / Prompt / RAG / 工具调用 / fallback / 评估 / 成本 / 延迟）
- Test Cases
- Code Review Notes
- Launch Checklist

## 推荐文件命名

- `MVP_BUILD_PLAN_<feature-slug>.md`
- `API_PLAN_<feature-slug>.md`
- `DATA_MODEL_<feature-slug>.md`
- `AI_INTEGRATION_<feature-slug>.md`
- `TEST_CASES_<feature-slug>.md`
- `CODE_REVIEW_<scope-slug>.md`
- `LAUNCH_CHECKLIST_<feature-slug>.md`

## 新支路目录

同一个 project 内的新问题支路放到：

```text
03-engineering/branches/<branch-slug>/
```

`<branch-slug>` 必须与 `01-pm/branches/`、`02-design/branches/`、`04-research/branches/` 保持同名。支路内先建 `README.md`，再放工程计划、API 方案、数据模型、AI 集成、测试用例和上线清单。

## 写作要点

- 真实代码修改前必须先读项目结构、定位相关文件、输出实现计划，再小步执行。
- 每份计划必须说明影响范围、依赖、风险、测试方式。
- AI 集成必须包含 fallback、可解析输出、权限、可观测、可回滚。
- Launch Checklist 必须有 Go / No-go 建议与回滚方案。

## 不应放什么

- 真实生产配置 / token / 密钥（一律不进 APB 仓库）。
- 真实玩家数据 / 未脱敏日志。
- 通用工程模板（属于 `workspaces/engineering-build/templates/`）。
- 设计 Prompt（属于 `02-design/`）。
