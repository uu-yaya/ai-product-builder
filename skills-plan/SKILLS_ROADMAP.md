# Skills Roadmap

## Goals

Skills package repeatable, high-frequency workflows so the workspace can stay lightweight while still supporting consistent product, design, engineering, and research output.

## Skills vs AGENTS.md

- `AGENTS.md` defines durable behavior, routing, safety rules, and workspace boundaries.
- Skills define repeatable task procedures with inputs, workflows, quality gates, and outputs.
- Avoid putting every template, checklist, and prompt into a single `AGENTS.md`.

## Skills vs Workflows and Prompts

- `workflows/` stores project-level operating procedures.
- `prompts/` stores reusable prompt fragments.
- Skills combine procedure, prompt guidance, guardrails, and quality checks into a reusable capability.

## Recommended Priority

### P0

- `prd-writer`
- `competitor-analysis`
- `requirement-prioritizer`

### P1

- `ui-ux-reviewer`
- `figma-prototype`
- `mvp-builder`

### P2

- `ai-trend-radar`
- `metrics-designer`
- `user-research`
- `sprint-planner`

## Phased Creation Plan

1. Create P0 Skills after `pm-strategy` templates stabilize.
2. Create P1 Skills after design and engineering workflows have enough real examples.
3. Create P2 Skills after research cadence and project delivery loops are clear.
4. Promote only proven workflows into real Skills.

## Trigger Scenarios

| Skill | Trigger Scenario |
| --- | --- |
| `prd-writer` | User needs a PRD, feature spec, or product requirement clarification. |
| `competitor-analysis` | User asks to analyze competitors, alternatives, market positioning, or feature gaps. |
| `requirement-prioritizer` | User needs to rank requirements, define MVP scope, or cut scope. |
| `ui-ux-reviewer` | User asks for UI/UX critique, page review, or design improvement suggestions. |
| `figma-prototype` | User needs a Figma Prompt or high-fidelity prototype brief. |
| `mvp-builder` | User wants to turn a product plan into an implementation plan or MVP. |
| `ai-trend-radar` | User asks for recent AI trends, product launches, GitHub projects, or papers. |
| `metrics-designer` | User needs product metrics, success criteria, or dashboards. |
| `user-research` | User needs interview plans, survey design, or insight synthesis. |
| `sprint-planner` | User needs engineering tasks, milestones, and delivery sequencing. |

## Inputs and Outputs

| Skill | Inputs | Outputs |
| --- | --- | --- |
| `prd-writer` | Idea, user, scenario, constraints | PRD outline, requirements, acceptance criteria |
| `competitor-analysis` | Competitors, market, product category | Comparison matrix, insights, opportunities |
| `requirement-prioritizer` | Feature list, goals, constraints | Priority ranking, MVP scope, tradeoffs |
| `ui-ux-reviewer` | Screenshot, page description, goals | UX findings, visual issues, improvement plan |
| `figma-prototype` | Product goal, page list, style direction | Figma Prompt, screen structure, interaction notes |
| `mvp-builder` | PRD, tech stack, repo context | Implementation plan, milestones, tests |
| `ai-trend-radar` | Research topic, timeframe, sources | Verified trend brief, opportunities, demo ideas |

## Risks and Notes

- Do not create Skills before workflows are proven.
- Do not store credentials inside Skills.
- Keep Skills focused; avoid mega-skills that do everything.
- Prefer project examples before extracting general procedures.
- Update Skills only through explicit, reviewable changes.
