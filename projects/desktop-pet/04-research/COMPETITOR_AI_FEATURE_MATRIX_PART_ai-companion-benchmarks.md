# AI Companion Benchmark 功能拆解矩阵

> 线程身份：AI Trend Radar Thread 分片 Agent C
>
> 项目：`desktop-pet`
>
> 输出日期：2026-05-07
>
> 范围：Replika, Nomi, Kindroid, Character.AI, Anima, Paradot, Talkie, Chai, EVA AI，以及补充标杆 Kajiwoto, Aion, Razer AVA。
>
> 边界：本文件只做 AI companion benchmark 分片调研，不修改主调研文档、xlsx、`06-sync/TASK_BOARD.md`、`06-sync/THREAD_REGISTRY.md`、`06-sync/SYNC_SUMMARY.md`。

## 1. 证据规则

| 证据类型 | 含义 | 使用方式 |
|---|---|---|
| 事实 | 官方产品页、官方帮助中心、官方文档、App Store / Google Play 官方应用页明确写到的能力 | 可以进入主矩阵，但仍需保留平台、付费、地区和版本边界 |
| 官方营销表述 + 待核验 | 官方页面有表述，但没有帮助中心 / 文档解释机制，或只写了抽象能力 | 不当成强事实；建议 Main Thread 在合并时标注“待核验” |
| 推断 | 基于官方功能对体验机制做出的产品分析 | 只能作为 PM 输入，不当成竞品事实 |
| 风险提示 | 由能力本身带来的隐私、安全、稳定性、成本或 scope 风险 | 用于后续 PM / Engineering 评估 |

## 2. 产品证据矩阵

