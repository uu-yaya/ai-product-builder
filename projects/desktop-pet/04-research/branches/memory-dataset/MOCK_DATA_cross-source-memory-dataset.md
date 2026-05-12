# Mock Data: Cross-Source Memory Dataset

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-11
> Companion file: `MOCK_DATA_cross-source-memory-dataset.json`
> Reference spec: `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §11
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-11T17-10-08_pm_cross-source-mock-radar-research.md`

## 0. 一句话结论

1. 本 mock 在 60 分钟时间窗（2026-04-21 09:00–10:00Z）内为一名合成玩家 `player_a1c93f01` 产出**跨 9 类数据源**的对齐事件流，用于验证 PM `Context Lite Memory` 决策下"三层抽象 + current_context 滑窗"是否能真正驱动桌宠"知心好友 + 游戏搭子"两个维度的体验。
2. 所有 ID 与游戏字段均使用占位形态（`player_<8 hex>` / `<game_codename>` / `<quest_codename_*>` / `<class_codename_*>` / `<loadout_codename_*>`），**未沿用** `chenmo_chat_output.json` 的 `msdk_xxx` 真实 SDK ID 形态。
3. 与主文档 §11 的字段名保持一致；本 mock 在不破坏 §11 字段语义的前提下做了 5 处**补充**（详见 §6），方便 Engineering Build Thread 接续。

---

## 1. 总览：9 类数据各自的 schema 字段表

每一类数据对应 JSON 文件中的一个顶层数组。

### 1.1 chat（聊天数据）— 对应主文档 §11.1

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | 固定 `"chat"` |
| `segment_index` | int | 切片序号（0 起） |
| `segment_topic_summary` | string | 该 segment 的主题摘要 |
| `segment_messages[]` | array | 原始消息列表 |
| `segment_messages[].player_id` | string | `player_<8 hex>` 形态 |
| `segment_messages[].message_uuid` | string | 消息唯一标识 |
| `segment_messages[].session_id` | string | 会话标识 |
| `segment_messages[].message_type` | enum | `user` / `assistant` |
| `segment_messages[].content` | string | 消息正文 |
| `segment_messages[].timestamp` | iso8601 | UTC |
| `atomic_facts[]` | array | 原子事实 |
| `atomic_facts[].fact` | string | 自然语言事实陈述 |
| `atomic_facts[].at` | iso8601 | 事实发生 / 被陈述时间 |
| `atomic_facts[].source` | enum | `chat` / `user_confirmed` / `game_event` / `behavior` / `mcp` / `vlm` / `llm_inferred` |
| `atomic_facts[].confidence_rule` | float 0–1 | 按 §4.9.3 规则映射的底层置信度 |
| `episode.title` / `content` / `participants[]` / `time_range[]` | object | 情节摘要 |
| `emotion_signal.primary` / `secondary[]` / `confidence` | object | 情绪信号（PM v2 锁定进 MVP） |

### 1.2 profile_evolution（用户画像演化）— 对应 §11.2

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | 固定 `"profile"` |
| `snapshot_at` | iso8601 | 画像快照时刻 |
| `player_id` | string | `player_<8 hex>` |
| `summary` | string | 画像一句话概览 |
| `interests[]` / `preferences[]` / `behavior_patterns[]` / `key_facts[]` | array | 每条带 `value` + `meta` 元字段 |
| `*.meta.confidence` | float 0–1 | §4.9 最终置信度 |
| `*.meta.source_category` | enum | `chat` / `game_event` / `behavior` / `mcp` / `user_confirmed` / `llm_inferred` |
| `*.meta.first_seen_at` / `last_confirmed_at` | iso8601 \| null | 首次 / 上次确认时间 |
| `*.meta.user_corrected` | bool | 用户是否纠错过 |
| `*.meta.decay_score` | float 0–1 | 衰减因子 |

