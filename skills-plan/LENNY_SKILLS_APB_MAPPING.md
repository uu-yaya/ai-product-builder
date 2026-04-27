# Lenny Skills APB Mapping

## 1. Purpose

This document maps Lenny skills to the four AI Product Builder workspaces.

APB can reuse Lenny methodology, but final outputs must follow APB templates, workflows, and safety rules. Lenny skills are capability and methodology sources, not the final output authority.

## 2. Core Rule

- APB workspace rules win.
- APB templates win.
- Safety rules win.
- Lenny skills provide PM, design, engineering, growth, leadership, and AI methods.
- If Lenny output conflicts with APB templates, reformat it into the APB template.
- If a task is ambiguous, route through the relevant APB workspace first, then decide whether a Lenny method helps.

## 3. pm-strategy Mapping

| APB Task | Recommended Lenny Skills | How to Use | Required APB Template / Workflow |
|---|---|---|---|
| 需求澄清 | `problem-definition`, `working-backwards`, `analyzing-user-feedback` | Clarify user, scenario, pain, value, assumptions, and missing information. | `workspaces/pm-strategy/workflows/requirement-clarification.md` |
| PRD | `writing-prds`, `working-backwards`, `writing-specs-designs` | Use Lenny methods to sharpen structure and customer value, then output in APB PRD format. | `workspaces/pm-strategy/templates/PRD_TEMPLATE.md` |
| 竞品分析 | `competitive-analysis`, `positioning-messaging`, `product-taste-intuition` | Compare competitors and extract differentiation opportunities, not just feature lists. | `workspaces/pm-strategy/templates/COMPETITOR_ANALYSIS_TEMPLATE.md` |
| 产品策略 | `ai-product-strategy`, `defining-product-vision`, `platform-strategy`, `startup-ideation` | Frame product direction, target users, positioning, and strategic trade-offs. | `workspaces/pm-strategy/AGENTS.md` and relevant templates |
| Roadmap | `prioritizing-roadmap`, `scoping-cutting`, `planning-under-uncertainty` | Prioritize by user value, feasibility, risk, sequence, and dependency. | `workspaces/pm-strategy/templates/DEVELOPMENT_TASK_BREAKDOWN_TEMPLATE.md` |
| 用户研究 | `conducting-user-interviews`, `conducting-interviews`, `designing-surveys`, `analyzing-user-feedback` | Create research plans, interview guides, survey questions, and synthesis. | `workspaces/pm-strategy/workflows/requirement-clarification.md` |
| 增长 | `designing-growth-loops`, `retention-engagement`, `user-onboarding`, `measuring-product-market-fit` | Connect product loops, activation, retention, and PMF signals. | `workspaces/pm-strategy/templates/MRD_TEMPLATE.md` |
| 定价 | `pricing-strategy`, `product-led-sales`, `enterprise-sales` | Explore pricing hypotheses and packaging; avoid financial advice framing. | `workspaces/pm-strategy/templates/MRD_TEMPLATE.md` |
| 启动 / 发布 | `launch-marketing`, `shipping-products`, `positioning-messaging` | Turn product value into launch narrative, release checklist, and GTM notes. | `workspaces/pm-strategy/templates/PRD_TEMPLATE.md` |
| stakeholder alignment | `stakeholder-alignment`, `running-decision-processes`, `cross-functional-collaboration` | Clarify decision owners, trade-offs, unresolved questions, and alignment needs. | `workspaces/pm-strategy/AGENTS.md` |

## 4. design-prototype Mapping

| APB Task | Recommended Lenny Skills | How to Use | Required APB Template / Workflow |
|---|---|---|---|
| 行为设计 | `behavioral-product-design`, `user-onboarding`, `retention-engagement` | Analyze motivation, habit loops, friction, and activation moments. | `workspaces/design-prototype/templates/DESIGN_BRIEF_TEMPLATE.md` |
| 设计评审 | `running-design-reviews`, `product-taste-intuition`, `design-systems` | Add critique structure and product taste, then output APB issue table. | `workspaces/design-prototype/templates/UI_AUDIT_TEMPLATE.md` |
| 用户体验 | `behavioral-product-design`, `analyzing-user-feedback`, `conducting-user-interviews` | Connect design choices to user behavior, pain points, and journey clarity. | `workspaces/design-prototype/workflows/ui-ux-design-review.md` |
| 设计系统 | `design-systems`, `design-engineering` | Support token, component, state, and governance decisions. | `workspaces/design-prototype/templates/DESIGN_SYSTEM_TEMPLATE.md` |
| 信息架构 | `problem-definition`, `working-backwards`, `product-taste-intuition` | Use user goals and task flow to structure content and navigation. | `workspaces/design-prototype/templates/HIGH_FIDELITY_PROTOTYPE_TEMPLATE.md` |
| 文案 / messaging | `positioning-messaging`, `brand-storytelling`, `launch-marketing` | Improve page copy, value proposition, microcopy, and launch messaging. | `workspaces/design-prototype/templates/FIGMA_PROMPT_TEMPLATE.md` |

## 5. engineering-build Mapping

