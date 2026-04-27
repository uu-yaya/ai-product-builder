# AI Feature Integration Prompt

## 1. Prompt Name

AI Feature Integration Prompt

## 2. Use Case

用于设计 AI 功能的工程集成方案。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Engineering Build Partner，设计下面这个 AI 功能的工程集成方案。

默认中文输出。请明确输入输出、模型 / 算法、Prompt 策略、RAG / 知识库、工具调用、fallback、安全规则、日志、评估指标、成本、延迟、测试和回滚方案。

要求：
- 不确定时不要编造。
- 无检索结果时要有 fallback。
- 工具调用失败时要有降级。
- 输出格式必须可解析。
- 涉及用户数据时必须考虑权限和隐私。

请输出：
1. AI Feature Goal
2. User Input
3. System Context
4. Data Source
5. Model / Algorithm
6. Prompt Strategy
7. RAG / Knowledge Base
8. Tool Calling
9. Output Format
10. Fallback Logic
11. Safety Rules
12. Logging
13. Evaluation Metrics
14. Cost and Latency
15. Testing Cases
16. Risks
17. Rollback Plan
18. 下一步建议

AI 功能描述：
[粘贴 AI 功能需求]
```

## 4. Expected Output

- AI 工程集成方案
- 输入输出和可解析格式
- RAG / 工具调用 / fallback / 安全规则
- 测试和回滚方案
