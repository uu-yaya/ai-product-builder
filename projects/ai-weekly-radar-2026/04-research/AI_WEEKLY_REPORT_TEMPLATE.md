# AI Weekly Report — Template

> 复制本文件到 `AI_WEEKLY_REPORT_<YYYY-Wxx>.md`（按结束日所在 ISO 周）后填写。

## 节奏 / Cadence

- 收口时间：每周一上午。
- 默认窗口：执行当天向前回溯 7 天（含执行日）。
- 节假日 / 工作冲突时可顺延，文件名仍按结束日所在 ISO 周命名（如顺延后跨周，需在 Meta.Window 字段如实写）。
- 文件命名固定 `AI_WEEKLY_REPORT_<YYYY-Wxx>.md`，例：`AI_WEEKLY_REPORT_2026-W18.md`。
- 首期（Issue = Baseline）额外携带 30 天背景段，详见下文 [Baseline 部分（首期专属）](#baseline-部分首期专属)。

## Meta

| Field | Value |
|---|---|
| Issue | 第 N 期（首期标注 `Baseline`，常规期标注序号如 `001` / `002`） |
| Window | YYYY-MM-DD → YYYY-MM-DD（7 天，含结束日） |
| Baseline Window | （首期专属）YYYY-MM-DD → YYYY-MM-DD（最近 30 天背景），常规期留空或删除本行 |
| Published | YYYY-MM-DD |
| Themes | AI Agent / AI Coding / Game AI |
| Source Coverage | 列出本期实际触达的信源（≤19 + 中文辅助 + 临时三级源）|
| Items | 共 N 条 |

## Executive Summary

- 不超过 5 条要点，每条一句话。
- 至少标注一条"如果只看一条，看这条"。
- 避免泛 AI 新闻；只说三大方向真正的进展或拐点。

## Baseline 部分（首期专属）

> **仅 Issue = Baseline 时填写本节，常规期删除本节。**
> 目的是为后续周报锚定一个共同起点；写法**简要**，不展开为独立报告。

### B.1 AI Agent — 最近 30 天背景

- 当前格局（用 3–5 行说明主流玩家、主流范式、主流应用形态）。
- 关键拐点（最近 30 天内出现、对后续 1–2 个季度影响 ≥ 中的事件，每条一句话）。
- 待跟踪信号（哪些苗头尚未成型，但值得在后续周报里盯）。

### B.2 AI Coding — 最近 30 天背景

（同上结构）

### B.3 Game AI — 最近 30 天背景

（同上结构）

> 每个方向不超过 ~10 行；30 天背景不替代当周 7 天动态，**两者关系是"背景 + 增量"**。

## 1. AI Agent

### Item 1.1 — <Title>

| Field | Value |
|---|---|
| Title | <这条信息叫什么> |
| Summary | <发生了什么；2–4 句话> |
| Source | <一级信源 URL；多源时主源在前> |
| Category | AI Agent / AI Coding / Game AI / AIGC / Tooling / Other |
| Why it matters | <为什么重要；解释拐点而不是事件> |
| Product opportunity | <对产品有什么机会；具体到场景> |
| Technique | <涉及什么新技术；模型 / 范式 / 工具链> |
| Confidence | 高 / 中 / 低（依据信源等级与是否被独立验证） |
| Impact | 高 / 中 / 低（依据时间窗内对方向的拐点强度） |
| Suggested action | <下一步建议：试用 / 跟踪 / 引入项目 / 暂搁置> |

### Item 1.2 — <Title>

（同上字段）

> 本节本周无重要更新时，写"本周无重要更新"，不要凑数。

## 2. AI Coding

### Item 2.1 — <Title>

（同上字段）

## 3. Game AI

### Item 3.1 — <Title>

（同上字段）

## 4. 横向 / 风险信号（可选）

收录跨方向、AIGC、Tooling、AI 安全 / 风险事件（来自 OECD AI Incidents Monitor 等）。
本节本周无内容时可省略。

## 5. 跨期串联（第 2 期起启用）

- 同一主题在过去 4–8 周的演进线（链接到此前期次的对应 Item）。
- 上期 Suggested action 的兑现情况（Done / In progress / Dropped + 原因）。

## 6. Confidence / Impact 评分细则

**Confidence**
- 高：一级信源（Lab / Vendor 官方、arXiv、Papers with Code、Stanford AI Index、OECD），且至少一条独立交叉验证。
- 中：二级信源（The Decoder / MIT TR / VentureBeat / TechCrunch / 机器之心 / 量子位 / PaperWeekly）独家报道，未被一级信源确认。
- 低：仅来自三级信源（YouTube / Reddit / X），未被一级或二级信源覆盖。
- 中文源独家报道默认 **中 / 低**，除非有官方或多源（≥1 个英文一级源）验证才可上调。

**Impact**
- 高：可能改变三大方向之一的产品形态、研发流程、商业模式、用户行为。
- 中：在某细分场景下显著优于现状，但尚未触及形态级变化。
- 低：增量改进、有趣实验、单点能力提升。

## 7. 安全 / 边界

- 仅使用公开来源，不抓取付费墙、不爬取需鉴权内容。
- 不评价个体；只评价产品 / 模型 / 项目本身。
- 未经证实的传闻不得写入"事实"段，必要时进入"观点 / 报道"段并标 Confidence 低。
- 涉及风险事件时，链回 OECD 或一级信源，不做二次推测。
