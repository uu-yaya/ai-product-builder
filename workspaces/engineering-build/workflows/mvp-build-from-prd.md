# MVP Build from PRD Workflow

## 1. Purpose

Turn a PRD, prototype, or design handoff into a practical MVP implementation plan.

## 2. When to Use

Use when product and design intent are clear enough to plan engineering delivery.

## 3. Inputs

- PRD
- Prototype or design handoff
- Existing codebase context
- Constraints
- Target milestone
- Known dependencies

## 4. Steps

1. Extract MVP scope and non-goals from the PRD / prototype / design handoff.
2. Map the user flow and acceptance criteria.
3. Break down frontend pages, components, state, and API usage.
4. Break down backend services, APIs, permissions, and integrations.
5. Break down data model changes and migration risks.
6. Break down AI workflow, prompt, RAG, tool calling, fallback, evaluation, cost, and latency.
7. Break down tests and launch checks.
8. Output task priority and dependency relationships.

## 5. Outputs

- MVP scope
- Frontend plan
- Backend plan
- API plan
- Data model plan
- AI workflow plan
- Testing plan
- Launch plan
- Task priority and dependencies

## 6. Quality Checklist

- MVP is smaller than the full product vision.
- Dependencies and risks are explicit.
- Acceptance criteria are testable.
- AI work is separated from deterministic engineering work.
- No code is changed before an implementation plan is accepted.

## 7. Common Mistakes

- Building all PRD features in v1.
- Missing design handoff dependencies.
- Missing API or data compatibility risk.
- Missing tests and launch checks.
- Treating AI integration as only a prompt.

## 8. Example Command

请根据 `templates/MVP_BUILD_PLAN_TEMPLATE.md` 把这份 PRD 和原型转成 MVP 落地计划，拆分前端、后端、API、数据模型、AI、测试和上线任务，标注优先级和依赖关系。
