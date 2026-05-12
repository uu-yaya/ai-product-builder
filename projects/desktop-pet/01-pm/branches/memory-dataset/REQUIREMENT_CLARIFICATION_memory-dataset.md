# Requirement Clarification: Memory Dataset (桌宠对记忆系统的数据需求)

> Project: `desktop-pet`
> Branch: `memory-dataset`
> Thread: PM Strategy Thread
> Date: 2026-05-11
> Status: Draft v2.5.1（v2.5 全量修订 + mock §11 同步 + 2026-05-12 文档一致性修复：Proposal/Deferred 口径统一 / VLM 优先级全局 P1 / A1-A3 命名空间澄清 / 70%-7B 残留消除 / source_category 边界澄清 / MCP MVP 措辞澄清；详见 §0.8 一致性修复摘要）
> Scope: 仅 PM 视角的数据需求声明与原因解释。**不包含** schema 工程落地、SDK API、UI、存储架构与模型选型。

## 0.0 分支本质（v2.3.3，2026-05-11 19:30 — 框架精确化）

> 此节是给任何首次读到本分支的人的"防误读说明"。`memory-dataset` 字面像"过去的记忆数据"，**但实际范围比字面更宽**。v2.3.3 用更精确的"脑 vs 嘴和耳"框架替代 v2.3.2 的"被动观察 vs 主动交互"框架，理由见本节末。

### 分工标准：脑 vs 嘴和耳

把桌宠想象成一个真人朋友坐在你旁边：

| 桌宠的"器官" | 真人朋友类比 | 项目分支 | 职责 |
|---|---|---|---|
| **脑**（数据 + 上下文 + 记忆 + 推断） | 朋友的大脑：存事、想事、判断现在该不该开口 | `memory-dataset`（本分支） | 全部数据感知 — 用户内容 + 环境状态 + 历史记忆 + 实时上下文 |
| **嘴和耳**（语音 I/O 通道） | 朋友的嘴、耳朵、舌头（设备 + 处理通路） | `voice-interaction`（待启动） | 麦克风采集 / 扬声器输出 / STT 引擎 / TTS 引擎 / 唤醒词 / 音色管理 |

### 关键原则：memory 层是**内容层**，不携带"采集通道"

桌宠的"脑"只关心 **what**（内容是什么），不关心 **how**（数据怎么拿到的）。这与项目既有模式完全一致：

| 数据 | memory 是否标"采集通道"？ | 一致性说明 |
|---|---|---|
| VLM 输出 "scene_emotional" | ❌ 不标"来自 Bilibili 还是 YouTube" | 只关心场景标签内容 |
| audio A0 BPM | ❌ 不标"音乐来自 QQ 音乐还是网易云" | 只关心节拍值 |
| active_app | ❌ 不标"通过 macOS Accessibility 还是 Windows UIA 检测的" | 只关心 app 名 |
| game event "boss_engaged" | ❌ 不标"来自 idip 上报还是 VLM 推导" | 只关心事件类型 |
| **chat 文本** | ❌ **不标"用户用键盘打的还是 STT 转的"** | 只关心文本内容 |

**统一模式**：memory 层只存**内容**；"采集通道是怎么拿到内容的"是 runtime 关注点，**不进**记忆。

### 两分支的接口 = 干净文本边界

```
[ voice-interaction ]
   麦克风采集 → STT → 用户认可的最终文本 ──┐
                                          ▼
[ memory-dataset ]                       §4.1 chat 通道
   atomic_facts / episode / profile ←── 用户内容（来自键盘或 STT 不区分）
                                          ▲
                                          │
[ 键盘输入 ] ─────────────────────────────┘
```

到了 chat 这一步**文本 = 文本**，无差别。两分支的接口就是一行：

```
voice-interaction.STT_output(text: str) → memory-dataset.chat(text)
```

**不传递**：input_modality 标记 / STT confidence 透传 / 原始音频 buffer 引用 — 这些都是 voice-interaction 的内部状态，不进 memory 层。

### 字段归属速查

| 内容 / 能力 | memory-dataset | voice-interaction |
|---|---|---|
| chat / atomic_facts / episode / profile / profile_meta | ✅ 全部归这里 | — |
| current_context（5min 滑窗） | ✅ | — |
| active_app / 窗口标题 / UI 文本 / 键盘 L0 / L1 | ✅ | — |
| MCP（now playing / calendar） | ✅ | — |
| game idip / event stream / VLM | ✅ | — |
| 系统音频 A0（BPM / 能量 / 节拍）+ A1 Now Playing 标识 | ✅ | — |
| Playwright snippet（用户主动触发） | ✅ | — |
| 用户对**语音的偏好**（喜欢哪个音色 / 习惯用语音还是文字） | ✅（作为 profile 事实，与"喜欢稳定策略"同类） | — |
| 麦克风采集设备 / STT 引擎 / TTS 引擎 / 唤醒词触发 / 音色管理 | ❌ | ✅ |
| 语音通道**当前状态**（STT 现在开没 / input mode 是什么） | ❌ | ✅（runtime 状态） |
| 声纹 / 音色克隆 | ❌ | ✅ |

### 命名空间速查（v2.5.1 新增 — 防 A1/A2/A3 混淆）

本文档有**三个独立的字母分级命名空间**，含义互不重叠，读时请按上下文判断：

| 命名空间 | 体系 | 允许 / 排除 | 出现位置 |
|---|---|---|---|
| **档 A = Action 用户操作** | A1 派生 / A2 操作语义 / A3 编辑动作派生 | **A1 / A2 / A3 全部 ✅** | §4.3 / §11.3 / §11.4 / §11.4.1 |
| **音频 A = Audio 信号** | A0 派生 / A1 标识 / A2 内容 / A3 完整流 | **A0 / A1 ✅；A2 / A3 ❌** | §4.10 / §10.3 / §11.10 / PRIVACY_BOUNDARY 提案 |
| **键盘 L = 键盘信号分级** | L0 派生 / L1 快捷键 / L1.5 编辑动作 / L2 字符流 / L3 时序 | **L0 / L1 / L1.5 ✅；L2 / L3 ❌** | §10 / §10.1 |

**冲突点警示**：行为档 A2 (操作语义 ✅) 与 音频 A2 (内容 ❌) 字面相同但含义相反；行为档 A3 (编辑动作 ✅) 与 音频 A3 (完整流 ❌) 同理。每个出现 A1 / A2 / A3 字面的位置上下文 / 表头 / 章节归属必须能识别归哪个命名空间，否则视为文档 bug。

### 性质模糊时的默认归类

未来如果出现新能力，归类问自己一个问题：

> **它是"数据感知（内容层）"还是"I/O 通道（设备 + 引擎）"？**

- **是数据感知** → 本分支（memory-dataset）。
- **是 I/O 通道** → voice-interaction。
- **不确定** → 默认归 voice-interaction，因为引入新数据类别到 memory-dataset 需要 §3 / §4 字段补充与 §10 信号分级讨论，门槛更高。

### 为什么不再用 "被动观察 vs 主动交互" 框架？

1. 旧框架（v2.3.2）暗示"主动 = 不在本分支"，但实际上 STT 输出的**文本内容**应该和键盘输入的文本一样进 memory（用户用语音说"我喜欢稳定策略"和打字"我喜欢稳定策略"在 memory 层是同一条事实）。
2. v2.3.3 用"脑 vs 嘴和耳"，把分工放在**正确层级**（数据 vs 通道），与项目既有模式（memory 不携带采集通道）一致。
3. 实际效果对用户也更直观：用户记得朋友"听过 / 看过 / 知道什么"，但不会记得"朋友是用左耳还是右耳听到的"。

---

## 0.9 A / B 数据来源分类架构原则（v2.6 新增，2026-05-12 — 消费方接入驱动）

> 此节是给所有读者的"数据来源链路"通用速查。本分支所有字段在被实现 / 消费时都必须落到 A 或 B 之一；性质不清时按本节末尾 4 个判断问题归类。

### 0.9.1 A / B 两类定义

| 类别 | 含义 | 是否进 memory schema | 消费方使用方式 |
|---|---|---|---|
| **A 类** | 记忆系统**直接产出** | ✅ 是 | query API 直接拿，无需二次加工 |
| **B 类** | memory 提供**前置数据**，消费方用 LLM / 代码**二次转换** | ❌ 否 | 拿前置数据 + 当下场景 → 动态生成 |

A 类包括 memory **采集层** + memory **派生层**（含 AI 派生，但**结果 stored**）。
B 类受**桌宠 IP / 当下场景 / 用户偏好**影响，每次按需生成，**stored 会失效**。

### 0.9.2 三层数据架构

```
┌────────────────────────────────────────────────────────┐
│ Memory 采集层（A）                                       │
│ active_app / chat_text / game_event / behavior_*       │
│ idip_snapshot / audio_derived / mcp_* / os_api / 等等  │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Memory 派生层（A，含 AI 派生结果 stored）                  │
│ atomic_facts / episode / profile / emotion_signal      │
│ current_context / highlight_event / persona_assessment │
│ profile_meta / relationship_stats / 等等                │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ 消费侧动态生成（B，不进 memory schema）                   │
│ 日记正文 / 一句话画像卡片 / pet_observation             │
│ 桌宠对话回复 / 分享图文 / 人格结果页解释 / 等等          │
└────────────────────────────────────────────────────────┘
```

### 0.9.3 A 类内部派生方式细分

| 派生方式 | 例子 | 谁实现 |
|---|---|---|
| **采集层 - 直接** | active_app / chat_text / idip_snapshot | OS / 游戏 SDK / chat runtime |
| **派生层 - 规则代码** | episode.highlight_score / atomic_facts.quote_eligible / relationship_stats.companion_days | Engineering 规则加权 / PII 检测正则 + NER / 计数 SQL |
| **派生层 - AI（已在 AI Eval §3 锁定）** | atomic_facts / episode / profile / emotion_signal / event_emotion_tag / highlight_event.* / current_context.mood_estimate / VLM tags / persona similarity（外部平台） | AI Agent（本地 / 云端兜底，按 AI Eval 立场） |
| **派生层 - 用户输入** | user_preferences.* / profile.gameplay_motivation[] (已确认) / profile_meta.user_corrected | Memory Center UI 写入 |
| **派生视图 - 实时计算**（不持久化原子存储） | relationship_stats.* | Engineering 决定缓存策略 |

### 0.9.4 B 类消费侧生成内容清单（详见 §4.18）

| 内容 | 触发 | 数据源（从 memory 拿什么前置） | 实现 |
|---|---|---|---|
| **日记正文** | 用户查看 / 定时 | episode (highlight_score) + atomic_facts (quote_eligible) + event_emotion_tag + idip_milestone | 日记生成器 LLM agent |
| **一句话画像卡片 / 总览页标语** | 画像页加载 | profile.summary + relationship_stats + 桌宠 IP | UI Composer |
| **高光记忆"宠物视角观察"** | 高光页加载 / 分享 | highlight_event.* + 桌宠 IP | 消费侧 LLM |
| **桌宠实时对话回复** | 实时交互 | memory 全套 + current_context + 桌宠 IP | 桌宠 agent |
| **高光分享卡片图文** | 用户分享 | highlight_event + 分享模板 + 桌宠 IP | 分享服务 |
| **人格测定结果页解释文案**（"为什么像 TA"） | 测定完成 / 查看 | game_persona_assessment.similarity_breakdown[] + 反查证据 + 桌宠 IP | UI Composer |
| **关系等级 / 里程碑卡片文案** | 升级时 / 查看时 | relationship_stats + 桌宠 IP | UI Composer |

### 0.9.5 PM 架构红线

| # | 红线 | 理由 |
|---|---|---|
| 1 | **memory 不存"桌宠语气"内容** | pet_observation / 对话 / 日记正文 / 分享文案受 IP 影响；存了换 IP 失效 |
| 2 | **memory schema 字段必须 >1 消费方复用** | 单消费方一次性用的内容进 B 类（消费侧生成），避免 memory schema 膨胀 |
| 3 | **AI 派生层级（A vs B）以 AI Eval §3 各候选点为准** | atomic_facts / episode / profile / emotion / persona 进 A；对话回复 / 日记正文 / 卡片文案进 B |
| 4 | **B 类生成不写回 memory** | 例外：profile.summary 用户点"重新总结"由消费侧 LLM 生成后写回 memory（A 常驻 + B 触发更新混合） |
| 5 | **persona 不作为陪伴策略的直接驱动信号 / 不反向污染采集层** | 沿用 §4.16 红线，防过拟合 |

### 0.9.6 性质模糊时的默认归类

未来如果出现新字段 / 新数据需求，归类问 4 个问题：

| 问题 | 答 "是" → | 答 "否" → |
|---|---|---|
| Q1：≥2 个消费方使用同一份结果？ | A 候选 | B 候选（一次性使用） |
| Q2：结果不受桌宠 IP 影响？ | A 候选 | B（受 IP，每次按 IP 生成） |
| Q3：结果不受当下场景 / 用户偏好影响？ | A 候选 | B（动态） |
| Q4：结果在 AI Eval §3 已有派生候选点？ | A（沿用 AI Eval 立场） | 看 Q1-Q3 综合判断 |

四问全 "是" → A；任一 "否" → B；不确定 → 默认 B（避免 memory schema 误膨胀）。

---

## 0.8 v2.5.1 文档一致性修复摘要（2026-05-12 — Codex 两轮评审 + PM 自查 共 15 条全部修）

### 0.8.1 第一轮（9 条，commit 8160a95）

1. **背景**：v2.4 → v2.5 → v2.5.1 三轮快速迭代后，Codex 评审找到 7 条 + PM 自查补 2 条共 9 条文档一致性问题：版本号残留 / Deferred 口径冲突 / VLM 优先级 P1 vs P2 / A1-A3 命名空间复用 / 70%-7B 残留 / source_category 边界模糊 / MCP MVP 措辞拉扯。
2. **修复 1（P1-1）PRIVACY_BOUNDARY 提案口径统一**：line 7 顶部 `Status: Proposal` → `Status: Deferred`；§5 拆 Rejected / Deferred 两条独立路径 + 加状态语义对照表；§5.2 `v2.3 / v2` 锁版本号改为"当前版本"中性措辞。
3. **修复 2（P1-2）v2.4 → v2.5.1 残留批量改**：README §4 Deliverables + SYNC_SUMMARY §4 / §6 + TASK_BOARD T-001 + DECISION_LOG #31，共 5 处。
4. **修复 3（P1-3）VLM 优先级全局 P1 统一**：§7 AI 必要性快判 row 8 + §8 FEATURE_SUMMARY map row 5 从"P2 受限 / 探索能力（P2）"改为"P1 三档混合架构"。
5. **修复 4（P1-4）A1-A3 命名空间澄清**：§0.0 新增"命名空间速查"（三个独立命名空间：行为档 A / 音频 A / 键盘 L）+ §4.3 / §10 / §10.3 顶部各加命名空间说明。**不重命名**（避免破坏性 ripple）。
6. **修复 5（P2-1）source_category 边界澄清**：README §1.5 + 主文档 §4.9 加"采集技术通道 vs 数据来源域"区分说明。
7. **修复 6（P2-2）VLM 70% / 7B 残留消除**：AI Eval §7 评估指标 line 685 从 `≥70%` 升 `≥85%`（三档混合）；§10 Open Questions #5 从 Open 改为 Resolved（Radar Task F 已证伪 70% 假设）；§3.6.4 line 339 "本地 VLM 7B 级候选" 加 nuance 明确"作为三档中档兜底，与 CNN + 云端配合"。
8. **修复 7（P2-3）MCP "MVP 不依赖" vs "MVP 首批" 措辞澄清**：§4.4.3 #4 + §4.4.4 顶部 + §11.5 顶部各加澄清 — 两个表述指不同维度（产品 MVP 整体 vs MCP 通道内部分级）。

### 0.8.2 第二轮（6 条，2026-05-12 Codex 复审）

1. **背景**：第一轮 9 条修复后 Codex 复审，发现 §1-§2 提案范围仍按 v2.3 三项口径 / VLM 云端授权三种措辞冲突 / VLM 档 2 规格 2-4B vs 7-8B 矛盾 / Rejected 撤回清单遗漏。
2. **修复 8（P1-1）PRIVACY_BOUNDARY §1 §2 范围扩展到 v2.5 八项**：§1 #4 #5 改"v2.3 三项 + v2.5 五项中至少 4 项与硬约束有交集"；§2 拆为 §2.1（v2.3 三项对照）+ §2.2（v2.5 五项扩展表）+ §2.3（受影响总览，主要 #2 + 次要 #1/#3/#4/#5）。
3. **修复 9（P1-2）"唯一受影响 #2" 表述废除**：原 §2 末尾 "唯一受影响 #2" 改为分层（主要 / 次要 / 不冲突），并加注 "v2.3 旧表仅适用 v2.3 三项"。
4. **修复 10（P1-3）§5 Rejected 撤回清单补 §4.4.8 / §4.4.9**：原撤回清单仅含 v2.5 三项（OS API / 浏览器扩展全方位 / OS Scripting Bridge），补全 CLI 工具调用 + IFTTT/Zapier webhook + 档 A 扩展 + L1.5；§13.5 #2.3 同步扩展。
5. **修复 11（P1-4）VLM 云端授权统一为两层模型**：AI Eval §3.6.1.1 图 + §3.6.3 #3.3 + §3.6.4 #2 统一为 **① onboarding 总开关 + ② 每次激活前用户显式确认本次上传**；任一层缺失则降级 unknown。原"每次激活给可见 UI 状态指示"含糊层删除。
6. **修复 12（P1-5）VLM 档 2 规格统一为量化 7-8B**：AI Eval §3.6.1.1 图 + §3.6.3 #2 + §3.6.6 + §7 + §9 全文 "2-4B VLM" → "量化 7-8B VLM"；图中 "MiniCPM-V-2 / Qwen2.5-VL-3B 量级，~2GB 显存" 改为 "MiniCPM-V 4.5 (8B int4) / Qwen2.5-VL-7B (Q4_K_M)，~4-5GB 显存"；PM 立场 #2 显存表述同步修正。Qwen2.5-VL-3B 在 §3.6.6 仍保留为 License 红线（仅研究用 / 禁商用）。
7. **修复 13（P2-1）REQUIREMENT_CLARIFICATION §13.5 #2.3 Rejected 清单扩展**：原仅列 v2.3 三项，扩展为 v2.3 三项 + v2.5 五项（含 §4.4.8 / §4.4.9）+ 档 A + L1.5 + §4.3.5 排除项，与 PRIVACY_BOUNDARY 提案 §5 完全对齐。

### 0.8.3 共同约束

1. **不引入新功能 / 不改字段定义 / 不改 mock 字段 / 不动 AI 立场**：纯文档内部一致性修复。
2. **不锁版本号**：所有撤回 / Defer / Accepted 条款均使用"当前版本"中性措辞，跟未来 v2.6+ 演化。
3. **状态语义清晰**：Accepted / Rejected / Deferred 三状态下 v2.3 三项 + v2.5 五项的处理方式分别明确，详见 PRIVACY_BOUNDARY 提案 §5 状态语义对照表。

### 0.8.4 v2.6 消费方扩展（2026-05-12 — 日记 + 用户画像页接入需求）

1. **背景**：v2.5.1 完成 PM 层数据来源（脑 vs 嘴和耳 + 6 通道并存）后，消费方（日记模块 + 用户画像页 15 模块）评审落地需求；PM 用严格标准评审 + 区分真数据需求 vs 偏好类 / 派生类 / 伪需求；与公司既有人格测定能力对齐。
2. **新增 §0.9 A/B 数据来源分类架构原则**：A 类 = memory 直接产出（schema 定义字段）；B 类 = memory 提供前置数据，消费方 LLM / 代码二次转换（不进 schema）；附三层数据架构图 + PM 红线 5 条 + 性质模糊时 4 问归类。
3. **日记 3 字段补**（A 类，进现有数据类）：
   1. `episode.highlight_score`（派生层规则代码） — 区分值得日记化的情节 vs 普通对话情节。
   2. `event_emotion_tag`（派生层 AI，扩 §3.4 emotion_signal 到事件级）— 日记需要事件级情绪锚点。
   3. `atomic_facts.quote_eligible`（派生层 PII 检测）— 日记引用原话的隐私安全开关。
4. **新增 4 个数据类 / 1 个派生视图**（全 A 类）：
   1. **§4.13 / §11.15 `highlight_event{}`** — 画像模块 7/8 高光记忆；不含 `game` / `pet_observation` 字段。
   2. **§4.14 / §11.16 `user_preferences{}`** — 画像模块 4/5/6/9/14 偏好持久层；5 子对象（companion_style / emotion_response / content_type / diary_style / privacy_grants）；除 content_type 反馈学习外 LLM 禁止自动写入；privacy_grants 默认全 false 强制用户主动。
   3. **§4.15 profile 扩展** — gameplay_motivation[] + gameplay_motivation_candidates[] + gameplay_style_tags[]（画像模块 2/3）。
   4. **§4.16 / §11.17 `game_persona_assessment{}`** — 画像模块 10/11；P1 候选（待 4 条前置确认）；接入公司既有外部平台；不含 `game_id`；evidence_strength ≥ 3 红线；persona 不驱动陪伴 / 不污染采集。
   5. **§4.17 / §11.18 `relationship_stats{}`** — 画像模块 12 关系成长；纯派生视图；纪念性非任务压力。
5. **新增 §4.18 B 类消费侧动态生成内容清单**（不进 memory schema）：8 项 — 日记正文 / 一句话画像卡片 / pet_observation / 桌宠对话 / 分享图文 / persona 解释 / 里程碑文案 / profile.summary 重写（B 触发更新例外）。
6. **§4.1 / §4.6 字段表加 A/B 标注列**：现有字段不动，加注 A/B 归属与派生方式。
7. **PM 红线汇总**（v2.6）：
   1. memory 不存"桌宠语气"内容（pet_observation / 对话 / 日记正文 / 卡片文案受 IP 影响走 B 类）。
   2. memory schema 字段必须 >1 消费方复用（单消费方一次性进 B）。
   3. AI 派生层级（A vs B）以 AI Eval §3 各候选点为准。
   4. B 类生成不写回 memory（例外：profile.summary 重写）。
   5. Persona 不驱动陪伴 / 不污染采集 / 不含 game_id（桌宠绑定单游戏前提）。
8. **未引入 PRIVACY_BOUNDARY 修订**：所有新增字段都在既有硬约束内运行；user_preferences.privacy_grants 是 PRIVACY_BOUNDARY 的二级开关，不放宽硬约束。
9. **不在本批范围**：模块 1 总览 / 模块 13 记忆管理 UI / 模块 14 隐私授权 UI（属 Memory Center Design 范畴）/ 模块 11 角色相似度页（属桌宠功能页 + AI Eval）— 仅数据层补充，UI 设计归 02-design。

## 0.7 v2.5.1 修订摘要（2026-05-12 — Mock §11 同步 v2.5 主体）

1. **背景**：v2.5 主体修订完成后，§11 mock 还停留在 v2.4 字段集，与 §3 / §4 / §10 不一致。用户要求 mock §11 同步 v2.5。
2. **§11.0 mock_metadata 扩展**：schema_version 0.2.0 → 0.3.0，新增 6 字段开关：os_api_enabled_channels / browser_extension_enabled_categories / osa_com_enabled_apps / keyboard_signal_levels_enabled (含 L1.5) / cli_tool_enabled / ifttt_webhook_enabled。
3. **§11.3 behavior_pc 扩展**：input_indicators 加 5 个 v2.5 A1 字段（mouse_region_heatmap_top3 / mouse_event_type_burst / input_device_switch_event / multi_display_activity / scroll_intensity_signal）。
4. **§11.4 behavior_ui 扩展**：新增 `semantic_events_v2_5[]` 含 9 类 OS 级操作语义事件（save / copy_paste / undo_redo_burst / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install_uninstall / window_arrangement_change）。
5. **§11.4.1 新增 behavior_edit**：A3 编辑动作派生 5 字段（text_edit_action_burst / undo_redo_rate_per_min / ime_state / editing_session_duration_min / text_edit_burst_frequency），对应 §10 L1.5。
6. **§11.12 新增 OS API 6 通道 mock**：now_playing 引用 §11.10 / user_activity / recent_files / notification_center / calendar / device_status。每通道带 `enabled` 开关。
7. **§11.13 新增浏览器扩展全方位 mock**：6 类 tab category + 每类独立开关；active_tab_signal 含 platform + url_domain + path_class_hint，**不读页面内容**。
8. **§11.14 新增 OS Scripting Bridge mock**：bridge_kind (osascript / powershell_com) / user_authorized_apps / samples[]（spotify now_playing / notes recent_documents / outlook unread_count / vlc app_state）/ ui_indicator_shown_per_app（合规检查项）。
9. **未变更**：§11.1 chat / §11.2 profile / §11.5 MCP / §11.6 game_idip / §11.7 game_event / §11.8 game_vlm / §11.9 current_context / §11.10 audio_derived / §11.11 playwright_tool_result（v2.5 主体没改这些字段）。
10. **v2.5.1 是 mock 同步补丁**，主文档 §3 / §4 / §10 / §13 等 v2.5 主体内容**不变**。

## 0.6 v2.5 修订摘要（2026-05-12 — 用户决定扩展采集面 + 接入通道 + OS Scripting Bridge）

1. **背景**：用户 2026-05-12 提出 v2.4 对"行为数据用户操作"与"娱乐工作 APP MCP"限制太大，需要扩展。PM 提出 17 个候选 idea，用户选定档 A 增量 + OS API + 浏览器全方位 + OS Scripting Bridge；VLM 视频类保留 v2.4 §4.7.4 不动。
2. **§4.3 行为数据用户操作全面扩展**（档 A 增量，不触 keylog 红线）：
   1. **A1 派生信号扩展**（§4.3.3 新增 5 字段）：mouse_region_heatmap_top3 / mouse_event_type_burst / input_device_switch_event / multi_display_activity / scroll_intensity_signal。
   2. **A2 操作语义事件**（§4.3.4 重写为"快捷键 + 操作语义事件"，8 字段）：save / copy_paste / undo_redo_burst / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install / window_arrangement。基于 macOS NSApp.sendEvent intercepts / Accessibility events 与 Windows EVENT_SYSTEM_*。
   3. **A3 文本编辑场景派生**（§4.3.4.1 新增，5 字段）：text_edit_action_burst / undo_redo_rate_per_min / ime_state / editing_session_duration_min / text_edit_burst_frequency。仅"动作类别"，不读字符内容 / IME composition / 剪贴板。
   4. **§4.3.5 排除项强化**：新增鼠标坐标流 / 像素 heatmap / 拖选选中内容 / 屏幕坐标完整时序排除。
   5. **§10 键盘分级新增 L1.5 编辑动作派生层**（与档 A A3 对应），L2 / L3 红线不变。
