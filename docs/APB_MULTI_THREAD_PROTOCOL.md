# APB Multi-thread Protocol

## 1. Purpose

本文档定义 APB（AI Product Builder）多线程协作协议，适用于多个 Codex / Claude / OpenClaw / Cowork / 未来 Multica agent 同时参与同一个 APB 项目的场景。

它的作用：

- 给每个线程一个明确角色与读写边界，避免互相覆盖。
- 给跨线程沟通一个标准格式（`05-reviews/` 与 `06-sync/`）。
- 给新加入的线程一个标准启动流程，缩短上下文恢复时间。

它**不替代** `projects/<project-slug>/PROJECT_RULES.md`：

- 项目级规则优先于全局协议。
- 当本文档与项目级 `PROJECT_RULES.md` 冲突时，以项目级为准。
- 当两者都没有覆盖时，按根 `AGENTS.md` 的安全规则执行。

## 2. Core Principles

- 一个线程只负责一个明确角色（Main / PM / Design / Engineering / Radar）。
- 一个线程只写入自己的授权目录。
- 跨线程协作通过 `05-reviews/`（评审）与 `06-sync/`（消息、任务板、共享摘要）完成。
- **不直接修改其他线程的产物文件**；要修复需通过 review 或 Main Thread 的 request。
- 每个线程开始任务前必须在回答开头声明：
  - **Will read**
  - **Will write**
  - **Will not modify**
- `06-sync/SYNC_SUMMARY.md` 是新线程启动时**优先读取**的共享状态摘要。
- `06-sync/group/` 与 `06-sync/dm/` **不是保密区**，所有线程都可读。
- 不存放真实玩家数据、公司机密、未脱敏日志、token、API key、secret。

## 3. Thread Roles

### Main Thread

**职责**：

- 任务总控
- 判断工作区归属并分配任务到对应线程
- 拆分子任务
- 维护 `06-sync/THREAD_REGISTRY.md`
- 维护 `06-sync/TASK_BOARD.md`
- 维护 `06-sync/SYNC_SUMMARY.md`
- 汇总 review
- 维护项目级 `decisions/DECISION_LOG.md`

**默认可写**：

- `projects/<project-slug>/06-sync/`
- `projects/<project-slug>/05-reviews/`
- `projects/<project-slug>/decisions/`
- 必要时更新 `projects/<project-slug>/README.md`

**默认不可写**：

- `01-pm/`
- `02-design/`
- `03-engineering/`
- `04-research/`

### PM Strategy Thread

**职责**：

- 需求澄清
- PRD / SRS / MRD
- AI 功能评估
- 竞品分析
- 优先级排序（RICE / P0–P2）
- 研发任务拆解

**默认可写**：

- `projects/<project-slug>/01-pm/`
- 当任务明确是竞品 / 市场 / 趋势研究时，可写 `projects/<project-slug>/04-research/`

**默认不可写**：

- `02-design/`
- `03-engineering/`
- `06-sync/` 中由 Main 维护的文件（`THREAD_REGISTRY.md` / `TASK_BOARD.md` / `SYNC_SUMMARY.md`），但可向 `06-sync/group/` 或 `06-sync/dm/pm-to-*/` 写消息

### Design Prototype Thread

**职责**：

- UI/UX 评审
- Figma Prompt
- 高保真原型方案
- 设计系统
- 设计交付（handoff）

**默认可写**：

- `projects/<project-slug>/02-design/`
- `06-sync/group/`、`06-sync/dm/design-to-*/`
- `05-reviews/DESIGN_REVIEW_*.md`

**默认不可写**：

- `01-pm/`
- `03-engineering/`
- `04-research/`

### Engineering Build Thread

**职责**：

- MVP Build Plan
- API Implementation Plan
- Data Model
- AI Integration（含 fallback / 评估 / 成本 / 延迟 / 可观测）
- Test Cases
- Code Review
- Launch Checklist（含 Go / No-go 与回滚）

**默认可写**：

- `projects/<project-slug>/03-engineering/`
- `06-sync/group/`、`06-sync/dm/engineering-to-*/`
- `05-reviews/ENGINEERING_REVIEW_*.md`

**默认不可写**：

- `01-pm/`
- `02-design/`
- 真实业务代码仓库，除非用户另行明确授权

