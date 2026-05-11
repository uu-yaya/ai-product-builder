# Decision Log

| Date | Area | Decision | Reason | Impact | Status |
| --- | --- | --- | --- | --- | --- |
| 2026-04-25 | Workspace Architecture | 使用多工作区而不是单工作区 | 产品、设计、工程、趋势研究的工作方式不同，需要清晰边界 | 降低上下文混乱，方便后续逐步扩展 | Active |
| 2026-04-25 | Workflow Management | 使用目录区分能力，Git 分支区分具体开发任务 | 能力体系需要长期稳定，具体任务需要独立演进 | 保持全局规则稳定，同时支持项目级迭代 | Active |
| 2026-04-25 | Architecture | Use a three-layer architecture: Global Codex Runtime Config + Reusable Skills + Project Workspace | Avoid bloated AGENTS.md, keep runtime settings separate from reusable workflows and project context | Improves maintainability, context efficiency, and long-term extensibility | Proposed |
| 2026-04-28 | Skills | Phase 9A — Reuse existing Skills before creating custom APB Skills | Avoid duplicating already installed Skills and reduce maintenance burden | APB treats existing Skills as capability providers, while APB templates remain final output authority | Accepted |
| 2026-04-28 | Skills | Phase 9B — Treat Lenny skills as high-value PM methodology resources, not low-quality duplicates | Local audit showed path duplication, not quality issues | APB keeps Lenny skills available and avoids deleting, moving, or disabling them | Accepted |
| 2026-04-28 | Skills | Phase 9C — Create APB-local Lenny index and workspace mapping | Help APB reuse Lenny methods without modifying user-level skills | Improves skill routing and reduces ambiguity | Accepted |
| 2026-04-28 | Documentation | Step 10A — Make `APB 模式：...` the primary user entrypoint via root README rewrite | Old "enter workspace" commands were manual and inconsistent with APB routing | README now behaves like an operating manual instead of a legacy workspace guide | Accepted |
| 2026-04-28 | Project Template | Step 10B — Create `projects/_PROJECT_TEMPLATE/` with `06-sync/` communication layer | Real project outputs need a stable structure and multi-thread communication space | APB can now separate methodology from actual project artifacts | Accepted |
| 2026-04-28 | Multi-thread | Step 10C — Create `docs/APB_MULTI_THREAD_PROTOCOL.md` and route multi-thread behavior through it | Multiple Codex / Claude / Cowork threads need consistent read/write boundaries | APB now has global multi-thread collaboration rules | Accepted |
| 2026-04-28 | Multi-thread | Step 10D — Create five thread startup Prompt templates under `prompts/thread-start/` | Users need repeatable entrypoints for Main / PM / Design / Engineering / Radar threads | Multi-thread execution becomes copyable and consistent | Accepted |
| 2026-04-28 | Documentation | Step 10E — Replace old workspace example commands with `APB 模式：...` | Avoid reverting users to legacy "enter workspace" behavior | Workspace README and workflow examples now match APB Mode | Accepted |
| 2026-04-28 | Memory | Step 10F — User-owned context must be filled by the user, not invented by AI | Long-term context affects routing and may involve real work constraints | APB can use user-approved context without hallucinating private details | Accepted |
| 2026-04-28 | Routing | Step 10I — Move detailed APB Mode and Skills rules into `docs/APB_MODE.md`, keeping root `AGENTS.md` short | Reduce startup context load and avoid burying key rules in long instructions | Root `AGENTS.md` becomes a concise routing index; detailed rules load on demand | Accepted |
