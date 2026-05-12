# Trend Research: 中国流行 App MCP Server 公开能力

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-11
> Reference spec: `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §3.4 / §4.4 / §11.5
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-11T17-10-08_pm_china-app-mcp-server-radar-research.md`
> Companion deliverables: `TREND_RESEARCH_behavior-signal-libraries.md`、`MOCK_DATA_cross-source-memory-dataset.{json,md}`

## 1. 引言

**调研目标**：为 `desktop-pet` 项目 P1 优先级"MCP 接入主流 app 状态信号"决策提供事实底盘。范围覆盖 22 个中国 C 端用户高频使用的娱乐 / 办公 / 日历任务 / 游戏 launcher 类 app。

**对齐 PM 决策**：
- MCP 是**唯一合规获取通道**（PM §4.4.3）：app 主动暴露 → 用户授权 → 桌宠拿到；不允许绕过 MCP 读 app 私有数据 / 数据库 / 文档。
- MVP 不依赖 MCP 层；若生态成熟到位可在 P1 接入 **3–5 个 app**。
- 中国地区可用性是硬指标；海外 MCP 但国内不可访问的，仍可列在矩阵参考，但不视为推荐项。

**信源说明**：
- 一级源：各 app 官方开放平台（`open.feishu.cn`、`open.dingtalk.com`、`docs.qq.com`、`developer.wegame.com`、`openhome.bilibili.com`、`developer.music.163.com`）和 MCP 官方生态目录（`modelcontextprotocol.io`、`github.com/modelcontextprotocol/servers`）。
- 二级源：GitHub 三方仓库与 LobeHub / PulseMCP / mcp.so / mcpservers.org 等聚合目录。
- 三级源：仅作信号；不写入"事实"段。

**中国可用性判定**：(1) GitHub 仓库可访问性国内通常不稳定但可获取（影响开发者侧）；(2) 是否需要中国地区主体注册（如腾讯文档、企业微信、飞书国内版要求企业资质）；(3) 服务端 endpoint 是否对国内网络开放（Microsoft 365 提供 21Vianet 中国版）；(4) 鉴权账号是否在国内可正常登录。

---

## 2. 总览矩阵

