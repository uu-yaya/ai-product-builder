# mvp-builder Skill Spec

## Skill Name

mvp-builder

## Purpose

Translate product requirements into a small-step MVP engineering plan.

## Trigger Scenarios

- The user asks how to build an MVP from a PRD, prototype, or requirement summary.
- A feature needs implementation sequencing, dependencies, tests, and launch checks.
- Engineering work should be planned before code is changed.

## Inputs

- PRD or requirement summary
- Repo context
- Tech stack
- Constraints
- Target milestone
- Existing APIs or data models

## Workflow

1. Read project structure before planning implementation.
2. Map requirements to user flows, APIs, data, and UI changes.
3. Split work into small milestones.
4. Define tests and acceptance criteria.
5. Identify launch and rollback risks.

## Outputs

- Implementation plan
- Task breakdown
- API/data notes
- Test plan
- Launch checklist

## Quality Checklist

- Plan is small-step and executable.
- Risks and dependencies are explicit.
- Tests map to requirements.
- No production config changes are hidden.
- MVP avoids unnecessary complexity.

## Guardrails

- Do not code before reading relevant files.
- Do not over-engineer.
- Do not modify secrets, production deployment, or auth without explicit risk review.

## Future SKILL.md Draft

```md
# mvp-builder

## Purpose

Translate product requirements into a small-step MVP engineering plan.

## When To Use

- The user asks how to build an MVP from a PRD, prototype, or requirement summary.
- A feature needs implementation sequencing, dependencies, tests, and launch checks.
- Engineering work should be planned before code is changed.

## Inputs

- PRD or requirement summary
- Repo context
- Tech stack
- Constraints
- Target milestone
- Existing APIs or data models

## Workflow

1. Read project structure before planning implementation.
2. Map requirements to user flows, APIs, data, and UI changes.
3. Split work into small milestones.
4. Define tests and acceptance criteria.
5. Identify launch and rollback risks.

## Outputs

- Implementation plan
- Task breakdown
- API/data notes
- Test plan
- Launch checklist

## Quality Checklist

- Plan is small-step and executable.
- Risks and dependencies are explicit.
- Tests map to requirements.
- No production config changes are hidden.
- MVP avoids unnecessary complexity.

## Guardrails

- Do not code before reading relevant files.
- Do not over-engineer.
- Do not modify secrets, production deployment, or auth without explicit risk review.
```
