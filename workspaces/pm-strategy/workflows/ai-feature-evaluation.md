# AI Feature Evaluation Workflow

## 1. Purpose

Decide whether a feature needs AI and choose the safest, simplest, most valuable AI or non-AI solution.

## 2. When to Use

Use whenever a product idea mentions AI, personalization, automation, semantic search, generation, decision support, agents, or recommendations.

## 3. Inputs

- Feature goal
- User intent
- Task complexity
- Data availability
- Accuracy requirement
- Cost and latency constraints
- Safety or compliance constraints

## 4. Steps

1. Clarify the user outcome and failure cost.
2. Decide whether AI is necessary or whether a deterministic solution is enough.
3. Compare Rule-based System, Search, RAG, LLM Prompt, Function Calling, Agent, Workflow Automation, Fine-tuning, and Recommendation System.
4. Evaluate data requirements, cost, latency, safety, compliance, and fallback logic.
5. Choose the smallest solution that can deliver the user value.
6. Define evaluation metrics and validation plan.

## 5. Outputs

- AI necessity judgment
- Solution comparison table
- Recommended solution
- Reason for recommendation
- Fallback logic
- Evaluation metrics
- Risks and next validation step

## 6. Quality Checklist

- Non-AI options were considered.
- Agent is not recommended without clear multi-step tool-use need.
- Data and evaluation requirements are explicit.
- Failure modes and fallback are defined.
- Cost and latency are considered.

## 7. Common Mistakes

- Recommending Agent because it sounds advanced.
- Ignoring rule-based or workflow options.
- Missing evaluation metrics.
- Ignoring data quality and permission issues.
- Overbuilding the MVP.

## 8. Example Command

请根据 `templates/AI_FEATURE_EVALUATION_TEMPLATE.md` 评估这个功能是否需要 Agent，并比较 Rule-based、Search、RAG、LLM Prompt、Function Calling、Agent、Workflow、Fine-tuning 和推荐系统。