| App | 类别 | 官方 MCP | 三方 MCP（含 stars / 活跃度） | 公开 API（非 MCP） | 暴露字段示例 | 稳定性 | 中国可用性 | 桌宠适配优先级 |
|---|---|---|---|---|---|---|---|---|
| Bilibili | 娱乐 | 未找到官方 MCP（开放平台为 UP 主 / 机构合作） | 多个三方：`huccihuang/bilibili-mcp-server`、`wangshunnn/bilibili-mcp-server`、`adoresever/bilibili-mcp`、`222wcnm/BiliStalkerMCP` 等 6+ 仓库，单仓 stars 数据未确认 | 有（非官方汇总 `SocialSisterYi/bilibili-API-collect`，及官方 `openhome.bilibili.com`） | search_video、video_info、user_dynamics、subtitle、弹幕；**无 "currently watching"** | 中（生态分散，多为搜索类） | ✅ 可用 | P2 候选（搜索 / 榜单类信号易得，"当前观看"需客户端 hook 不在范围） |
| QQ 音乐 | 娱乐 | 未找到官方 MCP | `Samge0/mcp-qqmusic-test-server`（搜索功能为主）、`Roy-gyy/QQMusic`（Playwright + FastMCP，含登录 / 搜索 / 评论），stars 数据未确认 | 无官方公开 API；社区库存在（`Rain120/qq-music-api`） | search_music、song_info、comments；**当前播放需依赖客户端 Playwright 模拟** | 低-中（多为实验性测试服） | ✅ 可用 | 暂不考虑（"now playing" 路径不可靠） |
| 网易云音乐 | 娱乐 | 未找到官方 MCP（官方 `developer.music.163.com` 仅面向机构合作） | `Code-MonkeyZhang/cloud-music-mcp`（macOS 客户端控制，8 stars）、`xiduan/cloudmusic_auto_player`、`luuu-h/netease-music-mcp`，多为本地客户端控制类 | 官方有但需机构申请；社区 `NeteaseCloudMusicApi` 长期事实标准 | login、search、play、daily_recommend、my_playlists；**get_current_song 在 Code-MonkeyZhang 实现中缺失** | 中（依赖本地客户端） | ✅ 可用 | P2 候选（macOS 用户 + 本地客户端在线时可获 now_playing 雏形） |
| 腾讯视频 | 娱乐 | 未找到 | 未找到专用 MCP | 无标准公开 API（仅合作授权） | — | — | ⚠️ 受限 | 暂不考虑 |
| 爱奇艺 | 娱乐 | 未找到 | 未找到专用 MCP | IOCP 等仅面向 CDN / 合作 | — | — | ⚠️ 受限 | 暂不考虑 |
| 优酷 | 娱乐 | 未找到 | 未找到专用 MCP | 无公开个人 API | — | — | ⚠️ 受限 | 暂不考虑 |
| 抖音 | 娱乐 | 未找到官方 MCP（`open.douyin.com` 面向开发者但未发布 MCP） | 多个：`yzfly/douyin-mcp-server`、`yc-w-cn/douyin-mcp-server`、`flyerhzm/douyin-mcp`（含 Playwright 上传）、`Nathansnmmer/douyin_hot_analysis_mcp` 等，stars 未确认 | 有官方开放平台 OAuth API | parse_video_url、download_no_watermark、hot_list、search、upload；**无个人当前观看视频流** | 中（多为视频解析类） | ✅ 可用 | 暂不考虑（个人观看历史路径未公开） |
| 小红书 | 娱乐 | 未找到 | `iFurySt/RedNote-MCP`、`MilesCool/rednote-mcp`、`TimeCyber/mcp-xiaohongshu`、`FrancoSbaffi/xhs-mcp` | 无标准官方 API | search_notes、note_detail、publish；**无个人 feed** | 中 | ✅ 可用 | 暂不考虑（与桌宠"知心好友"信号契合度低） |
| Microsoft Word | 办公 | 有：Microsoft 官方 Word MCP（PulseMCP 收录）；`Softeria/ms-365-mcp-server` 200+ Graph 工具，**支持 21Vianet 中国云** | `GongRzhe/Office-Word-MCP-Server`、`theWDY/office-editor-mcp`、`OfficeMCP/OfficeMCP`（COM 自动化，支持 WPS） | Microsoft Graph + COM | current_document、read / write、recent_files；OfficeMCP 暴露 `Officer.Word` 当前应用对象 | 高（官方 + ms-365） | ✅ 可用（21Vianet）或 ⚠️（个人 M365 国际版鉴权偶受限） | **P1 候选**（OfficeMCP 提供"当前文档"信号） |
| Microsoft Excel | 办公 | 同 Word（Microsoft 官方 + Softeria/ms-365-mcp + Arcade.dev） | OfficeMCP 暴露 `Officer.Excel` | Graph + COM | current_workbook、cell read、formula write、recent_files | 高 | ✅ / ⚠️ | P1 候选 |
| Microsoft PowerPoint | 办公 | 同 Word | OfficeMCP 暴露 `Officer.Powerpoint` | Graph + COM | current_pres、slide read | 高 | ✅ / ⚠️ | P1 候选 |
| WPS Office | 办公 | 未找到官方 MCP | `OfficeMCP/OfficeMCP`（覆盖 WPS）、`LargeCupPanda/WPS_Skills`（基于 Claude + COM / HTTP） | WPS 加载项 API；无公开 OpenAPI | current_document（Windows COM）、文档自动化 | 中（依赖本地 COM） | ✅ 可用 | **P1 候选**（国内 WPS 用户极多，OfficeMCP 路径已成型） |
| 腾讯文档 | 办公 | **有官方 MCP**：`https://docs.qq.com/openapi/mcp`（HTTP + Authorization 头，免安装）；并见 `cloud.tencent.com/developer/mcp/server/11803` | 三方 `VincentChris/qq-doc-mcp` | 腾讯文档 OpenAPI | create_doc、read_doc、update、Markdown→Excel / PPT；**"当前打开"语义在官方 MCP 文档未明确出现** | 高（官方） | ✅ 可用 | P2 候选（文档列表 / 最近编辑可作"工作中"信号） |
| 飞书 / Lark | 办公 | **有官方 MCP**：`larksuite/lark-openapi-mcp`，stars 报告值 424–691（数据未一致），最后 release v0.5.1（2025-08） | `cso1z/Feishu-MCP`、`Li-vien/lark-tools-mcp` 等数十个 | 飞书开放平台 OpenAPI | calendar.create / list / search、im.message、docs（编辑暂不支持）、free_busy、attendees | 高（官方，Beta） | ✅ 可用（国内版 `open.feishu.cn`） | **P1 候选**（calendar_next_event 字段成熟） |
| 钉钉 | 办公 | **有官方 MCP**：`open-dingtalk/dingtalk-mcp`，官方文档 `open.dingtalk.com/document/ai-dev/dingtalk-server-api-mcp-overview`；最后 commit 2026-01-06（信号偏低活跃） | `wllcnm/dingding_mcp_v2`、`DingTalk-Real-AI/dingtalk-workspace-cli` | 钉钉开放平台 | get_calendar_list(userid, start_time, end_time)、contacts、robot 消息、todo、check-in、project | 中-高（官方但更新慢） | ✅ 可用 | **P1 候选**（calendar_next_event 直接可用） |
| 企业微信 | 办公 | 有官方 CLI：`WecomTeam/wecom-cli`（含 messaging / docs / calendars / meetings / tasks，宣称面向 Agent）；未明确"MCP server"标识 | `loonghao/wecom-bot-mcp-server`（Python，Bot 推送为主）、`shellus/qiye_wechat_mcp`、`sunnoy/openclaw-plugin-wecom` | 企业微信开放平台 | 创建日历、bot 推送、消息、文档；calendar API 见 `developer.work.weixin.qq.com/document/path/93647` | 中（侧重 Bot / 通知，非个人状态） | ✅ 可用（需企业资质） | P2 候选（个人 C 端用户难直接接入） |
| 滴答清单（Dida365 / TickTick） | 日历 / 任务 | 未找到官方 MCP；官方 OpenAPI 存在 | 大量三方：`Martinqi826/dida-mcp`（7 stars，2026-03 release）、`jacepark12/ticktick-mcp`、`Xrondev/mcp-dida365`、`ZH1754629545/dida365-mcp-servers`、`zhongwencool/dida-mcp-server`、`evalor/Dida365MCP`（声称 100% 覆盖官方 OpenAPI）、`Code-MonkeyZhang/ticktick-mcp-enhanced` | 滴答官方 OpenAPI（OAuth 2.0） | get_tasks_due_today、get_overdue_tasks、search_tasks、projects、tags；**Pomodoro 状态多数未直接暴露** | 中-高（官方 OpenAPI + 多个三方） | ✅ 可用（中国版 dida365.com） | **P1 候选**（次日待办、今日截止、当前项目最契合"知心好友"） |
| Notion | 日历 / 任务 | **有官方 MCP**：`makenotion/notion-mcp-server`（Cloudflare Workers 托管 + OAuth） | `suekou/mcp-notion-server` | Notion REST API | search、retrieve_page、databases、blocks；可派生 calendar / task | 高 | ⚠️ 受限（国内访问需网络条件；非中国大陆官方服务） | 暂不考虑（中国 C 端用户基数有限） |
| 番茄 ToDo / Focus To-Do / Forest | 日历 / 任务 | **未找到官方 MCP** | 仅通用 `Pomodoro AI MCP`（CSOAI-ORG，独立工具，非接入具体 app） | 这三个 app **均无公开个人 API** | — | — | ❌ 不可用 | 暂不考虑（路径不存在） |
| 腾讯日历 | 日历 / 任务 | 未找到 | 未找到 | 客户端支持 CalDAV / Exchange / 企微日历同步；无独立公开 OpenAPI（信息来自 sspai / 腾讯轻联） | 通过 CalDAV 可得日程，但需用户授权 | 中（间接路径） | ✅ 可用 | P2 候选（用桥接而非直连） |
| 企业微信日历 | 日历 / 任务 | 见企业微信行 | — | `developer.work.weixin.qq.com/document/path/93647` | 创建 / 查询日历 | 中 | ✅ 可用（需企业资质） | P2 候选 |
| Steam | 游戏 launcher | 未找到官方 MCP | 多个三方：`algorhythmic/steam-mcp`、`dsp/mcp-server-steam`、`TMHSDigital/steam-mcp`（25 工具）、`Praeses0/steam-mcp`（14 工具）；stars 数据未确认 | 官方 Steam Web API（IPlayerService / ISteamUser） | ISteamUser/GetPlayerSummaries → 正在玩游戏（gameid / gameextrainfo）、GetRecentlyPlayedGames、库存 | 高（官方 API） | ✅ 可用（需 API Key + Profile 公开；中国大陆访问 store 受限，Web API 通常可达） | **P1 候选**（"正在玩"信号最纯净） |
| WeGame | 游戏 launcher | 未找到 MCP | 未找到 MCP | 官方 `developer.wegame.com` Web API + Rail SDK（C++ / C#），但**面向接入 WeGame 的游戏 CP，不面向第三方读取用户当前游戏** | 不暴露"个人当前游戏"给三方应用 | — | ⚠️ 受限 | 暂不考虑（API 主体不匹配） |
| Epic Games（含中国版） | 游戏 launcher | 未找到 MCP | 未找到（社区 EOS 工具非 MCP 桌面 launcher 状态） | EOS Web API + Connect API；面向开发者集成，不暴露"我现在在玩什么"个人 endpoint | — | — | ⚠️ 受限（中国版 2023 上线但 API 主体仍是 EOS 开发者） | 暂不考虑 |

