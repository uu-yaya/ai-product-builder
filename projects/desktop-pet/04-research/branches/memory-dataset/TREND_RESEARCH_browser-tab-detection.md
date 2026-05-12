# Trend Research: 浏览器多 tab 身份识别（合规路径）

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-12
> Reference spec: `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.7.4（视频类 VLM）+ §4.3（UI 信息边界）+ §4.11（Playwright 范畴）
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-12T09-13-46_pm_browser-tab-detection-radar-research.md`
> Companion deliverables: `TREND_RESEARCH_audio-derivation-libraries.md`、`TREND_RESEARCH_local-vlm-feasibility.md`、`TREND_RESEARCH_os-now-playing-api.md`

## 1. 引言

PM v2.3.4 §4.7.4 视频类 VLM 陪看的前置条件是「当前活跃 tab 是否在视频白名单」。**核心立场**：只识别 tab 身份（域名 / 标题），**不读取页面正文 / 用户输入 / 评论 / 私信**，并与 §4.11 Playwright 路径**严格分离**。本调研覆盖 5 类候选方案：①macOS AX（AXUIElement + AppleScript）②Windows UIA ③浏览器扩展 API（chrome.tabs / browser.tabs）+ Native Messaging ④浏览器 MCP / 原生集成 ⑤窗口标题文本提取。信源以 Apple Developer / Microsoft Learn / MDN / Chrome Developers 一级文档为主，ActivityWatch / RescueTime 等开源工程为参考。

## 2. 总览矩阵

| 方案 | 能拿什么 | 授权流程 | 跨浏览器 | 失败模式 | 杀软风险 | 桌宠适用度 |
|---|---|---|---|---|---|---|
| ① macOS AX (AXUIElement) + AppleScript | 完整 URL + title（Safari / Chrome / Edge / Arc） | 一次性授予 Accessibility + Automation（红色 TCC 弹窗，per-app per-target 二级授权） | macOS only | Chrome 需 `--force-renderer-accessibility`；Safari 紧凑标签栏 AX 有缺陷 | 中（"控制其它 app"会被某些杀软标） | 高（macOS 主推） |
| ② Windows UIA "Address and search bar" | 地址栏文本（可能不带 https://） | 无系统级 prompt（UIA 默认对所有进程可见） | Chromium + Firefox | 跨进程查询慢；用户编辑中的地址栏文本会污染结果 | 低–中 | 中（Windows 备选） |
| ③ 浏览器扩展（chrome.tabs / browser.tabs）+ Native Messaging | tab URL / title / audible / favIcon | 用户主动安装扩展 + activeTab 或 host_permissions（一次性） | Chrome / Edge / Firefox / Safari / Arc / 国产 Chromium 大多兼容 | MV3 service worker 5 min idle 杀进程；Safari 需站点级二次授权；Firefox 商店版 ActivityWatch 因策略被禁 URL | 低（OS 级合规路径） | 高（跨平台最优） |
| ④ 浏览器 MCP server（如 mcp-chrome） | URL + title + 页面内容 + 网络请求 | 安装扩展 + 本地 native bridge（npm 全局安装） | 仅 Chromium | 第三方维护；权限远超 tab 身份；与"不读取页面内容"原则冲突 | 高（功能过权） | 不推荐 |
| ⑤ 窗口标题文本（Win32 / macOS NSWindow title） | 仅 `<title>` HTML 元素文本，**无域名** | 无 | 全部 | 标题不稳定（如 "(3) Bilibili" 通知数前缀、SPA 不更新、修改标题扩展） | 极低 | 仅辅助判断 |

## 3. 各浏览器逐项支持情况

