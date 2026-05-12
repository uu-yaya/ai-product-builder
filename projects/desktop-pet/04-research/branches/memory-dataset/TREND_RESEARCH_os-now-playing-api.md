# Trend Research: OS Now Playing API（A1 标识）

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-12
> Reference spec: `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.10 audio A1 + §4.4 MCP `media_now_playing` 分工
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-12T09-13-46_pm_os-now-playing-api-radar-research.md`
> Companion deliverables: `TREND_RESEARCH_audio-derivation-libraries.md`（A0 派生）、`TREND_RESEARCH_browser-tab-detection.md`、`TREND_RESEARCH_local-vlm-feasibility.md`

## 1. 引言

**目标**：为桌宠 §4.10 audio A1 "Now Playing 标识"（曲目元数据：title / artist / album / progress / app source）提供事实底盘，并与 §4.4 MCP `media_now_playing` 形成清晰分工。

**结论先行**：Windows 走 SMTC（公开、稳定、推荐）；macOS 走 MediaRemote 但 **15.4 之后被 Apple 收紧**，需通过 `mediaremote-adapter` 这类 Perl entitlement 兜底方案，**App Store 分发不可行**，自分发桌宠可用但存在长期破裂风险。中国音乐 app 在 Windows 上 SMTC 集成度参差：QQ 音乐 2024-06 起官方原生支持，网易云需 inflink 类插件；视频侧 Bilibili PC 客户端有 SMTC 开关（事实），腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC **未验证**。

**信源界定**：Apple `MPNowPlayingInfoCenter` 与 Microsoft SMTC 是**公开 API**（app 向 OS 上报侧）；macOS MediaRemote 是**私有 framework**（消费者读取侧）—— 本调研讨论其存在性与同行使用案例，不涉及逆向细节。

---

## 2. macOS 章节

### 2.1 公开 / 半公开 / 私有边界

| 角色 | API | 状态 |
|---|---|---|
| App 上报"我在播放什么"给 OS | `MPNowPlayingInfoCenter`（MediaPlayer.framework） | 公开 |
| 消费者读取"系统当前在播什么" | `MediaRemote.framework` / `MRMediaRemoteGetNowPlayingInfo` | 私有（dlopen 调用） |
| 公开消费者侧 API | **不存在** | Apple 截至 2026-05 仍未提供（feedback report #637） |

### 2.2 MediaRemote 私有 framework 现状

- **典型字段**：`bundleIdentifier` / `parentApplicationBundleIdentifier` / `playing` / `title` / `artist` / `album` / `duration` / `elapsedTime` / artwork data / playback rate / shuffle / repeat（事实，来自 `ungive/mediaremote-adapter` 文档）。
- **macOS 15.4 重大变更（2025-03）**：Apple 在 `mediaremoted` daemon 中加入 entitlement 校验，**仅 Apple 系签名进程**（如 Control Center）可读取，第三方 app 直接 `dlopen` 全部失效。`kirtan-shah/nowplaying-cli` issue #28、BetterTouchTool、Keyboard Maestro 同步崩溃。
- **现有兜底方案**：
  - `ungive/mediaremote-adapter`（v0.7.6, 2026-05-11）—— 利用 `/usr/bin/perl`（被标识为 `com.apple.perl5`）持有 MediaRemote 访问权，作为转译层。**仍在持续更新，支持 15.4+ 全部版本**（事实）。
  - `MediaRemoteWizard` —— 注入 `mediaremoted` 字节码（需关 SIP，**不适合消费级桌宠**）。
- **同行案例**：`Silence`、`Sleeve.app`、`NowPlaying.app`、Spotify Menu Bar Controller 类工具 —— 在 15.4 后大批暂时不可用，逐步迁移到 mediaremote-adapter 路径。

### 2.3 公开 API（不适用桌宠消费者侧）

- `MPNowPlayingInfoCenter`：**app 主动上报**给 OS（Control Center 显示），不是消费者读取。
- `AVAudioSession` / iOS `MPRemoteCommandCenter`：相似的上报侧 API。
- **澄清**：桌宠不能用这些公开 API 来"读其他 app 在播什么"，方向相反。

