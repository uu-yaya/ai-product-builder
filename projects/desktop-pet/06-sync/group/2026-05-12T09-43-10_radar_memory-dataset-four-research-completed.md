# Radar → Group: memory-dataset 第二批四项调研同步完成

> Thread: AI Trend Radar Thread
> Filed at: 2026-05-12T09-43-10
> Branch: `memory-dataset`
> Trigger: 4 份 PM DM 委托 `06-sync/dm/pm-to-radar/2026-05-12T09-13-46_pm_*.md`

## 1. 完成情况一句话

PM 在 2026-05-12 上午派发的四项 Radar 调研委托**全部完成并落盘**到 `04-research/branches/memory-dataset/`；本通告请 Main Thread 收口到 `06-sync/SYNC_SUMMARY.md` / `TASK_BOARD.md`，并视情况安排 PM Strategy Thread 接续阅读。

## 2. Files Created（4 个研究 + 1 个通告）

| 文件 | 大小 | 类型 | 对应 PM DM |
|---|---|---|---|
| `04-research/branches/memory-dataset/TREND_RESEARCH_audio-derivation-libraries.md` | 18.6 KB | Task D 调研报告 | `audio-derivation-libraries-radar-research.md` |
| `04-research/branches/memory-dataset/TREND_RESEARCH_browser-tab-detection.md` | 16.2 KB | Task E 调研报告 | `browser-tab-detection-radar-research.md` |
| `04-research/branches/memory-dataset/TREND_RESEARCH_local-vlm-feasibility.md` | 21.4 KB | Task F 调研报告 | `local-vlm-feasibility-radar-research.md` |
| `04-research/branches/memory-dataset/TREND_RESEARCH_os-now-playing-api.md` | 17.6 KB | Task G 调研报告 | `os-now-playing-api-radar-research.md` |
| `06-sync/group/2026-05-12T09-43-10_radar_memory-dataset-four-research-completed.md` | — | 完成通告（本文件） | 4 份 DM 共同 |

合计 4 份调研约 73.7 KB / ~21K 字。

## 3. Files Not Modified

- `01-pm/`、`02-design/`、`03-engineering/`、其它已有 `04-research/` 主题文件夹
- `06-sync/TASK_BOARD.md`、`SYNC_SUMMARY.md`、`THREAD_REGISTRY.md`、`decisions/DECISION_LOG.md`
- `00-context/*`（仅读）、`workspaces/`、`~/.codex/`、`~/.agents/skills/`、`memory/`
- 4 份 PM DM 文件
- 昨日已落盘的 5 个 memory-dataset 产物（`TREND_RESEARCH_behavior-signal-libraries.md`、`TREND_RESEARCH_china-app-mcp-server-capabilities.md`、`MOCK_DATA_cross-source-memory-dataset.json`、`MOCK_DATA_cross-source-memory-dataset.md`、昨日的 `2026-05-11T17-52-51_radar_*.md` 通告）

## 4. Key Findings 摘要（每项 3–5 条）

### 4.1 Task D — 音频派生信号库（A0）

1. **MVP 首选 aubio**（GPL-3.0）做原型；**License 友好长期路线** = BeatNet (CC-BY-4.0) + cpal/librosa rms 自实现 RMS / silence。
2. **不推荐 Essentia / madmom / Gemma 类**：Essentia AGPL-3.0 对客户端嵌入是硬约束；madmom Python 3.10+ 兼容性破损 + 2 年无新版。
3. **OS 音频流接入**：macOS 14.2+ 走原生 Core Audio Tap；macOS < 14.2 用 BlackHole 兜底；Windows 直接 WASAPI loopback。
4. **PM §3.10.5 估算复核**：单帧延迟 ≤200 ms **成立**（aubio / BTrack / Essentia streaming 均满足）；CPU ≤5% 单核**对纯 DSP 库成立、对神经网络库需实测**。**建议新增"首拍稳定时间（warmup）"指标**（典型 5–10 秒）。
5. **L2 / L3 排除项已确认无技术歧义**：所有候选库均能在不涉及内容识别的前提下提供 A0 信号。

### 4.2 Task E — 浏览器多 tab 检测

