# Steam 桌宠类流行游戏调研

> 调研范围：Steam 平台上以 Bongo Cat 为代表的“桌面常驻 / 屏幕底栏 / 桌宠 / Shimeji 风格 / 桌面 idle”类作品。重点回答：哪些产品真的流行、流行的形态有哪些类型、对 `desktop-pet` 项目的可借鉴信号是什么。
>
> 最后更新：2026-05-09
>
> 研究线程：AI Trend Radar Thread
>
> 状态：本版已联网核验，所有评论数 / 价格 / 发行时间均带来源；冲突数据已在第 5 节标注。

## 1. 核心结论

| 类型 | 结论 |
|---|---|
| 事实 | Steam 上 2024Q2 至 2026Q1 出现明显的“桌面常驻 / 桌宠 / 屏幕底栏 idle”品类回潮：Rusty's Retirement、Bongo Cat、Tiny Pasture、Ropuka's Idle Island、Bao Bao's Cozy Laundromat、Desktop Mate 接连成为 Steam 热门，多家媒体把这一现象称为 "desktop pet renaissance"。 |
| 事实 | Bongo Cat 这类“极轻 + 免费 + 全键鼠输入触发”的桌面常驻物在 Steam 上能跑到 Top 10–15 同时在线榜，但作者明确表示游戏本身亏损，主要目的是把工作室名片打出去。 |
| 事实 | 桌宠在 Steam 上至少分 4 类：极轻常驻反馈型（Bongo Cat 系）、桌面 idle / farming（Rusty / Ropuka / Bao Bao / Tiny Pasture）、可定制 Shimeji / 引擎型（VPet-Simulator、DPET、Desktop Pet Project）、AI 桌宠 / 拟人 mascot（Ai Vpet、AI Desk Pet、Desktop Mate）。各自付费模式、生态形态、用户期待都不一样。 |
| 观点 | 真正能跑出量的桌宠不是“给 chatbot 套皮肤”，而是把“低打扰桌面存在 + 一个清晰的反馈闭环”做透：Bongo Cat 是输入反馈，Rusty 是种田收菜，Ropuka 是割草攒升级，Tiny Pasture 是养小动物，Desktop Mate 是 IP 共处，VPet 是养成。AI 是放大器，不是必需品。 |
| 推测 | 对 `desktop-pet`（多游戏可配置桌宠 SDK）来说，Steam 的桌宠流量主要是 toC 单产品现象，不会自动转译成 toB 多游戏 SDK 需求；但它给“桌面存在感、低打扰交互、反馈闭环、轻量 AI、付费 IP DLC”提供了大量可借鉴模式，PM Thread 在 T-001 中应判断 MVP 走单产品验证还是 SDK 验证。该判断属研究推测，需要 PM 在 AI 必要性评估时收口。 |

## 2. 研究问题

1. Steam 上当前最流行的桌宠类作品是哪几款？数据可信度如何？
2. 这些产品分别属于什么品类？商业模式、定价、评分、活跃度差异在哪？
3. AI 在这些产品中起什么作用？是必需品、放大器还是营销标签？
4. 对 `desktop-pet` 多游戏可配置桌宠 SDK 的产品定义、MVP 范围和差异化，有哪些可借鉴信号？

## 3. 来源策略

| 来源类型 | 用途 | 使用规则 |
|---|---|---|
| Steam 官方商店页 | 评价、价格、发行时间、开发商、DLC 结构 | 作为 Fact 主依据；SteamDB 用于交叉评论数和并发峰值 |
| SteamDB / steambase / wasdland | 评论数、并发峰值、发行历史 | 作为 Fact 二次校验；同一产品不同来源数据冲突时取偏低值 |
| PC Gamer / GamesRadar / GameSpot / The Gamer / Gamepressure / Pixelkin | 趋势盘点、销量披露、开发者访谈 | 媒体观点不当成事实；销量数字若来自开发者访谈需注明出处 |
| Wikipedia | 总销量、发行版本史 | 作为线索；如与一手来源冲突以一手为准 |
| 开发者访谈（PC Gamer、GameSpot 引用 Marcel Zurawka 等） | 营收、商业策略 | 标注为 Fact-with-source，但仅在该文中确认有效 |
| Steam Community / Reddit / itch.io | 玩家观感、模组生态 | 仅作 Opinion；不作产品事实 |

