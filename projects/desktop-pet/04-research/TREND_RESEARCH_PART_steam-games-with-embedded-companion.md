# Steam 游戏内嵌伴侣 / 宠物 / Mascot 对标清单（PART）

> 与前三份研究互补：本文只看 **已经在 Steam 上发行的游戏**，并且这些游戏自身**内嵌了伴侣 / 宠物 / mascot 系统**——也就是 desktop-pet "在现有游戏里内嵌桌宠" 场景的真实对标。
>
> 上一份 PART（`TREND_RESEARCH_PART_in-game-embedded-companion-references.md`）覆盖了 SDK / 中间件 / 玩家心智范式（含部分非 Steam 游戏，如 Hearthstone 在 Battle.net、Genshin / WoW 不在 Steam）。本文按"必须 Steam"再筛一遍。
>
> 最后更新：2026-05-09
>
> 研究线程：AI Trend Radar Thread

## 1. 范围

| 必须满足 | 必须排除 |
|---|---|
| 已在 Steam 商店上线（含 Early Access） | 仅在 Battle.net / Origin / EA App / 米哈游官启 / Nintendo / PlayStation 独家上线的游戏 |
| 自身内嵌伴侣 / 宠物 / mascot 系统（不是单独的桌宠应用） | 桌面独立桌宠应用（已在前 3 份研究覆盖） |
| 玩家可以在游戏内持续看到 / 互动 / 升级 / 切换该伴侣 | 单纯剧情 NPC、不可控伴侣 |

按"对 desktop-pet 的相关度"分 3 个 Tier。

## 2. Tier 1：AI 驱动的内嵌伴侣（与 desktop-pet 形态最贴近）

