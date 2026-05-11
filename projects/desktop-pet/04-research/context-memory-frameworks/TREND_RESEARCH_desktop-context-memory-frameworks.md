# PC 端电脑操作数据与记忆系统框架调研

> 项目：`desktop-pet`
> 线程：AI Trend Radar Thread
> 日期：2026-05-08
> 任务：调研 macOS OpenChronicle 及 Windows 对标框架，为桌宠记忆系统收集 PC 端电脑操作数据提供技术参考。
> 重要边界：本文只讨论公开 OS API / 开源项目 / 官方文档，不包含公司内部资料、真实玩家数据、未脱敏日志或凭据。

## 1. 结论先行

| 结论 | 类型 | 对 desktop-pet 的含义 |
|---|---|---|
| OpenChronicle 不是 Apple 官方 API，而是一个基于 macOS AX Tree / Accessibility、窗口元数据、可选截图、Markdown、SQLite FTS5、MCP 的开源本地记忆层。 | 事实 | 可作为“桌面上下文采集 + 本地记忆管线”的参考架构，不能直接当成跨平台 SDK。 |
| Windows 有相对框架，但不是一个单一 OpenChronicle 式项目：官方层是 `Windows Automation API` / `UI Automation` + `WinEvent` + `Windows.Graphics.Capture` + `UserActivity` / Recall integration；开源层有 OpenRecall、Windrecorder、screenpipe、OpenAdapt 等 Recall-like / activity-capture 框架。 | 事实 | Windows 侧需要自己做一层 `Context Capture Adapter`，把官方 OS 框架与可借鉴开源实现统一成事件流。 |
| 对桌宠记忆系统，P0 不建议默认采集全屏截图、键盘输入或系统音频。应优先采集低敏上下文：前台 app、窗口标题、游戏内授权事件、用户主动对话、用户显式确认的截图片段。 | 观点 | 先验证“记忆有用性”，不要一上来做 Recall 式全量记录。 |
| 真正适合游戏桌宠的长期记忆，应该优先来自 first-party game event / SDK telemetry，而不是 OS 级“看用户电脑”。OS 级上下文只做辅助。 | 推断 | 记忆系统的主干应是游戏事件、互动历史、偏好、关系与任务状态；PC 操作数据只帮助判断场景与时机。 |

## 2. 研究对象与边界

本文把 OpenChronicle 直接定位为 `Einsia/OpenChronicle` 开源项目，而不是 Apple 官方 API。它的价值在于提供一套“桌面上下文采集 → 降噪 → session 压缩 → 本地长期记忆 → agent 查询”的端到端框架参考。

Windows 侧不寻找一个同名 API，而是寻找能对标 OpenChronicle 各层能力的框架组合：

- **结构化 UI 框架**：`Windows Automation API`，其中 `UI Automation` 是最接近 macOS AX Tree 的官方框架；`Microsoft Active Accessibility (MSAA)` 是 legacy 层。
- **窗口 / 焦点事件框架**：`SetWinEventHook`、`GetForegroundWindow`、`GetWindowTextW`、进程 API。
- **屏幕 / 窗口捕获框架**：`Windows.Graphics.Capture`，更接近 macOS `ScreenCaptureKit`。
- **用户活动 / Recall 集成框架**：`UserActivity`、Recall relaunch、DLP Provider API、`SetWindowDisplayAffinity`。它们是生态集成点，不是给第三方读取 Recall 数据库的通用数据源。
- **开源 Recall-like / activity-capture 框架**：OpenRecall、Windrecorder、screenpipe、OpenAdapt。它们能说明 Windows 侧如何做本地记忆产品，但多数偏截图 / OCR / 音频 / 训练数据采集，不等于 OpenChronicle 的 AX-first agent memory 设计。

### 2.1 关键框架与函数怎么读

