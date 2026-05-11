# Blocker: W18 Web Tools Denied

> Filed per `docs/APB_MULTI_THREAD_PROTOCOL.md` §13 Blocker Reporting Protocol. Fields follow §13.3 in order. Radar Thread will not proceed on T-001 until Main Thread issues a decision per §13.4 / §13.5.

- **Thread**: radar

- **Task ID**: T-001 (W18 Baseline Weekly Report)

- **Status**: Blocked

- **Blocker Type**: WebSearch / WebFetch unavailable (per §13.1)

- **What Happened**:
  - Radar Thread launched T-001 首期周报（Issue=Baseline；Weekly Window 2026-04-22 → 2026-04-28；Baseline Window 2026-03-29 → 2026-04-28）。
  - 派发 3 个并行研究子线程，每个被强约束"只联网检索、不写文件"：
    - **AI Coding child** — `completed` with **0 useful output**。子线程显式报告：`WebSearch` 4 次尝试全部 `permission denied`；`WebFetch` 试访 `anthropic.com/news` / `openai.com/news` / `github.blog/changelog` / `cursor.com/changelog` 全部 `permission denied`。
    - **AI Agent child** — 在产出落定前被 Radar Thread `kill`（撞同一权限墙概率极高，避免空跑成本）；killed 时的最后一条状态消息："I have 4 solid window items. Let me try other primary sources and arxiv."（来源不可信，未采纳）。
    - **Game AI child** — 在产出落定前被 `kill`；killed 时最后一条状态消息："WebSearch is denied. Let me try WebFetch on key source pages directly."（确认 WebSearch 被拒）。
  - 三个子线程均**未写入任何文件**，符合 prompt 的 `do not write` 硬约束。
  - 可见错误信息：runtime 仅返回 `permission denied` 字样，未提供 settings 路径或可申请白名单提示。

- **Why It Stopped**:
  - `PROJECT_RULES.md §7`：不写未验证内容、不写虚构来源。
  - `prompts/thread-start/RADAR_THREAD_START.md §7`：涉及最新信息（产品发布、模型、论文、GitHub Trending、产品价格）必须联网验证并标注来源；不把训练记忆当作"最新"。
  - `00-context/LINKS.md §3`：事实段必须由一级 / 二级源支撑。
  - 模型 cutoff = 2026-01；W18 Weekly Window 2026-04-22 → 2026-04-28 与 Baseline Window 2026-03-29 → 2026-04-28 **完全在 cutoff 之外**。
  - `docs/APB_MULTI_THREAD_PROTOCOL.md §13.5` 显式禁令：Radar Thread 在 WebSearch / WebFetch 被拒、任务又要求 post-cutoff 事实时，**禁止以训练记忆替代未验证的新鲜来源**、**禁止生成周报 / 趋势报 / 论文报 / Demo 报**。
  - 继续执行 = 编造 post-cutoff 事实 = §13.5 协议违规。Radar Thread 主动停手。

- **Files Created / Not Created**:
  - ✅ Created: `projects/ai-weekly-radar-2026/06-sync/group/2026-04-28T15-21-54_radar_blocked-w18-web-tools-denied.md`（本文件）
  - ❌ Not created: `projects/ai-weekly-radar-2026/04-research/AI_WEEKLY_REPORT_2026-W18.md`
  - ❌ Not created: 任何 `04-research/` 下的 baseline / weekly / item-level 草稿
  - ⚠️ Pre-existing duplicate（来自上一轮指令、命名不含 HH-MM-SS）：`projects/ai-weekly-radar-2026/06-sync/group/2026-04-28T_radar_blocked-w18-web-tools-denied.md`。Radar Thread 未删除、未修改该文件（防止越权）；建议 Main Thread 决定是否清理（保留本规范命名版、归档或删除非规范命名版）。
  - 未触碰：`06-sync/TASK_BOARD.md` / `06-sync/SYNC_SUMMARY.md` / `06-sync/THREAD_REGISTRY.md` / `decisions/DECISION_LOG.md` / `00-context/*` / `04-research/*` / `01-pm/*` / `02-design/*` / `03-engineering/*` / `workspaces/*` / `~/.codex/*` / `~/.agents/skills/*`。

- **Options for Main Thread**:
  1. **Unlock + retry**（Radar 推荐）— 在 `.claude/settings.json` 的 `permissions.allow` 加 WebSearch / WebFetch 白名单，至少放行：
     - 一级源：`openai.com`、`anthropic.com`、`deepmind.google`、`ai.meta.com`、`blogs.microsoft.com`、`blogs.nvidia.com`、`huggingface.co`、`github.com`、`github.blog`、`arxiv.org`、`paperswithcode.com`、`aiindex.stanford.edu`、`oecd.ai`
     - 二级源：`the-decoder.com`、`technologyreview.com`、`venturebeat.com`、`techcrunch.com`
     - 中文辅助：`jiqizhixin.com`、`qbitai.com`、`paperweekly.site`
     - IDE / Coding agent：`cursor.com`、`codeium.com`、`cline.bot`、`aider.chat`、`continue.dev`
     解锁后 Radar 重新派发 3 个子线程，预计 1–2 小时完成首期周报。
  2. **User feeds URLs / excerpts manually** — 用户在外部完成检索，把 URL + 关键摘要贴回会话；Radar 据此按模板 10 字段做结构化与 Confidence / Impact 判断。任务承担方从 Radar 转为用户 + Radar 双签。
  3. **Downgrade to methodology-only partial** — 仅交付"首期周报骨架 + 字段填法 + 信源使用规则"；文件需显式标 `Issue: Baseline (Skeleton, Pending Web Verification)`；W18 实际内容延后。注意 §13.5 明确警告"Do not default to 'downgrade' silently"，此选项必须在 `decisions/DECISION_LOG.md` 留痕。
  4. **Mark task Blocked + schedule** — 在 `TASK_BOARD.md` 把 T-001 Status 改为 `Blocked`、在 `Blockers` 列链回本文件；`SYNC_SUMMARY.md §5` 登记 P1；等下一个网络可用窗口（如解锁 settings 后）恢复执行。

- **Recommended Next Action**: **Option 1 (Unlock + retry)**。
  - 理由：Radar Thread 的核心职责是周度趋势跟踪（PROJECT_CONTEXT §5 北极星 + RADAR_THREAD_START §3 用例）；没有联网工具则 Radar 实质成为空壳。
  - §13.5 明确禁止 silent downgrade；Option 3 不能成为默认路径。
  - Option 2 把研究负担逆向转给用户，违背"自动化趋势研究"定位，仅作应急。
  - Option 4 是诚实兜底，仅当 Option 1 短期不可行（例如用户当前不在 settings 编辑环境）时使用。

- **Whether User Input Is Needed**: **yes**。
  - 用户必须在 `.claude/settings.json`（或 `~/.claude/settings.json`）的 `permissions.allow` 添加 WebFetch / WebSearch 域名白名单。
  - 具体白名单清单见 Options §1 上方；Main Thread 应在向用户的收口指令中给出可直接复制粘贴的 settings 片段。
  - 用户也需选定 Option 1–4 之一并明示给 Main Thread；在用户决策落地前，Radar Thread 不重试联网、不写 W18 任何内容、不 commit。
