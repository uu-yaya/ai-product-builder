# AI Product Builder Roadmap

## Current Status

The workspace has completed the project-level foundation, global closure check, and Step 8 documentation cleanup:

- Phase 1 Workspace Skeleton is completed.
- Phase 2 Compatibility Optimization is completed.
- Phase 3 Build pm-strategy Workspace is completed and accepted.
- Phase 4 Build design-prototype Workspace is completed and accepted.
- Phase 5 Build engineering-build Workspace is completed and accepted.
- Phase 6 Build ai-trend-radar Workspace is completed and accepted.
- Phase 7 Global Workspace Closure Check is completed and accepted as a staged milestone.
- Phase 8 Documentation Cleanup is completed.
- Phase 9A Existing Skills Reuse Strategy is completed.
- Phase 9B Lenny Skills Audit is completed.
- Current phase: Phase 9C Lenny Skills APB Index and Mapping.

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

Status: completed.

Clean Step 2 planning artifacts, remove duplicated draft sections, fix literal formatting artifacts, align README and ROADMAP status, and preserve only the readable planning versions.

### Phase 9: Skills Reuse and Controlled Rollout

Status: current phase.

Before creating custom `apb-` Skills, prefer reusing existing installed Skills when their frontmatter `name`, `description`, path, and APB workspace fit are strong. Reuse must not be hardcoded. Existing Skills remain capability providers, while APB workspaces provide routing, templates, workflows, constraints, and final output standards.

#### Phase 9A: Existing Skills Reuse Strategy

Status: completed.

Create the Existing Skills Reuse Decision Matrix and APB mode routing rules. Decide when installed Skills should use `Primary Reuse`, `Secondary Support`, `Use When Task Requires External Context`, `Use Only When Explicitly Requested`, `Do Not Prefer`, or `Duplicate / Review Later`.

#### Phase 9B: Lenny Skills Audit

Status: completed.

Audit the local Lenny skills repository, identify root-level duplicates, summarize method coverage, and decide how APB should reuse Lenny methods without modifying user-level Skill files.

#### Phase 9C: Lenny Skills APB Index and Mapping

Status: current.

Create APB-local index and workspace mapping documents for Lenny skills. Keep the original Lenny repository untouched while making reuse decisions easier and less noisy.

#### Phase 9D: P0 Skills Decision

Status: planned.

Decide whether P0 workflows should rely on existing Skills or require custom APB Skills after observing real APB mode usage.

#### Phase 9E: Optional APB Custom Skills

Status: planned.

Create custom `apb-` Skills only if existing Skills cannot reliably follow APB templates, trigger correctly, or support Chinese AI product manager workflows.

Candidate custom names if needed:

- `apb-prd-writer`
- `apb-competitor-analysis`
- `apb-requirement-prioritizer`

#### Phase 9F: Gradual MCP Setup

Status: planned.

Introduce MCP gradually only when value is clear and after explicit confirmation:

1. Context7
2. GitHub
3. Figma
4. Playwright

#### Phase 9G: Project-specific Integration

Status: planned.

Add concrete project context under `projects/`, including goals, scope, decisions, requirements, design notes, engineering notes, and delivery records.
