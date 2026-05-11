# Thread Start Prompts

## Purpose

本目录存放 APB 多线程启动 prompt。正式模板适合完整复制；quick prompts 适合日常快速开线程。

## Prompt Index

| File | Use Case |
|---|---|
| `NEW_PROJECT_INIT.md` | 首次创建并初始化一个新 APB project |
| `MAIN_THREAD_START.md` | 启动 / 恢复 Main Thread，做分派、收口、同步维护 |
| `PM_THREAD_START.md` | 启动 PM Strategy Thread，做需求、PRD、AI 必要性评估 |
| `DESIGN_THREAD_START.md` | 启动 Design Prototype Thread，做设计简报、原型、handoff |
| `ENGINEERING_THREAD_START.md` | 启动 Engineering Build Thread，做工程计划、AI 集成、测试和上线清单 |
| `RADAR_THREAD_START.md` | 启动 AI Trend Radar Thread，做趋势、竞品、技术调研 |
| `BRANCH_AWARE_QUICK_PROMPTS.md` | 日常短 prompt，支持主题文件夹和 `branches/<branch-slug>/` |

## Branch-aware Usage

旧 prompt 仍然可用。新结构下建议在任务中补一行：

```text
支路：<branch-slug 或 none>
```

填写规则：

| Situation | Value |
|---|---|
| 项目默认主线 | `none` |
| 同一 project 下的新产品问题 / 新方向 / 平行验证 | 英文小写短横线，例如 `embedded-companion-mvp` |

如果 `支路` 不是 `none`，PM / Design / Engineering / Research 应使用同一个 `<branch-slug>`，分别写入：

```text
01-pm/branches/<branch-slug>/
02-design/branches/<branch-slug>/
03-engineering/branches/<branch-slug>/
04-research/branches/<branch-slug>/
```

Radar 对已有研究主题的补充不一定要开 branch，应优先读取 `04-research/README.md` 并写入对应主题文件夹。
