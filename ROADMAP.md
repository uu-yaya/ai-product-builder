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
- Phase 9C Lenny Skills APB Index and Mapping is completed.
- Step 10A Root README Rewrite is completed.
- Step 10B Project Template + 06-sync is completed.
- Step 10C Global Multi-thread Protocol is completed.
- Step 10D Thread Startup Prompts is completed.
- Step 10E Workspace Example Commands Sync is completed.
- Step 10F GLOBAL_CONTEXT Baseline is completed.
- Step 10I Slim Root AGENTS.md and Move Detailed Rules to Docs is completed.
- Step 10G Roadmap and Decision Log Alignment is completed.
- Step 10K Blocker Reporting Protocol is completed.
- Step 10L Tool-Agnostic Refactor is completed.
- Current phase: Step 10M Tool-Agnostic Agent Runtime.
- Step 10H First Pilot Project remains planned.

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

## Step 10: Multi-thread Foundation

Step 10 是 Phase 9G 的前置准备工作，把 APB 从"单线程方法论库"升级为"可多线程协作的项目工作台"。它分为以下子步骤：

### Step 10A: Root README Rewrite

Status: completed.

把根 `README.md` 从旧版 "进入某工作区" 用法改写成 APB Mode 操作手册，覆盖 Quick Start / APB Mode Examples / Workspaces vs Projects / Multi-thread Usage / Safety 等 11 个章节。旧版备份在 `cleanup-backups/step-10a-readme-rewrite/README.md.bak`。

### Step 10B: Project Template + 06-sync

Status: completed.

创建 `projects/_PROJECT_TEMPLATE/`，含 6+1 层结构：`00-context/`（项目身份层）、`01-pm/` ~ `04-research/`（四线程产物层）、`05-reviews/`（跨线程评审层）、`06-sync/`（多线程通信层，含 `THREAD_REGISTRY.md` / `TASK_BOARD.md` / `SYNC_SUMMARY.md` / `group/` / `dm/` 6 条预置定向通道）、`decisions/`（项目级决策层）。

### Step 10C: Global Multi-thread Protocol

Status: completed.

把 Step 10B 的项目级 06-sync 接入 APB 全局路由。产出：

- `docs/APB_MULTI_THREAD_PROTOCOL.md`：12 节全局多线程协议（角色、读写矩阵、启动顺序、完成顺序、冲突避免、推荐流程、Multica 兼容、安全边界）。
- 根 `AGENTS.md` 追加 `Multi-thread Routing & Read/Write Boundaries` 段，含 5 类线程触发词、Project File Ownership、06-sync Rules、cleanup-backups 路由禁入规则、Safety Boundary。
- 根 `README.md` 更新 `_PROJECT_TEMPLATE` / 06-sync / global protocol / thread startup prompts 的状态描述。

旧版备份在 `cleanup-backups/step-10c-multithread-protocol/`。

### Step 10D: Thread Startup Prompts

Status: completed.

为 5 类线程（Main / PM Strategy / Design Prototype / Engineering Build / AI Trend Radar）建立标准启动 Prompt 模板。产出：

- `prompts/thread-start/MAIN_THREAD_START.md`
- `prompts/thread-start/PM_THREAD_START.md`
- `prompts/thread-start/DESIGN_THREAD_START.md`
- `prompts/thread-start/ENGINEERING_THREAD_START.md`
- `prompts/thread-start/RADAR_THREAD_START.md`

每份模板含 7 节：Prompt Name / Use Case / Copyable Prompt / Required Inputs / Expected Output / Write Boundary / Safety Notes。Copyable Prompt 严格遵循 Step 10C 协议的 Standard Thread Startup Sequence（强制 Will read / Will write / Will not modify 输出，绑定对应 workspace 的 `AGENTS.md`）。

旧版备份（README.md / ROADMAP.md）在 `cleanup-backups/step-10d-thread-start-prompts/`。

### Step 10E: Workspace Example Commands Sync

Status: completed.

把 4 个工作区 `README.md` 的 Example Commands 与 2 个 workflow 首行的"请进入 X 工作区..."旧用法全部同步到 `APB 模式：...`。共替换 27 条旧式表达，全仓 4 个目标字面表达 grep = 0 匹配。旧版备份在 `cleanup-backups/step-10e-sync-apb-mode-examples/`。

### Step 10F: GLOBAL_CONTEXT Baseline

Status: completed.

由用户亲自提供基线，AI 协助整理为 11 节结构（Current Role / Current Focus / Active Projects / Product Domains / Design Preferences / Technical Preferences / Research Interests / Current Constraints / Open Questions / Safety Notes / Last Updated）。`memory/GLOBAL_CONTEXT.md` 不再是全 placeholder，公司内部项目 / 真实业务数据均未写入，未明确字段标 `TBD by user` 或 `Not recorded for safety`。旧版备份在 `cleanup-backups/step-10f-global-context-baseline/`。

