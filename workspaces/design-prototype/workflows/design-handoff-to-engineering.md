# Design Handoff to Engineering Workflow

## 1. Purpose

Convert a design plan or prototype into engineering-ready implementation notes.

## 2. When to Use

Use after the design direction, pages, components, states, and interactions are defined.

## 3. Inputs

- Prototype or design brief
- Page list
- Component list
- Design tokens
- Interaction notes
- Data display rules
- Platform constraints

## 4. Steps

1. List related pages and page structure.
2. Extract component inventory and variants.
3. Define design tokens.
4. Define state specs for empty, loading, error, success, disabled, focused, and selected states.
5. Define interaction specs and data display rules.
6. Add frontend implementation notes.
7. Add acceptance criteria and open questions.

## 5. Outputs

- 页面结构
- 组件清单
- 设计 token
- 状态说明
- 交互说明
- 数据展示规则
- 前端实现注意事项
- 验收标准
- 待确认问题

## 6. Quality Checklist

- Handoff can be used by engineering without guessing core UI behavior.
- Tokens and component names are consistent.
- Edge states are covered.
- Data display rules are clear.
- Acceptance criteria are testable.

## 7. Common Mistakes

- Sending only screenshots without specs.
- Missing state design.
- Missing responsive behavior.
- Leaving data display rules ambiguous.
- Asking engineering to infer visual tokens.

## 8. Example Command

请根据 `templates/DESIGN_HANDOFF_TEMPLATE.md` 把这个设计方案整理成交付工程的说明，包含页面结构、组件清单、设计 token、状态说明、数据展示规则和验收标准。
