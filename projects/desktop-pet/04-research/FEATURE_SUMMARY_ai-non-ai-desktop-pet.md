# Desktop Pet 功能点最终总结

> 本表综合用户观点、产品证据矩阵、AI 功能模式与非 AI 支撑模式。2026-05-09 已补充用户近期测试的 13 款 Steam / itch.io 桌宠游戏，并统一标注为 `【用户实测补充 / 2026-05-09】`。它是 PM Thread 进入 T-001 的输入，不是已锁定需求。

## 1. 核心判断

当前趋势不是简单把 LLM 接进桌宠，而是把桌宠做成一个“可见、可控、有身体的 Agent”。它以 LLM / memory / tools / context 为智能核心，以 avatar / animation / voice / overlay / control surface 为具身表达层。相比黑盒 Agent，桌宠的优势是可以把意图、情绪、等待、执行、失败、记忆变化和权限边界可视化。进一步看，桌宠的长期留存不一定只来自单人自进化，也可能来自“共同抚养 + 共同记忆 + 关系联结”：当一只宠物属于两个人或一个小队时，它会从个人陪伴对象变成关系资产。

## 2. 最终功能点总结表

| # | 功能模块 | 能力类型 | 功能点总结 | 市场证据 / 代表产品 | 对 desktop-pet 的价值 | MVP 建议 | 关键风险 / 边界 |
|---:|---|---|---|---|---|---|---|
| 1 | 角色与资产配置 | AI + 非 AI | 只负责“角色是谁、长什么样、默认怎么说话”：persona / 语气 / 禁忌 / 常用词、2D / Live2D / VRM / sprite、voice、motion mapping、游戏品类 presets。 | CielChan, Clawster, Ai Vpet, UPochi, YCamie, Character.AI, Desktop Mate；【用户实测补充 / 2026-05-09】Ai Vpet, AI桌面宠物, MateEngine, Molili AI Friends, 猫娘计划 - N.E.K.O. | 给多游戏 SDK 一个可复用的角色配置层，让同一套能力快速换成不同游戏角色。 | P0：开发者侧 persona presets + asset slots；P1：voice / motion mapping；P2：图生宠物资产。 | 这是静态配置，不负责运行时反应；生成资产涉及 IP、安全、审核和一致性。 |
| 2 | 用户交互入口 | AI + 非 AI | 只负责“用户如何触达桌宠”：文字对话、一键语音通话、半双工 / 全双工语音、interrupt、鼠标点击、拖拽、hover、右键菜单、快捷按钮。鼠标点击 / 拖拽属于输入入口；窗口停靠、跟随鼠标、靠近光标这类“像活物一样存在”的表现归入生命感与养成循环。 | CielChan, Desktop Pet, Hiora, Open LLM Vtuber, Nomi, Character.AI, Synca, 逗逗AI；【用户实测补充 / 2026-05-09】Bongo Cat, Desktop Goose, Tiny Pasture, Pocket Waifu, Desktop Mate, MateEngine | 降低召唤摩擦，让用户能自然地叫它、碰它、打断它和控制输入方式。 | P0：文字 + 鼠标 / 右键控制 + 拖拽 + interrupt；P1：一键语音通话 + 低延迟语音；P2：全双工。 | 交互入口只负责输入 / 触达，不负责窗口运动、生命感、意图判断、记忆或主动触发；不能抢输入。 |
| 3 | 桌面常驻与用户控制 | 非 AI | 只负责“常驻形态和用户安全控制”：always-on overlay、置顶、点击穿透、隐藏、退出、quiet、stop speaking、mic off、全屏游戏降级、桌宠 / 悬浮球双形态切换。 | Open LLM Vtuber, Desktop Mate, Hiora, Dockling, Xbox Game Bar, 逗逗AI；【用户实测补充 / 2026-05-09】Bongo Cat, Rusty's Retirement, Tiny Pasture, Desktop Mate, MateEngine | 用户知道自己能控制它，才愿意让它常驻桌面；游戏内可用悬浮球降低遮挡，游戏外恢复桌宠形态。 | P0：hide / quiet / stop speaking / exit / fullscreen behavior；P1：桌宠 / 悬浮球双模式；所有高打扰能力必须有可见开关。 | 控制面是用户安全闸门，不能被 AI、插件或 action 绕过；悬浮球只能作为轻入口，不能遮挡关键游戏 UI。 |
| 4 | 感知与上下文输入 | AI + SDK | 只负责“桌宠知道现在发生了什么”：app / window / running program、VLM 游戏画面识别、screen / screenshot、audio、game event、player state、mouse signal、chat signal；优先通过结构化 game event schema 和特定游戏上下文，而不是默认全屏监听。 | Clawster, CielChan, AIRI, Overwolf, Xbox Game Bar, NVIDIA ACE, 逗逗AI, 妹居物语；【用户实测补充 / 2026-05-09】猫娘计划 - N.E.K.O.（screen sharing / 键鼠接管规划）, Molili AI Friends（screen reading 规划） | 让桌宠在正确时间说正确内容，是区别于泛 AI companion 的关键。 | P0：game event bridge + 低敏 OS context；P1：运行程序感知、用户主动截图问答、关键游戏画面识别；P2：持续 screen / audio sensing。 | 感知只采集和结构化上下文，不直接判断意图或执行动作；screen / audio / VLM 识别默认 opt-in。 |
| 5 | 意图识别与路由 | AI | 只负责“判断信号该交给谁”：把输入和上下文转成 intent label、confidence、permission tier、next owner。它不执行动作、不生成 reaction、不写入记忆。 | Clawster, CielChan, Open LLM Vtuber, Inworld, Convai；【用户实测补充 / 2026-05-09】Molili AI Friends, 猫娘计划 - N.E.K.O., AI桌面宠物 | 避免“听到一句话就直接行动”，是输入、感知与后续执行之间的路由层。 | P0：intent label + confidence + permission tier + ask confirmation；仅支持低风险类别。 | 低置信度必须 ask confirmation；不能绕过权限直接触发高风险 action。 |
| 6 | Reaction / 表达输出 | AI + 非 AI | 只负责“此刻怎么表现出来”：基于环境、场景、用户状态、对话情绪、现实时间、节日或 AI 意图，输出表情、动作、姿态、语音情绪、话术风格、气泡或提示卡。 | CielChan, Hiora, Desk-Buddy, Open LLM Vtuber, Desktop Mate, Synca, 妹居物语, 逗逗AI；【用户实测补充 / 2026-05-09】Desktop Mate, MateEngine, AI桌面宠物, Molili AI Friends, Pocket Waifu | 把 AI 输出从抽象文本变成可见、可感知、和当下环境相匹配的陪伴行为。 | P0：固定 reaction set + intent / context 到 reaction mapping；P1：情绪化语音、persona matching、时段 / 节日问候。 | 运行时 reaction 不等于静态人格配置；表情、语音情绪和内容不匹配会显廉价。 |
| 7 | Actions / 工具执行 | AI + 非 AI | 只负责“能做什么以及怎么安全执行”：action registry / allowlist、参数校验、权限确认、执行、失败回滚和日志。动作可由按钮、意图、hook 或 SDK 事件触发，但触发来源不属于本模块。 | CielChan, Open LLM Vtuber, tama96, VTube Studio API, Convai, PAIcom；【用户实测补充 / 2026-05-09】Molili AI Friends, 猫娘计划 - N.E.K.O., Desktop Goose, MateEngine | 让桌宠从会说话变成会做有限、有边界、可审计的事。 | P0：低风险宠物动作 + UI action；P1：游戏相关提示卡 / open_panel / create_reminder；P2：外部工具调用。 | 所有执行必须统一走 allowlist、权限、参数校验、回滚和日志；高权限动作默认关闭。 |
| 8 | 记忆与成长模型 | AI | 只负责“沉淀什么、如何形成变化”：短期上下文、长期记忆、重要时刻、高光事件、关系状态、chat 摘要 / 日记、场景级多模态记忆、用户画像、人格微调建议和 follow-up 候选线索。 | CielChan, Nomi, Kindroid, Utsuwa, Aion, AIRI, Replika, Synca, 逗逗AI, 妹居物语；【用户实测补充 / 2026-05-09】Molili AI Friends, AI桌面宠物, 猫娘计划 - N.E.K.O. | 让重复互动变成连续关系，并把重要时刻、游戏画面、声音和对话沉淀成后续互动上下文。 | P0：短期上下文 + 用户可见显式记忆 + 重要时刻记录；P1：长期记忆、日记摘要、场景级多模态记忆；P2：人格演化和 follow-up 候选。 | 只生成记忆和候选线索，不直接触发主动行为；多模态记忆必须支持查看、编辑、删除、重置和采集范围说明。 |
| 9 | Proactive hooks / 主动触发 | AI + Workflow | 只负责“什么时候主动发生”：周期 / 事件触发器、现实时间 / 节日 / 时段触发、游戏关键场景主动提示、基于记忆线索的 smart follow-ups、低频提醒、召回游戏活动、基于事件主动关怀、quiet hours 和 rate limit。 | Nomi Proactive Messages, CielChan idle observations, Streamer.bot, Unity Triggers, Desktop Pet reminders, Synca, 妹居物语, 逗逗AI；【用户实测补充 / 2026-05-09】Ai Vpet, Desktop Mate, Rusty's Retirement, Tiny Pasture, Molili AI Friends | 让宠物不只被动等待，而有自己的存在节奏，也能在关键游戏节点及时出现。 | P1：低频游戏事件提醒 + 关键场景主动提示 + 记忆线索 smart follow-ups + quiet hours / snooze；P2：跨工具 workflow。 | 主动触发必须可解释、可关闭、可撤销；不能把“记得某事”自动等同于“应该打扰用户”。 |
| 10 | Agent 状态可视化 | AI + 非 AI | 只负责“把系统当前在做什么展示给用户”：触发原因、owner、intent / confidence、准备执行的 action、执行状态、失败原因、权限请求和 memory diff。 | OpenPets agent progress, MCP human-in-the-loop, Open LLM Vtuber shared status；【用户实测补充 / 2026-05-09】猫娘计划 - N.E.K.O., Molili AI Friends, AI桌面宠物 | 这是“桌宠 = 可视化 Agent”的关键差异，能降低黑盒困惑。 | P0：状态气泡 / 提示卡展示 owner + status；P1：action confirmation；P1：memory diff。 | 展示层不做推理、不做决策、不执行动作；不能暴露 chain-of-thought。 |
| 11 | 生命感与养成循环 | 非 AI | 负责非 AI 状态下的存在感与养成反馈：呼吸、眨眼、睡觉、窗口边停靠、跟随鼠标的生命感、喂食、摸头、心情值、羁绊等级、成长阶段、收集和动作解锁。 | Desktop Mate, Dockling, Hiora, VPet-Simulator, Pocket Waifu, Tiny Pasture, Rusty's Retirement；【用户实测补充 / 2026-05-09】角落里的艾果 Eggo, Bongo Cat, MateEngine | 不调用 AI 时也要好玩、好看、好留下来，是非 AI 留存的核心。 | P0：低打扰 idle states + 基础点击 / 拖拽后的反馈表现；P1：轻量羁绊 / 心情状态；P2：成长、收集、养成系统。 | 生命感可以响应交互入口传来的事件，但不定义输入入口；养成不能喧宾夺主变成游戏本体。 |
| 12 | 社交关系与共同抚养 | AI + 社交 + 非 AI | 合并原“群聊 / 多玩家”和“共同抚养”：多人会话房间、多宠物共存、共享 conversation context、shared ownership、共同记忆、共同喂养 / 装扮 / 解锁、关系回顾和低风险传话。 | Nomi, Kindroid, Character.AI, UPochi, VPet-Simulator care loop；【用户实测补充 / 2026-05-09】角落里的艾果 Eggo, Bongo Cat online co-op, 猫娘计划 - N.E.K.O. | 让桌宠从“我的陪伴”变成“我们的关系资产”，增强双人 / 小队回访。 | P1：双人共享宠物 + 共同成长值 + 共同回忆卡；P2：多人房间、小队宠物、公会吉祥物。 | 必须区分个人私有记忆和共享记忆；涉及 moderation、成员权限、退出 / 分开后的处理。 |
| 13 | 轻量工具与任务卡 | 非 AI + 可选 AI | 只负责“桌宠能提供哪些小工具本体”：闹钟、计时器、quick notes、patch notes、活动倒计时、奖励领取提醒、任务卡、游戏知识服务（联网搜索 + 特定游戏专属知识库 / RAG）、BOSS 打法、收集指南、物品获取、成就提示、出装建议、赛后复盘、Deep Thought / image generation 等能力入口。 | Desktop Pet, Desktop Mate, Dockling, CielChan, 逗逗AI；【用户实测补充 / 2026-05-09】Desktop Mate alarms, Molili AI Friends, Rusty's Retirement Focus Mode | 让桌宠常驻有实用理由，避免只靠“可爱”撑留存；对游戏场景来说，专属知识库比单纯联网搜索更稳定、更可控。 | P1：游戏活动 / 回流提醒、特定游戏知识库问答、BOSS / 收集 / 物品获取任务卡优先；泛效率工具后置。 | 只定义工具本体；何时触发归 hooks，如何执行归 Actions，知识库如何接入归 SDK，权限归治理层。 |
| 14 | SDK / 开发者接入平台 | AI + 非 AI | 只负责“游戏开发者如何接入和配置”：event schema、context payload、per-game knowledge pack / game RAG、persona / reaction template、asset slot spec、preview、debugger、permission config、data path matrix 和 sample integration。 | Overwolf, Inworld, Convai, VPet-Simulator, Streamer.bot, AIRI plugin architecture, 逗逗AI；【用户实测补充 / 2026-05-09】VPet-Simulator, MateEngine, AI桌面宠物, 猫娘计划 - N.E.K.O. | 符合 desktop-pet 多游戏 SDK / 平台定位，不绑定单个游戏；每个游戏可以带自己的攻略、机制、数值、世界观和运营活动知识库。 | P0：event schema + context payload + per-game knowledge pack / RAG 接入 + reaction preview + safe prompt config + 30 分钟 sample integration；P1：debug panel。 | SDK 是接入契约，不负责 UGC 市场或运行时插件；专属知识库需要版本管理、来源标注、召回质量和过期内容处理。 |
| 15 | 内容资产与创作者生态 | 非 AI + 平台 | 只负责“内容资产和商业化扩展”：皮肤、服装、主题、voice pack、动作包、道具、DLC、官方授权角色包、creator marketplace，以及角色投稿规范（Live2D 模型、表情、动作、声音、固定台词、人设、对话样例）。 | Desktop Mate, UPochi, VPet-Simulator, Ai Vpet, Character.AI, YCamie, 逗逗AI；【用户实测补充 / 2026-05-09】Bongo Cat hats / DLC, Desktop Mate IP DLC, AI桌面宠物 Workshop, 猫娘计划 - N.E.K.O. Workshop | 让同一套桌宠能力快速换成不同游戏品牌和角色，也让创作者知道“交什么资产才可运行”。 | P0：asset slots 和品牌约束；P1：皮肤 / voice pack / 动作包 / 官方角色包 / 角色投稿规范；P2：creator marketplace。 | 内容生态不开放运行时权限；IP 授权、UGC 审核、声音权利复杂。 |
| 16 | Modding / Plugin 运行时扩展 | 非 AI + 平台 | 只负责“运行时扩展能力”：插件 API、MOD、脚本扩展、provider / model adapter、行为扩展、WPF / sidecar app 嵌入、sandbox、签名 / 审核和回滚。 | VPet-Simulator, Desktop Goose, tama96, Desk-Buddy, Open LLM Vtuber；【用户实测补充 / 2026-05-09】VPet-Simulator, Desktop Goose, MateEngine, AI桌面宠物, 猫娘计划 - N.E.K.O. | 决定它能否从单个产品变成平台和生态，也契合“赋能多个游戏”。 | P1：受限 plugin、adapter 白名单、脚本白名单；P2：开放 MOD。 | 运行时扩展可以调用 Actions，但不能绕过治理层；插件安全、兼容、审核和回滚成本高。 |
| 17 | 隐私 / 安全 / 治理 | 非 AI + AI Governance | 只负责“治理规则和安全闸门”：数据采集范围、存储 / 上传 / provider 路径、记忆查看 / 编辑 / 删除、action permission policy、日志脱敏、年龄 / 情感安全边界、opt-in / opt-out。 | CielChan, Clawster, Desk-Buddy, Dockling, Aion, MCP safety patterns；【用户实测补充 / 2026-05-09】AI桌面宠物（本地推理 / 不上传）, Ai Vpet（第三方 AI 服务）, 猫娘计划 - N.E.K.O.（第三方 AI 服务） | 信任本身就是桌面 AI 产品的 P0 功能。 | P0：data boundary matrix + memory controls + action permission policy + opt-in / opt-out；敏感能力默认最小化。 | 治理层不是 UI 控制面或 action executor，但必须约束 SDK、Actions、插件和 memory。 |
| 18 | 性能 / 分发 / 兼容 | 非 AI | 负责常驻软件的运行与交付底座：轻量 renderer、FPS cap、idle mode、低 CPU / RAM、动作槽位、安装包、启动速度、托盘常驻、自动更新、崩溃恢复、Windows / Mac 差异处理。 | Desktop Mate, Open LLM Vtuber, AIRI, VPet-Simulator, Dockling；【用户实测补充 / 2026-05-09】Bongo Cat, Rusty's Retirement, Tiny Pasture, Desktop Goose, AI桌面宠物 | 常驻软件的性能和稳定性直接决定是否被留下。 | P0：Windows + Mac 基础兼容、低资源模式、启动快、退出和恢复；P1：自动更新。 | 游戏玩家对 FPS、内存、启动项、安全软件提示极敏感；本地模型和 3D 会拉高资源占用。 |
| 19 | 首次体验与激活 | 非 AI | 只负责“第一次如何让用户感到它活了”：免费基础形象、快速 preview、引导式设置、开箱可爱动作、首句场景化问候、玩家 30 秒 instant delight、开发者 30 分钟 sample integration。 | UPochi, Desktop Mate, Clawster, Dockling, YCamie；【用户实测补充 / 2026-05-09】Bongo Cat, Desktop Mate, AI桌面宠物, Molili AI Friends, Pocket Waifu | 用户先感到“它活了”，才愿意配置人格、记忆和权限。 | P0：玩家 30 秒看到宠物活起来；开发者 30 分钟跑通 sample integration。 | 首次配置不能过重；首次权限请求不能太吓人；不要把 onboarding 和长期配置混为一谈。 |