## 4. 来源清单

| 来源 | 链接 | 来源类型 | 可信度 | 备注 |
|---|---|---|---|---|
| Bongo Cat 商店页 | https://store.steampowered.com/app/3419430/Bongo_Cat/ | 官方 | 高 | 评价、免费、开发商 Irox Games |
| Bongo Cat SteamDB | https://steamdb.info/app/3419430/ | 第三方数据 | 中高 | 并发峰值与价格历史 |
| PC Gamer：Bongo Cat 多人模式 | https://www.pcgamer.com/games/life-sim/bongo-cat-still-one-of-the-biggest-games-on-steam-gets-even-bigger-with-multiplayer-you-can-now-have-up-to-100-cats-on-your-screen-at-once-all-of-them-happily-bapping-away-as-their-owners-type/ | 媒体 | 中高 | Top 12 同时在线 |
| GameSpot：Bongo Cat 不赚钱 | https://www.gamespot.com/articles/viral-steam-hit-bongo-cat-doesnt-actually-make-any-money/1100-6532777/ | 媒体 + 开发者访谈 | 中高 | 月营收 $4050 / $3800 / $2800 |
| GamesRadar：Bongo Cat 是营销工具 | https://www.gamesradar.com/games/simulation/steams-fourth-most-popular-game-isnt-really-a-game-at-all-but-its-doubling-as-a-marketing-tool-so-effective-its-devs-dont-mind-that-its-actually-losing-us-money/ | 媒体 | 中高 | Top 4 同时在线披露 |
| Rusty's Retirement 商店页 | https://store.steampowered.com/app/2666510/Rustys_Retirement/ | 官方 | 高 | 价格、评价 |
| Rusty's Retirement Wikipedia | https://en.wikipedia.org/wiki/Rusty's_Retirement | 词条 | 中 | 销量数字 100K 首周 / 550K（截至 2025-07） |
| Tiny Pasture 商店页 | https://store.steampowered.com/app/3167550/Tiny_Pasture/ | 官方 | 高 | 评价、多语言占比 |
| ScreenRant：Tiny Pasture | https://screenrant.com/tiny-pasture-desktop-animal-idler-launch/ | 媒体 | 中 | 现象级口碑 |
| Ropuka's Idle Island 商店页 | https://store.steampowered.com/app/3416070/Ropukas_Idle_Island/ | 官方 | 高 | 价格、评价 |
| GamesRadar：Ropuka 4 美元最佳投资 | https://www.gamesradar.com/games/simulation/this-cozy-farming-sim-is-just-a-sleepy-frog-that-idly-grinds-on-your-desktop-all-day-and-its-the-best-usd4-ive-spent-in-ages/ | 媒体 | 中 | 价格 + 体验侧描写 |
| Bao Bao's Cozy Laundromat 商店页 | https://store.steampowered.com/app/3194550/Bao_Baos_Cozy_Laundromat/ | 官方 | 高 | 评价、Twitch 集成 |
| Game8：Bao Bao 评测 | https://game8.co/articles/reviews/bao-baos-cozy-laundromat-review | 媒体 | 中 | 用户体验观点 |
| VPet-Simulator 商店页 | https://store.steampowered.com/app/1920960/VPetSimulator/ | 官方 | 高 | 免费、Workshop |
| VPet GitHub | https://github.com/LorisYounger/VPet | 一手仓库 | 高 | 开源、license、近期提交 |
| Ai Vpet 商店页 | https://store.steampowered.com/app/3029820/Ai_Vpet/ | 官方 | 高 | 第三方 AI 服务声明 |
| AI Desk Pet 商店页 | https://store.steampowered.com/app/4417720 | 官方 | 高 | 多模型可选 |
| AI Desktop Pet 商店页 | https://store.steampowered.com/app/4227700/AI_Desktop_Pet/ | 官方 | 高 | 本地 LLM、Workshop |
| Desktop Mate Hatsune Miku DLC | https://store.steampowered.com/app/3359730/Desktop_Mate__DLC/ | 官方 | 高 | $15、IP 联动 |
| PC Gamer：Desktop Mate 体验 | https://www.pcgamer.com/games/to-the-dismay-of-my-colleagues-i-paid-usd15-for-this-hatsune-miku-desktop-pet-so-you-dont-have-to/ | 媒体 | 中高 | 并发峰值、定价争议 |
| Pocket Waifu: Desktop Pet 商店页 | https://store.steampowered.com/app/2989820/ | 官方 | 高 | 免费、F2P 抽卡争议 |
| Weyrdlets 商店页 | https://store.steampowered.com/app/2366060/Weyrdlets__Idle_Desktop_Pets/ | 官方 | 高 | F2P→付费转型 |
| DPET 商店页 | https://store.steampowered.com/app/1980920/DPET__Desktop_Pet_Engine/ | 官方 | 高 | Free，Workshop |
| Desktop Pet Project 商店页 | https://store.steampowered.com/app/2618940/Desktop_Pet_Project/ | 官方 | 高 | Shimeji 启发 |
| Desktop Pet 商店页 | https://store.steampowered.com/app/2179690/Desktop_Pet/ | 官方 | 高 | 生活模拟桌宠 |
| Desktop Shimeji Pet / QPet | https://store.steampowered.com/app/1093890/Desktop_Shimeji_Pet/ | 官方 | 高 | 老牌 Shimeji 风格桌宠 |
| The Gamer：Steam 最佳桌宠盘点 | https://www.thegamer.com/steam-best-desktop-pets/ | 媒体盘点 | 中 | 选品参考 |
| PC Gamer：桌宠文艺复兴 | https://www.pcgamer.com/games/the-most-surprising-cozy-game-trend-this-year-was-the-desktop-pet-renaissance/ | 媒体趋势 | 中高 | 行业趋势叙事 |
| Gamepressure：Rusty 到 Tiny Pasture | https://www.gamepressure.com/newsroom/from-rustys-retirement-to-tiny-pasture-the-new-wave-of-desktop-bu/z679b4 | 媒体趋势 | 中 | 品类时间线 |
| Pixelkin：8 款桌面 idler | https://pixelkin.org/2025/06/06/8-best-desktop-idlers-like-rustys-retirement-to-sit-on-your-screen/ | 媒体盘点 | 中 | 选品参考 |
| HowToGeek：6 款桌面 idle | https://www.howtogeek.com/desktop-pets-idle-games-to-liven-up-your-desktop/ | 媒体盘点 | 中 | 选品参考 |

