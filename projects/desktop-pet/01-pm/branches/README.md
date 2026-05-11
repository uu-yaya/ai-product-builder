# PM Branches

## Purpose

本目录用于同一 project 下的 PM 新问题支路。每个支路使用一个英文小写短横线 `<branch-slug>`，并与 Design / Engineering / Research 目录保持同名。

## Folder Pattern

```text
01-pm/branches/<branch-slug>/
```

推荐每个支路包含：

- `README.md`：支路目标、状态、核心决策、相关同步消息。
- `REQUIREMENT_CLARIFICATION_<feature-slug>.md`
- `PRD_<feature-slug>.md`
- `AI_FEATURE_EVALUATION_<feature-slug>.md`
- `REQUIREMENT_PRIORITY_<scope-slug>.md`

PM 支路产物如果成为项目级默认事实，Main Thread 需要在 `06-sync/SYNC_SUMMARY.md` 和 `decisions/DECISION_LOG.md` 收口。
