# Task Board

项目级任务分配与阻塞跟踪。Main Thread 维护，其他线程通过 `06-sync/group/` 投递新增 / 状态变更。

## 状态字段说明

- **Status**：Backlog / In Progress / Blocked / In Review / Done / Dropped

## 任务清单

| Task ID | Owner Thread | Task | Inputs | Outputs | Status | Blockers |
|---|---|---|---|---|---|---|
| T-001 | AI Trend Radar Thread | 首期 Baseline + W18 周报：30 天背景 + 7 天增量（窗口 2026-04-22 → 2026-04-28） | `00-context/PROJECT_CONTEXT.md`、`00-context/LINKS.md`、`04-research/AI_WEEKLY_REPORT_TEMPLATE.md`、`decisions/DECISION_LOG.md` | `04-research/AI_WEEKLY_REPORT_2026-W18.md`（Issue 字段标 `Baseline`） | **Backlog**（联网权限已解锁 2026-04-28；等待用户启动 Radar Thread） | 无 |

## 维护规则

- Task ID 自增，建议 `T-<3 位数>`。
- Owner Thread 必须是 `THREAD_REGISTRY.md` 中已登记的线程。
- Inputs / Outputs 使用项目内相对路径，例如 `01-pm/PRD_<feature-slug>.md`。
- 任务进入 In Review 后，必须有对应 `05-reviews/` 评审文件链接。
- 阻塞超过 3 天必须在 `06-sync/group/` 发一条状态消息，并由 Main 在 `SYNC_SUMMARY.md` 标注。