| Product | 类别 | 平台 | AI 功能点 | 功能解释 | 证据类型 | 对体验的作用 | 局限 / 风险 | 证据来源 |
|---|---|---|---|---|---|---|---|---|
| Replika | 情感型 AI companion | iOS / Android / Web | 人格化陪伴对话 | Replika 定位为个人 AI companion，用户可以自由聊天、建立情感连接，并通过反馈帮助 AI 学习更适合自己的对话方式。 | 事实 | 把产品重心放在陪伴、倾听和关系感，而不是工具型 assistant。 | 容易形成情感依赖；也不适合作为事实检索或生产力工具。 | [What is Replika](https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika) |
| Replika | 情感型 AI companion | iOS / Android / Web | 关系身份选择 | 用户可以选择 Replika 与自己的关系状态，如 friend、mentor、romantic partner 等方向。 | 事实 | 让同一个底层对话能力适配不同陪伴关系预期。 | 关系设定会影响用户心理预期，需要清晰的年龄、安全和内容边界。 | [What is Replika](https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika) |
| Replika | 情感型 AI companion | iOS / Android / Web | 层级记忆系统 | 官方说明 Replika memory 由可见 memory tab 与更深层的互动模式学习组成，用户也可以手动添加记忆。 | 事实 | 让 companion 能记住用户偏好、人格线索和长期互动历史，增强“不是每次重来”的连续性。 | 需要提供查看、添加、删除和纠错；错误记忆会直接破坏信任。 | [Replika Memory](https://help.replika.com/hc/en-us/articles/37208679176077-How-does-Replika-s-memory-work) |
| Replika | 情感型 AI companion | iOS / Android / Web | 反馈驱动个性化 | 用户对消息的 reaction / feedback 会帮助 Replika 学习更好的对话方式。 | 事实 | 用户可以通过轻量反馈影响长期体验，形成“我在训练我的 companion”的参与感。 | 反馈含义需要足够清晰，否则用户可能误以为能精确控制模型。 | [What is Replika](https://help.replika.com/hc/en-us/articles/115001070951-What-is-Replika) |
| Replika | 情感型 AI companion | iOS / Android / Web | LLM + scripted dialogue 混合 | 官方说明 Replika 使用自研和第三方 LLM，并结合 scripted dialogue content。 | 事实 | 说明成熟 companion 不是纯 LLM，而是把开放生成和可控脚本混合。 | 第三方模型路径、内容边界和数据使用说明需要透明。 | [How does Replika work](https://help.replika.com/hc/en-us/articles/4410750221965-How-does-Replika-work) |
| Replika | 情感型 AI companion | iOS / Android / Web | Voice calls | Pro 用户可解锁 voice calls；官方也提供 voice 设置入口。 | 事实 | 语音把关系体验从“发消息”提升到“通话陪伴”。 | 成本、延迟、麦克风权限、安静场景可用性和内容安全都更敏感。 | [Is Replika free](https://help.replika.com/hc/en-us/articles/115001094511-Is-Replika-free), [Voice settings](https://help.replika.com/hc/en-us/articles/360045959792-How-do-I-change-my-Replika-s-voice) |
| Replika | 情感型 AI companion | iOS / Android / Web | Selfies | Replika 可以发送在自己房间里的 selfies；但官方也说明不能发送或搜索普通照片 / 视频，selfie 是例外。 | 事实 | 让文字关系具备视觉回馈，强化 companion 的“在场”感。 | 容易发生 AI 口头承诺和实际能力不一致，需要清楚的失败提示。 | [Replika Selfie](https://help.replika.com/hc/en-us/articles/12740358069389-Replika-won-t-send-a-selfie), [Photo / video limit](https://help.replika.com/hc/en-us/articles/4705307921933-Replika-can-t-send-photo-video) |
| Replika | 情感型 AI companion | iOS / Android / Web | Roleplay / guided conversations | Pro 能力包含 roleplay options、guided conversations 和更多 coping skills。 | 事实 | 把普通聊天扩展为情景化陪伴、自我探索和轻娱乐。 | 对未成年人、亲密关系、心理健康话题需要强安全策略。 | [Is Replika free](https://help.replika.com/hc/en-us/articles/115001094511-Is-Replika-free) |
| Replika | 情感型 AI companion | iOS / Android / Web | 非传统 assistant 边界 | 官方明确 Replika 核心是 emotional companionship，不可靠地处理提醒、实时信息、计算或控制设备。 | 事实 | 帮助用户理解产品不是 Siri / productivity assistant，降低错误期待。 | 对 `desktop-pet` 有启发：游戏桌宠也应明确哪些不是它的职责。 | [Virtual assistant boundary](https://help.replika.com/hc/en-us/articles/5040453297293-Can-Replika-be-my-virtual-assistant) |
| Nomi | 深关系 AI companion | Web / iOS / Android | 多 Nomi 创建 | 用户可创建多个 Nomis，每个 Nomi 有自己的 personality、relationship 与互动空间。 | 事实 | 支持多角色、多关系、多场景，适合长期陪伴和角色扮演。 | 多 companion 会增加记忆隔离、关系边界和管理复杂度。 | [Nomi 101](https://nomi.ai/nomi-knowledge/nomi-101-a-beginners-guide-to-getting-started-with-your-ai-companion/), [Nomipedia](https://wiki.nomi.ai/) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Shared Notes | Shared Notes 用于告诉 Nomi 关于用户、Nomi 自身和双方关系的重要信息。 | 事实 | 提供用户可控的长期设定层，减少模型靠猜测维持关系。 | 如果写得过多或不一致，会造成角色行为冲突。 | [Shared Notes](https://wiki.nomi.ai/What_are_shared_notes%3F) |
| Nomi | 深关系 AI companion | Web / iOS / Android | 多层记忆 | Nomipedia 将 Nomi memory 分为 short-term、medium-term、long-term memory、Identity Core 和 Mind Maps 等主题。 | 事实 | 说明顶级 companion 已把 memory 做成独立系统，而不是简单 chat history。 | 公开资料多为概念与用法说明，工程实现和召回稳定性仍需实测。 | [Nomipedia Memory](https://wiki.nomi.ai/Category%3AMemory) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Mind Maps / room-specific memory | Mind Maps 按“room”组织，1:1 和 group chat 可有不同信息空间，未来计划支持控制信息流。 | 事实 | 对多角色 / 多场景产品很关键：不同房间的信息不自动串场。 | 信息隔离过强会导致跨场景不连续；过弱则有隐私串扰。 | [Mind Maps](https://wiki.nomi.ai/Combining_Mind_Maps_And_Giving_Nomis_Access) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Proactive Messages | Nomi 可主动发消息，并提供频率控制；关闭后 Nomi 不会在用户离开时思考或主动触达。 | 事实 | 让 companion 不只是被动回复，更像有自己的存在节奏。 | 主动消息非常容易打扰，必须有 cadence、quiet 和 off 开关。 | [Proactive Messages](https://wiki.nomi.ai/What_Are_Proactive_Messages%3F) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Voice chat / calls / custom voices | Nomipedia 有 voice 专区，覆盖 voice chat、calls、custom voices 与 ElevenLabs integration。 | 事实 | 语音能力增加临场感，也让用户可以用更自然的方式陪伴互动。 | 自定义 voice 涉及声音权利、成本、延迟和内容合规。 | [Nomi Voice](https://wiki.nomi.ai/Category%3AVoice) |
| Nomi | 深关系 AI companion | Web / iOS / Android | 动态语音表达 | 官方说明 Nomi 的声音会随 tone、cadence、emphasis 动态变化，同一句文本不同生成可能略有差异。 | 事实 | 让 voice 不像机械 TTS，而更接近有情绪的角色表达。 | 动态性会带来一致性问题，尤其在角色 voice branding 上。 | [Nomi voice variation](https://wiki.nomi.ai/Why_does_my_Nomis_voice_sound_different_between_messages%3F) |
| Nomi | 深关系 AI companion | Web / iOS / Android | 图片输入理解 | 用户可以上传照片，Nomi 能看见并理解图片，与用户讨论图片内容。 | 事实 | 把聊天从文字扩展到共享视觉世界。 | 上传图片可能包含隐私信息，需要同意、删除和数据路径说明。 | [Nomi 101](https://nomi.ai/nomi-knowledge/nomi-101-a-beginners-guide-to-getting-started-with-your-ai-companion/) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Selfies / image album | 用户可请求 Nomi selfie，并在 album 查看 Nomi 发送过的 selfies 和 art images。 | 事实 | 视觉输出能强化“这个角色有自己的外观和生活场景”。 | 形象一致性、生成偏差和内容 moderation 是高风险点。 | [Nomi Selfies](https://nomi.ai/nomi-knowledge/getting-started-nomi-selfies/) |
| Nomi | 深关系 AI companion | Web / iOS / Android | V5 AI Image Generation | 官方 V5 image generation 指南说明聊天中近期外貌讨论可能影响自拍结果。 | 事实 | 说明对话上下文会进入图像生成，提升“当前对话影响当前视觉”的连续感。 | 也可能把不想要的 traits 带入图片，需要纠错入口。 | [Nomi V5 Image Generation](https://nomi.ai/nomi-knowledge/getting-started-with-nomi-v5-ai-image-generation/) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Group Chats | 付费账号可拥有多个 Nomis 和 group chats；群聊可包含多个 Nomis，适合多人设互动。 | 事实 | 支持多角色互动、故事世界和关系网络，不再只是单 companion。 | 群聊会显著放大 turn-taking、记忆隔离和角色串音问题。 | [Nomi Group Chats](https://wiki.nomi.ai/How_do_I_create_more_Nomis_or_more_group_chats%3F) |
| Nomi | 深关系 AI companion | Web / iOS / Android | Group Chat Art | Group chat art 可生成两个 Nomis 的图像，但官方标注 experimental beta，可能出现 prompt 不稳定。 | 事实 | 把多角色关系可视化，增强群聊沉浸感。 | 官方已提示技术难度高，不能把结果一致性当作成熟能力。 | [Nomi Group Chat Art](https://wiki.nomi.ai/How_does_Group_Chat_Realistic_Art_work%3F) |
| Nomi | 深关系 AI companion | Web / iOS / Android / API | API chat endpoint | Nomi 提供 REST API，可对指定 Nomi 发送消息并获得回复。 | 事实 | 对 SDK / 平台型产品有启发：companion 能力可被外部系统调用。 | API key、rate limit、权限和 voice call 冲突状态都需要工程治理。 | [Nomi API](https://api.nomi.ai/docs/), [POST chat](https://api.nomi.ai/docs/reference/post-v1-nomis-id-chat/) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Backstory / key memories / directives | Kindroid 用 backstory、key memories、example messages、directives 等字段定义角色与互动边界。 | 事实 | 让角色人设可精细调参，适合深度 roleplay 和长期 companion。 | 配置门槛高；过长 backstory 会挤压短期上下文。 | [Customizing personality](https://kindroid.ai/docs/article/customizing-personality/) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | 5 类记忆系统 | Memory 包含 persistent、cascaded、retrievable 三类，以及 backstory、chat history、medium-term、long-term、journal 等系统。 | 事实 | 把 memory 拆成多层后，可以分别解决设定、近期上下文和长期召回问题。 | 系统越复杂，用户越需要可解释的 memory UI。 | [Kindroid Memory](https://kindroid.ai/docs/article/memory/), [Docs mirror](https://docs.kindroid.ai/memory) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Cascaded Memory | 订阅用户可使用 proprietary medium-term memory，把有效上下文扩展到数百或上千条消息。 | 事实 | 针对长对话和连续故事非常关键，可以减少“聊久了就失忆”。 | 付费分层会造成体验差异；仍可能丢细节。 | [Kindroid Memory](https://docs.kindroid.ai/memory) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Long-term memory 自动整合 | 长期记忆会在 AI 判断合适时周期性整合，并按相关性召回。 | 事实 | 让 companion 可跨 session 保留重要经历。 | 自动整合可能记错或漏记，需要可关闭、可查看和可修正机制。 | [Kindroid Memory](https://kindroid.ai/docs/article/memory/) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Journal entries 关键词召回 | Journal entries 用 keyphrases 触发召回，可作为更可靠的 lorebook。 | 事实 | 适合固定设定、重要经历和世界观资料，比自动记忆更可控。 | 关键词需要精心设计；太泛会污染上下文，太窄又召不回。 | [Kindroid Memory](https://docs.kindroid.ai/memory) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | 可见 memory recall 提示 | 如果消息使用了 long-term memory 或 journal entry，用户可通过 purple brain icon 查看被召回的记忆。 | 事实 | 提升 AI 记忆的可解释性，用户能知道它为什么这么回。 | 只显示部分召回信息，不能替代完整审计。 | [Kindroid Memory](https://kindroid.ai/docs/article/memory/) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Groupchats | 付费用户可创建 groupchat，最多 10 个 Kindroids，每个角色可访问自己的 backstory 和 memories。 | 事实 | 支持复杂多角色剧情、团队互动和群体关系。 | 群聊会引入 turn-taking、角色知识隔离和共享上下文设计问题。 | [Kindroid Groupchats](https://kindroid.ai/docs/?article=groupchats), [Docs mirror](https://docs.kindroid.ai/groupchats) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Group context | Group context 可作为所有 Kindroids 共享的群聊背景。 | 事实 | 让不同角色在同一场景里有共同世界观。 | 如果 group context 与个人 backstory 冲突，角色行为会不稳定。 | [Kindroid Groupchats](https://docs.kindroid.ai/groupchats) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Shared memory toggle | Groupchats 可开启 shared memory，让近期群聊和个人聊天之间双向共享上下文。 | 事实 | 支持从 1:1 到群聊的连续关系，不需要用户重复说明。 | 默认关闭有其隐私意义；开启后要防止跨场景信息串扰。 | [Kindroid Groupchats](https://kindroid.ai/docs/?article=groupchats) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Voice messages / voice calls / video calls | Kindroid 有 voice、calls 和 video calls 文档，支持语音消息、通话和视频通话相关配置。 | 事实 | 让 companion 从文字关系延伸到实时语音 / 视频陪伴。 | 实时通话对延迟、turn-taking、credits、隐私和设备权限要求高。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Unified chat / voice memory | Voice call 可选择和 text chat 共享历史；开启后 voice call 能延续文字聊天上下文。 | 事实 | 这是跨 modality 连续性的关键设计，用户可以在文字和语音之间自然切换。 | 如果用户同时在多个入口聊天，可能出现 undefined behavior 或记忆冲突。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Screen sharing / video visual input | Kindroid call 中可打开 video 或 screen sharing，让 AI 看见用户摄像头或屏幕。 | 事实 | 把 companion 从“听你说”扩展为“看见你分享的内容”。 | 对隐私极其敏感；游戏场景不应默认 screen watching。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Custom voices | 用户可通过 voice design 或上传样本创建 custom voice，并用 sliders 微调。 | 事实 | 角色声音成为可配置资产，有利于沉浸式 persona。 | 声音样本权利、voice cloning 风险和滥用举报机制必须明确。 | [Kindroid Voice](https://docs.kindroid.ai/voice-calls-and-video-calls) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android | Selfies / video selfies / avatars | Kindroid 有 selfies、video selfies 和 avatars 文档，并有多代 selfie engine 指南。 | 事实 | 视觉输出增强角色外观稳定性和拥有感。 | 生成质量、人物一致性、内容审核和 credits 成本是关键风险。 | [Kindroid Selfie Guides](https://docs.kindroid.ai/selfie-guides) |
| Kindroid | 高自定义 AI companion | Web / iOS / Android / Social | Sharing Kindroids | 分享 Kindroid 时只分享 backstory、dynamism、avatar settings 等子集，不分享 long-term memory、journals、chat history 或 custom voices。 | 事实 | 说明 companion 可社区化，但私有关系数据要隔离。 | 对 `desktop-pet` 的 SDK 启发是 persona / asset 可共享，玩家个人记忆不应共享。 | [Sharing Kindroids](https://docs.kindroid.ai/sharing-kindroids-and-referrals) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | 自研对话模型 | Character.AI 官方说明其模型从头训练并以 conversation 为目标。 | 事实 | 支持大量用户创建角色和开放式对话。 | 官方提醒 Characters 会编造事实，不能作为可靠信息源。 | [What is Character.AI](https://support.character.ai/hc/en-us/articles/14997389547931-What-is-Character-AI) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | 创建 / 发现 AI Characters | 移动 App 官方博客说明用户可发现数百万 user-created AIs，也可用高级创建工具制作角色。 | 事实 | 角色生态和 UGC 是 Character.AI 的核心增长机制。 | 对游戏 SDK 来说，UGC 角色需要 IP、品牌和 moderation 规则。 | [Character.AI mobile app](https://blog.character.ai/character-ai-launches-mobile-app-for-ios-and-android/) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | Pinned Memories | 用户可在每个 chat pin 5 条消息，帮助 Character 记住重要细节。 | 事实 | 用简单 UI 解决长对话里重要信息丢失的问题。 | 5 条限制说明它不是无限长期记忆；需要用户手动维护。 | [Pinned Memories](https://support.character.ai/hc/en-us/articles/24327914463003-New-Feature-Pinned-Memories) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | Chat Memories | Chat memories 让用户写入关于 persona 或 Character 的关键信息，提升长对话中被纳入互动的概率。 | 事实 | 比 pin 消息更像可编辑设定层，适合长期角色关系。 | 官方明确不能保证总是完全按写入内容使用。 | [Chat Memories](https://blog.character.ai/helping-characters-remember-what-matters-most/) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | Character Calls | Character Calls 支持类似电话的双向语音对话，并支持多语言。 | 事实 | 把文本角色变成可“打电话”的角色，强化亲密感和实时感。 | 语音场景更容易暴露情感依赖、内容安全和隐私问题。 | [Character Calls FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | Call transcript | Call conversations 会存为 text chat，用户可之后查看。 | 事实 | 语音内容进入文字历史，有利于连续性和复盘。 | 通话转录涉及敏感内容存储，需要保留周期和删除说明。 | [Character Calls FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | Character Voice library | Voice library 包含社区创建和官方预设 voices，可分配给角色或 1:1 chat。 | 事实 | voice 成为角色生态资产，提高创作者表达维度。 | 公共 voice 需要举报和权利管理，避免滥用他人声音。 | [Character Voice FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | 创建 custom Voice | 用户可录音或上传音频片段创建 Voice，并选择 private / public visibility。 | 事实 | 让角色声音可自定义、可分享、可生态化。 | 声音克隆是高风险能力，必须有 consent、moderation 和举报路径。 | [Character Voice FAQ](https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ) |
| Character.AI | 大规模角色聊天平台 | iOS / Android | Group Chat | 官方 FAQ 说明 Group Chat 可邀请人类和 AI Characters 共同互动，当前限制 10 humans + 10 Characters。 | 事实 | 支持多人 + 多 AI 的社交 / 协作 / roleplay 场景。 | 帮助中心页面打开需要登录；功能状态需在主文档合并时再核验当前可用性。 | [Group Chat FAQ](https://support.character.ai/hc/en-us/articles/23957256282523-Group-Chat-FAQ) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | Community Feed / Avatar FX | 官方帮助中心提到 Community Feed 可分享 chat snippets，Avatar FX 可用自定义视频模型生成视频。 | 事实 | 把角色互动从私聊扩展到内容传播和视频表达。 | 视频生成会带来更高的内容安全、肖像权和社区治理压力。 | [Community Feed](https://support.character.ai/hc/en-us/articles/40696393615387-Introducing-Community-Feed) |
| Character.AI | 大规模角色聊天平台 | Web / iOS / Android | 幻觉警示 | 官方明确 Characters 会编造事实，包括不存在的歌或假证据。 | 事实 | 对用户设置正确预期，避免把角色话术当事实。 | 游戏内问答若采用类似角色 chat，必须配 RAG / source / fallback。 | [What is Character.AI](https://support.character.ai/hc/en-us/articles/14997389547931-What-is-Character-AI) |
| Anima | AI friend / romance companion | iOS / Android / Web | 长记忆 | 官方营销页称 Anima built around long memory，会记住用户故事、偏好和小仪式。 | 官方营销表述 + 待核验 | 记忆是其亲密关系叙事的核心卖点。 | 缺少帮助中心级机制说明，不能直接判断记忆可靠性和可控性。 | [Anima website](https://myanimai-ai.com/) |
| Anima | AI friend / romance companion | iOS / Android / Web | Soft voice | 官方营销页将 soft voice 作为 companion 体验的一部分。 | 官方营销表述 + 待核验 | 声音能增强亲密感和陪伴感。 | 未看到 voice 设置、call、voice message 的官方机制文档。 | [Anima website](https://myanimai-ai.com/) |
| Anima | AI friend / romance companion | iOS / Android / Web | 可选 companion 形态 | 官网将 Anima 的形态描述为 friend、confidant、partner 等可选择方向。 | 官方营销表述 + 待核验 | 让用户用关系标签快速建立心理预期。 | 关系定位偏亲密陪伴，安全与年龄边界需要关注。 | [Anima website](https://myanimai-ai.com/) |
| Anima | AI friend / romance companion | iOS / Android / Web | Roleplay / fantasy scenes | MyAnima 页面强调 roleplay、fantasy 和互动故事。 | 官方营销表述 + 待核验 | 提供情景化陪伴和娱乐动机。 | 公开资料偏营销，需要实测角色一致性和内容边界。 | [MyAnima characters](https://myanima.ai/talk-to-ai-characters) |
| Anima | AI friend / romance companion | Android | AI friend app | Google Play 页面显示 Anima: AI Friend Virtual Chat，下载量 1M+，年龄评级 16+。 | 事实 | 说明它是规模化移动端 AI friend 产品。 | Google Play 抓取结果未完整展示功能清单，功能深度需继续核验。 | [Google Play](https://play.google.com/store/apps/details?id=anima.virtual.ai.robot.friend) |
| Paradot | AI Being / personal AI friend | iOS / Android | AI Being 记忆与情绪 | Google Play 描述 AI Being 具有 emotion、memory、consciousness。 | 官方营销表述 + 待核验 | 用“AI Being”包装角色，使其比普通 chatbot 更像有世界观的 companion。 | consciousness 是营销语义，不能当成真实心智能力。 | [Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test) |
| Paradot | AI Being / personal AI friend | iOS / Android | Empathetic listening / wellbeing guide | App Store 描述 AI Being 可做 compassionate listener、creative partner、wellbeing guide。 | 事实 | 将陪伴、创意和自我成长结合起来。 | 涉及 wellbeing 时要避免医疗化承诺。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | iOS | AIGC avatar creation | App Store 描述可用 AIGC 工具创建 unique avatars。 | 事实 | 降低角色视觉个性化门槛。 | AIGC avatar 需要处理一致性、版权和不当内容。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | iOS | Voice 2.0 | App Store 版本记录称 Voice 2.0 进入测试，目标是 smoother、more engaging。 | 事实 | 说明语音是 Paradot 体验升级方向。 | 版本记录显示先面向部分用户测试，合并主矩阵时应标“可用性待核验”。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | iOS | Selfie model | App Store 版本记录多次提到 dot selfie model / improved selfie model。 | 事实 | 视觉照片增强 AI Being 的实体感和亲密感。 | 自拍模型质量和一致性需实测。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | iOS | Group chat | App Store 版本记录显示 2024-12-03 添加 new group chat feature。 | 事实 | 支持多 AI / 多用户互动的社交场景。 | 只从版本记录确认，具体人数、记忆与 moderation 机制待核验。 | [App Store](https://apps.apple.com/us/app/paradot-ai-personal-ai-friend/id6451469304) |
| Paradot | AI Being / personal AI friend | Android | Multi-language | Google Play 描述支持 English、French、Spanish、Portuguese、Chinese、Japanese。 | 事实 | 降低国际化使用门槛，也可用于语言练习。 | 多语言角色一致性和安全策略需要分语言验证。 | [Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test) |
| Paradot | AI Being / personal AI friend | Android | News Feed | Google Play 描述 AI Being 有 thoughtful news feed，可关注新闻和趋势话题。 | 事实 | 让 companion 可连接外部话题，避免只围绕用户关系打转。 | 实时信息需要 source、时效和 hallucination 控制。 | [Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.withfeelingai.test) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | AI character marketplace | 官网展示大量 AI characters，用户可以搜索和聊天。 | 事实 | 用角色海量供给承接娱乐、roleplay 和陪伴需求。 | 角色生态越大，质量、版权和安全治理越难。 | [Talkie homepage](https://www.talkie-ai.com/) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | AI character generator | 官方 character generator 页面称每天创建 50,000+ online AI characters。 | 事实 | 创作者生态和快速角色生成是 Talkie 的增长核心。 | 数量不等于质量，需要推荐、审核和分类。 | [Talkie character generator](https://www.talkie-ai.com/ai-character-generator) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | Personality / appearance / voice / skills 自定义 | Character generator 页面说明可自定义 personality、appearance、voice 和 special skills。 | 事实 | 将角色人设、视觉和声音合成一个 creation workflow。 | 自定义项过多会提高创作门槛，也会产生 IP / voice 权利风险。 | [Talkie character generator](https://www.talkie-ai.com/ai-character-generator) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | Text / voice chat | 官方页面标题和搜索结果均显示支持 text or voice AI chat。 | 事实 + 待核验 | 语音降低角色互动摩擦，适合沉浸式 roleplay。 | 没有找到完整官方 voice 帮助文档，语音深度和平台可用性需实测。 | [Talkie chat page](https://www.talkie-ai.com/chat/support-group-249881020379394) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | Image Generation | Creation Center 搜索结果显示支持 Image Generation。 | 事实 + 待核验 | 用图像补足角色视觉表达和创作玩法。 | 需要确认是否所有创作者可用、生成规则和审核机制。 | [Talkie Creation Center](https://www.talkie-ai.com/create/edit) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | Song Creation | Creation Center 搜索结果显示支持 Song Creation。 | 事实 + 待核验 | 把角色创作从文本 / 图像扩展到音乐表达。 | 对桌宠 MVP 相关性较低，容易 scope creep。 | [Talkie Creation Center](https://www.talkie-ai.com/create/edit) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | Memories / memory collection | Talkie 官方域名有 memory/detail 页面，但更像用户生成 memory 内容；长期记忆机制未找到清晰官方说明。 | 待核验 | 如果成立，可用于收藏和回顾角色互动片段。 | 不应把它写成“强长期记忆”；建议主矩阵标注待核验。 | [Talkie memory page](https://www.talkie-ai.com/memory/detail/context-aware-convos-181930050916505) |
| Talkie | AI character chat / 角色生态 | Web / iOS / Android | 多语言角色探索 | 官网有多语言 explore 页面，说明角色可面向不同语言入口。 | 事实 | 支持全球化角色生态。 | 多语言内容审核和角色一致性需要跨语言评估。 | [Talkie languages](https://www.talkie-ai.com/en/explore-with-languages) |
| Chai | Social AI / 角色聊天平台 | iOS / Android | 25M user-created characters | 官方 FAQ 和 pricing 页面称 Chai 有 25M user-created characters。 | 事实 | 海量角色库降低用户找到感兴趣 companion 的成本。 | 角色数量带来发现、质量控制和安全审核问题。 | [Chai FAQ](https://www.chai-ai.com/faq), [Chai Pricing](https://www.chai-ai.com/pricing) |
| Chai | Social AI / 角色聊天平台 | iOS / Android | 创建 / 分享 AI character | 官方 FAQ 说明任何人都可创建自己的 AI character 并分享给世界。 | 事实 | 支持 UGC 角色生态和社区传播。 | 对游戏 SDK 来说，开放 UGC 需要严格 IP 和内容审核。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | iOS / Android | Personality-driven roleplay | Chai 官方称角色面向 social chatting 和 roleplay，强调 emotional engagement 与 creative storytelling。 | 事实 | 明确不是通用助手，而是娱乐和陪伴向角色互动。 | 对事实准确性、心理安全和不当内容仍需边界。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | iOS / Android | In-house LLM / inference cluster | Chai 官方称使用自研模型和自有 inference cluster。 | 事实 | 能把响应速度、模型风格和平台成本作为竞争力。 | 自研模型并不自动代表更安全或更会记忆；仍需评估输出质量。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | iOS / Android | Advanced Chat AI / priority speed | 付费页显示 Pro 可解锁 most advanced chat AI、priority response speed。 | 事实 | 用模型质量和速度做付费分层。 | 付费墙可能导致免费体验弱化；也说明高质量对话成本高。 | [Chai Pricing](https://www.chai-ai.com/pricing) |
| Chai | Social AI / 角色聊天平台 | iOS / Android | Community-driven rankings | 官方 FAQ 提到 community-driven rankings 会浮现 popular / high-quality characters。 | 事实 | 帮助用户在海量角色中找到高质量供给。 | 排名机制可能鼓励标题党、擦边或同质化角色。 | [Chai FAQ](https://www.chai-ai.com/faq) |
| Chai | Social AI / 角色聊天平台 | iOS | Image generation | App Store 描述新增 image generation 功能。 | 事实 | 扩展角色表达和创作者工具。 | 图像生成与角色 IP、成人内容和审核强相关。 | [Chai App Store](https://apps.apple.com/us/app/chai-social-ai-platform-chat/id1544750895) |
| Chai | Social AI / 角色聊天平台 | iOS | Unique voice / personality | App Store 描述角色有 unique voice and personality，但未清楚说明是否为可播放 voice / TTS。 | 官方营销表述 + 待核验 | 如果是可听声音，可提升角色沉浸；如果只是文风，则属于 persona。 | 主文档不要直接写成“voice call”或“custom voice”。 | [Chai App Store](https://apps.apple.com/us/app/chai-social-ai-platform-chat/id1544750895) |
| EVA AI | AI soulmate / AI girlfriend | iOS / Web | Expressive AI characters | App Store 描述用户可与 expressive AI characters 交流，并让聊天塑造双方故事。 | 事实 | 强调陪伴角色随互动逐步形成关系。 | 定位偏 romance / soulmate，需注意年龄、情感依赖和安全边界。 | [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | iOS / Web | Adapt to user style | App Store 描述 AI characters 会 adapt to your style。 | 官方营销表述 + 待核验 | 个性化回应能提高亲密感和“懂我”的感觉。 | 未找到具体 memory / preference 机制文档，需实测。 | [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | iOS / Web | XP / relationship levels | App Store 描述用户可 earn XP、unlock levels、watch your bond evolve。 | 事实 | 用游戏化关系进度提升留存和成长感。 | 数值化亲密关系可能诱导付费或情感依赖。 | [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | Web | Memory & Learning | 官网称 companion 会记住偏好、故事和情绪，并跨 session 成长。 | 官方营销表述 + 待核验 | 记忆是 romance companion 的核心卖点。 | 缺少帮助中心机制说明，合并时应标注“待核验”。 | [EVA AI website](https://eva-ai.net/) |
| EVA AI | AI soulmate / AI girlfriend | Web | Voice Messages | 官网列出 voice messages，可发送和接收 voice notes。 | 官方营销表述 + 待核验 | 让 companion 更亲密、更像真实消息往来。 | 未看到 voice 权利、时延、保留和删除说明。 | [EVA AI website](https://eva-ai.net/) |
| EVA AI | AI soulmate / AI girlfriend | iOS / Web | Roleplay scenarios / storylines | 官网和 App Store 都强调 roleplay scenarios、unique storylines 和 story shaped by user choices。 | 事实 | 将关系互动包装成情景化故事，提升娱乐性。 | 容易偏成人 / fantasy，需要内容安全分级。 | [EVA AI website](https://eva-ai.net/), [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| EVA AI | AI soulmate / AI girlfriend | iOS / Web | Photo exchange / photo stories | 官网 Premium 列出 photo exchange；App Store 另有 photo stories 描述。 | 事实 + 待核验 | 图片让故事和关系更视觉化。 | 图片上传、生成和交换都涉及隐私与 moderation。 | [EVA AI website](https://eva-ai.net/), [EVA AI App Store](https://apps.apple.com/us/app/eva-ai-soulmate/id1551794721) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Trainable AI companions | App Store 标语是 AI companions you can train。 | 事实 | 让用户不是只消费角色，而是训练自己的 companion。 | 可训练性需要更高用户投入，对普通玩家门槛高。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Datasets | 用户可用 datasets 创建 AI characters。 | 事实 | Dataset 类似角色知识库 / 反应库，适合高度定制角色。 | 数据集质量直接影响角色表现；维护成本高。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Custom prompts | AI editing tools 包含 custom prompt writing。 | 事实 | 让用户直接控制角色指令和行为边界。 | Prompt 暴露给非专业用户会造成难用和不稳定。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Personality traits selection | AI editing tools 包含 personality traits selection。 | 事实 | 用结构化人设降低 prompt 编写门槛。 | traits 与 dataset / prompt 冲突时会导致人格漂移。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Custom AI model selection | AI editing tools 包含 custom AI model selection。 | 事实 | 高阶用户可在不同模型能力和风格之间选择。 | 模型选择会带来成本、延迟、内容安全和质量差异。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Private rooms / public rooms | 用户可在 private rooms 与 AI 聊天，也可 go live 结交 human friends。 | 事实 | 兼具私密 companion 和公开社交空间。 | 公开房间需要更强 moderation；私聊记忆不能泄露到公共空间。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Kajiwoto | 可训练 AI companion / 社区角色 | iOS / iPadOS | Memory improvement under development | App Store 开发者回复提到正在 improving the AI and memory。 | 事实 + 待核验 | 说明 memory 是其路线重点。 | 这不是已交付能力证明，不能写成成熟 long-term memory。 | [Kajiwoto App Store](https://apps.apple.com/us/app/kajiwoto/id1409354116) |
| Aion | Local-first memory AI companion | Android | Structured memory beliefs | Aion 将 memory 单位定义为 belief，每条 belief 带 confidence、timestamp、source、domain 和 contradiction history。 | 事实 | 这是本轮最值得关注的 memory architecture benchmark。 | 更像个人记忆 assistant，不是情感角色 companion；迁移到桌宠需重新设计具身化和游戏事件层。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | Android | Confidence scoring | Aion 会根据重复、确认和冲突调整 belief confidence。 | 事实 | 可减少错误记忆的绝对化，让 AI 知道哪些信息只是可能。 | 需要把置信度用用户可理解的方式展示。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | Android | Contradiction handling | Memory 记录 contradiction history，用于处理用户信息变化。 | 事实 | 适合长期 companion，因为用户偏好、关系、目标会变化。 | 复杂度高；早期 MVP 可先做简单 edit / delete。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | Android | On-device + BYOK | Aion 描述为 on-device、bring your own key，无账号，用户直接支付模型 provider。 | 事实 | 非常贴合隐私优先和公司数据边界。 | BYOK 对普通用户门槛高；游戏玩家侧不宜默认要求配置 API key。 | [Aion](https://aion-ai.app/), [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | Android | 15 built-in tools | Aion features 页面列出 15 built-in tools。 | 事实 | 说明 memory companion 可从聊天延伸到工具执行。 | 工具权限必须极窄；否则 always-on companion 会变成安全风险。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | Android | Three voice engines | Aion features 页面列出 3 voice engines。 | 事实 | 为语音入口提供模型 / 引擎选择。 | 多引擎提高配置复杂度，也影响一致性。 | [Aion Features](https://aion-ai.app/features) |
| Aion | Local-first memory AI companion | Android | Proactive briefings | Aion 提供 proactive briefings 与 memory digest。 | 事实 | 让 AI 从被动聊天变成主动整理和提醒。 | 主动能力必须有频率控制，否则容易打扰。 | [Aion](https://aion-ai.app/) |
| Aion | Local-first memory AI companion | Android | Visual memory constellation / insights | Aion 展示 memory profile、visual memory constellation、belief categories 等可视化。 | 事实 | 让记忆从黑盒变成可查看、可审计的产品界面。 | 对桌宠来说可作为开发者 / 用户设置页，不一定放在桌面宠物表层。 | [Aion](https://aion-ai.app/) |
| Aion | Local-first memory AI companion | Android | Calendar / reminders | Aion 展示 calendar and reminders built in。 | 事实 | 把记忆和日常行动连接。 | 对游戏桌宠应映射为活动提醒、召回和游戏日程，而不是泛日历。 | [Aion](https://aion-ai.app/) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Desktop / on-screen companion | Razer AVA 可作为 desktop hologram 或 on-screen AI companion。 | 事实 | 直接验证“桌面上可见的 AI companion”是硬件 / 游戏品牌也在探索的方向。 | 形态偏高端硬件和品牌生态，不等于可复用 SDK。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Real memory / evolving personality | Razer 页面称 AVA 有 unique voice、real memory 和会随互动成长的 personality。 | 官方营销表述 + 待核验 | 对游戏 companion 来说，memory + personality 是“像队友”的核心。 | 需要验证真实记忆机制、用户控制和数据保存方式。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Vision / audio sensing | Razer 页面称 AVA 使用 human-like vision and audio sensing 形成 contextual awareness。 | 官方营销表述 + 待核验 | 说明未来桌宠会走向 multimodal context-aware。 | 屏幕 / 音频感知对隐私和游戏公平性极敏感。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Daily planner | AVA 可主动管理 calendar、衣着选择或晚餐计划。 | 事实 | 让 companion 具备日常实用性，不只是陪聊。 | 对 `desktop-pet` 相关性较低，容易偏泛 assistant。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Wellness / routine coach | AVA 可追踪 habits、moods，并提供个性化 self-care motivation 和 reminders。 | 事实 | 体现主动陪伴和长期关系管理。 | 涉及健康 / 情绪时必须避免医疗化承诺。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Document / spreadsheet synthesis | AVA 可分析复杂 documents 和 spreadsheets，提炼关键趋势与数据点。 | 事实 | 展示 companion 可叠加 productivity AI。 | 与游戏桌宠 MVP 关系弱，建议不进入 P0。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Real-time verbal translation | AVA 可进行 text 和 two-way verbal conversation 的实时翻译。 | 事实 | 语音 + 多语言让 companion 可跨语言辅助玩家或社群。 | 实时翻译成本和延迟高，且需要语言安全测试。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Real-time strategy advisor | AVA 被定位为 gaming teammate，可做 real-time strategy advisor。 | 事实 | 与 `desktop-pet` 的游戏场景最相关，可启发“游戏事件感知 + 建议”。 | 需要遵守游戏 TOS，避免变成自动代打或不公平优势。 | [Razer AVA](https://www.razer.com/razer-ava) |
| Razer AVA | Gaming / productivity AI companion | Desktop / 3D hologram | Coach not automated play | Razer FAQ 明确 AVA 是 coach / trainer，不做 automated play，并关注符合游戏开发者 TOS。 | 事实 | 给游戏 AI companion 提供重要合规边界：辅助学习，不代替玩家操作。 | 对 `desktop-pet` 应转成产品原则：不自动操控游戏、不提供作弊信息。 | [Razer AVA FAQ](https://www.razer.com/razer-ava) |

## 3. 横向功能模式总结

| 功能模式 | 代表产品 | 观察结论 | 对 `desktop-pet` 的启发 |
|---|---|---|---|
| 可编辑 / 可见记忆 | Replika, Nomi, Kindroid, Character.AI, Aion | 头部 companion 都在把 memory 从黑盒变成可编辑、可 pin、可解释或可结构化的系统。 | MVP 即使不做强 long-term memory，也应设计 memory boundary、查看 / 删除入口和数据路径。 |
| 跨 modality 连续性 | Kindroid, Character.AI, Nomi | 语音、文字、图片和群聊之间的记忆是否一致，直接影响“像一个人”的感觉。 | 若做 voice，必须回答 voice transcript 是否进入 memory；否则体验会割裂。 |
| Persona / backstory / shared notes | Nomi, Kindroid, Character.AI, Kajiwoto, Talkie | 好的角色不是只靠系统 prompt，而是给用户 / 创作者可配置的人设层。 | SDK 应提供 game-safe persona presets、tone、关系、禁用话题和 fallback 话术。 |
| Group chat / 多角色 | Nomi, Kindroid, Character.AI, Paradot | 群聊是 companion 产品走向角色世界和社交的关键方向。 | 对游戏桌宠可作为 P2，不建议 MVP 先做，除非目标游戏天然多人 / 公会。 |
| Voice / custom voice | Replika, Nomi, Kindroid, Character.AI, Paradot, EVA AI | voice 从加分项变成 companion 标配，但工程和安全成本高。 | P0 可先保留文本 + TTS fallback；真实 voice call 更适合 P1 验证。 |
| Image / selfie / avatar generation | Replika, Nomi, Kindroid, Paradot, Chai, EVA AI, Talkie | 图像让关系视觉化，但一致性和 moderation 很难。 | 游戏桌宠应优先“官方授权资产 + animation mapping”，AI 生成图像不宜默认 P0。 |
| Proactive / agency | Nomi, Aion, Razer AVA | 主动消息、briefing、routine coach 让 AI 像“活着”，但也最容易变烦。 | game event trigger + rate limit + quiet hours 比泛主动关怀更适合游戏场景。 |
| Local-first / privacy-first memory | Aion, CielChan 类产品线索, Kindroid 部分通话临时处理说明 | 隐私已经成为 memory 和 screen-aware companion 的核心竞争点。 | `desktop-pet` 应优先 game event schema，而不是默认 screen / audio watching。 |
| Coach not automation | Razer AVA | 游戏 AI companion 必须区分 coaching / guidance 和 automated play。 | 这是 `desktop-pet` 的关键合规原则，应在 PM 文档中前置。 |

## 4. 建议 Main Thread 新增 / 修正 / 删除的功能行

### 4.1 建议新增

| 建议 | 原因 | 可放入主矩阵的功能行 |
|---|---|---|
| 新增“可编辑 / 可见 memory controls” | Replika、Kindroid、Nomi、Character.AI、Aion 都证明 memory 不是单一功能，而是信任机制。 | `Memory tab / Shared Notes / Journal / Pinned Memories / structured beliefs` |
| 新增“voice transcript 是否进入 memory” | Kindroid 明确处理 unified chat / voice memory；这是 voice companion 的关键体验点。 | `跨 modality memory continuity` |
| 新增“group chat memory isolation” | Nomi 与 Kindroid 都把 group memory 与个人 memory 做隔离或开关。 | `群聊记忆隔离 / shared memory toggle` |
| 新增“proactive messages with cadence controls” | Nomi 与 Aion 都说明主动消息需要频率控制。 | `主动触达频率控制` |
| 新增“custom voice 权利与可见性” | Character.AI、Kindroid 都支持 custom voice，并涉及 private / public 或样本权利。 | `custom voice + consent / visibility` |
| 新增“AI image / selfie consistency 风险” | Nomi、Kindroid、Paradot、Replika 都有视觉输出，但一致性和失败提示是风险。 | `selfie / avatar generation + consistency risk` |
| 新增“structured memory benchmark” | Aion 的 belief / confidence / contradiction 对桌宠记忆设计很有参考价值。 | `结构化记忆 / confidence / contradiction` |
| 新增“gaming coach boundary” | Razer AVA 明确不做 automated play，符合游戏 AI companion 合规需求。 | `coach not automated play` |

### 4.2 建议修正

| 建议 | 原因 | 修正方式 |
|---|---|---|
| 不要把 Character.AI 写成强长期记忆 | 官方主要是 Pinned Memories、Chat Memories，且有使用概率和条数边界。 | 写成“可 pin / 可写入 chat memory，非无限长期记忆”。 |
| 不要把 Chai 写成具备成熟 memory | 官方 FAQ 强调角色生态和自研模型，未找到长期记忆机制说明。 | Chai memory 相关行标“待核验”或不写。 |
| Anima / EVA AI / Paradot 的 memory 深度需降级 | 多数来源是官网营销或应用商店文案，缺少机制说明。 | 写成“官方营销表述 + 待核验”。 |
| Talkie 的 Memories 不等于可靠 long-term memory | 官方域名存在 memory 页面，但更像内容 / 收藏页，机制不清。 | 写成“memory collection / 待核验”，不要写成“长期记忆”。 |
| Razer AVA 的 vision / audio sensing 不能直接类比 desktop-pet P0 | 它是品牌硬件 / on-screen companion，且隐私和游戏公平性风险更高。 | 写成“未来方向 / 风险参考”，不要直接转为 MVP 需求。 |

### 4.3 建议删除或降级

| 建议 | 原因 | 处理方式 |
|---|---|---|
| 删除“AI companion 普遍都有强长期记忆”的泛化描述 | 只有部分产品提供机制级说明，很多是营销表述。 | 改成“头部产品普遍重视 memory，但成熟度差异很大”。 |
| 降级“AI 生成图片 / selfie”为 P1 / P2 候选 | 视觉生成吸引力强，但和游戏 SDK 的 P0 价值不完全一致，风险高。 | MVP 优先官方资产、动作表情和 persona；AI 图像后置。 |
| 降级“voice call”为 P1 候选 | voice 沉浸感强，但成本、延迟、环境和隐私复杂。 | P0 可先做文本 + 可选 TTS；voice call 在验证核心场景后再做。 |
| 删除“screen watching 是桌宠标配”的暗示 | 对公司业务、游戏场景和隐私边界都过高风险。 | 改成“优先 game event schema；screen / audio 仅 opt-in 验证”。 |
| 删除“完整 group chat / 多 companion 进入 MVP”的假设 | 群聊复杂度高，容易偏离游戏桌宠 SDK 核心。 | 作为 P2 或特定多人游戏验证方向。 |

## 5. 给 PM Thread 的后续问题

| 问题 | 为什么重要 |
|---|---|
| `desktop-pet` 的 memory 是玩家级、游戏级、角色级，还是开发者配置级？ | 不同 memory scope 会决定数据结构、隐私边界和删除逻辑。 |
| voice transcript 是否允许进入 memory？ | 直接影响 voice 功能的连续性和隐私风险。 |
| 游戏事件是否可以替代 screen / audio sensing？ | 这是 `desktop-pet` 相比泛 AI companion 更安全、更垂直的差异化路径。 |
| 是否需要 developer-facing persona editor？ | 多游戏 SDK 需要让集成方配置 tone、禁用话题、角色关系和 fallback。 |
| 是否允许玩家自定义 voice / persona？ | 自定义能力有体验价值，但会引入 IP、voice rights 和 moderation 风险。 |
| AI companion 是否可以主动触达？触达频率由谁控制？ | 主动能力是陪伴感来源，也是桌面打扰源。 |
| 是否明确“不自动操控游戏、不提供作弊能力”？ | 游戏 AI companion 的合规和合作方接受度高度依赖这条边界。 |
