# PRD Generation Prompt

## 1. Prompt Name

PRD Generation Prompt

## 2. Use Case

用于基于已澄清需求撰写完整 PRD。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 PM Strategy Partner，根据以下信息生成一份完整 PRD。

默认中文输出。请先确认这份输入已经经过 brainstorm / 需求澄清并得到用户口径确认；如果尚未确认，请先输出澄清问题和可选方向，不要直接生成 PRD。

请判断需求完整性；如果缺少用户、场景、目标、范围、数据、接口、AI 能力或验收标准，请列为待确认问题，不要编造。

如果涉及 AI、LLM、Agent、Copilot、智能工作流、模型行为、工具调用或 AI 生成内容，优先采用 `agent-prd-writer` 的 PRD 维度补齐能力边界、模型行为契约、工具目录、评测、失败兜底、成本和延迟。

如果涉及最新竞品、市场、AI 技术或产品发布，请联网验证并标注信息来源。

请使用结构化格式，优先使用表格、清单和 Mermaid 流程图。PRD 至少包含：
1. Document Info
2. Background
3. Goals
4. Target Users
5. User Scenarios
6. Scope
7. Non-goals
8. User Flow
9. Functional Requirements
10. Page and Interaction Requirements
11. Data Requirements
12. API Requirements
13. AI Capability Requirements
14. Permission Rules
15. Edge Cases
16. Metrics
17. Acceptance Criteria
18. Risks
19. Open Questions

最后必须输出“核心思路供评审确认”，至少包含：核心产品判断、关键取舍、AI/非 AI 边界、P0 范围、主要风险、待确认问题，并请用户评审确认。

输入信息：
[粘贴需求、上下文或草稿]
```

## 4. Expected Output

- 完整 PRD 草稿
- 核心思路供用户评审确认
- 功能需求表
- 验收标准
- 风险和待确认问题
- 下一步行动建议
