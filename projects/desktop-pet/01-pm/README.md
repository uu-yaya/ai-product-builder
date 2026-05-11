# 01-pm — PM Strategy 产物

## 用途

本目录存放 PM Strategy 线程的项目级产物。方法论与模板见 `workspaces/pm-strategy/`，本目录只放真实业务沉淀。

## 应放什么

- Requirement Clarification（需求澄清记录）
- PRD（产品需求文档）
- SRS（软件需求规格说明）
- MRD（市场需求文档）
- User Stories（用户故事）
- AI Feature Evaluation（AI 必要性与方案选择）
- Requirement Prioritization（RICE / P0–P2）
- Development Task Breakdown（按 Frontend / Backend / AI / QA / DevOps 拆解）

## 推荐文件命名

- `REQUIREMENT_CLARIFICATION_<feature-slug>.md`
- `PRD_<feature-slug>.md`
- `SRS_<feature-slug>.md`
- `MRD_<topic-slug>.md`
- `USER_STORIES_<feature-slug>.md`
- `AI_FEATURE_EVALUATION_<feature-slug>.md`
- `REQUIREMENT_PRIORITY_<scope-slug>.md`
- `DEVELOPMENT_TASK_BREAKDOWN_<feature-slug>.md`

## 写作要点

- 必须先有 `00-context/PROJECT_CONTEXT.md`，再写 PRD。
- 区分事实、假设、建议、待确认问题。
- 涉及竞品 / 市场 / AI 趋势数据时联网验证并标注来源。
- 每份文档必须有 Acceptance Criteria 或 Open Questions。

## 不应放什么

- 通用 PRD / 竞品分析 / 优先级方法论模板（属于 `workspaces/pm-strategy/templates/`）。
- 高保真视觉设计（属于 `02-design/`）。
- 工程实现代码（属于 `03-engineering/`）。
- AI 趋势报告（属于 `04-research/`）。
