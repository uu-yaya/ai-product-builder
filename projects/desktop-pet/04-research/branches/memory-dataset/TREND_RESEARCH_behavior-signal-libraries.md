# Trend Research: 主流 PC 行为信号获取库 / OS API（macOS + Windows）

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-11
> Reference spec: `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §4.2 / §4.3 / §10 / §12
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-11T17-10-08_pm_behavior-signal-libraries-radar-research.md`
> Companion deliverables: `TREND_RESEARCH_china-app-mcp-server-capabilities.md`、`MOCK_DATA_cross-source-memory-dataset.{json,md}`

## 1. 引言

**调研目标**：为 `desktop-pet` 项目（已锁定 `Context Lite Memory` 决策）盘点 macOS / Windows 主流 PC 行为信号 API，逐项评估能力覆盖、延迟、权限要求、风险，最终给出 P0 / P1 / 排除分层建议。

**与 PM 决策对齐**：
- P0（默认采集）：active app、window title（脱敏）、idle、fullscreen、派生输入指标（强度 / 节奏，不含字符）
- P1（用户 opt-in）：UI 文本 snapshot（短期 buffer + 白名单）、快捷键事件流（仅 modifier+键名，**不含**字符）
- 完全排除：字符级 keylog（含 hash 与完整时间戳序列）、Recall 式全屏后台截图、跨 app 全文长期存储、系统音频持续监听

**信源说明**：一级源为 Apple Developer Documentation 与 Microsoft Learn 的官方文档；二级源包含 Daring Fireball / 9to5Mac / Wikipedia / GeekWire 等关于 macOS Sequoia 权限策略和 Windows Recall 隐私争议的报道；开源对照参考 OpenChronicle / ActivityWatch / Rize / RescueTime。所有结论附 URL；模型记忆只用于交叉验证，不作"最新进展"主源。

---

## 2. macOS 章节

### 2.1 Accessibility (AXUIElement / AX API)

Apple 的 UI 可访问性框架，可读取任意 app 的窗口标题、焦点元素、UI 树文本、输入框内容。OpenChronicle 把它作为主信号源（structured text，便宜、可解释）。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | window title ✓ / focused element ✓ / UI 文本 snapshot ✓ / 派生输入指标 ✗（不是输入 API）/ 快捷键事件流 ✗ / idle ✗ / fullscreen ✗ / active app ✓（间接） |
| 延迟 | 跨进程 IPC 查询，单次几 ms ~ 几十 ms；树查询深时可到 100ms+，需缓存（与 UIA 跨进程相同特征） |
| 权限要求 | 系统设置 > 隐私与安全 > 辅助功能（Accessibility），用户需手动开关，沙盒应用不能简化此流程 |
| 风险 | 用户感知强（"控制电脑"红色提示）；MDM 环境企业用户可能不允许；不会触发杀软告警；Mac App Store 接受但需充分说明 |
| 桌宠适用层级 | **P1**（用户 opt-in 后用于"看到窗口里在做什么"，仅作短期 buffer + 白名单） |

关键链接：
- https://developer.apple.com/documentation/accessibility/accessibility-api
- https://developer.apple.com/documentation/applicationservices/axuielement
- https://github.com/Einsia/OpenChronicle（开源实践参考）

### 2.2 NSWorkspace

AppKit 的进程级 API，提供 frontmost app、运行中 app 列表、app 切换通知（`didActivateApplicationNotification`）。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | active app ✓ / bundle id ✓ / app 启动 / 退出 / 切换事件 ✓ / window title ✗（需配合 AX 或 CGWindowList）/ idle ✗ / fullscreen ✗ |
| 延迟 | 通知机制无可感知延迟（毫秒级），实测优于轮询方案 |
| 权限要求 | 无特殊权限（不需要辅助功能 / 输入监控 / 屏幕录制） |
| 风险 | 极低；不触发杀软；Mac App Store 完全接受；不出现任何系统授权弹窗 |
| 桌宠适用层级 | **P0**（active app 主入口） |

关键链接：
- https://developer.apple.com/documentation/appkit/nsworkspace
- https://developer.apple.com/documentation/appkit/nsworkspace/frontmostapplication
- https://developer.apple.com/documentation/appkit/nsworkspace/didactivateapplicationnotification