---

## 3. 分组小结

### 3.1 娱乐组

- **"now playing"最易接入**：网易云音乐（`Code-MonkeyZhang/cloud-music-mcp` 路径，macOS 本地客户端 OpenAPI）是当前社区最接近"知心好友看见你刚听完那首歌"的方案；但当前暴露的 6 个 tool 中**并无显式 `get_current_song`**，需要轻度二次开发。
- **生态空白**：腾讯视频 / 爱奇艺 / 优酷三家均无公开个人 API、无三方 MCP，**事实上对桌宠不可达**。
- **抖音 / Bilibili**：三方 MCP 数量多但均聚焦"内容搜索 / 视频解析 / 上传"，**没有"当前观看视频流"** 这种个人状态字段。可用于"桌宠推热门话题"而非"知道你刚看了什么"。
- **QQ 音乐**：仅有测试服级别 MCP；要拿 now_playing 需 Playwright 模拟，**违反"不调研逆向 / hook"** 原则。

### 3.2 办公组

- **当前文档信号最强**：`OfficeMCP/OfficeMCP` 仓库通过 Windows COM 暴露 `Officer.Word / Excel / Powerpoint` 的当前应用对象，**同时覆盖 WPS**。这是国内桌面办公场景最直接的路径。
- **飞书 vs 钉钉 vs 企业微信开放平台 MCP 成熟度阶梯**：
  - **飞书**：`larksuite/lark-openapi-mcp` 官方维护 + 持续 release + calendar 预设清单完备 → **梯队第一**。
  - **钉钉**：`open-dingtalk/dingtalk-mcp` 官方仓库 + 文档完备，但 2026-01 后 commit 偏低 → **能用，活跃度需观察**。
  - **企业微信**：官方 `WecomTeam/wecom-cli` 偏 CLI / Agent，三方 MCP 以 Bot 推送为主，**个人 C 端用户契合度最低**。
