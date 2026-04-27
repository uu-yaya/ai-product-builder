# AI Product Builder Roadmap

## Current Status

The workspace has completed the project-level foundation and global closure check:

- Phase 1 Workspace Skeleton is completed.
- Phase 2 Compatibility Optimization is completed.
- Phase 3 Build pm-strategy Workspace is completed and accepted.
- Phase 4 Build design-prototype Workspace is completed and accepted.
- Phase 5 Build engineering-build Workspace is completed and accepted.
- Phase 6 Build ai-trend-radar Workspace is completed and accepted.
- Phase 7 Global Workspace Closure Check is completed and accepted as a staged milestone.
- Current phase: Phase 8 Documentation Cleanup.

## Optimized Architecture

The system uses a three-layer architecture:

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

Status: completed.

Create `ROADMAP.md`, `global-config-plan/`, `skills-plan/`, and `mcp-plan/` without changing user-level configuration or installing anything.

### Phase 3: Build pm-strategy Workspace

Status: completed and accepted.

Add PM templates, workflows, and prompts for requirement clarification, PRD, SRS, MRD, competitor analysis, user journey, AI feature evaluation, and engineering task breakdown.

### Phase 4: Build design-prototype Workspace

Status: completed and accepted.

Add design inspiration workflows, UI review checklists, Figma Prompt templates, high-fidelity prototype guidance, and visual optimization methods.

### Phase 5: Build engineering-build Workspace

Status: completed and accepted.

Add code understanding workflows, MVP implementation templates, API planning, frontend/backend implementation guidance, test plans, and launch checks.

### Phase 6: Build ai-trend-radar Workspace

Status: completed and accepted.

Add trend research workflows for YouTube, GitHub, papers, AI product launches, technical blogs, opportunity extraction, and demo idea generation.

### Phase 7: Global Workspace Closure Check

Status: completed and accepted as a staged milestone.

Check root rules, memory files, workspace boundaries, planning directories, formatting, and safety constraints before deeper setup work.

### Phase 8: Documentation Cleanup

Status: current phase.

Clean Step 2 planning artifacts, remove duplicated draft sections, fix literal formatting artifacts, align README and ROADMAP status, and preserve only the readable planning versions.

### Phase 9: Next Rollout Stages

Status: planned.

Use the cleaned planning documents to move into controlled implementation:

1. Create P0 Skills
   - `prd-writer`
   - `competitor-analysis`
   - `requirement-prioritizer`

2. Add MCP Gradually
   - Context7
   - GitHub
   - Figma
   - Playwright

3. Project-specific Integration
   - Add concrete project context under `projects/`.
   - Include goals, scope, decisions, requirements, design notes, engineering notes, and delivery records.