### 2.3 NSEvent global event monitor

AppKit 全局事件监控（`addGlobalMonitorForEventsMatchingMask:`），可监听其他 app 的输入事件。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | 输入事件流 ✓（含字符）/ 派生输入指标 ✓ / 快捷键事件流 ✓ / 不能修改或拦截事件 |
| 延迟 | 系统调度级，几 ms |
| 权限要求 | 键相关事件需"辅助功能"授权（**非**"输入监控"）；这是历史遗留差异 |
| 风险 | 红色"控制电脑"提示，用户感知重；Apple 官方推荐迁移到 CGEventTap |
| 桌宠适用层级 | **不推荐使用**（被 CGEventTap 替代，权限路径更差） |

关键链接：
- https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/EventOverview/MonitoringEvents/MonitoringEvents.html
- https://developer.apple.com/forums/thread/122492（Apple 工程师建议迁移到 CGEventTap）

### 2.4 CGEventTap

CoreGraphics 底层事件流，可监听 / 修改全局输入事件。Apple 官方推荐方案。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | 字符级按键 ✓（**项目硬性排除**）/ 派生输入指标 ✓ / 快捷键事件流 ✓ / 鼠标移动 ✓ |
| 延迟 | 内核级，亚毫秒到几 ms |
| 权限要求 | listenOnly 选项 → "输入监控"权限（沙盒 / Mac App Store 也可用，有 `CGRequestListenEventAccess` 显式请求 API）；defaultTap 选项 → "辅助功能"权限 |
| 风险 | 用户感知"输入监控"红色提示；Mac App Store 接受 listenOnly 模式但需 PrivacyManifest 充分说明 |
| 桌宠适用层级 | **P0 受限使用**（仅以"派生指标"模式：计数器 / 节奏窗口，回调内立即丢弃 keyCode / 字符）+ **P1**（仅 modifier+键名的快捷键事件流，过滤明文字符） |

关键链接：
- https://developer.apple.com/documentation/coregraphics/cgevent/tapcreate(tap:place:options:eventsofinterest:callback:userinfo:)
- https://github.com/pqrs-org/osx-event-observer-examples
- https://developer.apple.com/forums/thread/707680（沙盒 / App Store 权限路径说明）

### 2.5 ScreenCaptureKit / CGWindowListCreateImage

现代屏幕采集 API（SCKit 取代旧 CGWindowList）。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | 屏幕像素 ✓ / 窗口缩略图 ✓ / 窗口元数据列表 ✓（CGWindowListCopyWindowInfo 可零授权读 window title，但 macOS 14+ 收紧） |
| 延迟 | 帧级别，30–60 fps 持续；单帧抓取几十 ms |
| 权限要求 | 屏幕录制（Screen Recording）TCC；macOS 15 Sequoia 起约**每月**重新提示一次（最初 weekly，beta 6 改为 monthly）；Persistent Content Capture entitlement 仅 Apple 私下授予 |
| 风险 | Sequoia 重复弹窗极大伤害用户体验；ad-hoc 签名每次 build 重签会丢权限；触发用户对"截屏"的强烈警觉；Mac App Store 允许但需明确目的 |
| 桌宠适用层级 | **排除**（持续后台截图与项目硬边界冲突；即使做"瞬时事件触发截图"也会被 Sequoia 周期弹窗反复打断，不适合桌宠常驻形态） |

关键链接：
- https://mjtsai.com/blog/2024/08/08/sequoia-screen-recording-prompts-and-the-persistent-content-capture-entitlement/
- https://9to5mac.com/2024/08/14/macos-sequoia-screen-recording-prompt-monthly/
- https://developer.apple.com/forums/tags/screencapturekit

### 2.6 IOKit / IOHIDIdleTime

通过 IOHIDSystem 读取系统全局空闲时间（自上次任意输入起的纳秒数）。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | idle 时长 ✓ / 不暴露任何输入内容 |
| 延迟 | 同步读注册表项，亚 ms |
| 权限要求 | 无特殊权限（不需要辅助功能 / 输入监控 / 屏幕录制） |
| 风险 | 几乎为零；ActivityWatch 等开源项目长期使用此 API |
| 桌宠适用层级 | **P0**（AFK 判断主入口） |

