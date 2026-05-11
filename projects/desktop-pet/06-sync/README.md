# 06-sync — 项目级多线程通信层

## 1. 这是什么

`06-sync/` 是**项目级**多线程沟通区，用于 Main / PM / Design / Engineering / Radar 等线程之间交换状态、任务、问题与决策建议。

## 2. 重要边界

- **不是保密区**。所有线程都能读 `06-sync/` 任何子目录。
- **不允许**放密钥、token、API key、真实玩家数据、公司机密、未脱敏日志、合作方机密。
- 仅用于项目内部协调；跨项目沟通请回到 `memory/` 或独立项目目录。

## 3. 子结构

| 路径 | 用途 |
|---|---|
| `THREAD_REGISTRY.md` | 线程角色、读写区、状态、最后更新时间 |
| `TASK_BOARD.md` | 项目级任务分配与阻塞 |
| `SYNC_SUMMARY.md` | 项目级共享状态摘要（Main Thread 维护） |
| `group/` | 所有线程可见的公开消息（按文件落盘） |
| `dm/<from>-to-<to>/` | 线程间定向消息，**不是私密**，所有线程可读 |

## 4. 消息文件规范

`group/` 与 `dm/<from>-to-<to>/` 中每条消息**一个 Markdown 文件**，避免并发覆盖。

文件命名：

```
YYYY-MM-DDTHH-MM-SS_<thread>_<topic-slug>.md
```

例如：

```
2026-04-30T10-15-00_pm_prd-clarify-question.md
2026-04-30T11-22-30_radar_market-signal-summary.md
```

文件内容建议结构：

```markdown
# <Topic>

- From: <thread>
- To: <thread / all>
- Date: YYYY-MM-DD HH:MM
- Type: status / question / decision-proposal / blocker / handoff
- Related: <link to file or task>

## Context

## Message

## Asks / Next Action
```

## 5. SYNC_SUMMARY 维护规则

- 仅 Main Thread 写。
- 其他线程通过 `group/` 投递更新；Main 周期性合并到 `SYNC_SUMMARY.md`。
- `SYNC_SUMMARY.md` 应保持精炼，新线程启动时只读它即可对齐项目状态。
- 不要把所有 group/dm 原文堆进来；只摘录关键状态。

## 6. 何时启用

- 单线程项目可保留目录骨架，不必产生消息文件。
- 当真的有 ≥2 线程协作时，启用 `THREAD_REGISTRY.md` 登记线程，并开始向 `group/` 投递。

## 7. dm/ 命名规范

预置定向通道：

- `dm/main-to-pm/`
- `dm/pm-to-design/`
- `dm/pm-to-radar/`
- `dm/radar-to-pm/`
- `dm/design-to-engineering/`
- `dm/engineering-to-pm/`

新增组合需在 `THREAD_REGISTRY.md` 备注，文件夹命名一律 `<from>-to-<to>/`，全英文小写短横线。

## 8. Safety

- 不放敏感信息。
- 不放真实凭据 / 数据。
- 涉及生产 / 鉴权 / 隐私的信息只写"决策已发生"和"涉及范围"，具体凭据走环境变量与公司内部安全通道。
