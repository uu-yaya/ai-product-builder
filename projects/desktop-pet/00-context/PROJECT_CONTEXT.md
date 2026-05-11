# Project Context

> 本文件是 `desktop-pet` 项目的项目级事实基线。所有线程启动时应优先读取本文件，并把未确认信息保留为 Open Questions，不写成既定需求。

## Quick Reference

| Item | Content | Notes |
|---|---|---|
| Project Name | 桌面 AI 桌宠（Desktop Pet for Games） | Discovery 阶段项目名 |
| Project Slug | `desktop-pet` | 与 `projects/desktop-pet/` 目录名一致 |
| Project Stage | Discovery | 当前只完成初始上下文登记，需求、AI 方案、技术栈仍需澄清 |
| Owner | uu (Tencent IEG, AI PM) | Main Thread 持有人 |
| Start Date | 2026-04-28 | 用户提供 |
| Last Updated | 2026-04-28 | Main Thread 初始化 |

## 1. Project Name

桌面 AI 桌宠（Desktop Pet for Games）。

## 2. Project Slug

`desktop-pet`

## 3. Project Stage

Discovery。

阶段判断依据：当前项目从 `_PROJECT_TEMPLATE` 创建并完成基础上下文初始化，尚未完成 MVP 需求澄清、AI 必要性评估、技术栈选择、设计方向或工程计划。

## 4. Background

本项目探索一个以 AI 功能为主、非 AI 功能为辅的陪伴类桌宠 SDK / 平台：它不绑定单个游戏，而是作为“多游戏可配置桌宠 SDK”能力组件，允许不同游戏按类型、场景和集成深度快速配置桌宠能力，以降低上线成本、复用通用伴侣能力，并为多个游戏提供可扩展的 AI 陪伴入口。项目属于公司业务方向探索，所有 APB 产物仅记录脱敏后的产品框架、公开或抽象化信息与待确认问题，不写入公司机密、真实业务数据、内部代号、合作方信息、未脱敏日志或真实玩家数据。

## 5. Product Goal

方向性目标：让 AI 桌宠成为可被多个游戏快速集成的标准伴侣组件。

北极星指标仍为 TBD by user，并已登记到 Open Questions：

| Candidate Metric | Why It Matters | Status |
|---|---|---|
| 游戏内日活召唤次数 | 衡量玩家是否愿意持续触发桌宠互动 | Open |
| 玩家留存提升 | 衡量桌宠是否对游戏体验与长期价值有帮助 | Open |
| 游戏开发者集成时间缩短 | 衡量 SDK / 平台是否真正降低接入成本 | Open |
| 用户新提出指标 | 保留用户重新定义北极星目标的空间 | Open |

具体数值目标、统计口径、观察周期和成功阈值均未确定。

## 6. Target Users

| User Type | Persona | Needs | Status |
|---|---|---|---|
| 主要用户 | 游戏开发者：游戏 PM / 客户端工程师 / SDK 集成负责人 | 希望快速评估、配置、接入并上线桌宠能力，同时控制成本、稳定性、隐私与跨平台风险 | Initial assumption |
| 间接用户 | 游戏玩家 | 在游戏内或游戏外被桌宠触达，获得陪伴、提醒、召唤、反馈或娱乐体验 | Initial assumption |
| 反向用户 | 不需要桌面陪伴，或对桌面驻留、打扰、性能占用、隐私感知敏感的人 | 这类用户不应被默认强推桌宠常驻体验，需要关闭、降噪或不接入路径 | Initial assumption |

## 7. Core Scenarios

核心场景：TBD by user。

PM Strategy Thread 在 T-001 中需重点澄清以下 3 个候选方向：

