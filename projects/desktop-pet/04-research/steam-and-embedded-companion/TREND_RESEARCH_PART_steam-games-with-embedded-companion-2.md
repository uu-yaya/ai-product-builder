# Steam 游戏内嵌伴侣对标清单 PART 2（驯养 / 二游 / Pokemon-like / RPG 队友 / Mascot 物管）

> 续 `TREND_RESEARCH_PART_steam-games-with-embedded-companion.md`。前 1 份按 3 个 Tier 给了 NVIDIA ACE 阵营 + 经典收集宠物 + UI mascot 三类；本份补 4 个 Tier：驯养育成大作、二次元 RPG / 手游 PC 版、Pokemon-like 怪物收集、RPG 队友 + Mascot 物管。
>
> 最后更新：2026-05-09
>
> 研究线程：AI Trend Radar Thread

## 1. Tier 4：驯养 / 育成大世界（捕捉 + 命名 + 战斗 + 携带 + 工作 + 配种）

| # | 游戏（Steam） | 伴侣 / 系统 | 关键机制 | 体量信号 |
|---|---|---|---|---|
| 1 | [Palworld](https://store.steampowered.com/app/1623730/Palworld/) | **Pals**（捕捉 → 战斗 / 劳动 / 配种 / 骑乘） | "Pokemon + 生存 + 工厂"；一只 Pal 既能打架也能拉砖 | **首周 Steam 8M 销量**；Steam 历史并发第二（仅次于 PUBG），把 CS2 甩开 30 万 |
| 2 | [ARK: Survival Evolved](https://store.steampowered.com/app/346110/ARK_Survival_Evolved/) / Survival Ascended | 恐龙驯养 | 知识值 / 喂食偏好 / 击晕驯化 / 指令 / 命名 / 携带 / 骑乘 | 长青沙盒驯养工业范式 |
| 3 | [Slime Rancher 2](https://store.steampowered.com/app/1657630/Slime_Rancher_2/) | 史莱姆牧场 | 抓 → 喂 → 收 plort → 拓展牧场 | **94% / 22,993 评论**；前作累计 1500+ 万玩家 |

**判断（Tier 4 给 desktop-pet 的启发）：**
- Palworld 证明"伴侣不只是陪伴，更是工具 / 劳动力 / 生产力"——desktop-pet SDK 应该考虑让伴侣承担**任务执行**职责（不只是聊天），这一点和 PUBG Ally 的"AI 队友"逻辑一致。
- ARK 的"喂食偏好 + 击晕 / 友好双路径"是驯养系统的工业级范式。SDK 想做"多接入方共用伴侣机制"必须把驯养 / 信任 / 关系数值标准化。
- Slime Rancher 2 的"低暴力 + 持续养成 + 不会失败"路线是**最安全的桌宠 MVP 方向**——没有挑战，只有积累。

## 2. Tier 5：Pokemon-like 怪物收集（Steam 上活跃的非 IP Pokemon）

| # | 游戏（Steam） | 形态 | 看点 |
|---|---|---|---|
| 1 | Cassette Beasts | 怪物融合 | 任意两怪可融合成新形态，SDK 视角的"伴侣资产可组合" |
| 2 | Temtem | MMO 怪物收集 | 把 Pokemon 单机做成 MMO 多人 + 6 个浮岛区域 |
| 3 | Coromon | GBA-era Pokemon 致敬 | 像素 + 体力值战斗 + 经典养成 |
| 4 | Moonstone Island | 怪物收集 + cozy 生活 | "Pokemon + Stardew" 双系统 |
| 5 | Monster Sanctuary / Nexomon: Extinction | Pokemon-like 老牌 | 评分稳定，长尾热度 |
| 6 | Miscrits: World of Creatures | F2P 怪物收集 | 2025-05-25 上架，全内容免费可玩 |

**判断：** 这一组对 desktop-pet 的相关度中等，但**怪物融合 / 多怪同时上场 / 怪物养成数值** 的 SDK 化是值得借鉴的。如果 desktop-pet 要支持"接入方提交自家角色当桌宠"，融合 / 进化 / 形态变化是用户预期的标准能力。

## 3. Tier 6：二次元 RPG / 手游 PC 版（Paimon 模式在 Steam 的复刻）

| # | 游戏（Steam） | 伴侣 / Mascot | 看点 |
|---|---|---|---|
| 1 | [Wuthering Waves](https://steamcommunity.com/app/3513350)（Steam app/3513350，库洛游戏） | **Resonator + Companion Stories** | 类 Paimon 的角色伴侣 + 每个 Resonator 有专属 Companion Story 任务，扩展角色叙事；与原神不在 Steam 形成对照（Steam 二游赛道在 2025-2026 显著扩张） |
| 2 | Reverse: 1999（Steam） | 多角色卡池 + 角色档案 | 二游叙事驱动伴侣的另一类 |
| 3 | Snowbreak: Containment Zone（Steam） | 拟人角色 + 基地养成 | 把"养角色"和"基地伴侣"耦合 |

**判断：** 二次元手游 PC 版正在大规模登陆 Steam，给 desktop-pet 提供了重要信号：**玩家在 Steam 上同样接受 gacha + 角色伴侣 + Paimon 式导览** 的范式；如果 desktop-pet 走 IP DLC 路线（参考 Desktop Mate），二游 IP 是最可能的合作对象池。

## 4. Tier 7：RPG 队友 / "伴侣 = 系统旁白" 形态

| # | 游戏（Steam） | 伴侣 / 形态 | 看点 |
|---|---|---|---|
| 1 | [Baldur's Gate 3](https://store.steampowered.com/app/1086940/Baldurs_Gate_3/) | 多 party 队友 + 关系 + 对话 | 玩家社区已经在做 AI 队友 mod（"AI Friends"、"Total AI Control - Fully AI Companion v2"），证明"AI 接管队友"是玩家自发需求，desktop-pet 切入 RPG 接入方时可以借这个信号 |
| 2 | Disco Elysium | **24 个 skill voices**（内心声音作为伴侣） | "伴侣 = 系统旁白"的极致形态——伴侣不是一个角色，而是 24 个不同性格的内心声音，根据玩家加点决定哪些更主动；给 desktop-pet "多伴侣分工" 的产品形态提供了非常另类的范式 |
| 3 | Hades / Hades II | 希腊众神 boon 选择器 | 神祇通过对话给玩家加 buff，是"伴侣 = 元玩法系统" 的代表 |

**判断：** Tier 7 是 Tier 3（Persona Morgana / Borderlands Claptrap）的进阶——不仅伴侣即 UI，**伴侣承担系统决策 / 旁白 / 加 buff 等元玩法职责**。Disco Elysium 的 skill voices 是 desktop-pet 长期路线最值得研究的形态：让多个伴侣分工承担"提醒 / 怀疑 / 鼓励 / 怀旧" 等不同声音。

## 5. Tier 8：Mascot 物管 / 模拟经营（伴侣 = 任务派发器）

| # | 游戏（Steam） | Mascot | 看点 |
|---|---|---|---|
| 1 | [Disney Dreamlight Valley](https://store.steampowered.com/app/1401590/Disney_Dreamlight_Valley/) | Disney / Pixar IP 角色作为 NPC 伴侣 | 全 IP 阵容做"角色 = 任务发布器 + 友好度 + 商店"——是"游戏内嵌 IP 桌宠 + 单角色任务 + 上新节奏"的代表 |
| 2 | [Two Point Hospital](https://store.steampowered.com/app/535930/Two_Point_Hospital/) / Two Point Campus | DJ + 院长助理 + 各类 mascot | Mascot 是物管形态：定期播报、提醒、剧情吐槽 |
| 3 | The Sims 4（Steam） | 宠物 / NPC | 经典生活模拟，Cats & Dogs DLC |

**判断：** Tier 8 给 desktop-pet 的启发是"伴侣 = 任务派发器 + 上新节奏"——Disney Dreamlight Valley 的成功证明：当伴侣是**游戏官方 IP 角色 + 持续上新 + 每个角色有独立任务线 + 友好度数值**，玩家会把它当核心系统而不是装饰。这与 Desktop Mate 的"多 IP DLC 月度上新" 商业模式完全同构。

## 6. 跨 Tier 横向对比（Steam-only 真·完整版 Top 15）

| 排名 | 游戏 | Tier | 对 desktop-pet 的关键启发 |
|---|---|---|---|
| 1 | Palworld | 4 驯养 | 伴侣是工具 / 劳动力 / 战斗 / 骑乘多用途；Steam 历史并发第二 |
| 2 | inZOI（前一份覆盖） | 1 AI | NVIDIA ACE on-device + Smart Zoi 思绪可视化 |
| 3 | PUBG: BATTLEGROUNDS + Ally（前一份覆盖） | 1 AI | Co-Playable Character 路线，FPS 类伴侣范式 |
| 4 | Cult of the Lamb（前一份覆盖） | 2 收集 | 多 follower 社群养成，96% / 5.8 万 |
| 5 | Final Fantasy XIV Online（前一份覆盖） | 2 收集 | Minions 工业级 + Lord of Verminion 衍生 |
| 6 | Baldur's Gate 3 | 6 RPG 队友 | 玩家自发做 AI 队友 mod，"AI 接管队友" 是真实需求 |
| 7 | Stardew Valley（前一份覆盖） | 2 收集 | Pet Bowl + 友好度可下降 + 自动送礼最简公式 |
| 8 | ARK: Survival Evolved / Ascended | 4 驯养 | 喂食偏好 + 击晕 / 友好双驯化路径，工业范式 |
| 9 | Persona 5 Royal / 3 Reload（前一份覆盖） | 3 UI mascot | Morgana / Teddie / Koromaru / Aigis = 菜单 + 提示 + 战斗多职责 |
| 10 | Wuthering Waves | 5 二游 | Paimon 式 Resonator + Companion Stories，二游赛道 Steam 化 |
| 11 | Slime Rancher 2 | 4 驯养 | 94% / 22,993，cozy 育成的最稳路线 |
| 12 | Disney Dreamlight Valley | 8 物管 | IP 角色 + 任务发布 + 友好度 + 持续上新 |
| 13 | Disco Elysium | 7 旁白 | 24 个 skill voices = "多伴侣分工内心声音" 的极致 |
| 14 | Subnautica（前一份覆盖） | 2 收集 | Cuddlefish 抚摸 + 跟随 / 停留指令 |
| 15 | Borderlands 3 / Wonderlands（前一份覆盖） | 3 UI mascot | Claptrap = 全程吉祥物 + 任务发布 + 嘴炮陪伴 |

## 7. 启发汇总（叠加前一份）

| # | 启发 | 类型 |
|---|---|---|
| 1 | **伴侣 ≠ 装饰**：Palworld / ARK 证明伴侣可以是工具 / 劳动力；Persona / Borderlands / Stray 证明伴侣可以是 UI；Disco Elysium 证明伴侣可以是系统旁白 — desktop-pet SDK 应该把"伴侣职责"做成可配置的多档：装饰 / 任务 / UI / 旁白 / 工具 | 推断 |
| 2 | **二次元 IP 接 Steam 是机会**：Wuthering Waves / Reverse:1999 / Snowbreak 等已经把 Paimon 模式的 IP 伴侣搬到 Steam，desktop-pet IP DLC 路线的合作池就在这里 | 推断 |
| 3 | **AI 队友是玩家自发需求**：BG3 玩家自己做 AI 队友 mod，证明 SDK 切入存量 RPG 接入方时不需要从零教育市场 | 观点 |
| 4 | **Disney Dreamlight Valley 给 IP DLC 的运营节奏更完整范本**：每个 IP 角色 = 一条任务线 + 一组友好度数值 + 一组商店物品；这比 Desktop Mate 的纯桌宠 IP DLC 更接近游戏内嵌的逻辑 | 推断 |
| 5 | **Slime Rancher 路线是"最安全的桌宠 MVP"**：低暴力 + 不会失败 + 持续积累 + 高粘性 + 94% 好评 — 给"无 AI 也能跑"的论证再加一个数据点 | 观点 |
| 6 | **Disco Elysium "skill voices" 是 desktop-pet 长期路线** — 让多个伴侣分工承担不同声音（提醒 / 鼓励 / 怀疑 / 怀旧），这比单一桌宠的天花板高得多 | 推断 |

## 8. 推荐行动（叠加前一份）

| # | Action | Workspace | 优先级 |
|---|---|---|---|
| 1 | 把"伴侣职责矩阵"（装饰 / 任务 / UI / 旁白 / 工具）整理成 SDK 可配置档位 | `01-pm/` + `02-design/` | P0 |
| 2 | 拆解 Disney Dreamlight Valley 的"IP 角色 = 任务线 + 友好度 + 商店"运营节奏，作为 IP DLC 路线的细化模板 | `01-pm/` | P1 |
| 3 | 评估 Wuthering Waves / Reverse:1999 / Snowbreak 等 Steam 二游作为 IP DLC 候选合作池 | `01-pm/` + 商业 BD | P1 |
| 4 | 跟踪 BG3 AI 队友 mod 的玩家反响，验证"SDK 切入存量 RPG 接入方"假设 | `04-research/` | P2 |
| 5 | 把 Disco Elysium skill voices 整理成 desktop-pet "多伴侣分工内心声音" 长期产品形态 R&D 输入 | `04-research/` | P2 |
| 6 | 把 Slime Rancher 路线的"低暴力 + 持续积累" 作为 MVP 默认情绪基调 | `02-design/` | P1 |

## 9. Open Questions（新增）

| # | 问题 | Owner |
|---|---|---|
| 1 | desktop-pet SDK 应该支持几种伴侣职责档位（装饰 / 任务 / UI / 旁白 / 工具），第一版必选哪几种？ | PM Strategy Thread |
| 2 | IP DLC 路线优先合作 Steam 二游（Wuthering Waves 类）还是 Tencent 自有 IP？ | PM Strategy Thread + IP / 商业 BD |
| 3 | 多伴侣同时存在时的 UI 优先级 / 显示策略（参考 Disco Elysium skill voices）需要在 MVP 还是后续版本支持？ | Design Prototype Thread |

## 10. 来源（本 PART 新增）

| 来源 | 链接 |
|---|---|
| Palworld Steam | https://store.steampowered.com/app/1623730/Palworld/ |
| Palworld 销量数据 | https://www.gamedeveloper.com/business/palworld-tops-5m-sales-after-shifting-86-000-copies-per-hour-over-the-weekend |
| ARK: Survival Evolved Steam | https://store.steampowered.com/app/346110/ARK_Survival_Evolved/ |
| ARK 驯养 Wiki | https://ark.wiki.gg/wiki/Taming |
| Slime Rancher 2 Steam | https://store.steampowered.com/app/1657630/Slime_Rancher_2/ |
| Wuthering Waves Steam Community | https://steamcommunity.com/app/3513350 |
| Wuthering Waves Companion Stories（GameRant） | https://gamerant.com/wuthering-waves-best-companion-story/ |
| Baldur's Gate 3 Steam | https://store.steampowered.com/app/1086940/Baldurs_Gate_3/ |
| BG3 AI Friends mod（Nexus） | https://www.nexusmods.com/baldursgate3/mods/705 |
| BG3 Total AI Control mod（Nexus） | https://www.nexusmods.com/baldursgate3/mods/15251 |
| Disney Dreamlight Valley Steam | https://store.steampowered.com/app/1401590/Disney_Dreamlight_Valley/ |
| Two Point Hospital Steam | https://store.steampowered.com/app/535930/Two_Point_Hospital/ |
| Steam Pokemon-like 综述（GameWhims） | https://gamewhims.com/2025/08/07/games-like-pokemon-on-steam/ |
| Steam Top 创建收集器 #1 综述 | https://www.notebookcheck.net/1-on-Steam-charts-This-creature-collector-is-free-to-play-and-boasts-97-positive-reviews.1024575.0.html |