1. **MVP 首选**："**浏览器扩展 + Native Messaging**"——合规、跨平台（Chrome / Edge / Firefox / Safari / Arc / 国产 Chromium 衍生）、用户体验最好。
2. **备选**：macOS AppleScript（用户不愿装扩展时兜底）；Windows UIA 读地址栏 Edit 控件（fallback）。
3. **不推荐**：mcp-chrome 类全功能 MCP（权限过大、违反"不读页面内容"原则）；窗口标题文本（缺域名、易被 SPA 污染）。
4. **国产浏览器现状**：360 / QQ / 搜狗 / Edge 国内版 / UC 大多兼容 Chromium 扩展（推测，建议灰度验证）；IE 兼容核下 UIA 路径完全失效。
5. **关键 PM 约束验证通过**：所有方案都能做到"**只识别 tab 身份，不读取页面内容**"，符合 §4.7.4 + §4.11 边界。视频类 VLM 与游戏类 VLM 的 Context Provider 应在桌宠侧解耦。

### 4.3 Task F — 本地 VLM 可行性

1. **MVP 首选 MiniCPM-V 4.5（int4）**：OpenCompass 77.0；**视频帧 96x 压缩**（6 帧 → 64 tokens），对 60s buffer 场景天然契合；清华 OpenBMB 出品，原生中文强。
2. **MVP 备选 Qwen2.5-VL-7B（Q4_K_M）**：Apache 2.0 License 最稳（**只有 7B 版**，3B 是 Research License 禁商用，72B 有 MAU 上限）；OCRBench 88.8。
3. **PM §3.6.6 估算复核**：
   - "本地推理可用率 ≥70%" 在**仅押 7B VLM** 时**不成立**（中国桌面玩家估算仅 35–45%）；
   - **必须改为 CNN 初筛 + 2–4B VLM 兜底 + 云端最终兜底三档混合**，混合下 ≥85%；
   - "准确率 ≥75%"在封闭标签集前提下可达；
   - "隐私穿透 0 容忍"**不能靠模型 prompt**，必须靠系统架构（schema 强约束 + 后置过滤 + 白名单 + 输入预处理）四层兜底。
4. **License 红线**：Gemma-3 / Qwen2.5-VL-3B / LLaVA-NeXT 不进 MVP；MiniCPM-V 4.5 商用条款需法务核验。
5. **数据空缺**：Steam Hardware Survey 中国地区 GPU 切片官方数据未取得，建议 beta 用户首 3 个月埋点采集。

### 4.4 Task G — OS Now Playing API（A1）

1. **Windows 主路径 SMTC**（`Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager`）：完全公开、Win10 1809+ 全覆盖、无 TCC、字段完整，**强烈推荐**。
2. **macOS 主路径 MediaRemote**：私有 framework，**15.4 起被 Apple 收紧**第三方 dlopen 全部失效；需通过 `ungive/mediaremote-adapter`（v0.7.6, 2026-05-11）兜底；**App Store 分发必拒**，自分发可用但存在长期破裂风险。
3. **中国 app 已验证**：QQ 音乐 2024-06-13 起原生 SMTC；网易云需 inflink-rs 插件；酷狗 SMTC 无时间轴；Bilibili PC 客户端有"多媒体会话服务"开关（设置 → 播放设置）。
4. **国产 app 未验证**：腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC SMTC 状态；QQ 音乐 / 网易云 **macOS 国服**是否上报 Control Center。**建议下一阶段实测验证**。
5. **与 §4.4 MCP 分工**：MCP 优先（结构化字段更丰富）、OS API 兜底（覆盖面更广），两者并存，合并覆盖率估算 75–85%。

## 5. Source Quality

- 4 份调研全部基于**联网实地检索**（一级源：Apple Developer / Microsoft Learn / 各 GitHub 仓库 / HF 模型卡 / arXiv / Steam Hardware Survey；二级源用作交叉验证）。
- **事实 / 观点 / 推测三层分层标注**在每份调研末尾显式列出。
- **未取得的数据明确标注 + 建议方法**（如 Steam 中国 GPU 切片建议 beta 埋点；macOS 国服 SMTC 上报建议实测验证；BeatNet / CPU 占用建议自跑 benchmark）。
- 4 份产物**GFM pipe table 格式**统一，符合 `PROJECT_RULES.md` §5.1。
- 全程未访问私有 API 文档、未泄漏 token、未调研逆向 / hook / 爬虫 / Playwright 范畴。

## 6. Questions for PM Strategy Thread

### 6.1 Task D（A0 音频派生）

1. **Q-D1**：是否接受 Radar 建议——在 §3.10.5 新增 "**首拍稳定时间（warmup）= 5 秒**" 指标？warmup 内桌宠不应根据 BPM 做反应，避免错乱。
2. **Q-D2**：是否同意 A0 MVP 走 aubio（GPL-3.0）原型 + 长期路线切 BeatNet + cpal 自实现的两阶段策略？

### 6.2 Task E（浏览器 Tab）