## 5. 流行度证据矩阵（按编号梳理）

> 评论数与好评率取自截至 2026-05-09 的搜索快照，可能存在与最新值的轻微滞后；冲突项见第 5.1 节。价格基于 Steam 商店页公开信息，未包含区域差价或限时折扣。Bongo Cat、VPet、Pocket Waifu 等“免费”作品的盈利方式见第 7 节。

| # | 产品 (Steam) | 类别 | 定价 | 好评率 / 评论数 | 已知峰值 / 体量信号 | 发行 / 状态 | 商业模式 |
|---|---|---|---|---|---|---|---|
| 1 | Bongo Cat (app/3419430) | 极轻常驻反馈型 / 输入触发动画 | 免费 | 96% / 25,479（部分快照已到约 33,500） | 同时在线一度冲到 Steam Top 4–15；峰值 >100,000；月活快照披露 >160,000 | 已发行，长期高活跃 | 免费 + 可交易帽子皮肤；月营收 $2,800–$4,050（开发者访谈） |
| 2 | Rusty's Retirement (app/2666510) | 屏幕底栏 idle 农场 | 付费（常打折，原价低于 $10 区间） | 97% / 6,447 | 累计销量 100,000（首周）→ 550,000（截至 2025-07） | 已发行 2024-04 | 一次性买断，DLC 装饰 |
| 3 | Tiny Pasture (app/3167550) | 桌面屏幕底栏宠物饲养 | 付费（参考 ~$5.39） | 93% / 1,136；近 30 天 89% / 84 | 上线即口碑爆发，曾在并发峰值上超过 Avowed | 已发行 2025-02-17 | 一次性买断 |
| 4 | Ropuka's Idle Island (app/3416070) | 桌面 idle 割草 / 装饰 | 付费（参考 ~$4） | 95% / 2,259 | 多家媒体盘点 + 玩家自述 100+ 小时挂机 | 已发行 2025-01 | 一次性买断 |
| 5 | Bao Bao's Cozy Laundromat (app/3194550) | 屏幕底栏 idle 商店模拟 | 付费 | 83% / 380 | 媒体盘点反复出现，Twitch 集成 | 已发行 2025（Q1） | 一次性买断 |
| 6 | VPet-Simulator (app/1920960) | 可定制桌宠 / Shimeji 风格 / 开源 | 免费 | 95% / 3,592（另一快照 98% / 50,413，需校验，见 5.1） | 长期高频更新 + Steam Workshop | 已发行 2023-08-14 | 免费 + 开源生态 |
| 7 | Ai Vpet (app/3029820) | AI 拟人桌宠 | 免费 | 75% / 397 | 中文圈讨论较多，Steam 明示连接第三方 AI 服务 | 已发行 | 免费 + 第三方 AI 服务（费用与隐私由用户承担） |
| 8 | AI Desktop Pet (app/4227700) | AI 桌宠 + 本地 LLM | 付费（折扣中） | 80% / 21（样本仍小） | 主打本地 LLM、不依赖 API key、Workshop | 已发行（较新） | 一次性买断 |
| 9 | AI Desk Pet (app/4417720) | AI 桌宠 + 多模型路由 | 付费 | 评论样本小，仅作信号 | 主打可选 Gemini / Claude 等 | 已发行（较新） | 一次性买断（接 BYO API） |
| 10 | Desktop Mate（含 Hatsune Miku DLC app/3359730） | IP 拟人 mascot / 桌面伴随 | 主体免费 + 单 IP DLC $15 | Hatsune Miku DLC 90% / 395；本体 89% / 295（上线快照） | 上线一周 1,600+ 好评；并发峰值 6,230 | 已发行 2025-01-07 | 免费 + IP DLC |
| 11 | Pocket Waifu: Desktop Pet (app/2989820) | 拟人 chibi 桌宠 | 免费 | 1,555 / 1,659 ≈ 94% | 评分 8.9/10 | 已发行 2024-08-13 | F2P + 内购 / 抽卡，玩家批评 RNG |
| 12 | Weyrdlets : Idle Desktop Pets (app/2366060) | 桌宠 + 番茄钟 / 待办 | 付费 ~5.51€（曾免费） | 75% / 274（转付费后评分被重置） | 媒体盘点常见，更新频繁 | 持续运营，2.0 改版 | 一次性买断（曾 F2P） |
| 13 | DPET : Desktop Pet Engine (app/1980920) | Shimeji 兼容 / UGC 引擎 | 免费（Early Access） | 71–75% / 1,259（社区 1,017+ 工坊物品） | Workshop 量级是优势 | Early Access | 免费 + UGC + 直播工具 |
| 14 | Desktop Pet Project (app/2618940) | Shimeji 兼容、定制 | 付费 | 84% / 46 | 样本小，Workshop 路线 | 已发行 | 一次性买断 |
| 15 | Desktop Pet (app/2179690) | 生活模拟桌宠 | 付费 | 数据快照不足，仅作信号 | 媒体盘点偶尔出现 | 已发行 | 一次性买断 |
| 16 | Desktop Shimeji Pet / QPet (app/1093890) | 老牌 Shimeji 风格 | 付费 | 数据快照不足，仅作信号 | 老款，2019 年代上线 | 已发行 | 一次性买断 |
| 17 | Desktop Pets (app/3077030) | Shimeji 集合包 | 付费 | 数据快照不足，仅作信号 | 进入 Steam 桌宠 Bundle | 已发行 | Bundle |
| 18 | Bobo Bay（PC Gamer 提到，2026-04 上架） | 桌面养宠 + 竞技 | 待核 | 暂未拉到 Steam 评论快照 | PC Gamer 把它列为 2026 最新桌宠浪潮 | 2026-04 发行（待核 app id） | 待核 |

