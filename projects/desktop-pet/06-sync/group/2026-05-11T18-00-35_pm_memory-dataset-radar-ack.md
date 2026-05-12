# PM → Group: memory-dataset Radar 三项调研 PM 收口答复

> Thread: PM Strategy Thread
> Filed at: 2026-05-11T18-00-35
> Branch: `memory-dataset`
> Trigger: `06-sync/group/2026-05-11T17-52-51_radar_memory-dataset-three-research-completed.md` §6 Questions for PM

## 1. 一句话结论

1. Radar 三项调研全部可用；4 个 PM 问题已答复并落入主文档 v2.2。
2. PM 立场就位，**待 Main Thread 收口**（按 Radar §8 更新 SYNC_SUMMARY / TASK_BOARD / 可选 DECISION_LOG）。
3. **本批 PM 立场未升项目级决策**（按用户指令）；候选清单已写入主文档 §13.4.2，等用户授权 Main Thread 处理。

## 2. PM 答 Radar §6 4 个问题

### 2.1 Q-mcp-候选锁定 — 部分接受

1. **PM 立场**：5 个候选都合理，但 **MVP 首批锁 3 个，剩 2 个进 P1 后半段**。
2. **MVP 首批**：滴答清单 / 飞书国内版 / Steam Web API（一一对应"待办 / 工作日历 / 娱乐"三类核心叙事，每类一个，避免同质化叠加）。
3. **P1 后半段**：OfficeMCP（仅 Windows，跨平台风险；先看 MVP 首批 Steam 信号是否足够支撑"游戏搭子"叙事再决定）+ 钉钉（与飞书在工作日历语义同质；先用飞书验证一类再补国企覆盖）。
4. **理由**：MVP 阶段更应聚焦核心叙事的"信号纯度"，而不是覆盖率；3 个 MCP 链路都走开放平台 OAuth，合规可控。
5. **落地位置**：主文档 §4.4.4 已新增完整 MCP 候选清单表。

### 2.2 Q-番茄移除 — 同意

1. Radar 证据充分：番茄 ToDo / Focus To-Do / Forest **根本没有公开通道**，从 §4.4 候选叙述移除。
2. §11.5 mock 中本来就没有番茄类（v2 用的是 qq_music / wechat_calendar 占位），但 PM 把这两个占位也作废 — qq_music 路径需 Playwright（超 §4.4.3 边界）、wechat_calendar 改用飞书。
3. **不接入清单（v2.2 确认）**：番茄 ToDo / Focus To-Do / Forest、腾讯视频 / 爱奇艺 / 优酷、WeGame / Epic 中国版、QQ 音乐、Notion。这些既不进入 §11 mock，也不在产品菜单暴露。

### 2.3 Q-mock 字段补充 — 全部接受

1. Radar 5 处扩展均为字段扩展（不删不改名），与 PM §11 既有字段语义一致，无新硬约束。
2. 接受清单：
   1. `atomic_facts[].source` 扩展为 7 个枚举：与 §4.9.3 confidence 来源映射 1:1 对齐 ✅
   2. `game_idip.idip_anomaly` 三元组 `{signal, at, context}` ✅
   3. `game_event.event_stream` 加 phase 标识（boss_phase_2 / boss_phase_3 / boss_engaged_retry / near_death / near_death_recovered / level_up / settlement / zone_enter 等）✅
   4. `current_context.trigger` 字段（heartbeat / activity_topic_changed / mood_estimate_changed / interrupt_suitability_changed / attention_target_changed）✅
   5. 顶层 `mock_metadata` 对象（schema_version / reference_spec / player_id / game_id / time_range / window_seconds_default / vlm_enabled_for_this_game / mcp_user_enabled_sources）✅
3. PM 备注：`mock_metadata` 是 **mock 数据集的元状态**，不是运行时 schema 一部分；Engineering 在最终 schema 中可选择是否保留。
4. **落地位置**：主文档 §11.0（新增）/ §11.1 / §11.5 / §11.6 / §11.7 / §11.9 已同步。

### 2.4 Q-字段最终命名 — PM 不逐字段，守边界

1. **PM 不**逐字段过拼写（snake_case / camelCase / 单复数 / 缩写）— 这是 Engineering Build Thread 的标准化职责。
2. **PM 必须 review** 的 4 类边界：
   1. 字段所属层级（L0 / L1 / L2 / L3 归属是否跨越 §10.1）。
   2. 隐私敏感字段命名是否表达隐私语义（如 `vlm_enabled_for_this_game` 比 `whitelist_enabled` 清晰）。
   3. 与 `PRIVACY_BOUNDARY_memory-system.md` §2 / `00-context/LINKS.md` 一致性。
   4. 新增字段是否引入了未在 §3 / §4 声明的数据类别。
3. **PM 工作模式**：Engineering schema 草案完成后，PM 在 2 个工作日内 review 上述 4 类；超期视为接受非边界字段。
4. **PM 拒绝单边变更**"将 L1 字段下放到 L0"或类似跨层级动作；走 `decisions/DECISION_LOG.md` 项目级。
5. **落地位置**：主文档 §10.2（新增）。

## 3. PM 未答（属 Engineering 范围）的 Radar §7 三个问题

1. Context Capture Adapter 是否接受 Task A §10 的 P0 / P1 配方？— **Engineering 评估**。
2. MCP connector 是否接受 Task B §9 推荐的统一 schema `{source, value, started_at, expires_at}`？— **Engineering 评估**。
3. `current_context.trigger` 是否进正式 schema？— **Engineering 评估**；PM 已接受作为 mock 字段，正式 schema 由 Engineering 视监控需求定。

## 4. Files Modified（PM 视角）

1. ✅ `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` — v2.1 → v2.2。
2. ✅ `01-pm/branches/memory-dataset/README.md` — Status / Transitions 同步。
3. ✅ 本文件（PM ack 群消息）。

## 5. Files Not Modified

1. Radar 4 个产物（属 Radar 写区）。
2. `06-sync/TASK_BOARD.md` / `SYNC_SUMMARY.md` / `THREAD_REGISTRY.md`（Main Thread 写区）。
3. `decisions/DECISION_LOG.md`（待 Main Thread 升项目级）。
4. 其他分支（如 `01-pm/branches/<其他>`）。
5. `02-design/` / `03-engineering/` / 其他 `04-research/` 主题文件夹。
6. 3 份 PM 派单消息 `06-sync/dm/pm-to-radar/2026-05-11T17-10-08_*.md`（保留为诉求记录，作为"PM 诉求 vs Radar 调研结论"对照）。

## 6. Next Thread

**Main Thread** — 按 Radar §8 收口动作：

1. `TASK_BOARD.md` 标记或新建 Radar 任务条目为 `Done`，链回 Radar 通告与 4 个产物 + 本 PM ack。
2. `SYNC_SUMMARY.md` §2 / §6 / §7 增条目；详见 Radar §8。
3. 视情况在 `DECISION_LOG.md` 留痕本批 PM 立场升项目级（候选清单见主文档 §13.4.2，7 条），但**用户已指示本轮不升项目级**，需用户授权。

## 7. Whether User Input Is Needed

**Optional** — 本轮 PM 工作不阻塞用户。但如果用户希望立刻把 §13.4.2 的 7 条 PM 立场升项目级（让 Main Thread 一次性写入 `DECISION_LOG.md` / `SYNC_SUMMARY.md`），可现在告知 Main Thread。

否则 PM 立场就以本分支 `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.2 为准，等 Engineering / Design 接手时再以"项目级"形式收口。
