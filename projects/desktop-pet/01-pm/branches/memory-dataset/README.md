# Branch: memory-dataset

## 1. Meta

1. Branch Slug：`memory-dataset`
2. Owner Thread：PM Strategy Thread
3. Started：2026-05-11
4. Status：Draft v2.5 + AI Eval v3（v2.5 用户决定扩展采集面：档 A 增量 A1+A2+A3 / OS API 6 通道 / 浏览器扩展全方位 6 类 / OS Scripting Bridge 新增接入桌面 app / CLI + IFTTT 补充通道；VLM 视频类保留 v2.4 不动；§10 键盘分级扩展到 L1.5；项目级决策候选清单 11 → 15 条）
5. Cross-role Mirror：`02-design/branches/memory-dataset/` / `03-engineering/branches/memory-dataset/` / `04-research/branches/memory-dataset/`（按需自然生长，本轮 PM 只建本目录）

## 1.5 分支本质（v2.3.3 框架精确化，2026-05-11 19:30）

1. `memory-dataset` 字面像"过去的记忆数据"，**实际范围比字面更宽**。
2. 本分支实质 = 桌宠的"**脑**" = 全部数据感知层（用户内容 + 环境状态 + 长期记忆 + 实时上下文）。
3. 平行分支 `voice-interaction`（待启动）= 桌宠的"**嘴和耳**" = 语音 I/O 通道（麦克风 / TTS / STT 引擎 / 唤醒词 / 音色管理）。
4. **关键原则**：memory 层是**内容层**，不关心数据怎么拿到的。所有数据（VLM / audio A0 / chat / game event / active_app 等）在 memory 层都**不携带采集通道元数据**。chat 文本"来自键盘"和"来自 STT"也不区分。
5. **两分支接口 = 干净文本边界**：voice-interaction 输出**干净文本** → memory-dataset §4.1 chat 通道。无 input_modality 标记 / 无 STT confidence 透传 / 无原始音频引用。
6. **性质模糊时**默认归 voice-interaction（向 memory-dataset 加新数据类别门槛更高）。
7. 详细字段归属速查 + "脑 vs 嘴和耳"类比 见主文档 [`REQUIREMENT_CLARIFICATION_memory-dataset.md`](REQUIREMENT_CLARIFICATION_memory-dataset.md) §0.0。

## 2. Core Question

1. 桌宠端为了让自己"更像知心好友 + 游戏搭子"，**需要从记忆系统拿到哪些数据、字段粒度多细、消费方式如何**？
2. 上述需求与现行 P0 `Context Lite Memory` 边界 / `PRIVACY_BOUNDARY_memory-system.md` 白名单是否一致？冲突点在哪？要怎么收口？

## 3. Upstream Evidence

1. `04-research/chenmo_chat_output.json` — 记忆系统对剑灵 mock 聊天的输出（12 段 segments，含 atomic_facts / episode / profile 三层结构）
2. `04-research/剑灵Mock数据-聊天.docx` — 记忆系统的**输入**侧 raw chat schema
3. `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` — 记忆系统从桌宠"用什么"视角的 PM 清单
4. `01-pm/PRIVACY_BOUNDARY_memory-system.md` — 既有隐私白名单 / 硬约束
5. `04-research/companion-product-market/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` — 功能优先级映射
6. `04-research/context-memory-frameworks/TREND_RESEARCH_desktop-context-memory-frameworks.md` — PC 上下文记忆框架调研
7. 用户 2026-05-11 口头会议纪要：聊天 / 行为 / APP MCP / 游戏数据四大类（详见主文档 §2.4）

## 4. Deliverables

