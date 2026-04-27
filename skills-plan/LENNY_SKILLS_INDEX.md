# Lenny Skills APB Index

## 1. Purpose

This document indexes the local Lenny skills for AI Product Builder usage.

It does not modify the original Lenny repository. It does not delete, move, rename, disable, or reinstall any Skill. It only helps APB understand which Lenny methods may be useful when working inside APB workspaces.

Lenny skills are treated as reusable methodology resources. APB remains responsible for workspace routing, templates, workflows, output standards, and safety boundaries.

## 2. Source and Structure

| Item | Value |
|---|---|
| Lenny repo path | `/Users/yayauu/.agents/skills/lenny-skills/` |
| Git repo | Yes |
| Skill count | 86 |
| Skills directory | `/Users/yayauu/.agents/skills/lenny-skills/skills/` |
| README | Present |
| Category metadata | Exposed through README categories |
| Root-level duplicate | Yes. Each audited Lenny Skill also appears under `/Users/yayauu/.agents/skills/<skill-name>/SKILL.md` with matching name and description. |

The local Lenny repository is suitable as a source of product management, strategy, leadership, research, growth, AI, and execution methods. Because the same metadata is also exposed at root-level Skill paths, APB should avoid assuming that duplicate paths mean different capabilities.

## 3. Duplicate Meaning

`Duplicate / Review Later` does not mean a Skill is low quality, untrusted, or should be deleted.

It only means the same or highly similar Skill metadata is exposed through multiple local paths. This can create routing noise if an assistant treats both paths as distinct preferred tools.

Current APB policy:

- Do not delete any duplicate Skill.
- Do not move any duplicate Skill.
- Do not disable any duplicate Skill.
- Record duplicate relationships for routing clarity.
- Prefer APB workspace rules, templates, and workflows as the final output authority.

## 4. Lenny Skills Inventory

This table focuses on APB high-frequency skills and adjacent Lenny methods that are most likely to help PM, design, engineering, and radar workflows.

| Skill Name | Category | Description Summary | Root Duplicate? | Suggested APB Workspace | Notes |
|---|---|---|---|---|---|
| `writing-prds` | Strategy & Planning | PRD writing and product requirement structure. | Yes | `pm-strategy` | Primary APB helper for PRD drafting, but APB `PRD_TEMPLATE.md` remains authoritative. |
| `competitive-analysis` | Strategy & Planning | Competitor research, comparison, and opportunity analysis. | Yes | `pm-strategy` | Useful for market and competitor framing; must map output to APB competitor template. |
| `ai-product-strategy` | AI & Technology | AI product strategy and product judgment around AI capabilities. | Yes | `pm-strategy` | Useful for AI feature strategy; APB still requires explicit AI necessity evaluation. |
| `prioritizing-roadmap` | Strategy & Planning | Roadmap prioritization and sequencing. | Yes | `pm-strategy` | Supports RICE, P0/P1/P2, scope trade-offs, and roadmap decisions. |
| `writing-specs-designs` | Shipping & Execution | Writing specs and design documents for execution alignment. | Yes | `pm-strategy`, `engineering-build` | Useful bridge between PM specs and engineering plans. |
| `problem-definition` | User Research & Discovery | Clarifying user problems and product opportunities. | Yes | `pm-strategy` | Strong fit for requirement clarification before PRD writing. |
| `working-backwards` | Strategy & Planning | Working backward from customer value and outcomes. | Yes | `pm-strategy` | Useful for product vision, launch narrative, and outcome-first thinking. |
| `scoping-cutting` | Shipping & Execution | Cutting scope and defining feasible releases. | Yes | `pm-strategy`, `engineering-build` | Useful for MVP boundaries and implementation trade-offs. |
| `analyzing-user-feedback` | User Research & Discovery | Synthesizing feedback into themes and product decisions. | Yes | `pm-strategy`, `ai-trend-radar` | Good for feedback-to-insight workflows. |
| `conducting-user-interviews` | User Research & Discovery | Planning and running user interviews. | Yes | `pm-strategy` | Useful for discovery plans and interview scripts. |
| `designing-surveys` | User Research & Discovery | Designing surveys for user research and validation. | Yes | `pm-strategy` | Useful for research planning and PMF signal collection. |
| `measuring-product-market-fit` | Strategy & Planning | Measuring PMF and market traction. | Yes | `pm-strategy`, `ai-trend-radar` | Helps convert trend or feedback signals into PMF questions. |
| `design-systems` | Shipping & Execution | Design system principles and governance. | Yes | `design-prototype` | Good helper for design system review; APB design templates remain final. |
| `running-design-reviews` | Shipping & Execution | Running structured design reviews. | Yes | `design-prototype` | Strong fit for UI/UX review workflows. |
| `behavioral-product-design` | User Research & Discovery | Behavior-informed product design. | Yes | `design-prototype`, `pm-strategy` | Useful for habit, motivation, and user behavior analysis. |
| `product-taste-intuition` | Strategy & Planning | Developing product taste and qualitative judgment. | Yes | `design-prototype`, `pm-strategy` | Useful as critique lens, not as standalone output format. |
| `user-onboarding` | Growth & Monetization | Onboarding and activation experience design. | Yes | `pm-strategy`, `design-prototype` | Useful for activation flows and first-run experience. |
| `building-with-llms` | AI & Technology | Building product experiences with LLMs. | Yes | `engineering-build`, `pm-strategy` | Supports AI integration decisions; APB AI templates control final output. |
| `ai-evals` | AI & Technology | Evaluation methods for AI systems. | Yes | `engineering-build`, `pm-strategy` | Strong fit for AI evaluation metrics, test cases, and acceptance criteria. |
| `evaluating-new-technology` | AI & Technology | Assessing whether new technology is worth adopting. | Yes | `ai-trend-radar`, `engineering-build` | Useful for trend-to-adoption decisions; fresh claims need verification. |
| `technical-roadmaps` | AI & Technology | Technical roadmap planning. | Yes | `engineering-build` | Useful if present locally; use APB engineering roadmap and risk format. |
| `managing-tech-debt` | AI & Technology | Tech debt prioritization and communication. | Yes | `engineering-build` | Helpful for technical planning and launch risk trade-offs. |
| `shipping-products` | Shipping & Execution | Product shipping discipline and release execution. | Yes | `engineering-build`, `pm-strategy` | Useful for launch readiness and execution planning. |
| `positioning-messaging` | Growth & Monetization | Positioning, messaging, and narrative clarity. | Yes | `pm-strategy`, `design-prototype` | Useful for product copy, launch narrative, and differentiation. |
| `pricing-strategy` | Growth & Monetization | Pricing and monetization strategy. | Yes | `pm-strategy` | Use for pricing hypotheses; avoid financial advice framing. |
| `launch-marketing` | Sales & Go-to-Market | Launch planning and go-to-market messaging. | Yes | `pm-strategy`, `ai-trend-radar` | Useful for launch planning, market signals, and announcement strategy. |
| `stakeholder-alignment` | Leadership & Alignment | Aligning stakeholders around decisions and trade-offs. | Yes | `pm-strategy`, `engineering-build` | Useful for decision memos and cross-functional alignment. |