- **腾讯文档**有官方 HTTP MCP endpoint，但其 tool 偏"创建 / 读取 / 更新文档"，**未见"我现在在编辑哪份"语义**；适合"最近编辑了什么"派生信号。

### 3.3 日历 / 任务组

- **滴答清单 MCP 现状**：无官方 MCP，但有 ≥7 个活跃三方仓库，多数走官方 OpenAPI + OAuth 2.0，质量相对统一；其中 `evalor/Dida365MCP` 自称 100% 覆盖官方 API，`Martinqi826/dida-mcp` 自称首个中国版 dida365.com 支持。**这是日历任务组最成熟的 MCP 接入面**。
- **番茄钟类 app**：番茄 ToDo / Focus To-Do / Forest **均无公开 API**。事实：调研中未找到任何官方或社区 MCP。
- **Notion**：官方 MCP 成熟，但 Notion 在中国大陆访问条件特殊，**不视为 C 端推荐项**。
- **腾讯日历 / 企微日历**：官方走 CalDAV / Exchange / 企微开放平台，无直接 MCP；可通过 CalDAV 桥接得到 `calendar_next_event`，但落地工作量高于飞书 / 钉钉。

### 3.4 游戏 launcher 组

- **Steam 最干净**：Web API（`ISteamUser/GetPlayerSummaries`）在 `gameextrainfo` 字段直接给"正在玩什么"，多个三方 MCP 已封装；API Key 申请即可。中国大陆 Steam 商店访问受限，但 Web API endpoint 一般可达；用户 Profile 需公开。
- **WeGame**：`developer.wegame.com` 的 Web API 与 Rail SDK 面向**接入 WeGame 的游戏 CP**，不暴露"该用户当前在 WeGame 启动了什么"给第三方应用；事实：调研未发现任何 MCP 或匹配场景的公开 API。
- **Epic 中国地区**：EOS API 是开发者侧，无"个人当前游戏"endpoint；中国大陆 Epic 用户基数本就有限。