### AI Trend Radar Thread

**职责**：

- AI 趋势（日报 / 周报 / 专题）
- YouTube / GitHub / 论文 / 技术博客信息挖掘
- 竞品与技术雷达
- Demo idea
- 产品机会提炼

**默认可写**：

- `projects/<project-slug>/04-research/`
- `06-sync/group/`、`06-sync/dm/radar-to-*/`
- `05-reviews/RESEARCH_REVIEW_*.md`

**默认不可写**：

- `01-pm/`
- `02-design/`
- `03-engineering/`

## 4. File Ownership Matrix

| Thread | Can Write | Can Read | Should Not Modify |
|---|---|---|---|
| Main Thread | `06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md`、`06-sync/group/`、`06-sync/dm/main-to-*/`、`05-reviews/`、`decisions/`、`<slug>/README.md` | 全部 | `01-pm/` / `02-design/` / `03-engineering/` / `04-research/` 内的他人产物 |
| PM Strategy Thread | `01-pm/`、必要时 `04-research/`、`05-reviews/PM_REVIEW_*.md`、`06-sync/group/`、`06-sync/dm/pm-to-*/` | `00-context/`、`04-research/`、`02-design/`、`05-reviews/`、`06-sync/` | `02-design/`、`03-engineering/`、`06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md` |
| Design Prototype Thread | `02-design/`、`05-reviews/DESIGN_REVIEW_*.md`、`06-sync/group/`、`06-sync/dm/design-to-*/` | `00-context/`、`01-pm/`、`05-reviews/`、`06-sync/` | `01-pm/`、`03-engineering/`、`04-research/`、`06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md` |
| Engineering Build Thread | `03-engineering/`、`05-reviews/ENGINEERING_REVIEW_*.md`、`06-sync/group/`、`06-sync/dm/engineering-to-*/` | `00-context/`、`01-pm/`、`02-design/`、`05-reviews/`、`06-sync/` | `01-pm/`、`02-design/`、`04-research/`、真实业务代码仓库（除非授权）、`06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md` |
| AI Trend Radar Thread | `04-research/`、`05-reviews/RESEARCH_REVIEW_*.md`、`06-sync/group/`、`06-sync/dm/radar-to-*/` | `00-context/`、`05-reviews/`、`06-sync/` | `01-pm/`（除非 PM 明确委托）、`02-design/`、`03-engineering/`、`06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md` |

## 5. Communication Layer

`06-sync/` 是项目级多线程沟通区。结构：

| 工件 | 谁写 | 谁读 | 用途 |
|---|---|---|---|
| `THREAD_REGISTRY.md` | Main Thread | 全部 | 线程角色、读写区、状态、最后更新时间 |
| `TASK_BOARD.md` | Main Thread（其他线程通过 `group/dm` 报告进度或阻塞） | 全部 | 项目级任务分配与阻塞 |
| `SYNC_SUMMARY.md` | Main Thread | 全部，**新线程优先读** | 项目状态摘要：当前阶段、最新决策、Open Questions、Active Tasks、Blockers、Next Actions、Important Messages |
| `group/<file>.md` | 任意线程 | 全部 | 公开消息，**一条消息一个 Markdown 文件** |
| `dm/<from>-to-<to>/<file>.md` | 仅 from 线程 | 全部（**不是保密**） | 定向消息 |

**消息文件命名**：

- group：
  ```
  YYYY-MM-DDTHH-MM-SS_<thread>_<topic-slug>.md
  ```
  例如：`2026-04-30T10-15-00_pm_prd-clarify-question.md`

- dm：
  ```
  YYYY-MM-DDTHH-MM-SS_<from-thread>_to_<to-thread>_<topic-slug>.md
  ```
  例如：`2026-04-30T11-22-30_pm_to_design_handoff-uiux-questions.md`

`<thread>` 取值：`main` / `pm` / `design` / `engineering` / `radar`。`<topic-slug>` 使用英文小写短横线。

## 6. Standard Thread Startup Sequence

每个线程启动时，必须按以下顺序执行：