| Scenario Candidate | One-line Framing | Status |
|---|---|---|
| 游戏内伴侣 | 玩家在游戏过程中通过桌宠获得陪伴、提示、反馈、情绪化互动或玩法辅助 | (候选，PM Thread 在 T-001 中确认) |
| 游戏外召唤 | 玩家在桌面环境中通过桌宠被召回、获得提醒、活动触达或轻量互动 | (候选，PM Thread 在 T-001 中确认) |
| 集成 SDK 流程 | 游戏团队通过配置化 SDK / 平台快速选择桌宠行为、AI 能力、素材与接入方式 | (候选，PM Thread 在 T-001 中确认) |

## 8. Key Features

以下功能均不是锁定需求，只作为 T-001 的输入候选：

| Priority | Feature | Description | Status |
|---|---|---|---|
| P0 | 多游戏配置框架 | 支持按游戏类型、触发场景、角色语气、功能开关配置桌宠能力 | (候选，PM Thread 在 T-001 中确认) |
| P0 | 桌宠基础运行与桌面驻留 | 支持桌面显示、基础动作、隐藏 / 显示、低打扰状态与退出路径 | (候选，PM Thread 在 T-001 中确认) |
| P0 | AI 对话 / 意图理解入口 | 支持玩家或游戏事件触发的基础 AI 互动，并明确安全边界和失败兜底 | (候选，PM Thread 在 T-001 中确认) |
| P1 | 游戏事件接入与响应 | 支持游戏侧事件触发桌宠动作、话术、提醒或上下文反馈 | (候选，PM Thread 在 T-001 中确认) |
| P1 | SDK 集成与开发者调试工具 | 支持开发者快速接入、配置预览、日志查看和问题定位 | (候选，PM Thread 在 T-001 中确认) |
| P1 | 隐私与数据边界配置 | 支持明确控制哪些数据不上传、哪些数据仅本地处理、哪些数据可脱敏使用 | (候选，PM Thread 在 T-001 中确认) |
| P2 | 个性化成长 / 记忆 | 支持在安全边界内形成玩家偏好、称呼、互动历史或成长感 | (候选，PM Thread 在 T-001 中确认) |
| P2 | 运营活动 / 召回模板 | 支持活动提醒、版本更新、签到、轻量任务等可配置运营触达 | (候选，PM Thread 在 T-001 中确认) |

## 9. AI Capabilities

是否使用 AI：已确认需要 AI；具体 AI 方案选择仍需由 PM Strategy Thread 在 `01-pm/AI_FEATURE_EVALUATION_desktop-pet-mvp.md` 中评估，不在本文件给推荐结论。

候选方案与适用边界：

| Candidate | Applicable Boundary | Main Risk |
|---|---|---|
| Rule-based | 适合固定触发、固定动作、固定话术、关闭 / 退出 / 状态切换等确定性体验 | 表现力有限，难以覆盖开放对话和复杂玩家意图 |
| Search | 适合从已授权、已脱敏、可索引资料中查找固定答案或配置说明 | 搜索结果质量依赖资料完整性，无法直接生成复杂行为策略 |
| RAG | 适合在安全知识边界内回答游戏说明、活动规则、SDK 文档或配置知识 | 知识库更新、权限隔离、召回准确率和幻觉控制需要评估 |
| LLM Prompt | 适合生成自然语言陪伴、轻量角色化反馈、情绪化表达和开放式互动 | 成本、延迟、输出稳定性、内容安全与可控性需要兜底 |
| Function Calling | 适合让 LLM 在明确权限内调用配置、状态查询、提醒、动作触发等工具 | 工具权限、错误处理、参数校验和越权风险需要严格控制 |
| Agent | 适合存在多步规划、工具调用、状态管理、跨场景连续任务的复杂体验 | 容易过度设计，成本、延迟、可解释性和失败恢复风险更高 |
| Workflow | 适合把多个确定步骤编排成可观测、可回滚的固定流程，如召回链路或集成向导 | 灵活性低于 Agent，流程设计过重会拖慢 MVP 验证 |
| Fine-tuning | 适合已有合规数据、稳定角色风格或垂直任务需要长期优化时再评估 | 数据合规、样本质量、训练成本和模型更新维护风险较高 |
| Recommendation System | 适合在拥有合规行为数据后推荐互动时机、内容模板或召回策略 | 需要数据规模和评估闭环，早期可能数据不足且隐私边界敏感 |

