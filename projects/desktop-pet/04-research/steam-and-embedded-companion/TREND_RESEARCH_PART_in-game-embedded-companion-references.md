# 游戏内嵌伴侣 / 桌宠 SDK 对标（PART）

> 与 `TREND_RESEARCH_steam-popular-desktop-pet-games.md`（独立桌宠应用）和 `TREND_RESEARCH_PART_free-desktop-pet-alternatives.md`（免费 / 开源扩展）同步阅读。
>
> 本文重新校准研究范围：当用户场景是"在现有游戏里内嵌桌宠 / 伴侣"，独立桌宠（Bongo Cat、Rusty）只是次要参考，更直接的对标是 **游戏内 AI NPC SDK / 游戏内永久伴侣 UI / 游戏美术管线中间件**。
>
> 最后更新：2026-05-09
>
> 研究线程：AI Trend Radar Thread

## 1. 范围重定义

| 用户原始任务 | 之前的研究角度 | 修正后的研究角度 |
|---|---|---|
| 在现有游戏里内嵌桌宠 | 调研 Steam 上的独立桌宠应用 | 调研游戏内 AI 伴侣 SDK + 游戏永久伴侣 UI + 美术管线中间件 + 官方衍生桌宠模式 |

`desktop-pet` 项目定位是"多游戏可配置桌宠 SDK"，因此最相关的对标产品有 6 类：

| # | 类别 | 与 desktop-pet 的对位 |
|---|---|---|
| A | AI NPC / 伴侣 SDK / Middleware | SDK 路线的直接竞品 / 借力对象 |
| B | 游戏内永久伴侣 UI | 玩家心智 + 角色定位的产品形态参考 |
| C | 美术管线 SDK | 资产格式 + 渲染管线必经 |
| D | Discord / Streamer 生态 | 跨平台覆盖 + UGC 能力扩展 |
| E | 官方游戏 → 第三方桌宠衍生 | 玩家自发桌宠化路径 |
| F | Tencent 内部能力栈 | IEG 内部业务方一定会问"为什么不复用" |

## 2. 类别 A：AI NPC / 伴侣 SDK / Middleware（核心对标）