## 3. 功能优先级表

> 优先级按 desktop-pet MVP 验证目标排序：先证明“多游戏可配置 + 游戏事件上下文 + 可视化 AI 桌宠 + 低打扰常驻”成立，再扩展记忆、共同抚养、生态与高级 Agent 能力。

| 优先级 | 功能模块 | MVP 版本边界 | 为什么这样排 | 关键依赖 / 风险 |
|---|---|---|---|---|
| P0 | SDK / 开发者接入平台 | event schema、context payload、per-game knowledge pack / RAG 接入、persona / reaction template、asset slot spec、preview、基础 debug panel | 这是 desktop-pet 区别于单个桌宠 app 的根定位：要让多个游戏能快速配置和集成，并能带上自己的攻略、机制、数值和世界观知识库。 | SDK 不能太重；需要 30 分钟 sample integration 路径；专属知识库要处理版本、来源和过期内容；不要和 UGC 市场、运行时插件混在一起。 |
| P0 | 角色与资产配置 | 开发者侧 persona presets、基础 asset slots、角色语气、禁忌、默认动作 / 声音槽位 | 多游戏可配置的第一层就是角色配置；不同游戏需要快速换人格和外形。 | 生成资产、声音、IP 授权先不做重。 |
| P0 | 用户交互入口 | 文字、鼠标点击 / 拖拽 / hover、右键控制、interrupt；一键语音通话先作为 P1 | 先保证用户能低摩擦召唤、碰它、控制它和打断它。 | 交互入口只负责触达，不负责意图、记忆或主动触发。 |
| P0 | 桌面常驻与用户控制 | hide、quiet、stop speaking、exit、置顶、点击穿透、全屏降级、mic off；桌宠 / 悬浮球双形态作为 P1 | 常驻产品必须让用户有控制感，否则很快被关闭或卸载；游戏中可用悬浮球减少遮挡，游戏外恢复桌宠陪伴感。 | 控制面是用户安全闸门，不能被 AI 或插件绕过；悬浮球不能遮挡关键游戏 UI。 |
| P0 | 感知与上下文输入 | 优先只做结构化 game event bridge + 低敏 OS context；运行程序感知、截图 / 屏幕 / 音频 / VLM 游戏画面识别后置为 opt-in | 没有游戏上下文，就容易退化成泛 AI companion；VLM 可补足无 SDK 事件时的游戏画面理解。 | 感知只采集上下文，不直接判断或执行；screen / audio / VLM 风险高。 |
| P0 | 意图识别与路由 | intent label、confidence、permission tier、next owner、ask confirmation | 它是输入 / 上下文到 reaction、actions、hooks 的路由层。 | 只判断和路由，不执行动作；低置信度不能触发高权限动作。 |
| P0 | Reaction / 表达输出 | 固定 reaction set + context / intent 到 reaction mapping + 确定性 fallback | 桌宠的核心不是文本，而是把 AI 输出变成表情、动作、语音情绪和状态反应。 | Reaction 是运行时表达，不等同于静态 persona；P0 应少而准。 |
| P0 | Actions / 工具执行 | action registry、allowlist、参数校验、低风险宠物动作、UI action、失败回滚 | 让桌宠从“会说”变成“会做”，但先限制在安全动作集合里。 | 动作可被多来源触发，但执行必须统一走 allowlist、权限和日志。 |
| P0 | Agent 状态可视化 | 状态气泡 / 提示卡展示 owner、intent、准备动作、执行状态和失败原因 | 这是“可视化 Agent”的差异化核心，可以降低黑盒困惑。 | 只做展示，不做决策；不展示 raw reasoning；信息密度要低打扰。 |
| P0 | 隐私 / 安全 / 治理 | data boundary matrix、provider 路径、memory controls、action permission policy、opt-in / opt-out、日志脱敏 | screen、voice、memory、tools 都依赖信任边界。 | 这是治理层，不是 UI 控制面或 action executor；local-vs-cloud 必须讲清。 |
| P0 | 性能 / 分发 / 兼容 | Windows + Mac 基础包、启动快、低资源模式、托盘常驻、退出 / 崩溃恢复 | 常驻桌面软件的基础体验直接决定能否留存。 | 自动更新可 P1；P0 先保证安装和运行稳定。 |
| P0 | 首次体验与激活 | 玩家 30 秒看到宠物活起来；开发者 30 分钟跑通 sample integration | 这是早期验证和汇报演示的关键，不然能力再多也难被感知。 | 首次权限请求不能太吓人；onboarding 不要变成长期配置。 |
| P1 | 记忆与成长模型 | 短期上下文 + 用户可见显式记忆 + 重要时刻记录；长期记忆、日记、人格演化后置 | 记忆是陪伴感核心，但隐私风险高，适合在 P0 信任边界后推进。 | 只生成记忆和 follow-up 线索，不直接触发行为。 |
| P1 | Proactive hooks / 主动触发 | 低频游戏事件提醒、关键场景主动提示、现实时间 / 节日 / 时段触发、基于记忆线索的 smart follow-ups、quiet hours、snooze | 主动行为能增强存在感，但很容易打扰；游戏关键场景提示比泛提醒更贴近桌宠游戏伙伴定位。 | 触发原因要可解释；需要频率限制、安静时段和显式开关。 |
| P1 | 生命感与养成循环 | idle 生命感、点击反馈、心情状态、轻量羁绊、摸头 / 喂食、少量动作解锁 | 不调用 AI 时也要好玩、好看、好留下来。 | 养成不能喧宾夺主变成游戏本体。 |
| P1 | 轻量工具与任务卡 | 闹钟、计时器、quick notes、patch notes、活动倒计时、奖励领取提醒、特定游戏知识库问答、BOSS / 收集 / 物品 / 成就任务卡 | 让常驻有实用理由，但应优先贴近游戏场景；攻略不只靠联网搜索，每个游戏可以有自己的专属知识库。 | 只定义工具本体；触发归 hooks，执行归 Actions，知识库接入归 SDK。 |
| P1 | 内容资产与创作者生态 | 皮肤 / voice pack / 动作包 / 官方角色资产替换；角色投稿规范；creator marketplace 后置 | 多游戏 SDK 需要快速换品牌和角色资产，也需要明确创作者交付标准。 | 内容生态不开放运行时权限；IP 授权、UGC 审核、声音权利复杂。 |
| P1 | Modding / Plugin 运行时扩展 | 受限 plugin、adapter 白名单、脚本白名单；开放 MOD 后置 | 适合从产品走向平台，但早期要先控风险。 | 运行时扩展必须受治理层和 sandbox 约束。 |
| P2 | 社交关系与共同抚养 | 双人共享宠物、共同成长值、共同回忆卡；多人房间、小队宠物后置 | 这是比单人自进化更有差异化的留存假设。 | 关系记忆敏感；要区分个人私有和双方共享记忆。 |