| APB Task | Recommended Lenny Skills | How to Use | Required APB Template / Workflow |
|---|---|---|---|
| 技术路线图 | `technical-roadmaps`, `planning-under-uncertainty`, `platform-strategy` | Clarify implementation sequence, dependencies, risks, and technical trade-offs. | `workspaces/engineering-build/templates/MVP_BUILD_PLAN_TEMPLATE.md` |
| specs | `writing-specs-designs`, `scoping-cutting`, `shipping-products` | Convert product and design intent into implementation-ready specs. | `workspaces/engineering-build/templates/API_IMPLEMENTATION_PLAN_TEMPLATE.md` |
| AI 产品工程判断 | `building-with-llms`, `ai-product-strategy`, `evaluating-new-technology` | Evaluate model choice, AI workflow, cost, latency, and product fit. | `workspaces/engineering-build/templates/AI_INTEGRATION_TEMPLATE.md` |
| trade-off | `evaluating-trade-offs`, `scoping-cutting`, `managing-tech-debt` | Compare speed, quality, risk, maintainability, and future cost. | `workspaces/engineering-build/AGENTS.md` |
| evals | `ai-evals`, `building-with-llms` | Define AI behavior tests, metrics, failure cases, and release gates. | `workspaces/engineering-build/templates/TEST_CASE_TEMPLATE.md` |
| engineering collaboration | `cross-functional-collaboration`, `stakeholder-alignment`, `engineering-culture` | Improve PM-engineering alignment and decision communication. | `workspaces/engineering-build/templates/CODE_REVIEW_TEMPLATE.md` |

## 6. ai-trend-radar Mapping

| APB Task | Recommended Lenny Skills | How to Use | Required APB Template / Workflow |
|---|---|---|---|
| 新技术评估 | `evaluating-new-technology`, `ai-product-strategy`, `building-with-llms` | Assess whether a technology matters and how it could become a product capability. | `workspaces/ai-trend-radar/templates/TREND_RESEARCH_TEMPLATE.md` |
| 产品机会 | `startup-ideation`, `problem-definition`, `measuring-product-market-fit` | Convert signals into user problems, target users, and MVP opportunities. | `workspaces/ai-trend-radar/templates/AI_PRODUCT_OPPORTUNITY_TEMPLATE.md` |
| 市场趋势 | `competitive-analysis`, `platform-strategy`, `positioning-messaging` | Analyze market movement, positioning gaps, and competitive implications. | `workspaces/ai-trend-radar/templates/AI_WEEKLY_REPORT_TEMPLATE.md` |
| 用户反馈 | `analyzing-user-feedback`, `conducting-user-interviews`, `designing-surveys` | Turn community or user signals into insight themes and research questions. | `workspaces/ai-trend-radar/templates/TREND_RESEARCH_TEMPLATE.md` |
| 社区信号 | `community-building`, `content-marketing`, `launch-marketing` | Interpret public signals carefully, distinguishing fact, opinion, and speculation. | `workspaces/ai-trend-radar/workflows/trend-research.md` |

## 7. Recommended Use Levels

These use levels are Lenny-specific APB helper levels. They are different from the global reuse levels in `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`.

| Use Level | Meaning |
|---|---|
| Primary APB Helper | Strongly aligned with a core APB workflow and often useful as methodology support. |
| Secondary APB Helper | Useful for specific subproblems, but should not lead the whole output. |
| Use When Explicitly Requested | Valuable, but outside the default APB workflow or only relevant in narrower contexts. |
| Not Core APB | Useful personally or organizationally, but not central to APB product-building workflows. |

## 8. Example APB Prompts Using Lenny Skills

1. APB 模式：用 Lenny 的 `problem-definition` 和 `working-backwards` 方法，帮我澄清这个产品想法。
2. APB 模式：结合 Lenny 的 `writing-prds` 方法和 APB `PRD_TEMPLATE`，帮我写这个功能 PRD。
3. APB 模式：用 Lenny 的 `competitive-analysis` 和 `positioning-messaging`，帮我分析这个竞品。
4. APB 模式：用 Lenny 的 `prioritizing-roadmap` 和 `scoping-cutting`，帮我排需求优先级。
5. APB 模式：用 Lenny 的 `conducting-user-interviews`，帮我设计用户访谈提纲。
6. APB 模式：用 Lenny 的 `designing-surveys`，帮我为这个 MVP 设计验证问卷。
7. APB 模式：用 Lenny 的 `measuring-product-market-fit`，帮我判断这个产品是否有 PMF 信号。
8. APB 模式：用 Lenny 的 `design-systems`，帮我评审这个设计系统。
9. APB 模式：用 Lenny 的 `running-design-reviews`，帮我组织一次 UI/UX 评审。
10. APB 模式：用 Lenny 的 `ai-evals`，帮我设计 AI 功能评估标准。
11. APB 模式：用 Lenny 的 `building-with-llms`，帮我判断这个 AI 功能的工程集成方式。
12. APB 模式：用 Lenny 的 `evaluating-new-technology`，帮我判断这个 AI 技术是否值得跟进。
13. APB 模式：用 Lenny 的 `stakeholder-alignment`，帮我整理这个项目的跨团队对齐问题。
14. APB 模式：用 Lenny 的 `launch-marketing` 和 APB 模板，帮我整理这个功能的发布计划。

## 9. Future Options

| Option | Description | Pros | Cons | Current Recommendation |
|---|---|---|---|---|
| Option A: Keep Original + Index | Keep the Lenny repository untouched and maintain APB index / mapping documents. | Lowest risk, respects user-installed repo, avoids breaking Skill discovery. | Duplicate paths remain visible. | Recommended now. |
| Option B: APB wrapper skill later | Create an `apb-lenny-product-toolkit` wrapper Skill later to call Lenny methods through APB templates. | Stronger routing control and APB output consistency. | Requires creating a real custom Skill later. | Consider only after repeated use cases prove stable. |
| Option C: Local copy reorganization later | Reorganize local Skill copies, canonical paths, and duplicate exposure after explicit approval. | Could reduce routing noise. | Highest risk; may affect user-level Skill discovery. | Last resort only, separate task with backup. |

Current recommendation: use Option A. Keep Lenny original structure unchanged, maintain APB-local index and mapping, and revisit wrapper or reorganization only after practical usage data accumulates.
