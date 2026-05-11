# Game SDK / Overlay / Event Bridge Opportunities 分片调研

> 项目：`desktop-pet`
>
> 线程：AI Trend Radar Thread 分片 Agent D
>
> 范围：面向 Desktop Pet for Games 的 game SDK / overlay / game event / integration opportunity 深挖。
>
> 核验方式：联网核验，优先采用官方文档、官方产品页、GitHub、Steamworks / Discord / Epic / Microsoft / NVIDIA / Unity 等一手资料。
>
> 语言规则：Product 保留英文；必要专业术语如 SDK、overlay、game event、Function Calling、MCP、RAG、TTS、ASR、LLM 保留英文；其余中文描述。

## 1. 本分片结论

| 结论类型 | 结论 |
|---|---|
| 事实 | `Overwolf`、`Steam Overlay`、`Discord Rich Presence`、`Epic Online Services Overlay`、`Xbox Game Bar` 已经证明：游戏外能力要进入游戏场景，通常需要明确处理 overlay、hotkey、focus、fullscreen、input passthrough、presence、join / invite、平台分发等问题。 |
| 事实 | `Inworld`、`Convai`、`NVIDIA ACE` 的 AI NPC / AI companion middleware 共同指向一个模式：AI 不应只接收玩家自由文本，还需要 game state、player profile、event history、trigger parameters、action selection、voice / animation output 这些结构化上下文。 |
| 事实 | `Streamer.bot`、`VTube Studio API`、`Open LLM Vtuber`、`tama96`、`MCP` 展示了 agent bridge 模式：事件进入系统后，被路由成 action；action 需要权限、速率限制、可测试入口、用户可见状态和中断机制。 |
| 推断 | 对 `desktop-pet` 最有价值的新增矩阵方向不是“再做一个聊天桌宠”，而是把 `game event schema`、`pet reaction template`、`persona config`、`overlay interaction mode`、`action tool permission`、`developer preview / event simulator` 做成 SDK 能力层。 |
| 推断 | MVP 应优先验证“游戏事件驱动的 AI reaction + 可降级规则模板”，而不是默认做 screen watching 或完全自主 Agent。screen / audio / screenshot 仍可作为候选，但在公司业务边界下应标为待确认。 |

## 2. 产品证据矩阵

