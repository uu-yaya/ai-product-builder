# Radar 同步：Steam 内嵌伴侣对标 PART 2

- 日期：2026-05-09
- 线程：AI Trend Radar Thread
- Topic Slug：`steam-games-with-embedded-companion-2`

## 做了什么

继续聚焦"Steam 上自身内嵌伴侣 / 宠物 / mascot 系统的游戏"。前一份覆盖了 NVIDIA ACE 阵营、经典收集宠物、UI mascot 三类。本份补 5 类：

- **Tier 4 驯养 / 育成大世界**：Palworld（首周 8M 销量、Steam 历史并发第二）/ ARK: Survival Evolved + Ascended / Slime Rancher 2（94% / 22,993）。
- **Tier 5 Pokemon-like 怪物收集**：Cassette Beasts（融合机制）/ Temtem（MMO Pokemon）/ Coromon / Moonstone Island / Monster Sanctuary / Nexomon / Miscrits（2025-05 F2P）。
- **Tier 6 二次元 RPG / 手游 PC 版**：Wuthering Waves（库洛游戏，app/3513350，类 Paimon Resonator + Companion Stories）/ Reverse: 1999 / Snowbreak: Containment Zone。
- **Tier 7 RPG 队友 / 伴侣即旁白**：Baldur's Gate 3（玩家社区自发做 AI 队友 mod）/ Disco Elysium（24 个 skill voices）/ Hades / Hades II（希腊众神 boon）。
- **Tier 8 Mascot 物管 / 模拟经营**：Disney Dreamlight Valley（IP 角色 = 任务线 + 友好度 + 商店）/ Two Point Hospital + Campus / The Sims 4。

跨两份合并 Top 15 名单已收口在 PART2 第 6 节。

## 修改的文件

- 新建：`projects/desktop-pet/04-research/TREND_RESEARCH_PART_steam-games-with-embedded-companion-2.md`
- 新建：`projects/desktop-pet/06-sync/group/2026-05-09T_radar_steam-games-with-embedded-companion-2.md`（本文件）

## 没有改的范围

- 主 TREND_RESEARCH 与之前 4 份 PART：未改。
- `00-context/` `01-pm/` `02-design/` `03-engineering/` `05-reviews/` `decisions/`：未触碰。
- `06-sync/SYNC_SUMMARY.md` `THREAD_REGISTRY.md` `TASK_BOARD.md`：未直接修改。
- `workspaces/` `memory/` `~/.codex/` `~/.agents/skills/`：未修改。

## 关键发现速读（叠加前一份）

- **伴侣 ≠ 装饰**：Steam 上不同 Tier 的成功对标证明伴侣可承担装饰 / 任务 / UI / 旁白 / 工具五种职责。SDK 应把"伴侣职责"做成可配置档位。
- **Palworld 给"伴侣是劳动力"** 这条产品路线提供了 Steam 历史并发第二级别的证据，把 Pokemon + 生存 + 工厂三个赛道融合成一只 Pal。
- **Disney Dreamlight Valley 给 IP DLC 提供了比 Desktop Mate 更完整的运营范本**：每个 IP 角色 = 任务线 + 友好度 + 商店 + 上新节奏。
- **二次元 IP 接 Steam 已成趋势**（Wuthering Waves / Reverse:1999 / Snowbreak），是 desktop-pet IP DLC 路线的最自然合作池。
- **BG3 玩家自发做 AI 队友 mod** 是 SDK 切入存量 RPG 接入方的需求侧信号，无需从零教育市场。
- **Disco Elysium 24 个 skill voices** 是"多伴侣分工内心声音"的天花板形态，长期 R&D 值得跟。

## 数据冲突 / 待核

- Wuthering Waves Steam app id 在不同来源中均显示 3513350，但商店页 URL 与 Steam Community URL 链路待二次核验。
- Palworld 销量数字主要来自 2024 上半年公开披露，2025–2026 的累计应再核。
- Miscrits 2025-05-25 上线 F2P 仅来自单源（综述类），仍需 Steam 商店页二次确认。

## 下一步建议

- PM Strategy Thread：把"伴侣职责矩阵"（装饰 / 任务 / UI / 旁白 / 工具）整理成 SDK 可配置档位；考虑以 Disney Dreamlight Valley 的 IP 运营节奏为 IP DLC 模板。
- Engineering Build Thread：评估 Palworld 式"伴侣是工具 / 劳动力" 的事件接入设计成本（伴侣需要参与游戏内任务执行而不只是聊天）。
- Design Prototype Thread：把 Slime Rancher 路线的"低暴力 + 持续积累"作为 MVP 默认情绪基调；把 Disco Elysium skill voices 列为长期 R&D 形态参考。
- Trend Radar Thread：跟踪 Wuthering Waves / Reverse:1999 / Snowbreak 等 Steam 二游 PC 版的角色 Companion 设计；跟踪 BG3 AI 队友 mod 玩家反响。
- Main Thread：在 SYNC_SUMMARY Latest Decisions 加一条 2026-05-09 的 PART2 摘要（已累计 4 份 Radar 文件）。

## 风险 / 待确认

- 二游 IP DLC 合作池涉及 IP 授权、与游戏本体定价 / 玩家心理冲突，需要 PM + 商业 BD 在 T-001 后期专门讨论。
- Palworld 风格"伴侣是工具" 路线在中国合规环境下涉及"驯化生物 / 战斗" 等内容评级问题，desktop-pet 走该路线时需法务审视。
- Disco Elysium skill voices 形态依赖优秀写作和角色设计，SDK 无法替代，仍需接入方自带文案能力。