### 5.1 数据冲突提示

| # | 项目 | 冲突点 | 处理 |
|---|---|---|---|
| 1 | VPet-Simulator 评论数 | 单源出现 95% / 3,592 与 98% / 50,413 两个差距巨大的快照 | 暂保留两个数字并标注为“需在 Steam 商店页二次核验”；不在结论里直接引用 50,413 |
| 2 | Bongo Cat 评论数 | 96% / 25,479 与“33,500+”出现在不同时间快照 | 视为同一产品在不同抓取时点的累积变化，结论使用区间表达 |
| 3 | Bongo Cat 同时在线名次 | Top 4 / Top 12 / Top 15 在不同来源出现 | 视为不同时点排名快照，统一表达为“一度进入 Steam Top 15，最高曾被报道至 Top 4” |
| 4 | Tiny Pasture 多语言占比 | 简中评论 4,360 / 英文 1,136，但总量 1,136 与简中数字明显不一致 | 推测“1,136”仅为英文评论数，整体评论量更大；保守表达为“好评率 93%，多语言中简中占比明显高” |
| 5 | Bobo Bay | 媒体提到上线 2026-04，但未核到 Steam 商店 app id | 标记为待核，仅作趋势信号 |

## 6. 产品类别拆解

| 类别 | 共性 | 代表（按编号） | 玩家心智 |
|---|---|---|---|
| A. 极轻常驻反馈型 | 免费 / 极低门槛 / 输入即反馈 / 几乎不占屏幕 | 1 Bongo Cat | “一只猫陪我打字” |
| B. 屏幕底栏 idle | 锚定屏幕底部 / 不抢焦点 / 单一闭环（农场、洗衣、割草、养小动物） | 2 Rusty / 4 Ropuka / 5 Bao Bao / 3 Tiny Pasture | “边干活边看它慢慢生长” |
| C. 桌面 IP / 拟人 mascot | 角色 IP 是核心吸引 / 装饰桌面 / 反应键鼠 | 10 Desktop Mate / 11 Pocket Waifu | “我喜欢的角色住在我桌面” |
| D. 可定制 Shimeji / 桌宠引擎 | UGC / Workshop / 模组 / 可换形象 | 6 VPet / 13 DPET / 14 Desktop Pet Project / 16 QPet / 17 Desktop Pets | “按我喜欢的角色定制” |
| E. AI 桌宠 / 对话伴侣 | LLM 对话、记忆、声音、画像，AI 是产品定位关键 | 7 Ai Vpet / 8 AI Desktop Pet / 9 AI Desk Pet | “它真的会回应我” |
| F. 桌宠 + 生产力 | 番茄钟 / 待办 / 习惯，桌宠作为外壳 | 12 Weyrdlets | “它陪我专注” |

