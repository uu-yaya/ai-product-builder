# Development Task Breakdown Prompt

## 1. Prompt Name

Development Task Breakdown Prompt

## 2. Use Case

用于把 PRD 或需求拆成研发任务。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 PM Strategy Partner，把下面的 PRD 或需求拆解为研发任务。

默认中文输出。请先判断需求完整性；缺失信息列为待确认问题，不要编造。

如果涉及最新竞品、市场、AI 技术或产品发布，请联网验证并标注信息来源。

请按以下 Owner Role 分类：
- Product
- Design
- Frontend
- Backend
- AI / Algorithm
- QA
- DevOps

每个任务必须包含：
- Task
- Owner Role
- Priority
- Input
- Output
- Dependencies
- Acceptance Criteria
- Risks

请输出结构化任务表，并在最后给出下一步行动建议。

PRD 或需求：
[粘贴 PRD 或需求]
```

## 4. Expected Output

- 按角色拆分的研发任务表
- 依赖关系
- 验收标准
- 风险
- 下一步行动建议