关键链接：
- https://developer.apple.com/documentation/iokit
- https://xs-labs.com/en/archives/articles/iokit-idle-time/
- https://github.com/kairichard/idler（开源实现参考）

### 2.7 OpenChronicle（开源参考）

GitHub `Einsia/OpenChronicle`，macOS 13+ 个人活动记录项目，面向 tool-calling agents。设计哲学"AX-first，screenshot-assisted"——以 AX Tree 为主信号，截图作为时序补充。对 Browser / Terminal / Editor / Slack / Notion / Cursor / Linear / Figma 做了 app 级 normalize。

**对本项目的价值**：可作为"如何在隐私边界内做有用的活动记录"参考实现；其 P0 选择（AX Tree + 派生指标）与 `Context Lite Memory` 决策天然对齐。

链接：https://github.com/Einsia/OpenChronicle （注意：截至调研日为相对小众项目，二级源参考）

---

## 3. Windows 章节

### 3.1 UI Automation (UIA)

Microsoft 的可访问性框架，可读取窗口、控件树、focused element、文本内容；替代旧的 MSAA。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | window title ✓ / focused element ✓ / UI 文本 snapshot ✓ / 控件树 ✓ / active app ✓（间接） |
| 延迟 | 跨进程 COM 调用密集；naïve 实现每次查询都是 RPC round-trip，复杂窗口可到 100ms~秒级；Microsoft 推出 Remote Operations API 来批量化 |
| 权限要求 | 无 TCC 等价物；要驱动 elevated app 需要 UIAccess（要求安装路径白名单 + PKI 签名）；只读 / 非 elevated 场景一般用户态即可 |
| 风险 | 不触发 Defender；不触发 SmartScreen；但 Power Automate 案例显示订阅全局 UIA 事件会导致系统级响应卡顿（影响其他 app 重绘） |
| 桌宠适用层级 | **P1**（按需快照式读取，**严禁**订阅全局事件） |

关键链接：
- https://learn.microsoft.com/en-us/windows/win32/winauto/entry-uiauto-win32
- https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-uiautomationoverview
- https://github.com/microsoft/Microsoft-UI-UIAutomation
- https://gist.github.com/Skydev0h/3a8c08b148a38e8d270c02b563130ff6（Power Automate 性能事故案例，二级源参考）

### 3.2 WinEvent (SetWinEventHook)

Win32 全局事件钩子，最常用 `EVENT_SYSTEM_FOREGROUND`（0x0003）监听前台窗口切换。配合 `GetForegroundWindow` + `GetWindowText` 取标题。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | active app ✓ / window title ✓ / 焦点切换事件 ✓ / window title 变化事件（`EVENT_OBJECT_NAMECHANGE`）✓ |
| 延迟 | 事件驱动，毫秒级；远优于 `GetForegroundWindow` 轮询 |
| 权限要求 | 无；普通用户态即可；进程外钩子需 hook DLL 与目标 app 同位宽 |
| 风险 | 不触发 Defender；不触发 SmartScreen；Microsoft Store 接受；老牌方案稳定 |
| 桌宠适用层级 | **P0**（active app + window title 主入口） |

关键链接：
- https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwineventhook
- https://devblogs.microsoft.com/oldnewthing/20131202-00/?p=2503
- https://github.com/blep/win32_window_monitor

### 3.3 Windows.Graphics.Capture

现代屏幕采集 API，Win10 1803+ 引入。强制黄色边框作为隐私指示。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | 屏幕像素 ✓ / 窗口像素 ✓ / 显示器枚举 ✓ |
| 延迟 | 帧级；DXGI fast path |
| 权限要求 | UWP 沙盒下需 `GraphicsCaptureAccess` 调起系统 picker 让用户确认；Win32 desktop app 也强制黄色边框；无方法在不修改系统的前提下隐藏边框 |
| 风险 | 黄色边框对桌宠常驻形态致命（视觉污染）；Microsoft Store 接受但用户感知重 |
| 桌宠适用层级 | **排除**（持续可视化边框 + 与 Recall 隐私争议同纬度风险） |

