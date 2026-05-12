# Main Thread Closeout: memory-dataset Radar 两批 + PM ack 收口

Date: 2026-05-12
Thread: Main Thread
Topic: 收口 `memory-dataset` 分支 4 条群消息（Radar 批 1 + PM ack + Radar 批 2 + PM batch2 ack）

## 1. Scope

本次 Main Thread 收口的群消息（按时序）：

| # | 文件 | 发起 | 摘要 |
|---|---|---|---|
| 1 | `06-sync/group/2026-05-11T17-52-51_radar_memory-dataset-three-research-completed.md` | Radar | 第一批 3 项调研完成（行为信号库 / 中国 app MCP / 跨数据源 mock）；4 个 PM 问题 + 3 个 Engineering 参考问题 |
| 2 | `06-sync/group/2026-05-11T18-00-35_pm_memory-dataset-radar-ack.md` | PM | 答 Radar §6 4 问；MCP 锁 MVP 3 个 + P1 后半段 2 个；番茄类移除；mock 5 处字段扩展全接受 |
| 3 | `06-sync/group/2026-05-12T09-43-10_radar_memory-dataset-four-research-completed.md` | Radar | 第二批 4 项调研完成（音频派生库 / 浏览器 tab 检测 / 本地 VLM / OS Now Playing）；10 个 PM 问题 + 4 个 Engineering 参考问题 |
| 4 | `06-sync/group/2026-05-12T09-52-06_pm_memory-dataset-radar-batch2-ack.md` | PM | 答 Radar §6 10 问；VLM 三档混合架构 / 双轨分发 / MiniCPM-V 法务核验 / aubio IPC 隔离 4 条强烈建议升项目级 |

不在本次收口范围（见 §6 已知缺口）：
- v2.5 / v2.5.1 修订（6 通道并存 + 档 A 增量 + OS Scripting Bridge + mock §11 同步）—— 仅 commit 落盘，**未发 PM → Group 通告消息**。

## 2. Main Thread Updates（本次实际动作）

- ✅ `06-sync/SYNC_SUMMARY.md` §7 — 增 1 行链接到本 closeout。
- ⛔ 不修改 `decisions/DECISION_LOG.md` —— P0 决策 6 条（VLM 三档混合 / 双轨分发 / MiniCPM-V 法务核验 / aubio IPC 隔离 / MAS MediaRemote / settings.json 联网白名单补登）**已在 2026-05-12 早间完成 Accepted 入账**（详见 DECISION_LOG 2026-05-12 ×6 行），本次无新增授权升级。
- ⛔ 不修改 `06-sync/TASK_BOARD.md` —— T-021 至 T-027（Radar 7 项调研）已 Done；T-028（PM memory-dataset 分支）In Progress 正确，outputs 引用 v2.4 stale 但属 v2.5+ 收口范围。
- ⛔ 不修改 `06-sync/THREAD_REGISTRY.md` —— Main / PM / Radar 三线程 Last Update 已是 2026-05-12。
- ⛔ 不修改项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md` —— PRIVACY_BOUNDARY 修订提案 Deferred 决策（DECISION_LOG 2026-05-12 行）仍生效，等 voice-interaction 分支启动后合并审议。

## 3. Key Reconciled Conclusions

### 3.1 已锁定的项目级 P0 立场（6 条 Accepted）

| # | 立场 | 来源 |
|---|---|---|
| 1 | **VLM 三档混合架构**（CNN 初筛 + 2-4B VLM 兜底 + 云端 VLM 兜底；本地推理可用率 ≥85%） | PM batch2 ack §2.3 Q-F1 |
| 2 | **双轨发布**（MAS 砍 macOS A1 MediaRemote / Developer ID 完整功能） | PM batch2 ack §2.4 Q-G1 |
| 3 | **MiniCPM-V 4.5 商用条款法务核验前置**（未过则切 Qwen2.5-VL-7B Apache 2.0） | PM batch2 ack §2.3 Q-F2 |
| 4 | **aubio GPL-3.0 IPC 子进程隔离**（避免传染整个二进制；长期切 BeatNet CC-BY-4.0） | PM batch2 ack §2.1 Q-D2 |
| 5 | **MAS 版禁用 macOS MediaRemote** —— 仅保留 MCP 路径作为 A1 信号 | PM batch2 ack §2.4 Q-G1 配套 |
| 6 | **settings.json 联网白名单补登**（WebSearch + 28 域名）—— 项目级权限基线 | DECISION_LOG 2026-05-12 |

### 3.2 PM 立场（已 In Effect 但**未升项目级**，以 PM 分支文件为准）

- MCP 接入清单：MVP 锁 dida / feishu / steam 3 个；P1 后半段 office / dingtalk 2 个；番茄类 / 腾讯视频 / 爱奇艺 / 优酷 / QQ 音乐 / WeGame / Epic / Notion 列"不接入清单"。
- mock §11 字段扩展 5 处（atomic_facts.source 7 枚举 / game_idip.idip_anomaly 三元组 / event_stream phase / current_context.trigger / 顶层 mock_metadata）—— 已落 v2.4 / v2.5.1。
- 浏览器 Tab：MVP 锁"扩展 + Native Messaging" + macOS AppleScript / Win UIA fallback；国产浏览器 Beta 支持标。
- 音频 A0 warmup = 5 秒；macOS 14.2+ Core Audio Tap / < 14.2 BlackHole / Win WASAPI loopback。
- Onboarding VLM 硬件检测：首启 30s benchmark + 三选一（仅文本对话 / 本地轻量识别 / 启用云端兜底）。
- 字段最终命名：PM 不逐字段过拼写；守 4 类边界（层级归属 / 隐私语义命名 / 与 PRIVACY_BOUNDARY 一致 / 新增类别识别）；Engineering schema 草案完成 2 个工作日内 PM review。

### 3.3 边界确认

- 本批 PM 立场升级**未触动**项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md` —— 修订提案 Deferred 等 voice-interaction 分支合并审议。
- 本批 PM 立场升级**未触动** `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` 与 `01-pm/PRIVACY_BOUNDARY_memory-system.md` 项目级版本 —— 仍以分支文件 v2.x 为准；项目级收口待 Engineering / Design 接手时统一打包。

