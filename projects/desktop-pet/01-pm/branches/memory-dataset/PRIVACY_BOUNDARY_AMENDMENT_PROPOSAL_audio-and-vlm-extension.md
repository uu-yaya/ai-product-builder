# PRIVACY_BOUNDARY 修订提案 — Audio Signal Grading + VLM 白名单扩展 + Playwright 受限放行

> Project: `desktop-pet`
> Branch: `memory-dataset`
> Thread: PM Strategy Thread
> Date: 2026-05-11
> Status: **Deferred**（2026-05-12 Main Thread 已收口；等 voice-interaction 启动后合并审议；详见 §0 #4 + §5 状态语义对照表）
> Scope: 本文件不直接修改项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md`；仅给出**修订提案**，由 Main Thread 在 `decisions/DECISION_LOG.md` 收口后再应用。

---

## 0. 提案范围声明（v2.3.1 补充，2026-05-11 19:00；v2.5 加注 2026-05-12）

1. 本提案**覆盖 memory-dataset 分支范围**内的边界变更，包括：
   1. 音频信号 A0 / A1 分级（听音乐场景，**不含**麦克风 / 语音识别）。
   2. VLM 白名单从单游戏扩展到游戏 + 视频 app。
   3. Playwright 受限放行 7 条边界。
   4. **（v2.5 新增）** 行为信号档 A 扩展（A1 派生 / A2 操作语义事件 / A3 编辑动作派生）— §10 键盘分级扩展到 L1.5；§4.3.5 排除项加 4 条。
   5. **（v2.5 新增）** OS 级 API 通道 6 类（UserActivity / Recent Files / Notification Center / Calendar / 设备状态 + Now Playing 已锁）。
   6. **（v2.5 新增）** 浏览器扩展通用化到 6 类 tab 识别（视频 / 购物 / 阅读 / 学习 / 社交 / 工作）。
   7. **（v2.5 新增）** OS Scripting Bridge（macOS osascript / AppleScript + Windows PowerShell COM Automation）— 接入桌面客户端 app 元数据；仅读不写；用户系统授权 + Memory Center 单 app 开关。
   8. **（v2.5 新增）** CLI 工具调用 + IFTTT / Zapier webhook 桥接。
2. 本提案**不包含**：
   1. 麦克风录音 / 语音识别（STT）/ TTS 输出 / 声纹 / 音色克隆 / 双向语音对话 — 这些归 `voice-interaction` 分支（待启动）；如未来需要修订项目级 PRIVACY_BOUNDARY，需**另起一份独立 amendment proposal**，不挤进本提案。
   2. 即使本提案 Accepted，A2 / A3 / 麦克风在 memory-dataset 范围内**仍然全部排除**（详见 §3.1 修订条款 #3 #4）。
3. 跨分支约束：未来 `voice-interaction` 分支的边界变更**不得反向放宽**本提案锁定的 memory-dataset 范围内边界，除非项目级 `decisions/DECISION_LOG.md` 显式留痕同意。
4. **当前状态：Deferred（2026-05-12 Main Thread 收口决策）** — 等 voice-interaction 分支启动后**合并审议**（届时 STT / 麦克风 / TTS 边界变更将走同一份 amendment）。v2.5 新增 5 项（行为档 A / OS API / 浏览器全方位 / OS Scripting Bridge / CLI+IFTTT）一并加入合并审议清单。

---

## 1. 修订动机（v2.5.1 修订：v2.5 五项扩展后范围声明）

1. 用户 2026-05-11 18:30 提出 desktop-pet MVP 包含两个体验：
   1. **桌宠陪用户一起看视频**（剧情同步反应）
   2. **桌宠随音乐舞动**（节拍 sync）
2. PM 评估后判断：这两个体验**信号粒度上 Playwright 解决不了**，必须引入两条新数据通道：
   1. **系统音频派生信号**（BPM / 能量曲线 / 节拍点），**不录原音频、不识别说话内容**。
   2. **VLM 白名单从"单游戏"扩展到"游戏 + 视频 app"**。
3. 同时把 Playwright 从"完全禁止"调整为 **P2 受限放行**，作为用户主动查询的兜底通道。
4. **v2.5 用户 2026-05-12 提出行为数据 + APP MCP 限制过大**，PM 增量扩展 5 项通道（行为档 A / OS API / 浏览器全方位 / OS Scripting Bridge / CLI+IFTTT），详见 §0 #1 后五项。
5. **v2.3 三项 + v2.5 五项合计 8 项中，与项目级 PRIVACY_BOUNDARY §2 硬约束有交集的至少 4 项**（系统音频 ↔ #2，VLM 视频扩展 ↔ #1，Playwright ↔ #4，OS API / 浏览器全方位 / OS Scripting Bridge ↔ #4 #5）；详见 §2 扩展对照表。必须先在项目级文件取得共识（Accepted）或保留分支级立场（Deferred / 当前状态），才能在分支文件落地或撤回。

---

## 2. 现行硬约束 vs 本提案 8 项扩展（v2.5.1 修订：扩展对照表）

> 现行硬约束来自 `01-pm/PRIVACY_BOUNDARY_memory-system.md` §2，原文未改动。下表对照本提案 §0 #1 全部 8 项（v2.3 三项 + v2.5 五项）与硬约束 #1-#7 的交集情况。

### 2.1 v2.3 原版三项（与硬约束的交集）

| # | 现行硬约束 | 与本提案关系（v2.3 三项） |
|---|---|---|
| 1 | 不默认 Recall 式后台全屏截图 | ⚠️ **本提案 VLM 视频扩展沿用"前台 + 全屏 + 短期 buffer + 不持久化原图"规则，但白名单从单游戏扩展到游戏 + 视频 app**，需项目级确认 |
| 2 | 不默认系统音频监听 | ⚠️ **本提案需修订**：拆分为"音频内容 ❌"与"音频派生信号（BPM / 能量）✅" |
| 3 | 不记录键盘输入内容 | ✅ 不涉及（与 `REQUIREMENT_CLARIFICATION_memory-dataset.md` §10 键盘分级已对齐） |
| 4 | 不长期存跨 app 全文 UI | ⚠️ **本提案 Playwright 受限放行需细化**：tool_call 一次性结果 buffer ≤5min，不进 long-term profile（详见 §3.4 7 条边界） |
| 5 | 不上传 raw OS context | ✅ 沿用（音频派生信号、Playwright 结果都是脱敏后处理） |
| 6 | 不写敏感业务信息 | ✅ 沿用 |
| 7 | 不使用 Recall 作为数据源 | ✅ 沿用 |

### 2.2 v2.5 新增五项（与硬约束的交集，2026-05-12 加注）

| # | v2.5 新增通道 | 与硬约束的交集 | 执行边界（已在分支文档锁定） |
|---|---|---|---|
| 1 | **行为档 A 扩展**（A1 派生 / A2 操作语义 / A3 编辑动作派生；§10 键盘 L1.5 新增） | ⚠️ #3 不记录键盘输入内容 — 需澄清：A1-A3 不含字符级 keylog（L2 / L3 排除），仅"操作语义事件"派生 | 详见 REQUIREMENT_CLARIFICATION §4.3 / §10.1（L0-L1.5 ✅，L2/L3 ❌）+ §4.3.5 4 条排除项 |
| 2 | **OS API 6 类**（UserActivity / Recent Files / Notification Center / Calendar / 设备状态 / Now Playing） | ⚠️ #4 不长期存跨 app 全文 UI / #5 不上传 raw OS context — 需澄清：仅采集 OS 公开 API 元数据，不读 app 内容；本地处理不上云 | 详见 REQUIREMENT_CLARIFICATION §4.4.6（仅元数据；不走私有 framework 除双轨方案外） |
| 3 | **浏览器扩展全方位 6 类**（视频 / 购物 / 阅读 / 学习 / 社交 / 工作 tab 识别） | ⚠️ #4 不长期存跨 app 全文 UI — 需澄清：仅识别 tab 身份 / 标题域名，不读页面内容；按类别 + 按 app 双层开关 | 详见 REQUIREMENT_CLARIFICATION §4.4.7（沿用 v2.4 §4.7.4 共同边界 5 条） |
| 4 | **OS Scripting Bridge**（macOS osascript / AppleScript + Windows PowerShell COM） | ⚠️ #4 不长期存跨 app 全文 UI / #5 不上传 raw OS context — 需澄清：仅读不写；用户系统授权（Automation permission） + Memory Center 单 app 开关 + 元数据级 | 详见 REQUIREMENT_CLARIFICATION §4.12（不调用任何修改类 Apple Event；仅 get 类） |
| 5 | **CLI 工具调用 + IFTTT/Zapier webhook** | ⚠️ #5 不上传 raw OS context / #6 不写敏感业务信息 — 需澄清：CLI 仅调用公开 read-only 子集；IFTTT 仅接受用户主动配置 + 签名验证 + 元数据 payload | 详见 REQUIREMENT_CLARIFICATION §4.4.8 / §4.4.9 |

### 2.3 受影响总览

- **主要受影响**（需 §3 章节级修订）：#2 系统音频监听（拆 A0-A3 分级，详见 §3.1）。
- **次要受影响**（需边界澄清，分支已锁定执行细则）：#1 / #3 / #4 / #5（v2.5 五项）。
- **不冲突**：#6 / #7。

**结论**：本提案 8 项扩展中至少 4 项涉及硬约束（#1 #2 #4 #5），需在项目级文件统一收口（Accepted）或保留分支级立场（Deferred / 当前状态）。**v2.3 旧表 "唯一受影响：#2" 仅适用于 v2.3 时期的三项**，v2.5 扩展后已不成立。

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

## 5. 收口请求 + 状态语义对照表（v2.5.1 修订：拆 Rejected / Deferred 两条独立路径）

请 **Main Thread**：

1. 在 `decisions/DECISION_LOG.md` 留痕本提案（Status: Accepted / Rejected / Deferred）。
2. **若 Accepted**：把 §3.1 / §3.2 / §3.3 / §3.4 应用到 `01-pm/PRIVACY_BOUNDARY_memory-system.md`，并在 `06-sync/SYNC_SUMMARY.md` 标注。
3. **若 Rejected**：
   1. 在 `06-sync/group/` 写一条消息说明拒绝理由。
   2. PM 同步收回本分支 `REQUIREMENT_CLARIFICATION_memory-dataset.md` **当前版本**与 `AI_FEATURE_EVALUATION_memory-dataset.md` **当前版本**中的 v2.3 三项相关章节（§4.7 视频扩展 / §4.10 音频 / §4.11 Playwright）。**不锁版本号**（v2.5.1 / 后续 v2.6+ 均适用）。
   3. PM 同步收回 v2.5 新增**全部 5 项**通道章节（§4.4.6 OS API 6 类 / §4.4.7 浏览器扩展全方位 / **§4.4.8 CLI 工具调用** / **§4.4.9 IFTTT / Zapier webhook 桥接** / §4.12 OS Scripting Bridge）— 与本提案 §0 #1 #4-#8 范围一致；并同步收回 §10 键盘 L1.5 / §4.3 行为档 A 扩展 / §4.3.5 4 条排除项。
4. **若 Deferred**（当前状态，2026-05-12 起）：
   1. **不撤回任何章节** — PM 分支级立场保持不变；Engineering / Design 接手时按分支立场实现。
   2. 状态由 voice-interaction 分支启动时合并审议决议；届时 STT / 麦克风 / TTS 边界变更将走同一份合并 amendment。
   3. 与"Rejected"的关键区别：Deferred = "暂不在项目级文件落地，但分支级有效"；Rejected = "PM 必须撤回分支级章节"。

### 状态语义对照表

| 状态 | 项目级 PRIVACY_BOUNDARY 文件 | 分支 v2.3 三项（§4.7 视频 / §4.10 音频 / §4.11 Playwright） | 分支 v2.5 五项（§4.4.6 / §4.4.7 / §4.4.8 / §4.4.9 / §4.12 + §4.3 档 A / §10 L1.5） | Engineering / Design 接手 |
|---|---|---|---|---|
| **Accepted** | 应用 §3.1-§3.4 修订 | 保留 + 项目级背书 | 保留 + 项目级背书 | 按分支立场 + 项目级双重生效实现 |
| **Rejected** | 不修改 | **PM 必须撤回** | **PM 必须同步撤回**（全 5 项 + 档 A + L1.5） | 不实现这些章节 |
| **Deferred**（当前） | 不修改 | **保留分支级立场** | **保留分支级立场** | **按分支立场实现**（不撤回） |

---

## 6. PM 备注

1. 本提案是 desktop-pet 项目自创立以来**第一次主动放宽 PRIVACY_BOUNDARY**（之前 v2 / v2.1 / v2.2 都是收紧或细化）。
2. 放宽的理由是**用户产品愿景明确且合理**（陪看 / 舞动是 C 端桌宠的高情感价值场景）；不是因为开发便利或预算压力。
3. 即便放宽，本提案对 #2 #3 #4 都**用分级方式**取代了"完全禁止"，保证了边界的明确性和可解释性 — 不是开口子。
4. 若未来 Engineering / 法务对 §3.4 Playwright 7 条边界有更严格要求，应升级而非降级；PM 不接受未经项目级讨论的放宽。