3. **§4.4 接入通道大幅重构**（从"MCP 通道"扩为"信号源总览"）：
   1. **OS 级 API 通道 6 新增**：UserActivity（macOS Handoff / Win Activity Feed） / Recent Files（NSMetadataQuery / Win Recent Items） / Notification Center / Calendar (EventKit / Outlook) / 设备状态环境（蓝牙 / 电池 / 网络） / Now Playing（v2.4 §4.10 已锁，本次再扩大范围）。
   2. **浏览器扩展全方位 6 类**：除 v2.4 视频类外，新增购物 / 阅读 / 学习 / 社交浏览 / 工作 5 类，共用 v2.4 §4.7.4 扩展 + Native Messaging 主路径与"只识别 tab 身份不读内容"硬边界。
   3. **MCP 收紧为"工作类生态成熟"通道**：MVP 首批仍锁 dida / feishu / steam；不再期待娱乐 / 内容类 app 走 MCP。
   4. **IFTTT / Zapier / Make webhook 桥接**作为 P2 探索通道。
4. **§4.12 新增 OS Scripting Bridge**（osascript / AppleScript + PowerShell COM Automation）：接入 Spotify / Apple Music / Music.app / QuickTime / VLC / IINA / Notes / Bear / Things / Reminders / Office / Outlook 等支持系统脚本接口的 app；比 MCP 通用，比 OS API 具体，比 Playwright 稳定；走"app 主动暴露脚本接口"合规路径。
5. **§3 总览表新增 4 行**：行为数据扩展 / OS API 通道 / 浏览器扩展全方位 / OS Scripting Bridge。
6. **§4.7.4 视频类 VLM 保留 v2.4 不动**：用户决定保留"剧情同步反应"愿景；不接受 trade-off 降级。
7. **§13 Next Steps 重写**：Engineering 接手清单大幅扩展（含 OS API 6 通道 + 浏览器扩展 6 类 + OS Scripting Bridge 调研）；Radar 第三批潜在调研主题列出。
8. **未直接修改**：mock §11.x 暂不全量更新（v2.5 字段太多，等 Engineering schema 草案后一并对齐）；AI Feature Evaluation 同步顶部 + §2 + §3.11；PRIVACY_BOUNDARY 修订提案保持 Deferred 状态但加注本批 v2.5 新增通道也将合并到 voice-interaction 提案审议中。

## 0. v2 更新摘要（2026-05-11）

1. Open Questions §9 全部收口（详见 §9 表格 Resolution 列）。
2. Q1 用户答"原始流和派生信号都要"，PM **不接受原始按键 / 字符流**；改为提出"四源叠加替代方案" §4.3.5（派生指标 + 快捷键事件流 + 脱敏窗口标题 + UI 文本 opt-in），并新增 §10 "键盘信号分级标准"。
3. Q6 VLM 升为 P1（用户授权），相应更新 §3 / §4.7。
4. Q7 `emotion_signal` 进 MVP，相应更新 §4.1。
5. Q10 用户要求文档内附 mock 数据格式，新增 §11 "Mock Schema 示例"（覆盖 6 类数据 + current_context + profile_meta，全部结构化 JSON）。
6. 新增 §12 "已有硬约束逐条说明（含 Recall 解释）"，回应用户对 PRIVACY_BOUNDARY 的疑问。

## 0.5 v2.4 修订摘要（2026-05-12 09:50 — Radar 第二批 4 项调研后 PM 收口）

1. **Radar 第二批 4 项调研已完成**（产物落在 `04-research/branches/memory-dataset/`；通告见 `06-sync/group/2026-05-12T09-43-10_radar_memory-dataset-four-research-completed.md`）。
2. **PM 答 Radar §6 10 个问题**（PM ack 群消息：`06-sync/group/<本批 PM ack>`）：
   1. **音频 warmup 指标进入 §3.10.5**（接受 Q-D1）：首拍稳定时间 5s，warmup 内桌宠不根据 BPM 反应。
   2. **音频库 aubio 原型 + BeatNet 长期**（部分接受 Q-D2）：aubio GPL-3.0 有传染风险，必须 **IPC 子进程隔离**；长期切 BeatNet (CC-BY-4.0) + cpal 自实现 RMS 是商业化 release 必要条件。
   3. **浏览器 Tab MVP 首选锁定**（接受 Q-E1）：浏览器扩展 + Native Messaging；macOS AppleScript / Windows UIA 兜底；MCP 全功能浏览器读取**不允许**（违反 §4.11 / §4.7.4 边界）。
   4. **国产浏览器进 Beta 支持**（部分接受 Q-E2）：360 / QQ / 搜狗 / Edge 国内版 / UC 进 Beta，由 Engineering 第一周验证；如 ≥50% 可用则 Beta 上线，否则 P1 推迟。
   5. **VLM §3.6.6 三档混合架构**（接受 Q-F1）：从"本地推理可用率 ≥70%"重写为 **CNN 初筛 + 2-4B VLM 兜底 + 云端最终兜底（用户显式同意）≥85%**。详见 AI Feature Evaluation v3 §3.6 重写。
   6. **VLM 首选 MiniCPM-V 4.5 (int4) + 备选 Qwen2.5-VL-7B**（条件接受 Q-F2）：MiniCPM-V 4.5 商用条款**法务过完才锁定**；如未过，主线切 Qwen2.5-VL-7B (Apache 2.0)。
   7. **Onboarding 硬件检测三选一**（接受 Q-F3 + 命名优化）：首启 30s benchmark；三选一文案改为 "①仅文本对话 / ②本地轻量识别 / ③启用云端兜底（需授权）"，更用户友好。
   8. **Mac App Store 分发立场**（接受 Q-G1 但升项目级）：默认 **双轨发布** — MAS 版砍 macOS A1 MediaRemote、仅保留 MCP；Developer ID 自分发版完整功能。该决策影响项目级分发战略，建议升 DECISION_LOG。
   9. **§4.4 MCP + A1 OS API 并存**（接受 Q-G2）：MCP 优先（结构化字段更全）、OS API 兜底（覆盖面更广），合并覆盖率 75-85%。
   10. **未验证 SMTC 上报由 Engineering beta 埋点**（接受 Q-G3）：腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC SMTC + QQ 音乐 / 网易云 macOS 国服 MPNowPlayingInfoCenter 上报由 Engineering 在 beta 阶段埋点验证（比 Radar 单独实测高效）。
3. **新增 §13.4.2 项目级决策候选清单**：本批新增 **Q-F1 三档混合架构** + **Q-G1 双轨分发**两条核心立场，强烈建议升 DECISION_LOG。
4. **AI Feature Evaluation 升 v3**：§3.6 VLM 节重写为三档混合架构；§3.6.6 评估指标对应改写；§3.10 新增 warmup；§2 总览矩阵更新；§9 MVP 范围 + 排除项扩展。

## 0.4 v2.3.1 分支范围划定（2026-05-11 19:00 — 用户决定语音单独成分支）

1. 用户决定把**语音功能**（TTS / STT / 麦克风 / 唤醒词 / 声纹 / 音色管理 / 双向对话）开**新分支** `voice-interaction`；本分支不承接。
2. 本分支 `memory-dataset` 保留范围（v2.3 不变）：
   1. 聊天 / 行为 / MCP / 游戏 / VLM / current_context / profile_meta / Playwright（用户主动触发，P2）。
   2. **音频派生 A0**（BPM / 能量 / 节拍 / 静音状态）+ **A1 Now Playing 标识** — 服务"桌宠随音乐舞动" + "桌宠知道你在听什么"。
   3. §10.3 A0-A3 分级标准 — 作为项目级音频边界基线，未来 `voice-interaction` 分支也将引用并基于此扩展讨论 A2 / A3 在语音场景的处理。
3. 本分支不承接（明确划出）：
   1. TTS（桌宠开口说话）— 属 `voice-interaction`，涉及 LLM 输出 → TTS 引擎 → 音色管理。
   2. STT（用户语音输入）— 属 `voice-interaction`，涉及麦克风 + A2 音频内容；麦克风边界变更需另起 PRIVACY_BOUNDARY amendment。
   3. 声纹 / 说话人识别 / 语音克隆 — 属 `voice-interaction`，且 v2.3 §10.3 A2 / §4.10.6 #3 #4 已**明确排除**，未来如要重启需走项目级决策。
   4. 双向语音对话调度 / 唤醒词 — 属 `voice-interaction`。
4. 跨分支约定（v2.3.3 修订 — 干净文本边界）：
   1. **用户对语音的偏好**（如"喜欢哪个 TTS 音色" / "习惯用语音还是文字"）→ 由 voice-interaction 在用户表达时通知 memory-dataset，写入本分支 profile（作为用户偏好事实，与"喜欢稳定策略"同类）。这是**内容**，不是通道元数据。
   2. **语音通道的当前状态**（STT 现在开没 / input mode / 麦克风是否在采集）→ 属 voice-interaction 内部 runtime 状态，**不进** memory-dataset。
   3. **STT 输出的文本** → 走本分支既有 §4.1 chat 通道，**不携带任何采集通道元数据**：
      1. ❌ 不带 `input_modality`（text / voice）标记 — memory 层不区分文本来源。
      2. ❌ 不带 `stt_confidence` 透传 — STT confidence 在 voice-interaction 侧决策"提交 / 跟用户确认"后就消化掉。
      3. ❌ 不带原始音频 buffer 引用 — 不可链回 STT 原始数据。
      4. ✅ 接口契约：`voice-interaction.STT_output(text: str) → memory-dataset.chat(text)`，**一行干净文本边界**。
   4. 任何 `voice-interaction` 的边界变更不得反向放宽本分支既有 A2 / A3 / 麦克风排除项，**除非**项目级 `decisions/DECISION_LOG.md` 显式留痕同意。

## 0.3 v2.3 修订摘要（2026-05-11 18:30 — 用户产品愿景对齐）

1. **新增 MVP 愿景**（用户 2026-05-11 18:30）：①桌宠陪用户一起看视频（剧情同步反应）；②桌宠随音乐舞动（节拍 sync）。
2. **PM 评估**：两个愿景**Playwright 解决不了**（信号粒度不够）；最佳路径是"系统音频派生信号 + VLM 视频白名单"。PM 提出方案 D（不是用户原选 C），用户接受 D。
3. **Playwright 重新定位**：从 §4.4.3 v2.2 的"完全禁止"调整为 **P2 受限放行**（仅用户主动触发 + OS keychain + 短期 buffer + 7 条边界规则）。详见新增 §4.11。
4. **VLM 白名单扩展**：从 v2.1 的"单游戏整体开关"扩展为"**单 app 实例开关**"，类别包括游戏 + 视频 app；每条目独立开关。详见 §4.7 重写。
5. **新增数据通道：系统音频派生信号**（A0 BPM / 能量 / 节拍点）：实现"随音乐舞动"愿景。详见新增 §4.10。
6. **新增音频信号分级标准**（A0 / A1 / A2 / A3，与键盘 L0-L3 平行）：详见新增 §10.3。
7. **起草 PRIVACY_BOUNDARY 修订提案**：`PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md` — 提议把项目级硬约束 #2 "不默认系统音频监听" 拆为 A0-A3 分级、把 VLM 白名单从单游戏扩展到单 app 实例、新增 #8 Playwright 受限放行。**未直接修改项目级文件**，等待 Main Thread 收口。
8. **mock 更新**：§11 新增 §11.10 audio_derived_signals、§11.11 playwright_tool_result；§11.0 mock_metadata 加 `audio_a0_enabled` / `playwright_enabled_sources`。
9. **AI Feature Evaluation v2 同步**：新增 §3.10 audio 派生 / §3.11 Playwright；扩展 §3.6 VLM 视频类；总览矩阵 / 部署矩阵 / MVP 范围更新。
10. **PM 边界守住**：放宽是用分级方式取代"完全禁止"，**不是开口子**；本批没有任何"原始内容采集"被放行。

## 0.2 v2.2 修订摘要（2026-05-11 18:00 — Radar 完成后 PM 收口）

1. **Radar 三项调研已完成**（产物落在 `04-research/branches/memory-dataset/`；通告见 `06-sync/group/2026-05-11T17-52-51_radar_memory-dataset-three-research-completed.md`）。Main Thread 后续按 Radar §8 收口到 `SYNC_SUMMARY` / `TASK_BOARD` / `DECISION_LOG`。
2. **MCP 候选锁定（PM 答 Q1）**：Radar 推荐 5 个候选，PM 立场为"**MVP 首批锁 3 个，剩 2 个进 P1 后半段**"。首批：**滴答清单 + 飞书 + Steam Web API**；后半段：**OfficeMCP + 钉钉**。理由见 §4.4.4。
3. **番茄类移除（PM 答 Q2）**：番茄 ToDo / Focus To-Do / Forest 经 Radar 实地核实**无公开通道**，从 §4.4 候选叙述移除；§11.5 mock 内本就无番茄类，仅在文档叙述层修订。
4. **接受 5 处 mock 字段扩展（PM 答 Q3）**：5 处均为字段扩展（不删不改名），与既有 PM 字段语义一致；§11 各小节同步补充。详见 §11.0 / §11.1 / §11.5 / §11.6 / §11.7 / §11.9。
5. **PM 字段命名 review 边界（PM 答 Q4）**：PM **不**逐字段 review 拼写；只 review 4 类边界 — ①L0/L1/L2/L3 层级归属、②隐私敏感字段（VLM / UI text / 键盘事件）命名是否表达隐私语义、③与 `PRIVACY_BOUNDARY_memory-system.md` §2 一致性、④新增字段是否跨越 §10.1。详见 §10.2。
6. **新增 §10.2** "PM 字段命名 review 边界"。
7. **§13 Next Steps 修订**：Radar 标记完成；Engineering Build Thread 接 schema 可行性 + OQ #8 SLA；Main Thread 升项目级决策候选清单更新。

## 0.1 v2.1 修订摘要（2026-05-11 17:30）

1. **VLM 措辞修正**：v2 把 VLM 描述为"Memory Center 内的白名单页面选游戏"是错的。本项目 §4.9 已锁定多游戏 profile 不共享、一个桌宠绑定一款游戏，所以 VLM **不存在跨游戏白名单页面**；只存在"该游戏的 VLM 陪玩整体开关"。§3 / §4.7 / §5 / §9 #6 全部相应改写。
2. **键盘分级研发自由度边界（用户反馈 2）**：§10 新增"研发自由度规则"小节。L0 / L1 内的**具体字段清单** Engineering 可自由增删改（需 PM review）；**L2 / L3 是 PM 硬规则**，Engineering 自由度**不延伸到跨层级**。新字段性质模糊时由 PM 判定归属层级。
3. **Radar 启动状态修正（用户反馈 3）**：3 份 `06-sync/dm/pm-to-radar/` 派单消息保留为 PM 原始诉求记录；用户已自行触发 Radar 调研，**不再走 Main Thread 派发流程**；Radar 完成后由 Main Thread 收口结论。§13.1 相应修订。
4. **未修改**：§4.3.1 PM 反提案、§12 硬约束解释 — 用户均已认可。

---

## 1. 一句话结论

1. 桌宠端要让用户感到"既是知心好友、也是游戏搭子"，**单凭聊天数据不够**；必须在**用户可控、白名单式、最小集合**前提下，从记忆系统拿到 4 类数据：①聊天与用户主动表达、②低敏行为信号（app / 窗口 / 全屏 / idle）、③首方游戏事件（含 idip 对比与游戏内实时时间）、④高敏可选数据（结构化 UI / VLM 帧 / MCP app 内文本）。
2. ④ 类**默认关闭、显式 opt-in、短期 buffer、不上云原文**，避免与既有 `PRIVACY_BOUNDARY_memory-system.md` 硬约束（不全屏截图 / 不音频 / 不 keylog / 不长期跨 app 全文）相撞。
3. 记忆系统对桌宠的产出**不是 raw 数据流**，而是**三层抽象**：原子事实（atomic facts）→ 情节摘要（episode）→ 用户画像（profile）+ 一份**实时上下文快照**（current_context），桌宠侧只消费抽象层，不直接接触原始日志。

---

## 2. 背景

### 2.1 桌宠的角色定位

1. 当前桌宠定位（项目级）：多游戏可集成的 AI 桌宠 / 伴侣 SDK；本分支的具体用户场景是 **C 端玩家**。
2. 体验目标（本分支聚焦）：
   1. "**知心好友**"维度 — 记得用户的称呼、语气偏好、情绪、最近聊过的事、对当前生活状态的延续感（工作压力 / 副本进度 / 心情）。
   2. "**游戏搭子**"维度 — 知道用户在玩哪款游戏、当前进度 / 角色 / 卡点 / 战利品 / 队伍情况，能在对的时刻说对的话。
3. 两个维度都依赖"**跨时间的连续感**"。一次性消息 + 大模型 prompt 注入做不到；必须由记忆系统承接长期上下文。

### 2.2 桌宠 vs 记忆系统的分工

1. **记忆系统职责**：采集 / 清洗 / 摘要 / 索引 / 提供查询接口 + 用户控制面（Memory Center）。
2. **桌宠端职责**：按对话 / 行为时机调用记忆系统的查询接口，把返回结果**作为输入**喂给对话与行为决策层，再生成具体的反应。
3. **本文件不定义**：记忆系统的实现架构、SDK API 形态、UI 视觉、模型选型。这些分别由 Engineering / Design / AI Feature Evaluation 接续。

### 2.3 现有 mock 数据观察（剑灵聊天 case）

1. 输入侧 raw schema（`剑灵Mock数据-聊天.docx`，每条消息）：
   1. `user_id`（msdk_xxx 形式的脱敏 ID）
   2. `uuid`（消息唯一标识）
   3. `session_id`（会话标识）
   4. `message_type`（user / assistant）
   5. `content`（消息正文）
   6. `timestamp` / `created_at`（带时区）
   7. `year_month`（分区字段）
2. 输出侧抽象 schema（`chenmo_chat_output.json`，按 segment 切片）：
   1. `segment_index` + `segment_topic_summary`（情节切片 + 主题摘要）
   2. `segment_messages`（该切片下原始消息引用）
   3. `atomic_facts` / `atomic_facts_llm`（**原子事实**：带时间戳的最小事实陈述）
   4. `episode`：`title` / `content` / `participants` / `time_range`（**情节摘要**）
   5. `profile`：`summary` / `interests` / `behavior_patterns` / `preferences` / `personality_traits` / `key_facts`（**用户画像**，随 segment 演化）
3. 观察到的能力与缺口：
   1. 能力 — 记忆系统已能输出"原子事实 → 情节 → 画像"的三层抽象，结构与桌宠"知心好友"维度高度吻合。
   2. 缺口 1 — 当前 mock **只覆盖聊天数据一条管道**；行为 / 游戏 / APP 数据均未在 mock 范围。
   3. 缺口 2 — 输出**缺少"当前正在发生什么"的实时切面**（current_context）。`profile` 是累计画像，`episode` 是过往情节，桌宠在"游戏搭子"维度需要的是**最近 N 分钟的此刻状态**。
   4. 缺口 3 — `profile` 没有**置信度 / 来源 / 时效衰减**字段。桌宠需要区分"用户明确说过"vs"LLM 推测"，否则会出现"假记忆"穿帮。
   5. 缺口 4 — `episode.content` 是自然语言长文；桌宠在毫秒级响应窗口下需要**结构化 + 可索引**的版本。

### 2.4 数据范围（用户 2026-05-11 会议梳理）

1. 聊天数据
2. 行为数据：①PC 传统进程；②mac / win API 获取界面 UI 信息 & 用户操作
3. 主流娱乐工作 APP 通过 MCP 获取
4. 游戏数据：①状态 idip 数据对比；②游戏内实时时间推送 & 捕捉；③VLM 陪玩过程数据

### 2.5 与既有 P0 边界的关系

1. 既有 P0 决策（见 `REQUIREMENT_CLARIFICATION_memory-system.md` §1 / `PRIVACY_BOUNDARY_memory-system.md` §2 / `decisions/DECISION_LOG.md` "Context Lite Memory"）：
   1. **可默认采集**：用户主动对话 / 反馈、first-party game events、pet interaction events、低敏 active app / window title / idle / full-screen signal。
   2. **默认不采集**：Recall 式后台全屏截图、系统音频持续监听、键盘输入内容、跨 app 全文长期存储、raw OS context 云端上传、浏览器隐私窗口 / 密码管理器 / 银行 / 公司文档类 app。
2. 本分支 4 类数据相对边界的位置（先给结论，详见 §3）：
   1. 聊天数据 — **完全在白名单内**。
   2. 行为数据 - PC 传统进程 — **在白名单内**（active app）。
   3. 行为数据 - mac / win API 获取界面 UI 信息 & 用户操作 — **部分越界**：UI 文本属 P1 explicit opt-in；"用户操作"若为键盘 / 鼠标事件流接近 keylog，**P0 不允许**。
   4. APP MCP 获取 — **未定义**：取决于"读什么"，如果只读 app 主动暴露的 MCP server 接口，可以；如果读 app 私有内容，越界。
   5. 游戏数据 - 状态 idip / 实时时间 — **在白名单内**（first-party game events 扩展）。
   6. 游戏数据 - VLM 陪玩 — **越界**：VLM 需要视觉帧，等同于截图 + OCR，与"不 Recall 式截图"硬约束冲突；只能走 P2 用户主动触发，且短期 buffer。

---

## 3. 数据需求总览

| 编号 | 一级类别 | 子项 | 期望从记忆系统拿到的形态 | "知心好友"价值 | "游戏搭子"价值 | 与 P0 边界的关系 | 优先级 |
|---|---|---|---|---|---|---|---|
| 3.1 | 聊天数据 | ①用户主动表达 ②对话历史摘要 ③情绪信号 ④长期偏好 | atomic_facts + episode + profile 三层抽象，附置信度与来源标签 | ① ② ③ ④ 全部 | ②（聊到游戏的部分） | ✅ 完全在白名单内 | **P0** |
| 3.2 | 行为数据 - PC 传统进程 | ①active app ②是否全屏 ③idle 状态 ④app 切换序列 | 实时状态快照 + 短期序列摘要；不暴露原始时间线 | ③（判断"该不该打扰"） | ①②（判断"在不在游戏中") | ✅ 完全在白名单内（active app + window title + idle / full-screen） | **P0** |
| 3.3 | 行为数据 - mac / win API UI 信息 & 用户操作 | ①窗口标题脱敏后摘要 ②全屏游戏识别 ③可见错误弹窗摘要 ④派生输入指标 ⑤快捷键事件流（不含字符） | 短期 buffer 内的脱敏摘要 + 派生指标，长期只保留状态级标签 | ③（"看到你在写文档"类轻提示） | ②（"看你卡在 BOSS 战 5 分钟没动了"类） | ✅ 派生指标 + 快捷键事件流（不含字符）P0/P1；UI 全文 P1 opt-in；❌ 原始按键字符流（含 hash 后）任何优先级都不允许 | **P0 派生 / P1 UI 文本 + 快捷键 / 排除字符流** |
| 3.4 | APP MCP 获取 | ①Spotify / Apple Music 当前曲目 ②笔记 / 任务类 app 主动暴露的进度（仅 MCP server 暴露的部分） | 标准化 MCP tool 返回值，记忆系统仅做"采集 + 短期缓存 + 是否写入长期"的判定 | ④（"刚听完那首歌"类细节） | 较少（除非游戏配套 launcher 暴露 MCP） | ⚠️ 取决于 MCP server 的暴露面；不允许绕过 MCP 读 app 私有数据 | **P1** |
| 3.5 | 游戏数据 - 状态 idip 数据对比 | ①idip 当前值 vs 历史值 ②角色 / 等级 / 关卡 / 战利品 / 任务状态变化事件流 ③成就 / 失败信号 | first-party game events 的扩展：事件流 + 衍生信号（"刚通关"、"3 次卡关同一处"等） | 较少 | ① ② ③ 全部，**核心**数据源 | ✅ 完全在白名单内（first-party game events） | **P0** |
| 3.6 | 游戏数据 - 游戏内实时时间推送 & 捕捉 | ①游戏内时间 / 在线时长 / session 起止 ②实时事件流（开局 / 死亡 / 复活 / 结算等） | 推送式（pub/sub）的实时 event；记忆系统做去重 + 摘要 | 较少 | **核心**：知道"刚才发生了什么" | ✅ first-party game events | **P0** |
| 3.7 | 游戏数据 - VLM 陪玩过程数据 | ①游戏画面关键帧的视觉理解结果 ②"看到玩家在做什么"的语义标签 | 仅在用户对本桌宠所绑定单游戏开启 VLM 后短期生成摘要；不保留原图 | 较少 | 极高（无 first-party 事件接入的游戏唯一退路） | ⚠️ 默认关闭；P1 需"该游戏整体 VLM 开关由用户显式打开"；短期 buffer ≤ 60s；摘要可入长期；不上传原图 | **P1（用户对本游戏整体开启）** |
| 3.8 | 跨切片：当前上下文 current_context | ①最近 N 分钟（建议 5-15min）的"活动主题"+"情绪倾向"+"打扰适宜度" | 实时快照，非历史查询 | "知心好友"判断"现在该不该开口" | "游戏搭子"判断"该接话还是闭嘴" | 衍生自上述各源；不引入新硬约束 | **P0** |
| 3.9 | 跨切片：profile 元字段 | ①每条偏好 / 兴趣 / 行为模式的置信度 ②来源（聊天 / 游戏 / 行为 / 用户主动确认） ③首次出现时间 / 上次确认时间 ④是否用户已纠错过 | 元字段，附在 profile 的每个 entry 上 | 防止"假记忆"穿帮的关键 | 同左 | 不引入新采集；只约束 profile 输出 schema | **P0** |
| 3.10 | 系统音频派生信号（v2.3 新增） | ①BPM ②能量曲线 ③节拍点 ④静音状态 | 派生标量 + 短期 buffer ≤30s；不存原音频；不识别说话内容 | 较少（音乐场景） | 较少（与 idip 协同）；核心服务"随音乐舞动" | ⚠️ 需 PRIVACY_BOUNDARY 修订把 #2 拆为 A0-A3 分级 | **P1（用户单独授权）** |
| 3.11 | Playwright 受限放行（v2.3 新增，从禁止调整） | ①用户主动查询时一次性返回 ②曲名 / 收藏列表 / 已登录页面数据 | tool_call 一次性结果，buffer ≤5min，不进 long-term profile | ④（"刚才那首歌叫什么"细节） | ④（"我 B 站新增了什么"细节） | ⚠️ 需 PRIVACY_BOUNDARY 新增 #8 Playwright 受限放行 + 7 条边界规则 | **P2（用户主动触发 + 单 app 授权）** |
| 3.12 | OS 级 API 通道（v2.5 新增 6 类） | ①OS Now Playing ②UserActivity ③Recent Files ④Notification Center ⑤Calendar ⑥设备状态环境 | 系统级元数据，不依赖具体 app MCP；本地优先 | ① ④ ⑤（细节感）/ ②（活动连续）/ ⑥（环境感知） | 较少（与 §4.5 §4.6 互补） | ✅ OS 公开 API + 用户授权 + 默认关；与 PRIVACY_BOUNDARY 兼容 | **P0 / P1 分层（详见 §4.4.6）** |
| 3.13 | 浏览器扩展全方位（v2.5 扩展 v2.4 视频类） | ①视频 ②购物 ③阅读 ④学习 ⑤社交浏览 ⑥工作 6 类 tab 身份识别 | 浏览器扩展 + Native Messaging 主路径 + AX/UIA 兜底；仅识别 tab 身份不读内容 | ④（购物 / 阅读 / 学习 / 社交浏览） | ④（工作类 tab） | ✅ v2.4 §4.7.4 既有方案扩展，未引入新硬约束 | **P1（用户按类别开启）** |
| 3.14 | OS Scripting Bridge（v2.5 新增 — osascript + COM）| ①Spotify / Apple Music / VLC / IINA / Notes / Bear / Things / Office / Outlook / Reminders 等 app 元数据读取 | macOS osascript + Windows PowerShell COM；仅读取元数据，不调用修改类接口 | ④（"你最近在 Notes 里写了几篇"细节） | 较少（除非游戏 launcher 有 OSA 接口） | ⚠️ 走 OS 公开脚本接口 + 用户授权 + app 主动暴露三重保险；需在 PRIVACY_BOUNDARY 修订提案加注 | **P1（用户单 app 授权）** |
| 3.15 | CLI 工具调用 + IFTTT 桥接（v2.5 新增） | ①Spotify CLI / VS Code CLI 等公开 CLI 调用 ②用户配置的 IFTTT / Zapier webhook | 元数据级；P2 探索 | 较少 | 较少 | ✅ 用户授权范围内；webhook 仅接受用户主动配置 | **P2（IFTTT 探索）/ P1（CLI 子集）** |