| 名称 | 所属平台 / 层级 | 简单解释 | 能拿到什么 | 不能误解成什么 | 对 desktop-pet 的用法 |
|---|---|---|---|---|---|
| `Accessibility` / `AX` | macOS 系统框架 | Apple 给辅助功能、自动化、测试工具使用的 UI 可访问性框架。`AX` 是 Accessibility 的常见前缀。 | app、window、button、text field 等 UI 元素的 role、title、value、focus、bounds 等可访问性信息。 | 不是屏幕截图，也不是所有 app 的完整 DOM；app 暴露什么，外部才能读到什么。 | P1 增强上下文；必须用户授权 Accessibility，并配 allowlist / blocklist。 |
| `AX Tree` | macOS 结构化 UI 层 | 当前 app 或窗口暴露出来的一棵 UI 元素树，类似“窗口里有哪些控件、控件叫什么、当前焦点在哪”。 | 可见文本、按钮标题、输入框值、菜单项、当前焦点控件、窗口层级。 | 不是像浏览器 DOM 那样稳定完整；游戏、Canvas、Electron、WebView 可能暴露不足。 | 适合用户主动问“这个窗口里发生了什么”时短期读取，不默认长期保存全文。 |
| `AXUIElement` | macOS API 对象 | 表示一个可访问性元素的句柄，可以代表 app、窗口或控件。 | 通过属性查询拿到 element role、title、value、selected text、children 等。 | 不是数据表字段；它是访问 UI 元素的 API 对象。 | 工程上可封装成 `macos/ax_tree_adapter`。 |
| `AXObserver` / AX notifications | macOS 事件机制 | 订阅 AX 元素变化的观察者机制。 | focus changed、window created、title changed、value changed 等事件信号。 | 不是所有 app 都会稳定发事件；仍需要轮询 / debounce / dedup 兜底。 | P1 可用于捕获“上下文变了”，但要降噪。 |
| `Windows Automation API` | Windows 系统框架总称 | Windows 的自动化与可访问性框架集合，包含较新的 `UI Automation` 和 legacy `MSAA`。 | 不同 UI 框架暴露的统一可访问性对象、属性、事件。 | 不是单个函数，也不是 Recall 数据源。 | Windows 侧对标 macOS Accessibility 的总入口。 |
| `UI Automation` / `UIA` | Windows 结构化 UI 层 | Windows 更现代的 UI 可访问性与自动化框架，把不同 UI 技术栈映射到统一的 AutomationElement 模型。 | UIA tree、AutomationElement properties、control patterns、focus / property / structure events。 | 不保证每个 app 都支持完整；跨权限、不同用户、游戏渲染窗口可能不可读。 | P1 增强上下文；对 allowlist app 读取结构化文本和焦点信息。 |
| `AutomationElement` | Windows UIA 对象 | UIA tree 中的一个元素，可以代表窗口、按钮、文本框、列表项等。 | Name、ControlType、BoundingRectangle、ProcessId、AutomationId、可用 patterns。 | 不是业务实体；只是 UI 层暴露的节点。 | 可映射为跨平台 `ui_element_snapshot`，只短期保存。 |
| `Control Pattern` | Windows UIA 能力模型 | UIA 用 pattern 表达控件能力，例如文本控件支持 TextPattern，输入控件可能支持 ValuePattern。 | 控件是否可读取文本、可点击、可选择、可滚动等能力。 | 不是所有控件都有 TextPattern / ValuePattern。 | 读取前先 capability detection，按能力降级。 |
| `WinEvent` | Windows Win32 事件层 | Windows 提供的一类系统 / 可访问性事件，比如前台窗口变化、对象创建、焦点变化。 | foreground changed、focus changed、window created/destroyed 等信号。 | 它只告诉“发生了什么事件”，不直接给完整 UI 语义。 | P0 用于轻量监听 active window 变化。 |
| `SetWinEventHook` | Windows Win32 函数 | 注册一个回调，让系统在指定 WinEvent 发生时通知你的进程。 | 事件类型、窗口句柄 `HWND`、object id、child id、事件线程、时间戳。 | 不是键盘 hook；不应该用来记录输入内容。 | P0 监听 `EVENT_SYSTEM_FOREGROUND`，触发前台窗口上下文更新。 |
| `EVENT_SYSTEM_FOREGROUND` | Windows WinEvent 常量 | 表示前台窗口发生变化的事件。 | 哪个窗口成为 foreground window。 | 不是“用户在窗口里做了什么”的完整行为记录。 | 用来判断桌宠是否该安静、是否切到游戏 / launcher / 工作 app。 |
| `GetForegroundWindow` | Windows Win32 函数 | 返回当前前台窗口的句柄 `HWND`。 | 当前用户正在交互的顶层窗口 handle。 | 只返回窗口句柄，不返回标题、进程名或 UI 文本。 | 和 `GetWindowTextW`、`GetWindowThreadProcessId` 组合使用。 |
| `HWND` | Windows 窗口标识 | Windows 中表示窗口的 handle，很多 Win32 API 都围绕它工作。 | 可作为查询标题、进程、位置、显示状态的入口。 | 不是稳定业务 ID；窗口关闭后 handle 可能失效。 | 只作为短期事件处理中的引用，不写入长期记忆。 |
| `GetWindowTextW` | Windows Win32 函数 | 读取窗口标题栏文本的 Unicode 版本函数。 | 顶层窗口 title，例如游戏名、文档标题、launcher 页面标题。 | 不能可靠跨进程读取其他 app 控件内部文本；不要当成“读取窗口所有文字”。 | P0 只读窗口标题，进入 S2 低敏上下文前仍要 blocklist / redaction。 |
| `GetWindowThreadProcessId` | Windows Win32 函数 | 根据窗口 `HWND` 查询所属线程 ID 和进程 ID。 | PID，进而查 process name / exe path。 | 不是用户身份或业务账号信息。 | 把窗口标题绑定到 app / process，便于 allowlist、blocklist 和统计。 |
| `Windows.Graphics.Capture` | Windows 截屏 / 窗口捕获框架 | Windows 的屏幕、窗口、显示器捕获框架，通常通过系统 picker 让用户选择要捕获的内容。 | display / window frame、snapshot、capture stream。 | 不是后台任意偷截图；也不是结构化 UI 读取。 | P2 用户主动“让桌宠看看这里”时使用，默认不后台捕获。 |
| `UserActivity` | Windows app 活动框架 | 让 app 主动声明“用户正在做的可恢复任务”，用于 relaunch / timeline / Recall deep link。 | activity id、ActivationUri、display text、visual elements、content metadata、session history。 | 不是第三方 app 行为采集器，也不能读取全局电脑历史。 | first-party game / desktop-pet 可主动上报游戏关卡、任务页、活动状态。 |
| `SetWindowDisplayAffinity` | Windows 防捕获函数 | 设置自己进程顶层窗口的显示亲和性，`WDA_EXCLUDEFROMCAPTURE` 可让窗口不出现在截图 / 捕获中。 | 保护当前 app 自己的顶层窗口不被常规系统捕获 API 捕获。 | 不是 DRM，也不能阻止拍屏；也不能保护别的 app。 | 桌宠自己的敏感设置页 / Memory Center 应启用，作为隐私配套。 |
| `ETW` | Windows 诊断事件框架 | Event Tracing for Windows，偏系统诊断、性能分析、内核 / app 事件追踪。 | process / performance / provider-defined events，可实时消费或写 log。 | 太底层，不是桌宠记忆系统的默认上下文 API。 | MVP 不建议用；除非后续做性能诊断或 QA telemetry。 |

## 3. Source Strategy

