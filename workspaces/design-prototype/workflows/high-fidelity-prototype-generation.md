# High-fidelity Prototype Generation Workflow

## 1. Purpose

Generate a high-fidelity interactive prototype plan from clarified product requirements.

## 2. When to Use

Use after product scope, user scenario, and platform are clear enough to design page structure and detailed interactions.

## 3. Inputs

- Product brief or PRD
- Target users
- Platform
- User flow
- Visual direction
- Content and data requirements
- Constraints

## 4. Steps

1. Convert requirements into a page list.
2. Convert the page list into user paths.
3. Convert user paths into component structure.
4. Define information architecture and content priority.
5. Define visual system: color, typography, spacing, radius, shadow, icon, and motion.
6. Produce a Figma Prompt.
7. Produce design handoff notes.
8. Add frontend implementation suggestions.

## 5. Outputs

- 页面清单
- 用户路径
- 信息架构
- 视觉系统
- 页面级布局
- 组件级说明
- 交互状态
- 动效说明
- 空状态 / 加载状态 / 错误状态
- Figma Prompt
- 设计交付说明
- 前端实现建议

## 6. Quality Checklist

- Prototype maps to a real user journey.
- Every page has a goal and primary action.
- Visual style is concrete and consistent.
- Component and state specs are complete.
- Handoff notes are useful for engineering.

## 7. Common Mistakes

- Designing pages without a user path.
- Missing state design.
- Overusing motion.
- Producing a beautiful but unbuildable concept.
- Forgetting frontend implementation constraints.

## 8. Example Command

请根据 `templates/HIGH_FIDELITY_PROTOTYPE_TEMPLATE.md` 为这个小程序首页生成高保真交互原型方案，包含页面清单、用户路径、视觉系统、Figma Prompt 和交付工程说明。
