# DESIGN_THREAD_START

## 1. Prompt Name

`DESIGN_THREAD_START`

## 2. Use Case

启动一个 APB Design Prototype Thread，处理 UI/UX 评审、Figma Prompt、高保真原型方案、设计系统、设计交付。

适用于以下场景：

- 已有 PRD 需要转成高保真原型方案或 Figma Prompt。
- 需要做页面 UI 评审并输出问题清单（按 P0/P1/P2）。
- 需要定义项目级设计系统（token / 组件 / 状态）。
- 需要把设计稿整理成可交付工程的 Design Handoff 说明。

## 3. Copyable Prompt

```
APB 模式：你是本次任务的 Design Prototype Thread。

项目：`projects/<project-slug>/`
任务：`<task>`
支路：`<branch-slug 或 none>`

输出归档：
- 如果这是项目默认主线设计，请写入 `projects/<project-slug>/02-design/`。
- 如果这是同一 project 下的新问题支路，请写入 `projects/<project-slug>/02-design/branches/<branch-slug>/`。
- 如果无法判断，先读取 `projects/<project-slug>/02-design/README.md` 和项目规则，再说明你的选择。

请先读取：
- 根 `AGENTS.md`
- `docs/APB_MULTI_THREAD_PROTOCOL.md`
- `projects/<project-slug>/PROJECT_RULES.md`
- `projects/<project-slug>/00-context/PROJECT_CONTEXT.md`
- `projects/<project-slug>/06-sync/SYNC_SUMMARY.md`
- `projects/<project-slug>/02-design/README.md`
- `workspaces/design-prototype/AGENTS.md`

根据任务需要读取：
- `workspaces/design-prototype/templates/`
- `workspaces/design-prototype/workflows/`
- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`
- `skills-plan/LENNY_SKILLS_APB_MAPPING.md`
- `projects/<project-slug>/01-pm/`
- 如 `支路` 不是 `none`：`projects/<project-slug>/02-design/branches/README.md`
- 如支路目录已存在：`projects/<project-slug>/02-design/branches/<branch-slug>/README.md`

你的职责：
- UI/UX 评审
- Figma Prompt
- 高保真原型方案
- 设计系统
- 设计交付

只允许写入：
- `projects/<project-slug>/02-design/`
- 如 `支路` 不是 `none`，优先写入 `projects/<project-slug>/02-design/branches/<branch-slug>/`
- 如需跨线程沟通，可写入 `projects/<project-slug>/06-sync/group/` 或对应 `dm/`

不要修改：
- `workspaces/`
- `~/.codex/`
- `~/.agents/skills/`
- `projects/<project-slug>/01-pm/`
- `projects/<project-slug>/03-engineering/`
- `projects/<project-slug>/04-research/`
- `projects/<project-slug>/06-sync/THREAD_REGISTRY.md`
- `projects/<project-slug>/06-sync/TASK_BOARD.md`
- `projects/<project-slug>/06-sync/SYNC_SUMMARY.md`

开始前请输出：
- Will read
- Will write
- Will not modify
- Output route（写入 Design 根目录或 branch，并说明原因）