| 来源 | 链接 | 类型 | 可信度 | 主要用途 |
|---|---|---|---:|---|
| OpenChronicle GitHub README | https://github.com/Einsia/OpenChronicle | 开源项目一手资料 | 高 | 项目定位、架构、支持平台、MCP、存储形态 |
| OpenChronicle capture docs | https://github.com/Einsia/OpenChronicle/blob/main/docs/capture.md | 开源项目一手资料 | 高 | AX 事件、capture 文件结构、dedup、截图保留策略 |
| OpenChronicle architecture docs | https://raw.githubusercontent.com/Einsia/OpenChronicle/main/docs/architecture.md | 开源项目一手资料 | 高 | daemon、timeline、session、writer、SQLite / MCP |
| OpenChronicle memory format | https://raw.githubusercontent.com/Einsia/OpenChronicle/main/docs/memory-format.md | 开源项目一手资料 | 高 | Markdown 记忆文件、supersede、FTS 索引 |
| OpenChronicle MCP docs | https://raw.githubusercontent.com/Einsia/OpenChronicle/main/docs/mcp.md | 开源项目一手资料 | 高 | agent 查询工具、raw capture 与 compressed memory 分层 |
| Apple AXUIElement docs | https://developer.apple.com/documentation/applicationservices/axuielement_h | 官方文档 | 高 | macOS Accessibility / AX Tree 基础 |
| Apple AXIsProcessTrustedWithOptions docs | https://developer.apple.com/documentation/applicationservices/1459186-axisprocesstrustedwithoptions | 官方文档 | 高 | Accessibility 授权检查 |
| Apple ScreenCaptureKit docs | https://developer.apple.com/documentation/screencapturekit/ | 官方文档 | 高 | macOS 屏幕 / 窗口捕获 |
| Apple CGWindowListCopyWindowInfo docs | https://developer.apple.com/documentation/coregraphics/cgwindowlistcopywindowinfo%28_%3A_%3A%29 | 官方文档 | 高 | macOS 窗口列表与窗口元数据 |
| Microsoft UI Automation Overview | https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-uiautomationoverview | 官方文档 | 高 | Windows UIA 树、properties、patterns、events |
| Microsoft UI Automation Events | https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-eventsoverview | 官方文档 | 高 | focus、property、structure、global desktop events |
| Microsoft subscribing to UIA events | https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-eventsforclients | 官方文档 | 高 | UIA 事件订阅方法与限制 |
| Microsoft SetWinEventHook | https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwineventhook | 官方文档 | 高 | Windows 全局事件 hook |
| Microsoft GetForegroundWindow | https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getforegroundwindow | 官方文档 | 高 | 当前前台窗口句柄 |
| Microsoft GetWindowTextW | https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowtextw | 官方文档 | 高 | 窗口标题读取及跨进程限制 |
| Microsoft Windows.Graphics.Capture | https://learn.microsoft.com/en-us/windows/uwp/audio-video-camera/screen-capture | 官方文档 | 高 | Windows 截屏 / 窗口捕获与用户 picker |
| Microsoft Recall overview | https://learn.microsoft.com/en-us/windows/apps/develop/windows-integration/recall/ | 官方文档 | 高 | Recall 开发者集成边界 |
| Microsoft Recall DLP Provider API | https://learn.microsoft.com/en-us/windows/apps/develop/windows-integration/recall/dlp-provider-api | 官方文档 | 高 | Recall 与 DLP provider 的交互 |
| Microsoft SetWindowDisplayAffinity | https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity | 官方文档 | 高 | Windows 窗口内容防截图 / Recall 捕获保护 |
| Microsoft UserActivities namespace | https://learn.microsoft.com/en-us/uwp/api/windows.applicationmodel.useractivities | 官方文档 | 高 | UserActivity 的能力与 Timeline 同步限制 |
| Microsoft User Activities guide | https://learn.microsoft.com/en-us/windows/uwp/launch-resume/useractivities | 官方文档 | 高 | app 主动生成可恢复用户活动 |
| Microsoft Active Accessibility and UI Automation Compared | https://learn.microsoft.com/en-us/windows/win32/winauto/microsoft-active-accessibility-and-ui-automation-compared | 官方文档 | 高 | Windows Automation API 框架边界 |
| Accessibility Insights for Windows | https://devblogs.microsoft.com/engineering-at-microsoft/accessibility-insights-for-windows/ | Microsoft 工程博客 | 中高 | UIA tree、properties、patterns、events 的工程验证工具 |
| OpenRecall GitHub | https://github.com/openrecall/openrecall | 开源项目 | 中高 | 跨平台 Recall-like 记忆产品参考 |
| Windrecorder GitHub | https://github.com/yuka-friends/Windrecorder | 开源项目 | 中高 | Windows 本地屏幕记忆 / OCR / 活动统计参考 |
| screenpipe GitHub | https://github.com/screenpipe/screenpipe | 开源项目 | 中高 | 跨平台 screen / audio / accessibility-tree memory 参考 |
| OpenAdapt Desktop GitHub | https://github.com/OpenAdaptAI/openadapt-desktop | 开源项目 | 中高 | 跨平台活动捕获、PII scrub、review / approve / upload pipeline 参考 |
| FlaUI GitHub | https://github.com/FlaUI/FlaUI | 开源项目 | 中 | .NET UI Automation wrapper，适合 Windows UIA POC |
| pywinauto GitHub | https://github.com/pywinauto/pywinauto | 开源项目 | 中 | Python Win32 / UIA backend，适合快速验证窗口与控件读取 |
| Microsoft ETW overview | https://learn.microsoft.com/en-us/windows/win32/etw/about-event-tracing | 官方文档 | 高 | Windows 系统诊断事件框架；用于判断是否应排除出 MVP |

## 4. OpenChronicle 工作机制拆解

### 4.1 它采什么