关键链接：
- https://learn.microsoft.com/en-us/uwp/api/windows.graphics.capture
- https://blogs.windows.com/windowsdeveloper/2019/09/16/new-ways-to-do-screen-capture/
- https://learn.microsoft.com/en-us/answers/questions/108678/how-to-remove-yellow-boarder-capture-indicator-fro（官方答疑：边框无法移除）

### 3.4 UserActivity (Windows.ApplicationModel.UserActivities)

UWP 命名空间，让应用**自报告**用户任务到 Windows Timeline，供 Cortana / 跨设备恢复使用。**不是观察其他 app 的 API**。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | 自报告 activity 上传 ✓；不能读取其他 app 的活动 |
| 延迟 | 不适用 |
| 权限要求 | 无特殊 |
| 风险 | Microsoft 已逐步关停 Timeline 云同步：MSA 账户 2021 年 7 月停止上传，AAD / Entra 账户 2024 年 1 月停止；Win11 Timeline UI 已退役 |
| 桌宠适用层级 | **排除**（**易被误读为可用数据源**——它是"上报"而非"采集"API；且生态本身在退役） |

关键链接：
- https://learn.microsoft.com/en-us/uwp/api/windows.applicationmodel.useractivities
- https://support.microsoft.com/en-us/windows/get-help-with-timeline-febc28db-034c-d2b0-3bbe-79aa0c501039

### 3.5 Raw Input

Win32 底层 HID 输入 API，通过 `WM_INPUT` 消息接收键盘 / 鼠标 / 其他 HID 设备的原始事件。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | 字符级按键 ✓（**项目硬性排除**）/ 派生输入指标 ✓ / 鼠标移动 ✓ / 多设备区分 ✓；与 SetWindowsHookEx 不同，**不需要全局 hook DLL** |
| 延迟 | 内核级，亚毫秒 |
| 权限要求 | 无；用户态即可 |
| 风险 | **关键优势**：相比 `SetWindowsHookEx(WH_KEYBOARD_LL)`，Defender 对 Raw Input 的容忍度更高（不与"DLL 注入"风险模式同构）；Microsoft Store 接受 |
| 桌宠适用层级 | **P0 受限**（仅以派生指标模式：计数器 / 节奏窗口，回调内立即丢弃 vkCode / scanCode 字符内容） |

关键链接：
- https://learn.microsoft.com/en-us/windows/win32/inputdev/about-raw-input
- https://learn.microsoft.com/en-us/windows/win32/inputdev/using-raw-input
- https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-rawinput

**对比 `SetWindowsHookEx(WH_KEYBOARD_LL)`**：低级键盘钩子是经典选择，但 Defender 的 keylogger 启发式专门关注 `SetWindowsHookEx` 句柄；社区报告显示这是误报高发模式。本项目应优先 Raw Input。

参考：
- https://techcommunity.microsoft.com/blog/windows-itpro-blog/keylogging-malware-protection-built-into-windows/4256289

### 3.6 GetLastInputInfo

最简 idle 检测：`LASTINPUTINFO.dwTime` 返回最近一次输入事件的 tick count。

| 字段 | 内容 |
|---|---|
| 能力覆盖 | idle 时长 ✓ |
| 延迟 | 同步调用，<1 ms |
| 权限要求 | 无 |
| 风险 | 零；DWORD 49 天会回卷但桌宠场景不相关 |
| 桌宠适用层级 | **P0**（AFK 判断主入口） |

关键链接：
- https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getlastinputinfo

### 3.7 Recall API（Windows 11 / Copilot+ PC）

**仅作生态参考，明确排除作为数据源**。Recall 用"每几秒一张屏幕快照 + 本地 LLM"做记忆检索。2024-05 发布即遭遇严重隐私崩盘（明文 SQLite 数据库可被窃取）；推迟到 2025-04/05 以 opt-in 形式重新上线；2025 年底仍被多家媒体列为 Microsoft 年度 fail；2026 年 GeekWire 报道一年后安全担忧未解。**Recall 范式即本项目硬边界禁止的范式**。