Additional Lenny skills should be selected by reading their `SKILL.md` frontmatter name, description, and path, then checking fit against the APB task and workspace template.

## 5. Category Summary

| Category | Typical Skills | APB Value | Default Use Level |
|---|---|---|---|
| Hiring & Team Building | `evaluating-candidates`, `onboarding-new-hires`, `building-team-culture` | Useful for organization and hiring topics, but not core to APB product building. | Use When Explicitly Requested |
| User Research & Discovery | `problem-definition`, `conducting-user-interviews`, `designing-surveys`, `analyzing-user-feedback`, `behavioral-product-design` | Strong support for requirement clarification, user insight, and PM strategy. | Primary APB Helper |
| Strategy & Planning | `writing-prds`, `competitive-analysis`, `prioritizing-roadmap`, `working-backwards`, `measuring-product-market-fit` | High-value support for APB product brain workflows. | Primary APB Helper |
| Shipping & Execution | `writing-specs-designs`, `scoping-cutting`, `shipping-products`, `running-design-reviews`, `design-systems` | Supports scope control, delivery planning, reviews, and design-to-engineering alignment. | Secondary APB Helper |
| Leadership & Alignment | `stakeholder-alignment`, `running-decision-processes`, `managing-up`, `cross-functional-collaboration` | Useful for decision clarity, stakeholder communication, and execution alignment. | Secondary APB Helper |
| Growth & Monetization | `user-onboarding`, `retention-engagement`, `pricing-strategy`, `positioning-messaging`, `designing-growth-loops` | Helps APB connect product strategy with adoption, retention, monetization, and messaging. | Secondary APB Helper |
| Sales & Go-to-Market | `launch-marketing`, `product-led-sales`, `enterprise-sales`, `founder-sales` | Useful when APB work includes launch, GTM, sales motion, or commercial positioning. | Use When Explicitly Requested |
| Career Development | `building-a-promotion-case`, `career-transitions`, `finding-mentors-sponsors`, `coaching-pms` | Valuable for personal development, but not core to APB workspace outputs. | Not Core APB |
| AI & Technology | `ai-product-strategy`, `building-with-llms`, `ai-evals`, `evaluating-new-technology`, `managing-tech-debt` | Strong support for AI product judgment, AI engineering planning, and trend adoption decisions. | Primary APB Helper |

## 6. Maintenance Notes

- If the Lenny repository is updated, regenerate this index from local `SKILL.md` frontmatter.
- If root-level duplicate paths change, run a new duplicate audit before changing APB reuse policy.
- If a Skill is frequently triggered incorrectly, record concrete cases before considering any disable or cleanup decision.
- Any directory restructuring must be handled as a separate task with backups and explicit user confirmation.
- APB should continue to treat Lenny skills as methodology helpers while enforcing APB workspace templates as the final output structure.
