# COMPETITOR AI FEATURE MATRIX PART: Desktop AI Companions

> Thread: AI Trend Radar Thread 分片 Agent A
> Scope: 桌面 AI companion / screen-aware AI desktop pet 深挖
> Date: 2026-05-07
> Language rule: Product 保留英文；必要专业术语保留英文；其余中文描述。
> Boundary: 本文件只作为 Agent A 分片输入，不直接修改主调研文档或 xlsx。

## 1. 证据规则

| 项目 | 说明 |
|---|---|
| 优先来源 | 官方产品页、官方帮助中心、GitHub、Steam、官方文档 |
| 证据类型 | `事实` = 来源明确写出；`事实 + 推断` = 来源有功能事实，体验作用由本线程推断；`待核验` = 来源暗示或营销表述不足，需要实测 / 更多官方文档 |
| 本分片重点 | 每个产品的每个 AI 功能拆成独立行，方便 Main Thread 合并到总表和 xlsx |
| 不纳入事实 | 社区评论、二手媒体、未打开验证的链接、无法确认的传闻 |

## 2. 产品 AI 功能证据矩阵

| Product | 类别 | 平台 | AI 功能点 | 功能解释 | 证据类型 | 对体验的作用 | 局限 / 风险 | 证据来源 |
|---|---|---|---|---|---|---|---|---|
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Real-time voice conversation | 支持实时双向语音对话，同时保留 text chat，用户可以把桌宠当作常驻语音 companion 召唤。 | 事实 | 语音降低交互摩擦，让角色不像聊天窗口，而像在桌面旁边陪伴。 | 麦克风权限、语音延迟、噪声环境和误触发都需要显式控制。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Persistent memory + evolving personality | 官方说明 Ciel 会记住用户并随相处时间变得熟悉，完整功能表还列出 user profile、conversation memory、cross-session persistence。 | 事实 | 长期记忆让陪伴关系具备连续性，减少每次从零开始的感觉。 | 必须提供记忆查看、编辑、删除、重置和保存位置说明；错误记忆会伤害信任。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Contextual presence / idle observations | 会根据 workflow、media 和 current activity 产生 subtle comments；完整功能表列出 observation context、progressive tracker 和 optional idle companion comments。 | 事实 + 推断 | 让桌宠在用户没有主动提问时也显得“活着”，适合低频主动关怀。 | 主动评论频率过高会变成打扰，需要 quiet hours、rate limit 和显式开关。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Window focus tracker | 官方列出 active app monitoring with duration tracking，可记录当前活跃应用和持续时间。 | 事实 | AI 可以根据当前任务类型调整语气和提示时机，例如 coding、gaming、music。 | 读取窗口焦点属于敏感桌面上下文，需要 opt-in、范围说明和不记录敏感窗口策略。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Local Vision / screenshot analysis | Premium 功能列出 on-device image and screenshot analysis。 | 事实 | 支持 AI 理解用户提供或当前屏幕中的视觉信息，比纯文本 companion 更贴近桌面场景。 | 截图可能包含敏感内容；应提供区域选择、预览确认、本地处理说明和禁用入口。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | System audio listener | Plus / Voice & Audio 功能中列出 transcribes speaker and game audio。 | 事实 | 让 companion 能听到系统声音或游戏声音，从而进行更情境化反应。 | 系统音频监听隐私风险高，也可能涉及版权内容；默认不应开启。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Game events | Live / Messaging Bridges 中列出 event detection across many supported titles。 | 事实 | 对 `desktop-pet` 很关键：说明泛桌面 companion 已经开始接近 game context，而不仅是 screen watching。 | 具体支持哪些游戏、事件粒度、数据路径需要逐项核验；不能默认适合 SDK 化。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Tool use / multi-step tools | AI can read/write files in bridge folder with controls，并支持 sequential chained tool execution。 | 事实 | 让 companion 从聊天扩展到受控行动，适合提醒、文件读写、工作流执行等任务。 | 文件读写权限必须限制在沙盒目录；multi-step tool 容易引入越权和失败恢复问题。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Cloud LLM providers / GPU offload | 支持 OpenRouter、OpenAI、Anthropic 和 cloud GPU offload，同时也有 local / offline 定位。 | 事实 | 在本地算力不足时提供能力上限，也给用户模型选择权。 | privacy-first 表述必须按功能区分 local 与 cloud；否则容易让用户误解数据是否离开设备。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | Windows PC | Automatic lip-sync + expressions | Voice & Audio 列出 automatic lip-sync，Character & Avatar 列出 emotion expressions、gestures 和 chained animations。 | 事实 | 把 AI 输出映射成表情、动作和口型，增强具身化陪伴感。 | 表情与内容不匹配会显得廉价；需要稳定的 emotion mapping 和 fallback 动作。 | [官网](https://phasma.ai/) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Context-aware quick chat | 通过快捷键召唤，官方称它知道用户正在使用的 app，并提供 contextual、screen-aware help。 | 事实 | 减少用户描述上下文的成本，适合桌面即时问答。 | 需要明确读取的是 active app、window title、screenshot 还是更多数据；公司场景需默认收窄。 | [官网](https://clawster.pet/) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Screenshot questions | 用户可截取屏幕任意区域并提问，Clawster 根据截图解释 app、网站或按钮。 | 事实 | 把 AI 从泛聊天转成“看得见当前问题”的桌面助手。 | 截图中可能出现密钥、聊天、公司资料；需要局部选择、预览确认和不保存策略。 | [官网](https://clawster.pet/) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Active app / window awareness | GitHub README 写明 screen awareness detects active app and window for contextual help。 | 事实 | 对用户当前任务更敏感，能减少无关回答。 | 对 window metadata 的读取边界要透明；敏感 app 需要 blocklist。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Local OpenClaw gateway | 官方称 deep dive 由本地 OpenClaw gateway 驱动，用于隐私和扩展。 | 事实 | 本地 gateway 可以统一处理上下文、请求、权限和长对话。 | 对普通用户安装和诊断成本更高；gateway 权限过宽会成为安全风险。 | [官网](https://clawster.pet/) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Full assistant panel | 支持打开完整 assistant panel 做更长对话和设置调整。 | 事实 | 兼顾轻量 quick chat 与深度对话，避免桌宠气泡承载过多复杂任务。 | 如果 assistant panel 功能过多，产品会从 pet 变成通用 assistant，定位可能发散。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Customizable personality | GitHub README 写明可编辑 `IDENTITY.md` 和 `SOUL.md` 来塑造行为。 | 事实 | 说明 persona 可以文件化配置，适合 `desktop-pet` 未来做多游戏 persona presets。 | 文件配置对普通集成方不够产品化；需要可视化 preview 和审核机制。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Clawster | 屏幕感知 AI 桌宠 | macOS | Attention seeking | GitHub README 写到 feeling lonely 时会靠近 cursor。 | 事实 + 推断 | 让桌宠不仅被动回答，还能以低成本行为表达“存在感”。 | 主动靠近鼠标可能干扰操作；必须可关闭且避免全屏游戏中触发。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Desktop Pet | AI assistant 桌宠 | Windows / macOS | AI assistant with BYO OpenAI API key | 用户右键设置自己的 OpenAI API key 后可进入 Assistant Mode 进行 AI chat。 | 事实 | 把通用 LLM assistant 包装成宠物入口，降低工具感。 | BYO key 有门槛；AI 数据会到 OpenAI provider，和“本地隐私”表述需要分开解释。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | Windows / macOS | Voice / text chat | 官方写明可以用 voice 或 text 和宠物聊天。 | 事实 | 语音适合低摩擦召唤，文本适合安静场景。 | 语音需要麦克风权限、wake word 误触发处理和 mute 入口。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | Windows / macOS | Wake word voice commands | 支持 wake word detection，默认示例为 `Hey Pet`，可说出提醒、天气、计时器等请求。 | 事实 | 让桌宠像轻量语音助手，用户不用先打开聊天框。 | wake word 长期开启会带来隐私焦虑；必须有清晰麦克风状态。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | Windows / macOS | Smart reminders / timer commands | 示例包含 set timer、remind me、weather 等语音命令。 | 事实 | 让桌宠常驻桌面有工具价值，而不只是陪伴。 | 对游戏桌宠来说，泛效率提醒应谨慎，最好映射到游戏活动 / 回流提醒。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | Windows / macOS | Local preferences and non-persistent conversations | 官方说明设置本地保存，conversations are not saved permanently。 | 事实 | 降低用户对数据收集的担忧。 | 需要同时说明 AI chat 请求仍依赖网络和用户 OpenAI API key。 | [官网](https://desktoppet.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | macOS / Windows | Connect to OpenClaw chat completions | Hiora 连接 OpenClaw bot 的 chat completions API，让 agent responses 通过桌面 avatar 表达。 | 事实 | 把已有 AI bot 从不可见服务变成桌面上有脸、有声音的 companion。 | 它更像 avatar layer，不是完整 companion 产品；能力深度取决于外部 OpenClaw bot。 | [官网](https://hiora.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | macOS / Windows | Desktop voice companion | 设置流程中明确称其为 desktop voice companion app，用户说话后 AI 语音回应。 | 事实 | 对话方式更自然，适合作为低摩擦桌面入口。 | 实时语音对延迟、打断、麦克风权限要求高。 | [官网](https://hiora.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | macOS / Windows | Lip-synced responses | AI 回复以 full lip sync、live expressions、natural head movements 表达。 | 事实 | 让 AI 输出有具身化临场感。 | 口型、表情和语音不同步会破坏真实感。 | [官网](https://hiora.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | macOS / Windows | Avatar identity from Avatarium | 用户通过 Avatarium 获取或自定义 avatar，再填入 Hiora。 | 事实 | 支持把同一个 AI 能力换成不同角色外观。 | 对游戏 SDK 来说需要处理 avatar 权限、品牌资产和 IP 审核。 | [官网](https://hiora.app/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | Windows / macOS | AI provider connection | 用户可连接 OpenAI、Anthropic 或 local models。 | 事实 | 让用户根据成本、能力和隐私选择模型来源。 | provider 数据路径和 key 管理需要清晰；local models 对硬件有要求。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | Windows / macOS | Voice or text conversation | 支持通过 voice 或 text 与 VRM companion 交谈。 | 事实 | 形成 AI companion 的基础入口，兼顾自然语音和低干扰文本。 | 语音链路需要 ASR、TTS、权限、打断和错误恢复。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | Windows / macOS | Scripts and automations | 官方流程包含 set up scripts and automations，让 companion 帮助日常任务。 | 事实 | 从“会聊天”扩展到“能做事”。 | 脚本权限需要白名单、审批和失败回滚；否则存在本地安全风险。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | Windows / macOS | Local conversation privacy | 官方说明 conversations stay on device，应用不发送到自身服务器，和 AI provider 通信从用户电脑直接发生。 | 事实 | 适合隐私敏感的桌面 companion 叙事。 | 如果使用外部 provider，数据仍会到 provider；需要按 provider 解释。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | Windows / macOS | VRM emotional reaction | 官网描述 companion talks, reacts with emotions and helps with daily tasks。 | 事实 | 用情绪反应承接 AI 输出，让桌宠更像角色。 | 公开资料未细分情绪识别、映射逻辑和触发规则，需进一步核验。 | [官网](https://www.desk-buddy.fun/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | Multi-backend LLM support | 支持 OpenAI-compatible、Ollama、Claude、Gemini、DeepSeek、Groq、llama.cpp 等后端。 | 事实 | 适合作为可插拔模型架构参考，能支持 cloud 与 local 两种路径。 | 配置复杂，面向普通玩家或游戏团队需要产品化封装。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/llm/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | Voice dialogue | Web Mode 支持 voice dialogue、text input、microphone control 和 voice detection thresholds。 | 事实 | 是语音 companion 的核心能力，支持更自然的互动。 | ASR 阈值、噪声、打断和麦克风自动控制会影响体验稳定性。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | AI proactive speech | Agent 设置中可允许 AI 在 idle 状态主动发言，也能通过 interrupt / raise hand 触发。 | 事实 | 支持主动陪伴、提醒和低频关怀。 | 主动发言必须有频率阈值和关闭入口，否则常驻桌宠会打扰用户。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | Interrupt current speech | 支持用户点击、说话或发送消息时中断当前 AI speech，并只保留中断前内容。 | 事实 | 对语音 companion 很关键，能恢复用户控制感。 | interrupt 需要和 TTS、字幕、动画、memory 同步，否则状态会错乱。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | Basic memory agent | Agent 文档说明 default `basic_memory_agent` 具备 short-term memory、conversation record storage / switching。 | 事实 | 支持连续对话和多会话切换。 | 短期记忆不等于长期关系记忆；记忆保存位置和删除机制仍需设计。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/agent/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | Character personality prompts | 支持修改 `persona_prompt`，也支持添加多个角色配置并在前端切换。 | 事实 | 可为不同角色配置语气、语言风格和人格。 | prompt 可控性依赖模型能力；对游戏 IP 需要更严格的风格边界和审核。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/character_settings/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | HumeAI EVI agent | 文档列出 HumeAI Agent，可使用 empathic voice interface，但也说明当前架构无法完全利用其情绪音频能力。 | 事实 + 待核验 | 提供 emotion-aware voice 的方向参考。 | 当前实现有架构限制和成本风险；不能当成已完全落地能力。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/agent/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | Web / Electron desktop | Desktop pet AI status sharing | Desktop Pet Mode 与 Window Mode 共享 conversation history、AI status、memory 和 Live2D model status。 | 事实 | 切换窗口 / 桌宠形态时不丢状态，适合桌面 companion 连续体验。 | 状态共享需要防止 memory 污染和不同角色之间上下文串扰。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) |
| Utsuwa | 开源 VRM AI companion | macOS desktop / Web | AI chat | 官方定位为 AI chat、voice、semantic memory 的 VRM avatar viewer。 | 事实 | 把文字对话承载到可见 3D 角色上。 | 纯聊天容易同质化，需要上下文或场景差异化。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | macOS desktop / Web | Voice input and TTS providers | 支持 Groq Whisper / Web Speech API 作为 voice input，并支持 ElevenLabs / OpenAI TTS。 | 事实 | 支持 voice-in / voice-out，使 companion 更自然。 | 多 provider 组合会带来配置、成本和延迟管理问题。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | macOS desktop / Web | Semantic memory with local embeddings | 使用 local AI embeddings 构建 memory graph，按语义找回过去对话。 | 事实 | 让长期陪伴更连贯，能记住主题而不是只匹配关键词。 | 语义记忆可能误召回或过度保存；需要用户可见的 memory controls。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | macOS desktop / Web | Relationship stages / mood tracking | 官方说明可 track affection、trust、mood across relationship stages。 | 事实 | 把 companion 关系变成可成长的状态，增强留存循环。 | 关系数值化可能强化情感依赖；需要透明和健康边界。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | macOS desktop / Web | BYO keys / local model options | 支持 OpenAI、Anthropic、Google、DeepSeek、xAI，或使用 Ollama / LM Studio 本地运行。 | 事实 | 允许用户在能力、成本、隐私之间选择。 | BYO key 对普通用户有门槛；local model 需要硬件和模型管理。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | macOS desktop / Web | Local-first storage | 数据保存在设备 IndexedDB，无需账号，支持 save file export / import。 | 事实 | 增强用户对本地 companion 的控制感。 | IndexedDB 不是企业级数据治理方案；跨设备同步和备份需另行设计。 | [官网](https://www.utsuwa.ai/) |
| HoloWaifu | 3D desktop AI companion | Windows | Long-term memory + adaptive personality | 官方称具备 long-term memory 和 adaptive personality，能形成 personalized conversations。 | 事实 | 长期记忆和人格演化增强关系感。 | 产品定位偏成人陪伴方向，`desktop-pet` 只能抽象借鉴机制，不能照搬内容风格。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | Windows | Real-time voice-to-voice | 支持 natural voice interaction 和 voice-to-voice communication。 | 事实 | 让桌面角色像实时陪伴者，而不是文字 bot。 | 实时语音的成本、延迟和打断体验是主要风险。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | Windows | Lip-sync | 支持 real-time lip-sync，官方 FAQ 也强调 3D avatar、voice、lip-sync。 | 事实 | 让 AI 回答和角色身体同步，提升沉浸感。 | 口型延迟或错位会显著降低质感。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | Windows | Always-on overlay while gaming / streaming | 官方称 interactive desktop overlay assistant stays on top while users game, stream, or work。 | 事实 | 对游戏场景有参考价值：桌宠可以在游戏或工作时常驻。 | 游戏全屏、FPS、遮挡、反作弊和隐私都需谨慎处理。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | Windows | Local chat history control | 官方称 local chat history stays on device and can be deleted anytime。 | 事实 | 给用户数据控制感，适合长期 companion。 | 需要进一步核验模型请求是否经过云 provider；“local history”不等于“local inference”。 | [官网](https://holowaifu.app/) |
| PokeClaw | OpenClaw 桌面工作 companion | macOS / Windows | OpenClaw-based desktop companion | 官方称基于 OpenClaw，有 guided setup、local-first workflows 和 user-approved integrations。 | 事实 | 展示了把本地 agent runtime 包装成桌面 companion 的产品路径。 | 偏工作场景，不是情感桌宠；游戏侧需要重做触发和权限模型。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | macOS / Windows | Contextual memory | 官方称 remembers useful project context across sessions，并在本地优先保存。 | 事实 | 让桌面 AI 能跨 session 记住工作上下文。 | 记忆范围、保留周期和删除机制仍需详细核验。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | macOS / Windows | User-approved integrations | 用户只连接已授权的 services，组织 messages、notes、tasks、email、webhook。 | 事实 | 把 AI action 权限限定在用户批准的集成中。 | 游戏 SDK 类似需要事件权限白名单和 action approval，不能默认全开。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | macOS / Windows | Built-in skills / workflows | 包含 55+ built-in skills，并可添加需要 review / approve 的 repeatable workflows。 | 事实 | 提供“技能库 + 审批”的 agent capability 参考。 | skill marketplace / 插件执行存在 prompt injection 和权限风险。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | macOS / Windows | Recurring task scheduling | 包含 recurring task scheduling。 | 事实 | 说明 companion 可以承接主动任务和周期性提醒。 | 对游戏召回很有启发，但必须有频率上限和 opt-out。 | [官网](https://pokeclaw.io/) |
| Lily | screen-aware desktop AI agent | macOS（Windows / Linux 支持表述待核验） | Natural voice interaction | 官方称用户可以自然语音对话，无需 wake word。 | 事实 | 降低桌面 agent 使用门槛，像 teammate 一样交互。 | 无 wake word 可能暗示持续监听或快捷触发不清，需要核验触发机制。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | macOS（Windows / Linux 支持表述待核验） | Screen awareness | 官方称 Lily sees what you see，可针对任意 open window 或 application 提问。 | 事实 | 提供强 screen-aware 桌面帮助体验。 | 屏幕读取极敏感；应明确是否本地处理、是否截图、是否能排除应用。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | macOS（Windows / Linux 支持表述待核验） | Smart dictation | 用户可向任意输入框 dictation，Lily 会格式化和纠正。 | 事实 | 把语音转成跨应用输入能力，实用性强。 | 输入自动化需防误输入；需要确认和撤销。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | macOS（Windows / Linux 支持表述待核验） | Desktop action control | 官方称可 automate clicks and navigation，处理 repetitive tasks。 | 事实 | 从 companion 进入 computer-use agent 范畴。 | 自动点击 / 导航风险高，必须做权限、确认、日志和回滚。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | macOS（Windows / Linux 支持表述待核验） | Preference learning | 官方称 Lily learns your preferences and gets better over time。 | 事实 + 待核验 | 提供个性化和长期使用价值。 | 未看到具体 memory 实现、可编辑性和删除机制，需要进一步核验。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | macOS（Windows / Linux 支持表述待核验） | Local processing / privacy | 官方称 data never leaves device and local processing。 | 事实 + 待核验 | 对 screen-aware agent 是核心信任点。 | 需要实测或隐私文档确认模型是否完全本地、是否调用云服务。 | [官网](https://www.heylily.app/) |
| DeskMochi | 浮动桌面 AI assistant / companion | Windows / macOS | Floating AI answers | Mochi floats on desktop，用户 hover / type 即可获得 AI answers。 | 事实 | 减少 app switching，让 AI 像常驻小入口。 | 陪伴感弱于角色型 pet，更偏效率工具。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | Windows / macOS | Screenshot & ask | Pro 功能列出 screenshot & ask anything on screen。 | 事实 | 让用户直接围绕当前屏幕提问。 | 截图隐私、保存策略和敏感内容过滤需要核验。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | Windows / macOS | Multi-model access | 页面列出 Gemini、GPT、Claude 等模型。 | 事实 | 给用户不同速度、成本和风格选项。 | 模型供应商路径复杂；需要清楚区分数据会到哪些 provider。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | Windows / macOS | Micro-task AI operations | 官网列出 rewrites、lookups、screenshots、explanations、conversions、definitions、summaries。 | 事实 | 让桌面 AI 处理碎片任务，避免污染主聊天工具。 | 不直接形成情感陪伴；对 `desktop-pet` 只能借鉴“轻量即时任务”模式。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | Windows / macOS | Companion skins | 支持 Mochi、Mechy、Boba 三种外观。 | 事实 + 推断 | 用轻量角色外观增强亲切感。 | 外观不等于 persona；如果没有记忆和行为差异，陪伴感有限。 | [官网](https://www.deskmochi.com/) |
| UPochi | LLM-infused 桌面 companion | macOS / Windows | LLM-infused chat | 官方写明 chat with your pet like other AI assistants，宠物 understands you and responds with personality。 | 事实 | 让传统桌宠具备人格化对话能力。 | 公开资料未说明模型 provider、记忆、内容安全和 fallback。 | [官网](https://www.upochi.com/) |
| UPochi | LLM-infused 桌面 companion | macOS / Windows | Personality traits and names | 用户可编辑宠物 characteristics、personality traits 和 names。 | 事实 | 让 pet 更贴合用户喜好，降低通用 assistant 感。 | 需进一步确认这些 traits 是否真正进入 LLM prompt 或只是展示字段。 | [官网](https://www.upochi.com/) |
| UPochi | LLM-infused 桌面 companion | macOS / Windows | Friend room chat / teleport | 官方写到 join rooms with friends' pets and chat with friends seamlessly。 | 事实 + 待核验 | 多宠物 / 房间可能带来社交陪伴和传播。 | 这里更像社交功能，AI 是否参与 group chat 不清楚，需核验。 | [官网](https://www.upochi.com/) |
| UPochi | LLM-infused 桌面 companion | macOS / Windows | Offline mode / no tracking | 页面列出 no tracking、offline mode、low memory。 | 事实 + 待核验 | 对桌面常驻产品有信任和性能价值。 | 与 LLM-infused chat 的网络 / provider 关系未说明，不能直接写成 AI 完全离线。 | [官网](https://www.upochi.com/) |
| Ai Vpet | Steam AI 虚拟桌宠 | Windows / Steam | LLM text conversation | Steam AIGC disclosure 写明用户可通过 text 和 AI desk pet 对话，回复由 large language model 生成。 | 事实 | 构成 AI 情感陪伴的基础能力。 | 连接第三方 AI 内容生成服务，数据和内容安全边界需要说明。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | Windows / Steam | Voice conversation | Steam AIGC disclosure 写明支持 voice 与 AI desk pet 对话。 | 事实 | 提升陪伴和临场感。 | 语音涉及麦克风、网络、TTS / ASR 成本和延迟。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | Windows / Steam | AI emotional companion | Steam 描述中定位为 AI emotional companion，可聊天、学习和娱乐。 | 事实 + 推断 | 把产品目标从工具转向情绪陪伴。 | 情感依赖、未成年人、内容安全和边界提示需要关注。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | Windows / Steam | AI customized platform | 通过 AI 技术创建桌宠形象、声音、角色设计和交互方式。 | 事实 | 降低个性化宠物资产和 persona 的生成门槛。 | 生成资产涉及版权、IP 风格、审核和品牌一致性。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | Windows / Steam | Third-party AI service | Steam 页面列出连接第三方服务进行 AI 内容生成。 | 事实 | 说明能力不是纯本地，可能换来更强模型效果。 | 对 `desktop-pet` 的公司边界来说，第三方 provider 路径必须显式披露和可关闭。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | Text or voice chat | 支持 text 或 voice chat，按住 F10 说话，并以语音回复。 | 事实 | 把 OpenClaw agent 包装成具身桌宠入口。 | 作为目录插件，成熟度和安全审计需要单独核验。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | LLM-powered personality | 官方 README 写明 LLM-powered personality，不只是 chatbot。 | 事实 | 强化角色一致性和陪伴感。 | persona 由 prompt 文件驱动，仍有 drift 和不合规输出风险。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | Configurable SOUL.md / IDENTITY.md | 支持通过 `SOUL.md` 和 `IDENTITY.md` 定义 personality、speech style、backstory。 | 事实 | 对多游戏 SDK 很有参考：persona 可以文件化、模板化、版本化。 | 文件配置需要审核工具和预览，否则集成方容易写出不可控 persona。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | One-click persona generation from VRM screenshot | 截取 VRM 模型截图后，AI 自动生成匹配角色设定。 | 事实 | 让角色资产与人格设定更快对齐，适合 prototype 阶段。 | 自动生成 persona 涉及风格、IP、合规和幻觉，需要人工确认。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | Screen observation | README 写明 watches your screen and understands what you're doing，并给出游戏、debug、视频、文档例子。 | 事实 | 强 screen-aware 体验，尤其和游戏场景关联高。 | 屏幕观察风险极高，应优先考虑 game event schema，而不是默认 screen watching。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | TTS provider selection | 支持 Edge TTS 或 Qwen TTS，多语言 / 多声音。 | 事实 | 用语音强化角色存在感和可爱度。 | 云 TTS / 本地 TTS 的数据路径、成本和可用性需要分开说明。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | macOS / Windows | Multi-provider LLM via OpenClaw runtime | 技术栈写明 AI 通过 OpenClaw runtime，支持多种模型。 | 事实 | 让桌宠能力不绑定单一模型供应商。 | 依赖 OpenClaw runtime 的安全和配置质量；插件生态需防 prompt injection。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| OpenPets | AI agent 状态桌宠 / adjacent reference | macOS | Local MCP server for pet control | 暴露本地 MCP endpoint，agent 可以 wake、notify、animate、clear messages、check status。 | 事实 | 说明桌宠可作为 AI agent 的“可见状态层”，不一定要自己做 LLM。 | 不是面向玩家的 AI companion；更适合作为 SDK / agent bridge 参考。 | [官网](https://openpets.sh/) |
| OpenPets | AI agent 状态桌宠 / adjacent reference | macOS | Agent progress visualization | 用桌宠显示 agent progress、review prompts、completion states。 | 事实 | 把不可见 agent 工作转为可感知状态，降低等待焦虑。 | 对游戏玩家价值需要重新定义，不能直接搬到 game companion。 | [官网](https://openpets.sh/) |
| OpenPets | AI agent 状态桌宠 / adjacent reference | macOS | Pet command interface | 支持 `openpets notify` 和 `openpets animate` 等命令触发消息和动作。 | 事实 | 为 `desktop-pet` 的 game event bridge 提供相似接口思路：外部系统发事件，桌宠展示反馈。 | 命令接口需要权限、速率限制和事件 schema，否则容易被滥用。 | [官网](https://openpets.sh/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Realtime voice chat | 官方文档写明 realtime voice chat，支持 client-side speech recognition 和多个 TTS providers。 | 事实 | 支持自然对话和角色陪伴。 | 多端语音一致性、延迟和 provider 管理复杂。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Live2D / VRM embodied character | 支持 Live2D / VRM model、auto-blink、look-at 等。 | 事实 | 让 AI companion 有可见身体，是桌宠体验基础。 | 资产管线和性能优化是主要工程成本。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Game integration | 官方写明能和用户一起 play Minecraft and Factorio。 | 事实 | 这是和 `desktop-pet` 高相关的方向：AI companion 进入游戏行为而非只在桌面聊天。 | 具体游戏集成方式、权限、安全和稳定性需要深挖；不能泛化到所有游戏。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Screen awareness | 官方文档写明 companion can see your screen。 | 事实 | 支持屏幕上下文感知，提高回答相关性。 | 屏幕内容隐私敏感，游戏 SDK 应优先结构化事件。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Persistent memory with DuckDB | 官方文档写明 memory system uses DuckDB for context-aware conversations across sessions。 | 事实 | 支持跨 session 的连续陪伴。 | 记忆存储、编辑、删除、迁移和加密需进一步确认。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Multi-provider / local models | 支持 OpenAI、Claude、Gemini、DeepSeek、Ollama、OpenRouter 和 40+ providers。 | 事实 | 对 SDK 平台有参考：模型层可抽象为 provider adapter。 | provider 过多会增加配置和测试复杂度。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Plugin architecture | 官方文档列出 plugin architecture，可扩展 integrations、tools、behaviors。 | 事实 | 与多游戏 SDK 的可扩展能力高度相关。 | 插件需要权限边界、审核和版本兼容策略。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Web / Windows / macOS / Linux / Mobile | Desktop local inference acceleration | GitHub README 写明 desktop version 可使用 NVIDIA CUDA 和 Apple Metal。 | 事实 | 说明高能力 companion 可以尝试本地推理路径。 | 本地推理依赖硬件，不适合所有玩家机器。 | [GitHub](https://github.com/moeru-ai/airi) |
| Amica | 开源 3D AI companion | Web / Desktop via Tauri | Natural voice chat | 官方写明 3D avatar 可通过 natural voice chat 沟通，GitHub 也说明 speech recognition 与 voice synthesis。 | 事实 | 形成低摩擦具身对话体验。 | ASR / TTS provider 组合多，配置复杂。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | Web / Desktop via Tauri | Vision | 官方写明 companion can communicate via voice chat and vision，GitHub 技术栈列出 vision backend。 | 事实 | 让 companion 能理解视觉信息，增强上下文能力。 | 视觉输入隐私敏感，需确认是否本地、是否上传、是否保存。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | Web / Desktop via Tauri | Emotion engine | 官网写明 emotion engine expresses feelings，包含 fourteen emotions and animations。 | 事实 | 让 AI 输出更像角色反应，而不是文字回答。 | 情绪映射需要稳定，不然会与内容冲突。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | Web / Desktop via Tauri | Automated subconscious / proactive behavior | Amica Life 会 boredom、engage、share thoughts、take action，ignored 后 sleep。 | 事实 | 让角色在用户不主动输入时也能形成生命感。 | 主动行为和 action 权限必须可控，否则容易打扰或越权。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | Web / Desktop via Tauri | Custom AI backend | 支持使用任意 AI model backend，也可本地运行；GitHub列出 OpenAI-compatible、Ollama、KoboldCpp、OpenRouter 等。 | 事实 | 支持私有化、自托管和不同能力层级。 | 配置和依赖多，对普通玩家门槛高。 | [GitHub](https://github.com/semperai/amica) |
| Amica | 开源 3D AI companion | Web / Desktop via Tauri | Interruptable realtime voice | 官网写明 automatic voice start / stop detection，并可随时 interrupt。 | 事实 | 对自然语音对话和用户控制感很重要。 | interrupt 需要和字幕、动画、memory 同步。 | [官网](https://www.heyamica.com/) |
| Vector Companion | 本地 multimodal AI companion | Windows / macOS / Linux（开源运行环境） | Periodic screen vision | README 写明会周期性截图、caption images，并通过 OCR 读取屏幕文字。 | 事实 | 让 companion 能围绕游戏、视频、网页等当前内容发言。 | 高隐私风险，且周期性截图对性能和用户信任要求高。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | Windows / macOS / Linux（开源运行环境） | Computer audio transcription | README 写明实时转录 computer audio output。 | 事实 | AI 能听到用户正在看的视频或玩的游戏音频，形成更自然评论。 | 音频监听涉及隐私和版权，且需额外 audio loopback 配置。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | Windows / macOS / Linux（开源运行环境） | Microphone transcription | README 写明实时听取用户麦克风输入。 | 事实 | 支持用户随时用语音加入对话。 | 麦克风常开风险高，需要显式状态和关闭入口。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | Windows / macOS / Linux（开源运行环境） | Multi-companion conversation | README 写明创建 multiple multimodal virtual companions，它们会和用户及彼此对话。 | 事实 | 多角色互动能提升陪伴感和新鲜感。 | 多 agent 对话成本高，也更难控场和保证内容安全。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | Windows / macOS / Linux（开源运行环境） | Web search / deep search | README 写明支持 duckduckgo_search、LangSearch API 和 deep search。 | 事实 | companion 不只聊天，也能查外部信息。 | 搜索来源质量、幻觉、联网权限和 API key 需要治理。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | Windows / macOS / Linux（开源运行环境） | Voice cloning output | README 写明 voice cloning enables distinct voice output generation。 | 事实 | 让不同 companion 有区分度和角色感。 | 声音克隆涉及授权、滥用和合规风险。 | [GitHub](https://github.com/SingularityMan/vector_companion) |

## 3. Main Thread 建议新增 / 修正 / 删除的功能行清单

### 3.1 建议新增到主矩阵的功能行

| Product | 建议新增功能行 | 理由 |
|---|---|---|
| CielChan | `Game events` | 官方功能表明确出现 game events，对 `desktop-pet` 的游戏事件 SDK 方向高度相关。 |
| CielChan | `System audio listener` | 这是 screen-aware 之外的 audio-aware 能力，能启发游戏音频上下文，但风险也高。 |
| CielChan | `Tool use / multi-step tools` | 可作为 Function Calling / Workflow 的竞品证据。 |
| Clawster | `Active app / window awareness` | 需要和 screenshot Q&A 分开，前者是 metadata / active context，后者是视觉输入。 |
| Clawster | `Customizable personality via IDENTITY.md / SOUL.md` | 对多游戏 persona presets 很有启发，应该单独列。 |
| Open LLM Vtuber | `AI proactive speech` | 主动发言是陪伴感核心，但也最容易造成打扰，应单列。 |
| Open LLM Vtuber | `Interrupt current speech` | 对语音桌宠控制权极关键，建议从非 AI 控制能力上升为 AI 语音体验必要项。 |
| Utsuwa | `Semantic memory with local embeddings` | 比普通 memory 更具体，应作为长期记忆实现路径证据。 |
| Utsuwa | `Relationship stages / mood tracking` | 对陪伴留存机制有参考价值，但需健康边界。 |
| AIRI | `Game integration: Minecraft / Factorio` | 这是少数公开证据明确把 AI companion 与游戏集成结合的产品。 |
| AIRI | `Plugin architecture` | 对 `desktop-pet` 的 SDK / 平台化方向很关键。 |
| Amica | `Automated subconscious / proactive behavior` | 是“主动陪伴”的另一种产品化表达。 |
| Vector Companion | `Periodic screen vision + OCR` | 可以作为 screen-aware 的高风险上限案例。 |
| OpenPets | `Local MCP server for pet control` | 虽不是玩家 companion，但可作为 game event bridge / agent bridge 接口参考。 |
| Claw Sama | `One-click persona generation from VRM screenshot` | 对角色资产到 persona 的半自动配置有启发，但必须标注审核风险。 |

### 3.2 建议修正的功能行

| Product | 建议修正 | 原因 |
|---|---|---|
| Desktop Pet | 把 `Privacy First` 改成“本地设置 / conversations 不永久保存 + BYO OpenAI key”，不要写成“AI 完全本地”。 | 官方同时说明 AI chat 需要用户 OpenAI API key 和互联网。 |
| UPochi | 把 `Offline Mode` 与 `LLM-infused chat` 分开，不要推断 LLM chat 离线。 | 官网未说明 LLM provider 和离线路径。 |
| CielChan | 把 `offline desktop AI companion` 拆成 local-first 能力、cloud providers、GPU offload 三类。 | 官方同时列出本地与云 provider，不能混成单一 privacy 结论。 |
| Hiora | 标注为 `avatar layer for OpenClaw bot`，而不是完整 AI companion 闭环。 | 它主要给已有 OpenClaw bot 增加桌面 face / voice / lip-sync。 |
| Lily | 平台列建议标 `macOS（Windows / Linux 待核验）`。 | 页面顶部写 Available for macOS / Windows coming soon，但下方又写 compatible with macOS, Windows, Linux。 |
| Open LLM Vtuber | `HumeAI EVI` 标注“待核验 / 架构限制”。 | 文档明确说明当前架构不能完全利用 EVI 的实时情绪能力。 |
| HoloWaifu | 仅抽象提取 memory / voice / lip-sync / overlay，不引入其成人陪伴定位。 | `desktop-pet` 是游戏 AI 桌宠 SDK，不能继承其内容风格。 |

### 3.3 建议删除或降权的功能行

| Product / 功能 | 建议 | 原因 |
|---|---|---|
| Desktop Mate 的 `当前无明确 AI 功能` 行 | 从 AI 功能矩阵删除或移到非 AI embodiment 参考表。 | 它不是 AI-first 产品，适合作为桌面动作 / IP DLC 参考，不适合作为 AI 功能行。 |
| Desktop Goose 的 `无 AI 功能` 行 | 从 AI 功能矩阵删除或移到反模式表。 | 它是干扰型传统桌宠，适合风险与低打扰设计参考。 |
| 任何没有官方来源的 “memory / screen-aware / local-first” 行 | 删除或标 `待核验`。 | 此类能力对隐私和体验判断影响大，不能从营销词推断。 |
| 泛 `AI chat` 合并行 | 降权，改为拆成 `text chat`、`voice chat`、`persona prompt`、`memory`、`context awareness` 等独立行。 | 用户要求每个 AI 功能逐点解释；合并行会掩盖差异和风险。 |

## 4. Agent A 结论给 Main Thread

| 结论 | 说明 |
|---|---|
| 最关键的桌面 AI companion 能力簇 | `voice / text conversation`、`memory`、`persona config`、`screen / app / audio awareness`、`proactive speech`、`interrupt control`、`embodied avatar output`、`tool / workflow actions` |
| 对 `desktop-pet` 最相关的差异化证据 | `CielChan Game Events`、`AIRI Game Integration`、`Clawster Active App / Screenshot Questions`、`OpenPets MCP control`、`Claw Sama screen observation + persona files` |
| Agent A 建议 | 主矩阵应把“screen-aware”拆成至少四类：`active app/window metadata`、`screenshot / image analysis`、`system audio transcription`、`game event schema`。其中 `game event schema` 更符合公司业务隐私边界。 |
| 需要 PM Thread 接的问题 | 是否允许 screen / audio context？是否优先改为 game event schema？memory 是否进 MVP？persona config 是否需要审核和 preview？ |