## 7. 商业模式与流量模式

| # | 模式 | 代表 | 信号 |
|---|---|---|---|
| 1 | 免费极轻 + 帽子 / 皮肤 + 工作室名片 | Bongo Cat | 月营收 $2,800–$4,050；开发者明确“不为赚钱，为打 Oku 等下一个项目的水位” |
| 2 | 一次性买断 + 内容更新 + DLC 装饰 | Rusty / Ropuka / Bao Bao / Tiny Pasture | 销量超百万级（Rusty 自述 550K@2025-07）；定价低（$4–$10）但用户体验闭环完整 |
| 3 | 主体免费 + 单 IP DLC（$15 一个角色） | Desktop Mate | DLC 模式做单角色 SKU，靠 IP 联动持续上新 |
| 4 | F2P + 抽卡 / 内购 | Pocket Waifu | 评论里持续出现“RNG / Gambling”差评，是该路线的固有摩擦 |
| 5 | F2P → 转付费 | Weyrdlets | F2P 期间累积口碑、改付费后评论被 Steam 重置 |
| 6 | 免费 + 开源 + Workshop | VPet, DPET, AI Desktop Pet | 用 UGC 替代主创内容产能，但治理 / 内容审核成本上移 |
| 7 | 免费 / 付费 + BYO LLM API | Ai Vpet, AI Desk Pet, AI Desktop Pet | 算力 / 隐私成本下沉到用户；中国服务路由会被 Steam 显式标注 |