1. `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.4 — 桌宠对记忆系统的数据需求文档（文字 + 表格，全条目编号）
2. `AI_FEATURE_EVALUATION_memory-dataset.md` v3 — 桌宠对记忆系统数据消费的 AI 必要性 / 编排 / 部署立场（含 VLM 三档混合架构）
3. `PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md` — 项目级 PRIVACY_BOUNDARY 修订提案（待 Main Thread 审议）
4. 本 README

## 5. Linked Decisions / Open Questions

1. 与 `decisions/DECISION_LOG.md` 已锁定的 P0 `Context Lite Memory` 边界互动；具体待澄清项见主文档 §9 Open Questions。

## 6. Status Transitions

1. 2026-05-11 早：Draft v1 初稿落盘。
2. 2026-05-11 17:10：Draft v2 — 用户 OQ 答复收口（10 条 9 个 Resolved + 1 个 Partially Resolved），新增 mock schema 段、键盘信号分级标准、硬约束逐条解释。
3. 2026-05-11 17:10：3 份 Radar 调研派单消息写入 `06-sync/dm/pm-to-radar/`。
4. 2026-05-11 17:30：Draft v2.1 — 用户反馈 4 项收口 + VLM 措辞修正。
   1. VLM 从"白名单页"改为"该桌宠绑定单游戏的整体开关"（§4.7 重写）。
   2. 键盘分级新增"研发自由度规则"小节（§10.1）：L0 / L1 内字段 Engineering 可改，L2 / L3 不可跨越。
   3. Radar 状态修正：用户已自行启动，PM 派单消息保留为诉求记录，Main Thread 后续收口。
   4. §4.3.1 / §12 用户已认可，无改动。
5. 2026-05-11 17:53：Radar 三项调研完成（通告 `06-sync/group/2026-05-11T17-52-51_radar_memory-dataset-three-research-completed.md`）。
6. 2026-05-11 18:00：Draft v2.2 — PM 答 Radar §6 4 问 + 接受 5 处 mock 字段扩展。
7. 2026-05-11 18:15：新增 `AI_FEATURE_EVALUATION_memory-dataset.md` v1 — 18 个 AI 候选点的必要性 / 推荐方案 / 部署 / 评估指标 / 失败兜底；MVP 进入 10 个、P1 评估 2 个、不进 MVP 强声明 5 类。
8. 2026-05-11 18:45：用户引入"陪用户看视频 / 随音乐舞动"两个 MVP 愿景；PM 评估方案 D（不是用户原选 C），用户接受。三个产物升级：
   1. `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3 — Playwright 从禁止改 P2 受限放行；VLM 白名单扩展到视频 app；新增 §4.10 系统音频派生信号 + §10.3 音频信号分级；新增 §4.11 Playwright 受限放行；mock §11.10 / §11.11 / §11.0 同步。
   2. `AI_FEATURE_EVALUATION_memory-dataset.md` v2 — 新增 §3.10 audio 派生 / §3.11 Playwright snippet；扩展 §3.6 VLM 视频类；总览矩阵 13 个 AI 候选点；部署矩阵新增 audio 强制本地 + Playwright 本地优先；MVP 范围 11 项 + P2 1 项；不进 MVP 11 类。
   3. **新建** `PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md` — 提议把项目级 PRIVACY_BOUNDARY §2 #2 拆为 A0-A3 分级、VLM 白名单从单游戏扩到单 app 实例、新增 #8 Playwright 受限放行。**未直接修改项目级文件，待 Main Thread 收口**。
9. 2026-05-11 19:00：用户提出后续接入语音功能。PM 拆解为 7 种含义后，用户决定**语音单开新分支** `voice-interaction`，听音乐跳舞（audio A0 / A1）继续留 memory-dataset。本分支 v2.3.1 范围划定：
   1. 主文档新增 §0.4 分支范围划定 + §4.10.0 范围说明；明确本分支 audio 只承接"系统音频流派生 + Now Playing 标识"，不含麦克风 / STT / TTS / 声纹。
   2. AI_FEATURE_EVALUATION 顶部加 Branch Scope 声明。
   3. PRIVACY_BOUNDARY 修订提案新增 §0 范围声明：本提案只覆盖 memory-dataset 范围；麦克风 / STT 边界变更需 voice-interaction 分支另起 amendment。
   4. 未建 `01-pm/branches/voice-interaction/` 目录 — 等用户启动该分支时再建。
10. 2026-05-11 19:15：用户反馈 "memory-dataset 这个名字看不出来包含 audio"。PM 加 **分支本质澄清**：
    1. README 新增 §1.5 分支本质 + 分工标准（被动观察 vs 主动交互）。
    2. 主文档新增 §0.0 分支本质（含真人朋友类比 + 详细字段归属速查表）。
    3. **不改名**（成本太高，会动几十处交叉引用与 git 历史）；用范围说明解决 80% 误读。