1. 读取根 `AGENTS.md`。
2. 读取 `docs/APB_MULTI_THREAD_PROTOCOL.md`（本文件）。
3. 读取 `projects/<project-slug>/PROJECT_RULES.md`。
4. 读取 `projects/<project-slug>/00-context/PROJECT_CONTEXT.md`。
5. 读取 `projects/<project-slug>/06-sync/SYNC_SUMMARY.md`。
6. 根据本线程角色读取对应 workspace 的 `AGENTS.md`：
   - PM Strategy Thread → `workspaces/pm-strategy/AGENTS.md`
   - Design Prototype Thread → `workspaces/design-prototype/AGENTS.md`
   - Engineering Build Thread → `workspaces/engineering-build/AGENTS.md`
   - AI Trend Radar Thread → `workspaces/ai-trend-radar/AGENTS.md`
   - Main Thread 不绑定单一 workspace，但可按需读取
7. 在回答开头输出：
   - **Will read**：本次任务会读哪些文件 / 目录
   - **Will write**：本次任务计划写哪些文件 / 目录
   - **Will not modify**：明确不会改动的范围（例如 `workspaces/`、`~/.codex/`、其他线程产物）
8. 再开始任务执行。

## 7. Standard Thread Completion Sequence

每个线程完成任务时必须：

1. 写入自己的授权产物目录（按角色边界）。
2. 如发现跨线程问题，写入 `05-reviews/` 或 `06-sync/group/` / `06-sync/dm/`，**不直接修改其他线程文件**。
3. 输出本次任务的 done 摘要，包含：
   - **Files created / updated**：精确路径列表
   - **Questions for other threads**：跨线程待回答问题
   - **Suggested next thread**：建议下一个执行的线程角色
   - **Whether Main Thread needs to update SYNC_SUMMARY.md**：是 / 否，以及关键变更点

## 8. Conflict Avoidance Rules

- **不要两个线程同时写同一个文件**。如必须协作，先 Main Thread 在 `TASK_BOARD.md` 分派单一 owner。
- **不要直接修改其他线程产物**。要修复请走 `05-reviews/` 或 `06-sync/group/` 通知所有者线程。
- **不要把 review 写进对方原文件**；评审一律放进 `05-reviews/<role>_REVIEW_<feature-slug>.md`。
- **不要把 group/dm 多条消息塞进同一个文件**。每条消息一个 Markdown 文件，避免并发覆盖。
- **不要把 `SYNC_SUMMARY.md` 当作聊天日志**。它是 Main 维护的精炼共享摘要；超长时归档到 `06-sync/group/<date>_sync-summary-snapshot.md`。
- **不要把 `06-sync/dm/` 当作私密 / 安全存储**。任何线程都能读 dm/。敏感信息一律不进仓库。
- **如果需要修改他人产物，向 Main Thread 提交 request**（写一条 `06-sync/group/` 或 `06-sync/dm/<from>-to-main/` 消息），由 Main 决定是否分派给所有者线程修复。

## 9. Recommended Project Flow

不是每个项目都要跑完整流程，可以按任务裁剪：

1. **Main Thread 初始化**：填 `00-context/PROJECT_CONTEXT.md`（或 ack 已填）、登记 `06-sync/THREAD_REGISTRY.md`、建立初始 `06-sync/TASK_BOARD.md` 与 `06-sync/SYNC_SUMMARY.md`。
2. **Radar Thread（可选）**：进行趋势 / 竞品 / 技术研究，输出到 `04-research/`。
3. **PM Thread**：输出需求澄清、PRD、AI 功能评估、优先级，到 `01-pm/`。
4. **Design Thread**：基于 PRD 输出原型 / Figma Prompt / Design Handoff，到 `02-design/`。
5. **Engineering Thread**：基于 PRD + Handoff 输出 MVP / API / Test / Launch Plan，到 `03-engineering/`。
6. **Main Thread 收口**：汇总 `05-reviews/`、更新 `decisions/DECISION_LOG.md` 与 `06-sync/SYNC_SUMMARY.md`。

裁剪示例：

- 单点 PRD 任务：Main → PM。
- 趋势研究 → 产品机会：Main → Radar → PM。
- 已有 PRD 的工程评估：Main → Engineering。

## 10. Multica Compatibility

- APB **默认以本地文件协议为底座**：所有持久知识在 `projects/<slug>/` 下的 Markdown 文件中。
- Multica 未来可以作为可选 agent 调度层，但不是必需。
- 推荐的映射关系：