---

## 4. 数据需求详表（按子项展开）

### 4.1 聊天数据（3.1）

#### 4.1.1 期望字段

| 编号 | 字段 | A/B | 来自记忆系统的层 | 桌宠侧用途 |
|---|---|---|---|---|
| 1 | `atomic_facts[]` | A | 原子事实层（AI 派生） | 短期对话引用："你刚说过 …" |
| 2 | `episode.title` + `episode.time_range` | A | 情节摘要层（AI 派生） | 跨日 / 跨 session 召回："昨天聊到的那个秒杀模块" |
| 3 | `profile.summary` | A（常驻）+ B（重写触发） | 用户画像层（AI 派生） | 风格定调；用户点"重新总结一下我"由消费侧 LLM 生成后写回 memory |
| 4 | `profile.interests[]` + `profile.preferences[]` | A | 用户画像层 | 主动话题选取 |
| 5 | `profile.behavior_patterns[]` | A | 用户画像层 | 时机判断（如"晨会摸鱼时间"是已知行为模式） |
| 6 | `profile.key_facts[]` | A（LLM 候选 + 用户确认） | 用户画像层 | 重要事实优先注入对话上下文；未确认 → 不进对话引用 |
| 7 | `profile_meta`（新增建议） | A | 元字段层 | 每条 profile 的置信度 / 来源 / 时间，避免假记忆 |
| 8 | `emotion_signal`（**v2 锁定进 MVP**） | A | 推导层（AI Eval §3.4） | 情绪倾向：紧张 / 兴奋 / 沮丧 / 平静 |
| 9 | **`atomic_facts.quote_eligible`**（v2.6 新增 — 日记原话引用） | A | 派生层（规则代码 / PII 检测） | 日记会引用用户原话，部分原话含 PII（真名 / 同事抱怨 / 财务等）；本字段标记"哪些原话可引用"；正则 + NER 在生产 atomic_facts 时同步标记 |

#### 4.1.2 需要的原因（"知心好友 + 游戏搭子"映射）

1. 没有 `atomic_facts` → 桌宠无法做精准引用，会出现"你说过 …？我不记得"，体验等同于无记忆。
2. 没有 `episode` → 桌宠无法跨 session 召回，"昨天的事"全消失；记忆系统现有 mock 已覆盖这层，保留即可。
3. 没有 `profile.preferences` / `interests` → 桌宠话题永远从零开始，无法做"知己感"，是 churn 的最大风险。
4. 没有 `profile_meta` → LLM 会把推测当事实输出，用户会发现"假记忆"，立刻失去信任；这是体验底线问题。
5. 没有 `emotion_signal` → 桌宠没法做"工作压力大时少调侃"，会触发反感（用户实测调研里多次出现）。

#### 4.1.3 采集 / 保留 / 控制原则

1. 采集源：用户与桌宠的对话（首方），**不读取**用户与第三方 IM / 邮件的聊天。
2. 保留：原子事实 ≤ 90 天可配置；情节摘要 ≤ 180 天可配置；profile 用户删除前保留。
3. 控制：用户可在 Memory Center 按 segment 删除 / 纠错 / 标记为"不再这样记"。

### 4.2 行为数据 - PC 传统进程（3.2）

#### 4.2.1 期望字段

| 编号 | 字段 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `active_app.name` / `bundle_id` / `process_id` | 实时状态 | 判断"在游戏中"vs"在工作中" |
| 2 | `active_app.is_fullscreen` | 实时状态 | 打扰决策："全屏 = 闭嘴" |
| 3 | `idle_signal`（>5min / >10min / >30min 分级） | 实时状态 | "用户离开"判断，触发等待行为而非对话 |
| 4 | `app_switch_burst`（衍生信号） | 短期摘要 | "频繁切换 = 焦虑 / 找东西"，桌宠决定是否提醒"歇一下" |
| 5 | `recent_apps_top3`（最近 1h） | 短期摘要 | "刚才在 IDE + 浏览器 + Slack" → 推断工作场景 |

#### 4.2.2 需要的原因

1. 没有 `is_fullscreen` → 桌宠会在 BOSS 战开口打断，是用户实测调研里最高频的吐槽，**必须解决**。
2. 没有 `idle_signal` → 桌宠会对着空座位自言自语，伤害体验。
3. 没有 `recent_apps_top3` → 桌宠没法做"看你今天一直在写代码"类轻提醒。
4. 这一类数据是"游戏搭子"维度的**基础设施**，不依赖游戏首方接入即可生效。

#### 4.2.3 边界

1. **不**采集：app 内的具体操作内容、文档正文、网页 URL（除非走 MCP 显式暴露）。
2. **不**长期保存原始 app 时间线；只保留状态级摘要。
3. 用户可在 Memory Center 关闭此类别。

### 4.3 行为数据 - mac / win API UI 信息 & 用户操作（3.3）— v2 重写

> **命名空间说明（v2.5.1 新增）**：本节"档 A"代表 **Action 用户操作**（A1 派生 / A2 操作语义 / A3 编辑动作派生）；与 §10.3 **Audio 音频信号 A0-A3 分级**是**两个独立命名空间**，**不可相互替代**。读到 A1 / A2 / A3 字面时须按上下文判断：
> - 行为档 A1 / A2 / A3（本节）：**全部 ✅ 允许采集**（派生指标 / OS 级操作语义事件 / 编辑动作派生），属 L0 / L1 / L1.5 键盘分级。
> - 音频 A0 / A1 ✅（§10.3，派生信号 / Now Playing 标识）；音频 A2 / A3 ❌（音频内容 / 完整音频流持久化，**任何优先级不允许**）。
> - 这是两个**互相独立、含义完全不同**的体系。详见 §0.0 命名空间速查 + §10.3 顶部说明。

#### 4.3.1 用户 Q1 答复与 PM 反提案

1. 用户答："原始流以及派生信号能否都要？我需要让桌宠尽可能知道用户正在做的事情。"
2. PM 立场（不改）：**字符级原始按键流（含 hash 后）任何优先级都不允许**，原因：
   1. 触碰既有 `PRIVACY_BOUNDARY_memory-system.md` §2 硬约束"不记录键盘输入内容"。
   2. C 端桌宠一旦被识别为含 keylog 能力，会被杀软标黑、被媒体放大、被应用商店下架，**单次事故 = 项目寿命终结**。
   3. 即使 hash / 脱敏，从打字节奏 + 时间分布反推内容是公开学术能力（如 keystroke timing attack），**不是工程可控的风险**。
3. PM 反提案：**"知道用户在做什么"** 不等于 **"知道用户按了什么键"**。用**四源叠加方案**可以在不触碰按键内容的前提下，把"桌宠对当前活动的感知"做到 80% 以上：
   1. **派生输入指标**（§4.3.3） — 桶化的强度 / 节奏 / 切换 → "在专注打字"vs"在休息"。
   2. **快捷键事件流**（§4.3.4） — 仅识别 modifier + key 的组合（Cmd+S / Cmd+C / Cmd+Tab 等），**不**记录字符 → "刚保存"、"刚切换 app"。
   3. **脱敏窗口标题**（§4.3.5） — "在 IDE 编辑代码文件" / "在 Word 编辑文档" → "在写什么类型的东西"。
   4. **UI text snapshot**（§4.3.6） — 白名单 app + opt-in 短期 buffer → "屏幕上有错误弹窗 / 在填表 / 在浏览购物车"。
4. 四源叠加比原始按键流**信息密度更高**（语义级而非字符级）、**隐私感知更低**、**与 P0 边界一致**。
5. 仍想要"原始按键流"的话，必须先把 #2 的三条品牌风险解掉；目前不存在合规通道，PM 拒绝。

#### 4.3.2 UI 信息 — 期望字段

| 编号 | 字段 | 形态 | 桌宠侧用途 | 优先级 |
|---|---|---|---|---|
| 1 | `window_title_redacted`（脱敏后） | 短期 + 长期低敏摘要 | 推断当前活动："在 IDE 写 'src/auth.go'" → 脱敏为"在 IDE 编辑代码文件" | P0 |
| 2 | `is_fullscreen_game` | 实时状态 | 同 §4.2 | P0 |
| 3 | `ui_text_snapshot`（白名单 app + opt-in） | 短期 buffer ≤ 5min | "屏幕上有错误弹窗" → 桌宠主动询问"要帮你看看吗" | P1 |
| 4 | `focused_element_role`（按钮 / 文本框 / 标题） | 短期 buffer | 推断"用户正在输入" → 不打扰 | P1 |

#### 4.3.3 派生输入指标 — 期望字段（**P0** 默认，v2.5 档 A1 扩展）

| 编号 | 字段 | 形态 | 桌宠侧用途 | 优先级 |
|---|---|---|---|---|
| 1 | `input_intensity_level`（low / medium / high） | 实时桶化 | "专注中，别打扰" | P0 |
| 2 | `typing_rhythm_signal`（steady / bursty / idle） | 滑窗派生 | 区分"流畅输出"vs"卡壳停顿" | P0 |
| 3 | `mouse_activity_burst`（突发标签） | 衍生 | "频繁点击 = 找东西 / 玩 click 类游戏" | P0 |
| 4 | `app_switch_rate_per_min`（仅数值） | 实时 | "频繁切 app = 工作焦虑 / 多线程" | P0 |
| 5 | **`mouse_region_heatmap_top3`（屏幕分 9 区，仅区域桶）**（v2.5 新增） | 实时滑窗 enum[3] | "用户最近在屏左 / 中 / 右上区域操作" | P0 |
| 6 | **`mouse_event_type_burst`（double_click / long_press / drag_select / scroll_burst 等事件名）**（v2.5 新增） | 事件流（无坐标） | "刚拖选" / "刚双击" — 推断操作类型 | P0 |
| 7 | **`input_device_switch_event`（keyboard / trackpad / mouse / pen / touch 设备类别切换）**（v2.5 新增） | 事件流 | "切到触摸板 / 数位板" → 推断"开始画画 / 触控浏览" | P0 |
| 8 | **`multi_display_activity`（前台 display index + 跨屏拖事件）**（v2.5 新增） | 实时状态 + 切换事件 | "用户多屏工作中" / "跨屏操作中" | P0 |
| 9 | **`scroll_intensity_signal`（light / medium / heavy）**（v2.5 新增） | 实时桶 | "用户在快速滚动浏览" / "逐字阅读" | P0 |

#### 4.3.4 操作语义事件流 — 期望字段（**P0 / P1** v2.5 重写，A2 扩展）

> v2.4 §4.3.4 仅"快捷键事件流"，v2.5 扩展为更广的"OS 级操作语义事件" — 不只看键盘组合，还看 OS 级语义事件名。**与 keylog 性质完全不同**：keylog 是"按了 a"；这是"做了'保存'这件事"。

| 编号 | 字段 | 触发来源 | 桌宠侧用途 | 优先级 |
|---|---|---|---|---|
| 1 | `shortcut_event[]`（modifier + 命名键白名单） | 全局键盘事件白名单匹配 | v2.4 沿用：cmd+s / alt+tab / ctrl+c | P0 |
| 2 | **`semantic_event.save`**（v2.5 新增） | cmd+s / ctrl+s / OS auto-save 信号 | "刚保存" | P0 |
| 3 | **`semantic_event.copy_paste`**（v2.5 新增） | cmd+c / cmd+v / ctrl+c / ctrl+v | "刚复制 / 刚粘贴" — 不带剪贴板内容 | P0 |
| 4 | **`semantic_event.undo_redo_burst`**（v2.5 新增） | cmd+z 频次 ≥3 次 / 分钟 | "用户在反复犹豫 / 探索" | P0 |
| 5 | **`semantic_event.fullscreen_toggle`**（v2.5 新增） | OS fullscreen API（macOS `kAXFullScreenAttribute` / Win `WM_SIZE` + state） | "进入 / 退出全屏" | P0 |
| 6 | **`semantic_event.lock_unlock`**（v2.5 新增） | OS lock screen API | "用户离开 / 回来" — 决定是否打扰 | P0 |
| 7 | **`semantic_event.new_window` / `new_tab` / `close_window`**（v2.5 新增） | OS 窗口 / 浏览器事件 | "开新窗口 / 新 tab" / "关窗口" | P0 |
| 8 | **`semantic_event.app_install_uninstall`**（v2.5 新增） | OS install hook（macOS Launch Services / Win MSI events） | "刚装了新 app" / "刚卸了 X app" | P1 |
| 9 | **`semantic_event.window_arrangement_change`**（v2.5 新增） | OS window mgmt API（macOS Mission Control / Win 平铺分屏 / Stage Manager） | "切到分屏工作 / 收纳工作区" | P1 |

PM 边界（v2.5 加强版）：
1. **只**采集 modifier 组合键和"操作语义事件名"，**不**采集普通字符键内容；`a` / `enter` / `space` 不进 stream。
2. 不存任意键的完整时间戳序列（避免节奏反推）；每条事件聚合到 100ms 桶。
3. 语义事件的"事件名 + 时间"是固定枚举，**不带任何输入内容 / 文件路径具体值 / 剪贴板原文**。
4. macOS 实现路径：`NSApp.sendEvent` intercepts + Accessibility events（`AXObserverAddNotification`）+ `NSEvent global monitor`。
5. Windows 实现路径：`SetWinEventHook(EVENT_SYSTEM_*)` + `EVENT_OBJECT_*`，**严禁** `SetWindowsHookEx(WH_KEYBOARD_LL)`（Defender keylogger 启发式高风险）。
6. 用户可在 Memory Center 看到"过去 24h 触发过哪些操作语义事件"按类别 + 单条目开关。

#### 4.3.4.1 文本编辑场景派生（**P0** v2.5 新增，A3 增量）

| 编号 | 字段 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `text_edit_action_burst`（insert_chunk / delete_chunk / cross_paragraph_jump / selection_op 等动作类别） | 事件流（无内容） | "用户在大段重构 / 微调 / 反复跳转" — 不读编辑内容 |
| 2 | `undo_redo_rate_per_min`（int） | 实时 | 反复修改频率 → 推断"卡壳 / 探索 / 流畅" |
| 3 | `ime_state`（cn / en / jp / kr / other / none） | 实时状态 | 当前 IME 输入法状态 — 仅状态不读 composition |
| 4 | `editing_session_duration_min`（int） | 实时 | 在当前编辑 app 持续编辑时长 |
| 5 | `text_edit_burst_frequency`（low / medium / high） | 实时桶 | "文档写作中 / 平稳输入 / 闲置浏览" |

PM 边界（v2.5）：
1. ❌ **任何字符内容**（输入文本 / 删除文本 / 选中文本 / 剪贴板原文 / IME composition string）。
2. ❌ **任何字符级编辑位置**（句首 / 句中 / 行号 / 列号）。
3. ✅ 仅"动作类别 + 频率 + 时长 + IME 状态"五维派生指标。
4. 与 §4.3.3 派生输入指标互补：4.3.3 是低层物理动作（按键 / 鼠标），4.3.4.1 是高层语义动作（编辑 / 跨段跳转）。

#### 4.3.5 排除项（v2.5 加强版 — 不允许任何形式 / 任何优先级）

| 编号 | 数据 | 排除理由 |
|---|---|---|
| 1 | 字符级原始按键流 | 等同 keylog |
| 2 | hash 后的按键序列 | 节奏反推 + 字典攻击仍可还原内容 |
| 3 | 键盘事件的完整时间戳序列 | 通过 keystroke timing attack 可推断字符 |
| 4 | **鼠标坐标流（任何粒度）**（v2.5 强化） | 等同被动监控操作 |
| 5 | **像素级 heatmap**（v2.5 新增） | 反推鼠标轨迹 → 等同坐标流 |
| 6 | **拖选 / 框选时的选中内容**（v2.5 新增） | 内容采集 |
| 7 | **任何屏幕坐标的完整时间序列**（v2.5 新增） | 反推用户屏幕操作路径 |
| 8 | 第三方 IM / 邮件 / 浏览器地址栏输入捕获 | 跨 app 内容采集 |
| 9 | **IME composition / 候选词 / 输入内容**（v2.5 新增） | 反推用户输入文本 |
| 10 | **剪贴板内容 / 拖拽文件内容**（v2.5 新增） | 跨 app 内容采集 |

### 4.4 APP 信号源总览（3.4，v2.5 大幅扩展 — 从"仅 MCP"扩为 6 通道并存）

#### 4.4.0 v2.5 重构说明：6 通道并存

v2.4 把 MCP 视为"唯一合规通道"，v2.5 用户决定**扩展接入面**。**MCP 不再是唯一通道**，而是 6 个并存通道之一。所有通道仍守"用户授权 + 默认关闭 + 不读私有内容"硬边界。

| 通道编号 | 通道 | 性质 | MVP 内位置 | 详见 |
|---|---|---|---|---|
| C-1 | **MCP**（v2.4 已有） | App 主动暴露的 Model Context Protocol server | MVP 首批 3 个（dida / feishu / steam）+ P1 后半段 2 个（office / dingtalk） | §4.4.1 - §4.4.5（v2.4 沿用） |
| C-2 | **OS 级 API 通道 6 类**（v2.5 大幅新增） | macOS / Windows 原生 API，不依赖具体 app | P0 / P1 分层 | §4.4.6 |
| C-3 | **浏览器扩展全方位 6 类**（v2.5 扩展 v2.4 视频类） | Chrome / Edge / Safari / Firefox / Arc 扩展 + Native Messaging | P1 | §4.4.7 |
| C-4 | **OS Scripting Bridge（osascript / PowerShell COM）**（v2.5 新增） | macOS AppleScript / Win COM Automation；接入支持系统脚本接口的 app（Spotify / Apple Music / VLC / Notes / Office 等） | P1 | §4.12 |
| C-5 | **CLI 工具调用**（v2.5 新增） | 公开 skill / OS 自带 CLI（用户授权 OAuth scope 内） | P1 | §4.4.8 |
| C-6 | **IFTTT / Zapier webhook 桥接**（v2.5 新增） | 用户自行配置的 webhook | P2 探索 | §4.4.9 |

PM 立场（重要）：
1. **MCP 仍是"工作类生态成熟"通道的首选**（飞书 / 钉钉 / 滴答 / Steam / Office），但**不再期待娱乐 / 内容类 app 走 MCP**（Bilibili / QQ 音乐 / 腾讯视频等没有合规 MCP，转用其他通道）。
2. **OS API + 浏览器扩展 + OS Scripting Bridge** 是 v2.5 覆盖娱乐 + 笔记 + 生活类 app 的**主路径**。
3. **CLI / IFTTT** 是补充通道，门槛高，仅供 P1 后半段 / P2 探索。
4. **没有一个通道是"唯一合规"的**，但**所有通道都受同一组硬边界约束**：用户授权 / 默认关 / 不读私有内容 / 短期缓存 / Memory Center 可见 + 单通道开关。

#### 4.4.1 MCP 通道期望字段（v2.4 沿用）

| 编号 | 字段 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `mcp_tool_result.media_now_playing`（Spotify / Apple Music） | 实时状态 | "刚听完那首歌呀" 类细节 |
| 2 | `mcp_tool_result.task_progress`（滴答 / Things 等） | 实时状态 + 衍生摘要 | "今日截止 / 当前优先级任务" |
| 3 | `mcp_tool_result.steam_now_playing` / `mcp_tool_result.epic_now_playing` | 实时状态 | 游戏 launcher 信号，配合 §4.5 |
| 4 | `mcp_tool_result.calendar_next_event`（飞书 / Outlook 等用户授权日历） | 实时状态 | "10 分钟后有个会，要不要先存档？" |

#### 4.4.2 需要的原因（v2.5 更新）

1. C 端用户的工作 / 娱乐 app 数据是构造"知心好友"细节感的关键。
2. **v2.5 调整**：MCP 不再是唯一通道；娱乐 / 内容类 app 没有合规 MCP，转用 §4.4.6 OS API + §4.4.7 浏览器扩展 + §4.12 OS Scripting Bridge 等通道补足。

#### 4.4.3 MCP 通道边界

1. 数据来源**必须**来自 app 主动启用的 MCP server，**不**爬 app 私有文件 / 不 hook app 进程 / 不走 Playwright 浏览器自动化（如 QQ 音乐 `Roy-gyy/QQMusic` 路径）。
2. 记忆系统只保留**短期缓存**（≤ 1h）+ **脱敏摘要**（如"用户最近常用滴答清单"），不保留 raw MCP 返回原文。
3. **用户在 Memory Center 自选**哪些第三方 MCP 启用 / 停用；默认全部关闭。
4. **MCP 通道整体优先级 P1**：**MVP 不强依赖 MCP 生态作为前置条件** — 即如果生态不成熟 / 用户不开 MCP，桌宠核心体验仍可工作（依赖其他 5 个通道）。§4.4.4 候选清单中标"MVP 首批"的 3 个 app（dida / feishu / steam）是"**如用户启用 MCP 通道则首批集成的具体连接器**"，**不是"MVP 上线前必须接入"**。两者语义不冲突：前者是产品 MVP 整体是否押注 MCP 生态；后者是 MCP 通道内部分级（哪些连接器先做、哪些后做）。
5. 中国流行 app 的 MCP 公开能力 — Radar Task B 已完成调研（`04-research/branches/memory-dataset/TREND_RESEARCH_china-app-mcp-server-capabilities.md`）。

#### 4.4.4 MCP 接入候选清单（v2.2 锁定，PM 答 Radar Q1）

> **v2.5.1 措辞澄清**：本清单的"MVP 首批 / P1 后半段"是 **MCP 通道内部的优先级分级**（首批连接器先做、其余后做），**不是产品 MVP 整体优先级**。与 §4.4.3 #4 "MVP 不强依赖 MCP 生态" 语义不冲突 — 一个说"如果用户开 MCP 通道，桌宠首批集成这 3 个连接器"；另一个说"即使用户不开 MCP，桌宠核心体验仍能工作"。

| 优先级 | App | MCP 形态 | 提供字段 | 接入理由 | PM 风险评估 |
|---|---|---|---|---|---|
| **MVP 首批** | 滴答清单（Dida365） | 三方 MCP（活跃） | task_progress（今日截止 / 已逾期 / 当前优先级） | "知心好友"叙事最强；OAuth 标准化 | 鉴权链路标准；`read` scope 即可 |
| **MVP 首批** | 飞书国内版 | 官方 MCP（`larksuite/lark-openapi-mcp`） | calendar_next_event | 唯一国产官方协作工具 MCP；链路最短 | 必须用 `user_access_token`（非 `tenant_access_token`） |
| **MVP 首批** | Steam Web API（封装为 MCP） | 三方封装 | now_playing（"刚在玩 XX"） | 游戏搭子叙事最纯；用户基数大 | 用户需主动设置个人资料为公开 |
| **P1 后半段** | OfficeMCP（Word / Excel / PPT / WPS） | 本地 COM 桥接 | current_document（"当前在写什么"） | 一站式覆盖白领办公；少数能给"当前文档"信号的路径 | **仅 Windows**；跨平台覆盖能力弱；推迟到首批验证后再决定是否引入 |
| **P1 后半段** | 钉钉 | 官方 MCP（`open-dingtalk/dingtalk-mcp`） | calendar | 飞书备选，覆盖国企 / 教育系；活跃度需观察 | 同质化风险（与飞书重叠工作场景） |

PM 决策（v2.2）：
1. **MVP 首批锁 3 个**（滴答 + 飞书 + Steam）：覆盖"待办 / 工作日历 / 娱乐"三类核心叙事，每类各一个，避免叠加；3 个 MCP 链路全部走开放平台 OAuth，无客户端 hook 风险。
2. **OfficeMCP / 钉钉推迟到 P1 后半段**：①OfficeMCP 仅 Windows，与桌宠跨平台目标冲突，先看 MVP 首批 Steam 信号是否足够支撑"游戏搭子"叙事；②钉钉与飞书在工作日历语义上同质，先用飞书验证一类后再决定要不要补国企覆盖。
3. **不进入 MVP**：网易云音乐 / 腾讯文档 / 腾讯日历 / Bilibili 等 Radar §4.2 P2 候选；视 P1 落地表现再评估。
4. **不接入清单（确认）**：番茄 ToDo / Focus To-Do / Forest（无公开通道）、腾讯视频 / 爱奇艺 / 优酷（无个人 API）、WeGame / Epic 中国版（用例不匹配）、QQ 音乐（仅 Playwright 路径，超边界）、Notion（中国 C 端基数小）。这些既不进入 §11 mock，也不在产品菜单暴露。
5. **此清单不是项目级最终决定**：本节为 PM 立场，建议升入 `decisions/DECISION_LOG.md` 由 Main Thread 收口。本轮按用户指示不升项目级。

#### 4.4.5 v2.5 MCP 不再是唯一通道（v2.5 加注）

v2.4 §4.4.4 候选清单**保持不变**（MVP 首批 3 + P1 后半段 2 + 不接入 5），但 v2.5 把"非 MCP 通道"也纳入主路径，分别在 §4.4.6 - §4.4.9 + §4.12 展开。

#### 4.4.6 OS 级 API 通道（C-2，v2.5 大幅新增 6 类）

