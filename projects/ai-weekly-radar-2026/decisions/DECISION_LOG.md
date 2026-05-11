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
| 2026-04-28 | Project Setup | 创建项目 `ai-weekly-radar-2026`，主题锁定 AI Agent / AI Coding / 游戏 AI 三大方向，复制 `_PROJECT_TEMPLATE` 作为骨架 | 用户希望以稳定节奏跟踪 2026 年三大 AI 方向；APB 项目级产物必须落在 `projects/<slug>/`，不混入 `workspaces/`；模板提供统一目录结构与读写边界，降低后续多线程协作成本 | 新建 `projects/ai-weekly-radar-2026/` 全套目录；后续周报落在 `04-research/` 而非 `workspaces/` | Accepted |
| 2026-04-28 | Scope | 仅初始化项目骨架，不在本次执行任何研究 | 用户明确指示"只初始化项目，不执行研究"；先把上下文、阶段、范围、Open Questions 锁定，避免研究内容污染未对齐的边界 | AI Trend Radar Thread 暂不启动；首期周报启动时点见 `00-context/PROJECT_CONTEXT.md` Open Questions #1 | Accepted |
| 2026-04-28 | Scope | 明确"研究项目"而非"产品项目"，不构建订阅站点 / Newsletter 系统 / APP | 项目目标是为决策与立项提供输入，不是面向外部读者分发；构建产品形态会扩散投入并稀释研究质量 | `02-design/` 与 `03-engineering/` 默认不启用；产物全部在 `04-research/` 以 Markdown 形式沉淀 | Accepted |
| 2026-04-28 | Scope | 首期周报采用"以执行当天为结束日、向前回溯 7 天"的滚动窗口，并合并为基线周报 | 用户明确要求 7 天窗口（2026-04-22 → 2026-04-28），且要求做基线周报；将基线与首期合并避免内容重复，同时让首期立刻具备时间锚点 | 首期文件命名 `AI_WEEKLY_REPORT_2026-W18.md`，Issue 字段标 `Baseline`；第 2 期起对齐 ISO 周 | Accepted |
| 2026-04-28 | Scope | 锁定 19 个一级 / 二级 / 三级信源，并按可信度分级使用 | 用户给出明确清单；分级处理可避免社区信号被当作事实写入；与 `00-context/PROJECT_CONTEXT.md` 第 13 节"内容安全"边界一致 | 一级（Lab/Vendor/学术/OECD）可直接引为事实；二级（媒体）需交叉验证；三级（YouTube/Reddit/X）仅作线索；详见 `00-context/LINKS.md` | Accepted |
| 2026-04-28 | Scope | 周报采用 10 字段结构（Title / Summary / Source / Category / Why it matters / Product opportunity / Technique / Confidence / Impact / Suggested action） | 用户给出 9 字段需求，本项目在此之上补 Source 作为强制字段（保留可追溯性）；Confidence + Impact 双维度评分是把"信号"变"决策输入"的关键 | 模板落在 `04-research/AI_WEEKLY_REPORT_TEMPLATE.md`；Confidence / Impact 评分细则见模板第 6 节 | Accepted |
| 2026-04-28 | Scope | Category 取值集合定为 AI Agent / AI Coding / Game AI / AIGC / Tooling / Other | 用户明确给出前 5 类并以"等"扩展；用 Other 兜底避免漏分类，但不要扩散为长尾分类 | 三大方向（AI Agent / AI Coding / Game AI）固定为周报章节；AIGC / Tooling / Other 进入"横向 / 风险信号"段；新增分类前必须先在本日志记录决策 | Accepted |
| 2026-04-28 | Scope | 周报每周一上午收口；覆盖窗口为执行当天向前回溯 7 天；节假日 / 冲突可顺延 | 固定节奏让产物可预期；执行当天回溯 7 天的滚动窗口比 ISO 周对齐更宽容；顺延规则避免节假日造成内容断档 | 命名沿用 `AI_WEEKLY_REPORT_<YYYY-Wxx>.md`（按结束日所在 ISO 周）；顺延后在 Meta.Window 字段如实记录跨期 | Accepted |
| 2026-04-28 | Scope | 三级信源（YouTube / Reddit / X）不预设固定清单，按主题临时检索；连续 2–3 期持续有价值的源升级为固定池 | 预设清单容易陷入"看起来覆盖、实际无用"陷阱；连续命中规则把固定化的门槛提高，避免信源池膨胀 | `LINKS.md §2.4` 不列具体频道；升级时由 Radar Thread 提议并在本日志留痕；三级源永不作为事实依据 | Accepted |
| 2026-04-28 | Scope | 中文媒体（机器之心、量子位、PaperWeekly）作为二级 / 三级辅助源；独家报道默认 Confidence 中 / 低 | 中文源对国内趋势 / 中文语境 / 行业讨论有帮助，但事实层不能替代英文一手；默认低 Confidence 强迫回查英文来源 | `LINKS.md §2.7` 收录三家中文源；周报模板 Confidence 评分细则补充中文源例外条款；不影响 §2.1 一级信源认定 | Accepted |
| 2026-04-28 | AI | 首期周报（Issue = Baseline）采用"30 天背景 + 7 天增量"双段结构，合并为同一文档 | 基线 + 首期合并避免重复内容；30 天背景给后续周报锚定共同起点；增量段确认 7 天滚动窗口默认行为 | 仅 Issue = Baseline 期填写 Baseline 段；常规期删除该段；模板 `04-research/AI_WEEKLY_REPORT_TEMPLATE.md` 已落地双段结构 | Accepted |
| 2026-04-28 | Risk | T-001（首期 W18 周报）暂停，等待可验证来源（联网权限解锁 / 用户提供 URLs / 降级为骨架）三选一决策 | Radar Thread 在启动时遭遇 WebSearch / WebFetch permission denied；模型 cutoff = 2026-01 早于周报窗口（2026-03-29 → 2026-04-28），无联网验证下继续会同时违反 `PROJECT_RULES.md §7`、`RADAR_THREAD_START.md §7`、`LINKS.md §3`；为坚守"事实必须来源回溯"硬规则，主动停手优于产出未经验证内容 | T-001 在 `06-sync/TASK_BOARD.md` 标 Blocked；`06-sync/SYNC_SUMMARY.md §5` 记 P1 Blocker；Radar Thread 保持 Idle 不自行重试；恢复路径见 `SYNC_SUMMARY.md §6`；blocker 报告见 `06-sync/group/2026-04-28T_radar_blocked-w18-web-tools-denied.md` | Accepted |
| 2026-04-28 | Risk | T-001 恢复路径选定为路径 1：解锁 WebSearch / WebFetch 给 Radar Thread 并重跑首期周报 | 路径 2（用户自行检索）会把研究负担转给用户，违背 Radar Thread 的自动化职责；路径 3（降级骨架）与现有 `AI_WEEKLY_REPORT_TEMPLATE.md` 重复，价值低；路径 1 保留 T-001 真正产物形态，是用户与 Radar 的共识方案 | 待 `.claude/settings.json` 权限配置完成（实施方式见 `SYNC_SUMMARY.md §6` Step 1.a/b/c）；权限落地后 T-001 → In Progress，由用户再次启动 Radar Thread；放行域名清单详见 `06-sync/group/2026-04-28T_radar_blocked-w18-web-tools-denied.md` §"Options 1" | Accepted |
| 2026-04-28 | Risk | 在项目级 `.claude/settings.json` 写入 1 个 `WebSearch` + 28 个 `WebFetch` 域名白名单作为 T-001 解锁实施 | 用户选择实施方式 a（Main 起草、用户审核、Main 落盘）；项目级文件比用户级 `~/.claude/settings.json` 更合适：仅服务本项目研究流程、入 git 提升可复现性、不污染全局；最小集合先放行 Radar 推荐 + LINKS 信源池（含三级社区 4 项），后续撞墙再增量补 | 新建 `/.claude/settings.json`（入 git）；`~/.claude/settings.json` 与 `settings.local.json` 保持原样；T-001 从 Blocked 解锁回 Backlog；后续若需私有源或不入库，可改用 `.claude/settings.local.json` 并更新 `.gitignore` | Accepted |
| 2026-04-28 | Risk | 让 #11 已落盘的 `.claude/settings.json` WebFetch + WebSearch 白名单**真正生效**（待用户在三种修复方式中选定后批准） | #11 文件已写入但 Radar 第二次启动 T-001 仍 `permission denied`（详见 `06-sync/group/2026-04-28T15-21-54_radar_blocked-w18-web-tools-denied.md` 与 `SYNC_SUMMARY.md §5` P0）；推断 3 种可能原因：(a) Claude Code 当前会话未热加载 settings — 需重启客户端；(b) 项目级 `.claude/settings.json` 对子 Agent 不生效 — 需把白名单复制到用户级 `~/.claude/settings.json`；(c) permission 语法与 CC 版本不兼容 — 需调整为 `WebFetch:domain:X` / `WebFetch(*.X)` 等备选语法。修复必须落地，否则 T-001 永久 Blocked，违反 PROJECT_CONTEXT §5 北极星 | T-001 暂留 Blocked（P0）；用户从 (a)/(b)/(c) 中选定后由 Main Thread 落地：(a) 仅需用户重启 CC，无文件改动；(b) Main Thread 写 `~/.claude/settings.json`（需用户额外授权，超出本项目仓库范围）；(c) Main Thread 改写 `/.claude/settings.json`；任何方式落地后 Radar 重跑，T-001 → In Progress | Proposed |

## 维护规则

- 决策提议者可以是任何线程，但 `Accepted` / `In Effect` 状态由 Main Thread 确认。
- 决策被替代时不要删除原条目，新增一行 `Superseded`，并在 Reason 中链到新决策。
- 涉及合规、隐私、内容安全的决策必须在 `Impact` 列注明影响范围。
- 不在本文件写入凭据、真实玩家数据或未脱敏内部资料。
