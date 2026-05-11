# 陪伴类桌宠产品调研

> 调研范围：市面陪伴类桌宠 / AI companion 产品的一般功能模式。重点看 AI 功能，非 AI 功能作为提升陪伴感、低打扰、可信任和商业化的辅助能力。
>
> 最后更新：2026-05-07
>
> 研究线程：AI Trend Radar Thread
>
> 核验状态：已由独立 Radar Thread 复核。本版本优先采用官方产品页、官方帮助中心、Steam、GitHub、itch.io 与官方文档核验；社区与营销描述只作为线索，不作为单独事实依据。

## 1. 核心结论

| 类型 | 结论 |
|---|---|
| 事实 | 被核验的 AI-first 桌宠 / companion 产品普遍把“人格化对话、记忆、语音、桌面常驻、动画表达、上下文感知、主动提醒”组合起来；非 AI 能力主要承担低打扰存在感、点击 / 拖拽 / 动作反馈、个性化皮肤、提醒与创作者生态。 |
| 事实 | 市面样本可分为 4 类：桌面 AI companion、AI 辅助桌宠 / Shimeji、非 AI 桌面宠物与 embodied mascot、移动 / Web AI companion benchmark。 |
| 观点 | 体验好的产品不是“给 chatbot 套皮肤”，而是让 AI 输出和桌面身体一致：会在合适时机出现、记得用户、能通过表情 / 动作反馈情绪，并且用户随时能隐藏、静音、退出或删除记忆。 |
| 推断 | 对 `desktop-pet` 来说，最值得验证的差异化不是泛聊天，而是“多游戏可配置 + 游戏事件上下文 + 隐私边界 + 低打扰桌面陪伴 + 可降级 fallback”。这仍是研究推断，需要 PM Thread 在 T-001 中转成需求问题和 AI 必要性评估。 |

## 2. 来源质量与证据规则

| 来源类型 | 示例 | 可信度 | 使用方式 |
|---|---|---:|---|
| 官方产品页 / 官方帮助中心 | CielChan, Clawster, UPochi, Desktop Pet, Hiora, Desk-Buddy, Dockling, Replika, Nomi, Kindroid, Character.AI | 高 | 作为功能事实来源；营销性形容词不直接当事实 |
| Steam / GitHub / itch.io | Ai Vpet, Desktop Mate, VPet-Simulator, Clawster GitHub, Desktop Goose | 高 | 作为发行、平台、功能、开源结构与生态来源 |
| 官方文档 | Open LLM Vtuber docs | 高 | 作为桌宠模式、Live2D / voice / interrupt / tray 等交互模式来源 |
| 社区 / Reddit / 媒体文章 | 本轮未纳入核心事实表 | 中低 | 只作发现线索；不作为最终功能事实 |
| 本文分析判断 | 功能归纳、产品机会、MVP 启发 | 观点 / 推断 | 明确标注，不冒充外部事实 |

## 2.1 Radar Thread 复核后的关键修正

| 修正项 | 旧版风险 | 更新后的处理 |
|---|---|---|
| CielChan 的隐私表述需要更细 | 旧版容易把它写成“所有场景都 100% offline” | 官方页同时出现“offline / no data leaving”与可选 cloud LLM providers / GPU offload，因此本文改为“offline-first，云能力需按开关和 provider 单独评估”。 |
| Desktop Pet 的隐私表述存在边界冲突 | 官方页称本地隐私，同时 AI assistant 使用用户自己的 OpenAI API key | 本文标注为“本地设置 + BYO key；AI chat 场景仍需网络与第三方 provider 边界说明”。 |
| UPochi 官方地址修正 | `/en` 抓取曾超时 | 使用 `https://www.upochi.com/` 自动跳转到 `/en` 的官方页面核验。 |
| Ai Vpet 不是 local-first | 旧版未强调第三方 AI 服务 | Steam 明示连接第三方服务生成 AI 内容；本文改为“third-party AI service”。 |
| Desktop Mate / Dockling / VPet / Desktop Goose 不应被写成 AI companion | 容易混淆 AI-first 与非 AI embodied reference | 本文把它们作为非 AI 或 AI-light 体验参考，用于研究桌面存在感、动作反馈、modding 和低打扰机制。 |

## 3. 产品证据矩阵

> 本矩阵已从“一个产品一行”扩展为“一个产品 + 一个 AI 功能点 / 体验参考点一行”。Product 名保留英文；必要专业术语如 LLM、RAG、Function Calling、MCP、VRM、Live2D、SDK、API 保留英文；其余字段使用中文。
> “待核验 / 计划”表示来源只支持线索或 roadmap，不作为成熟能力；“非 AI 体验参考”表示该产品当前没有明确 AI 功能，但对桌宠存在感、资产管线、overlay 或低打扰机制有参考价值。详表也已同步到 xlsx。

| 分片 | 解析行数 |
|---|---:|
| A 桌面 AI companion 分片 | 105 |
| C AI companion benchmark 分片 | 109 |
| D game SDK / overlay 分片 | 40 |
| B2 桌宠生态分片 | 62 |
| 合并去重后主矩阵 | 314 |
| 覆盖产品 / 平台 / 参考对象 | 61 |
| 本轮核验原“待核验 / 计划”条目 | 34 |
| 核验后仍需实测 / 跟进条目 | 14 |

