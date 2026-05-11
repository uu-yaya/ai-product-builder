# 02-design — Design Prototype 产物

## 用途

本目录存放 Design Prototype 线程的项目级产物。方法论与模板见 `workspaces/design-prototype/`。

## 应放什么

- Design Brief（设计简报）
- UI Audit（UI/UX 评审记录）
- Figma Prompt（用于 Figma Make / Figma AI / v0 / Cursor 的设计 Prompt）
- High-fidelity Prototype Spec（高保真原型说明）
- Design System（项目级设计 token / 组件 / 状态）
- Design Handoff（交付工程的实现说明）

## 推荐文件命名

- `DESIGN_BRIEF_<feature-slug>.md`
- `UI_AUDIT_<page-slug>.md`
- `FIGMA_PROMPT_<feature-slug>.md`
- `HIGH_FIDELITY_PROTOTYPE_<feature-slug>.md`
- `DESIGN_SYSTEM_<scope-slug>.md`
- `DESIGN_HANDOFF_<feature-slug>.md`

## 写作要点

- 设计前先确认 `01-pm/PRD_<feature-slug>.md` 已存在；否则回 `01-pm/` 澄清需求。
- 必须覆盖默认、悬停、按下、聚焦、禁用、加载、错误、成功、空状态等组件状态。
- 设计灵感只提炼模式，不照抄具体作品。
- 设计 token 命名稳定、英文、可交付工程。
- Figma Prompt 可输出英文版本，方便给设计/原型工具直接使用。

## 不应放什么

- 通用设计模板（属于 `workspaces/design-prototype/templates/`）。
- 真实 Figma 文件（链接放进 `00-context/LINKS.md`）。
- 代码实现（属于 `03-engineering/`）。
