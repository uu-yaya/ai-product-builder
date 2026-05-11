# Main Thread Closeout: Embedded Companion Research Batch

Date: 2026-05-11
Thread: Main Thread
Topic: Closeout for latest Radar batch after group scan

## Scope

已收口上次 Main closeout 后新增的 `desktop-pet` Radar 消息：

- `06-sync/group/2026-05-09T19-25-43_radar_user-tested-desktop-pet-supplement.md`
- `06-sync/group/2026-05-09T_radar_free-desktop-pet-alternatives.md`
- `06-sync/group/2026-05-09T_radar_in-game-embedded-companion-references.md`
- `06-sync/group/2026-05-09T_radar_steam-games-with-embedded-companion.md`
- `06-sync/group/2026-05-09T_radar_steam-games-with-embedded-companion-2.md`

## Main Thread Updates

- `06-sync/TASK_BOARD.md`
  - 新增 `T-015` 至 `T-019`，全部标记为 `Done`。
  - 更新 `T-001` 输入，把游戏内嵌伴侣 / Steam 已发行游戏内伴侣对标纳入 PM 澄清。
- `06-sync/SYNC_SUMMARY.md`
  - `Last Updated` 更新为 `2026-05-11`。
  - 补充用户实测样本、免费 / 开源桌宠扩展、游戏内嵌伴侣范围修正、Steam 内嵌伴侣 PART 1 / PART 2 摘要。
  - 新增内嵌游戏场景、伴侣职责矩阵、内部能力栈边界、Live2D / VRM、AI middleware 等 Open Questions。
  - 更新 Next Actions，让 PM Strategy Thread 优先接 `T-001`。
- `06-sync/THREAD_REGISTRY.md`
  - Main Thread 与 AI Trend Radar Thread 的 `Last Update` 更新为 `2026-05-11`。
- `decisions/DECISION_LOG.md`
  - 新增 `Accepted` Scope 决策：desktop-pet 主研究场景收紧为“现有游戏内嵌桌宠 / 伴侣 / mascot / SDK 能力”，独立桌面桌宠应用降级为次要参考。

## Key Reconciled Conclusions

- 主场景修正：后续 PM / Design / Engineering 应优先围绕“游戏内嵌伴侣 / 多游戏 SDK 能力”推进，而不是把独立桌面应用当主路线。
- Steam 对标：AI 伴侣上限可看 inZOI / PUBG Ally / NVIDIA ACE；非 AI 粘性底线可看 Cult of the Lamb、FF14 Minions、Stardew Pet。
- 伴侣职责矩阵：装饰 / 任务 / UI / 旁白 / 工具五种职责应成为 T-001 的核心澄清框架。
- 商业与生态：免费 / 开源 / Steam + GitHub 双轨分发、IP DLC、Live2D / VRM 美术管线都值得保留为候选，但不能在 T-001 前写死。
- 内部能力栈：desktop-pet 必须回答与 Tencent GiiNex / TRTC / ADP / GMES / F.A.C.U.L. 的边界，否则后续工程方案容易重叠或过度设计。

## Suggested Next Thread

PM Strategy Thread。

建议接手 `T-001`，输出：

- `01-pm/REQUIREMENT_CLARIFICATION_desktop-pet-mvp.md`
- `01-pm/AI_FEATURE_EVALUATION_desktop-pet-mvp.md`

其中必须显式处理：内嵌游戏场景、伴侣职责矩阵、AI 必要性、低打扰机制、记忆边界、内部能力栈边界和商业 / IP 合作假设。

## Whether Main Thread Needs to Update SYNC_SUMMARY.md

Done.