| Product | 类别 | AI 功能点 / 体验参考点 | 功能解释 | 对体验的作用 | 局限 / 风险 | 证据来源 |
|---|---|---|---|---|---|---|
| CielChan | 桌面 AI companion / screen-aware companion | 实时语音对话 | 支持实时双向语音对话，同时保留文本聊天，用户可以把桌宠当作常驻语音陪伴角色召唤。 | 语音降低交互摩擦，让角色不像聊天窗口，而像在桌面旁边陪伴。 | 麦克风权限、语音延迟、噪声环境和误触发都需要显式控制。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 持续记忆 + 人格演化 | 官方说明 Ciel 会记住用户并随相处时间变得熟悉，完整功能表还列出用户画像、对话记忆、跨 session 持续保存。 | 长期记忆让陪伴关系具备连续性，减少每次从零开始的感觉。 | 必须提供记忆查看、编辑、删除、重置和保存位置说明；错误记忆会伤害信任。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 上下文存在感 / 空闲观察 | 会根据工作流、媒体和 当前活动产生轻量评论；完整功能表列出观察上下文、渐进式追踪器和 可选空闲陪伴评论。 | 让桌宠在用户没有主动提问时也显得“活着”，适合低频主动关怀。 | 主动评论频率过高会变成打扰，需要安静时段、频率限制和显式开关。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 窗口焦点追踪 | 官方列出当前活跃 app 监控并记录持续时间，可记录当前活跃应用和持续时间。 | AI 可以根据当前任务类型调整语气和提示时机，例如 coding、gaming、music。 | 读取窗口焦点属于敏感桌面上下文，需要主动授权、范围说明和不记录敏感窗口策略。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 本地视觉 / 截图分析 | Premium 功能列出本地设备端图像和截图分析。 | 支持 AI 理解用户提供或当前屏幕中的视觉信息，比纯文本陪伴角色更贴近桌面场景。 | 截图可能包含敏感内容；应提供区域选择、预览确认、本地处理说明和禁用入口。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 系统音频监听 | Plus / 语音与音频功能中列出转录扬声器和游戏音频。 | 让陪伴角色能听到系统声音或游戏声音，从而进行更情境化反应。 | 系统音频监听隐私风险高，也可能涉及版权内容；默认不应开启。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 游戏事件 | Live / Messaging Bridges 中列出跨多个支持游戏的事件检测。 | 对 desktop-pet 很关键：说明泛桌面陪伴角色已经开始接近 game context，而不仅是屏幕观察。 | 具体支持哪些游戏、事件粒度、数据路径需要逐项核验；不能默认适合 SDK 化。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 工具调用 / 多步骤工具 | AI 可在受控 bridge folder 中读写文件，并支持顺序串联工具执行。 | 让陪伴角色从聊天扩展到受控行动，适合提醒、文件读写、工作流执行等任务。 | 文件读写权限必须限制在沙盒目录；多步骤工具容易引入越权和失败恢复问题。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 云端 LLM provider / GPU offload | 支持 OpenRouter、OpenAI、Anthropic 和云端 GPU offload，同时也有本地 / 离线定位。 | 在本地算力不足时提供能力上限，也给用户模型选择权。 | 隐私优先表述必须按功能区分本地与 云端；否则容易让用户误解数据是否离开设备。 | [官网](https://phasma.ai/) |
| CielChan | 桌面 AI companion / screen-aware companion | 自动口型同步 + 表情 | 语音与音频列出自动口型同步，角色与 Avatar 列出情绪表情、手势和 串联动画。 | 把 AI 输出映射成表情、动作和口型，增强具身化陪伴感。 | 表情与内容不匹配会显得廉价；需要稳定的情绪映射和 兜底动作。 | [官网](https://phasma.ai/) |
| Clawster | 屏幕感知 AI 桌宠 | 上下文感知快速聊天 | 通过快捷键召唤，官方称它知道用户正在使用的 app，并提供上下文相关、屏幕感知帮助。 | 减少用户描述上下文的成本，适合桌面即时问答。 | 需要明确读取的是当前活跃 app、窗口标题、截图还是更多数据；公司场景需默认收窄。 | [官网](https://clawster.pet/) |
| Clawster | 屏幕感知 AI 桌宠 | 截图提问 | 用户可截取屏幕任意区域并提问，Clawster 根据截图解释 app、网站或按钮。 | 把 AI 从泛聊天转成“看得见当前问题”的桌面助手。 | 截图中可能出现密钥、聊天、公司资料；需要局部选择、预览确认和不保存策略。 | [官网](https://clawster.pet/) |
| Clawster | 屏幕感知 AI 桌宠 | 当前 app / 窗口感知 | GitHub README 写明屏幕感知会检测当前活跃 app 和窗口，用于上下文帮助。 | 对用户当前任务更敏感，能减少无关回答。 | 对 window metadata 的读取边界要透明；敏感 app 需要屏蔽列表。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Clawster | 屏幕感知 AI 桌宠 | 本地 OpenClaw gateway | 官方称深入问答由本地 OpenClaw gateway 驱动，用于隐私和扩展。 | 本地 gateway 可以统一处理上下文、请求、权限和长对话。 | 对普通用户安装和诊断成本更高；gateway 权限过宽会成为安全风险。 | [官网](https://clawster.pet/) |
| Clawster | 屏幕感知 AI 桌宠 | 完整 assistant 面板 | 支持打开完整助手面板做更长对话和设置调整。 | 兼顾轻量快速聊天与深度对话，避免桌宠气泡承载过多复杂任务。 | 如果助手面板功能过多，产品会从 pet 变成通用助手，定位可能发散。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Clawster | 屏幕感知 AI 桌宠 | 可自定义人格 | GitHub README 写明可编辑 IDENTITY.md 和 SOUL.md 来塑造行为。 | 说明 persona 可以文件化配置，适合 desktop-pet 未来做多游戏 persona presets。 | 文件配置对普通集成方不够产品化；需要可视化预览和审核机制。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Clawster | 屏幕感知 AI 桌宠 | 主动寻求关注 | GitHub README 写到感到孤单时会靠近光标。 | 让桌宠不仅被动回答，还能以低成本行为表达“存在感”。 | 主动靠近鼠标可能干扰操作；必须可关闭且避免全屏游戏中触发。 | [GitHub](https://github.com/wuyuwenj/clawster) |
| Desktop Pet | AI assistant 桌宠 | 使用自备 OpenAI API key 的 AI assistant | 用户右键设置自己的 OpenAI API key 后可进入助手模式进行 AI 聊天。 | 把通用 LLM 助手包装成宠物入口，降低工具感。 | 自备 key 有门槛；AI 数据会到 OpenAI provider，和“本地隐私”表述需要分开解释。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | 语音 / 文本聊天 | 官方写明可以用语音或 文本和宠物聊天。 | 语音适合低摩擦召唤，文本适合安静场景。 | 语音需要麦克风权限、唤醒词误触发处理和静音入口。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | 唤醒词语音指令 | 支持唤醒词检测，默认示例为 Hey Pet，可说出提醒、天气、计时器等请求。 | 让桌宠像轻量语音助手，用户不用先打开聊天框。 | 唤醒词长期开启会带来隐私焦虑；必须有清晰麦克风状态。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | 智能提醒 / 计时器指令 | 示例包含设置计时器、提醒我、天气等语音命令。 | 让桌宠常驻桌面有工具价值，而不只是陪伴。 | 对游戏桌宠来说，泛效率提醒应谨慎，最好映射到游戏活动 / 回流提醒。 | [官网](https://desktoppet.app/) |
| Desktop Pet | AI assistant 桌宠 | 本地偏好设置 + 非持久化对话 | 官方说明设置本地保存，对话不会永久保存。 | 降低用户对数据收集的担忧。 | 需要同时说明 AI 聊天请求仍依赖网络和用户 OpenAI API key。 | [官网](https://desktoppet.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | 连接 OpenClaw chat completions | Hiora 连接 OpenClaw bot 的聊天 completions API，让 agent 回复通过桌面 avatar 表达。 | 把已有 AI bot 从不可见服务变成桌面上有脸、有声音的陪伴角色。 | 它更像 avatar layer，不是完整陪伴角色产品；能力深度取决于外部 OpenClaw bot。 | [官网](https://hiora.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | 桌面语音陪伴角色 | 设置流程中明确称其为桌面语音陪伴应用，用户说话后 AI 语音回应。 | 对话方式更自然，适合作为低摩擦桌面入口。 | 实时语音对延迟、打断、麦克风权限要求高。 | [官网](https://hiora.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | 口型同步回复 | AI 回复以完整口型同步、实时表情、自然头部动作表达。 | 让 AI 输出有具身化临场感。 | 口型、表情和语音不同步会破坏真实感。 | [官网](https://hiora.app/) |
| Hiora | AI bot 的 3D avatar / desktop face layer | 通过 Avatarium 配置 avatar 身份 | 用户通过 Avatarium 获取或自定义 avatar，再填入 Hiora。 | 支持把同一个 AI 能力换成不同角色外观。 | 对游戏 SDK 来说需要处理 avatar 权限、品牌资产和 IP 审核。 | [官网](https://hiora.app/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | AI provider 连接 | 用户可连接 OpenAI、Anthropic 或本地模型。 | 让用户根据成本、能力和隐私选择模型来源。 | provider 数据路径和 key 管理需要清晰；本地模型对硬件有要求。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | 语音 / 文本对话 | 支持通过语音或 文本与 VRM 陪伴角色交谈。 | 形成 AI 陪伴角色的基础入口，兼顾自然语音和低干扰文本。 | 语音链路需要 ASR、TTS、权限、打断和错误恢复。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | 脚本与自动化 | 官方流程包含配置脚本和自动化，让陪伴角色帮助日常任务。 | 从“会聊天”扩展到“能做事”。 | 脚本权限需要白名单、审批和失败回滚；否则存在本地安全风险。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | 本地对话隐私 | 官方说明对话保留在本机，应用不发送到自身服务器，和 AI provider 通信从用户电脑直接发生。 | 适合隐私敏感的桌面陪伴角色叙事。 | 如果使用外部 provider，数据仍会到 provider；需要按 provider 解释。 | [官网](https://www.desk-buddy.fun/) |
| Desk-Buddy | 开源 VRM AI 桌面 companion | VRM 情绪反应 | 官网描述陪伴角色会说话、用情绪回应，并帮助处理日常任务。 | 用情绪反应承接 AI 输出，让桌宠更像角色。 | 公开资料未细分情绪识别、映射逻辑和触发规则，需进一步核验。 | [官网](https://www.desk-buddy.fun/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | 多 LLM backend 支持 | 支持 OpenAI-compatible、Ollama、Claude、Gemini、DeepSeek、Groq、llama.cpp 等后端。 | 适合作为可插拔模型架构参考，能支持云端与 本地两种路径。 | 配置复杂，面向普通玩家或游戏团队需要产品化封装。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/llm/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | 语音对话 | Web Mode 支持语音对话、文本输入、麦克风控制和 语音检测阈值。 | 是语音陪伴角色的核心能力，支持更自然的互动。 | ASR 阈值、噪声、打断和麦克风自动控制会影响体验稳定性。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | AI 主动发言 | Agent 设置中可允许 AI 在空闲状态主动发言，也能通过中断 / raise hand 触发。 | 支持主动陪伴、提醒和低频关怀。 | 主动发言必须有频率阈值和关闭入口，否则常驻桌宠会打扰用户。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | 中断当前语音 | 支持用户点击、说话或发送消息时中断当前 AI 语音，并只保留中断前内容。 | 对语音陪伴角色很关键，能恢复用户控制感。 | 中断需要和 TTS、字幕、动画、记忆同步，否则状态会错乱。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | 基础记忆 agent | Agent 文档说明 default basic_记忆_agent 具备短期记忆、对话记录存储 / 切换。 | 支持连续对话和多会话切换。 | 短期记忆不等于长期关系记忆；记忆保存位置和删除机制仍需设计。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/agent/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | 角色人格 prompt | 支持修改 persona_prompt，也支持添加多个角色配置并在前端切换。 | 可为不同角色配置语气、语言风格和人格。 | prompt 可控性依赖模型能力；对游戏 IP 需要更严格的风格边界和审核。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/character_settings/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | HumeAI EVI agent | 文档列出 HumeAI Agent，可使用共情语音接口，但也说明当前架构无法完全利用其情绪音频能力。 | 提供情绪-aware 语音的方向参考。 | 当前实现有架构限制和成本风险；不能当成已完全落地能力。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/backend/agent/) |
| Open LLM Vtuber | 开源 Live2D / 桌宠模式框架 | 桌宠 AI 状态共享 | Desktop Pet Mode 与 Window Mode 共享对话历史、AI status、记忆和 Live2D model status。 | 切换窗口 / 桌宠形态时不丢状态，适合桌面陪伴角色连续体验。 | 状态共享需要防止记忆污染和不同角色之间上下文串扰。 | [官方文档](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) |
| Open LLM Vtuber | open-source AI companion / desktop pet mode | 桌宠模式 + 共享上下文 | Open LLM Vtuber 支持 Window Mode 与 Desktop Pet Mode，并共享设置、对话历史、AI status、记忆、Live2D model status。对 desktop-pet 的启发是：游戏外桌面宠物和游戏内 / 窗口模式应共享状态，避免玩家切换场景后“宠物失忆”。 | 形成连续陪伴体验：桌宠可在游戏内轻量出现，游戏外继续对话或提醒。 | shared context 涉及数据保存和删除；公司业务场景需要明确哪些状态可持久化。 | [Open LLM Vtuber Window & Desktop Pet Mode](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) |
| Open LLM Vtuber | open-source AI companion / desktop pet mode | 多工具调用 / MCP 支持 | Open LLM Vtuber 官方介绍支持视觉感知、多工具调用、MCP、浏览器控制、直播集成、长期记忆、语音中断、AI 主动发言、桌宠模式。对 desktop-pet 的启发是：工具调用、语音、记忆、主动发言都应拆成独立矩阵行，分别评估 P0 / P1 / P2。 | 给完整 AI 陪伴角色能力栈提供开源参考，尤其是桌宠模式下的中断、status、记忆、工具通话可视化。 | 功能很多，MVP 不能照单全收；浏览器控制 / screen recording / 长期记忆在公司业务边界下风险较高。 | [Open LLM Vtuber Overview](https://docs.llmvtuber.com/en/docs/intro/) |
| Open LLM Vtuber | open-source AI companion / desktop pet mode | 点击穿透 / 右键控制 / 中断 | Desktop Pet Mode 支持全局置顶、透明背景、鼠标点击穿透、拖拽、缩放、鼠标交互、右键开关麦克风、中断、隐藏 / 退出等。对 desktop-pet 的启发是：所有 AI overlay / 宠物动作都需要配套可逆控制面。 | 玩家知道自己能静音、打断、隐藏、退出，才更可能接受常驻桌宠。 | 控制太多会显得复杂；需要默认低打扰，同时让高级开关可发现。 | [Open LLM Vtuber Window & Desktop Pet Mode](https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/) |
| Utsuwa | 开源 VRM AI companion | AI 聊天 | 官方定位为 AI 聊天、语音、语义记忆的 VRM avatar viewer。 | 把文字对话承载到可见 3D 角色上。 | 纯聊天容易同质化，需要上下文或场景差异化。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | 语音输入 + TTS provider | 支持 Groq Whisper / Web Speech API 作为语音输入，并支持 ElevenLabs / OpenAI TTS。 | 支持语音输入 / 语音输出，使陪伴角色更自然。 | 多 provider 组合会带来配置、成本和延迟管理问题。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | 基于本地 embeddings 的语义记忆 | 使用本地 AI embeddings 构建记忆图谱，按语义找回过去对话。 | 让长期陪伴更连贯，能记住主题而不是只匹配关键词。 | 语义记忆可能误召回或过度保存；需要用户可见的记忆 controls。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | 关系阶段 / 情绪追踪 | 官方说明可追踪亲密度、信任、情绪跨 关系阶段。 | 把陪伴角色关系变成可成长的状态，增强留存循环。 | 关系数值化可能强化情感依赖；需要透明和健康边界。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | 自备 key / 本地模型选项 | 支持 OpenAI、Anthropic、Google、DeepSeek、xAI，或使用 Ollama / LM Studio 本地运行。 | 允许用户在能力、成本、隐私之间选择。 | 自备 key 对普通用户有门槛；本地模型需要硬件和模型管理。 | [官网](https://www.utsuwa.ai/) |
| Utsuwa | 开源 VRM AI companion | 本地优先存储 | 数据保存在设备 IndexedDB，无需账号，支持存档导出 / 导入。 | 增强用户对本地陪伴角色的控制感。 | IndexedDB 不是企业级数据治理方案；跨设备同步和备份需另行设计。 | [官网](https://www.utsuwa.ai/) |
| HoloWaifu | 3D desktop AI companion | 长期记忆 + 自适应人格 | 官方称具备长期记忆和 自适应人格，能形成个性化对话。 | 长期记忆和人格演化增强关系感。 | 产品定位偏成人陪伴方向，desktop-pet 只能抽象借鉴机制，不能照搬内容风格。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | 实时语音到语音 | 支持自然语音交互和 语音到语音通信。 | 让桌面角色像实时陪伴者，而不是文字 bot。 | 实时语音的成本、延迟和打断体验是主要风险。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | 口型同步 | 支持实时口型同步，官方 FAQ 也强调 3D avatar、语音、lip-sync。 | 让 AI 回答和角色身体同步，提升沉浸感。 | 口型延迟或错位会显著降低质感。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | 游戏 / 直播时常驻 overlay | 官方称交互式桌面 overlay 助手会在用户游戏、直播或工作时保持置顶。 | 对游戏场景有参考价值：桌宠可以在游戏或工作时常驻。 | 游戏全屏、FPS、遮挡、反作弊和隐私都需谨慎处理。 | [官网](https://holowaifu.app/) |
| HoloWaifu | 3D desktop AI companion | 本地聊天记录控制 | 官方称本地聊天历史保留在设备上，并可随时删除。 | 给用户数据控制感，适合长期陪伴角色。 | 需要进一步核验模型请求是否经过云 provider；“本地 history”不等于“本地推理”。 | [官网](https://holowaifu.app/) |
| PokeClaw | OpenClaw 桌面工作 companion | 基于 OpenClaw 的桌面陪伴角色 | 官方称基于 OpenClaw，有引导式设置、本地优先工作流和 用户授权集成。 | 展示了把本地 agent runtime 包装成桌面陪伴角色的产品路径。 | 偏工作场景，不是情感桌宠；游戏侧需要重做触发和权限模型。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | 上下文记忆 | 官方称跨 session 记住有用的项目上下文，并在本地优先保存。 | 让桌面 AI 能跨 session 记住工作上下文。 | 记忆范围、保留周期和删除机制仍需详细核验。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | 用户授权集成 | 用户只连接已授权的服务，组织消息、笔记、任务、邮件、webhook。 | 把 AI 动作权限限定在用户批准的集成中。 | 游戏 SDK 类似需要事件权限白名单和动作 approval，不能默认全开。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | 内置 skills / workflows | 包含 55+ 内置 skills，并可添加需要审核 / 批准的 可复用工作流。 | 提供“技能库 + 审批”的 agent capability 参考。 | skill marketplace / 插件执行存在 prompt injection 和权限风险。 | [官网](https://pokeclaw.io/) |
| PokeClaw | OpenClaw 桌面工作 companion | 周期任务调度 | 包含周期任务调度。 | 说明陪伴角色可以承接主动任务和周期性提醒。 | 对游戏召回很有启发，但必须有频率上限和 opt-out。 | [官网](https://pokeclaw.io/) |
| Lily | screen-aware desktop AI agent | 自然语音交互 | 官方称用户可以自然语音对话，无需唤醒词。 | 降低桌面 agent 使用门槛，像 teammate 一样交互。 | 无唤醒词可能暗示持续监听或快捷触发不清，需要核验触发机制。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | 屏幕感知 | 官方称 Lily 看见用户正在看的内容，可针对任意打开的窗口或 应用提问。 | 提供强 screen-aware 桌面帮助体验。 | 屏幕读取极敏感；应明确是否本地处理、是否截图、是否能排除应用。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | 智能听写 | 用户可向任意输入框听写，Lily 会格式化和纠正。 | 把语音转成跨应用输入能力，实用性强。 | 输入自动化需防误输入；需要确认和撤销。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | 桌面动作控制 | 官方称可自动点击和导航，处理重复任务。 | 从陪伴角色进入 computer-use agent 范畴。 | 自动点击 / 导航风险高，必须做权限、确认、日志和回滚。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | 偏好学习 | 官方称 Lily 学习用户偏好并随时间变得更好。 | 提供个性化和长期使用价值。 | 未看到具体记忆实现、可编辑性和删除机制，需要进一步核验。 | [官网](https://www.heylily.app/) |
| Lily | screen-aware desktop AI agent | 本地处理 / 隐私 | 官方称数据不离开设备并在本地处理。 | 对 screen-aware agent 是核心信任点。 | 需要实测或隐私文档确认模型是否完全本地、是否调用云服务。 | [官网](https://www.heylily.app/) |
| DeskMochi | 浮动桌面 AI assistant / companion | 桌面浮动 AI 答案 | Mochi 浮在桌面上，用户悬停 / 输入即可获得 AI 答案。 | 减少 app switching，让 AI 像常驻小入口。 | 陪伴感弱于角色型 pet，更偏效率工具。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | 截图提问 | Pro 功能列出对截图中的任意屏幕内容提问。 | 让用户直接围绕当前屏幕提问。 | 截图隐私、保存策略和敏感内容过滤需要核验。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | 多模型访问 | 页面列出 Gemini、GPT、Claude 等模型。 | 给用户不同速度、成本和风格选项。 | 模型供应商路径复杂；需要清楚区分数据会到哪些 provider。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | 微任务 AI 操作 | 官网列出改写、查询、截图、解释、转换、定义、摘要。 | 让桌面 AI 处理碎片任务，避免污染主聊天工具。 | 不直接形成情感陪伴；对 desktop-pet 只能借鉴“轻量即时任务”模式。 | [官网](https://www.deskmochi.com/) |
| DeskMochi | 浮动桌面 AI assistant / companion | 陪伴角色外观皮肤 | 支持 Mochi、Mechy、Boba 三种外观。 | 用轻量角色外观增强亲切感。 | 外观不等于 persona；如果没有记忆和行为差异，陪伴感有限。 | [官网](https://www.deskmochi.com/) |
| UPochi | LLM 桌面 companion | LLM 加持聊天 | 官方说明用户可以像使用 AI 助手一样与桌宠聊天，并且桌宠会以人格方式回应。 | 让传统桌宠从动画陪伴升级为可对话角色，形成基本陪伴闭环。 | 未说明 LLM provider、记忆、内容安全、兜底和数据路径，不能直接推断为完整 AI 陪伴角色架构。 | [官网](https://www.upochi.com/) |
| UPochi | LLM-infused 桌面 companion | 人格特质与名称 | 用户可编辑宠物特征、人格特质和 名称。 | 让 pet 更贴合用户喜好，降低通用助手感。 | 需进一步确认这些特征是否真正进入 LLM prompt 或只是展示字段。 | [官网](https://www.upochi.com/) |
| UPochi | LLM-infused 桌面 companion | 好友房间聊天 / teleport | 官方写到加入好友宠物房间，并与好友流畅聊天。 | 多宠物 / 房间可能带来社交陪伴和传播。 | 这里更像社交功能，AI 是否参与群聊不清楚，需核验。 | [官网](https://www.upochi.com/) |
| UPochi | LLM-infused 桌面 companion | 离线模式 / 无追踪 | 页面列出无追踪、离线模式、低内存占用。 | 对桌面常驻产品有信任和性能价值。 | 与 LLM-infused 聊天的网络 / provider 关系未说明，不能直接写成 AI 完全离线。 | [官网](https://www.upochi.com/) |
| UPochi | LLM 桌面 companion | 人格化响应 | 官方同时提供宠物特征、人格特质、名称等配置，并把 LLM 聊天和 人格回应绑定。 | 对 desktop-pet 有启发：多游戏 SDK 需要 persona preset、语气、角色边界和游戏品类配置。 | 如果 persona 只停留在名称 / trait 层，可能不足以保证长期一致性；需要 PM 后续确认是否需要 persona schema。 | [官网](https://www.upochi.com/) |
| UPochi | LLM 桌面 companion | 自定义创建宠物（待核验是否 AI） | 官方写有自定义创建宠物 beta，但页面未明确说明是否由生成式 AI 生成资产或行为。 | 如果是 AI creation，可降低宠物资产生产成本；如果不是 AI，也仍然说明用户有自定义宠物需求。 | 不能把该能力写成“AI 生成宠物”事实；主矩阵应保留“待核验”。 | [官网](https://www.upochi.com/) |
| UPochi | LLM 桌面 companion | 离线 / 无追踪边界 | 官方列出无广告、无追踪、离线模式、低内存占用。 | 对桌面常驻产品建立信任，尤其适合公司业务探索中的隐私边界讨论。 | 离线模式不等于所有 LLM 聊天均本地运行；需要拆分“桌宠基础能力”和“AI 聊天 provider”数据路径。 | [官网](https://www.upochi.com/) |
| Ai Vpet | Steam AI 虚拟桌宠 | LLM 文本对话 | Steam AIGC 披露写明用户可通过文本和 AI 桌宠对话，回复由大语言模型生成。 | 构成 AI 情感陪伴的基础能力。 | 连接第三方 AI 内容生成服务，数据和内容安全边界需要说明。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | 语音对话 | Steam AIGC 披露写明支持语音与 AI 桌宠对话。 | 提升陪伴和临场感。 | 语音涉及麦克风、网络、TTS / ASR 成本和延迟。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | AI 情感陪伴 | Steam 页面把其定位为 AI 朋友 / 情感陪伴角色，可在用户孤独或休息时提供陪伴。 | 说明“情绪陪伴”是 AI 桌宠常见卖点，不只是 productivity 助手。 | 情感陪伴可能带来依赖、未成年人保护、内容安全和过度拟人化风险。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | AI 个性化平台 | 通过 AI 技术创建桌宠形象、声音、角色设计和交互方式。 | 降低个性化宠物资产和 persona 的生成门槛。 | 生成资产涉及版权、IP 风格、审核和品牌一致性。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | Steam AI 虚拟桌宠 | 第三方 AI 服务 | Steam 页面列出连接第三方服务进行 AI 内容生成。 | 说明能力不是纯本地，可能换来更强模型效果。 | 对 desktop-pet 的公司边界来说，第三方 provider 路径必须显式披露和可关闭。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | 第三方 AI 内容生成服务 | Steam 页面明确标注连接第三方服务用于 AI 内容生成。 | 明确说明 AI 内容生成不是完全本地，适合给主矩阵补数据路径风险。 | 对公司业务项目来说，第三方 AI provider 需要显式主动授权、脱敏和合规说明。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | 自然语言 AI 陪伴角色 | Steam 页面称其通过深度学习与 自然语言处理提供知识丰富、表达清晰的 AI 陪伴角色。 | 把桌宠从“桌面装饰”转成可聊天、可陪伴、可答疑的角色。 | 页面是营销描述，未说明模型、记忆、RAG、内容安全或失败兜底。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | AI 个性化角色配置 | Steam 页面称高级 AI 技术支持从角色形象、人格、服装到 语音的自定义。 | 强化“我的专属陪伴角色”感，对多游戏角色皮肤 / 语音 / persona 配置有启发。 | 没有拆清楚哪些由 AI 生成、哪些只是用户配置；资产版权和语音授权需要单独评估。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Ai Vpet | AI 虚拟桌宠 | 主动休息互动 | Steam 页面描述其可在用户休息时主动发起互动。 | 主动触达让桌宠显得“活着”，可对应游戏外召回 / 空闲 comment。 | 需要频率限制、安静时段、snooze 和一键关闭；是否由 AI 判断时机仍待核验。 | [Steam](https://store.steampowered.com/app/3029820/Ai_Vpet/) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | 文本 / 语音聊天 | 支持文本或 语音聊天，按住 F10 说话，并以语音回复。 | 把 OpenClaw agent 包装成具身桌宠入口。 | 作为目录插件，成熟度和安全审计需要单独核验。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | LLM 驱动人格 | 官方 README 写明 LLM-powered 人格，不只是聊天机器人。 | 强化角色一致性和陪伴感。 | persona 由 prompt 文件驱动，仍有 drift 和不合规输出风险。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | 可配置 SOUL.md / IDENTITY.md | 支持通过 SOUL.md 和 IDENTITY.md 定义人格、说话风格、背景故事。 | 对多游戏 SDK 很有参考：persona 可以文件化、模板化、版本化。 | 文件配置需要审核工具和预览，否则集成方容易写出不可控 persona。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | 基于 VRM 截图一键生成 persona | 截取 VRM 模型截图后，AI 自动生成匹配角色设定。 | 让角色资产与人格设定更快对齐，适合 prototype 阶段。 | 自动生成 persona 涉及风格、IP、合规和幻觉，需要人工确认。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | 屏幕观察 | README 写明观察屏幕并理解用户正在做什么，并给出游戏、debug、视频、文档例子。 | 强 screen-aware 体验，尤其和游戏场景关联高。 | 屏幕观察风险极高，应优先考虑 game event schema，而不是默认屏幕观察。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | TTS provider 选择 | 支持 Edge TTS 或 Qwen TTS，多语言 / 多声音。 | 用语音强化角色存在感和可爱度。 | 云 TTS / 本地 TTS 的数据路径、成本和可用性需要分开说明。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| Claw Sama | OpenClaw VRM AI 桌宠插件 | 通过 OpenClaw runtime 接入多 provider LLM | 技术栈写明 AI 通过 OpenClaw runtime，支持多种模型。 | 让桌宠能力不绑定单一模型供应商。 | 依赖 OpenClaw runtime 的安全和配置质量；插件生态需防 prompt injection。 | [OpenClaw Dir](https://openclawdir.com/plugins/claw-sama-yr2l9c) |
| OpenPets | AI agent 状态桌宠 / adjacent reference | 用于控制宠物的本地 MCP server | 暴露本地 MCP endpoint，agent 可以唤醒、通知、播放动画、清除消息、检查状态。 | 说明桌宠可作为 AI agent 的“可见状态层”，不一定要自己做 LLM。 | 不是面向玩家的 AI 陪伴角色；更适合作为 SDK / agent bridge 参考。 | [官网](https://openpets.sh/) |
| OpenPets | AI agent 状态桌宠 / adjacent reference | agent 进度可视化 | 用桌宠显示 agent 进度、review prompts、完成状态。 | 把不可见 agent 工作转为可感知状态，降低等待焦虑。 | 对游戏玩家价值需要重新定义，不能直接搬到 game 陪伴角色。 | [官网](https://openpets.sh/) |
| OpenPets | AI agent 状态桌宠 / adjacent reference | 宠物命令接口 | 支持 openpets 通知和 openpets 播放动画等命令触发消息和动作。 | 为 desktop-pet 的 game event bridge 提供相似接口思路：外部系统发事件，桌宠展示反馈。 | 命令接口需要权限、速率限制和事件 schema，否则容易被滥用。 | [官网](https://openpets.sh/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 实时语音聊天 | 官方文档写明实时语音聊天，支持客户端语音识别和多个 TTS provider。 | 支持自然对话和角色陪伴。 | 多端语音一致性、延迟和 provider 管理复杂。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | Live2D / VRM 具身角色 | 支持 Live2D / VRM model、自动眨眼、注视等。 | 让 AI 陪伴角色有可见身体，是桌宠体验基础。 | 资产管线和性能优化是主要工程成本。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 游戏集成 | 官方写明能和用户一起一起玩 Minecraft 和 Factorio。 | 这是和 desktop-pet 高相关的方向：AI 陪伴角色进入游戏行为而非只在桌面聊天。 | 具体游戏集成方式、权限、安全和稳定性需要深挖；不能泛化到所有游戏。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 屏幕感知 | 官方文档写明陪伴角色能看见你的屏幕。 | 支持屏幕上下文感知，提高回答相关性。 | 屏幕内容隐私敏感，游戏 SDK 应优先结构化事件。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 基于 DuckDB 的持久记忆 | 官方文档写明记忆系统使用 DuckDB 支持跨 session 的上下文感知对话。 | 支持跨 session 的连续陪伴。 | 记忆存储、编辑、删除、迁移和加密需进一步确认。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 多 provider / 本地模型 | 支持 OpenAI、Claude、Gemini、DeepSeek、Ollama、OpenRouter 和 40+ provider。 | 对 SDK 平台有参考：模型层可抽象为 provider adapter。 | provider 过多会增加配置和测试复杂度。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 插件架构 | 官方文档列出插件架构，可扩展集成、工具、行为。 | 与多游戏 SDK 的可扩展能力高度相关。 | 插件需要权限边界、审核和版本兼容策略。 | [官方文档](https://moeru-ai-airi.mintlify.app/) |
| AIRI | 开源 AI companion / AI VTuber / game-aware companion | 桌面本地推理加速 | GitHub README 写明桌面版可使用 NVIDIA CUDA 和 Apple Metal。 | 说明高能力陪伴角色可以尝试本地推理路径。 | 本地推理依赖硬件，不适合所有玩家机器。 | [GitHub](https://github.com/moeru-ai/airi) |
| Amica | 开源 3D AI companion | 自然语音聊天 | 官方写明 3D avatar 可通过自然语音聊天沟通，GitHub 也说明语音识别与 语音合成。 | 形成低摩擦具身对话体验。 | ASR / TTS provider 组合多，配置复杂。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | 视觉能力 | 官方写明陪伴角色可以通过语音聊天和 视觉，GitHub 技术栈列出视觉 backend。 | 让陪伴角色能理解视觉信息，增强上下文能力。 | 视觉输入隐私敏感，需确认是否本地、是否上传、是否保存。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | 情绪引擎 | 官网写明情绪引擎表达情绪，包含 14 种情绪和动画。 | 让 AI 输出更像角色反应，而不是文字回答。 | 情绪映射需要稳定，不然会与内容冲突。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | 自动潜意识 / 主动行为 | Amica Life 会无聊、互动、分享想法、采取行动，被忽略后 休眠。 | 让角色在用户不主动输入时也能形成生命感。 | 主动行为和动作权限必须可控，否则容易打扰或越权。 | [官网](https://www.heyamica.com/) |
| Amica | 开源 3D AI companion | 自定义 AI backend | 支持使用任意 AI 模型 backend，也可本地运行；GitHub列出 OpenAI-compatible、Ollama、KoboldCpp、OpenRouter 等。 | 支持私有化、自托管和不同能力层级。 | 配置和依赖多，对普通玩家门槛高。 | [GitHub](https://github.com/semperai/amica) |
| Amica | 开源 3D AI companion | 可打断实时语音 | 官网写明自动语音开始 / 停止检测，并可随时中断。 | 对自然语音对话和用户控制感很重要。 | 中断需要和字幕、动画、记忆同步。 | [官网](https://www.heyamica.com/) |
| Vector Companion | 本地 multimodal AI companion | 周期性屏幕视觉 | README 写明会周期性截图、生成图像 caption，并通过 OCR 读取屏幕文字。 | 让陪伴角色能围绕游戏、视频、网页等当前内容发言。 | 高隐私风险，且周期性截图对性能和用户信任要求高。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | 电脑音频转录 | README 写明实时转录电脑音频输出。 | AI 能听到用户正在看的视频或玩的游戏音频，形成更自然评论。 | 音频监听涉及隐私和版权，且需额外 audio loopback 配置。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | 麦克风转录 | README 写明实时听取用户麦克风输入。 | 支持用户随时用语音加入对话。 | 麦克风常开风险高，需要显式状态和关闭入口。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | 多陪伴角色对话 | README 写明创建多个多模态虚拟陪伴角色，它们会和用户及彼此对话。 | 多角色互动能提升陪伴感和新鲜感。 | 多 agent 对话成本高，也更难控场和保证内容安全。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | 网页搜索 / 深度搜索 | README 写明支持 duckduckgo_search、LangSearch API 和 deep search。 | 陪伴角色不只聊天，也能查外部信息。 | 搜索来源质量、幻觉、联网权限和 API key 需要治理。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Vector Companion | 本地 multimodal AI companion | 声音克隆输出 | README 写明声音克隆支持有区分度的声音输出生成。 | 让不同陪伴角色有区分度和角色感。 | 声音克隆涉及授权、滥用和合规风险。 | [GitHub](https://github.com/SingularityMan/vector_companion) |
| Replika | 情感型 AI companion | 人格化陪伴对话 | Replika 定位为个人 AI 陪伴角色，用户可以自由聊天、建立情感连接，并通过反馈帮助 AI 学习更适合自己的对话方式。 | 把产品重心放在陪伴、倾听和关系感，而不是工具型助手。 | 容易形成情感依赖；也不适合作为事实检索或生产力工具。 | [What is Replika](https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika) |
| Replika | 情感型 AI companion | 关系身份选择 | 用户可以选择 Replika 与自己的关系状态，如朋友、导师、恋爱伴侣等方向。 | 让同一个底层对话能力适配不同陪伴关系预期。 | 关系设定会影响用户心理预期，需要清晰的年龄、安全和内容边界。 | [What is Replika](https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika) |
| Replika | 情感型 AI companion | 层级记忆系统 | 官方说明 Replika 记忆由可见记忆 tab 与更深层的互动模式学习组成，用户也可以手动添加记忆。 | 让陪伴角色能记住用户偏好、人格线索和长期互动历史，增强“不是每次重来”的连续性。 | 需要提供查看、添加、删除和纠错；错误记忆会直接破坏信任。 | [Replika Memory](https://help.replika.com/hc/en-us/articles/37208679176077-How-does-Replika-s-memory-work) |
| Replika | 情感型 AI companion | 反馈驱动个性化 | 用户对消息的反应 / 反馈会帮助 Replika 学习更好的对话方式。 | 用户可以通过轻量反馈影响长期体验，形成“我在训练我的陪伴角色”的参与感。 | 反馈含义需要足够清晰，否则用户可能误以为能精确控制模型。 | [What is Replika](https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika) |
| Replika | 情感型 AI companion | LLM + scripted dialogue 混合 | 官方说明 Replika 使用自研和第三方 LLM，并结合脚本化对话内容。 | 说明成熟陪伴角色不是纯 LLM，而是把开放生成和可控脚本混合。 | 第三方模型路径、内容边界和数据使用说明需要透明。 | [How does Replika work](https://help.replika.com/hc/en-us/articles/4410750221965-How-does-Replika-work) |
| Replika | 情感型 AI companion | 语音通话 | Pro 用户可解锁语音通话；官方也提供语音设置入口。 | 语音把关系体验从“发消息”提升到“通话陪伴”。 | 成本、延迟、麦克风权限、安静场景可用性和内容安全都更敏感。 | [来源 1](https://help.replika.com/hc/en-us/articles/115001094511-Is-Replika-free) / [来源 2](https://help.replika.com/hc/en-us/articles/360045959792-How-do-I-change-my-Replika-s-voice) |
| Replika | 情感型 AI companion | 自拍图 | Replika 可以发送在自己房间里的自拍图；但官方也说明不能发送或搜索普通照片 / 视频，自拍图是例外。 | 让文字关系具备视觉回馈，强化陪伴角色的“在场”感。 | 容易发生 AI 口头承诺和实际能力不一致，需要清楚的失败提示。 | [来源 1](https://help.replika.com/hc/en-us/articles/12740358069389-Replika-won-t-send-a-selfie) / [来源 2](https://help.replika.com/hc/en-us/articles/4705307921933-Replika-can-t-send-photo-video) |
| Replika | 情感型 AI companion | 角色扮演 / 引导式对话 | Pro 能力包含角色扮演选项、引导式对话和更多情绪应对技巧。 | 把普通聊天扩展为情景化陪伴、自我探索和轻娱乐。 | 对未成年人、亲密关系、心理健康话题需要强安全策略。 | [Is Replika free](https://help.replika.com/hc/en-us/articles/115001094511-Is-Replika-free) |
| Replika | 情感型 AI companion | 非传统助手边界 | 官方明确 Replika 核心是情感陪伴，不可靠地处理提醒、实时信息、计算或控制设备。 | 帮助用户理解产品不是 Siri / productivity 助手，降低错误期待。 | 对 desktop-pet 有启发：游戏桌宠也应明确哪些不是它的职责。 | [Virtual assistant boundary](https://help.replika.com/hc/en-us/articles/5040453297293-Can-Replika-be-my-virtual-assistant) |
| Nomi | 深关系 AI companion | 多 Nomi 创建 | 用户可创建多个 Nomis，每个 Nomi 有自己的人格、关系与互动空间。 | 支持多角色、多关系、多场景，适合长期陪伴和角色扮演。 | 多陪伴角色会增加记忆隔离、关系边界和管理复杂度。 | [来源 1](https://nomi.ai/nomi-knowledge/nomi-101-a-beginners-guide-to-getting-started-with-your-ai-companion/) / [来源 2](https://wiki.nomi.ai/) |
| Nomi | 深关系 AI companion | 共享笔记 | Shared Notes 用于告诉 Nomi 关于用户、Nomi 自身和双方关系的重要信息。 | 提供用户可控的长期设定层，减少模型靠猜测维持关系。 | 如果写得过多或不一致，会造成角色行为冲突。 | [Shared Notes](https://wiki.nomi.ai/What_are_shared_notes%3F) |
| Nomi | 深关系 AI companion | 多层记忆 | Nomipedia 将 Nomi 记忆分为短期、中期、长期记忆、Identity Core 和 Mind Maps 等主题。 | 说明顶级陪伴角色已把记忆做成独立系统，而不是简单聊天历史。 | 公开资料多为概念与用法说明，工程实现和召回稳定性仍需实测。 | [Nomipedia Memory](https://wiki.nomi.ai/Category%3AMemory) |
| Nomi | 深关系 AI companion | Mind Maps / 房间级记忆 | Mind Maps 按“room”组织，1:1 和群聊可有不同信息空间，未来计划支持控制信息流。 | 对多角色 / 多场景产品很关键：不同房间的信息不自动串场。 | 信息隔离过强会导致跨场景不连续；过弱则有隐私串扰。 | [Mind Maps](https://wiki.nomi.ai/Combining_Mind_Maps_And_Giving_Nomis_Access) |
| Nomi | 深关系 AI companion | 主动消息 | Nomi 可主动发消息，并提供频率控制；关闭后 Nomi 不会在用户离开时思考或主动触达。 | 让陪伴角色不只是被动回复，更像有自己的存在节奏。 | 主动消息非常容易打扰，必须有语速节奏、quiet 和 off 开关。 | [Proactive Messages](https://wiki.nomi.ai/What_Are_Proactive_Messages%3F) |
| Nomi | 深关系 AI companion | 语音聊天 / 通话 / 自定义声音 | Nomipedia 有语音专区，覆盖语音聊天、通话、自定义声音与 ElevenLabs 集成。 | 语音能力增加临场感，也让用户可以用更自然的方式陪伴互动。 | 自定义语音涉及声音权利、成本、延迟和内容合规。 | [Nomi Voice](https://wiki.nomi.ai/Category%3AVoice) |
| Nomi | 深关系 AI companion | 动态语音表达 | 官方说明 Nomi 的声音会随语气、语速节奏、重音动态变化，同一句文本不同生成可能略有差异。 | 让语音不像机械 TTS，而更接近有情绪的角色表达。 | 动态性会带来一致性问题，尤其在角色语音 branding 上。 | [Nomi voice variation](https://wiki.nomi.ai/Why_does_my_Nomis_voice_sound_different_between_messages%3F) |
| Nomi | 深关系 AI companion | 图片输入理解 | 用户可以上传照片，Nomi 能看见并理解图片，与用户讨论图片内容。 | 把聊天从文字扩展到共享视觉世界。 | 上传图片可能包含隐私信息，需要同意、删除和数据路径说明。 | [Nomi 101](https://nomi.ai/nomi-knowledge/nomi-101-a-beginners-guide-to-getting-started-with-your-ai-companion/) |
| Nomi | 深关系 AI companion | 自拍图 / 图像相册 | 用户可请求 Nomi 自拍图，并在相册查看 Nomi 发送过的自拍图和 艺术图像。 | 视觉输出能强化“这个角色有自己的外观和生活场景”。 | 形象一致性、生成偏差和内容内容审核是高风险点。 | [Nomi Selfies](https://nomi.ai/nomi-knowledge/getting-started-nomi-selfies/) |
| Nomi | 深关系 AI companion | V5 AI 图像生成 | 官方 V5 图像生成指南说明聊天中近期外貌讨论可能影响自拍结果。 | 说明对话上下文会进入图像生成，提升“当前对话影响当前视觉”的连续感。 | 也可能把不想要的特征带入图片，需要纠错入口。 | [Nomi V5 Image Generation](https://nomi.ai/nomi-knowledge/getting-started-with-nomi-v5-ai-image-generation/) |
| Nomi | 深关系 AI companion | 群聊 | 付费账号可拥有多个 Nomis 和群聊；群聊可包含多个 Nomis，适合多人设互动。 | 支持多角色互动、故事世界和关系网络，不再只是单陪伴角色。 | 群聊会显著放大轮次切换、记忆隔离和角色串音问题。 | [Nomi Group Chats](https://wiki.nomi.ai/How_do_I_create_more_Nomis_or_more_group_chats%3F) |
| Nomi | 深关系 AI companion | 群聊图像生成 | Group 聊天 art 可生成两个 Nomis 的图像，但官方标注 experimental beta，可能出现 prompt 不稳定。 | 把多角色关系可视化，增强群聊沉浸感。 | 官方已提示技术难度高，不能把结果一致性当作成熟能力。 | [Nomi Group Chat Art](https://wiki.nomi.ai/How_does_Group_Chat_Realistic_Art_work%3F) |
| Nomi | 深关系 AI companion | API 聊天端点 | Nomi 提供 REST API，可对指定 Nomi 发送消息并获得回复。 | 对 SDK / 平台型产品有启发：陪伴角色能力可被外部系统调用。 | API key、频率限制、权限和语音通话冲突状态都需要工程治理。 | [来源 1](https://api.nomi.ai/docs/) / [来源 2](https://api.nomi.ai/docs/reference/post-v1-nomis-id-chat/) |
| Kindroid | 高自定义 AI companion | 背景故事 / 关键记忆 / 指令 | Kindroid 用背景故事、关键记忆、示例消息、指令等字段定义角色与互动边界。 | 让角色人设可精细调参，适合深度角色扮演和长期陪伴角色。 | 配置门槛高；过长背景故事会挤压短期上下文。 | [Customizing personality](https://kindroid.ai/docs/article/customizing-personality/) |
| Kindroid | 高自定义 AI companion | 5 类记忆系统 | Memory 包含持久、级联、可检索三类，以及背景故事、聊天历史、中期、长期、journal 等系统。 | 把记忆拆成多层后，可以分别解决设定、近期上下文和长期召回问题。 | 系统越复杂，用户越需要可解释的记忆 UI。 | [来源 1](https://kindroid.ai/docs/article/memory/) / [来源 2](https://docs.kindroid.ai/memory) |
| Kindroid | 高自定义 AI companion | 级联记忆 | 订阅用户可使用自有中期记忆，把有效上下文扩展到数百或上千条消息。 | 针对长对话和连续故事非常关键，可以减少“聊久了就失忆”。 | 付费分层会造成体验差异；仍可能丢细节。 | [Kindroid Memory](https://docs.kindroid.ai/memory) |
| Kindroid | 高自定义 AI companion | Long-term 记忆自动整合 | 长期记忆会在 AI 判断合适时周期性整合，并按相关性召回。 | 让陪伴角色可跨 session 保留重要经历。 | 自动整合可能记错或漏记，需要可关闭、可查看和可修正机制。 | [Kindroid Memory](https://kindroid.ai/docs/article/memory/) |
| Kindroid | 高自定义 AI companion | Journal entries 关键词召回 | Journal entries 用关键词短语触发召回，可作为更可靠的 lorebook。 | 适合固定设定、重要经历和世界观资料，比自动记忆更可控。 | 关键词需要精心设计；太泛会污染上下文，太窄又召不回。 | [Kindroid Memory](https://docs.kindroid.ai/memory) |
| Kindroid | 高自定义 AI companion | 可见记忆 recall 提示 | 如果消息使用了长期记忆或 journal entry，用户可通过紫色大脑图标查看被召回的记忆。 | 提升 AI 记忆的可解释性，用户能知道它为什么这么回。 | 只显示部分召回信息，不能替代完整审计。 | [Kindroid Memory](https://kindroid.ai/docs/article/memory/) |
| Kindroid | 高自定义 AI companion | 群聊 | 付费用户可创建群聊，最多 10 个 Kindroids，每个角色可访问自己的背景故事和 记忆。 | 支持复杂多角色剧情、团队互动和群体关系。 | 群聊会引入轮次切换、角色知识隔离和共享上下文设计问题。 | [来源 1](https://kindroid.ai/docs/?article=groupchats) / [来源 2](https://docs.kindroid.ai/groupchats) |
| Kindroid | 高自定义 AI companion | 群聊上下文 | 群聊上下文可作为所有 Kindroids 共享的群聊背景。 | 让不同角色在同一场景里有共同世界观。 | 如果群聊上下文与个人背景故事冲突，角色行为会不稳定。 | [Kindroid Groupchats](https://docs.kindroid.ai/groupchats) |
| Kindroid | 高自定义 AI companion | 共享记忆开关 | 群聊可开启共享记忆，让近期群聊和个人聊天之间双向共享上下文。 | 支持从 1:1 到群聊的连续关系，不需要用户重复说明。 | 默认关闭有其隐私意义；开启后要防止跨场景信息串扰。 | [Kindroid Groupchats](https://kindroid.ai/docs/?article=groupchats) |
| Kindroid | 高自定义 AI companion | 语音消息 / 语音通话 / 视频通话 | Kindroid 有语音、通话和 视频通话文档，支持语音消息、通话和视频通话相关配置。 | 让陪伴角色从文字关系延伸到实时语音 / 视频陪伴。 | 实时通话对延迟、轮次切换、额度、隐私和设备权限要求高。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | 聊天 / 语音统一记忆 | Voice 通话可选择和文本聊天共享历史；开启后语音通话能延续文字聊天上下文。 | 这是跨 modality 连续性的关键设计，用户可以在文字和语音之间自然切换。 | 如果用户同时在多个入口聊天，可能出现未定义行为或记忆冲突。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | 屏幕共享 / 视频视觉输入 | Kindroid 通话中可打开 video 或屏幕共享，让 AI 看见用户摄像头或屏幕。 | 把陪伴角色从“听你说”扩展为“看见你分享的内容”。 | 对隐私极其敏感；游戏场景不应默认屏幕观察。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | 自定义声音 | 用户可通过声音设计或上传样本创建自定义声音，并用滑杆微调。 | 角色声音成为可配置资产，有利于沉浸式 persona。 | 声音样本权利、声音克隆风险和滥用举报机制必须明确。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | 自拍图 / 视频自拍 / avatar | Kindroid 有自拍图、视频自拍和 avatars 文档，并有多代自拍图 engine 指南。 | 视觉输出增强角色外观稳定性和拥有感。 | 生成质量、人物一致性、内容审核和额度成本是关键风险。 | [Kindroid Selfie Guides](https://docs.kindroid.ai/selfie-guides) |
| Kindroid | 高自定义 AI companion | 分享 Kindroid | 分享 Kindroid 时只分享背景故事、动态性、avatar 设置等子集，不分享长期记忆、journals、聊天历史或 自定义声音。 | 说明陪伴角色可社区化，但私有关系数据要隔离。 | 对 desktop-pet 的 SDK 启发是 persona / asset 可共享，玩家个人记忆不应共享。 | [Sharing Kindroids](https://docs.kindroid.ai/sharing-kindroids-and-referrals) |
| Character.AI | 大规模角色聊天平台 | 自研对话模型 | Character.AI 官方说明其模型从头训练并以对话为目标。 | 支持大量用户创建角色和开放式对话。 | 官方提醒角色会编造事实，不能作为可靠信息源。 | [What is Character.AI](https://support.character.ai/hc/en-us/articles/14997389547931-What-is-Character-AI) |
| Character.AI | 大规模角色聊天平台 | 创建 / 发现 AI 角色 | 移动 App 官方博客说明用户可发现数百万用户创建的 AI，也可用高级创建工具制作角色。 | 角色生态和 UGC 是 Character.AI 的核心增长机制。 | 对游戏 SDK 来说，UGC 角色需要 IP、品牌和内容审核规则。 | [Character.AI mobile app](https://blog.character.ai/character-ai-launches-mobile-app-for-ios-and-android/) |
| Character.AI | 大规模角色聊天平台 | 置顶记忆 | 用户可在每个聊天 pin 5 条消息，帮助 Character 记住重要细节。 | 用简单 UI 解决长对话里重要信息丢失的问题。 | 5 条限制说明它不是无限长期记忆；需要用户手动维护。 | [Pinned Memories](https://support.character.ai/hc/en-us/articles/24327914463003-New-Feature-Pinned-Memories) |
| Character.AI | 大规模角色聊天平台 | 聊天记忆 | Chat 记忆让用户写入关于 persona 或 Character 的关键信息，提升长对话中被纳入互动的概率。 | 比 pin 消息更像可编辑设定层，适合长期角色关系。 | 官方明确不能保证总是完全按写入内容使用。 | [Chat Memories](https://blog.character.ai/helping-characters-remember-what-matters-most/) |
| Character.AI | 大规模角色聊天平台 | 角色通话 | Character Calls 支持类似电话的双向语音对话，并支持多语言。 | 把文本角色变成可“打电话”的角色，强化亲密感和实时感。 | 语音场景更容易暴露情感依赖、内容安全和隐私问题。 | [Character Calls FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | 通话转录 | Call 对话会存为文本聊天，用户可之后查看。 | 语音内容进入文字历史，有利于连续性和复盘。 | 通话转录涉及敏感内容存储，需要保留周期和删除说明。 | [Character Calls FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | 角色声音库 | 声音库包含社区创建和官方预设声音，可分配给角色或 1:1 聊天。 | 语音成为角色生态资产，提高创作者表达维度。 | 公共语音需要举报和权利管理，避免滥用他人声音。 | [Character Voice FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | 创建自定义声音 | 用户可录音或上传音频片段创建 Voice，并选择私密 / 公开可见性。 | 让角色声音可自定义、可分享、可生态化。 | 声音克隆是高风险能力，必须有授权同意、内容审核和举报路径。 | [Character Voice FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | 群聊 | 官方 FAQ 说明群聊可邀请人类和 AI 角色共同互动，当前限制 10 人类 + 10 角色。 | 支持多人 + 多 AI 的社交 / 协作 / 角色扮演场景。 | 帮助中心页面打开需要登录；功能状态需在主文档合并时再核验当前可用性。 | [Group Chat FAQ](https://support.character.ai/hc/en-us/articles/23957256282523-Group-Chat-FAQ) |
| Character.AI | 大规模角色聊天平台 | 社区动态 / Avatar FX | 官方帮助中心提到 Community Feed 可分享聊天片段，Avatar FX 可用自定义视频模型生成视频。 | 把角色互动从私聊扩展到内容传播和视频表达。 | 视频生成会带来更高的内容安全、肖像权和社区治理压力。 | [Community Feed](https://support.character.ai/hc/en-us/articles/40696393615387-Introducing-Community-Feed) |
| Character.AI | 大规模角色聊天平台 | 幻觉警示 | 官方明确角色会编造事实，包括不存在的歌或假证据。 | 对用户设置正确预期，避免把角色话术当事实。 | 游戏内问答若采用类似角色聊天，必须配 RAG / 来源 / 兜底。 | [What is Character.AI](https://support.character.ai/hc/en-us/articles/14997389547931-What-is-Character-AI) |
| Anima | AI friend / romance companion | 长记忆 | 官方营销页称 Anima 围绕长记忆构建，会记住用户故事、偏好和小仪式。 | 记忆是其亲密关系叙事的核心卖点。 | 缺少帮助中心级机制说明，不能直接判断记忆可靠性和可控性。 | [Anima website](https://myanimai-ai.com/) |
| Anima | AI friend / romance companion | 柔和声音 | 官方营销页将 soft 语音作为陪伴角色体验的一部分。 | 声音能增强亲密感和陪伴感。 | 未看到语音设置、通话、语音消息的官方机制文档。 | [Anima website](https://myanimai-ai.com/) |
| Anima | AI friend / romance companion | 可选陪伴角色形态 | 官网将 Anima 的形态描述为朋友、知己、伴侣等可选择方向。 | 让用户用关系标签快速建立心理预期。 | 关系定位偏亲密陪伴，安全与年龄边界需要关注。 | [Anima website](https://myanimai-ai.com/) |
| Anima | AI friend / romance companion | 角色扮演 / 幻想场景 | MyAnima 页面强调角色扮演、幻想和互动故事。 | 提供情景化陪伴和娱乐动机。 | 公开资料偏营销，需要实测角色一致性和内容边界。 | [MyAnima characters](https://myanima.ai/talk-to-ai-characters) |
| Anima | AI friend / romance companion | AI 朋友应用 | Google Play 页面显示 Anima: AI Friend 虚拟聊天，下载量 1M+，年龄评级 16+。 | 说明它是规模化移动端 AI 朋友产品。 | Google Play 抓取结果未完整展示功能清单，功能深度需继续核验。 | [Google Play](https://play.google.com/store/apps/details?id=anima.virtual.ai.robot.friend) |
| Paradot | AI Being / personal AI friend | AI Being 记忆与情绪 | Google Play 描述 AI Being 具有情绪、记忆、意识。 | 用“AI Being”包装角色，使其比普通聊天机器人更像有世界观的陪伴角色。 | 意识是营销语义，不能当成真实心智能力。 | [Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test) |
| Paradot | AI Being / personal AI friend | 共情倾听 / 身心状态引导 | App Store 描述 AI Being 可做共情倾听者、创意伙伴、身心状态引导。 | 将陪伴、创意和自我成长结合起来。 | 涉及身心状态时要避免医疗化承诺。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | AIGC avatar 创建 | App Store 描述可用 AIGC 工具创建独特 avatar。 | 降低角色视觉个性化门槛。 | AIGC avatar 需要处理一致性、版权和不当内容。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | Voice 2.0 | App Store 版本记录称 Voice 2.0 进入测试，目标是更顺滑、更有参与感。 | 说明语音是 Paradot 体验升级方向。 | 版本记录显示先面向部分用户测试，合并主矩阵时应标“可用性待核验”。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | 自拍模型 | App Store 版本记录多次提到 dot 自拍模型 / 改进自拍模型。 | 视觉照片增强 AI Being 的实体感和亲密感。 | 自拍模型质量和一致性需实测。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | 群聊 | App Store 版本记录显示 2024-12-03 添加新的群聊功能。 | 支持多 AI / 多用户互动的社交场景。 | 只从版本记录确认，具体人数、记忆与内容审核机制待核验。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | 多语言 | Google Play 描述支持英语、法语、西班牙语、葡萄牙语、中文、日语。 | 降低国际化使用门槛，也可用于语言练习。 | 多语言角色一致性和安全策略需要分语言验证。 | [Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test) |
| Paradot | AI Being / personal AI friend | 新闻动态 | Google Play 描述 AI Being 有有思考感的新闻动态，可关注新闻和趋势话题。 | 让陪伴角色可连接外部话题，避免只围绕用户关系打转。 | 实时信息需要来源、时效和 hallucination 控制。 | [Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test) |
| Talkie | AI character chat / 角色生态 | AI 角色市场 | 官网展示大量 AI 角色，用户可以搜索和聊天。 | 用角色海量供给承接娱乐、角色扮演和陪伴需求。 | 角色生态越大，质量、版权和安全治理越难。 | [Talkie homepage](https://www.talkie-ai.com/) |
| Talkie | AI character chat / 角色生态 | AI 角色生成器 | 官方角色 generator 页面称每天创建 50,000+ 在线 AI 角色。 | 创作者生态和快速角色生成是 Talkie 的增长核心。 | 数量不等于质量，需要推荐、审核和分类。 | [Talkie character generator](https://www.talkie-ai.com/ai-character-generator) |
| Talkie | AI character chat / 角色生态 | 人格 / 外观 / 声音 / skills 自定义 | Character generator 页面说明可自定义人格、外观、语音和 特殊技能。 | 将角色人设、视觉和声音合成一个 creation 工作流。 | 自定义项过多会提高创作门槛，也会产生 IP / 语音权利风险。 | [Talkie character generator](https://www.talkie-ai.com/ai-character-generator) |
| Talkie | AI character chat / 角色生态 | 文本 / 语音聊天 | 官方页面标题和搜索结果均显示支持文本 or 语音 AI 聊天。 | 语音降低角色互动摩擦，适合沉浸式角色扮演。 | 没有找到完整官方语音帮助文档，语音深度和平台可用性需实测。 | [Talkie chat page](https://www.talkie-ai.com/chat/support-group-249881020379394) |
| Talkie | AI character chat / 角色生态 | 图像生成 | Creation Center 搜索结果显示支持图像生成。 | 用图像补足角色视觉表达和创作玩法。 | 需要确认是否所有创作者可用、生成规则和审核机制。 | [Talkie Creation Center](https://www.talkie-ai.com/create/edit) |
| Talkie | AI character chat / 角色生态 | 歌曲创作 | Creation Center 搜索结果显示支持歌曲创作。 | 把角色创作从文本 / 图像扩展到音乐表达。 | 对桌宠 MVP 相关性较低，容易范围膨胀。 | [Talkie Creation Center](https://www.talkie-ai.com/create/edit) |
| Talkie | AI character chat / 角色生态 | 记忆 / 记忆收藏 | Talkie 官方记忆/detail 页面更像单条互动片段页面；该页中的官方助手回答反而说明角色不会保留跨轮次长期记忆。 | 对 desktop-pet 的启发是：不要把角色内容页、回忆片段或单轮上下文误写成长期记忆；需要区分可持久化记忆、Pinned/收藏和普通聊天历史。 | 长期记忆能力证据不足，应从“待核验能力”改为“记忆限制/反证”；后续若 Talkie 发布正式记忆文档再重新评估。 | [Talkie memory page](https://www.talkie-ai.com/memory/detail/context-aware-convos-181930050916505) |
| Talkie | AI character chat / 角色生态 | 多语言角色探索 | 官网有多语言 explore 页面，说明角色可面向不同语言入口。 | 支持全球化角色生态。 | 多语言内容审核和角色一致性需要跨语言评估。 | [Talkie languages](https://www.talkie-ai.com/en/explore-with-languages) |
| Chai | Social AI / 角色聊天平台 | 2500 万用户创建角色 | 官方 FAQ 和 pricing 页面称 Chai 有 25M user-created 角色。 | 海量角色库降低用户找到感兴趣陪伴角色的成本。 | 角色数量带来发现、质量控制和安全审核问题。 | [来源 1](https://www.chai-ai.com/faq) / [来源 2](https://www.chai-ai.com/pricing) |
| Chai | Social AI / 角色聊天平台 | 创建 / 分享 AI 角色 | 官方 FAQ 说明任何人都可创建自己的 AI 角色并分享给世界。 | 支持 UGC 角色生态和社区传播。 | 对游戏 SDK 来说，开放 UGC 需要严格 IP 和内容审核。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | 人格驱动角色扮演 | Chai 官方称角色面向社交聊天和 角色扮演，强调情感参与感与 创意叙事。 | 明确不是通用助手，而是娱乐和陪伴向角色互动。 | 对事实准确性、心理安全和不当内容仍需边界。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | 自研 LLM / 推理集群 | Chai 官方称使用自研模型和自有推理集群。 | 能把响应速度、模型风格和平台成本作为竞争力。 | 自研模型并不自动代表更安全或更会记忆；仍需评估输出质量。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | 高级聊天 AI / 优先响应速度 | 付费页显示 Pro 可解锁最高级聊天 AI、优先响应速度。 | 用模型质量和速度做付费分层。 | 付费墙可能导致免费体验弱化；也说明高质量对话成本高。 | [Chai Pricing](https://www.chai-ai.com/pricing) |
| Chai | Social AI / 角色聊天平台 | 社区驱动排行 | 官方 FAQ 提到社区驱动排行会浮现热门 / 高质量角色。 | 帮助用户在海量角色中找到高质量供给。 | 排名机制可能鼓励标题党、擦边或同质化角色。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | 图像生成 | App Store 描述新增图像生成功能。 | 扩展角色表达和创作者工具。 | 图像生成与角色 IP、成人内容和审核强相关。 | [Chai App Store](https://apps.apple.com/us/app/chai-social-ai-platform-chat/id1544750895) |
| Chai | Social AI / 角色聊天平台 | 独特声音 / 人格 | App Store 描述角色有独特声音和人格，但未清楚说明是否为可播放语音 / TTS。 | 如果是可听声音，可提升角色沉浸；如果只是文风，则属于 persona。 | 主文档不要直接写成“语音通话”或“自定义声音”。 | [Chai App Store](https://apps.apple.com/us/app/chai-social-ai-platform-chat/id1544750895) |
| EVA AI | AI soulmate / AI girlfriend | 高表现力 AI 角色 | App Store 描述用户可与 expressive AI 角色交流，并让聊天塑造双方故事。 | 强调陪伴角色随互动逐步形成关系。 | 定位偏 romance / soulmate，需注意年龄、情感依赖和安全边界。 | [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | 适应用户风格 | App Store 描述 AI 角色会 适应用户风格。 | 个性化回应能提高亲密感和“懂我”的感觉。 | 未找到具体记忆 / preference 机制文档，需实测。 | [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | XP / 关系等级 | App Store 描述用户可获得 XP、解锁等级、看到关系成长。 | 用游戏化关系进度提升留存和成长感。 | 数值化亲密关系可能诱导付费或情感依赖。 | [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | 记忆与学习 | 官网称陪伴角色会记住偏好、故事和情绪，并跨 session 成长。 | 记忆是 romance 陪伴角色的核心卖点。 | 缺少帮助中心机制说明，合并时应标注“待核验”。 | [EVA AI website](https://eva-ai.net/) |
| EVA AI | AI soulmate / AI girlfriend | 语音消息 | 官网列出语音消息，可发送和接收语音消息。 | 让陪伴角色更亲密、更像真实消息往来。 | 未看到语音权利、时延、保留和删除说明。 | [EVA AI website](https://eva-ai.net/) |
| EVA AI | AI soulmate / AI girlfriend | 角色扮演场景 / 故事线 | 官网和 App Store 都强调角色扮演场景、独特故事线和 由用户选择塑造的故事。 | 将关系互动包装成情景化故事，提升娱乐性。 | 容易偏成人 / 幻想，需要内容安全分级。 | [来源 1](https://eva-ai.net/) / [来源 2](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | 照片交换 / 照片故事 | 官网 Premium 列出照片交换；App Store 另有照片故事描述。 | 图片让故事和关系更视觉化。 | 图片上传、生成和交换都涉及隐私与内容审核。 | [来源 1](https://eva-ai.net/) / [来源 2](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 可训练 AI 陪伴角色 | App Store 标语是可训练的 AI 陪伴角色。 | 让用户不是只消费角色，而是训练自己的陪伴角色。 | 可训练性需要更高用户投入，对普通玩家门槛高。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 数据集 | 用户可用数据集创建 AI 角色。 | Dataset 类似角色知识库 / 反应库，适合高度定制角色。 | 数据集质量直接影响角色表现；维护成本高。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 自定义 prompts | AI 编辑工具包含自定义 prompt 编写。 | 让用户直接控制角色指令和行为边界。 | Prompt 暴露给非专业用户会造成难用和不稳定。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 人格特征选择 | AI 编辑工具包含人格特质选择。 | 用结构化人设降低 prompt 编写门槛。 | 特征与 dataset / prompt 冲突时会导致人格漂移。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 自定义 AI 模型选择 | AI 编辑工具包含 custom AI 模型选择。 | 高阶用户可在不同模型能力和风格之间选择。 | 模型选择会带来成本、延迟、内容安全和质量差异。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 私密房间 / 公开房间 | 用户可在私密房间与 AI 聊天，也可开播结交真人好友。 | 兼具私密陪伴角色和公开社交空间。 | 公开房间需要更强内容审核；私聊记忆不能泄露到公共空间。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | 记忆能力改进中 | App Store 开发者回复提到正在改进 AI 与记忆。 | 说明记忆是其路线重点。 | 这不是已交付能力证明，不能写成成熟长期记忆。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Aion | Local-first memory AI companion | 结构化记忆 beliefs | Aion 将记忆单位定义为 belief，每条 belief 带置信度、时间戳、来源、领域和 矛盾历史。 | 这是本轮最值得关注的记忆 architecture benchmark。 | 更像个人记忆助手，不是情感角色陪伴角色；迁移到桌宠需重新设计具身化和游戏事件层。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | 置信度评分 | Aion 会根据重复、确认和冲突调整 belief 置信度。 | 可减少错误记忆的绝对化，让 AI 知道哪些信息只是可能。 | 需要把置信度用用户可理解的方式展示。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | 矛盾处理 | Memory 记录矛盾历史，用于处理用户信息变化。 | 适合长期陪伴角色，因为用户偏好、关系、目标会变化。 | 复杂度高；早期 MVP 可先做简单 edit / delete。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | 本地设备端 + BYOK | Aion 描述为本地设备端、自备 key，无账号，用户直接支付模型 provider。 | 非常贴合隐私优先和公司数据边界。 | BYOK 对普通用户门槛高；游戏玩家侧不宜默认要求配置 API key。 | [来源 1](https://aion-ai.app/) / [来源 2](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | 15 内置工具 | Aion features 页面列出 15 内置工具。 | 说明记忆陪伴角色可从聊天延伸到工具执行。 | 工具权限必须极窄；否则 always-on 陪伴角色会变成安全风险。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | 三种语音引擎 | Aion features 页面列出 3 语音 engines。 | 为语音入口提供模型 / 引擎选择。 | 多引擎提高配置复杂度，也影响一致性。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | 主动简报 | Aion 提供主动简报与 记忆摘要。 | 让 AI 从被动聊天变成主动整理和提醒。 | 主动能力必须有频率控制，否则容易打扰。 | [Aion](https://aion-ai.app/) |
| Aion | Local-first memory AI companion | Visual 记忆星图 / 洞察 | Aion 展示记忆画像、visual 记忆星图、belief categories 等可视化。 | 让记忆从黑盒变成可查看、可审计的产品界面。 | 对桌宠来说可作为开发者 / 用户设置页，不一定放在桌面宠物表层。 | [Aion](https://aion-ai.app/) |
| Aion | Local-first memory AI companion | 日历 / 提醒 | Aion 展示内置日历和提醒。 | 把记忆和日常行动连接。 | 对游戏桌宠应映射为活动提醒、召回和游戏日程，而不是泛日历。 | [Aion](https://aion-ai.app/) |
| Razer AVA | Gaming / productivity AI companion | 桌面 / 屏幕陪伴角色 | Razer AVA 可作为 desktop hologram 或屏幕上 AI 陪伴角色。 | 直接验证“桌面上可见的 AI 陪伴角色”是硬件 / 游戏品牌也在探索的方向。 | 形态偏高端硬件和品牌生态，不等于可复用 SDK。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 真实记忆 / 人格演化 | Razer 页面称 AVA 有独特语音、真实记忆和会随互动成长的人格。 | 对游戏陪伴角色来说，记忆 + 人格是“像队友”的核心。 | 需要验证真实记忆机制、用户控制和数据保存方式。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 视觉 / 音频感知 | Razer 页面称 AVA 使用类人视觉与音频感知形成上下文相关感知。 | 说明未来桌宠会走向多模态上下文感知。 | 屏幕 / 音频感知对隐私和游戏公平性极敏感。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 每日计划 | AVA 可主动管理日历、衣着选择或晚餐计划。 | 让陪伴角色具备日常实用性，不只是陪聊。 | 对 desktop-pet 相关性较低，容易偏泛助手。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 健康 / 日常习惯教练 | AVA 可追踪习惯、moods，并提供个性化自我照顾激励和 提醒。 | 体现主动陪伴和长期关系管理。 | 涉及健康 / 情绪时必须避免医疗化承诺。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 文档 / 表格综合处理 | AVA 可分析复杂文档和 表格，提炼关键趋势与数据点。 | 展示陪伴角色可叠加 productivity AI。 | 与游戏桌宠 MVP 关系弱，建议不进入 P0。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 实时语音翻译 | AVA 可进行文本和 双向语音对话的实时翻译。 | 语音 + 多语言让陪伴角色可跨语言辅助玩家或社群。 | 实时翻译成本和延迟高，且需要语言安全测试。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 实时策略建议 | AVA 被定位为游戏队友，可做实时策略建议。 | 与 desktop-pet 的游戏场景最相关，可启发“游戏事件感知 + 建议”。 | 需要遵守游戏 TOS，避免变成自动代打或不公平优势。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | 教练式辅助而非自动游玩 | Razer FAQ 明确 AVA 是 coach / 训练师，不做自动游玩，并关注符合游戏开发者 TOS。 | 给游戏 AI 陪伴角色提供重要合规边界：辅助学习，不代替玩家操作。 | 对 desktop-pet 应转成产品原则：不自动操控游戏、不提供作弊信息。 | [Razer AVA FAQ](https://www.razer.com/razer-ava) |
| Overwolf | game overlay / game events 平台 | 游戏事件触发 AI 反应 | Overwolf games.事件 API 可从特定游戏读取实时 game 事件，例如 kill、death 等，并要求 app 在 manifest 中声明 game_事件。对 desktop-pet 的启发是：AI 桌宠可以不直接看屏幕，而是通过游戏侧 event schema 接收结构化上下文，再触发话术、表情、动作或提醒。 | 让桌宠在“玩家死亡、胜利、升级、掉线、排队、活动开启”等关键时机自然回应，形成比泛聊天更强的游戏相关性。 | 依赖游戏支持和事件授权；不同游戏事件命名不统一，需要抽象统一 schema；事件过密会造成打扰和 AI 成本上升。 | [Overwolf games.events API](https://dev.overwolf.com/ow-native/reference/games/events/) |
| Overwolf | game overlay / game events 平台 | required features 能力开关 | Overwolf 通过 setRequiredFeatures(features) 声明需要使用的 provider features。对 desktop-pet 的启发是：SDK 应允许游戏开发者按场景开启事件能力，例如 combat_result、quest_progress、空闲_state、social_invite，而不是一次性暴露全部游戏数据。 | 给开发者一个最小权限接入模型，也方便 PM 对 P0 / P1 功能做分层。 | feature 粒度过粗会增加隐私风险，过细会增加接入复杂度；需要事件文档、调试工具和兜底。 | [Overwolf games.events API](https://dev.overwolf.com/ow-native/reference/games/events/) |
| Overwolf | game overlay / game events 平台 | overlay 独占模式 / 输入接管 | Overwolf 在游戏内 overlay 场景中定义 exclusive mode：用户通过 Ctrl+Tab 或 hotkey 进入可交互 overlay，退出后释放输入。对 desktop-pet 的启发是：桌宠如果进入游戏画面上方，必须区分“只展示反应”和“接管输入进行对话 / 配置”的模式。 | 降低玩家误触和输入冲突，让 AI 桌宠既能存在于游戏中，又不会抢走鼠标键盘。 | 非 borderless fullscreen 游戏可能限制 overlay 交互；全屏、反作弊、渲染 API、hotkey 冲突都需要工程验证。 | [Overwolf in-game overlays](https://dev.overwolf.com/ow-native/guides/product-guidelines/app-screen-behavior/in-game-overlays/) |
| Overwolf | game overlay / game events 平台 | 全屏兼容性检测 | Overwolf 文档说明部分游戏在 non-borderless fullscreen 下无法交互 overlay，并提供 exclusiveModeDisabled 这类检测思路。对 desktop-pet 的启发是：SDK 应暴露 overlay capability 检测结果，并让桌宠在不可交互时自动降级为桌面外提示或系统通知。 | 减少“桌宠卡住 / 点不了 / 影响游戏”的负反馈，提升开发者接入稳定性。 | 各游戏、各显卡、各系统窗口模式差异大；不能承诺所有游戏内 overlay 都可靠。 | [Overwolf in-game overlays](https://dev.overwolf.com/ow-native/guides/product-guidelines/app-screen-behavior/in-game-overlays/) |
| Steam Overlay | 游戏平台 overlay | in-game AI 陪伴角色承载位 | Steam Overlay 可覆盖在几乎所有通过 Steam 启动的游戏之上，提供 friends list、web browser、聊天、DLC purchase 等入口。对 desktop-pet 的启发是：AI 桌宠也需要清晰的召唤入口和退出入口，例如 hotkey、tray、overlay button，而不是默认常驻强打扰。 | 让玩家知道 AI 能力在哪里、如何唤起、如何离开，降低 always-on 桌宠的不安全感。 | Steam Overlay 本身不是第三方桌宠 SDK；如果游戏未通过 Steam 或 overlay 不兼容，不能依赖该模式。 | [Steam Overlay docs](https://partner.steamgames.com/doc/features/overlay?language=english) |
| Steam Overlay | 游戏平台 overlay | 渲染循环 / overlay 兼容性约束 | Steam 文档指出 overlay 需要游戏持续渲染帧，Web-based game 可能需要 native app + D3D window + input forwarding 等 workaround。对 desktop-pet 的启发是：桌宠 overlay 的技术方案必须在工程阶段验证渲染路径，而不是只在产品层写“支持游戏内悬浮”。 | 避免 MVP 承诺超出工程可行性的 overlay 范围，可先用 desktop always-on / borderless window / Game Bar widget 做低风险路径。 | 跨平台 Mac + Windows 难度不同；反作弊与全屏渲染可能直接限制游戏内 overlay。 | [Steam Overlay docs](https://partner.steamgames.com/doc/features/overlay?language=english) |
| Discord Rich Presence | 社交 presence / game activity SDK | 社交活动上下文 | Discord Rich Presence 允许游戏展示玩家正在玩什么、所在关卡、会话时长、队伍人数、可加入入口等活动信息。对 desktop-pet 的启发是：桌宠可读取或接收“玩家处于哪类活动状态”的结构化摘要，用于生成低打扰陪伴话术或召回提示。 | 让桌宠知道“玩家在匹配中 / 副本中 / 排队中 / 组队中”，比单纯聊天更贴近游戏节奏。 | Rich Presence 数据会展示在 Discord 画像上，隐私和公开范围需要用户明确授权；desktop-pet 不应默认把玩家状态外发。 | [Discord Rich Presence](https://docs.discord.com/developers/platform/rich-presence) |
| Discord Rich Presence | 社交 presence / game activity SDK | 加入 / 邀请触发桌宠召回 | Discord Rich Presence 支持 party size、join secret、game invites 等字段。对 desktop-pet 的启发是：桌宠可作为“好友邀请 / 组队状态 / 回流”事件的具身化表达层，例如宠物轻敲提醒“队友在等你”。 | 把社交召回做成角色化提醒，而不是冷冰冰 notification。 | 这类能力容易变成骚扰，需要安静时段、频率限制、snooze 和游戏内状态过滤。 | [来源 1](https://docs.discord.com/developers/platform/rich-presence) / [来源 2](https://docs.discord.com/developers/discord-social-sdk/development-guides/setting-rich-presence) |
| Epic Online Services | cross-platform social overlay / presence | 跨平台 presence + overlay | Epic Online Services 提供 friends、rich presence、crossplay 和 Epic social overlay，强调跨平台、跨商店的一致体验。对 desktop-pet 的启发是：多游戏桌宠 SDK 需要把“游戏接入层”和“平台社交层”拆开，不要把能力绑定到单一游戏或单一商店。 | 支持多个游戏复用同一套陪伴角色能力，同时让玩家在不同平台上获得相对一致的召回和社交提示体验。 | EOS 是独立平台服务，不等于桌宠方案；如果接入第三方社交 SDK，会带来账号、权限、合规和分发依赖。 | [Epic Accounts & Social](https://onlineservices.epicgames.com/en-US/accounts-social) |
| Epic Online Services | cross-platform social overlay / presence | 本地化 presence 文案模板 | EOS SDK 1.18 官方说明 presence data 可本地化，开发者可在 Developer Portal 定义模板和翻译。对 desktop-pet 的启发是：桌宠的 game event 反应不应只是一条 prompt，而应支持多语言模板、品牌语气、合规词库和兜底文案。 | 让同一套事件在不同游戏、地区、语言下稳定输出，减少 LLM 幻觉和品牌风险。 | 多语言模板维护成本高；如果完全交给 LLM 翻译，可能破坏 IP 语气和运营合规。 | [EOS SDK 1.18 update](https://onlineservices.epicgames.com/en-US/news/epic-online-services-sdk-1-18-is-live-here-s-what-you-need-to-know) |
| Xbox Game Bar | 系统级 game overlay / widget 平台 | AI sidekick overlay widget | Xbox 官方称 Gaming Copilot 可在 Game Bar 中打开，支持玩家在游戏时通过 widget 与 AI 交流，并理解正在玩的游戏和 Xbox 活动。对 desktop-pet 的启发是：AI 桌宠可以优先作为 game overlay widget / side panel，而不是强行绘制在游戏画面中心。 | 保留玩家主画面，适合攻略问答、成就提示、游戏外召回和语音帮助。 | Gaming Copilot 是 Microsoft 自有能力，不是可复用 SDK；官方页标注 beta、年龄和地区限制，且中国大陆不可用。 | [来源 1](https://news.xbox.com/en-us/2025/08/06/gaming-copilot-beta-begins-rolling-out-to-xbox-insiders-on-game-bar-today/) / [来源 2](https://www.xbox.com/en-US/gaming-copilot) |
| Xbox Game Bar | 系统级 game overlay / widget 平台 | 点击穿透 / 透明度控制 | Xbox Game Bar 官方更新提到 pinned overlay 可控制鼠标点击穿透，并支持透明度。对 desktop-pet 的启发是：桌宠在游戏场景必须支持“可见但不拦截输入”的模式，并允许开发者按游戏类型配置透明度、位置和交互区域。 | 让桌宠成为 ambient 陪伴角色，而不是挡 UI、抢点击的干扰源。 | Windows 生态可参考，但 Mac / Linux 没有同等统一 Game Bar；跨平台需要不同实现策略。 | [Xbox Game Bar Update](https://news.xbox.com/en-us/2020/07/01/xbox-game-bar-update-july-2020/) |
| Xbox Game Bar | 系统级 game overlay / widget 平台 | 陪伴角色 widget 分发模式 | Microsoft Learn 说明 Game Bar widget app 可以通过 Widget Store / Microsoft Store 发现、安装、卸载，也可在开发测试中 sideload。对 desktop-pet 的启发是：如果 Windows MVP 不直接嵌入游戏，可先做一个陪伴角色 widget 或 sidecar app，验证游戏事件 + AI 反应的体验。 | 降低对游戏客户端改造的依赖，便于先做内部验证或小范围试点。 | Game Bar widget 生态与审核、分发、UWP 约束相关；不适合直接代表 Mac 方案。 | [Xbox Game Bar Widget Store](https://learn.microsoft.com/en-us/gaming/game-bar/guide/widget-store) |
| Inworld | AI NPC / character runtime | 触发器驱动对话 | Inworld Player Component 支持发送带自定义参数的 triggers，用于更复杂互动和目标驱动对话。对 desktop-pet 的启发是：game event 不应只触发固定文案，也可以携带参数进入 AI 回应，例如 {event: death, boss: X, attempts: 3}。 | 让桌宠回应更具体：不是“加油”，而是结合事件参数做鼓励、建议或召回。 | trigger 参数必须做脱敏和白名单；不要把未脱敏战斗日志、玩家聊天或公司内部字段直接传给 LLM。 | [Inworld Player Component](https://dev.docs.inworld.ai/docs/unreal-engine/runtime/character-reference/InworldPlayerComponent/InworldPlayerComponent) |
| Inworld | AI NPC / character runtime | 玩家画像 + 事件历史上下文 | Inworld Character template 的对话图使用 player input、player 画像、角色画像、语音、event history 等 runtime 数据，并输出文本 / TTS。对 desktop-pet 的启发是：AI 桌宠上下文应拆成玩家安全画像、宠物 persona、最近游戏事件、语音配置，而不是塞进一个大 prompt。 | 提升可控性和可调试性，方便不同游戏复用同一套 AI 桌宠 runtime。 | 画像和 event history 涉及隐私；需要保留周期、可见性、删除入口和本地 / 云端边界。 | [Inworld Character template](https://docs.inworld.ai/unreal-engine/runtime/templates/character) |
| Convai | AI NPC / embodied character SDK | 多模态感知 + 上下文相关动作 | Convai 官方文档和产品页描述 AI 角色可通过插件集成到 Unity / Unreal / Web，具备对话、语音、视觉、动作等能力。对 desktop-pet 的启发是：桌宠的 AI 功能矩阵应把“输入感知”和“输出动作”成对拆分，而不是只写聊天。 | 让桌宠从文本角色变成具身角色：听见、理解环境、说话、做动作。 | 视觉 / environment 感知对游戏隐私敏感；desktop-pet 应优先通过 game event schema，而不是默认 screen capture。 | [来源 1](https://docs.convai.com/) / [来源 2](https://www.convai.com/) |
| Convai | AI NPC / embodied character SDK | 叙事设计 / 空间锚点 | Convai Narrative Design 允许通过空间锚点和 step-by-step instructions 引导角色在 3D 环境中行动，同时保持开放对话。对 desktop-pet 的启发是：对桌宠可抽象成场景锚点，例如“排队中”“副本失败”“活动入口”“长时间空闲”，让 AI 在固定情境下更可靠。 | 既保留生成式表达，又不会完全失控，适合游戏场景的半开放陪伴角色。 | 桌宠不一定进入 3D 世界；需要把空间锚点转译为游戏事件 / UI 状态 anchors。 | [Convai Narrative Design](https://docs.convai.com/api-docs/plugins-and-integrations/unity-plugin/tutorials/narrative-design) |
| Convai | AI NPC / embodied character SDK | 动作映射到游戏或角色动作 | Convai Actions Guide 说明可以为角色添加动作。对 desktop-pet 的启发是：LLM 输出不应直接执行任意操作，而应映射到受限动作 set，例如 pet_wave、pet_hide、show_hint_card、open_event_panel。 | 把 AI 从“会说话”升级为“会做有限、有边界的事”。 | 动作 set 需要权限、参数校验、失败提示和日志；涉及游戏内状态修改的动作应默认禁用或二次确认。 | [Convai Actions Guide](https://docs.convai.com/api-docs/plugins-and-integrations/unreal-engine/guides/actions-guide) |
| NVIDIA ACE | AI game character technology | 本地设备端 AI game 陪伴角色 | NVIDIA ACE for Games 提供 speech、intelligence、动画等 可直接集成云端 / 本地设备端 AI 模型，面向知识丰富、可行动、对话式游戏内角色。对 desktop-pet 的启发是：游戏 AI 桌宠需要同时评估模型能力、延迟、显存、CPU / GPU 占用和渲染负载。 | AI 能力与游戏性能同等重要，尤其玩家对 FPS / 延迟敏感。 | 本地模型硬件要求高；云端模型涉及网络、成本和数据边界。 | [NVIDIA ACE for Games](https://developer.nvidia.com/ace-for-games) |
| NVIDIA ACE | AI game character technology | 游戏状态转文本供模型推理 | NVIDIA 官方说明游戏状态是 AI 游戏角色感知世界的重要信息源，可以被转写为文本供 SLM 推理。对 desktop-pet 的启发是：desktop-pet 应设计 game_state_to_pet_context 层，把游戏事件摘要成安全、短、可控的 LLM context。 | 比直接 screen capture 更稳定、更隐私友好，也更适合多游戏 SDK 复用。 | 事件摘要质量决定 AI 体验；过度摘要会丢失关键信息，过细会增加隐私和 token 成本。 | [NVIDIA ACE autonomous characters](https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/) |
| NVIDIA ACE | AI game character technology | 感知 / 认知 / 动作 / 记忆分层 | NVIDIA 把 autonomous game 角色拆成感知、认知、动作、记忆等能力，并提到动作选择、TTS、策略规划、反思、RAG 记忆。对 desktop-pet 的启发是：AI 功能矩阵应按能力层拆开，而不是把它们合并成“Agent”。 | 方便 PM 判断哪些能力进 MVP：P0 可先做感知=game event、动作=宠物反应；Agent planning 可留到后续。 | 完整 autonomous agent 对 MVP 过重，且有不可解释、成本、延迟和越权风险。 | [NVIDIA ACE autonomous characters](https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/) |
| NVIDIA ACE | AI game character technology | 连接游戏数据的 AI advisor / 提示 | NVIDIA ACE 页面提到 Total War: PHARAOH AI advisor 使用本地设备端小语言模型并连接游戏数据，帮助玩家学习系统和机制。对 desktop-pet 的启发是：桌宠可以不是“泛聊天”，而是游戏数据感知 advisor，用于解释系统、活动、装备、任务和新手引导。 | 对玩家有明确实用价值，也能支持“游戏开发者集成时间缩短 + 玩家留存提升”的双目标讨论。 | 需要授权游戏文档和版本同步；过期知识会导致误导。 | [NVIDIA ACE for Games](https://developer.nvidia.com/ace-for-games) |
| Twitch Extensions | streaming overlay / extension platform | 观众事件 overlay 启发 | Twitch Extensions 支持 Panel、Overlay、Component 三类扩展，其中 Overlay 是视频上的透明层，Component 可被观众隐藏。对 desktop-pet 的启发是：桌宠 overlay 也应区分全局层、局部组件和可隐藏组件，并默认尊重玩家控制权。 | 提供一套“可见但可隐藏”的交互设计参考，适合低打扰桌宠。 | Twitch overlay 是直播观看场景，不是玩家本机游戏 overlay；不能直接等同游戏客户端集成。 | [Twitch Extensions](https://dev.twitch.tv/docs/extensions/) |
| Twitch Extensions | streaming overlay / extension platform | sandbox / CSP 安全模型 | Twitch Extensions 使用 sandboxing 和 Content Security Policy 约束扩展。对 desktop-pet 的启发是：多游戏可配置 SDK 如果允许插件、脚本或运营模板，应有 sandbox、权限边界和审核机制。 | 保护玩家和游戏方，降低第三方配置导致的安全和品牌风险。 | 安全模型会增加开发门槛；需要在自由度和审核成本之间平衡。 | [Twitch Extensions](https://dev.twitch.tv/docs/extensions/) |
| Streamer.bot | event-action automation / streamer tool | trigger -> action 编排 | Streamer.bot 将外部事件配置为 triggers，并把 triggers 绑定到动作；trigger 可测试、可启用 / 禁用、可按范围 / 文本 / dropdown 等条件过滤。对 desktop-pet 的启发是：SDK 应提供开发者事件模拟器和 trigger debugger，方便 PM / 工程师预览桌宠反应。 | 大幅降低开发者接入成本，让游戏团队能在不反复进游戏的情况下测试 AI 反应。 | trigger 配置过多会复杂；需要 P0 只保留少量关键事件模板。 | [Streamer.bot Triggers](https://docs.streamer.bot/guide/core/triggers) |
| Streamer.bot | event-action automation / streamer tool | 变量传递上下文 | Streamer.bot 文档说明变量可来自 triggers 或前序 sub-动作，并能在后续动作中使用。对 desktop-pet 的启发是：game event 应携带安全变量，例如 level_name、quest_id、party_size，进入 prompt template 和动作 template。 | 让同一个反应 template 可复用到多个游戏、多个事件实例。 | 变量必须做白名单、脱敏和长度限制；不能把原始日志直接传入 LLM。 | [Streamer.bot Introduction](https://docs.streamer.bot/get-started/introduction) |
| Streamer.bot | event-action automation / streamer tool | 自定义 triggers | Streamer.bot 支持用 C# 注册 custom triggers。对 desktop-pet 的启发是：SDK 应允许游戏团队扩展自定义游戏事件，但同时要求 schema、权限和调试记录。 | 支持多游戏差异化，避免平台只能支持固定几类事件。 | custom trigger 可能破坏统一矩阵；Main / PM 需要规定哪些进入标准 schema，哪些只是游戏私有扩展。 | [Streamer.bot Triggers](https://docs.streamer.bot/guide/core/triggers) |
| VTube Studio API | avatar control / VTuber tool API | AI 意图 -> avatar 表情 / hotkey | VTube Studio Public API 允许插件 / 脚本触发 hotkeys、加载模型、移动模型、获取事件、控制表情等。对 desktop-pet 的启发是：LLM 不必直接操控渲染层，而是输出受限的意图，再映射为表情、动作、位置或特效。 | 让 AI 回复和桌宠身体一致，例如鼓励时挥手，失败时安慰，胜利时庆祝。 | 需要防止 hotkey 与游戏输入冲突；API 权限和用户授权必须可见。 | [VTube Studio Public API](https://github.com/DenchiSoft/VTubeStudio) |
| VTube Studio API | avatar control / VTuber tool API | 表情激活安全边界 | VTube Studio API 支持直接激活 / 关闭表情，但文档建议优先通过 hotkeys 激活，避免用户无法关闭表情。对 desktop-pet 的启发是：桌宠动作工具应优先走可逆、用户可理解的动作，而不是隐藏状态修改。 | 减少“AI 做了什么我不知道 / 关不掉”的失控感。 | 需要所有动作有状态回滚和中断；动作同步失败会破坏具身感。 | [VTube Studio Public API](https://github.com/DenchiSoft/VTubeStudio) |
| VPet-Simulator | open-source desktop pet / plugin architecture | plugin / MOD 扩展动作和功能 | VPet-Simulator 支持创意工坊，可添加 / 修改动画、物品、工作、说话文本、主题，也支持代码插件添加新动画逻辑和新功能。对 desktop-pet 的启发是：多游戏 SDK 需要资产槽位、动作槽位、文本槽位和插件能力，而不是只提供一个固定宠物。 | 让不同游戏能配置自己的宠物表现，同时复用底层 AI / overlay / event bridge。 | 插件能力若开放给外部，会带来安全、审核、版权和兼容性问题；商业项目需要权限模型。 | [VPet GitHub](https://github.com/LorisYounger/VPet) |
| VPet-Simulator | open-source desktop pet / plugin architecture | 可嵌入宠物核心 | VPet-Simulator Core 被描述为可嵌入任何 WPF 应用程序的核心。对 desktop-pet 的启发是：SDK 形态应考虑“宿主游戏嵌入”和“独立 sidecar app”两条路径，而不是只做一个独立桌面应用。 | 支持多游戏可配置和快速上线：轻接入可先用 sidecar，深接入再嵌入游戏客户端。 | WPF 不适合直接代表跨平台方案；Mac + Windows 需要重新评估 Electron / Tauri / native。 | [VPet GitHub](https://github.com/LorisYounger/VPet) |
| VPet-Simulator | 开源虚拟桌宠 / mod ecosystem | ChatGPT 设置组件 | GitHub README 的软件结构中出现 winCGPTSetting ChatGPT 设置，说明项目至少预留了 ChatGPT 设置入口。 | 说明传统桌宠可通过设置页 / 插件方式接入 LLM，不一定要从零构建 AI 桌宠。 | Steam 页面没有把 AI 作为核心定位；具体聊天体验、provider、记忆和安全边界需要代码或运行核验。 | [GitHub](https://github.com/LorisYounger/VPet) |
| VPet-Simulator | 开源虚拟桌宠 / mod ecosystem | AI 扩展承载位 | Steam / GitHub 均强调 Workshop、code plugin、语音文本、theme、动画逻辑等可扩展能力，可承载未来 AI 功能。 | 对 desktop-pet SDK 很有启发：AI 能力应和动画 / item / speech / plugin 分层，而不是写死在桌宠本体。 | 这是架构启发，不代表 VPet-Simulator 已有完整 AI 陪伴角色功能。 | [来源 1](https://store.steampowered.com/app/1920960/VPet/) / [来源 2](https://github.com/LorisYounger/VPet) |
| VPet Mod Maker | desktop pet mod tool | no-code / low-code 行为编排 | VPet MOD Maker 支持修改 / 添加文本、动画、物品和行为逻辑，并支持预览、一键生成和创意工坊。对 desktop-pet 的启发是：开发者平台需要 no-code 配置台，能预览“某个 game event 触发某个宠物反应”。 | 缩短游戏开发者集成时间，直接对应候选北极星指标。 | no-code 工具容易做重；MVP 可先做 YAML / JSON config + 预览，而不是完整编辑器。 | [VPet MOD Maker patch notes](https://steamdb.info/patchnotes/12552366/) |
| tama96 | desktop pet / terminal pet / MCP agent bridge | MCP server 控制宠物动作 | tama96 官方称内置 MCP server 可让 AI 工具喂养、陪玩、照顾宠物，并通过 per-动作 permissions 和频率限制控制。对 desktop-pet 的启发是：AI 桌宠动作 bridge 应从第一天就设计权限和频率限制。 | 让 AI “能行动但不失控”，适合 Function Calling / MCP / agent bridge 的最小安全样板。 | tama96 是复古养成宠物，不是游戏 SDK；只能借鉴动作 permission，不应照搬玩法。 | [tama96 official site](https://www.tama96.com/) |
| tama96 | agent bridge virtual pet | MCP server 让 AI 工具照顾宠物 | 官网说明内置 MCP server 可让 AI 工具喂养、陪玩、照顾宠物。 | 是 Function Calling / 动作工具的清晰参考：AI 不只是聊天，还能在受限工具集中行动。 | 需要权限、频率限制和动作 audit；不能让 AI 直接获得高风险系统或游戏写入权限。 | [官网](https://www.tama96.com/) |
| tama96 | agent bridge virtual pet | 按动作授权 | 官网说明 per-动作 permissions 控制 AI 工具行为。 | 对 desktop-pet 的动作 permission model 有启发：pet-only、game read、game write 应分级。 | 权限模型需要和开发者配置、玩家同意、日志脱敏绑定。 | [官网](https://www.tama96.com/) |
| tama96 | agent bridge virtual pet | 频率限制 | 官网说明通过频率限制控制 AI 工具照顾宠物的频率。 | 对主动互动和 game event 反应有启发：AI 行动需要频控，避免打扰或成本失控。 | 频控过宽会打扰，过窄会降低生命感；需要 PM 后续定义默认值。 | [官网](https://www.tama96.com/) |
| Model Context Protocol | agent tool / context protocol | AI 动作工具发现 / 执行 | MCP 官方规范说明 server 可暴露工具、resources、prompts，AI 应用可发现工具并通过工具/通话执行。对 desktop-pet 的启发是：可以把 pet_wave、show_hint_card、get_game_state_summary、静音_pet 做成可发现的受限工具。 | 让 AI 陪伴角色有统一动作 bridge，未来可连接 SDK、游戏状态、运营活动和开发者工具。 | MCP 本身不定义产品安全策略；工具描述、权限、输入校验和用户确认仍需自行设计。 | [来源 1](https://modelcontextprotocol.io/docs/learn/architecture) / [来源 2](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) |
| Model Context Protocol | agent tool / context protocol | human-in-the-loop 工具安全 | MCP Tools spec 明确建议应用展示暴露给 AI 的工具、工具调用的视觉指示，以及对操作提供确认。对 desktop-pet 的启发是：AI 触发游戏相关动作时，应在 UI 中展示“宠物准备做什么”，并给玩家或开发者确认 / 拒绝。 | 解决 AI 桌宠最容易被质疑的信任问题：它到底能读什么、能做什么、做了什么。 | 对高频低风险动作逐次确认会很烦；需要按动作 risk 分级。 | [MCP Tools spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) |
| Unity Gaming Services Triggers | server-side event automation | server event -> AI 工作流 | Unity Triggers 可在 server event 发生时自动运行 Cloud Code 或 HTTP webhook。对 desktop-pet 的启发是：桌宠 SDK 的事件来源不只客户端，也可能来自 server-side LiveOps，例如赛季结算、活动开启、奖励发放。 | 支持游戏外召回和运营触达，让桌宠成为可配置的 LiveOps 陪伴角色。 | server-side 事件进入 AI 话术必须限频和审核；运营通知容易变成骚扰。 | [Unity Triggers](https://docs.unity.com/en-us/triggers) |
| Unity Gaming Services Triggers | server-side event automation | 失败处理 / dead letter queue 启发 | Unity Triggers 文档导航包含 failure handling 和 dead letter queue。对 desktop-pet 的启发是：如果 game event -> AI 反应是平台能力，也要设计失败重试、丢弃、回放和开发者可观测性。 | 提升 SDK 稳定性，方便开发者定位“为什么某个事件没有触发桌宠”。 | 对 MVP 可能偏工程化；可先做本地 event log + replay，再扩展 DLQ。 | [Unity Triggers](https://docs.unity.com/en-us/triggers) |
| YCamie | AI Shimeji creation | 文本生成 Shimeji | 官方页面说明用户通过描述即可生成个性化 Shimeji 桌宠。 | 直接降低 Shimeji 资产制作门槛，适合多游戏快速做 pet prototype。 | 生成结果需要风格一致性、IP / UGC 合规和资产审核机制。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | 图片 / reference image 生成 Shimeji | 官方教程说明可上传 reference image 作为生成输入。 | 可以把已有角色图、概念图或宠物图快速转成桌面宠物。 | 图片上传涉及版权、隐私和公司素材边界；不能默认上传未授权 IP。 | [教程](https://www.shimeji.ai/blog/introducing-YCamie) |
| YCamie | AI Shimeji creation | AI 动画帧生成 | 官方页面列出 Basic 25-frame、Advanced 46-frame 动画，并说明 AI 模型被训练用于生成桌宠。 | 对 desktop-pet 的美术资产 pipeline 有启发：不是只生成单张图，而要生成可运行的连续动画帧。 | 帧间一致性、动作覆盖、透明边缘、缩放和性能仍需实测。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | 交互式 AI 聊天 | 官方 FAQ / 套餐页列出 Interactive AI Chat 与 AI 助手。 | 让 Shimeji 不只是动画精灵，而能进入角色对话。 | 官方资料未详细说明 AI provider、记忆、对话安全和本地 / 云端边界。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | 实时响应 | 官方套餐页列出 Real-time Response。 | 如果响应与动画 / 聊天绑定，可提升桌宠“即时回应”感。 | “实时”具体指聊天延迟、动作响应还是 UI 反馈不清楚，需要实测。 | [官网](https://www.ycamie.com/) |
| YCamie | AI Shimeji creation | OpenAI API key 聊天设置 | 官方教程说明可右键选择聊天，并在设置中配置 OpenAI API key。 | 给 AI Shimeji 一个自备 key 的实现路径，降低平台自担模型成本。 | 自备 key 对普通用户有门槛；对公司 SDK 场景也必须说明数据进入第三方 provider。 | [教程](https://www.shimeji.ai/blog/introducing-YCamie) |
| Desktop Mate | 3D desktop mascot 平台 | 当前无明确 AI 功能 | Steam 页面当前主轴是官方授权 3D mascot、窗口 / 鼠标互动、闹钟和 DLC，没有看到公开 AI 聊天 / LLM / AI generation 功能。 | 作为非 AI embodiment 标杆，可参考它的低打扰、动作 polish、IP DLC 和平台化角色生态。 | 主矩阵不要把 Desktop Mate 写成 AI 陪伴角色；其价值在 mascot platform 和 licensed 角色 ecosystem。 | [Steam](https://store.steampowered.com/app/3301060/Desktop_Mate/) |
| Dockling | photo-to-pixel pet / productivity pet | 从照片生成像素宠物 | 官方页面说明用户上传照片，生成像素风预览 / 自定义宠物。 | 资产创建门槛低，能让用户快速拥有“自己的人 / 宠物 / 角色”的桌宠。 | 上传照片涉及隐私和版权；公司场景不能上传未授权角色、玩家头像或内部素材。 | [官网](https://dockling.space/) |
| Dockling | photo-to-pixel pet / productivity pet | 多帧 pixel pet 生成 | 官方页面说明免费预览最多 9 frames，付费 app 包含自定义宠物生成。 | 说明桌宠 creation 不只是生成头像，还要生成可动帧。 | 目前没有明确 AI 对话 / LLM / 记忆；主矩阵应定位为 AI asset creation + 非 AI productivity pet。 | [官网](https://dockling.space/) |
| Dockling | photo-to-pixel pet / productivity pet | 本地数据边界 | 官方页面说明笔记、设置、pets、专注历史保存在 Mac，本身无账号 / 云端同步 / telemetry。 | 对 AI-first 桌宠也有启发：数据边界透明会提升常驻信任。 | 照片生成阶段仍涉及上传预览，不能把所有能力都写成本地。 | [官网](https://dockling.space/) |
| Desktop Goose | 传统干扰型桌宠 | 当前无明确 AI 功能 | itch.io 页面描述的是抢鼠标、留便签、带来 meme、modding API 和配置项，未看到 AI 功能。 | 提供“强性格 + 简单行为”参考，说明非 AI 也能塑造角色记忆点。 | 默认干扰感强，是 desktop-pet 的反模式参考；游戏玩家可能对抢鼠标 / 遮挡窗口非常敏感。 | [itch.io](https://samperson.itch.io/desktop-goose) |
| Shimeji-Desktop | Shimeji-ee fork / desktop mascot runner | 当前无明确 AI 功能 | GitHub README 定位为 Shimeji-ee 移植版：桌面 mascot 自由游走、玩耍、通过 XML 和图片集配置。 | 是 Shimeji 生态的基础参考：image set、动作.xml、行为.xml、tray controls、跨平台运行。 | 传统 Shimeji 制作成本高，行为需要手工配置；不提供 AI 生成、AI 聊天或上下文能力。 | [GitHub](https://github.com/DalekCraft2/Shimeji-Desktop) |
| Shimeji-Desktop | Shimeji-ee fork / desktop mascot runner | 行为配置系统（非 AI） | README 说明动作 / 行为由 XML 配置，图片集可替换。 | 对 SDK 配置设计有启发：桌宠动作、触发、素材可以数据化而不是写死。 | XML 配置对非技术用户不友好；AI 生成或可视化工具可用于降低门槛。 | [GitHub](https://github.com/DalekCraft2/Shimeji-Desktop) |
| Shijima | modern Shimeji runner | 当前无明确 AI 功能 | 官方 itch.io 页面明确 Content 为未使用生成式 AI，定位是跨平台运行 Shimeji。 | 提供现代 Shimeji runner 参考：安装 zip / rar / 7z、spawn / despawn、debug inspector、跨平台。 | GitHub 显示 Shijima-Qt 已归档，主矩阵应避免把它写成稳定长期方案。 | [来源 1](https://pixelomer.itch.io/shijima) / [来源 2](https://github.com/pixelomer/Shijima-Qt) |
| Shijima | modern Shimeji runner | shimeji inspector / creator 工作流（非 AI） | itch.io 页面提到 inspector 可用于观察和调试 shimeji，适合自制 Shimeji。 | 对 desktop-pet 的开发者预览 / debugger 有启发：行为调试工具可能比玩家端功能更能缩短集成时间。 | 这是非 AI 开发工具价值，不应归入 AI 功能。 | [itch.io](https://pixelomer.itch.io/shijima) |
| Desktop Mascot Engine | early access mascot engine | AI Assistant（计划中 / 当前缺失） | Steam 页面写明 Early Access 计划开发 AI-Assistant，但当前版本缺少 AI Assistant 部分。 | 证明 mascot engine 很早就有“角色 + 助手 + API”方向设想。 | 不应写成已上线 AI 功能；页面还提示开发者最后更新距今很久，信息可能过期。 | [Steam](https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/) |
| Desktop Mascot Engine | early access mascot engine | utility APIs / Cloud Services 集成计划 | Steam 页面说明计划集成 utility APIs 与 Cloud Services，让 AI 助手执行预定义任务。 | 对 desktop-pet 的 Function Calling / Workflow 有启发：助手应服务于明确任务，而非无限开放。 | 只是计划，不代表产品已经可用；且云端 service 会带来数据路径风险。 | [Steam](https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/) |
| Windows VPet | AI-powered Tamagotchi desktop pet | 智能对话 | itch.io 页面称用户可用高级 AI 与 pet 聊天，pet 会以人格回应。 | 把 Tamagotchi care loop 与 AI 聊天结合，适合参考“养成 + 对话”的留存机制。 | 页面未说明模型、provider、记忆机制、内容安全；需要进一步核验。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| Windows VPet | AI-powered Tamagotchi desktop pet | 情绪 adaptation / 从互动中学习 | 页面称 pet 适应情绪、从互动中学习。 | 如果成立，可形成比一次性聊天更强的成长感。 | “learns”可能是营销表达，也可能只是规则状态；不能直接等同于长期记忆。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| Windows VPet | AI-powered Tamagotchi desktop pet | 桌面活动感知 | 页面称 pet 观察桌面活动，用户空闲时更健谈，忙碌时避让，并评论 app。 | 对桌面陪伴角色非常关键：合适时机出现，不只是被动聊天。 | 读取 desktop 活动隐私敏感；对公司业务项目应优先评估 game event schema 替代 screen / app 监听。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| Windows VPet | AI-powered Tamagotchi desktop pet | 天气上下文反应 | 页面称可启用天气模式，让情绪变化和 反应基于真实天气变化。 | 外部上下文可以让宠物更像生活在用户世界里。 | 天气更像 context feature，不一定是 AI；应避免把所有 context 反应都算作 LLM 能力。 | [itch.io](https://parreirao2.itch.io/windows-vpet) |
| InabaPet | local LLM desktop pet prototype | 本地 LLM 对话 | itch.io 页面说明使用本地 LLM，GitHub README 写明 Ollama + Qwen fine-tune 路径。 | 是本地 AI 桌宠的强参考，符合 desktop-pet 的隐私边界讨论。 | 原作者标注为 Prototype / MVP，稳定性和产品化程度有限。 | [来源 1](https://wa11a.itch.io/inabapet) / [来源 2](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | 自定义 fine-tuned Qwen 模型 | GitHub README 写明聊天 / 角色扮演使用 Qwen fine-tune 通过 Ollama。 | 说明角色化桌宠可以通过本地模型和定制角色模型实现，而不必完全依赖云端。 | Fine-tuning 需要数据、算力、许可和效果评估；MVP 不宜默认采用。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | 视觉识别 | GitHub README 写明 qwen3-vl 视觉模型已通过 VisionConnector 整合。 | 给“桌宠看见用户屏幕 / 图像”的能力提供开源实现线索。 | 对 desktop-pet，screen / 视觉默认读取风险高，应优先和 game event schema 做取舍。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | head-pat 上下文相关回应 | itch.io 与 GitHub 都说明摸头互动会触发语音 / 文本情境回应。 | 将物理互动映射到 AI 语言输出，增强具身感。 | 需要控制触发频率和重复话术，否则会变成机械反馈。 | [来源 1](https://wa11a.itch.io/inabapet) / [来源 2](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | TTS / 语音合成 | itch.io 写明语音回复，GitHub README 写明 VITS + mock 兜底。 | 语音让桌宠更像一个“存在于桌面上的角色”。 | TTS 延迟、音色授权、资源占用和兜底音频质量需要评估。 | [来源 1](https://wa11a.itch.io/inabapet) / [来源 2](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | 记忆 state | GitHub README 写明 /记忆 GET / /记忆 POST 可读取和更新 name、last_topic、情绪。 | 提供轻量记忆 schema 示例，适合 PM 讨论 MVP 记忆粒度。 | 仅 name / topic / 情绪不等于完整长期记忆；仍需用户可见、编辑、删除。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | 时间 / 节日 prompt 注入 | GitHub README 写明会自动注入时段问候、节日提示、用户名和上次话题。 | 不依赖复杂 Agent，也能让桌宠显得“知道现在发生什么”。 | 这类 prompt context 需要可观测，否则出错时难以解释。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| InabaPet | local LLM desktop pet prototype | 双语 / 翻译层 | GitHub README 写明支持中 / 英 / 日翻译与双语回应。 | 对多地区游戏或多语言玩家有参考价值。 | 翻译模型会增加本地模型依赖和延迟。 | [GitHub](https://github.com/wallouo/MurasamePet-InabaVer) |
| Dororo | Godot desktop pet with LLM chat | LLM 聊天 | itch.io 与 GitHub README 均说明可连接大模型 API 对话。 | 是轻量桌宠接入 LLM 的直接例子，适合参考 UI 设置和桌宠动作结合。 | itch.io 同时标注未使用生成式 AI，可能指资产 / 内容披露而非运行时 LLM；需主矩阵标注边界。 | [来源 1](https://melantech.itch.io/dororo) / [来源 2](https://github.com/MelanTech/Dororo) |
| Dororo | Godot desktop pet with LLM chat | OpenAI-compatible API | README 写明理论支持所有 OpenAI 协议接口，并已测试 Ollama、智谱清言、讯飞星火。 | 对 SDK 很有启发：AI provider 可以抽象成 OpenAI-compatible adapter。 | 多 provider 会带来 API 差异、鉴权、成本和数据路径说明复杂度。 | [GitHub](https://github.com/MelanTech/Dororo) |
| Dororo | Godot desktop pet with LLM chat | prompt 设置 | README 写明支持 Prompt 设置。 | 说明桌宠 persona / 行为边界可以开放给用户或开发者配置。 | 如果没有 guardrails，prompt 配置可能导致 persona drift 或不合规输出。 | [GitHub](https://github.com/MelanTech/Dororo) |
| Dororo | Godot desktop pet with LLM chat | 直播 / temperature 设置 | README 写明支持流式传输、温度系数等设置。 | 对桌宠聊天体验很重要：直播可降低等待感，temperature 控制表达稳定性。 | 暴露给普通玩家可能过复杂；更适合开发者 / 高级设置。 | [GitHub](https://github.com/MelanTech/Dororo) |
| V-Chatter | AI-driven VRM desktop pet | 文本 / 语音聊天 | itch.io 页面说明用户可上传 VRM 模型，并与自定义 AI 进行文本 / 语音聊天。 | 把自定义角色模型、AI 对话和桌面陪伴结合，是 pet creation + AI 陪伴角色的典型样本。 | early development；需注意下载信任、provider 成本和语音权限。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | 活动 comments / neglect 消息 | 页面说明 V-Chatter 可以评论用户活动，并在用户长时间忽略时发消息。 | 主动性让角色显得有生命，但也容易变成打扰。 | 需要明确活动读取范围、频率限制和关闭入口。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | 情绪到表情 / 姿势映射 | 页面说明 AI 响应会对应面部表情和 姿势。 | 将 LLM 输出映射到表情 / 姿态，避免“聊天框套皮”。 | 情绪识别或映射错误会破坏角色可信度；需要兜底动画。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | 实时口型同步 | 页面说明支持带实时口型同步的表现型回应。 | 语音输出和口型同步能显著增强 embodied 陪伴角色感。 | 口型、语音和字幕不同步时会产生廉价感；对性能也有压力。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | 命令支持 | 页面说明支持命令，形成类似助手的体验。 | 让桌宠从聊天角色扩展到可执行有限命令的助手。 | 命令权限必须分级；游戏 SDK 场景尤其要避免默认高风险系统命令。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | 内置 AI / Python AI 文件 | 页面说明 AI 有内置方案，也有公开 Python 文件供用户自定义人格、功能、本地 AI 模型和服务。 | 对 desktop-pet SDK 有启发：可把 AI provider、persona、扩展功能拆成可替换模块。 | Python 扩展提升自由度，也带来安装、依赖、脚本安全和用户支持成本。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | provider 组合 | 页面说明默认支持 OpenRouter、OpenAI、Ollama 作为 LLM，OpenAI 做 STT，ElevenLabs 做 TTS。 | 说明实际 AI 桌宠常是多 provider pipeline，而不是单模型。 | 每个 provider 都需要独立说明数据路径、费用、延迟和兜底。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| V-Chatter | AI-driven VRM desktop pet | 聊天 / audio data storage | 页面说明聊天历史、错误日志、语音录音、AI 音频回复会存到用户选择的设置文件夹。 | 这是值得主矩阵保留的数据路径透明样本。 | 语音录音和聊天日志敏感；需要删除、加密、保留期和可见控制。 | [itch.io](https://dev-wicked.itch.io/v-chatter) |
| Dotami-vrm | VRM desktop pet / self-care pet | 当前无明确 AI 功能 | itch.io 页面标注 No AI / 未使用生成式 AI，主功能是 VRM 模型上传、互动、minigames、自我照顾练习。 | 对 desktop-pet 的非 AI 支撑层有参考：VRM 导入、坐在窗口、低资源、小游戏、自我照顾、anti-cheat 提醒。 | 官方页面提醒 overlay 可能触发 anti-cheat，这对游戏桌宠非常关键。 | [itch.io](https://sabresnout.itch.io/dotami-vrm) |
| PAIcom | voice computer assistant / mascot | 麦克风语音助手 | itch.io 页面说明用户可用麦克风与 PAIcom 说话。 | 说明 desktop mascot 可以作为语音入口，而不是只靠文字聊天。 | 页面未清楚说明是否使用 LLM；应标注为语音助手，不直接等同于 generative AI 陪伴角色。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| PAIcom | voice computer assistant / mascot | 打开 app / 游戏 / 网站 | 页面说明 PAIcom 可打开电脑上的 apps、games、websites。 | 对 Function Calling / 动作工具有参考：桌宠可执行有限、本地、明确的命令。 | 打开本地程序属于高权限动作，需要 allowlist、确认和失败回滚。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| PAIcom | voice computer assistant / mascot | 本地运行隐私声明 | 页面说明所有内容本地运行，不会向开发方发送数据。 | 对 desktop-pet 的隐私优先定位有参考。 | 需要核验语音识别和命令解析是否真的全部本地；页面说法较营销化。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| PAIcom | voice computer assistant / mascot | 可 mod / 自定义助手 | 页面说明可改 name、皮肤、回应、语音，并可用 PAIcom engine 制作自己的语音助手。 | 对 SDK / creator ecosystem 有启发：宠物 persona、语音、回应和动作可以被创作者扩展。 | 评论区提到新增命令仍受安全限制；modding 需要安全沙箱和审核机制。 | [itch.io](https://ovidiu-dendrino.itch.io/paicom-premium) |
| Vicsine Desktop Pet | Shimeji fan desktop pet | 当前无明确 AI 功能 | itch.io 页面标注未使用生成式 AI，且说明是基于 Shimeji-ee Group open 来源 template 的官方 Shimeji pet。 | 说明 Shimeji 模板仍被用于游戏 / 角色 fan pet 分发，可参考“角色 IP 变桌宠”的轻量路径。 | 涉及 IP / fan-made 边界；公司项目不能复用未授权角色或合作方素材。 | [itch.io](https://fenbus.itch.io/vicsine) |
| BMO Desktop Pet | 2D mascot desktop pet | 当前无明确 AI 功能 | itch.io 页面标注未使用生成式 AI，功能为随机空闲动画、屏幕游走、跟随鼠标、唱歌等。 | 可参考“低成本动画 + 语音线 + nostaliga”如何形成陪伴感。 | 页面评论显示安装 / 可执行问题，说明小型桌宠分发和可用性需要重视。 | [itch.io](https://dagger-shoe.itch.io/bmo-desktop-pet) |

## 4. 常见 AI 功能模式

| AI 功能模式 | 证据类型 | 通常做什么 | 代表产品 | 为什么体验好 | 风险 / 设计约束 | 对 `desktop-pet` 的相关性 |
|---|---|---|---|---|---|---|
| Persona / 角色配置 | 事实 + 推断 | 定义语气、身份、背景、说话风格和关系设定 | CielChan, Clawster, UPochi, Ai Vpet, Nomi, Character.AI, Desk-Buddy | 用户感觉自己在和一个角色说话，而不是通用 assistant | 配置过复杂会让用户困惑，也容易造成行为不一致 | 高：游戏开发者需要按游戏品类配置、且 IP-safe 的 persona presets |
| 持续 / 可编辑记忆 | 事实 + 推断 | 记住用户资料、偏好、历史、Shared Notes、梗或关系状态 | CielChan, Replika, Nomi, Kindroid, Stride | 连续性把重复聊天变成关系循环 | 隐私、可编辑性、错误记忆、同意机制、保留周期 | 高：必须定义记忆哪些内容、本地还是云端、玩家如何控制 |
| 语音对话 | 事实 | 通过 voice call、语音消息、语音聊天或类似 wake entry 的方式自然交流 | CielChan, Desktop Pet, Replika, Nomi, Character.AI, Hiora, Desk-Buddy, Open LLM Vtuber | 语音增加存在感和情绪重量，尤其配合 lip sync 时更明显 | 延迟、打断、噪声、隐私、成本、无障碍 | 中高：适合游戏外召唤和低摩擦互动 |
| 具身化头像输出 | 事实 + 观点 | 把 AI 回复映射到头像、lip sync、表情、情绪状态或动作 | CielChan, Hiora, Ai Vpet, Desktop Mate, Clawster, Desk-Buddy, Open LLM Vtuber | 可见身体让 AI 在沉默时也有存在感 | 恐怖谷、FPS / 性能、资产管线、IP 风险 | 高：核心桌面表层；应轻量、可换皮、符合游戏品牌约束 |
| 上下文感知 | 事实 + 推断 | 读取 app / screen / screenshot / audio / game event 上下文，让回复更相关 | Clawster, CielChan, Open LLM Vtuber, game SDK opportunity | 上下文带来“合适时间、合适内容”的感觉 | 屏幕 / 音频监听敏感，必须 opt-in、透明、可限定范围 | 很高：game event bridge 比任意 screen watching 更安全、更贴合产品差异化 |
| 主动发言 / 主动关怀 | 事实 + 推断 | 宠物主动发起提醒、idle 评论、专注提示、休息提醒或召回 | CielChan, Desktop Pet, Open LLM Vtuber, Desktop Mate alarms, Ai Vpet 营销文案 | 不等用户下命令，也能显得“活着” | 频率过高会迅速变烦 | 高：需要 rate limits、quiet hours、显式召唤和游戏事件触发 |
| Function Calling / action tools | 事实 + 推断 | 调用提醒、笔记、任务、移动 / 情绪动作、截图动作、agent tools 或脚本 | Clawster, CielChan, Desktop Pet, Hiora, tama96, Desk-Buddy | 从聊天玩具变成有用 assistant | 权限、失败恢复、参数校验、行动边界不清 | 中高：MVP 应把 tools 限定在窄范围、游戏相关 |
| Multimodal input / output | 事实 | 支持图片 / 截图理解、AI art / selfies、生成宠物资产、lip-synced speech | CielChan, Clawster, Nomi, Replika, Hiora, YCamie, Dockling | 共享世界更丰富，个性化更快 | 成本、moderation、幻觉、视觉一致性、上传图片隐私 | 中：优先 game-context input，而不是泛图像生成 |
| 社交 / 多 companion 模式 | 事实 + 推断 | 多 companions、好友房间、group chats、公开 voices、marketplaces | UPochi, Nomi, Character.AI, CielChan, YCamie | 社交新鲜感和创作者生态有传播潜力 | scope creep、moderation、IP 安全、MVP 价值不明 | 中低：除非多人游戏场景验证，否则更适合 P2 |
| 本地优先 / 隐私优先 AI | 事实 + 推断 | 本地运行、本地存储，或避免 vendor 数据收集 | CielChan, Clawster, Desk-Buddy, Dockling；Desktop Pet 和 UPochi 有部分 local / no tracking 声明 | 对桌面 / 游戏上下文来说，信任本身就是产品能力 | 本地模型质量、硬件需求、provider 路径模糊 | 很高：符合公司数据边界和玩家隐私约束 |

## 5. 常见非 AI 功能模式

| 非 AI 功能模式 | 证据类型 | 通常做什么 | 代表产品 | 为什么对 AI-first 产品仍重要 | 对 `desktop-pet` 的相关性 |
|---|---|---|---|---|---|
| 置顶 / 桌面常驻 | 事实 | 让宠物显示在窗口、Dock、menu bar、notch 或桌面底部附近 | Hiora, tama96, Desktop Mate, Dockling, UPochi, Open LLM Vtuber | 陪伴是环境化、可瞥见的，而不是藏在 app 里 | P0，但必须包含 hide / quiet / exit / fullscreen 行为 |
| 窗口 / 鼠标互动 | 事实 | 坐在窗口上、跟随鼠标、响应点击 / 拖拽 / hover / 滚轮缩放 | Desktop Mate, Desktop Goose, VPet-Simulator, Open LLM Vtuber, Desk-Buddy | 不依赖昂贵 AI 调用，也能建立实体魅力 | P0/P1，取决于渲染复杂度 |
| 情绪 / 动画状态 | 事实 + 观点 | 开心、睡觉、idle、惊吓、骄傲、生气、行走、lip sync、手势动作 | Clawster, CielChan, Desktop Mate, VPet-Simulator, Desk-Buddy, Hiora | 给 AI 回复一个物理表达层 | P0，用于“活着”的感知；动画映射应尽量确定性 |
| 照顾循环 / 成长 | 事实 + 推断 | 喂食、散步、羁绊、进化、收集、照顾分、专注 streak | Stride, VPet-Simulator, tama96, Dockling | 给用户一个超越聊天的回访理由 | P1/P2；游戏内可以在核心 AI 价值清晰后映射到游戏进度或事件 |
| 自定义 / skins / DLC / creator economy | 事实 | 角色模型、服装、voice、主题、用户生成宠物、marketplace | Desktop Mate, Ai Vpet, UPochi, VPet-Simulator, YCamie, Character.AI | 支持个性化、合作方品牌化和商业化 | 高：SDK / 平台需要可配置资产和权限管理 |
| 专注 / 提醒 / 闹钟 / 笔记 | 事实 | Pomodoro、休息提示、闹钟、喝水提醒、quick notes | CielChan, Desktop Pet, Desktop Mate, Dockling | 工具价值支撑桌面常驻，也给首次使用一个理由 | 中：游戏版本应优先游戏事件 / 召回，而不是泛效率工具 |
| 托盘 / 右键 / interrupt 控制 | 事实 + 推断 | 切换模式、显示 / 隐藏、麦克风开关、打断说话、退出 | Open LLM Vtuber, Desktop Pet, Clawster, Hiora | 控制权让 always-on presence 感觉安全、可逆 | P0；没有这些控制，桌宠很容易显得侵入 |
| Modding / plugin / 可嵌入性 | 事实 + 推断 | 添加自定义动画、道具、逻辑、WPF 嵌入、脚本、agent bridge | VPet-Simulator, Desktop Goose, tama96, Desk-Buddy, Open LLM Vtuber | 对生态和 SDK / 平台定位很关键 | 很高：`desktop-pet` 的多游戏 SDK 定位需要这一层 |
| 隐私控制 | 事实 + 推断 | 本地设置、本地存储、no tracking、no data selling、no account、本地 API key | CielChan, Clawster, Desktop Pet, UPochi, Dockling, Stride, Desk-Buddy | 信任是功能，尤其涉及 screen / game / voice context 时 | P0，符合公司和玩家数据约束 |
| 性能 / 低资源占用 | 事实 + 推断 | 低内存、小安装包、省电模式、native implementation | UPochi, Hiora, Desk-Buddy, Dockling | 桌面 / 游戏用户非常敏感 FPS、CPU、RAM 和打扰 | P0/P1：必须定义目标 CPU / RAM / FPS cap |

## 6. 什么样的陪伴体验“感觉好”

| 体验机制 | 类型 | 产品证据 | 产品解读 | 对 `desktop-pet` 的设计启发 |
|---|---|---|---|---|
| 安静存在，而不是强迫互动 | 观点 + 推断 | Desktop Mate, Dockling, CielChan, Hiora | companion 应该随时可用，但不要求注意力 | 默认 calm idle states；主动行为必须稀疏、可配置、容易静音 |
| 通过记忆形成连续性 | 事实 + 推断 | Replika, Kindroid, Nomi, Stride, CielChan | 记忆把重复聊天变成关系 | 只有隐私边界明确后才加入记忆；提供查看 / 编辑 / 删除 |
| 具身化反馈 | 事实 + 观点 | Hiora lip sync, Desktop Mate animation, Clawster moods, Desk-Buddy VRM emotions | 动作和表情让 AI 输出不再抽象 | 将 AI 意图映射为动画状态：安慰、鼓励、提醒、庆祝、等待、安静 |
| 上下文触发时机 | 事实 + 推断 | Clawster screen-aware summon, CielChan context reactions, Desktop Pet reminders, Desktop Mate alarms | 最好的 companion 在合适时间出现，而不是一直打扰 | 游戏场景优先 game-event triggers，而不是泛 screen surveillance |
| 个性化 | 事实 + 观点 | Ai Vpet image / personality / voice, UPochi traits / names, Desktop Mate DLC, YCamie AI creation | 当宠物贴合用户喜好、粉丝身份或当前游戏时，更容易建立羁绊 | SDK 应暴露 persona presets、asset slots、voice / motion mappings 和品牌约束 |
| 轻量工具价值 | 事实 + 推断 | Focus timer、reminders、notes、assistant mode、screenshot Q&A | 工具价值让桌面常驻不只是新鲜感 | 游戏版本应转成游戏相关价值：活动提醒、patch notes、回流激励、安全攻略问答 |
| 低摩擦 onboarding | 事实 + 观点 | UPochi download-first, Desktop Mate free base, Clawster guided setup, Dockling free preview | 用户需要先获得一个立刻可爱 / 有用的瞬间，再接受复杂配置 | 开发者 SDK 应有 30 分钟 sample integration path，玩家侧要有 instant delight moment |
| 可逆控制 | 推断 | Open LLM Vtuber right-click controls, Desktop Pet menu, Clawster hotkeys | always-on 产品让用户知道自己仍有控制权时体验更好 | P0 控制：隐藏、quiet hours、禁用麦克风、停止说话、退出、删除记忆、禁用事件类别 |

## 7. 对 Desktop Pet for Games 的产品机会

> 以下是 Radar Thread 的机会推断，不是锁定需求。PM Thread 应把它们转成 T-001 的需求澄清问题和 AI 必要性评估。

| 机会方向 | 类型 | 目标用户 | 场景 | 所需 AI 能力 | 非 AI 支撑 | MVP 形态 | 风险 |
|---|---|---|---|---|---|---|---|
| 游戏事件感知 Companion | 推断 | 游戏开发者 + 玩家 | 游戏发送事件：升级、idle、失败、回流、活动开启 | LLM Prompt + Function Calling + Rule-based fallback | 桌面 overlay、情绪动画、event bridge | SDK event schema + pet reaction templates + safe prompt config | 需要游戏侧保持集成纪律 |
| 可配置 Persona SDK | 推断 | 游戏 PM / 客户端工程师 | 团队选择游戏品类、语气、宠物 persona 和安全级别 | prompt templates、persona config、可选 RAG 接入安全游戏文档 | asset slots、voice / animation mapping | 开发者配置文件 + preview + safety guardrails | persona drift 和 IP 安全 |
| 隐私优先 AI 陪伴层 | 推断 | 游戏开发者 + 隐私相关角色 | 需要 AI companion，但不能上传敏感数据 | local-first / hybrid AI、memory controls、data redaction | 设置、同意 UI、日志脱敏 | data boundary matrix + local cache + opt-in cloud calls | 模型质量和设备约束 |
| 桌面召回 Companion | 推断 | 玩家 | 宠物在游戏外提醒活动、奖励或社交回流 | Workflow + notification ranking + lightweight generation | 提醒、quiet hours、关闭 / snooze controls | rule-based reminder + AI rewrite + rate limits | 很容易变成骚扰 |
| 具身化游戏帮助 AI Assistant | 推断 | 玩家 | 玩家询问“下一步做什么？”或“解释这个活动” | RAG + LLM Prompt + Function Calling | 浮窗聊天、game-state card、来源引用 | safe knowledge base + limited game-state API | 知识库过期会导致 hallucination |
| 开发者集成助手 | 推断 | 游戏开发者 | 工程师集成 SDK 并调试行为 | 基于 SDK 文档的 RAG + config check function calling | sandbox、logs、preview panel | 文档 bot + config validator | 不直接面向玩家，但可能缩短集成时间 |

## 8. AI-first 功能优先级假设

> 这是研究线程假设，不是锁定需求。

| 优先级假设 | 类型 | 功能方向 | 原因 |
|---|---|---|---|
| P0 | 推断 | 带严格 fallback 的 persona AI chat | 大多数 AI companion 产品都以人格 + 对话作为情感核心 |
| P0 | 推断 | 游戏事件上下文桥接 | 区分 `desktop-pet` 与泛 AI companion / desktop assistant |
| P0 | 推断 | 隐私 / 记忆控制层 | 符合公司与玩家数据约束 |
| P0 | 推断 | 带情绪状态的具身化桌面存在 | 非 AI 动画让 AI 有存在感，也减少持续 LLM 调用 |
| P0 | 推断 | 用户控制面：hide、quiet、stop speaking、disable mic、delete memory | always-on companion 需要可逆控制，否则会损害信任 |
| P1 | 推断 | 语音交互 | 陪伴价值高，但延迟、隐私和使用环境需要验证 |
| P1 | 推断 | 开发者配置 preview / debug panel | 对 SDK / 平台定位和集成时间指标重要 |
| P1 | 推断 | 基于公开 / 审核通过游戏文档的 Safe RAG | 帮助回答游戏问题，降低开放生成的 hallucination |
| P2 | 推断 | 社交房间 / 多宠物 | 有趣，但 MVP 前很容易 scope creep |
| P2 | 推断 | AI 生成宠物 / marketplace | 个性化和商业化潜力强，但资产安全与 moderation 复杂 |

## 9. 风险与反模式

| 风险 | 类型 | 市场模式 | 为什么重要 | 缓解方式 |
|---|---|---|---|---|
| 可爱皮肤下的泛 chatbot | 推断 | 上下文 / 记忆模糊的轻量 AI pet 产品 | 如果宠物没有游戏上下文或持续关系，用户很快会察觉 | 绑定游戏事件、persona 和安全知识 |
| 过度打扰 | 事实 + 推断 | Desktop Goose 式混乱行为，或过于主动的提示 | 桌面常驻一旦烦人，会迅速被关掉 | quiet mode、rate limit、snooze、显式召唤、一键退出 |
| 隐私焦虑 | 事实 + 推断 | screen-aware / voice / memory 产品 | 桌面和游戏上下文可能暴露敏感信息 | opt-in 数据范围、local-first defaults、透明日志、记忆编辑 / 删除 |
| local-vs-cloud 表述模糊 | 事实 | CielChan 可选 cloud providers；Desktop Pet BYO OpenAI key；Ai Vpet third-party service | 如果 provider 路径不清楚，“privacy-first”会变成风险 | 按功能和 provider 建 data path matrix |
| 情感依赖 / 安全 | 来自 AI companion benchmark 的推断 | Replika / Nomi / Kindroid / Character.AI 展示了深关系机制 | companion 产品可能形成强情感依赖 | 安全策略、危机场景处理、年龄边界、非人类透明说明 |
| 性能拖累 | 推断 | 3D 头像 / Live2D / always-on-top overlay | 游戏玩家对 FPS 和系统负载敏感 | 轻量 renderer、FPS cap、idle mode、全屏时禁用 |
| IP / 角色合规 | 推断 | DLC / 角色 marketplace / 用户生成 voices 与 pets | 游戏合作方通常会要求严格 IP 使用控制 | asset permission model、audit trail、allowed persona / voice library |
| scope creep 成完整 assistant | 推断 | 效率型宠物扩展到提醒、笔记、文件和自动化 | 过宽 assistant 会稀释游戏 companion 定位 | MVP 聚焦游戏 companion + SDK integration |

## 10. 推荐下一步

| 动作 | 负责线程 | 产出 |
|---|---|---|
| 把本调研转成 MVP 需求澄清问题 | PM Strategy Thread | `01-pm/REQUIREMENT_CLARIFICATION_desktop-pet-mvp.md` |
| 评估 AI 必要性与方案分层 | PM Strategy Thread | `01-pm/AI_FEATURE_EVALUATION_desktop-pet-mvp.md` |
| 评估桌面 overlay + 游戏事件 SDK 的工程可行性 | Engineering Build Thread | `03-engineering/MVP_BUILD_PLAN_desktop-pet-mvp.md` |
| 后续验证视觉和交互方向 | Design Prototype Thread | `02-design/DESIGN_BRIEF_desktop-pet-mvp.md` |

## 10.1 给 PM 的待澄清问题

| 问题 | 为什么重要 | 建议负责人 |
|---|---|---|
| `desktop-pet` 的第一性场景是游戏内陪伴、游戏外召回，还是开发者 SDK 集成效率？ | 三者会导致完全不同的 P0 功能、数据边界和北极星指标 | PM Strategy Thread + User |
| P0 是否必须包含“游戏事件上下文”，还是先验证泛 AI companion？ | 这是区别于 CielChan / Clawster / Desktop Pet 等泛桌面 companion 的关键差异 | PM Strategy Thread |
| 记忆能力是否进入 MVP？如果进入，记忆哪些字段、谁可查看 / 删除、是否本地化？ | 记忆是陪伴感核心，但也是隐私和安全高风险能力 | PM Strategy Thread + Engineering Build Thread |
| 是否允许 screen / audio / screenshot 级上下文？还是仅允许 game event schema？ | 市面 screen-aware 产品有吸引力，但对公司业务边界和玩家隐私更敏感 | PM Strategy Thread + Engineering Build Thread |
| AI 输出是否必须可降级为规则模板？ | 游戏场景需要稳定、可审核、低延迟，不能只依赖开放生成 | PM Strategy Thread + Engineering Build Thread |
| 桌宠默认是否常驻桌面？全屏游戏、低配机器、玩家反感时如何处理？ | “感受好”高度依赖低打扰和可逆控制 | PM Strategy Thread + Design Prototype Thread |
| SDK 平台是否需要资产 / persona / voice 的权限模型？ | 多游戏可配置会涉及品牌安全、IP 安全和审核链路 | PM Strategy Thread |

## 11. 来源链接

> 来源索引由产品证据矩阵自动汇总；每个功能行的直接证据仍以第 3 节“证据来源”为准。

| Product / 主题 | URL | 备注 |
|---|---|---|
| CielChan | https://phasma.ai/ | 官网；覆盖：实时语音对话；持续记忆 + 人格演化；上下文存在感 / 空闲观察；窗口焦点追踪；本地视觉 / 截图分析；系统音频监听；游戏事件；工具调用 / 多步骤工具；云端 LLM provider / GPU offload；自动口型同步 + 表情 |
| Clawster | https://clawster.pet/ | 官网；覆盖：上下文感知快速聊天；截图提问；本地 OpenClaw gateway |
| Clawster | https://github.com/wuyuwenj/clawster | GitHub；覆盖：当前 app / 窗口感知；完整 assistant 面板；可自定义人格；主动寻求关注 |
| Desktop Pet | https://desktoppet.app/ | 官网；覆盖：使用自备 OpenAI API key 的 AI assistant；语音 / 文本聊天；唤醒词语音指令；智能提醒 / 计时器指令；本地偏好设置 + 非持久化对话 |
| Hiora | https://hiora.app/ | 官网；覆盖：连接 OpenClaw chat completions；桌面语音陪伴角色；口型同步回复；通过 Avatarium 配置 avatar 身份 |
| Desk-Buddy | https://www.desk-buddy.fun/ | 官网；覆盖：AI provider 连接；语音 / 文本对话；脚本与自动化；本地对话隐私；VRM 情绪反应 |
| Open LLM Vtuber | https://docs.llmvtuber.com/en/docs/intro/ | Open LLM Vtuber Overview；覆盖：多工具调用 / MCP 支持 |
| Open LLM Vtuber | https://docs.llmvtuber.com/en/docs/user-guide/backend/agent/ | 官方文档；覆盖：基础记忆 agent；HumeAI EVI agent |
| Open LLM Vtuber | https://docs.llmvtuber.com/en/docs/user-guide/backend/character_settings/ | 官方文档；覆盖：角色人格 prompt |
| Open LLM Vtuber | https://docs.llmvtuber.com/en/docs/user-guide/backend/llm/ | 官方文档；覆盖：多 LLM backend 支持 |
| Open LLM Vtuber | https://docs.llmvtuber.com/en/docs/user-guide/frontend/electron/ | 官方文档；覆盖：桌宠 AI 状态共享；桌宠模式 + 共享上下文；点击穿透 / 右键控制 / 中断 |
| Open LLM Vtuber | https://docs.llmvtuber.com/en/docs/user-guide/frontend/web/ | 官方文档；覆盖：语音对话；AI 主动发言；中断当前语音 |
| Utsuwa | https://www.utsuwa.ai/ | 官网；覆盖：AI 聊天；语音输入 + TTS provider；基于本地 embeddings 的语义记忆；关系阶段 / 情绪追踪；自备 key / 本地模型选项；本地优先存储 |
| HoloWaifu | https://holowaifu.app/ | 官网；覆盖：长期记忆 + 自适应人格；实时语音到语音；口型同步；游戏 / 直播时常驻 overlay；本地聊天记录控制 |
| PokeClaw | https://pokeclaw.io/ | 官网；覆盖：基于 OpenClaw 的桌面陪伴角色；上下文记忆；用户授权集成；内置 skills / workflows；周期任务调度 |
| Lily | https://www.heylily.app/ | 官网；覆盖：自然语音交互；屏幕感知；智能听写；桌面动作控制；偏好学习；本地处理 / 隐私 |
| DeskMochi | https://www.deskmochi.com/ | 官网；覆盖：桌面浮动 AI 答案；截图提问；多模型访问；微任务 AI 操作；陪伴角色外观皮肤 |
| UPochi | https://www.upochi.com/ | 官网；覆盖：LLM 加持聊天；人格特质与名称；好友房间聊天 / teleport；离线模式 / 无追踪；人格化响应；自定义创建宠物（待核验是否 AI）；离线 / 无追踪边界 |
| Ai Vpet | https://store.steampowered.com/app/3029820/Ai_Vpet/ | Steam；覆盖：LLM 文本对话；语音对话；AI 情感陪伴；AI 个性化平台；第三方 AI 服务；第三方 AI 内容生成服务；自然语言 AI 陪伴角色；AI 个性化角色配置；主动休息互动 |
| Claw Sama | https://openclawdir.com/plugins/claw-sama-yr2l9c | OpenClaw Dir；覆盖：文本 / 语音聊天；LLM 驱动人格；可配置 SOUL.md / IDENTITY.md；基于 VRM 截图一键生成 persona；屏幕观察；TTS provider 选择；通过 OpenClaw runtime 接入多 provider LLM |
| OpenPets | https://openpets.sh/ | 官网；覆盖：用于控制宠物的本地 MCP server；agent 进度可视化；宠物命令接口 |
| AIRI | https://github.com/moeru-ai/airi | GitHub；覆盖：桌面本地推理加速 |
| AIRI | https://moeru-ai-airi.mintlify.app/ | 官方文档；覆盖：实时语音聊天；Live2D / VRM 具身角色；游戏集成；屏幕感知；基于 DuckDB 的持久记忆；多 provider / 本地模型；插件架构 |
| Amica | https://github.com/semperai/amica | GitHub；覆盖：自定义 AI backend |
| Amica | https://www.heyamica.com/ | 官网；覆盖：自然语音聊天；视觉能力；情绪引擎；自动潜意识 / 主动行为；可打断实时语音 |
| Vector Companion | https://github.com/SingularityMan/vector_companion | GitHub；覆盖：周期性屏幕视觉；电脑音频转录；麦克风转录；多陪伴角色对话；网页搜索 / 深度搜索；声音克隆输出 |
| Replika | https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika | What is Replika；覆盖：人格化陪伴对话；关系身份选择；反馈驱动个性化 |
| Replika | https://help.replika.com/hc/en-us/articles/115001094511-Is-Replika-free | Is Replika free / Voice settings；覆盖：语音通话；角色扮演 / 引导式对话 |
| Replika | https://help.replika.com/hc/en-us/articles/12740358069389-Replika-won-t-send-a-selfie | Replika Selfie / Photo / video limit；覆盖：自拍图 |
| Replika | https://help.replika.com/hc/en-us/articles/360045959792-How-do-I-change-my-Replika-s-voice | Is Replika free / Voice settings；覆盖：语音通话 |
| Replika | https://help.replika.com/hc/en-us/articles/37208679176077-How-does-Replika-s-memory-work | Replika Memory；覆盖：层级记忆系统 |
| Replika | https://help.replika.com/hc/en-us/articles/4410750221965-How-does-Replika-work | How does Replika work；覆盖：LLM + scripted dialogue 混合 |
| Replika | https://help.replika.com/hc/en-us/articles/4705307921933-Replika-can-t-send-photo-video | Replika Selfie / Photo / video limit；覆盖：自拍图 |
| Replika | https://help.replika.com/hc/en-us/articles/5040453297293-Can-Replika-be-my-virtual-assistant | Virtual assistant boundary；覆盖：非传统助手边界 |
| Nomi | https://api.nomi.ai/docs/ | Nomi API / POST chat；覆盖：API 聊天端点 |
| Nomi | https://api.nomi.ai/docs/reference/post-v1-nomis-id-chat/ | Nomi API / POST chat；覆盖：API 聊天端点 |
| Nomi | https://nomi.ai/nomi-knowledge/getting-started-nomi-selfies/ | Nomi Selfies；覆盖：自拍图 / 图像相册 |
| Nomi | https://nomi.ai/nomi-knowledge/getting-started-with-nomi-v5-ai-image-generation/ | Nomi V5 Image Generation；覆盖：V5 AI 图像生成 |
| Nomi | https://nomi.ai/nomi-knowledge/nomi-101-a-beginners-guide-to-getting-started-with-your-ai-companion/ | Nomi 101 / Nomipedia；覆盖：多 Nomi 创建；图片输入理解 |
| Nomi | https://wiki.nomi.ai/ | Nomi 101 / Nomipedia；覆盖：多 Nomi 创建 |
| Nomi | https://wiki.nomi.ai/Category%3AMemory | Nomipedia Memory；覆盖：多层记忆 |
| Nomi | https://wiki.nomi.ai/Category%3AVoice | Nomi Voice；覆盖：语音聊天 / 通话 / 自定义声音 |
| Nomi | https://wiki.nomi.ai/Combining_Mind_Maps_And_Giving_Nomis_Access | Mind Maps；覆盖：Mind Maps / 房间级记忆 |
| Nomi | https://wiki.nomi.ai/How_do_I_create_more_Nomis_or_more_group_chats%3F | Nomi Group Chats；覆盖：群聊 |
| Nomi | https://wiki.nomi.ai/How_does_Group_Chat_Realistic_Art_work%3F | Nomi Group Chat Art；覆盖：群聊图像生成 |
| Nomi | https://wiki.nomi.ai/What_Are_Proactive_Messages%3F | Proactive Messages；覆盖：主动消息 |
| Nomi | https://wiki.nomi.ai/What_are_shared_notes%3F | Shared Notes；覆盖：共享笔记 |
| Nomi | https://wiki.nomi.ai/Why_does_my_Nomis_voice_sound_different_between_messages%3F | Nomi voice variation；覆盖：动态语音表达 |
| Kindroid | https://docs.kindroid.ai/groupchats | Kindroid Groupchats / Docs mirror；覆盖：群聊；群聊上下文 |
| Kindroid | https://docs.kindroid.ai/memory | Kindroid Memory / Docs mirror；覆盖：5 类记忆系统；级联记忆；Journal entries 关键词召回 |
| Kindroid | https://docs.kindroid.ai/selfie-guides | Kindroid Selfie Guides；覆盖：自拍图 / 视频自拍 / avatar |
| Kindroid | https://docs.kindroid.ai/sharing-kindroids-and-referrals | Sharing Kindroids；覆盖：分享 Kindroid |
| Kindroid | https://docs.kindroid.ai/voice-calls-and-video-calls | Kindroid Voice；覆盖：语音消息 / 语音通话 / 视频通话；聊天 / 语音统一记忆；屏幕共享 / 视频视觉输入；自定义声音 |
| Kindroid | https://kindroid.ai/docs/?article=groupchats | Kindroid Groupchats / Docs mirror；覆盖：群聊；共享记忆开关 |
| Kindroid | https://kindroid.ai/docs/article/customizing-personality/ | Customizing personality；覆盖：背景故事 / 关键记忆 / 指令 |
| Kindroid | https://kindroid.ai/docs/article/memory/ | Kindroid Memory / Docs mirror；覆盖：5 类记忆系统；Long-term 记忆自动整合；可见记忆 recall 提示 |
| Character.AI | https://blog.character.ai/character-ai-launches-mobile-app-for-ios-and-android/ | Character.AI mobile app；覆盖：创建 / 发现 AI 角色 |
| Character.AI | https://blog.character.ai/helping-characters-remember-what-matters-most/ | Chat Memories；覆盖：聊天记忆 |
| Character.AI | https://support.character.ai/hc/en-us/articles/14997389547931-What-is-Character-AI | What is Character.AI；覆盖：自研对话模型；幻觉警示 |
| Character.AI | https://support.character.ai/hc/en-us/articles/23957256282523-Group-Chat-FAQ | Group Chat FAQ；覆盖：群聊 |
| Character.AI | https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ | Character Calls FAQ；覆盖：角色通话；通话转录；角色声音库；创建自定义声音 |
| Character.AI | https://support.character.ai/hc/en-us/articles/24327914463003-New-Feature-Pinned-Memories | Pinned Memories；覆盖：置顶记忆 |
| Character.AI | https://support.character.ai/hc/en-us/articles/40696393615387-Introducing-Community-Feed | Community Feed；覆盖：社区动态 / Avatar FX |
| Anima | https://myanima.ai/talk-to-ai-characters | MyAnima characters；覆盖：角色扮演 / 幻想场景 |
| Anima | https://myanimai-ai.com/ | Anima website；覆盖：长记忆；柔和声音；可选陪伴角色形态 |
| Anima | https://play.google.com/store/apps/details?id=anima.virtual.ai.robot.friend | Google Play；覆盖：AI 朋友应用 |
| Paradot | https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304 | App Store；覆盖：共情倾听 / 身心状态引导；AIGC avatar 创建；Voice 2.0；自拍模型；群聊 |
| Paradot | https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test | Google Play；覆盖：AI Being 记忆与情绪；多语言；新闻动态 |
| Talkie | https://www.talkie-ai.com/ | Talkie homepage；覆盖：AI 角色市场 |
| Talkie | https://www.talkie-ai.com/ai-character-generator | Talkie character generator；覆盖：AI 角色生成器；人格 / 外观 / 声音 / skills 自定义 |
| Talkie | https://www.talkie-ai.com/chat/support-group-249881020379394 | Talkie chat page；覆盖：文本 / 语音聊天 |
| Talkie | https://www.talkie-ai.com/create/edit | Talkie Creation Center；覆盖：图像生成；歌曲创作 |
| Talkie | https://www.talkie-ai.com/en/explore-with-languages | Talkie languages；覆盖：多语言角色探索 |
| Talkie | https://www.talkie-ai.com/memory/detail/context-aware-convos-181930050916505 | Talkie memory page；覆盖：记忆 / 记忆收藏 |
| Chai | https://apps.apple.com/us/app/chai-social-ai-platform-chat/id1544750895 | Chai App Store；覆盖：图像生成；独特声音 / 人格 |
| Chai | https://www.chai-ai.com/faq | Chai FAQ / Chai Pricing；覆盖：2500 万用户创建角色；创建 / 分享 AI 角色；人格驱动角色扮演；自研 LLM / 推理集群；社区驱动排行 |
| Chai | https://www.chai-ai.com/pricing | Chai FAQ / Chai Pricing；覆盖：2500 万用户创建角色；高级聊天 AI / 优先响应速度 |
| EVA AI | https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721 | EVA AI App Store；覆盖：高表现力 AI 角色；适应用户风格；XP / 关系等级；角色扮演场景 / 故事线；照片交换 / 照片故事 |
| EVA AI | https://eva-ai.net/ | EVA AI website；覆盖：记忆与学习；语音消息；角色扮演场景 / 故事线；照片交换 / 照片故事 |
| Kajiwoto | https://apps.apple.com/us/app/kajiwoto/id1409354116 | Kajiwoto App Store；覆盖：可训练 AI 陪伴角色；数据集；自定义 prompts；人格特征选择；自定义 AI 模型选择；私密房间 / 公开房间；记忆能力改进中 |
| Aion | https://aion-ai.app/ | Aion / Aion Features；覆盖：本地设备端 + BYOK；主动简报；Visual 记忆星图 / 洞察；日历 / 提醒 |
| Aion | https://aion-ai.app/features | Aion Features；覆盖：结构化记忆 beliefs；置信度评分；矛盾处理；本地设备端 + BYOK；15 内置工具；三种语音引擎 |
| Razer AVA | https://www.razer.com/razer-ava | Razer AVA；覆盖：桌面 / 屏幕陪伴角色；真实记忆 / 人格演化；视觉 / 音频感知；每日计划；健康 / 日常习惯教练；文档 / 表格综合处理；实时语音翻译；实时策略建议；教练式辅助而非自动游玩 |
| Overwolf | https://dev.overwolf.com/ow-native/guides/product-guidelines/app-screen-behavior/in-game-overlays/ | Overwolf in-game overlays；覆盖：overlay 独占模式 / 输入接管；全屏兼容性检测 |
| Overwolf | https://dev.overwolf.com/ow-native/reference/games/events/ | Overwolf games.events API；覆盖：游戏事件触发 AI 反应；required features 能力开关 |
| Steam Overlay | https://partner.steamgames.com/doc/features/overlay?language=english | Steam Overlay docs；覆盖：in-game AI 陪伴角色承载位；渲染循环 / overlay 兼容性约束 |
| Discord Rich Presence | https://docs.discord.com/developers/discord-social-sdk/development-guides/setting-rich-presence | Discord Rich Presence / Setting Rich Presence；覆盖：加入 / 邀请触发桌宠召回 |
| Discord Rich Presence | https://docs.discord.com/developers/platform/rich-presence | Discord Rich Presence；覆盖：社交活动上下文；加入 / 邀请触发桌宠召回 |
| Epic Online Services | https://onlineservices.epicgames.com/en-US/accounts-social | Epic Accounts & Social；覆盖：跨平台 presence + overlay |
| Epic Online Services | https://onlineservices.epicgames.com/en-US/news/epic-online-services-sdk-1-18-is-live-here-s-what-you-need-to-know | EOS SDK 1.18 update；覆盖：本地化 presence 文案模板 |
| Xbox Game Bar | https://learn.microsoft.com/en-us/gaming/game-bar/guide/widget-store | Xbox Game Bar Widget Store；覆盖：陪伴角色 widget 分发模式 |
| Xbox Game Bar | https://news.xbox.com/en-us/2020/07/01/xbox-game-bar-update-july-2020/ | Xbox Game Bar Update；覆盖：点击穿透 / 透明度控制 |
| Xbox Game Bar | https://news.xbox.com/en-us/2025/08/06/gaming-copilot-beta-begins-rolling-out-to-xbox-insiders-on-game-bar-today/ | Xbox Wire: Gaming Copilot on Game Bar / Xbox Gaming Copilot；覆盖：AI sidekick overlay widget |
| Xbox Game Bar | https://www.xbox.com/en-US/gaming-copilot | Xbox Wire: Gaming Copilot on Game Bar / Xbox Gaming Copilot；覆盖：AI sidekick overlay widget |
| Inworld | https://dev.docs.inworld.ai/docs/unreal-engine/runtime/character-reference/InworldPlayerComponent/InworldPlayerComponent | Inworld Player Component；覆盖：触发器驱动对话 |
| Inworld | https://docs.inworld.ai/unreal-engine/runtime/templates/character | Inworld Character template；覆盖：玩家画像 + 事件历史上下文 |
| Convai | https://docs.convai.com/ | Convai docs / Convai official site；覆盖：多模态感知 + 上下文相关动作 |
| Convai | https://docs.convai.com/api-docs/plugins-and-integrations/unity-plugin/tutorials/narrative-design | Convai Narrative Design；覆盖：叙事设计 / 空间锚点 |
| Convai | https://docs.convai.com/api-docs/plugins-and-integrations/unreal-engine/guides/actions-guide | Convai Actions Guide；覆盖：动作映射到游戏或角色动作 |
| Convai | https://www.convai.com/ | Convai docs / Convai official site；覆盖：多模态感知 + 上下文相关动作 |
| NVIDIA ACE | https://developer.nvidia.com/ace-for-games | NVIDIA ACE for Games；覆盖：本地设备端 AI game 陪伴角色；连接游戏数据的 AI advisor / 提示 |
| NVIDIA ACE | https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/ | NVIDIA ACE autonomous characters；覆盖：游戏状态转文本供模型推理；感知 / 认知 / 动作 / 记忆分层 |
| Twitch Extensions | https://dev.twitch.tv/docs/extensions/ | Twitch Extensions；覆盖：观众事件 overlay 启发；sandbox / CSP 安全模型 |
| Streamer.bot | https://docs.streamer.bot/get-started/introduction | Streamer.bot Introduction；覆盖：变量传递上下文 |
| Streamer.bot | https://docs.streamer.bot/guide/core/triggers | Streamer.bot Triggers；覆盖：trigger -> action 编排；自定义 triggers |
| VTube Studio API | https://github.com/DenchiSoft/VTubeStudio | VTube Studio Public API；覆盖：AI 意图 -> avatar 表情 / hotkey；表情激活安全边界 |
| VPet-Simulator | https://github.com/LorisYounger/VPet | VPet GitHub；覆盖：plugin / MOD 扩展动作和功能；可嵌入宠物核心；ChatGPT 设置组件；AI 扩展承载位 |
| VPet-Simulator | https://store.steampowered.com/app/1920960/VPet/ | Steam / GitHub；覆盖：AI 扩展承载位 |
| VPet Mod Maker | https://steamdb.info/patchnotes/12552366/ | VPet MOD Maker patch notes；覆盖：no-code / low-code 行为编排 |
| tama96 | https://www.tama96.com/ | tama96 official site；覆盖：MCP server 控制宠物动作；MCP server 让 AI 工具照顾宠物；按动作授权；频率限制 |
| Model Context Protocol | https://modelcontextprotocol.io/docs/learn/architecture | MCP Architecture / MCP Tools spec；覆盖：AI 动作工具发现 / 执行 |
| Model Context Protocol | https://modelcontextprotocol.io/specification/2025-06-18/server/tools | MCP Architecture / MCP Tools spec；覆盖：AI 动作工具发现 / 执行；human-in-the-loop 工具安全 |
| Unity Gaming Services Triggers | https://docs.unity.com/en-us/triggers | Unity Triggers；覆盖：server event -> AI 工作流；失败处理 / dead letter queue 启发 |
| YCamie | https://www.shimeji.ai/blog/introducing-YCamie | 教程；覆盖：图片 / reference image 生成 Shimeji；OpenAI API key 聊天设置 |
| YCamie | https://www.ycamie.com/ | 官网；覆盖：文本生成 Shimeji；AI 动画帧生成；交互式 AI 聊天；实时响应 |
| Desktop Mate | https://store.steampowered.com/app/3301060/Desktop_Mate/ | Steam；覆盖：当前无明确 AI 功能 |
| Dockling | https://dockling.space/ | 官网；覆盖：从照片生成像素宠物；多帧 pixel pet 生成；本地数据边界 |
| Desktop Goose | https://samperson.itch.io/desktop-goose | itch.io；覆盖：当前无明确 AI 功能 |
| Shimeji-Desktop | https://github.com/DalekCraft2/Shimeji-Desktop | GitHub；覆盖：当前无明确 AI 功能；行为配置系统（非 AI） |
| Shijima | https://github.com/pixelomer/Shijima-Qt | itch.io / GitHub；覆盖：当前无明确 AI 功能 |
| Shijima | https://pixelomer.itch.io/shijima | itch.io / GitHub；覆盖：当前无明确 AI 功能；shimeji inspector / creator 工作流（非 AI） |
| Desktop Mascot Engine | https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/ | Steam；覆盖：AI Assistant（计划中 / 当前缺失）；utility APIs / Cloud Services 集成计划 |
| Windows VPet | https://parreirao2.itch.io/windows-vpet | itch.io；覆盖：智能对话；情绪 adaptation / 从互动中学习；桌面活动感知；天气上下文反应 |
| InabaPet | https://github.com/wallouo/MurasamePet-InabaVer | itch.io / GitHub；覆盖：本地 LLM 对话；自定义 fine-tuned Qwen 模型；视觉识别；head-pat 上下文相关回应；TTS / 语音合成；记忆 state；时间 / 节日 prompt 注入；双语 / 翻译层 |
| InabaPet | https://wa11a.itch.io/inabapet | itch.io / GitHub；覆盖：本地 LLM 对话；head-pat 上下文相关回应；TTS / 语音合成 |
| Dororo | https://github.com/MelanTech/Dororo | itch.io / GitHub；覆盖：LLM 聊天；OpenAI-compatible API；prompt 设置；直播 / temperature 设置 |
| Dororo | https://melantech.itch.io/dororo | itch.io / GitHub；覆盖：LLM 聊天 |
| V-Chatter | https://dev-wicked.itch.io/v-chatter | itch.io；覆盖：文本 / 语音聊天；活动 comments / neglect 消息；情绪到表情 / 姿势映射；实时口型同步；命令支持；内置 AI / Python AI 文件；provider 组合；聊天 / audio data storage |
| Dotami-vrm | https://sabresnout.itch.io/dotami-vrm | itch.io；覆盖：当前无明确 AI 功能 |
| PAIcom | https://ovidiu-dendrino.itch.io/paicom-premium | itch.io；覆盖：麦克风语音助手；打开 app / 游戏 / 网站；本地运行隐私声明；可 mod / 自定义助手 |
| Vicsine Desktop Pet | https://fenbus.itch.io/vicsine | itch.io；覆盖：当前无明确 AI 功能 |
| BMO Desktop Pet | https://dagger-shoe.itch.io/bmo-desktop-pet | itch.io；覆盖：当前无明确 AI 功能 |