## 8. AI 在桌宠类作品中的角色

| 编号 | 现象 | 解读 |
|---|---|---|
| 1 | 流量最大的桌宠几乎都不是 AI 桌宠 | Bongo Cat、Rusty、Tiny Pasture、Ropuka、Desktop Mate 主体都不依赖 LLM，证明“AI 不是必要条件” |
| 2 | AI 类桌宠目前仍处于较小评论体量 / 较低好评率 | Ai Vpet 75% / 397，AI Desktop Pet 80% / 21，与 Bongo Cat 25K+ 量级有数量级差距 |
| 3 | AI 桌宠普遍把成本和隐私下沉给用户 | BYO API key（Gemini / Claude / 本地 LLM）或第三方服务 → 商业上规避算力成本，但增加上手门槛和隐私担忧 |
| 4 | Steam 已经会显式标注“连接第三方 AI 服务”等字样 | Ai Vpet 页面就明示，是产品化时必须考虑的合规信号 |
| 5 | UGC 引擎类（VPet / DPET）正在被作为 AI 桌宠的承载平台 | 模型 + 角色资产 + 行为 + 声音的拼装容易，但缺统一体验设计 |

## 9. 对 `desktop-pet`（多游戏可配置桌宠 SDK）的产品启发

| # | 启发 | 类型 |
|---|---|---|
| 1 | “低打扰桌面存在 + 单一清晰反馈闭环”是桌宠破圈的最稳路径，AI 是放大器不是入口 | 推断 |
| 2 | 屏幕底栏 / Dock / 任务栏附近的 idle 形态在玩家心智上已被接受，是 SDK 的可参考默认呈现位 | 观点 |
| 3 | 单 IP DLC（Desktop Mate 路线）证明：即便没有 AI，单角色单价 $10–$15 仍可构成微付费 SKU；对 SDK 来说这意味着“游戏 IP 可以独立计费” | 推断 |
| 4 | 长期靠 UGC（VPet / DPET）的产品评分波动较大，治理成本是 SDK 商业化前必须想清楚的事 | 观点 |
| 5 | AI 桌宠当前体量仍小，说明 AI 价值还没被普通玩家完全验证；`desktop-pet` 不应以“AI 是核心卖点”做营销主线，而应以“AI 让游戏内陪伴更准确”为对开发者的价值主张 | 推断 |
| 6 | Bongo Cat 的“免费 + 把 Studio 名片打出去”给 SDK 内部分发提供了类比：与其先卖 SDK，不如先用一个免费爆款 demo（多游戏配置 demo）给内部业务方看到价值 | 推断 |
| 7 | 桌宠类玩家对“关闭 / 静音 / 隐藏 / 不打扰”路径要求很高（Tiny Pasture / Ropuka 评论中反复出现），SDK 必须把 quiet hours / hide on fullscreen / opt-out 设计为默认而非选配 | 推断 |
| 8 | `desktop-pet` 的差异化机会不是“做更多桌宠”，而是“多游戏可配置 + 游戏事件上下文 + 隐私可控”，这与 toC 桌宠产品矩阵不形成直接竞争，但需要在 PM Strategy 阶段明确 SDK vs 桌面应用的边界 | 推断 |

## 10. 事实 / 观点 / 推测分类

