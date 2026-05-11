# 免费 / 开源桌宠扩展清单（PART）

> 与 `TREND_RESEARCH_steam-popular-desktop-pet-games.md` 同步阅读。本文专注“真正不用钱”的桌宠产品，按 4 个分发渠道整理：Steam 免费区、Steam base-free + 可选付费、itch.io 免费、GitHub 开源。
>
> 最后更新：2026-05-09
>
> 研究线程：AI Trend Radar Thread

## 1. 前提与口径

- “免费”定义：用户在常规分发渠道（Steam / itch.io / 官方站 / GitHub release）获得正式版本时无需付费；可选 DLC、可选 BYO API、可选打赏不算违反。
- 不收录盗版站、非官方“免费下载”聚合站。
- 数据为 2026-05-09 抓取快照，会有滞后。

## 2. 重要补正：Desktop Mate 主体是免费的

| 项目 | 旧版 TREND_RESEARCH 说法 | 修正 |
|---|---|---|
| Desktop Mate | 仅提到 Hatsune Miku DLC（app/3359730，$15） | 主体应用 [Desktop Mate](https://store.steampowered.com/app/3301060/Desktop_Mate/)（app/3301060）是免费的，自带默认角色 Aiel-tan；DLC 才是收费部分 |
| 体量 | 仅披露 DLC 上线峰值 6,230 | 主体 app 历史并发峰值 23,420（2025-01-12），近期日均活跃约 1,927；累计评论 5,023，整体好评率 59%，近 30 天 84% / 183 |
| 商业模式 | “主体免费 + 单 IP DLC” | 不变，但应突出“主体免费 + 多 IP DLC 持续上新”，本月已有 Kotonoha Sisters / Otomachi Una 等档期 |

## 3. 分类（A）Steam 完全免费且热门

| # | 产品 | Steam 链接 | 好评率 / 评论数 | 看点 | 备注 |
|---|---|---|---|---|---|
| 1 | Bongo Cat | [app/3419430](https://store.steampowered.com/app/3419430/Bongo_Cat/) | 96% / 25K+（部分快照 33K+） | 极轻常驻反馈、并发曾 >100K | 完全免费；皮肤可在社区市场买卖 |
| 2 | VPet-Simulator | [app/1920960](https://store.steampowered.com/app/1920960/VPetSimulator/) | 95% / 3,592（高快照 50,413 待核） | 开源（GitHub）+ Workshop + 中文桌宠社区基础盘 | 完全免费，2023-08-14 上线 |
| 3 | DPET: Desktop Pet Engine | [app/1980920](https://store.steampowered.com/app/1980920/DPET__Desktop_Pet_Engine/) | 71–75% / 1,259 | Workshop 1,000+ 物品，Shimeji 兼容 | Free, Early Access |
| 4 | Pocket Waifu: Desktop Pet | [app/2989820](https://store.steampowered.com/app/2989820/) | 1,555 / 1,659 ≈ 94% | 拟人 chibi，Aug 2024 上线 | F2P + 抽卡，差评集中在 RNG |
| 5 | Ai Vpet | [app/3029820](https://store.steampowered.com/app/3029820/Ai_Vpet/) | 75% / 397 | 接第三方 AI 服务（中国） | 隐私 / 合规需评估 |
| 6 | Desktop Mascot Engine | [app/821060](https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/) | 53% / 182（Mixed） | 老牌免费 mascot 工具 | 上次更新已 7 年，规划中的 AI 模块未交付 |

## 4. 分类（B）Steam 主体免费 + 可选付费

| # | 产品 | Steam 链接 | 主体免费？ | 付费部分 | 好评率 / 信号 |
|---|---|---|---|---|---|
| 1 | Desktop Mate | [app/3301060](https://store.steampowered.com/app/3301060/Desktop_Mate/) | 是，自带 Aiel-tan | 多 IP DLC（Hatsune Miku $15、Kotonoha Sisters、Otomachi Una 等持续上新） | 5,023 评论 59% / 近 30 天 84% / 183；并发峰值 23,420 |
| 2 | MateEngine | [app/3625270](https://store.steampowered.com/app/3625270/MateEngine/) | Steam 版 $3.99；GitHub 版完全免费 | 仅 Steam 版收费用于支持开发 | Steam 版 98% / 836（Overwhelmingly Positive），Player Score 98/100 |

## 5. 分类（C）itch.io 免费

| # | 产品 | 链接 | 类型 | 备注 |
|---|---|---|---|---|
| 1 | Desktop Goose（samperson） | [samperson.itch.io](https://samperson.itch.io/desktop-goose) | 桌面捣蛋鹅 | "Pay what you want"，下载数据点：~2.1M（多源汇总）；Windows / macOS |
| 2 | Shimeji App - Desktop Pet（vtuber studio） | [vtuber-studio-dev.itch.io](https://vtuber-studio-dev.itch.io/shimeji-app-desktop-pet) | Shimeji 集合桌宠 | 完全免费，主打多角色 + 低 CPU |
| 3 | Shijima（pixelomer） | [pixelomer.itch.io/shijima](https://pixelomer.itch.io/shijima) | Shimeji 加载器 | 跨 macOS / Linux / Windows，无需 Java，可直接读 zip / rar / 7z |
| 4 | desktop pets & virtual companions（alienmelon 收藏夹） | [itch.io/c/733669](https://itch.io/c/733669/desktop-pets-virtual-companions) | 集合页 | 桌面伴侣类型集合，可发现长尾免费作品 |

## 6. 分类（D）GitHub 开源（高质量、跨平台）

| # | 仓库 | 形态 | 平台 | 关键信号 |
|---|---|---|---|---|
| 1 | [shinyflvre/Mate-Engine](https://github.com/shinyflvre/Mate-Engine) | VRM 拟人桌宠 | Win（官方）+ [Linux 端口](https://github.com/Marksonthegamer/Mate-Engine-Linux-Port) | Desktop Mate 的开源平替，"GitHub 永远免费" |
| 2 | [LorisYounger/VPet](https://github.com/LorisYounger/VPet) | 养成桌宠 + WPF SDK | Win | 与 Steam 版同源，可被任意 WPF 应用嵌入 |
| 3 | [ayangweb/BongoCat](https://github.com/ayangweb/BongoCat) | 跨平台 Bongo Cat 风格反馈 | Win / macOS / Linux | 20.7K stars / 967 forks；Tauri 实现，无数据收集，离线运行 |
| 4 | [isHarryh/Ark-Pets](https://github.com/isHarryh/Ark-Pets) | 明日方舟角色桌宠 | Win | GPL3，支持 Live2D + Spine 模型，强 IP 周边氛围 |
| 5 | [bungaku-moe/AK-Buddy](https://github.com/bungaku-moe/AK-Buddy) | 明日方舟桌宠（另一实现） | Win | 与 Ark-Pets 形成竞品 |
| 6 | [ChaozhongLiu/DyberPet](https://github.com/ChaozhongLiu/DyberPet) | PySide6 桌宠框架 | Win | 适合做 AI 桌宠基底 |
| 7 | [WolfChen1996/DesktopPet](https://github.com/WolfChen1996/DesktopPet) | 配置化桌宠 | Win | "让每个人都能轻松制作桌宠" |
| 8 | [jihe520/Agentic-Desktop-Pet](https://github.com/jihe520/Agentic-Desktop-Pet) | LLM + 记忆 + 情感 + RPG（Godot） | Win | 主打 AI agent 桌宠 |
| 9 | [Adrianotiger/desktopPet](https://github.com/Adrianotiger/desktopPet) | eSheep 64bit 桌面伴侣 | Win | 经典老款，仍在维护 |
| 10 | GitHub topic [`desktop-pet`](https://github.com/topics/desktop-pet) | 长尾 | 多平台 | 多个 Python / Go / Rust 实现可借鉴 |

## 7. 体量 / 热度对比（按已知公开信号）

| # | 产品 | 平台 | 公开热度信号 | 解读 |
|---|---|---|---|---|
| 1 | Bongo Cat | Steam | 25K+ 评论 / 并发 >100K | 真·破圈量级 |
| 2 | Desktop Mate（base） | Steam | 5,023 评论 / 并发峰值 23K / 近 30 天 84% | IP 拟人 mascot 头部 |
| 3 | VPet-Simulator | Steam + GitHub | 3,592–50,413 评论 / 95–98% | 中文圈最大开源桌宠 |
| 4 | DPET | Steam | 1,259 评论 / 1,017+ Workshop 物品 | UGC 引擎头部 |
| 5 | Pocket Waifu | Steam | 1,659 评论 / 94% | F2P 拟人代表 |
| 6 | MateEngine（Steam） | Steam + GitHub | 836 评论 / 98% | 开源 + Steam 双轨 |
| 7 | ayangweb/BongoCat | GitHub | 20.7K stars / 967 forks | 真·开源破圈量级 |
| 8 | Ark-Pets | GitHub | 中文社区高活跃，Releases 多个版本，GPL3 | IP 周边玩家自治 |
| 9 | Desktop Goose | itch.io | ~2.1M 下载（多源汇总） | 病毒式经典款 |
| 10 | Desktop Mascot Engine | Steam | 182 评论 / 53% | 已掉队 |

## 8. 对 `desktop-pet` 的额外启发

| # | 启发 | 类型 |
|---|---|---|
| 1 | “Steam 免费 + GitHub 开源”双轨（MateEngine、VPet）正在变成 default 玩法：开源版用于社区 / 模组生态，Steam 版用于不会自己编译的玩家与小额支持。SDK 形态可以借鉴。 | 推断 |
| 2 | ayangweb/BongoCat 的 20K stars 说明“跨平台 + 隐私本地 + 离线”这套组合在桌宠场景里被开发者社区强烈认可，对 SDK 来说意味着隐私 / 离线能力是底层卖点。 | 观点 |
| 3 | Ark-Pets 的存在说明：玩家社区会自发把游戏角色做成桌宠，这是桌宠 SDK 在游戏 IP 端最自然的需求侧。SDK 应该让接入方“一键把现有角色 Live2D / Spine / VRM 投到桌面”。 | 推断 |
| 4 | Desktop Mate 主体免费 + 多 IP DLC 持续上新（每月节奏）说明 IP DLC 不是一次性收益，而是订阅式上新。`desktop-pet` SDK 在收益分账上应预留“每月新角色档期”概念。 | 推断 |
| 5 | Desktop Mascot Engine 7 年没更新仍在 Steam 上保持 53% 评分，说明老款桌宠用户的迁移成本不低，新产品需要在“迁移现有角色资产”这件事上做工程友好。 | 观点 |
| 6 | itch.io 的 Shijima / Shimeji App 等说明 macOS / Linux 桌宠仍在被需求，跨平台是非次要项。 | 观点 |

## 9. 风险提示

| # | 风险 | 证据 | 缓解 |
|---|---|---|---|
| 1 | “免费下载”聚合站（SteamRIP / Gamdie / SteamGG / apunkagames 等）是盗版站，常带捆绑恶意软件 | 多源出现 Tiny Pasture / Desktop Goose 的盗版镜像 | 文档中只引用官方分发链接；用户问询时直接拒绝指路 |
| 2 | Ai Vpet 等 AI 桌宠的“免费”意味着把 LLM 成本和隐私转嫁给用户 | Steam 页面已经强制标注"connects to 3rd-party AI" | 任何免费 AI 桌宠都要看清模型来源、数据走向、是否本地推理 |
| 3 | itch.io 桌宠普遍未签名，部分会被杀软误报 | Desktop Goose 自身就有此问题 | 仅从官方 itch.io / GitHub release 下载，校验签名 |
| 4 | 部分开源桌宠停更（DyberPet / 老 eSheep 等节奏较慢） | 仓库提交频率 | 评估时看近 6 个月提交 + issue 响应 |

## 10. 推荐行动

| # | Action | Workspace | 优先级 | 输入 |
|---|---|---|---|---|
| 1 | 把 Desktop Mate 主体免费 + 多 IP DLC 写回主 TREND_RESEARCH 修正项 | `04-research/` | P1 | 本文第 2 节 |
| 2 | 评估 “Steam 免费 + GitHub 开源”双轨在 SDK 商业化上的可行性 | `01-pm/` | P1 | 本文第 8 节 #1 |
| 3 | 把 ayangweb/BongoCat、Ark-Pets、MateEngine 列入工程预研“可能的依赖 / 学习对象” | `03-engineering/` | P1 | 本文第 6 节 |
| 4 | 把 Live2D / Spine / VRM 三种角色资产格式作为 SDK 资产管线候选 | `02-design/` + `03-engineering/` | P1 | 本文第 8 节 #3 |
| 5 | 跟踪 Desktop Mate 月度 IP DLC 档期作为商业模式参照 | `04-research/` | P2 | 本文第 4 节 |

## 11. Open Questions（新增）

| # | 问题 | Owner |
|---|---|---|
| 1 | `desktop-pet` SDK 是否走 “Steam 免费 + GitHub 开源 + 内部分发”三轨，还是仅内部分发？ | PM Strategy Thread + User |
| 2 | 是否在 SDK 第一版即支持 Live2D / Spine / VRM 至少一种格式作为最低门槛？ | Engineering Build Thread |
| 3 | 是否将 macOS / Linux 视为 P0 平台（iTunes 桌宠、itch.io 长尾用户）？ | PM Strategy Thread + Engineering Build Thread |

## 12. 来源（本 PART 新增）

| 来源 | 链接 |
|---|---|
| Desktop Mate base app | https://store.steampowered.com/app/3301060/Desktop_Mate/ |
| MateEngine Steam | https://store.steampowered.com/app/3625270/MateEngine/ |
| MateEngine GitHub | https://github.com/shinyflvre/Mate-Engine |
| MateEngine Linux 端口 | https://github.com/Marksonthegamer/Mate-Engine-Linux-Port |
| Desktop Goose（samperson） | https://samperson.itch.io/desktop-goose |
| Shimeji App（vtuber studio） | https://vtuber-studio-dev.itch.io/shimeji-app-desktop-pet |
| Shijima（pixelomer） | https://pixelomer.itch.io/shijima |
| ayangweb/BongoCat | https://github.com/ayangweb/BongoCat |
| isHarryh/Ark-Pets | https://github.com/isHarryh/Ark-Pets |
| bungaku-moe/AK-Buddy | https://github.com/bungaku-moe/AK-Buddy |
| ChaozhongLiu/DyberPet | https://github.com/ChaozhongLiu/DyberPet |
| WolfChen1996/DesktopPet | https://github.com/WolfChen1996/DesktopPet |
| jihe520/Agentic-Desktop-Pet | https://github.com/jihe520/Agentic-Desktop-Pet |
| Adrianotiger/desktopPet | https://github.com/Adrianotiger/desktopPet |
| Desktop Mascot Engine | https://store.steampowered.com/app/821060/Desktop_Mascot_Engine/ |
| Pawoki: Desktop Pets（参考但非免费） | https://store.steampowered.com/app/3995000/Pawoki_Desktop_Pets/ |
| GitHub topic desktop-pet | https://github.com/topics/desktop-pet |
| HelloGitHub: ayangweb/BongoCat | https://hellogithub.com/en/repository/ayangweb/BongoCat |
| HelloGitHub: shinyflvre/Mate-Engine | https://hellogithub.com/en/repository/shinyflvre/Mate-Engine |