> 不依赖具体 app 是否暴露 MCP，走 macOS / Windows 原生 API 直接拿数据。比 MCP 通用 / 比 Playwright 稳定 / 比浏览器扩展精度高。

| 编号 | 通道 | 实现路径 | 桌宠侧用途 | 优先级 | 边界 |
|---|---|---|---|---|---|
| 1 | **OS Now Playing**（v2.4 §4.10 已锁，本次扩大） | macOS MediaRemote / Windows SMTC | 系统级"现在播什么"（音乐 / 视频 / 播客标题 + 时长 + 进度） | P0 | 仅元数据 |
| 2 | **OS UserActivity**（v2.5 新增） | macOS Handoff API / Win Activity Feed | 任意 app 主动 emit 的活动（如"在 Notes 写第 N 篇 / 在 Pages 编辑文档"） | P1 | 仅 app 自愿暴露 |
| 3 | **OS Recent Files**（v2.5 新增） | macOS NSMetadataQuery / Win Recent Items | 系统级"最近编辑文件"元数据 → "你昨天在写的那个文档 / 设计图 / 代码" | P1 | 仅文件名 + 时间 + 所在 app，**不读文件内容** |
| 4 | **OS Notification Center**（v2.5 新增） | macOS NotificationCenter / Win Action Center | "你刚收到 N 条 X 通知" → 推断"用户在被打扰" | P1 | 仅来源 + 时间 + 类型，**不读通知正文** |
| 5 | **OS Calendar / Reminders**（v2.5 新增） | macOS EventKit / Win Outlook People Calendar API | 个人日历 + 工作日历（与飞书 MCP 互补，覆盖个人场景） | P1 | 用户授权 access |
| 6 | **OS 设备状态 / 环境**（v2.5 新增） | 电池 / 充电 / 显示器亮度 / 蓝牙连接 / 网络变化 | 推断"用户在咖啡馆"（蓝牙+网络变化）/ "用户在加班"（凌晨 + 电池低） | P2 探索 | OS 级低敏，桶化使用 |

PM 边界（OS API 通道通用）：
1. **仅采集 OS 公开 API 暴露的元数据**；不走私有 framework（除了 MacOS MediaRemote 单分发渠道见 v2.4 §4.10 双轨决策）。
2. 每类通道用户在 Memory Center 单独开关；默认关闭。
3. **不读取**任何 app 的私有内容（文件正文 / 通知正文 / 日历事件描述等）。
4. 短期缓存 ≤ 1h；长期记忆只保留聚合标签（如"用户常在咖啡馆工作"）。
5. macOS / Windows 具体实现路径详见 `04-research/branches/memory-dataset/TREND_RESEARCH_behavior-signal-libraries.md` + `TREND_RESEARCH_os-now-playing-api.md`。

#### 4.4.7 浏览器扩展全方位（C-3，v2.5 扩展 v2.4 §4.7.4 视频类）

> v2.4 §4.7.4 已锁定"浏览器扩展 + Native Messaging"为视频 tab 检测主路径。v2.5 把同一扩展通道扩展到**全方位 tab 识别**（不只视频）。

| 类别 | 示例 app | 桌宠用途 | 优先级 |
|---|---|---|---|
| 视频（v2.4 已有） | YouTube / Bilibili / 腾讯视频 / 爱奇艺 / 优酷 | 陪看（配合 §4.7.4 VLM 视频类） | P1 |
| **购物**（v2.5 新增） | 淘宝 / 京东 / 拼多多 / 小红书购物 / 闲鱼 | "你在买什么呀" → profile.shopping_pattern | P1 |
| **阅读**（v2.5 新增） | 知乎 / 微信公众号 / Medium / 少数派 / 36 氪 | 文章主题（仅 tab title 中的类别标签） → profile.reading_interests | P1 |
| **学习**（v2.5 新增） | B 站学习区 / Coursera / 极客时间 / Udemy / 慕课网 | 学习主题 / 进度 → "你最近在学什么呀" | P1 |
| **社交浏览**（v2.5 新增） | Twitter / X / 微博 / 小红书 / 豆瓣 | 浏览习惯（仅 tab 平台 + 类别，不读内容） | P1 |
| **工作**（v2.5 新增） | GitHub / GitLab / Linear / Jira / Figma Web / Notion Web | 工作上下文 → "你今天在 GitHub 看 PR / 在 Figma 看设计" | P1 |

共同边界（沿用 v2.4 §4.7.4）：
1. 浏览器扩展 + Native Messaging 主路径；macOS AppleScript / Windows UIA 兜底（详见 Radar Task E 调研）。
2. **仅识别 tab 身份**（域名 + 脱敏 tab title 中的 app/平台/类别标识），**不读页面内容**。
3. 用户在 Memory Center 按类别 + 按 app 双层开关；默认关闭，用户主动启用类别。
4. 国产浏览器（360 / QQ / 搜狗 / Edge 国内版 / UC）走 Beta 支持；Engineering 第一周验证 ≥50% 可用率才上 Beta，否则推迟 P2。
5. **不允许**：mcp-chrome 类全功能浏览器 MCP（权限过大）、页面内容抓取（属 §4.11 Playwright）、JS 注入。

#### 4.4.8 CLI 工具调用通道（C-5，v2.5 新增）

> 用户对 CLI 范围澄清：不是 git / github，而是**有 CLI 接口接入娱乐工作 app**。这条通道现实中比较狭窄 — 现代桌面 app 主要走 GUI + URL Scheme，纯 CLI 接入面不多。但仍有一些价值：

| CLI 工具 | 接入对象 | 桌宠用途 | 优先级 |
|---|---|---|---|
| `spotify-cli` / `spotify-tui` / `sptlrx` 等三方 Spotify CLI | Spotify desktop 状态查询 | OS Now Playing 不可用时的备用通道 | P2 |
| `code` CLI（VS Code） | `code --status` 查当前打开文件 / 工作区 | 与 OS Recent Files 互补 | P2 |
| `osascript` 触发 app | 通用 macOS app 脚本调用入口 | 属 §4.12 OS Scripting Bridge 范畴，本节不展开 | — |
| 公开 skill 调用（OpenAI docs / HF / GitHub Web API）| 桌宠对话时调用 | 桌宠用，不替用户做决定 | P1 |
| 系统只读 CLI（`ps` / `top` / `pmset` / `defaults read` 等） | 进程 / 系统状态 | 与 §4.2 active_app 互补 | P2 |

PM 边界：
1. **不**调用任何可能修改 app 状态 / 系统状态的 CLI（如 `spotify-cli play`，只用 `spotify-cli status`）。
2. **不**调用涉及用户输入数据的 CLI（如 `git diff` / `git log -p` 这类读 commit 内容）；只用元数据级 CLI（如 `git log --oneline -5` 看分支活跃度可，但本节范围本来就不含 git）。
3. CLI 调用结果**短期 buffer ≤ 5min**，**不进 long-term profile 原文**，仅摘要进 long-term。
4. 用户在 Memory Center 看到"过去 7 天调用了哪些 CLI"列表并按需关闭。

#### 4.4.9 IFTTT / Zapier / Make webhook 桥接（C-6，v2.5 新增 P2 探索）

> 用户自配 webhook，把 app 事件 ping 给桌宠。极致灵活但门槛高。

| 用法示例 | 桌宠用途 |
|---|---|
| 用户在 IFTTT 配 "Spotify play → ping pet" | 拿 now playing 信号（与 §4.10 A1 互补） |
| 用户在 Zapier 配 "Notion update → ping pet" | 拿 Notion 进度（绕开 Notion 没 MCP） |
| 用户在 Make 配 "Google Calendar event → ping pet" | 拿 Google Calendar 信号（绕开 EventKit 不支持 Google 账号） |

PM 边界：
1. 仅接受**用户主动配置 + 用户签名验证**的 webhook，**不**接受任意外部来源。
2. webhook 入口**仅接受元数据**（事件类型 + 时间 + app 名 + 用户预设的字段），**不接受任意 payload**。
3. P2 探索，**不进 MVP**；Engineering / Design 评估桌宠是否提供"webhook 接收端点"功能。

### 4.5 游戏数据 - 状态 idip 数据对比（3.5）

#### 4.5.1 期望字段

| 编号 | 字段 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `idip_snapshot`（当前值 + 字段含义） | 实时快照 | 角色等级 / 段位 / 通关进度等基础状态 |
| 2 | `idip_delta`（与上一时点对比） | 衍生信号 | "刚通关"、"段位掉了"、"装备升级" |
| 3 | `idip_anomaly`（衍生异常） | 衍生信号 | "3 次同一处失败"、"5 分钟未操作但仍在游戏" |
| 4 | `idip_milestone`（成就 / 突破点） | 事件流 | 桌宠主动祝贺的触发点 |
| 5 | `idip_field_metadata`（字段语义说明） | 配置 | 桌宠侧能把数字解释给用户听，不能只看到数字 |

#### 4.5.2 需要的原因

1. idip 数据对比是"游戏搭子"维度的**最高 ROI 源**：直接来自首方、合规、不涉及隐私越界。
2. 没有 delta / anomaly 层，桌宠每次都得自己重算，且无法捕捉"卡关"、"连胜"等关键时刻。
3. `idip_field_metadata` 解决"桌宠看到 16 但不知道是等级还是段位"的问题；游戏接入侧负责声明。

#### 4.5.3 边界（v2 锁定用户答复）

1. **idip 字段语义由记忆系统侧声明**（用户 Q3 答复锁定）；当前讨论范围是**通用能力**，不绑定具体 SDK 接入侧。后续 SDK 形态出来后，再决定是否把声明权下放给游戏接入侧。
2. PII / 敏感字段（真实账号、付费记录、实名信息）**不**进入桌宠记忆。
3. 多游戏 idip 数据**不共享**（用户 Q9 答复锁定）；每款游戏独立存储；本分支讨论的"通用"是**字段抽象 / 能力 schema 通用**，不是数据池通用。

### 4.6 游戏数据 - 游戏内实时时间推送 & 捕捉（3.6）

#### 4.6.1 期望字段

| 编号 | 字段 | A/B | 形态 | 桌宠侧用途 |
|---|---|---|---|---|
| 1 | `game_session.start` / `game_session.end` | A | 事件 | 知道一局开始结束 |
| 2 | `game_session.in_game_time` | A | 实时推送 | 游戏内时间（早 / 晚、第几日等，部分游戏） |
| 3 | `game_event.stream`（open / death / revive / settlement 等） | A | 事件流 | 桌宠按事件做反应 |
| 4 | `game_session.duration_signal`（>30min / >1h / >3h 分级） | A | 衍生信号 | 健康提示触发点 |
| 5 | **`event_emotion_tag`**（v2.6 新增 — 事件级情绪标签） | A | 派生层（AI，复用 AI Eval §3.4 emotion_signal 扩到事件级） | 取值：joy / frustrate / satisfy / sadness / neutral；日记 / 高光 / 复盘需要"某一局结束时"的情绪锚点（与 §4.8 current_context.mood_estimate 滑窗级互补） |
| 6 | **`episode.highlight_score`**（v2.6 新增 — 派生到 §4.1 episode） | A | 派生层（规则代码） | 0-1 浮点；从 idip_milestone × emotion_strength × user_action 加权派生；日记筛选阈值 + 高光候选输入；多消费方复用 |

#### 4.6.2 需要的原因

1. "游戏搭子"的灵魂是**对时刻有感**：你刚死，我才说"啊这把可惜了"；你刚通关，我才能祝贺。**事件流缺一不可**。
2. 没有 `duration_signal` → 健康提示无法做（这是商业化与合规双重要素）。
3. 推送式（pub/sub）优于轮询；记忆系统应做去重 + 时序整理后再交付桌宠。
4. **v2.6 新增 #5 `event_emotion_tag`**：现有 emotion_signal 是对话级 / `current_context.mood_estimate` 是 5min 滑窗级，**事件粒度的情绪锚点缺失**。日记需要"这一局结束时用户是开心还是沮丧"才能写出对的回顾内容；不补则日记流于事件流水账。
5. **v2.6 新增 #6 `episode.highlight_score`**：现有 episode 不区分"值得日记化的情节"和"普通对话情节"。日记不区分则流水账；高光候选无输入；多个下游（日记 / 高光 / 关系成长）都需要这条派生分数，必须 stored 一份多方复用。

### 4.7 VLM 视觉理解（3.7）— v2.3 扩展为"单 app 实例开关，类别含游戏 + 视频"

#### 4.7.1 PM 立场（v2.3 更新）

1. VLM 需要视觉帧，等同于"对指定 app 窗口持续截图 + 模型理解"。
2. v2.1 已锁定"该桌宠绑定单游戏的 VLM 整体开关"。v2.3 由用户产品愿景扩展，**VLM 适用类别从游戏扩到游戏 + 视频 app**：
   1. **游戏类**：原 v2.1 形态，沿用全部规则。
   2. **视频类**：新增，用于"陪用户一起看视频"愿景。
3. **VLM 仍然按"单 app 实例独立开关"管理**，不是"白名单页面选多个 app"；用户必须**逐 app 主动开启**。
4. 与既有硬约束 `不做 Recall 式后台全屏截图` 关系：本扩展不打破硬约束 — VLM 仍然只作用于**用户显式开启 + 前台 + 短期 buffer + 不持久化原图**的单 app 窗口，**不是后台全 app 持续截图**。
5. 与 §4.9 多游戏 / 多视频 app 不共享 profile 一致：每个 VLM 实例的语义标签独立写入对应 app 的记忆，**不跨 app 共享视觉记忆**。

#### 4.7.2 P1 受限放行方案（v2.3，共同规则）

| 编号 | 维度 | 规则（游戏 + 视频通用） |
|---|---|---|
| 1 | 启用前置 | 用户在**该 app 实例的桌宠设置面板**里手动打开 `VLM 视觉理解` 开关；未打开则该实例永不调用 VLM |
| 2 | 触发范围 | 仅采集该 app 的**前台**窗口；切到桌面 / alt-tab / 锁屏 / 切到非授权 app 立即停止 |
| 3 | 视觉帧 | 短期 buffer ≤ 60 秒；buffer 内仅供 VLM 推理使用；**不持久化原图** |
| 4 | 输出层 | 仅保留**结构化语义标签** + 用户可见摘要进入长期记忆 |
| 5 | 云端 | 默认本地推理；如必须云端，每次显式确认；上行**只发语义级**或脱敏帧，不发原图 |
| 6 | 用户控制 | 设置面板里可一键关闭该 app；全局一键暂停 VLM 覆盖所有 app 实例 |
| 7 | 跨实例隔离 | 每个 app 实例的 VLM 输出独立写入对应记忆，**不跨实例聚合 / 不跨 app 推断** |
| 8 | UI 指示 | 每次 VLM 激活时桌宠 UI 必须给出明显"正在看屏幕"状态指示 |
| 9 | 升级约束 | 若未来想扩展到"音乐 app / 工作 app / 自动识别非授权 app"，必须先做隐私评估 + 法务评估 + 项目级决策 |

#### 4.7.2.1 依赖链原则（v2.3.4 新增）

1. **VLM 不负责识别"是哪个 app"**。"是什么 app" 由 §4.2 `active_app`（OS 进程层）+ §4.3 `window_title_redacted`（OS 窗口层）回答，**不是**屏幕像素的工作。
2. **VLM 的职责** = "已知 app 是什么 + 已知用户授权了 VLM" 的前提下，**只回答"画面里是什么场景"**。
3. **依赖链**：
   ```
   §4.2 active_app（哪个 app）→ §4.7 VLM 是否启动 → §4.7 看到的场景标签
   ```
4. **为什么要把这条写明**：
   1. 防止把"app 识别"职责错放到 VLM 上 — VLM 模型的"app 识别"准确率远低于 OS 进程 API（且需要持续看屏幕，隐私成本高）。
   2. 防止 active_app 失败时 VLM "自作主张" — active_app 不匹配 / 不在白名单 / 不在前台时，VLM **必须保持关闭**，不能用画面去猜。
   3. 让 Engineering 在实现时把这个依赖显式写进 watcher 状态机。

#### 4.7.3 游戏类 VLM 细则

| 编号 | 规则 |
|---|---|
| 1 | 适用范围：该桌宠绑定的单游戏前台 **+ 全屏**窗口 |
| 2 | **前置依赖（v2.3.4）**：`active_app` 检测到的进程名 / bundle_id **匹配预设的该游戏标识**；不匹配 → VLM 不启动。VLM **不**靠画面去猜游戏身份 |
| 3 | 触发窗口要求：**全屏**（避免桌面悬浮窗误采） |
| 4 | 语义标签示例：`boss_fight` / `low_hp` / `inventory_open` / `near_death` / `match_won` |
| 5 | 优先级：P1，进 MVP |

#### 4.7.4 视频类 VLM 细则（v2.3 新增，v2.3.4 加前置依赖）

| 编号 | 规则 |
|---|---|
| 1 | 适用范围：用户在桌宠设置手动加入白名单的视频 app（YouTube / Bilibili / 腾讯视频 / 爱奇艺 / 优酷等）；每条目独立开关 |
| 2 | **前置依赖（v2.3.4）**：`active_app` 进程名（如 `BilibiliApp.exe` / `youtube.com` 在浏览器）**+ 浏览器场景下的 `window_title_redacted`**（识别 tab 是否为目标视频 app）**匹配用户白名单**；不匹配 → VLM 不启动 |
| 3 | 浏览器多 tab 场景 | 当 app 是浏览器（Chrome / Edge / Safari）时，靠 `window_title_redacted` 或浏览器 MCP 暴露的当前 tab URL 判断；用户必须**单独授权**"允许桌宠在浏览器内识别 YouTube / Bilibili 这类视频 tab" |
| 4 | 触发窗口要求：**前台 + 大窗口（≥屏幕 50%）或全屏**（小窗口视频不采） |
| 5 | 语义标签示例：`scene_funny` / `scene_emotional` / `scene_action` / `scene_dialogue` / `scene_credits` / `scene_loading` |
| 6 | 用户可见摘要示例："你刚看的这段是个搞笑剧情；要不要我给你来个段子？" |
| 7 | 优先级：P1，进 MVP |
| 8 | 不识别 / 不输出：人脸识别结果、屏幕上的他人 / 弹幕 / 评论原文、字幕原文（仅可输出"有字幕"状态）|
| 9 | **VLM 不负责识别 app 身份**（v2.3.4 强调）：VLM 模型如果"看到 B 站 logo 就启动"是错误实现；必须靠 active_app + window_title 先确认在白名单内 |
| 10 | **浏览器 Tab 检测主路径**（v2.4 新增，接受 Radar Task E）：**浏览器扩展 + Native Messaging** 作为 MVP 首选 — 合规、跨浏览器、用户体验最好；用户一次性安装扩展后持久授权 |
| 11 | **浏览器 Tab 检测兜底**（v2.4 新增）：macOS AppleScript（用户不愿装扩展时）+ Windows UIA 读地址栏 Edit 控件（fallback） |
| 12 | **不允许的浏览器读取方案**（v2.4 强调）：①mcp-chrome 类全功能浏览器 MCP — 权限过大，违反"不读页面内容"边界；②窗口标题文本作为主路径 — 缺域名、SPA 污染易；只能作 fallback 之 fallback |
| 13 | **国产浏览器 Beta 支持**（v2.4 新增，部分接受 Radar Q-E2）：360 / QQ 浏览器 / 搜狗 / Edge 国内版 / UC 进 Beta 标；由 Engineering 第一周验证扩展 API 兼容性；如 ≥50% 可用则 Beta 上线，否则推迟到 P1 |

#### 4.7.5 字段命名建议

1. mock 字段名建议从 v2.1 的 `vlm_enabled_for_this_game` 升级为 `vlm_enabled_for_this_app_instance`；类别字段加 `app_category: "game" | "video"`。
2. 具体字段名由 Engineering Build Thread 与记忆系统团队对齐；本文件只锁定语义。

### 4.8 当前上下文 current_context（3.8）

#### 4.8.1 期望字段

| 编号 | 字段 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `current_context.activity_topic`（如"在打副本"、"在写文档"、"听音乐"） | 5-15min 滑窗摘要 | 桌宠对话的话题锚 |
| 2 | `current_context.mood_estimate`（紧张 / 平静 / 兴奋 / 沮丧） | 滑窗推导 | 决定语气 |
| 3 | `current_context.interrupt_suitability`（high / medium / low） | 滑窗决策 | 打扰决策的唯一输入；桌宠**不自己**判断打扰 |
| 4 | `current_context.attention_target`（如"游戏 / IDE / 视频") | 实时 | 桌宠决定看哪个屏幕方向、说什么类型的话 |
| 5 | `current_context.confidence` | 元字段 | 推导可信度低时桌宠应保守 |

#### 4.8.2 需要的原因

1. 桌宠决策需要**实时切面**，而 episode 与 profile 都是"过去"维度，不能直接驱动"此刻该不该开口"。
2. 把"打扰决策"集中到 `interrupt_suitability` 一个字段，避免每个调用点各自重算 → 体验一致性的关键。
3. `confidence` 字段防止 LLM 在低信息密度时段过度推测。

#### 4.8.3 v2 锁定：滑窗时长

1. 默认滑窗 **5 分钟**（用户 Q4 答复锁定，"尽可能实时"）。
2. 推送策略：变化超过阈值（如 activity_topic 变化 / mood_estimate 跨级 / interrupt_suitability 跨级）立即推送；无变化时每 30s 心跳。
3. 后续可由 AI Feature Evaluation 评估是否进一步压到 1-3 分钟。

### 4.9 Profile 元字段 profile_meta（3.9）

> **命名空间澄清（v2.5.1 新增）**：本节 `source_category`（chat / user_confirmed / game_event / behavior / mcp / vlm / llm_inferred）是**数据来源域分类**，用于 Memory Center "这条记忆来自哪里" 解释 + §4.9.3 confidence 规则映射。**不**等同于 §0.0 / README §1.5 强调的 "不传采集通道元数据"（如 input_modality 键盘 vs STT 区分）—— 后者是 runtime 实现细节不进 memory；前者是**数据来源域**必须进 memory。两个概念不冲突。

#### 4.9.1 期望字段

| 编号 | 字段 | 桌宠侧用途 |
|---|---|---|
| 1 | `confidence`（0-1） | 桌宠引用前判断"是否说出来"；高置信才主动提，低置信只内部用 |
| 2 | `source_category`（chat / game_event / behavior / mcp / user_confirmed） | UI Memory Center 来源解释；同时桌宠侧避免引用高敏来源 |
| 3 | `first_seen_at` / `last_confirmed_at` | 时效衰减；"半年没确认的偏好"应降权 |
| 4 | `user_corrected` | 用户纠错过的条目不能再次自动写回 |
| 5 | `decay_score`（推荐由记忆系统计算） | 桌宠不用自己做衰减逻辑 |

#### 4.9.2 需要的原因

1. mock 数据里的 `profile` **没有这些元字段**，意味着桌宠引用时无法区分"用户说过"vs"LLM 猜的"。
2. 一次"假记忆"穿帮的负面记忆 ≈ 5 次正向体验，体验底线问题，必须从数据 schema 解。

#### 4.9.3 v2 锁定：confidence 计算方式

1. 用户 Q5 答复：**"两者结合（有待考量）"** — LLM self-rate + 规则映射混合。
2. PM 暂行方案：
   1. 规则映射给底层 `confidence_rule`（基于来源：user_confirmed=1.0、chat=0.6、game_event=0.9、behavior=0.5、mcp=0.7、vlm=0.5、llm_inferred=0.3）。
   2. LLM 输出 `confidence_llm`（自评，0-1）。
   3. 最终 `confidence = min(confidence_rule, confidence_llm) × decay_factor`（保守原则）。
3. 上述具体公式由 AI Feature Evaluation 阶段评估调整；本文件只锁定"混合 + 保守原则"两条。

---

### 4.10 系统音频派生信号（3.10，v2.3 新增 / v2.3.1 范围明确）

#### 4.10.0 范围说明（v2.3.1）

1. **本节只覆盖系统音频流的派生信号 + Now Playing 元数据**（听音乐场景）。
2. **不包含**：麦克风录制 / 语音识别 / TTS 输出 / 双向语音对话 / 声纹 / 音色克隆 — 这些归 `voice-interaction` 分支，本节明确不承接。
3. §10.3 A0-A3 分级标准是项目级音频边界基线；本节只放行 A0 / A1 在听音乐场景下的使用；A2 / A3 / 麦克风在本分支**仍然全部排除**（详见 §4.10.6）。

#### 4.10.1 用户愿景驱动

1. 用户 2026-05-11 18:30：桌宠应"随音乐舞动"。
2. PM 拆解：节拍 sync 需要**实时 BPM / 能量信号**，这是音频流派生量，**不存在于任何 app 的 DOM** — 必须从系统级音频 API 获取。

#### 4.10.2 期望字段

| 编号 | 字段 | 形态 | 桌宠侧用途 | 分级（详见 §10.3） |
|---|---|---|---|---|
| 1 | `bpm_estimate` | 实时数值（0-300） | 桌宠动作节奏 | A0 |
| 2 | `energy_curve_buckets` | 滑窗能量桶（low / medium / high） | 动作幅度 | A0 |
| 3 | `beat_event` | 节拍点时间戳事件流 | 关键动作 sync 触发 | A0 |
| 4 | `silence_signal` | 是否静音 / 静音时长 | 桌宠停止舞动 | A0 |
| 5 | `now_playing_title`（来自 OS Now Playing API / MCP，**非音频流派生**） | 字符串 | "我喜欢这首" 类对话 | A1 |
| 6 | `now_playing_artist` / `album` / `duration_sec`（来自 MCP） | 字符串 / 数值 | 同上 | A1 |

#### 4.10.3 需要的原因

1. 没有 BPM → 桌宠舞动节奏与音乐脱节，体验比"不舞动"更糟。
2. 没有 `energy_curve_buckets` → 桌宠无法在副歌 / 高潮加大动作幅度，舞动平淡。
3. 没有 `beat_event` → 关键动作（点头 / 转圈）无法对齐节拍，看起来"乱舞"。
4. 静音信号 → 桌宠不会在音乐暂停时还在动。
5. A1 标识层（曲名 / 歌手）支撑"知心好友"叙事（"这是你最近常听的那首"）。

#### 4.10.4 采集 / 边界

1. **本地计算**：BPM / 能量 / 节拍点全部在本地音频处理；**不上传任何音频流**。
2. **不识别**：歌词、说话内容、人声 vs 乐器、语言种类 — 任何内容理解都不进入 A0。
3. **不持久化**：原始音频流不存盘；派生标量短期 buffer ≤30s；长期仅保留聚合标签（"用户常听快节奏 / 慢节奏"）。
4. **默认关闭**：用户必须在桌宠设置面板**单独开启**"音频节拍监听"开关。
5. **UI 指示**：启用时桌宠 UI 给出"已启用音频节拍监听"明显可见提示。
6. **隔离**：A0 音频派生与 §4.4 MCP `media_now_playing` 是**两条独立数据通道**；用户可独立开关。