关键链接：
- https://en.wikipedia.org/wiki/Windows_Recall
- https://www.geekwire.com/2026/one-year-after-its-rocky-launch-microsofts-windows-recall-still-raises-security-red-flags/
- https://doublepulsar.com/microsoft-recall-on-copilot-pc-testing-the-security-and-privacy-implications-ddb296093b6c
- https://www.kaspersky.com/blog/recall-2025-risks-benefits/53407/

### 3.8 ActivityWatch（开源跨平台参考）

MPL-2.0，跨 Windows / macOS / Linux / Android。架构为"本地 server + 多个 watcher"：`aw-watcher-window` 取 active app + 窗口标题，`aw-watcher-afk` 取 idle。macOS 端历史用 AppleScript（NSAppleScript）读 frontmost app；Windows 端用 Win32 API。所有数据本地存储，无云端。是 RescueTime 的开源替代。

**对本项目的价值**：watcher 架构与 `Context Lite Memory` 模块化天然吻合；可参考其 P0 数据模型（heartbeat / bucket / event）。

关键链接：
- https://github.com/ActivityWatch/activitywatch
- https://github.com/ActivityWatch/aw-watcher-window
- https://docs.activitywatch.net/en/latest/

### 3.9 Rize / RescueTime（商业产品参考）

- **Rize**（macOS + Windows）：menu bar 常驻，用 macOS Accessibility API 读 active window 元数据；自述 "never captures screen, records keystrokes, or takes photos - only reads window metadata"。
- **RescueTime**：仅记录 in-focus app 进程名、窗口标题、（浏览器场景的）URL；URL 在上传前 trim 到站点 + 一级目录，丢弃 query string；明确不采集 keystroke / form input / 截屏 / 页面正文。

两家都验证了"只读元数据 + 派生时长"在商业场景下足够支撑用户价值——这是本项目 P0 的可行性背书。

关键链接：
- https://rize.io/features/automatic-time-tracking
- https://www.rescuetime.com/privacy
- https://help.rescuetime.com/article/45-monitoring-options

---

## 4. 跨平台对比小结

| 能力 | macOS API | Windows API | 差异 |
|---|---|---|---|
| active app | NSWorkspace（零权限） | GetForegroundWindow + WinEvent（零权限） | 两端对称，权限模型都很轻 |
| window title | AX / CGWindowList | GetWindowText / UIA | Windows 更轻；macOS 14+ CGWindowList 收紧后倾向走 AX |
| idle | IOHIDIdleTime | GetLastInputInfo | 完全对称，零权限 |
| 派生输入指标 | CGEventTap（输入监控权限） | Raw Input（零权限） | **Windows 明显更轻**：无系统级"红色"权限对话框 |
| 快捷键事件流 | CGEventTap | Raw Input / WinEvent | 同上 |
| UI 文本 snapshot | AX（辅助功能权限） | UIA（无 TCC，但跨进程慢） | macOS 权限重但延迟可控；Windows 权限轻但 naïve 实现易卡 |
| focused element | AX | UIA | 对称，权限差异同上 |
| fullscreen | NSApplication / kCGWindow + NSWorkspace 通知 | UIA / 窗口样式标志 | 两端都有，无显著差异 |
| 屏幕录制 | ScreenCaptureKit（屏幕录制权限 + Sequoia 月度弹窗） | Windows.Graphics.Capture（强制黄色边框） | **两端都对桌宠致命**：macOS 弹窗骚扰，Windows 视觉污染 |
| 杀软容忍度 | macOS 不区分（统一 TCC） | Defender 对 SetWindowsHookEx 启发式高，Raw Input 干净 | Windows 选择 Raw Input 而非 LL Hook 可显著降低误报 |
| 应用商店审核 | Mac App Store 接受沙盒 + 输入监控（有 API 申请权限） | Microsoft Store 沙盒模型不同，UIA 与 Raw Input 均可上架 | 两端均不阻挡，但都要求 PrivacyManifest / 隐私说明清晰 |

---

## 5. PM 立场下的分层建议

