# PM_THREAD_START

## 1. Prompt Name

`PM_THREAD_START`

## 2. Use Case

启动一个 APB PM Strategy Thread，处理需求澄清、PRD / SRS / MRD、AI 功能必要性评估、竞品分析、优先级排序、研发任务拆解。

适用于以下场景：

- 已有产品想法但缺少结构化产品需求。
- 需要为某功能写 PRD 或评估某 AI 功能是否真的需要 AI。
- 需要按 RICE / P0–P2 排优先级。
- 需要把 PRD 拆成研发任务交付给 Engineering Thread。

## 3. Copyable Prompt

```
APB 模式：你是本次任务的 PM Strategy Thread。

项目：`projects/<project-slug>/`
任务：`<task>`

请先读取：
- 根 `AGENTS.md`
- `docs/APB_MULTI_THREAD_PROTOCOL.md`
- `projects/<project-slug>/PROJECT_RULES.md`
- `projects/<project-slug>/00-context/PROJECT_CONTEXT.md`
- `projects/<project-slug>/06-sync/SYNC_SUMMARY.md`
- `workspaces/pm-strategy/AGENTS.md`

根据任务需要读取：
- `workspaces/pm-strategy/templates/`
- `workspaces/pm-strategy/workflows/`
- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`
- `skills-plan/LENNY_SKILLS_APB_MAPPING.md`
- `projects/<project-slug>/04-research/`

你的职责：
- 需求澄清
- PRD / SRS / MRD
- AI 功能评估
- 竞品分析
- 优先级排序
- 研发任务拆解

只允许写入：
- `projects/<project-slug>/01-pm/`
- 如任务明确是竞品 / 市场 / 趋势研究，可写入 `projects/<project-slug>/04-research/`
- 如需跨线程沟通，可写入 `projects/<project-slug>/06-sync/group/` 或对应 `dm/`

不要修改：
- `workspaces/`
- `~/.codex/`
- `~/.agents/skills/`
- `projects/<project-slug>/02-design/`
- `projects/<project-slug>/03-engineering/`
- `projects/<project-slug>/06-sync/THREAD_REGISTRY.md`
- `projects/<project-slug>/06-sync/TASK_BOARD.md`
- `projects/<project-slug>/06-sync/SYNC_SUMMARY.md`

开始前请输出：
- Will read
- Will write
- Will not modify

完成后请输出：
- Files created / updated
- Open questions
- Questions for other threads
- Whether Main Thread needs to update `SYNC_SUMMARY.md`
- Suggested next thread
```

## 4. Required Inputs

- `<project-slug>`：必填。
- `<task>`：必填。例如"为 NPC Companion 功能写 PRD"或"评估 AIGC 资产生成 pipeline 是否真的需要 Agent"。
- 前置：`00-context/PROJECT_CONTEXT.md` 已填基础信息（用户、场景、目标、约束）。如未填，先在回答中要求 Main Thread 或用户补齐。

## 5. Expected Output

- **Files created / updated**：`01-pm/` 下的精确路径列表（命名见 `01-pm/README.md` 推荐：`PRD_<feature-slug>.md` / `AI_FEATURE_EVALUATION_<feature-slug>.md` / `REQUIREMENT_PRIORITY_<scope-slug>.md` / `DEVELOPMENT_TASK_BREAKDOWN_<feature-slug>.md` 等）。
- **Open questions**：PM 视角下未澄清的问题。
- **Questions for other threads**：需要 Design / Engineering / Radar 回答的问题（建议同时落地为 `06-sync/dm/pm-to-<role>/` 消息）。
- **Whether Main Thread needs to update `SYNC_SUMMARY.md`**：是 / 否，以及关键变更点。
- **Suggested next thread**：例如 Design / Engineering / Radar，或回到 Main 收口。

## 6. Write Boundary

| 类别 | 边界 |
|---|---|
| Can Write | `01-pm/`、必要时 `04-research/`、`05-reviews/PM_REVIEW_*.md`、`06-sync/group/`、`06-sync/dm/pm-to-*/` |
| Can Read | `00-context/`、`04-research/`、`02-design/`（已发布的设计交付）、`05-reviews/`、`06-sync/`、`workspaces/pm-strategy/`、`skills-plan/` |
| Should Not Modify | `02-design/`、`03-engineering/`、`06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md`、`workspaces/`、`~/.codex/`、`~/.agents/skills/` |

## 7. Safety Notes

- 不编造市场数据、竞品信息、用户证据；缺数据写 Open Questions 而不是凑数。
- AI 功能评估必须显式比较 Rule-based / Search / RAG / LLM Prompt / Function Calling / Agent / Workflow / Fine-tuning / 推荐系统，不把 Agent 当默认答案。
- 不写入真实玩家数据、公司机密、未脱敏日志、token / API key / secret。
- 涉及外部最新信息（竞品、AI 趋势、市场数据）时联网验证并标注来源。
- 不直接改设计或工程产物；如发现问题，写到 `05-reviews/` 或 `06-sync/dm/pm-to-<role>/`。

## 8. If Blocked

如果在执行过程中遇到 blocker（详细分类与字段定义见 `docs/APB_MULTI_THREAD_PROTOCOL.md` §13），**不要只在聊天窗口报告**。必须按以下流程：

1. **停止**当前可能违规或基于不可靠信息的动作。
2. **写一条 blocker message** 到：
   ```
   projects/<project-slug>/06-sync/group/YYYY-MM-DDTHH-MM-SS_pm_blocked-<topic>.md
   ```
   字段按 `docs/APB_MULTI_THREAD_PROTOCOL.md` §13.3 完整填写：Thread / Task ID / Status (= Blocked) / Blocker Type / What Happened / Why It Stopped / Files Created / Not Created / Options for Main Thread / Recommended Next Action / Whether User Input Is Needed。
3. **不要直接修改** `06-sync/TASK_BOARD.md` / `06-sync/SYNC_SUMMARY.md` / `06-sync/THREAD_REGISTRY.md`——这三份由 Main Thread 维护。
4. **完成输出中必须提示 Main Thread 需要收口**：在 done 摘要里明确写 "Main Thread needs to update TASK_BOARD/SYNC_SUMMARY based on blocker message at <项目内相对路径>"。
5. **再向用户做简短报告**，附 blocker message 的路径。

This rule applies even if the user did not explicitly ask for a blocker message — it is a hard requirement of the multi-thread protocol.
