# PM → Group: memory-dataset v2.5 + v2.5.1 完成通告

> Thread: PM Strategy Thread
> Filed at: 2026-05-12T11-39-26
> Branch: `memory-dataset`
> Trigger: 用户 2026-05-12 后续反馈"行为数据 / APP 接入限制太大"+ "mock §11 同步 v2.5"两批指示
> Spec versions covered: v2.4 → v2.5 → v2.5.1

## 1. 一句话结论

1. PM 在 2026-05-12 完成了 memory-dataset 分支的 **v2.5 全量修订**（用户扩展采集面 + 接入通道）+ **v2.5.1 mock §11 同步补丁**。
2. 本通告**请 Main Thread 做一次控制层收口**：拉齐 `SYNC_SUMMARY` / `TASK_BOARD T-028 outputs` / `DECISION_LOG` 新候选审议。
3. 当前 SYNC_SUMMARY §1 Current State 还停在 v2.4 状态（"memory-dataset 分支已完成 v2.4 + AI Eval v3"），与产物层不一致，**需要拉齐**。

## 2. v2.5 主体修订（commit `9dd2919`）

### 2.1 修订主题

用户 2026-05-12 反馈 v2.4 对"行为数据用户操作"+"娱乐工作 APP MCP"限制太大。PM 进入 Brainstorming First（新规则后首次正式应用）→ 17 候选 idea → 用户选定档 A 增量 + OS API + 浏览器全方位 + OS Scripting Bridge。

### 2.2 关键变更（9 项）

1. **§4.3 行为数据 全面重写**：A1 派生信号扩展 5 字段 + A2 操作语义事件 8 字段 + A3 编辑动作派生 5 字段；§4.3.5 排除项加 4 条新硬约束。
2. **§10 键盘分级扩展到 5 层**：新增 L1.5 编辑动作派生层，L2 / L3 红线不变。
3. **§4.4 从"仅 MCP 通道"重构为"6 通道并存总览"**：MCP（v2.4 沿用）+ OS API 6 类 + 浏览器扩展全方位 6 类 + OS Scripting Bridge + CLI 调用 + IFTTT 桥接。
4. **§4.4.6 OS API 6 通道新增**：Now Playing（v2.4 已锁）+ UserActivity + Recent Files + Notification Center + Calendar + 设备状态环境。
5. **§4.4.7 浏览器扩展全方位**：v2.4 §4.7.4 视频类扩展到 6 类（视频 / 购物 / 阅读 / 学习 / 社交浏览 / 工作）。
6. **§4.12 新增 OS Scripting Bridge**（osascript / AppleScript + PowerShell COM Automation）：接入 Spotify / Apple Music / VLC / IINA / Notes / Bear / Things / Office / Outlook / Reminders 等支持系统脚本接口的桌面 app；仅读元数据不修改 app 状态。
7. **§4.4.8 + §4.4.9** CLI 调用 + IFTTT 桥接补充通道（P1 / P2 探索）。
8. **§4.7.4 视频类 VLM 保留 v2.4 不动**（用户决定保留剧情同步反应愿景）。
9. **§13 Next Steps 大幅扩展**：Engineering 接手清单 8 → 14 项；Design 设置面板需求 7 → 13 条；项目级决策候选 11 → 15 条。

### 2.3 文件改动

| 文件 | 改动 |
|---|---|
| `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` | v2.4 → v2.5（+319 / -60，从 1340 行扩到 1582 行） |
| `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` | 顶部加 v2.5 关联说明（AI 必要性立场不变） |
| `01-pm/branches/memory-dataset/PRIVACY_BOUNDARY_AMENDMENT_PROPOSAL_audio-and-vlm-extension.md` | §0 范围声明加 v2.5 新增 5 项通道（一并合并审议） |
| `01-pm/branches/memory-dataset/README.md` | Status / Transitions 同步 |

## 3. v2.5.1 mock §11 同步补丁（commit `74cbfad`）

### 3.1 修订主题

v2.5 主体修订完成后 §11 mock 还停留在 v2.4 字段集。本批 v2.5.1 把 §11 mock 全部同步到 v2.5，让 Engineering 接 schema 时可直接对照。

### 3.2 关键变更（8 项）

1. **§11.0** mock_metadata schema_version 0.2.0 → 0.3.0；加 6 通道开关字段（os_api / browser_extension / osa_com / keyboard L1.5 / cli / ifttt）。
2. **§11.3** behavior_pc 加 A1 5 字段（mouse_region_heatmap_top3 / mouse_event_type_burst / input_device_switch_event / multi_display_activity / scroll_intensity_signal）。
3. **§11.4** behavior_ui 加 A2 `semantic_events_v2_5[]` 9 类 OS 级操作语义事件。
4. **§11.4.1** 新增 behavior_edit — A3 编辑动作派生 5 字段，对应 §10 L1.5。
5. **§11.12** 新增 OS API 6 通道 mock（now_playing 引用 §11.10 / user_activity / recent_files / notification_center / calendar / device_status）。
6. **§11.13** 新增浏览器扩展全方位 mock（6 类 tab category 各自开关）。
7. **§11.14** 新增 OS Scripting Bridge mock（bridge_kind / user_authorized_apps / samples[] / ui_indicator_shown_per_app 合规检查项）。
8. 主文档主体 §3 / §4 / §10 / §13 v2.5 内容不变。

### 3.3 字段层覆盖度