### 5.1 P0（建议默认采集，零或最轻权限）

**macOS**：
- `NSWorkspace` 监听 active app 切换（零权限）
- `IOHIDIdleTime` 读 idle（零权限）
- `CGEventTap (listenOnly)` 仅累计派生指标（计数 / 节奏窗口 / 强度分桶），**回调内立即丢弃 keyCode 与字符**，只输出统计标量；需"输入监控"权限（沙盒 / App Store 友好，有显式请求 API）
- fullscreen 状态通过 `NSWorkspace` + `kCGWindowListOptionOnScreenOnly` 派生
- window title 仅在 P1 开启时才取（默认走 AX 而非 CGWindowList，规避 macOS 14+ 收紧）

**Windows**：
- `SetWinEventHook(EVENT_SYSTEM_FOREGROUND + EVENT_OBJECT_NAMECHANGE)` 获取 active app + window title（零权限）
- `GetLastInputInfo` 读 idle（零权限）
- `Raw Input (WM_INPUT)` 仅累计派生指标，**回调内立即丢弃 vkCode / scanCode**（零权限，避免 `SetWindowsHookEx` 杀软启发式）
- fullscreen 通过窗口样式 + 显示器矩形派生

### 5.2 P1（用户 opt-in，需明确知情同意）

**macOS**：
- `AXUIElement` 短期 buffer（≤数秒）+ app 白名单（白名单内 app 才采）+ 文本脱敏（URL 截短、邮箱 / 手机号正则替换）
- `CGEventTap` 增加**仅 modifier + 键名**（如 `Cmd+Shift+S`）的快捷键事件流；**不**记录字母数字按键内容

**Windows**：
- `UIA` 按需快照式读取（**不订阅全局事件**，避免 Power Automate 同款系统卡顿）+ 白名单 + 文本脱敏
- `Raw Input` 增加 modifier+键名的快捷键事件流（同 macOS 策略）

### 5.3 完全排除

| API | 排除理由 |
|---|---|
| macOS `ScreenCaptureKit` / `CGWindowListCreateImage`（持续后台截图模式） | 触发 Sequoia 月度授权弹窗；与 Recall 同纬度隐私风险；与项目硬边界冲突 |
| Windows `Windows.Graphics.Capture`（持续模式） | 强制黄色边框污染桌宠视觉；同 Recall 风险纬度 |
| Windows Recall API | 项目硬性排除；定义即"全屏后台截图 + 长期存储"，与 Context Lite Memory 决策直接冲突 |
| 字符级 keylog（CGEventTap / Raw Input 的字符内容路径） | 硬边界；任何优先级均禁止（§10 L2） |
| hash 后的按键序列 | 硬边界；hash 不能视为脱敏（§10 L2） |
| 完整毫秒时间戳序列 | 硬边界；可重放为字符（§10 L3） |
| 系统音频持续监听 | 硬边界；本调研未列入候选 |

### 5.4 不建议使用 / 慎用

| API | 理由 |
|---|---|
| macOS `NSEvent global monitor` | 权限路径劣于 CGEventTap（"辅助功能"红色提示 vs "输入监控"），且 Apple 工程师官方推荐迁移 |
| Windows `SetWindowsHookEx(WH_KEYBOARD_LL)` | Defender keylogger 启发式高发误报点；Raw Input 是同能力但更干净的替代 |
| Windows `UserActivity` API | 是"上报"而非"采集"API；Timeline 云同步生态已退役 |
| 全局订阅 UIA 事件 | Power Automate 案例显示会导致系统级响应卡顿 |

---

## 6. 风险提示

### 6.1 杀软误报常见模式（Windows）

- `SetWindowsHookEx(WH_KEYBOARD_LL / WH_MOUSE_LL)` 与 keylogger 行为模式同构，Defender 启发式高发误报。
- 全局 Hook DLL 注入到其他进程时，Defender / 第三方 EDR 易判 PUA。
- **缓解**：用 Raw Input 替代低级 hook；代码签名（EV 证书优先）；Microsoft Defender ATP 提交白名单。

### 6.2 应用商店审核拦截点