11. 2026-05-11 19:30：用户连续两次挑战 v2.3.2 "被动 vs 主动"框架不准（"未来也需要用户主动数据"、"语音文字应该都是用户说的话"）。PM 承认框架不精确，修订为 **v2.3.3 "脑 vs 嘴和耳"**：
    1. 主文档 §0.0 完全重写：从"被动 vs 主动"换成"数据感知层（脑）vs I/O 通道（嘴和耳）"。
    2. 关键原则：memory 层是**内容层**，与项目既有模式一致（VLM / audio / game event 都不携带采集通道），chat 文本"来自键盘"和"来自 STT"在 memory 层无差别。
    3. README §1.5 同步重写。
    4. §0.4 跨分支约定升级为"**干净文本边界**"：voice-interaction → memory-dataset 接口只传一行 text，不传 input_modality / STT confidence / 音频引用。
    5. **不**给 §11.1 chat mock 加 input_modality 或 stt_confidence 字段（违反项目模式）。
12. 2026-05-11 19:45：用户问"桌宠怎么知道开的是 Bilibili 还是 YouTube，是不是看屏幕内容"。PM 澄清：**不是看屏幕（VLM），是 OS 进程信息（active_app）+ 窗口标题（window_title）**。v2.3.4 加 **VLM 依赖链原则**：
    1. §4.7.2.1 新增"VLM 不负责识别 app 身份"原则 + 依赖链 `active_app → VLM 是否启动 → 看到的场景标签`。
    2. §4.7.3 游戏类细则加"前置依赖：active_app 匹配预设游戏标识"。
    3. §4.7.4 视频类细则加"前置依赖：active_app + window_title 匹配用户白名单"；浏览器多 tab 场景靠 window_title 或浏览器 MCP 区分 tab。
    4. 不动 mock、不动 PRIVACY_BOUNDARY 提案、不动 AI Feature Evaluation（依赖关系本身就在 active_app + VLM 既有定义里，本次只是显式化）。
13. 2026-05-12 09:13：用户选组合 B，**派 4 份 Radar 补充调研**（P0 三件套 + P1 浏览器 tab）。落盘到 `06-sync/dm/pm-to-radar/`：
    1. `2026-05-12T09-13-46_pm_audio-derivation-libraries-radar-research.md` — 音频派生信号库（aubio / Essentia / BeatNet / madmom 等）实时性能 / 跨平台 / PM §3.10.5 估算复核。
    2. `2026-05-12T09-13-46_pm_os-now-playing-api-radar-research.md` — macOS MediaRemote / Windows SMTC 公开能力 + 国产 app 上报情况 + 中国地区可用性。
    3. `2026-05-12T09-13-46_pm_local-vlm-feasibility-radar-research.md` — 2026 消费级硬件能否跑 7B VLM 实时陪伴；候选模型对比；PM §3.6.6 估算复核；目标用户硬件分布。
    4. `2026-05-12T09-13-46_pm_browser-tab-detection-radar-research.md` — 浏览器多 tab 合规检测（UIA / Accessibility / 浏览器扩展 / MCP）；只识别 tab 身份不读内容。