### 1.3 behavior_pc（PC 传统进程行为）— 对应 §11.3

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"behavior_pc"` |
| `snapshot_at` | iso8601 | 快照时刻 |
| `active_app.name` / `bundle_id` / `is_fullscreen` | object | 当前前台 app |
| `idle_signal` | enum | `active` / `idle_5min` / `idle_10min` / `idle_30min` |
| `input_indicators.input_intensity_level` | enum | `low` / `medium` / `high` |
| `input_indicators.typing_rhythm_signal` | enum | `steady` / `bursty` / `idle` |
| `input_indicators.mouse_activity_burst` | bool | 是否处于突发点击窗口 |
| `input_indicators.app_switch_rate_per_min` | int | 数值（≥0），不含具体切换内容 |
| `recent_apps_top3[]` | array | `name` + `fg_duration_min`（最近 1h） |

### 1.4 behavior_ui（UI 信息 + 快捷键事件）— 对应 §11.4

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"behavior_ui"` |
| `snapshot_at` | iso8601 | 快照时刻 |
| `window_title_redacted` | string | 脱敏后窗口标题（语义级） |
| `is_fullscreen_game` | bool | 是否全屏游戏 |
| `focused_element_role` | enum \| null | `text_editor` / `text_input` / `button` / `error_dialog` / `null` |
| `ui_text_snapshot` | object \| null | 仅白名单 app + opt-in 时非空 |
| `ui_text_snapshot.app_whitelisted` | bool | 是否白名单 app |
| `ui_text_snapshot.summary` | string | 屏幕文本的语义级摘要 |
| `ui_text_snapshot.buffer_expiry_at` | iso8601 | 短期 buffer 失效时间（≤5min） |
| `shortcut_events[]` | array | `{combo, at}`；**仅 modifier+键名，不含字符** |

### 1.5 mcp（用户自选启用的 MCP 数据）— 对应 §11.5

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"mcp"` |
| `snapshot_at` | iso8601 | 快照时刻 |
| `user_enabled_sources[]` | array of enum | 用户在 Memory Center 显式启用的 MCP source 列表 |
| `media_now_playing` | object \| null | 当前曲目；null 表示未播放 |
| `media_now_playing.source` | enum | `qq_music` / `netease_music` / ... |
| `media_now_playing.title` / `artist` / `started_at` | object | 媒体元数据 |
| `calendar_next_event` | object \| null | 下一项日程（仅在 ≤30min 距开始时非空，按 §4.4.1 边界） |
| `calendar_next_event.source` | enum | `wechat_calendar` / `tencent_calendar` / ... |
| `calendar_next_event.title` / `starts_at` / `minutes_until_start` | object | 日程元数据 |

### 1.6 game_idip（游戏状态 idip 数据对比）— 对应 §11.6

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"game_idip"` |
| `game_id` | string | `<game_codename>` 占位 |
| `snapshot_at` | iso8601 | 快照时刻 |
| `idip_snapshot` | object | 当前 idip 字段值；mock 用占位 codename，避免真实字段名 |
| `idip_delta[]` | array | 与上次快照对比的变化 |
| `idip_anomaly[]` | array | 衍生异常（如 `near_death_recovery`） |
| `idip_milestone[]` | array | 成就 / 突破点事件 |
| `idip_field_metadata` | object | 字段语义说明（"char_level 是角色等级"等） |

### 1.7 game_event（游戏实时事件流）— 对应 §11.7

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"game_event"` |
| `game_id` | string | `<game_codename>` |
| `session.session_id` / `started_at` / `ended_at` / `in_game_time` | object | session 元数据 |
| `event_stream[]` | array | `{event, at}`，去重 + 时序整理后的事件列表 |
| `duration_signal` | enum | `under_30min` / `over_30min` / `over_1h` / `over_3h` |

### 1.8 game_vlm（VLM 陪玩，P1 白名单 opt-in）— 对应 §11.8

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"game_vlm"` |
| `game_id` | string | `<whitelisted_game_codename>` |
| `snapshot_at` | iso8601 | 快照时刻 |
| `whitelist_enabled` | bool | 该游戏是否在白名单内（恒为 true 时本条才存在） |
| `frame_buffer_policy.max_seconds` | int | 短期 buffer 上限（≤60s） |
| `frame_buffer_policy.persisted_image` | bool | 是否持久化原图（恒为 false） |
| `semantic_tags[]` | array of string | VLM 推理结果的语义标签 |
| `user_visible_summary` | string | 桌宠 UI 上可展示给用户的摘要 |
| `ui_indicator_shown` | bool | 桌宠 UI 是否给出"正在看屏幕"的可见指示 |

