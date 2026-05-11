# Radar 同步：游戏内嵌伴侣 / 桌宠 SDK 对标

- 日期：2026-05-09
- 线程：AI Trend Radar Thread
- Topic Slug：`in-game-embedded-companion-references`

## 关键修正

之前两份调研把研究范围设在"独立桌宠应用"（Bongo Cat / Rusty / Desktop Mate / VPet 等）。用户澄清：实际场景是"在现有游戏里内嵌桌宠"。这把研究框架重置：

- **独立桌宠应用** 只是次要参考。
- 最直接的对标是：游戏内 AI NPC SDK / Middleware（Inworld / Convai / NVIDIA ACE）+ 游戏内永久伴侣 UI（Hearthstone King Krush / Genshin Paimon）+ 美术管线（Live2D / VRM）+ 玩家自发桌宠化（ArkPets）+ Tencent 内部能力栈（GiiNex / TRTC / ADP / GMES）。

## 做了什么

- 重新挖掘了 6 类对标：A. AI NPC / 伴侣 SDK，B. 游戏内永久伴侣 UI，C. 美术管线 SDK，D. Discord / Streamer 生态，E. 官方游戏 → 玩家自发桌宠化，F. Tencent 内部能力栈。
- 给出 Top 5 最值得对标产品：Hearthstone King Krush、NVIDIA ACE / PUBG Ally、Inworld AI、Live2D Cubism SDK、Genshin Paimon。
- 写了 8 条对 desktop-pet 的关键启发、4 条风险、7 条推荐行动、5 条 Open Questions。

## 修改的文件

- 新建：`projects/desktop-pet/04-research/TREND_RESEARCH_PART_in-game-embedded-companion-references.md`
- 新建：`projects/desktop-pet/06-sync/group/2026-05-09T_radar_in-game-embedded-companion-references.md`（本文件）

## 没有改的范围

- 主 `TREND_RESEARCH_steam-popular-desktop-pet-games.md` 与免费扩展 PART：未改，但本 PART 第 10 节已对其结论做出范围修正。
- `00-context/` `01-pm/` `02-design/` `03-engineering/` `05-reviews/` `decisions/`：未触碰。
- `06-sync/SYNC_SUMMARY.md` `THREAD_REGISTRY.md` `TASK_BOARD.md`：未直接修改，建议 Main Thread 在 Latest Decisions 增加一条本次范围修正摘要。
- `workspaces/` `memory/` `~/.codex/` `~/.agents/skills/`：未修改。

## 关键发现速读

- **Hearthstone King Krush 是最相关对标**：单局生命周期 + 升级 + 皮肤 + 对局陪走 + 结算页伴随，几乎是 desktop-pet 在游戏内集成的"成品答案"。
- **NVIDIA ACE 已落地 PUBG / NARAKA / inZOI / MIR5 等多款 AAA / 大型游戏**；"AI 队友 / 伴侣 / 敌人"按游戏类型分配的接入模式可参考。
- **Inworld AI / Convai / Charisma.ai** 把"性格 + 记忆 + 情感"做成 SDK 能力，desktop-pet 不必重新造轮子。
- **Live2D + VRM** 是桌宠美术管线事实标准（Live2D 600+ 商用产品，VRM 是 3D 桌宠通用格式）。
- **Genshin Paimon 是上限范例**："桌宠就是 UI 本身"——从导航到菜单到邮件签名都让 Paimon 承载。
- **ArkPets 模式**：玩家社区会自发把游戏角色做成桌宠，SDK 应该接管这部分自发流量。
- **Tencent 内部已有 GiiNex / TRTC / ADP / GMES / F.A.C.U.L.**；desktop-pet 必须显式回答"为什么不直接用内部能力"——建议把内部能力定位成 backend，desktop-pet 是宿主层 + 多游戏配置层。

## 数据冲突 / 待核

- ArkPets 是社区项目（GPL3，个人 isHarryh），不是 Hypergryph 官方；本 PART 已注明。
- NVIDIA ACE 在 PUBG / NARAKA 的玩家反馈尚未规模采样，目前主要靠官方公告，需要持续跟踪。
- Tencent 内部能力栈的对外口径（GDC 公开材料）与对内实际可用度可能有差异；建议 PM 通过内部业务线核实。

## 下一步建议

- PM Strategy Thread：把 Hearthstone King Krush 形态作为 MVP 第一候选范式；把 desktop-pet 与 Tencent GiiNex / TRTC / ADP / GMES 的边界写进 T-001。
- Engineering Build Thread：评估 Inworld / Convai / NVIDIA ACE 作为 backend 候选；评估 Live2D + VRM 双轨美术管线工程成本。
- Design Prototype Thread：评估"桌宠 = UI 人格化"（Paimon 范式）作为产品形态上限。
- IEG 业务沟通：与 IP 部门讨论"接管玩家自发桌宠化"作为 IP 端价值主张。
- Trend Radar Thread：跟踪 NVIDIA ACE 在 PUBG / NARAKA / inZOI 的玩家反馈；跟踪 Tencent GiiNex 公开能力进展。
- Main Thread：在 SYNC_SUMMARY Latest Decisions 增加一条 2026-05-09 的范围修正摘要。

## 风险 / 待确认

- 之前两份调研的"Steam 桌宠流量结论"在新场景下应降级为次要参考；新场景的 PMF 在 IP / 运营 / 玩家关系系统里。
- Live2D / VRM 商业 License 条款需要法务在 T-001 阶段评估，避免后期被动改资产管线。
- desktop-pet 与 Tencent 内部能力栈的边界不清是 P0 风险，建议优先解决。
