# Design Branches

## Purpose

本目录用于同一 project 下的 Design 新问题支路。每个支路使用一个英文小写短横线 `<branch-slug>`，并与 PM / Engineering / Research 目录保持同名。

## Folder Pattern

```text
02-design/branches/<branch-slug>/
```

推荐每个支路包含：

- `README.md`：支路目标、状态、上游 PM 输入、下游工程交付。
- `DESIGN_BRIEF_<feature-slug>.md`
- `FIGMA_PROMPT_<feature-slug>.md`
- `HIGH_FIDELITY_PROTOTYPE_<feature-slug>.md`
- `DESIGN_HANDOFF_<feature-slug>.md`

Design 支路不要覆盖 PM 或 Engineering 文件；跨线程问题写入 `05-reviews/` 或 `06-sync/group/`。
