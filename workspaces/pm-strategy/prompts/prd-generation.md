# PRD Generation Prompt

## 1. Prompt Name

PRD Generation Prompt

## 2. Use Case

用于基于已澄清需求撰写完整 PRD。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 PM Strategy Partner，根据以下信息生成一份完整 PRD。

默认中文输出。请先判断需求完整性；如果缺少用户、场景、目标、范围、数据、接口、AI 能力或验收标准，请列为待确认问题，不要编造。

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

最后给出下一步行动建议。

输入信息：
[粘贴需求、上下文或草稿]
```

## 4. Expected Output

- 完整 PRD 草稿
- 功能需求表
- 验收标准
- 风险和待确认问题
- 下一步行动建议