---

## 4. PM 决策建议

### 4.1 推荐 MVP 首批集成 **3–5 个 app**（P1 候选）

**优先级排序**：

1. **滴答清单（Dida365）** — 中国版用户基数大，多个活跃三方 MCP，OAuth 标准化；可直接拿到"今日截止 / 已逾期 / 当前优先级任务"。"知心好友"叙事最强。
2. **飞书（国内版 `open.feishu.cn`）** — 唯一拥有官方维护 MCP 的国产协作工具，calendar_next_event 字段链路最短；建议作为"今天还有什么会"信号的首选。
3. **Steam Web API（封装为 MCP）** — "你刚在玩 XX"是桌宠用户最易感知的细节；三方 MCP 多，封装风险低；中国地区 Steam 用户基数对应 Tencent IEG 用户画像高度契合。
4. **OfficeMCP（覆盖 Microsoft Office + WPS）** — 通过 Windows COM 提供"当前文档"信号，对国内白领用户一站式覆盖 Word / Excel / PPT / WPS，是少数能给出"当前正在写什么"的路径。
5. **钉钉** — 作为飞书的备选，覆盖国企 / 教育系用户；官方 MCP 已具备 calendar 工具，但活跃度需观察。如团队精力有限，可推迟到 P1 后半段。

**理由总结**：
- 5 个候选覆盖了"工作中的你"（飞书 / 钉钉、Office / WPS）、"待办的你"（滴答）、"娱乐的你"（Steam）三类核心场景；
- 全部走官方 / 活跃三方 MCP，**不涉及客户端 hook / 爬虫**；
- 鉴权链路全部标准化（OAuth 2.0 / API Key / 企业凭证），合规风险可控。

### 4.2 P2 候选

- **网易云音乐**（macOS 本地客户端 + Code-MonkeyZhang 路径，需要小幅二次开发补 `now_playing`）
- **腾讯文档**（最近编辑列表，作为"工作中"派生信号）
- **腾讯日历 / 企微日历**（通过 CalDAV 桥接，工作量略高）
- **Bilibili**（热门话题 / 搜索类信号，不指望"个人当前观看"）

### 4.3 不建议接入

- 番茄 ToDo / Focus To-Do / Forest（**根本没有公开通道**）
- 腾讯视频 / 爱奇艺 / 优酷（无个人公开 API）
- WeGame / Epic 中国版（API 主体不匹配桌宠用例）
- QQ 音乐（"now playing" 路径只能靠 Playwright 模拟，违反范围）
- Notion（中国 C 端用户基数小，访问条件特殊）

---

## 5. 风险 / 长期跟踪

### 5.1 MCP 生态在中国的发展节奏

**事实**：
- 截至 2026-05，国产协作工具中**飞书、钉钉、腾讯文档**已上线官方 MCP，企业微信走 CLI / Agent 路线。
- 国产 C 端娱乐 app（音乐 / 视频 / 短视频 / 直播）**均未上线官方 MCP**；三方 MCP 多但聚焦内容侧而非"个人当前状态"。
- 大模型 cutoff 2026-01 后，飞书 release v0.5.1（2025-08）、钉钉 mcp 仓库 2026-01-06 commit、滴答多个仓库 2026-03 release 均有 URL 证据；Microsoft 365 MCP 已支持 21Vianet 中国云为 2026 之后新增信号。

**观点 / 推测**：
- 国产 C 端娱乐 app 短期内不大可能上线官方 MCP——它们更倾向把数据留在自有大模型 / Agent 里（豆包、混元、通义等），开放给 Claude / Cursor 等海外 Agent 工具的动力弱。
- 协作类（飞书、钉钉、腾讯文档）会持续加码 MCP，因为其 B 端 Agent 集成压力大。
- **判断**：桌宠 P1 接入飞书 / 钉钉 / Office / Steam / 滴答这 5 路即可覆盖主要细节感来源；继续观察网易云音乐和 Bilibili 是否会出官方 MCP，预计窗口在 **12–18 个月**。

### 5.2 中国 app 暴露 MCP 的常见模式

