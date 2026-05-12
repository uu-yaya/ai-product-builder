# Radar → Group: memory-dataset 三项调研同步完成

> Thread: AI Trend Radar Thread
> Filed at: 2026-05-11T17-52-51
> Branch: `memory-dataset`
> Trigger: 三份 PM DM 委托 `06-sync/dm/pm-to-radar/2026-05-11T17-10-08_pm_*.md`

## 1. 完成情况一句话

PM 在 2026-05-11 派发的三项 Radar 调研委托**全部完成并落盘**到 `04-research/branches/memory-dataset/`；本通告请 Main Thread 收口到 `06-sync/SYNC_SUMMARY.md` / `TASK_BOARD.md`，并视情况安排 PM Strategy Thread 接续阅读。

## 2. Files Created（4 个）

| 文件 | 类型 | 大小 | 对应 PM DM |
|---|---|---|---|
| `04-research/branches/memory-dataset/TREND_RESEARCH_behavior-signal-libraries.md` | 调研报告 | 29.7 KB | `behavior-signal-libraries-radar-research.md` |
| `04-research/branches/memory-dataset/TREND_RESEARCH_china-app-mcp-server-capabilities.md` | 调研报告 | 25.9 KB | `china-app-mcp-server-radar-research.md` |
| `04-research/branches/memory-dataset/MOCK_DATA_cross-source-memory-dataset.json` | mock 数据 | 41.9 KB | `cross-source-mock-radar-research.md` |
| `04-research/branches/memory-dataset/MOCK_DATA_cross-source-memory-dataset.md` | mock 数据说明 | 25.6 KB | 同上 |

合计约 123 KB / ~25K 字。

## 3. Files Not Modified

- `01-pm/`、`02-design/`、`03-engineering/`、其它已有 `04-research/` 主题文件夹
- `06-sync/TASK_BOARD.md`、`SYNC_SUMMARY.md`、`THREAD_REGISTRY.md`、`decisions/DECISION_LOG.md`
- `00-context/*`（仅读）、`workspaces/`、`~/.codex/`、`~/.agents/skills/`
- 任何 mock 输入文件（`04-research/chenmo_chat_output.json`、`04-research/剑灵Mock数据-聊天.docx`）

## 4. Key Findings（每项 3–5 条）

### 4.1 行为信号库（Task A）

1. **macOS P0 配方**：`NSWorkspace`（零权限 active app）+ `IOHIDIdleTime`（零权限 idle）+ `CGEventTap (listenOnly)`（输入监控权限；回调内立即丢字符，只做派生指标聚合）；`AXUIElement` 仅作 P1 opt-in。
2. **Windows P0 配方**：`SetWinEventHook(EVENT_SYSTEM_FOREGROUND + EVENT_OBJECT_NAMECHANGE)` + `GetLastInputInfo` + `Raw Input`（**不**用 `SetWindowsHookEx(WH_KEYBOARD_LL)` — Defender keylogger 启发式高发误报点）。UIA 仅按需快照式读取，**严禁**订阅全局 UIA 事件（Power Automate 同款系统卡顿事故）。
3. **完全排除**：`ScreenCaptureKit` / `Windows.Graphics.Capture` 持续模式（macOS Sequoia 月度授权弹窗 + Windows 强制黄色边框，与桌宠常驻形态致命冲突）；Windows Recall API（定义即"全屏后台截图 + 长期存储"，与 `Context Lite Memory` 决策直接冲突）。
4. **L0 / L1 / L2 / L3 键盘信号分级**：与 PM §10 完全对齐——L0 派生指标 P0；L1 仅 modifier+键名 P1 opt-in；L2 字符级原始流任何形式都不允许；L3 完整时间戳序列不允许。

### 4.2 中国 App MCP 能力（Task B）

1. **国产协作工具 MCP 已上岸**：飞书 / 钉钉 / 腾讯文档均有**官方 MCP**（飞书 `larksuite/lark-openapi-mcp` 最活跃；钉钉 `open-dingtalk/dingtalk-mcp` 能用但 commit 节奏 2026-01 后偏慢；腾讯文档官方 HTTP MCP 已上线）。
2. **C 端娱乐 app 是空白区**：腾讯视频 / 爱奇艺 / 优酷三家**无任何公开个人 API**；QQ 音乐 / 抖音 / 小红书 / Bilibili 三方 MCP 多但聚焦"内容搜索 / 解析 / 上传"，**无"当前观看"或"now playing"** 个人状态。
3. **MVP 首批 5 个 P1 候选**：滴答清单（最强"知心好友"叙事）、飞书国内版（calendar_next_event 链路最短）、Steam Web API（"正在玩 XX"信号最纯）、OfficeMCP（一站式覆盖 Word/Excel/PPT/WPS 当前文档）、钉钉（备选，覆盖国企教育系）。
4. **不可达**：番茄 ToDo / Focus To-Do / Forest **根本没有公开通道**（PM 决策建议从候选清单移除）；WeGame / Epic API 主体不匹配桌宠用例。

### 4.3 跨数据源 Mock（Task C）