## 4. 功能层级建议

| 层级 | 功能组 | 产品含义 |
|---|---|---|
| 静态配置层 | 角色与资产配置 | 决定桌宠“是谁、长什么样、默认怎么说话”，不处理运行时反应。 |
| 用户输入层 | 用户交互入口 | 决定用户“怎么叫它、碰它、打断它、控制输入方式”。鼠标点击 / 拖拽在这里作为输入事件。 |
| 桌面控制层 | 桌面常驻与用户控制 | 决定用户能不能安全地让它常驻，包括隐藏、安静、退出、点击穿透和全屏降级。 |
| 上下文输入层 | 感知与上下文输入 | 决定桌宠“现在知道了哪些外部事实”，例如 game event、window、screen、audio、chat signal。 |
| 智能路由层 | 意图识别与路由 | 决定这些输入应该流向 reaction、actions、memory、hooks 还是保持安静。 |
| 表达与执行层 | Reaction / 表达输出；Actions / 工具执行；Agent 状态可视化 | 决定桌宠“如何表现、是否执行、执行过程如何被看见”。 |
| 长期关系层 | 记忆与成长模型；Proactive hooks / 主动触发；生命感与养成循环；社交关系与共同抚养 | 决定桌宠是否能形成持续关系、低打扰存在感和共同养成价值。窗口停靠 / 跟随鼠标作为生命感表现放在这一层。 |
| 工具内容层 | 轻量工具与任务卡；内容资产与创作者生态 | 决定桌宠能提供哪些实用卡片、游戏攻略服务和可替换内容资产。 |
| 开发者平台层 | SDK / 开发者接入平台；Modding / Plugin 运行时扩展 | 决定它能否被多个游戏接入、配置和扩展，也决定每个游戏能否带自己的专属知识库。 |
| 治理交付层 | 隐私 / 安全 / 治理；性能 / 分发 / 兼容；首次体验与激活 | 决定用户和开发者是否敢用、能否顺利安装、能否快速感知价值。 |

