# PM → Radar: "跨数据源"mock 补充调研委托

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-11T17-10-08
6. Trigger：`01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §11 + 用户 Q10 答复 + 同意启动

## 2. 调研问题

1. 当前 `04-research/chenmo_chat_output.json` 仅覆盖**聊天单数据源**，验证不了三层抽象 + current_context 在多源叠加下的可行性。
2. 需要补一份**完整可运行的跨数据源 mock**，覆盖以下 9 类数据（对应主文档 §11.1–§11.9）：
   1. 聊天数据（含 emotion_signal）
   2. 用户画像 profile + profile_meta（含 confidence / source / decay / user_corrected）
   3. 行为数据 - PC 传统进程（active_app / idle / input_indicators / recent_apps_top3）
   4. 行为数据 - UI 信息 + 快捷键事件流（window_title_redacted / ui_text_snapshot / shortcut_events）
   5. MCP 数据（用户自选启用的 source；以中国流行 app 为基准，如 QQ 音乐 / 腾讯日历）
   6. 游戏数据 - idip 状态对比（idip_snapshot / idip_delta / idip_anomaly / idip_milestone / idip_field_metadata）
   7. 游戏数据 - 实时事件流（match_open / death / respawn 等）
   8. 游戏数据 - VLM 陪玩（whitelist + 不持久化原图 + semantic_tags）
   9. 实时切面 current_context（activity_topic / mood_estimate / interrupt_suitability / attention_target / confidence）

## 3. 约束条件（必须遵守）

1. **全部使用合成数据**，不要使用真实玩家 ID、真实游戏内部代号、真实 idip 字段名。
2. `player_id` 使用 `player_<8 位 hex>` 形态；`game_id` 使用 `<game_codename>` 占位；MCP 数据用通用化名。
3. **不要**沿用 `chenmo_chat_output.json` 的 `msdk_xxx` ID 格式（那是真实 SDK ID 形态）。
4. 时间线设计：模拟一位玩家**在 60 分钟连续时间窗内**的多源数据，让 9 类数据在时间上能对齐、能演化、能验证三层抽象 + current_context 的产出能力。
5. **聊天内容 + 画像内容**：避免真实公司机密、IP 授权细节、敏感个人信息。可以参考 mock 输入 `剑灵Mock数据-聊天.docx` 的语义风格，但 game_id 改为通用代号。
6. **VLM 部分**：只描述 semantic_tags 与 user_visible_summary，**不**附图片或图片路径。
7. 一律遵循 `PROJECT_RULES.md` 与 `PRIVACY_BOUNDARY_memory-system.md`。

## 4. 期望产出

1. 文件 1（mock 数据）：`04-research/branches/memory-dataset/MOCK_DATA_cross-source-memory-dataset.json`（如目录不存在请新建）。
2. 文件 2（说明文档）：`04-research/branches/memory-dataset/MOCK_DATA_cross-source-memory-dataset.md`，包含：
   1. 9 类数据各自的 schema 字段表。
   2. 时间线总览（每分钟发生了什么）。
   3. 三层抽象（atomic_facts / episode / profile）在时间线上是如何累积的。
   4. current_context 滑窗（5min）在哪些时刻应变更，理由是什么。
   5. 与主文档 §11 mock 示例的差异说明（如果调整了字段名或形态，必须解释）。
3. **不要**写代码 / SDK 实现 / 服务端接口；只要数据与说明。

## 5. 信源建议（仅参考）

1. 主文档 `REQUIREMENT_CLARIFICATION_memory-dataset.md` §11 是字段基线。
2. 同行类似 mock：Memo（Tavily 类）、Memori、ActivityWatch sample data。
3. 可参考既有 `chenmo_chat_output.json` 的三层结构作为聊天源样板。

## 6. 时限

1. 软目标：72h 内出初稿；硬截止：1 周。
2. 阻塞或不可行时按协议 §13 写 blocker。

## 7. 不在本次调研范围

1. mock 数据的工程接入 / API 形态 / 存储方案。
2. 真实数据接入 / 真实游戏字段。
3. UI / 视觉设计。
4. 模型选型 / 推理实现。
