# 桌宠数据需求规格说明书

> **适用范围**：通用游戏桌宠 `desktop-pet` 
> ​记忆系统数据需求
> **数据与隐私边界**：详见 §1.2

---

## 目录

- [§1 背景](#1-背景)
- [§2 数据需求总览](#2-数据需求总览)
- [§3 数据需求详解](#3-数据需求详解)
- [§4 数据与隐私边界关系汇总](#4-数据与隐私边界关系汇总)

---

## 1. 背景

### 1.1 项目定位

`desktop-pet` 是面向多游戏合作场景的通用游戏桌宠产品。一个用户在一款游戏中拥有一个桌宠，桌宠以游戏搭子为核心能力，通过理解用户的`游戏偏好`、`雷点`、`水平`、`目标`、`进度`和`互动习惯`，提供陪玩、建议、指导、复盘、庆祝、安慰与日记等体验；同时通过长期记忆和用户偏好配置，形成更贴近用户期待的陪伴关系。不同游戏接入后，可在统一数据框架下，按该游戏可授权、可获取的数据进一步细化游戏事件、进度、角色、玩法和内容语义。

本文件的职责是回答"桌宠需要什么数据"，即记忆系统应为桌宠体验提供哪些可采集、可整理、可查询、可删除、可更正的数据契约。

### 1.2 数据与隐私边界

本节定义桌宠可使用、需授权使用、只保留语义结果、以及禁止采集 / 回写的数据范围。任何字段、模型分析或回写结果都不能绕过用户授权、删除策略和用户更正。

#### 1.2.1 核心业务数据

| 数据类别 | 典型数据 | 使用边界 |
| --- | --- | --- |
| 用户显式配置与控制 | 基础称呼、桌宠关系偏好、打扰边界、内容偏好、用户反馈 | 用户最高优先级；大模型不能自动开启授权、改变删除策略或覆盖用户更正 |
| 游戏数据 | 合作游戏事件、游戏状态 / 进度数据 idip、成就、对局状态、失败 / 卡点、游戏目标 | 仅来自合作游戏授权数据；不含实名信息、付费记录、真实账号标识 |
| 桌宠交互数据 | 用户与桌宠的对话、用户保存的日记 / 高光、用户对内容和画像的反馈、重新总结请求 | 用户可删除、可更正、可要求重新总结；引用用户原话需要单独授权和个人身份信息检测 |
| 角色相似度测定结果 | 匹配角色、命中特点、未命中特点、证据 ID、测定时间、用户反馈 | 用户主动触发并同意本次测定后生成；结果必须回写，且可删除、反馈、重测；默认不反向驱动日常陪伴策略 |

#### 1.2.2 授权增强数据

| 数据类别 | 典型数据 | 使用边界 |
| --- | --- | --- |
| 低敏 PC context | 活跃app、脱敏窗口标题、全屏状态、空闲状态、输入强度桶、app 切换频率 | 默认关闭或按场景最小启用；不记录输入内容，不读取 app 正文 |
| MCP app 信号 | 用户授权 app 的任务数量、状态摘要、任务标题、app 自生成摘要、游戏平台元数据、可公开活动摘要 | 默认关闭；按 app 授权；字段白名单固定；不读取第三方聊天、邮件、文档、会议正文 |
| 当前窗口画面理解 | 用户授权当前 app / 游戏窗口的短期视觉 buffer、场景语义标签、用户可见摘要 | 默认关闭；按 app 开启；启用时必须有可见状态；不保存原图 |
| 系统音频音乐 / 氛围感知 | 音乐类型、播放氛围、音量 / 节奏等低敏语义 | 扩展能力；默认关闭；进入产品范围前需明确采集方式、短期缓存边界、可见状态和删除路径 |
| 产品内模型分析处理 | 基于已授权数据生成 AI 推断画像项、语义标签、日记 / 复盘草稿、角色相似度结果 | 用户不配置模型供应商或模型参数；只能使用已授权、最小必要的数据；输出必须受 schema、证据和删除策略约束 |

#### 1.2.3 语义结果保留边界

| 输入类型 | 可保留结果 | 不保留内容 |
|---|---|---|
| VLM 前台画面 | 场景标签、用户可见摘要、用于复盘 / 高光解释的语义结果 | 原图、连续截图、后台全屏截图 |
| 系统音频 | 音乐 / 音频氛围等低敏语义 | 原始音频、人声内容、转写文本、通话 / 会议内容 |
| 低敏 OS context | active app、脱敏窗口标题、输入强度桶、空闲状态、app 切换统计 | raw OS context、文件路径、用户名、窗口全文、输入内容 |
| MCP app 信号 | app 元数据、状态摘要、任务标题、通过来源校验的 app 自生成摘要 | 第三方聊天、邮件、文档、会议正文、附件内容、未授权 app 数据 |
| 产品内模型分析 | AI 推断画像项、置信度、证据 ID、角色相似度结果、用户反馈记录 | 未授权原文、未脱敏 payload、模型自由编造的证据 |

#### 1.2.4 禁止采集与回写数据

| 数据 / 行为 | 边界 |
|---|---|
| Recall 式后台全屏截图 / Recall 数据源 | 不使用 Recall 作为数据源；不做后台持续全屏截图 |
| 键盘输入内容 | 不记录按键字符、输入文本、keylog；只允许输入强度、节奏等低敏统计 |
| 第三方聊天 / 邮件 / 文档 / 会议正文 | 不读取、不长期保存、不进入画像；MCP 只允许授权 app 的白名单字段和通过来源校验的摘要 |
| 原始截图 / 原始系统音频 / raw OS context | 不进入长期记忆，不上传，不作为模型训练数据 |
| 人声内容 / 转写文本 / 通话 / 会议内容 | 不采集、不转写、不回写 |
| 未授权 IP 信息 / 敏感业务信息 | 不写入记忆、提示词、日志、测定结果或展示文案 |

### 1.3 桌宠与记忆系统的数据循环原则

本文只定义桌宠体验需要的数据，不展开记忆系统的内部实现。桌宠与记忆系统之间是持续循环：读取数据、生成体验、接收反馈、更新记忆。

#### 1.3.1 五类数据循环

| 类别 | 数据方向 | 典型数据 | 责任边界 |
| --- | --- | --- | --- |
| **用户显式配置与控制** | 用户 → 记忆系统 → 桌宠读取 | 基础称呼、桌宠关系偏好、打扰边界、内容偏好、用户反馈 | 用户最高优先级；大模型不能自动开启授权或覆盖用户更正 |
| **记忆系统供给数据** | 记忆系统 → 桌宠 | 用户画像、长期记忆、聊天摘要、游戏进度、成就、高光、授权上下文、来源与证据 | 桌宠只能在授权范围内读取；每条可解释数据应能追溯来源或证据 |
| **桌宠侧实时生成数据** | 桌宠 / 产品内大模型服务 → 当前体验 | 实时对话、游戏建议、打扰判断、复盘草稿、日记草稿、当前上下文、VLM 语义标签 | 默认只服务当前体验；VLM 语义标签只保留语义结果，不保存原图；需要长期引用时才进入回写 |
| **桌宠回写记忆数据** | 桌宠 → 记忆系统 | 对话记录、用户反馈、用户更正、AI 推断画像项、保存的日记 / 高光、角色相似度测定结果、删除 / 重新总结请求 | 回写必须带来源、时间、证据、授权快照或用户动作；角色相似度结果必须回写，便于查看、删除、反馈、重测 |
| **不进入记忆循环的数据** | 不采 / 不存 / 不回写 | 原始截图、原始系统音频、人声内容 / 转写文本、通话 / 会议内容、键盘输入内容、第三方聊天 / 邮件 / 文档正文、raw OS context、未授权 IP 信息、敏感业务信息 | 只允许在明确授权和最小化处理后使用必要语义结果，不保留原始内容 |

#### 1.3.2 写入与更新原则

1. 用户显式配置、授权、删除、清空、重新总结、更正操作永远最高优先级。
2. 桌宠侧实时生成的数据选择进入长期记忆，用户保存、用户反馈、用户更正、AI 推断画像项、高光、角色相似度结果等明确属于回写范围的数据才进入记忆系统。
3. AI 推断画像项可以由产品内大模型基于授权数据生成，但必须带来源、证据、置信度和可更正路径；用户更正后不得被自动覆盖。
4. VLM 语义标签归入桌宠侧实时生成数据，只在需要长期引用、复盘或高光解释时回写语义结果；原图不回写。
5. 系统音频若进入未来范围，只允许用户授权后提取音乐 / 音频氛围等低敏语义；原始音频、人声转写、通话 / 会议内容不回写。
6. 游戏角色相似度测定由产品内大模型基于用户主动触发且已授权的数据分析生成，结果必须回写记忆系统；默认不影响日常陪伴策略，除非用户允许用于陪伴。
7. 授权、删除、清空、重新总结和用户更正只能由用户触发；任何大模型或后台任务都不能默默开启授权或改变删除策略。

## 2. 数据需求总览

### 2.1 模块全景表

> "数据方向"列描述桌宠与记忆系统之间的数据循环；"支持体验"列说明该数据为什么对用户有价值。

| 章节 | 模块 | 数据源 | 支持体验 | 数据与隐私边界 | 优先级 |
| --- | --- | --- | --- | --- | --- |
| § 3.1 | 聊天数据 chat | 用户与桌宠对话回写 + 记忆系统供给摘要 / 原子事实 | 陪伴对话、AI 推断画像项、日记 / 高光素材 | 只读用户和桌宠的对话；不读用户第三方 IM / 邮件；含个人身份信息的原话不引用进日记 | **P0** |
| § 3.2 | 行为数据 - PC 进程 | 记忆系统供给低敏 OS 信号 | 判断用户是否在游戏 / 工作 / 离开，避免乱打扰 | 只看用户在用什么 app；不读 app 内容 | **P0** |
| § 3.3 | 行为数据 - UI & 用户操作 | 记忆系统供给低敏信号 + 桌宠侧实时生成状态 | 打扰判断、当前状态理解、界面提示理解 | 不记录用户按了什么键；窗口标题去除文件名 / 路径 / 用户名；界面文字读取需单独授权 | **P0** |
| § 3.4 | APP 信号源 - MCP 通道 | 用户授权后由记忆系统供给 app 元数据 / 摘要 | 任务 / 平台状态提醒、跨 app 轻量上下文 | 仅 app 元数据 / 摘要；**不读消息 / 邮件 / 文档正文** | **P1** |
| § 3.5 | 游戏状态 / 进度数据 idip | 合作游戏数据进入记忆系统，供桌宠读取 / 复盘 | 理解等级、段位、任务进度、卡点和突破 | 首方游戏数据；不存真实账号 / 付费记录 / 实名信息；`idip` 指合作游戏声明的状态字段 | **P0** |
| § 3.6 | 游戏数据 - 实时事件 | 合作游戏实时事件进入记忆系统，供桌宠即时反应 | 对局中建议、死亡 / 通关 / 结算反应、赛后复盘 | 首方游戏 SDK 推送的事件流 | **P0** |
| § 3.7 | 当前窗口画面理解 VLM | 桌宠侧实时生成语义标签；必要时只回写语义结果 | 识别当前游戏场景，支持即时吐槽、提醒、高光解释 | 用户单 app 显式开启（默认关）；只看当前授权游戏窗口；不存原图；产品内模型分析处理需遵守授权范围 + 每次可见状态指示 | **P1** |
| § 3.8 | 当前上下文 current_context | 桌宠侧实时生成，短期服务当前体验 | 判断现在该不该说话、说什么、用什么力度 | 派生切面（仅状态标签，不存原始内容） | **P0** |
| § 3.9 | profile_meta | 记忆系统供给来源 / 证据 / 置信度；桌宠可回写用户反馈 | 解释"为什么这么懂我"，支撑用户更正 | 每条画像标证据来源、生成方式和证据 ID；用户改过的不再自动覆盖 | **P0** |
| § 3.10 | 用户画像 profile | 记忆系统供给长期画像；桌宠回写 AI 推断画像项 / 用户更正 | 长期个性化陪伴、建议、复盘、内容雷点规避 | 不含个人身份信息；用户更正后 AI 不再覆盖 | **P0** |
| § 3.11 | 高光事件 highlight_event | 桌宠侧生成建议；用户保存 / 编辑后回写记忆系统 | 保存成就、成长节点、可分享记忆、日记素材 | 引用对话原文要先过个人身份信息检测；用户标"私密"的不进分享卡片 | **P1** |
| § 3.12 | 用户偏好与隐私控制 user_preferences | 用户显式配置与控制，记忆系统持久化，桌宠读取执行 | 让用户控制怎么陪、记什么、删什么、哪里不准 | 授权默认关；必须用户主动勾选才开启；含删除 / 清空 / 重新总结 / 用户更正；AI 不准自动设置 | **P0** |
| § 3.13 | 游戏角色相似度测定 game_character_similarity_assessment | 产品内大模型基于授权数据生成；结果必须回写记忆系统 | 核心卖点：告诉用户像哪个游戏角色，以及像在哪里 | 用户主动触发并同意本次测定后调用；只能使用授权画像子集 + 该游戏授权角色体系；测定结果默认不驱动陪伴策略 | **P1** |

### 2.2 用户开关与控制项

| 开关 / 控制项 | 用途 | 默认 | 优先级 |
| --- | --- | --- | --- |
| 聊天入长期记忆 | 允许用户与桌宠的首方对话进入长期记忆 | 首启询问；未选择 = 关 | P0 |
| 游戏事件长期画像 | 首方 game_event / idip 可用于进度、成就、目标画像 | 核心实时反应可用；长期画像写入可关 | P0 |
| AI 推断画像项生成 | 允许产品内大模型基于授权数据整理用户画像字段 | 首启询问；用户可暂停 | P0 |
| 记忆管理 | 删除对话 / 日记 / 高光 / 画像字段，清空画像，重新总结我，以后别这样记 | 始终可用 | P0 |
| 基础陪伴偏好 | 设置打扰强度、复盘颗粒度、失败后是否想复盘等基础偏好 | 首启可选；未设置走保守默认 | P0 |
| 行为数据画像 | OS 低敏行为信号可用于打扰判断 / 玩法风格推断 | 关 | P1 |
| 当前窗口画面理解 | 桌宠理解当前授权游戏窗口画面，生成场景标签和用户可见摘要 | 关；按 app 开启 | P1 |
| 当前窗口界面文字读取 | 桌宠读取当前授权窗口中的按钮、弹窗、游戏提示等界面文字 | 关；按 app 开启 | P1 |
| MCP app 接入 | 启用 MCP app 列表（用户单 app 勾选） | 关 | P1 |
| 日记 / 高光生成 | 允许桌宠生成日记草稿、高光摘要和分享文案 | 关；用户开启或保存时触发 | P1 |
| 角色相似度测定 | 调用产品内大模型服务，基于授权数据生成"像哪个游戏角色"结果 | 关；用户主动触发 | P1 |
| 系统音频音乐 / 氛围感知 | 扩展能力；只允许提取音乐 / 音频氛围等低敏语义 | 关 | 扩展 |

- 产品内模型分析处理不是独立用户开关。用户授权的是具体能力，例如 AI 推断画像项生成、当前窗口画面理解、日记 / 高光生成、MCP app 摘要理解和角色相似度测定。用户不配置模型供应商或模型参数。

- 当前窗口画面理解、界面文字读取、MCP、系统音频默认关闭，仅在用户主动开启后生效。角色相似度测定由用户主动触发并同意后调用，不做后台自动重测。所有配置只作用于当前桌宠绑定的单一游戏实例，不跨游戏共享画像。

### 2.3 优先级总览

P0 是首版体验成立所需的最小数据闭环：桌宠能理解用户偏好、雷点、水平和进度，用户也能控制记什么、哪里不准、哪些要删。

| 闭环环节 | P0 范围 | 对应模块 |
| --- | --- | --- |
| 交互记忆 | 用户与桌宠对话、原子事实、情节摘要 | § 3.1 / § 3.9 |
| 低敏状态判断 | active app、全屏、脱敏窗口标题、输入强度桶、空闲状态 | § 3.2 / § 3.3 / § 3.8 |
| 游戏理解 | idip 状态快照 + 字段语义配置、各游戏声明的 P0 最小 game_event 事件集（覆盖生命周期、结果、进度 / 目标、失败 / 成功等）；深度变化 / 卡点 / 里程碑作为增强 | § 3.5 / § 3.6 |
| 用户画像核心 | 基础称呼、桌宠关系偏好、游戏偏好、雷点、目标、当前卡点、玩法风格、基础陪伴偏好 | § 3.10 / § 3.12 |
| AI 推断画像项 | 基于授权聊天、游戏事件和低敏状态生成画像字段，必须带来源、证据、置信度和可更正路径 | § 3.9 / § 3.10 / § 3.12 |
| 用户控制 | 授权、关闭、删除、清空、用户更正、重新总结我、以后别这样记 | § 3.12 |

| 优先级 | 模块 |
|---|---|
| **P0** | § 3.1 chat / § 3.2 PC 进程 / § 3.3 行为 P0 子集 / § 3.5 idip P0 子集（`idip_snapshot` + `idip_field_metadata`）/ § 3.6 实时事件 / § 3.8 current_context / § 3.9 profile_meta / § 3.10 用户画像核心字段 / § 3.12 用户基础控制 |
| **P1** | § 3.3 行为增强字段 / § 3.4 MCP / § 3.5 idip 增强字段（`idip_delta` / `idip_anomaly` / `idip_milestone`）/ § 3.7 当前窗口画面理解 VLM / § 3.10 用户画像扩展字段 / § 3.11 高光 / § 3.12 增强偏好与授权 / § 3.13 角色相似度测定 |

---

## 3. 数据需求详解

> 每节结构：说明 / 字段表 / Schema 示例。

---

### 3.1 聊天数据 chat

聊天数据用于沉淀原子事实、情节摘要和用户画像。用户关闭"聊天入长期记忆"后，仍可实时聊天和查看对话历史，但不再新增长期记忆。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `chat_text` | 聊天原文 | `"刚才那把翻盘了！"` | 记忆系统 | 桌宠 chat runtime 直采（首方对话 only；不读第三方 IM / 邮件 / 任何外部聊天记录）；允许保存为首方对话历史 | 首方对话 only；不读第三方 IM / 邮件；用户可按消息 / 会话删除 | P0 | 对话历史、实时上下文 |
| 2 | `atomic_facts[]` | 原子事实 | `[{fact:"用户喜欢稳定策略", quote_eligible:true}]` | Memory Intelligence | **Memory Subagent**：AI 抽取；**触发**：chat segment 闭合 + `privacy_grants.chat_content=true`；**输出 schema 约束**：`{fact, quote_eligible, meta}`；结果写回 memory 持久化 | 引用必须 `quote_eligible=true`；关闭聊天入长期记忆后不新增 | P0 | 短期对话引用 |
| 3a | `episode.title` | 情节标题 | `"讨论刺客职业天赋树调整"` | Memory Intelligence | **Memory Subagent**：AI 摘要；**触发**：chat segment 闭合 + `privacy_grants.chat_content=true`；聚合 N 条 atomic_facts → 摘要为 1 个 episode；写回 memory 持久化 | 同 atomic_facts | P0 | 跨日召回 |
| 3b | `episode.content` | 情节内容 | `"用户和桌宠讨论了刺客天赋..."` | Memory Intelligence | ↑ 同上 | 同 atomic_facts | P0 | ↑ 同上 |
| 3c | `episode.time_range` | 时间范围 | `{start: "2026-04-21T09:08Z", end: "2026-04-21T09:15Z"}` | 记忆系统 | 直采 | 仅元数据 | P0 | ↑ 同上 |
| 3d | `episode.participants` | 参与方 | `["pet", "user"]` | Memory Intelligence | ↑ 同上 | 仅元数据 | P0 | ↑ 同上 |
| 4 | `emotion_signal` | 情绪信号 | `"兴奋"`（紧张/兴奋/沮丧/平静） | Consumer Runtime | **AI 推导**：本地轻量分类器 + 关键词规则 mix；输出枚举：紧张 / 兴奋 / 沮丧 / 平静；**触发**：chat 实时（每 segment） | 派生标量，不含内容 | P0 | 决定语气 |
| 5 | `atomic_facts.quote_eligible` | 原话可引用标记 | `true / false` | Memory Intelligence | **规则个人身份信息检测**：正则匹配（人名 / 邮箱 / 手机号 / 财务关键词）+ NER 实体识别（同事 / 组织名 / 病情等）；**触发**：生产 atomic_facts 时同步打标 | 个人身份信息检测：人名/邮箱/手机/财务关键词 | P0 | 日记 / 高光引用原话的隐私安全开关 |

#### Schema 示例

```json
{
  "data_source": "chat",
  "player_id": "player_a1c93f01",
  "atomic_facts": [
    {"fact": "用户喜欢稳定策略", "quote_eligible": true,
     "meta": {"confidence": 0.85, "source_category": ["chat"],
              "generation_method": "inferred", "evidence_ids": ["chat_segment_2026042100012"]}}
  ],
  "episode": {
    "title": "讨论刺客职业天赋树调整",
    "time_range": {"start": "2026-04-21T09:08Z", "end": "2026-04-21T09:15Z"}
  },
  "emotion_signal": "兴奋"
}
```

---

### 3.2 行为数据 - PC 进程

> PC 进程数据用于判断用户当前是否在游戏、是否全屏、是否离开。P0 只保留实时状态；跨时间行为画像需用户开启行为数据授权。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1a | `active_app.name` | 当前 app 名 | `Bilibili` | Bilibili | **OS 进程 API 直采**：macOS `NSWorkspace.frontmostApplication` / Windows `GetForegroundWindow`；**触发**：每 1s 轮询 + active_app 变更立即推送 | 仅实时 snapshot；不读 app 内容；不进入长期画像 | P0 | "在游戏中"vs"在工作中" |
| 1b | `active_app.bundle_id` | 当前 app bundle ID | `"com.microsoft.Bilibili"` | 记忆系统 | ↑ 同上 | 仅实时 snapshot；不进入长期画像；用于 app 分类和白名单匹配 | P0 | ↑ 同上 |
| 2 | `active_app.is_fullscreen` | 全屏状态 | `false` | 记忆系统 | **OS 窗口 API 直采**：macOS `NSWindow.styleMask & NSWindowStyleMaskFullScreen` / Windows `GetWindowLong + WS_MAXIMIZE` + 屏幕分辨率比对 | 仅 OS 公开 API | P0 | 全屏 = 闭嘴 |
| 3 | `idle_signal`（active / >5min / >10min / >30min） | 闲置信号 | `active / >5min / >10min / >30min` | Consumer Runtime | **规则阈值分级**：基于 OS idle 时间（macOS `CGEventSourceSecondsSinceLastEventType(kCGAnyInputEventType)` / Windows `GetLastInputInfo`）；**触发**：每 30s 检查 + 状态变化立即推送 | 仅 OS idle 时间，不含输入内容 | P0 | "用户离开"判断 |
| 4 | `app_switch_burst` | app 切换 burst | `true / false` | Consumer Runtime | **滚动窗口统计**：5min 窗口内 active_app 切换次数 ≥N 触发 burst=true；**触发**：active_app 每次变化时增量更新 | 仅时序统计；用于画像需行为数据授权 | P1 | 识别频繁切换状态 |
| 5 | `recent_apps_top3` | 最近 app top3 | `["Bilibili", "Chrome", "Steam"]` | Consumer Runtime | **1h 滚动窗口聚合**：active_app 时序累计前台时长 → 按时长排序 top3；**触发**：每 5min 重算 + 按需 query | 仅 app 名和时长聚合；用于画像需行为数据授权 | P1 | 判断近期主要活动类型 |

#### Schema 示例

```json
{
  "data_source": "behavior_pc",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:15:00Z",
  "active_app": {"name": "VS Code", "bundle_id": "com.microsoft.VSCode", "is_fullscreen": false,
                 "ttl": "runtime_only"},
  "idle_signal": "active"
}
```

---

### 3.3 行为数据 - mac / win API & 用户操作

> 行为数据用于辅助判断用户当前状态，但不记录键盘输入内容。P0 只保留低敏实时信号；更细的操作语义属于 P1 授权增强。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `window_title_redacted` | 脱敏窗口标题 | `"在 IDE 编辑代码文件"` | 记忆系统 | **OS 窗口 API + 脱敏规则**：macOS `kAXTitleAttribute` / Windows `GetWindowText` 拿原标题 → 正则脱敏（去除文件名 / 路径 / URL query string / 用户名）→ 仅保留 app 类别 + 文件类型；**触发**：每 1s + 标题变化推送 | 脱敏：去文件名/路径/URL/用户名 | P0 | "在 IDE 编辑代码文件" |
| 2 | `is_fullscreen_game` | 游戏全屏 | `false` | 记忆系统 | 同 § 3.2 #2 OS 窗口 API 直采 | 仅 OS 公开 API | P0 | 全屏 = 闭嘴 |
| 3 | `ui_semantic_tags[]`（白名单 app + opt-in） | 当前窗口界面语义标签 | `["error_dialog_visible", "confirm_button_visible"]` | 记忆系统 / Consumer Runtime | **OS Accessibility API + 规则映射**：macOS NSAccessibility / Windows UIA 读取授权窗口内允许类型的控件文本 → 立即映射为语义标签；**条件**：白名单 app + 用户 opt-in + 短期 buffer ≤5min；**默认不持久化原文** | 默认输出语义标签；只读游戏 HUD、按钮标签、系统弹窗类型、错误状态、公开控件文本；禁止聊天 / 邮件 / 文档正文 / 文件路径 / URL / 会议内容 / 密码框 | P1 | "屏幕上有错误弹窗" |
| 4 | `focused_element_role`（按钮 / 文本框 / 标题） | 当前焦点控件 | `button / text_field / title` | 记忆系统 | **OS 控件 API 直采**：macOS `AXFocusedUIElement` / Windows `UIAutomation.FocusedElement`；**触发**：实时（焦点变化推送） | 仅控件类型，不含内容 | P1 | "正在输入"不打扰 |
| 5a | `input_intensity_level` | 输入强度 (评估用户在单位时间内的总操作密集程度（是处于高频输出状态，还是轻度浏览状态）。) | `low / mid / high` | Consumer Runtime | **桶化派生**：OS 原始键盘 / 鼠标事件 → 10s / 1min 滚动窗口 → 桶化为 low/mid/high 等级；**关键**：**仅统计事件次数 / 区域分布**，**绝不存原始按键内容**；**触发**：每 10s 增量更新 | 桶化派生；绝不存原始按键；不形成 keylog | P0 | 专注 vs 休息判断 |
| 5b | `typing_rhythm_signal` | 打字节奏 (分析用户敲击键盘的节奏特征。常用于身份防伪（每个人打字快慢、按键间隔特异性极强）或焦虑/疲劳度检测。) | `steady / bursty / sparse` | Consumer Runtime | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 5c | `mouse_activity_burst` | 鼠标活动 burst(检测鼠标短时间内的爆发式高频移动或操作) | `true / false` | Consumer Runtime | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 5d | `mouse_region_heatmap_top3` | 鼠标热区 top3(找出用户鼠标最常停留或点击的前三个屏幕区域（常用于分析用户主要在操作哪个软件窗口，或者在屏幕的什么位置活动）) | `["center", "top-right", "left"]` | Consumer Runtime | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 5e | `scroll_intensity_signal` | 滚动强度(用户使用滚轮或触控板进行页面滚动的剧烈程度。通常高强度的滚动意味着用户正在快速浏览/检索信息（如刷信息流、快速翻阅代码/文档），而不是深度阅读) | `none / low / mid / high` | Consumer Runtime | ↑ 同上 | 同上 | P1 | ↑ 同上 |
| 6 | `semantic_events[]` | 操作语义事件 (捕获具有高层业务含义的具体操作) | `**[{type:"save", at:"..."}]**`；`enum: save / undo_redo_burst / fullscreen_toggle / lock_unlock` | 记忆系统 | **OS Event API 直采**：macOS `NSEvent globalMonitor` + AppleScript Sysevents / Windows `SetWinEventHook(EVENT_SYSTEM_*)` + Shell Hooks；仅监听字段白名单中的系统级语义事件；**触发**：事件 pub/sub | OS event 仅快捷键组合识别；不含字符流；P1 授权增强 | P1 | "刚保存 / 刚切 app" |
| 7a | `text_edit_action_burst` | 编辑动作 burst(标记用户当前是否正在处于疯狂高频修改、输出文本的状态) | `true / false` | Consumer Runtime | **二阶统计派生**：基于 A2 semantic_events 中的 save / undo / redo 事件流 → 滚动窗口（1min / 5min / 整 session）→ 派生频率 / 时长 / IME 状态；**触发**：每 1min 增量更新 | 二阶统计；不含字符流 | P1 | "在密集编辑长文档" |
| 7b | `undo_redo_rate_per_min` | undo/redo 每分钟频率 (统计用户在一分钟内执行“撤销”和“重做”的次数) | `5` | Consumer Runtime | ↑ 同上 | 同上 | P1 | "频繁 undo = 改 bug" |
| 7c | `ime_state` | 输入法状态 (监控用户当前使用的语言输入法状态) | `zh / en / off` | Consumer Runtime | ↑ 同上 | 同上（IME 状态非内容） | P1 | 中文 vs 英文输入 |
| 7d | `editing_session_duration_min` | 编辑会话时长（分钟） (一次连续文本编辑周期的持续分钟数) | `45` | Consumer Runtime | ↑ 同上 | 同上 | P1 | 长 session 识别 |
| 7e | `text_edit_burst_frequency` | 编辑突发频率 (高频率的 Burst 代表用户处于“高频迭代、快速产出”的状态（如程序员写核心逻辑、文案作者写初稿）；而极低频率的 Burst 伴随长期的低频修改，则代表用户处于“重度思考、反复查阅、修修补补”的深思熟虑模式) | `2.3` | Consumer Runtime | ↑ 同上 | 同上 | P1 | 编辑活跃度 |

#### Schema 示例

```json
{
  "data_source": "behavior_ui",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:20:00Z",
  "window_title_redacted": "在 IDE 编辑代码文件",
  "semantic_events": [
    {"type": "save", "at": "2026-04-21T09:19:33Z"},
    {"type": "undo_redo_burst", "at": "2026-04-21T09:19:55Z"}
  ]
}
```

---

### 3.4 APP 信号源 - MCP 通道

> MCP app 信号用于补充任务、平台状态和公开活动等轻量上下文。用户按 app 开启；产品侧只接收固定白名单字段，并要求摘要来源可识别。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `mcp_app_id` | app 标识 | `"dida365"` | 记忆系统 | MCP SDK 直采（app 自身上报 ID） | 仅 app 元数据 | P1 | 标识哪个 app 的 MCP 数据 |
| 2a | `metadata_summary` | 元数据摘要 | `"今天有 3 个待办，2 个已完成"` | 记忆系统 | app 主动通过 MCP server 暴露数量 / 状态 / 时间段等元数据 | 不含原始标题 / 正文 | P1 | 桌宠轻量提醒 |
| 2b | `task_titles[]` | 任务标题 | `["周报", "游戏日常任务"]` | 记忆系统 | app 主动暴露标题字段；用户单 app 授权后读取 | 仅授权 app 的条目标题；不读正文 / 评论 / 附件 | P1 | 桌宠可引用具体任务 |
| 2c | `app_generated_summary` | app 自生成摘要 | `"今天主要是日常任务和一项周报"` | 记忆系统 | app 自己生成或暴露的摘要字段；桌宠不绕过权限读取正文 | 必须带 `summary_source_type`；禁止聊天 / 邮件 / 文档 / 会议正文摘要进入 memory | P1 | 桌宠自然语言引用 |
| 2d | `summary_source_type` | 摘要来源类型 | `task_status_summary` | 记忆系统 | MCP payload 必填；记忆系统按白名单校验 | 仅允许 task_status_summary / public_activity_summary / platform_status_summary | P1 | 防止摘要绕过正文边界 |
| 3 | `authorized_sources[]` | 已授权 app 列表 | `[{source:"dida365", granted:true}]` | 记忆系统 | 用户在偏好设置页单 app 主动勾选；memory consent ledger 持久化授权记录 | 用户主动输入；默认空；撤回后不再读取该 app 数据 | P1 | 标识桌宠允许接入的 MCP app |

#### 边界

- **不允许** mcp-chrome 类全功能浏览器 MCP（权限过大）— 仅接受 app 主动暴露的标准 MCP server
- 每个 app 独立开关，用户在偏好设置页单 app 启用 / 禁用；用户侧不暴露字段级授权
- 固定字段白名单：`metadata_summary` / `task_titles[]` / `app_generated_summary` / `summary_source_type`
- 不接受 app 通过 MCP 推送的消息、邮件、文档、会议正文或附件内容；如果 app 自生成摘要来自这些来源，也不得进入 memory
- 任务标题和 app 自生成摘要可以读取，但必须来自用户授权 app 的标准字段，并通过 `summary_source_type` 校验

#### Schema 示例

```json
{
  "data_source": "mcp_summary",
  "mcp_app_id": "dida365",
  "metadata_summary": "今天有 3 个待办，2 个已完成",
  "task_titles": ["周报", "游戏日常任务"],
  "app_generated_summary": "今天主要是日常任务和一项周报",
  "summary_source_type": "task_status_summary",
  "authorized_sources": [
    {"source": "dida365", "granted": true, "granted_at": "2026-05-13T10:05:00Z", "revoked_at": null},
    {"source": "steam", "granted": true, "granted_at": "2026-05-13T10:06:00Z", "revoked_at": null}
  ]
}
```

---

### 3.5 游戏状态 / 进度数据 idip

> idip 是桌宠理解玩家进度、水平和卡点的首方游戏数据。P0 要求当前状态快照和字段语义配置；P1 可继续提供状态变化、卡点异常和里程碑。

**P0 最小接入**：

- `idip_snapshot`：当前游戏状态，如等级、段位、章节进度、当前任务进度。
- `idip_field_metadata`：解释字段含义，如 `level` 是等级、`weekly_quest_progress` 是周常进度，避免桌宠读不懂数字。

**P1 增强接入**：

- `idip_delta`：状态变化，如等级 +1、段位上升、进度增加。
- `idip_anomaly`：异常 / 卡点，如同一 Boss 连续失败、关键进度长时间无变化。
- `idip_milestone`：值得庆祝的突破，如首次通关、首次上段位、赛季目标完成。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `idip_snapshot` | 状态快照 | `{level:88, rank:"钻石二"}` | 记忆系统 | **游戏 SDK 推送**（首方接入）：游戏侧通过 idip 接口推送当前状态键值对；**触发**：游戏定义（状态变化 push / 周期心跳 / 手动 query）；**字段语义**见 #5 | 首方游戏 SDK；不含个人身份信息 / 付费记录 / 实名 | P0 | 角色等级 / 段位 / 通关进度等基础状态 |
| 2 | `idip_delta` | 状态变化 | `{level:"+1", rank:"升 +1 段位"}` | Memory Intelligence / Consumer Runtime | **增强派生**：缓存上一时点 idip_snapshot，新 snapshot 到达时逐字段对比 → 输出变化字段 + 变化量；合作游戏也可直接上报 | 同上 | P1 | "刚通关" / "段位掉了" |
| 3 | `idip_anomaly` | 状态异常 | `[{type:"卡关", at:"..."}]` | Memory Intelligence / Consumer Runtime | **增强派生**：基于 idip_delta / game_event 历史滑窗识别卡点、反复失败、关键进度停滞等模式；规则和阈值需按游戏类型校准 | 同上 | P1 | "多次同一处失败" / "可能卡关" |
| 4 | `idip_milestone[]` | 状态突破点 | `[{name:"首次到达钻石"}]` | Memory Intelligence / 游戏 SDK | **增强识别**：基于 idip_field_metadata 中标注的里程碑字段、game_event 或合作游戏直接上报的 milestone；触发规则需按游戏配置 | 同上 | P1 | 桌宠主动祝贺触发点 |
| 5 | `idip_field_metadata` | 字段语义配置 | `{level:{type:"int", milestone_type:"is_levelup"}}` | 记忆系统 | **游戏侧声明的字段语义配置文件**（JSON Schema）：每个 idip 字段标 `field_name` / `display_name` / `type` / `unit` / `milestone_type`；游戏接入时一次性提交；**记忆系统侧只存配置，不解释** | 配置文件，无个人身份信息 | P0 | 字段语义说明（数字含义） |

#### Schema 示例

```json
{
  "data_source": "game_idip",
  "snapshot_at": "2026-05-12T20:00:00Z",
  "idip_snapshot": {"level": 88, "rank": "钻石二", "weekly_quest_progress": 4},
  "idip_delta": {"level": "+1", "rank": "升 +1 段位"},
  "idip_milestone": [{"name": "首次到达钻石", "at": "2026-05-12T19:55:33Z"}]
}
```

---

### 3.6 游戏数据 - 实时事件

> 1. 实时事件用于支持桌宠当下回应、复盘和高光判断。payload 只保留事件所需的游戏内状态字段，不包含真实账号、付费记录、聊天内容或队友个人信息。 
​ 
​ 
​2.事件情绪只描述游戏场景线索，不做现实心理判断。单次事件不会直接沉淀为长期画像，长期画像只使用多次证据聚合后的结果。

#### `字段表`

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1a | `game_session.start` | 对局开始 | `"2026-05-12T20:00Z"` | 记忆系统 | **游戏 SDK 直采事件**：游戏侧在一局开始 / 结束时推送；**事件 schema**：`{session_id, start_at / end_at, result?, duration?}`；**触发**：游戏内动作 push | 首方游戏 SDK | P0 | 知道一局开始 |
| 1b | `game_session.end` | 对局结束 | `"2026-05-12T20:30Z"` | 记忆系统 | ↑ 同上 | 首方游戏 SDK | P0 | 知道一局结束 |
| 2 | `game_session.in_game_time` | 游戏内时间 | `"游戏内第 5 日"` | 记忆系统 | **游戏 SDK 实时推送**：游戏内时间（如"游戏内第 5 日"、"早晨 8 点"）；**触发**：游戏定义（部分游戏没有，本字段可缺） | 首方游戏 SDK | P0 | 游戏内时间 |
| 3 | `game_event.stream` | 游戏事件流 | `[{type:"death", at:"..."}]` | 记忆系统 | **游戏 SDK pub/sub**：每款游戏声明自己的 P0 最小事件集，如 session_start / session_end / settlement / objective_progress / fail / success / death / revive；装备、技能、任务细节、战斗明细等为 P1 / 游戏定制扩展；**事件 schema**：`{type, at, payload}`；**记忆系统**：去重 + 时序整理后再交付桌宠 | 首方游戏 SDK；payload 只允许游戏内最小必要字段 | P0 | 桌宠按事件反应 |
| 4 | `game_session.duration_signal`（active / long_session / very_long_session / extended_session） | 时长分级信号 | `long_session` | Consumer Runtime | **规则分级**：基于 `game_session.start` 时间戳，实时 = now - start；阈值按游戏类型和用户设置校准；**触发**：周期重算 + session 期间持续 | 派生分级；需记录 `rule_version` | P0 | 健康提示触发 |
| 5a | `event_emotion_signal`（joy / tension / frustration / relief / neutral / unknown） | 事件情绪线索 | `frustration` | Consumer Runtime | **AI + 规则推断**：输入 = game_event + 可用的 idip_delta + 当前对话 / 用户反馈中已授权的情绪线索；输出枚举；低置信输出 `unknown` | 默认短期 event-level 信号；游戏场景情绪线索，不是心理诊断；长期只允许多次证据聚合 | P0 | 当下回应 / 日记 / 高光的事件级情绪锚点 |
| 5b | `event_response_hint`（celebrate / comfort / coach / ask_first / stay_quiet） | 桌宠回应策略 | `comfort` | Consumer Runtime | **规则优先 + AI 辅助**：输入 = event_emotion_signal + game_event + user profile / companion_profile；输出回应策略 | 默认短期 runtime 信号；服务当下回应，不写现实人格判断 | P0 | 决定桌宠怎么回应 |
| 6 | `episode.highlight_score`（0-1） | 情节高光排序分 | `0.82` | Memory Intelligence | **待校准评分**：综合 milestone 命中、事件重要度、用户主动保存 / 反馈、情绪线索强度、稀有度等因子；不在 DRS 固定公式和阈值；**触发**：episode 闭合或用户保存时计算 | 派生标量；需记录 `score_version` 和 `score_reason[]` | P1 | 高光排序 / 日记素材推荐 |

#### Schema 示例

```json
{
  "data_source": "game_event",
  "stream": [
    {"type": "death", "at": "2026-05-12T20:15:33Z",
     "payload": {"stage_id": "boss_2", "attempt_count_bucket": "3_plus"},
     "event_emotion_signal": "frustration", "event_response_hint": "comfort"},
    {"type": "settlement", "at": "2026-05-12T20:30:00Z",
     "payload": {"result": "win"},
     "event_emotion_signal": "relief", "event_response_hint": "celebrate",
     "highlight_score": 0.82, "score_version": "highlight_score_default"}
  ]
}
```

---

### 3.7 当前窗口画面理解 VLM

当前窗口画面理解用于让桌宠理解授权游戏窗口中的场景。它只输出语义标签和用户可见摘要，不保存原图、不用于训练、不留原始帧日志。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `vlm_enabled_for_this_app_instance` | VLM 单 app 开关 | `true / false` | 记忆系统 | **用户输入**：在该 app 实例的桌宠设置面板手动开启；默认关闭；用户可一键关闭单 app / 全局关闭 | 用户单 app 显式开启（默认关） | P1 | 每个 app 实例独立开关 |
| 2 | `app_category` | app 类别 | `game` | 记忆系统 | **用户输入**：在桌宠设置加入白名单时选定；当前范围仅支持游戏窗口 | 用户配置 | P1 | 区分当前能力范围 |
| 3 | `semantic_tags[]`（≤5） | 场景语义标签 | `["boss_fight", "low_hp"]` | 桌宠侧实时生成 / 产品内大模型服务 | **输入**：当前授权游戏窗口视觉帧短期 buffer ≤60s；**输出**：枚举 schema 约束的语义标签（禁止自由文本扩写） | 当前授权窗口 + buffer ≤60s + 不持久化原图 + 不训练 + 不留原始帧日志 + UI 必须显示"正在看屏幕" | P1 | 场景标签（boss_fight / low_hp / scene_funny 等） |
| 4 | `user_visible_summary`（≤50 字） | 用户可见摘要 | `"BOSS 战残血，紧张时刻"` | 桌宠侧实时生成 / 产品内大模型服务 | **输入**：当前授权游戏窗口视觉帧短期 buffer；**输出**：一句话用户可见描述 | 同上 + 强约束：不输出用户身份 / 账号 / 聊天 / 字幕原文 / 他人信息 | P1 | "刚才那段是搞笑剧情" |

#### Schema 示例

```json
{
  "data_source": "game_vlm",
  "vlm_enabled_for_this_app_instance": true,
  "app_category": "game",
  "snapshot_at": "2026-05-12T20:18:00Z",
  "semantic_tags": ["boss_fight", "low_hp"],
  "user_visible_summary": "BOSS 战残血，紧张时刻"
}
```

---

### 3.8 当前上下文 current_context

当前上下文用于判断桌宠此刻是否该说话、说什么、用多大力度。它只能使用已授权或 P0 允许的短期信号。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `activity_topic` | 活动主题 | `"在打游戏 BOSS 战"` | Consumer Runtime | **规则优先 + 大模型按需补充**：优先基于 game_session / game_event / active_app / fullscreen 等结构化信号生成；仅在复杂来源开启、语义不明确或需要自然语言合成时调用产品内大模型；**触发**：结构化状态变化立即推送 + 心跳刷新 | 滑窗派生，不含原始内容 | P0 | 桌宠对话的话题锚 |
| 2 | `mood_estimate`（紧张 / 平静 / 兴奋 / 沮丧 / unknown） | 情绪估计 | `紧张 / 平静 / 兴奋 / 沮丧 / unknown` | Consumer Runtime | **AI + 规则滑窗推导**：基于已授权情绪线索、game_event、idip_delta 和用户反馈；低置信输出 `unknown`；**触发**：跨级变化立即推送 | 游戏场景情绪线索，不做心理诊断 | P0 | 决定回应策略 |
| 3 | `interrupt_suitability`（high / medium / low） | 打扰适宜度 | `high / medium / low` | Consumer Runtime | **多信号加权派生**：综合 is_fullscreen / idle_signal / typing_rhythm / game_event 当前节奏 / `profile.companion_profile.disturbance_boundaries` → 加权打分 → 分级；**触发**：跨级变化立即推送 | 派生标量 | P0 | 打扰决策唯一输入（桌宠不自己判断打扰） |
| 4 | `attention_target`（游戏 / IDE / 视频 / ...） | 注意力目标 | `"游戏" / "IDE" / "视频"` | Consumer Runtime | **规则派生**：基于 active_app + window_title_redacted + app_category 映射到注意力目标枚举；**触发**：实时（active_app 变化推送） | 派生标量 | P0 | 桌宠决定看哪个屏幕方向 |
| 5 | `confidence` | 置信度 | `0.85` | Consumer Runtime | **规则**：基于滑窗内有效信号数量（chat 条数 / event 条数 / behavior 桶 / 时长完整度）；信号 < 阈值 → 低置信；**触发**：每次推送时同步计算 | 派生标量 | P0 | 低置信时桌宠保守 |
| 6 | `trigger`（activity_topic_change / mood_change / interrupt_change / heartbeat） | 推送原因 | `mood_change / heartbeat / 等` | 记忆系统 | **系统标签**：推送时由滑窗派生引擎标注推送原因；**触发**：每次 push 时设置 | 系统标签 | P0 | 标识推送原因 |
| 7 | `source_mask` | 本次上下文使用来源 | `{chat_realtime:true, behavior_runtime:true, behavior_profile:false, vlm:false, mcp:false, game_event:true}` | Consumer Runtime | **授权裁剪记录**：每次生成 current_context 时同步写入，标明使用了哪些来源 | 不含原始内容；用于审计和解释 | P0 | 解释当前判断用了哪些数据 |

#### Schema 示例

```json
{
  "data_source": "current_context",
  "snapshot_at": "2026-05-12T20:20:00Z",
  "activity_topic": "在打游戏 BOSS 战",
  "mood_estimate": "紧张",
  "interrupt_suitability": "low",
  "attention_target": "游戏",
  "confidence": 0.85,
  "trigger": "mood_change",
  "source_mask": {"chat_realtime": true, "behavior_runtime": true, "behavior_profile": false,
                  "vlm": false, "mcp": false, "game_event": true}
}
```

---

### 3.9 Profile 元字段 profile_meta

每条 profile 字段附带元字段，**区分证据来自哪里、这条字段如何生成、是否有证据可追溯、用户是否更正过**。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `confidence`（0-1） | 置信度 | `0.7` | Memory Intelligence | **证据置信度**：表示这条画像有多值得桌宠在对话中使用；由来源可靠性、证据数量、时间新鲜度、用户反馈和规则命中共同决定；AI judge 只提供证据解释，不自评置信度 | 元字段 | P0 | 引用前判断"是否说出来" |
| 2a | `source_category`（user_input / chat / game_event / idip / behavior / mcp / vlm / highlight / system） | 证据来源域 | `chat / game_event / idip` | 记忆系统 | **系统记录**：每条 profile 字段写入时记录证据来自哪里；可为数组或主来源 + 次来源 | 元字段：偏好设置页"画像来源"解释 | P0 | 解释这条画像基于什么数据 |
| 2b | `generation_method`（user_set / system_record / inferred） | 生成方式 | `inferred` | 记忆系统 | **系统记录**：记录这条字段是用户主动设置、系统直接记录，还是基于证据整理 / 推断产生；`inferred` 可由规则、产品内大模型或二者混合生成；与 `source_category` 分离 | 元字段；避免把"来源"和"生成方式"混在一起 | P0 | 解释这条画像怎么来的 |
| 3 | `evidence_ids[]` | 证据 IDs | `["game_event_2026050800123", "episode_2026051000031"]` | 记忆系统 | **系统记录**：AI / 规则推断画像项必须写入 evidence_ids；用户直接设置字段可为空或指向 user_action_id | 指向 ID，不含原始内容 | P0 | 来源反查、解释、用户质疑时定位证据 |
| 4 | `evidence_summary` | 证据短解释 | `"最近 5 局多次选择稳健发育路线"` | Memory Intelligence | **可选短解释**：基于 evidence_ids 生成给用户看的短句；不得引入 evidence_ids 之外的新事实 | 不含原始敏感内容 | P1 | 画像页解释"为什么这么判断" |
| 5a | `first_seen_at` | 首次见时间 | `"2026-04-21T09:10:00Z"` | 记忆系统 | **系统时间戳**：写入时记录 first_seen；用户明确设置 / 正向反馈 / 行为再次验证时更新 last_confirmed | 系统时间戳 | P0 | 时效衰减起点 |
| 5b | `last_confirmed_at` | 末次确认时间 | `"2026-04-21T09:10:00Z"` | 记忆系统 | ↑ 同上 | 系统时间戳 | P0 | 时效衰减计算 |
| 6a | `is_active` | 当前是否可用 | `true / false` | 记忆系统 | **系统状态**：`true` 表示这条记忆可被桌宠用于对话、画像展示、日记、复盘和角色相似度测定；`false` 表示不可用于生成，只保留删除 / 更正 / 审计或避免重复犯错所需记录 | 状态布尔值 | P0 | 使用前的硬判断 |
| 6b | `inactive_reason`（user_deleted / user_rejected / user_replaced / expired / conflict_with_newer_evidence / null） | 不可用原因 | `user_rejected` | 记忆系统 | **系统记录**：仅当 `is_active=false` 时填写；表示用户删除、用户否定、用户替换、过旧未验证，或与更新证据冲突 | 不含原始内容 | P0 | 解释为什么不能用 |
| 6c | `inactive_at` | 失效时间 | `"2026-05-13T21:30:00Z"` | 记忆系统 | **系统时间戳**：`is_active` 从 true 变 false 时写入；恢复为 true 时清空或写入新记录 | 系统时间戳 | P0 | 审计与排查 |
| 7 | `decay_score` | 衰减分 | `0.95` | Memory Intelligence | **规则时间衰减派生**：基于 `last_confirmed_at` 计算时效衰减；长期未验证可将 `is_active=false` + `inactive_reason=expired` | 派生标量 | P0 | 桌宠不用自己做衰减逻辑 |
| 8 | `user_feedback[]` | 用户反馈事件 | `[{value:0, source:"chat", at:"...", target:"playstyle_profile.playstyle_tags"}]` | 记忆系统 | **系统自动写记录**：用户每次显式反馈 / 更正（按钮、口头 / 文本、直接编辑、删除、重新总结我、以后别这样记）→ append `{value, source, at, target, reason?}`；正向 = `1`，负向 = `0`；同一 target 以最新 `at` 为准；负向反馈可触发 `is_active=false` | 反馈事件，无原始内容 | P1 | 反馈反哺闭环 |

#### user_feedback[] 统一事件结构

用户显式反馈统一写入 `user_feedback[]`。`value=1` 表示正向反馈，`value=0` 表示负向反馈；同一 target 多次反馈时，以最新 `at` 为准。

#### Confidence 解释

`confidence` 不是"用户真实人格分数"，而是"桌宠能不能放心使用这条记忆"的安全阀。值越高，桌宠越可以自然引用；值越低，桌宠越应该保守、少说或先问用户。

| 置信度层级 | 建议使用方式 | 示例 |
|---|---|---|
| `high`（约 0.8-1.0） | 可以自然引用 | "你最近一直在练新英雄，我陪你稳一点。" |
| `medium`（约 0.5-0.79） | 可以弱表达，不要说死 | "我感觉你最近可能更想稳着打？" |
| `low`（约 0.2-0.49） | 不主动下结论，优先询问 | "这把你想复盘，还是先缓一下？" |
| `blocked`（约 0-0.19 或 `is_active=false`） | 不使用；必要时触发重新总结 | 用户说"这不准"后，相关画像不再自动引用 |

影响 `confidence` 的因素：

- **来源可靠性**：用户直接设置最高；首方游戏事件通常高于聊天线索；单次 AI 推断最低。
- **证据数量**：多次、不同来源都支持同一结论，置信度更高。
- **时间新鲜度**：近期行为更可信，过旧记忆会衰减。
- **用户反馈**：用户正向反馈提高置信度；用户负向反馈 / 更正会降低并锁定。
- **规则命中强度**：结构化规则明确命中时更高；模糊文本推断更低。

具体数值计算由后续评测集校准，不在 DRS 固定公式。AI judge 只能输出 `reason` 和引用的 `evidence_ids[]`，不能输出自评置信度。

#### Schema 示例

```json
{
  "value": "稳定策略",
  "meta": {
    "confidence": 0.7,
    "source_category": ["chat", "game_event"],
    "generation_method": "inferred",
    "evidence_ids": ["episode_2026042100012", "game_event_2026042100872"],
    "evidence_summary": "多次对话和游戏事件都显示用户倾向稳健策略",
    "first_seen_at": "2026-04-21T09:10:00Z",
    "last_confirmed_at": "2026-04-21T09:10:00Z",
    "is_active": true,
    "inactive_reason": null,
    "inactive_at": null,
    "decay_score": 0.95,
    "user_feedback": []
  }
}
```

---

### 3.10 用户画像 profile

用户画像是桌宠长期理解用户的核心数据，只描述游戏体验相关偏好，不做现实人格判断。用户可通过直接编辑、说"这不像 / 这不准"、删除、重新总结、以后别这样记等方式更正画像。

桌宠语气、口癖和表达风格属于游戏 IP 固定设定，不进入用户画像，也不由用户修改。

画像分 7 个子对象：

| 子对象 | 含义 | 用户控制原则 |
|---|---|---|
| `profile_identity` | 基础昵称 / 用户希望被叫作什么 | 用户直接编辑；不包含称呼风格 |
| `pet_relationship` | 用户希望桌宠扮演的关系定位 | 用户直接选择；不改变 IP 固定语气 |
| `game_profile` | 游戏偏好 / 游戏目标 | 用户可直接编辑；AI 只做推断补充 |
| `playstyle_profile` | 操作与玩法风格 | AI + 规则可推断，但用户可改 / 删除 |
| `companion_profile` | 情绪与陪伴偏好 / 打扰边界 / 希望桌宠聊的话题 | 用户直接设置优先；AI 只做话题推断 |
| `progress_profile` | 进度与成就记忆 | 首方游戏事件 + 用户更正；用户可删 / 说"这不准" |
| `social_profile` | 社交偏好 | 用户直接设置优先；AI 只做低置信推断 |

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `profile.summary` | 用户画像摘要 | `"偏好法师与稳健发育，最近在练排位节奏"` | Memory Intelligence（用户可触发重写） | **AI 生成**：输入 profile 全字段 + 最近 episode / highlight；`privacy_grants.profile_inference=true` 时可周期或重大进展后自动更新；用户关闭 profile_inference 后停止自动重写，仅允许用户主动点"重新总结我"触发；写回 memory | 不含现实身份 / 敏感属性；受 quote_eligible 约束 | P0 | 一句话画像，给桌宠上下文定调 |
| 2a | `profile_identity.display_name` | 展示昵称 | `"uu"` | 记忆系统（用户输入） | 画像页 UI 直接写入；AI 严禁自动设置 | 用户主动输入；不要求真实姓名 | P0 | UI 展示 |
| 2b | `profile_identity.preferred_call_name` | 希望被桌宠称呼 | `"队长"` | 记忆系统（用户输入） | 画像页 UI 直接写入；AI 严禁自动覆盖 | 用户主动输入 | P0 | 桌宠称呼 |
| 3a | `pet_relationship.relationship_mode` | 桌宠关系 | `friend / teasing_partner / assistant / quiet_companion` | 记忆系统（用户选择） | UI 枚举选择；AI 只能读取不能覆盖 | 用户主动输入 | P0 | 决定桌宠角色定位 |
| 4a | `game_profile.favorite_roles[]` | 偏好角色 / 职业 / 武器 / 流派 | `["法师", "控制流"]` | 用户输入 + AI 推断画像项 | 用户可增删改；AI 可基于 chat + game_event 写入 `inferred` 项，用户可更正 / 删除 | 不含现实身份 | P0 | 个性化陪玩话题 |
| 4b | `game_profile.favorite_modes[]` | 偏好模式 / 地图 / 难度 | `["排位", "剧情困难"]` | 用户输入 + 游戏事件 + AI 推断画像项 | 用户可改；AI 推断需 evidence_ids | 不含现实身份 | P1 | 推荐话题 / 复盘语境 |
| 4c | `game_profile.game_goals[]` | 游戏目标 | `["rank", "practice_char"]` | 用户输入优先 + AI 推断画像项 | 用户可多选 / 编辑；AI 可写入 `inferred` 状态 | 用户设置 / 用户更正优先 | P0 | 决定鼓励方向 |
| 5a | `playstyle_profile.playstyle_tags[]` | 玩法风格标签 | `["steady_growth", "team_support", "objective_first"]` | Memory Intelligence + 用户可改 | AI + 规则混合；输入 chat / game_event / idip_delta；用户可直接编辑 / 删除 / 对桌宠说"这不像/这不准" | 只能描述游戏内行为，不能上升到现实人格 | P0 | 陪玩反馈 / 复盘措辞 |
| 5b | `playstyle_profile.risk_preference` | 风险偏好 | `low / mid / high` | Memory Intelligence + 用户可改 | 基于战斗选择 / 失败模式 / chat；低置信写入 `inferred` 状态 | 游戏内风格，不是人格诊断 | P1 | 建议颗粒度 |
| 5c | `playstyle_profile.learning_stage` | 熟练阶段 | `exploring / practicing / stable / mastery` | 规则 + AI 推断画像项 | 输入进度 / 失败模式 / 教程跳过情况；用户可改 | 不输出羞辱性标签 | P1 | 决定提示深度 |
| 6a | `companion_profile.emotion_support_preference` | 情绪陪伴偏好 | `comfort_first / coach_first / quiet_first` | 用户输入优先 | UI 选择；AI 严禁覆盖 | 用户主动输入；profile 为真源 | P0 | 失败 / 连败后回应方式 |
| 6b | `companion_profile.disturbance_boundaries` | 打扰边界 | `{during_battle:"silent", during_story:"silent", post_loss:"ask_first"}` | 用户输入 | UI 写入；user_preferences 只保存授权 / 开关 | 用户主动输入；profile 为真源 | P0 | 打扰控制 |
| 6c | `companion_profile.preferred_conversation_topics[]` | 希望桌宠聊的话题 | `["刺客职业", "刷副本"]` | 用户输入 + AI 推断画像项 | 用户可增删改；AI 可基于 chat / feedback 写入 `inferred` 项，用户可更正 / 删除 | 不含现实身份 | P0 | 主动话题选取 |
| 6d | `companion_profile.avoided_conversation_topics[]` | 不希望桌宠聊的话题 | `["高压复盘", "剧透"]` | 用户输入 + 反馈记录 | 用户可直接维护；AI 不自动添加，只能生成推断项 | 用户主动输入优先 | P0 | 避免踩雷 |
| 7a | `progress_profile.current_goal` | 当前目标 | `"练会新英雄"` | 用户输入 + game_event + AI 推断画像项 | 首方 game_event / chat 形成推断项；用户可改写 / 删除 | 不含现实身份 | P0 | 让桌宠知道最近在忙什么 |
| 7b | `progress_profile.stuck_points[]` | 当前卡点 | `["第 7 章 Boss 二阶段"]` | game_event + 用户更正 / 反馈 | 失败 / 重复尝试触发 AI 推断画像项；用户可删 / 更正 | 仅游戏内进度 | P1 | 安慰 / 复盘 |
| 7c | `progress_profile.recent_achievements[]` | 近期成就 | `["首次通关困难副本"]` | game_event / highlight | 系统写入推断项；用户可标私密 / 删除 | 仅游戏内事件 | P1 | 庆祝 / 日记 |
| 7d | `progress_profile.long_term_milestones[]` | 长期里程碑 | `["赛季上王者"]` | 用户主动设置 / 保存 + idip_milestone | 用户保存或首方里程碑触发后写入长期画像；AI 只能补充 `inferred` 项 | 用户可删 / 清空 / 更正 | P1 | 长期陪伴感 |
| 8a | `social_profile.social_preference` | 社交偏好 | `solo / duo / squad / mixed` | 用户输入 + AI 推断画像项 | 用户可改；AI 只做推断项 | 不记录队友个人信息 | P1 | 控制组队语气 |

#### Schema 示例

```json
{
  "data_source": "profile",
  "schema_version": "0.2.0",
  "summary": {"value": "偏好法师与稳健发育，最近在练排位节奏",
              "meta": {"confidence": 0.72, "source_category": ["chat", "game_event"],
                       "generation_method": "inferred",
                       "evidence_ids": ["episode_2026051000031", "game_event_2026050800123"],
                       "is_active": true, "inactive_reason": null, "inactive_at": null}},
  "profile_identity": {
    "display_name": {"value": "uu", "meta": {"source_category": ["user_input"], "generation_method": "user_set",
                                             "is_active": true, "inactive_reason": null, "inactive_at": null}},
    "preferred_call_name": {"value": "队长", "meta": {"source_category": ["user_input"], "generation_method": "user_set",
                                                     "is_active": true, "inactive_reason": null, "inactive_at": null}}
  },
  "pet_relationship": {
    "relationship_mode": {"value": "teasing_partner", "meta": {"source_category": ["user_input"], "generation_method": "user_set",
                                                               "is_active": true, "inactive_reason": null, "inactive_at": null}}
  },
  "game_profile": {
    "favorite_roles": [{"value": "法师", "meta": {"confidence": 0.86, "source_category": ["chat"],
                                                "generation_method": "inferred",
                                                "evidence_ids": ["episode_2026051000031"],
                                                "is_active": true, "inactive_reason": null, "inactive_at": null}}],
    "game_goals": [{"value": "rank", "meta": {"source_category": ["user_input"], "generation_method": "user_set",
                                             "is_active": true, "inactive_reason": null, "inactive_at": null}}]
  },
  "playstyle_profile": {
    "playstyle_tags": [{"value": "steady_growth", "meta": {"confidence": 0.74, "source_category": ["game_event"],
                                                           "generation_method": "inferred",
                                                           "evidence_ids": ["game_event_2026050800123"],
                                                           "is_active": true, "inactive_reason": null, "inactive_at": null}}],
    "risk_preference": {"value": "mid", "meta": {"confidence": 0.62, "source_category": ["game_event", "chat"],
                                                 "generation_method": "inferred",
                                                 "evidence_ids": ["game_event_2026050800123", "episode_2026051000031"],
                                                 "is_active": true, "inactive_reason": null, "inactive_at": null}},
    "learning_stage": {"value": "practicing", "meta": {"confidence": 0.7, "source_category": ["game_event"],
                                                       "generation_method": "inferred",
                                                       "evidence_ids": ["game_event_2026050800123"],
                                                       "is_active": true, "inactive_reason": null, "inactive_at": null}}
  },
  "companion_profile": {
    "emotion_support_preference": {"value": "comfort_first", "meta": {"source_category": ["user_input"],
                                                                       "generation_method": "user_set",
                                                                       "is_active": true, "inactive_reason": null, "inactive_at": null}},
    "disturbance_boundaries": {"value": {"during_battle": "silent", "during_story": "silent", "post_loss": "ask_first"},
                               "meta": {"source_category": ["user_input"], "generation_method": "user_set",
                                        "is_active": true, "inactive_reason": null, "inactive_at": null}},
    "preferred_conversation_topics": [{"value": "刷副本", "meta": {"confidence": 0.8, "source_category": ["chat"],
                                                                  "generation_method": "inferred",
                                                                  "evidence_ids": ["episode_2026051000031"],
                                                                  "is_active": true, "inactive_reason": null, "inactive_at": null}}],
    "avoided_conversation_topics": [{"value": "剧透", "meta": {"source_category": ["user_input"],
                                                              "generation_method": "user_set",
                                                              "is_active": true, "inactive_reason": null, "inactive_at": null}}]
  },
  "progress_profile": {
    "current_goal": {"value": "练会新英雄", "meta": {"confidence": 0.8, "source_category": ["chat"],
                                                    "generation_method": "inferred",
                                                    "evidence_ids": ["episode_2026051000031"],
                                                    "is_active": true, "inactive_reason": null, "inactive_at": null}},
    "stuck_points": [{"value": "第 7 章 Boss 二阶段", "meta": {"confidence": 0.85, "source_category": ["game_event"],
                                                            "generation_method": "inferred",
                                                            "evidence_ids": ["game_event_2026050800123"],
                                                            "is_active": true, "inactive_reason": null, "inactive_at": null}}],
    "recent_achievements": [{"value": "首次通关困难副本", "meta": {"source_category": ["game_event"],
                                                               "generation_method": "system_record",
                                                               "evidence_ids": ["game_event_2026050800456"],
                                                               "is_active": true, "inactive_reason": null, "inactive_at": null}}],
    "long_term_milestones": [{"value": "赛季上王者", "meta": {"source_category": ["user_input"],
                                                            "generation_method": "user_set",
                                                            "is_active": true, "inactive_reason": null, "inactive_at": null}}]
  },
  "social_profile": {
    "social_preference": {"value": "mixed", "meta": {"confidence": 0.6, "source_category": ["chat", "game_event"],
                                                     "generation_method": "inferred",
                                                     "evidence_ids": ["episode_2026051000031", "game_event_2026050800789"],
                                                     "is_active": true, "inactive_reason": null, "inactive_at": null}}
  }
}
```

#### 与 profile_meta 的关系

每条 `profile.*` 字段都附带 `profile_meta`。`is_active=false` 的字段不可用于桌宠生成、画像展示、日记引用或角色相似度测定。

#### AI 写入权限矩阵

| 类型 | 字段 | AI 权限 | 用户控制 |
|---|---|---|---|
| 用户直接定义 | `profile_identity.display_name` / `profile_identity.preferred_call_name` / `pet_relationship.relationship_mode` / `companion_profile.emotion_support_preference` / `companion_profile.disturbance_boundaries` | 只读，不可写 | 用户可改 / 删 / 重置 |
| IP 固定只读（不进 profile） | `addressing_style` / `tone_preferences` / 口癖 / 毒舌程度 / 温柔程度 / 直率程度 | 由游戏 IP runtime 配置注入；AI 只能遵守 | 用户不可修改 |
| 用户明确偏好 | `companion_profile.preferred_conversation_topics[]` / `companion_profile.avoided_conversation_topics[]` / `game_profile.game_goals[]` | 可写入 `inferred` 项；必须带 `evidence_ids` / `source_category` / `generation_method` / `confidence` | 用户可直接改，用户改后不再覆盖 |
| 游戏内推断 | `playstyle_profile.*` / `progress_profile.*` / `social_profile.social_preference` | 可基于 chat + first-party game_event + idip + feedback 生成；必须带 `evidence_ids` / `source_category` / `generation_method` / `confidence` | 用户可直接编辑 / 删除 / 对桌宠说"这不像/这不准" |
| 总结字段 | `profile.summary` | `profile_inference=true` 时可自动重写；关闭后停止自动重写，仅用户主动"重新总结我"可触发 | 用户可点"重新总结" / 删除 |
| 禁止普通画像写入 | 现实身份、年龄、性别、住址、职业、健康、心理诊断、政治宗教、性取向、消费能力、队友个人信息、羞辱性标签 | 禁止推断和写入 | 不展示 |

#### 敏感推断边界

1. 普通 profile 不存 `personality_traits[]`，不写"谨慎型人格 / 控制欲强 / 玻璃心"等现实人格判断。
2. 允许写的是**游戏内行为偏好**，如 `steady_growth`、`objective_first`、`likes_story_mode`。
3. "像哪个游戏角色"只在 § 3.13 独立授权测定中出现，且必须游戏化表达、可删除、可反馈，不反向污染普通陪伴策略。

---

### 3.11 高光事件 highlight_event

高光事件用于记录值得被桌宠记住的游戏瞬间，可作为日记、画像页和分享素材。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `highlight_id` | 高光 ID | `"hl_2026042100001"` | 记忆系统 | **系统生成**：UUID（highlight 触发条件命中时分配） | 系统 UUID | P1 | 主键 |
| 2 | `title` | 标题 | `"首次单杀王者打野"` | Memory Intelligence / Consumer Runtime → 用户可编辑覆盖 | **AI 生成建议**：基于 episode + idip_milestone 生成（≤20 字）；**用户操作**：UI 可编辑；编辑后的新值按 `generation_method=user_set` 处理，AI 不再覆盖 | 引用 atomic_facts 必须 quote_eligible=true | P1 | 标题（≤20 字） |
| 3 | `time` | 时间 | `"2026-04-20T22:15:33Z"` | 记忆系统 | **系统直接**：上游 trigger event 的时间戳（idip_milestone.at / episode.time_range.end / user_starred_at） | 系统时间戳 | P1 | 事件时间 |
| 4 | `scene` | 场景 | `"王者荣耀 - 河道遭遇战"` | Memory Intelligence / Consumer Runtime | **AI 合成**：输入 `active_app` + `window_title_redacted` + `game_vlm.semantic_tags`（VLM 启用时）→ 输出场景描述短句；**触发**：highlight 生成时一次性合成 | 不输出个人身份信息 | P1 | 场景描述 |
| 5 | `event_summary` | 事件摘要 | `"在野区被对方打野针对 3 次后..."` | Memory Intelligence / Consumer Runtime → 用户可编辑覆盖 | **AI 生成**（≤80 字）；输入 = episode.content + game_event + idip_milestone；**强约束**：引用 `atomic_facts` 必须 `quote_eligible=true`；用户编辑后覆盖 | 引用 atomic_facts 必须 quote_eligible=true | P1 | 摘要 |
| 6 | `category` | 分类 | `achievement / growth / emotion / social / collection / relationship` | Memory Intelligence / Consumer Runtime → 用户可改 | **AI 分类**：输出枚举（achievement / growth / emotion / social / collection / relationship）；**输出 schema 强约束**（禁止自由文本）；用户改后覆盖 | enum 强约束 | P1 | 6 类枚举 |
| 7 | `tags[]` | 标签 | `["反蹲", "单杀", "首次"]` | Memory Intelligence / Consumer Runtime → 用户可改 | **AI 生成标签建议**（≤5 条，去重）；用户改后覆盖 | 不输出个人身份信息 | P1 | 自由标签 |
| 8 | `source` | 触发源 | `idip_milestone / episode_highlight_score / user_starred` | 记忆系统 | **系统标记触发源 enum**：根据 highlight 生成路径标注 → idip_milestone / episode_highlight_score / user_starred | enum；角色相似度结果不生成高光，避免自证循环 | P1 | 触发源 |
| 9 | `privacy_level` | 隐私级别 | `private / shareable` | 记忆系统 | **用户输入**：默认 `private`；用户主动分享时才生成 `shareable` 版本 | private 不可分享；用户可改 | P1 | private / shareable |
| 10 | `pinned` | 置顶 | `true / false` | 记忆系统 | **用户输入直接**：偏好设置页 UI 置顶操作 | 用户输入 | P1 | 置顶 bool |
| 11 | `evidence_ids[]` | 证据 IDs | `["game_event_xx", "idip_milestone_xx"]` | 记忆系统 | **系统直接**：highlight 生成时把上游 episode / game_event / idip_milestone / atomic_facts 的 ID 数组写入；供分享卡片 / 复盘 / 角色相似度解释反查实证 | 指向 ID，不含原始内容 | P1 | 反查实证 |
| 12 | `is_active` | 是否可用 | `true` | 记忆系统 | **系统记录**：默认 true；用户删除 / 否定 / 替换后置为 false | false 后不可展示、不可引用、不可作为角色相似度证据 | P1 | 统一生命周期 |
| 13 | `inactive_reason` | 不可用原因 | `user_deleted / user_rejected / user_replaced / expired / conflict_with_newer_evidence / null` | 记忆系统 | **系统记录**：仅当 `is_active=false` 时填写 | 不含原始内容 | P1 | 解释为什么不能用 |
| 14 | `inactive_at` | 失效时间 | `"2026-05-13T10:50:00Z"` | 记忆系统 | **系统记录**：高光被删除、否定、替换或过期时写入 | 系统时间戳 | P1 | 审计 / 恢复 |

#### Schema 示例

```json
{
  "data_source": "highlight_event",
  "highlight_id": "hl_2026042100001",
  "title": "首次单杀王者打野",
  "time": "2026-04-20T22:15:33Z",
  "scene": "王者荣耀 - 河道遭遇战",
  "event_summary": "在野区被对方打野针对 3 次后，第 4 次反蹲成功完成单杀",
  "category": "achievement",
  "tags": ["反蹲", "单杀", "首次"],
  "source": "idip_milestone",
  "privacy_level": "private",
  "pinned": true,
  "evidence_ids": ["game_event_2026042100872", "idip_milestone_2026042100015"],
  "is_active": true,
  "inactive_reason": null,
  "inactive_at": null
}
```

---

### 3.12 用户偏好与隐私控制 user_preferences

用户偏好与隐私控制用于保存授权、功能开关、删除、更正和内容生成设置。除显式反馈记录外，本节字段只能由用户操作写入或修改。

本节所有配置只作用于当前桌宠绑定的单一游戏实例，不跨游戏共享。

| 层 | 子对象 | 用途 |
|---|---|---|
| 授权与记忆控制 | `privacy_grants` / `deletion_policy` / `memory_controls` | 控制哪些数据可进入画像、哪些记忆要删、哪些总结不准、以后不要怎么记 |
| 功能开关与生成设置 | `content_type` / `diary_style` | 控制是否生成日记 / 高光 / 复盘等内容，以及生成内容的展示偏好 |

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 3a | `content_type.enabled[]` | 启用的生成内容类型 | `["light_reflection", "emotion_companion", "diary"]` | 用户设置（memory 持久化） | **偏好设置页 UI 写入**：用户显式勾选启用项 | 用户显式开关；**用户主动设置永远优先** | P1 | 画像页生成内容类型；枚举 8 类 |
| 3b | `content_type.priority[]` | 启用项优先级排序 | `["emotion_companion", "diary", "light_reflection"]` | 用户设置（memory 持久化） | **偏好设置页 UI 写入**：用户拖拽排序 | 用户主动输入 | P1 | 多内容竞争时优先输出顺序 |
| 3c | `content_type.user_feedback[]` | 内容反馈事件 | `[{target:"tactical_advice", value:0, source:"button", at:"..."}]` | 用户显式反馈行为（memory 记录） | **系统自动写**：用户点赞 / 点踩 / 口头或文本反馈累计记录；用于权重学习推荐，**不直接覆盖 enabled**；同一 target 以最新 `at` 为准 | 仅记录反馈行为；**显式开关优先** | P1 | 反馈学习辅助权重 |
| 4a | `diary_style.frequency` | 日记频率 | `event_driven` | 用户设置（memory 持久化） | **偏好设置页 UI 写入**：用户在"日记偏好"面板设置；**AI 严格禁止自动写入** | 用户主动输入 | P1 | daily / weekly / event_driven / off |
| 4b | `diary_style.length` | 日记长度 | `medium` | 用户设置（memory 持久化） | ↑ 同上 | ↑ 同上 | P1 | short / medium / long |
| 4c | `diary_style.focus` | 日记重点 | `emotion` | 用户设置（memory 持久化） | ↑ 同上 | ↑ 同上 | P1 | events / emotion / growth / mixed |
| 4d | `diary_style.quote_user_original` | 引用用户原话 | `true` | 用户设置（memory 持久化） | ↑ 同上 | 仅当 `privacy_grants.diary_quote.granted=true` 且引用内容 `quote_eligible=true` 时生效；授权关闭时本字段不能越权 | P1 | 是否偏好日记引用对话原文 |
| 5a | `privacy_grants.chat_content` | 聊天内容入长期记忆授权 | `{granted: true, granted_at: "...", revoked_at: null}` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 隐私设置页用户主动勾选；AI 严禁自动设置 | 默认 false；用户主动 | P0 | 首方对话是否可进入长期画像 |
| 5b | `privacy_grants.game_event_memory` | 游戏事件入长期画像授权 | 同 5a 格式 | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户主动勾选；实时游戏反应与长期画像写入分开 | 核心实时反应可用；长期画像可关 | P0 | 进度 / 成就 / 风格画像 |
| 5c | `privacy_grants.behavior_data` | 行为数据画像授权 | 同 5a 格式 | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户主动勾选 | 默认 false | P1 | 低敏行为信号用于打扰 / 玩法推断 |
| 5d | `privacy_grants.vlm_visual` | 当前窗口画面理解授权 | 同 5a 格式 + `app_scope[]` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户按 app 实例开启；默认关 | 当前授权游戏窗口 + 短期 buffer；允许产品内大模型服务处理；不存原图 / 不训练 / 不留原始帧日志 | P1 | 游戏场景语义 |
| 5e | `privacy_grants.ui_text_reading` | 当前窗口界面文字读取授权 | 同 5a 格式 + `app_scope[]` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户按 app 实例开启；默认关 | 只读按钮 / 弹窗 / 游戏提示等界面文字；不读聊天 / 邮件 / 文档正文 / 密码框 | P1 | 界面提示理解 |
| 5f | `privacy_grants.system_audio_music_context` | 系统音频音乐 / 氛围感知授权 | `{granted:false, ...}` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户主动开启；默认关；仅允许音乐 / 音频氛围语义 | 不保存原始音频；不做人声转写；不采集通话 / 会议内容 | 扩展 | 桌宠感知音乐 / 氛围 |
| 5g | `privacy_grants.mcp_sources[]` | MCP app 授权列表 | `[{source:"steam", granted:true}]` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户单 app 勾选 / 撤回；用户侧不拆字段级授权 | 默认空；仅允许授权 app 的字段白名单 | P1 | 外部 app 元数据 / 任务标题 / app 摘要 |
| 5h | `privacy_grants.profile_inference` | AI 推断画像项生成授权 | `{granted: true, ...}` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户允许产品内大模型生成 AI 推断画像项；可暂停 | 关闭后不新增 AI 推断画像项，`profile.summary` 也停止自动重写，仅保留用户主动"重新总结我" | P0 | AI 推断画像项写回 |
| 5i | `privacy_grants.character_similarity_assessment` | 角色相似度测定授权 | `{granted:false, ...}` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户主动触发并同意本次测定；每次测定保留 consent snapshot | 默认 false；不做后台周期性测定 | P1 | § 3.13 |
| 5j | `privacy_grants.diary_quote` | 日记 / 分享引用用户原话授权 | `{granted:false, ...}` | 用户显式授权 / 撤回（memory consent ledger 持久化） | 用户主动开启；仍需 quote_eligible=true | 默认 false | P1 | 日记 / 高光分享 |
| 6a | `deletion_policy.delete_on_revoke` | 撤回授权时是否删除历史 | `ask / delete_now` | 用户选择（memory 持久化） | 用户选择；撤回时弹确认 | 撤回授权与删除历史分开表达 | P0 | 避免误删 |
| 6b | `deletion_policy.profile_reset_at` | 画像清空时间 | `"2026-05-12T16:00:00Z"` | 用户删除操作（memory 记录） | 用户点"清空画像"时记录 | 清空后 AI 不能用旧画像 | P0 | 重置画像 |
| 6c | `memory_controls.resummarize_requested_at` | 重新总结请求时间 | `"2026-05-12T16:05:00Z"` | 用户请求（memory 记录） | 用户点击"重新总结我"或对桌宠说"重新总结我"时记录 | 只由用户触发 | P0 | 触发画像重新总结 |
| 6d | `memory_controls.do_not_remember_rules[]` | 以后别这样记 | `["不要根据一次连败总结我心态差"]` | 用户更正（memory 记录） | 用户直接编辑或对桌宠说"以后别这样记"时写入 | 用户更正优先；AI 不得覆盖 | P0 | 约束后续 AI 推断画像项 |

#### Schema 示例

```json
{
  "data_source": "user_preferences",
  "schema_version": "0.2.0",
  "last_updated_at": "2026-05-13T10:30:00Z",
  "content_type": {
    "enabled": ["light_reflection", "emotion_companion", "diary"],
    "user_feedback": [{"target": "tactical_advice", "value": 0, "source": "button",
                       "at": "2026-05-10T20:01:00Z"}]
  },
  "diary_style": {"frequency": "event_driven", "length": "medium", "focus": "emotion", "quote_user_original": false},
  "privacy_grants": {
    "chat_content": {"granted": true, "granted_at": "2026-05-13T10:00:00Z", "revoked_at": null},
    "game_event_memory": {"granted": true, "granted_at": "2026-05-13T10:00:00Z", "revoked_at": null},
    "behavior_data": {"granted": false, "granted_at": null, "revoked_at": null},
    "vlm_visual": {"granted": false, "app_scope": []},
    "ui_text_reading": {"granted": false, "app_scope": []},
    "system_audio_music_context": {"granted": false, "granted_at": null},
    "mcp_sources": [{"source": "steam", "granted": true, "granted_at": "2026-05-13T10:05:00Z"}],
    "profile_inference": {"granted": true, "granted_at": "2026-05-13T10:00:00Z"},
    "character_similarity_assessment": {"granted": false, "granted_at": null},
    "diary_quote": {"granted": false, "granted_at": null}
  },
  "deletion_policy": {
    "delete_on_revoke": "ask",
    "profile_reset_at": null
  },
  "memory_controls": {
    "resummarize_requested_at": null,
    "do_not_remember_rules": ["不要根据一次连败总结我心态差"]
  }
}
```

---

### 3.13 游戏角色相似度测定 game_character_similarity_assessment

角色相似度测定回答"用户像游戏里的哪个角色，以及像在哪里"。它由用户主动触发，只使用已授权且 `is_active=true` 的画像、游戏事件和高光证据。

该能力不是现实人格诊断，也不是心理测试。结果可解释、可反馈、可删除，默认不影响日常陪伴策略。

#### 角色特点配置 Character Trait Profile

每个可测角色必须先配置一组可展示特点。UI 展示的不是"你 82% 像 TA"，而是"你在哪些角色特点上像 TA"。

```json
{
  "character_id": "mage_mentor",
  "character_name": "星轨导师",
  "character_taxonomy_version": "public_character_taxonomy_v1.2",
  "traits": [
    {
      "dimension": "playstyle",
      "display_label": "玩法风格",
      "character_trait": "稳健发育，优先控制节奏，关键时刻支援队友",
      "requirement": "用户表现出稳健成长、目标优先、团队支援等信号",
      "positive_signals": ["steady_growth", "objective_first", "team_support"],
      "negative_signals": ["high_risk_all_in", "ignore_objective"],
      "weight": 0.30,
      "min_distinct_evidence_count": 2,
      "judge_strategy": "rule_first_ai_judge",
      "allowed_evidence_types": ["playstyle_profile", "game_event", "idip_delta", "highlight_event"]
    }
  ]
}
```

#### 固定展示维度

| dimension | UI 展示名 | 比较内容 | 典型 evidence | 判定策略 |
|---|---|---|---|---|
| `playstyle` | 玩法风格 | 用户怎么玩 | `playstyle_profile.*` / `game_event` / `idip_delta` / `highlight_event` | 规则优先 + AI judge 兜底 |
| `goal_orientation` | 游戏目标 | 用户最近追求什么 | `game_profile.game_goals[]` / `progress_profile.current_goal` / `idip_milestone` | 规则优先 |
| `progress_pattern` | 成长路径 | 用户如何推进、卡关、突破 | `progress_profile.*` / `idip_milestone` / `highlight_event` | 规则优先 |
| `emotional_response` | 情绪反应 | 输赢、失败、压力下的反应偏好 | `companion_profile.*` / `episode` / `atomic_facts` / `user_feedback[]` | AI judge with rules |
| `social_style` | 社交方式 | 单人、组队、协作、分享倾向 | `social_profile.social_preference` / `team_game_event` | 规则 + AI judge |
| `content_preference` | 内容偏好 | 用户希望桌宠聊什么、记录什么 | `user_preferences.*` / `companion_profile.*` | 规则优先 |

#### 判定标准

每个 trait 的 `match_score` 只允许是 `0` 或 `1`，但只有在该维度可判断时才产生。未授权或证据不足不是 `0`。

| 状态 | 含义 | 是否进入总分 |
|---|---|---|
| `matched` | 证据足够，且满足角色 trait 的 requirement | 是，按 `match_score=1` |
| `not_matched` | 证据足够，但不满足 requirement 或命中反向信号 | 是，按 `match_score=0` |
| `uncertain` | 证据冲突严重或 judge 低置信 | 否 |
| `insufficient_evidence` | 已授权但数据不足 | 否 |
| `not_authorized` | 用户未授权该维度所需 evidence | 否 |

判定优先级：

1. 结构化信号能判断时，优先规则判定。
2. 文本证据、冲突证据或低置信场景，使用 AI judge 兜底。
3. 人工只维护角色 trait 配置、signal taxonomy 和评测集，不逐个判定用户。
4. AI judge 必须只引用 `evidence_ids[]`，不得引入新事实。

`similarity_score` 只作为排序 / 稳定性字段，不作为 UI 主展示：

```text
similarity_score = sum(match_score × weight) / sum(evaluable_trait_weight)
```

如果 `evaluable_trait_count < 2` 或 `distinct_evidence_count < 3`，不展示确定角色结果。

#### 字段表

| # | 字段名 | 字段 | 示例值 | 来源 | 产出方式 | 隐私边界 | 优先级 | 用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | `assessment_id` | 测定 ID | `"char_sim_2026051300001"` | 记忆系统 | 系统生成 UUID | 系统 UUID | P1 | 主键 |
| 2 | `character_taxonomy_version` | 角色体系版本 | `"public_character_taxonomy_v1.2"` | 产品内角色配置 | 返回当前绑定游戏的可用角色体系版本；仅使用授权可展示角色名 | 禁止写内部代号 / 未授权 IP 信息 | P1 | 防止结果过期 |
| 3 | `input_scope` | 本次测定使用的数据范围 | `{profile:true, game_event:true, chat:false, chat_derived:true}` | 记忆系统 | 调用前记录输入范围；只纳入授权且 `is_active=true` 的证据 | 用户授权快照；可审计 | P1 | 解释用了哪些数据 |
| 4 | `consent_snapshot` | 本次授权快照 | `{profile_inference:true, character_similarity_assessment:true}` | 记忆系统 | 测定前复制本次实际生效授权；撤回授权后历史结果仍可解释，但不可新增测定 | 不含原始内容 | P1 | 审计 / 解释 |
| 5 | `allowed_evidence_types_used[]` | 实际使用的证据类型 | `["playstyle_profile", "game_event", "highlight_event"]` | 记忆系统 | 从角色 trait 配置与本次授权交集生成；未授权或 inactive 的证据类型不得进入 | 只记录类型，不含原文 | P1 | 说明用了哪些证据 |
| 6 | `assessment_status` | 测定流程状态 | `completed / insufficient_authorization / insufficient_evidence` | 记忆系统 + 产品内大模型服务 | 测定流程状态机写入；删除 / 过期不写在这里，统一走 `is_active=false + inactive_reason` | 未完成时不展示确定角色 | P1 | 区分未授权 / 证据不足 / 已完成 |
| 7 | `matched_character_id` | 最相似角色 ID | `"mage_mentor"` | 产品内大模型服务 | 基于授权数据分析返回；必须来自授权角色体系；未完成时为 null | 不写内部代号 | P1 | 结果主键 |
| 8 | `matched_character_name` | 最相似角色名 | `"星轨导师"` | 产品内大模型服务 | 返回可展示角色名；未完成时为 null | 仅授权可展示名称 | P1 | UI 展示 |
| 9 | `similarity_score` | 加权命中率 | `0.75` | 产品内大模型服务 | 基于可判断 traits 的 `match_score × weight` 计算；范围 0-1 | 不作为人格分数；UI 可不展示具体数字 | P1 | 排序 / 结果稳定性 |
| 10 | `matched_traits[]` | 命中的角色特点 | `[{dimension:"playstyle", match_score:1}]` | 产品内大模型服务 | 只包含 `match_status=matched` 的 trait；每项必须带 evidence_ids | 解释必须基于 evidence | P1 | UI 主展示："你像 TA 的地方" |
| 11 | `unmatched_traits[]` | 未命中的角色特点 | `[{dimension:"social_style", match_score:0}]` | 产品内大模型服务 | 只包含证据足够但 `not_matched` 的 trait | UI 默认可折叠；避免羞辱性表达 | P1 | 解释差异 / 用户更正 |
| 12 | `not_evaluable_traits[]` | 不可判断的特点 | `[{dimension:"content_preference", reason:"insufficient_evidence"}]` | 记忆系统 + 产品内大模型服务 | 未授权 / 证据不足 / 不确定的 trait 不参与总分 | 不把未知当作不符合 | P1 | 解释为什么没有测出来 |
| 13 | `data_window` | 数据窗口 | `{from:"...", to:"...", session_count:62}` | 记忆系统 | 调用前统计可用数据窗口范围 | 系统统计 | P1 | 可解释 |
| 14 | `assessment_at` | 测定时间 | `"2026-05-13T10:40:00Z"` | 记忆系统 | 系统时间戳 | 系统时间戳 | P1 | 测定时间 |
| 15 | `user_feedback[]` | 用户反馈事件 | `[{value:1, source:"chat", at:"..."}]` | 记忆系统 | 用户显式反馈事件写入：按钮反馈或对桌宠说"这像/这不像/这不准"等口头/文本反馈；正向 = `1`（like），负向 = `0`（unlike）；多次反馈以最新 `at` 为准；删除走 `is_active=false + inactive_reason=user_deleted`，不混入 feedback 值 | 用户输入 | P1 | 结果反馈信号 |
| 16 | `use_for_companion` | 是否允许结果影响陪伴策略 | `false` | 记忆系统 | 用户接受结果后可单独开启；默认 false | 默认不影响桌宠对话策略 | P1 | 防止测定污染日常陪伴 |
| 17 | `is_active` | 是否可用 | `true` | 记忆系统 | 默认 true；用户删除 / 否定 / 结果过期 / 证据冲突后置为 false | false 后不可展示、不可引用、不可作为桌宠参考信息 | P1 | 统一生命周期 |
| 18 | `inactive_reason` | 不可用原因 | `user_deleted / user_rejected / user_replaced / expired / conflict_with_newer_evidence / null` | 记忆系统 | 仅当 `is_active=false` 时填写；taxonomy version 变更或数据窗口过旧用 `expired` | 不含原始内容 | P1 | 解释为什么不能用 |
| 19 | `inactive_at` | 失效时间 | `"2026-05-20T10:40:00Z"` | 记忆系统 | 测定结果变为不可用时写入 | 系统时间戳 | P1 | 审计 / 重测提示 |

#### Schema 示例

```json
{
  "data_source": "game_character_similarity_assessment",
  "assessment_id": "char_sim_2026051300001",
  "character_taxonomy_version": "public_character_taxonomy_v1.2",
  "input_scope": {"profile": true, "game_event": true, "chat": false, "chat_derived": true, "vlm": false},
  "consent_snapshot": {
    "profile_inference": true,
    "game_event_memory": true,
    "character_similarity_assessment": true,
    "chat_content": false,
    "vlm_visual": false
  },
  "allowed_evidence_types_used": ["playstyle_profile", "game_event", "idip_milestone", "highlight_event"],
  "assessment_status": "completed",
  "matched_character_id": "mage_mentor",
  "matched_character_name": "星轨导师",
  "similarity_score": 0.75,
  "matched_traits": [
    {
      "dimension": "playstyle",
      "display_label": "玩法风格",
      "character_trait": "稳健发育，优先控制节奏，关键时刻支援队友",
      "user_match_summary": "你最近多次优先完成目标，并在关键局中支援队友。",
      "match_status": "matched",
      "match_score": 1,
      "weight": 0.30,
      "judge_strategy_used": "rule_first",
      "evidence_ids": ["game_event_2026050800123", "profile_fact_2026051000031"]
    },
    {
      "dimension": "goal_orientation",
      "display_label": "游戏目标",
      "character_trait": "重视长期成长，不急于短期胜负",
      "user_match_summary": "你的近期目标集中在练习新角色和提升稳定性。",
      "match_status": "matched",
      "match_score": 1,
      "weight": 0.20,
      "judge_strategy_used": "rule_first",
      "evidence_ids": ["profile_goal_2026050700012"]
    }
  ],
  "unmatched_traits": [
    {
      "dimension": "social_style",
      "display_label": "社交方式",
      "character_trait": "喜欢组队协作和主动支援",
      "user_match_summary": "你近期更多选择单人推进，较少触发组队协作或主动支援相关事件。",
      "match_status": "not_matched",
      "match_score": 0,
      "weight": 0.10,
      "judge_strategy_used": "rule_first",
      "evidence_ids": ["game_event_2026051000120"]
    }
  ],
  "not_evaluable_traits": [
    {
      "dimension": "content_preference",
      "display_label": "内容偏好",
      "reason": "insufficient_evidence"
    }
  ],
  "data_window": {"from": "2026-04-13T00:00:00Z", "to": "2026-05-13T00:00:00Z",
                  "session_count": 62},
  "assessment_at": "2026-05-13T10:40:00Z",
  "user_feedback": [],
  "use_for_companion": false,
  "is_active": true,
  "inactive_reason": null,
  "inactive_at": null
}
```

## 4. 数据与隐私边界关系汇总

| 模块 | 与 § 1.2 数据与隐私边界的关系 | 边界说明 |
|---|---|---|
| § 3.1 chat | 首方对话；不读取第三方聊天 / 邮件 / 文档内容 | 用户可按消息或会话删除 |
| § 3.2 PC 进程 | 只使用实时 app 状态；不读取 app 内容 | P0 不进入长期画像 |
| § 3.3 behavior - UI & 用户操作 | 不记录键盘输入内容；只允许输入强度 / 节奏等低敏统计 | 界面文字读取需用户开启 |
| § 3.4 MCP 通道 | 用户单 app 勾选 + 固定字段白名单 + app 摘要来源校验 | 不接收消息、邮件、文档、会议正文 |
| § 3.5 idip | 首方游戏状态数据 | 不含真实账号、付费记录、实名信息 |
| § 3.6 实时事件 | 首方游戏事件流 | payload 只保留最小必要游戏内状态 |
| § 3.7 当前窗口画面理解 VLM | 默认关闭；只理解授权游戏窗口；不保存原图、不训练、不留原始帧日志 | 只回写语义标签和用户可见摘要 |
| § 3.8 current_context | 只使用已授权或 P0 允许的短期信号 | 不沉淀原始内容 |
| § 3.9 profile_meta | 记录来源、证据、置信度和可用状态 | 支撑解释、删除和用户更正 |
| § 3.10 profile | 只描述游戏体验相关画像 | 不写现实人格、健康、政治宗教等敏感推断 |
| § 3.11 highlight_event | 默认 private；用户主动分享时才生成 shareable 版本 | 必须带 evidence_ids |
| § 3.12 user_preferences | 授权开关、删除策略和用户更正落地 | 系统音频只保留音乐 / 氛围语义，不保存原始音频 |
| § 3.13 game_character_similarity_assessment | 用户主动触发；只使用授权画像子集和该游戏授权角色体系 | 结果必须可解释、可反馈、可删除 |

---
