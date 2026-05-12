# Branch-aware Quick Prompts

## 1. Purpose

这些是日常可直接复制的短 prompt。它们兼容旧 APB 用法，同时让 agent 自动遵守新的主题文件夹与 `branches/<branch-slug>/` 规则。

使用原则：

- 项目默认主线：`支路：none`
- 同一 project 下的新问题 / 新方向 / 平行验证：填写同一个 `<branch-slug>`
- Radar 如果属于已有 research 主题，优先写入主题文件夹；如果是新方向，写入 `04-research/branches/<branch-slug>/`
- 每个线程必须读取对应 `workspaces/<role>/AGENTS.md` 并应用其中的 Brainstorming First / Local Skill Reuse Rules
- 每个线程开始仍必须输出 Will read / Will write / Will not modify
- 每个线程结束仍必须写 `06-sync/group/` 完成消息，并提示 Main Thread 是否需要收口

## 2. Universal Thread Prompt

```text
APB 模式：你是 <Main / PM Strategy / Design Prototype / Engineering Build / AI Trend Radar> Thread。

项目：`projects/<project-slug>/`
任务：`<task>`
支路：`<branch-slug 或 none>`

请按以下规则执行：
1. 读取根 `AGENTS.md`、`docs/APB_MULTI_THREAD_PROTOCOL.md`、项目 `PROJECT_RULES.md`、`00-context/PROJECT_CONTEXT.md`、`06-sync/SYNC_SUMMARY.md`。
2. 读取对应 `workspaces/<role>/AGENTS.md`，并应用其中的 Brainstorming First / Local Skill Reuse Rules。
3. 读取本角色目录 README；如果 `支路` 不是 `none`，读取对应 `branches/README.md`。
4. 开始前输出 Will read / Will write / Will not modify / Output route。
5. 如果是主线任务，写入本角色根目录；如果是新支路，写入本角色 `branches/<branch-slug>/`。
6. 完成后写一条 `06-sync/group/YYYY-MM-DDTHH-MM-SS_<thread>_<topic-slug>.md`。
7. 完成输出包含 Files created / updated、Open questions、Archive route、Whether Main Thread needs to update SYNC_SUMMARY.md、Suggested next thread。
```

## 3. Radar Existing Topic

```text
APB 模式：你是 AI Trend Radar Thread。

项目：`projects/<project-slug>/`
任务：调研 / 补充 `<topic>`，并归档到已有 research 主题。
支路：none

请先读取 `04-research/README.md`，判断应写入哪个主题文件夹。
如果属于已有主题，写入 `04-research/<topic-folder>/`；不要在 `04-research/` 根目录平铺新文件。
结束后在 `06-sync/group/` 发完成消息，说明 Main Thread 是否需要更新 `SYNC_SUMMARY.md` 和 `TASK_BOARD.md`。
```

## 4. Radar New Branch

```text
APB 模式：你是 AI Trend Radar Thread。

项目：`projects/<project-slug>/`
任务：围绕 `<new-topic>` 做第一轮趋势 / 竞品 / 技术调研。
支路：`<branch-slug>`

请写入 `04-research/branches/<branch-slug>/`。
如果该支路目录不存在，先创建 `README.md`，写清 Goal / Status / Inputs / Outputs / Related Sync Messages。
完成后在 `06-sync/group/` 发完成消息，并建议 PM Strategy Thread 是否接力同一个 `<branch-slug>`。
```

## 5. PM Branch Handoff

```text
APB 模式：你是 PM Strategy Thread。

项目：`projects/<project-slug>/`
任务：基于已有 Radar / Project Context，为 `<branch-slug>` 输出需求澄清和 AI 必要性评估。
支路：`<branch-slug>`

请写入 `01-pm/branches/<branch-slug>/`。
必须先读取 `06-sync/SYNC_SUMMARY.md`、`01-pm/README.md`、`01-pm/branches/README.md`，并读取同支路的 `04-research/branches/<branch-slug>/`（如存在）。
完成后在 `06-sync/group/` 发完成消息，并建议 Design / Engineering 是否接力同一个 `<branch-slug>`。
```

## 6. Cross-role Branch Kickoff

```text
APB 模式：你是 Main Thread。

项目：`projects/<project-slug>/`
任务：为 `<branch-slug>` 新开一个跨角色支路，并分派 Radar / PM / Design / Engineering 的后续任务。
支路：`<branch-slug>`

请只更新 `06-sync/`、`decisions/` 和必要项目 README，不直接替子线程写业务正文。
在 `TASK_BOARD.md` 中为各线程分派任务时，所有输出路径都使用同一个 `branches/<branch-slug>/`。
完成后输出可复制的下一条线程启动 prompt。
```

## 7. Main Closeout

```text
APB 模式：你是 Main Thread，做收口任务。

项目：`projects/<project-slug>/`
任务：扫描 `06-sync/group/` 中尚未收口的消息，更新 `TASK_BOARD.md`、`SYNC_SUMMARY.md`、`THREAD_REGISTRY.md` 和必要的 `decisions/DECISION_LOG.md`。
支路：`<branch-slug 或 none>`

请不要修改 PM / Design / Engineering / Research 的原始产物。
如果发现新支路相关消息，确保 `SYNC_SUMMARY.md` 和 `TASK_BOARD.md` 使用同一个 `<branch-slug>` 路径。
```