| Multica 概念 | APB 概念 |
|---|---|
| Multica board / issues | `projects/<slug>/06-sync/TASK_BOARD.md` |
| Multica comments / activity | `projects/<slug>/06-sync/group/<file>.md` |
| Multica agent profiles | `projects/<slug>/06-sync/THREAD_REGISTRY.md` |
| Multica decisions / approvals | `projects/<slug>/decisions/DECISION_LOG.md` |
| Multica project metadata | `projects/<slug>/00-context/PROJECT_CONTEXT.md` |

- 即使未来使用 Multica，APB 项目文件仍是最终长期知识库。
- **不要让 APB 依赖 Multica 才能运行**；APB 必须可在没有 Multica 的纯本地环境中工作。

## 11. Safety Boundaries

- 不存真实玩家数据。
- 不存公司机密。
- 不存未脱敏日志。
- 不存 token / API key / secret，仅使用 `${ENV_VAR}` 占位。
- 不修改 `~/.codex/`。
- 不修改 `~/.agents/skills/`。
- 不配置 MCP（不运行 `codex mcp add` 或等价命令）。
- 不修改真实业务代码，除非用户明确授权。
- 不进入 `cleanup-backups/` 作为当前工作依据；除非用户明确要求审计或回滚备份。
- 涉及生产 / 鉴权 / 隐私 / 远程系统时，先在 `decisions/DECISION_LOG.md` 留痕并说明影响范围。

## 12. Done Definition

多线程任务完成必须满足：

- 产物写入了**正确的**授权目录（按 Section 4 File Ownership Matrix）。
- read/write boundary 未被破坏（无越权写入）。
- 跨线程问题已记录在 `05-reviews/` 或 `06-sync/`。
- Main Thread 知道是否需要更新 `06-sync/SYNC_SUMMARY.md`，以及具体更新点。
- 没有写入敏感信息（token / 凭据 / 真实玩家数据 / 公司机密 / 未脱敏日志）。
- 没有越权修改其他目录（`workspaces/`、`memory/`、`~/.codex/`、`~/.agents/skills/` 等）。
- 任务结束输出 done 摘要，包含 Files / Questions / Suggested next thread / SYNC_SUMMARY 更新需求。

## 13. Blocker Reporting Protocol

When a child thread (PM / Design / Engineering / Radar) cannot proceed safely, it must report through the shared communication layer rather than only telling the user. This ensures Main Thread can maintain `06-sync/TASK_BOARD.md` and `06-sync/SYNC_SUMMARY.md`, recommend the right next step, and surface recurring workflow gaps.

### 13.1 When to Report a Blocker

Child threads must stop and report whenever any of the following occurs:

- **permission denied** — write or execute permission rejected by the runtime.
- **WebSearch / WebFetch unavailable** — required for "latest info must be verified" tasks but blocked by environment.
- **missing required input** — depends on a file / decision / artifact that does not yet exist.
- **unclear task ownership** — task description does not map cleanly to a single thread role.
- **no assigned task found** — `TASK_BOARD.md` has no entry for this thread, but the user prompt implies one should exist.
- **external tool unavailable** — Figma / Playwright / browser / MCP / a specific Skill cannot run.
- **cannot verify latest information** — model cutoff exceeded and no fresh source accessible.
- **write boundary conflict** — task as described would require writing into another thread's directory.
- **safety / privacy / credential risk** — task implies handling tokens, real player data, internal company secrets, or production resources.

### 13.2 What Child Threads Must Do

- **Stop** the risky or blocked action immediately.
- **Do not fabricate** results based on training memory when fresh verification is required.
- **Do not continue** with stale model memory if the task explicitly demands current information.
- **Do not modify** `06-sync/TASK_BOARD.md`, `06-sync/SYNC_SUMMARY.md`, or `06-sync/THREAD_REGISTRY.md` — these are Main Thread's authority.
- **Do write** a blocker message to:
  ```
  projects/<project-slug>/06-sync/group/YYYY-MM-DDTHH-MM-SS_<thread>_blocked-<topic>.md
  ```
  where `<thread>` ∈ {`pm`, `design`, `engineering`, `radar`} and `<topic>` is an English lowercase short slug.
