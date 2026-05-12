# PM → Group: memory-dataset Radar 第二批四项调研 PM 收口答复

> Thread: PM Strategy Thread
> Filed at: 2026-05-12T09-52-06
> Branch: `memory-dataset`
> Trigger: `06-sync/group/2026-05-12T09-43-10_radar_memory-dataset-four-research-completed.md` §6 Questions for PM

## 1. 一句话结论

1. Radar 第二批四项调研全部可用；10 个 PM 问题已逐条答复并落入主文档 v2.4 + AI Feature Evaluation v3。
2. PM 立场就位，**待 Main Thread 收口**（按 Radar §8 更新 SYNC_SUMMARY / TASK_BOARD / 可选 DECISION_LOG）。
3. 本批新增 **Q-F1 VLM 三档混合架构** + **Q-G1 双轨分发立场** 两条 P0 级 PM 立场升级，强烈建议升 DECISION_LOG。
4. **本批 PM 立场未升项目级**（按用户既有指示）；候选清单已写入主文档 §13.5.1（11 条），等用户授权 Main Thread 处理。

## 2. PM 答 Radar §6 10 个问题

### 2.1 Task D（A0 音频派生）

**Q-D1 — 接受**：在 §3.10.5 / §3.10.6 新增 **"首拍稳定时间 warmup = 5 秒"** 指标；warmup 内桌宠不根据 BPM 反应。已落入 REQUIREMENT_CLARIFICATION §10.3 #7 + AI Feature Evaluation v3 §3.10.6 #4。

**Q-D2 — 部分接受 + 加 IPC 隔离要求**：
1. ✅ MVP 走 aubio (GPL-3.0) 原型 + 长期切 BeatNet (CC-BY-4.0) + cpal 自实现两阶段策略。
2. ⚠️ 但 aubio 在 MVP 阶段**必须 IPC 子进程隔离**（与桌宠主程序通过 IPC 通信），避免 GPL-3.0 传染整个二进制。
3. ⚠️ License 红线：Essentia (AGPL-3.0)、madmom（兼容性破损）**不进 MVP**。
4. ⚠️ aubio 不做 IPC 隔离直接静态链接 = **不允许**，已写入 v3 §9.3 #14。
5. 已落入 AI Feature Evaluation v3 §3.10.6 #5。

### 2.2 Task E（浏览器 Tab）

**Q-E1 — 接受**：在 §4.7.4 锁定"**浏览器扩展 + Native Messaging**"为 MVP 首选 + macOS AppleScript / Windows UIA fallback；mcp-chrome 类全功能浏览器 MCP **不允许**（违反"不读页面内容"边界）；窗口标题文本作为主路径**不允许**（缺域名、SPA 污染）。已落入 REQUIREMENT_CLARIFICATION §4.7.4 #10-12。

**Q-E2 — 部分接受**：国产浏览器（360 / QQ 浏览器 / 搜狗 / Edge 国内版 / UC）进 **Beta 支持**标；由 Engineering 第一周验证扩展 API 兼容性；如 ≥50% 可用则 Beta 上线，否则推迟到 P1。已落入 §4.7.4 #13。

### 2.3 Task F（本地 VLM）—— 本批最重要的 3 个问题

**Q-F1 — 接受（最重要立场升级）**：§3.6 / §3.6.6 重写为 **三档混合架构**：
1. **档 1 CNN 初筛**（本地，MobileNet / EfficientNet 量级，~50ms / 帧）— 覆盖 ≥60% 常见场景；命中即不调 VLM。
2. **档 2 2-4B VLM 兜底**（本地，~2GB 显存）— 覆盖 CNN 未命中的中等难度场景。
3. **档 3 云端 VLM 兜底**（用户 onboarding 显式同意；仅脱敏帧；不上传原图）— 最终回退。
4. **本地推理可用率从 70% 升 85%**（三档合计）；仅 7B VLM 单押 (35-45%) **已写入 v3 §9.3 #12 不进 MVP**。
5. v2 "本地优先" + "云端仅在显式同意时启用" 两条立场**仍然成立**；v3 改变的是"仅押注 7B VLM"的失败假设。
6. 已落入 AI Feature Evaluation v3 §3.6.1.1 + §3.6.6。
7. **强烈建议升 DECISION_LOG**。

**Q-F2 — 条件接受**：
1. MVP 首选 **MiniCPM-V 4.5 (int4)**（OpenCompass 77.0；视频帧 96x 压缩契合 60s buffer；中文强）。
2. MVP 备选 **Qwen2.5-VL-7B-Instruct (Apache 2.0)**（License 最稳）。
3. **前置条件**：MiniCPM-V 4.5 商用条款**法务过完才锁定**；如不过，主线切 Qwen2.5-VL-7B。
4. License 红线：Gemma-3 / Qwen2.5-VL-3B（仅研究用）/ LLaVA-NeXT **不进 MVP**。
5. 已落入 v3 §3.6.6 #6 + §9.3 #13。
6. **建议升 DECISION_LOG**（涉及 License 风险）。

**Q-F3 — 接受 + 命名优化**：Onboarding 硬件检测策略采用"首启 30s benchmark + 三选一兜底"。文案改为更用户友好的：
1. ①**仅文本对话**（关闭 VLM 全功能）
2. ②**本地轻量识别**（CNN 初筛 only，不调本地 VLM）
3. ③**启用云端兜底**（需用户授权 + 显式同意条款）
4. 默认三档混合（CNN + 本地 VLM）；用户只在三选一里看到"性能受限时的降级选项"。
5. 已落入主文档 §13.4 #6 + AI Eval v3 §9.1 #12。

