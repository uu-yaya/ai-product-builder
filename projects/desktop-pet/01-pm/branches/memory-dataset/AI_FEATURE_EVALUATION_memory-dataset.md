# AI Feature Evaluation: Memory Dataset (桌宠对记忆系统数据消费的 AI 能力评估)

> Project: `desktop-pet`
> Branch: `memory-dataset`
> Thread: PM Strategy Thread
> Date: 2026-05-11
> Status: Draft v3（建立在 `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5 之上 — 2026-05-12 后续更新：v2.5 在主文档扩展了档 A 行为信号 / OS API 6 通道 / 浏览器扩展全方位 6 类 / OS Scripting Bridge / CLI / IFTTT 等通道，但**AI 必要性立场不变** — 新通道全部是规则 / 元数据级，不引入新 AI 候选点；VLM 三档混合架构 / 模型选型 / audio warmup 均保持 v3 状态。如新通道未来引入新 AI 评估需要，再升 v4）
> Scope: 仅 PM 视角的"用不用 AI / 用哪种 AI / 在哪里跑 / 错了怎么办"立场声明。**不包含**模型选型最终结果、模型权重、Prompt 工程、Function Calling schema、训练数据、SDK API。
>
> Branch Scope（v2.3.1，2026-05-11 19:00）：本文件只覆盖 memory-dataset 范围内的 AI 能力评估。**不包含**：TTS / STT / 麦克风 / 语音情绪韵律 / 声纹 / 音色克隆 / 双向语音对话 — 这些归 `voice-interaction` 分支（待启动），届时由该分支独立做 AI Feature Evaluation。本文件 §3.10 audio A0 是**系统音频流派生**（听音乐场景），不是麦克风也不是语音识别。

---

## 0. v3 修订摘要（2026-05-12 — Radar 第二批 4 项调研后 PM 收口）

1. **§3.6 VLM 重写为三档混合架构**（接受 Radar Q-F1）：CNN 初筛 + 量化 7-8B VLM 兜底 + 云端最终兜底（用户显式同意）；本地推理可用率目标从 70% 升 **≥85%**。仅押注 7B VLM 的可用率只有 35-45%，不达标。
2. **§3.6.6 评估指标重写**：本地可用率 / 准确率 / 隐私穿透率 / 模型选型门槛全部按 Radar 数据校准。
3. **§3.6 模型选型锁定**（接受 Radar Q-F2）：MVP 首选 **MiniCPM-V 4.5 (int4)**（视频帧 96x 压缩契合 60s buffer，中文强）；MVP 备选 **Qwen2.5-VL-7B (Apache 2.0)**（License 最稳，3B 禁商用）；MiniCPM-V 4.5 商用条款**法务过完才锁定**。
4. **§3.10 audio 加 warmup 指标**（接受 Radar Q-D1）：首拍稳定时间 5s；warmup 内桌宠不根据 BPM 反应。
5. **§3.10 audio 库选型**（接受 Radar Q-D2，加 IPC 隔离要求）：aubio (GPL-3.0) 原型 + **IPC 子进程隔离**；商业 release 切 BeatNet (CC-BY-4.0) + cpal 自实现。
6. **§2 总览矩阵更新**：VLM 行从单一本地推理改为"混合架构"。
7. **§9 MVP 范围扩展**：新增 CNN 初筛、云端 VLM 兜底（受限）、onboarding 硬件检测。

## 1. 一句话结论

1. 本分支涉及 **15 个 AI 候选点**（v3 新增 CNN 初筛 + 云端 VLM 兜底）。
2. PM 立场：**3 个必须用 AI（atomic_facts / episode / VLM 混合架构）、6 个 AI 辅助（profile / current_context / emotion / MCP 摘要 / Playwright snippet / CNN 初筛）、5 个不应用 AI 用规则（idip delta / game_event 去重 / decay / interrupt_suitability / audio A0 BPM 检测）、1 个云端受限（云端 VLM 兜底，用户显式同意）**。
3. **部署立场**：VLM 三档混合（本地为主 + 云端可选兜底）；audio A0 强制本地（绝不上传音频流）；Playwright 仅本地用户触发；profile **强制本地**；不允许任何 AI 任务把原始 raw 数据用于训练。
4. **MVP 阶段 AI 范围**（v3 扩展）：atomic_facts + episode + profile + emotion_signal + current_context + **VLM 混合架构**（CNN + 量化 7-8B VLM + 可选云端）+ MCP 摘要 + audio A0 派生（5s warmup）+ Playwright snippet；**不进 MVP**：Agent / Fine-tuning / 推荐系统 / 跨实例迁移 / 用户行为预测 / 音频内容识别 / 麦克风 / Playwright 后台轮询 / **仅 7B VLM 单押**。

---

## 2. AI 能力总览矩阵（升级版 §7）

| 编号 | AI 能力 | 是否需 AI | 推荐方案 | 延迟敏感 | 成本敏感 | 隐私敏感 | MVP 入选 | 失败兜底 |
|---|---|---|---|---|---|---|---|---|
| 2.1 | atomic_facts 抽取 | **必要** | LLM Prompt（结构化输出） | 中（~5s 可接受） | 中 | 高 | ✅ P0 | 规则抽取（关键词 + 模板） |
| 2.2 | episode 摘要 | **必要** | LLM Prompt（长上下文摘要） | 低（异步批处理） | 中 | 高 | ✅ P0 | 滑窗 + 关键词聚类（粗糙但可用） |
| 2.3 | profile 抽取 | 辅助 | LLM Prompt + **用户确认回路** | 低（异步） | 中 | 高 | ✅ P0 | 仅用户主动写入（user_confirmed-only profile） |
| 2.4 | emotion_signal | 辅助 | **规则 + 关键词起步**；后续轻量分类器 | 中（~1s） | 低 | 中 | ✅ P0 | 不输出情绪标签（neutral 默认） |
| 2.5 | current_context.activity_topic | 辅助 | 规则 + 短 LLM 兜底 | **高**（≤1s） | 中 | 中 | ✅ P0 | active_app + window_title 直推 |
| 2.6 | current_context.mood_estimate | 辅助 | 用 2.4 输出聚合 | 中 | 低 | 中 | ✅ P0 | neutral 默认 |
| 2.7 | current_context.interrupt_suitability | **不需要** | 纯规则（is_fullscreen + idle + game_event） | **高**（≤200ms） | 0 | 低 | ✅ P0 | 默认 medium |
| 2.8 | current_context.attention_target | **不需要** | 纯规则（active_app 映射） | **高**（≤200ms） | 0 | 低 | ✅ P0 | 默认 unknown |
| 2.9 | idip delta / anomaly / milestone | **不需要** | 纯规则（数值对比 + 阈值） | 中 | 0 | 中 | ✅ P0 | N/A |
| 2.10 | game_event 去重 / 整理 | **不需要** | 纯规则（时序 + dedupe key） | 中 | 0 | 中 | ✅ P0 | N/A |
| 2.11 | VLM 单 app 实例（游戏 + 视频，v3 重写为三档混合） | **必要** | **CNN 初筛 + 量化 7-8B VLM 兜底 + 可选云端最终兜底** | 中（~2s VLM；~50ms CNN） | **高**（VLM）/ **低**（CNN） | **极高** | ✅ P1 | 三档逐级降级；最终回退 `unknown`，不强行猜 |
| 2.12 | MCP tool 结果摘要 | 辅助 | 模板（80%）+ 短 LLM（20%） | 高（≤500ms） | 低 | 中 | ✅ P1 | 直接展示 raw 字段 |
| 2.19 | **audio A0 BPM / 能量 / 节拍**（v2.3 新增） | **不需要 AI**（信号处理） | 本地 BPM 检测库（如 aubio / librosa 类） | **高**（≤200ms） | 低 | **高** | ✅ P1 | 不输出节拍 → 桌宠不舞动 |
| 2.20 | **Playwright snippet 总结**（v2.3 新增） | 辅助 | 短 LLM 摘要 raw 抓取结果 | 中（≤2s） | 低 | 中 | ✅ P2 | 直接展示 raw 字段 |
| 2.13 | confidence 计算 | 部分 AI | 规则 × LLM self-rate × decay（取保守） | 低（与 2.1/2.3 同步） | 低 | 低 | ✅ P0 | 退化为规则单源 |
| 2.14 | decay_score | **不需要** | 纯规则（时间 + 上次确认） | 低 | 0 | 低 | ✅ P0 | N/A |
| 2.15 | Memory 检索 / 召回 | 部分 AI | 结构化查询 P0；RAG P1 评估 | 高（≤300ms） | 低 | 中 | P0 结构化 / P1 RAG | 关键词回退 |
| 2.16 | Agent 自主规划 | **不需要** | — | — | — | — | ❌ 不进 MVP | 无 |
| 2.17 | Fine-tuning（角色风格 / 抽取专模） | **不需要** | — | — | — | — | ❌ 不进 MVP | 无 |
| 2.18 | 推荐系统（互动时机 / 提醒） | **不需要** | — | — | — | — | ❌ 不进 MVP（P2 评估） | 无 |

---

## 3. 逐能力深度评估

### 3.1 atomic_facts 抽取

#### 3.1.1 是什么

1. 从用户与桌宠的对话、游戏事件描述、行为信号事件中**抽取原子级、带时间戳的事实陈述**。
2. 输出：`[{fact, at, source, confidence_rule}, ...]`（详见 §11.1 mock）。

#### 3.1.2 是否需要 AI

1. **需要**。规则可以做关键词 + 模板匹配，但对自然语言上下文（"我刚说过 ..."、"你昨天提的那个 ..."）的歧义消解能力弱。
2. 但**不能完全依赖 LLM**：LLM 抽取会出现"幻觉事实"（生造用户没说的话），所以必须配规则校验。

#### 3.1.3 推荐方案

1. **LLM Prompt + 结构化输出**（JSON schema 强约束）。
2. 输入最小化：仅当前对话窗口 + 必要的 anchor 信息（user_id / session_id / timestamp），**不**喂全量历史 / profile / 跨 session 数据。
3. 输出后必须经过**规则校验层**：
   1. fact 是否在原文中出现过（最长公共子串 ≥ 50%）？
   2. timestamp 是否在原对话 time_range 内？
   3. source 字段是否在 `_pm_note_source_enum` 7 个枚举内？
4. 不通过校验的 fact 标 `confidence_rule ≤ 0.3` 并不进入长期记忆。

#### 3.1.4 模型与部署

1. **本地优先**：抽取涉及聊天原文，敏感度高。建议本地 7B 级 LLM（如开源中文优化模型，2026 年本地推理性能足以支撑）。
2. **云端备选**：若本地推理质量不足，**仅在用户授权云端处理对话**的前提下，发送脱敏后的对话（player_id 替换为 mock id、时间戳保留、内容保留）。
3. **绝对不**：把对话用于模型训练 / 微调；任何云端请求必须声明 `do_not_train: true`。

#### 3.1.5 延迟 / 成本

1. 延迟：**异步路径**，5s 内出结果即可；用户感知由桌宠对话层缓存上一轮 atomic_facts 兜底。
2. 成本：每次对话 ~1-3 atomic_facts；按 7B 本地推理估算 < $0.001 / segment；云端备选 < $0.01 / segment（保守）。

#### 3.1.6 评估指标

1. **抽取召回率**：人工抽取 100 段对话标注，LLM 抽取 ≥80% 一致即合格。
2. **幻觉率**：规则校验拦截后的幻觉 ≤2%（每 100 个 fact 不超过 2 个生造）。
3. **延迟 p95**：本地 ≤5s / 云端 ≤2s。

#### 3.1.7 失败处理

1. LLM 调用失败（超时 / 模型不可用）：**降级到规则抽取**（关键词 + 模板），confidence_rule 标 0.3；用户在 Memory Center 看到"低置信"标记。
2. 规则也失败：不产生 atomic_facts；用户体验等同于"桌宠没记下这段对话"，但**不报错给用户**（避免破坏体验）。
3. 桌宠对话层使用上一轮 atomic_facts 兜底。

### 3.2 episode 摘要

#### 3.2.1 是什么

1. 把若干相关 atomic_facts + 原始消息聚合成一个**情节**（`title / content / participants / time_range`）。
2. 是"昨天聊到的那件事"在桌宠召回时的语义单元。

#### 3.2.2 是否需要 AI

1. **需要**。摘要本身需要语言生成能力，规则可以聚合但无法生成 `content`。
2. `title` 可以用规则（前几条 atomic_facts 拼接）粗糙生成，但质量差。

#### 3.2.3 推荐方案

1. LLM Prompt（长上下文摘要）。
2. 输入：该 segment 的所有 atomic_facts + 原始消息（最长 ~2k tokens）。
3. 输出：`{title (≤30 字), content (≤200 字), participants, time_range}`。
4. **强约束**：content 不能包含 atomic_facts 中**未出现**的事实（防止编造）。

#### 3.2.4 模型与部署

1. 同 §3.1.4：本地优先 + 云端备选 + `do_not_train: true`。

#### 3.2.5 延迟 / 成本

1. 延迟：**异步批处理**（每 5min 滑窗触发一次或 segment 切换触发），单次 ~3-10s 都可接受。
2. 成本：每段 segment 一次摘要；按 7B 本地推理估算 < $0.005 / segment。

#### 3.2.6 评估指标

1. **摘要忠实度**：content 中的每条事实必须能映射回 atomic_facts；偏差 ≤5%。
2. **摘要完整度**：人工抽样标注 vs LLM 摘要，关键事实覆盖率 ≥85%。

#### 3.2.7 失败处理

1. 退化为"atomic_facts 列表 + 时间范围"形态显示给用户；title 由"该时段主要话题"占位。
2. 桌宠召回时直接用 atomic_facts 列表，不用 episode。

### 3.3 profile 抽取

#### 3.3.1 是什么

1. 从多个 episode 中聚合出**长期画像**：`interests / preferences / behavior_patterns / personality_traits / key_facts`，每条带 `profile_meta`（详见 §11.2）。
2. 是"知心好友"维度的核心数据载体。

#### 3.3.2 是否需要 AI

1. 辅助。规则可以从 atomic_facts 词频统计出"用户提到过哪些 X"，但无法判断"X 是兴趣还是吐槽"。
2. **但不能让 LLM 单边写 profile** — profile 是桌宠 "假记忆" 的最高风险源。

#### 3.3.3 推荐方案

1. **LLM Prompt + 用户确认回路**：
   1. LLM 从 episode 累积提议 profile 条目，**所有新条目 confidence_llm ≤ 0.6**。
   2. 满足以下任一条件才升到 long-term profile：
      1. 用户**主动确认**（"对，我喜欢稳定策略"）；
      2. 同一条目在不同 episode 累积**出现 ≥3 次**；
      3. 用户**主动写入**（"记住我叫小李"）。
   3. 未升的条目存于 short-term profile，30 天衰减。
2. **永远保留用户纠错路径**：用户可在 Memory Center 删除 / 修改任何 profile 条目，删除后**不再自动重写回去**（`user_corrected: true` 锁定）。

#### 3.3.4 模型与部署

1. **本地优先**：profile 涉及长期个人画像，敏感度最高。
2. 不允许任何 profile 数据上云做训练或评估。

#### 3.3.5 延迟 / 成本

1. 延迟：**异步**，每日 / 每周批处理一次足够；无实时延迟要求。
2. 成本：每用户每周 ~1 次 profile 重算，单次 ~5-15s；可接受。

#### 3.3.6 评估指标

1. **用户纠错率**：上线后用户主动修改 profile 的比例 ≤10%（高于此说明 LLM 过度推测）。
2. **profile 漂移率**：连续 4 周对同一用户的 `interests` 变化幅度 ≤20%（防止 profile 频繁震荡导致桌宠"健忘"）。
3. **假记忆穿帮率**：用户反馈"桌宠记错了" ≤5%。

#### 3.3.7 失败处理

1. 退化为**仅 user_confirmed profile**（用户主动说过 / 写过的才入 profile）。
2. 体验降级但不出错：桌宠"少懂用户"，但不会"假懂"。

### 3.4 emotion_signal（v2.2 进 MVP）

#### 3.4.1 是什么

1. 从对话 / 行为 / 游戏事件推导用户当前情绪倾向：`primary` + `secondary[]` + `confidence`。
2. 用于桌宠**调整语气**：紧张时少调侃、兴奋时跟得上、沮丧时不打鸡血。

#### 3.4.2 是否需要 AI

1. 辅助。但 **MVP 不上情绪分类器** —— 错读情绪比"没情绪"更伤体验（用户实测调研反复出现）。
2. PM 立场：**先用规则 + 关键词起步**，验证桌宠"对情绪有反应"这件事用户是否买账；买账后再引入轻量分类器；不买账就停在规则版。

#### 3.4.3 推荐方案

1. **MVP（v1）**：规则 + 关键词。
   1. 关键词词典：紧张（"压力 / 催 / DDL / 来不及"）/ 兴奋（"通关 / 厉害 / 超神 / 终于"）/ 沮丧（"卡关 / 又死 / 算了 / 没意思"）/ 平静（默认）。
   2. 组合行为信号：连续死亡 + 沮丧关键词 → 高置信沮丧；游戏 settlement + 兴奋关键词 → 高置信兴奋。
   3. 输出 `confidence` 由规则计算，无 LLM 干预。
2. **v2（若 v1 验证有效）**：轻量分类器（如 BERT 蒸馏的中文情绪分类，4-8 类输出）。
3. **不进 MVP**：长文本情绪生成 / 情绪轨迹预测 / 多模态情绪（声音 / 表情）。

#### 3.4.4 模型与部署

1. v1 规则：纯本地，零成本。
2. v2 分类器：本地推理（< 100MB 模型），无云端。

#### 3.4.5 延迟 / 成本

1. v1：≤10ms（规则匹配）。
2. v2：≤200ms（本地推理）。
3. 成本：v1 = 0；v2 ≈ 模型体积成本。

#### 3.4.6 评估指标

1. **用户主观满意度**：上线后 7 天内"桌宠懂你情绪"评分（Likert 5 分）≥3.5。
2. **误读率**：人工评估 100 段对话，情绪误读 ≤15%。

#### 3.4.7 失败处理

1. 输出 `primary: "neutral", confidence: 0` —— 不影响桌宠对话，只是不调整语气。
2. **绝对不**强行给情绪标签（"我感觉你很沮丧"）—— 错的比没有更糟。

### 3.5 current_context 推导

#### 3.5.1 是什么

1. 5min 滑窗的实时切面：`activity_topic / mood_estimate / interrupt_suitability / attention_target / confidence / trigger`（详见 §11.9）。
2. 桌宠所有"此刻该不该开口、说什么、怎么说"决策的**唯一权威输入**。

#### 3.5.2 PM 立场（重要）

1. **`interrupt_suitability` 与 `attention_target` 是纯规则**（§2.7 / §2.8）。理由：
   1. 延迟硬约束 ≤200ms（每次桌宠对话前都要查）。
   2. 决策逻辑可解释、可测试、可回滚。
   3. 如果 LLM 误判 `interrupt_suitability: high` 在 BOSS 战开口，用户立刻流失。
2. **`activity_topic` / `mood_estimate` 是规则 + LLM 兜底**：规则先尝试映射，规则无法决策时用短 LLM 兜底。

#### 3.5.3 推荐方案

1. **interrupt_suitability** 规则：
   1. `is_fullscreen_game AND in_game_event_recent_30s` → `low`。
   2. `idle > 5min` → `low`（用户不在）。
   3. `app_switch_rate_per_min > 6` → `low`（用户焦虑切换）。
   4. `mood_estimate in (frustrated, tense)` → `low`。
   5. 其余 → `medium`。
   6. 用户主动召唤桌宠 → `high`。
2. **attention_target** 规则：`active_app` 映射到 5 类（game / ide / browser / video / other）。
3. **activity_topic** 规则 + LLM 兜底：
   1. 规则映射 `active_app + window_title_redacted + game_event_recent` → 直接生成"在 BOSS 战中" / "在写代码" 等。
   2. 规则无法映射时（如 window_title 信息少、跨 app 混合活动）调用 LLM 给一个 ≤10 字短描述。
4. **mood_estimate** = 来自 §3.4 emotion_signal 的 `primary`。

#### 3.5.4 模型与部署

1. 规则：纯本地，零成本。
2. LLM 兜底：本地 7B（与 §3.1 复用），调用频次受限（每 5min 至多 1 次）。

#### 3.5.5 延迟 / 成本

1. 规则路径 ≤200ms；LLM 兜底 ≤1s。
2. 成本：兜底每用户每天 ≤288 次（每 5min 1 次）；< $0.01 / 用户 / 天。

#### 3.5.6 评估指标

1. **interrupt_suitability 误判率**：上线后"在 BOSS 战 / 专注工作时桌宠打扰"用户反馈 ≤5%。
2. **activity_topic 准确率**：抽样人工标注 vs 系统输出 ≥85%。
3. **延迟 p99**：≤200ms（规则路径）/ ≤1.5s（含 LLM 兜底）。

#### 3.5.7 失败处理

1. LLM 兜底失败 → `activity_topic = "unknown", confidence = 0.2`，桌宠不主动开口。
2. 规则路径不应失败；如失败说明信号上游断流，需告警。

### 3.6 VLM 视觉理解（P1 单 app 实例开关，v3 重写为三档混合架构）

#### 3.6.1 是什么（v3 重写）

1. 在用户开启的 app 实例 VLM 开关下，对该 app 的前台窗口做**视觉理解**，输出 `semantic_tags` + `user_visible_summary`（详见 §11.8）。
2. 适用类别：
   1. **游戏类**：未接入 first-party game events 的游戏的唯一退路（沿用 v2.1 规则）。
   2. **视频类（v2.3 新增）**：实现"陪用户一起看视频"愿景；输出剧情节点 / 笑点 / 哭点等场景标签，桌宠据此实时反应。
3. 不在 MVP：音乐 app / 工作 app / 浏览器 — 后续如扩展必须走项目级决策。

#### 3.6.1.1 三档混合架构（v3 新增，接受 Radar Q-F1）

```
[ 视觉帧 buffer ≤60s ]
        │
        ▼