| 数据层 | OpenChronicle 实现 | 价值 | 风险 |
|---|---|---|---|
| 前台 app / 窗口 | 通过 macOS AX watcher、window metadata 获取 app name、bundle id、window title。 | 判断用户正在做什么，形成 session 边界。 | 窗口标题可能包含文件名、聊天对象、项目名。 |
| AX Tree / Accessibility Tree | AX-first，提取 focused element、visible text、url、部分 UI 树。 | 比截图 OCR 更结构化、成本低、可检索。 | 第三方 app 的 AX 暴露质量不稳定；可能采到敏感文本。 |
| 截图 | 可选保存到 capture JSON；当前不进入下游 timeline / reducer / classifier prompt，更多用于未来 vision/debug。 | 能补足 AX 不可见的视觉信息。 | 隐私风险最高；文件体积大。 |
| Timeline blocks | 把 captures 归一化为 1 分钟活动块。 | 降低事件噪声，为 session reducer 提供输入。 | LLM 摘要可能丢细节或误归因。 |
| Session memory | 根据 idle、app switch、timeout 切 session，再 reducer 成日事件。 | 人类更容易理解“某段时间在做什么”。 | session 切分规则需要按桌宠场景重调。 |
| Durable memory | 写入 `user-`、`project-`、`tool-`、`topic-`、`person-`、`org-`、`event-` Markdown 文件，并由 SQLite FTS5 索引。 | 可读、可 grep、可审计、可供 agent 查询。 | 自动写长期记忆必须有查看、删除、纠错机制。 |
| MCP query layer | daemon 暴露本地 MCP server，提供 `current_context`、`search_captures`、`read_memory`、`recent_activity` 等只读工具。 | agent 可以在需要时拉取上下文，不必每轮注入全部历史。 | MCP 配置与权限治理复杂；本项目当前不直接配置 MCP。 |

### 4.2 关键架构启发

- **AX-first，而不是 screenshot-first**：OpenChronicle 选择结构化 UI 信息作为主信号，把截图作为补充。这比“定时全屏截图 + OCR”更轻，也更容易解释。
- **事件流要先降噪**：它有 debounce、dedup、min capture gap、same-window dedup、content fingerprint，避免一秒钟写大量重复数据。
- **session 是记忆的自然单位**：不是每个事件都变成长期记忆，而是先压缩成活动块，再按 session 生成“今天做了什么”。
- **长期记忆要可审计**：Markdown + supersede-not-delete 的策略，比黑盒向量库更适合用户信任。
- **raw capture 与 compressed memory 要分层**：raw capture 适合短期追问；长期记忆只保留压缩后的重要事实。

### 4.3 不适合直接照搬的点

- OpenChronicle 当前是 macOS-only early alpha；Windows / Linux 没有同等实现。
- 它面向 tool-capable LLM agent，不是游戏 SDK；桌宠需要更多用户授权、游戏事件接入、低打扰交互与内容安全。
- 它的默认记忆文件类型偏“工作流 / 项目 / 工具 / 人”；桌宠需要改成“玩家偏好 / 角色关系 / 游戏事件 / 任务状态 / 互动历史”。
- 如果用于消费者桌宠，默认屏幕观察会引发强隐私感知，必须比开发者工具更保守。

## 5. macOS 框架栈与能力地图

| 能力 | macOS API / 机制 | 可采集数据 | 权限 / 约束 | 对 desktop-pet 的建议 |
|---|---|---|---|---|
| Accessibility / AX Tree | `AXUIElement`、`AXObserver`、AX notifications | UI element role、title、value、focused element、部分可见文本、窗口 / 控件变化 | 需要 Accessibility trust；可用 `AXIsProcessTrustedWithOptions` 检查并引导授权。 | P1 再启用；默认只采 active app + window title，不默认读取输入框全文。 |
| 前台 app / 窗口元数据 | `NSWorkspace`、`CGWindowListCopyWindowInfo`、AX app/window | app name、bundle id、window title、window bounds、window id | 部分信息可能受隐私限制；窗口列表查询成本需控制。 | P0 可用，但必须有 app blocklist 与“仅本地保存”说明。 |
| 屏幕 / 窗口捕获 | `ScreenCaptureKit`、`SCShareableContent`、`SCStream`、`SCScreenshotManager` | 显示器 / app / window frame、可选音频 | 需要 Screen Recording / Screen & System Audio Recording 权限；系统会提示。 | 不默认开启；只在用户主动“让桌宠看看这里”时局部截图。 |
| URL / 浏览器上下文 | AX Tree 或浏览器扩展 / app bridge | 当前网页标题、URL、页面可见文本 | AX 读取网页文本敏感；浏览器扩展需要单独授权。 | 只做 allowlist；游戏桌宠 P0 不需要泛网页记忆。 |
| 输入事件 | Event Tap / HID / NSEvent monitor | 键鼠行为、快捷键、交互节奏 | 高敏；可能接近 keylogging。 | 不建议采集内容级键盘输入；最多采低敏交互节奏，且默认关闭。 |
| 本地存储 / 索引 | SQLite FTS5、Markdown、Core Data、SQLite | 压缩记忆、短期 raw event、长期用户偏好 | 需要加密、保留周期、导出 / 删除。 | P0 使用 SQLite + 可读 JSON/Markdown debug；用户侧提供记忆管理 UI。 |

## 6. Windows 是否有相对框架？

有，但要分三层看：**官方 OS framework stack**、**开源 Recall-like framework**、**UIA wrapper / 自动化工具链**。Windows 没有一个完全等价 OpenChronicle 的“官方记忆框架”，但它具备拼出 OpenChronicle 类系统所需的大部分底层能力。

### 6.1 官方 OS framework stack