### 1.9 current_context_timeline（实时切面 5min 滑窗）— 对应 §11.9

| 字段 | 类型 | 含义 |
|---|---|---|
| `data_source` | string | `"current_context"` |
| `computed_at` | iso8601 | 切面计算时刻 |
| `window_seconds` | int | 滑窗长度（默认 300） |
| `activity_topic` | string | 滑窗内活动主题 |
| `mood_estimate` | enum | `focused` / `curious` / `frustrated` / `excited` / `satisfied` / `calm` / `determined` / `slightly_frustrated` |
| `interrupt_suitability` | enum | `low` / `medium` / `high` |
| `attention_target` | enum | `ide` / `game` / `desktop_pet` / `game_launcher` / `notion` / `calendar_reminder` / 其它 |
| `confidence` | float 0–1 | 切面可信度 |
| `trigger` | string | 本次推送的触发条件（"heartbeat" 或具体变化原因） |

---

## 2. 时间线总览（每分钟发生了什么）

> 时间均为 UTC，与主文档 §11 mock 使用同一时区基线。

| 时刻 | 事件 | 涉及数据源 | 关键变化 |
|---|---|---|---|
| 09:00 | 玩家在 VS Code 写代码，QQ 音乐后台播放 | behavior_pc / mcp / current_context | 初始基线 |
| 09:02 | mcp 快照：曲目 A，下一项日程 09:30 之前的活动（minutes_until_start=73） | mcp | — |
| 09:05 | 深度专注；input_intensity=high；快捷键 `cmd+s`×2 + `cmd+f` | behavior_pc / behavior_ui | mood `focused` |
| 09:08 | 玩家打开桌宠对话窗口，问刺客天赋树（chat segment 0 开始） | chat / behavior_pc | activity_topic 切到"讨论游戏天赋树" |
| 09:10 | 助手回复 PVE 3-2-1 / PVP 破隐反打；profile_evolution[0] 生成 | chat / profile_evolution | profile 首次产出 |
| 09:15 | 回到 IDE，input bursty + mouse burst，开始遇到 timeout 弹窗 | behavior_pc / behavior_ui | activity_topic 回到 "ide 写代码" |
| 09:16:30 | UI 错误弹窗被 ui_text_snapshot 捕获（白名单 IDE） | behavior_ui | mood `slightly_frustrated` |
| 09:20 | 切到 Chrome 查 wiki；mcp 快照：曲目 C；calendar minutes_until=55 | behavior_pc / mcp | — |
| 09:21:30 | chat segment 1：用户委托桌宠 09:30 提醒会议、决定先打一局 | chat | atomic_fact `用户委托桌宠提醒`（confidence_rule 1.0） |
| 09:22 | 助手提醒先存代码；快捷键 `cmd+s` + `cmd+space`（启动 launcher） | chat / behavior_ui | mood `determined` |
| 09:22:30 | 切到游戏 launcher | behavior_pc / behavior_ui | activity_topic 切到"准备开局" |
| 09:25:30 | 游戏 session 开始（`<game_codename>` 全屏，QQ 音乐自动暂停 → mcp.media_now_playing=null） | behavior_pc / mcp / game_event / game_idip | idip 初始快照（char_level 55, rank diamond_3） |
| 09:28 | match_open | game_event | — |
| 09:30 | 进入 BOSS 战场；VLM（白名单）激活 | game_event / game_vlm / behavior_pc | mood `focused`, interrupt `low` |
| 09:30:45 | boss_engaged | game_event | — |
| 09:33:30 | boss_phase_2 | game_event | — |
| 09:34:48 | near_death（hp 12%） | game_event / game_idip / game_vlm | idip_anomaly `near_death_recovery`；mood `frustrated` |
| 09:35 | game_idip 快照含 hp_pct_low_water=12 | game_idip | — |
| 09:37:15 | boss_phase_3 | game_event | — |
| 09:38:20 | death | game_event | — |
| 09:38:35 | respawn | game_event / game_vlm | semantic_tags `death_screen, respawn_countdown` |
| 09:39:10 | boss_engaged_retry | game_event | — |
| 09:41:55 | **boss_defeated** | game_event | — |
| 09:42 | **level_up 55→56**；idip_milestone `level_up_to_56` + `boss_chapter_3_cleared` | game_idip / game_event / current_context | mood 跃迁 `excited`, interrupt `high` |
| 09:42:10 | VLM 看到 `victory_screen, loot_visible, level_up_animation` | game_vlm | — |
| 09:42:30 | chat segment 2：用户向桌宠分享胜利 | chat / current_context | atomic_fact `升到 56`（source `game_event`，conf 0.9） |
| 09:43 | 助手祝贺并提示会议还有 7 分钟 | chat | atomic_facts 累积 |
| 09:44 | 用户主动停手，要求记录"用暗影流套路通关" | chat | user_confirmed atomic_fact + 偏好升级 `暗影流套路`（conf 0.95） |
| 09:45 | profile_evolution[1] 生成，新增 `BOSS 副本攻略`、`会议前短时间开局`、`通关后主动停手` | profile_evolution | — |
| 09:48 | session_end；idip_milestone `session_end_voluntary` | game_event / game_idip | — |
| 09:50 | 切到 Notion 做战后复盘；NetEase Music 启动新曲 | behavior_pc / mcp | activity_topic `记录复盘 + 缓冲` |
| 09:55 | 切回 VS Code，input 低；mcp minutes_until=20 | behavior_pc / mcp | mood `calm` |
| 09:58 | chat segment 3：助手提醒 10:15 站会，用户委托会后跟进 timeout | chat / mcp | atomic_fact `10:15 站会`（mcp）、`委托会后跟进 timeout`（user_confirmed） |
| 10:00 | profile_evolution[2] 生成（最终态） | profile_evolution | 收口 |

