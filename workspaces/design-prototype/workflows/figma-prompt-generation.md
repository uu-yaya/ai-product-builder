# Figma Prompt Generation Workflow

## 1. Purpose

Convert product requirements or design briefs into tool-ready prompts for Figma Make, Figma AI, v0, Cursor, or similar prototype tools.

## 2. When to Use

Use when the product goal and page requirements are clear enough to generate a design direction or prototype prompt.

## 3. Inputs

- Product goal
- Target user
- Platform
- User scenario
- Page list
- Visual direction
- Content priority
- Component requirements
- Interaction states

## 4. Steps

1. Check whether the product goal, target user, platform, and key flow are clear.
2. Produce a Chinese design breakdown.
3. Define page structure, layout, components, interaction states, empty / loading / error states, and responsive rules.
4. Define visual tokens for color, typography, spacing, radius, shadow, and motion.
5. Write a precise English Figma Prompt.
6. Add an iteration prompt for refinement.

## 5. Outputs

- 中文设计拆解
- 英文 Figma Prompt
- 页面结构
- 组件说明
- 交互状态
- 视觉 tokens
- 可继续迭代的 Prompt

## 6. Quality Checklist

- Prompt is specific and tool-ready.
- Visual style is concrete, not vague.
- Component states and responsive rules are included.
- Prompt avoids copying specific products or design works.
- Output can be handed to a design/prototype tool directly.

## 7. Common Mistakes

- Writing generic prompts like “make it modern and clean.”
- Missing platform and screen constraints.
- Missing component states.
- Forgetting microcopy.
- Copying a reference product too closely.

## 8. Example Command

请根据 `templates/FIGMA_PROMPT_TEMPLATE.md` 把这个页面需求转成 Figma Make 可用的英文 Prompt，并附上中文设计拆解和可迭代 Prompt。
