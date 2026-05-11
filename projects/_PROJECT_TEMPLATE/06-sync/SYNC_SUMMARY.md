# Sync Summary

> Main Thread 维护。其他线程**启动时优先读取本文件**，而不是回看所有 `group/` 与 `dm/` 历史。
>
> 不要在这里粘贴所有消息原文；只摘录关键状态与链接。

Last Updated: YYYY-MM-DD

## 1. Current Project State

- 项目阶段（Discovery / PRD / Design / MVP / Beta / Launched / Sunset）
- 一句话当前状态摘要
- 主线程持有人 / 主要协作线程

## 2. Latest Decisions

| Date | Decision | Source |
|---|---|---|
| YYYY-MM-DD | <一句话决策> | `decisions/DECISION_LOG.md#<anchor>` 或 `06-sync/group/<file>.md` |

## 3. Open Questions

| # | Question | Owner Thread | Status |
|---|---|---|---|
| 1 |  |  | Open |

## 4. Active Tasks

引用 `TASK_BOARD.md` 中处于 In Progress 与 Blocked 状态的任务（精简版）：

| Task ID | Owner | Task | Status |
|---|---|---|---|

## 5. Blockers

按严重度排列：

- P0：阻塞整个项目推进
- P1：阻塞某个线程
- P2：可绕过但需关注

## 6. Next Actions

- 即将发生的关键动作（按时间或线程列）
- 每条标注负责线程

## 7. Links to Important Messages

只列里程碑级 group / dm 消息，不要全量复制：

| Topic | File | Date |
|---|---|---|
|  | `06-sync/group/<file>.md` | YYYY-MM-DD |

## 维护规则

- Main Thread 应在每个工作日（或每次有新决策 / 阻塞产生时）更新本文件。
- 不要让 `SYNC_SUMMARY.md` 变成长文档；超过 3 屏时归档当前快照到 `06-sync/group/<date>_sync-summary-snapshot.md`，再精简正文。
- 不要存放凭据 / 真实玩家数据 / 未脱敏日志。
