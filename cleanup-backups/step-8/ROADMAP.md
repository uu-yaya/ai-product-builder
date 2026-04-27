# AI Product Builder Roadmap

## Current Status

The workspace has completed the first foundation layer:

- Basic workspace skeleton
- Root `AGENTS.md`
- `memory/` for persistent context
- Placeholder workspaces for PM, design, engineering, and AI trend radar
- `projects/` for project-specific context

## Optimized Architecture

The system will use a three-layer architecture:

1. Global Codex Runtime Config
   - Defines runtime behavior, safety defaults, profiles, memory, MCP, and global work agreements.
   - Planned in `global-config-plan/`; actual user-level config may later live in `~/.codex/`.

2. Reusable Skills
   - Packages repeatable workflows such as PRD writing, competitor analysis, prioritization, UI review, prototype generation, MVP building, and trend radar.
   - Planned in `skills-plan/`; actual skills may later live in `~/.agents/skills/`.

3. Project Workspace
   - Stores long-term context, workspace-specific rules, templates, workflows, prompts, and project decisions.
   - Lives in this repository.

## Implementation Phases

### Phase 1: Workspace Skeleton

Status: completed.

Initialize the root workspace, global rules, memory files, professional workspace placeholders, and project directory.

### Phase 2: Compatibility Optimization

Status: current phase.

Create `ROADMAP.md`, `global-config-plan/`, `skills-plan/`, and `mcp-plan/` without changing user-level configuration or installing anything.

### Phase 3: Build pm-strategy Workspace

Add PM templates, workflows, and prompts for requirement clarification, PRD, SRS, MRD, competitor analysis, user journey, AI feature evaluation, and engineering task breakdown.

### Phase 4: Build design-prototype Workspace

Add design inspiration workflows, UI review checklists, Figma Prompt templates, high-fidelity prototype guidance, and visual optimization methods.

### Phase 5: Build engineering-build Workspace

Add code understanding workflows, MVP implementation templates, API planning, frontend/backend implementation guidance, test plans, and launch checks.

### Phase 6: Build ai-trend-radar Workspace

Add trend research workflows for YouTube, GitHub, papers, AI product launches, technical blogs, opportunity extraction, and demo idea generation.

### Phase 7: Create P0 Skills

Create the first reusable Skills after the project workspace patterns stabilize:

- `prd-writer`
- `competitor-analysis`
- `requirement-prioritizer`

### Phase 8: Add MCP Gradually

Introduce MCP servers only when their value is clear:

1. Context7
2. GitHub
3. Figma
4. Playwright

### Phase 9: Project-specific Integration

Add concrete project context under `projects/`, including goals, scope, decisions, requirements, design notes, engineering notes, and delivery records.