| # | 论断 | 来源 | 类型 | 置信度 |
|---|---|---|---|---|
| 1 | Bongo Cat 是 Steam 上长期高活跃的免费桌宠，96%+ 好评率、并发曾 >100,000、Top 15 内 | Steam 商店页 + PC Gamer + GameSpot + GamesRadar | Fact | 高 |
| 2 | Bongo Cat 月营收约 $2,800–$4,050，开发商认定其主要价值是营销 | GameSpot / GamesRadar 引用 Marcel Zurawka 访谈 | Fact-with-source | 中高 |
| 3 | Rusty's Retirement 累计销量 550,000（截至 2025-07） | Wikipedia 引用开发者公开数据 | Fact-with-source | 中高 |
| 4 | Tiny Pasture 上线后曾在并发峰值上超过 Avowed | Gamepressure / Steam 媒体盘点 | Fact | 中（来自媒体单源） |
| 5 | Desktop Mate 主体免费、Hatsune Miku DLC $15、上线峰值 6,230 | Steam DLC 页 + PC Gamer | Fact | 高 |
| 6 | VPet-Simulator 是开源、Steam 上免费、评论数远高于其他 AI 桌宠 | Steam + GitHub | Fact | 高 |
| 7 | Ai Vpet 通过中国第三方服务调 LLM | Steam 页明示 + 媒体复述 | Fact | 高 |
| 8 | 桌宠在 2024–2026 出现“文艺复兴”是有客观销量与评分支撑的趋势，不是单纯营销叙事 | PC Gamer / GamesRadar / Gamepressure / Pixelkin 多源 | Opinion + 部分 Fact | 中高 |
| 9 | AI 桌宠目前评论体量与好评率均显著低于非 AI 桌宠 | Steam 各产品评论数据对比 | Fact（基于当前快照） | 中高 |
| 10 | `desktop-pet` SDK 不能直接复用桌宠流量，但可借鉴桌宠的反馈闭环和低打扰设计 | 本文判断 | Speculation | 中 |
| 11 | Bobo Bay 是 2026-04 桌宠浪潮的最新案例 | PC Gamer 单源 | Speculation | 中低（待核 Steam app） |

## 11. 产品机会（候选，需 PM Thread 收口）

| # | 机会 | 用户问题 | 目标用户 | 可行性 | 风险 |
|---|---|---|---|---|---|
| 1 | 多游戏共享桌宠形象 + 单游戏专属事件反应 | 玩家在多个游戏间切换时希望陪伴感连续 | 玩家 + 多游戏接入方 | 中（需要事件协议 + 桌宠运行时） | 易过度设计，需先验证“跨游戏陪伴感”是否真的为玩家所感知 |
| 2 | 游戏内事件 → 桌面低打扰提醒 / 反应 | 玩家不在线时希望被柔性召回，但厌恶硬推送 | 玩家 + 运营 | 中（需 quiet hours / 用户控制） | 推送疲劳、反感桌面驻留 |
| 3 | 桌宠 SDK + IP DLC 模式（参照 Desktop Mate） | 游戏团队希望桌宠承担一部分 IP 周边变现 | 内部业务方 | 中（要求美术管线和定价权） | 玩家可能视为切片付费 |
| 4 | 桌宠承担“游戏说明 / 活动规则”的 RAG 问答 | 玩家不愿打开 wiki / 客服 | 玩家 + 运营 | 中（依赖知识库 + 隐私边界） | 幻觉 / 越权回答需要严格兜底 |
| 5 | 内部分发的 “Bongo Cat 类” demo：免费、轻、纯反馈，作为 SDK 名片 | 内部业务方对 SDK 价值不直观 | 内部业务方 | 高（容易实现） | 容易被理解成“只是做了一个桌面玩具” |

## 12. 风险

| # | 风险 | 证据 | 缓解 |
|---|---|---|---|
| 1 | toC 桌宠流量与 toB SDK 价值之间不能直接画等号 | Bongo Cat 流量大但开发商靠它带其他项目，而非靠它本身赚钱 | PM 在 T-001 中明确 SDK / 桌面应用 / 内部分发边界 |
| 2 | 桌面驻留产生的隐私 / 性能 / 打扰反感 | Tiny Pasture / Ropuka / Weyrdlets 评论中均出现 | 默认提供 quiet hours / hide on fullscreen / 一键退出 / 数据本地 |
| 3 | AI 桌宠模式仍未被普通玩家广泛验证 | AI 桌宠评论量级 / 好评率均明显低于非 AI 桌宠 | MVP 不绑定 AI 必要性；按场景判断是否需要 LLM |
| 4 | 第三方 AI 服务带来的合规与品牌风险 | Ai Vpet 服务路由公开标注 | 选 LLM provider 时考虑合规 + 多 provider 兜底 |
| 5 | 桌宠 IP 切片付费可能与游戏本体定价冲突 | Desktop Mate IP DLC $15 引发媒体争议 | 价格策略需要游戏本体团队 + 商业 BD 同步 |