## 5. 对用户观点的校正

| 用户观点 | 结论 | 建议修正 |
|---|---|---|
| 桌宠正在变成可视化 Agent | 成立 | 用“Agent 化是趋势，完整 autonomous agent 尚未普遍成熟”表述更稳。 |
| Agent 所想需要可视化 | 成立 | 不展示 raw reasoning，展示触发原因、意图、动作、状态、记忆变化和权限请求。 |
| 桌宠可在夜间偷偷进化 | 有潜力 | 产品上应是“后台生成候选更新，用户可见可撤销”，不要无感改变人格和高权限动作。 |
| 动作可以不断学习新增 | 有潜力 | P0 先固定 action set；P1 做动作参数化；P2 才考虑 AI 生成新动作 / 话术。 |
| 屏幕感知可判断用户想法 | 需要收敛 | 建议改为“推断用户当前状态 / 任务 / 可能需求”，且优先 game event schema。 |
| 共同抚养能提升持续使用 | 成立 | 这是比单人自进化更有差异化的留存假设；建议表述为“共同记忆和共同养成形成关系资产”，并把劝架收敛成低风险的情绪缓和与传话。 |

## 6. 用户实测产品补充矩阵（2026-05-09）

> 本节只放用户近期测试产品的增量证据，便于和前面的通用 AI companion / 桌宠调研区分。`【用户实测补充 / 2026-05-09】` 表示这些产品来自用户提供的测试清单，功能点已用公开 Steam / itch.io 页面做基础核验；没有公开证明的能力不写成事实。