### 2.4 Apple 立场

- feedback-assistant #637 明确请求 Apple 提供公开的 Now Playing 读取 API（建议加 TCC 同意流程）—— **开放状态，Apple 未回应**（事实，截至本次抓取）。

### 2.5 桌宠适用度

⚠️ **可用但有风险**：
- 自分发 / 内部分发 OK
- App Store 分发**必拒**（MediaRemote 是私有 framework）
- macOS 16 / 17 升级可能再次 break（基于 14→15.4 历史模式的**推测**）

---

## 3. Windows 章节

### 3.1 SMTC（公开 API）

- 命名空间：`Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager`
- 最低系统：**Windows 10 1809（10.0.17763）**，Win11 全部覆盖
- App capability 声明：`globalMediaControl`（UWP 沙盒需声明；Win32 直接 WinRT projection 也可用）
- **无 TCC 等价物**，无用户同意弹窗

### 3.2 完整字段

`GetMediaPropertiesAsync()` → `GlobalSystemMediaTransportControlsSessionMediaProperties`（事实，Microsoft Learn）：

| 字段 | 类型 |
|---|---|
| Title | string |
| Artist | string |
| AlbumTitle | string |
| AlbumArtist | string |
| AlbumTrackCount | int |
| TrackNumber | int |
| Genres | IVectorView<string> |
| Subtitle | string |
| Thumbnail | IRandomAccessStreamReference |
| PlaybackType | enum（Music / Video / Image / Unknown） |

`GetPlaybackInfo()` → `GlobalSystemMediaTransportControlsSessionPlaybackInfo`：

| 字段 | 备注 |
|---|---|
| PlaybackStatus | Closed / Opened / Changing / Stopped / Playing / Paused |
| PlaybackType | 同上 |
| Controls | 该 session 启用了哪些控件 |
| PlaybackRate | double |
| IsShuffleActive | bool |
| AutoRepeatMode | None / Track / List |

`GetTimelineProperties()` → Position / StartTime / EndTime / LastUpdatedTime（**progress / duration 来源**）。

Session 标识：`SourceAppUserModelId`（**关键**：桌宠从此字段判断"是哪个 app 在播"）。

### 3.3 同行案例

- `DubyaDude/WindowsMediaController`（C# / .NET wrapper，NuGet `Dubya.WindowsMediaController 2.5.6`）
- `Lyricify Lite`（基于 SMTC 监听，覆盖 Spotify / Apple Music / QQ 音乐 / NetEase UWP / Kugou / Groove 等）
- ModernFlyouts（开源 GSMTC 媒体控件 UI 替代）
- Win11 自带的任务栏媒体控件、Edge 浏览器全局控件

### 3.4 桌宠适用度

✅ **强烈推荐**：稳定、公开、覆盖广、字段完整、无权限弹窗。Win10 1809+ 已是 2018 年 10 月发布，覆盖率几乎 100%。

---

## 4. 跨平台对比

| 维度 | macOS（MediaRemote 私有） | Windows（SMTC 公开） |
|---|---|---|
| 是否公开 API | 私有 framework | 完全公开（WinRT） |
| 字段覆盖 | title / artist / album / state / progress / duration / artwork / bundleId | title / artist / album / albumArtist / genres / state / progress / duration / thumbnail / sourceAppUserModelId |
| App source 标识 | `bundleIdentifier` | `SourceAppUserModelId` |
| 权限 | 无 TCC，但 15.4+ 需 entitlement，第三方必须走 Perl adapter 兜底 | 无特殊权限，`globalMediaControl` capability 声明 |
| 最低 OS | macOS 10.13+，但 15.4 起需 adapter | Win10 1809+ |
| 稳定性 | macOS 升级偶有 break（14→15.4 大破裂） | 高，多年稳定 |
| App Store 分发 | ❌ MediaRemote 私有，必拒 | ✅ |
| 桌宠适用度 | ⚠️ 自分发可用，长期跟踪 | ✅ 推荐 |

---

## 5. 国产 / 主流 app 上报矩阵