| Product | 类别 | 平台 | AI 功能点 | 功能解释 | 证据类型 | 对体验的作用 | 局限 / 风险 | 证据来源 |
|---|---|---|---|---|---|---|---|---|
| Overwolf | game overlay / game events 平台 | Windows PC / supported games | game event 触发 AI reaction | Overwolf `games.events` API 可从特定游戏读取实时 game events，例如 kill、death 等，并要求 app 在 manifest 中声明 `game_events`。对 `desktop-pet` 的启发是：AI 桌宠可以不直接看屏幕，而是通过游戏侧 event schema 接收结构化上下文，再触发话术、表情、动作或提醒。 | 事实 + 推断 | 让桌宠在“玩家死亡、胜利、升级、掉线、排队、活动开启”等关键时机自然回应，形成比泛聊天更强的游戏相关性。 | 依赖游戏支持和事件授权；不同游戏事件命名不统一，需要抽象统一 schema；事件过密会造成打扰和 AI 成本上升。 | [Overwolf games.events API](https://dev.overwolf.com/ow-native/reference/games/events/) |
| Overwolf | game overlay / game events 平台 | Windows PC / supported games | required features 能力开关 | Overwolf 通过 `setRequiredFeatures(features)` 声明需要使用的 provider features。对 `desktop-pet` 的启发是：SDK 应允许游戏开发者按场景开启事件能力，例如 `combat_result`、`quest_progress`、`idle_state`、`social_invite`，而不是一次性暴露全部游戏数据。 | 事实 + 推断 | 给开发者一个最小权限接入模型，也方便 PM 对 P0 / P1 功能做分层。 | feature 粒度过粗会增加隐私风险，过细会增加接入复杂度；需要事件文档、调试工具和 fallback。 | [Overwolf games.events API](https://dev.overwolf.com/ow-native/reference/games/events/) |
| Overwolf | game overlay / game events 平台 | Windows PC / supported games | overlay exclusive mode / input takeover | Overwolf 在游戏内 overlay 场景中定义 exclusive mode：用户通过 Ctrl+Tab 或 hotkey 进入可交互 overlay，退出后释放输入。对 `desktop-pet` 的启发是：桌宠如果进入游戏画面上方，必须区分“只展示 reaction”和“接管输入进行对话 / 配置”的模式。 | 事实 + 推断 | 降低玩家误触和输入冲突，让 AI 桌宠既能存在于游戏中，又不会抢走鼠标键盘。 | 非 borderless fullscreen 游戏可能限制 overlay 交互；全屏、反作弊、渲染 API、hotkey 冲突都需要工程验证。 | [Overwolf in-game overlays](https://dev.overwolf.com/ow-native/guides/product-guidelines/app-screen-behavior/in-game-overlays/) |
| Overwolf | game overlay / game events 平台 | Windows PC / supported games | fullscreen compatibility 检测 | Overwolf 文档说明部分游戏在 non-borderless fullscreen 下无法交互 overlay，并提供 `exclusiveModeDisabled` 这类检测思路。对 `desktop-pet` 的启发是：SDK 应暴露 overlay capability 检测结果，并让桌宠在不可交互时自动降级为桌面外提示或系统通知。 | 事实 + 推断 | 减少“桌宠卡住 / 点不了 / 影响游戏”的负反馈，提升开发者接入稳定性。 | 各游戏、各显卡、各系统窗口模式差异大；不能承诺所有游戏内 overlay 都可靠。 | [Overwolf in-game overlays](https://dev.overwolf.com/ow-native/guides/product-guidelines/app-screen-behavior/in-game-overlays/) |
| Steam Overlay | 游戏平台 overlay | PC / Steam | in-game AI companion 承载位 | Steam Overlay 可覆盖在几乎所有通过 Steam 启动的游戏之上，提供 friends list、web browser、chat、DLC purchase 等入口。对 `desktop-pet` 的启发是：AI 桌宠也需要清晰的召唤入口和退出入口，例如 hotkey、tray、overlay button，而不是默认常驻强打扰。 | 事实 + 推断 | 让玩家知道 AI 能力在哪里、如何唤起、如何离开，降低 always-on 桌宠的不安全感。 | Steam Overlay 本身不是第三方桌宠 SDK；如果游戏未通过 Steam 或 overlay 不兼容，不能依赖该模式。 | [Steam Overlay docs](https://partner.steamgames.com/doc/features/overlay?language=english) |
| Steam Overlay | 游戏平台 overlay | PC / Steam | rendering loop / overlay compatibility 约束 | Steam 文档指出 overlay 需要游戏持续渲染帧，Web-based game 可能需要 native app + D3D window + input forwarding 等 workaround。对 `desktop-pet` 的启发是：桌宠 overlay 的技术方案必须在工程阶段验证渲染路径，而不是只在产品层写“支持游戏内悬浮”。 | 事实 + 推断 | 避免 MVP 承诺超出工程可行性的 overlay 范围，可先用 desktop always-on / borderless window / Game Bar widget 做低风险路径。 | 跨平台 Mac + Windows 难度不同；反作弊与全屏渲染可能直接限制游戏内 overlay。 | [Steam Overlay docs](https://partner.steamgames.com/doc/features/overlay?language=english) |
| Discord Rich Presence | 社交 presence / game activity SDK | PC / Discord ecosystem | social activity context | Discord Rich Presence 允许游戏展示玩家正在玩什么、所在关卡、会话时长、队伍人数、可加入入口等 activity 信息。对 `desktop-pet` 的启发是：桌宠可读取或接收“玩家处于哪类活动状态”的结构化摘要，用于生成低打扰陪伴话术或召回提示。 | 事实 + 推断 | 让桌宠知道“玩家在匹配中 / 副本中 / 排队中 / 组队中”，比单纯聊天更贴近游戏节奏。 | Rich Presence 数据会展示在 Discord profile 上，隐私和公开范围需要用户明确授权；desktop-pet 不应默认把玩家状态外发。 | [Discord Rich Presence](https://docs.discord.com/developers/platform/rich-presence) |
| Discord Rich Presence | 社交 presence / game activity SDK | PC / Discord ecosystem | join / invite 触发桌宠召回 | Discord Rich Presence 支持 party size、join secret、game invites 等字段。对 `desktop-pet` 的启发是：桌宠可作为“好友邀请 / 组队状态 / 回流”事件的具身化表达层，例如宠物轻敲提醒“队友在等你”。 | 事实 + 推断 | 把社交召回做成角色化提醒，而不是冷冰冰 notification。 | 这类能力容易变成骚扰，需要 quiet hours、rate limit、snooze 和游戏内状态过滤。 | [Discord Rich Presence](https://docs.discord.com/developers/platform/rich-presence), [Setting Rich Presence](https://docs.discord.com/developers/discord-social-sdk/development-guides/setting-rich-presence) |
| Epic Online Services | cross-platform social overlay / presence | PC / console / multi-store | cross-platform presence + overlay | Epic Online Services 提供 friends、rich presence、crossplay 和 Epic social overlay，强调跨平台、跨商店的一致体验。对 `desktop-pet` 的启发是：多游戏桌宠 SDK 需要把“游戏接入层”和“平台社交层”拆开，不要把能力绑定到单一游戏或单一商店。 | 事实 + 推断 | 支持多个游戏复用同一套 companion 能力，同时让玩家在不同平台上获得相对一致的召回和社交提示体验。 | EOS 是独立平台服务，不等于桌宠方案；如果接入第三方社交 SDK，会带来账号、权限、合规和分发依赖。 | [Epic Accounts & Social](https://onlineservices.epicgames.com/en-US/accounts-social) |
| Epic Online Services | cross-platform social overlay / presence | PC / console / multi-store | localized presence 文案模板 | EOS SDK 1.18 官方说明 presence data 可本地化，开发者可在 Developer Portal 定义模板和翻译。对 `desktop-pet` 的启发是：桌宠的 game event reaction 不应只是一条 prompt，而应支持多语言模板、品牌语气、合规词库和 fallback 文案。 | 事实 + 推断 | 让同一套事件在不同游戏、地区、语言下稳定输出，减少 LLM 幻觉和品牌风险。 | 多语言模板维护成本高；如果完全交给 LLM 翻译，可能破坏 IP 语气和运营合规。 | [EOS SDK 1.18 update](https://onlineservices.epicgames.com/en-US/news/epic-online-services-sdk-1-18-is-live-here-s-what-you-need-to-know) |
| Xbox Game Bar | 系统级 game overlay / widget 平台 | Windows 11 / PC Game Bar | AI sidekick overlay widget | Xbox 官方称 Gaming Copilot 可在 Game Bar 中打开，支持玩家在游戏时通过 widget 与 AI 交流，并理解正在玩的游戏和 Xbox activity。对 `desktop-pet` 的启发是：AI 桌宠可以优先作为 game overlay widget / side panel，而不是强行绘制在游戏画面中心。 | 事实 + 推断 | 保留玩家主画面，适合攻略问答、成就提示、游戏外召回和语音帮助。 | Gaming Copilot 是 Microsoft 自有能力，不是可复用 SDK；官方页标注 beta、年龄和地区限制，且中国大陆不可用。 | [Xbox Wire: Gaming Copilot on Game Bar](https://news.xbox.com/en-us/2025/08/06/gaming-copilot-beta-begins-rolling-out-to-xbox-insiders-on-game-bar-today/), [Xbox Gaming Copilot](https://www.xbox.com/en-US/gaming-copilot) |
| Xbox Game Bar | 系统级 game overlay / widget 平台 | Windows 10 / Windows 11 | click-through / transparency 控制 | Xbox Game Bar 官方更新提到 pinned overlay 可控制 mouse click-through，并支持透明度。对 `desktop-pet` 的启发是：桌宠在游戏场景必须支持“可见但不拦截输入”的模式，并允许开发者按游戏类型配置透明度、位置和交互区域。 | 事实 + 推断 | 让桌宠成为 ambient companion，而不是挡 UI、抢点击的干扰源。 | Windows 生态可参考，但 Mac / Linux 没有同等统一 Game Bar；跨平台需要不同实现策略。 | [Xbox Game Bar Update](https://news.xbox.com/en-us/2020/07/01/xbox-game-bar-update-july-2020/) |
| Xbox Game Bar | 系统级 game overlay / widget 平台 | Windows 10 / Windows 11 | companion widget 分发模式 | Microsoft Learn 说明 Game Bar widget app 可以通过 Widget Store / Microsoft Store 发现、安装、卸载，也可在开发测试中 sideload。对 `desktop-pet` 的启发是：如果 Windows MVP 不直接嵌入游戏，可先做一个 companion widget 或 sidecar app，验证游戏事件 + AI reaction 的体验。 | 事实 + 推断 | 降低对游戏客户端改造的依赖，便于先做内部验证或小范围试点。 | Game Bar widget 生态与审核、分发、UWP 约束相关；不适合直接代表 Mac 方案。 | [Xbox Game Bar Widget Store](https://learn.microsoft.com/en-us/gaming/game-bar/guide/widget-store) |
| Inworld | AI NPC / character runtime | Unreal Engine / Unity / game runtime | trigger-driven conversation | Inworld Player Component 支持发送带 custom parameters 的 triggers，用于更复杂互动和 goal-driven conversations。对 `desktop-pet` 的启发是：game event 不应只触发固定文案，也可以携带参数进入 AI response，例如 `{event: death, boss: X, attempts: 3}`。 | 事实 + 推断 | 让桌宠回应更具体：不是“加油”，而是结合事件参数做鼓励、建议或召回。 | trigger 参数必须做脱敏和白名单；不要把未脱敏战斗日志、玩家聊天或公司内部字段直接传给 LLM。 | [Inworld Player Component](https://dev.docs.inworld.ai/docs/unreal-engine/runtime/character-reference/InworldPlayerComponent/InworldPlayerComponent) |
| Inworld | AI NPC / character runtime | Unreal Engine / Unity / game runtime | player profile + event history 上下文 | Inworld Character template 的 dialogue graph 使用 player input、player profile、character profile、voice、event history 等 runtime data，并输出 text / TTS。对 `desktop-pet` 的启发是：AI 桌宠上下文应拆成 player-safe profile、pet persona、recent game events、voice config，而不是塞进一个大 prompt。 | 事实 + 推断 | 提升可控性和可调试性，方便不同游戏复用同一套 AI 桌宠 runtime。 | profile 和 event history 涉及隐私；需要保留周期、可见性、删除入口和本地 / 云端边界。 | [Inworld Character template](https://docs.inworld.ai/unreal-engine/runtime/templates/character) |
| Convai | AI NPC / embodied character SDK | Unreal Engine / Unity / Web | multimodal perception + contextual actions | Convai 官方文档和产品页描述 AI characters 可通过插件集成到 Unity / Unreal / Web，具备对话、voice、vision、actions 等能力。对 `desktop-pet` 的启发是：桌宠的 AI 功能矩阵应把“输入感知”和“输出动作”成对拆分，而不是只写 chat。 | 事实 + 推断 | 让桌宠从文本角色变成具身角色：听见、理解环境、说话、做动作。 | vision / environment perception 对游戏隐私敏感；desktop-pet 应优先通过 game event schema，而不是默认 screen capture。 | [Convai docs](https://docs.convai.com/), [Convai official site](https://www.convai.com/) |
| Convai | AI NPC / embodied character SDK | Unreal Engine / Unity / Web | Narrative Design / spatial anchors | Convai Narrative Design 允许通过 spatial anchors 和 step-by-step instructions 引导角色在 3D 环境中行动，同时保持开放对话。对 `desktop-pet` 的启发是：对桌宠可抽象成 scenario anchors，例如“排队中”“副本失败”“活动入口”“长时间 idle”，让 AI 在固定情境下更可靠。 | 事实 + 推断 | 既保留生成式表达，又不会完全失控，适合游戏场景的半开放 companion。 | 桌宠不一定进入 3D 世界；需要把 spatial anchors 转译为游戏事件 / UI 状态 anchors。 | [Convai Narrative Design](https://docs.convai.com/api-docs/plugins-and-integrations/unity-plugin/tutorials/narrative-design) |
| Convai | AI NPC / embodied character SDK | Unreal Engine / Unity / Web | actions 映射到游戏或角色动作 | Convai Actions Guide 说明可以为 character 添加 actions。对 `desktop-pet` 的启发是：LLM 输出不应直接执行任意操作，而应映射到受限 action set，例如 `pet_wave`、`pet_hide`、`show_hint_card`、`open_event_panel`。 | 事实 + 推断 | 把 AI 从“会说话”升级为“会做有限、有边界的事”。 | action set 需要权限、参数校验、失败提示和日志；涉及游戏内状态修改的 action 应默认禁用或二次确认。 | [Convai Actions Guide](https://docs.convai.com/api-docs/plugins-and-integrations/unreal-engine/guides/actions-guide) |
| NVIDIA ACE | AI game character technology | PC / Unreal / on-device + cloud | on-device AI game companion | NVIDIA ACE for Games 提供 speech、intelligence、animation 等 ready-to-integrate cloud / on-device AI models，面向 knowledgeable、actionable、conversational in-game characters。对 `desktop-pet` 的启发是：游戏 AI 桌宠需要同时评估模型能力、延迟、显存、CPU / GPU 占用和渲染负载。 | 事实 + 推断 | AI 能力与游戏性能同等重要，尤其玩家对 FPS / 延迟敏感。 | 本地模型硬件要求高；云端模型涉及网络、成本和数据边界。 | [NVIDIA ACE for Games](https://developer.nvidia.com/ace-for-games) |
| NVIDIA ACE | AI game character technology | PC / Unreal / on-device + cloud | game state 转文本供模型推理 | NVIDIA 官方说明 game state 是 AI game character 感知世界的重要信息源，可以被转写为文本供 SLM 推理。对 `desktop-pet` 的启发是：desktop-pet 应设计 `game_state_to_pet_context` 层，把游戏事件摘要成安全、短、可控的 LLM context。 | 事实 + 推断 | 比直接 screen capture 更稳定、更隐私友好，也更适合多游戏 SDK 复用。 | 事件摘要质量决定 AI 体验；过度摘要会丢失关键信息，过细会增加隐私和 token 成本。 | [NVIDIA ACE autonomous characters](https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/) |
| NVIDIA ACE | AI game character technology | PC / Unreal / on-device + cloud | perception / cognition / action / memory 分层 | NVIDIA 把 autonomous game characters 拆成 perception、cognition、action、memory 等能力，并提到 action selection、TTS、strategic planning、reflection、RAG memory。对 `desktop-pet` 的启发是：AI 功能矩阵应按能力层拆开，而不是把它们合并成“Agent”。 | 事实 + 推断 | 方便 PM 判断哪些能力进 MVP：P0 可先做 perception=game event、action=pet reaction；Agent planning 可留到后续。 | 完整 autonomous agent 对 MVP 过重，且有不可解释、成本、延迟和越权风险。 | [NVIDIA ACE autonomous characters](https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/) |
| NVIDIA ACE | AI game character technology | PC / Unreal / on-device + cloud | AI advisor / tips connected to game data | NVIDIA ACE 页面提到 Total War: PHARAOH AI advisor 使用 on-device small language model 并连接游戏数据，帮助玩家学习系统和机制。对 `desktop-pet` 的启发是：桌宠可以不是“泛聊天”，而是 game data-aware advisor，用于解释系统、活动、装备、任务和新手引导。 | 事实 + 推断 | 对玩家有明确实用价值，也能支持“游戏开发者集成时间缩短 + 玩家留存提升”的双目标讨论。 | 需要授权游戏文档和版本同步；过期知识会导致误导。 | [NVIDIA ACE for Games](https://developer.nvidia.com/ace-for-games) |
| Twitch Extensions | streaming overlay / extension platform | Twitch Web / mobile / broadcaster channel | audience event overlay 启发 | Twitch Extensions 支持 Panel、Overlay、Component 三类扩展，其中 Overlay 是视频上的透明层，Component 可被观众隐藏。对 `desktop-pet` 的启发是：桌宠 overlay 也应区分全局层、局部组件和可隐藏组件，并默认尊重玩家控制权。 | 事实 + 推断 | 提供一套“可见但可隐藏”的交互设计参考，适合低打扰桌宠。 | Twitch overlay 是直播观看场景，不是玩家本机游戏 overlay；不能直接等同游戏客户端集成。 | [Twitch Extensions](https://dev.twitch.tv/docs/extensions/) |
| Twitch Extensions | streaming overlay / extension platform | Twitch Web / mobile / broadcaster channel | sandbox / CSP 安全模型 | Twitch Extensions 使用 sandboxing 和 Content Security Policy 约束扩展。对 `desktop-pet` 的启发是：多游戏可配置 SDK 如果允许插件、脚本或运营模板，应有 sandbox、权限边界和审核机制。 | 事实 + 推断 | 保护玩家和游戏方，降低第三方配置导致的安全和品牌风险。 | 安全模型会增加开发门槛；需要在自由度和审核成本之间平衡。 | [Twitch Extensions](https://dev.twitch.tv/docs/extensions/) |
| Streamer.bot | event-action automation / streamer tool | Windows / Twitch / YouTube / OBS integrations | trigger -> action 编排 | Streamer.bot 将外部 events 配置为 triggers，并把 triggers 绑定到 actions；trigger 可测试、可启用 / 禁用、可按 range / text / dropdown 等条件过滤。对 `desktop-pet` 的启发是：SDK 应提供 developer event simulator 和 trigger debugger，方便 PM / 工程师预览桌宠反应。 | 事实 + 推断 | 大幅降低开发者接入成本，让游戏团队能在不反复进游戏的情况下测试 AI reaction。 | trigger 配置过多会复杂；需要 P0 只保留少量关键事件模板。 | [Streamer.bot Triggers](https://docs.streamer.bot/guide/core/triggers) |
| Streamer.bot | event-action automation / streamer tool | Windows / Twitch / YouTube / OBS integrations | variables 传递上下文 | Streamer.bot 文档说明 variables 可来自 triggers 或前序 sub-actions，并能在后续 actions 中使用。对 `desktop-pet` 的启发是：game event 应携带安全 variables，例如 `level_name`、`quest_id`、`party_size`，进入 prompt template 和 action template。 | 事实 + 推断 | 让同一个 reaction template 可复用到多个游戏、多个事件实例。 | variables 必须做白名单、脱敏和长度限制；不能把原始日志直接传入 LLM。 | [Streamer.bot Introduction](https://docs.streamer.bot/get-started/introduction) |
| Streamer.bot | event-action automation / streamer tool | Windows / Twitch / YouTube / OBS integrations | custom triggers | Streamer.bot 支持用 C# 注册 custom triggers。对 `desktop-pet` 的启发是：SDK 应允许游戏团队扩展 custom game event，但同时要求 schema、权限和调试记录。 | 事实 + 推断 | 支持多游戏差异化，避免平台只能支持固定几类事件。 | custom trigger 可能破坏统一矩阵；Main / PM 需要规定哪些进入标准 schema，哪些只是游戏私有扩展。 | [Streamer.bot Triggers](https://docs.streamer.bot/guide/core/triggers) |
| VTube Studio API | avatar control / VTuber tool API | Windows / macOS / iOS companion | AI intent -> avatar expression / hotkey | VTube Studio Public API 允许插件 / 脚本触发 hotkeys、加载模型、移动模型、获取 events、控制 expressions 等。对 `desktop-pet` 的启发是：LLM 不必直接操控渲染层，而是输出受限的 intent，再映射为表情、动作、位置或特效。 | 事实 + 推断 | 让 AI 回复和桌宠身体一致，例如鼓励时挥手，失败时安慰，胜利时庆祝。 | 需要防止 hotkey 与游戏输入冲突；API 权限和用户授权必须可见。 | [VTube Studio Public API](https://github.com/DenchiSoft/VTubeStudio) |
| VTube Studio API | avatar control / VTuber tool API | Windows / macOS / iOS companion | expression activation 安全边界 | VTube Studio API 支持直接 activate / deactivate expressions，但文档建议优先通过 hotkeys 激活，避免用户无法关闭表情。对 `desktop-pet` 的启发是：桌宠动作工具应优先走可逆、用户可理解的 action，而不是隐藏状态修改。 | 事实 + 推断 | 减少“AI 做了什么我不知道 / 关不掉”的失控感。 | 需要所有 action 有状态回滚和 interrupt；动作同步失败会破坏具身感。 | [VTube Studio Public API](https://github.com/DenchiSoft/VTubeStudio) |
| Open LLM Vtuber | open-source AI companion / desktop pet mode | Windows / macOS / Linux / Web / Electron | desktop pet mode + shared context | Open LLM Vtuber 支持 Window Mode 与 Desktop Pet Mode，并共享设置、conversation history、AI status、memory、Live2D model status。对 `desktop-pet` 的启发是：游戏外桌面宠物和游戏内 / 窗口模式应共享状态，避免玩家切换场景后“宠物失忆”。 | 事实 + 推断 | 形成连续陪伴体验：桌宠可在游戏内轻量出现，游戏外继续对话或提醒。 | shared context 涉及数据保存和删除；公司业务场景需要明确哪些状态可持久化。 | [Open LLM Vtuber Window & Desktop Pet Mode](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) |
| Open LLM Vtuber | open-source AI companion / desktop pet mode | Windows / macOS / Linux / Web / Electron | multi-tool calling / MCP support | Open LLM Vtuber 官方介绍支持 visual perception、multi-tool calling、MCP、browser control、live streaming integration、long-term memory、voice interruption、AI proactive speaking、desktop pet mode。对 `desktop-pet` 的启发是：工具调用、语音、记忆、主动发言都应拆成独立矩阵行，分别评估 P0 / P1 / P2。 | 事实 + 推断 | 给完整 AI companion 能力栈提供开源参考，尤其是桌宠模式下的 interrupt、status、memory、tool call 可视化。 | 功能很多，MVP 不能照单全收；browser control / screen recording / long-term memory 在公司业务边界下风险较高。 | [Open LLM Vtuber Overview](https://docs.llmvtuber.com/en/docs/intro/) |
| Open LLM Vtuber | open-source AI companion / desktop pet mode | Windows / macOS / Linux / Web / Electron | click-through / right-click control / interrupt | Desktop Pet Mode 支持 global top-most、transparent background、mouse click-through、drag、zoom、mouse interaction、右键开关麦克风、interrupt、隐藏 / 退出等。对 `desktop-pet` 的启发是：所有 AI overlay / pet action 都需要配套可逆控制面。 | 事实 + 推断 | 玩家知道自己能静音、打断、隐藏、退出，才更可能接受常驻桌宠。 | 控制太多会显得复杂；需要默认低打扰，同时让高级开关可发现。 | [Open LLM Vtuber Window & Desktop Pet Mode](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) |
| VPet-Simulator | open-source desktop pet / plugin architecture | Windows / WPF / Steam | plugin / MOD 扩展动作和功能 | VPet-Simulator 支持创意工坊，可添加 / 修改动画、物品、工作、说话文本、主题，也支持代码插件添加新动画逻辑和新功能。对 `desktop-pet` 的启发是：多游戏 SDK 需要资产槽位、动作槽位、文本槽位和插件能力，而不是只提供一个固定宠物。 | 事实 + 推断 | 让不同游戏能配置自己的宠物表现，同时复用底层 AI / overlay / event bridge。 | 插件能力若开放给外部，会带来安全、审核、版权和兼容性问题；商业项目需要权限模型。 | [VPet GitHub](https://github.com/LorisYounger/VPet) |
| VPet-Simulator | open-source desktop pet / plugin architecture | Windows / WPF / Steam | embeddable pet core | VPet-Simulator Core 被描述为可嵌入任何 WPF 应用程序的核心。对 `desktop-pet` 的启发是：SDK 形态应考虑“宿主游戏嵌入”和“独立 sidecar app”两条路径，而不是只做一个独立桌面应用。 | 事实 + 推断 | 支持多游戏可配置和快速上线：轻接入可先用 sidecar，深接入再嵌入游戏客户端。 | WPF 不适合直接代表跨平台方案；Mac + Windows 需要重新评估 Electron / Tauri / native。 | [VPet GitHub](https://github.com/LorisYounger/VPet) |
| VPet Mod Maker | desktop pet mod tool | Windows / Steam / GitHub Wiki | no-code / low-code behavior authoring | VPet MOD Maker 支持修改 / 添加文本、动画、物品和 behavioral logic，并支持预览、一键生成和创意工坊。对 `desktop-pet` 的启发是：开发者平台需要 no-code 配置台，能预览“某个 game event 触发某个 pet reaction”。 | 事实 + 推断 | 缩短游戏开发者集成时间，直接对应候选北极星指标。 | no-code 工具容易做重；MVP 可先做 YAML / JSON config + preview，而不是完整编辑器。 | [VPet MOD Maker patch notes](https://steamdb.info/patchnotes/12552366/) |
| tama96 | desktop pet / terminal pet / MCP agent bridge | Desktop / terminal / AI agent | MCP server 控制宠物 action | tama96 官方称 bundled MCP server 可让 AI tools feed、play with、care for pet，并通过 per-action permissions 和 rate limits 控制。对 `desktop-pet` 的启发是：AI 桌宠 action bridge 应从第一天就设计权限和频率限制。 | 事实 + 推断 | 让 AI “能行动但不失控”，适合 Function Calling / MCP / agent bridge 的最小安全样板。 | tama96 是复古养成宠物，不是游戏 SDK；只能借鉴 action permission，不应照搬玩法。 | [tama96 official site](https://www.tama96.com/) |
| Model Context Protocol | agent tool / context protocol | Local / remote tools | AI action tool discovery / execution | MCP 官方规范说明 server 可暴露 tools、resources、prompts，AI application 可发现 tools 并通过 `tools/call` 执行。对 `desktop-pet` 的启发是：可以把 `pet_wave`、`show_hint_card`、`get_game_state_summary`、`mute_pet` 做成可发现的受限 tools。 | 事实 + 推断 | 让 AI companion 有统一 action bridge，未来可连接 SDK、游戏状态、运营活动和开发者工具。 | MCP 本身不定义产品安全策略；工具描述、权限、输入校验和用户确认仍需自行设计。 | [MCP Architecture](https://modelcontextprotocol.io/docs/learn/architecture), [MCP Tools spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) |
| Model Context Protocol | agent tool / context protocol | Local / remote tools | human-in-the-loop tool safety | MCP Tools spec 明确建议应用展示暴露给 AI 的工具、工具调用的视觉指示，以及对操作提供确认。对 `desktop-pet` 的启发是：AI 触发游戏相关 action 时，应在 UI 中展示“宠物准备做什么”，并给玩家或开发者确认 / 拒绝。 | 事实 + 推断 | 解决 AI 桌宠最容易被质疑的信任问题：它到底能读什么、能做什么、做了什么。 | 对高频低风险 action 逐次确认会很烦；需要按 action risk 分级。 | [MCP Tools spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) |
| Unity Gaming Services Triggers | server-side event automation | Unity / Cloud Code / Webhook | server event -> AI workflow | Unity Triggers 可在 server event 发生时自动运行 Cloud Code 或 HTTP webhook。对 `desktop-pet` 的启发是：桌宠 SDK 的事件来源不只客户端，也可能来自 server-side LiveOps，例如赛季结算、活动开启、奖励发放。 | 事实 + 推断 | 支持游戏外召回和运营触达，让桌宠成为可配置的 LiveOps companion。 | server-side 事件进入 AI 话术必须限频和审核；运营通知容易变成骚扰。 | [Unity Triggers](https://docs.unity.com/en-us/triggers) |
| Unity Gaming Services Triggers | server-side event automation | Unity / Cloud Code / Webhook | failure handling / dead letter queue 启发 | Unity Triggers 文档导航包含 failure handling 和 dead letter queue。对 `desktop-pet` 的启发是：如果 game event -> AI reaction 是平台能力，也要设计失败重试、丢弃、回放和开发者可观测性。 | 事实 + 推断 | 提升 SDK 稳定性，方便开发者定位“为什么某个事件没有触发桌宠”。 | 对 MVP 可能偏工程化；可先做本地 event log + replay，再扩展 DLQ。 | [Unity Triggers](https://docs.unity.com/en-us/triggers) |

## 3. 建议 Main Thread 新增 / 修正 / 删除的功能行

### 3.1 建议新增到主矩阵的功能行

| 建议动作 | 建议功能行 | 建议优先级 | 原因 |
|---|---|---|---|
| 新增 | game event bridge / event schema | P0 候选 | 这是 `desktop-pet` 区别于泛 AI companion 的关键能力，证据来自 Overwolf、Inworld、NVIDIA ACE、Unity Triggers。 |
| 新增 | pet reaction template + Rule-based fallback | P0 候选 | 游戏事件触发不能完全依赖 LLM，必须有稳定模板、频率控制和失败兜底。 |
| 新增 | overlay interaction mode：display-only / interactive / hidden | P0 候选 | 证据来自 Overwolf、Steam Overlay、Xbox Game Bar、Open LLM Vtuber；桌宠必须处理输入拦截和退出。 |
| 新增 | action tool permission model | P0 候选 | 证据来自 MCP、tama96、VTube Studio API、Convai Actions；AI 能做动作就必须有权限和可逆控制。 |
| 新增 | developer event simulator / trigger debugger | P1 候选 | 证据来自 Streamer.bot trigger testing、Unity Triggers 可观测性、VPet Mod Maker 预览；可直接服务“集成时间缩短”。 |
| 新增 | game_state_to_pet_context 摘要层 | P0 / P1 候选 | 证据来自 NVIDIA ACE game state 转文本、Inworld event history；比 screen watching 更适合隐私边界。 |
| 新增 | localized / brand-safe response templates | P1 候选 | 证据来自 EOS localized presence；多游戏 SDK 必须支持多语言和品牌语气。 |
| 新增 | avatar action mapping：intent -> expression / animation / voice | P0 候选 | 证据来自 VTube Studio API、Open LLM Vtuber、NVIDIA ACE animation；让 AI 输出和身体表达一致。 |
| 新增 | overlay capability detection / fullscreen fallback | P1 候选 | 证据来自 Overwolf 和 Steam Overlay；避免承诺所有游戏都可交互 overlay。 |
| 新增 | LiveOps event adapter | P1 / P2 候选 | 证据来自 Unity Triggers、Discord / Epic presence；可支持游戏外召回，但需要强限频。 |

### 3.2 建议修正主矩阵现有功能行

| 建议动作 | 原功能方向 | 修正建议 | 原因 |
|---|---|---|---|
| 修正 | 上下文感知 | 拆成 `game event context`、`screen / screenshot context`、`social presence context`、`account / achievement context` | 这些上下文的数据敏感度和工程路径完全不同，不应合并。 |
| 修正 | Function Calling / action tools | 拆成 `pet-only actions`、`game read actions`、`game write actions`、`external social actions` | 各类 action 风险不同，权限和确认策略不同。 |
| 修正 | 桌面驻留 / overlay | 拆成 `desktop always-on pet`、`in-game overlay`、`Game Bar widget / sidecar`、`system tray control` | Steam / Overwolf / Xbox Game Bar 证明这些是不同实现路径。 |
| 修正 | 记忆 | 拆成 `conversation memory`、`game event memory`、`developer config memory` | 玩家记忆和开发者配置不能混在一起，合规边界不同。 |
| 修正 | 主动提醒 | 拆成 `game event triggered`、`LiveOps triggered`、`idle-time proactive`、`social invite triggered` | 主动性来源不同，打扰风险不同。 |

### 3.3 建议删除或降级的功能行

| 建议动作 | 功能行 | 建议处理 | 原因 |
|---|---|---|---|
| 降级 | 默认 screen watching / screenshot understanding | 不放 P0，标为 P1 / 待核验 | 市面 screen-aware 产品有价值，但对公司业务和玩家隐私更敏感；游戏场景优先 event schema。 |
| 降级 | full autonomous game agent | 不放 MVP，标为 P2 / Research | NVIDIA ACE 展示方向，但对 desktop-pet MVP 过重，且有越权、成本、延迟和稳定性风险。 |
| 降级 | streamer / Twitch 互动能力 | P2，除非明确服务直播场景 | Streamer.bot / Twitch Extensions 只提供 event-action 启发，不是核心游戏 SDK 需求。 |
| 删除或合并 | 泛效率提醒 / Pomodoro | 若保留，合并到非 AI 辅助功能，不作为 AI-first 主线 | 与 Desktop Pet for Games 差异化弱，容易偏离游戏 SDK 定位。 |
| 删除或降级 | AI 生成任意宠物资产 / marketplace | P2 / later | 个性化价值存在，但资产版权、IP 审核、生成内容安全复杂，不适合先补 SDK 核心矩阵。 |

## 4. 给 PM Thread 的关键问题

| 问题 | 为什么重要 | 建议归属 |
|---|---|---|
| P0 是否必须包含 `game event bridge`？ | 如果不包含，`desktop-pet` 会很容易退化成泛桌面 AI companion。 | PM Strategy Thread + User |
| 首批 event schema 应覆盖哪些事件？ | 建议从 `session_start`、`idle`、`achievement`、`quest_update`、`death / fail`、`win / level_up`、`friend_invite`、`liveops_event` 中选 3-5 个。 | PM Strategy Thread |
| 默认上下文来源是 game event 还是 screen / screenshot？ | 这决定隐私方案、工程复杂度和用户信任。 | PM Strategy Thread + Engineering Build Thread |
| 桌宠是否进入游戏画面 overlay？ | 如果进入，需要处理 fullscreen、input passthrough、hotkey、反作弊、平台差异。 | PM Strategy Thread + Engineering Build Thread |
| AI action 权限如何分级？ | `pet-only action` 和 `game write action` 的风险完全不同。 | PM Strategy Thread + Engineering Build Thread |
| 开发者集成体验是否作为北极星候选？ | 如果选择“集成时间缩短”，developer preview / event simulator 应前置。 | PM Strategy Thread + User |
| 游戏外召回是否进入 MVP？ | LiveOps / social invite 很有价值，但主动提醒过多会伤害玩家体验。 | PM Strategy Thread + User |

## 5. 来源清单

| Source | 类型 | URL |
|---|---|---|
| Overwolf games.events API | 官方文档 | https://dev.overwolf.com/ow-native/reference/games/events/ |
| Overwolf in-game overlays | 官方文档 | https://dev.overwolf.com/ow-native/guides/product-guidelines/app-screen-behavior/in-game-overlays/ |
| Steam Overlay | 官方文档 | https://partner.steamgames.com/doc/features/overlay?language=english |
| Discord Rich Presence | 官方文档 | https://docs.discord.com/developers/platform/rich-presence |
| Discord Setting Rich Presence | 官方文档 | https://docs.discord.com/developers/discord-social-sdk/development-guides/setting-rich-presence |
| Epic Accounts & Social | 官方产品页 | https://onlineservices.epicgames.com/en-US/accounts-social |
| Epic Online Services SDK 1.18 update | 官方更新 | https://onlineservices.epicgames.com/en-US/news/epic-online-services-sdk-1-18-is-live-here-s-what-you-need-to-know |
| Xbox Gaming Copilot on Game Bar | 官方新闻 | https://news.xbox.com/en-us/2025/08/06/gaming-copilot-beta-begins-rolling-out-to-xbox-insiders-on-game-bar-today/ |
| Xbox Gaming Copilot | 官方产品页 | https://www.xbox.com/en-US/gaming-copilot |
| Xbox Game Bar Widget Store | 官方文档 | https://learn.microsoft.com/en-us/gaming/game-bar/guide/widget-store |
| Xbox Game Bar Update | 官方新闻 | https://news.xbox.com/en-us/2020/07/01/xbox-game-bar-update-july-2020/ |
| Inworld Player Component | 官方文档 | https://dev.docs.inworld.ai/docs/unreal-engine/runtime/character-reference/InworldPlayerComponent/InworldPlayerComponent |
| Inworld Character template | 官方文档 | https://docs.inworld.ai/unreal-engine/runtime/templates/character |
| Convai docs | 官方文档 | https://docs.convai.com/ |
| Convai official site | 官方产品页 | https://www.convai.com/ |
| Convai Narrative Design | 官方文档 | https://docs.convai.com/api-docs/plugins-and-integrations/unity-plugin/tutorials/narrative-design |
| Convai Actions Guide | 官方文档 | https://docs.convai.com/api-docs/plugins-and-integrations/unreal-engine/guides/actions-guide |
| NVIDIA ACE for Games | 官方产品页 | https://developer.nvidia.com/ace-for-games |
| NVIDIA ACE autonomous characters | 官方新闻 | https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/ |
| Twitch Extensions | 官方文档 | https://dev.twitch.tv/docs/extensions/ |
| Streamer.bot Triggers | 官方文档 | https://docs.streamer.bot/guide/core/triggers |
| Streamer.bot Introduction | 官方文档 | https://docs.streamer.bot/get-started/introduction |
| VTube Studio Public API | GitHub 官方 API 页 | https://github.com/DenchiSoft/VTubeStudio |
| Open LLM Vtuber Overview | 官方文档 | https://docs.llmvtuber.com/en/docs/intro/ |
| Open LLM Vtuber Window & Desktop Pet Mode | 官方文档 | https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/ |
| VPet GitHub | GitHub | https://github.com/LorisYounger/VPet |
| VPet MOD Maker patch notes | SteamDB / Steam Community patch mirror | https://steamdb.info/patchnotes/12552366/ |
| tama96 | 官方产品页 | https://www.tama96.com/ |
| MCP Architecture | 官方文档 | https://modelcontextprotocol.io/docs/learn/architecture |
| MCP Tools spec | 官方规范 | https://modelcontextprotocol.io/specification/2025-06-18/server/tools |
| Unity Triggers | 官方文档 | https://docs.unity.com/en-us/triggers |
