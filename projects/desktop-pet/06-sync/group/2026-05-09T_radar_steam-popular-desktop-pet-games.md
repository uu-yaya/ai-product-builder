# Radar 同步：Steam 桌宠类流行游戏调研

- 日期：2026-05-09
- 线程：AI Trend Radar Thread
- Topic Slug：`steam-popular-desktop-pet-games`

## 做了什么

- 围绕“Steam 上类似 Bongo Cat 的桌宠类流行游戏”做了一次专题趋势调研。
- 联网核验了 18 款 Steam 上的桌宠 / 桌面 idle / Shimeji / AI 桌宠产品，区分了 6 个品类（极轻常驻反馈、屏幕底栏 idle、IP 拟人 mascot、Shimeji / 引擎、AI 桌宠、桌宠 + 生产力）。
- 输出了流行度证据矩阵、商业模式对比、AI 角色判断、对 `desktop-pet` 的 8 条产品启发、5 条机会假设、5 条风险、7 条推荐行动、6 条 Open Questions。

## 修改的文件

- 新建：`projects/desktop-pet/04-research/TREND_RESEARCH_steam-popular-desktop-pet-games.md`
- 新建：`projects/desktop-pet/06-sync/group/2026-05-09T_radar_steam-popular-desktop-pet-games.md`（本文件）

## 没有改的范围

- `00-context/`、`01-pm/`、`02-design/`、`03-engineering/`、`05-reviews/`、`decisions/`：未触碰。
- `06-sync/SYNC_SUMMARY.md` / `THREAD_REGISTRY.md` / `TASK_BOARD.md`：未直接修改，建议 Main Thread 在 SYNC_SUMMARY 加一条 2026-05-09 的 Radar 摘要。
- `workspaces/`、`memory/`、`~/.codex/`、`~/.agents/skills/`：未修改。
- `04-research/` 下其他既有产物（陪伴类桌宠产品调研、桌宠功能总结、记忆系统调研等）：未修改。

## 关键发现速读

- Steam 上桌宠类的真正高流量产品几乎都不是 AI 桌宠：Bongo Cat（96% / 25K+ 评论、并发曾 >100K）、Rusty's Retirement（97% / 6K+；销量 550K@2025-07）、Tiny Pasture、Ropuka's Idle Island、Desktop Mate。
- AI 桌宠（Ai Vpet、AI Desktop Pet、AI Desk Pet）当前评论量级与好评率均显著低于非 AI 桌宠，AI 在该品类里更像“放大器”而非“入口”。
- 商业模式分化清晰：免费 + 帽子皮肤（Bongo Cat）/ 一次性买断 $4–$10（Rusty / Ropuka / Bao Bao / Tiny Pasture）/ 主体免费 + 单 IP DLC（Desktop Mate）/ F2P + 抽卡（Pocket Waifu，差评集中）/ F2P → 转付费（Weyrdlets）/ 免费 + 开源 + Workshop（VPet / DPET）。
- Bongo Cat 开发商公开承认游戏本身亏损（月营收 $2,800–$4,050），主要价值是“工作室名片”，这给 `desktop-pet` 的“内部分发名片 demo”路线提供了类比。
- 桌宠玩家对 quiet hours / hide on fullscreen / 一键退出的诉求在评论里反复出现，应作为 SDK 默认能力而非可选项。

## 数据冲突 / 待核

- VPet-Simulator 真实评论体量（3,592 vs 50,413）需要二次核验。
- Bongo Cat 同时在线名次在 Top 4 / 12 / 15 间存在不同时点快照。
- Bobo Bay 真实 Steam app id 待核。
- Tiny Pasture 多语言评论数与总评论数之间存在口径差异。

## 下一步建议

- PM Strategy Thread：把 4 条候选 MVP 路线（Bongo Cat / Rusty / Desktop Mate / SDK）作为 T-001 输入；把“低打扰机制”列为 PRD 必需项。
- Design Prototype Thread：把屏幕底栏 / Dock 锚点 UI 范式与 Shimeji 资产兼容性作为设计预研。
- Engineering Build Thread：评估桌宠在游戏全屏 / 反作弊环境下的兼容性边界。
- Trend Radar Thread：后续跟踪 Bobo Bay、Desktop Mate 新 DLC、AI 桌宠头部产品的口碑变化。
- Main Thread：在 SYNC_SUMMARY Latest Decisions 增加一条本次 Radar 摘要。

## 风险 / 待确认

- 本调研基于公开信息抓取的快照，部分评论数 / 并发峰值会随时间变化；任何决策应在引用前重新核验。
- toC 桌宠流量与 toB SDK 价值不能直接画等号，结论中所有“SDK 借鉴”均为推测，需要 PM 在 T-001 收口。
