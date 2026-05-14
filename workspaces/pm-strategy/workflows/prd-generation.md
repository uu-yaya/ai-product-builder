# PRD Generation Workflow

## 1. Purpose

Generate a structured PRD from clarified requirements, product ideas, or user scenarios.

## 2. When to Use

Use after the target user, scenario, problem, goal, and rough scope are sufficiently clear.

Do not use this workflow immediately after the user first shares a background or rough idea. First run a brainstorm / clarification pass with an appropriate PM or product skill, then enter PRD writing only after the user confirms the requirement direction.

## 3. Inputs

- Requirement summary
- Target users
- User scenarios
- Business goals
- Scope and non-goals
- Constraints
- AI feature notes, if any

## 4. Steps

1. Confirm the user has already approved the requirement direction after brainstorm / clarification.
2. Select the PRD-writing skill / workflow. If the product involves AI, LLM, Agent, Copilot, intelligent workflow, model behavior, tool calling, or AI-generated content, prefer `agent-prd-writer` as the primary writing skill and use supporting skills only when needed.
3. Check whether the input contains user, scenario, pain point, goal, scope, constraints, and success metrics.
4. If information is missing, list it as open questions and use clearly marked assumptions only when safe.
5. Build the PRD using `templates/PRD_TEMPLATE.md` or the selected AI PRD structure, while preserving APB PM Strategy formatting rules.
6. Add user flow with Mermaid when useful.
7. Add AI capability requirements only when AI is necessary.
8. Write acceptance criteria in testable Given / When / Then or equivalent form.
9. Document risks and unresolved questions.
10. After generating the PRD, output a core thinking review for the user to confirm: product judgment, key trade-offs, AI/non-AI boundary, P0 scope, risks, and open questions.

## 5. Outputs

- Complete PRD draft
- Core thinking review for user confirmation
- Assumptions
- Open questions
- Risk list
- Suggested next review step

## 6. Quality Checklist

- PRD includes background, goals, users, scenarios, scope, non-goals, requirements, flow, data, API, AI, permission, edge cases, metrics, acceptance criteria, risks, and open questions.
- Functional requirements include user value and acceptance criteria.
- AI requirements are justified, not assumed.
- Risks and missing information are visible.

## 7. Common Mistakes

- Writing features without user value.
- Hiding unclear decisions.
- Missing non-goals.
- Treating AI as default rather than optional.
- Writing acceptance criteria that cannot be tested.

## 8. Example Command

请根据 `templates/PRD_TEMPLATE.md` 为这个功能生成 PRD；缺失信息列为待确认问题，不要编造。
