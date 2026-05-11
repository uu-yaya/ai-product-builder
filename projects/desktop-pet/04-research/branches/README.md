# Research Branches

## Purpose

本目录用于同一 project 下的新问题支路。每个支路使用一个英文小写短横线 `<branch-slug>`，并与其他角色目录保持同名。

## Folder Pattern

```text
04-research/branches/<branch-slug>/
```

推荐每个支路包含：

- `README.md`：支路目标、状态、上游输入、下游交付。
- `TREND_RESEARCH_<topic-slug>.md`：专题趋势或产品研究。
- `COMPETITOR_ANALYSIS_<topic-slug>.md`：竞品或对标研究。
- `SOURCE_LOG_<topic-slug>.md`：来源与证据记录，适合较长研究。

## Cross-role Alignment

同一支路在各角色目录中使用同一个 `<branch-slug>`：

| Role | Path |
|---|---|
| PM Strategy | `01-pm/branches/<branch-slug>/` |
| Design Prototype | `02-design/branches/<branch-slug>/` |
| Engineering Build | `03-engineering/branches/<branch-slug>/` |
| AI Trend Radar | `04-research/branches/<branch-slug>/` |

支路状态与跨线程结论仍通过 `06-sync/group/` 投递，由 Main Thread 收口到 `06-sync/SYNC_SUMMARY.md`。
