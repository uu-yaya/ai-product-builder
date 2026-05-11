# Project Template

## 1. Project Template Purpose

`projects/_PROJECT_TEMPLATE/` 是 APB 的项目级产物起手骨架。复制本模板到 `projects/<project-slug>/` 即可开始一个新项目。

它不是真实项目，**不要直接在 `_PROJECT_TEMPLATE/` 内填写业务内容**。所有真实业务内容应在复制后的项目目录里完成。

## 2. How to Create a New Project

1. 选定 `<project-slug>`（英文小写短横线，例如 `litchi-star-sign`、`meiyijia-digital-human`、`game-ai-npc-toolkit`）。
2. 复制整个 `_PROJECT_TEMPLATE/` 到 `projects/<project-slug>/`。
3. 优先填写 `00-context/PROJECT_CONTEXT.md`（项目身份、目标、用户、约束、Open Questions）。
4. 在 `decisions/DECISION_LOG.md` 记录第一条项目级决策。
5. 之后再按需进入 `01-pm/` / `02-design/` / `03-engineering/` / `04-research/` / `05-reviews/`。
6. 多线程协作时再启用 `06-sync/`。

## 3. Directory Structure

```
projects/<project-slug>/
├── README.md                    项目入口（建议复制本模板的 README 后裁剪）
├── PROJECT_RULES.md             项目级规则（read/write 边界、线程规则）
├── 00-context/                  项目共同上下文（所有线程优先读）
│   ├── PROJECT_CONTEXT.md
│   ├── USER_PERSONA.md
│   ├── PRODUCT_POSITIONING.md
│   └── LINKS.md
├── 01-pm/                       PM Strategy 线程产物
├── 02-design/                   Design Prototype 线程产物
├── 03-engineering/              Engineering Build 线程产物
├── 04-research/                 AI Trend Radar 线程产物
├── 05-reviews/                  跨线程评审 / 风险检查
├── 06-sync/                     多线程通信层（按需启用）
│   ├── README.md
│   ├── THREAD_REGISTRY.md
│   ├── TASK_BOARD.md
│   ├── SYNC_SUMMARY.md
│   ├── group/
│   └── dm/
└── decisions/
    └── DECISION_LOG.md
```

## 4. Output Placement Rules

| 内容类型 | 必须放进 |
|---|---|
| 通用方法论、模板、workflow、prompt | `workspaces/`（**不是项目目录**） |
| 项目级 PRD / 设计 / 工程计划 / 趋势报告 | `projects/<slug>/01-pm` / `02-design` / `03-engineering` / `04-research/` |
| 项目级评审 | `projects/<slug>/05-reviews/` |
| 项目级关键决策 | `projects/<slug>/decisions/DECISION_LOG.md` |
| 跨线程消息、任务板、状态摘要 | `projects/<slug>/06-sync/` |
| 临时草稿 | 项目子目录内带 `_draft_` 前缀的文件，不要散落在仓库根目录 |

强约束：

- **不要把具体项目产物写进 `workspaces/`**。
- **不要把临时草稿散落在仓库根目录或 cleanup-backups/**。
- **每个项目都必须先填写 `00-context/PROJECT_CONTEXT.md`**，否则路由判断会失去依据。

## 5. Thread Ownership Rules

| 线程 | 默认写区 | 默认读区 |
|---|---|---|
| Main Thread | `06-sync/SYNC_SUMMARY.md` / `06-sync/THREAD_REGISTRY.md` / `06-sync/TASK_BOARD.md` / `decisions/DECISION_LOG.md` | 全部 |
| PM Strategy Thread | `01-pm/` | `00-context/`、`04-research/`、`06-sync/group/`、`05-reviews/` |
| Design Prototype Thread | `02-design/` | `00-context/`、`01-pm/`、`06-sync/group/` |
| Engineering Build Thread | `03-engineering/` | `00-context/`、`01-pm/`、`02-design/`、`06-sync/group/` |
| AI Trend Radar Thread | `04-research/` | `00-context/`、`06-sync/group/` |

跨线程发现问题时：写到 `05-reviews/` 或 `06-sync/group/`，**不要直接修改其他线程产物**。

## 6. 06-sync Communication Layer

`06-sync/` 是**项目级**多线程沟通区，不是保密区。

- `group/` 所有线程可见的公开消息，按 `YYYY-MM-DDTHH-MM-SS_<thread>_<topic-slug>.md` 单文件落盘（避免并发覆盖）。
- `dm/<from>-to-<to>/` 线程间定向消息，但**不是私密存储**，所有线程都可读。
- `THREAD_REGISTRY.md` 记录每个线程角色、读写区、状态、最后更新时间。
- `TASK_BOARD.md` 项目级任务分配与阻塞。
- `SYNC_SUMMARY.md` 由 Main Thread 维护，新线程启动时优先读它，而不是回看所有 group/dm 历史。

只有当真的有 ≥2 线程协作时才启用 `06-sync/`。单线程项目可保留目录结构但不必产生文件。

## 7. Naming Conventions

- 项目目录：`<project-slug>`（英文小写短横线，如 `game-ai-npc-toolkit`）。
- 文件：使用模板预定义的命名（见各子目录 README）。例如：
  - `01-pm/PRD_<feature-slug>.md`
  - `02-design/FIGMA_PROMPT_<feature-slug>.md`
  - `03-engineering/MVP_BUILD_PLAN_<feature-slug>.md`
  - `04-research/AI_WEEKLY_REPORT_<week>.md`
  - `05-reviews/PM_REVIEW_<feature-slug>.md`
- `06-sync/group/` / `dm/` 消息：`YYYY-MM-DDTHH-MM-SS_<thread>_<topic-slug>.md`。
- `<feature-slug>` / `<topic-slug>` / `<page-slug>` 全部用英文小写短横线。
- 不要在文件名里塞中文、空格、版本号（v1/v2）；版本演进通过 `decisions/DECISION_LOG.md` 追踪。

## 8. Safety Rules

- **不得**写入真实玩家数据、公司机密、未脱敏日志、合作方机密。
- **不得**写入真实 token / API key / secret，仅使用 `${ENV_VAR}` 占位。
- **不得**修改 `workspaces/`、`~/.codex/`、`~/.agents/skills/`、`memory/`（除非任务明确要求）。
- 涉及外部 API、生产配置、鉴权、支付、隐私时，先在 `decisions/DECISION_LOG.md` 记录风险与边界。
- `06-sync/` 不是保密区；任何敏感信息都不应进入项目仓库。

## 9. Maintenance Rules

- `_PROJECT_TEMPLATE/` 仅作为骨架，**不放业务内容**。
- 模板更新需要在 `decisions/DECISION_LOG.md` 留痕；后续真实项目复制时按需对齐。
- 当模板与已有项目冲突时，**已有项目不必强制回迁**，但新项目应使用最新模板。
- 当一个项目结束时，建议在 `decisions/DECISION_LOG.md` 写一条 closure 决策，并把项目目录保留为只读参考。