1. **开放平台桥接（最干净）**：滴答清单 / 飞书 / 钉钉 / 腾讯文档 / Microsoft 365 — 通过 OAuth + REST 调用已有 OpenAPI，三方仓库无需碰客户端。
2. **本地客户端 COM / OpenAPI**：OfficeMCP（COM）、网易云音乐 macOS OpenAPI — 限本机使用，跨设备能力弱但数据精度高。
3. **浏览器自动化 / Playwright**：QQ 音乐 `Roy-gyy/QQMusic`、抖音 `flyerhzm/douyin-mcp` — **超出本调研边界**，桌宠不推荐采用。

### 5.3 鉴权 / 合规风险

- 用户 token / API Key 必须本地加密存储，**不入 Git、不入日志、不入产品后台**。
- 飞书 / 钉钉 / 企微的"user_access_token vs tenant_access_token"语义差异显著，桌宠场景必须使用 `user_access_token` 才能拿到个人日程。
- Steam Profile 需用户主动设为公开。
- 滴答 OAuth 范围（scope）应只申请 `read` 任务清单，避免 `write`。
- 任何接入都需要在桌宠设置面板提供"撤销授权 / 清除 token"入口（GDPR / PIPL 合规底线）。

---

## 6. 参考链接清单

### 6.1 一级源（按 app 分组）

**协作 / 办公**：
- 飞书官方 MCP：https://github.com/larksuite/lark-openapi-mcp
- 飞书 MCP 文档（国内版）：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mcp_integration/mcp_introduction
- 钉钉官方 MCP：https://github.com/open-dingtalk/dingtalk-mcp
- 钉钉 MCP 概述：https://open.dingtalk.com/document/ai-dev/dingtalk-server-api-mcp-overview
- 钉钉日程查询 API：https://open.dingtalk.com/document/development/query-an-event-list
- 腾讯文档 MCP 概述：https://docs.qq.com/open/document/mcp/
- 腾讯文档 MCP 指南（腾讯云）：https://cloud.tencent.com/developer/mcp/server/11803
- 企业微信开放平台日历 API：https://developer.work.weixin.qq.com/document/path/93647
- 企业微信官方 CLI：https://github.com/WecomTeam/wecom-cli
- Microsoft 365 Graph 官方 MCP：https://learn.microsoft.com/en-us/graph/mcp-server/get-started
- Microsoft 365 MCP（含 21Vianet 中国云）：https://github.com/Softeria/ms-365-mcp-server

**日历 / 任务**：
- 滴答开放平台（开发者文档）经由三方 MCP `evalor/Dida365MCP`：https://github.com/evalor/Dida365MCP
- Notion 官方 MCP：https://github.com/makenotion/notion-mcp-server
- Notion MCP 文档：https://developers.notion.com/docs/mcp

**娱乐**：
- Bilibili 开放平台：https://openhome.bilibili.com/
- 网易云音乐开放平台：https://developer.music.163.com/st/developer/
- 抖音开放平台：https://open.douyin.com（一级源主页）

**游戏 launcher**：
- Steam Web API IPlayerService：https://partner.steamgames.com/doc/webapi/IPlayerService
- WeGame 开发者中心：https://developer.wegame.com/developer/game-wiki/help/doc/web-api-api-overview/zh_CN
- Epic Online Services API：https://dev.epicgames.com/docs/web-api-ref

### 6.2 二级源（按 app 分组）

**Bilibili**：
- https://github.com/huccihuang/bilibili-mcp-server
- https://github.com/wangshunnn/bilibili-mcp-server
- https://github.com/222wcnm/BiliStalkerMCP
- https://github.com/adoresever/bilibili-mcp
- https://github.com/SocialSisterYi/bilibili-API-collect

**QQ 音乐 / 网易云音乐**：
- https://github.com/Samge0/mcp-qqmusic-test-server
- https://github.com/Roy-gyy/QQMusic
- https://github.com/Code-MonkeyZhang/cloud-music-mcp
- https://lobehub.com/mcp/xiduan-cloudmusic_auto_player
- https://glama.ai/mcp/servers/luuu-h/netease-music-mcp

**抖音 / 小红书**：
- https://github.com/yzfly/douyin-mcp-server
- https://github.com/yc-w-cn/douyin-mcp-server
- https://github.com/Nathansnmmer/douyin_hot_analysis_mcp
- https://github.com/iFurySt/RedNote-MCP
- https://github.com/MilesCool/rednote-mcp