| App | 类别 | macOS 上报 | Windows 上报 | 上报字段 | 上报条件 | 验证级别 |
|---|---|---|---|---|---|---|
| QQ 音乐（官方版） | 音乐 | 未验证 | ✅ 原生支持 | title / artist / album / artwork / progress | v20.22.2692.0613（2024-06-13）起内置 | 事实（FoskyM / QQMusicSMTC archive note） |
| QQ 音乐 UWP | 音乐 | n/a | ✅ | 同上 | UWP 天然集成 | 事实（Lyricify 列表） |
| 网易云音乐（官方版） | 音乐 | 未验证 | ⚠️ 部分 | 基础字段，时间轴不全 | 需 BetterNCM + `inflink-rs` 插件做完美匹配 | 事实（Lyricify docs） |
| 网易云音乐 UWP | 音乐 | n/a | ✅ | 完整 | UWP 内置 | 事实 |
| 酷狗音乐 | 音乐 | 未验证 | ⚠️ 部分 | title / artist / album，**无时间轴** | 内置，但 progress 走自定义计时器 | 事实（Lyricify docs） |
| 酷狗音乐 UWP | 音乐 | n/a | ✅ | 完整 | UWP 内置 | 事实 |
| 酷我音乐 | 音乐 | 未验证 | 未验证 | — | — | 未验证 |
| Spotify | 音乐 | ✅ 原生（含 macOS 15+ Notification Center widget） | ✅ 原生 SMTC | 完整 | 默认 | 事实（中国大陆无法访问，仅 VPN 用户） |
| Apple Music | 音乐 | ✅ 系统级 | ✅ via Apple Music for Windows | 完整 | 默认 | 事实 |
| Bilibili PC 客户端 | 视频 | 未验证（macOS 客户端较新） | ✅ 有"多媒体会话服务"开关 | title / artist=UP 主 / artwork | 设置 → 播放设置 → 开启多媒体会话服务 | 事实（v1.17.5 设置项） |
| Bilibili 网页版（Chrome / Edge） | 视频 | ✅ 经浏览器中转 | ✅ 经浏览器 SMTC 桥 | 视频标题，无 progress 完整 | 浏览器 MediaSession API 默认开启 | 推测（基于 Chrome 通用行为，未实测 Bilibili 具体页面） |
| 腾讯视频 PC | 视频 | 未验证 | 未验证 | — | — | 未验证 |
| 爱奇艺 PC | 视频 | 未验证 | 未验证 | — | — | 未验证 |
| 优酷 PC | 视频 | 未验证 | 未验证 | — | — | 未验证 |
| 抖音 PC | 短视频 | n/a | 未验证 | — | — | 未验证 |
| Chrome / Edge（YouTube 等） | 浏览器 | ✅ | ✅ | 视频标题 | 站点实现 MediaSession 时 | 事实（MDN / Chrome blog） |
| foobar2000 / MusicBee | 音乐 | n/a | ✅ | 完整（MusicBee 需插件） | — | 事实 |

**重要诚实声明**：标"未验证"的项目本调研**未做实测**，未实地装测，仅基于公开资料推断。腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC 客户端的 SMTC 上报状况**需要实测验证**（建议下一步排期）。

---

## 6. 中国地区可用性

- **macOS 中国版 vs 国际版**：无差异。MediaRemote / `MPNowPlayingInfoCenter` 是 OS 通用 framework，Apple 中国 ID 用户无任何限制（事实）。
- **Windows 中国版（21Vianet 云相关 SKU）vs 国际版**：SMTC 是 Win10 / 11 系统组件，无版本差异（事实）。Win10 LTSC / 政企定制版理论上同样支持。
- **国产 app 国服 vs 国际服**：
  - **QQ 音乐 macOS** —— 国服版本，是否实现 `MPNowPlayingInfoCenter` 上报**未验证**（搜索未找到明确证据，旧版反馈"锁屏后停止播放"暗示集成不深）
  - **网易云音乐 macOS** —— 同上，**未验证**
  - **桌宠 Win 路径覆盖率估算**：用户若主力 QQ 音乐 + 浏览器看 B 站，SMTC 兜底覆盖率约 **70%–80%**（推测）

---

## 7. 与 §4.4 MCP `media_now_playing` 的分工