| 框架层 | Windows 框架 | 对标 OpenChronicle 哪一层 | 可做什么 | 不适合做什么 |
|---|---|---|---|---|
| 结构化 UI | `Windows Automation API`：`UI Automation` + legacy `MSAA` | macOS AX Tree / AX Observer | 读取 UIA tree、automation element、control pattern、focus / property / structure event。 | 不保证所有 app 暴露完整 UI；不应直接长期保存跨 app 全文。 |
| 窗口事件 | Win32 `SetWinEventHook`、`GetForegroundWindow`、`GetWindowTextW`、PID / process APIs | OpenChronicle event dispatcher / app switch signal | 监听前台窗口变化、读取窗口标题、识别进程和 app。 | 不能读取其他进程控件正文；只适合低敏窗口级上下文。 |
| 截图 / 视频 | `Windows.Graphics.Capture` | OpenChronicle screenshot-assisted layer | 用户选择 display / window 后采集 frame 或 snapshot。 | 不适合作为后台默认全屏记录；需要用户感知授权和捕获提示。 |
| 用户活动 | `Windows.ApplicationModel.UserActivities` / Project Rome | first-party activity metadata | 让自家 app / game 上报可恢复任务，提供 ActivationUri 和活动元数据。 | 不负责采集第三方 app 行为；不是 OS 全局历史读取接口。 |
| Recall 生态 | Recall overview、DLP Provider API、`SetWindowDisplayAffinity` | 系统级 recall / privacy control 参考 | 让 app 支持 Recall relaunch、DLP 判断、排除敏感窗口被捕获。 | 不提供第三方读取用户 Recall 快照 / OCR / semantic index 的通用入口。 |
| 诊断事件 | ETW | 系统行为事件流 | 采集性能、进程、系统事件，适合诊断 / QA。 | 对桌宠记忆过重、过底层，MVP 不建议用。 |

### 6.2 官方能力细表

| OpenChronicle / macOS 能力 | Windows 对标框架 / API / 机制 | 可采集数据 | 成熟度 | 关键限制 | 建议优先级 |
|---|---|---|---|---|---|
| AX Tree / Accessibility Tree | `Microsoft UI Automation (UIA)` | UIA tree、AutomationElement properties、control patterns、focus element、value/text pattern | 高 | 不同技术栈支持不一致；不是所有 UIA events 都可靠触发；部分 app / elevated window 可能不可读。 | P1 |
| AX notifications / app focus events | `UI Automation Events`：focus、property、structure、global desktop events | 焦点变化、元素变化、窗口关闭、文本变化信号 | 高 | Microsoft 文档提醒不要假设所有 provider 都会 raise 所有事件。 | P1 |
| 前台窗口变化 | `SetWinEventHook(EVENT_SYSTEM_FOREGROUND...)`、`GetForegroundWindow` | 前台窗口句柄、激活变化 | 高 | 需要 message loop；hook callback 有重入与跨位数进程行为；只给事件，不给 UI 语义。 | P0 |
| 窗口标题 / 进程 | `GetWindowTextW`、`GetWindowThreadProcessId`、Process APIs | window title、PID、process name、exe path | 高 | `GetWindowText` 不能跨进程读取其他 app 的 edit control 文本，只适合标题。 | P0 |
| 屏幕 / 窗口捕获 | `Windows.Graphics.Capture` | display / window frames、snapshots | 高 | 需要 manifest capability；通常通过系统 picker 由用户选择；系统显示黄色捕获边框。 | P1 / P2 |
| Recall 式屏幕快照 | Windows Recall | 本地快照、OCR、semantic search、timeline | 中高但受硬件 / 区域 / 策略限制 | 不是第三方通用读取 API；开发者主要提供 UserActivity relaunch、DLP、capture protection。 | 不作为数据源 |
| App 主动上报活动 | `Windows.ApplicationModel.UserActivities` / Project Rome | app-defined activity id、ActivationUri、visual elements、content metadata、session history | 中 | 需要 app 主动生成；Timeline MSA sync 自 2021-07 起有变化，本地仍可见历史。 | P0 for first-party app/game |
| 阻止被截图 | `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)` | 不是采集 API，而是保护窗口不被截图 / Recall 捕获 | 高 | 只能保护当前进程顶层窗口；不是 DRM 级绝对保护。 | 必做隐私配套 |
| 系统性能 / 进程事件 | `ETW` | process create/exit、性能、系统事件 | 高 | 更偏诊断 / 性能分析；权限、体量、解释成本高。 | 不建议做 MVP 记忆 |
| OCR | Windows OCR / Windows AI / third-party OCR | 截图文字 | 中 | 依赖截图；隐私风险高。 | 仅用户主动截图时使用 |

### 6.3 开源 Recall-like / activity-capture 框架

| 框架 / 项目 | 平台 | 核心采集方式 | 记忆 / 查询方式 | 对 desktop-pet 的价值 | 主要风险 |
|---|---|---|---|---|---|
| OpenRecall | Windows / macOS / Linux | 定期截图，OCR / 图像分析后可搜索 | 本地存储，semantic search，浏览器 UI | 说明跨平台 Recall-like 体验可用普通硬件实现。 | 偏 screenshot-first，隐私风险高；AGPLv3 也不适合直接商业嵌入。 |
| Windrecorder | Windows 为主 | 多屏 / 单屏 / active window 低体积录制，只索引变化画面，OCR、页面标题、URL、活动统计 | 本地 WebUI、OCR / image semantics 查询、时间线和统计 | 是 Windows 本地屏幕记忆产品里很有参考价值的一类实现。 | 仍是 screen-recording-first；更适合个人回溯，不适合桌宠默认采集。 |
| screenpipe | macOS / Windows / Linux | accessibility tree + OCR fallback + audio transcription + app switches + keyboard inputs | 本地 AI memory、natural language search、plugin system / Pipes | 结构上比单纯 OCR 更接近 OpenChronicle，也支持 agent 查询工作流。 | 默认采集面很宽，含 audio / keyboard inputs；桌宠 MVP 不能照搬。 |
| OpenAdapt Desktop | macOS / Windows / Linux planned / CLI engine | screen recording、mouse / keyboard events、window metadata、optional audio | 本地 capture、PII scrub、review / approve / upload pipeline | 它的 human-in-the-loop scrub、review、approve、egress gating 很适合作为隐私管线参考。 | 定位是 AI training data collection，不是实时桌宠记忆；仍偏高敏采集。 |

### 6.4 UIA wrapper / POC 工具链

