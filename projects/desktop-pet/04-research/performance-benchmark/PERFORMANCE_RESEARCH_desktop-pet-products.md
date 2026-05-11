# 桌宠性能占用调研

> 最后更新：2026-05-08
> 线程：AI Trend Radar Thread
> 范围：PC 和移动端桌宠 / AI 伴侣产品，重点关注运行时 CPU、GPU、内存占用、体验影响与可复现实测方法。
> 状态：公开证据调研 + 基准测试协议已完成。直接运行时实测尚未完成，因为当前环境未安装目标应用，也缺少移动端性能分析工具和设备。

## 1. 研究问题

桌宠类产品在 PC 和移动端的性能占用、体验代价和测试方法是什么？如果要为 `desktop-pet` 做 MVP，应该如何制定 CPU / GPU / 内存预算，并如何实测竞品运行时占用？

## 2. 当前测试状态

| 项目 | 状态 | 说明 |
|----|----|----|
| 公开来源调研 | 已完成 | 已查官方产品页、Steam、GitHub、官方文档、Apple / Android / Microsoft 性能文档。 |
| 本机桌面端运行时实测 | 未执行 | 本机 `/Applications` 未发现 Desktop Mate、VPet、CielChan、Clawster、Hiora、Desk-Buddy、AIRI、UPochi、Dockling、Shimeji 等目标样本。未下载、未安装、未运行第三方应用。 |
| Android 运行时实测 | 阻塞 | 本机未安装 `adb`，且没有已连接 Android 测试机。 |
| iOS 运行时实测 | 阻塞 | 本机 `xctrace` 不可用，且没有已连接 iPhone 测试机。 |
| 本地基准测试主机 | 后续 Mac 实测可用 | 可作为 Mac 高配样本：Apple Silicon MacBook Pro，24 GB 统一内存，16-core GPU。未记录序列号 / UUID。 |

配套模板：`PERFORMANCE_BENCHMARK_TEMPLATE_desktop-pet-products.csv` 已提供下方 P0 / P1 场景的空白行，目前不包含任何实测数值。

配套学习文档：`PERFORMANCE_METRICS_BEGINNER_GUIDE.md` 解释 CPU、GPU、内存、FPS、网络、能耗、体验、权限、置信度等指标的含义和判断方法，源文件按 GFM Markdown 表格维护。

## 3. 来源策略

优先级：官方产品页 / Steam / GitHub / 官方文档 > App Store / Google Play > 社区评论。社区评论只作为体验信号，不作为 CPU / GPU / 内存事实来源。