| # | 游戏（Steam） | 伴侣 / 系统 | 技术栈 | 状态 |
|---|---|---|---|---|
| 1 | [PUBG: BATTLEGROUNDS](https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/) | **PUBG Ally**（首个 Co-Playable Character） | NVIDIA ACE + Mistral-Nemo-Minitron-8B-128k-instruct，**on-device** 推理 | KRAFTON 已公布 PUBG Arcade 测试，2026 早期开放（英 / 韩 / 中） |
| 2 | [inZOI](https://store.steampowered.com/app/2456740/inZOI/) | **Smart Zoi**（CPC 形式的 Sims-like AI 居民） | NVIDIA ACE + Mistral NeMo Minitron 500M，~1GB VRAM | Early Access 2025-03-28 上线，Smart Zoi 为实验功能 |
| 3 | [NARAKA: BLADEPOINT](https://store.steampowered.com/app/1203220/NARAKA_BLADEPOINT/) | NVIDIA ACE 驱动 AI 队友 | On-device | NetEase 在 2026-03-27 加入 Mobile PC Version |
| 4 | MIR5（Steam 即将） | NVIDIA ACE 驱动 enemy boss | On-device | 已公开搭载计划 |
| 5 | Dead Meat / AI People / ZooPunk / Alien: Rogue Incursion / World of Jade Dynasty | NVIDIA ACE 驱动 partner / NPC | On-device | 已公开搭载计划，部分未上线 |

**判断：** 这一组是 desktop-pet 在"游戏内嵌 + AI 驱动伴侣"维度的工业级对标。注意三件事：
- on-device 推理而不是云推理（隐私 + 延迟优势）
- 按游戏类型给不同形态（FPS 队友、模拟生活居民、ACT 对手 / 队友）
- VRAM 占用 ~1GB 是当前最低门槛，影响硬件覆盖面

## 3. Tier 2：结构化收集 / 永久跟随宠物（"Hearthstone King Krush 模式"在 Steam 上的同类）

| # | 游戏（Steam） | 伴侣 / 系统 | 关键机制 | 体量信号 |
|---|---|---|---|---|
| 1 | [Final Fantasy XIV Online](https://store.steampowered.com/app/39210/FINAL_FANTASY_XIV_Online/) | **Minions** 系统 | 永久收集 + 单一召唤 + 互动小动作（如狼崽和豹猫会斗）+ Lord of Verminion 对战 + 收藏家百科；Collector's Edition 自带专属 | 已运营十余年，Minions 数量上千，是大型 MMO 收集向伴侣的工业范式 |
| 2 | [Stardew Valley](https://store.steampowered.com/app/413150/Stardew_Valley/) | 猫 / 狗 / 龟（v1.6 共 11 种） | 友好度上限自动掉礼物，需 Pet Bowl 维持友好度，否则会下降 | 长青销量；"Pet Bowl 维持机制"是简单但有效的情感粘性设计 |
| 3 | [Cult of the Lamb](https://store.steampowered.com/app/1313140/Cult_of_the_Lamb/) | Followers 系统（小教众） | 多 follower 永久存在 + 个性 + 任务 + 死亡 + 仪式；2024 加入合作 | **96% / 58,430+ 评论** — 是"多伴侣社群养成"在 Steam 的现象级案例 |
| 4 | [Don't Starve Together](https://store.steampowered.com/app/322330/Dont_Starve_Together/) | Chester / Glommer / Hutch 等永久跟随箱子 / 伙伴 | 跟随 + 装载 + 部分提供能力 | 长青联机沙盒，伴侣作为生存功能挂件 |
| 5 | [Subnautica](https://store.steampowered.com/app/264710/Subnautica/) | **Cuddlefish** 抚摸鱼伴侣 | 蛋孵化 → 跟随 / 停留指令 + 抚摸交互 | "等你孵 / 抚摸"形成情感锚点的小成本范例 |
| 6 | [Sea of Thieves](https://store.steampowered.com/app/1172620/Sea_of_Thieves/) | 宠物 DLC（猫狗鸟猴） | 定制 + 跟随 + 表情互动 + 喂食 | DLC 形态宠物的代表，与 Desktop Mate 单角色 DLC 模式逻辑一致 |
| 7 | [Valheim](https://store.steampowered.com/app/892970/Valheim/) | 驯化狼（及其他可驯化） | 喂食驯化 + 跟随 + 战斗 | 沙盒驯养路线的轻范式 |

**判断：** Tier 2 是"游戏内宠物 / 伴侣 = 玩家社交资本 / 情感粘性"这条路径的成熟案例。给 desktop-pet 的启发是：内嵌桌宠不必依赖 AI 对话，仅靠"收集 + 切换 + 友好度 + 小礼物 + 表情互动" 也能跑出非常坚固的玩家粘性，这是 PMF 的低风险版。

## 4. Tier 3：角色 Mascot 即 UI（"Paimon 模式"在 Steam 上的同类）

| # | 游戏（Steam） | Mascot | 形态 |
|---|---|---|---|
| 1 | [Persona 5 Royal](https://store.steampowered.com/app/1687950/Persona_5_Royal/) / [Persona 3 Reload](https://store.steampowered.com/app/2161700/Persona_3_Reload/) / Persona 4 Golden | **Morgana / Teddie / Koromaru / Aigis** | 菜单图标 + 剧情语音 + 提示触发 + 战斗变身（Persona） |
| 2 | [Borderlands 2](https://store.steampowered.com/app/49520/Borderlands_2/) / [3](https://store.steampowered.com/app/397540/Borderlands_3/) / [Wonderlands](https://store.steampowered.com/app/1286680/Tiny_Tinas_Wonderlands/) | **Claptrap** | 全程吉祥物 + 任务发布 + 嘴炮陪伴 |
| 3 | [Hollow Knight](https://store.steampowered.com/app/367520/Hollow_Knight/) | **Grimmchild**（护符召唤主动伴侣） | 永久护符 + 主动攻击 + 升级 |
| 4 | [Stray](https://store.steampowered.com/app/1332010/Stray/) | **B-12** | 背包伴侣 + 翻译 + 解谜 + 剧情驱动 |
| 5 | [Half-Life 2](https://store.steampowered.com/app/220/HalfLife_2/) + Episodes | **Dog** / **Alyx** | 战斗辅助 + 关卡叙事载体 |
| 6 | [Hatsune Miku Project DIVA Mega Mix+](https://store.steampowered.com/app/1761390/Hatsune_Miku_Project_DIVA_Mega_Mix/) | **Miku** | IP mascot 直接内嵌，是 IP 即游戏的极致形态 |
| 7 | [Hogwarts Legacy](https://store.steampowered.com/app/990080/Hogwarts_Legacy/) | 神奇动物 / 跟随生物 | 有限跟随 + 收集 + 房间放置 |

**判断：** Tier 3 不是收集系统也不是 AI 系统，而是"伴侣 = 游戏 UI / 旁白 / 剧情存在感"。给 desktop-pet 的启发是：当伴侣承担**菜单图标 + 提示发声 + 解谜协作 + 任务发布**这些 UI 工具职责时，玩家会把它当 UI 一部分而不是装饰，粘性远高于纯装饰桌宠。

## 5. 最值得抄的 5 款（Steam-only 收口）

| 排名 | 游戏 | 抄什么 |
|---|---|---|
| 1 | inZOI | "AI 驱动伴侣 + on-device + 1GB VRAM"的工程范式；Smart Zoi 的"读心 / 显示思绪"UI 是把 AI 黑盒变玩具的典型设计 |
| 2 | PUBG Ally | "AI 队友进入既有 AAA 游戏"的接入路径；Mistral-Nemo-Minitron-8B 这种小模型 + on-device 是直接可参考的栈 |
| 3 | Cult of the Lamb | 多伴侣社群养成 + 极高玩家粘性的 Steam 现象级；非 AI 也能跑出 96% / 5.8 万 |
| 4 | Final Fantasy XIV Minions | 大体量收集 / 切换 / 互动小动作 / 收藏百科 / Lord of Verminion 衍生；老牌 MMO 工业范式 |
| 5 | Stardew Valley Pet | "Pet Bowl + 友好度可下降 + 自动送礼"的最简情感粘性公式 |

## 6. 对 desktop-pet 的启发

| # | 启发 | 类型 |
|---|---|---|
| 1 | 真正在 Steam 上落地的"AI 内嵌伴侣"基本都走 NVIDIA ACE + on-device 小模型，云推理路线还没人在 Steam AAA 上验证成功 | 推断 |
| 2 | desktop-pet 不必从 AI 起步：FF14 Minions / Cult of the Lamb 都没有 AI，照样跑出工业级粘性。MVP 可先做"收集 + 切换 + 友好度"再加 AI | 推断 |
| 3 | "伴侣 = UI 工具"（Persona Morgana / Borderlands Claptrap / Stray B-12）是把伴侣从"装饰"升级为"功能"的关键路径，desktop-pet SDK 应让接入方能配置伴侣承担菜单 / 提示 / 任务 / 翻译职责 | 观点 |
| 4 | Sea of Thieves 的宠物 DLC 模式与 Desktop Mate 单 IP DLC 模式逻辑一致，给"游戏内嵌桌宠的微付费"提供 Steam 内已验证的对照组 | 推断 |
| 5 | inZOI 的 Smart Zoi "可见 AI 思绪"UI 设计可借鉴：当 AI 偶尔出错时，能让玩家看到决策路径会显著降低反感 | 观点 |
| 6 | NVIDIA ACE 在 PUBG / NARAKA / inZOI 三种完全不同游戏类型上落地，证明"按游戏类型配伴侣形态"是必要的；desktop-pet SDK 必须按游戏类型给配置模板 | 推断 |

## 7. 风险

| # | 风险 | 缓解 |
|---|---|---|
| 1 | NVIDIA ACE 路线对硬件门槛拉高（1GB VRAM、SLM 推理），可能挤掉低端玩家 | 提供"无 AI 降级版"作为基础档 |
| 2 | inZOI 玩家社区里已有"是否需要 NVIDIA 卡"等讨论，平台兼容性是用户痛点 | desktop-pet 必须跨 NVIDIA / AMD / Intel，不能绑定 ACE |
| 3 | Cult of the Lamb / Stardew 的伴侣粘性来自玩法系统，光靠 SDK 嵌一个伴侣未必能复制 | 需要与接入游戏的玩法团队共同设计伴侣闭环 |
| 4 | Persona / Borderlands 的 mascot 强度来自 IP 与剧情写作，SDK 无法替代 | desktop-pet 应把"接入方提供 IP / 写作 / 语音"作为前置条件 |

## 8. 推荐行动

| # | Action | Workspace | 优先级 |
|---|---|---|---|
| 1 | 把 Cult of the Lamb / FF14 Minions / Stardew Pet 的"非 AI 也能高粘"作为 desktop-pet MVP 的最低底线参考 | `01-pm/` | P0 |
| 2 | 拆解 inZOI Smart Zoi 的"AI 决策可视化"UI，作为 desktop-pet AI 行为透明度设计参考 | `02-design/` | P1 |
| 3 | 评估 NVIDIA ACE 是否进入 desktop-pet 后端候选（含跨厂商兼容路径） | `03-engineering/` | P1 |
| 4 | 把 Persona Morgana / Borderlands Claptrap 的"伴侣即 UI"职责清单整理成 SDK 可配置项 | `02-design/` + `01-pm/` | P1 |
| 5 | 跟踪 PUBG Ally 2026 实测开放后玩家反馈（KRAFTON 公布的 Arcade 测试节奏） | `04-research/` | P2 |
| 6 | 跟踪 NARAKA: BLADEPOINT MOBILE PC VERSION 中 ACE 队友的玩家口碑 | `04-research/` | P2 |

## 9. Open Questions（新增）

| # | 问题 | Owner |
|---|---|---|
| 1 | desktop-pet 的 MVP 形态是 Cult of the Lamb 式的"多 follower 养成"，还是 Persona 式的"单 mascot 即 UI"？ | PM Strategy Thread + User |
| 2 | desktop-pet 是否在第一版即支持 on-device AI（参考 NVIDIA ACE Mistral-Nemo-Minitron-8B / 500M），还是先无 AI 跑通粘性？ | PM Strategy Thread + Engineering Build Thread |
| 3 | desktop-pet 是否提供"按游戏类型给配置模板"（FPS 队友 / 模拟生活居民 / 收集向 minion / mascot UI），把 NVIDIA ACE 在三种游戏上的分化打成 SDK 模板？ | PM Strategy Thread + Engineering Build Thread |

## 10. 来源

| 来源 | 链接 |
|---|---|
| PUBG: BATTLEGROUNDS Steam | https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/ |
| PUBG Ally GDC | https://schedule.gdconf.com/session/building-a-co-playable-character-pubg-ally-an-ai-teammate-powered-by-nvidia-ace-presented-by-nvidia/917523 |
| KRAFTON PUBG Ally 公告 | https://www.krafton.com/en/news/press/krafton-reveals-playtest-plans-for-pubg-ally-built-with-nvidia-ace/ |
| inZOI Steam | https://store.steampowered.com/app/2456740/inZOI/ |
| inZOI Smart Zoi 媒体报道 | https://www.dsogaming.com/news/inzoi-is-the-first-game-with-ai-powered-npcs-using-nvidia-ace/ |
| NARAKA: BLADEPOINT Steam | https://store.steampowered.com/app/1203220/NARAKA_BLADEPOINT/ |
| NVIDIA ACE for Games | https://developer.nvidia.com/ace-for-games |
| NVIDIA ACE PUBG / NARAKA / inZOI | https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/ |
| Final Fantasy XIV Online Steam | https://store.steampowered.com/app/39210/FINAL_FANTASY_XIV_Online/ |
| FFXIV Minions Wiki | https://ffxiv.consolegameswiki.com/wiki/Minions |
| Stardew Valley Steam | https://store.steampowered.com/app/413150/Stardew_Valley/ |
| Stardew Animals Wiki | https://stardewvalleywiki.com/Animals |
| Cult of the Lamb Steam | https://store.steampowered.com/app/1313140/Cult_of_the_Lamb/ |
| Don't Starve Together Steam | https://store.steampowered.com/app/322330/Dont_Starve_Together/ |
| Subnautica Steam | https://store.steampowered.com/app/264710/Subnautica/ |
| Subnautica Cuddlefish Wiki | https://subnautica.fandom.com/wiki/Cuddlefish |
| Sea of Thieves Steam | https://store.steampowered.com/app/1172620/Sea_of_Thieves/ |
| Valheim Steam | https://store.steampowered.com/app/892970/Valheim/ |
| Persona 5 Royal Steam | https://store.steampowered.com/app/1687950/Persona_5_Royal/ |
| Persona 3 Reload Steam | https://store.steampowered.com/app/2161700/Persona_3_Reload/ |
| Borderlands 3 Steam | https://store.steampowered.com/app/397540/Borderlands_3/ |
| Hollow Knight Steam | https://store.steampowered.com/app/367520/Hollow_Knight/ |
| Stray Steam | https://store.steampowered.com/app/1332010/Stray/ |
| Half-Life 2 Steam | https://store.steampowered.com/app/220/HalfLife_2/ |
| Hatsune Miku Project DIVA Mega Mix+ Steam | https://store.steampowered.com/app/1761390/Hatsune_Miku_Project_DIVA_Mega_Mix/ |
| Hogwarts Legacy Steam | https://store.steampowered.com/app/990080/Hogwarts_Legacy/ |