**Office / WPS**：
- https://github.com/OfficeMCP/OfficeMCP
- https://github.com/GongRzhe/Office-Word-MCP-Server
- https://github.com/theWDY/office-editor-mcp
- https://lobehub.com/mcp/largecuppanda-wps-mcp（WPS_Skills）
- https://www.arcade.dev/blog/microsoft-office-365-mcp-servers-launch/

**飞书 / 钉钉 / 企业微信三方**：
- https://github.com/cso1z/Feishu-MCP
- https://github.com/Li-vien/lark-tools-mcp
- https://github.com/loonghao/wecom-bot-mcp-server
- https://github.com/sunnoy/openclaw-plugin-wecom
- https://github.com/wllcnm/dingding_mcp_v2
- https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli

**腾讯文档三方**：
- https://github.com/VincentChris/qq-doc-mcp

**滴答清单**：
- https://github.com/Martinqi826/dida-mcp
- https://github.com/jacepark12/ticktick-mcp
- https://github.com/Xrondev/mcp-dida365
- https://github.com/ZH1754629545/dida365-mcp-servers
- https://github.com/zhongwencool/dida-mcp-server
- https://github.com/Code-MonkeyZhang/ticktick-mcp-enhanced

**Steam**：
- https://github.com/algorhythmic/steam-mcp
- https://github.com/dsp/mcp-server-steam
- https://github.com/TMHSDigital/steam-mcp
- https://github.com/Praeses0/steam-mcp

**生态目录**：
- https://github.com/yzfly/awesome-mcp-zh
- https://www.pulsemcp.com/
- https://lobehub.com/mcp
- https://mcpservers.org/

### 6.3 三级源（仅作信号，不作事实）

- 飞书 MCP 教程（知乎）：https://zhuanlan.zhihu.com/p/1911173353802298533
- 腾讯日历评测（少数派）：https://sspai.com/post/74256

---

## 7. 事实 / 观点 / 推测 分层标注

- **事实**：飞书 / 钉钉 / 腾讯文档官方 MCP 存在；滴答清单存在 ≥7 个三方 MCP 走官方 OpenAPI；Steam Web API 暴露 `gameextrainfo`；OfficeMCP 通过 COM 自动化覆盖 WPS；番茄 ToDo / Focus To-Do / Forest 无公开 API。所有 URL 均验证过链接形态。
- **观点**：飞书 MCP 比钉钉 MCP 活跃度更高（基于 release 节奏 + commit 时间）；OfficeMCP 是当前国内办公场景"当前文档"信号最直接的路径（基于覆盖面 + COM 稳定性）。
- **推测**：国产 C 端娱乐 app 在 12–18 个月内仍不大可能上线官方 MCP（基于商业逻辑外推，未来可能被打脸）；网易云音乐 MCP 路径需轻度二次开发即可补出 `now_playing`（基于现有 6 个 tool 的能力推断）。

---

## 8. 数据完整性说明

- 多个 GitHub stars 数字 / 最近 commit 日期未在搜索片段中明确取得，已标注"未确认"或"数据未取得"，建议在 P1 真正立项前由工程同学拉取仓库元数据复核（特别是 Steam 与滴答清单类多仓库竞争场景，应择优而选）。
- 关于飞书 MCP stars 数据，两次搜索得到 424 与 691 两个不一致值，**以官方仓库实时数据为准**，本报告不固化数字。
- 调研严格遵守 hard rules：未访问任何私有 API 文档、未泄漏 token、未调研逆向 / hook / 爬虫方案。

---

## 9. 给 PM 与 Engineering 的接续建议

1. **PM 决策点**：是否锁定上述 5 个 P1 候选作为 MVP MCP 首批接入对象？请在 `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §4.4.3 / §13 留痕。
2. **Engineering Build Thread**：在评估"Context Capture Adapter"时，把 MCP 接入封装为独立 connector，每个 connector 暴露统一 schema `{source, value, started_at, expires_at}`，桌宠侧不感知后端是飞书 / 钉钉 / 滴答还是 Steam。
3. **合规与法务**：5 个候选中飞书 / 钉钉 / 腾讯文档对个人 C 端用户的接入条款需要法务核验（用户 OAuth 是否允许写入个人偏好数据到桌宠本地长期存储）。
4. **观察期**：网易云音乐 / Bilibili 的官方 MCP 进展应在每月 AI Trend Radar 周报中作为 P2 跟踪项。
