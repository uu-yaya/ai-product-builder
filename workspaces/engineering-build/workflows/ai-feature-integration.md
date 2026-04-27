# AI Feature Integration Workflow

## 1. Purpose

Plan AI feature integration in a way that is observable, testable, safe, and rollback-ready.

## 2. When to Use

Use when implementing LLM, RAG, tool calling, agentic workflow, recommendation, ranking, classification, generation, or semantic search behavior.

## 3. Inputs

- AI feature goal
- User input and output expectations
- Data sources
- Model / algorithm candidate
- Prompt requirements
- Tool or API dependencies
- Safety and privacy constraints

## 4. Steps

1. Define input and output format.
2. Define model / algorithm and deterministic alternatives.
3. Define Prompt strategy and system context.
4. Define RAG / knowledge base source, retrieval behavior, and no-result fallback.
5. Define tool calling behavior, permissions, and failure downgrade.
6. Define safety rules, logging, evaluation metrics, cost, and latency.
7. Define test scenarios and rollback plan.

## 5. Outputs

- AI integration plan
- Input / output contract
- Prompt strategy
- RAG / knowledge base plan
- Tool calling plan
- Fallback and safety rules
- Logging and evaluation metrics
- Cost and latency notes
- Test cases
- Rollback plan

## 6. Quality Checklist

- Output format is parseable.
- No-result and tool-failure fallback are defined.
- User data permissions and privacy are considered.
- Evaluation metrics are measurable.
- Rollback path is realistic.

## 7. Common Mistakes

- Treating AI integration as just a prompt.
- Missing fallback behavior.
- Logging sensitive user data.
- Ignoring hallucination and output format errors.
- Missing cost and latency budget.

## 8. Example Command

请根据 `templates/AI_INTEGRATION_TEMPLATE.md` 设计这个 AI 功能的工程集成方案，明确输入输出、模型 / 算法、Prompt、RAG、工具调用、fallback、安全规则、日志、评估指标、成本、延迟、测试和回滚方案。
