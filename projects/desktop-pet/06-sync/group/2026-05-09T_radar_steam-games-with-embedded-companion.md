# Radar 同步：Steam 游戏内嵌伴侣 / 宠物 / Mascot 对标清单

- 日期：2026-05-09
- 线程：AI Trend Radar Thread
- Topic Slug：`steam-games-with-embedded-companion`

## 关键定位

用户进一步澄清："就是要 steam 的游戏"——把对标范围从 SDK / 中间件 / 玩家心智范式收紧到"已经在 Steam 上发行 + 自身内嵌伴侣 / 宠物 / mascot 系统"的真实游戏。

## 做了什么

按 3 个 Tier 整理 Steam 上的内嵌伴侣对标：

- **Tier 1 AI 驱动伴侣**：PUBG: BATTLEGROUNDS（PUBG Ally）/ inZOI（Smart Zoi）/ NARAKA: BLADEPOINT / MIR5 / Dead Meat / AI People / ZooPunk / Alien: Rogue Incursion / World of Jade Dynasty。统一栈是 NVIDIA ACE + 小模型 + on-device 推理（约 1GB VRAM）。
- **Tier 2 收集 / 跟随宠物**：Final Fantasy XIV Online（Minions）/ Stardew Valley（猫狗龟 + Pet Bowl 友好度）/ Cult of the Lamb（96% / 5.8 万评论的 followers）/ Don't Starve Together（Chester / Glommer / Hutch）/ Subnautica（Cuddlefish）/ Sea of Thieves（宠物 DLC）/ Valheim（驯化狼）。
- **Tier 3 角色 mascot 即 UI**：Persona 5 Royal / Persona 3 Reload（Morgana / Teddie / Koromaru / Aigis）/ Borderlands 2/3/Wonderlands（Claptrap）/ Hollow Knight（Grimmchild）/ Stray（B-12）/ Half-Life 2（Dog）/ Hatsune Miku Project DIVA Mega Mix+（Miku）/ Hogwarts Legacy（神奇动物）。

给出 Top 5 最值得抄的 Steam 案例：inZOI、PUBG Ally、Cult of the Lamb、FF14 Minions、Stardew Pet。

## 修改的文件

- 新建：`projects/desktop-pet/04-research/TREND_RESEARCH_PART_steam-games-with-embedded-companion.md`
- 新建：`projects/desktop-pet/06-sync/group/2026-05-09T_radar_steam-games-with-embedded-companion.md`（本文件）

## 没有改的范围

- 主 TREND_RESEARCH 与之前 3 份 PART：未改。
- `00-context/` `01-pm/` `02-design/` `03-engineering/` `05-reviews/` `decisions/`：未触碰。
- `06-sync/SYNC_SUMMARY.md` `THREAD_REGISTRY.md` `TASK_BOARD.md`：未直接修改，建议 Main Thread 在 Latest Decisions 增加一条本次的范围收紧摘要。
- `workspaces/` `memory/` `~/.codex/` `~/.agents/skills/`：未修改。

## 关键发现速读

- 真正在 Steam 上落地的"AI 内嵌伴侣"几乎都走 NVIDIA ACE + 小模型 + on-device，云推理路线在 Steam AAA 上还没成功验证。
- "AI 不是必须的"在 Steam 上有大量证据：Cult of the Lamb 96% / 5.8 万、FF14 Minions 是 MMO 工业范式、Stardew 的 Pet Bowl + 友好度 + 自动送礼公式简单且粘性高。
- "伴侣 = UI 工具"是把伴侣从"装饰"升级为"功能"的关键路径（Persona Morgana / Borderlands Claptrap / Stray B-12）。
- inZOI 的"AI 决策可视化"UI 是 AI 桌宠透明度设计的代表，建议设计借鉴。
- NVIDIA ACE 在 PUBG（FPS 队友）/ NARAKA（ACT 队友）/ inZOI（模拟生活居民）三种类型落地，证明 SDK 必须"按游戏类型给配置模板"。

## 数据冲突 / 待核

- PUBG Ally 实际开放时间口径不一致（CES 2025 公告 vs 2026 早期 PUBG Arcade 测试），以 KRAFTON 官方公告为准。
- inZOI Smart Zoi 的 VRAM 占用 1GB 来自 PC Gamer / NVIDIA 资料，不同 GPU 环境会有差异。
- NARAKA: BLADEPOINT 加入 ACE 是 MOBILE PC VERSION，不是主线 PC 版，引用时需注明。

## 下一步建议

- PM Strategy Thread：把 Cult of the Lamb / FF14 Minions / Stardew Pet 作为 desktop-pet MVP "无 AI 也能跑出粘性" 的底线参考；把 inZOI / PUBG Ally 作为"AI 驱动伴侣"的工程上限参考。
- Engineering Build Thread：评估 NVIDIA ACE 路线的跨厂商兼容性（NVIDIA / AMD / Intel）；评估 Mistral-Nemo-Minitron 系列小模型 on-device 推理是否进入候选栈。
- Design Prototype Thread：把"伴侣即 UI"（Morgana / Claptrap / B-12）的职责清单整理成 SDK 可配置项；把 inZOI Smart Zoi 的"AI 决策可视化" UI 整理成设计参考。
- Trend Radar Thread：跟踪 PUBG Ally Arcade 测试的玩家反馈；跟踪 NARAKA Mobile PC ACE 队友口碑。
- Main Thread：在 SYNC_SUMMARY Latest Decisions 加一条 2026-05-09 的范围收紧摘要。

## 风险 / 待确认

- NVIDIA ACE 路线硬件门槛（1GB VRAM）会挤掉低端玩家，desktop-pet 必须保留"无 AI 降级版"。
- Cult of the Lamb / Stardew 的伴侣粘性来自玩法系统，SDK 嵌一个伴侣无法直接复制，需要与接入游戏玩法团队共建闭环。
- Persona / Borderlands 的 mascot 强度来自 IP 与剧情写作，SDK 无法替代，应把"接入方提供 IP / 写作 / 语音"作为前置条件写进合作模板。
