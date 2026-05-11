# APB Mode

## 1. Purpose

本文档定义 APB Mode 的详细行为：触发词、行为顺序、工作区路由、Skills 复用规则、外部工具 Skill 规则、常用示例。

根 `AGENTS.md` 只保留 APB Mode 摘要和指向本文件的链接。当用户说 `APB 模式：...` 时，应参考本文件的完整行为规则。

本文件、`docs/APB_MULTI_THREAD_PROTOCOL.md`、各项目级 `PROJECT_RULES.md` 共同构成 APB 行为协议层。冲突优先级：项目级 `PROJECT_RULES.md` > `docs/APB_MULTI_THREAD_PROTOCOL.md` > 本文件 > 通用 Skill 行为。

## 2. APB Mode Triggers

以下任一表达都触发 APB Mode：

- `APB 模式`
- `AI Product Builder 模式`
- `按我的工作区规则`
- `按 APB 工作流`
- `用我的产品工作区`
- `按 ai-product-builder`

进入 APB Mode 后即按 Section 3 的行为顺序执行。

## 3. APB Mode Behavior

按以下顺序执行：

1. **路由到一个 workspace**（按 Section 4 路由表）。
2. **判断是否复用已有 Skills**：必须先看 frontmatter `name` / `description` / 路径 / 任务匹配，详见 Section 5。
3. **Existing Skill 输出必须服从** matching workspace 的 `AGENTS.md`、templates、workflows。
4. **如果 Skill 风格与 APB template 冲突**，按 APB template 结构重写输出。
5. **任务不清晰时**，先进入 `workspaces/pm-strategy/` 做需求澄清。
6. **涉及最新信息**（竞品、AI 趋势、产品发布、论文、GitHub Trending 等）时，联网验证并标注来源。
7. **涉及真实代码修改**时，路由到 `workspaces/engineering-build/`，先读项目结构 → 输出实现计划 → 小步修改。
8. **涉及重要文件、凭据、部署、鉴权、支付、安全、隐私、生产系统、远程资源**时，先说明影响范围与风险，再小步执行。

## 4. Workspace Routing

| 任务特征 | 路由到 |
|---|---|
| PM / 需求 / PRD / SRS / MRD / 竞品 / 用户旅程 / AI 必要性评估 / 优先级 / 任务拆解 | `workspaces/pm-strategy/` |
| UI / UX / Figma / 设计灵感 / 高保真原型 / 设计系统 / Design Handoff | `workspaces/design-prototype/` |
| 代码 / API / Data Model / MVP / AI 集成 / 测试 / Code Review / 上线检查 | `workspaces/engineering-build/` |
| AI 新闻 / YouTube / GitHub / 论文 / 产品发布 / 趋势 / Demo idea | `workspaces/ai-trend-radar/` |

跨多领域任务：先输出任务拆解，按 PM → Design → Engineering → Radar 顺序协作。
任务不清晰：默认先进入 `pm-strategy` 做需求澄清。

## 5. Existing Skills Reuse Rules

### 核心原则

- Skills 是 **capability providers**，APB workspace templates 是 **final output authority**。
- Workspace templates 优先于 Skill 输出格式。
- Safety rules 优先于所有 Skill 行为。
- 不因为 Skill 名字看起来相关就强制使用。
- 如果 Skill frontmatter 不可读，**不要**设为 Primary Reuse。

### Skill Selection Rules

- 优先选 task fit 最窄的 Skill。
- 仅当 frontmatter `description` 明确匹配任务时使用。
- 多个 Skill 都匹配时，选最支持 APB workspace 输出的那个。
- 没有 Skill 明确匹配时，直接用 APB workspace workflow。
- Browser / Figma / Playwright / MCP / external-write 类 Skills 需额外谨慎。
- 重复或不清晰的 Skill 默认不优先；同名同描述出现在多个路径时，**不删除、不移动、不禁用**。

### Skill Conflict Rules

- Workspace 规则覆盖通用 Skill 行为。
- Templates 覆盖通用 Skill 输出格式。
- Safety rules 覆盖所有 Skill 行为。
- 不确定时使用 APB workspace workflow，而不是强制用 Skill。
- 如 Skill 输出与 APB templates 不一致，重格式化为 APB templates。

### Reference Documents

- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`：完整决策矩阵 + 6 类重用等级（Primary Reuse / Secondary Support / Use When Task Requires External Context / Use Only When Explicitly Requested / Do Not Prefer / Duplicate / Review Later）。
- `skills-plan/LENNY_SKILLS_INDEX.md`：86 个 Lenny skills 的 APB 索引。
- `skills-plan/LENNY_SKILLS_APB_MAPPING.md`：Lenny skills ↔ APB 工作区任务映射。

## 6. External Tool Skill Rules

外部工具 Skills 包括：browser、Figma、Playwright、MCP、其他 external-write 类 Skills。

### 默认行为

- **纯推理 / 纯写作 / 纯模板生成**任务**不默认**使用外部工具 Skills。
- 仅当任务**明确需要**最新信息、网页、Figma context、UI 检查、Playwright 自动化、外部验证时使用。

### 使用前提

- 使用前必须**说明目的与范围**。
- 写操作 / 配置变更 / 远程资源修改 / 凭据使用 / 登录态访问 / 生产系统动作 / 外部副作用前**必须用户明确确认**。

### 重要说明

外部工具 Skills **不是禁用项**——它们在明确需要外部上下文时是合理工具。规则只是要求：不要因为它们存在就默认使用，更不要在写操作前跳过用户确认。

## 7. APB Mode Examples

所有示例都以 `APB 模式：...` 起手，无需再指定工作区。

### PM Strategy

- `APB 模式：帮我澄清这个产品想法，并按 pm-strategy 的需求澄清流程输出。`
- `APB 模式：帮我写这个功能的 PRD，输出必须符合 PRD_TEMPLATE。`
- `APB 模式：评估这个 AI 功能是否真的需要 Agent，按 AI_FEATURE_EVALUATION_TEMPLATE 输出。`
- `APB 模式：帮我做竞品分析，并输出差异化机会和下一步行动。`
- `APB 模式：把这些需求按 RICE 和 P0/P1/P2 排优先级。`

### Design Prototype

- `APB 模式：基于这个 PRD 生成高保真原型方案和 Figma Prompt。`
- `APB 模式：评审这张页面截图，按 UI_AUDIT_TEMPLATE 输出。`
- `APB 模式：把这个设计方向整理成 Design Handoff。`

### Engineering Build

- `APB 模式：基于这个 PRD 和设计交付，生成 MVP_BUILD_PLAN。`
- `APB 模式：设计这个 AI 功能的工程集成方案，按 AI_INTEGRATION_TEMPLATE 输出，含 fallback / 评估 / 成本 / 延迟。`

### AI Trend Radar

- `APB 模式：搜索最近一周 AI Agent 趋势，并按 AI_WEEKLY_REPORT_TEMPLATE 输出。`
- `APB 模式：把这篇论文转成产品洞察和可验证 Demo。`

更多示例与 Lenny skills 调用方式见 `skills-plan/LENNY_SKILLS_APB_MAPPING.md`。

## 8. Cross References

- 多线程协作详细协议：`docs/APB_MULTI_THREAD_PROTOCOL.md`
- 项目级模板：`projects/_PROJECT_TEMPLATE/`
- 多线程启动 Prompt：`prompts/thread-start/`
- 长期记忆：`memory/USER_PROFILE.md` / `memory/GLOBAL_CONTEXT.md` / `memory/DECISION_LOG.md` / `memory/TERMINOLOGY.md`
