# PRIVACY_BOUNDARY 修订提案 — Audio Signal Grading + VLM 白名单扩展 + Playwright 受限放行

> Project: `desktop-pet`
> Branch: `memory-dataset`
> Thread: PM Strategy Thread
> Date: 2026-05-11
> Status: **Proposal**（待 Main Thread 收口 / 决议）
> Scope: 本文件不直接修改项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md`；仅给出**修订提案**，由 Main Thread 在 `decisions/DECISION_LOG.md` 收口后再应用。

---

## 0. 提案范围声明（v2.3.1 补充，2026-05-11 19:00）

1. 本提案**只覆盖 memory-dataset 分支范围**内的边界变更，包括：
   1. 音频信号 A0 / A1 分级（听音乐场景，**不含**麦克风 / 语音识别）。
   2. VLM 白名单从单游戏扩展到游戏 + 视频 app。
   3. Playwright 受限放行 7 条边界。
2. 本提案**不包含**：
   1. 麦克风录音 / 语音识别（STT）/ TTS 输出 / 声纹 / 音色克隆 / 双向语音对话 — 这些归 `voice-interaction` 分支（待启动）；如未来需要修订项目级 PRIVACY_BOUNDARY，需**另起一份独立 amendment proposal**，不挤进本提案。
   2. 即使本提案 Accepted，A2 / A3 / 麦克风在 memory-dataset 范围内**仍然全部排除**（详见 §3.1 修订条款 #3 #4）。
3. 跨分支约束：未来 `voice-interaction` 分支的边界变更**不得反向放宽**本提案锁定的 memory-dataset 范围内边界，除非项目级 `decisions/DECISION_LOG.md` 显式留痕同意。

---

## 1. 修订动机

1. 用户 2026-05-11 18:30 提出 desktop-pet MVP 包含两个体验：
   1. **桌宠陪用户一起看视频**（剧情同步反应）
   2. **桌宠随音乐舞动**（节拍 sync）
2. PM 评估后判断：这两个体验**信号粒度上 Playwright 解决不了**，必须引入两条新数据通道：
   1. **系统音频派生信号**（BPM / 能量曲线 / 节拍点），**不录原音频、不识别说话内容**。
   2. **VLM 白名单从"单游戏"扩展到"游戏 + 视频 app"**。
3. 同时把 Playwright 从"完全禁止"调整为 **P2 受限放行**，作为用户主动查询的兜底通道。
4. 上述三项中**两项与项目级 PRIVACY_BOUNDARY §2 硬约束有交集**，必须先在项目级文件取得共识，才能在分支文件落地。

---

## 2. 现行硬约束（来自 `01-pm/PRIVACY_BOUNDARY_memory-system.md` §2，原文未改动）

| # | 现行硬约束 | 与本提案关系 |
|---|---|---|
| 1 | 不默认 Recall 式后台全屏截图 | ✅ 不冲突（VLM 视频扩展沿用既有"前台 + 全屏 + 短期 buffer + 不持久化原图"规则） |
| 2 | 不默认系统音频监听 | ⚠️ **本提案需修订**：拆分为"音频内容 ❌"与"音频派生信号（BPM / 能量）✅" |
| 3 | 不记录键盘输入内容 | ✅ 不涉及（与 `REQUIREMENT_CLARIFICATION_memory-dataset.md` §10 键盘分级已对齐） |
| 4 | 不长期存跨 app 全文 UI | ✅ 不涉及 |
| 5 | 不上传 raw OS context | ✅ 沿用（音频派生信号、Playwright 结果都是脱敏后处理） |
| 6 | 不写敏感业务信息 | ✅ 沿用 |
| 7 | 不使用 Recall 作为数据源 | ✅ 沿用 |

**唯一受影响**：#2 系统音频监听硬约束需重新分级。

---

## 3. 提案修订点

### 3.1 修订 #2 — 音频信号分级（替代"不默认系统音频监听"硬约束）

**原文**：

> 不默认系统音频监听 — 不持续监听系统音频、麦克风、语音聊天、会议内容或游戏语音。

**提议新文**：

> 音频信号分级使用：
>
> 1. **A0 派生指标**（系统音频流的 BPM / 能量曲线 / 节拍点 / 静音状态等**信号级**衍生量）— ✅ 允许，需用户在桌宠设置面板**单独开关**，默认关闭。
> 2. **A1 标识级元数据**（来自 OS Now Playing API / app MCP 的曲名 / 节目名 / 时长 / 时间戳）— ✅ 允许，与 §3 MCP 同款用户自选启停。
> 3. **A2 音频内容 / 语音识别 / 麦克风录制**— ❌ 任何优先级都不允许。
> 4. **A3 完整音频流持久化**— ❌ 不允许。
>
> 执行细则：
> 1. A0 派生指标的计算**必须在本地完成**，且**不持久化原始音频流**（仅保留派生标量）。
> 2. A0 派生指标不识别说话内容、不识别歌词、不识别人声 vs 乐器。
> 3. A0 启用时桌宠 UI 必须给出"已启用音频节拍监听"的可见指示。
> 4. 任何 A2 / A3 能力的新增提议，必须先在 `decisions/DECISION_LOG.md` 走项目级决策；不能由 Engineering / Design 单边变更。

### 3.2 修订 §3.1 P0 Whitelist — 新增音频派生信号条目

**提议在现有表后追加**：

| Data Category | Examples | Sensitivity | Default Handling | Long-term Memory Rule | Cloud Boundary |
|---|---|---|---|---|---|
| 系统音频派生信号 A0 | BPM / 能量曲线 / 节拍点 / 静音状态 | S2 | P1 可选开关；默认关闭；local-first | 短期 buffer ≤30s；长期仅保留聚合标签（如"用户常听快节奏音乐"） | **不上传原始音频或派生时序流**；上传仅可做聚合摘要 |
| Now Playing 标识 A1 | 曲名 / 节目名 / 时长 / 时间戳（来自 OS / MCP） | S1 | P1 用户授权后采集 | 短期 raw + 长期摘要 | 与 §3 MCP 同款规则 |

### 3.3 修订 VLM 白名单类别（沿用 §4 / §5 既有结构，扩展应用范围）

**原文（隐含）**：VLM 适用范围限于"该桌宠绑定单游戏"。

**提议新文**：

> VLM 白名单**按 app 类别独立管理**：
>
> 1. **游戏类**：该桌宠绑定的单游戏的前台 + 全屏窗口（沿用既有规则）。
> 2. **视频类**：用户在桌宠设置面板手动加入的视频 app 白名单条目（YouTube / Bilibili / 腾讯视频 / 爱奇艺 / 优酷等），每条目独立开关；仅前台 + 大窗口 / 全屏窗口生效。
> 3. **其他类别（如音乐 app / 工作 app）**：不在 MVP VLM 范围；后续如扩展必须走 `decisions/DECISION_LOG.md` 项目级决策。
>
> 共同规则（所有类别）：
> 1. 短期 buffer ≤ 60 秒；不持久化原图。
> 2. 仅保留语义级标签 + 用户可见摘要进入长期记忆。
> 3. 每次 VLM 激活时桌宠 UI 必须给出可见状态指示。
> 4. 默认本地推理；云端兜底仅在用户显式同意时启用。
> 5. 用户可一键暂停 VLM 全局（覆盖所有类别）或单类别 / 单 app 关闭。

### 3.4 新增条目 #8 — Playwright 受限放行

**提议新增**：

> #8 Playwright（浏览器自动化）受限放行：
>
> 1. **仅"用户主动触发"场景**允许使用（如"桌宠帮我看下我的 B 站收藏" / "刚才那首歌叫什么名字"）；**不**做后台轮询。
> 2. 凭据（cookie / session）必须存于 OS 标准 keychain（macOS Keychain / Windows Credential Manager），不存于桌宠应用内部数据库或日志。
> 3. 仅访问用户**自己已登录**的页面；不访问他人账号 / 不爬公开搜索 / 不做内容大规模抓取。
> 4. 抓取结果**短期 buffer ≤ 5 分钟**；不持久化原始 HTML / DOM。
> 5. Playwright 结果**不进入** long-term profile 自动累积；只供本次对话使用。
> 6. 每次 Playwright 执行有可见 UI 状态指示（"正在帮你查 X"）。
> 7. 用户可在 Memory Center 看到"过去 7 天 Playwright 执行了哪些查询"列表并按需关闭单个 source。
>
> 排除项：
> 1. 后台轮询 / 持续监听 — ❌ 不允许。
> 2. 模拟用户操作（点击 / 下单 / 发帖 / 评论 / 私信） — ❌ 默认不允许；如需做必须走项目级决策。
> 3. 跨用户共享 Playwright 抓取数据 — ❌ 不允许。

---

## 4. 影响评估

| 方面 | 影响 |
|---|---|
| 用户感知 | 桌宠 MVP 获得"陪看视频 / 随音乐舞动"两个具象情感价值；信任感增强（前提：4 类边界落地） |
| 工程复杂度 | 增加：①系统音频 API 接入（macOS CoreAudio / Windows WASAPI）+ BPM 检测库；②VLM 视频白名单管理；③Playwright + OS keychain 集成 |
| 隐私边界 | 3 条新边界但各自更可控；总体边界**没有放松**，反而引入更细粒度（A0-A3 / 游戏 vs 视频 VLM / Playwright 受限放行）|
| 合规 | 音频 A0 派生 — 大多数司法管辖区视为低敏（无内容识别）；Playwright — 受 app ToS 影响，需逐 app 评估 |
| MVP 节奏 | "陪看 / 舞动"两个体验进 P1（不是 P0），不阻塞 MVP 上线，但提升口碑 |

---

## 5. 收口请求

请 **Main Thread**：

1. 在 `decisions/DECISION_LOG.md` 留痕本提案（Status: Accepted / Rejected / Deferred）。
2. 若 Accepted：把 §3.1 / §3.2 / §3.3 / §3.4 应用到 `01-pm/PRIVACY_BOUNDARY_memory-system.md`，并在 `06-sync/SYNC_SUMMARY.md` 标注。
3. 若 Rejected / Deferred：在 `06-sync/group/` 写一条消息说明理由，PM 同步收回本分支 `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3 与 `AI_FEATURE_EVALUATION_memory-dataset.md` v2 中的相关章节（§4.7 视频扩展 / §4.10 音频 / §4.11 Playwright）。

---

## 6. PM 备注

1. 本提案是 desktop-pet 项目自创立以来**第一次主动放宽 PRIVACY_BOUNDARY**（之前 v2 / v2.1 / v2.2 都是收紧或细化）。
2. 放宽的理由是**用户产品愿景明确且合理**（陪看 / 舞动是 C 端桌宠的高情感价值场景）；不是因为开发便利或预算压力。
3. 即便放宽，本提案对 #2 #3 #4 都**用分级方式**取代了"完全禁止"，保证了边界的明确性和可解释性 — 不是开口子。
4. 若未来 Engineering / 法务对 §3.4 Playwright 7 条边界有更严格要求，应升级而非降级；PM 不接受未经项目级讨论的放宽。
