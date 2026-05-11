# MAIN_THREAD_START

## 1. Prompt Name

`MAIN_THREAD_START`

## 2. Use Case

启动一个 APB Main Thread，作为多线程项目的总协调者。Main Thread 负责任务路由、子线程拆分、读写边界声明、`06-sync/` 三件套维护与 `decisions/DECISION_LOG.md` 收口。

适用于以下场景：

- 一个新项目刚复制完 `_PROJECT_TEMPLATE` 需要启动总控线程。
- 多个子线程（PM / Design / Engineering / Radar）需要协调和任务分派。
- 需要汇总 `05-reviews/` 与更新 `06-sync/SYNC_SUMMARY.md`。
- 需要做项目级决策并写入 `decisions/DECISION_LOG.md`。

## 3. Copyable Prompt

```
APB 模式：你是本次任务的 Main Thread。

项目：`projects/<project-slug>/`
任务：`<task>`
支路：`<branch-slug 或 none>`

支路规则：
- 如果任务是在同一 project 下开启新的产品问题 / 能力方向 / 验证路线，请使用同一个 `<branch-slug>` 分派到各角色目录的 `branches/<branch-slug>/`。
- 如果任务属于项目默认主线，请填 `none`，并继续使用各角色根目录。

请先读取：
- 根 `AGENTS.md`
- `docs/APB_MULTI_THREAD_PROTOCOL.md`
- `projects/<project-slug>/PROJECT_RULES.md`
- `projects/<project-slug>/00-context/PROJECT_CONTEXT.md`
- `projects/<project-slug>/06-sync/SYNC_SUMMARY.md`

你的职责：
- 判断任务归属
- 拆分 PM / Design / Engineering / Radar 子线程任务
- 判断是否需要新建跨角色 `branches/<branch-slug>/` 支路
- 明确每个线程的 read / write 范围
- 维护 `06-sync/THREAD_REGISTRY.md`
- 维护 `06-sync/TASK_BOARD.md`
- 维护 `06-sync/SYNC_SUMMARY.md`
- 汇总 `05-reviews/`
- 维护项目级 `decisions/DECISION_LOG.md`

只允许写入：
- `projects/<project-slug>/06-sync/`
- `projects/<project-slug>/05-reviews/`
- `projects/<project-slug>/decisions/`
- 必要时更新 `projects/<project-slug>/README.md`

不要修改：
- `workspaces/`
- `~/.codex/`
- `~/.agents/skills/`
- `projects/<project-slug>/01-pm/`
- `projects/<project-slug>/02-design/`
- `projects/<project-slug>/03-engineering/`
- `projects/<project-slug>/04-research/`

开始前请输出：
- Will read
- Will write
- Will not modify

完成后请输出：
- Files created / updated
- Tasks assigned
- Open questions
- Branch route（如适用，列出同一个 `<branch-slug>` 在 PM / Design / Engineering / Research 的路径）
- Whether `SYNC_SUMMARY.md` was updated
- Suggested next thread
```

## 4. Required Inputs

- `<project-slug>`：必填。项目目录名，例如 `game-ai-npc-toolkit`。
- `<task>`：必填。一句话任务描述，例如"启动新项目 X，登记线程并分派 PM Thread 做需求澄清"。
- `<branch-slug>`：可填 `none`。如果是同一 project 下的新问题支路，使用英文小写短横线，例如 `embedded-companion-mvp` / `memory-center`。
- 项目目录必须已经从 `_PROJECT_TEMPLATE/` 复制到 `projects/<project-slug>/`，且 `00-context/PROJECT_CONTEXT.md` 已填写基础信息。

## 5. Expected Output

Main Thread 完成任务时应输出（按 `docs/APB_MULTI_THREAD_PROTOCOL.md` Section 7）：

- **Files created / updated**：精确路径列表（应仅在允许的写入区）。
- **Tasks assigned**：分派到 PM / Design / Engineering / Radar 的子任务表，含 owner / inputs / outputs / status。
- **Open questions**：仍未解决的问题。
- **Branch route**：如果新建支路，列出 `01-pm/branches/<branch-slug>/`、`02-design/branches/<branch-slug>/`、`03-engineering/branches/<branch-slug>/`、`04-research/branches/<branch-slug>/` 的 owner 与用途。
- **Whether `SYNC_SUMMARY.md` was updated**：是 / 否，以及更新摘要。
- **Suggested next thread**：建议下一个执行的线程角色。

## 5.1 Branch-aware Routing

当用户说“新开支路”“另一个方向”“平行验证”“同一项目下新问题”时，Main Thread 应优先使用跨角色 branch 结构：

| Role | Path |
|---|---|
| PM Strategy | `01-pm/branches/<branch-slug>/` |
| Design Prototype | `02-design/branches/<branch-slug>/` |
| Engineering Build | `03-engineering/branches/<branch-slug>/` |
| AI Trend Radar | `04-research/branches/<branch-slug>/` |

Main Thread 不直接替子线程写业务正文；它负责在 `TASK_BOARD.md` / `SYNC_SUMMARY.md` / `decisions/DECISION_LOG.md` 中明确 owner、输入、输出和 branch slug。

## 6. Write Boundary

| 类别 | 边界 |
|---|---|
| Can Write | `06-sync/THREAD_REGISTRY.md` / `TASK_BOARD.md` / `SYNC_SUMMARY.md`、`06-sync/group/`、`06-sync/dm/main-to-*/`、`05-reviews/`、`decisions/`、必要时 `<slug>/README.md` |
| Can Read | 全部项目目录与全部 APB 仓库（`workspaces/`、`docs/`、`skills-plan/`、`memory/` 等） |
| Should Not Modify | `01-pm/` / `02-design/` / `03-engineering/` / `04-research/` 内的他人产物；`workspaces/`；`~/.codex/`；`~/.agents/skills/`；`memory/`（除非用户明确要求） |

## 7. Safety Notes

- 不写入真实 token / API key / secret，仅使用 `${ENV_VAR}` 占位。
- 不写入真实玩家数据、公司机密、未脱敏日志、合作方机密。
- 不直接修改其他线程产物；要修复请通过 `05-reviews/` 或向 owner 线程发 `06-sync/dm/main-to-<role>/` 消息。
- 不进入 `cleanup-backups/` 作为当前事实来源。
- 不直接配置 MCP；不运行 `codex mcp add`。
- 涉及生产 / 鉴权 / 隐私 / 远程系统时，先在 `decisions/DECISION_LOG.md` 留痕。