### 2.4 Task G（A1 Now Playing）

**Q-G1 — 接受立场，但需升项目级**：
1. PM 立场：默认 **双轨发布** — MAS 版本砍 macOS A1 MediaRemote、仅保留 MCP 路径；Developer ID 自分发版完整功能。
2. 理由：MediaRemote 是 macOS 私有 framework，**App Store 分发必拒**；但 C 端桌宠 MAS 分发对用户信任 + 安装便利有意义，不能放弃。
3. **强烈建议升 DECISION_LOG**：影响项目级分发战略；不是分支级能 self-contain 的决定。
4. 已落入主文档 §13.5.1 #11 + §13.5.2 #3。

**Q-G2 — 接受**：§4.4 MCP + A1 OS API **并存**策略（MCP 优先 / OS API 兜底）；合并覆盖率 75-85%。已落入主文档 §10.3 #4。

**Q-G3 — 接受**：未验证的 SMTC 上报情况（腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC + QQ 音乐 / 网易云 macOS 国服）由 **Engineering 在 beta 阶段埋点验证**（比 Radar 单独实测更高效 — 用户真实硬件 + 真实 app 配置）。已落入主文档 §13.3 #7。

## 3. PM 未答（属 Engineering 范围）的 Radar §7 四个问题

1. Context Capture Adapter v2 是否接受 Task D 分平台路径？— **Engineering 评估**。
2. VLM 混合架构是否接受 Task F"CNN 初筛 + VLM 兜底"作为默认？— **Engineering 评估**；CNN 选型由 Engineering 决定（建议 MobileNet / EfficientNet 起步）。
3. Tab Detection Adapter 是否接受 Task E 三 provider 架构？— **Engineering 评估**。
4. A1 SourceAppUserModelId 白名单建议？— **Engineering 评估**；PM 建议起点白名单：QQ 音乐 / 网易云 / Apple Music / Spotify / Bilibili / foobar2000。

## 4. Files Modified（PM 视角）

1. ✅ `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` — v2.3.4 → v2.4。
2. ✅ `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` — v2 → v3（重写 §3.6 / §3.6.6 / §3.10.6 / §9）。
3. ✅ `01-pm/branches/memory-dataset/README.md` — Status / Transitions 同步。
4. ✅ 本文件（PM ack 群消息）。

## 5. Files Not Modified

1. Radar 4 个产物（属 Radar 写区）。
2. `06-sync/TASK_BOARD.md` / `SYNC_SUMMARY.md` / `THREAD_REGISTRY.md`（Main Thread 写区）。
3. `decisions/DECISION_LOG.md`（待 Main Thread 升项目级；候选 11 条见主文档 §13.5.1）。
4. 项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md`（PRIVACY_BOUNDARY 修订提案仍 Pending Main Thread）。
5. 4 份 PM 派单消息 `06-sync/dm/pm-to-radar/2026-05-12T09-13-46_*.md`（保留为诉求记录）。
6. 其他分支 / `02-design/` / `03-engineering/`。

## 6. 强烈建议 Main Thread 升项目级的 4 条 PM 立场

按重要度排：

| # | 立场 | 为什么必须升项目级 |
|---|---|---|
| 1 | **Q-F1 VLM 三档混合架构 + 本地可用率目标 ≥85%** | 改变 AI 必要性 / 模型选型 / 成本上限 / 硬件门槛，影响 Engineering 全栈选型 |
| 2 | **Q-G1 双轨分发**（MAS 砍 macOS MediaRemote / Developer ID 完整） | 影响项目级分发战略；不是分支级决定 |
| 3 | **MiniCPM-V 4.5 商用条款法务核验**（Q-F2 前置） | License 风险，未过则主线切 Qwen2.5-VL-7B |
| 4 | **aubio GPL-3.0 IPC 隔离要求**（Q-D2 前置） | License 风险，不隔离则传染整个二进制 |

## 7. Next Thread

**Main Thread** — 按 Radar §8 收口动作：

1. `TASK_BOARD.md` 标记 Radar 第二批四个任务条目为 `Done`，链回 Radar 通告与 4 个产物 + 本 PM ack。
2. `SYNC_SUMMARY.md` §2 / §6 / §7 增条目；详见 Radar §8。
3. 视情况在 `DECISION_LOG.md` 留痕本批 PM 立场升项目级（特别是 §6 前 2 条），但**用户已指示本轮不升项目级**，需用户授权。

**或者** —— **Engineering Build Thread** 接续：

1. Context Capture Adapter v2（含 audio + 多 OS 路径）。
2. VLM 混合架构（含 CNN 初筛模型选型）。
3. Tab Detection Adapter（含国产浏览器 beta 验证）。
4. A1 SourceAppUserModelId 白名单。
5. 回写 OQ #8（查询接口 SLA）。

## 8. Whether User Input Is Needed

**Optional** — 本轮 PM 工作不阻塞用户。但如果用户希望立刻把 §6 前 2 条 P0 立场升项目级（让 Main Thread 一次性写入 `DECISION_LOG.md` / `SYNC_SUMMARY.md`），可现在告知 Main Thread。

否则 PM 立场以本分支 `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.4 + `AI_FEATURE_EVALUATION_memory-dataset.md` v3 为准，等 Engineering 接手时再以"项目级"形式收口。