- **Mac App Store**：Accessibility / Input Monitoring 权限本身可通过，但需在 `NSPrivacyAccessedAPITypes` 与 PrivacyManifest 中充分声明用途；理由若描述模糊（如"提升体验"而非具体功能）会被驳回。
- **Microsoft Store**：UWP 沙盒严格，桌宠常驻 + 全局监控适合走 Win32 Desktop Bridge / MSIX，不走纯 UWP；UI Automation / Raw Input 上架历史无系统性拦截。

### 6.3 用户感知（重要）

- **macOS 红色"输入监控"提示**：首次请求时系统会弹"X 想要使用输入监控"红色对话框；用户对"输入监控"措辞高度敏感（联想到 keylogger）。**桌宠首启的 onboarding 必须先用产品语言解释"我们只数频率不读字符"再触发系统授权**。
- **macOS Sequoia 月度弹窗**：屏幕录制权限每月重弹一次，**这是排除截屏方案的硬性原因**（不是技术不行，而是 UX 不可接受）。
- **Windows UAC**：本项目所有 P0 / P1 API 都不需要 elevated，无 UAC 弹窗；如未来引入 UIAccess 驱动 elevated app 则需 PKI 签名 + 安装路径白名单。
- **Windows SmartScreen**：新签名证书首次发布会触发 SmartScreen 警告，需积累信誉；EV 证书可跳过该阶段。

---

## 7. 与 PM REQUIREMENT_CLARIFICATION §10 键盘信号分级标准的对齐

| 等级 | PM 定义 | macOS 实现路径 | Windows 实现路径 | 本调研结论 |
|---|---|---|---|---|
| L0 派生指标 | 强度 / 节奏 / 桶化统计，不含任何键内容 | CGEventTap listenOnly + 回调内立即聚合 | Raw Input + 回调内立即聚合 | ✅ P0 默认，技术上可行且权限轻 |
| L1 快捷键事件 | 仅 modifier+命名键，不采普通字符 | CGEventTap + modifier 过滤 | Raw Input / WinEvent 组合 | ⚠️ P1 opt-in，需 UI 明确指示 |
| L2 字符级原始流 | 任何字符键的内容（含 hash 后） | 不实现 | 不实现 | ❌ 任何优先级不允许 |
| L3 键盘时间戳序列 | 完整毫秒级时间戳 | 不实现 | 不实现 | ❌ 不允许；shortcut_events 采用离散事件级而非连续序列 |

---

## 8. 参考链接清单

### 8.1 一级源（Apple / Microsoft / 开源 README）

**macOS**：
- https://developer.apple.com/documentation/accessibility/accessibility-api
- https://developer.apple.com/documentation/applicationservices/axuielement
- https://developer.apple.com/documentation/appkit/nsworkspace
- https://developer.apple.com/documentation/appkit/nsworkspace/frontmostapplication
- https://developer.apple.com/documentation/appkit/nsworkspace/didactivateapplicationnotification
- https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/EventOverview/MonitoringEvents/MonitoringEvents.html
- https://developer.apple.com/documentation/coregraphics/cgevent/tapcreate(tap:place:options:eventsofinterest:callback:userinfo:)
- https://developer.apple.com/documentation/iokit
- https://developer.apple.com/app-store/review/guidelines/
- https://github.com/Einsia/OpenChronicle
- https://github.com/pqrs-org/osx-event-observer-examples

**Windows**：
- https://learn.microsoft.com/en-us/windows/win32/winauto/entry-uiauto-win32
- https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-uiautomationoverview
- https://learn.microsoft.com/en-us/dotnet/framework/ui-automation/
- https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwineventhook
- https://learn.microsoft.com/en-us/uwp/api/windows.graphics.capture
- https://learn.microsoft.com/en-us/uwp/api/windows.applicationmodel.useractivities
- https://learn.microsoft.com/en-us/windows/win32/inputdev/about-raw-input
- https://learn.microsoft.com/en-us/windows/win32/inputdev/using-raw-input
- https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getlastinputinfo
- https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getforegroundwindow
- https://techcommunity.microsoft.com/blog/windows-itpro-blog/keylogging-malware-protection-built-into-windows/4256289
- https://github.com/ActivityWatch/activitywatch
- https://github.com/ActivityWatch/aw-watcher-window
- https://github.com/microsoft/Microsoft-UI-UIAutomation

