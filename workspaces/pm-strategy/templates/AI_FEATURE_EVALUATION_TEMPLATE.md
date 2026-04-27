# AI Feature Evaluation Template

## 1. Feature Goal

Describe the user goal and product outcome this feature should support.

## 2. User Intent

| User Intent | Scenario | Current Pain | Desired Result |
| --- | --- | --- | --- |
|  |  |  |  |

## 3. Is AI Necessary?

| Question | Answer | Evidence / Notes |
| --- | --- | --- |
| Can this be solved without AI? |  |  |
| Does the task require generation, reasoning, personalization, or semantic understanding? |  |  |
| Is the value high enough to justify AI cost and risk? |  |  |
| What happens if AI fails? |  |  |

## 4. Solution Options

| Option | Suitable For | Pros | Cons | Cost | Risk | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| Rule-based | Deterministic decisions and stable business rules | Predictable, cheap, easy to test | Limited flexibility | Low | Low |  |
| Search | Finding existing public or internal information | Transparent, fast, low generation risk | Depends on index quality | Low / Medium | Medium |  |
| RAG | Answering from a controlled knowledge base | Grounded, updateable, auditable | Retrieval quality matters | Medium | Medium |  |
| LLM Prompt | Language generation, summarization, classification, reasoning | Fast to prototype | Hallucination and evaluation risk | Medium | Medium |  |
| Function Calling | Structured tool or API execution | Controlled actions, better integration | Requires tool design and validation | Medium | Medium |  |
| Agent | Multi-step planning with tools and state | Handles complex workflows | Harder to control and evaluate | High | High |  |
| Workflow | Fixed multi-step process | Reliable, observable, easier to debug | Less adaptive | Medium | Medium |  |
| Fine-tuning | Stable style, domain behavior, repeated tasks at scale | Better consistency for narrow tasks | Needs data and maintenance | High | Medium / High |  |
| Recommendation System | Ranking, matching, personalization | Optimizes discovery and relevance | Needs data and feedback loops | Medium / High | Medium |  |

## 5. Data Requirements

| Data | Source | Quality Requirement | Privacy / Compliance Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## 6. Model / Algorithm Requirements

| Capability | Model / Algorithm Need | Evaluation Method | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## 7. Tool Calling Requirements

| Tool / Function | Input | Output | Permission | Failure Handling |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 8. Knowledge Base / RAG Requirements

| Knowledge Source | Update Frequency | Retrieval Strategy | Quality Check |
| --- | --- | --- | --- |
|  |  |  |  |

## 9. Fallback Logic

| Failure Scenario | Fallback | User Message | Escalation |
| --- | --- | --- | --- |
|  |  |  |  |

## 10. Safety and Compliance

| Risk Area | Requirement | Mitigation |
| --- | --- | --- |
| Privacy |  |  |
| Security |  |  |
| Abuse |  |  |
| Bias / Fairness |  |  |

## 11. Evaluation Metrics

| Metric | Definition | Target | Evaluation Dataset / Method |
| --- | --- | --- | --- |
|  |  |  |  |

## 12. Cost and Latency

| Scenario | Expected Cost | Latency Target | Optimization Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## 13. Risks

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
|  |  |  |  |

## 14. Recommendation

State the recommended approach, why it is appropriate, what to avoid, and the next validation step.