- After the file is written, then briefly report to the user with the blocker file path.

### 13.3 Blocker Message Required Fields

Every blocker message must contain the following fields, in order:

| Field | Description |
|---|---|
| Thread | Which thread is reporting (`pm` / `design` / `engineering` / `radar`) |
| Task ID | `TASK_BOARD.md` ID (e.g. `T-001`), or `n/a` if no task was registered |
| Status | Always `Blocked` |
| Blocker Type | One of the categories in §13.1, or `Other: <one-line description>` |
| What Happened | Concrete events: tools attempted, files attempted, error messages, exact denied capability |
| Why It Stopped | Why continuing would violate the protocol or produce unreliable output |
| Files Created / Not Created | Honest list of files actually written; explicit `not created` for planned but unwritten files |
| Options for Main Thread | 2–4 viable next steps (unlock permission / manual feed / downgrade scope / defer / reassign) |
| Recommended Next Action | The child thread's recommendation, with one-line rationale |
| Whether User Input Is Needed | `yes` / `no`, and what specifically is needed |

### 13.4 What Main Thread Must Do

When a blocker message appears in `06-sync/group/`:

- **Read** the full message before any other action.
- **Update** `06-sync/TASK_BOARD.md`: change the relevant task's status to `Blocked` and link the blocker message file path in the `Blockers` column.
- **Update** `06-sync/SYNC_SUMMARY.md`: add an entry under the `Blockers` section with severity (P0 / P1 / P2) and link to the blocker message file path.
- **Decide** which path to recommend to the user:
  - ask the user for input or decision
  - propose a prompt / protocol update
  - request permission unlock (e.g. `.claude/settings.json` allowlist)
  - reassign the task to a different thread or scope
  - mark task `Blocked` and schedule follow-up
- **If a recurring pattern emerges** across multiple blocker messages (same blocker type ≥3 times), propose a small protocol or thread-prompt update via `decisions/DECISION_LOG.md`; if the user approves, edit `prompts/thread-start/*` or this protocol document.
- **Never silently ignore** child thread blocker messages — silent ignore is a Main Thread protocol violation.

### 13.5 Tool / Permission Blockers

For specific WebSearch / WebFetch / browser / Figma / Playwright / MCP permission failures, additional rules apply:

- The child thread **must report the exact denied tool or capability** (tool name, attempted target URL or scope, error message if any).
- The child thread **must not substitute** unverifiable information from training memory in place of denied fresh sources. This is especially binding for Radar Thread: if WebSearch / WebFetch is denied and the task requires post-cutoff facts, **do not write** a weekly / trend / paper / demo report based on memory.
- Main Thread **should recommend exactly one** of the following to the user:
  - **Unlock permission and retry** — propose specific allowlist entries (e.g. domains for WebFetch, tool names for `permissions.allow`).
  - **Ask user to provide URLs or source excerpts** — user pastes verified content, child thread re-runs structured extraction.
  - **Downgrade task scope** — keep methodology / template output, defer factual content (must be flagged as partial).
  - **Mark task Blocked** — record in `TASK_BOARD.md` with retry condition.
  - **Schedule follow-up** when tools become available.

The choice should reflect task urgency and user availability. **Do not default to "downgrade" silently** — that risks producing fabricated or unverifiable output disguised as a real deliverable.

## 14. Tool-Agnostic Agent Runtime

APB 的多线程协作协议**不绑定任何特定 agent runtime**。Claude / Codex / Cowork / OpenClaw / 未来 Multica 都只是执行 APB 的不同 runtime，必须遵守同一套 APB 文件协议。本节定义跨 runtime 的硬性约束。

### 14.1 Core Principle

- **APB threads are roles, not tied to a specific tool.** Main / PM Strategy / Design Prototype / Engineering Build / AI Trend Radar Thread 的角色定义独立于具体 agent runtime。
- **任何一个 thread 都可以由 Claude / Codex / Cowork / OpenClaw / 未来 Multica agent 执行。**
- **APB 的 source of truth 不是某个聊天窗口，而是项目文件系统**——具体来说是 `projects/<project-slug>/` 下的 markdown 文件，以及根级方法论文件。
- **所有 agent 必须通过 `06-sync/` 进行跨线程沟通**，不允许只把关键状态留在某个工具的聊天窗口里。
- **聊天历史不是项目状态**——会话窗口是临时上下文，不是持久知识库。