AI_FEATURE_EVALUATION 需要进一步明确：数据来源、知识边界、成本、延迟、可解释性、安全、人类兜底、评估指标和失败处理。

## 10. Design Direction

Design direction 尚未进入本次初始化范围。后续需在 PM 输出需求澄清后，由 Design Prototype Thread 判断桌宠视觉风格、桌面驻留交互、低打扰机制、关闭路径和跨平台体验约束。

## 11. Tech Stack

TBD by user。

待评估方向已登记到 Open Questions：Electron / Tauri / 原生客户端 / 其他跨平台方案。

## 12. Current Status

当前正在做：项目初始化已完成，下一步由 PM Strategy Thread 接手 T-001。

已完成的关键产出：项目目录已存在；Main Thread 已补齐 `00-context/PROJECT_CONTEXT.md`、`06-sync/` 三件套和 `decisions/DECISION_LOG.md`。

当前阻塞项：MVP 需求澄清、AI 必要性评估、北极星指标、核心场景、技术栈、数据隐私边界和商业模式均未确认。

## 13. Constraints

| Constraint | Detail | Status |
|---|---|---|
| 公司业务边界 | 项目是公司业务方向探索，但 APB 文件不写入公司机密、真实业务数据、内部代号、合作方信息、IP 授权细节或未脱敏日志 | Active |
| 不上传敏感数据 | 不上传真实玩家数据、公司敏感数据、未脱敏日志、token / API key / secret | Active |
| 跨平台 | 需要支持 Mac + Windows；未来可能 Linux | Active |
| 推进节奏 | TBD by user | Open |

## 14. Open Questions

| # | Question | Owner | Status | Due |
|---|---|---|---|---|
| 1 | 北极星指标应选择游戏内日活召唤次数、玩家留存提升、游戏开发者集成时间缩短，还是用户新提出指标？ | User + PM Strategy Thread | Open | T-001 |
| 2 | 核心场景应优先聚焦游戏内伴侣、游戏外召唤、集成 SDK 流程，还是三者组合？ | User + PM Strategy Thread | Open | T-001 |
| 3 | AI 方案应在 Rule-based、Search、RAG、LLM Prompt、Function Calling、Agent、Workflow、Fine-tuning、Recommendation System 中如何分层选择？ | PM Strategy Thread | Open | T-001 |
| 4 | Tech Stack 应选择 Electron、Tauri、原生客户端，还是其他跨平台方案？ | User + Engineering Build Thread | Open | After T-001 |
| 5 | Distribution 模式应是直接发布桌面应用、SDK 嵌入游戏、内部分发验证，还是多模式并行？ | User + PM Strategy Thread | Open | T-001 |
| 6 | 数据隐私边界应如何定义：完全不上传、脱敏后上传、仅本地推理、混合方案，分别覆盖哪些能力？ | User + PM Strategy Thread + Engineering Build Thread | Open | T-001 |
| 7 | 商业模式应是免费、收费、内部使用、平台能力沉淀，还是其他路径？ | User + PM Strategy Thread | Open | T-001 |
| 8 | MVP 首批目标游戏类型应如何选择，是否按品类、玩家场景、接入复杂度或 AI 价值排序？ | User + PM Strategy Thread | Open | T-001 |
| 9 | 玩家反感桌面驻留、打扰、性能占用或隐私感知时，产品应提供哪些关闭、降噪和透明控制机制？ | PM Strategy Thread + Design Prototype Thread | Open | After T-001 |
| 10 | 推进节奏、验证周期、可投入人力、预算和算力边界是什么？ | User | Open | T-001 |
| 11 | Key Features 中哪些 P0 / P1 / P2 候选功能应进入 desktop-pet MVP，哪些应延期或删除？ | PM Strategy Thread + User | Open | T-001 |

## 15. Related Links

Placeholder: none recorded.
