# 传统桌宠 / Shimeji / mascot / pet creation ecosystem 分片矩阵

> 项目：`desktop-pet`
>
> 线程：AI Trend Radar Thread 分片 Agent B2
>
> 最后更新：2026-05-07
>
> 写入边界：本文件仅作为 B2 分片产物，未修改主调研文档、xlsx、`06-sync/` 三件套、`01-pm/`、`02-design/`、`03-engineering/`、`workspaces/`、`memory/`、`~/.codex/` 或 `~/.agents/skills/`。
>
> 语言规则：Product 名保留英文；LLM、MCP、API、VRM、Live2D、TTS、STT、Shimeji 等必要专业术语保留英文；其余中文描述。

## 1. 调研范围

本分片聚焦传统桌宠、Shimeji、desktop mascot、pet creation ecosystem，以及少量在 itch.io / Steam / GitHub 上出现的新兴 AI desktop pet 项目。核心问题是：这些产品有哪些明确 AI 功能、哪些只是传统桌面陪伴机制、哪些能力对 `desktop-pet` 的 SDK / 平台化方向有参考价值。

优先使用官方产品页、Steam、GitHub、itch.io 与官方文档。对没有明确证据的功能统一标注为“待核验”，不写成事实。

## 2. 证据口径

| 证据类型 | 含义 | 使用方式 |
|---|---|---|
| 事实 | 官方页面、Steam、GitHub README、itch.io 页面明确写出的功能 | 可进入主矩阵，但仍需保留来源链接 |
| 事实 + 推断 | 事实来源明确，但对体验价值或 `desktop-pet` 启发是研究线程推断 | 可进入 PM 输入，但不能直接写成锁定需求 |
| 待核验 | 官方说法较泛、营销词重、未说明实现细节，或只是 roadmap / planned | 只作为线索，不作为成熟能力 |
| 无明确 AI 功能 | 产品页面未展示生成式 AI / LLM / AI assistant / AI creation 等功能 | 保留非 AI 参考价值，用于桌面存在感、低打扰、modding、创作者生态分析 |

## 3. 产品 AI 功能拆解矩阵