### 14.2 Shared APB File Protocol

所有 agent runtime 都必须遵守同一套文件协议。跨 runtime 协作的"共同语言"由以下文件组成：

| 层 | 文件 | 作用 |
|---|---|---|
| Root routing | `AGENTS.md` | 启动索引 + 路由规则 + 安全底线 |
| Root routing | `docs/APB_MODE.md` | APB Mode 详细行为、Skills 复用规则 |
| Multi-thread protocol | `docs/APB_MULTI_THREAD_PROTOCOL.md`（本文件） | 多线程详细协议 |
| Thread startup | `prompts/thread-start/*.md` | 5 类线程的可复制启动 Prompt |
| Project-level rules | `projects/<project-slug>/PROJECT_RULES.md` | 项目级读写边界 + 命名规则 |
| Project-level context | `projects/<project-slug>/00-context/PROJECT_CONTEXT.md` | 项目身份、目标、约束、Open Questions |
| Project sync layer | `projects/<project-slug>/06-sync/THREAD_REGISTRY.md` | 线程登记 |
| Project sync layer | `projects/<project-slug>/06-sync/TASK_BOARD.md` | 任务分配与阻塞 |
| Project sync layer | `projects/<project-slug>/06-sync/SYNC_SUMMARY.md` | 共享状态摘要（新线程优先读） |
| Project sync layer | `projects/<project-slug>/06-sync/group/` | 公开消息（按文件落盘） |
| Project sync layer | `projects/<project-slug>/06-sync/dm/` | 定向消息（不是私密） |

任何 runtime 启动一个 thread 之前必须能读取以上文件。任何 runtime 写出的产物必须落到这些文件所定义的路径下，不能只存在 runtime 私有 memory 或聊天会话中。

### 14.3 Runtime Mapping

| Runtime | Role in APB | Entry Point | Notes |
|---|---|---|---|
| Claude / Cowork | Executes APB threads through project instructions and optional slash commands | `CLAUDE.md`（如有）、`prompts/thread-start/`、project files | Claude-specific commands are optional convenience wrappers |
| Codex | Executes APB threads through `AGENTS.md` and project context | `AGENTS.md`、`docs/`、`prompts/thread-start/` | Codex should not require Claude-specific commands |
| OpenClaw | Executes APB roles as configurable agents | APB project files + OpenClaw agent config | OpenClaw should still write project state to `06-sync/` |
| Multica | Optional orchestration / task-board layer | Multica issues / board mapped to APB files | Multica is not required for APB to run; APB must work without it |
| Human user | Gives goals, approves risky changes, reviews outputs | Chat + project files | User decisions should be reflected in `decisions/DECISION_LOG.md` when architectural |

### 14.4 Claude-specific Features Are Optional

- `.claude/commands/`、Claude slash commands、Claude subagents、Claude hooks 都是**可选便利能力**。
- 它们**不能取代** APB 文件协议。
- 如果 Claude slash commands 存在，它们应该只是调用 `prompts/thread-start/` 与 APB 文件规则的快捷入口。
- **不要让 APB 依赖 Claude-only 能力才能运行。**
- 如果某个 APB 行为只在 Claude 下可用，必须在 `docs/TOOL_COMPATIBILITY.md` 中明确标注，并提供 Codex / OpenClaw 等价路径或注明"无等价（Claude only）"。

### 14.5 Codex Runtime Rules

- Codex 应优先读取根 `AGENTS.md`（与 `~/.codex/AGENTS.md` 合并）。
- Codex 执行线程任务时，应读取对应 `prompts/thread-start/<ROLE>_THREAD_START.md`。
- Codex 遇到 blocker 时，**必须按 §13 Blocker Reporting Protocol 写入 `06-sync/group/<thread>_blocked-<topic>.md`**——与 Claude 行为完全一致。
- Codex **不应该只在聊天窗口报告 blocker**。
- Codex **不需要 `.claude/commands/`** 才能使用 APB——所有路由能力都来自 `AGENTS.md` + `prompts/thread-start/`。
- Codex / Claude / Cowork / OpenClaw 的产物**都必须落到 `projects/<project-slug>/` 的授权目录中**（按 §4 File Ownership Matrix），不能落到 runtime 私有缓存。

