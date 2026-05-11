# AI Weekly Radar 2026

## 1. 项目概述

| Item | Content |
|---|---|
| Project Name | AI Weekly Radar 2026 / 2026 AI 趋势周报 |
| Project Slug | `ai-weekly-radar-2026` |
| Project Stage | Discovery（仅完成项目骨架初始化） |
| Themes | AI Agent / AI Coding / 游戏 AI |
| Output Cadence | 每周一上午收口；覆盖窗口为执行当天向前回溯 7 天；节假日可顺延 |
| Output Location | `04-research/AI_WEEKLY_REPORT_<week>.md` |

本项目是 APB 框架下的**研究类项目**，不构建产品形态（订阅站点 / Newsletter / APP）。
所有真实研究产出落在本目录，不写入 `workspaces/`。

## 2. 启动顺序（任何线程进入时按序执行）

1. 读 `00-context/PROJECT_CONTEXT.md`：识别项目目标、范围、约束、Open Questions。
2. 读本目录 `PROJECT_RULES.md`：确认读写边界与命名规范。
3. 读 `decisions/DECISION_LOG.md`：理解已做决策。
4. 启动具体线程时再读对应子目录 README。

## 3. 目录结构

```
projects/ai-weekly-radar-2026/
├── README.md                    本文件（项目入口）
├── PROJECT_RULES.md             项目级读写规则与命名规范
├── 00-context/                  项目共同上下文（必读）
│   ├── PROJECT_CONTEXT.md       已初始化
│   ├── USER_PERSONA.md          模板，按需填写
│   ├── PRODUCT_POSITIONING.md   模板，本项目可不填（非产品项目）
│   └── LINKS.md                 信源池外链
├── 01-pm/                       本项目默认不启用（非产品项目）
├── 02-design/                   本项目默认不启用（无视觉设计需求）
├── 03-engineering/              本项目默认不启用（不构建产品）
├── 04-research/                 ★ 主战场：周报、专题、信源池
├── 05-reviews/                  跨期回顾、风险检查
├── 06-sync/                     单线程项目暂不启用文件，保留目录结构
└── decisions/
    └── DECISION_LOG.md          已写入首批 3 条决策
```

## 4. 内容产出规范

- 周报命名：`04-research/AI_WEEKLY_REPORT_2026-W<NN>.md`（NN 为 ISO 周序号）。
- 季度回顾命名：`04-research/AI_QUARTERLY_REVIEW_2026-Q<N>.md`。
- 专题深度报告命名：`04-research/AI_TOPIC_BRIEF_<topic-slug>.md`。
- 信源池清单：`00-context/LINKS.md`。
- 模板字段建议（在首期周报落地时确定）：来源、日期、类型、主题、影响等级、信心度、下一步。
- 不允许：泛 AI 新闻搬运、未经证实的传闻、未脱敏内部数据、付费墙抓取内容。

## 5. 当前状态

- ✅ 项目骨架已初始化（2026-04-28）。
- ✅ 首期周报范围确定：基线周报（合并方案），文件 `04-research/AI_WEEKLY_REPORT_2026-W18.md`，Issue = `Baseline`，30 天背景 + 7 天增量（窗口 2026-04-22 → 2026-04-28）。
- ✅ 信源池已落地：19 个核心信源 + 3 个中文辅助源，三级可信度分层，详见 [00-context/LINKS.md](00-context/LINKS.md)。
- ✅ 周报模板已落地：10 字段 + Baseline 段 + 节奏说明，详见 [04-research/AI_WEEKLY_REPORT_TEMPLATE.md](04-research/AI_WEEKLY_REPORT_TEMPLATE.md)。
- ✅ 节奏锁定：每周一上午收口，覆盖窗口为执行当天向前回溯 7 天，节假日可顺延。
- ✅ 三级信源策略锁定：不预设固定清单，按主题临时检索；连续 2–3 期持续有价值的源再升级。
- ✅ 中文媒体策略锁定：作为二级 / 三级辅助源，独家报道默认 Confidence 中 / 低。
- ⏳ 首期周报尚未启动（用户指示"只初始化项目，不执行研究"）。

## 6. 安全边界

- 仅使用公开来源；不抓取付费墙、需鉴权的内容。
- 不写入真实 token / API key / secret，仅使用 `${ENV_VAR}` 占位。
- 不评价个体，仅评价产品 / 模型 / 项目。
- 详见 `PROJECT_RULES.md` 第 7 节。
