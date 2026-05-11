# APB Claude Folder Instructions

You are working inside the `ai-product-builder` project.

Your role is not to execute a single isolated task immediately. First understand the project architecture, current roadmap, and module responsibilities. Then provide constructive advice or execute tasks within the correct APB boundary.

## User Context

The user is an AI Product Manager in Tencent IEG, working in a game frontier technology platform context.

When giving suggestions, consider:
- game AI product management
- AI agents and AI-assisted game development
- AIGC for game production pipelines
- AI NPCs / intelligent agents
- game R&D tools and internal platforms
- technical platform capabilities
- evaluation, safety, cost, latency, rollout, and engineering feasibility

## Project Purpose

APB means AI Product Builder.

This project is a multi-agent / multi-thread AI product workbench. It is not just a prompt library.

APB is designed to support:
- product strategy
- PRD / SRS / MRD writing
- AI feature evaluation
- design prototype and Figma prompt generation
- engineering implementation planning
- AI trend radar and research
- existing Skills reuse
- Lenny skills mapping
- future MCP / Multica / multi-agent orchestration

## Read First

Before giving major advice, read these files first:

1. Root control layer:
- `README.md`
- `AGENTS.md`
- `ROADMAP.md`

2. Memory layer:
- `memory/USER_PROFILE.md`
- `memory/GLOBAL_CONTEXT.md`
- `memory/DECISION_LOG.md`
- `memory/TERMINOLOGY.md`

3. Workspace layer:
- `workspaces/pm-strategy/`
- `workspaces/design-prototype/`
- `workspaces/engineering-build/`
- `workspaces/ai-trend-radar/`

4. Skills planning layer:
- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`
- `skills-plan/LENNY_SKILLS_INDEX.md`
- `skills-plan/LENNY_SKILLS_APB_MAPPING.md`
- `skills-plan/SKILLS_ROADMAP.md`

5. Future config / tool planning:
- `global-config-plan/`
- `mcp-plan/`

If a file or directory does not exist, report that clearly. Do not create it unless explicitly asked.

## Architecture Principles

Use this mental model:

- `AGENTS.md` is the global APB routing and safety rulebook.
- `README.md` is the human-facing usage guide.
- `ROADMAP.md` tracks build phases and current status.
- `memory/` stores long-term user and project context.
- `workspaces/` stores methods, templates, workflows, and prompts.
- `projects/` should store real project outputs.
- `skills-plan/` plans how APB reuses existing Skills and Lenny skills.
- `global-config-plan/` is only a recommendation area for future Codex config.
- `mcp-plan/` is only a planning area for future MCP setup.
- `cleanup-backups/` stores backups from controlled cleanup tasks.

Do not put real project deliverables into `workspaces/`.
Do not treat planning files as active global configuration.
Do not modify user-level config unless explicitly asked.

## APB Mode

When the user says `APB 模式`, `AI Product Builder 模式`, `按我的工作区规则`, `按 APB 工作流`, or similar phrases:

1. Route the task to the correct APB workspace.
2. Read the root `AGENTS.md`.
3. Read the relevant workspace `AGENTS.md`.
4. Decide whether existing Skills can help.
5. If using Skills, APB workspace templates and workflows still control the final output.
6. If information is missing, list Open Questions instead of inventing details.
7. If latest information is needed, verify online and cite sources.
8. If code or files may be modified, declare read/write scope first.

## Workspace Routing

Route tasks like this:

- Product strategy, requirements, PRD, MRD, SRS, user stories, AI feature evaluation, competitor analysis, prioritization:
  - `workspaces/pm-strategy/`

- UI, UX, Figma prompts, high-fidelity prototype, design system, design handoff:
  - `workspaces/design-prototype/`

- Codebase understanding, MVP build plan, API, data model, AI integration, tests, launch checklist:
  - `workspaces/engineering-build/`

- AI news, GitHub, YouTube, papers, trend research, product opportunities, demo ideas:
  - `workspaces/ai-trend-radar/`

If the task is ambiguous, start with `pm-strategy` requirement clarification.

## Existing Skills and Lenny Skills

APB can reuse existing Skills and Lenny skills, but they are capability providers, not final output authorities.

Rules:
- APB workspace rules win.
- APB templates win.
- Safety rules win.
- Do not assume a Skill should be used only because its name looks relevant.
- Prefer Skills only when their `name`, `description`, path, and task fit are appropriate.
- Duplicated Lenny skills are not low-quality or untrusted. Duplication only means similar metadata appears in multiple paths.
- Do not delete, move, disable, or rename any Skill unless explicitly asked.

Important references:
- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`
- `skills-plan/LENNY_SKILLS_INDEX.md`
- `skills-plan/LENNY_SKILLS_APB_MAPPING.md`

## External Tool Caution

Browser, Figma, Playwright, MCP, or external-write tools are allowed only when the task clearly needs them or the user explicitly asks for them.

They are not default tools for pure reasoning, writing, planning, or template generation.

Before using external tools, explain:
- why the tool is needed
- what scope will be accessed
- whether the action is read-only or may modify external resources

Ask for explicit confirmation before:
- write operations
- credential usage
- MCP setup
- production system changes
- remote resource modifications
- actions involving private or sensitive data

## Multi-thread Direction

The user plans to use multiple Codex / Claude / agent threads.

Assume future thread roles may include:
- Main Thread
- PM Strategy Thread
- Design Prototype Thread
- Engineering Build Thread
- AI Trend Radar Thread

Each thread should have a clear read/write boundary.

Before modifying files, always state:
- Will read
- Will write
- Will not modify

For future project output, prefer:
- `projects/<project-slug>/01-pm/`
- `projects/<project-slug>/02-design/`
- `projects/<project-slug>/03-engineering/`
- `projects/<project-slug>/04-research/`
- `projects/<project-slug>/05-reviews/`
- `projects/<project-slug>/decisions/`

If a `06-sync/` communication layer is later added, treat it as a project-level group / DM / task board / sync summary area.

## Safety Rules

Do not:
- modify `~/.codex/`
- modify `~/.agents/skills/`
- configure MCP
- run install commands
- delete files
- move existing Skills
- disable Skills
- overwrite existing content
- modify production config, secrets, deployment, auth, or privacy-related files
- write real tokens, API keys, or secrets

Unless the user explicitly asks for edits, prefer read-only analysis and recommendations.

## Output Style

Default to Chinese.

Use structured, practical outputs:
- summary first
- tables when helpful
- clear priorities: P0 / P1 / P2
- concrete next steps
- explicit risks and assumptions

Avoid vague suggestions.

When reviewing APB, distinguish:
- already completed
- current issues
- recommended next steps
- things not to do yet

## Current Advisory Focus

When asked to review this project, pay special attention to:

1. Whether README is too manual and should shift to APB Mode shortcuts.
2. Whether `projects/` needs a standard output template.
3. Whether multi-thread collaboration needs a `06-sync/` communication layer.
4. Whether the framework fits a Tencent IEG game AI product manager.
5. Whether game AI-specific templates are needed.
6. Whether MCP should remain delayed.
7. Whether Multica should be optional orchestration, not a hard dependency.