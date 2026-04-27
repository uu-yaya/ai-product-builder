# PRD Generation Workflow

## 1. Purpose

Generate a structured PRD from clarified requirements, product ideas, or user scenarios.

## 2. When to Use

Use after the target user, scenario, problem, goal, and rough scope are sufficiently clear.

## 3. Inputs

- Requirement summary
- Target users
- User scenarios
- Business goals
- Scope and non-goals
- Constraints
- AI feature notes, if any

## 4. Steps

1. Check whether the input contains user, scenario, pain point, goal, scope, constraints, and success metrics.
2. If information is missing, list it as open questions and use clearly marked assumptions only when safe.
3. Build the PRD using `templates/PRD_TEMPLATE.md`.
4. Add user flow with Mermaid when useful.
5. Add AI capability requirements only when AI is necessary.
6. Write acceptance criteria in testable Given / When / Then or equivalent form.
7. Document risks and unresolved questions.

## 5. Outputs

- Complete PRD draft
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
