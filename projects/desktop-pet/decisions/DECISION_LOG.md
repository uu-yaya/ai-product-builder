# Project Decision Log

记录本项目的关键架构、范围、AI 方案、设计、工程、上线、合规等决策。
每条决策都要留下推理依据，便于后续线程或新协作者快速理解项目走到这一步的原因。

## 字段说明

- **Date**：决策落地日期，YYYY-MM-DD。
- **Area**：Project Setup / Scope / AI / Design / Engineering / Launch / Risk / Compliance / Other。
- **Decision**：一句话写明做了什么决定。
- **Reason**：为什么这样决定（背景 + 比较过的备选）。
- **Impact**：影响哪些线程 / 哪些产物 / 哪些指标。
- **Status**：Proposed / Accepted / In Effect / Superseded / Rejected。

## 决策表

| Date | Area | Decision | Reason | Impact | Status |
|---|---|---|---|---|---|
| YYYY-MM-DD | Project Setup | Use this project template for APB outputs | Keep project artifacts separate from APB workspace methods | Improves clarity and multi-thread collaboration | Proposed |
| 2026-04-28 | Project Setup | desktop-pet 项目从 `_PROJECT_TEMPLATE` 复制创建，定位为公司业务方向探索（游戏 AI 桌宠 SDK），按 APB Safety Rules 不写入公司机密 / 真实业务数据 / 内部代号 / 合作方信息 | 验证 APB 多线程协议；探索“可赋能多游戏的 AI 桌宠 SDK”产品形态 | 启用全部 5 个工作区目录；Stage = Discovery；所有产物按 `memory/GLOBAL_CONTEXT.md` 的 Safety Notes 脱敏处理 | Accepted |
| 2026-05-09 | Compliance | P0 记忆系统采集策略提议为白名单式 `Context Lite Memory`：first-party game events、用户主动对话 / 反馈、桌宠互动偏好、低敏 active app / window title / idle context；默认不采集 Recall 式后台截图、系统音频、键盘输入、跨 app 全文和 raw OS context 云端上传 | Radar 与 PM 已分别输出技术框架调研、需求澄清和隐私边界；该策略能降低“监控电脑”感知，但仍需用户确认默认开关、保留期、云端 LLM 边界和跨游戏共享策略 | 影响 PM T-001、Design Memory Center、Engineering Context Capture Adapter 与后续隐私评审；在用户确认前不能视为最终上线范围 | Proposed |
| 2026-05-09 | Project Setup | 项目研究文档统一使用 GitHub Flavored Markdown pipe table，不再使用 HTML table 作为 `.md` 表格表达 | Radar 已修复性能研究文档的表格渲染问题，并把规则写入 `PROJECT_RULES.md` §5.1；GFM pipe table 更适合 Codex / GitHub / 本地预览一致渲染 | 影响后续 `04-research/` 表格类产物与跨线程 Markdown 交付规范 | Accepted |
| 2026-05-11 | Scope | desktop-pet 的研究与 MVP 澄清主场景收紧为“现有游戏内嵌桌宠 / 伴侣 / mascot / SDK 能力”，独立桌面桌宠应用降级为次要参考 | Radar Thread 记录了用户澄清：“实际场景是在现有游戏里内嵌桌宠”以及“就是要 Steam 的游戏”；后续 Steam 内嵌伴侣调研已基于该范围展开 | 影响 PM T-001 的 MVP 路线、AI 必要性评估、Design 的产品形态参考、Engineering 的 SDK / middleware / game event 接入边界 | Accepted |
| 2026-05-11 | Project Setup | `04-research/` 按研究主题归档；同一 project 内后续新问题支路统一使用各角色目录下的 `branches/<branch-slug>/`，并要求跨角色支路 slug 保持一致 | 用户指出 `04-research/` 平铺文件过乱，且未来会在同一 project 下开启不同支路问题；主题文件夹 + 跨角色 branches 规则能降低查找成本和路径歧义 | 影响 `PROJECT_RULES.md`、各角色 README、`04-research/` 目录结构、`06-sync/SYNC_SUMMARY.md` 与 `TASK_BOARD.md` 的路径引用 | Accepted |
| 2026-05-12 | AI | desktop-pet VLM 视觉理解能力采用**三档混合架构**：CNN 初筛（本地）+ 2-4B VLM 兜底（本地，MiniCPM-V 4.5 / Qwen2.5-VL-7B int4）+ 云端 VLM 最终兜底（用户 onboarding 显式同意才启用，仅脱敏帧）；本地推理可用率目标从 v2 "≥70% 仅 7B" 调整为"三档合计 ≥85%" | Radar Task F 实测：仅押注 7B VLM 在目标中国桌面玩家硬件上可用率仅 35-45%，不达标；三档混合架构在 v2 §3.6.4 "本地优先" + "云端仅在显式同意时启用" 两条立场基础上演化，未放宽隐私边界 | 影响 Engineering Context Capture Adapter v2 / VLM 模块全栈选型 / Onboarding 30s benchmark + 三选一兜底 UI / 月成本上限 ≤¥3/用户 / `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v3 §3.6 全节 | Accepted |
| 2026-05-12 | Compliance | desktop-pet 默认**双轨发布**：Mac App Store 版本砍 macOS A1 MediaRemote、仅保留 MCP 路径；Developer ID 自分发版完整功能 | Radar Task G 实测：macOS MediaRemote 是私有 framework，App Store 分发必拒；但 C 端桌宠 MAS 分发对用户信任 + 安装便利有意义不能放弃；双轨方案是合规与体验的平衡 | 影响项目级分发战略、Engineering 构建产物拆分（两个发布通道）、macOS A1 信号覆盖度估算、未来 voice-interaction 分支同样需考虑 MAS 边界 | Accepted |
| 2026-05-12 | Compliance | **MiniCPM-V 4.5 商用条款必须法务核验**才可锁定为 desktop-pet VLM MVP 首选；如未通过则主线切 Qwen2.5-VL-7B-Instruct (Apache 2.0) | Radar Task F：MiniCPM-V 4.5 OpenBMB 主代码 Apache 2.0，但模型权重可能附加商用条款；License 风险须前置评估，避免上线后被迫切模型；Qwen2.5-VL-7B 7B 版本 Apache 2.0 明确无 MAU 上限可作备选；Qwen2.5-VL-3B 仅研究用不在备选 | 影响 Engineering 模型选型节奏（法务通过前不可启动 MiniCPM-V 相关工程）、`01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v3 §3.6 模型选型表 | Accepted |
| 2026-05-12 | Compliance | desktop-pet 使用 aubio (GPL-3.0) 作为 audio A0 BPM / 节拍检测库时，**必须以 IPC 子进程隔离**（与桌宠主程序通过 IPC 通信，避免 GPL-3.0 传染整个二进制）；长期商业 release 应切换到 BeatNet (CC-BY-4.0) + cpal 自实现 RMS / silence | Radar Task D：aubio GPL-3.0 对静态链接 / 嵌入式调用有强传染性，桌宠主程序若想保持非 GPL 发布必须 IPC 隔离；Essentia AGPL-3.0 对客户端嵌入是硬约束直接排除；madmom 兼容性破损不可选；BeatNet (CC-BY-4.0) 是长期商业化路线 | 影响 Engineering Context Capture Adapter v2 audio 模块实现方式、构建产物拆分、长期商业化路径规划 | Accepted |
| 2026-05-12 | Compliance | desktop-pet Mac App Store 版本**禁用 macOS MediaRemote 私有 framework**，仅保留 MCP 路径作为 A1 Now Playing 信号来源；macOS A1 信号在 MAS 版只能依赖第三方 app 主动暴露的 MCP server | Radar Task G：MediaRemote 是 Apple 私有 framework，第三方 dlopen 在 macOS 15.4 起被收紧失效；App Store Review 历史上对私有 framework 调用一律拒绝；为支持 MAS 分发必须接受 macOS A1 覆盖度下降 | 影响 Engineering A1 模块实现（两个分发通道用不同的 A1 提供方）、macOS A1 信号覆盖度估算、Design Onboarding 文案需说明 MAS 版能力差异；与双轨发布决策配套 | Accepted |
| 2026-05-12 | Risk | 在项目级 `.claude/settings.json` 中已落盘的 WebSearch + 28 个 WebFetch 域名白名单（一级 13 + 二级 4 + 中文辅助 3 + Coding 工具 5 + 三级社区 4）作为 desktop-pet 项目 Radar Thread 联网调研的统一权限基线，本项目 DECISION_LOG 补登历史决策 | 该设置 2026-04-28 已落地于 ai-weekly-radar-2026 项目并支持了本项目两批共 7 项 Radar 调研（5/11 + 5/12）；为避免 desktop-pet 项目独立查阅 DECISION_LOG 时找不到联网权限依据，本项目补记一条；后续如需扩展域名（如视频陪看 / 音乐识别相关）需修订 settings.json 并在两个项目 DECISION_LOG 同步留痕 | 影响 desktop-pet Radar Thread 联网调研权限基线、未来扩展域名时需同步两个项目记录、Engineering 接续时可在本 DECISION_LOG 查到联网权限授权依据 | Accepted |
| 2026-05-12 | Compliance | PRIVACY_BOUNDARY 修订提案（A0-A3 音频分级 + VLM 白名单扩展到 game + video + Playwright 受限放行 #8）暂 **Deferred**，等 voice-interaction 分支启动后**合并审议**（届时 STT / 麦克风 / TTS 边界变更将走同一份 amendment proposal） | 用户 2026-05-12 决策本批不升项目级 PRIVACY_BOUNDARY；理由是 voice-interaction 分支会引入新的麦克风 / STT / 语音内容相关边界变更，与本提案的音频 / VLM / Playwright 变更合并审议比分两次走更高效，也避免项目级文件被频繁修改；Deferred 期间 PM 立场以分支文件 v2.4 + AI Eval v3 为准，Engineering / Design 接手时按分支立场实现 | 项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md` 暂不修改；PM 分支文件 v2.4 + AI Eval v3 中的 §4.7 视频扩展 / §4.10 音频 / §4.11 Playwright 三段保持分支级立场；voice-interaction 分支启动时必须基于本批 PRIVACY_BOUNDARY 提案做合并 amendment；如本提案在 voice-interaction 启动前被 Reject 则 PM 须撤回上述三段 | Deferred |

## 维护规则

- 决策提议者可以是任何线程，但 `Accepted` / `In Effect` 状态由 Main Thread 确认。
- 决策被替代时不要删除原条目，新增一行 `Superseded`，并在 Reason 中链到新决策。
- 涉及合规、隐私、内容安全的决策必须在 `Impact` 列注明影响范围。
- 不在本文件写入凭据、真实玩家数据或未脱敏内部资料。