## 4. Files Touched This Closeout

- `06-sync/group/2026-05-12T11-45-00_main_closeout-memory-dataset-cycle.md`（本文件，新建）
- `06-sync/SYNC_SUMMARY.md`（§7 +1 行链接到本文件）

## 5. Files Explicitly Not Modified

- `decisions/DECISION_LOG.md`（无新增授权升级）
- `06-sync/TASK_BOARD.md`（T-021–T-028 状态已正确反映 4 条消息）
- `06-sync/THREAD_REGISTRY.md`（Last Update 已 2026-05-12）
- `01-pm/PRIVACY_BOUNDARY_memory-system.md` / `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md`（项目级 Deferred / 待打包）
- `01-pm/branches/memory-dataset/*`（PM 分支写区）
- `04-research/branches/memory-dataset/*`（Radar 分支写区）
- `06-sync/dm/pm-to-radar/*`（保留为诉求记录）
- `~/.codex/` / `~/.agents/skills/` / `memory/`

## 6. 已知缺口（本次收口未覆盖，建议下一轮处理）

### 6.1 v2.5 / v2.5.1 修订无 group 消息

git 记录显示 PM 分支已演化到 **v2.5.1**：

- `9dd2919 feat(memory-dataset): v2.5 — 6 通道并存 + 档 A 增量 + OS Scripting Bridge`
- `74cbfad feat(memory-dataset): v2.5.1 — mock §11 sync with v2.5`

但 `06-sync/group/` 与 `06-sync/dm/` 均未见对应 PM → Group 通告。结果：

- `06-sync/SYNC_SUMMARY.md` §1 仍写 "v2.4 + AI Eval v3"（stale，实际 v2.5.1）。
- `06-sync/TASK_BOARD.md` T-028 outputs 引用 v2.4（stale）。
- `decisions/DECISION_LOG.md` 未登记 v2.5 新增 4 条项目级决策候选（§13 候选从 11 条扩到 15 条；详见 PM 分支 README §16.7）。

**建议**：
1. PM Strategy Thread 补发一条 group 通告（v2.5 / v2.5.1 修订摘要 + 待 PM 答的新 Open Questions），让 Main Thread 走标准收口路径。
2. 用户视情况授权把 v2.5 新增的 4 条 P0/P1 决策候选升项目级 DECISION_LOG。

### 6.2 PM 14 个问题答复后的 Engineering 接口

- Radar 在两批消息中合计列了 7 个"Questions for Engineering Build Thread"（Context Capture Adapter / MCP schema 抽象 / current_context.trigger / VLM 混合架构 / Tab Detection 三 provider / A1 白名单 / OQ #8 SLA）。
- Engineering Build Thread 仍 Idle —— SYNC_SUMMARY §6 Next Actions 已建议 T-011 接续，但本次 Main 收口不启动该线程。

### 6.3 PRIVACY_BOUNDARY 修订提案

- Status: Deferred；等 voice-interaction 分支启动后合并审议。本次 Main 收口不动该状态。

## 7. Suggested Next Thread

按优先级：

1. **PM Strategy Thread** — 补发 v2.5 / v2.5.1 group 通告（覆盖 §6.1 缺口），或 PM 横向扩展启动 voice-interaction 分支。
2. **Engineering Build Thread** — 接续 T-011，基于 PM 分支 v2.5.1 + AI Eval v3 + 7 份 Radar 产物，输出 Context Capture Adapter v2 / VLM 混合架构 / Tab Detection Adapter / A1 白名单的技术设计。
3. **Design Prototype Thread** — 接续 T-012，输出 Memory Center / 桌宠设置面板信息架构。

如用户希望 Main Thread **同步把 §6.1 stale 状态同步到 v2.5.1**，可单独授权 Main Thread 再做一次 sync 控制层修订（届时 PM 也应补发 v2.5 group 通告，以保留协议完整性）。

## 8. Whether Main Thread Needs to Update SYNC_SUMMARY.md

**Done（仅 §7 link 行）。**