#### 4.10.5 与既有 PRIVACY_BOUNDARY 关系

1. 与 `01-pm/PRIVACY_BOUNDARY_memory-system.md` §2 #2 "不默认系统音频监听"**有交集**，需修订该硬约束为 A0-A3 分级。
2. **未直接修改项目级文件**；详细修订提案见 [`PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md`](PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md)。
3. Main Thread 收口决议前，本节字段**仅供 PM / Engineering 规划讨论使用，不进入实际采集**。

#### 4.10.6 排除项（任何优先级都不允许）

| 编号 | 数据 | 排除理由 |
|---|---|---|
| 1 | 原始音频流（任何格式） | A3，无法解释为派生量 |
| 2 | 语音识别 / 歌词识别 / 内容识别 | A2，内容级敏感 |
| 3 | 人声特征 / 声纹识别 | A2，可识别个人身份 |
| 4 | 麦克风录音（与系统音频流不同） | A2，可能采到家庭 / 工作 / 隐私对话 |
| 5 | 跨用户音频数据聚合 | 任何形式都不允许 |

### 4.11 Playwright 受限放行（3.11，v2.3 新增；从 v2.2 禁止状态调整）

#### 4.11.1 立场转变说明

1. v2.2 §4.4.3 把 Playwright 列为"超出范围"（隐含禁止）。
2. 2026-05-11 用户挑战该立场，PM 重新评估后**部分采纳挑战**：
   1. Playwright 不能作为"陪看视频 / 随音乐舞动"的主路径（信号粒度不够）— 详见 §0.3 v2.3 修订摘要。
   2. 但 Playwright 在**"用户主动触发的细节查询"** 场景有不可替代价值（如"刚才那首歌叫什么" / "我 B 站收藏更新了什么"）。
3. **本节立场**：Playwright **不**作为默认数据通道，**P2 受限放行**作为用户主动触发的兜底工具。

#### 4.11.2 期望字段 / 用法

| 编号 | 用法 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `playwright_tool_call(source, query)` | 同步 tool call，返回 JSON 结果 | 桌宠回应用户主动查询 |
| 2 | `playwright_result.snippet` | 一次性脱敏摘要 | 桌宠对话使用 |
| 3 | `playwright_result.metadata`（source / fetched_at / expires_at） | 元数据 | 时效判断 |

#### 4.11.3 边界（7 条硬规则）

| 编号 | 规则 |
|---|---|
| 1 | **仅"用户主动触发"场景**允许使用；**不**做后台轮询 / 不做定时抓取 / 不做被动监听 |
| 2 | **凭据**（cookie / session）必须存于 OS 标准 keychain（macOS Keychain / Windows Credential Manager），**不**存于桌宠应用内部数据库或日志 |
| 3 | 仅访问用户**自己已登录**的页面；**不**访问他人账号 / 不爬公开搜索 / 不做内容大规模抓取 |
| 4 | 抓取结果**短期 buffer ≤ 5 分钟**；**不**持久化原始 HTML / DOM |
| 5 | Playwright 结果**不**进入 long-term profile 自动累积；只供本次对话使用 |
| 6 | 每次 Playwright 执行有可见 UI 状态指示（"正在帮你查 X"） |
| 7 | 用户可在 Memory Center 看到"过去 7 天 Playwright 执行了哪些查询"列表并按需关闭单个 source |

#### 4.11.4 排除项

| 编号 | 数据 / 行为 | 排除理由 |
|---|---|---|
| 1 | 后台轮询 / 持续监听 | 与"用户主动触发"原则冲突 |
| 2 | 模拟用户操作（点击 / 下单 / 发帖 / 评论 / 私信） | 默认不允许；如需做必须走项目级决策 |
| 3 | 跨用户共享 Playwright 抓取数据 | 隐私越界 |
| 4 | 通过 Playwright 抓取本可通过 MCP 获取的数据 | 工程复杂度浪费；MCP 优先 |
| 5 | 把 Playwright 结果写入 long-term profile / atomic_facts / episode | 与 §4.11.3 #5 冲突 |

#### 4.11.5 与 MCP 的分工

| 维度 | MCP（§4.4） | Playwright（§4.11） |
|---|---|---|
| 触发方式 | 后台定时 / 被动获取 | 用户主动触发 |
| 数据通道 | app 主动暴露 | 浏览器自动化 |
| 凭据 | OAuth / API Key | 用户登录态 cookie |
| 时效 | 短期缓存（≤1h）+ 摘要 | 单次 buffer ≤5min |
| 写入长期记忆 | 是（摘要） | 否 |
| 优先级 | P1 | P2 |
| 适用场景 | 持续信号（now_playing / calendar） | 单次细节查询 |

#### 4.11.6 与既有 PRIVACY_BOUNDARY 关系

1. 既有 PRIVACY_BOUNDARY §2 没有 Playwright 相关条目；本节建议在项目级文件**新增 #8 "Playwright 受限放行"** 条目，含上述 §4.11.3 7 条边界。
2. **未直接修改项目级文件**；详细修订提案见 [`PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md`](PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md)。

---

### 4.12 OS Scripting Bridge（C-4，v2.5 新增 — 替代缺失 MCP 的主要工作 / 娱乐 app 通道）

> 用户对 CLI 的真实诉求是"接入娱乐工作 app"。现实中纯 CLI 接入面有限，但**macOS osascript / AppleScript + Windows PowerShell COM Automation** 这条通道接入面**非常广**，比 MCP 通用、比 Playwright 稳定。这是 v2.5 用来覆盖"没 MCP 的国产 / 国际娱乐 / 工作 app"的主要替代方案。

#### 4.12.1 用户愿景驱动

1. 用户 2026-05-12：MCP 不够，希望接入娱乐工作 app；除了 MCP 还有什么方法（如公开 skill / CLI）。
2. PM 评估：纯 CLI 接入面有限（§4.4.8 已说明）；真正能覆盖**大量桌面 app** 的合规通道是**OS Scripting Bridge**（osascript / AppleScript on macOS + PowerShell COM Automation on Windows）。
3. 这条通道是 OS 厂商提供 + app 厂商主动暴露的"app 间通信脚本接口"，与"hook 进程内存"性质完全不同。

#### 4.12.2 接入面（实际可访问的 app 示例）

| 类别 | macOS（osascript / AppleScript） | Windows（PowerShell COM） | 桌宠用途 |
|---|---|---|---|
| **音乐** | Spotify / Apple Music / Music.app | Spotify desktop（部分 COM） | "现在听什么 / 上一首" |
| **视频** | QuickTime / VLC / IINA | Windows Media Player / VLC | "现在看什么文件 / 进度" |
| **笔记** | Notes / Bear / Things / Reminders | OneNote（COM） | "你最近在 Notes 里写了 N 篇" |
| **办公** | Pages / Numbers / Keynote | Word / Excel / PowerPoint / Outlook（COM） | "你在写什么类型的文档" |
| **邮件** | Mail.app | Outlook（COM） | "你有 X 封未读" |
| **日历** | Calendar.app（与 EventKit 互补） | Outlook（COM） | "下一项日程" |
| **浏览器** | Safari / Chrome / Firefox（with permission） | Edge / IE（COM） | tab URL / 标题（与 §4.4.7 浏览器扩展互补） |
| **iMessage / WhatsApp** | iMessage / WhatsApp（with permission） | — | ❌ **不接入**（消息内容敏感） |
| **Slack / Discord** | 部分支持（with permission） | 部分支持 | ⚠️ 仅元数据（频道 / 未读数），**不读消息内容** |

#### 4.12.3 期望字段

| 编号 | 字段 | 形态 | 桌宠侧用途 |
|---|---|---|---|
| 1 | `osa_now_playing.title` / `artist` / `app_source` | 实时状态 | 替代 §4.10 A1 标识，提供更多 app 覆盖 |
| 2 | `osa_recent_documents[]`（app + 文件名 + 时间，最近 N 个） | 短期缓存 ≤ 1h | "你最近在 Notes 里写了 N 篇" |
| 3 | `osa_app_state`（app 是否启动 / 前台 / 是否有 unsaved changes） | 实时状态 | 配合 §4.2 active_app，精度更高 |
| 4 | `osa_unread_count`（邮件 / 通讯 / 通知未读数） | 实时数值 | "你有 X 封未读邮件 / Y 条通知" — 不读内容 |
| 5 | `osa_browser_current_tab`（Safari / Chrome / Firefox 的当前 tab URL + redacted title） | 实时状态 | 与 §4.4.7 浏览器扩展互补；用户未装扩展时 fallback |

#### 4.12.4 边界（v2.5 PM 立场）

1. **走 OS 厂商提供的"app 间通信脚本接口"**：macOS osascript / AppleScript / OSA Scripting / NSAppleScript；Windows PowerShell COM Automation / Win+R `wscript`。
2. **app 必须主动暴露脚本接口**才能接入；不绕过 app 私有 API。
3. **macOS 授权机制**：每个 osascript → 目标 app 调用都需要用户在"系统设置 → 隐私与安全性 → 自动化"授权；这与 Accessibility / Screen Recording 是不同的权限类别。
4. **Windows 授权机制**：COM 调用需要目标 app 启动并对应 COM 接口允许；某些 app（如 Office）默认允许，部分 app 需要"启用宏 / 启用 COM"。
5. **不允许**：
   1. 用 osascript / COM 调用**修改** app 状态（如 `spotify play` / `tell mail to send`）— 只读取，不写入。
   2. 调用涉及消息正文 / 邮件正文 / 文档正文的接口（如 `tell mail to body of message X`） — 只读元数据。
   3. 通过 osascript / COM 访问 app 私有数据库 / 文件系统。
6. **用户在 Memory Center 单 app 开关**；启用 OSA 桥接时桌宠 UI 显示"正在通过系统脚本接口读 X app 元数据"。
7. **短期缓存 ≤ 1h**；长期记忆仅保留聚合摘要（"用户最近常用 Notes"），不保留每条 OSA 返回。
8. **同款全局暂停**：用户可一键暂停所有 OSA 桥接，与暂停 VLM / Playwright / MCP 同款机制。

#### 4.12.5 与其他通道的分工

| 通道 | 主用场景 |
|---|---|
| §4.4 MCP | 工作类生态成熟 app（飞书 / 钉钉 / 滴答 / Steam） |
| §4.4.6 OS 级 API | 系统级元数据（Now Playing / Recent Files / Notifications / Calendar / 设备状态） |
| §4.4.7 浏览器扩展 | Web 端 app 的 tab 身份识别（视频 / 购物 / 阅读 / 学习 / 社交 / 工作） |
| **§4.12 OS Scripting Bridge** | **桌面客户端 app 的元数据读取（Spotify / Apple Music / VLC / IINA / Notes / Bear / Things / Office / Outlook）** |
| §4.4.8 CLI | 极小集合（Spotify CLI / VS Code CLI / 公开 skill） |
| §4.4.9 IFTTT 桥接 | 用户高级配置 P2 探索 |
| §4.11 Playwright | 用户主动触发的细节查询兜底 |

#### 4.12.6 隐私边界 vs PRIVACY_BOUNDARY

1. OSA / COM 走的是 OS 公开脚本接口 + 用户授权 + app 主动暴露三重保险，**不违反**既有 PRIVACY_BOUNDARY §2 任何硬约束。
2. 与 v2.3 §4.10 A0 / A1 不同：A1 走 OS Now Playing API（系统级），OSA / COM 走 app 间脚本接口（app 级）。两者互补，不冲突。
3. **必须**在 PRIVACY_BOUNDARY 修订提案（Deferred）中加注 v2.5 引入 OSA / COM 通道，等 voice-interaction 启动时合并审议。

---

### 4.13 高光事件 highlight_event（v2.6 新增 — 画像模块 7/8 + 日记沉淀）

> **来源驱动**：日记模块需要"值得记的事件"输入；用户画像页"高光记忆"模块直接消费此数据类；多消费方（日记 + 画像 + 分享）复用 → 必须 stored 在 memory 而非每次重算。

#### 4.13.1 PM 立场

1. 现有 `episode`（情节摘要）+ `idip_milestone`（成就突破）+ `game_event` 各自有用，但**没有显式"高光"数据类**，导致日记 / 画像 / 分享各自重算分类标准、口径不一致。
2. **`highlight_event{}` 是 §4.1 / §4.5 / §4.6 / §4.7 / §4.8 上层的合成抽象**：从底层数据中**选 + 归类 + 加 PII 检测 + 标可分享性**，一次合成多方复用。
3. **A 类全字段**（含 LLM 派生字段），由 memory 派生层一次性合成 + stored；用户可在 Memory Center 编辑（user_corrected 锁定）。
4. **桌宠 IP 语气的"宠物观察视角文本"不在本数据类**（B 类，消费侧每次按 IP 生成；见 §4.18 #3）。

#### 4.13.2 期望字段（全部 A 类）

| 编号 | 字段 | A/B | 派生方式 | 桌宠 / Memory Center 用途 |
|---|---|---|---|---|
| 1 | `highlight_id` | A | 系统生成 | 主键，多消费方引用 |
| 2 | `title` | A | LLM 候选 + ✅ 用户可编辑 | 标题（短，≤20 字） |
| 3 | `time` | A | 系统直接 | 事件时间戳 |
| 4 | `scene` | A | LLM 派生（合成 `active_app` + `window_title_redacted` + `game_vlm.semantic_tags`） | 场景描述（如"王者荣耀 BOSS 战翻盘"） |
| 5 | `event_summary` | A | LLM 生成 + ✅ 用户可编辑 | 事件摘要（≤80 字；引用 `atomic_facts` 时必须 `quote_eligible=true`） |
| 6 | `category` | A | LLM 推荐 + ✅ 用户可改 | 枚举：`achievement` / `growth` / `emotion` / `social` / `collection` / `relationship` |
| 7 | `tags[]` | A | LLM 候选 + ✅ 用户可改 | 自由标签（≤5 条，去重） |
| 8 | `source` | A | 系统直接 | 枚举：`idip_milestone` / `episode_highlight_score` / `user_starred` / `persona_result` |
| 9 | `privacy_level` | A | 用户默认（来自 `user_preferences.privacy_grants`）+ ✅ 可改 | 枚举：`private` / `shareable`；私有不允许进分享卡片生成 |
| 10 | `pinned` | A | 用户输入直接 | 置顶 bool |
| 11 | `evidence_ids[]` | A | 系统直接 | 指向底层 `episode` / `game_event` / `idip_milestone` 的 ID（用于回溯，分享卡片 / 复盘） |

> **不含字段**：`game`（桌宠绑定单游戏前提）/ `pet_observation`（B 类，§4.18 处理）。

#### 4.13.3 派生触发时机（memory 侧）

| 触发 | 派生策略 |
|---|---|
| `idip_milestone` 命中 | 立即生成 highlight_event（`source = idip_milestone`） |
| `episode.highlight_score ≥ 阈值`（默认 0.7） | 立即生成 highlight_event（`source = episode_highlight_score`） |
| `game_persona_assessment` 完成 | 生成一条 highlight_event 标记此次测定（`source = persona_result`，`category = growth`） |
| 用户在 Memory Center 主动收藏 | 立即写入（`source = user_starred`） |

#### 4.13.4 用户编辑规则（沿用 §4.9 profile_meta 锁定）

1. 用户编辑 title / event_summary / category / tags / privacy_level 后 → `user_corrected = true`（每条 highlight_event 同样使用 profile_meta 同套机制）；LLM **不再自动覆盖**。
2. 用户删除 → 软删除，标记 `deleted_at`；不进入消费方查询结果，但保留可恢复 ≤30 天。
3. 用户"不要记类似事件" → 写回 `user_preferences.content_type` 降权，**不**自动连删历史条目（避免误伤）。

#### 4.13.5 边界

1. PII 检测：`event_summary` 引用 atomic_facts 时必须使用 `quote_eligible = true` 的子集。
2. 不持久化原图 / 原音频；scene 字段只是文本描述。
3. 跨桌宠 IP：highlight_event 是数据层，**不受 IP 影响**；展示文案（pet_observation）才受 IP，在 B 类。

---

### 4.14 用户偏好 user_preferences（v2.6 新增 — 画像模块 4/5/6/9/14）

> **范围澄清**：用户清单模块 4 / 5 / 6 / 9 / 14 是"用户偏好设置"，**不是采集数据**。但偏好设置需要**持久化 + 与画像数据互通 + 受 PRIVACY_BOUNDARY 管控**，因此放在 memory 层（与 profile 并列），由 Memory Center UI 写入。

#### 4.14.1 PM 立场

1. 这是**用户主动设置**，**全字段 A 类**（用户输入直接存）；个别字段（content_type）可由用户反馈学习推荐，但**显式开关永远优先**。
2. **禁止 LLM 自动猜测**：companion_style / emotion_response / diary_style / privacy_grants 任何字段 LLM 都不可主动写入（这是产品傲慢的来源）。
3. **隐私授权强制用户主动勾选**：privacy_grants 不可推断、不可默认开启（默认全关）。
4. 与 `profile` 并列（不嵌入 profile）：便于 Memory Center 一键清空 user_preferences 时不影响 profile 数据。

#### 4.14.2 期望字段（5 子对象，全部 A 类）

##### 4.14.2.1 `companion_style{}` — 陪伴节奏（模块 4）

| 字段 | 类型 | LLM/用户 | 说明 |
|---|---|---|---|
| `disturb_intensity` | enum (none / low / mid / high) | ❌ ✅ 用户 | 打扰强度 |
| `post_game_summary_freq` | enum (never / streak / every) | ❌ ✅ | 赛后总结频率 |
| `streak_loss_strategy` | enum (comfort_first / reflect_first / silent) | ❌ ✅ | 连败后先安慰 / 先复盘 / 保持沉默 |
| `streak_win_strategy` | enum (celebrate / chill / silent) | ❌ ✅ | 连胜后庆祝 / 平淡 / 沉默 |
| `idle_interact_freq` | enum (none / low / mid / high) | ❌ ✅ | 空闲桌面互动频率 |
| `activity_remind_freq` | enum (none / low / mid / high) | ❌ ✅ | 活动提醒频率 |
| `reflection_granularity` | enum (none / brief / detailed) | ❌ ✅ | 复盘颗粒度 |

##### 4.14.2.2 `emotion_response{}` — 情绪响应偏好（模块 5）

| 字段 | 类型 | LLM/用户 | 说明 |
|---|---|---|---|
| `streak_loss_react` | enum | ❌ ✅ | 连败时希望被怎么回应 |
| `team_mate_impact_react` | enum | ❌ ✅ | 被队友影响后的反应偏好 |
| `want_reflection_on_loss` | bool | ❌ ✅ | 失败后是否想复盘 |
| `accept_jokes` | bool | ❌ ✅ | 是否接受玩笑 |
| `want_quiet_companion` | bool | ❌ ✅ | 是否希望安静陪伴 |
| `love_encouragement` | bool | ❌ ✅ | 是否喜欢被鼓励 |

##### 4.14.2.3 `content_type{}` — 内容偏好（模块 6）

| 字段 | 类型 | LLM/用户 | 说明 |
|---|---|---|---|
| `enabled[]` | enum 多选（light_reflection / tactical_advice / emotion_companion / achievement_celebrate / activity_remind / squad_fun / worldview_skit / diary） | ⚠️ **反馈学习** + ✅ 显式开关优先 | 启用的内容类型 |
| `priority[]` | ordered enum | ⚠️ ✅ | 启用项的优先级 |
| `feedback_signal[]` | [{type, action: like / dislike, at}] | 系统自动写 | 点赞 / 点踩反馈记录，用于权重学习；反馈不直接覆盖 enabled，**用户显式开关永远优先** |

##### 4.14.2.4 `diary_style{}` — 日记偏好（模块 9）

| 字段 | 类型 | LLM/用户 | 说明 |
|---|---|---|---|
| `frequency` | enum (daily / weekly / event_driven / off) | ❌ ✅ | 日记频率 |
| `length` | enum (short / medium / long) | ❌ ✅ | 日记长度 |
| `focus` | enum (events / emotion / growth / mixed) | ❌ ✅ | 日记重点 |
| `perspective` | enum (pet_third_person / pet_first_person) | ❌ ✅ | 日记视角（受桌宠 IP 约束） |
| `quote_user_original` | bool | ❌ ✅ | 是否引用用户原话（受 `atomic_facts.quote_eligible` 约束） |
| `record_failure` | bool | ❌ ✅ | 是否记录失败 |
| `shareable_version` | bool | ❌ ✅ | 是否生成可分享版（受 highlight_event.privacy_level 约束） |

##### 4.14.2.5 `privacy_grants{}` — 隐私授权（模块 14）

| 字段 | 类型 | LLM/用户 | 说明 |
|---|---|---|---|
| `behavior_data` | bool + granted_at | ❌ **严格禁自动** ✅ **强制用户主动** | 是否允许行为数据采集 |
| `chat_content` | bool + granted_at | ❌ ✅ | 是否允许聊天内容入 memory |
| `diary` | bool + granted_at | ❌ ✅ | 是否生成日记 |
| `highlight` | bool + granted_at | ❌ ✅ | 是否生成高光记忆 |
| `persona_assessment` | bool + granted_at | ❌ ✅ | 是否允许人格测定（含外部平台调用） |
| `cloud_sync` | bool + granted_at | ❌ ✅ | 是否允许云端同步 |

> 所有 privacy_grants 默认 `false`；用户在 Memory Center 隐私页主动勾选才开启。撤回时 granted_at 改为 `null` + `revoked_at = now`；撤回不删历史数据（用户可单独删）。

#### 4.14.3 与 PRIVACY_BOUNDARY 关系

1. `user_preferences.privacy_grants` 是**用户对项目级 PRIVACY_BOUNDARY 的 UI 落地**；硬约束（如 #2 不默认麦克风）由 PRIVACY_BOUNDARY 保证不可越界，user_preferences 是**硬约束内的二级开关**。
2. user_preferences 任何字段都**不能放宽**项目级 PRIVACY_BOUNDARY 的硬约束（如不能通过 user_preferences 开启麦克风录制 — 麦克风归 voice-interaction）。
3. 如未来 PRIVACY_BOUNDARY 修订提案（Deferred）转 Accepted，可能新增 privacy_grants 子字段（音频 A0 / VLM 视频 / Playwright 受限放行等）；统一在 voice-interaction 合并审议时定。

---

### 4.15 用户画像 profile 扩展（v2.6 — 画像模块 2/3）

> **来源驱动**：画像页模块 2"我的游戏习惯"+ 模块 3"我的游戏目标"需要枚举级标签，但现有 `profile.interests` / `preferences` 是自由文本，没有枚举约束 → 画像页无法做"标签开关 / 多选 / 反馈"交互。

#### 4.15.1 新增字段（profile 扩展）

| 编号 | 字段 | A/B | 派生方式 | 桌宠 / 画像页用途 |
|---|---|---|---|---|
| 1 | `profile.gameplay_motivation[]` | A（已确认结果） | ✅ 用户多选确认 | 模块 3"我的游戏目标"；枚举：`rank` / `chill` / `social` / `collect` / `story` / `practice_char` / `play_with_friends`；多选 |
| 2 | `profile.gameplay_motivation_candidates[]` | A（派生层 AI） | LLM 从 chat + behavior_patterns 推断候选 | UI 展示候选给用户勾选；**与 #1 字段独立**（候选可能比已确认多） |
| 3 | `profile.gameplay_style_tags[]` | A（派生层 AI + 规则） | LLM 推断 + behavior + idip 规则派生 + ✅ 用户可改 | 模块 2"我的游戏习惯"；枚举：`outcome_sensitive_high/mid/low` / `solo_lean` / `squad_lean` / `growth_stage_early/mid/late` |

#### 4.15.2 派生触发时机

| 字段 | 触发 |
|---|---|
| `gameplay_motivation_candidates[]` | 每 7 天 / chat 累计 ≥ N 条新对话 / 用户进画像页 |
| `gameplay_style_tags[]` | 每 N 局后增量更新；标签变化时通知 Memory Center 显示"画像更新了" |

#### 4.15.3 用户操作

1. **模块 3 流程**：UI 展示 `gameplay_motivation_candidates[]` → 用户多选 → 写回 `gameplay_motivation[]`（`user_corrected = true`）。
2. **模块 2 流程**：UI 展示 `gameplay_style_tags[]` → 用户编辑覆盖 → `user_corrected = true`，LLM 不再自动覆盖（沿用 §4.9 锁定机制）。
3. 用户标"不准" → 该 tag 进入 negative_list（profile_meta.feedback_history），LLM 下次推断时降权。

---

### 4.16 游戏人格测定 game_persona_assessment（v2.6 — 画像模块 10/11）

> **背景**：公司既有平台已有每游戏定制的人格测定能力（不是通用 MBTI），桌宠侧消费此能力作为画像加分项；本节定义 memory 侧的接入字段。

#### 4.16.1 PM 立场（前置 4 条件 + 4 条红线）

##### 前置 4 条件（升 P1 前必须满足）

| # | 条件 | 责任方 | 不通过 |
|---|---|---|---|
| 1 | 公司既有能力**输入字段清单**与 memory schema 对账 | Engineering + 公司平台对接 | 缺字段补字段（必须过 PRIVACY_BOUNDARY） |
| 2 | 公司既有能力**最少数据量门槛** + **当前线上准确率**（用户反馈"像我"率 ≥70%） | 公司平台 + Engineering | 低于阈值不显示 / 准确率不达标 Beta 不上 |
| 3 | **重测策略**：游戏版本更新（meta 漂移）后旧结果如何处置 | 公司平台 | 需要 `persona_schema_version` 字段，旧版本结果标过期 |
| 4 | **法务 / 合规**：跨产品平台调用 + 账号体系打通 | 法务 + 公司平台 | 跨边界需用户显式同意（onboarding 一次同意 + 隐私页可关）|

##### 4 条 PM 红线（任何情况下守住）

1. **persona 不作为陪伴策略的直接驱动信号** — 桌宠陪伴策略只看 `user_preferences.companion_style{}` + `current_context` + `emotion_signal`，**不**读 `persona_label` 调语气。避免过拟合。
2. **persona 不反向污染采集层** — Persona 是消费层，不影响 memory 写入逻辑。
3. **桌宠绑定单游戏前提，schema 不带 `game_id` 字段** — 跨游戏 persona 聚合不存在。
4. **`evidence_strength ≥ 3` 红线** — 必须 ≥3 条 game_event / idip_milestone 数据点支持，否则不展示结果。

#### 4.16.2 期望字段（全部 A 类）