---

## 3. 三层抽象在时间线上的累积

### 3.1 atomic_facts 累积曲线

| 时刻 | 新增 atomic_facts | 累积总数 | 关键来源 |
|---|---|---|---|
| 09:10 | 4（chat segment 0） | 4 | chat |
| 09:22 | 3（chat segment 1） | 7 | chat（含 1 条 user_confirmed） |
| 09:42 | 1（level_up） | 8 | game_event |
| 09:44 | 5（chat segment 2） | 13 | chat + game_event + user_confirmed 混合 |
| 09:58 | 2（chat segment 3） | 15 | mcp + user_confirmed |

特点：
1. user_confirmed 类 fact（confidence_rule = 1.0）集中出现在用户主动表达环节（segment 1/2/3）；它们应被记忆系统**最高优先级**保留，且不允许被自动回写覆盖。
2. game_event 类 fact（confidence_rule = 0.9）出现在 09:42 的 milestone 节点；这类 fact 是"游戏搭子"维度的硬证据。
3. llm_inferred 类 fact（confidence_rule = 0.3）在本 mock 中**不直接写入 atomic_facts**，仅在 profile 元字段中体现（如 09:10 的 `刷副本` interest 用 `llm_inferred`，conf 0.4）。

### 3.2 episode 累积曲线

| 时刻 | episode | 时间窗 | 类别 |
|---|---|---|---|
| 09:10 | "玩家询问刺客天赋树调整" | 09:08–09:10 | chat |
| 09:22 | "玩家委托桌宠在会议前的短暂游戏间隙提醒" | 09:21:30–09:22 | chat + commitment |
| 09:44 | "玩家通关 BOSS 并主动停手准备开会" | 09:42:30–09:44 | chat + game_event 融合 |
| 09:58 | "玩家会议前轻量告别并委托后续跟进" | 09:58–09:58:45 | chat + mcp 触发 |
| (派生) | "BOSS 战 session（含死亡复活）" | 09:25:30–09:48 | game_event 自动派生（mock 未单独存储，由 session_id 串起） |

说明：mock 中 chat 类 episode 由 chat segment 自带 `episode` 字段表达；游戏类"过程性 episode"建议由记忆系统**从 game_event 自动派生**（如"BOSS 战 session"= 从 boss_engaged 到 boss_defeated + settlement 的时间窗），本 mock 没有显式在 game_event 数组里加 `episode` 字段，但保留 `session.session_id` 作为派生锚点。

### 3.3 profile 累积曲线

