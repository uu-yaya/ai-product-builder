# PM → Radar: OS Now Playing API 调研委托

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-12T09-13-46
6. Trigger：`01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.10 audio A1 Now Playing 标识；用户 2026-05-12 同意启动

## 2. 调研问题

1. macOS 与 Windows 的"操作系统级 Now Playing API"公开能力：
   1. **macOS**：MediaRemote framework / `MRMediaRemoteGetNowPlayingInfo` / Control Center "Now Playing" 数据源；是否公开 API？是私有 framework 但是否有官方/半官方使用方式？
   2. **Windows**：`Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager`（SMTC）/ Media Foundation；公开 API 文档与限制。
   3. 每个 API：①能拿到的字段（title / artist / album / app source / progress / duration / artwork / playback state）；②权限要求；③用户同意流程；④跨用户 / 跨 session 隔离规则；⑤稳定性 / 失败模式。
2. **国产音乐 / 视频 app 的上报实际情况**（关键问题）：
   1. QQ 音乐 / 网易云音乐 / 酷狗 / 酷我 / Spotify 中国版：在 macOS / Windows 上**是否会主动上报** Now Playing 到 OS？
   2. Bilibili / 腾讯视频 / 爱奇艺 / 优酷的客户端 app 与浏览器版各自情况？
   3. 是否需要 app 启用某个开关？或者完全取决于 app 集成与否？
3. 中国地区可用性：macOS 中国版 / Windows 中国版（含 21Vianet 云）对 Now Playing API 的支持有差异吗？
4. 与 §4.4 MCP `media_now_playing` 字段的分工：Now Playing API 是 MCP 不可用时的兜底吗？还是两者可并存？

## 3. 约束条件（必须遵守）

1. 仅调研公开 / 半公开 API；不调研私有 API 逆向（macOS MediaRemote 是私有 framework，可以**讨论其存在性 + 同行使用案例**，但不指导逆向）。
2. 不调研需要 app 安装 SDK 才能上报的方案（那是 voice-interaction 或 app 集成范畴）。
3. 不调研歌词 / 字幕等内容级数据；仅调研标识级元数据。
4. 不在报告中泄漏私有 framework 的逆向细节 / 不附 Hopper 反编译截图。
5. 一律遵循 `projects/desktop-pet/PROJECT_RULES.md`。

## 4. 期望产出

1. 文件：`04-research/branches/memory-dataset/TREND_RESEARCH_os-now-playing-api.md`。
2. 结构建议：
   1. macOS 章节：MediaRemote 公开 / 半公开使用方式 + 同行案例（如 Spotify Menu Bar / SilenceApp / NowPlaying.app）。
   2. Windows 章节：SMTC 公开 API + 同行案例（如 Windows 11 Media Controls）。
   3. 跨平台对比小结。
   4. 国产 app 上报矩阵：app × {macOS Now Playing / Windows SMTC} × {上报字段 / 上报条件 / 已验证 vs 未知}。
   5. 中国地区可用性章节。
   6. 与 §4.4 MCP 的分工建议。
   7. 事实 / 观点 / 推测分层标注。

## 5. 信源建议（仅参考）

1. Apple Developer 官方文档（私有 framework 不会有，但有同行博客分析）。
2. Microsoft Learn（SMTC）。
3. 各 app 官方说明（如有"支持 macOS 锁屏 Now Playing"声明）。
4. GitHub 开源工具（搜索 `now-playing` / `media-remote` / `smtc`）。
5. 中文社区（少数派 / V2EX / 知乎）：国产 app 上报情况的用户实测。

## 6. 时限

1. 软目标：72h；硬截止：1 周。
2. 阻塞或不可行时按协议 §13 写 blocker。

## 7. 不在本次调研范围

1. 私有 framework 逆向工程细节。
2. 浏览器内当前 tab 的视频信息识别（属另一份调研 #4 浏览器多 tab 检测）。
3. 音频派生信号（BPM / 能量）— 属另一份调研 #1。
4. 工程接入实现。
5. UI / 视觉。
