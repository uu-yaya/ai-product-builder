# Project Context

> 复制 `_PROJECT_TEMPLATE` 后，**第一件事就是填写本文件**。所有线程都会优先读它。

## Quick Reference

| Item | Content | Notes |
|---|---|---|
| Project Name | <项目中文 / 英文名> | |
| Project Slug | `<project-slug>` | 英文小写短横线，例如 `game-ai-npc-toolkit` |
| Project Stage | Discovery / PRD / Design / MVP / Beta / Launched / Sunset | |
| Owner | <负责人 / Main Thread 持有者> | |
| Start Date | YYYY-MM-DD | |
| Last Updated | YYYY-MM-DD | |

## 1. Project Name

填写项目正式名称（中英对照），以及当前是否仍处于代号阶段。

## 2. Project Slug

填写 `<project-slug>`，必须与 `projects/<project-slug>/` 目录名一致。

## 3. Project Stage

当前阶段：Discovery / PRD / Design / MVP / Beta / Launched / Sunset。
说明阶段判断依据（例如已完成 PRD 评审、已交付高保真原型、已进入灰度）。

## 4. Background

- 项目起源 / 触发事件
- 业务背景（市场、用户群、技术能力变化等）
- 与其他项目 / 平台 / 工作流的关系

## 5. Product Goal

- 北极星目标
- 业务目标（数值化越好）
- 非目标（明确不做什么）

## 6. Target Users

- 主要用户画像（链接到 `USER_PERSONA.md`）
- 次要用户
- 反向用户（不为谁服务）

## 7. Core Scenarios

- 关键使用场景（用一句话描述每个场景的触发、动作、结果）
- 高频场景 vs 低频高价值场景

## 8. Key Features

- 核心功能清单（每条一句话，不要展开 PRD）
- 标注 P0 / P1 / P2

## 9. AI Capabilities

- 是否使用 AI（必须先回答"是否真的需要 AI"）
- 选择的方案（Rule-based / Search / RAG / LLM Prompt / Function Calling / Agent / Workflow / Fine-tuning / 推荐系统）
- 数据来源、知识边界、成本、延迟、可解释性、安全、人工兜底
- 评估指标与失败处理

## 10. Design Direction

- 视觉风格关键词
- 信息架构假设
- 平台 / 设备 / 输入方式
- 参考产品（提炼模式，不照抄）

## 11. Tech Stack

- 前端
- 后端
- 数据存储
- AI / 模型 / 工具调用
- 部署 / 灰度 / 监控
- 已有可复用模块

## 12. Current Status

- 当前正在做什么
- 已完成的关键产出
- 阻塞项

## 13. Constraints

- 时间
- 资源（人力、预算、算力）
- 数据可得性
- 合规 / 隐私 / 内容安全
- 技术可行性

## 14. Open Questions

| # | Question | Owner | Status | Due |
|---|---|---|---|---|
| 1 |  |  | Open |  |

## 15. Related Links

详见 `00-context/LINKS.md`。
