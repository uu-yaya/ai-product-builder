# Engineering Branches

## Purpose

本目录用于同一 project 下的 Engineering 新问题支路。每个支路使用一个英文小写短横线 `<branch-slug>`，并与 PM / Design / Research 目录保持同名。

## Folder Pattern

```text
03-engineering/branches/<branch-slug>/
```

推荐每个支路包含：

- `README.md`：支路目标、状态、依赖、风险、测试方式。
- `MVP_BUILD_PLAN_<feature-slug>.md`
- `API_PLAN_<feature-slug>.md`
- `DATA_MODEL_<feature-slug>.md`
- `AI_INTEGRATION_<feature-slug>.md`
- `TEST_CASES_<feature-slug>.md`
- `LAUNCH_CHECKLIST_<feature-slug>.md`

Engineering 支路不得写入真实生产配置、token、密钥或未脱敏日志。