| Snapshot | 时刻 | summary 变化 | interests 新增 | preferences 新增 | behavior_patterns 新增 | key_facts 新增 |
|---|---|---|---|---|---|---|
| profile[0] | 09:10 | 关注游戏更新、刺客职业 | 刺客职业 / PVE-PVP 平衡 | 稳定策略 | 晨会查询游戏 | 倾向暗影流（llm_inferred） |
| profile[1] | 09:45 | 加入"暗影流套路"、"BOSS 攻略"、"会议前开局"、"主动停手" | + BOSS 副本攻略（game_event 来源） | + 暗影流套路（user_confirmed，conf 0.95） | + 会议前短时间开局 / 通关后主动停手 | + 角色等级 56 / 用暗影流通关 BOSS |
| profile[2] | 10:00 | 加入"委托桌宠做日程提醒" | （同 [1]） | + 会议前先存代码再切游戏（llm_inferred，conf 0.5） | + 委托桌宠做日程提醒（user_confirmed） | + 10:15 团队站会 |

观察：
1. profile[0] → [1] 的升级**主要由 user_confirmed + game_event 共同驱动**；这是 §4.9.3"规则映射 + LLM 混合 + 保守取值"的典型表现。
2. profile[2] 的"会议前先存代码再切游戏"是 `llm_inferred`（来自 09:22 助手提示后用户的隐含行为）；conf 仅 0.5，**不可被桌宠主动引用**，仅内部用。
3. 旧条目的 `decay_score` 随时间下降（如"PVE/PVP 平衡"从 0.95 → 0.9 → 0.88）；mock 仅做了示意性下降，最终衰减算法由 Engineering 决定。

---

## 4. current_context 5min 滑窗的变更时刻与理由

| # | 时刻 | activity_topic | mood | interrupt_suitability | 触发源 |
|---|---|---|---|---|---|
| 1 | 09:05:00 | 在 IDE 写代码 | focused | low | heartbeat_initial |
| 2 | 09:08:30 | 与桌宠讨论游戏天赋树 | curious | high | **activity_topic_change**（active_app 切到桌宠 + chat 启动） |
| 3 | 09:15:00 | 在 IDE 写代码 + 短暂查 wiki | focused | low | heartbeat |
| 4 | 09:17:00 | 处理 IDE 错误弹窗 | slightly_frustrated | medium | **ui_text_snapshot_change(error_dialog)** |
| 5 | 09:22:00 | 切到游戏 launcher，准备开局 | determined | high | **active_app_change(launcher) + user_message** |
| 6 | 09:30:30 | BOSS 战开始 | focused | **low** | **game_event(boss_engaged) + is_fullscreen_game=true** |
| 7 | 09:34:54 | BOSS 战中濒死回拉 | frustrated | low | **idip_anomaly(near_death_recovery) + vlm_tag(low_hp)** |
| 8 | 09:38:35 | 刚倒下并复活 | frustrated | low | **game_event(death) → game_event(respawn)** |
| 9 | 09:42:10 | BOSS 通关 + 升级到 56 | **excited** | **high** | **idip_milestone(boss_chapter_3_cleared, level_up_to_56) + vlm_tag(victory_screen)** |
| 10 | 09:45:00 | 与桌宠分享胜利 | satisfied | high | **active_app_change(desktop_pet) + chat segment 2** |
| 11 | 09:52:00 | 记录复盘 + 缓冲 | calm | medium | **active_app_change(notion)** |
| 12 | 09:58:00 | 会议即将开始 | calm | medium | **mcp.calendar_next_event(minutes_until_start≤20)** |

变更原则（mock 验证）：
1. **变化超过阈值立即推送**（§4.8.3）：以上 12 个切面中，#1 是初始心跳，#3、#4 是 5min 心跳节奏，**其余 9 个均为变化触发**（事件 / app 切换 / UI 状态变化 / milestone）。
2. **打扰决策集中**：interrupt_suitability 是 `low` 的 4 个时刻（#1、#3、#6、#7、#8）都对应 mood `focused` 或 `frustrated` + attention_target `ide` / `game`；桌宠侧应在这些时刻**只回应用户主动消息**，不主动开口。
3. **打扰决策开口**：interrupt_suitability `high` 的 4 个时刻（#2、#5、#9、#10）都是用户**主动进入桌宠对话**或**重大事件后**；桌宠侧可主动开口、可祝贺、可询问。
4. **confidence 兜底**：mock 中 confidence 范围 0.70–0.88；当 confidence < 0.75（#3、#11）时桌宠应**保守**（不主动开口长内容）。