| 来源 | 来源类型 | 可信度 | 使用目的 |
|----|----|---:|----|
| [Desktop Mate Steam](https://store.steampowered.com/app/3301060/Desktop_Mate/) | Steam 官方页 | 高 | 3D 桌面角色平台、系统要求、GPU 要求、DLC 生态 |
| [VPet-Simulator Steam](https://store.steampowered.com/app/1920960/VPetSimulator/) | Steam 官方页 | 高 | 低资源 2D 桌宠、开源、创意工坊、系统要求 |
| [Ai Vpet Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) | Steam 官方页 | 高 | AI + Live2D 桌宠、系统要求、网络依赖 |
| [CielChan](https://phasma.ai/) | 官方产品页 | 高 | 优先离线的 AI 桌面伴侣、语音 / 记忆 / VRM / 本地视觉、系统要求 |
| [Clawster](https://clawster.pet/) | 官方产品页 | 高 | 感知屏幕的 AI 桌宠、OpenClaw 网关、截图问答 |
| [UPochi](https://www.upochi.com/) | 官方产品页 | 高 | 低内存声明、离线模式、LLM 增强桌宠、好友房间 |
| [Dockling](https://dockling.space/) | 官方产品页 | 高 | 原生 Mac 应用、非 Electron、本地笔记 / 设置、照片转像素桌宠 |
| [Desk-Buddy](https://www.desk-buddy.fun/) | 官方产品页 | 高 | VRM 桌面伴侣、AI 提供方 / 本地模型、省电模式 |
| [Hiora](https://hiora.app/) | 官方产品页 | 高 | OpenClaw 3D 头像层、实时语音、窗口置顶 |
| [Open LLM Vtuber 文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) / [GitHub](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) | 官方文档 / GitHub | 高 | Electron 桌宠模式、Live2D、语音、本地 / 云端后端 |
| [AIRI GitHub](https://github.com/moeru-ai/airi) | GitHub | 高 | Tauri 桌面端、WebGPU / 本地推理、VRM / Live2D、游戏集成 |
| [Desktop Goose itch.io](https://samperson.itch.io/desktop-goose) | 官方 itch 页面 | 中高 | 传统桌宠、下载体积、Windows/macOS 支持、模组能力 |
| [Shijima-Qt GitHub](https://github.com/pixelomer/Shijima-Qt) / [itch.io](https://pixelomer.itch.io/shijima) | GitHub / itch | 高 | Qt6 shimeji 桌面运行器、跨平台、已归档风险 |
| [Replika App Store](https://apps.apple.com/us/app/replika-ai-friend/id1158555867) | App Store | 高 | 移动端 AI 伴侣体积 / 平台 / 语音 / 视频 / 头像功能 |
| [Character.AI App Store](https://apps.apple.com/us/app/character-ai-chat-talk-text/id1671705818) / [语音 FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) | App Store / 官方帮助中心 | 高 | 移动端文本 + 通话 + 语音功能 |
| [Kindroid 记忆文档](https://kindroid.ai/docs/article/memory/) / [语音文档](https://docs.kindroid.ai/voice-calls-and-video-calls) | 官方文档 | 高 | 记忆 / 语音 / 视频交互 |
| [Nomi Wiki](https://wiki.nomi.ai/) | 官方 wiki | 高 | 记忆 / 语音 / 伴侣功能分类 |
| [Paradot App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) | App Store | 高 | 仅 iOS 的伴侣应用、应用体积、Voice 2.0 / 自拍模型版本信号 |
| [Apple 活动监视器指南](https://support.apple.com/en-us/HT201464) / [Apple 性能与指标](https://developer.apple.com/documentation/xcode/performance-and-metrics) | 官方文档 | 高 | macOS / iOS CPU、内存、GPU、能耗测量方法 |
| [Microsoft 性能监视器](https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-performance-problems-in-windows) / [typeperf](https://learn.microsoft.com/en-ie/windows-server/administration/windows-commands/typeperf) / [DirectX GPU 任务管理器](https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/) | 官方文档 | 高 | Windows CPU、内存、GPU 计数器 |
| [Android dumpsys](https://developer.android.com/tools/dumpsys) / [Android Studio 性能分析器](https://developer.android.com/studio/profile/) | 官方文档 | 高 | Android CPU、内存、图形、能耗性能分析 |

## 4. 关键发现

| 发现 | 类型 | 置信度 | 证据 |
|----|----|---:|----|
| 公开资料通常只给系统要求、平台支持或营销性“低内存 / 小体积”，很少给运行时 CPU / GPU / RAM 数字。要回答“每个产品运行时占用量”，必须做受控实测。 | 事实 | 高 | Steam / 官方页面大多展示系统要求，而不是实时性能计数器。 |
| 性能风险主要来自 4 个维度：渲染层、语音链路、屏幕 / 音频感知、本地 AI 推理。仅做 2D 空闲桌宠通常风险最低；3D / Live2D / Electron / 本地模型会显著提高预算。 | 分析 | 高 | Desktop Mate 的 GPU 要求、Open LLM Vtuber 的 Electron + 语音链路、AIRI 的 WebGPU / 本地推理、CielChan 的本地模型 / VRM / 视觉。 |
| 对游戏场景而言，平均占用不是唯一指标；更重要的是全屏游戏期间的 FPS 下降、输入抢占、GPU 内存压力、WindowServer / DWM 合成负担。 | 分析 | 高 | 覆盖层产品会与游戏和桌面合成器同时运行；Windows GPU 计数器与 Desktop Mate 系统要求支持这一风险判断。 |
| 移动端 AI 伴侣多数把推理放在云端，移动设备主要承受 UI、头像、语音通话、视频 / 屏幕共享、图片上传 / 下载、网络和后台恢复成本。 | 分析 | 中高 | Replika、Character.AI、Kindroid、Paradot 来源展示了文本 / 语音 / 视频 / 头像功能，但未声称本地模型运行时占用。 |
| `desktop-pet` MVP 应把“性能与隐私”作为 P0 信任功能：默认低资源模式，AI / 语音 / 视觉 / 本地模型都应是显式开启的高资源模式。 | 建议 | 高 | 项目上下文要求游戏玩家低打扰、低资源；市场样本显示性能风险会随模态增加。 |

### 4.1 竞品性能指标对比总表

> 说明：下表整理的是公开来源中的硬件门槛、包体 / 存储信号和运行时风险，不是实测 CPU / GPU / 内存结果。所有“运行时实测”仍需在授权安装和真实设备上采样。

| 产品 | 平台 | 主要性能因子 | 公开 CPU 指标 | 公开内存指标 | 公开 GPU / 图形指标 | 包体 / 存储指标 | 运行时 CPU / GPU / 内存 | 风险估计 | 测试优先级 |
|----|----|----|----|----|----|----|----|----|----|
| Desktop Mate | Windows | 3D 桌面角色、DLC 角色、单角色显示需要 GPU | 最低 i5-8250U / Ryzen 3 3300U；推荐 i5-11400 / Ryzen 5 3600 | 最低 8 GB；推荐 16 GB | 最低 UHD 730 / Vega 8；推荐 GTX 750 / RX550 / Iris Xe / Vega 11 | 未公开 | 待实测 | 中高 | P0 |
| VPet-Simulator | Windows | 2D 桌宠、开源、创意工坊、低资源参考 | 2-core CPU | 最低 200 MB；推荐 500 MB | Iris 或更高 | 未公开 | 待实测 | 低 | P0 |
| Ai Vpet | Windows | AI 桌宠、Live2D、文本 + 语音、网络依赖 | 最低 Intel i3；推荐 Intel i7 | 最低 1 GB；推荐 2 GB | 最低 HD Graphics 4000；推荐 GTX 660 / AMD HD7870 2 GB VRAM | 5 GB 存储 | 待实测 | 中 | P0 |
| CielChan | Windows | 优先离线 AI、本地模型、VRM、语音、视觉 | 未公开 | 最低 4 GB；推荐 8-16 GB | 支持集成显卡 | 25 GB 存储 | 待实测 | 空闲中等；本地 AI / 视觉 / 音频高 | P0 |
| Clawster | macOS | 感知屏幕、OpenClaw 网关、截图问答 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 中高 | P0 |
| UPochi | macOS / Windows | LLM 增强、好友房间、离线模式、低内存声明 | 未公开 | 未公开；官方有低内存声明 | 未公开 | 未公开 | 待实测 | 低到中 | P0 |
| Dockling | macOS | 原生 Mac 应用、像素桌宠、非 Electron、本地笔记 / 设置 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 低 | P0 |
| Desk-Buddy | Windows / macOS | VRM AI 伴侣、语音、本地模型路径、省电模式 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 中高 | P1 |
| Hiora | macOS / Windows | OpenClaw 3D 头像层、实时语音、口型同步 | 未公开 | 未公开；官方有小体积表述 | 未公开 | 未公开 | 待实测 | 中 | P1 |
| Open LLM Vtuber | Web / 桌面端 | Electron 桌宠模式、Live2D、语音、本地 / 云端后端 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 高波动 | P0 |
| AIRI | Web / macOS / Windows | Tauri 桌面端、WebGPU、本地推理、VRM / Live2D、游戏集成 | 未公开 | 未公开 | WebGPU / 本地推理相关 | 未公开 | 待实测 | 高波动 | P1/P2 |
| Desktop Goose | Windows / macOS | 传统桌宠、干扰式互动、模组能力 | 未公开 | 未公开 | 未公开 | Mac 构建包 14 MB；Windows 构建包 4.1 MB | 待实测 | 低到中 | P1 |
| Shijima-Qt | macOS / Linux / Windows | Qt6 shimeji 桌面运行器、跨平台、项目已归档 | 未公开 | 未公开 | 未公开 | itch 包体 36-101 MB | 待实测 | 中 | P2 |
| Replika | iOS / Android / Mac / Vision | 移动端 AI 伴侣、语音通话、视频、头像、图片生成 | 未公开 | 未公开 | 未公开 | iOS 应用体积 406.1 MB | 待实测 | 中高 | P1 |
| Character.AI | iOS / Android | 文本聊天、实时 AI 通话、角色创建、语音创建 | 未公开 | 未公开 | 未公开 | iOS 应用体积 186.8 MB | 待实测 | 中 | P1 |
| Kindroid | iOS / Android / Web | 记忆、语音通话、视频通话 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 中高 | P2 |
| Nomi | iOS / Android / Web | 记忆、语音、伴侣互动 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 中 | P2 |
| Paradot | iOS | AIGC 头像、新闻 / 天气、Voice 2.0、自拍模型 | 未公开 | 未公开 | 未公开 | iOS 应用体积 108.6 MB | 待实测 | 中 | P1 |
| Talkie | iOS / Android / Web | AI 角色生态、文本 / 语音、角色生成 | 未公开 | 未公开 | 未公开 | 未公开 | 待实测 | 中 | P2 |

## 5. `desktop-pet` MVP 建议性能预算

> 这是面向 desktop-pet 的内部目标，不是竞品平均值。真实阈值需要在低配 Windows + 主流游戏场景里校准。

| 模式 | CPU 目标 | GPU 目标 | 内存目标 | 游戏影响目标 | 说明 |
|----|---:|---:|---:|---:|----|
| 2D / sprite 空闲桌宠 | 平均 <= 1%，p95 <= 3% | 平均 <= 2% | <= 250 MB | FPS 下降 <= 1% | 默认模式；FPS 上限 15-30；无 AI 请求；无麦克风。 |
| 3D / Live2D 空闲桌宠 | 平均 <= 2%，p95 <= 5% | 平均 <= 5% | <= 400 MB | FPS 下降 <= 2% | 可作为 P1；需要低功耗动画与隐藏策略。 |
| 交互 / 动画突发 | 平均 <= 3%，p95 <= 8% | 平均 <= 8% | <= 450 MB | 无输入卡顿 | 点击、拖拽、动作、窗口停靠。 |
| 远程 LLM 文本聊天 | 平均 <= 5%，p95 <= 15% | <= 5% | <= 600 MB | 除网络面板外不产生额外 FPS 下降 | 推理在云端；本机只负责 UI、网络、可选 TTS。 |
| 语音模式 | 平均 <= 10%，p95 <= 30% | <= 8% | <= 800 MB | 不冲突游戏音频 | ASR / VAD / TTS / lip sync 会拉高占用；建议 P1。 |
| 单次截图 / 视觉 | 允许短时突发 | 允许短时突发 | <= 900 MB | 必须由用户主动触发 | 只允许用户主动截图；默认不持续监听。 |
| 本地 LLM / 本地视觉 | 独立高资源模式 | 按模型制定 GPU / 内存预算 | 依赖模型 | 默认不兼容竞技游戏场景 | 必须显式标记为高资源 / 离线 AI 模式。 |

## 6. PC 产品性能矩阵

| 产品 | 平台 / 技术栈信号 | 公开 CPU / RAM / GPU 证据 | 运行时风险估计 | 体验性能说明 | 测试优先级 |
|----|----|----|----|----|----|
| Desktop Mate | Windows、3D 桌面角色平台、DLC 角色 | 最低要求：i5-8250U / Ryzen 3 3300U，8 GB RAM，UHD 730 / Vega 8。推荐要求：i5-11400 / Ryzen 5 3600，16 GB RAM，GTX 750 / RX550 / Iris Xe / Vega 11。单角色显示需要 GPU 或集成 GPU。 | 中高 | 3D 品质和授权角色很强，但它给“桌宠”设了较高性能基线。多角色或更高设置可能进一步增加负载。 | P0：3D 角色成本基准测试 |
| VPet-Simulator | Windows 2D 桌宠、开源、Steam 创意工坊 | 最低要求：2-core CPU，200 MB RAM，Iris 或更高。推荐要求：2-core CPU，500 MB RAM。 | 低 | 很适合作为空闲桌宠、照顾循环、创意工坊、模组能力的低资源参考，也是“轻量”体验的基线。 | P0：低资源基线基准测试 |
| Ai Vpet | Windows AI 桌宠、Live2D、文本 + 语音、LLM 内容 | 最低要求：Intel i3，1 GB RAM，HD Graphics 4000，DirectX 11，宽带网络，5 GB 存储。推荐要求：Intel i7，2 GB RAM，GTX 660 / AMD HD7870 2 GB VRAM。 | 中 | AI + Live2D + 语音的成本高于传统桌宠。由于依赖网络，本机 CPU 可能中等，但体验取决于延迟。 | P0：AI + Live2D 基准测试 |
| CielChan | Windows 优先离线 AI 伴侣、本地模型、VRM、语音、视觉 | Windows 10/11；4 GB RAM 最低，8-16 GB 推荐，25 GB 存储，支持集成显卡。 | 开启本地 AI / 视觉 / 音频时高；空闲时中等 | 功能丰富度很高，但本地模型、VRM、音频监听、截图视觉和记忆需要分开预算。 | P0：授权安装后基准测试 |
| Clawster | macOS 感知屏幕的桌宠、本地 OpenClaw 网关、截图问答 | 未找到公开数值要求。官方页面称它知道当前应用、支持截图提问，并使用本地 OpenClaw 网关。 | 中高 | 屏幕感知和网关会带来隐私与资源成本。需要把桌宠空闲与网关 + 模型 / 提供方分开测。 | P0：屏幕感知桌宠基准测试 |
| UPochi | macOS / Windows 桌宠、LLM 增强、好友房间、离线模式 | 未找到公开数值要求。官方页面称无广告、无追踪、离线模式、低内存。 | 低到中 | 公开“低内存”声明需要实测验证。适合作为轻量温暖桌宠 + 社交房间 + LLM 聊天参考。 | P0：低内存声明基准测试 |
| Dockling | 原生 Mac AppKit / Cocoa 像素桌宠、非 Electron、本地笔记 / 设置 | macOS 13+，针对 Apple Silicon 优化。官方页面称原生应用、无 Electron 包装、无账号、本地数据。 | 低 | 可作为原生低开销设计参考。图片生成使用 AI 服务，但运行时桌宠若控制动画帧数，应较轻。 | P0：原生 Mac 桌宠基准测试 |
| Desk-Buddy | Windows / macOS VRM AI 伴侣、OpenAI / Claude / 本地模型 | 未找到公开数值要求。官方 FAQ 称已做性能优化，且可配置省电模式。 | 中高 | VRM 3D + 语音 + 本地提供方路径需要按场景拆测：只测渲染器、连接 AI、开启语音。 | P1 基准测试 |
| Hiora | macOS / Windows 的 OpenClaw 3D 头像层、实时语音、口型同步 | 未找到公开数值要求。官方页面称小体积和“无延迟”，但属于营销表述，需要实测验证。 | 中 | 更像头像层，不是完整桌宠。应把 UI + 头像与 OpenClaw 后端分开测。 | P1 基准测试 |
| Open LLM Vtuber | Web / Electron 桌面客户端 / 桌宠模式、Live2D、语音、本地 / 云端后端 | 未找到单一系统要求。文档说明 Window Mode 基于 Electron；GitHub 列出多种 LLM / ASR / TTS 后端与桌宠模式。 | 高波动 | 很适合作为开源架构参考。Electron + Live2D 空闲可能可接受；本地 ASR / TTS / LLM 可能成为主要负载。 | P0：架构基准测试 |
| AIRI | Web / macOS / Windows、Tauri 桌面端、移动端阶段、VRM / Live2D、WebGPU、本地推理、游戏集成 | 未找到稳定应用要求。GitHub 列出浏览器内 WebGPU 本地推理、DuckDB WASM 内存、VRM / Live2D、游戏集成、移动端阶段。 | 高波动 | 是面向未来的本地 / 自托管伴侣参考，但本地推理和游戏集成不适合作为默认低资源基线。 | P1/P2：高级能力基准测试 |
| Desktop Goose | Windows / macOS 传统桌宠 | itch 页面列出 Windows 和 macOS，Mac 构建包 14 MB，Windows 构建包 4.1 MB。未找到 CPU / RAM / GPU 要求。 | 低到中 | 适合研究干扰式物理互动和模组能力。需要测输入干扰、桌面杂乱，而不只是 CPU。 | P1：UX 压力基准测试 |
| Shijima-Qt | Qt6 shimeji 桌面运行器、macOS / Linux / Windows、已归档 | GitHub 说明项目已归档，且 Qt 不是合适框架；最新稳定版本为 v0.1.0；itch 包体为 36-101 MB。 | 中 | 可作为警示案例：框架选择和窗口追踪技巧会带来维护和性能风险。 | P2 |

## 7. 移动端产品性能矩阵

| 产品 | 平台 / 功能信号 | 公开性能证据 | 运行时风险估计 | 测试方式 |
|----|----|----|----|----|
| Replika | iOS / Android / Mac / Vision；文本、语音通话、视频、头像自定义、联网能力、图片生成；iOS 应用体积 406.1 MB。 | 未找到公开 CPU / GPU / RAM 运行时数值。 | 中高 | 测聊天页空闲、头像自定义、语音通话、视频通话、图片生成；采集 CPU / 内存 / 能耗 / 发热。 |
| Character.AI | iPhone 应用；文本、实时 AI 通话、角色创建、语音创建；iOS 应用体积 186.8 MB。 | 未找到公开 CPU / GPU / RAM 运行时数值。 | 中 | 测文本聊天滚动、通话模式、角色发现流；若允许则测语音创建。 |
| Kindroid | 移动端 / Web 伴侣，包含记忆、语音通话、视频通话。 | 未找到公开 CPU / GPU / RAM 运行时数值。 | 中高 | 测文本聊天、长记忆召回、语音通话；若可用则测视频 / 屏幕共享。 |
| Nomi | 移动端 / Web 伴侣，官方 wiki 有记忆和语音分类。 | 未找到公开 CPU / GPU / RAM 运行时数值。 | 中 | 测文本聊天、语音、图片 / 自拍流程。 |
| Paradot | 仅 iPhone 上架；iOS 应用体积 108.6 MB；AIGC 头像、新闻 / 天气、Voice 2.0 测试、自拍模型更新。 | 未找到公开 CPU / GPU / RAM 运行时数值。 | 中 | 测新用户引导、聊天、头像生成、语音、组件。 |
| Talkie | 移动端 / Web AI 角色生态，包含文本 / 语音与角色生成。 | 本轮未找到公开 CPU / GPU / RAM 运行时数值。 | 中 | 测角色搜索流、文本聊天、语音聊天、角色创建。 |

## 8. 标准基准测试协议

### 8.1 测试环境

| 环境 | 所需设备 | 原因 |
|----|----|----|
| Windows 中低配 PC | Windows 10/11、集成 GPU、8 GB RAM | 代表常见办公 / 轻度游戏机器，也是最低目标样本。 |
| Windows 游戏 PC | Windows 11、独立 GPU、16-32 GB RAM | 测量游戏运行时的 FPS / GPU 内存影响。 |
| Mac Apple Silicon | macOS 13+、Apple Silicon、16-24 GB RAM | 测原生 Mac、Electron、Tauri、AppKit 桌宠行为。 |
| Android 中端机 | 真实 Android 手机、Android 13+、启用 `adb` | Android 最适合通过 `dumpsys` 做竞品应用性能分析。 |
| iPhone | 真实 iPhone、iOS 17+、可使用 Xcode Instruments | 用于采集 iOS 能耗 / 内存 / 发热信号；第三方竞品应用的精度可能低于 Android。 |

### 8.2 每个产品的测试场景

| 场景 | 时长 | 指标 |
|----|---:|----|
| 冷启动 | 60s | 启动时间、峰值 CPU、峰值内存、磁盘 / 网络突发 |
| 可见空闲 | 10 min | CPU 平均 / p95、GPU 平均 / p95、内存平台期、唤醒次数、能耗 |
| 隐藏 / 安静空闲 | 10 min | 后台 CPU、保留内存、托盘 / 菜单进程行为 |
| 拖拽 / 点击 / hover 交互 | 5 min 脚本化 | 动画 CPU / GPU 突发、输入延迟、窗口焦点问题 |
| AI 文本聊天 | 10 条提示词 | CPU / 内存 / 网络、响应延迟、UI 卡顿 |
| 语音聊天 | 5 min | CPU、内存、音频设备占用、TTS / ASR 延迟、能耗 |
| 截图 / 视觉 | 5 次采集 | 峰值 CPU / GPU / 内存、权限体验、隐私预览 |
| 全屏游戏覆盖层 | 15 min | 游戏 FPS 变化、GPU 引擎占用、VRAM / 共享内存、输入冲突 |
| 长时间稳定性测试 | 2 hours | 内存泄漏、CPU 漂移、句柄 / 线程增长、崩溃 / 恢复 |

### 8.3 Windows 命令

```powershell
# 启动目标应用后识别进程名
Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name,Id,CPU,WorkingSet,PrivateMemorySize

# 每秒采集一次进程 CPU / 内存
typeperf "\Process(<process_name>)\% Processor Time" "\Process(<process_name>)\Working Set - Private" "\Process(<process_name>)\Private Bytes" -si 1 -sc 600 -o desktop-pet-process.csv

# GPU 利用率和 GPU 内存计数器会随驱动 / 进程名变化。
# 先用 Performance Monitor / Task Manager 确认，再追加：
typeperf "\GPU Engine(*)\Utilization Percentage" "\GPU Process Memory(*)\Dedicated Usage" "\GPU Process Memory(*)\Shared Usage" -si 1 -sc 600 -o desktop-pet-gpu.csv
```

### 8.4 macOS 命令

```bash
# 先手动启动目标应用，再识别进程。
pgrep -lf "AppName"

# 每秒采集 CPU 和常驻内存。
PID="<pid>"
while true; do
  date '+%Y-%m-%d %H:%M:%S'
  ps -p "$PID" -o pid,ppid,%cpu,rss,vsz,etime,command
  sleep 1
done | tee desktop-pet-macos-process.log

# GPU / task sampler。需要 sudo，且不同 macOS 版本可能有差异。
sudo powermetrics --samplers tasks --show-process-gpu -i 1000 -n 600 > desktop-pet-macos-powermetrics.txt
```

图形界面验证时，建议同时使用 Activity Monitor 的 CPU / 内存 / 能耗 / GPU 面板和屏幕录制。

### 8.5 Android 命令

```bash
# 前提：已安装 adb、设备已连接、已知 package name。
adb devices
adb shell am force-stop <package.name>
adb shell monkey -p <package.name> 1

# 单点内存快照。
adb shell dumpsys meminfo -d <package.name> > meminfo.txt

# 可用时采集帧统计 / UI 卡顿。
adb shell dumpsys gfxinfo <package.name> framestats > gfxinfo-framestats.txt

# 系统 CPU 快照；需要长时间采样时可由宿主机每秒重复执行。
adb shell top -b -n 1 | grep <package.name>

# 更长时间的电池 / CPU 归因。
adb shell dumpsys batterystats --reset
# 手动运行目标场景。
adb shell dumpsys batterystats > batterystats-after-scenario.txt
```

### 8.6 iOS 命令 / 工具

```bash
# 需要 Xcode command line tools 和已连接设备。
xcrun xctrace list devices

# 对可通过 bundle identifier 指定的应用使用。
xcrun xctrace record --template "Time Profiler" --device <device-udid> --target <bundle-id> --time-limit 600s --output desktop-pet-ios-time.trace
```

使用 Xcode Instruments 模板：Time Profiler、Allocations、Energy Diagnostics、System Trace。对第三方 App Store 竞品，iOS 可能限制深度插桩；此时只记录设备级能耗 / 发热 / 内存压力，并把数值标为近似。

## 9. 产品测试优先级

| 优先级 | 产品 | 目的 |
|----|----|----|
| P0 | VPet-Simulator, Desktop Mate, Ai Vpet, CielChan, Clawster, UPochi, Dockling, Open LLM Vtuber | 覆盖低资源 2D、高质量 3D、AI + Live2D、离线 AI、屏幕感知桌宠、低内存声明、原生 Mac、开源架构。 |
| P1 | Desk-Buddy, Hiora, AIRI, Desktop Goose, Replika, Character.AI, Paradot | 覆盖 VRM 头像、OpenClaw 头像层、本地推理、干扰式桌宠 UX、移动端伴侣基线。 |
| P2 | Shijima-Qt, Nomi, Kindroid, Talkie 和长尾移动端应用 | 用于边界案例；在 P0/P1 预算明确前优先级较低。 |

## 10. 风险与解读规则

| 风险 | 为什么重要 | 缓解方式 |
|----|----|----|
| 公开系统要求不等于运行时占用 | Steam 系统要求无法说明空闲 CPU 或真实 GPU 负载。 | 只把它当作硬件门槛，不作为实测运行时数据。 |
| AI 提供方路径会改变 CPU 曲线 | 云端 LLM 会降低本地 CPU；本地模型会把负载转移到 CPU / GPU / RAM。 | 按提供方拆分测试：云端 / 本地 / 无 AI。 |
| 语音和视觉会主导资源突发 | ASR、TTS、口型同步、截图 / 视觉可能远高于空闲桌宠成本。 | 独立测试每个功能开关。 |
| 覆盖层即使低 CPU 也可能影响游戏 | GPU 内存、合成器、窗口焦点和输入 hook 可能降低 FPS 或造成体感卡顿。 | 纳入全屏游戏覆盖层测试，并记录输入冲突。 |
| 移动端第三方应用性能分析受限 | iOS 不一定能深度分析竞品应用。 | 优先用 Android 做精确竞品采样；iOS 使用能耗 / 发热近似。 |
| 运行第三方应用有安全 / 隐私风险 | 桌宠可能请求屏幕、麦克风、辅助功能、本地文件、网络。 | 使用一次性账号、不使用真实数据、优先测试机 / VM，不写入密钥。 |

## 11. 给 PM / Engineering 的问题

| 问题 | 负责人 | 原因 |
|----|----|----|
| MVP 目标预算应是“超轻量 2D 桌宠”，还是“在固定 FPS 下降以下可接受 3D / Live2D 伴侣”？ | PM + Engineering | 决定渲染器和资产管线。 |
| 语音是否进入 MVP，还是作为 P1，并放在明确的高资源 / 隐私选择开启后？ | PM | 语音会带来明显成本和隐私跃迁。 |
| 是否必须做本地 AI，还是 MVP 默认云端 / 远程 LLM，后续再加本地兜底？ | PM + Engineering | 本地 AI 会显著改变 GPU / RAM 预算。 |
| 哪个游戏基准测试最能代表目标玩家的性能敏感度？ | PM + Engineering | 需要一个低配场景和一个主流游戏场景。 |
| 性能预算是否应成为开发者 SDK 契约的一部分？ | Engineering | 游戏团队需要可预测的接入成本。 |

## 12. 推荐下一步

| 行动 | 工作区 | 优先级 | 所需输入 |
|----|----|----|----|
| 确认 P0 基准测试样本列表，以及是否允许下载 / 安装 / 运行。 | Main + User | P0 | 用户批准第三方应用安装 / 运行范围和目标测试机。 |
| 基于空白 CSV 模板和评分规则建立 PC 基准测试表。 | AI Trend Radar / Engineering | P0 | 产品列表、OS 目标、基准测试硬件。 |
| 优先执行 Windows P0 基准测试：VPet-Simulator、Desktop Mate、Ai Vpet、CielChan。 | Engineering Build Thread | P0 | Windows 测试机、Steam / installer 访问权限、不使用真实凭据。 |
| 执行 Mac 基准测试：Clawster、UPochi、Dockling、Open LLM Vtuber。 | Engineering Build Thread | P0 | Mac 测试机、安装授权。 |
| 先做 Android 移动端伴侣基准测试，再做 iOS。 | Engineering Build Thread | P1 | Android 手机、`adb`、package name、一次性账号。 |
| 将性能预算输入 PM 需求澄清。 | PM Strategy Thread | P0 | 本报告 + 后续真实基准测试结果。 |