### Step 10G: Roadmap and Decision Log Alignment

Status: completed.

整体核对 `ROADMAP.md` 与 `memory/DECISION_LOG.md` 的状态一致性，补记 Phase 9A/9B/9C 与 Step 10A–10I 的关键决定。本次产出：

- `memory/DECISION_LOG.md` 追加 10 条 Accepted 决策（Phase 9A/9B/9C + Step 10A/10B/10C/10D/10E/10F/10I），保留 3 条早期决策不变。
- `ROADMAP.md` 把 Step 10D/10E/10F/10I 的 Status 从过时状态全部更新为 completed；Step 10G 改为 current；Step 10H 保持 planned；Current Status 段同步刷新。
- `README.md` Roadmap Snapshot 状态行同步：Step 10A–10F 与 10I completed，10G current，10H planned。

旧版备份在 `cleanup-backups/step-10g-roadmap-decision-log-alignment/`。

### Step 10H: First Pilot Project

Status: planned.

复制 `_PROJECT_TEMPLATE` 到 `projects/<slug>/`，用 `MAIN_THREAD_START.md` 启动 Main Thread，再拉一个子线程，跑一个最小真实项目（建议从 Product Domains 选一个最贴近近期工作的方向），验证多线程协议、项目模板、启动 Prompt 在真实使用中的可用性。

### Step 10I: Slim Root AGENTS.md and Move Detailed Rules to Docs

Status: completed.

把根 `AGENTS.md` 从"长篇规则合集"瘦身为"APB 启动索引 + 路由规则 + 安全底线"，降低 agent 启动时的上下文负担。规则不丢失，详细行为迁移到专门文档。

产出：

- `docs/APB_MODE.md`：新建。承接从根 `AGENTS.md` 外移的 APB Mode 详细行为、Skill Selection Rules、Skill Conflict Rules、External Tool Skill Rules、APB Mode Examples（按 4 工作区分组）。
- 根 `AGENTS.md`：瘦身为短版索引，保留 Role / Must Read / Core Routing / APB Mode / Multi-thread Mode / Project Output Rule / Safety Rules / Done Definition 八节，目标 ≤150 行。Multi-thread Routing 详细表格、Skill Selection / External Tool / Conflict 详细规则均迁移走，仅留摘要 + 链接。
- 根 `README.md`：Key Files 表新增 `docs/APB_MODE.md` 一行。

旧版备份在 `cleanup-backups/step-10i-slim-agents/`（含 `AGENTS.md.bak` / `README.md.bak` / `ROADMAP.md.bak`）。

### Step 10K: Blocker Reporting Protocol

Status: completed.

补齐 APB 多线程协作中的 blocker 上报机制。子线程遇到 permission denied / WebSearch / WebFetch unavailable / missing input / 越权风险 / 凭据风险等情况时，必须写入 `06-sync/group/`，让 Main Thread 能维护 `TASK_BOARD` / `SYNC_SUMMARY` 并向用户给出建议；不允许只在聊天窗口报告。

产出：

- `docs/APB_MULTI_THREAD_PROTOCOL.md`：新增 §13 Blocker Reporting Protocol，含 §13.1 When to Report a Blocker（9 类触发）、§13.2 What Child Threads Must Do、§13.3 Blocker Message Required Fields（10 字段表）、§13.4 What Main Thread Must Do、§13.5 Tool / Permission Blockers（针对 WebSearch / WebFetch / browser / Figma / Playwright / MCP 的 5 个降级选项）。
- `prompts/thread-start/PM_THREAD_START.md` / `DESIGN_THREAD_START.md` / `ENGINEERING_THREAD_START.md` / `RADAR_THREAD_START.md`：均新增 §8 If Blocked（5 步流程，强制写入 `06-sync/group/<thread>_blocked-<topic>.md`）。Engineering 额外含真实代码 / 生产配置类 blocker 的提醒；Radar 额外含 §8.1 Web Tool Blockers 专项规则（禁止用训练记忆代替被拒的 fresh source）。
- 4 个子线程启动 Prompt 共享同一 §8 模板结构（仅文件名 slug 段不同），Main Thread 启动 Prompt 不需补 §8——它本身就是 blocker 的接收方与收口者。

触发场景：源自 Radar Thread 在 `ai-weekly-radar-2026` 项目首跑中遇到 WebSearch / WebFetch 被拒后只在聊天窗口报告、未走 `06-sync/group/` 的真实案例。本 Step 把该案例固化为协议层硬规则。