| 路径 | 优势 | 劣势 | 触发场景 |
|---|---|---|---|
| MCP（如 NetEase MCP、QQ Music MCP） | 结构化字段（song_id、歌单上下文、用户喜欢度、社交评论数）、可关联用户播放历史 | 用户需主动启用 MCP，覆盖面窄 | 用户已配置音乐类 MCP |
| OS Now Playing API（SMTC / MediaRemote） | 零配置，全 app 通用 | 字段仅到 title / artist / album 标识层，无歌单 / 历史上下文 | 用户未配 MCP，或在播放 MCP 未覆盖的 app |

### 7.1 推荐策略

1. **MCP 优先**：若用户启用了对应 app 的 MCP（如网易云 MCP），用 MCP 数据（更丰富，含播放历史 / 歌单 / 个人偏好）
2. **OS API 兜底**：未启 MCP 或在播 MCP 未覆盖的 app（如 Spotify、Bilibili），用 SMTC / MediaRemote
3. **并存**：两者可同时运行，按 MCP > OS API 优先级合并；同一首歌从两路同时拿到时用 MCP 字段优先
4. **覆盖率叠加估算（推测）**：
   - 仅 MCP：~30%（依赖用户主动启用）
   - 仅 OS API：~60%（覆盖所有 SMTC 兼容 app）
   - **合并：~75%–85%**

---

## 8. 风险 / 长期跟踪

| 风险 | 严重度 | 监控点 |
|---|---|---|
| macOS 私有 framework 持续收紧（如 16 / 17 进一步加固） | 高 | mediaremote-adapter releases / kirtan-shah issues |
| Apple App Store 拒绝桌宠（如使用 MediaRemote） | 高（仅影响 MAS 分发路径） | 自分发 / 公证签名规避 |
| 国产 app SMTC 上报字段质量退化 | 中 | Lyricify Lite 兼容性表 |
| 网易云 / QQ 音乐插件方案（BetterNCM、inflink-rs）随主程序升级失效 | 中 | 插件维护活跃度 |
| Bilibili PC 客户端"多媒体会话服务"默认关闭、需用户手动开启 | 低 | UX 引导：桌宠首次启动时提示用户开启 |
| 中国 Win 政企版（如政务专版）是否裁剪 SMTC | 低 | 实测验证 |
| iOS / iPadOS 上 QQ 音乐 Now Playing 历史不稳定 | 低（桌宠 v1 不涉及移动） | — |

---

## 9. 参考链接