| 编号 | 字段 | A/B | 派生方式 | 桌宠 / 画像页用途 |
|---|---|---|---|---|
| 1 | `assessment_id` | A | 系统生成 | 主键 |
| 2 | `persona_label` | A | 公司既有平台 → memory 存结果 | 该游戏人格标签（如"团战指挥型"） |
| 3 | `persona_schema_version` | A | 公司平台 | 分类体系版本（防 meta 漂移；版本升级时旧结果标过期） |
| 4 | `similarity_breakdown[]` | A | 公司平台 | `[{candidate, score (0-1), evidence_ids[]}]`；候选人格相似度 + 证据 ID 指向 game_event / idip_milestone（用于"为什么像 TA"页面展开） |
| 5 | `assessment_at` | A | 系统直接 | 测定时间 |
| 6 | `data_window` | A | 系统直接 | `{from, to, session_count}`；测定基于的数据窗口（"最近 30 天 60 局"） |
| 7 | `user_feedback` | A | ✅ 用户 | enum：`accepted` / `rejected` / `not_like_me`；反哺下次测定权重 |
| 8 | `evidence_strength` | A | 系统直接 | 支持证据条数（**≥3 红线**） |
| 9 | `is_expired` | A | 派生（基于 `persona_schema_version` 与当前版本对比） | bool；版本升级后旧结果标过期（UI 提示"旧版本测定，是否重测"） |

#### 4.16.3 接入流程（数据双向）

```
memory.game_event[] + memory.idip_milestone[] + memory.chat (部分)
                  │
                  ▼
        [ 公司既有人格测定平台 ]（外部，跨边界）
                  │
                  ▼
memory.game_persona_assessment{} (stored 结果)
                  │
                  ▼
画像页模块 10 / 11 UI 展示（B 类消费侧 LLM 生成"为什么像 TA"文案）
```

#### 4.16.4 测定触发时机

| 触发 | 策略 |
|---|---|
| 用户主动点"测定我的游戏人格" | 立即触发（前提：`evidence_strength ≥ 3`） |
| 数据量首次达标 | Memory Center 推荐"画像可以测定了"（不强制） |
| 重大游戏版本更新后 | 标 `is_expired = true`，UI 推荐重测 |
| 用户反馈 `not_like_me` 后 | UI 提示"是否重测，下次会避开 X 人格" |

#### 4.16.5 失败处理

1. 数据量不足（< 红线）→ UI 显示"测定中（继续陪你玩更多游戏后再测）"，**不强行给结果**。
2. 公司平台调用失败 → 重试 ≤3 次 / 自动降级显示"测定服务繁忙"；**不**用 LLM 编造测定结果。
3. 用户反馈 `not_like_me` 率 > 30% → Engineering 告警 + 数据上报；不达标 Beta 下架。

---

### 4.17 关系成长派生视图 relationship_stats（v2.6 — 画像模块 12）

> **范围澄清**：模块 12"关系成长系统"是**纯派生计数**，不是新原子数据。memory 只需提供派生视图 API，消费方查询时实时算（或缓存）。

#### 4.17.1 PM 立场

1. **A 类（对消费方）**：消费方 query memory 视图 API 直接拿；**实现是派生**（不持久化原子存储）。
2. **PM 边界**（沿用用户清单）：纯纪念性，**不做强压力任务**；不出现"未完成任务 / 必须达成 X 才能解锁"压力 UI。
3. 关系等级的计算公式由 Engineering 决（PM 不锁数字），但 PM 守住"加权指标都来自数据层 + 不掺非数据指标"原则。

#### 4.17.2 期望字段（派生视图，全部 A 类）

| 字段 | 类型 | A/B | 派生源 |
|---|---|---|---|
| `companion_days` | int | A | first_install_at → now（按日历日） |
| `co_game_session_count` | int | A | count(game_event.session) |
| `diary_count` | int | A | count(episode where highlight_score ≥ diary_threshold) |
| `highlight_count` | int | A | count(highlight_event WHERE deleted_at IS NULL) |
| `persona_assessment_count` | int | A | count(game_persona_assessment) |
| `relationship_level` | int | A | 上述指标加权派生（公式 Engineering 决） |
| `milestone_unlocked[]` | string[] | A | 派生：陪伴 7 / 30 / 100 / 365 天；首条高光；首次测定；首条日记 等等 |

#### 4.17.3 派生触发 / 性能

1. 实时算 vs 缓存：PM 不锁；Engineering 决（建议每日 0:00 全量重算 + 关键事件后增量更新）。
2. relationship_level 公式建议**指数衰减**（首 30 天涨快，后续递减），避免老用户卡级。
3. milestone_unlocked 触发时通知 Memory Center 显示纪念卡片（不强制弹窗）。

---

### 4.18 B 类消费侧动态生成内容清单（v2.6 — 不进 memory schema）

> 此节列出**所有不进 memory schema 但需要 memory 前置数据**的消费侧生成内容。Engineering / Design 接手时按本表实现各消费侧服务，**不要把这些写回 memory**。

#### 4.18.1 B 类生成内容总表

| # | 内容 | 触发时机 | 前置数据（从 memory 拿什么） | 实现责任方 | 生成约束 |
|---|---|---|---|---|---|
| 1 | **日记正文** | 用户查看 / 定时 | `episode` (highlight_score) + `atomic_facts` (quote_eligible) + `event_emotion_tag` + `game_event` + `idip_milestone` + 桌宠 IP | 日记生成器 LLM agent | 受 `user_preferences.diary_style` 约束；引用原话必须 quote_eligible=true |
| 2 | **一句话画像卡片 / 总览页标语** | 画像页加载 | `profile.summary` + `relationship_stats` + 桌宠 IP | UI Composer（LLM 或模板） | ≤30 字 |
| 3 | **高光记忆"宠物视角观察" `pet_observation`** | 高光页加载 / 分享时 | `highlight_event.*`（含 evidence_ids 反查）+ 桌宠 IP | 消费侧 LLM | 不写回 memory；不同 IP 输出不同；每次按 IP 重新生成 |
| 4 | **桌宠实时对话回复** | 实时交互 | memory 全套（profile / current_context / episode / atomic_facts / emotion / persona_label / highlight_event ）+ 桌宠 IP | 桌宠 agent LLM | 受 PRIVACY_BOUNDARY 全部硬约束 + user_preferences 约束 |
| 5 | **高光分享卡片图文** | 用户分享 | `highlight_event` (privacy_level = shareable) + 分享模板 + 桌宠 IP | 分享服务 | privacy_level = private 的不可分享 |
| 6 | **人格测定结果页解释文案**（"为什么像 TA"） | 测定完成 / 查看 | `game_persona_assessment.similarity_breakdown[]` + 反查 `evidence_ids` → `game_event` / `idip_milestone` + 桌宠 IP | UI Composer | 必须基于 evidence_ids 实证；禁止 LLM 编造证据 |
| 7 | **关系等级 / 里程碑卡片文案** | 升级时 / 查看时 | `relationship_stats.milestone_unlocked[]` + 桌宠 IP | UI Composer | 纪念语气，非任务压力 |
| 8 | **profile.summary 重写**（用户点"重新总结一下我"） | 用户点击按钮 / 周期性 | profile 全字段 + 最近 episode + highlight_event | LLM agent | **例外**：写回 memory.profile.summary（A 常驻 + B 触发更新） |

#### 4.18.2 PM 红线（消费侧 B 类生成）

| # | 红线 | 理由 |
|---|---|---|
| 1 | **B 类生成默认不写回 memory**（例外见 #8） | 受 IP / 场景影响，写回失效 |
| 2 | **桌宠 IP 语气内容只走 B 类** | pet_observation / 对话 / 日记正文 / 分享文案 / 卡片文案 全部按 IP 实时生成 |
| 3 | **必须基于 memory 实证，禁止 LLM 编造** | 引用 highlight_event 时必须用 evidence_ids 回溯实证；人格"为什么像"必须基于 similarity_breakdown.evidence_ids；日记记录必须基于 atomic_facts (quote_eligible) |
| 4 | **B 类生成失败不静默兜底** | LLM 推理失败 → UI 显示"内容生成中"或"暂时不可用"；不允许"假装生成成功" |

---

## 5. 与既有 P0 边界关系审查

| 编号 | 既有硬约束（来自 `PRIVACY_BOUNDARY_memory-system.md` §2） | 本分支的影响 | 结论 |
|---|---|---|---|
| 1 | 不默认 Recall 式后台截图 | §4.7 VLM 陪玩 | v2.1：VLM 升为 **P1 + 该桌宠绑定单游戏的整体开关 + 仅前台全屏游戏窗口 + 短期 buffer ≤60s + 不持久化原图**；与硬约束"不默认全屏截图"共存：默认仍关闭，只在用户在该游戏设置面板显式开启时启用，**不是后台全 app 截图**，因此不构成对硬约束的违反 |
| 2 | 不默认系统音频监听 | 本分支不涉及 | ✅ 不冲突 |
| 3 | 不记录键盘输入内容 | §4.3.3 用户原始描述里"用户操作"如包含按键流 | 仅放行派生信号 `input_intensity_level`，**原始按键流全部排除** |
| 4 | 不长期存跨 app 全文 | §4.3.2 `ui_text_snapshot` | 仅 P1 explicit opt-in + 短期 buffer + 长期只摘要 |
| 5 | 不上传 raw OS context | §4.2 / §4.3 / §4.4 涉及行为 / UI / MCP | 全部走"本地优先 + 上传仅脱敏摘要"，不打破 |
| 6 | 不写敏感业务信息 | 全文 | ✅ 不冲突 |
| 7 | 不使用 Recall 作为数据源 | 本分支不涉及 | ✅ 不冲突 |
| 8 | （新增提议）不默认系统音频监听 → 拆为 A0-A3 分级 | §4.10 系统音频派生信号 | v2.3 **提议修订**：A0 派生（BPM / 能量 / 节拍）✅、A1 标识（曲名 / 节目名）✅、A2 音频内容 / 语音识别 ❌、A3 完整音频流 ❌；详见 `PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md` |
| 9 | （新增提议）Playwright 受限放行 | §4.11 Playwright | v2.3 **提议新增**：仅用户主动触发 + OS keychain + 短期 buffer + 7 条边界规则；详见提案文件 |

---

## 6. 数据流期望（概念视图，不是工程架构）

1. 多源采集（聊天 / 行为 / MCP / 游戏）→
2. 记忆系统 ingest 层做去重 / 时序对齐 / 敏感字段裁剪 →
3. 三层抽象生产（atomic_facts / episode / profile）+ 实时切面（current_context）→
4. 元字段附加（confidence / source / decay / user_corrected）→
5. 提供给桌宠的统一查询接口（**桌宠不直接访问 raw 层**）→
6. 用户在 Memory Center 可对任一层做查看 / 删除 / 纠错 / 禁用。

---

## 7. AI 必要性快判

| 编号 | 数据 / 字段 | AI 必要性 | 推荐方案 |
|---|---|---|---|
| 1 | atomic_facts 抽取 | 必要 | LLM Prompt（规则 + LLM 混合） |
| 2 | episode 摘要 | 必要 | LLM Prompt |
| 3 | profile 抽取 | 必要 | LLM Prompt + 用户确认回路 |
| 4 | emotion_signal | 中等 | 轻量分类器 / LLM；不强依赖 |
| 5 | current_context 推导 | 必要 | 规则为主 + LLM 兜底（保延迟） |
| 6 | idip delta / anomaly / milestone | 不必要 | 规则系统 |
| 7 | game_event 去重整理 | 不必要 | 规则系统 |
| 8 | VLM 单 app 实例（游戏 + 视频，v2.5 扩展） | 必要（且唯一退路） | **VLM 三档混合架构（CNN + 2-4B VLM + 云端兜底用户同意）；P1 进 MVP**（用户单 app 实例显式开启；详见 §4.7 + AI Eval v3 §3.6） |
| 9 | MCP tool 结果摘要 | 中等 | 短模板 / 轻量 LLM |

---

## 8. 与 FEATURE_SUMMARY 的映射（部分）

| 编号 | 本文件提及的能力 | 对应 FEATURE_SUMMARY 中的功能点（粗对） |
|---|---|---|
| 1 | atomic_facts + episode + profile | "长期记忆 / 角色记得我" 类功能 |
| 2 | current_context.interrupt_suitability | "低打扰 / 全屏安静" 类功能 |
| 3 | idip delta / event stream | "陪玩反应 / 时刻感" 类功能 |
| 4 | profile_meta（来源 / 置信度） | "Memory Center 信任基础" 类功能 |
| 5 | VLM 单 app 实例（游戏 + 视频） | "陪伴反应 / 陪看视频" 核心能力（**P1，三档混合架构；用户单 app 实例开启**） |
| 6 | MCP media / task / calendar | "知心细节感" 类功能 |

（精确映射在 PRD 阶段做；本表只用于参考。）

---

## 9. Open Questions（v2 已收口）

| # | Question | Owner | Status | Resolution |
|---|---|---|---|---|
| 1 | 用户操作：派生 vs 原始 vs 都要？ | 用户 + PM | **Partially Resolved 2026-05-11**（用户答"都要"，PM 拒绝原始按键 / 字符流） | 派生指标 P0；快捷键事件流（modifier+key，不含字符）P1；窗口标题脱敏 P0；UI 文本 opt-in P1；字符流任何形式都不允许。详见 §4.3 与 §10。 |
| 2 | MCP 默认开还是默认关？ | 用户 + PM | Resolved 2026-05-11 | 默认全部关闭；用户在 Memory Center 自选启用 / 停用第三方 MCP。详见 §4.4.3。 |
| 3 | idip 字段语义由谁声明？ | PM + Engineering | Resolved 2026-05-11 | 由记忆系统声明（通用能力层面）；SDK 接入侧由后续阶段决定。详见 §4.5.3。 |
| 4 | current_context 滑窗多长？ | PM + AI Feature Evaluation | Resolved 2026-05-11 | 默认 5min，变化触发立即推送，无变化 30s 心跳。详见 §4.8.3。 |
| 5 | profile_meta confidence 怎么算？ | PM + Engineering | Resolved 2026-05-11（暂行） | 规则映射 + LLM self-rate 混合，最终取保守值并乘以衰减因子。详见 §4.9.3；具体公式留 AI Feature Evaluation。 |
| 6 | VLM 陪玩进 P2 还是 P1？ | 用户 + PM | Resolved 2026-05-11（v2.1 修订） | **P1 + 该桌宠绑定单游戏的整体开关（无跨游戏白名单页）+ 前台全屏 + 短期 buffer ≤60s + 不持久化原图**。详见 §4.7。 |
| 7 | emotion_signal 进 MVP？ | PM + AI Feature Evaluation | Resolved 2026-05-11 | 进 MVP；MVP 初版规则 + 关键词，逐步引入轻量分类器。详见 §4.1。 |
| 8 | 查询接口 SLA？ | PM + Engineering | **Open** | 用户答"不太清楚"；交由 Engineering Build Thread 在 schema 草案阶段提出建议值；建议起点：实时查询 P99 ≤200ms、批量 ≤2s。 |
| 9 | 多游戏 profile 是否共享？ | 用户 + PM | Resolved 2026-05-11 | **不共享**；本分支讨论的"通用"是字段抽象 / 能力 schema 通用，不是数据池通用。详见 §4.5.3。 |
| 10 | 跨数据源 mock 是否补？ | PM + Radar | Resolved 2026-05-11 | **文档内附 mock 格式**（详见 §11）；同时派 Radar 补一份完整可运行的跨数据源 mock（详见 `06-sync/dm/pm-to-radar/` 2026-05-11T17-10-08）。 |

## 10. 键盘信号分级标准（v2 新增，v2.5 扩展为 5 层含 L1.5）

> **命名空间提醒（v2.5.1 新增）**：本节键盘 L0 / L1 / L1.5 / L2 / L3 分级与 §4.3 档 A 用户操作 A1 / A2 / A3 是**互相对照的两套体系**（L 命名行为档 A 在键盘维度的具体允许等级；A 命名是行为档跨设备的语义分组）。请不要与 §10.3 **音频 A0-A3 分级**混淆 — 后者完全独立。详见 §0.0 命名空间速查。

| 编号 | 层级 | 内容 | 是否允许 | 来源信号示例 | 桌宠侧用途 |
|---|---|---|---|---|---|
| 1 | **L0 派生指标** | 强度 / 节奏 / 桶化统计 / 鼠标 region / 设备切换 / 多屏活动 / scroll 强度，**不含任何键 / 坐标内容** | ✅ P0 默认 | `input_intensity_level: high`、`mouse_region_heatmap_top3: [left, center, top-right]`、`input_device_switch_event: keyboard→trackpad`、`scroll_intensity_signal: heavy` | "用户专注中"、"用户切到触摸板做触控浏览" |
| 2 | **L1 快捷键事件 + 操作语义事件**（v2.5 扩展） | modifier + 命名键 **+** OS 级"操作意图事件名"（save / copy_paste / undo_redo / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install / window_arrangement） | ⚠️ P1 opt-in（默认开） | `cmd+s`、`semantic_event.save`、`semantic_event.fullscreen_toggle` | "刚保存"、"刚锁屏"、"刚新建 tab"、"分屏工作" |
| 3 | **L1.5 编辑动作派生**（v2.5 新增） | 文本编辑动作类别 + Undo/Redo 频率 + IME 状态 + 编辑时长 + 编辑突发频率；**不含任何字符内容 / IME composition / 复制粘贴原文** | ⚠️ P1 opt-in | `text_edit_action_burst: [insert_chunk, cross_paragraph_jump]`、`undo_redo_rate_per_min: 5`、`ime_state: cn`、`editing_session_duration_min: 25` | "用户在大段重构"、"用户中文输入中"、"持续编辑 25min" |
| 4 | **L2 字符级原始流** | 任何字符键的内容（含 hash 后 / 含 IME composition / 含剪贴板内容 / 含拖拽内容 / 含鼠标坐标流 / 含像素 heatmap） | ❌ 任何优先级都不允许 | `key: 'a'`、`hash('hello')`、`clipboard: '...'`、`mouse_xy: (100, 200)`、`pixel_heatmap: [[...]]` | 不适用 — 已排除 |
| 5 | **L3 键盘 / 鼠标 / 编辑事件的完整时间戳序列** | 即使不含字符 / 坐标，完整毫秒级时间戳序列 | ❌ 不允许 | `timestamps: [1234567890, 1234567920, ...]` | 不适用 — 可通过 timing attack 反推字符 / 操作路径 |

执行规则：
1. 每个 L 级别在 Memory Center 必须可单独查看和关闭（L0 / L1 / L1.5 各自独立）。
2. L1 / L1.5 启用时必须在桌宠 UI 给出"已启用快捷键 / 操作语义 / 编辑动作监听"的可见指示。
3. 系统升级到新版本时，**新增的快捷键 / 操作语义事件名 / 编辑动作类别不自动加入白名单**；用户必须确认。
4. PM 立场：**L2 / L3 不进入"未来探索"清单，不留口子**（v2.5 沿用）。
5. **v2.5 新增**：L1.5 编辑动作派生与 L1 操作语义事件是**互补的两层** — L1 是"OS 级事件"（cmd+s / 新建窗口），L1.5 是"app 内编辑动作类别"（插入段落 / 撤销）。两层各自独立可关闭。

### 10.1 研发自由度规则（v2.1 新增，回应用户反馈 2；v2.5 扩展到 L1.5）

| 编号 | 维度 | 谁可以改 | 是否需 PM review | 边界 |
|---|---|---|---|---|
| 1 | L0 派生指标的**具体字段清单**（增加 / 删除 / 重命名） | Engineering Build Thread | 是 | 仍属"派生 / 桶化 / 不含键内容"语义；新字段不可携带任何字符 / 时序序列 |
| 2 | L0 字段的**采样窗口 / 桶化粒度 / 阈值** | Engineering Build Thread | 否（仅性能 / 准确率调优） | 不引入新数据形态 |
| 3 | L1 快捷键白名单的**具体组合**（增加 / 删除某条 modifier+key） | Engineering Build Thread + 用户 | 是 | 仍属 modifier + 命名键；不可加入纯字符键 |
| 4 | L1 启用时的**用户提示形态** | Design Prototype Thread | 是 | 必须明显可见 |
| 5 | **跨层级移动**（如把 L1 的快捷键改到 L2 / 把字符键提到 L1） | **❌ 任何线程都不可** | — | L2 / L3 是 PM 硬规则，与既有 `PRIVACY_BOUNDARY_memory-system.md` §2 #3 一致；任何放宽必须先在 `decisions/DECISION_LOG.md` 走项目级决策 |
| 6 | **L2 / L3 内的字段**新增 / 启用 | **❌ 任何线程都不可** | — | 同上 |
| 7 | 新字段性质模糊（不确定属 L0 还是 L1 还是 L2） | Engineering Build Thread 提案 → PM 判定 | 是 | 默认采取更高隐私等级（往 L2 靠） |

PM 备注：
1. 研发自由度只在**层级内**展开；层级之间的边界（特别是 L1 与 L2 的分界）由 PM 把守。
2. 任何想跨边界的需求都欢迎讨论，但需要走项目级决策流程，不能在 Engineering / Design 单边变更。

### 10.2 PM 字段命名 Review 边界（v2.2 新增，PM 答 Radar Q4）

| 编号 | Review 维度 | PM 是否需 review | 理由 |
|---|---|---|---|
| 1 | 字段拼写（snake_case vs camelCase / 单复数 / 缩写） | **否** | 拼写标准化由 Engineering Build Thread 统一负责；PM 不介入低粒度命名规约 |
| 2 | 字段所属层级（属 L0 还是 L1 还是 L2 / 是否跨越 §10.1） | **是** | 隐私边界 PM 必守 |
| 3 | 隐私敏感字段是否在命名上表达了隐私语义（如 `vlm_enabled_for_this_game` 比 `whitelist_enabled` 更清晰） | **是** | 命名是用户与开发者认知的第一道防线 |
| 4 | 与 `PRIVACY_BOUNDARY_memory-system.md` §2 / `LINKS.md` 命名是否冲突 | **是** | 跨文档一致性 |
| 5 | 新增字段是否引入了未在 §3 / §4 声明的数据类别 | **是** | 防止 schema 偷偷扩边界 |
| 6 | 字段语义（如 `confidence` 表示什么、`source_category` 取值集合） | **是**（PM 与 Engineering 共审） | 与 §4.9 confidence 计算方式直接相关 |

PM 工作模式：
1. Engineering Build Thread 在 schema 草案完成后，把"按 §10.2 #2-#6 维度的字段清单"以 review 形式交给 PM；PM **不**逐字段过拼写。
2. PM review 周期建议 2 个工作日内返回；超期视为 PM 接受非边界字段。
3. PM 拒绝单边变更"将 L1 字段下放到 L0"或类似跨层级动作；此类变更走 `decisions/DECISION_LOG.md` 项目级决策。

### 10.3 音频信号分级标准（v2.3 新增，与 §10 键盘分级平行）

> **命名空间说明（v2.5.1 新增）**：本节 **A0-A3 = Audio 音频分级**，与 §4.3 **档 A 用户操作 A1-A3** 是**完全独立的两个命名空间，含义不同**：
> - **音频 A0 派生 ✅** / **A1 标识 ✅** — 允许采集（BPM / 节拍 / Now Playing 标识）。
> - **音频 A2 内容 ❌** / **A3 完整音频流 ❌** — 任何优先级都**不允许**（语音识别 / 歌词识别 / 声纹 / 原始音频流持久化）。
> - **档 A A1 / A2 / A3（§4.3）全部 ✅ 允许** — 与音频 A2 / A3 含义完全不同；勿混淆。
> - 详见 §0.0 命名空间速查。

| 编号 | 层级 | 内容 | 是否允许 | 信号示例 | 桌宠侧用途 |
|---|---|---|---|---|---|
| 1 | **A0 派生指标** | 系统音频流的统计 / 信号级派生量，**不包含任何内容** | ✅ P1 opt-in | `bpm_estimate: 128`、`energy_curve_buckets: high`、`beat_event: [...timestamps]`、`silence_signal: false` | "随音乐舞动"动作触发 |
| 2 | **A1 标识级元数据** | 来自 OS Now Playing API / app MCP 的标识信息（**非音频流派生**） | ✅ P1 opt-in | `now_playing_title`、`artist`、`album`、`duration_sec` | "这是你最近常听的那首"对话 |
| 3 | **A2 音频内容** | 语音识别、歌词识别、说话内容、人声特征 / 声纹 | ❌ 任何优先级都不允许 | speech_to_text / lyric_parse / voiceprint | 不适用 — 已排除 |
| 4 | **A3 完整音频流持久化** | 任何格式的原始音频数据持久化 | ❌ 不允许 | raw_audio_wav / raw_audio_mp3 | 不适用 — 已排除 |

执行规则：
1. A0 计算**必须在本地完成**；不上传原始音频流。
2. A0 派生标量**不持久化原始时序流**；只保留聚合统计（如"用户常听快节奏 / 慢节奏"）。
3. A0 启用必须有桌宠 UI 可见指示（"已启用音频节拍监听"）。
4. A1 与 §4.4 MCP 的分工：A1 是音频领域的 Now Playing 元数据，与 MCP `media_now_playing` 概念相同；优先走 MCP（更稳定），OS Now Playing API 兜底。
5. A2 / A3 不进入"未来探索"清单，**不留口子**；任何引入提议必须走项目级决策。
6. 麦克风音频与系统音频流不同 — 麦克风在 §4.10.6 排除项 #4 已明确**任何形式不允许**。
7. **A0 首拍稳定时间（warmup） = 5 秒**（v2.4 新增，接受 Radar Task D Q-D1）：BPM 检测器启动后 5 秒内 BPM 值波动较大；桌宠在 warmup 期内**不根据 BPM 做反应**，仅观察、等待稳定；warmup 完成后才驱动舞动行为。
8. **OS 音频流接入策略**（v2.4 新增，来自 Radar Task D §4.3）：
   1. macOS 14.2+：原生 Core Audio Tap（系统级支持，无需第三方）。
   2. macOS < 14.2：BlackHole 虚拟音频设备兜底（需用户安装；onboarding 中提示）。
   3. Windows：WASAPI loopback（标准 API，Win10 全覆盖）。

#### 10.3.1 研发自由度规则（与键盘 §10.1 平行）

| 编号 | 维度 | 谁可以改 | 是否需 PM review | 边界 |
|---|---|---|---|---|
| 1 | A0 派生指标的具体字段清单 | Engineering | 是 | 仍属"派生 / 不含内容"语义 |
| 2 | A0 字段的采样窗口 / 桶化粒度 / 阈值 | Engineering | 否 | 不引入新数据形态 |
| 3 | A1 字段来源（MCP vs OS Now Playing API） | Engineering | 是 | 不可改为内容识别 |
| 4 | 跨层级移动（如把 A1 字段改到 A2） | **❌ 不可** | — | A2 / A3 是 PM 硬规则 |

## 11. Mock Schema 示例（v2 新增，v2.2 接受 Radar Task C 5 处字段扩展）