| # | 产品 | 形态 | 引擎 / 平台 | 关键信号 | 对 desktop-pet 的启发 |
|---|---|---|---|---|---|
| 1 | [Inworld AI](https://inworld.ai/) | 角色级 AI 引擎，做"性格 + 记忆 + 情感目标" | Unity / Unreal / Roblox / Minecraft 多端 SDK；Unreal 商城有正式插件 | 游戏 AI NPC middleware 头部之一 | 性格 / 记忆 / 情感模型是桌宠"长期陪伴"的方法论原型 |
| 2 | [Convai](https://convai.com/) | 多模态 NPC（视觉 + 听觉 + 动作） | Unity SDK + Unreal | 强调 perception + real-time world interaction | 对应桌宠"感知游戏事件 + 反馈"这一支 |
| 3 | Charisma.ai | 故事驱动型 AI 角色，自带 Emotion Engine | Unity 插件 | 对话情绪追踪 + 分支叙事 | 对应桌宠"角色一致性 + 情绪记忆" |
| 4 | [NVIDIA ACE for Games](https://developer.nvidia.com/ace-for-games) | 自治 AI 角色（companion / boss / co-player） | 与游戏深度集成；On-device 推理 | 已落地 PUBG、NARAKA: BLADEPOINT、inZOI、MIR5、Dead Meat、AI People、World of Jade Dynasty 等 | "AI 队友 / 伴侣"这一类的工业级对标，特别是 PUBG Ally 的 CPC 模式 |
| 5 | Tencent TRTC Conversational AI Solution | 游戏内 AI 实时对话 + 低延迟语音 | TRTC + GME / GMES | Tencent 内部 toB 能力，主打 AI NPC / playmate / teammate | IEG 内部一定要回答"是否复用 TRTC 而不是自建" |
| 6 | Tencent GiiNex | 游戏 AI 引擎（AIGC 图像 / 3D / 故事 / NPC） | 自研内部平台 | 2024 GDC 公开的 IEG 自研 AI 引擎 | 资产生成 / NPC 生成的内部能力，桌宠 SDK 美术管线可能复用 |
| 7 | Tencent F.A.C.U.L. | FPS 内首个 AI 队友 | 内部研究 | 强调"AI 听懂人话" | "AI 队友"形态参考 |
| 8 | Tencent Cloud ADP — AI Virtual NPC & Game Agent Platform | 对外 AI NPC 平台 | Cloud-based | toB 平台化 | 桌宠 SDK 与 Tencent Cloud ADP 边界需要明确 |

**判断：** AI NPC SDK 的能力（性格、记忆、情感、对话、感知、动作）与桌宠 SDK 是高度重合的；区别只是宿主——NPC 在游戏世界里，桌宠在桌面或游戏 UI 旁。`desktop-pet` 不应重新造性格 / 记忆 / 情感引擎，而应在已有 AI NPC 能力之上做"宿主层 + 多游戏配置层"。

## 3. 类别 B：游戏内永久伴侣 UI（产品形态参考）

| # | 案例 | 形态 | 心智 | 对 desktop-pet 的启发 |
|---|---|---|---|---|
| 1 | Genshin Impact - Paimon | 飞行小角色，永远跟随玩家，承担导航 / 翻译 / 解说 / 邮件签名（"P·A·I·M·O·N"） / 暂停菜单图标（Paimon Menu） | "整个游戏的 UI 即 Paimon" | 桌宠不只是浮窗，而是可以"成为游戏 UI 的人格化层" |
| 2 | Hearthstone - King Krush（首个互动收集宠物） | 对局期间在棋盘旁，反应玩家动作和对手动作；通过对局获经验，可解锁皮肤；对局结束陪走结算页 | "陪你打牌的随行宠物" | 与桌宠 SDK 最像的产品形态——单局生命周期 + 升级 + 皮肤生态 |
| 3 | World of Warcraft - Companions / Battle Pets | 非战斗收集宠物，从 Mists of Pandaria 起加入 Pet Battle 系统 | "收藏 + 对战" | 桌宠走收集 / 养成路线时的工业级范例 |
| 4 | Final Fantasy XIV - Minions | 永久跟随，数量大，社交炫耀向 | "自定义陪伴" | 多角色管理 + 社交展示 |
| 5 | Stardew Valley - Pets | 单一固定伴侣，与情感系统耦合 | "家庭成员" | 单一桌宠 + 情感数值 |
| 6 | Pokémon-Amie / Pokémon Sun & Moon companion | 抚摸 / 喂食 / 微表情伴侣 | "亲密度" | 触摸交互 + 情绪反馈 |
| 7 | Tomodachi Life: Living the Dream | 自定义可绘制宠物 + 生活模拟伴侣 | "高度自定义伴侣" | UGC 桌宠形态 |

**判断：** 这一类不是 SDK 也不是中间件，而是桌宠产品的"形态范式库"。**Hearthstone King Krush 是 desktop-pet 当前最相关的形态对标**——单局生命周期、可升级、可解锁皮肤、对局过程伴随情绪反馈、对局结束陪走结算页——这套模式可以几乎 1:1 映射到桌宠 SDK 在游戏内的接入。

## 4. 类别 C：美术管线 SDK（资产层必经）

| # | SDK | 主要用途 | 商业模式 | 对 desktop-pet 的启发 |
|---|---|---|---|---|
| 1 | [Live2D Cubism SDK](https://www.live2d.com/en/sdk/about/) | 2D 平面角色动画（PSD → 骨骼 / 网格 / 物理） | 免费下载，发布时按 Publication License 收费 | 600+ 产品官方使用；Unity / Unreal / Cocos Creator / Ren'Py 全覆盖；桌宠 + Vtuber + 视觉小说事实标准 |
| 2 | Spine | 2D 骨骼动画 | License + 商业版 | 与 Live2D 形成 2D 角色动画双标 |
| 3 | VRoid / VRM 生态 | 3D 拟人角色（VRM 0/1 标准） | 开源标准 + 模型市场 | MateEngine / Desktop Mate / 3D Desktop Pets 都用；3D 桌宠的标准管线 |
| 4 | FBX / glTF2 / OBJ | 3D 通用资产格式 | 开放 | 兼容现有游戏的桌宠模型导入 |

**判断：** SDK 美术管线必须支持 **Live2D + VRM** 至少一种；理想情况是同时支持 2D（Live2D / Spine） + 3D（VRM）双轨，让接入方按角色类型选。

## 5. 类别 D：Discord / Streamer 生态（跨平台覆盖参考）

| # | 平台 / 产品 | 形态 | 信号 | 对 desktop-pet 的启发 |
|---|---|---|---|---|
| 1 | Discord Embedded App SDK | iframe 内嵌互动应用 / Activities | 已开放第三方游戏入驻 | 桌宠是否要支持"在 Discord 通话内成为共有桌宠" |
| 2 | Discord Game SDK / Social SDK | Rich Presence + Game Invites + Overlay | Steam 上有专门 SDK 使用统计 | 桌宠在游戏中的状态展示 / 邀请机制可借力 |
| 3 | Steam Overlay | Steam 客户端在游戏内浮层 | 标准浮层范式 | SDK 在 PC 游戏全屏环境的浮层兼容性参考 |
| 4 | PNGTuber Plus / Reactive by FugiTech | 主播虚拟形象，PNG 反应说话 | itch.io 高频下载 | 主播向桌宠：低门槛 PNG 路线，桌宠 SDK 可保留 PNG / GIF 最简档 |
| 5 | Streamlabs / OBS 浮层 | 直播浮层伴侣 | 主播业态标准 | 桌宠在直播场景的展示边界 |

**判断：** Discord / Streamer 生态不是直接竞品，但是 SDK 走"跨宿主"路线时的关键覆盖面。如果 desktop-pet 要支持"游戏 + 直播 + 桌面"三宿主，必须研究 Discord Embedded App SDK 与 Streamlabs 的接入边界。

## 6. 类别 E：官方游戏 → 玩家自发桌宠化（社区路径）

| # | 案例 | 形态 | 信号 |
|---|---|---|---|
| 1 | Arknights → [ArkPets](https://github.com/isHarryh/Ark-Pets)（社区） | 玩家把明日方舟干员 Live2D / Spine 模型做成桌宠 | GPL3 开源；中文社区高活跃；下载站 [arkpets.harryh.cn](https://arkpets.harryh.cn/downloads) |
| 2 | Arknights → [AK-Buddy](https://github.com/bungaku-moe/AK-Buddy) | 同 IP 第二实现 | 社区竞品 |
| 3 | Genshin Impact → 第三方桌宠社区 | Paimon / 角色 Live2D 模型在桌宠社区流通 | 模之屋（aplaybox.com）等中文模型社区 |
| 4 | Hatsune Miku → Desktop Mate Hatsune Miku DLC | 官方授权 IP 桌宠 | $15 单 IP DLC，IP 联动收费 |

**判断：** 玩家会自发把游戏角色 Live2D / Spine / VRM 模型变成桌宠（最典型 ArkPets）。`desktop-pet` SDK 在 IP 端最自然的需求侧不是"我们做新桌宠"，而是"接管玩家社区已经在做的桌宠化，并把官方角色 / IP / 周边变现接进来"。

## 7. 类别 F：Tencent 内部能力栈（IEG 内部业务方必问）

| # | 能力 | 现状 | 与 desktop-pet 的关系 |
|---|---|---|---|
| 1 | Tencent GiiNex（自研游戏 AI 引擎） | 已在 GDC 2024 公开，提供 AIGC 2D / 3D / 故事 / NPC | 资产生成 / NPC 行为可作为桌宠 SDK 后端能力 |
| 2 | Tencent TRTC + GME / GMES | 实时通信 + 游戏多媒体 | 桌宠语音对话的低延迟管线复用对象 |
| 3 | Tencent Cloud ADP — Virtual NPC & Game Agent | 对外 toB AI NPC 平台 | 与 desktop-pet 是上下层还是平行关系，必须明确 |
| 4 | F.A.C.U.L. | FPS AI 队友研究 | 桌宠"AI 队友"形态的内部参考 |

**判断：** desktop-pet 在 IEG 内部启动时，无法绕过"为什么不直接用 GiiNex / TRTC / ADP"这个问题。建议 PM Strategy Thread 在 T-001 中显式回答"差异化 = 多游戏可配置 + 桌宠宿主层 + 玩家侧 IP 周边变现"，把 Tencent 内部能力定位成 backend，而不是竞品。

## 8. 直接结论：最值得对标的 5 个

| 排名 | 对标产品 | 类别 | 为什么是它 |
|---|---|---|---|
| 1 | Hearthstone King Krush | 游戏内永久伴侣 UI | 形态最近：单局生命周期 + 升级 + 皮肤 + 对局陪走，几乎是 desktop-pet SDK 在游戏内集成的"成品答案" |
| 2 | NVIDIA ACE / PUBG Ally | AI NPC SDK | 工业级 AI 队友落地参考，特别是 on-device 推理 + 游戏深度集成 |
| 3 | Inworld AI | AI NPC SDK | 性格 + 记忆 + 情感引擎方法论 + 多端 SDK 已成熟，是 desktop-pet 不重复造轮子的对象 |
| 4 | Live2D Cubism SDK | 美术管线 | 600+ 商用产品 + 全引擎覆盖，桌宠 2D 美术管线事实标准 |
| 5 | Genshin Impact Paimon | 游戏内永久伴侣 UI | "桌宠就是 UI 本身"的最高商业范式，给桌宠 SDK 在游戏内的产品形态画了上限 |

## 9. 关键启发（对 desktop-pet）

| # | 启发 | 类型 |
|---|---|---|
| 1 | desktop-pet 的核心不是再做一个桌宠，而是做"桌宠宿主层 + 多游戏配置 + IP 衍生 + 美术管线适配"。AI 能力可大量借用现有 SDK | 推断 |
| 2 | 游戏内嵌伴侣最贴近的对标是 Hearthstone King Krush，不是 Bongo Cat。MVP 范式应往"对局生命周期 + 可升级 + 可解锁皮肤"上靠 | 推断 |
| 3 | Genshin Paimon 证明"桌宠 = UI 人格化"在商业上可行；这给桌宠 SDK 提供了上限：不只是浮窗，而是可以承担帮助 / 引导 / 邮件 / 菜单等功能 | 观点 |
| 4 | 玩家社区会自发把游戏角色做成桌宠（ArkPets 即是证据）；SDK 应该把官方角色 / IP / 模型库接管这块自发流量 | 推断 |
| 5 | Live2D + VRM 双轨美术管线是必经，不是可选 | 观点 |
| 6 | Tencent 内部已经有 GiiNex / TRTC / ADP / GMES / F.A.C.U.L.；desktop-pet 必须把自己定位成"宿主 + 多游戏配置层"，避免与内部能力栈正面冲突 | 推断 |
| 7 | NVIDIA ACE 在 PUBG / NARAKA / inZOI 的接入路径（按游戏类型给不同形态——队友 / 伴侣 / 敌人）给 desktop-pet 提供了"按游戏类型配桌宠"的实操参考 | 推断 |
| 8 | Discord Embedded App SDK 出现意味着"伴侣可能不只在游戏内"——桌宠 SDK 是否考虑跨宿主（游戏 + Discord 通话 + 直播浮层）需要决策 | 观点 |

## 10. 对前两份研究的修正

| 修正项 | 旧版结论 | 修正后 |
|---|---|---|
| Bongo Cat / Rusty / Tiny Pasture 等 Steam 桌宠是核心对标 | 把它们排在 Top 1–6 | 它们是"独立桌宠应用"参考；当用户场景是游戏内嵌时，应排到次要参考；最相关对标是 Hearthstone King Krush + NVIDIA ACE + Inworld + Live2D + Paimon |
| toC 桌宠流量与 toB SDK 不能直接画等号 | 仍然成立 | 加强：toC 桌宠流量 ≠ 游戏内嵌伴侣的 PMF；后者的 PMF 在 IP / 运营 / 玩家关系系统里 |

## 11. 风险

| # | 风险 | 缓解 |
|---|---|---|
| 1 | desktop-pet 与 Tencent 内部 GiiNex / TRTC / ADP 边界不清，容易被并轨 | 在 T-001 中明确"桌宠是宿主层 + 多游戏配置层"，不与 NPC AI 引擎正面竞争 |
| 2 | Inworld / Convai / NVIDIA ACE 这类对外 SDK 已经把"AI 角色"心智占住 | desktop-pet 应突出"桌面 / 游戏内双宿主 + 玩家侧 IP 衍生" |
| 3 | Hearthstone King Krush / Genshin Paimon 是单产品深度集成；SDK 形态做不到这种深度 | 早期接入选择 1–2 个内部游戏深度集成（不是泛 SDK），把"伴侣 = UI"做厚 |
| 4 | Live2D / VRM Publication License 商业条款可能影响商业化 | 法务在 T-001 阶段评估 License 成本，防止后期被动改资产管线 |

## 12. 推荐行动

| # | Action | Workspace | 优先级 |
|---|---|---|---|
| 1 | 把 Hearthstone King Krush 形态作为 desktop-pet MVP 第一候选范式（"对局陪走 + 升级 + 皮肤"） | `01-pm/` | P0 |
| 2 | 评估 desktop-pet 与 Tencent GiiNex / TRTC / ADP / GMES 的边界并提交决策提议 | `decisions/` + `01-pm/` | P0 |
| 3 | 评估 Inworld / Convai / NVIDIA ACE 是否作为 desktop-pet 后端 AI 能力候选 | `01-pm/` + `03-engineering/` | P1 |
| 4 | 美术管线确定支持 Live2D + VRM 至少一种作为最低门槛 | `02-design/` + `03-engineering/` | P1 |
| 5 | 与 IEG IP 部门沟通：能否把官方 IP 接管社区桌宠化（如 ArkPets 模式收编） | `01-pm/` | P1 |
| 6 | 评估 Discord Embedded App SDK 是否纳入跨宿主 P2 方案 | `04-research/` | P2 |
| 7 | 跟踪 NVIDIA ACE 在 PUBG / NARAKA 的实际玩家反馈（ACE 对玩家伴侣体验的影响） | `04-research/` | P2 |

## 13. Open Questions

| # | 问题 | Owner |
|---|---|---|
| 1 | desktop-pet 与 Tencent GiiNex / TRTC / ADP 的边界与依赖关系是什么？ | PM Strategy Thread + IEG 业务方 |
| 2 | MVP 是否优先做 Hearthstone King Krush 形态（单局生命周期），而不是 Bongo Cat 形态（持续输入反馈）？ | PM Strategy Thread + User |
| 3 | 美术管线是否同时支持 Live2D + VRM，还是先选其一？ | Design Prototype Thread + Engineering Build Thread |
| 4 | desktop-pet 是否纳入"接管玩家自发桌宠化"作为 IP 端价值主张？ | PM Strategy Thread + IP / 商业 BD |
| 5 | 是否在第一版即支持跨宿主（游戏内 + 桌面 + Discord 通话 + 直播浮层）？ | PM Strategy Thread |

## 14. 来源

| 来源 | 链接 |
|---|---|
| Inworld AI 官方 | https://inworld.ai/ |
| Inworld Unreal 插件 | https://www.unrealengine.com/marketplace/en-US/product/inworld-ai-characters-dialogue |
| Convai 官方 | https://convai.com/ |
| Convai Unity 接入文档 | https://convai.com/blog/add-ai-companions-unity-projects-convai-sdk |
| AI NPC Tools 综述（2025） | https://gamespublisher.com/ai-npc-tools-for-game-developers-2025/ |
| NVIDIA ACE for Games | https://developer.nvidia.com/ace-for-games |
| NVIDIA ACE in PUBG / NARAKA / inZOI | https://www.nvidia.com/en-us/geforce/news/nvidia-ace-autonomous-ai-companions-pubg-naraka-bladepoint/ |
| NVIDIA ACE inZOI / NARAKA Mobile 接入 | https://www.nvidia.com/en-us/geforce/news/nvidia-ace-naraka-bladepoint-inzoi-launch-this-month/ |
| Tencent Cloud ADP — AI Virtual NPC & Game Agent | https://adp.tencentcloud.com/solutions/game-virtual-npc |
| Tencent TRTC — From AI NPC to AI Game Companion | https://trtc.io/blog/details/in-game-ai-companion |
| Tencent GiiNex（GDC 2024 公开介绍） | https://www.tencent.com/en-us/articles/2202036.html |
| Tencent F.A.C.U.L. 介绍 | https://www.tencent.com/en-us/articles/2202068.html |
| Live2D Cubism SDK | https://www.live2d.com/en/sdk/about/ |
| Live2D × Cocos Creator | https://www.cocos.com/en/post/kAzLtV5mZox1c27qwqZHOeP30NCDSOYi |
| Live2D × Ren'Py | https://www.renpy.org/doc/html/live2d.html |
| Genshin Paimon Companion | https://genshin-impact.fandom.com/wiki/Paimon/Companion |
| Hearthstone King Krush（首个互动收集宠物） | https://news.blizzard.com/en-us/article/24216434/unleashing-king-krush-hearthstones-first-interactive-pet |
| Hearthstone Pets Wiki | https://hearthstone.wiki.gg/wiki/Pet |
| WoW Companion Wiki | https://wowpedia.fandom.com/wiki/Companion |
| FF14 Pets Wiki | https://ffxiv.consolegameswiki.com/wiki/Pets |
| Discord Embedded App SDK | https://support-dev.discord.com/hc/en-us/articles/21204423970071-Introducing-the-Embedded-App-SDK |
| Discord Game SDK 使用统计 | https://steamdb.info/tech/SDK/Discord/ |
| ArkPets（社区） | https://github.com/isHarryh/Ark-Pets |
| ArkPets 下载站 | https://arkpets.harryh.cn/downloads |
| AK-Buddy（社区第二实现） | https://github.com/bungaku-moe/AK-Buddy |
| PNGTuber Plus | https://kaiakairos.itch.io/pngtuber-plus |
