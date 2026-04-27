# AI Integration Template

## 1. AI Feature Goal

Describe the user outcome and product value of the AI feature.

## 2. User Input

| Input | Type | Required | Validation | Privacy Notes |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 3. System Context

Describe system instructions, user context, business rules, and constraints.

## 4. Data Source

| Source | Purpose | Permission Requirement | Freshness |
| --- | --- | --- | --- |
|  |  |  |  |

## 5. Model / Algorithm

Describe the model, algorithm, ranking logic, or deterministic alternative.

## 6. Prompt Strategy

Describe prompt structure, variables, guardrails, and examples.

## 7. RAG / Knowledge Base

| Knowledge Source | Retrieval Strategy | No-result Fallback | Update Rule |
| --- | --- | --- | --- |
|  |  |  |  |

## 8. Tool Calling

| Tool | Input | Output | Failure Handling | Permission |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 9. Output Format

Define a parseable output format such as JSON schema, typed object, or strict Markdown structure.

## 10. Fallback Logic

| Failure Scenario | Fallback | User Message | Logging |
| --- | --- | --- | --- |
| No retrieval result |  |  |  |
| Tool call failure |  |  |  |
| Model timeout |  |  |  |
| Unsafe output |  |  |  |

## 11. Safety Rules

- 不确定时不要编造。
- 无检索结果时要有 fallback。
- 工具调用失败时要有降级。
- 输出格式必须可解析。
- 涉及用户数据时必须考虑权限和隐私。

## 12. Logging

| Event | Fields | Purpose | Privacy Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## 13. Evaluation Metrics

| Metric | Definition | Target | Evaluation Method |
| --- | --- | --- | --- |
|  |  |  |  |

## 14. Cost and Latency

| Scenario | Cost Estimate | Latency Target | Optimization |
| --- | --- | --- | --- |
|  |  |  |  |

## 15. Testing Cases

| Case | Input | Expected Behavior | Blocking Release |
| --- | --- | --- | --- |
|  |  |  |  |

## 16. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
|  |  |  |

## 17. Rollback Plan

Describe feature flag, fallback route, model disable path, data impact, and validation after rollback.