> 所有 mock 字段名为 PM 视角的**语义命名**，最终字段名由 Engineering Build Thread 与记忆系统团队对齐；本节不锁定字段名拼写。Mock 使用脱敏的 player_id（`player_<uuid>` 形式），不沿用 mock 输入侧的 `msdk_xxx` 真实 SDK ID 形态。
>
> v2.2 起，完整可运行的跨数据源 mock 见 `04-research/branches/memory-dataset/MOCK_DATA_cross-source-memory-dataset.json` + `.md`（Radar Task C 产物）。本节示例与该 mock 保持字段语义一致；Radar Task C 做了 5 处**字段扩展**（不删不改名），PM 全部接受，详见各小节末"v2.2 补充"。

### 11.0 顶层 mock_metadata 对象（v2.2 新增，Radar 扩展 #5）

```json
{
  "mock_metadata": {
    "schema_version": "0.3.0",
    "reference_spec": "01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md",
    "spec_version": "v2.5",
    "player_id": "player_a1c93f01",
    "game_id": "<game_codename>",
    "time_range": ["2026-04-21T09:00:00Z", "2026-04-21T10:00:00Z"],
    "window_seconds_default": 300,
    "vlm_enabled_for_app_instances": [
      {"app_category": "game", "app_id": "<game_codename>", "enabled": true},
      {"app_category": "video", "app_id": "bilibili", "enabled": false}
    ],
    "mcp_user_enabled_sources": ["dida", "feishu", "steam"],
    "audio_a0_enabled": true,
    "playwright_enabled_sources": ["bilibili"],
    "os_api_enabled_channels": ["now_playing", "user_activity", "recent_files", "notification_center", "calendar", "device_status"],
    "browser_extension_enabled_categories": ["video", "shopping", "reading", "learning", "social_browsing", "work"],
    "osa_com_enabled_apps": ["spotify", "apple_music", "vlc", "notes", "office_outlook"],
    "keyboard_signal_levels_enabled": ["L0", "L1", "L1_5"],
    "cli_tool_enabled": ["spotify_cli"],
    "ifttt_webhook_enabled": false
  }
}
```

PM 备注：`mock_metadata` 是**示例数据集**的元状态，不是运行时 schema 的一部分；mock 数据的使用者需要快速看懂"这份 mock 是什么"，但生产 schema 不应携带此对象。

### 11.1 聊天数据（沿用 chenmo_chat_output.json + v2 补字段）

```json
{
  "data_source": "chat",
  "segment_index": 0,
  "segment_topic_summary": "讨论刺客隐刃流天赋分配与PVP策略优化",
  "segment_messages": [
    {
      "player_id": "player_a1c93f01",
      "message_uuid": "msg_000101",
      "session_id": "sess_b41101",
      "message_type": "user",
      "content": "上了上了，晨会摸鱼时间到。刺客那个隐刃流好像又被砍了……",
      "timestamp": "2026-04-21T09:08:00Z"
    }
  ],
  "atomic_facts": [
    {
      "fact": "玩家表示刺客隐刃流被削弱",
      "at": "2026-04-21T09:08:00Z",
      "source": "chat",
      "confidence_rule": 0.6
    }
  ],
  "_pm_note_source_enum": [
    "chat",
    "user_confirmed",
    "game_event",
    "behavior",
    "mcp",
    "vlm",
    "llm_inferred"
  ],
  "episode": {
    "title": "玩家询问天赋树调整",
    "content": "玩家在晨会时间询问刺客天赋树是否需要调整，助手建议 PVE 3-2-1，PVP 保留破隐反打。",
    "participants": ["player_a1c93f01"],
    "time_range": ["2026-04-21T09:08:00Z", "2026-04-21T09:10:00Z"]
  },
  "emotion_signal": {
    "primary": "neutral",
    "secondary": ["curious"],
    "confidence": 0.55
  }
}
```

### 11.2 用户画像 profile + profile_meta（v2 新增 meta 字段）

```json
{
  "data_source": "profile",
  "player_id": "player_a1c93f01",
  "summary": "用户关注游戏更新内容，尤其对刺客职业的天赋树调整表现出兴趣。",
  "interests": [
    {
      "value": "刺客职业",
      "meta": {
        "confidence": 0.85,
        "source_category": "chat",
        "first_seen_at": "2026-04-21T09:08:00Z",
        "last_confirmed_at": "2026-04-21T09:10:00Z",
        "user_corrected": false,
        "decay_score": 0.95
      }
    },
    {
      "value": "刷副本",
      "meta": {
        "confidence": 0.4,
        "source_category": "llm_inferred",
        "first_seen_at": "2026-04-21T11:30:00Z",
        "last_confirmed_at": null,
        "user_corrected": false,
        "decay_score": 0.6
      }
    }
  ],
  "preferences": [
    {
      "value": "稳定策略",
      "meta": {
        "confidence": 0.7,
        "source_category": "chat",
        "first_seen_at": "2026-04-21T09:10:00Z",
        "last_confirmed_at": "2026-04-21T09:10:00Z",
        "user_corrected": false,
        "decay_score": 0.95
      }
    }
  ],
  "behavior_patterns": [
    {
      "value": "晨会时间查询游戏信息",
      "meta": {
        "confidence": 0.5,
        "source_category": "chat",
        "first_seen_at": "2026-04-21T09:08:00Z",
        "last_confirmed_at": "2026-04-21T09:08:00Z",
        "user_corrected": false,
        "decay_score": 0.8
      }
    }
  ]
}
```

### 11.3 行为数据 - PC 传统进程 + 派生输入指标（v2.5 扩展 A1 5 字段）

```json
{
  "data_source": "behavior_pc",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:15:00Z",
  "active_app": {
    "name": "VS Code",
    "bundle_id": "com.microsoft.VSCode",
    "is_fullscreen": false
  },
  "idle_signal": "active",
  "input_indicators": {
    "input_intensity_level": "high",
    "typing_rhythm_signal": "steady",
    "mouse_activity_burst": false,
    "app_switch_rate_per_min": 2,
    "_v2_5_new_fields": {
      "mouse_region_heatmap_top3": ["center", "top-right", "left"],
      "mouse_event_type_burst": [
        {"event": "double_click", "at": "2026-04-21T09:14:32Z"},
        {"event": "drag_select", "at": "2026-04-21T09:14:55Z"},
        {"event": "scroll_burst", "at": "2026-04-21T09:15:00Z"}
      ],
      "input_device_switch_event": [
        {"from": "keyboard", "to": "trackpad", "at": "2026-04-21T09:14:48Z"}
      ],
      "multi_display_activity": {
        "foreground_display_index": 0,
        "cross_display_drag_count_recent_30s": 1
      },
      "scroll_intensity_signal": "medium"
    }
  },
  "recent_apps_top3": [
    {"name": "VS Code", "fg_duration_min": 35},
    {"name": "Chrome", "fg_duration_min": 12},
    {"name": "Slack", "fg_duration_min": 4}
  ]
}
```

v2.5 补充说明：
1. `mouse_region_heatmap_top3`：屏幕分 9 区（top-left / top / top-right / left / center / right / bottom-left / bottom / bottom-right），按近 30s 鼠标活动密度返回 top 3 区域；**不带坐标**。
2. `mouse_event_type_burst`：事件流类别（double_click / long_press / drag_select / scroll_burst 等），**不带坐标 / 不带选中内容**。
3. `input_device_switch_event`：设备类别切换事件流（keyboard / trackpad / mouse / pen / touch）。
4. `multi_display_activity`：仅 display index + 跨屏拖事件计数，**不带跨屏拖的内容**。
5. `scroll_intensity_signal`：滚动强度桶（light / medium / heavy）。
6. 字段名占位 `_v2_5_new_fields` 仅为本 mock 阅读方便；正式 schema 由 Engineering 决定是否扁平化（建议扁平化进 `input_indicators` 顶层）。

### 11.4 行为数据 - UI 信息 + 操作语义事件流（v2.5 扩展 A2 8 字段）

```json
{
  "data_source": "behavior_ui",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:16:30Z",
  "window_title_redacted": "在 IDE 编辑代码文件",
  "is_fullscreen_game": false,
  "ui_text_snapshot": {
    "app_whitelisted": true,
    "summary": "屏幕上有错误弹窗，提示 timeout",
    "buffer_expiry_at": "2026-04-21T09:21:30Z"
  },
  "shortcut_events": [
    {"combo": "cmd+s", "at": "2026-04-21T09:16:12Z"},
    {"combo": "alt+tab", "at": "2026-04-21T09:16:25Z"}
  ],
  "semantic_events_v2_5": [
    {"event": "save", "at": "2026-04-21T09:16:12Z"},
    {"event": "copy_paste", "at": "2026-04-21T09:16:18Z", "kind": "copy"},
    {"event": "undo_redo_burst", "at": "2026-04-21T09:16:20Z", "rate_per_min": 4},
    {"event": "fullscreen_toggle", "at": "2026-04-21T09:16:25Z", "kind": "enter"},
    {"event": "new_tab", "at": "2026-04-21T09:16:28Z"},
    {"event": "lock_unlock", "at": "2026-04-21T09:50:00Z", "kind": "lock"},
    {"event": "app_install_uninstall", "at": "2026-04-21T08:30:00Z", "kind": "install", "app_name": "<app_codename>"},
    {"event": "window_arrangement_change", "at": "2026-04-21T09:17:00Z", "kind": "split_screen_enter"}
  ]
}
```

v2.5 补充说明：
1. `semantic_events_v2_5` 是 v2.5 新增的"OS 级操作语义事件流"，与 `shortcut_events`（modifier+键白名单）独立、可同时存在。
2. 9 类事件名（save / copy_paste / undo_redo_burst / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install_uninstall / window_arrangement_change）固定枚举；**不带任何输入内容 / 文件路径 / 剪贴板原文**。
3. macOS 实现路径：NSEvent global monitor + Accessibility events；Windows 实现：`SetWinEventHook(EVENT_SYSTEM_*)`。
4. 用户在 Memory Center 可按事件类别 + 单条目开关。
5. 正式 schema 建议把 `semantic_events_v2_5` 扁平化到顶层 `semantic_events`；本 mock 加版本后缀仅为阅读对比。

### 11.4.1 行为数据 - 编辑动作派生（v2.5 新增 A3 5 字段，对应 §10 L1.5）

```json
{
  "data_source": "behavior_edit",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:17:30Z",
  "active_app_at_snapshot": "VS Code",
  "edit_signals": {
    "text_edit_action_burst": [
      {"action": "insert_chunk", "at": "2026-04-21T09:17:05Z"},
      {"action": "delete_chunk", "at": "2026-04-21T09:17:12Z"},
      {"action": "cross_paragraph_jump", "at": "2026-04-21T09:17:18Z"},
      {"action": "selection_op", "at": "2026-04-21T09:17:25Z"}
    ],
    "undo_redo_rate_per_min": 5,
    "ime_state": "en",
    "editing_session_duration_min": 25,
    "text_edit_burst_frequency": "high"
  }
}
```

v2.5 补充说明：
1. **不读字符内容 / IME composition / 剪贴板 / 选中文本**；仅"动作类别 + 频率 + 时长 + IME 状态"五维派生。
2. `text_edit_action_burst` 动作类别枚举（insert_chunk / delete_chunk / cross_paragraph_jump / selection_op）；位置 / 行号 / 列号都不进。
3. `ime_state`：cn / en / jp / kr / other / none，仅状态不读 composition string。
4. 与 §11.3 §11.4 互补：§11.3 是低层物理动作（按键 / 鼠标）；§11.4 是 OS 级语义事件；§11.4.1 是 app 内编辑动作类别。三层独立可关闭。

### 11.5 MCP 数据（用户自选启用，v2.2 更新候选清单）

> **v2.5.1 措辞澄清**：本节示例的 `user_enabled_sources` 值（dida / feishu / steam）是"**如用户启用 MCP 通道后桌宠首批集成的具体连接器**"，**不是 MVP 必做项** — 用户全部不启用 MCP 也属于合法状态（桌宠靠其他 5 个通道工作）。详见 §4.4.3 #4 + §4.4.4 顶部澄清。

```json
{
  "data_source": "mcp",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:20:00Z",
  "user_enabled_sources": ["dida", "feishu", "steam"],
  "task_progress": {
    "source": "dida",
    "due_today_count": 3,
    "overdue_count": 1,
    "next_priority_task": "<task_codename>",
    "fetched_at": "2026-04-21T09:19:50Z"
  },
  "calendar_next_event": {
    "source": "feishu",
    "title": "<日程>",
    "starts_at": "2026-04-21T09:30:00Z",
    "minutes_until_start": 10
  },
  "game_now_playing": {
    "source": "steam",
    "game_id": "<game_codename>",
    "started_at": "2026-04-21T09:00:00Z"
  }
}
```

v2.2 补充说明：
1. `user_enabled_sources` 候选枚举（PM 答 Radar Q1 后锁定）：MVP 首批 `dida` / `feishu` / `steam`；P1 后半段 `office` / `dingtalk`。
2. **不在枚举内的源**（番茄 ToDo / 腾讯视频 / QQ 音乐 / Notion 等）一律不出现在 mock 与产品菜单。
3. 旧版 v2 示例中的 `qq_music` / `wechat_calendar` 占位**作废**；理由：QQ 音乐路径需 Playwright 自动化（超 §4.4.3 边界）、wechat_calendar 改用飞书 calendar。

### 11.6 游戏数据 - idip 状态对比

```json
{
  "data_source": "game_idip",
  "player_id": "player_a1c93f01",
  "game_id": "<game_codename>",
  "snapshot_at": "2026-04-21T09:25:00Z",
  "idip_snapshot": {
    "char_level": 56,
    "rank_tier": "diamond_3",
    "current_quest": "<quest_codename>"
  },
  "idip_delta": [
    {"field": "char_level", "from": 55, "to": 56, "at": "2026-04-21T09:23:11Z"}
  ],
  "idip_anomaly": [
    {
      "signal": "near_death_recovery",
      "at": "2026-04-21T09:24:45Z",
      "context": {"hp_pct_min": 0.05, "duration_low_hp_sec": 12}
    }
  ],
  "idip_milestone": [
    {"event": "level_up_to_56", "at": "2026-04-21T09:23:11Z"}
  ],
  "idip_field_metadata": {
    "char_level": {"type": "int", "semantic": "character level"},
    "rank_tier": {"type": "enum", "semantic": "competitive rank tier"}
  }
}
```

### 11.7 游戏数据 - 实时事件流

```json
{
  "data_source": "game_event",
  "player_id": "player_a1c93f01",
  "game_id": "<game_codename>",
  "session": {
    "session_id": "gs_2026042109",
    "started_at": "2026-04-21T09:00:00Z",
    "in_game_time": "in_game_day_3_evening"
  },
  "event_stream": [
    {"event": "match_open", "at": "2026-04-21T09:22:00Z"},
    {"event": "zone_enter:<arena_codename>", "at": "2026-04-21T09:22:30Z"},
    {"event": "boss_engaged", "at": "2026-04-21T09:23:45Z"},
    {"event": "boss_phase_2", "at": "2026-04-21T09:24:10Z"},
    {"event": "near_death", "at": "2026-04-21T09:24:33Z"},
    {"event": "near_death_recovered", "at": "2026-04-21T09:24:45Z"},
    {"event": "boss_phase_3", "at": "2026-04-21T09:25:30Z"},
    {"event": "boss_engaged_retry", "at": "2026-04-21T09:26:00Z"},
    {"event": "level_up", "at": "2026-04-21T09:23:11Z"},
    {"event": "settlement", "at": "2026-04-21T09:27:00Z"}
  ],
  "duration_signal": "over_30min"
}
```

### 11.8 游戏数据 - VLM 陪玩（P1 白名单 opt-in）

```json
{
  "data_source": "game_vlm",
  "player_id": "player_a1c93f01",
  "game_id": "<whitelisted_game_codename>",
  "snapshot_at": "2026-04-21T09:24:30Z",
  "whitelist_enabled": true,
  "frame_buffer_policy": {
    "max_seconds": 60,
    "persisted_image": false
  },
  "semantic_tags": ["boss_fight", "low_hp", "inventory_open"],
  "user_visible_summary": "你刚才在 BOSS 战中倒下，物品栏开着，可能在找补给品。",
  "ui_indicator_shown": true
}
```

### 11.9 实时切面 current_context（v2.2 新增 trigger 字段）

```json
{
  "data_source": "current_context",
  "player_id": "player_a1c93f01",
  "window_seconds": 300,
  "computed_at": "2026-04-21T09:25:00Z",
  "activity_topic": "在 BOSS 战中",
  "mood_estimate": "frustrated",
  "interrupt_suitability": "low",
  "attention_target": "game",
  "confidence": 0.78,
  "trigger": "interrupt_suitability_changed_from_medium_to_low"
}
```

v2.2 补充说明：
1. `trigger` 字段记录本次推送的触发条件，便于桌宠侧调试与 PM 评估"推送频次是否符合 §4.8.3"。
2. `trigger` 取值集合（开放枚举，可由 Engineering 扩展）：
   1. `heartbeat`（30s 心跳，无变化）
   2. `activity_topic_changed`
   3. `mood_estimate_changed`
   4. `interrupt_suitability_changed_from_<old>_to_<new>`
   5. `attention_target_changed`
3. 该字段**不引入新硬约束**，是衍生于 §4.8 既有推送策略的元数据。

### 11.10 系统音频派生信号（v2.3 新增）

```json
{
  "data_source": "audio_derived",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:35:00Z",
  "audio_a0_enabled": true,
  "ui_indicator_shown": true,
  "a0_signals": {
    "bpm_estimate": 128,
    "energy_curve_buckets_recent_30s": ["medium", "medium", "high", "high"],
    "beat_events_recent_5s": [
      "2026-04-21T09:34:55.250Z",
      "2026-04-21T09:34:55.700Z",
      "2026-04-21T09:34:56.150Z"
    ],
    "silence_signal": false,
    "silence_duration_sec": 0
  },
  "a1_now_playing": {
    "source": "mcp:qq_music_via_user_request",
    "title": "<曲名>",
    "artist": "<歌手>",
    "duration_sec": 215,
    "elapsed_sec": 87
  }
}
```

v2.3 补充说明：
1. `a0_signals` 是本地推理的派生标量，**不包含**原始音频流，**不可逆**还原为音频内容。
2. `a1_now_playing.source` 取值集合：`mcp:<source_id>`（首选）/ `os_now_playing_api`（兜底）。
3. `ui_indicator_shown` 必须为 `true` 才允许 A0 启用（合规检查项）。
4. 长期记忆只保留聚合标签（"用户常听快节奏音乐"），不保留逐次 `a0_signals`。

### 11.11 Playwright tool result（v2.3 新增）

```json
{
  "data_source": "playwright_tool_result",
  "player_id": "player_a1c93f01",
  "triggered_at": "2026-04-21T09:42:00Z",
  "triggered_by": "user_chat:'帮我看下我B站收藏最近更新了什么'",
  "source": "bilibili",
  "tool_call": {
    "query_type": "user_favorites_recent_updates",
    "fetched_at": "2026-04-21T09:42:03Z",
    "expires_at": "2026-04-21T09:47:03Z"
  },
  "result_snippet": "你收藏的 3 个 UP 主有新视频：<up_codename_1> 的<video_codename_1>、<up_codename_2> 的<video_codename_2>、<up_codename_3> 的<video_codename_3>。",
  "ui_indicator_shown": true,
  "credential_storage": "os_keychain",
  "persisted_html": false,
  "writes_to_long_term_profile": false
}
```

v2.3 补充说明：
1. `triggered_by` 必须能溯源到用户主动表达；后台触发 / 系统计划任务触发都不允许。
2. `result_snippet` 仅本次对话使用；不进入 `atomic_facts` / `episode` / `profile` 累积。
3. `credential_storage` 必须为 `os_keychain`；任何其他取值视为违规。
4. `persisted_html: false` 与 `writes_to_long_term_profile: false` 是合规检查项，硬约束。

### 11.12 OS 级 API 通道（v2.5 新增 6 类，对应 §4.4.6）

```json
{
  "data_source": "os_api",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:30:00Z",
  "channels": {
    "now_playing": {
      "_ref": "见 §11.10 audio_derived.a1_now_playing（v2.4 已锁，本通道复用）",
      "enabled": true
    },
    "user_activity": {
      "enabled": true,
      "source": "macos_handoff",
      "current_activity": {
        "app": "Notes",
        "activity_type": "editing_note",
        "note_title_redacted": "<note_codename_1>",
        "since": "2026-04-21T09:25:00Z"
      }
    },
    "recent_files": {
      "enabled": true,
      "items": [
        {"app": "VS Code", "file_name_redacted": "<code_file_1>", "modified_at": "2026-04-21T09:20:00Z"},
        {"app": "Pages", "file_name_redacted": "<doc_file_1>", "modified_at": "2026-04-21T09:05:00Z"},
        {"app": "Figma", "file_name_redacted": "<design_file_1>", "modified_at": "2026-04-20T22:30:00Z"}
      ],
      "_note": "仅文件名（已脱敏）+ 时间 + 所在 app，不读文件内容"
    },
    "notification_center": {
      "enabled": true,
      "unread_summary": [
        {"source_app": "wechat", "count": 5, "since": "2026-04-21T09:25:00Z"},
        {"source_app": "outlook", "count": 2, "since": "2026-04-21T09:10:00Z"}
      ],
      "_note": "仅 source + 数量 + 时间，不读通知正文"
    },
    "calendar": {
      "enabled": true,
      "source": "macos_eventkit",
      "next_event": {
        "title_redacted": "<event_codename>",
        "starts_at": "2026-04-21T09:45:00Z",
        "minutes_until_start": 15
      },
      "_note": "与 §11.5 mcp.calendar_next_event (feishu) 互补；这里走 OS 个人日历" 
    },
    "device_status": {
      "enabled": true,
      "battery_level_pct": 38,
      "is_charging": false,
      "display_brightness_level": "medium",
      "bluetooth_connected_count": 2,
      "network_environment": "wifi_home"
    }
  }
}
```

v2.5 补充说明：
1. 6 个通道各自独立 `enabled` 开关；用户在 Memory Center 单独启停。
2. 所有通道走 OS 公开 API，不依赖具体 app 的 MCP；与 §4.4.6 PM 立场对齐。
3. `recent_files` / `notification_center` / `calendar` 三个通道都**只读元数据**：文件名 / 通知来源 + 数量 / 日历标题，**不读内容正文**。
4. `device_status` 字段都是低敏：电池等级 / 充电状态 / 蓝牙连接计数 / 网络环境（如 wifi_home / wifi_office / cellular / 未知）；不带具体 SSID 名称（避免位置泄露）。
5. 字段名 `_ref` / `_note` 仅 mock 阅读用，正式 schema 不带。

### 11.13 浏览器扩展全方位（v2.5 扩展 §4.7.4 到 6 类，对应 §4.4.7）

```json
{
  "data_source": "browser_extension",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:35:00Z",
  "browser": "chrome",
  "extension_version": "<ext_codename>",
  "active_tab_category": "learning",
  "active_tab_signal": {
    "category": "learning",
    "platform": "bilibili_class",
    "tab_title_redacted": "在 B 站学习区看视频",
    "url_domain": "www.bilibili.com",
    "url_path_class_hint": "video_section_learning"
  },
  "recent_tab_categories_top3": [
    {"category": "work", "platform": "github", "duration_min": 15},
    {"category": "reading", "platform": "zhihu", "duration_min": 8},
    {"category": "learning", "platform": "bilibili_class", "duration_min": 5}
  ],
  "category_enabled_status": {
    "video": true,
    "shopping": true,
    "reading": true,
    "learning": true,
    "social_browsing": false,
    "work": true
  }
}
```

v2.5 补充说明：
1. 6 类 tab 识别（视频 / 购物 / 阅读 / 学习 / 社交浏览 / 工作）；每类独立开关 `category_enabled_status`。
2. 仅识别 tab 身份：`url_domain` + 路径中的类别标识（如 `video_section_learning`）+ 脱敏 tab title；**不读页面内容**。
3. 用户必须先在浏览器安装扩展 + Native Messaging 主路径；macOS AppleScript / Win UIA 兜底。
4. 国产浏览器（360 / QQ / 搜狗 / Edge 国内版 / UC）走 Beta 支持；与扩展兼容验证完成才上 Beta。
5. 这条 mock 与 §11.8 game_vlm 视频类（v2.4 §4.7.4）**独立**：扩展只识别 tab 身份；要在某 tab 启动 VLM 仍需用户对该视频 app 实例显式开 VLM 开关。

### 11.14 OS Scripting Bridge（v2.5 新增，对应 §4.12）

```json
{
  "data_source": "os_scripting_bridge",
  "player_id": "player_a1c93f01",
  "snapshot_at": "2026-04-21T09:40:00Z",
  "platform": "macos",
  "bridge_kind": "osascript_applescript",
  "user_authorized_apps": ["spotify", "apple_music", "vlc", "notes", "office_outlook"],
  "samples": [
    {
      "app": "spotify",
      "field": "osa_now_playing",
      "value": {
        "title": "<song_codename>",
        "artist": "<artist_codename>",
        "duration_sec": 215,
        "elapsed_sec": 88,
        "app_source": "spotify_desktop"
      },
      "fetched_at": "2026-04-21T09:39:50Z",
      "ttl_until": "2026-04-21T10:39:50Z"
    },
    {
      "app": "notes",
      "field": "osa_recent_documents",
      "value": [
        {"title_redacted": "<note_codename_1>", "modified_at": "2026-04-21T09:25:00Z"},
        {"title_redacted": "<note_codename_2>", "modified_at": "2026-04-21T08:40:00Z"}
      ],
      "fetched_at": "2026-04-21T09:39:55Z",
      "ttl_until": "2026-04-21T10:39:55Z"
    },
    {
      "app": "office_outlook",
      "field": "osa_unread_count",
      "value": {"unread_emails": 4, "unread_meetings_today": 2},
      "fetched_at": "2026-04-21T09:39:58Z",
      "ttl_until": "2026-04-21T10:39:58Z"
    },
    {
      "app": "vlc",
      "field": "osa_app_state",
      "value": {"running": true, "fg": false, "current_media_redacted": "<media_codename>", "has_unsaved_changes": false},
      "fetched_at": "2026-04-21T09:40:00Z",
      "ttl_until": "2026-04-21T10:40:00Z"
    }
  ],
  "ui_indicator_shown_per_app": {
    "spotify": "正在通过系统脚本接口读 Spotify 元数据",
    "notes": "正在通过系统脚本接口读 Notes 元数据"
  }
}
```

v2.5 补充说明：
1. `bridge_kind` 枚举：`osascript_applescript`（macOS）/ `powershell_com`（Windows）。
2. 每个 app 必须在 `user_authorized_apps` 列表内且用户在系统设置→隐私与安全性→自动化（macOS）/ 启用 COM（Windows）授权。
3. **仅读取**：所有 `field` 都是元数据查询（now_playing / recent_documents / unread_count / app_state / browser_current_tab），**不允许写入**（如 `tell spotify to play` 类调用禁止）。
4. **不读取**：消息正文 / 邮件正文 / 文档正文 / 任何文件内容。
5. 短期缓存 ≤ 1h（`ttl_until`）；长期记忆仅保留聚合摘要（"用户最近常用 Notes / Spotify"）。
6. `ui_indicator_shown_per_app` 是合规检查项：启用 OSA 桥接时桌宠 UI 必须显示对应可见提示。
7. 与 §11.5 MCP / §11.10 audio A1 / §11.12 OS API 互补；分工见 §4.12.5。