| Product | 类别 | 平台 | AI 功能点 | 功能解释 | 证据类型 | 对体验的作用 | 局限 / 风险 | 证据来源 |
|---|---|---|---|---|---|---|---|---|
| UPochi | LLM 桌面 companion | macOS / Windows | LLM-Infused chat | 官方说明用户可以像使用 AI assistant 一样与桌宠聊天，并且桌宠会以 personality 方式回应。 | 事实 | 让传统桌宠从动画陪伴升级为可对话角色，形成基本陪伴闭环。 | 未说明 LLM provider、记忆、内容安全、fallback 和数据路径，不能直接推断为完整 AI companion 架构。 | [官网](https://www.upochi.com/) |
| UPochi | LLM 桌面 companion | macOS / Windows | 人格化响应 | 官方同时提供 pet characteristics、personality traits、names 等配置，并把 LLM chat 和 personality response 绑定。 | 事实 + 推断 | 对 `desktop-pet` 有启发：多游戏 SDK 需要 persona preset、语气、角色边界和游戏品类配置。 | 如果 persona 只停留在名称 / trait 层，可能不足以保证长期一致性；需要 PM 后续确认是否需要 persona schema。 | [官网](https://www.upochi.com/) |
| UPochi | LLM 桌面 companion | macOS / Windows | Create Your Own Pet（待核验是否 AI） | 官方写有 Create Your Own Pet beta，但页面未明确说明是否由生成式 AI 生成资产或行为。 | 待核验 | 如果是 AI creation，可降低宠物资产生产成本；如果不是 AI，也仍然说明用户有自定义宠物需求。 | 不能把该能力写成“AI 生成宠物”事实；主矩阵应保留“待核验”。 | [官网](https://www.upochi.com/) |
| UPochi | LLM 桌面 companion | macOS / Windows | 离线 / no tracking 边界 | 官方列出 No Ads、No Tracking、Offline Mode、Low Memory。 | 事实 | 对桌面常驻产品建立信任，尤其适合公司业务探索中的隐私边界讨论。 | Offline Mode 不等于所有 LLM chat 均本地运行；需要拆分“桌宠基础能力”和“AI chat provider”数据路径。 | [官网](https://www.upochi.com/) |
| Ai Vpet | AI 虚拟桌宠 | Windows / Steam | 第三方 AI 内容生成服务 | Steam 页面明确标注连接第三方服务用于 AI content generation。 | 事实 | 明确说明 AI 内容生成不是完全本地，适合给主矩阵补数据路径风险。 | 对公司业务项目来说，第三方 AI provider 需要显式 opt-in、脱敏和合规说明。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | Windows / Steam | 自然语言 AI companion | Steam 页面称其通过 deep learning 与 natural language processing 提供 knowledgeable、articulate 的 AI companion。 | 事实 | 把桌宠从“桌面装饰”转成可聊天、可陪伴、可答疑的角色。 | 页面是营销描述，未说明模型、记忆、RAG、内容安全或失败兜底。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | Windows / Steam | AI emotional companion | Steam 页面把其定位为 AI friend / emotional companion，可在用户孤独或休息时提供陪伴。 | 事实 + 推断 | 说明“情绪陪伴”是 AI 桌宠常见卖点，不只是 productivity assistant。 | 情感陪伴可能带来依赖、未成年人保护、内容安全和过度拟人化风险。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | Windows / Steam | AI 个性化角色配置 | Steam 页面称 advanced AI technology 支持从 character image、personality、clothing 到 voice 的自定义。 | 事实 + 待核验 | 强化“我的专属 companion”感，对多游戏角色皮肤 / voice / persona 配置有启发。 | 没有拆清楚哪些由 AI 生成、哪些只是用户配置；资产版权和 voice 授权需要单独评估。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | Windows / Steam | 主动休息互动 | Steam 页面描述其可在用户休息时主动发起互动。 | 事实 + 待核验 | 主动触达让桌宠显得“活着”，可对应游戏外召回 / idle comment。 | 需要 rate limit、quiet hours、snooze 和一键关闭；是否由 AI 判断时机仍待核验。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| YCamie | AI Shimeji creation | Web / Windows 输出 | 文本生成 Shimeji | 官方页面说明用户通过描述即可生成个性化 Shimeji desktop pet。 | 事实 | 直接降低 Shimeji 资产制作门槛，适合多游戏快速做 pet prototype。 | 生成结果需要风格一致性、IP / UGC 合规和资产审核机制。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | Web / Windows 输出 | 图片 / reference image 生成 Shimeji | 官方教程说明可上传 reference image 作为生成输入。 | 事实 | 可以把已有角色图、概念图或宠物图快速转成桌面宠物。 | 图片上传涉及版权、隐私和公司素材边界；不能默认上传未授权 IP。 | [教程](https://www.shimeji.ai/blog/introducing-YCamie) |
| YCamie | AI Shimeji creation | Web / Windows 输出 | AI 动画帧生成 | 官方页面列出 Basic 25-frame、Advanced 46-frame animation，并说明 AI model 被训练用于生成 desktop pets。 | 事实 | 对 `desktop-pet` 的美术资产 pipeline 有启发：不是只生成单张图，而要生成可运行的连续动画帧。 | 帧间一致性、动作覆盖、透明边缘、缩放和性能仍需实测。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | Web / Windows 输出 | Interactive AI Chat | 官方 FAQ / 套餐页列出 Interactive AI Chat 与 AI assistant。 | 事实 | 让 Shimeji 不只是动画精灵，而能进入角色对话。 | 官方资料未详细说明 AI provider、记忆、对话安全和本地 / 云端边界。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | Web / Windows 输出 | Real-time Response | 官方套餐页列出 Real-time Response。 | 事实 + 待核验 | 如果响应与动画 / chat 绑定，可提升桌宠“即时回应”感。 | “实时”具体指聊天延迟、动作响应还是 UI 反馈不清楚，需要实测。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | Web / Windows 输出 | OpenAI API key 聊天设置 | 官方教程说明可右键选择 chat，并在设置中配置 OpenAI API key。 | 事实 | 给 AI Shimeji 一个 BYO key 的实现路径，降低平台自担模型成本。 | BYO key 对普通用户有门槛；对公司 SDK 场景也必须说明数据进入第三方 provider。 | [教程](https://www.shimeji.ai/blog/introducing-YCamie) |
| Desktop Mate | 3D desktop mascot 平台 | Windows / Steam | 当前无明确 AI 功能 | Steam 页面当前主轴是官方授权 3D mascot、窗口 / 鼠标互动、闹钟和 DLC，没有看到公开 AI chat / LLM / AI generation 功能。 | 无明确 AI 功能 | 作为非 AI embodiment 标杆，可参考它的低打扰、动作 polish、IP DLC 和平台化角色生态。 | 主矩阵不要把 Desktop Mate 写成 AI companion；其价值在 mascot platform 和 licensed character ecosystem。 | [Steam](https://store.steampowered.com/app/3301060/Desktop_Mate/) |
| VPet-Simulator | 开源虚拟桌宠 / mod ecosystem | Windows / Steam / GitHub | ChatGPT 设置组件 | GitHub README 的软件结构中出现 `winCGPTSetting ChatGPT 设置`，说明项目至少预留了 ChatGPT 设置入口。 | 事实 + 待核验 | 说明传统桌宠可通过设置页 / 插件方式接入 LLM，不一定要从零构建 AI 桌宠。 | Steam 页面没有把 AI 作为核心定位；具体聊天体验、provider、记忆和安全边界需要代码或运行核验。 | [GitHub](https://github.com/LorisYounger/VPet) |
| VPet-Simulator | 开源虚拟桌宠 / mod ecosystem | Windows / Steam / GitHub | AI 扩展承载位 | Steam / GitHub 均强调 Workshop、code plugin、speech text、theme、animation logic 等可扩展能力，可承载未来 AI 功能。 | 事实 + 推断 | 对 `desktop-pet` SDK 很有启发：AI 能力应和 animation / item / speech / plugin 分层，而不是写死在桌宠本体。 | 这是架构启发，不代表 VPet-Simulator 已有完整 AI companion 功能。 | [Steam](https://store.steampowered.com/app/1920960/VPet/) / [GitHub](https://github.com/LorisYounger/VPet) |
| Dockling | photo-to-pixel pet / productivity pet | macOS | 从照片生成像素宠物 | 官方页面说明用户上传照片，生成 pixel-art preview / custom pets。 | 事实 | 资产创建门槛低，能让用户快速拥有“自己的人 / 宠物 / 角色”的桌宠。 | 上传照片涉及隐私和版权；公司场景不能上传未授权角色、玩家头像或内部素材。 | [官网](https://dockling.space/) |
| Dockling | photo-to-pixel pet / productivity pet | macOS | 多帧 pixel pet 生成 | 官方页面说明免费 preview 最多 9 frames，付费 app 包含 custom pet generations。 | 事实 | 说明桌宠 creation 不只是生成头像，还要生成可动帧。 | 目前没有明确 AI 对话 / LLM / memory；主矩阵应定位为 AI asset creation + 非 AI productivity pet。 | [官网](https://dockling.space/) |
| Dockling | photo-to-pixel pet / productivity pet | macOS | 本地数据边界 | 官方页面说明 notes、settings、pets、focus history 保存在 Mac，本身无 account / cloud sync / telemetry。 | 事实 | 对 AI-first 桌宠也有启发：数据边界透明会提升常驻信任。 | 照片生成阶段仍涉及上传预览，不能把所有能力都写成本地。 | [官网](https://dockling.space/) |
| Desktop Goose | 传统干扰型桌宠 | Windows / macOS / itch.io | 当前无明确 AI 功能 | itch.io 页面描述的是抢鼠标、留便签、带来 meme、modding API 和配置项，未看到 AI 功能。 | 无明确 AI 功能 | 提供“强性格 + 简单行为”参考，说明非 AI 也能塑造角色记忆点。 | 默认干扰感强，是 `desktop-pet` 的反模式参考；游戏玩家可能对抢鼠标 / 遮挡窗口非常敏感。 | [itch.io](https://samperson.itch.io/desktop-goose) |
| tama96 | agent bridge virtual pet | Desktop / terminal / MCP | MCP server 让 AI tools 照顾宠物 | 官网说明 bundled MCP server 可让 AI tools feed、play with、care for pet。 | 事实 | 是 Function Calling / action tools 的清晰参考：AI 不只是聊天，还能在受限工具集中行动。 | 需要权限、频率限制和 action audit；不能让 AI 直接获得高风险系统或游戏写入权限。 | [官网](https://www.tama96.com/) |
| tama96 | agent bridge virtual pet | Desktop / terminal / MCP | per-action permissions | 官网说明 per-action permissions 控制 AI 工具行为。 | 事实 | 对 `desktop-pet` 的 action permission model 有启发：pet-only、game read、game write 应分级。 | 权限模型需要和开发者配置、玩家同意、日志脱敏绑定。 | [官网](https://www.tama96.com/) |
| tama96 | agent bridge virtual pet | Desktop / terminal / MCP | rate limits | 官网说明通过 rate limits 控制 AI 工具照顾宠物的频率。 | 事实 | 对主动互动和 game event reaction 有启发：AI 行动需要频控，避免打扰或成本失控。 | 频控过宽会打扰，过窄会降低生命感；需要 PM 后续定义默认值。 | [官网](https://www.tama96.com/) |
| Shimeji-Desktop | Shimeji-ee fork / desktop mascot runner | Windows / macOS / Linux | 当前无明确 AI 功能 | GitHub README 定位为 Shimeji-ee port：桌面 mascot 自由游走、玩耍、通过 XML 和图片集配置。 | 无明确 AI 功能 | 是 Shimeji 生态的基础参考：image set、actions.xml、behaviors.xml、tray controls、跨平台运行。 | 传统 Shimeji 制作成本高，行为需要手工配置；不提供 AI 生成、AI chat 或上下文能力。 | [GitHub](https://github.com/DalekCraft2/Shimeji-Desktop) |
| Shimeji-Desktop | Shimeji-ee fork / desktop mascot runner | Windows / macOS / Linux | 行为配置系统（非 AI） | README 说明 actions / behaviors 由 XML 配置，图片集可替换。 | 无明确 AI 功能 | 对 SDK 配置设计有启发：桌宠动作、触发、素材可以数据化而不是写死。 | XML 配置对非技术用户不友好；AI 生成或可视化工具可用于降低门槛。 | [GitHub](https://github.com/DalekCraft2/Shimeji-Desktop) |
| Shijima | modern Shimeji runner | Windows / macOS / Linux | 当前无明确 AI 功能 | 官方 itch.io 页面明确 Content 为 No generative AI used，定位是跨平台运行 Shimeji。 | 无明确 AI 功能 | 提供现代 Shimeji runner 参考：安装 zip / rar / 7z、spawn / despawn、debug inspector、跨平台。 | GitHub 显示 Shijima-Qt 已归档，主矩阵应避免把它写成稳定长期方案。 | [itch.io](https://pixelomer.itch.io/shijima) / [GitHub](https://github.com/pixelomer/Shijima-Qt) |
| Shijima | modern Shimeji runner | Windows / macOS / Linux | shimeji inspector / creator workflow（非 AI） | itch.io 页面提到 inspector 可用于观察和调试 shimeji，适合自制 Shimeji。 | 无明确 AI 功能 | 对 `desktop-pet` 的开发者 preview / debugger 有启发：行为调试工具可能比玩家端功能更能缩短集成时间。 | 这是非 AI 开发工具价值，不应归入 AI 功能。 | [itch.io](https://pixelomer.itch.io/shijima) |
| Desktop Mascot Engine | early access mascot engine | Windows / Steam | AI Assistant（planned / 当前缺失） | Steam 页面写明 early access 计划开发 AI-Assistant，但当前版本 lacks the AI-Assistant part。 | 待核验 | 证明 mascot engine 很早就有“角色 + assistant + API”方向设想。 | 不应写成已上线 AI 功能；页面还提示开发者最后更新距今很久，信息可能过期。 | [Steam](https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/) |
| Desktop Mascot Engine | early access mascot engine | Windows / Steam | utility APIs / Cloud Services 集成计划 | Steam 页面说明计划集成 utility APIs 与 Cloud Services，让 AI assistant 执行预定义任务。 | 待核验 | 对 `desktop-pet` 的 Function Calling / Workflow 有启发：assistant 应服务于明确任务，而非无限开放。 | 只是计划，不代表产品已经可用；且 cloud service 会带来数据路径风险。 | [Steam](https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/) |
| Windows VPet | AI-powered Tamagotchi desktop pet | Windows / itch.io | Intelligent Conversations | itch.io 页面称用户可用 advanced AI 与 pet 聊天，pet 会以 personality 回应。 | 事实 + 待核验 | 把 Tamagotchi care loop 与 AI chat 结合，适合参考“养成 + 对话”的留存机制。 | 页面未说明模型、provider、记忆机制、内容安全；需要进一步核验。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| Windows VPet | AI-powered Tamagotchi desktop pet | Windows / itch.io | mood adaptation / learns from interactions | 页面称 pet adapts to mood、learns from interactions。 | 事实 + 待核验 | 如果成立，可形成比一次性聊天更强的成长感。 | “learns”可能是营销表达，也可能只是规则状态；不能直接等同于长期 memory。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| Windows VPet | AI-powered Tamagotchi desktop pet | Windows / itch.io | desktop activity awareness | 页面称 pet watches desktop activity，用户 idle 时更 chatty，忙碌时避让，并评论 app。 | 事实 + 待核验 | 对桌面 companion 非常关键：合适时机出现，不只是被动聊天。 | 读取 desktop activity 隐私敏感；对公司业务项目应优先评估 game event schema 替代 screen / app 监听。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| Windows VPet | AI-powered Tamagotchi desktop pet | Windows / itch.io | weather context reaction | 页面称可启用 weather mode，让 mood changes 和 reactions 基于真实天气变化。 | 事实 + 推断 | 外部上下文可以让宠物更像生活在用户世界里。 | 天气更像 context feature，不一定是 AI；应避免把所有 context reaction 都算作 LLM 能力。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | local LLM conversations | itch.io 页面说明使用 local LLM，GitHub README 写明 Ollama + Qwen fine-tune 路径。 | 事实 | 是本地 AI 桌宠的强参考，符合 `desktop-pet` 的隐私边界讨论。 | 原作者标注为 Prototype / MVP，稳定性和产品化程度有限。 | [itch.io](https://wa11a.itch.io/inabapet) / [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | custom fine-tuned Qwen model | GitHub README 写明 chat / roleplay 使用 Qwen fine-tune via Ollama。 | 事实 | 说明角色化桌宠可以通过本地模型和定制角色模型实现，而不必完全依赖云端。 | Fine-tuning 需要数据、算力、许可和效果评估；MVP 不宜默认采用。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | vision recognition | GitHub README 写明 qwen3-vl vision model 已通过 VisionConnector 整合。 | 事实 | 给“桌宠看见用户屏幕 / 图像”的能力提供开源实现线索。 | 对 `desktop-pet`，screen / vision 默认读取风险高，应优先和 game event schema 做取舍。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | head-pat contextual response | itch.io 与 GitHub 都说明摸头 interaction 会触发语音 / 文本情境回应。 | 事实 | 将物理互动映射到 AI 语言输出，增强具身感。 | 需要控制触发频率和重复话术，否则会变成机械反馈。 | [itch.io](https://wa11a.itch.io/inabapet) / [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | TTS / voice synthesis | itch.io 写明 voiced responses，GitHub README 写明 VITS + mock fallback。 | 事实 | 语音让桌宠更像一个“存在于桌面上的角色”。 | TTS 延迟、音色授权、资源占用和 fallback 音频质量需要评估。 | [itch.io](https://wa11a.itch.io/inabapet) / [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | memory state | GitHub README 写明 `/memory GET` / `/memory POST` 可读取和更新 name、last_topic、mood。 | 事实 | 提供轻量 memory schema 示例，适合 PM 讨论 MVP memory 粒度。 | 仅 name / topic / mood 不等于完整长期记忆；仍需用户可见、编辑、删除。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | time / holiday prompt injection | GitHub README 写明会自动注入时段问候、节日提示、用户名和上次话题。 | 事实 | 不依赖复杂 Agent，也能让桌宠显得“知道现在发生什么”。 | 这类 prompt context 需要可观测，否则出错时难以解释。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | Windows / itch.io / GitHub | bilingual / translation layer | GitHub README 写明支持中 / 英 / 日翻译与 bilingual response。 | 事实 | 对多地区游戏或多语言玩家有参考价值。 | 翻译模型会增加本地模型依赖和延迟。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| Dororo | Godot desktop pet with LLM chat | Windows / itch.io / GitHub | LLM chat | itch.io 与 GitHub README 均说明可连接大模型 API 对话。 | 事实 | 是轻量桌宠接入 LLM 的直接例子，适合参考 UI 设置和桌宠动作结合。 | itch.io 同时标注 No generative AI was used，可能指资产 / 内容披露而非运行时 LLM；需主矩阵标注边界。 | [itch.io](https://melantech.itch.io/dororo) / [GitHub](https://github.com/MelanTech/Dororo) |
| Dororo | Godot desktop pet with LLM chat | Windows / itch.io / GitHub | OpenAI-compatible API | README 写明理论支持所有 OpenAI 协议接口，并已测试 Ollama、智谱清言、讯飞星火。 | 事实 | 对 SDK 很有启发：AI provider 可以抽象成 OpenAI-compatible adapter。 | 多 provider 会带来 API 差异、鉴权、成本和数据路径说明复杂度。 | [GitHub](https://github.com/MelanTech/Dororo) |
| Dororo | Godot desktop pet with LLM chat | Windows / itch.io / GitHub | prompt 设置 | README 写明支持 Prompt 设置。 | 事实 | 说明桌宠 persona / 行为边界可以开放给用户或开发者配置。 | 如果没有 guardrails，prompt 配置可能导致 persona drift 或不合规输出。 | [GitHub](https://github.com/MelanTech/Dororo) |
| Dororo | Godot desktop pet with LLM chat | Windows / itch.io / GitHub | streaming / temperature 设置 | README 写明支持流式传输、温度系数等设置。 | 事实 | 对桌宠聊天体验很重要：streaming 可降低等待感，temperature 控制表达稳定性。 | 暴露给普通玩家可能过复杂；更适合开发者 / 高级设置。 | [GitHub](https://github.com/MelanTech/Dororo) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | text / voice chat | itch.io 页面说明用户可上传 VRM 模型，并与自定义 AI 进行 text / voice chat。 | 事实 | 把自定义角色模型、AI 对话和桌面陪伴结合，是 pet creation + AI companion 的典型样本。 | early development；需注意下载信任、provider 成本和语音权限。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | activity comments / neglect messages | 页面说明 V-Chatter 可以评论用户 activity，并在用户长时间忽略时发消息。 | 事实 + 待核验 | 主动性让角色显得有生命，但也容易变成打扰。 | 需要明确 activity 读取范围、频率限制和关闭入口。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | sentiment-to-expression / pose | 页面说明 AI 响应会对应 facial expression 和 pose。 | 事实 | 将 LLM 输出映射到表情 / 姿态，避免“聊天框套皮”。 | 情绪识别或映射错误会破坏角色可信度；需要 fallback 动画。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | real-time lip sync | 页面说明支持 expressive responses with real time lip sync。 | 事实 | 语音输出和口型同步能显著增强 embodied companion 感。 | 口型、语音和字幕不同步时会产生廉价感；对性能也有压力。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | command support | 页面说明支持 commands，形成 assistant-like experience。 | 事实 | 让桌宠从聊天角色扩展到可执行有限命令的 assistant。 | 命令权限必须分级；游戏 SDK 场景尤其要避免默认高风险系统命令。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | built-in AI / Python AI file | 页面说明 AI 有 built-in 方案，也有公开 Python 文件供用户自定义 personality、功能、local AI model 和服务。 | 事实 | 对 `desktop-pet` SDK 有启发：可把 AI provider、persona、扩展功能拆成可替换模块。 | Python 扩展提升自由度，也带来安装、依赖、脚本安全和用户支持成本。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | provider 组合 | 页面说明默认支持 OpenRouter、OpenAI、Ollama 作为 LLM，OpenAI 做 STT，ElevenLabs 做 TTS。 | 事实 | 说明实际 AI 桌宠常是多 provider pipeline，而不是单模型。 | 每个 provider 都需要独立说明数据路径、费用、延迟和 fallback。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | Desktop / itch.io / Unity | chat / audio data storage | 页面说明 chat history、error logs、speech recording、AI audio response 会存到用户选择的设置文件夹。 | 事实 | 这是值得主矩阵保留的数据路径透明样本。 | 语音录音和聊天日志敏感；需要删除、加密、保留期和可见控制。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| Dotami-vrm | VRM desktop pet / self-care pet | Windows / Linux / itch.io | 当前无明确 AI 功能 | itch.io 页面标注 No AI / No generative AI used，主功能是 VRM 模型上传、互动、minigames、自我照顾练习。 | 无明确 AI 功能 | 对 `desktop-pet` 的非 AI 支撑层有参考：VRM 导入、坐在窗口、低资源、小游戏、自我照顾、anti-cheat 提醒。 | 官方页面提醒 overlay 可能触发 anti-cheat，这对游戏桌宠非常关键。 | [itch.io](https://sabresnout.itch.io/dotami-vrm) |
| PAIcom | voice computer assistant / mascot | Windows / itch.io | 麦克风语音 assistant | itch.io 页面说明用户可用麦克风与 PAIcom 说话。 | 事实 + 待核验 | 说明 desktop mascot 可以作为语音入口，而不是只靠文字聊天。 | 页面未清楚说明是否使用 LLM；应标注为 voice assistant，不直接等同于 generative AI companion。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| PAIcom | voice computer assistant / mascot | Windows / itch.io | 打开 apps / games / websites | 页面说明 PAIcom 可打开电脑上的 apps、games、websites。 | 事实 | 对 Function Calling / action tools 有参考：桌宠可执行有限、本地、明确的命令。 | 打开本地程序属于高权限动作，需要 allowlist、确认和失败回滚。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| PAIcom | voice computer assistant / mascot | Windows / itch.io | 本地运行隐私声明 | 页面说明 everything runs locally，no data is sent to us。 | 事实 | 对 `desktop-pet` 的隐私优先定位有参考。 | 需要核验语音识别和命令解析是否真的全部本地；页面说法较营销化。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| PAIcom | voice computer assistant / mascot | Windows / itch.io | 可 mod / 自定义 assistant | 页面说明可改 name、skin、responses、voice，并可用 PAIcom engine 制作自己的 voice assistant。 | 事实 | 对 SDK / creator ecosystem 有启发：宠物 persona、voice、response 和动作可以被创作者扩展。 | 评论区提到新增命令仍受安全限制；modding 需要安全沙箱和审核机制。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| Vicsine Desktop Pet | Shimeji fan desktop pet | Windows / itch.io | 当前无明确 AI 功能 | itch.io 页面标注 No generative AI was used，且说明是基于 Shimeji-ee Group open source template 的官方 Shimeji pet。 | 无明确 AI 功能 | 说明 Shimeji 模板仍被用于游戏 / 角色 fan pet 分发，可参考“角色 IP 变桌宠”的轻量路径。 | 涉及 IP / fan-made 边界；公司项目不能复用未授权角色或合作方素材。 | [itch.io](https://fenbus.itch.io/vicsine) |
| BMO Desktop Pet | 2D mascot desktop pet | Windows / macOS / itch.io | 当前无明确 AI 功能 | itch.io 页面标注 No generative AI was used，功能为随机 idle animation、屏幕游走、跟随鼠标、唱歌等。 | 无明确 AI 功能 | 可参考“低成本动画 + 语音线 + nostaliga”如何形成陪伴感。 | 页面评论显示安装 / 可执行问题，说明小型桌宠分发和可用性需要重视。 | [itch.io](https://dagger-shoe.itch.io/bmo-desktop-pet) |

## 4. B2 分片关键观察

| 观察 | 类型 | 说明 | 对 `desktop-pet` 的启发 |
|---|---|---|---|
| 传统 Shimeji 的核心资产是“动作 / 行为 / 图片集配置”，不是 AI | 事实 | Shimeji-Desktop、Shijima、Vicsine 都说明桌宠可由 image set、actions、behaviors 和 runner 组成。 | 多游戏 SDK 不应只做 LLM chat，要把 pet behavior schema 和 asset pipeline 做成基础层。 |
| AI pet creation 正在把“制作桌宠”从手工帧图转成 prompt / image-to-pet | 事实 + 推断 | YCamie、Dockling 都在降低桌宠资产生产门槛。 | 可作为 P1/P2：游戏开发者上传安全素材或填写 persona / style，就能生成 demo pet。 |
| AI chat 常见接法是 BYO provider / OpenAI-compatible / Ollama | 事实 | YCamie、Dororo、V-Chatter、InabaPet 都出现 provider 配置、OpenAI-compatible 或 Ollama。 | `desktop-pet` 应把 model adapter 抽象成独立层，并显式展示数据路径。 |
| 小型 AI 桌宠往往混合多 provider | 事实 | V-Chatter 使用 LLM + STT + TTS provider 组合。 | AI_FEATURE_EVALUATION 不能只选“LLM”，要拆成对话、语音识别、语音合成、记忆、视觉等模块。 |
| 本地优先是桌面宠物的重要卖点，但容易被误写 | 事实 + 推断 | InabaPet / PAIcom / Dockling 都有 local 或 private 表述，但各自覆盖范围不同。 | 主矩阵必须逐功能写 data path，不能用一句“本地”覆盖所有能力。 |
| game 场景要额外考虑 overlay / anti-cheat | 事实 | Dotami-vrm 明确提醒 overlay 可能触发 anti-cheat。 | `desktop-pet` 在 Engineering 阶段必须评估 fullscreen、overlay、anti-cheat、窗口层级和性能。 |
| “主动陪伴”需要频控 | 推断 | Ai Vpet、V-Chatter、Windows VPet、tama96 都有主动互动或 agent action 的影子。 | P0 若做主动触达，应默认 quiet hours、rate limit、snooze、hide、stop speaking。 |

## 5. 给 Main Thread 的建议：新增 / 修正 / 删除功能行

### 5.1 建议新增到主矩阵的功能行

| 建议 | Product | 功能行 |
|---|---|---|
| 新增 | YCamie | 文本生成 Shimeji、图片 / reference image 生成 Shimeji、AI 动画帧生成、Interactive AI Chat、OpenAI API key 聊天设置 |
| 新增 | Dockling | 从照片生成 pixel pet、多帧 pixel pet 生成、本地 notes / settings / pets 数据边界 |
| 新增 | tama96 | MCP action tools、per-action permissions、rate limits |
| 新增 | InabaPet | local LLM conversations、vision recognition、memory state、TTS、time / holiday prompt injection、bilingual translation |
| 新增 | Dororo | OpenAI-compatible LLM chat、prompt 设置、streaming / temperature 设置 |
| 新增 | V-Chatter | text / voice chat、activity comments、sentiment-to-expression、real-time lip sync、commands、provider pipeline、chat / audio storage |
| 新增 | Windows VPet | Intelligent Conversations、mood adaptation、desktop activity awareness、weather context reaction |
| 新增 | Shimeji-Desktop / Shijima | 当前无明确 AI 功能，但保留 Shimeji behavior / image set / inspector / runner 作为非 AI 生态参考 |
| 新增 | Desktop Mascot Engine | AI Assistant planned / 当前缺失，utility APIs / Cloud Services planned，必须标注“待核验 / planned” |
| 新增 | PAIcom | voice assistant、local command actions、local privacy、modded assistant engine，并标注“待核验是否 LLM” |
| 新增 | Dotami-vrm | 当前无明确 AI 功能，但保留 VRM upload、self-care、overlay anti-cheat 风险参考 |
| 新增 | Vicsine Desktop Pet / BMO Desktop Pet | 当前无明确 AI 功能，作为 Shimeji template / fan desktop pet / low-cost animation reference |

### 5.2 建议修正主矩阵中已有功能行

| 建议 | Product | 修正方向 |
|---|---|---|
| 修正 | Desktop Mate | 保持“当前无明确 AI 功能”，不要把其写成 AI companion；价值在 licensed character DLC、3D mascot、窗口 / 鼠标互动、闹钟和低打扰 polish。 |
| 修正 | VPet-Simulator | 将 ChatGPT 能力写成“GitHub 代码结构 / 设置组件显示存在 AI 扩展入口，具体体验待核验”，不要写成产品主定位。 |
| 修正 | Ai Vpet | 明确标注“Connects to 3rd-Party Service for AI Content Generation”，不要写成 local-first。 |
| 修正 | UPochi | LLM chat 与 personality response 可写事实；Create Your Own Pet 只能写 beta / 待核验是否 AI；Offline Mode 不等于 LLM 完全本地。 |
| 修正 | YCamie | 主来源建议改为 `ycamie.com` + `shimeji.ai` 官方教程，避免只用旧域名或单一页面。 |
| 修正 | Dockling | 写成 AI asset creation / photo-to-pixel pet，不要写成 AI chat / LLM companion。 |

### 5.3 建议从主矩阵删除或降级的功能行

| 建议 | Product | 删除 / 降级原因 |
|---|---|---|
| 删除 / 降级 | UPochi | 若主矩阵写了 memory、screen awareness 或 agent action，目前 B2 未找到官方证据，应降级为待核验或删除。 |
| 删除 / 降级 | Desktop Goose | 不应出现 AI chat、AI memory 或 AI assistant 行；它是非 AI 干扰型桌宠参考。 |
| 删除 / 降级 | Desktop Mate | 不应出现 AI assistant 已上线的表述；当前公开页面未看到 AI 功能。 |
| 删除 / 降级 | Desktop Mascot Engine | AI Assistant 是 early access planned / 缺失状态，不应写成已发布功能。 |
| 删除 / 降级 | Dockling | 不应出现 LLM chat / companion memory；当前证据只支持 photo-to-pixel generation、Pomodoro、quick notes 与本地数据边界。 |
| 删除 / 降级 | Windows VPet | “learns from interactions”需标注待核验，不能直接写成长时记忆事实。 |

## 6. 建议给 PM Thread 的待澄清问题

| 问题 | 为什么重要 |
|---|---|
| `desktop-pet` 是否需要 pet creation pipeline，还是 MVP 只需要固定资产 + 配置？ | YCamie / Dockling 说明 creation 是强机会，但也会引入 IP、审核和资产质量风险。 |
| 桌宠行为配置是否需要类 Shimeji 的 `actions / behaviors / image set` schema？ | 如果目标是多游戏 SDK，行为和资产需要数据化。 |
| AI chat 是否采用 BYO provider / OpenAI-compatible / internal provider / local Ollama 之一，还是多 adapter？ | Dororo、V-Chatter、YCamie、InabaPet 显示市场已有多种接法，数据路径差异很大。 |
| MVP 是否允许读取 desktop activity / app context？ | Windows VPet、V-Chatter 体现体验价值，但隐私风险高；游戏场景可能优先 game event schema。 |
| 主动互动的频率、时段、触发类型谁控制？ | Ai Vpet / V-Chatter / tama96 都显示主动性有价值，但常驻产品最怕打扰。 |
| action tools 权限是否至少分 pet-only / game-read / game-write / system-action？ | tama96 和 PAIcom 显示 action 能力需要权限分层。 |
| 是否明确排除 overlay 可能触发 anti-cheat 的游戏场景？ | Dotami-vrm 对游戏 overlay 风险给出直接提醒，Engineering 必须评估。 |

## 7. 来源索引

| Product / 主题 | 来源 |
|---|---|
| UPochi | https://www.upochi.com/ |
| Ai Vpet | https://store.steampowered.com/app/3029820/Ai_Vpet/ |
| YCamie | https://www.ycamie.com/ |
| YCamie tutorial | https://www.shimeji.ai/blog/introducing-YCamie |
| Desktop Mate | https://store.steampowered.com/app/3301060/Desktop_Mate/ |
| VPet-Simulator Steam | https://store.steampowered.com/app/1920960/VPet/ |
| VPet-Simulator GitHub | https://github.com/LorisYounger/VPet |
| Dockling | https://dockling.space/ |
| Desktop Goose | https://samperson.itch.io/desktop-goose |
| tama96 | https://www.tama96.com/ |
| Shimeji-Desktop | https://github.com/DalekCraft2/Shimeji-Desktop |
| Shijima | https://pixelomer.itch.io/shijima |
| Shijima official | https://getshijima.app/ |
| Shijima-Qt GitHub | https://github.com/pixelomer/Shijima-Qt |
| Desktop Mascot Engine | https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/ |
| Windows VPet | https://parreirao2.itch.io/windows-vpet |
| InabaPet | https://wa11a.itch.io/inabapet |
| InabaPet GitHub | https://github.com/wallouo/MurasamePet-InabaVer |
| Dororo | https://melantech.itch.io/dororo |
| Dororo GitHub | https://github.com/MelanTech/Dororo |
| V-Chatter | https://dev-wicked.itch.io/v-chatter |
| Dotami-vrm | https://sabresnout.itch.io/dotami-vrm |
| PAIcom | https://ovidiu-dendrino.itch.io/paicom-premium |
| Vicsine Desktop Pet | https://fenbus.itch.io/vicsine |
| BMO Desktop Pet | https://dagger-shoe.itch.io/bmo-desktop-pet |