### 14.6 Cross-runtime Communication

- **不同 runtime 之间不要依赖聊天历史互相同步。** Claude 的聊天记录、Codex 的聊天记录、Cowork 的聊天记录都不是项目状态的 source of truth。
- 项目状态必须通过以下文件同步：
  - `06-sync/TASK_BOARD.md`：任务分配与状态
  - `06-sync/SYNC_SUMMARY.md`：共享状态摘要
  - `06-sync/THREAD_REGISTRY.md`：线程登记
  - `06-sync/group/`：公开消息
  - `06-sync/dm/`：定向消息（不私密）
  - `05-reviews/`：跨线程评审
  - `decisions/DECISION_LOG.md`：项目级决策
- **新 runtime 加入项目时**，必须先读 `06-sync/SYNC_SUMMARY.md` 与 `06-sync/THREAD_REGISTRY.md`，恢复项目当前状态认知，再开始任何写操作。

### 14.7 Blocker and Completion Reporting Across Runtimes

- 所有 runtime 遇到 blocker，**必须使用统一的 blocker message 格式**（见 §13.3）。
- 所有 runtime 完成任务，**应该向 `06-sync/group/` 或授权 `dm/` 写一条 completed / needs-review / blocked 消息**——内容包含：
  - 哪个线程
  - 哪个 task（引用 `TASK_BOARD.md` ID）
  - 产物路径
  - 跨线程问题（如有）
  - 是否需要 Main 更新 `SYNC_SUMMARY.md`
- **Main Thread 负责 reconcile 来自不同 runtime 的消息。**
- 如果不同 runtime 对同一文件 / 决策产生冲突，Main Thread **不应直接覆盖**，而应：
  1. 在 `05-reviews/` 创建 cross-runtime conflict review；或
  2. 在 `decisions/DECISION_LOG.md` 写一条 Proposed 决策；或
  3. 在 `06-sync/group/` 发消息 ask user for decision。

### 14.8 Multica Compatibility (refines §10)

承接 §10 Multica Compatibility，并明确 Multica 在 tool-agnostic 框架中的位置：

- APB **默认以本地文件协议为底座**——所有持久知识在 `projects/<slug>/` 下的 Markdown 文件中。
- **Multica 可以作为未来可选调度层**——不是必需。
- 推荐映射：
  - Multica board / issues ↔ `projects/<slug>/06-sync/TASK_BOARD.md`
  - Multica comments / activity ↔ `projects/<slug>/06-sync/group/<file>.md`
  - Multica agent profiles ↔ `projects/<slug>/06-sync/THREAD_REGISTRY.md`
  - Multica decisions / approvals ↔ `projects/<slug>/decisions/DECISION_LOG.md`
- 即使使用 Multica，**APB 项目文件仍是长期知识库**——Multica 是视图层 / 调度层，不是 source of truth。
- **不要让 APB 依赖 Multica 才能运行**——APB 必须可在纯本地（Claude Code / Codex CLI 单工具）环境中工作。

### 14.9 What Not To Do

跨 runtime 硬性约束（均为协议违规）：

- ❌ **不要把 APB 设计成 Claude-only**——任何新规则都必须能在 Codex 与 OpenClaw 下被执行。
- ❌ **不要把 `.claude/commands/` 当成唯一入口**——APB 的入口是 `AGENTS.md` + `prompts/thread-start/`。
- ❌ **不要让 Codex 必须依赖 Claude commands**——Codex 应直接通过 APB 文件协议工作。
- ❌ **不要让某个 agent 只在聊天窗口报告关键状态**——blocker / completion / decision 必须落到 `06-sync/` 或 `decisions/`。
- ❌ **不要让多个 runtime 同时写同一个文件**——必须 Main Thread 在 `TASK_BOARD.md` 分派 owner。
- ❌ **不要用工具私有 memory 替代 `06-sync/`**——runtime 私有缓存不是持久知识库。
- ❌ **不要把 sensitive data 写进 `06-sync/`**——任何 runtime 都能读，不是保密区。