| 工具 | 语言 / 生态 | 作用 | 适合本项目怎么用 |
|---|---|---|---|
| Accessibility Insights for Windows | Microsoft / .NET | 检查 UIA tree、properties、patterns、events，验证某个 app 暴露了什么结构化信息。 | Engineering Spike 前先用它人工检查目标游戏 launcher、设置页、桌宠窗口。 |
| FlaUI | .NET | Microsoft UI Automation wrapper，适合 C# / Windows 原生 POC。 | 如果 Windows 客户端用 .NET / WinUI / WPF，可用它快速验证 UIA 读取和事件监听。 |
| pywinauto | Python | 支持 `win32` 与 `uia` backend 的 Windows GUI automation 库。 | 适合快速脚本验证 `active window + title + UIA element`，不要作为最终 runtime 依赖。 |

### 6.5 判断结论

- 如果问“Windows 有没有 OpenChronicle 这种官方一体化记忆框架”：**没有**。
- 如果问“Windows 有没有能对标 OpenChronicle 采集层的框架”：**有，核心是 Windows Automation API / UIA + WinEvent + Graphics Capture**。
- 如果问“Windows 有没有已做成产品形态的本地记忆框架”：**有开源参考，如 Windrecorder、OpenRecall、screenpipe、OpenAdapt，但多数采集面比桌宠 MVP 更激进**。
- 对 `desktop-pet` 最合理的路线不是直接接入某个 Recall-like 项目，而是吸收它们的架构思想：event capture、dedup、短期 raw buffer、summary memory、local index、user review / delete / blocklist。

## 7. Windows Recall 能不能作为对标方案？

### 7.1 可以参考的部分

- Recall 证明了“本地快照 + OCR + semantic index + timeline search”是 OS 级方向。
- Microsoft 官方强调 Recall 使用本地保存 / 分析快照，并支持用户按 Settings 控制 snapshots。
- 开发者可以通过 UserActivity 提供 deep link，让用户从 Recall 结果 relaunch 到 app 内具体内容。
- DLP Provider API 显示 Recall 捕获前会查询 DLP provider，并传入 process、window、file、labels 等上下文。
- App 可以用 `SetWindowDisplayAffinity` 让窗口内容不出现在 Recall 或其他截图应用中。

### 7.2 不应照搬的部分

- Recall 不是 desktop-pet 可直接调用的“用户电脑记忆数据库”。
- Recall 依赖 Copilot+ PC、Windows 版本、企业策略、用户 opt-in，不适合作为跨平台产品基础能力。
- Recall 类全量快照会天然引发隐私与安全担忧；桌宠场景比开发工具更需要克制。
- 即使是 Microsoft 官方 Recall，也把 DLP、Windows Hello、VBS Enclave、snapshot filtering 作为安全重点；我们不能用简化版全量截图替代这些治理。

## 8. 对 desktop-pet 的推荐数据分层

### 8.1 可采集数据分级

| 分级 | 数据 | 例子 | 默认策略 | 用于什么记忆 |
|---|---|---|---|---|
| S0 低敏显式数据 | 用户主动告诉桌宠的信息 | 昵称、偏好、想被怎么称呼、桌宠性格开关 | 默认可存，但可查看 / 删除 | 角色关系记忆、偏好 |
| S1 第一方游戏事件 | 游戏 / SDK 主动上报事件 | 登录、关卡、成就、死亡、组队、活动提醒、游戏内任务状态 | P0 主数据源；需游戏侧授权 | 游戏陪伴、召回、情境反馈 |
| S2 低敏 OS 上下文 | 当前 app、窗口标题、空闲 / 活跃、是否全屏游戏 | `League Client`、`Steam`、`VS Code`、`Idle 10min` | P0 可选开关；本地处理 | 判断打扰时机、低频主动出现 |
| S3 结构化 UI 文本 | AX / UIA visible text、focused element value | 当前文档标题、IDE 错误、设置页按钮 | P1；仅 allowlist app 或用户主动触发 | 上下文问答、短期帮助 |
| S4 用户主动截图 | 用户框选区域或点击“让它看看” | 游戏结算页、错误弹窗、任务说明 | P1 / P2；预览确认，不默认长期保存 | 临时理解、可选摘要入记忆 |
| S5 高敏连续捕获 | 全屏定时截图、系统音频、键盘输入、跨 app 全文 | Recall 式全量快照、语音常开 | MVP 不做；除非强合规设计和用户明确 opt-in | 不建议作为桌宠基础记忆 |

### 8.2 推荐 MVP 技术路径

| 阶段 | macOS | Windows | 输出事件格式 | 目标 |
|---|---|---|---|---|
| P0 Context Lite | `NSWorkspace` / `CGWindowListCopyWindowInfo` 获取前台 app 与窗口标题；游戏 SDK 事件为主。 | `SetWinEventHook` + `GetForegroundWindow` + `GetWindowTextW` + process name；游戏 SDK 事件为主。 | `active_app_changed`、`window_title_changed`、`game_event`、`pet_interaction` | 不碰截图和全文 UI，先验证“上下文时机 + 游戏事件记忆”价值。 |
| P1 Structured UI Opt-in | 用户授权 Accessibility 后，对 allowlist app 使用 AX focused element / visible text。 | 用户打开“增强上下文”后，对 allowlist app 使用 UIA focus / property / text pattern。 | `ui_focus_changed`、`visible_text_snapshot`、`context_summary` | 支持用户主动问“我现在这里是什么”。 |
| P2 Visual Context On Demand | ScreenCaptureKit 局部截图，用户预览确认后只保存摘要。 | Windows.Graphics.Capture picker 局部 / 窗口截图，用户预览确认后只保存摘要。 | `user_confirmed_screenshot_summary` | 支持视觉问题解释，不做后台 Recall。 |
| P3 Memory Productization | 本地加密 SQLite + 用户可读导出；记忆查看 / 删除 / pin / blocklist UI。 | 同 macOS；额外支持 `SetWindowDisplayAffinity` 保护桌宠敏感窗口。 | `memory_entry`、`memory_superseded`、`memory_deleted` | 把记忆变成用户可控产品能力。 |

## 9. 跨平台抽象建议

不要把业务代码直接绑定 AX / UIA / Recall。建议做四层：