旧版备份在 `cleanup-backups/step-10k-blocker-reporting/`（含 `APB_MULTI_THREAD_PROTOCOL.md.bak` / `PM_THREAD_START.md.bak` / `DESIGN_THREAD_START.md.bak` / `ENGINEERING_THREAD_START.md.bak` / `RADAR_THREAD_START.md.bak` / `ROADMAP.md.bak` / `worktree_settings.local.json.bak`）。

### Step 10L: Tool-Agnostic Refactor

Status: completed.

明确 APB 同时支持 Claude Code 与 Codex CLI，并在 Mac 与 Windows 之间无缝切换。本 Step 不改 APB 核心方法论，只补齐双工具对照与跨平台说明。

产出：

- `docs/TOOL_COMPATIBILITY.md`：新建。含 Tool Compatibility Matrix（Claude Code vs Codex 12 维度对照）、Cross-Platform Path Reference（Mac vs Windows）、How Each Tool Reads APB Files、Codex-Specific Setup（已观测到 Mac 的 `model = "gpt-5.5"` / `model_reasoning_effort = "xhigh"` / `approval_mode = "approve"` / `notify-approval.sh` 钩子；`sandbox_mode` 顶层未见，建议显式设 `workspace-write`）、Claude Code-Specific Setup（worktree 隔离 / settings.local.json 注意事项）、Cross-Platform Sync Strategies（dotfiles git repo / 云盘 / 手动 三方案）、Coexistence Strategy（双工具同时使用的场景分配）、Verification Checklist、TBD Open Questions、References。
- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md` 顶部追加 Codex Note：明确该文档原针对 Claude Code Skill 概念设计；Codex 下 Frontmatter Inventory 与具体 Skill 名（`writing-prds` 等）默认不可用；6 类重用等级概念仍适用但触发面切换。
- 根 `README.md` Key Files 表新增 `docs/TOOL_COMPATIBILITY.md` 一行。

不改任何 `~/.codex/` 内容；不改任何 workspace 方法论；不动 projects；不动 prompts/thread-start/。

旧版备份在 `cleanup-backups/step-10l-tool-agnostic-refactor/`。

### Step 10M: Tool-Agnostic Agent Runtime

Status: current.

明确 APB 多线程协议**不绑定任何特定 agent runtime**——Claude / Codex / Cowork / OpenClaw / 未来 Multica 都只是执行者。APB 的 source of truth 是项目文件协议（`AGENTS.md` + `docs/` + `prompts/thread-start/` + `projects/<slug>/06-sync/`），不是任何工具的聊天窗口。本 Step 是文档层协议补充，不创建任何工具专属配置、不创建 Claude slash commands、不配置 MCP、不创建真实项目。

产出：

- `docs/APB_MULTI_THREAD_PROTOCOL.md` 末尾追加 §14 Tool-Agnostic Agent Runtime，含 9 子段：
  - §14.1 Core Principle（threads are roles + source of truth = files）
  - §14.2 Shared APB File Protocol（11 项跨 runtime 必读 / 必写文件清单）
  - §14.3 Runtime Mapping（Claude / Codex / OpenClaw / Multica / Human user 5 行对照表）
  - §14.4 Claude-specific Features Are Optional（slash commands / subagents / hooks 是 convenience wrapper，不取代 APB 文件协议）
  - §14.5 Codex Runtime Rules（Codex 直接通过 `AGENTS.md` + `prompts/thread-start/` 工作；blocker 必须走 §13）
  - §14.6 Cross-runtime Communication（不依赖聊天历史；新 runtime 必须先读 SYNC_SUMMARY）
  - §14.7 Blocker and Completion Reporting Across Runtimes（统一 blocker / completion message 格式；冲突走 reviews / decisions）
  - §14.8 Multica Compatibility（refines §10：Multica 是视图层 / 调度层，不是 source of truth）
  - §14.9 What Not To Do（7 条跨 runtime 硬性约束 / 协议违规）
- `README.md` §8 Multi-thread Usage 末尾追加 `### Tool-Agnostic Runtime` 子段，说明 APB 不绑定 Claude；Key Files 表中 `docs/APB_MULTI_THREAD_PROTOCOL.md` 与 `prompts/thread-start/` 两行描述补充"Tool-Agnostic Agent Runtime / 跨 runtime 复用"。

不改 `AGENTS.md` / `docs/APB_MODE.md` / `projects/` / `workspaces/` / `prompts/thread-start/` / `memory/` / `skills-plan/` / `global-config-plan/` / `mcp-plan/` / `~/.codex/` / `~/.agents/skills/`；不创建 Claude slash commands / subagents / Codex profiles / OpenClaw agents / Multica 配置 / 真实项目目录；不配置 MCP。

旧版备份说明在 `cleanup-backups/step-10m-tool-agnostic-runtime/`（指向更早 step 备份目录的回滚指引）。