| 主文档章节 | mock 对应位置 | 状态 |
|---|---|---|
| §4.3.3 派生指标（含 A1 v2.5 5 字段） | §11.3 input_indicators | ✅ v2.5.1 |
| §4.3.4 操作语义事件（含 A2 v2.5 9 字段） | §11.4 semantic_events_v2_5 | ✅ v2.5.1 |
| §4.3.4.1 编辑动作派生（A3 v2.5 5 字段） | §11.4.1 behavior_edit | ✅ v2.5.1 新增 |
| §4.4.6 OS API 6 通道 | §11.12 | ✅ v2.5.1 新增 |
| §4.4.7 浏览器扩展 6 类 | §11.13 | ✅ v2.5.1 新增 |
| §4.12 OS Scripting Bridge | §11.14 | ✅ v2.5.1 新增 |

**主文档 16 个数据章节 100% 有对应 mock，字段层完全同步**。

## 4. Main Thread 应做的控制层收口（请用户授权）

### 4.1 SYNC_SUMMARY.md 拉齐

1. **§1 Current State**：当前状态文从"v2.4 + AI Eval v3"更新到 **v2.5.1 + AI Eval v3**；明确"6 通道并存 + 档 A 完整 + L1.5 + OS Scripting Bridge"；明确 mock §11 已 100% 同步。
2. **§2 Latest Decisions**：增 2-3 行（v2.5 全量修订 + v2.5.1 mock 同步）。
3. **§4 Active Tasks T-028**：状态保留 In Progress；备注更新为"v2.5 + v2.5.1 已落盘，待 PRIVACY_BOUNDARY 提案审议 + 横向扩展 voice-interaction / companion-behavior 分支"。
4. **§7 Links**：增 1 行链接到本通告（2026-05-12T11-39-26）。

### 4.2 TASK_BOARD.md T-028 outputs 扩展

加入 v2.5 + v2.5.1 新增 / 更新的文件路径，含：
- `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.5.1
- 本通告

### 4.3 DECISION_LOG.md 新候选审议（重要）

§13.5.1 项目级决策候选清单从 11 条扩到 15 条，新增 4 条（#12-#15）：

| # | 候选决策 | 影响层级 |
|---|---|---|
| 12 | MCP 不再是唯一通道；6 通道并存（MCP / OS API / 浏览器扩展全方位 / OS Scripting Bridge / CLI / IFTTT），每通道独立开关 + 默认关闭 + Memory Center 可见 | **影响 Engineering 全栈选型 + Design 设置面板架构 + 法务评估范围** |
| 13 | 行为数据采集扩展为档 A 完整集合（A1 + A2 + A3）；§10 键盘分级扩展到 L1.5；§4.3.5 新增 4 条排除项（鼠标坐标流 / 像素 heatmap / 拖选内容 / 屏幕坐标完整时序） | **影响 Engineering Context Capture Adapter 字段集 + 杀软告警风险评估** |
| 14 | OS Scripting Bridge（osascript / PowerShell COM）作为接入桌面客户端 app 元数据的合规通道；仅读不写；用户系统授权 + Memory Center 单 app 开关 | **新数据通道 + 新权限模型 + 需法务确认 osascript / COM 边界** |
| 15 | 浏览器扩展通用化到 6 类 tab 识别；用户按类别 + 按 app 双层开关 | **扩展 v2.4 §4.7.4 视频类决策范围；不引入新边界但扩大现有范围** |

PM 建议这 4 条**至少升 #12（6 通道并存）+ #14（OS Scripting Bridge）**为 Accepted；#13 / #15 可视情况延后或一并升。具体由用户授权 Main Thread 时决定。

## 5. Files Modified / Created（本 PM 视角全集）

### 5.1 已 commit + push（main branch，2 commits）

| Commit | 内容 |
|---|---|
| `9dd2919 feat(memory-dataset): v2.5` | 4 文件 / +319 / -60 |
| `74cbfad feat(memory-dataset): v2.5.1 mock §11 sync` | 2 文件 / +281 / -8 |

### 5.2 本通告自身（commit pending）

`06-sync/group/2026-05-12T11-39-26_pm_memory-dataset-v2.5-and-v2.5.1-completed.md`

## 6. Files Not Modified

1. Radar 4 个产物（属 Radar 写区，未触碰）。
2. `06-sync/TASK_BOARD.md` / `SYNC_SUMMARY.md` / `THREAD_REGISTRY.md` / `decisions/DECISION_LOG.md`（Main Thread 写区，需用户授权后由 Main 收口）。
3. 项目级 `01-pm/PRIVACY_BOUNDARY_memory-system.md`（仍 Deferred；分支级 PM 立场以 v2.5.1 为准）。
4. 其他分支 / `02-design/` / `03-engineering/` / 其他 `04-research/` 主题文件夹。
5. v2.4 老 mock 字段（已被 v2.5 / v2.5.1 扩展，未删除任何 v2.4 字段以保留向后兼容）。

## 7. Suggested Next Thread

**Main Thread** — 按本通告 §4 收口 SYNC_SUMMARY / TASK_BOARD T-028 / DECISION_LOG 新候选审议；具体由用户授权决策范围（仅 #12 / 仅 #12+#14 / 全 4 条 / 不升 DECISION_LOG）。

**或者** —— **Engineering Build Thread** 启动：基于 v2.5.1 schema + Radar 7 项产物开始 Context Capture Adapter v2 + VLM 混合架构 + Tab Detection 三 provider + A1 SourceAppUserModelId 白名单 + **新增 v2.5 OS API 6 通道 / 浏览器扩展全方位 / OS Scripting Bridge 实现**。

## 8. Whether User Input Is Needed

**Yes** — Main Thread 收口需要用户授权决策升级范围（§4.3 列出 4 个选项）。