### 9.1 Microsoft Learn / SMTC
- [GlobalSystemMediaTransportControlsSessionManager](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionmanager?view=winrt-26100)
- [SessionMediaProperties（Title / Artist / Album / Thumbnail / Genres / TrackNumber...）](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionmediaproperties?view=winrt-26100)
- [SessionPlaybackInfo（PlaybackStatus / Controls / Shuffle / Rate）](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionplaybackinfo?view=winrt-26100)
- [Integrate with SystemMediaTransportControls](https://learn.microsoft.com/en-us/windows/apps/develop/media-playback/integrate-with-systemmediatransportcontrols)

### 9.2 Apple / MediaRemote
- [MPNowPlayingInfoCenter（公开上报侧）](https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter)
- [macOS 15.4 Release Notes](https://developer.apple.com/documentation/macos-release-notes/macos-15_4-release-notes)
- [Feedback report #637 — 请求公开 now playing API](https://github.com/feedback-assistant/reports/issues/637)

### 9.3 开源工具与同行案例
- [ungive / mediaremote-adapter（15.4+ 兜底方案, v0.7.6 2026-05）](https://github.com/ungive/mediaremote-adapter)
- [kirtan-shah / nowplaying-cli](https://github.com/kirtan-shah/nowplaying-cli)
- [nowplaying-cli #28：broken on macOS 15.4](https://github.com/kirtan-shah/nowplaying-cli/issues/28)
- [FoskyM / QQMusicSMTC（archived 2024-06）](https://github.com/FoskyM/QQMusicSMTC)
- [DubyaDude / WindowsMediaController（C# wrapper）](https://github.com/DubyaDude/WindowsMediaController)
- [Lyricify Lite 兼容性表](https://github.com/WXRIW/Lyricify-App/blob/main/docs/Lyricify%20Lite/README.md)
- [PrivateFrameworks / MediaRemote headers](https://github.com/PrivateFrameworks/MediaRemote)

### 9.4 浏览器 MediaSession
- [MDN：MediaSession](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession)
- [Chrome Dev：Customize media notifications](https://developer.chrome.com/blog/media-session)

### 9.5 中文社区
- [V2EX：哔哩哔哩等视频会被显示在媒体控制中](https://www.v2ex.com/t/1112363)
- [TwilightLemon：.NET App 与 Windows SMTC 交互](https://www.cnblogs.com/TwilightLemon/p/18279496)

---

## 10. 事实 / 观点 / 推测分层

### 10.1 事实（有 URL 证据）
- SMTC 完整字段表、最低 Win10 1809、API 公开
- MediaRemote 私有 framework 名称与典型字段（mediaremote-adapter 文档）
- macOS 15.4 entitlement 收紧 + nowplaying-cli 失效（issue #28）
- mediaremote-adapter 通过 `/usr/bin/perl` 兜底（v0.7.6 2026-05-11）
- QQ 音乐 v20.22.2692.0613（2024-06-13）原生 SMTC（FoskyM archive note）
- 网易云需 inflink-rs 插件做完美匹配（Lyricify docs）
- 酷狗 SMTC 无时间轴（Lyricify docs）
- Bilibili PC 客户端"多媒体会话服务"设置项（设置 → 播放设置）
- Spotify 在中国大陆不可访问

### 10.2 观点
- Windows SMTC 是桌宠 v1 唯一推荐路径
- macOS 必须接受 MediaRemote 长期风险，否则放弃 A1 信号
- 应在桌宠 onboarding 提示用户在 Bilibili 客户端开启多媒体会话服务

### 10.3 推测（无直接证据，标注待验证）
- 腾讯视频 / 爱奇艺 / 优酷 / 抖音 PC SMTC 状态 → 需实测
- QQ 音乐 / 网易云 macOS 国服 `MPNowPlayingInfoCenter` 状态 → 需实测
- MCP + OS API 合并覆盖率 75–85% → 需实测验证
- macOS 16 进一步收紧 MediaRemote → 历史模式外推

---

## 11. 给 PM 的实测优先级建议（P0）

调研字面无法回答的关键问题，建议下一阶段实测验证：

1. **P0**：QQ 音乐 / 网易云音乐 **macOS 国服客户端**是否上报到 Control Center Now Playing
2. **P0**：腾讯视频 / 爱奇艺 / 优酷 Win 客户端 SMTC 上报情况
3. **P1**：Bilibili Win 客户端"多媒体会话服务"开启率 + 默认值
4. **P1**：Edge / Chrome 在 B 站、腾讯视频 web 端的 MediaSession 上报字段完整度
5. **P2**：抖音 PC 是否上报（用户场景占比小，可后置）

---

## 12. 给 Engineering Build Thread 的接续建议

1. **Windows 主路径**：直接采 SMTC `GlobalSystemMediaTransportControlsSessionManager`；包装为统一 `media_now_playing` schema，与 MCP 路径同源消费。
2. **macOS 主路径**：集成 `ungive/mediaremote-adapter`（GPL/MIT 视具体版本）；在 macOS 15.4+ 用户首次使用 A1 信号时引导授权 / 安装 helper；明确告知用户"系统升级可能短期失效"。
3. **App Store 分发决策**：若桌宠目标 Mac App Store 上架，A1 信号在 MAS 版应**禁用**，仅在 Developer ID 自分发版启用；这需要在 PM 立项阶段就确定分发策略。
4. **SourceAppUserModelId 白名单**：仅采集白名单内的 source（QQ 音乐 / 网易云 UWP / Apple Music / Spotify / Bilibili 等），其它 source 来源直接丢弃；对应 Privacy Boundary。
5. **Bilibili UX 引导**：onboarding 提示用户在 Bilibili PC 客户端开启"多媒体会话服务"开关；不强制，用户拒绝时仅降级到 A0 派生信号。