## 13. 推荐行动

| # | Action | Workspace | 优先级 | 输入 |
|---|---|---|---|---|
| 1 | 把“Bongo Cat 路线 vs Rusty 路线 vs Desktop Mate 路线 vs SDK 路线”转成 4 条候选 MVP 假设，在 T-001 中给 PM 选 | `01-pm/` | P0 | 本文第 6、9、11 节 |
| 2 | 把“桌宠不可或缺的低打扰 / 关闭 / 隐藏 / 静音机制”转成 PRD 必需项 | `01-pm/` | P0 | 本文第 12 节风险 #2 |
| 3 | 把“IP DLC 单角色付费 vs 一次性买断 vs F2P 抽卡”做商业模式对比，给 T-001 商业模式 Open Question 提供选项 | `01-pm/` | P1 | 本文第 7 节 |
| 4 | 评估“VPet / DPET 兼容 Shimeji 资产”作为美术管线借力点 | `02-design/` | P1 | 本文第 6 节 D 类、第 8 节 #5 |
| 5 | 评估 Steam 桌宠类的“屏幕底栏 / Dock 锚点”UI 范式作为默认呈现位 | `02-design/` | P1 | 本文第 6 节 B 类 |
| 6 | 跟踪 Bobo Bay、Hatsune Miku 之外的 Desktop Mate 新 DLC 与新桌宠上线，观察 IP 联动节奏 | `04-research/` | P2 | 本文第 5 节待核项 |
| 7 | 考虑做一个内部分发的“类 Bongo Cat”名片 demo 验证桌宠流量价值（不一定要 AI） | `03-engineering/` + `01-pm/` | P2 | 本文第 11 节机会 #5 |

## 14. Open Questions

| # | 问题 | 验证方式 | Owner |
|---|---|---|---|
| 1 | `desktop-pet` 的 MVP 路线应优先验证哪一条：极轻反馈（Bongo Cat）/ 屏幕底栏 idle（Rusty）/ IP 联动（Desktop Mate）/ 多游戏 SDK 闭环？ | T-001 + 用户决策 | PM Strategy Thread + User |
| 2 | 桌宠是否需要 AI 才有产品差异化，还是 AI 只是“强化版反馈”？ | AI Feature Evaluation | PM Strategy Thread |
| 3 | SDK 形态下是否使用单角色 DLC 计费，与游戏本体 IP 收入如何分账？ | 商业模式评估 | PM Strategy Thread + 商业 BD |
| 4 | 桌宠在游戏全屏 / 反外挂 / 反作弊环境中的兼容性（Steam Overlay 同样面临的边界）需要由谁定？ | 工程预研 | Engineering Build Thread |
| 5 | VPet-Simulator 真实评论体量（3,592 vs 50,413）需要二次核验，以避免基础数据被错引 | Steam 商店页 + SteamDB 抓取 | Trend Radar Thread |
| 6 | Bobo Bay 真实 Steam app id 与体量是否可作为 2026 桌宠浪潮代表？ | Steam 搜索 | Trend Radar Thread |

## 15. 后续同步

- 本文产物：`projects/desktop-pet/04-research/steam-and-embedded-companion/TREND_RESEARCH_steam-popular-desktop-pet-games.md`
- 同步消息：`projects/desktop-pet/06-sync/group/2026-05-09T_radar_steam-popular-desktop-pet-games.md`
- 建议 Main Thread 在 `06-sync/SYNC_SUMMARY.md` Latest Decisions 增加一条 2026-05-09 的 Radar 摘要。
- 建议 PM Strategy Thread 在 T-001 输入中纳入本文第 9、11、13 节。