1. **覆盖完整**：60 分钟时间窗（2026-04-21 09:00–10:00Z）内为合成玩家 `player_a1c93f01` 产出 **9 类数据源**对齐事件流，共 51 条数据项 + 1 个游戏 session（16 事件）+ 3 个 profile 演化快照 + 12 个 current_context 切面。
2. **未沿用真实 SDK ID 形态**：所有 ID / 游戏字段使用 `player_<8 hex>` / `<game_codename>` / `<quest_codename_*>` / `<class_codename_*>` / `<loadout_codename_*>` 占位形态；**未沿用** `chenmo_chat_output.json` 的 `msdk_xxx` ID。
3. **三层抽象在时间线上的累积可验证**：atomic_facts 从 4 条累积到 15 条；episode 4 个 + 1 个游戏 session 派生；profile 3 个快照体现 `interests` / `preferences` / `behavior_patterns` / `key_facts` + 元字段（confidence / source / decay / user_corrected）的演化。
4. **current_context 滑窗变更可验证**：12 个切面覆盖 BOSS 战进程 / 死亡复活 / 通关祝贺 / 会议提醒等关键转折，9 个为事件变化触发推送、3 个为心跳，符合 §4.8.3 推送策略。
5. **与 §11 mock 仅 5 处补充**：所有补充均为**字段扩展**（不删除、不改名）；详见 `MOCK_DATA_cross-source-memory-dataset.md` §6 表格。

## 5. Source Quality

- 调研过程中验证 WebSearch / WebFetch 工具权限**已可用**（与 2026-04-28 W18 阻塞期不同；如 Main Thread 之前在 `decisions/DECISION_LOG.md` 因解锁权限留痕，可对应核对）。
- 一级源（Apple Developer / Microsoft Learn / 各 app 官方 / arXiv / 各官方 MCP 仓库）全部由 WebSearch + WebFetch 实地验证；二级源用作交叉验证（Daring Fireball / 9to5Mac / Wikipedia / GeekWire / Doublepulsar 等）。
- 三级源（YouTube / Reddit / X / 知乎 / 少数派等）严格遵守"只作信号、不作事实"。
- 事实 / 观点 / 推测三层在两份 TREND_RESEARCH 文件末尾均有显式分层标注。
- 部分 GitHub stars 数字 / commit 日期未取得，已标注"数据未取得"——PM 阶段无影响；Engineering 真正立项前由工程同学拉取仓库元数据复核。

## 6. Questions for PM Strategy Thread

1. **Q-mcp-候选锁定**：是否锁定 Task B §4.1 推荐的 5 个 P1 候选（滴答 / 飞书 / Steam / OfficeMCP / 钉钉）作为 MVP MCP 首批接入对象？需在 `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §4.4.3 / §13 留痕。
2. **Q-番茄移除**：番茄 ToDo / Focus To-Do / Forest 经调研确认**无公开通道**，是否同意从 PM §11.5 候选 MCP 清单移除？
3. **Q-mock-字段补充**：Task C 与 §11 mock 在 5 处做了字段扩展（详见 `MOCK_DATA_*.md` §6），PM 是否接受这些补充作为下一版 §11 mock 的修订点？
4. **Q-字段最终命名**：Task A / B / C 三份产物均使用 PM §11 语义命名；Engineering Build Thread 在 schema 阶段确认最终拼写时，PM 是否需要再过一遍？

## 7. Questions for Engineering Build Thread（参考阅读，不在本次决策范围）

1. Context Capture Adapter 是否接受 Task A §10 的"P0 配方 + P1 配方"作为 watcher 设计起点？
2. MCP connector 是否接受 Task B §9 推荐的统一 schema `{source, value, started_at, expires_at}` 抽象？
3. 是否接受 Task C `current_context.trigger` 字段作为正式 schema 的一部分（mock 中用于评估推送频次）？

## 8. Whether Main Thread Needs to Update SYNC_SUMMARY

**Yes** — 建议 Main Thread：

1. 在 `06-sync/TASK_BOARD.md` 标记或新建 Radar 任务条目，状态置为 `Done`，链回本通告与 4 个产物。
2. 在 `06-sync/SYNC_SUMMARY.md`：
   - §2 Latest Decisions：增 1 行"2026-05-11 Radar 完成 memory-dataset 分支三项调研（行为信号库 + 中国 app MCP + 跨数据源 mock）"，链回本通告。
   - §6 Next Actions：增加"PM Strategy Thread 接续阅读 4 个产物，回答 §6 中的 4 个 Questions，并决定是否升级 mock §11 / 锁定 P1 候选清单"。
   - §7 Links to Important Messages：增 4 行链接到 4 个新产物 + 1 行链接到本通告。
3. 视情况判断是否需要 `decisions/DECISION_LOG.md` 留痕（特别是"番茄类 app 从候选移除"与"5 个 P1 候选锁定"两项 PM 立场升级）。

## 9. Suggested Next Thread

**PM Strategy Thread** — 阅读 4 个产物，回答 §6 中的 4 个 Questions；如需要进一步澄清，可在 `06-sync/dm/pm-to-radar/` 派新 DM。

如 PM 暂不接手，**回到 Main Thread**做 §8 收口动作。
