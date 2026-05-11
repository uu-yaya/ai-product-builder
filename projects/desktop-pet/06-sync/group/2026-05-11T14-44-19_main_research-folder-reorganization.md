# Main Thread Closeout: Research Folder Reorganization

Date: 2026-05-11
Thread: Main Thread
Topic: Reorganize `04-research/` and define branch folder convention

## Scope

按用户要求整理 `projects/desktop-pet/04-research/`：同一研究任务 / 同一问题域放到同一文件夹，并支持同一 project 内后续开启不同问题支路。

## Directory Changes

`04-research/` 现在按主题组织：

| Folder | Scope |
|---|---|
| `companion-product-market/` | 桌宠 / AI companion 市场、竞品矩阵、功能点总结 |
| `steam-and-embedded-companion/` | Steam 桌宠、免费 / 开源、游戏内嵌伴侣和 Steam 对标 |
| `performance-benchmark/` | 性能研究、性能指标学习、测试方法论、CSV 模板 |
| `context-memory-frameworks/` | PC 上下文采集与记忆系统框架 |
| `asset-generation/` | 自定义桌宠素材生成与 Codex Skill 实现参考 |
| `branches/` | 未来 Research 新问题支路入口 |

## Branch Convention

同一 project 内的新问题支路统一使用：

```text
01-pm/branches/<branch-slug>/
02-design/branches/<branch-slug>/
03-engineering/branches/<branch-slug>/
04-research/branches/<branch-slug>/
```

同一个 `<branch-slug>` 必须跨角色保持一致。每个支路文件夹建议先创建 `README.md`，说明 Goal、Status、Owner Thread、Inputs、Outputs 和 Related Sync Messages。

## Main Thread Updates

- 更新 `PROJECT_RULES.md`，新增 Branch Folder Rules。
- 更新 `04-research/README.md`，加入当前研究主题文件夹索引。
- 为每个研究主题文件夹新增 `README.md`。
- 新增 `01-pm/branches/README.md`、`02-design/branches/README.md`、`03-engineering/branches/README.md`、`04-research/branches/README.md`。
- 更新 `06-sync/TASK_BOARD.md`，新增 `T-020` 并标记 Done。
- 更新 `06-sync/SYNC_SUMMARY.md` 中活跃路径，避免新线程继续读取旧的平铺路径。

## Not Changed

- 未修改研究文档正文结论。
- 未修改 PM / Design / Engineering 已有业务正文。
- 未删除历史 `06-sync/group/` 消息；历史消息里的旧路径保留为当时记录，当前入口以 `04-research/README.md` 和 `SYNC_SUMMARY.md` 为准。