| 浏览器 | AX / UIA 暴露 URL？ | 扩展生态 | MCP 接入？ | 窗口标题含域名？ | 国内特殊性 |
|---|---|---|---|---|---|
| Chrome（macOS） | AX：是，需 `--force-renderer-accessibility`，或用 AppleScript `URL of active tab of front window` | 完全支持 MV3 + Native Messaging | 第三方 mcp-chrome 可用 | 标题为 `<title>` + " - Google Chrome"，YouTube 视频会带 " - YouTube" | — |
| Chrome（Windows） | UIA："Address and search bar" Edit 控件可拿地址栏文本 | 同上 | 同上 | 同上 | — |
| Edge（Chromium） | UIA：与 Chrome 同结构 | 完全支持（Chromium 扩展接口） | 同上 | 标题 + " - Microsoft Edge" | Edge 国内版（dl.microsoft.com/cn）功能与国际版一致 |
| Safari | AX：是，AXWebArea 节点含 URL 属性；AppleScript 最简：`tell application "Safari" to return URL of front document` | Safari Web Extension API（基于 WebExt），但 `tabs.query` 受站点权限限制，需用户对每个域名首次授权 | 无官方 MCP | 标题含 `<title>` 文本，不含域名 | — |
| Firefox | UIA：是（与 Chrome 不同结构，需另一种 query 路径）；macOS AX 较弱 | 完整 WebExtensions；但 Mozilla AMO 政策**禁止默认抓取 URL**（ActivityWatch 商店版只能显示"Unknown"，需自编译） | 较少 | 标题 + " — Mozilla Firefox" | — |
| Arc | 基于 Chromium：UIA / AX 可走同样路径 | 兼容 Chrome 扩展 | 同 Chrome | Arc 默认隐藏 URL 栏，但窗口标题仍含 `<title>` | — |
| 360 安全浏览器 | UIA：极速模式（Chromium）同 Chrome；IE 兼容模式无法访问 | "Chrome 扩展 95% 兼容"（社区数据，事实带观点）；双模式 tab 控制有限 | 无 | 双核切换会改变标题格式 | 极速 / 兼容双模式是核心差异 |
| QQ 浏览器 | 同 360：基于 Chromium 内核 | Chrome 扩展大多可装；少数 API 拦截 | 无 | — | 推测：与 360 同一档（未找到一级源） |
| 搜狗高速浏览器 | Webkit 内核模式可走 UIA | 有自有扩展中心 `se://extensions/`，并非 100% Chrome API 兼容 | 无 | — | 兼容模式（IE 核）下 UIA 路径完全不同 |
| Edge 国内版 / UC | 与国际 Edge / 各家 Chromium 衍生大致同源 | — | — | — | 未找到一级源 |

## 4. macOS vs Windows 差异

| 维度 | macOS | Windows |
|---|---|---|
| API | AXUIElement + Apple Events（双授权） | UI Automation（UIA），无 TCC |
| 授权 UX | 系统设置 → 隐私与安全 → 辅助功能 / 自动化，**用户必须手动开启**，每个目标 app 红色弹窗 | 默认可读（属于无障碍框架公共接口） |
| 性能 | AX 跨进程，但 Apple 优化较好；AppleScript 比 AX 直接调用慢 | UIA 跨进程同步调用慢；Power Automate 全局 UIA listener 已被记录拖垮整机响应 |
| 浏览器扩展能力 | Safari 受 Apple 严格管控（需 Xcode 打包，签名要求高，站点级二次授权）；其它浏览器扩展能力同 Chrome | Chromium 扩展能力完整；Firefox 受 Mozilla 政策限制 |
| 系统级合规 | TCC 是"用户可见"的护城河，桌宠拿到红色弹窗后用户授权一次永久有效 | 无类似护城河，但杀软可能拦截 UIA 行为 |

## 5. PM 推荐方案

### 5.1 MVP 首选：浏览器扩展 + Native Messaging（跨平台 + 合规清晰）

- 一次安装即拿全部主流浏览器（Chrome / Edge / Arc / 国产 Chromium 衍生）
- `activeTab` 不显示"读取浏览数据"红字警告，但桌宠场景需要后台持续监听 → 用 `tabs` + `host_permissions` 显式声明（合规、用户知情）
- 仅订阅 `chrome.tabs.onActivated` + `chrome.tabs.onUpdated`，将 `tab.url` 的 hostname 比对白名单后再决定是否激活 VLM
- 用 Native Messaging 把"白名单命中"事件推给桌宠主进程，**只传布尔信号 + 域名**，不传完整 URL / 页面内容

### 5.2 备选 1（macOS 端 fallback）：AppleScript 兜底

- 适合用户不愿装扩展、或浏览器没有扩展生态（如某些国产 Mac 浏览器）
- 配合 TCC 弹窗一次性授权

### 5.3 备选 2（Windows 端 fallback）：UIA 读取地址栏 Edit 控件

- 只在用户拒绝装扩展时启用；标注"性能可能受影响"

### 5.4 不推荐

- mcp-chrome 类全功能 MCP：权限远超 tab 身份，违反"不读页面内容"原则
- 窗口标题文本：缺域名 / 易被 SPA 污染，仅作辅助验证
- Firefox AMO 商店版扩展抓 URL：被 Mozilla 政策禁止

### 5.5 授权流程建议

