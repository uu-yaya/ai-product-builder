# Thread Registry

记录本项目当前 active 线程的角色、读写区、状态与最后更新时间。

## 状态字段说明

- **Status**：Active / Idle / Paused / Closed
- **Last Update**：YYYY-MM-DD（最后一次写入项目目录的日期）

## 线程登记

| Thread | Role | Can Write | Can Read | Status | Last Update | Runtime |
|---|---|---|---|---|---|---|
| Main Thread | 总协调、跨线程同步、决策汇总 | `06-sync/SYNC_SUMMARY.md` / `06-sync/THREAD_REGISTRY.md` / `06-sync/TASK_BOARD.md` / `decisions/DECISION_LOG.md` | 全部 | Active | 2026-05-11 | Codex |
| PM Strategy Thread | 需求澄清、PRD、竞品、优先级、AI 必要性评估 | `01-pm/`、`05-reviews/`（PM 视角）、`06-sync/group/`、`06-sync/dm/pm-to-*/` | `00-context/`、`04-research/`、`06-sync/`、`05-reviews/` | Idle | 2026-05-08 | Codex |
| Design Prototype Thread | 设计简报、UI/UX 评审、Figma Prompt、高保真原型、设计系统、设计交付 | `02-design/`、`05-reviews/`（Design 视角）、`06-sync/group/`、`06-sync/dm/design-to-*/` | `00-context/`、`01-pm/`、`06-sync/`、`05-reviews/` | Idle | YYYY-MM-DD | - |
| Engineering Build Thread | MVP、API、数据模型、AI 集成、测试、code review、上线检查 | `03-engineering/`、`05-reviews/`（Engineering 视角）、`06-sync/group/`、`06-sync/dm/engineering-to-*/` | `00-context/`、`01-pm/`、`02-design/`、`06-sync/`、`05-reviews/` | Idle | YYYY-MM-DD | - |
| AI Trend Radar Thread | AI 日报 / 周报、专题趋势、产品机会、Demo idea | `04-research/`、`05-reviews/`（Research 视角）、`06-sync/group/`、`06-sync/dm/radar-to-*/` | `00-context/`、`06-sync/`、`05-reviews/` | Idle | 2026-05-11 | Codex |

## 维护规则

- 任一线程开启工作时，在自己一行更新 `Status` 与 `Last Update`。
- 新增线程必须在此登记后才能写入项目目录。
- 关闭线程时把 `Status` 改成 `Closed`，并保留历史行不删除。