| 产品ID | 产品 | 来源 | AI / 非 AI 判断 | 已核验功能点 | 对功能总结的映射 | 标注 |
|---|---|---|---|---|---|---|
| P001 | Bongo Cat | Steam | 非 AI 为主 | 键盘 / 点击触发猫敲击 taskbar；打字、点击、工作时积累 points；帽子 / 外观收集；Online Co-op；DLC / item drop pool | 用户交互入口；生命感与养成循环；内容资产与创作者生态；社交关系与共同抚养 | 【用户实测补充 / 2026-05-09】 |
| P002 | Desktop Mate | Steam | 非 AI 为主 | 官方授权角色 DLC；3D 角色在桌面游走、坐窗口、跳窗口；玩鼠标 / 跟随光标；闹钟；Multi-Character Mode 处于 Open Beta | 生命感与养成循环；桌面常驻与用户控制；轻量工具与任务卡；内容资产与创作者生态 | 【用户实测补充 / 2026-05-09】 |
| P003 | VPet-Simulator | Steam / GitHub | 非 AI 为主，具备 AI 扩展承载位 | 免费开源；200+ animation；摸头、抱起、跳舞、爬墙等互动；Steam Workshop 可加动画、物品、食物、台词、主题和 code plugin；可改代码做自己的桌宠 | 生命感与养成循环；SDK / 开发者接入平台；内容资产与创作者生态；Modding / Plugin 运行时扩展 | 【用户实测补充 / 2026-05-09】 |
| P004 | Desktop Goose | itch.io | 非 AI 为主 | 桌面鹅会抢鼠标、留下泥印、带消息 / memes、打开 Goose Notepad；支持自定义 notepad 文案、memes、GIF、config toggles 和 modding API | 用户交互入口；Actions / 工具执行；轻量工具与任务卡；Modding / Plugin 运行时扩展；反向风险样本 | 【用户实测补充 / 2026-05-09】 |
| P005 | Ai Vpet | Steam | AI 为主 | LLM 文本 / 语音对话；第三方 AI 服务；可配置角色 image、personality、clothing、voice；Live2D 资源和 model upload；休息时主动互动 | 角色与资产配置；用户交互入口；Reaction / 表达输出；Proactive hooks / 主动触发；隐私 / 安全 / 治理 | 【用户实测补充 / 2026-05-09】 |
| P006 | Tiny Pasture | Steam | 非 AI 为主 | 屏幕底部 farm / pasture；动物睡觉、抓挠、跑动；购买 / 成长 / 收 coins / 扩张；喂食、点击、鼠标中键跟随；同物种繁殖；可拖拽调整 pasture 长度和位置 | 生命感与养成循环；桌面常驻与用户控制；用户交互入口；性能 / 分发 / 兼容 | 【用户实测补充 / 2026-05-09】 |
| P007 | Pocket Waifu: Desktop Pet | Steam | 非 AI 为主 | 3D chibi desktop companion；摸头、boop、拖拽 / yeet；80+ animations、expressions、props、foods；钓鱼、清屏、抓虫、挖矿赚货币；每日互动提升 affection 并解锁背景和新互动 | 用户交互入口；Reaction / 表达输出；生命感与养成循环；内容资产与创作者生态 | 【用户实测补充 / 2026-05-09】 |
| P008 | Rusty's Retirement | Steam | 非 AI 为主 | 屏幕底部 idle-farming；种植、浇水、收获；作物产 biofuel 并出售；机器人自动化；Zoom / Focus Mode / vertical side layout；Twitch chat command 共建 farm | 生命感与养成循环；桌面常驻与用户控制；轻量工具与任务卡；社交关系与共同抚养 | 【用户实测补充 / 2026-05-09】 |
| P009 | MateEngine | Steam | 非 AI 为主，含小型本地 AI chat | 自定义 VRM model；音乐 app 白名单触发 dancing；head / eye / hand / spine tracking；hover touch regions；拖拽、taskbar relaxing、chibi mode；graphics / FPS 设置；modding | 角色与资产配置；感知与上下文输入；Reaction / 表达输出；生命感与养成循环；Modding / Plugin 运行时扩展；性能 / 分发 / 兼容 | 【用户实测补充 / 2026-05-09】 |
| P010 | AI桌面宠物 | Steam | AI 为主 | Live2D 桌宠；本地 LLM，无需 API Key / Token / 联网；兼容人设卡、世界书、对话分支、长对话记忆；本地 STT / TTS / 音色克隆；Workshop 订阅 Live2D 模型、人设卡、世界书；对话数据本地保存 | 角色与资产配置；用户交互入口；记忆与成长模型；内容资产与创作者生态；隐私 / 安全 / 治理 | 【用户实测补充 / 2026-05-09】 |
| P011 | 角落里的艾果 Eggo | Steam | 非 AI 为主，强社交养成 | 从一颗蛋开始孵化、成长、旅行；好友一起抚养；投喂 / 照顾；好友 Eggo 恋爱、结婚、生蛋；混血宝宝 / 隐藏基因；100+ 服饰外观；屏幕角落旅行收集宝物换金币和家具 | 社交关系与共同抚养；生命感与养成循环；内容资产与创作者生态；关系型留存 | 【用户实测补充 / 2026-05-09】 |
| P012 | Molili AI Friends | Steam | AI 为主 | Molili personalization model；长期记忆、情绪模拟、人格演化；Live2D 桌面陪伴与触摸反馈；web search、Deep Thought、AI image generation；affinity relationship system；服装 / 饰品自定义；计划 screen reading、本地 AI、creators' workshop | 角色与资产配置；用户交互入口；Reaction / 表达输出；记忆与成长模型；轻量工具与任务卡；内容资产与创作者生态 | 【用户实测补充 / 2026-05-09】 |
| P013 | 猫娘计划 - N.E.K.O. | Steam | AI 为主 | AI companion 从 desktop 到 mobile / games / social media 跨场景；Steam Workshop / GitHub community；voice chat、screen sharing、keyboard / mouse takeover、persistent memory；跨 DLC / 游戏 / 桌面唯一记忆同步；计划 AI-native social network / multi-user interaction | 用户交互入口；感知与上下文输入；Actions / 工具执行；记忆与成长模型；内容资产与创作者生态；社交关系与共同抚养 | 【用户实测补充 / 2026-05-09】 |

