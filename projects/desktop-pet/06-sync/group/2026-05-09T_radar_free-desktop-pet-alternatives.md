# Radar 同步：免费 / 开源桌宠扩展清单

- 日期：2026-05-09
- 线程：AI Trend Radar Thread
- Topic Slug：`free-desktop-pet-alternatives`

## 做了什么

- 沿着上一份 `TREND_RESEARCH_steam-popular-desktop-pet-games.md` 做了一次"免费 / 开源"专项扩展。
- 覆盖 4 类分发渠道：Steam 免费区、Steam 主体免费 + 可选付费、itch.io 免费、GitHub 开源。
- 重要修正：Desktop Mate 主体应用（app/3301060）在 Steam 上是免费的，自带默认角色 Aiel-tan；之前的主 TREND_RESEARCH 只标了 DLC，需在主文件第 5 节做一次小补丁。

## 修改的文件

- 新建：`projects/desktop-pet/04-research/TREND_RESEARCH_PART_free-desktop-pet-alternatives.md`
- 新建：`projects/desktop-pet/06-sync/group/2026-05-09T_radar_free-desktop-pet-alternatives.md`（本文件）

## 没有改的范围

- 主 `TREND_RESEARCH_steam-popular-desktop-pet-games.md`：未改，但 PART 文件第 2 节列出了"主文件需要打补丁的 1 处"，建议下次 Radar 任务或 Main Thread 决定修补节奏。
- `00-context/`、`01-pm/`、`02-design/`、`03-engineering/`、`05-reviews/`、`decisions/`：未触碰。
- `06-sync/SYNC_SUMMARY.md` / `THREAD_REGISTRY.md` / `TASK_BOARD.md`：未直接修改，建议 Main Thread 在 Latest Decisions 增加一条本次扩展的引用。
- `workspaces/`、`memory/`、`~/.codex/`、`~/.agents/skills/`：未修改。

## 关键发现速读

- Steam 完全免费且热门：Bongo Cat（25K+ 评论 / 并发 >100K）、VPet-Simulator（开源 + Workshop）、DPET、Pocket Waifu、Ai Vpet、Desktop Mascot Engine。
- Steam 主体免费 + 可选付费：Desktop Mate（base app/3301060 免费）、MateEngine（Steam $3.99 / GitHub 永久免费）。
- itch.io 免费经典：Desktop Goose（~2.1M 下载）、Shimeji App by vtuber studio、Shijima（无需 Java 的跨平台 shimeji 加载器）。
- GitHub 开源高热度：ayangweb/BongoCat（20.7K stars，Tauri 跨平台）、Ark-Pets（明日方舟桌宠，GPL3）、shinyflvre/Mate-Engine（VRM 拟人桌宠，Steam 双轨）、LorisYounger/VPet。
- 双轨模式（Steam 免费 + GitHub 开源）正在成为桌宠产品的 default 玩法。

## 数据冲突 / 待核

- Desktop Mate 主体应用整体好评率仅 59%（5,023 评论），但近 30 天为 84% / 183 — 这反映了从 F2P 期评分震荡到现在的口碑修复，需要持续观察。
- VPet-Simulator 评论数（3,592 vs 50,413）冲突项与上一份文件一致，仍需 Steam 商店页二次核验。
- ayangweb/BongoCat 的 20.7K stars 与 Steam 上的 Bongo Cat（Irox Games）是两个不同产品，PART 文件已注明。

## 下一步建议

- PM Strategy Thread：把"Steam 免费 + GitHub 开源"双轨写进 T-001 的商业模式 Open Question；考虑把 Live2D / Spine / VRM 三种角色资产作为 SDK 资产管线候选。
- Engineering Build Thread：把 ayangweb/BongoCat、shinyflvre/Mate-Engine、isHarryh/Ark-Pets 列入预研"可能的依赖 / 学习对象"。
- Design Prototype Thread：评估 macOS / Linux 是否进入 P0 平台范围（itch.io / GitHub 跨平台桌宠用户基础）。
- Trend Radar Thread：跟踪 Desktop Mate 月度 IP DLC 档期作为商业模式参照；下次 Radar 任务建议同时把主 TREND_RESEARCH 第 5 节的 Desktop Mate 行做一次回写补丁。
- Main Thread：在 SYNC_SUMMARY Latest Decisions 增加一条 2026-05-09 的扩展摘要。

## 风险 / 待确认

- "免费下载"聚合站（SteamRIP / Gamdie / SteamGG / apunkagames 等）属盗版，常带捆绑恶意软件；本调研明确不引用、不指路。
- Ai Vpet / 部分 AI 桌宠的"免费"是把 LLM 成本和隐私转嫁给用户，需要在 PRD 里明确告知边界。
- itch.io 桌宠多未签名，部分会被杀软误报；引用与下载请走官方页面。