14. 2026-05-12 09:43：Radar 第二批四项调研完成（通告 `06-sync/group/2026-05-12T09-43-10_radar_memory-dataset-four-research-completed.md`，含 10 个 PM 问题）。
15. 2026-05-12 10:00+：用户进一步反馈"行为数据用户操作"和"娱乐工作 APP MCP"限制太大。PM 进入 Brainstorming First（v2.5 merged Rules 之后第一次正式应用），列 17 候选 idea；用户选定档 A 增量 + OS API + 浏览器全方位 + OS Scripting Bridge；VLM 视频类保留不动。
16. 2026-05-12 10:30：进入 **v2.5 全量修订**：
    1. §0.6 新增 v2.5 修订摘要（8 条）。
    2. §3 总览表新增 4 行（OS API 通道 / 浏览器扩展全方位 / OS Scripting Bridge / CLI+IFTTT）。
    3. §4.3 全面重写：A1 派生信号扩展（5 新字段） + A2 操作语义事件（8 字段，OS 级语义事件名） + A3 编辑动作派生（5 字段）+ 排除项加强（10 条）。
    4. §4.4 重构为"6 通道并存总览"：MCP（v2.4 沿用）+ OS API 6 类 + 浏览器扩展全方位 6 类 + OS Scripting Bridge（§4.12）+ CLI 调用 + IFTTT 桥接。
    5. **§4.12 新增 OS Scripting Bridge**（osascript / AppleScript + PowerShell COM Automation）：接入桌面客户端 app 元数据（Spotify / Music / VLC / IINA / Notes / Bear / Things / Office / Outlook / Reminders 等）；6 节细则。
    6. §10 键盘分级扩展为 5 层（含 L1.5 编辑动作派生层）。
    7. §13 Engineering 接手清单从 8 项扩展到 14 项；项目级决策候选 11 → 15 条；Design 面板需求 7 → 13 条。
    8. **未直接修改**：§4.7.4 VLM 视频类（保留 v2.4 不动）；mock §11.x 暂不全量更新；AI Eval 同步顶部 + Branch Scope；PRIVACY_BOUNDARY 修订提案保持 Deferred 状态但加注 v2.5 新增 OSA / COM / OS API / 浏览器扩展全方位通道一并 voice-interaction 启动时合并审议。

17. 2026-05-12 09:52：PM 答 10 问 + 大幅修订三个产物：
    1. `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 → v2.4：§0.5 新增 v2.4 摘要、§4.7.4 锁定浏览器扩展 + Native Messaging 主路径 + 国产浏览器 Beta、§10.3 加 audio warmup 5s + OS 音频流接入策略、§13 重写为 13.1-13.5.2 全面更新（含 11 条项目级决策候选 + 4 条法务 / 合规前置项）。
    2. `AI_FEATURE_EVALUATION_memory-dataset.md` v2 → v3：§0 新增 v3 摘要、§1 一句话结论扩展到 15 个 AI 候选点、§2 总览矩阵 VLM 行改写、**§3.6 重写为三档混合架构**（CNN 初筛 + 2-4B VLM 兜底 + 云端最终兜底）、**§3.6.6 评估指标重写**（≥85% 可用率 + 4 层架构兜底 + License 红线）、§3.10.6 加 warmup + License、§9.1 MVP 范围扩展到 12 项、§9.3 不进 MVP 扩展到 14 类。
    3. PM ack 群消息：`06-sync/group/2026-05-12T09-52-06_pm_memory-dataset-radar-batch2-ack.md`。
    4. **未直接修改**：mock §11.x（无字段变更）、PRIVACY_BOUNDARY 提案（无范围变更）、其他线程产物 / 项目级文件。
    5. **强烈建议升项目级 4 条**：Q-F1 VLM 三档混合 + Q-G1 双轨分发 + MiniCPM-V 4.5 法务核验 + aubio IPC 隔离。用户未指示本轮升项目级。
   1. Q1 MCP：MVP 首批锁 3 个（dida / feishu / steam），P1 后半段 2 个（office / dingtalk）— §4.4.4 新增。
   2. Q2 番茄类：移除（与腾讯视频等并列"不接入清单"）— §4.4.4 #4。
   3. Q3 mock 5 处扩展：全部接受 — §11.0 / §11.1 / §11.5 / §11.6 / §11.7 / §11.9 同步。
   4. Q4 PM 命名 review 边界：不逐字段，守 4 类边界 — §10.2 新增。
   5. PM ack 群消息：`06-sync/group/2026-05-11T17-52-51_radar_memory-dataset-three-research-completed.md` 的回复在 `06-sync/group/<本轮 PM ack 文件>`。
7. 待办：
   1. Main Thread 收口 Radar 结论到 `DECISION_LOG.md` / `SYNC_SUMMARY.md` / `TASK_BOARD.md`（按 Radar §8）。
   2. Main Thread 视情况升项目级决策（候选清单见 §13.4.2）。
   3. Engineering Build Thread 接 schema 可行性对齐 + OQ #8 SLA 评估。
   4. Design Prototype Thread 接 Memory Center / 桌宠设置面板需求点。
   5. 视情况升级为 PRD 或 AI Feature Evaluation。
