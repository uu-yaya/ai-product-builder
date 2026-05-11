# Project Rules

## 1. Project Role

本项目是 APB（AI Product Builder）下的真实业务项目实例。
所有产物必须**结构化、可复制、可执行**，并明确区分事实、假设、建议和待确认问题。

`workspaces/` 提供方法论与模板。
`projects/<slug>/` 沉淀真实业务产物。
两者不混合。

## 2. Read / Write Rules

任何线程开始一项任务前，必须先在回答开头声明：

- **Will read**：本次会读哪些文件 / 目录。
- **Will write**：本次计划写哪些文件 / 目录。
- **Will not modify**：明确不会改动的范围（例如 `workspaces/`、`~/.codex/`、其他线程的产物）。

写操作的硬规则：

- `00-context/`：任何线程（但变更必须同步到 `06-sync/SYNC_SUMMARY.md`）。
- `01-pm/`：PM Strategy Thread。
- `02-design/`：Design Prototype Thread。
- `03-engineering/`：Engineering Build Thread。
- `04-research/`：AI Trend Radar Thread。
- `05-reviews/`：任何线程（写评审，不改其他线程产物）。
- `06-sync/SYNC_SUMMARY.md` / `THREAD_REGISTRY.md` / `TASK_BOARD.md`：Main Thread。
- `06-sync/group/`：任何线程，每条消息一个文件。
- `06-sync/dm/<from>-to-<to>/`：仅 from 线程写，所有线程可读。
- `decisions/DECISION_LOG.md`：Main Thread；其他线程通过 PR-style 提议。

## 3. Thread Rules

预置五类线程：

- Main Thread
- PM Strategy Thread
- Design Prototype Thread
- Engineering Build Thread
- AI Trend Radar Thread

线程启动时必须：

1. 自报身份（"我是 PM Strategy Thread"）。
2. 读 `00-context/PROJECT_CONTEXT.md`。
3. 读 `06-sync/SYNC_SUMMARY.md`（如已启用）。
4. 声明 Will read / Will write / Will not modify。
5. 任务结束时，把关键变更摘要写到 `06-sync/group/`，由 Main Thread 在 `SYNC_SUMMARY.md` 收口。

线程发现其他线程的问题时：

- **不要**直接修改对方文件。
- 写一份 `05-reviews/<role>_REVIEW_<feature-slug>.md` 或 `06-sync/group/` 消息。
- 由对应所有者线程认领修复。

## 4. File Naming Rules

- 项目目录：`<project-slug>`（英文小写短横线）。
- 业务文件：按各子目录 README 推荐命名。
- `06-sync/` 消息：`YYYY-MM-DDTHH-MM-SS_<thread>_<topic-slug>.md`。
- 临时草稿：`_draft_<topic-slug>.md`，正式化后去掉前缀。
- 文件名不允许中文、空格、版本号（v1/v2）；演进信息记录在 `decisions/DECISION_LOG.md`。

## 5. Review Rules

跨线程评审统一放进 `05-reviews/`：

- `PM_REVIEW_<feature-slug>.md`
- `DESIGN_REVIEW_<feature-slug>.md`
- `ENGINEERING_REVIEW_<feature-slug>.md`
- `RESEARCH_REVIEW_<topic-slug>.md`
- `LAUNCH_REVIEW_<feature-slug>.md`
- `RISK_REVIEW_<scope-slug>.md`

每份评审必须包含：问题、证据、影响（P0/P1/P2）、修复建议、负责人线程。

## 5.1 Markdown Rendering Rules

本项目默认使用 GitHub Flavored Markdown (GFM) 作为 `.md` 渲染口径。研究表格、对比表、指标解释表都应写成标准 Markdown pipe table。

- 表格数据使用标准 pipe table：`| col | col |` + `| ---- | ---- |`。
- 不要把 HTML table 写进 `.md`；当前预览可能把 `<table>` 当纯文本显示。
- 不要把本应横向对比的数据改成长嵌套列表；长列表在源码视图里可读性差，也不符合本项目的研究文档习惯。
- 表格列数必须一致；编辑后检查同一表格块里每行的列数。
- 提交前用 `pandoc --from=gfm --to=html5` 或等价 GFM 渲染器验证。
- 如果截图里出现行号和语法高亮，通常是源码编辑视图；但源文件仍需保持 GFM 语法正确。

## 6. Sync Rules

- Main Thread 维护 `06-sync/SYNC_SUMMARY.md`，作为新线程启动时**唯一权威摘要**。
- 其他线程不直接覆盖 `SYNC_SUMMARY.md`，而是写 `06-sync/group/` 让 Main 收口。
- 任务变更必须在 `06-sync/TASK_BOARD.md` 反映。
- 新增线程或下线线程必须更新 `06-sync/THREAD_REGISTRY.md`。

## 7. Safety Rules

- 不写入真实 token / API key / secret，仅使用 `${ENV_VAR}` 占位。
- 不写入真实玩家数据、公司机密、未脱敏日志、合作方机密、IP 授权细节。
- 不修改 `workspaces/`、`~/.codex/`、`~/.agents/skills/`、`memory/`（除非任务明确要求）。
- 不直接配置 MCP；MCP 仅在 `mcp-plan/` 规划。
- 涉及生产配置、鉴权、支付、隐私、远程系统时，先在 `decisions/DECISION_LOG.md` 留痕，再小步执行。

## 8. What Not To Do

- 不在 `workspaces/` 写真实业务产物。
- 不在仓库根目录散落临时草稿。
- 不直接修改其他线程的产物。
- 不在 `06-sync/` 存放任何敏感数据。
- 不假设 `_PROJECT_TEMPLATE/` 已经覆盖所有情况；遇到模板不足时，先写 `decisions/DECISION_LOG.md`，再扩展项目目录，必要时反馈到模板更新。
- 不绕过 `00-context/PROJECT_CONTEXT.md` 直接写 PRD 或工程计划。
- 不删除、移动、重命名其他线程已发布的产物（要修正请通过 `05-reviews/` 或 `decisions/`）。