```text
Context Capture Adapter
├── macos/
│   ├── app_focus_adapter
│   ├── ax_tree_adapter
│   └── screen_capture_adapter
├── windows/
│   ├── win_event_adapter
│   ├── uia_adapter
│   ├── graphics_capture_adapter
│   └── user_activity_adapter
├── common/
│   ├── event_schema
│   ├── privacy_policy
│   ├── redaction
│   ├── sessionizer
│   ├── memory_writer
│   └── memory_query
└── game_sdk/
    ├── game_event_ingest
    ├── character_state
    └── user_consent_bridge
```

### 9.1 统一事件 schema 草案

| Field | 类型 | 示例 | 说明 |
|---|---|---|---|
| `event_id` | string | `evt_20260508_001` | 本地唯一 ID |
| `timestamp` | ISO datetime | `2026-05-08T18:50:00+08:00` | 用户本地时区 |
| `source` | enum | `game_sdk` / `os_focus` / `uia` / `ax` / `screenshot` / `pet_chat` | 数据来源 |
| `sensitivity` | enum | `S0` / `S1` / `S2` / `S3` / `S4` / `S5` | 隐私分级 |
| `app_name` | string? | `Steam` | 可为空 |
| `bundle_or_process_id` | string? | `com.valvesoftware.steam` / `steam.exe` | 平台相关 ID |
| `window_title` | string? | `Library - Steam` | P0 可采，但需 blocklist |
| `game_id` | string? | `game_alpha` | 脱敏游戏 ID |
| `game_event_type` | string? | `quest_completed` | SDK 事件 |
| `raw_text_ref` | string? | `capture://...` | 不直接把高敏原文写长期记忆 |
| `summary` | string | `用户刚完成一局高难度挑战` | 压缩摘要 |
| `retention` | enum | `ephemeral` / `7d` / `long_term` | 保留周期 |
| `user_visible` | boolean | `true` | 是否在记忆 UI 中展示 |

### 9.2 记忆写入原则

- **raw event 不等于 memory**：OS 事件先进入短期 buffer，只有通过规则 / 用户确认 / LLM summarizer 后才进入长期记忆。
- **游戏事件优先**：例如“玩家连续 3 次败给同一 boss”比“当前窗口标题包含 boss 名”更可靠、更合规。
- **敏感 app blocklist 默认开启**：Password Manager、银行、聊天、浏览器隐私窗口、公司文档、Terminal secrets、系统设置隐私页等默认不采。
- **用户可见、可删、可改**：长期记忆必须提供 Memory Center，允许查看来源、禁用类别、删除单条或全部重置。
- **本地优先**：默认本地存储和本地摘要；云端 LLM 只发送脱敏摘要或用户主动确认的片段。

## 10. macOS vs Windows 对标总表

| 维度 | macOS / OpenChronicle 路径 | Windows 对标路径 | 差异判断 |
|---|---|---|---|
| 结构化 UI 树 | AX Tree / Accessibility API | UI Automation Tree | 两者概念接近，但字段、权限、provider 质量不同；需要 adapter 抹平。 |
| 事件订阅 | AXObserver / AX notifications | UIA Events / SetWinEventHook | Windows 可用 WinEvent 先做窗口级事件，UIA 再做元素级事件。 |
| 前台窗口 | NSWorkspace / CGWindowList / AX | GetForegroundWindow / GetWindowText / PID APIs | Windows 标题读取简单，但控件文本跨进程不能靠 GetWindowText。 |
| 截图 | ScreenCaptureKit | Windows.Graphics.Capture | 两侧都要用户可感知授权；不建议后台默认截图。 |
| 系统级 Recall | 没有 Apple 官方等价产品；OpenChronicle 是开源实现 | Windows Recall | Recall 是用户功能与生态集成点，不是第三方随意读取数据源。 |
| App 主动活动 | 自己定义 game events / app bridge | UserActivity API | Windows UserActivity 可作为 relaunch / activity metadata；macOS 需自建。 |
| 本地记忆层 | OpenChronicle 用 Markdown + SQLite FTS5 | 自建 SQLite / Markdown / FTS | 可跨平台自建一套，不必依赖 OS 记忆系统。 |
| 权限体验 | macOS TCC 对 Accessibility / Screen Recording 更显式 | UIA / WinEvent 较少中心化授权，Graphics Capture 有 picker / border | Windows 更需要产品自己做透明授权 UI 和隐私说明。 |

## 11. 风险清单

| 风险 | 严重度 | 证据 / 原因 | 缓解建议 |
|---|---:|---|---|
| 用户感知为“监控电脑” | P0 | 全局屏幕 / app 观察天然敏感；Recall 曾因隐私争议被广泛讨论。 | P0 不做全量截图；首次引导明确“采什么 / 不采什么 / 存多久 / 如何删”。 |
| 采到密码、聊天、公司资料 | P0 | AX / UIA / screenshots 都可能包含敏感文本。 | blocklist + secure field redaction + allowlist + 本地处理 + 用户确认。 |
| 第三方 app UIA / AX 支持不稳定 | P1 | Microsoft 文档提醒不要假设所有 UIA provider 都触发所有事件；Electron / game UI 的 accessibility tree 质量也不稳定。 | 不把 OS UI 文本作为唯一事实来源；优先 game SDK event。 |
| 截图 / OCR 成本和延迟高 | P1 | 图像比结构化文本更贵；OpenChronicle 也选择 AX-first。 | screenshot on demand；只保存摘要，不长期存原图。 |
| 错误记忆破坏陪伴关系 | P1 | 陪伴产品记错用户偏好会比工具型 app 更伤信任。 | 记忆可见、可纠错、可 pin、可删除；高置信度才长期保存。 |
| 跨平台行为不一致 | P1 | macOS AX 与 Windows UIA 差异大。 | 定义统一 event schema 和 capability detection，按能力降级。 |
| 过度设计 Agent / Recall | P2 | MVP 目标是验证桌宠记忆价值，不是复刻 OS 级 AI memory。 | 先做 Context Lite + game event memory，避免一开始做全量电脑记忆。 |