- 首次启动桌宠 → 引导安装浏览器扩展（一键 Chrome Store / Edge Add-ons 安装页）
- 扩展首次启动 → MV3 标准权限提示（一次性）
- macOS 端如启用 AppleScript fallback → 引导用户走系统设置 → 自动化 → 勾选目标浏览器

## 6. 与 PM v2.3.4 §4.7.4 VLM 依赖链对接

```
[扩展 onActivated / onUpdated]
   → tab.url.hostname ∈ {youtube.com, bilibili.com, v.qq.com, iqiyi.com, youku.com}
   → Native Messaging: { type: "video_tab", host: "bilibili.com", active: true }
   → 桌宠主进程: 激活视频类 VLM 模块（按需调用截屏 / OCR / 字幕抓取）
   → 离开白名单 tab → 立即降级，释放 GPU
```

**视频类 VLM vs 游戏类 VLM 依赖差异**：
- 视频类：依赖"tab 在白名单"信号（轻量路径，可用扩展）
- 游戏类：通常是全屏独立进程（如 Steam 游戏），扩展无法感知 → 需走窗口进程名 + Win32 EnumWindows / macOS NSWorkspace 路径
- 两套 VLM 的"激活条件"完全不同源，建议在桌宠侧抽象为 `ContextDetector` 接口，扩展 / UIA / 进程枚举各实现一个 provider

## 7. 风险 / 长期跟踪

| 风险 | 影响 | 缓解 |
|---|---|---|
| Manifest V3 service worker 5 分钟 idle 终止 | 桌宠收不到 tab 事件 | 用 `chrome.runtime.connectNative()` 长连接保活；测试 Chrome ≥113 的 Windows Native Host 行为变更 |
| Firefox AMO 政策禁 URL 抓取 | 商店版扩展失效 | 走"自分发签名扩展"+ 引导侧载（用户体验差），或暂不支持 Firefox |
| 国产浏览器（360 / QQ / 搜狗）IE 兼容模式 | UIA 路径完全失效；扩展可能被拦截 | 检测内核模式后降级到窗口标题 |
| UIA 跨进程性能 | 影响桌宠流畅度 | 缓存 `AutomationElement`，仅在窗口焦点切换时重查；避免全局 listener |
| Safari Web Extension 站点级二次授权 | 用户每次访问新视频站要点确认 | 申请 `<all_urls>` `optional_permissions`，首次启动主动 prompt |
| Manifest V3 MV2 deprecation 节奏 | 现有 MV2 扩展逐步失效 | 直接按 MV3 起步 |
| 国产浏览器对 chrome.tabs 支持现状 | 推测大部分兼容，无一级文档背书 | 上线后做兼容性灰度，标"Beta 支持国产浏览器" |
| a11y 树查询性能 | 与 Power Automate 案例同源，存在拖垮系统风险 | 桌宠默认不订阅全局 UIA 事件 |

## 8. 参考链接