3. **Q-E1**：是否锁定"浏览器扩展 + Native Messaging"作为 MVP 首选 + AppleScript / UIA fallback？需在 §4.7.4 留痕。
4. **Q-E2**：国产浏览器（360 / QQ / 搜狗 / UC）是否纳入 MVP 首发？建议作"Beta 支持"标，按 beta 数据决定。

### 6.3 Task F（本地 VLM）

5. **Q-F1**：是否同意 §3.6.6 修正——把"本地推理可用率 ≥70%"重写为"**CNN 初筛 + 2–4B VLM 兜底 + 云端最终兜底 三档混合下 ≥85%**"？这是本调研最关键的 PM 立场更新建议。
6. **Q-F2**：是否锁定 MiniCPM-V 4.5 (int4) 作为 MVP 首选 + Qwen2.5-VL-7B (Apache 2.0) 作备选？需法务先过 MiniCPM-V 4.5 商用条款。
7. **Q-F3**：Onboarding 硬件检测策略是否同意"首启 30 秒 benchmark + 三选一兜底（关闭 / CNN-only / 云端）"？

### 6.4 Task G（A1 Now Playing）

8. **Q-G1**：桌宠目标分发渠道是否包含 Mac App Store？如是，macOS A1 信号在 MAS 版应**禁用**，仅在 Developer ID 自分发版启用——需 PM 立项阶段锁定。
9. **Q-G2**：是否同意 §4.4 MCP + A1 OS API 并存策略（MCP 优先 / OS API 兜底）？
10. **Q-G3**：腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC SMTC 上报、QQ 音乐 / 网易云 macOS 国服 `MPNowPlayingInfoCenter` 上报——这些"未验证"项是否启动实测验证？由 Engineering 或 Radar 哪个线程负责？

## 7. Questions for Engineering Build Thread（参考阅读，不在本次决策范围）

1. **Context Capture Adapter v2**：是否接受 Task D 的"macOS 14.2+ 走 Tap / < 14.2 走 BlackHole / Win WASAPI loopback"分平台路径？
2. **VLM 混合架构**：是否接受 Task F 的"CNN 初筛 + VLM 兜底"作为 VLM 模块默认架构？CNN 初筛模型选型由 Engineering 决定（建议 MobileNet / EfficientNet 起步）。
3. **Tab Detection Adapter**：是否接受 Task E 的"扩展 + Native Messaging"为主 + AX / UIA 为 fallback 的三 provider 架构？
4. **A1 SourceAppUserModelId 白名单**：建议 SMTC 仅采白名单 source（QQ 音乐 / 网易云 / Apple Music / Spotify / Bilibili / foobar2000 等），其它直接丢弃。

## 8. Whether Main Thread Needs to Update SYNC_SUMMARY

**Yes** — 建议 Main Thread：

1. 在 `06-sync/TASK_BOARD.md` 增加或更新 Radar 四个任务条目（Task D / E / F / G），状态置为 `Done`，链回本通告与 4 个产物。
2. 在 `06-sync/SYNC_SUMMARY.md`：
   - §2 Latest Decisions：增 1 行 "2026-05-12 Radar 完成 memory-dataset 分支第二批四项调研（音频派生 / Tab 检测 / 本地 VLM / Now Playing API）"，链回本通告。
   - §6 Next Actions：增加 "PM Strategy Thread 接续阅读 4 个产物，回答 §6 中的 10 个 Questions；其中 Q-F1（本地推理可用率估算重写）和 Q-G1（Mac App Store 分发决策）建议升级到 `decisions/DECISION_LOG.md`"。
   - §7 Links to Important Messages：增 5 行链接到 4 个新产物 + 本通告。
3. 视情况判断是否需要 `decisions/DECISION_LOG.md` 留痕（**Q-F1** 是最关键的 PM 立场升级，**Q-G1** 涉及分发渠道战略决策）。

## 9. Suggested Next Thread

**PM Strategy Thread** — 阅读 4 个产物，回答 §6 中的 10 个 Questions；其中至少 Q-F1 / Q-G1 应升级到项目级决策（DECISION_LOG）。

如 PM 暂不接手，**回到 Main Thread** 做 §8 收口动作，并视情况安排：
- **Engineering Build Thread** 接续：Context Capture Adapter / VLM 混合架构 / Tab Detection Adapter / SMTC 白名单四个技术设计点
- **Radar Thread**（可选后续）：腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC SMTC 上报实测（如 PM 决定由 Radar 承担）；中文游戏 UI 上的 VLM 语义标签准确率实测；Steam 中国地区 GPU 切片埋点策略