## 7. 新增调研产品补充矩阵（2026-05-10）

> 本节补充本轮新增核验的国内产品。`【新增调研 / 2026-05-10】` 表示来自公开页面 / 官方文档的产品信息，后续如要进入 PRD 仍需二次确认功能可用性、平台覆盖和隐私边界。

| 产品ID | 产品 | 来源 | AI / 非 AI 判断 | 已核验功能点 | 对功能总结的映射 | 标注 |
|---|---|---|---|---|---|---|
| R001 | 妹居物语 | Steam | AI 为主，偏生活 / 恋爱模拟 + 桌宠模式 | 实时 AI 对话、Live2D 动画、实时配音；Yuki 会记住对话、喜好、习惯；根据玩家行为发展不同性格路线；现实时间同步，不同时段 / 节日有不同反馈；桌宠模式会根据电脑运行程序给不同问候；玩法包含旅游、约会、换装、小游戏、战斗、挂机、送礼；使用 DeepSeek / Qwen / SiliconFlow 等第三方 AI 服务；更新公告提到微信小程序聊天记录可延续到 App，并支持桌宠自定义人设 | 角色与资产配置；感知与上下文输入；Reaction / 表达输出；记忆与成长模型；Proactive hooks / 主动触发；生命感与养成循环 | 【新增调研 / 2026-05-10】 |
| R002 | 逗逗AI | 官网 / 官方文档 | AI 为主，偏游戏伙伴 / 游戏 AI 桌宠 | VLM 实时识别游戏画面；重要场景主动提示；联网搜索 + 推理回答游戏问题；支持特定游戏知识库 / 游戏知识体系；实时语音连麦；跨游戏记忆；多模态长期记忆，把视觉、听觉、对话融合为场景记忆；桌宠 + 悬浮球双模式；精选 AI 伙伴，包括原创 IP、虚拟主播、B站 UP 数字分身；角色投稿规范覆盖 Live2D 模型、表情、动作、声音、固定台词、人设和对话样例 | 用户交互入口；桌面常驻与用户控制；感知与上下文输入；Reaction / 表达输出；记忆与成长模型；Proactive hooks / 主动触发；轻量工具与任务卡；SDK / 开发者接入平台；内容资产与创作者生态 | 【新增调研 / 2026-05-10】 |