### 8.2 二级源（交叉验证 / 隐私争议背景）

- https://mjtsai.com/blog/2024/08/08/sequoia-screen-recording-prompts-and-the-persistent-content-capture-entitlement/ — Sequoia 权限弹窗机制权威解读
- https://9to5mac.com/2024/08/14/macos-sequoia-screen-recording-prompt-monthly/ — 弹窗频率从 weekly 改 monthly 的官方说明
- https://devblogs.microsoft.com/oldnewthing/20131202-00/?p=2503 — Microsoft 工程师 Raymond Chen 的 WinEvent 实战
- https://en.wikipedia.org/wiki/Windows_Recall — Recall 时间线 / 争议综述
- https://www.geekwire.com/2026/one-year-after-its-rocky-launch-microsofts-windows-recall-still-raises-security-red-flags/ — Recall 一年后安全担忧未解
- https://doublepulsar.com/microsoft-recall-on-copilot-pc-testing-the-security-and-privacy-implications-ddb296093b6c — Kevin Beaumont 实测 Recall 数据库可被窃取
- https://www.kaspersky.com/blog/recall-2025-risks-benefits/53407/ — Recall 风险 / 收益分析
- https://gist.github.com/Skydev0h/3a8c08b148a38e8d270c02b563130ff6 — Power Automate UIA 全局事件订阅性能事故案例
- https://rize.io/features/automatic-time-tracking — 商业产品"只读元数据"价值背书
- https://www.rescuetime.com/privacy — 同上

### 8.3 三级源（仅作信号）

- https://gertrude.app/blog/querying-running-applications-in-macos
- https://xs-labs.com/en/archives/articles/iokit-idle-time/

---

## 9. 事实 / 观点 / 推测 分层标注

- **事实**（一级源直接陈述）：API 签名、权限名称、Sequoia 月度弹窗机制、Recall 数据库明文存储事件、Timeline 云同步停服时间线、ActivityWatch 架构与许可证。
- **观点**（来源是技术博客 / 商业自述）：Rize / RescueTime 的"我们不采字符"是自我声明；Power Automate 全局 UIA 拖慢系统是一篇高质量个人技术博客的实测。
- **推测**（基于已知事实做工程外推）：Windows Raw Input 在 Defender 下比 SetWindowsHookEx 误报更低（基于 Defender 启发式公开描述聚焦 SetWindowsHookEx 句柄检查的事实做推断，未找到官方"Raw Input 更安全"的直接表述）；macOS Mac App Store 在 PrivacyManifest 清晰下接受 Input Monitoring 权限（基于 Apple Developer Forum 工程师答复 + 多个上架案例做推断）。

---

## 10. 给 Engineering Build Thread 的接续建议

1. **Context Capture Adapter 设计**：把 P0 / P1 API 各自封装为独立 watcher（参考 ActivityWatch 架构），通过统一 ingest 接口喂给记忆系统；watcher 切换不影响业务层。
2. **CGEventTap / Raw Input 回调安全**：所有派生指标必须在**回调内**完成聚合（计数 / 节奏窗口 / 强度分桶），**离开回调前**丢弃 keyCode / vkCode；不允许任何形式的字符 buffer。
3. **AX / UIA 性能保护**：AX / UIA 查询都做缓存 + 节流（≤2Hz）；UIA 严禁订阅全局事件。
4. **权限请求时机**：把"输入监控"/ "辅助功能"/ "屏幕录制"权限请求拆分到不同 onboarding 步骤，每步前先用产品语言说明用途；不要在首启时一次性请求所有权限。
5. **签名 / 发布渠道**：macOS 走 Developer ID + Notarization 起步，长期目标进 Mac App Store；Windows 走 EV 代码签名以快速跳过 SmartScreen 警告期。
6. **完整字段名最终对齐**：本调研中 `is_fullscreen_game` / `input_intensity_level` / `shortcut_events` 等字段为 PM §11 语义命名，Engineering 在 schema 阶段确认最终拼写。