---

## 5. 验证：mock 数据是否能驱动 PM 期望的桌宠行为？

### 5.1 "知心好友"维度

| 桌宠期望行为 | mock 中可被驱动？ | 依据 |
|---|---|---|
| 记得用户偏好"暗影流套路" | ✅ | profile[1].preferences 含 user_confirmed conf 0.95 |
| 区分 "用户说过" vs "LLM 猜的" | ✅ | profile_meta.source_category + confidence 区分清晰 |
| 不在 BOSS 战时主动开口 | ✅ | current_context #6–#8 interrupt_suitability=low |
| 在通关时祝贺 | ✅ | current_context #9 interrupt_suitability=high + idip_milestone |
| 不把"晨会摸鱼"过度泛化 | ✅ | behavior_pattern conf 仅 0.55，且 decay 较快 |
| 在用户主动委托后兑现承诺（会议提醒） | ✅ | chat segment 1 → mcp.calendar_next_event → chat segment 3 闭环 |

### 5.2 "游戏搭子"维度

| 桌宠期望行为 | mock 中可被驱动？ | 依据 |
|---|---|---|
| 知道用户在玩什么（class / loadout） | ✅ | game_idip.idip_snapshot.current_class / current_loadout_tag |
| 区分 "刚通关" vs "卡关" | ✅ | game_idip.idip_milestone vs idip_anomaly |
| 捕捉"濒死回拉"这种细节时刻 | ✅ | idip_anomaly `near_death_recovery` + vlm semantic_tags `low_hp` 双源 |
| 在无 first-party 事件接入时仍能感知 | ⚠️ 本 mock 假设 first-party 已接入；若仅 VLM 路径，semantic_tags 仍能给出 boss_fight / death_screen / victory_screen 三类关键状态，但**没有 idip 数值** |
| 会议前主动收手时给提示 | ✅ | chat segment 2 中助手"还有 7 分钟开会" + 用户主动决定停手 |

---

## 6. 与主文档 §11 mock 示例的差异说明

本 mock 在不破坏 §11 字段语义的前提下做了 5 处补充。所有补充均为**字段扩展**（不删除、不改名），由 Engineering Build Thread 决定是否在最终 schema 中保留。

| # | 差异点 | §11 原状 | 本 mock 补充 | 理由 |
|---|---|---|---|---|
| 1 | `atomic_facts[].source` 取值集合 | §11.1 只示例了 `chat` | 扩展为 7 个枚举：`chat` / `user_confirmed` / `game_event` / `behavior` / `mcp` / `vlm` / `llm_inferred` | 与 §4.9.3 规则映射的来源类别一一对应；避免事实层与画像层来源分类不一致 |
| 2 | `game_idip.idip_anomaly` 字段结构 | §11.6 示例为空数组 | 给出实际结构 `{signal, at, context}` | mock 中需要表现 "near_death_recovery" 这类异常的"信号名 + 时间 + 上下文"三元组；保持向后兼容 |
| 3 | `game_event.event_stream` 命名规范 | §11.7 给出 `match_open` / `death` / `respawn` / `boss_engaged` 等示例 | 在 mock 中加入 `near_death` / `near_death_recovered` / `boss_phase_2` / `boss_phase_3` / `boss_engaged_retry` / `level_up` / `settlement` / `zone_enter:<arena>` | 真实 BOSS 战需要 phase 标识与重试标识；建议 Engineering 把"phase 进度"作为通用衍生事件 |
| 4 | `current_context.trigger` 字段 | §11.9 未给出 | 新增 `trigger` 字段，写明本次推送的触发条件（heartbeat 或具体变化原因） | 便于桌宠侧调试与 PM 评估"推送频次是否符合 §4.8.3"；不增加新硬约束 |
| 5 | `mock_metadata` 顶层对象 | §11 各小节是独立示例对象 | 顶层加 `mock_metadata`（schema_version / reference_spec / player_id / game_id / time_range / window_seconds_default / vlm_whitelist / mcp_user_enabled_sources） | 让数据使用者一次性看懂 mock 的元状态；不与单条记录 schema 冲突 |