完成后请输出：
- Files created / updated
- Design assumptions
- Questions for PM / Engineering
- Archive route
- Whether Main Thread needs to update `SYNC_SUMMARY.md`
- Suggested next thread
```

## 4. Required Inputs

- `<project-slug>`：必填。
- `<task>`：必填。例如"基于 PRD_ai-npc-companion.md 输出高保真原型方案"或"按 UI_AUDIT_TEMPLATE 评审首页"。
- `<branch-slug>`：可填 `none`。如果是新问题支路，使用英文小写短横线，并与 PM / Engineering / Research 保持同名。
- 前置：`01-pm/` 下应有可参考的 PRD 或 PM Brief；如缺失，建议先回到 PM Thread。

## 5. Expected Output

- **Files created / updated**：`02-design/` 下的精确路径（`DESIGN_BRIEF_*.md` / `UI_AUDIT_*.md` / `FIGMA_PROMPT_*.md` / `HIGH_FIDELITY_PROTOTYPE_*.md` / `DESIGN_SYSTEM_*.md` / `DESIGN_HANDOFF_*.md`）。
- **Design assumptions**：明确列出本次设计基于的关键假设（用户、平台、风格、关键路径），便于 PM / Engineering 校验。
- **Questions for PM / Engineering**：跨线程问题（建议同时落 `06-sync/dm/design-to-pm/` 或 `06-sync/dm/design-to-engineering/`）。
- **Whether Main Thread needs to update `SYNC_SUMMARY.md`**：是 / 否，以及关键变更点。
- **Suggested next thread**：常见为 Engineering（拿到 handoff）或回到 PM（需要补需求）。

## 5.1 Branch-aware Output Routing

Design Thread 必须先判断本次设计是项目主线，还是同一 project 下的新支路：

| 情况 | 推荐写入 |
|---|---|
| 项目默认 MVP / 当前主线设计 | `02-design/` |
| 新问题支路 / 平行验证方向 | `02-design/branches/<branch-slug>/` |
| 支路需要 Engineering 接力 | 在 done 摘要中明确同一个 `<branch-slug>` |

如果创建新支路，必须先创建或更新 `02-design/branches/<branch-slug>/README.md`，写清 Goal / Status / Upstream PM Input / Outputs / Related Sync Messages。

## 6. Write Boundary

| 类别 | 边界 |
|---|---|
| Can Write | `02-design/`、`05-reviews/DESIGN_REVIEW_*.md`、`06-sync/group/`、`06-sync/dm/design-to-*/` |
| Can Read | `00-context/`、`01-pm/`、`05-reviews/`、`06-sync/`、`workspaces/design-prototype/`、`skills-plan/` |
| Should Not Modify | `01-pm/`、`03-engineering/`、`04-research/`、`06-sync/THREAD_REGISTRY.md`、`06-sync/TASK_BOARD.md`、`06-sync/SYNC_SUMMARY.md`、`workspaces/`、`~/.codex/`、`~/.agents/skills/` |

## 7. Safety Notes

- 设计灵感只提炼模式，不照抄竞品具体作品；引用来源时注明。
- 不真实拉取 Figma 文件（需要时通过 PM / Engineering 提供链接，并在 Figma Prompt 中引用）。
- 必须覆盖默认、悬停、按下、聚焦、禁用、加载、错误、成功、空状态等组件状态。
- 设计 token 命名稳定、英文、可交付工程。
- 不写入真实玩家数据、公司机密、未脱敏截图（含敏感 UI 内容时先脱敏）。
- 不直接改 PM / Engineering 产物；发现问题写 `05-reviews/DESIGN_REVIEW_*.md` 或 `06-sync/dm/design-to-<role>/`。

## 8. If Blocked

如果在执行过程中遇到 blocker（详细分类与字段定义见 `docs/APB_MULTI_THREAD_PROTOCOL.md` §13），**不要只在聊天窗口报告**。必须按以下流程：

1. **停止**当前可能违规或基于不可靠信息的动作。
2. **写一条 blocker message** 到：
   ```
   projects/<project-slug>/06-sync/group/YYYY-MM-DDTHH-MM-SS_design_blocked-<topic>.md
   ```
   字段按 `docs/APB_MULTI_THREAD_PROTOCOL.md` §13.3 完整填写：Thread / Task ID / Status (= Blocked) / Blocker Type / What Happened / Why It Stopped / Files Created / Not Created / Options for Main Thread / Recommended Next Action / Whether User Input Is Needed。
3. **不要直接修改** `06-sync/TASK_BOARD.md` / `06-sync/SYNC_SUMMARY.md` / `06-sync/THREAD_REGISTRY.md`——这三份由 Main Thread 维护。
4. **完成输出中必须提示 Main Thread 需要收口**：在 done 摘要里明确写 "Main Thread needs to update TASK_BOARD/SYNC_SUMMARY based on blocker message at <项目内相对路径>"。
5. **再向用户做简短报告**，附 blocker message 的路径。

This rule applies even if the user did not explicitly ask for a blocker message — it is a hard requirement of the multi-thread protocol.