### 8.1 一级源
- [Apple — AXUIElement](https://developer.apple.com/documentation/applicationservices/axuielement)
- [Apple — Safari App Extensions](https://developer.apple.com/documentation/safariservices/safari-app-extensions)
- [Apple — Safari Web Extension tabs.query 行为](https://developer.apple.com/forums/thread/660646)
- [Chrome — chrome.tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs)
- [Chrome — activeTab 权限](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab)
- [Chrome — Native Messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)
- [Chrome — Service Worker Lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Microsoft — UI Automation 性能问题](https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-understandingperformanceissues)
- [Microsoft — UI Automation Threading](https://learn.microsoft.com/en-us/dotnet/framework/ui-automation/ui-automation-threading-issues)
- [Microsoft — Edge 安装应用标题控制](https://blogs.windows.com/msedgedev/2025/02/05/control-your-installed-web-application-title/)
- [MDN — WebExtensions tabs API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs)
- [MDN — WebExtensions permissions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions)
- [MDN — Native Messaging](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging)
- [Arc — Developer Mode](https://resources.arc.net/hc/en-us/articles/20468488031511-Developer-Mode-Instant-Dev-Tools)

### 8.2 二级源
- [ActivityWatch — aw-watcher-web](https://github.com/ActivityWatch/aw-watcher-web)
- [ActivityWatch — Firefox URL Mozilla 政策限制 Issue](https://github.com/ActivityWatch/activitywatch/issues/1036)
- [ActivityWatch — aw-watcher-window](https://github.com/ActivityWatch/aw-watcher-window)
- [Swift macOS 通过 AX 拿浏览器 URL 实践](https://medium.com/@itsuki.enjoy/swift-macos-get-browser-opened-tab-url-2-ways-e6722fb5998d)
- [Blue Prism — Chrome / Edge UIA 自动化指南](https://documentation.blueprism.com/bp-6-10/en-us/Guides/chrome-firefox/chrome-firefox-uia.htm)
- [Chromium Issue 382525581 — macOS AXWindow 主窗口](https://issues.chromium.org/issues/382525581)
- [Chromium 扩展组 — Chrome 100 native messaging 保活](https://github.com/GoogleChrome/developer.chrome.com/issues/2688)
- [Improving Native Message Host Reliability on Windows](https://textslashplain.com/2023/03/16/improving-native-message-host-reliability-on-windows/)
- [Power Automate 全局 UIA listener 拖垮系统](https://gist.github.com/Skydev0h/3a8c08b148a38e8d270c02b563130ff6)
- [scriptingosx — 避免 AppleScript TCC 弹窗](https://scriptingosx.com/2020/09/avoiding-applescript-security-and-privacy-requests/)
- [pywinauto — Edge Canary Address bar 兼容 Issue](https://github.com/pywinauto/pywinauto/issues/980)
- [RescueTime — macOS 网站跟踪启用文档](https://help.rescuetime.com/article/257-enabling-website-tracking-on-macos)
- [hangwin / mcp-chrome](https://github.com/hangwin/mcp-chrome)
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)

### 8.3 三级源
- [chromium-extensions Google Group — 360 Secure Browser 兼容性](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/dwL74_aS55M)
- [Sogou 浏览器扩展介绍](https://siit.co/guestposts/comprehensive-review-of-sogou-browser-features-performance-and-user-experience/)
- 360 / QQ / 搜狗 IE 兼容核细节：未找到一级源

## 9. 事实 / 观点 / 推测分层标注

### 9.1 事实（有一级或权威二级源 URL 佐证）
- macOS AX + Apple Events 需要 TCC 双授权
- Chrome 需 `--force-renderer-accessibility` 才暴露完整 a11y 树给外部 UIA
- `activeTab` 不触发"读取浏览数据"权限警告
- ActivityWatch 商店版 Firefox 扩展因 Mozilla 政策无法抓 URL
- MV3 service worker 默认 30s idle 终止，Native Messaging 连接可延长但 Windows 上历史存在 5 min 截断
- UIA 跨进程同步调用慢，全局 listener 已记录拖垮系统响应
- Safari Web Extension `tabs.query` 仅返回已授权站点
- 360 安全浏览器双内核（Chromium + IE），扩展行为差异巨大

### 9.2 观点（行业普遍判断）
- "浏览器扩展 + Native Messaging"是 ActivityWatch / RescueTime / Rize 共同选择的合规路径，是 2026 年事实标准
- UIA 在 Chromium 上稳定性弱于扩展路径，不应作首选

### 9.3 推测（无一级源，但合理外推）
- QQ 浏览器、UC、Edge 国内版的 chrome.tabs API 兼容情况"推测大部分可用"，需上线后灰度验证
- 国产浏览器 IE 兼容核 tab 无法被 UIA 读出（基于 360 文档外推）
- 搜狗高速浏览器扩展中心非 100% Chrome API 兼容

---

## 10. 关键结论

MVP 走"浏览器扩展 + Native Messaging"是合规、跨平台、用户体验最好的路径；macOS AppleScript 与 Windows UIA 仅作 fallback。所有方案都能做到"只识别 tab 身份，不读取页面内容"，符合 PM 立场。视频类 VLM 与游戏类 VLM 的 Context Provider 应在桌宠侧解耦。

## 11. 给 Engineering Build Thread 的接续建议

1. **Context Provider 抽象**：在桌宠侧抽象 `ContextDetector` 接口，扩展 / UIA / 进程枚举各实现一个 provider；视频类 VLM 与游戏类 VLM 各订阅各自的 provider。
2. **扩展 Manifest V3 起步**：直接按 MV3 起步，不要做 MV2 兼容层；service worker 用 Native Messaging 长连接保活。
3. **数据流约束**：扩展 → Native Host 仅传 `{type, host, active}`，**不传完整 URL / title**；桌宠主进程只对白名单 hostname 反应。
4. **Onboarding 双路径**：默认引导扩展安装；用户拒绝时降级到 AppleScript（macOS）/ UIA（Windows）fallback，并明确告知用户性能 / 隐私权衡。
5. **国产浏览器灰度**：360 / QQ / 搜狗等国产浏览器先做白名单上线，标"Beta 支持"，按真实使用数据再扩展。