## 8. 调研产品 URL 表

> 本表汇总本轮调研中出现的产品、平台与参考对象链接。同一产品有多个证据来源时拆成多行；每个具体功能点的证据解释仍以 `TREND_RESEARCH_companion-desktop-pet-products.md` 的产品证据矩阵为准。

| 产品 / 主题 | URL | 备注 |
|---|---|---|
| CielChan | https://phasma.ai/ | 官网；覆盖：实时语音对话；持续记忆 + 人格演化；上下文存在感 / 空闲观察；窗口焦点追踪；本地视觉 / 截图分析；系统音频监听；游戏事件；工具调用 / 多步骤工具；云端 LLM provider / GPU offload；自动口型同步 + 表情 |
| 妹居物语 | https://store.steampowered.com/app/3963620/_/ | Steam；【新增调研 / 2026-05-10】覆盖：AI 生活 / 恋爱模拟；Live2D；实时配音；长期记忆；现实时间 / 节日反馈；桌宠模式；第三方 AI 服务边界 |
| 妹居物语 | https://steamcommunity.com/app/3963620/allnews/ | Steam 更新公告；【新增调研 / 2026-05-10】覆盖：更新节奏；桌宠自定义人设；跨端聊天记录延续等更新信息 |
| 逗逗AI | https://www.doudou.fun/ | 官网；【新增调研 / 2026-05-10】覆盖：AI 游戏伙伴；实时语音陪伴；游戏画面理解；主动提示；跨游戏记忆；桌宠 / 悬浮球形态 |
| 逗逗AI | https://www.doudou.fun/article/hakkoai-1.0-launched | 1.0 发布文章；【新增调研 / 2026-05-10】覆盖：VLM 实时识别；多模态长期记忆；游戏问题搜索与推理；重要场景主动提示 |
| 逗逗AI | https://docs.doudou.fun/ | 官方文档；【新增调研 / 2026-05-10】覆盖：角色投稿规范；支持游戏知识；功能文档入口 |
| 逗逗AI | https://www.doudou.fun/article/doudou-supported-games/ | 支持游戏列表；【新增调研 / 2026-05-10】覆盖：游戏覆盖范围；游戏知识库 / 场景适配启发 |
| Synca | https://play.google.com/store/apps/details?id=com.al.synca | Google Play；覆盖：一键 AI 语音通话；情绪化语音陪伴；persona matching；记住重要时刻；smart follow-ups。未纳入功能点：免注册试用、数据安全声明。 |
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
| UPochi | https://www.upochi.com/ | 官网；覆盖：LLM 加持聊天；人格特质与名称；好友房间聊天 / teleport；离线模式 / 无追踪；人格化响应；自定义创建宠物；离线 / 无追踪边界 |
| Ai Vpet | https://store.steampowered.com/app/3029820/Ai_Vpet/ | Steam；【用户实测补充 / 2026-05-09】覆盖：LLM 文本对话；语音对话；AI 情感陪伴；AI 个性化平台；第三方 AI 服务；第三方 AI 内容生成服务；角色 image / personality / clothing / voice 配置；Live2D 资源；model upload；主动休息互动 |
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
| VPet-Simulator | https://github.com/LorisYounger/VPet | VPet GitHub；【用户实测补充 / 2026-05-09】覆盖：plugin / MOD 扩展动作和功能；可嵌入宠物核心；ChatGPT 设置组件；AI 扩展承载位；开源桌宠核心 |
| VPet-Simulator | https://store.steampowered.com/app/1920960/VPet/ | Steam / GitHub；【用户实测补充 / 2026-05-09】覆盖：200+ 动画；摸头 / 抱起 / 跳舞 / 爬墙等互动；Steam Workshop 动画、物品、食物、台词、主题、code plugin |
| VPet Mod Maker | https://steamdb.info/patchnotes/12552366/ | VPet MOD Maker patch notes；覆盖：no-code / low-code 行为编排 |
| tama96 | https://www.tama96.com/ | tama96 official site；覆盖：MCP server 控制宠物动作；MCP server 让 AI 工具照顾宠物；按动作授权；频率限制 |
| Model Context Protocol | https://modelcontextprotocol.io/docs/learn/architecture | MCP Architecture / MCP Tools spec；覆盖：AI 动作工具发现 / 执行 |
| Model Context Protocol | https://modelcontextprotocol.io/specification/2025-06-18/server/tools | MCP Architecture / MCP Tools spec；覆盖：AI 动作工具发现 / 执行；human-in-the-loop 工具安全 |
| Unity Gaming Services Triggers | https://docs.unity.com/en-us/triggers | Unity Triggers；覆盖：server event -> AI 工作流；失败处理 / dead letter queue 启发 |
| YCamie | https://www.shimeji.ai/blog/introducing-YCamie | 教程；覆盖：图片 / reference image 生成 Shimeji；OpenAI API key 聊天设置 |
| YCamie | https://www.ycamie.com/ | 官网；覆盖：文本生成 Shimeji；AI 动画帧生成；交互式 AI 聊天；实时响应 |
| Desktop Mate | https://store.steampowered.com/app/3301060/Desktop_Mate/ | Steam；【用户实测补充 / 2026-05-09】覆盖：官方授权角色 DLC；3D 桌面 mascot；窗口坐靠 / 跳跃；鼠标互动 / 光标跟随；闹钟；Multi-Character Mode；当前无明确 LLM 功能 |
| Dockling | https://dockling.space/ | 官网；覆盖：从照片生成像素宠物；多帧 pixel pet 生成；本地数据边界 |
| Desktop Goose | https://samperson.itch.io/desktop-goose | itch.io；【用户实测补充 / 2026-05-09】覆盖：抢鼠标、泥印、消息 / memes、Goose Notepad、config toggles、modding API；当前无明确 AI 功能 |
| Bongo Cat | https://store.steampowered.com/app/3419430/Bongo_Cat/ | Steam；【用户实测补充 / 2026-05-09】覆盖：键盘 / 点击触发敲击；points；帽子 / 外观收集；Online Co-op；DLC / item drop pool；Windows + macOS |
| Rusty's Retirement | https://store.steampowered.com/app/2666510/Rustys_Retirement/ | Steam；【用户实测补充 / 2026-05-09】覆盖：屏幕底部 idle-farming；作物 / biofuel；机器人自动化；Focus Mode；vertical mode；Twitch chat command 共建 |
| Tiny Pasture | https://store.steampowered.com/app/3167550/_/ | Steam；【用户实测补充 / 2026-05-09】覆盖：屏幕底部动物牧场；喂食 / 点击 / 鼠标跟随；繁殖；可拖拽调整 pasture 位置与长度；Windows + macOS |
| Pocket Waifu: Desktop Pet | https://store.steampowered.com/app/2989820/Pocket_Waifu_Desktop_Pet/ | Steam；【用户实测补充 / 2026-05-09】覆盖：3D chibi 桌面伴侣；80+ 动画 / 表情；props / foods；钓鱼 / 清屏 / 抓虫 / 挖矿；affection 解锁；chance based in-game purchases |
| MateEngine | https://store.steampowered.com/app/3625270/MateEngine/ | Steam；【用户实测补充 / 2026-05-09】覆盖：VRM 自定义模型；音乐触发 dancing；head / eye / hand / spine tracking；touch regions；本地小型 AI chat；modding；FPS / 低配设置；anti-cheat 限制提示 |
| AI桌面宠物 | https://store.steampowered.com/app/4227700/AI_Desktop_Pet/ | Steam；【用户实测补充 / 2026-05-09】覆盖：Live2D 桌宠；本地 LLM；人设卡 / 世界书 / 对话分支 / 长对话记忆；本地 STT / TTS / 音色克隆；Workshop；本地隐私边界 |
| 角落里的艾果 Eggo | https://store.steampowered.com/app/3700760/Eggo/ | Steam；【用户实测补充 / 2026-05-09】覆盖：好友共同抚养；孵化 / 成长 / 旅行；好友 Eggo 恋爱、结婚、生蛋；混血宝宝 / 隐藏基因；100+ 服饰外观；收集宝物换金币与家具 |
| Molili AI Friends | https://store.steampowered.com/app/4141770/Molili_AI_Friends_Your_AI_Desk_Pal/ | Steam；【用户实测补充 / 2026-05-09】覆盖：长期记忆；情绪模拟；人格演化；Live2D；web search；Deep Thought；AI image generation；affinity relationship system；服装 / 饰品自定义；planned screen reading / local AI / creators' workshop |
| 猫娘计划 - N.E.K.O. | https://store.steampowered.com/app/4099310/Project_NEKO/ | Steam；【用户实测补充 / 2026-05-09】覆盖：AI companion；Steam Workshop / GitHub community；voice chat；screen sharing；keyboard / mouse takeover；persistent memory；跨桌面 / 游戏 / DLC 唯一记忆同步；AI-native social network 规划 |
| Shimeji-Desktop | https://github.com/DalekCraft2/Shimeji-Desktop | GitHub；覆盖：当前无明确 AI 功能；行为配置系统 |
| Shijima | https://github.com/pixelomer/Shijima-Qt | itch.io / GitHub；覆盖：当前无明确 AI 功能 |
| Shijima | https://pixelomer.itch.io/shijima | itch.io / GitHub；覆盖：当前无明确 AI 功能；shimeji inspector / creator 工作流 |
| Desktop Mascot Engine | https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/ | Steam；覆盖：AI Assistant 计划；utility APIs / Cloud Services 集成计划 |
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