[ 档 1: CNN 初筛 ]  ← MobileNet / EfficientNet 量级，~50ms / 帧，~10MB 模型
        │
        ├─→ 高置信场景（boss_fight / 视频高潮 / idle 等明确分类）→ 直接出 tag，不调 VLM
        │
        ├─→ 低置信 / 罕见场景 ──┐
        │                       ▼
        │              [ 档 2: 量化 7-8B VLM 兜底（本地）] ← MiniCPM-V 4.5 (8B int4) / Qwen2.5-VL-7B (Q4_K_M)，~4-5GB 显存
        │                       │
        │                       ├─→ 输出 tag + 短摘要 → 写入记忆
        │                       │
        │                       └─→ 仍低置信 / 模型不可用 ──┐
        │                                                   ▼
        │                                       [ 档 3: 云端 VLM 兜底（两层授权）]
        │                                       ① onboarding 总开关启用（默认关闭，可随时关闭）
        │                                       ② 每次激活前用户显式确认本次上传
        │                                       上传脱敏帧（缩略 + 高斯模糊关键区域）
        │                                                   │
        │                                                   └─→ 任一层缺失 → 回退 `unknown`（不静默兜底）
        │
        └─→ 兜底回退 `unknown`（任何档失败都走这里）
```

PM 立场：
1. **CNN 初筛是 v3 新增能力**，负责 ~60-70% 的常见场景；用于降低 VLM 调用频次 + 适配低配机器。
2. **量化 7-8B VLM 是中档**，覆盖 CNN 不能搞定的中等难度场景；本地推理（int4 / Q4_K_M 量化后 ~4-5GB 显存）；目标用户硬件分布上中端独显 / 高配核显可跑，低端硬件回退档 1 CNN 或档 3 云端（注：仅 7B 全精度 35-45% 可用率不达标，本处采用量化版 + 三档混合后整体 ≥85%）。
3. **云端 VLM 是受限最终兜底**，需**两层授权**：① onboarding 总开关（用户在隐私设置中显式启用云端兜底，默认关闭，可随时关闭）；② **每次激活前**用户显式确认"本次允许上传脱敏帧到云端"（不是 onboarding 一次性永久授权）；任一层缺失则降级 `unknown`。上传**仅脱敏帧**（缩略 + 高斯模糊关键区域），不上传原图。
4. **任何档失败回退 `unknown`**，桌宠不假装看到。

#### 3.6.1.2 与 v2 "VLM 本地优先" 的关系

1. v2 §3.6.4 "本地优先" **仍然成立**：CNN（本地）+ 量化 7-8B VLM（本地）是主路径，覆盖 ~85%。
2. v2 "云端兜底仅在用户显式同意时启用" **仍然成立**：云端是档 3，需 onboarding 同意。
3. v3 改变的是 **"仅押注 7B VLM"** 的失败假设 — Radar 数据证明 7B 在目标用户硬件上只有 35-45% 可用率，必须改为三档混合。

#### 3.6.2 是否需要 AI

1. **必要且唯一**。VLM 本身就是 AI。

#### 3.6.3 推荐方案

1. **本地推理优先**：VLM 是隐私最敏感的能力，原始帧不应出本地。
2. 候选模型（**v3 三档混合架构中作为档 2 中档兜底**）：MiniCPM-V 4.5 (8B int4) / Qwen2.5-VL-7B (Apache 2.0 Q4_K_M ~4.4GB)；**与档 1 CNN 初筛（MobileNet / EfficientNet 量级）+ 档 3 云端兜底（用户显式同意）配合**，不是单押 7B（仅 7B 单押可用率 35-45% 已被 Radar Task F 验证不达标）；如硬件不支持 7B 档，回退档 1 CNN 或档 3 云端，最终**仅返回 `unknown`**，不强制走云端。
3. 云端兜底（如必要）：
   1. **仅上传脱敏帧**（缩略图 + 高斯模糊处理后），不上传原图。
   2. **仅返回语义级标签**，不返回完整帧分析。
   3. **两层授权**（v2.5.1 统一）：① onboarding 总开关启用云端兜底（默认关闭，对应隐私设置开关，可随时关闭）；② 每次激活前用户**显式确认本次上传**（不是后台静默，不是 onboarding 一次性永久授权）；任一层缺失则降级 `unknown`。
4. 输出严格限制：
   1. `semantic_tags` ≤ 5 个；
   2. `user_visible_summary` ≤ 50 字；
   3. **不**输出用户身份 / 账号 / 聊天内容（即使屏幕上有）。

#### 3.6.4 模型与部署

1. **本地 VLM**：优先级 #1。如本地不可用，**降级为不可用**，不自动转云端。
2. **云端**：需**两层授权**（onboarding 总开关 + 每次激活前用户显式确认本次上传），详见 §3.6.3 #3.3；任一层缺失则降级 `unknown`，不自动转云端。

#### 3.6.5 延迟 / 成本

1. 本地：2-5s / 帧（取决于硬件）。
2. 云端：1-2s / 帧 + 流量成本。
3. 触发频率：每 30s 至多 1 次（buffer ≤60s 内最多 2 帧）。

#### 3.6.6 评估指标（v3 重写）

1. **本地可用率 ≥85%**（v3 修订）：在目标用户硬件分布下，三档混合（CNN 初筛 + 量化 7-8B VLM 兜底 + 云端兜底用户同意率）合计可用率 ≥85%。仅 7B VLM 路径 35-45% 已被 Radar 验证不达标。
2. **CNN 初筛覆盖率 ≥60%**（v3 新增）：CNN 在常见场景（boss_fight / scene_funny / scene_action / idle / video_loading 等 ~15 类）上的命中率；命中即不调 VLM。
3. **VLM 兜底准确率 ≥75%**（v3 沿用 v2 数值）：抽样 200 个 CNN 未命中场景人工标注 vs 量化 7-8B VLM 输出准确率。
4. **隐私穿透率 = 0**（v3 沿用，强约束）：人工抽样 100 次输出，**绝不允许**出现用户身份 / 聊天内容 / 屏幕上的他人信息。**架构兜底**（v3 新增，接受 Radar §6.3）：
   1. System prompt 显式禁止（列出"不输出用户名 / 聊天 / 他人 / 邮箱 / 电话 / 手写 / 密码框"）。
   2. 输出 schema 强约束（仅 `{tag: enum, confidence: float}` 枚举字段，禁止自由文本）。
   3. 后置过滤（正则 + 关键词 + NER 二次过滤）。
   4. 输入预处理（关键区域如聊天框 / 输入框 / 用户名 / 字幕 自动马赛克遮罩）。
5. **延迟 p95**（v3 新增分档）：
   1. CNN 路径 ≤200ms。
   2. 量化 7-8B VLM 兜底路径 ≤2s。
   3. 云端兜底路径 ≤3s（含上传 + 推理 + 下载）。
6. **License 合规**（v3 新增）：
   1. MiniCPM-V 4.5 商用条款需法务核验通过；不过则切 Qwen2.5-VL-7B (Apache 2.0)。
   2. CNN 初筛模型选型由 Engineering 决定，建议 Apache 2.0 / MIT / BSD 系（MobileNet / EfficientNet 等）。
   3. **不进 MVP 的 License 红线**：Gemma-3、Qwen2.5-VL-3B（仅研究用）、LLaVA-NeXT。

#### 3.6.7 失败处理

1. 本地推理失败 → `unknown`，桌宠不"假装看到"。
2. 隐私穿透 → 立即触发紧急回滚 + 用户告知 + 复盘。

#### 3.6.8 视频类语义标签规范（v2.3 新增）

| 编号 | 标签 | 触发示例 | 桌宠侧反应 |
|---|---|---|---|
| 1 | `scene_funny` | 喜剧场景 / 鬼畜节奏 | 跟笑 / 评论一句 |
| 2 | `scene_emotional` | 抒情 / 悲伤场景 | 安静陪伴 / 一句轻语 |
| 3 | `scene_action` | 打斗 / 追逐 | 紧张反应 |
| 4 | `scene_dialogue` | 长对话 / 访谈 | 不打扰 |
| 5 | `scene_credits` | 片尾 / 致谢 | "看完了，要不要换一部" |
| 6 | `scene_loading` | 加载 / 缓冲 | 闲聊 / 互动 |

视频类禁止输出（与游戏类一致 + 视频特有）：
1. 不识别 / 不输出：人脸识别结果、屏幕上的他人 / 弹幕 / 评论原文、字幕原文（仅可输出"有字幕"状态）。
2. 不在视频窗口内 OCR / 识别用户的聊天 / 私信 / 评论区内容。

### 3.7 MCP tool 结果摘要

#### 3.7.1 是什么

1. 把 MCP 返回的结构化数据（task_progress / calendar_next_event / game_now_playing）转成桌宠可读的自然语言摘要。

#### 3.7.2 是否需要 AI

1. 辅助。80% 场景可用模板（"你有 3 个任务今天截止，最高优先级是 X"），20% 场景需要 LLM 处理复杂组合（"5 个会议串起来 + 待办撞档"）。

#### 3.7.3 推荐方案

1. **模板优先**：每个 MCP source 写 3-5 个文案模板。
2. **LLM 兜底**：当多 source 数据组合复杂时调用 LLM 生成 ≤30 字摘要。

#### 3.7.4 模型与部署

1. 模板：纯本地。
2. LLM：本地（与 §3.1 复用）；不上云。

#### 3.7.5 延迟 / 成本

1. 模板 ≤50ms；LLM 兜底 ≤1s。
2. 成本：模板 0；LLM 兜底每用户每天 ≤20 次。

#### 3.7.6 评估指标

1. **模板命中率**：≥80% 场景走模板，≤20% 走 LLM。
2. **摘要可读性**：人工评估 ≥4 / 5 分。

#### 3.7.7 失败处理

1. 模板 + LLM 都失败 → 直接展示 raw 字段（不美但可用）。

### 3.8 不需要 AI 的能力（强声明）

#### 3.8.1 idip delta / anomaly / milestone（§2.9）

1. 纯数值对比 + 阈值规则。LLM 介入会增加延迟 / 成本 / 误判。
2. 规则示例：
   1. `delta = current - previous`；
   2. `anomaly`：连续 3 次同一字段失败 / hp_pct 长时间低位 / 长时间无操作。
   3. `milestone`：等级跨整数 / 段位跨档 / 成就解锁事件。

#### 3.8.2 game_event 去重 / 整理（§2.10）

1. 纯规则：`event + time_window + dedupe_key` → 去重。

#### 3.8.3 decay_score（§2.14）

1. 纯规则：`decay_score = exp(-Δdays / half_life)`，每类 `source_category` 不同 half_life。
2. 不需要 LLM 干预，且 LLM 干预会让"为什么这条衰减了"变得不可解释。

#### 3.8.4 interrupt_suitability 实时决策（§2.7）

1. 详见 §3.5.3 规则集。
2. 永远不让 LLM 做这个决策；可解释性 + 延迟 + 可回滚都是硬约束。

### 3.9 不进 MVP 的能力（强声明）

#### 3.9.1 Agent 自主规划

1. 桌宠 MVP 不需要 Agent 自主多步规划；所有桌宠行为可由"规则 + 单步 LLM 调用 + 用户确认"覆盖。
2. Agent 会引入：①不可预测延迟；②难以解释的失败模式；③Prompt Injection 风险；④隐私边界难以约束。
3. 引入门槛：在产品验证有明确"需要桌宠跨多个工具完成长任务"用例 + 安全评估通过后才考虑。

#### 3.9.2 Fine-tuning

1. 不进 MVP。理由：①合规数据缺乏；②评估闭环未建立；③一次上线后回滚困难；④冷启动期 Prompt 工程 + RAG 已能覆盖大部分体验诉求。
2. 引入门槛：MVP 上线 ≥3 个月、有 ≥100k 真实对话样本（已合规化）+ 明确的"Prompt 改不动了"瓶颈。

#### 3.9.3 推荐系统

1. 不进 MVP。理由：推荐时机 / 内容是"主动行为"，错了直接打扰用户；MVP 阶段桌宠应**被动响应**而非主动推荐。
2. P2 评估：上线后看用户是否反馈"希望桌宠主动 X"，再做。

#### 3.9.4 跨游戏迁移学习

1. 不进 MVP。与 §4.5.3 多游戏 profile 不共享一致。

#### 3.9.5 用户行为预测

1. 不进 MVP。预测 = 推测，与"假记忆穿帮"同源；MVP 只做事实记忆 + 实时切面，不做未来预测。

### 3.10 audio A0 BPM / 能量 / 节拍检测（v2.3 新增）

#### 3.10.1 是什么

1. 从系统音频流计算 BPM / 能量曲线 / 节拍点；服务"桌宠随音乐舞动"愿景。
2. 详见 `REQUIREMENT_CLARIFICATION_memory-dataset.md` §4.10 与 §10.3 A0-A3 分级。

#### 3.10.2 是否需要 AI

1. **不需要**。BPM / 能量 / 节拍属经典信号处理范畴；现成的开源音频分析库（如 aubio / librosa 类）足以满足，不需要 LLM / VLM 介入。
2. LLM 在这里反而是反模式：①延迟不达标（节拍 sync 需 ≤200ms）；②不可解释（"为什么这一帧是节拍点"）；③成本高。

#### 3.10.3 推荐方案

1. **本地音频 API + 开源信号处理库**：
   1. macOS：CoreAudio + aubio / vamp。
   2. Windows：WASAPI + 同款信号处理库。
2. 采样率：22.05 kHz 足以；窗口大小：1024 samples。
3. 输出：`bpm_estimate`（每 5s 重算）+ `energy_curve_buckets`（每 100ms）+ `beat_event`（实时）+ `silence_signal`。
4. 与 §11.10 mock 一致。

#### 3.10.4 模型与部署

1. **强制本地**。绝不上传任何形式的音频流。
2. 派生标量不持久化原始时序流；只保留聚合统计。

#### 3.10.5 延迟 / 成本

1. 延迟：BPM 检测稳定后 ≤200ms；节拍点延迟 ≤50ms（每帧）。
2. 成本：纯本地 CPU 推理；< 5% 单核 CPU 占用（典型情况）。

#### 3.10.6 评估指标（v3 加 warmup + License）

1. **BPM 准确度**：与人工标注音乐对比，误差 ≤±3 BPM。
2. **节拍 sync 偏差**：用户视感"节拍对齐"主观评分 ≥4 / 5（≤50ms 偏差即可达成）。
3. **静音判断延迟**：≤500ms（音乐停止到桌宠停止舞动）。
4. **首拍稳定时间（warmup） ≤ 5 秒**（v3 新增）：检测器启动到 BPM 稳定的时间；warmup 内桌宠不根据 BPM 反应。
5. **License 合规**（v3 新增）：
   1. **aubio (GPL-3.0)**：MVP 原型可用，但**必须 IPC 子进程隔离**（与桌宠主程序通过 IPC 通信），避免 GPL-3.0 传染整个二进制。
   2. **长期商业 release** 切 **BeatNet (CC-BY-4.0) + cpal 自实现 RMS / silence**，License 无传染风险。
   3. **不进 MVP 的 License 红线**：Essentia (AGPL-3.0，客户端嵌入硬约束)、madmom (Python 3.10+ 兼容性破损 + 2 年无新版)。

#### 3.10.7 失败处理

1. BPM 检测器失败 → 桌宠**不舞动**（保持空闲状态）；不假装节拍。
2. 信号波动（BPM 抖动 > ±10 BPM）→ 锁定上一个稳定 BPM；避免桌宠节奏乱跳。
3. **绝对不**用 LLM 兜底 BPM — 太慢且不可解释。

#### 3.10.8 与既有边界关系

1. 与项目级 `PRIVACY_BOUNDARY` §2 #2 "不默认系统音频监听"冲突，需修订（见 `PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md`）。
2. 修订前本能力**仅供 PM / Engineering 规划讨论，不进入实际采集**。

### 3.11 Playwright snippet 总结（v2.3 新增，P2 兜底场景）

#### 3.11.1 是什么

1. Playwright 抓取用户主动查询场景下的页面数据后，把 raw 结果总结成桌宠可读的自然语言摘要。
2. 详见 `REQUIREMENT_CLARIFICATION_memory-dataset.md` §4.11 与 §3.11 边界规则。

#### 3.11.2 是否需要 AI

1. 辅助。Raw Playwright 结果（HTML 片段 / DOM 解析）需要被压缩成"3 个 UP 主有新视频：X / Y / Z"这种短摘要。
2. 模板可覆盖 ~70% 场景（如收藏列表）；长尾 ~30% 走 LLM。

#### 3.11.3 推荐方案

1. **模板优先**：每个 Playwright source 写 2-3 个文案模板。
2. **LLM 兜底**：模板不命中时调用 LLM 生成 ≤50 字摘要；输入是脱敏后的 raw snippet（去除 HTML 标签、URL 参数等）。

#### 3.11.4 模型与部署

1. **本地优先**：Playwright 抓的是用户登录态后的私有页面数据，敏感度高。
2. **绝不上传 raw HTML / DOM 到云端**；如必须云端走 LLM，仅上传脱敏后的纯文本片段，且用户每次显式确认。

#### 3.11.5 延迟 / 成本

1. 模板 ≤50ms；LLM 兜底 ≤2s。
2. 成本：Playwright 调用每用户每天 ≤10 次（用户主动触发）；LLM 兜底每次 ~$0.001 / 调用。

#### 3.11.6 评估指标

1. **模板命中率**：≥70%。
2. **摘要可读性**：人工评估 ≥4 / 5 分。
3. **隐私穿透率**：LLM 输出**绝不包含**用户的真实账号 / 邮箱 / 手机号 / 私信内容（容忍度 = 0）。

#### 3.11.7 失败处理

1. Playwright 抓取失败（DOM 变 / ToS 拦截 / 登录失效）→ 桌宠告知"暂时拿不到，要不要重新登录"，不假装抓到了。
2. LLM 摘要失败 → 展示 raw snippet（不美但可用）。

#### 3.11.8 与既有边界关系

1. 与 §4.11.3 7 条边界完全一致：仅用户主动触发 / OS keychain / 短期 buffer / 不进 long-term profile / UI 状态指示。
2. PRIVACY_BOUNDARY 修订提案 #8 新增项 — 见提案文件。

---

## 4. 跨能力 AI 编排（数据流）

### 4.1 三层抽象的写入路径

1. **Raw 输入** → atomic_facts 抽取（§3.1，LLM）→ atomic_facts buffer（短期）。
2. **atomic_facts buffer + raw messages** → episode 摘要（§3.2，LLM）→ episode（短期 / 中期）。
3. **episodes + atomic_facts 累积** → profile 提议（§3.3，LLM）→ short-term profile。
4. **short-term profile + 用户确认 / 累积阈值** → long-term profile（仅在升级条件触发时）。
5. **profile 元字段（confidence / source / decay / user_corrected）** 由规则 × LLM self-rate 混合（§4.9.3）计算并附加。

### 4.2 实时切面的计算路径

1. **多源信号汇聚**（chat / behavior / game_event / mcp / vlm 输出）→ current_context 计算（§3.5）。
2. `interrupt_suitability` / `attention_target` → 纯规则（≤200ms）。
3. `activity_topic` → 规则尝试；不命中时 LLM 兜底（≤1s）。
4. `mood_estimate` → 来自 emotion_signal（§3.4，规则 + 关键词）。
5. `confidence` → 由各上游字段的可信度聚合（取最小值 × decay）。
6. **变化触发推送** + 30s 心跳（§4.8.3）。

### 4.3 桌宠侧消费路径

1. 桌宠对话前先查 current_context；`interrupt_suitability != low` 才允许主动开口。
2. 桌宠回复生成时，把以下作为 prompt 输入：
   1. 最近 3-5 个 atomic_facts；
   2. 当前 episode.title；
   3. profile 中 confidence ≥0.7 的 interests / preferences / key_facts；
   4. current_context；
   5. 用户当前消息。
3. **不**把 profile 全量、不把所有 episode 历史、不把所有 atomic_facts 灌进 prompt（防止上下文爆炸 + 隐私扩散）。

---

## 5. 模型部署策略

### 5.1 部署矩阵

| 编号 | 能力 | 本地 | 云端 | 备注 |
|---|---|---|---|---|
| 1 | atomic_facts 抽取 | ✅ 优先 | ⚠️ 可选（脱敏） | 用户授权云端处理对话才走云 |
| 2 | episode 摘要 | ✅ 优先 | ⚠️ 可选（脱敏） | 同上 |
| 3 | profile 抽取 | ✅ **强制本地** | ❌ 不允许 | 长期画像绝不上云 |
| 4 | emotion_signal | ✅ 本地（规则 / 分类器） | ❌ | 0 云端 |
| 5 | current_context（规则部分） | ✅ 本地 | ❌ | 0 云端 |
| 6 | current_context（LLM 兜底） | ✅ 本地 | ❌ 不上云 | 用本地小模型即可 |
| 7 | VLM（游戏 + 视频） | ✅ **优先本地** | ⚠️ 仅脱敏帧 + 显式同意 | 见 §3.6 |
| 8 | MCP 摘要（LLM） | ✅ 本地 | ❌ | 0 云端 |
| 9 | audio A0 BPM / 能量 / 节拍 | ✅ **强制本地** | ❌ 不允许 | 不上传音频流（含派生时序） |
| 10 | Playwright snippet 总结（LLM） | ✅ 本地 | ⚠️ 仅脱敏文本 + 每次显式确认 | raw HTML 绝不上云 |

### 5.2 训练数据边界（硬约束）

1. **任何 AI 任务都不能把用户原始数据（聊天 / 屏幕帧 / 行为时序）用于训练或微调**。
2. 云端调用必须显式声明 `do_not_train: true`（如供应商支持的话）。
3. 不与第三方模型 API 共享 player_id / game_id 真实值；mock 化后再传。
4. Fine-tuning（§3.9.2）一旦未来引入，训练数据必须是 **合成 + 合规获取的开源数据 + 用户显式同意捐赠数据**三类之一。

### 5.3 成本控制

1. MVP 阶段预估：每用户每月 LLM 推理成本 ≤ **¥3**（按本地为主、云端兜底 < 10% 调用估算）。
2. 超过 ¥3 / 用户 / 月 → 触发评审，降级方案：①把 episode 摘要改成每日一次而非每段；②profile 改为周更新；③砍 LLM 兜底，保规则。

---

## 6. 失败处理与人工兜底（汇总）

| 编号 | AI 任务 | 失败模式 | 兜底 |
|---|---|---|---|
| 1 | atomic_facts 幻觉 | 生造用户没说的话 | 规则校验拦截 + 标低 confidence |
| 2 | episode 内容偏离 | content 偏离 atomic_facts | 退化为 atomic_facts 列表 + 时间范围 |
| 3 | profile 漂移 | 频繁震荡 / 错误推断 | 用户确认回路 + 用户纠错锁 |
| 4 | emotion_signal 误读 | 错读紧张为兴奋 | 输出 neutral 默认；不主动说出情绪 |
| 5 | activity_topic 不准 | 描述错误 | 退化为 active_app 直接显示 |
| 6 | interrupt_suitability 误判 | 在 BOSS 战开口 | 规则路径不应失败；如失败默认 low |
| 7 | VLM 幻觉 | 看错画面 | 仅输出 `unknown`；不强行猜 |
| 8 | VLM 隐私穿透 | 输出含用户身份 / 聊天 | 紧急回滚 + 用户告知（容忍度 0） |
| 9 | MCP 摘要失败 | 模板不命中 + LLM 失败 | 展示 raw 字段 |

### 6.1 用户兜底（始终可用）

1. **暂停 AI 推理**：Memory Center 一键暂停所有 LLM 调用，桌宠退化为规则态。
2. **清空所有 AI 推断字段**：清除 LLM 写入的 profile / episode / emotion_signal / current_context（保留用户主动写入的）。
3. **查看 / 删除 / 纠错任何 AI 写入条目**：每条记忆显示来源（LLM 推断 vs 用户确认），用户可单独操作。

---

## 7. 评估指标汇总

| 编号 | 维度 | 指标 | 目标 |
|---|---|---|---|
| 1 | 抽取质量 | atomic_facts 召回率 | ≥80% |
| 2 | 抽取质量 | atomic_facts 幻觉率 | ≤2% |
| 3 | 摘要质量 | episode 忠实度 | ≥95% |
| 4 | 摘要质量 | episode 覆盖率 | ≥85% |
| 5 | 画像质量 | profile 用户纠错率 | ≤10% |
| 6 | 画像质量 | profile 漂移率 | ≤20% |
| 7 | 画像质量 | 假记忆穿帮率 | ≤5% |
| 8 | 情绪质量 | emotion 误读率 | ≤15% |
| 9 | 情绪质量 | 用户"懂情绪"评分 | ≥3.5 / 5 |
| 10 | 上下文质量 | interrupt_suitability 误判 | ≤5% |
| 11 | 上下文质量 | activity_topic 准确率 | ≥85% |
| 12 | 上下文质量 | 延迟 p99（规则） | ≤200ms |
| 13 | 上下文质量 | 延迟 p99（含 LLM 兜底） | ≤1.5s |
| 14 | VLM | 语义标签准确率 | ≥75% |
| 15 | VLM | 隐私穿透率 | 0（容忍度 = 0） |
| 16 | VLM | 本地推理可用率（三档混合：CNN + 量化 7-8B VLM + 云端兜底用户同意率） | **≥85%**（v3 修订；详见 §3.6.6 #1） |
| 17 | MCP 摘要 | 模板命中率 | ≥80% |
| 18 | 成本 | 每用户月 LLM 成本 | ≤¥3 |

---

## 8. 隐私 / 安全约束（与 PRIVACY_BOUNDARY 一致性）

1. 所有 AI 能力 **不增加**新的数据采集面（采集面由 `REQUIREMENT_CLARIFICATION_memory-dataset.md` §3 / §4 锁定）。
2. AI 推理过程中的中间数据（prompt / response / 中间张量）不持久化；推理完即丢。
3. LLM prompt **不**包含跨用户数据（避免数据交叉污染）。
4. 任何 AI 输出在写入长期记忆前必须经过 §3 各小节定义的**校验层**（规则校验 / 用户确认回路 / confidence 阈值）。
5. VLM 输出**绝不**包含可识别用户身份 / 账号 / 聊天内容（穿透容忍度 = 0）。
6. 不与第三方 AI 训练数据共享池连接。

---

## 9. MVP 阶段 AI 范围声明

### 9.1 进 MVP（P0 / P1）（v3 扩展）

1. atomic_facts 抽取（LLM）
2. episode 摘要（LLM）
3. profile 抽取（LLM + 用户确认回路）
4. emotion_signal（规则 + 关键词起步）
5. current_context（规则 + LLM 兜底）
6. **VLM 三档混合架构**（单 app 实例 = 游戏 + 视频）（v3 重写）：
   1. CNN 初筛（本地，MobileNet / EfficientNet 量级，覆盖 ≥60% 常见场景）
   2. 量化 7-8B VLM 兜底（本地，MiniCPM-V 4.5 / Qwen2.5-VL-7B int4，覆盖中等难度场景）
   3. 云端 VLM 兜底（用户 onboarding 显式同意，仅脱敏帧）
7. MCP 摘要（模板 + LLM 兜底）
8. confidence 计算（规则 × LLM self-rate × decay）
9. decay 计算（规则）
10. Memory 结构化查询
11. **audio A0 BPM / 能量 / 节拍检测**（强制本地；纯信号处理，非 AI；warmup 5s）（v3 加 warmup）
12. **Onboarding 硬件 benchmark 30s + VLM 三选一兜底**（v3 新增；文案 "①仅文本对话 / ②本地轻量识别 / ③启用云端兜底（需授权）"）。

### 9.2 P1 评估（MVP 后视情况）

1. RAG over Memory（语义检索用户自己的记忆）
2. emotion 分类器（替代规则版）

### 9.2.1 P2（用户主动触发场景，v2.3 新增）

1. **Playwright snippet 总结**（仅用户主动查询场景；模板 + LLM 兜底；7 条边界规则见 §4.11.3）。

### 9.3 不进 MVP（强声明，v3 扩展）

1. Agent 自主规划
2. Fine-tuning
3. 推荐系统（主动推送时机 / 内容）
4. 跨实例迁移学习（含跨游戏 / 跨视频 app / 跨音乐 app）
5. 用户行为预测
6. 多模态情绪（声音 / 表情）
7. 长文本情绪生成
8. 自动主动开口（除用户主动召唤外，桌宠不主动开口；MVP 暂只做"被动响应 + 关键时刻祝贺 / 安慰 + 陪看反应 + 随音乐舞动"四类，前者用户触发、后三者由规则 / 信号触发，不靠 AI 决策"是否开口"）
9. **音频内容识别 / 语音识别 / 歌词识别 / 声纹**（v2.3 新增；A2 / A3 任何形式不允许）
10. **麦克风录音**（与系统音频流不同；v2.3 新增）
11. **Playwright 后台轮询 / 模拟用户操作 / 跨用户共享抓取数据**（v2.3 新增；仅用户主动触发的 snippet 总结允许）
12. **仅押注 7B VLM 单档架构**（v3 新增；Radar 已验证目标用户硬件可用率仅 35-45%，必须用三档混合）
13. **Gemma-3 / Qwen2.5-VL-3B / LLaVA-NeXT 等 License 不友好模型**（v3 新增；3B 仅研究用、Gemma 商用受限）
14. **aubio 不做 IPC 隔离直接静态链接**（v3 新增；GPL-3.0 会传染整个二进制）。

---

## 10. Open Questions

| # | Question | Owner | Why It Matters |
|---|---|---|---|
| 1 | 本地 LLM 选型（7B / 13B / MoE）由 Engineering 评估；PM 需关注：本地推理在中低配 PC 的可用率门槛是多少？低于多少视为降级？ | PM + Engineering | 决定 §3.6 VLM 与 §3.1-§3.3 文本 LLM 的下限保证 |
| 2 | profile 升级阈值"出现 ≥3 次"是否合理？是否需要区分"显著事实"（一次足够）vs"模糊推断"（多次累积）？ | PM | 影响 profile 质量与穿帮率 |
| 3 | emotion_signal 规则版上线 ≥4 周后，是否引入分类器？引入门槛指标是什么？ | PM + AI Feature Evaluation | 防止"先做小再卷大"陷阱 |
| 4 | LLM 兜底在 activity_topic 上的调用频次上限（每 5min ≤1 次）够吗？太多影响成本，太少影响准确率。 | PM + Engineering | 影响 §5.3 成本预算 |
| 5 | ~~VLM 在 2026 年本地推理可用率 70% 假设是否成立？~~ → **Resolved 2026-05-12**：Radar Task F 验证仅 7B VLM 单押可用率 35-45%（不达标）；v3 §3.6 重写为三档混合架构，本地可用率目标 **≥85%**（详见 DECISION_LOG #25 / §3.6.6 #1）。 | Engineering + Radar | Resolved — §3.6 已落地三档混合 |
| 6 | 是否允许 LLM 在 atomic_facts 抽取阶段"主动追问"（如"你刚说的 X 是指 Y 还是 Z？"）？这会改变对话流 | PM | 影响 UX 与抽取质量 |

---

## 11. 不在本文件范围

1. 具体模型选型（Qwen / Llama / Gemma / 本地 VLM 模型名）— 由 Engineering 评估。
2. Prompt 工程细节 / Function Calling schema — 属 Engineering / AI Feature 工程化阶段。
3. 模型训练 / 微调数据集 — 不进 MVP。
4. 推理基础设施 / GPU 选型 — 属 Engineering / 平台。
5. 模型评估测试集 — 属 Engineering / AI Feature 工程化阶段。
6. 与具体游戏的 idip 字段对接细节 — 属 Engineering / 接入。
7. UI / 视觉 / 交互 — 属 Design Prototype Thread。
8. 商业化定价 / 推理成本传导给用户 — 属商业化讨论，不在本分支。

---

## 12. 与其他文件的交叉引用

| 引用 | 用途 |
|---|---|
| `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.2 | 本文件建立在其上；§3 / §4 / §11 字段表是 AI 任务的输入 / 输出契约 |
| `01-pm/PRIVACY_BOUNDARY_memory-system.md` | §8 隐私约束的来源 |
| `04-research/branches/memory-dataset/TREND_RESEARCH_behavior-signal-libraries.md` | §3.5 规则集中行为信号字段的来源 |
| `04-research/branches/memory-dataset/MOCK_DATA_cross-source-memory-dataset.{json,md}` | §4 编排路径的验证数据 |
| `decisions/DECISION_LOG.md`（待 Main Thread 升级） | 本文件多条 PM 立场（§3.6 VLM 本地优先、§3.9 不进 MVP 五类、§5.2 训练数据边界）建议升项目级 |
