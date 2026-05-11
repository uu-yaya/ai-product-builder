# Global Context

> APB 的长期项目上下文基线。新线程或新会话启动时，应先读 `memory/USER_PROFILE.md` 与本文件，再读项目级 `00-context/PROJECT_CONTEXT.md`。
>
> 本文件由用户亲自提供基线（Step 10F），AI 不得在没有用户确认的情况下扩写为未验证事实。
>
> 公司内部项目名、真实业务数据、合作方信息、付费平台凭据均不进入本文件。

## Current Role

腾讯 IEG 游戏前沿部门技术公线 AI 产品经理。

## Current Focus

- 构建 APB 作为 AI 产品工作台。
- 用 Codex / Claude / Cowork 辅助产品、设计、工程、趋势研究。
- 关注游戏 AI、AI Agent、AIGC、研发效率、内部工具与前沿技术落地。
- 致力于搭建属于自己的 AI 提效工具。
- 不断探索优雅、高级的设计，逐步发现属于自己的设计风格与设计理念。
- 学习搭建鲁棒性好、性能效率高、能逐步自我进化的 AI agent 架构。

## Active Projects

| Project | Type | Status | Notes |
|---|---|---|---|
| APB（AI Product Builder） | 个人 / 工作台 | In Progress（搭建中） | 当前主线；Step 10 系列正在推进多线程基础。详见 `ROADMAP.md` |
| 其他真实工作项目 | 工作 | TBD by user | 真实业务项目尚未开始 / 尚未授权写入；先不记录到 APB 仓库 |

> 后续真实项目按 `projects/<project-slug>/` 单独立项，并先填 `00-context/PROJECT_CONTEXT.md`，不在本文件展开业务细节。

## Product Domains

- 游戏 AI
- AI Agent
- AIGC 工具
- 游戏研发效率工具
- 内部 AI 产品平台
- AI 功能评估与落地

## Design Preferences

`TBD by user`。

> 用户在 Current Focus 中表达"探索优雅、高级的设计，逐步发现属于自己的设计风格与设计理念"作为长期方向；具体视觉 / 交互 / 参考产品偏好留待后续真实项目中沉淀，再补回本节，避免现在写成已验证事实。

## Technical Preferences

- 先做本地文件协议，不急着配置 MCP。
- 先复用已有 Skills 与 Lenny skills，不急着创建 `apb-*` custom skills。
- 多线程协作必须有清晰的 read / write boundary。
- 涉及真实代码、密钥、部署、公司数据时必须先确认范围与影响。

## Research Interests

| 方向 | 备注 |
|---|---|
| AI NPC / Agent | 游戏内智能体、Companion AI |
| 游戏 AIGC | 内容生成在游戏 pipeline 中的应用 |
| 3D / 动画 / 美术资产生成 | 资产生产管线、风格一致性、版本管理 |
| 游戏 QA 自动化 | 自动化测试、AI 跑图、回归 |
| AI Coding Agents | 编程助手、内部化方向 |
| 多 Agent 协作平台（如 Multica） | 作为可选调度层评估，APB 仍以本地文件协议为底座 |
| Figma / 设计到工程链路 | Figma Prompt、Design Handoff、Code Connect |
| AI Evals / 成本 / 延迟 / Fallback | 工程可观测性与可回滚 |

## Current Constraints

- 不在 APB 中写入公司机密、真实玩家数据、未脱敏日志、真实 token / API key / secret。
- 不直接修改 `~/.codex/` 或 `~/.agents/skills/`（Lenny skills 不删除、不移动、不禁用、不重命名）。
- 不急着配置 MCP；`mcp-plan/` 仅是规划，不是当前可执行配置。
- 不让 AI 编造真实项目背景。
- 公司内部项目名、合作方信息、内部平台细节默认 `Not recorded for safety`，仅在用户明确允许时记录。

时间 / 资源 / 算力 / 合规细节：`TBD by user`（待用户在后续真实项目中按需补充）。

## Open Questions

| # | Question | Status | Notes |
|---|---|---|---|
| 1 | APB 首个真实试点项目选什么 | Open | 候选方向参考 Product Domains（游戏 AI / AI Agent / 内部平台 / 研发效率）；建议 Step 10H 落地 |
| 2 | 是否需要 Game AI 专属模板（AI_NPC_FEATURE_EVALUATION / AIGC_PIPELINE_PRD 等） | Open | 建议跑过 1–2 个真实项目后按使用证据决定 |
| 3 | 是否需要 `apb-*` custom skills | Open | 当前策略是先复用 Lenny + 已安装 Skills；门槛见 `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md` |
| 4 | Multica 是否适合作为未来 agent 调度层 | Open | APB 必须保持本地文件协议为底座；Multica 仅作为可选调度层评估 |

## Safety Notes

- 本文件不存放真实 token / API key / secret。
- 本文件不存放真实玩家数据、公司机密、未脱敏日志、合作方机密、IP 授权细节。
- 公司内部资源（TAPD / 工蜂 / 腾讯文档 / KM 等）链接放进项目级 `00-context/LINKS.md` 时也需脱敏，不写带 session id 或 token 的链接。
- 内容更新由用户主导；AI 不得擅自扩写为未经确认的事实。

## Last Updated

2026-04-28（Step 10F 由用户提供基线，AI 协助整理）。