---

### 11.15 高光事件 highlight_event（v2.6 新增，对应 §4.13；A 类全字段）

```json
{
  "data_source": "highlight_event",
  "player_id": "player_a1c93f01",
  "highlight_id": "hl_2026042100001",
  "title": "首次单杀王者打野",
  "time": "2026-04-20T22:15:33Z",
  "scene": "王者荣耀 - 河道遭遇战",
  "event_summary": "在野区被对方打野针对 3 次后，第 4 次反蹲成功完成单杀；用户语音：\"终于把这个铠抓住了！\"",
  "category": "achievement",
  "tags": ["反蹲", "单杀", "首次"],
  "source": "idip_milestone",
  "privacy_level": "shareable",
  "pinned": true,
  "evidence_ids": [
    "game_event_2026042100872",
    "idip_milestone_2026042100015",
    "atomic_fact_2026042100123"
  ],
  "meta": {
    "confidence": 0.95,
    "source_category": "game_event",
    "first_seen_at": "2026-04-20T22:15:33Z",
    "last_confirmed_at": "2026-04-21T09:00:00Z",
    "user_corrected": false,
    "decay_score": 1.0
  }
}
```

v2.6 说明：
1. `highlight_id` 主键，全局唯一；多消费方（日记 / 画像 / 分享）以 id 引用同一条 highlight_event。
2. `title` / `event_summary` 由 memory 派生层 LLM 一次性合成；用户编辑后 `meta.user_corrected = true`，LLM 不再覆盖。
3. `category` 枚举：`achievement` / `growth` / `emotion` / `social` / `collection` / `relationship`（对应画像模块 8 分类）。
4. `source` 枚举：`idip_milestone` / `episode_highlight_score` / `user_starred` / `persona_result`。
5. `privacy_level`：`private` 不进入分享卡片生成；`shareable` 可走 §4.18 #5 高光分享卡片。
6. `evidence_ids[]` 指向底层 episode / game_event / idip_milestone / atomic_facts ID；分享 / 复盘时反查实证。
7. **不含字段**：`game`（桌宠绑定单游戏前提）/ `pet_observation`（B 类，§4.18 #3 消费侧每次按 IP 生成）。
8. `event_summary` 引用 atomic_facts 时必须使用 `quote_eligible = true` 子集（PII 检测）。

---

### 11.16 用户偏好 user_preferences（v2.6 新增，对应 §4.14；A 类全字段，5 子对象）

```json
{
  "data_source": "user_preferences",
  "player_id": "player_a1c93f01",
  "schema_version": "0.1.0",
  "last_updated_at": "2026-05-12T14:30:00Z",
  "companion_style": {
    "disturb_intensity": "low",
    "post_game_summary_freq": "streak",
    "streak_loss_strategy": "comfort_first",
    "streak_win_strategy": "celebrate",
    "idle_interact_freq": "mid",
    "activity_remind_freq": "low",
    "reflection_granularity": "brief"
  },
  "emotion_response": {
    "streak_loss_react": "gentle_encourage",
    "team_mate_impact_react": "validate_user_feel",
    "want_reflection_on_loss": false,
    "accept_jokes": true,
    "want_quiet_companion": false,
    "love_encouragement": true
  },
  "content_type": {
    "enabled": ["light_reflection", "emotion_companion", "achievement_celebrate", "diary"],
    "priority": ["emotion_companion", "achievement_celebrate", "light_reflection", "diary"],
    "feedback_signal": [
      {"type": "tactical_advice", "action": "dislike", "at": "2026-05-10T20:01:00Z"},
      {"type": "tactical_advice", "action": "dislike", "at": "2026-05-11T21:33:00Z"}
    ]
  },
  "diary_style": {
    "frequency": "event_driven",
    "length": "medium",
    "focus": "emotion",
    "perspective": "pet_third_person",
    "quote_user_original": true,
    "record_failure": false,
    "shareable_version": true
  },
  "privacy_grants": {
    "behavior_data": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null},
    "chat_content": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null},
    "diary": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null},
    "highlight": {"granted": true, "granted_at": "2026-04-01T10:00:00Z", "revoked_at": null},
    "persona_assessment": {"granted": false, "granted_at": null, "revoked_at": null},
    "cloud_sync": {"granted": false, "granted_at": null, "revoked_at": null}
  }
}
```

v2.6 说明：
1. **全 A 类用户输入**；除 `content_type.feedback_signal[]` 是系统自动写（用户对内容点赞 / 点踩反馈），其余字段全部用户主动设置。
2. **`privacy_grants.*` 默认全 false**；用户在 Memory Center 隐私页主动勾选才开启；撤回时 `revoked_at = now`，不删历史数据（单独删需走专门删除路径）。
3. `companion_style` / `emotion_response` / `diary_style` 任何字段 **LLM 严格禁止自动猜测 / 写入**（PM 红线，详见 §4.14.1 #2）。
4. `content_type.enabled` 是用户显式开关；`feedback_signal` 仅用于权重学习推荐 + 反馈反哺，**不直接覆盖 enabled**（PM 红线，详见 §4.14.2.3）。
5. `last_updated_at` 是 user_preferences 任一字段最后更新时间；用于 Memory Center 显示"上次更新于 X"。
6. **与 PRIVACY_BOUNDARY 关系**：user_preferences 是项目级硬约束内的**二级开关**，**不能放宽**硬约束（详见 §4.14.3）。

---

### 11.17 游戏人格测定 game_persona_assessment（v2.6 新增，对应 §4.16；P1 候选 — 待 4 条前置）

```json
{
  "data_source": "game_persona_assessment",
  "player_id": "player_a1c93f01",
  "assessment_id": "persona_2026051200001",
  "persona_label": "团战指挥型",
  "persona_schema_version": "honor_of_kings_persona_v2.3",
  "similarity_breakdown": [
    {
      "candidate": "团战指挥型",
      "score": 0.87,
      "evidence_ids": [
        "game_event_2026050800123",
        "idip_milestone_2026050900045",
        "game_event_2026051001288",
        "idip_milestone_2026051100210"
      ]
    },
    {
      "candidate": "野区入侵型",
      "score": 0.42,
      "evidence_ids": ["game_event_2026050900076"]
    },
    {
      "candidate": "保守发育型",
      "score": 0.18,
      "evidence_ids": []
    }
  ],
  "assessment_at": "2026-05-12T15:00:00Z",
  "data_window": {
    "from": "2026-04-12T00:00:00Z",
    "to": "2026-05-12T00:00:00Z",
    "session_count": 62
  },
  "user_feedback": null,
  "evidence_strength": 4,
  "is_expired": false,
  "meta": {
    "confidence": 0.87,
    "source_category": "game_event",
    "first_seen_at": "2026-05-12T15:00:00Z",
    "last_confirmed_at": "2026-05-12T15:00:00Z",
    "user_corrected": false,
    "decay_score": 1.0
  }
}
```

v2.6 说明：
1. **不含 `game_id` 字段**（桌宠绑定单游戏前提，§4.7 / §4.9 已锁定）。
2. `persona_label` / `similarity_breakdown[]` 由**公司既有外部人格测定平台**计算后写回 memory；memory 是结果存储方，不是计算方。
3. `evidence_ids[]` 指向 memory 内的 game_event / idip_milestone / atomic_facts ID；**`evidence_strength ≥ 3` 是 PM 红线**（详见 §4.16.1 #4），不达标不展示结果。
4. `persona_schema_version` 用于 meta 漂移检测；当公司平台升级分类体系时旧结果 `is_expired = true`，Memory Center UI 提示用户重测。
5. `user_feedback` 枚举：`accepted` / `rejected` / `not_like_me` / null（未反馈）；反哺下次测定时降低对应人格权重。
6. **PM 红线**：persona 不作为陪伴策略的直接驱动信号；不反向污染采集层；仅供画像页展示 / 分享 / 解释。

---

### 11.18 关系成长派生视图 relationship_stats（v2.6 新增，对应 §4.17；A 类派生视图）

```json
{
  "data_source": "relationship_stats",
  "player_id": "player_a1c93f01",
  "computed_at": "2026-05-12T16:00:00Z",
  "companion_days": 41,
  "co_game_session_count": 62,
  "diary_count": 18,
  "highlight_count": 7,
  "persona_assessment_count": 1,
  "relationship_level": 12,
  "milestone_unlocked": [
    "first_install",
    "companion_7d",
    "first_highlight",
    "companion_30d",
    "first_persona_assessment"
  ],
  "milestone_pending": [
    "companion_100d",
    "highlight_count_10",
    "diary_count_30"
  ]
}
```

v2.6 说明：
1. **派生视图，不持久化原子存储**；memory 提供 query API，每次实时算（或缓存）。
2. `companion_days` = `first_install_at` → `now`（按日历日计算）。
3. `diary_count` 派生 = count(episode WHERE highlight_score ≥ diary_threshold)（与 §4.18 #1 日记生成器口径一致）。
4. `highlight_count` 排除 deleted_at NOT NULL 的软删除条目。
5. `relationship_level` 计算公式由 Engineering 决，建议**指数衰减**（首 30 天涨快，后续递减）；PM 不锁数字。
6. `milestone_unlocked[]` / `milestone_pending[]` 用于 Memory Center 纪念卡片展示；**纯纪念，非任务压力**（沿用 §4.17.1 #2 PM 边界）。
7. `computed_at` 是本次派生计算时间戳；缓存策略由 Engineering 决（建议每日 0:00 全量 + 关键事件后增量）。

---

## 12. 已有硬约束逐条说明（v2 新增，回应用户疑问）

> 来源：`projects/desktop-pet/01-pm/PRIVACY_BOUNDARY_memory-system.md` §2。

| 编号 | 硬约束 | 通俗解释 | 为什么是硬约束 |
|---|---|---|---|
| 1 | 不默认 Recall 式后台全屏截图 | "Recall" 是 Microsoft 在 Windows 11 上推出的 AI 回忆功能，**每隔几秒自动截图整个屏幕** → 通过 OCR + 嵌入构建可搜索的"个人电脑历史"。发布后引发严重隐私争议，被英国 ICO、安全研究员、媒体连续质疑，最终被推迟、改为默认关闭 + 加密 + 本地存储。 → **本项目不做这种"全桌面持续截图"形态**。注意：§4.7 VLM 陪玩**不是** Recall 形态，因为 VLM 仅在用户白名单的游戏窗口里采、不持久化原图、不构建全桌面历史。 | 这种形态采到一切：聊天、文档、密码、公司资料、银行账号。一次泄漏 = 用户完全裸奔。品牌信任不可恢复。 |
| 2 | 不默认系统音频监听 | 不持续监听麦克风 / 系统输出音频 / 语音聊天 / 游戏语音。 | 可能采到会议、家庭对话、第三方语音聊天 — 全部为他人内容，远超用户授权范围。 |
| 3 | 不记录键盘输入内容 | 不采字符级原始按键流（即使 hash、即使加密、即使本地）。本分支 §10 进一步细化为 L2 / L3 全部不允许。 | 等同 keylog，杀软会标黑，应用商店会下架，监管会处罚。 |
| 4 | 不长期存跨 app 全文 UI | 不**默认**读取 / **长期保存**第三方 app（IDE / 文档 / 浏览器 / 终端 / 聊天软件）的完整 UI 文本。短期 buffer + 白名单 opt-in 可，长期写入不可。 | 与 #1 类似 — 跨 app 全文等于"知道用户在做的一切"，超过桌宠职责。 |
| 5 | 不上传 raw OS context | active app、window title、UI text、截图、音频等原始桌面上下文**默认不上云**；如需上传必须先脱敏为状态级摘要并经用户确认。 | 云端泄漏面远大于本地；上传 = 把用户电脑历史交给云服务商。 |
| 6 | 不写敏感业务信息 | 文档与 mock 不写公司机密、真实玩家数据、未脱敏日志、内部代号、合作方信息、IP 授权细节。 | APB 项目级 Safety Rule，所有线程都要遵守。 |
| 7 | 不使用 Recall 作为数据源 | 即使用户电脑上有 Windows Recall 数据，桌宠**不读取它**；只能在生态参考层面研究 Recall 的 API / 法务结构。 | 把别人的越界产品当自己的数据源 = 把责任也接过来。 |

PM 备注（v2）：
1. 硬约束 #1 / #3 / #4 是本项目"是否会被媒体或杀软放大成事件"的三大风险点；任何放宽都必须先在 `decisions/DECISION_LOG.md` 走项目级决策。
2. §4.7 VLM 把"白名单 + 短期 buffer + 不持久化"作为与 #1 共存的妥协结构；如果未来想做"任意游戏自动识别"则相当于回到 #1，不允许。
3. §10 L1 快捷键是**与 #3 共存的最远边界**；任何更进一步（含 hash、含时间序列）都回到 #3。

---

## 13. 建议下一步（v2.5）

1. **Radar 调研状态（v2.4 更新）**：✅ **两批共 7 项调研全部完成**：
   1. 第一批（2026-05-11T17-52-51 通告，3 项）：行为信号库 / 中国 app MCP / 跨数据源 mock。
   2. 第二批（2026-05-12T09-43-10 通告，4 项）：音频派生库 / Now Playing API / 本地 VLM / 浏览器 tab 检测。
   3. 两批 PM 答复共 14 个问题已全部收口（详见 §0.2 + §0.5 与对应 PM ack 群消息）。
2. **Main Thread 收口候选**（v2.4 新增 Q-F1 / Q-G1 两条 P0 决策）：
   1. **Q-F1 VLM 三档混合架构**（CNN 初筛 + 2-4B VLM 兜底 + 云端最终兜底；本地推理可用率从 70% 升 85%）— 涉及 AI 必要性立场与成本上限，强烈建议升 DECISION_LOG。
   2. **Q-G1 双轨分发立场**（MAS 版砍 macOS A1 MediaRemote / Developer ID 版完整功能）— 涉及项目级分发战略，强烈建议升 DECISION_LOG。
   3. **MiniCPM-V 4.5 商用条款法务核验**（Q-F2 前置条件）— 涉及 License 风险，建议升项目级。
   4. **aubio GPL-3.0 IPC 隔离要求**（Q-D2 前置条件）— 涉及 License 风险，建议升项目级。
3. **历史 v2.2 沿用：Radar 第一批 3 项调研结论**（保留作历史，详见 §0.2）。

## 13.2 PM 已完成的纵向深化

1. `AI_FEATURE_EVALUATION_memory-dataset.md` v3 已落盘：v1 18 个 AI 候选点 → v2 13 个候选含 audio + Playwright → **v3 §3.6 VLM 重写为三档混合**。
2. 关键 PM 立场：profile 抽取强制本地 + 用户确认回路、VLM **三档混合架构**（CNN + 2-4B VLM + 云端兜底）、emotion_signal 规则起步不上分类器、interrupt_suitability 纯规则不让 LLM 决策、不进 MVP 五类（Agent / Fine-tuning / 推荐系统 / 跨实例迁移 / 行为预测）。
3. 月成本上限 ≤¥3 / 用户。

## 13.3 Engineering 接手（核心下一步，v2.5 大幅扩展）

1. 基于行为信号库报告的"P0 配方 + P1 配方"做 Context Capture Adapter 设计起点（macOS：NSWorkspace + IOHIDIdleTime + CGEventTap listenOnly；Windows：SetWinEventHook + GetLastInputInfo + Raw Input；**严禁** `SetWindowsHookEx(WH_KEYBOARD_LL)` / Windows Recall）。
2. **v2.5 新增 §4.3.3 / §4.3.4 / §4.3.4.1 字段实现**：A1 派生（mouse_region_heatmap / mouse_event_type_burst / input_device_switch / multi_display_activity / scroll_intensity）+ A2 操作语义事件（save / copy_paste / undo_redo / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install / window_arrangement）+ A3 编辑动作派生（text_edit_action_burst / undo_redo_rate / ime_state / editing_session_duration / text_edit_burst_frequency）；macOS 用 NSEvent global monitor + Accessibility events；Windows 用 EVENT_SYSTEM_* + EVENT_OBJECT_*。
3. 基于 MCP 报告 §9 推荐的统一 schema `{source, value, started_at, expires_at}` 设计 MCP connector 抽象。
4. **v2.5 新增 §4.4.6 OS API 6 通道**：UserActivity（macOS Handoff / Win Activity Feed）/ Recent Files（NSMetadataQuery / Win Recent Items）/ Notification Center / Calendar (EventKit / Outlook) / 设备状态环境 — 每通道用户独立开关，仅元数据。
5. **v2.5 新增 §4.4.7 浏览器扩展全方位**：v2.4 §4.7.4 视频类扩展到 6 类（视频 / 购物 / 阅读 / 学习 / 社交浏览 / 工作）；同一扩展通道，按 tab 类别开关。
6. **v2.5 新增 §4.12 OS Scripting Bridge**：macOS osascript / AppleScript + Windows PowerShell COM；接入 Spotify / Apple Music / VLC / IINA / Notes / Bear / Things / Office / Outlook / Reminders 等；**仅读取，不修改**；用户在系统设置授权 + Memory Center 单 app 开关。
7. **v2.5 新增 §4.4.8 CLI 工具调用**：Spotify CLI / VS Code CLI / 公开 skill / 系统只读 CLI；不调用修改状态类 CLI；P1 子集，P2 探索。
8. **v2.5 新增 §4.4.9 IFTTT / Zapier webhook 桥接**：P2 探索；用户自配 webhook + 签名验证 + 仅接受元数据 payload。
9. **基于 audio 库报告做 Context Capture Adapter v2**：macOS 14.2+ Tap / < 14.2 BlackHole / Win WASAPI loopback；aubio 必须 **IPC 子进程隔离**（GPL-3.0 传染风险）；同时准备 BeatNet + cpal 自实现 RMS 作为长期商业化路线。
10. **基于 VLM 报告做 VLM 混合架构**：CNN 初筛（建议 MobileNet / EfficientNet 起步）+ MiniCPM-V 4.5 (int4) 主选 + Qwen2.5-VL-7B (Apache 2.0) 备选；onboarding 30s benchmark + 三选一兜底。**v2.5 VLM 视频类保留 v2.4 §4.7.4 不变**（用户决定保留剧情同步反应愿景）。
11. **基于 Tab 检测报告做 Tab Detection Adapter**：扩展 + Native Messaging 主路径 + AX / UIA 兜底三 provider 架构；国产浏览器 beta 第一周验证；**v2.5 同一扩展通道还要支持购物 / 阅读 / 学习 / 社交浏览 / 工作 5 类 tab 识别**。
12. **基于 Now Playing API 报告做 A1 SourceAppUserModelId 白名单**：SMTC 仅采白名单（QQ 音乐 / 网易云 / Apple Music / Spotify / Bilibili / foobar2000 等）。
13. **beta 阶段埋点验证**：腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC SMTC 上报；QQ 音乐 / 网易云 macOS 国服 MPNowPlayingInfoCenter 上报；Steam 中国地区 GPU 分布；**v2.5 新增**：OS Scripting Bridge 在 macOS / Win 上对各 app 的实际可用性 + 授权流程友好度。
14. 回写遗留 OQ #8：查询接口 SLA 起点建议（实时 P99 ≤200ms、批量 ≤2s）。

## 13.4 Design 跟进

Memory Center / 桌宠设置面板需求点：
1. 来源解释 + 置信度展示 + VLM 状态指示。
2. VLM 该 app 实例整体开关（游戏 + 视频白名单）。
3. MCP 自选启停面板（首批 dida / feishu / steam）。
4. 键盘 L1 快捷键查看 / 关闭。
5. audio A0 节拍监听开关 + UI 状态指示。
6. Onboarding VLM 硬件检测 + 三选一选择（"①仅文本对话 / ②本地轻量识别 / ③启用云端兜底（需授权）"）。
7. 浏览器扩展安装引导（首启时引导用户为 Chrome / Edge / Safari 等安装扩展）。
8. **v2.5 新增 — 键盘 L1.5 编辑动作监听开关**（与 L1 独立）。
9. **v2.5 新增 — L1 操作语义事件类别管理**（save / copy_paste / fullscreen_toggle / lock_unlock / new_window / new_tab / app_install / window_arrangement 9 类，每类独立开关）。
10. **v2.5 新增 — OS API 6 通道管理面板**：Now Playing / UserActivity / Recent Files / Notification Center / Calendar / 设备状态环境，每通道独立开关 + 状态指示。
11. **v2.5 新增 — 浏览器扩展按类别管理**：视频 / 购物 / 阅读 / 学习 / 社交浏览 / 工作 6 类，按类别 + 按 app 双层开关。
12. **v2.5 新增 — OS Scripting Bridge 单 app 授权面板**：Spotify / Apple Music / VLC / IINA / Notes / Bear / Things / Office / Outlook / Reminders 等，单 app 开关 + 桌宠 UI "正在通过系统脚本接口读 X app 元数据" 可见指示。
13. **v2.5 新增 — 一键全局暂停**：暂停所有非 first-party game event 的采集（VLM / Playwright / OSA / OS API / 浏览器扩展），与现有 VLM 暂停同款。

## 13.5 Main Thread 收口（建议安排顺序）

1. 按 Radar §8 更新 `06-sync/TASK_BOARD.md` / `06-sync/SYNC_SUMMARY.md` / `06-sync/THREAD_REGISTRY.md`。
2. **PRIVACY_BOUNDARY 修订提案审议**（v2.3 新增高优先级；v2.5.1 修订：纳入 v2.5 五项）：
   1. 文件：[`PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md`](PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md)。
   2. 涉及项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md` §2 #1 #2 #4 #5 修订 + §3.1 P0 Whitelist 新增 + VLM 白名单类别扩展 + #8 Playwright 受限放行 + v2.5 五项（OS API / 浏览器全方位 / OS Scripting Bridge / CLI / IFTTT）边界澄清。
   3. **当前状态：Deferred**（2026-05-12 Main Thread 收口，等 voice-interaction 启动后合并审议；详见提案 §5 状态语义对照表）。
   4. **Accepted 路径**：Main Thread 直接修改项目级文件并在 `decisions/DECISION_LOG.md` 留痕。
   5. **Rejected 路径**：PM 同步收回**当前版本**中相关章节（**不锁版本号**）：
      - v2.3 三项：§4.7 视频扩展 / §4.10 音频 / §4.11 Playwright；
      - v2.5 五项：§4.4.6 OS API / §4.4.7 浏览器扩展全方位 / **§4.4.8 CLI 工具调用** / **§4.4.9 IFTTT / Zapier webhook 桥接** / §4.12 OS Scripting Bridge；
      - 附加：§4.3 行为档 A 扩展（A1/A2/A3）+ §10 键盘 L1.5 + §4.3.5 4 条排除项；
      - 与 PRIVACY_BOUNDARY 提案 §5 Rejected 段保持一致。
   6. **Deferred 路径**（当前）：不撤回任何章节，PM 分支级立场保持，Engineering / Design 按分支立场实现。
3. 视情况在 `decisions/DECISION_LOG.md` 留痕本批 PM 立场升项目级决策。

### 13.5.1 项目级决策候选清单（v2.5 更新，15 条）

1. 字符级键盘流任何形式都不允许（L2/L3 硬约束）。
2. VLM P1 单 app 实例开关；类别含游戏 + 视频；不跨实例聚合。
3. MCP 默认关 + 用户自选；MVP 首批锁 3 个（dida / feishu / steam），P1 后半段 office / dingtalk，**不接入清单**含番茄类与腾讯视频等。
4. 多游戏 / 多视频 app 之间 profile 不共享。
5. current_context 5min 滑窗 + 变化触发 + 30s 心跳。
6. 键盘分级研发自由度边界（§10.1）；**v2.5 扩展到 L1.5 编辑动作派生层**。
7. 音频信号 A0-A3 分级（§10.3）；A2 / A3 任何形式不允许；**A0 首拍稳定时间 5s warmup**。
8. Playwright 受限放行 7 条边界（§4.11.3）；P2 仅用户主动触发。
9. PM 字段命名 review 边界（§10.2）— PM 不逐字段过拼写，但守 4 类隐私边界。
10. VLM 三档混合架构（CNN 初筛 + 2-4B VLM 兜底 + 云端最终兜底）；本地推理可用率目标 ≥85%。
11. 双轨分发立场：MAS 版砍 macOS A1 MediaRemote / Developer ID 版完整功能。
12. **v2.5 新增**：MCP 不再是唯一通道；6 通道并存（MCP / OS API / 浏览器扩展全方位 / OS Scripting Bridge / CLI / IFTTT），每通道独立开关 + 默认关闭 + Memory Center 可见。
13. **v2.5 新增**：行为数据采集扩展为档 A 完整集合（A1 派生 + A2 操作语义 + A3 编辑动作派生）；§10 键盘分级扩展到 L1.5；v2.5 §4.3.5 新增 4 条排除项（鼠标坐标流 / 像素 heatmap / 拖选选中内容 / 屏幕坐标完整时序）。
14. **v2.5 新增**：OS Scripting Bridge（osascript / PowerShell COM）作为接入桌面客户端 app 元数据的合规通道；仅读不写；用户系统授权 + Memory Center 单 app 开关。
15. **v2.5 新增**：浏览器扩展通用化到 6 类 tab 识别（视频 / 购物 / 阅读 / 学习 / 社交浏览 / 工作）；用户按类别 + 按 app 双层开关。

### 13.5.2 法务 / 合规需先解决的项（v2.4 新增）

1. **MiniCPM-V 4.5 商用条款核验**（Q-F2 前置）— 不过则 MVP 主线切 Qwen2.5-VL-7B (Apache 2.0)。
2. **aubio GPL-3.0 传染风险**（Q-D2 前置）— 必须 IPC 子进程隔离；长期商业 release 切 BeatNet (CC-BY-4.0) + cpal 自实现。
3. **MAS 私有 framework 风险**（Q-G1 前置）— MAS 版需禁用 macOS MediaRemote 私有 framework，仅保留 SMTC 等价物（macOS 无标准等价 → MAS 版 A1 只剩 MCP 路径）。

4. **用户已指示本轮不升项目级**；以上候选清单待用户授权 Main Thread 处理。
5. **遗留 OQ #8**：见 §13.3 above（Engineering 接手）。

---

## 14. 不在本文件范围

1. 记忆系统 SDK API 形态、字段名最终命名规范、版本演进。
2. Memory Center 的页面布局 / 视觉 / 组件方案。
3. 模型选型、向量数据库选型、缓存策略。
4. 真实玩家数据接入、真实游戏的 idip 字段表。
5. 商业化与合规法务条款。
