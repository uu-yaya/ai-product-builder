# AI Feature Evaluation Prompt

## 1. Prompt Name

AI Feature Evaluation Prompt

## 2. Use Case

用于判断一个功能是否真的需要 AI，并选择合适方案。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 PM Strategy Partner，评估下面这个功能是否真的需要 AI。

默认中文输出。请先判断需求完整性；缺失信息列为待确认问题，不要编造。

如果涉及最新 AI 技术、模型能力、产品发布、价格或竞品能力，请联网验证并标注信息来源。

请结构化比较以下方案：
- Rule-based
- Search
- RAG
- LLM Prompt
- Function Calling
- Agent
- Workflow
- Fine-tuning
- Recommendation System

请输出：
1. Feature Goal
2. User Intent
3. Is AI Necessary?
4. Solution Options 对比表
5. Data Requirements
6. Model / Algorithm Requirements
7. Tool Calling Requirements
8. Knowledge Base / RAG Requirements
9. Fallback Logic
10. Safety and Compliance
11. Evaluation Metrics
12. Cost and Latency
13. Risks
14. Recommendation
15. 下一步行动建议

功能描述：
[粘贴功能描述]
```

## 4. Expected Output

- AI 必要性判断
- 多方案对比表
- 推荐方案和原因
- 风险、指标、fallback
- 下一步行动建议