无其它差异：所有字段名拼写与 §11 一致；所有字段含义未改变。

---

## 7. 隐私边界自检（对照 PRIVACY_BOUNDARY_memory-system.md §2）

| 既有硬约束 | mock 是否符合 |
|---|---|
| 不默认 Recall 式后台全屏截图 | ✅ VLM 仅在白名单 + 全屏游戏中激活，且 `persisted_image: false`、buffer ≤60s |
| 不默认系统音频监听 | ✅ mock 不含音频数据 |
| 不记录键盘输入内容 | ✅ shortcut_events 只含 modifier+键名（cmd+s / alt+tab 等），无字符；input_indicators 全部为桶化派生量 |
| 不长期存跨 app 全文 UI | ✅ ui_text_snapshot 仅在白名单 IDE 内、有 `buffer_expiry_at` 5min 失效 |
| 不上传 raw OS context | ✅ window_title 已脱敏为语义级；mcp 内容用占位符 |
| 不写敏感业务信息 | ✅ 所有 game_id / quest / class / loadout 用 `<*_codename>` 占位 |
| 不使用 Recall 作为数据源 | ✅ 全文不引用 Windows Recall |

L0 / L1 / L2 / L3 键盘信号分级（§10）自检：
- L0 派生指标：`input_intensity_level` / `typing_rhythm_signal` / `mouse_activity_burst` / `app_switch_rate_per_min` ✅
- L1 快捷键事件：`shortcut_events[]`（仅 modifier+键名）✅
- L2 字符级原始流：**未出现** ✅
- L3 完整时间戳序列：**未出现**（shortcut_events 时间戳为离散事件级，非毫秒连续序列）✅

---

## 8. 给 Engineering Build Thread 的接续建议

1. **字段最终命名**：本 mock 字段为 PM 语义命名，最终命名由 Engineering 与记忆系统团队对齐。建议保留 `idip_snapshot` / `idip_delta` / `idip_milestone` / `idip_anomaly` 四元组划分，便于桌宠侧"快照 + 增量 + 重大事件 + 异常"分流消费。
2. **session-derived episode**：建议记忆系统把 game_event 的 session_id 自动派生为"游戏类 episode"，避免每个 session 都要靠 chat 触发才能进入长期记忆。
3. **profile_meta 计算公式**：mock 中 `confidence = min(rule, llm) × decay` 是 PM §4.9.3 暂行方案；Engineering 在实施时建议把 `confidence_rule`、`confidence_llm`、`decay_factor` 三者**单独存**，最终 `confidence` 仅作派生量，便于回溯与调优。
4. **current_context.trigger 字段**：建议 Engineering 评估是否在 SLA 评估阶段保留为正式字段；mock 中加入是为了便于评估推送频次是否合理。
5. **占位符 ↔ 真实字段映射**：本 mock 用 `<game_codename>` / `<class_codename_assassin>` / `<loadout_codename_shadowflow>` / `<quest_codename_*>` 等占位符，**Engineering 接入真实游戏时**这一层需要由 SDK 接入侧或记忆系统侧维护一张"codename → 真实字段名"映射表，**不能把真实字段名直接写入桌宠侧的记忆查询返回值**（与 §4.5.3 一致）。

---

## 9. 不在本 mock 范围

1. mock 数据的工程接入 / API 形态 / 存储方案。
2. 真实玩家数据 / 真实游戏字段。
3. UI / 视觉设计。
4. 模型选型 / 推理实现。
5. 字段最终命名规范的锁定（属于 Engineering Build Thread）。

---

## 10. Source / References

| Type | Path | Notes |
|---|---|---|
| PM Spec | `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §11 | mock schema 字段基线 |
| PM Privacy | `01-pm/PRIVACY_BOUNDARY_memory-system.md` §2 | 7 条硬约束 |
| PM DM | `06-sync/dm/pm-to-radar/2026-05-11T17-10-08_pm_cross-source-mock-radar-research.md` | 任务委托 |
| Existing Sample | `04-research/chenmo_chat_output.json` | chat segment 三层抽象结构样板（不沿用 msdk_xxx ID） |
| Existing Input | `04-research/剑灵Mock数据-聊天.docx` | 语义风格参考（game_id 改为通用 codename） |