## 12. 推荐产品策略

### 12.1 P0：Context Lite Memory

- 采集：
  - 用户主动对话与反馈。
  - 游戏 SDK 上报的第一方事件。
  - 当前 active app / window title / 是否 idle / 是否全屏。
- 不采集：
  - 不采集键盘输入内容。
  - 不默认截图。
  - 不读取聊天软件、密码管理器、浏览器隐私窗口。
  - 不上传 raw OS context。
- 记忆：
  - `user_preference`：称呼、语气偏好、打扰频率。
  - `game_progress_signal`：最近常玩的游戏、最近失败/成功节点、活动兴趣。
  - `pet_relationship`：互动历史、共同经历、用户对桌宠的反馈。
  - `notification_policy`：什么时候可以主动出现，什么时候必须安静。

### 12.2 P1：Structured Context Opt-in

- 用户打开“增强上下文”后，允许桌宠读取 allowlist app 的结构化 UI 信息。
- macOS 用 AX，Windows 用 UIA。
- 只保留短期 buffer；长期记忆只写摘要。
- 每次桌宠使用上下文回答时，在 UI 上提示“使用了当前窗口上下文”。

### 12.3 P2：Visual Context On Demand

- 用户主动框选或点击“让桌宠看看”。
- macOS 用 ScreenCaptureKit；Windows 用 Windows.Graphics.Capture picker。
- 截图先给用户预览，默认只把摘要进入记忆。
- 原图默认短期保留或不保留。

### 12.4 不建议进入 MVP 的能力

- Recall 式后台全屏快照。
- 系统音频持续监听。
- 键盘输入内容记录。
- 跨 app 全文可见文本长期存储。
- 自动读取浏览器页面全文。
- 默认云端上传桌面上下文。

## 13. 给 PM / Engineering 的问题

| 问题 | Owner | 为什么重要 |
|---|---|---|
| 桌宠记忆系统的第一性目标是“更懂玩家”，还是“更懂玩家当前电脑任务”？ | PM Strategy Thread | 决定数据源优先级；我倾向前者。 |
| P0 是否只允许 first-party game event + 用户主动对话进入长期记忆？ | PM + Engineering | 这是隐私边界的核心产品决策。 |
| 当前项目是否需要“屏幕感知”，还是先做“游戏事件感知”？ | PM Strategy Thread | 屏幕感知会显著增加合规、信任和工程复杂度。 |
| 用户是否能在 Memory Center 中查看、删除、禁用每类记忆？ | Design + Engineering | 没有可见控制，记忆会变成信任风险。 |
| Windows 是否必须支持 Recall integration，还是只支持 UserActivity / UIA / WinEvent？ | Engineering Build Thread | Recall 不应作为数据源，但 relaunch / DLP / capture protection 可评估。 |
| 面向不同游戏接入时，是否提供统一 `game_event_schema`？ | PM + Engineering | 这是多游戏 SDK 化的关键。 |

## 14. Recommended Actions

| Action | Workspace / Thread | Priority | Input Needed | Expected Output |
|---|---|---:|---|---|
| 把本文转成“记忆系统数据边界”需求澄清 | PM Strategy Thread | P0 | 本文 + `PROJECT_CONTEXT.md` | `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` |
| 设计 `Context Capture Adapter` 技术方案 | Engineering Build Thread | P0 | 本文第 8-10 节 | `03-engineering/TECHNICAL_DESIGN_context-capture-adapter.md` |
| 设计 Memory Center 信息架构 | Design Prototype Thread | P1 | 数据分级 + 删除 / 禁用 / 来源展示需求 | `02-design/DESIGN_BRIEF_memory-center.md` |
| 实做一个本地 spike | Engineering Build Thread | P1 | macOS active app + Windows foreground window + fake game events | 本地 POC，不接真实玩家数据 |

## 15. 最小可验证 Demo idea

| Demo | 核心体验 | 数据源 | 成功标准 | 风险 |
|---|---|---|---|---|
| Context Lite Pet Memory | 桌宠知道“你最近常在某游戏里打某活动，且不喜欢它在全屏时打扰你”。 | 假 game events + active app/window title + pet chat feedback | 用户能感觉桌宠更懂场景，但没有被监控感。 | 如果窗口标题包含敏感信息，必须屏蔽或本地摘要。 |
| Ask My Current Window | 用户主动问“这个报错是什么意思”，桌宠读取当前窗口结构化文本后回答。 | macOS AX / Windows UIA allowlist | 比用户手动复制更省事；回答 UI 显示上下文来源。 | UIA / AX 对 Electron、游戏窗口、浏览器页面支持不稳定。 |
| Screenshot With Consent | 用户框选游戏结算页，桌宠总结并记住“这次通关了”。 | ScreenCaptureKit / Windows.Graphics.Capture picker | 截图只在用户主动触发时发生；记忆只保存摘要。 | 截图中可能有聊天或昵称，需要预览和遮挡。 |

## 16. Fact / Opinion / Speculation

| Claim | Type | Confidence | Notes |
|---|---|---:|---|
| OpenChronicle 当前 macOS only、early alpha，使用 AX-first、Markdown、SQLite、MCP。 | Fact | High | 来自 GitHub README 与 docs。 |
| Windows 对标需要 UIA + WinEvent + Graphics Capture + UserActivity 组合，而非单一 API。 | Fact | High | 来自 Microsoft 官方 API 文档。 |
| Recall 不适合作为 desktop-pet 直接数据源。 | Opinion | High | 官方文档展示的开发者能力不是读取 Recall 数据，而是 relaunch、DLP、capture protection 等。 |
| 游戏桌宠长期记忆应优先依赖 game event，而不是 OS 级观测。 | Speculation | Medium | 基于隐私、准确性、产品定位推断，需要 PM 验证。 |
| P0 不做全量截图会更利于用户信任。 | Opinion | High | 基于 Recall 类产品争议、桌宠用户预期和隐私风险判断。 |
