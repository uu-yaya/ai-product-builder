# Task Board

项目级任务分配与阻塞跟踪。Main Thread 维护，其他线程通过 `06-sync/group/` 投递新增 / 状态变更。

## 状态字段说明

- **Status**：Backlog / In Progress / Blocked / In Review / Done / Dropped

## 任务清单

| Task ID | Owner Thread | Task | Inputs | Outputs | Status | Blockers |
|---|---|---|---|---|---|---|
| T-001 | PM Strategy Thread | 基于 PROJECT_CONTEXT 输出 desktop-pet MVP 的需求澄清 + AI 必要性评估 | `00-context/PROJECT_CONTEXT.md` + `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` + `04-research/TREND_RESEARCH_steam-popular-desktop-pet-games.md` + `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` | `01-pm/REQUIREMENT_CLARIFICATION_desktop-pet-mvp.md` + `01-pm/AI_FEATURE_EVALUATION_desktop-pet-mvp.md` | Backlog | (none) |
| T-002 | AI Trend Radar Thread | 调研市面陪伴类桌宠 / AI companion 产品的一般功能模式，重点提炼 AI 功能与非 AI 辅助功能 | `00-context/PROJECT_CONTEXT.md` | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` | Done | (none) |
| T-003 | AI Trend Radar Thread | 多 Radar agent 分片补全产品证据矩阵，要求每个产品的每个 AI 功能点单独拆行并解释 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` | `04-research/COMPETITOR_AI_FEATURE_MATRIX_PART_*.md` + `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | Done | (none) |
| T-004 | AI Trend Radar Thread | 进一步核实产品证据矩阵中的待核验清单，区分已核实、弱证据、计划未上线、降级参考与仍需实测条目 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | Done | (none) |
| T-005 | Main Thread | 按用户长期输出规则，将产品证据矩阵中的功能点与功能解释中文化；仅保留英文产品名与必要专业术语 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | Done | (none) |
| T-006 | Main Thread | 调整 Excel 产品证据矩阵展示：连续相同 Product 合并为单个纵向单元格并居中显示 | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | Done | (none) |
| T-007 | Main Thread | 精简产品证据矩阵展示列：删除平台、核验状态、核验后处理、功能归类、证据类型 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + `04-research/COMPETITOR_AI_FEATURE_MATRIX_companion-desktop-pet-products.xlsx` | Done | (none) |
| T-008 | Main Thread | 综合用户观点、AI 能力与非 AI 支撑，输出 desktop-pet 最终功能点总结表，补充体验好的非 AI 功能、共同抚养 / Shared Pet Mode、功能优先级表，并在文末附调研产品 URL 表 | `04-research/TREND_RESEARCH_companion-desktop-pet-products.md` + 用户观点 | `04-research/FEATURE_SUMMARY_ai-non-ai-desktop-pet.md` | Done | (none) |
| T-009 | AI Trend Radar Thread | 调研 macOS OpenChronicle 与 Windows 对标框架栈，为 desktop-pet 记忆系统的 PC 端上下文采集提供技术参考 | `00-context/PROJECT_CONTEXT.md` | `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` + `06-sync/group/2026-05-08T18-53-39_radar_desktop-context-memory-frameworks.md` | Done | (none) |
| T-010 | PM Strategy Thread | 把记忆系统“采什么 / 不采什么 / 存多久 / 用户如何控制”转成需求澄清与隐私边界 | `00-context/PROJECT_CONTEXT.md` + `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` | `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` + `06-sync/group/2026-05-08T19-32-24_pm_completed-memory-system-clarification.md` | Done | (none) |
| T-011 | Engineering Build Thread | 设计跨平台 `Context Capture Adapter` 技术方案，优先覆盖 macOS active app、Windows foreground window 与 game event schema | `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` + `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` | `03-engineering/TECHNICAL_DESIGN_context-capture-adapter.md` | Backlog | (none) |
| T-012 | Design Prototype Thread | 设计 Memory Center 信息架构，用于展示、删除、禁用、纠错记忆与解释上下文来源 | `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` + `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md` + `01-pm/PRIVACY_BOUNDARY_memory-system.md` | `02-design/DESIGN_BRIEF_memory-center.md` | Backlog | (none) |
| T-013 | AI Trend Radar Thread | 修复性能研究 Markdown 表格渲染规则与源文件，统一使用 GFM pipe table | `04-research/PERFORMANCE_METRICS_BEGINNER_GUIDE.md` + `04-research/PERFORMANCE_RESEARCH_desktop-pet-products.md` | `04-research/PERFORMANCE_METRICS_BEGINNER_GUIDE.md` + `04-research/PERFORMANCE_RESEARCH_desktop-pet-products.md` + `PROJECT_RULES.md` + `06-sync/group/2026-05-08T23-36-31_radar_markdown-table-rendering-fix.md` | Done | (none) |
| T-014 | AI Trend Radar Thread | 调研 Steam 上类似 Bongo Cat 的桌宠类流行游戏，提炼 MVP 路线、商业模式和 AI 必要性启发 | `00-context/PROJECT_CONTEXT.md` | `04-research/TREND_RESEARCH_steam-popular-desktop-pet-games.md` + `06-sync/group/2026-05-09T_radar_steam-popular-desktop-pet-games.md` | Done | (none) |

## 维护规则

- Task ID 自增，建议 `T-<3 位数>`。
- Owner Thread 必须是 `THREAD_REGISTRY.md` 中已登记的线程。
- Inputs / Outputs 使用项目内相对路径，例如 `01-pm/PRD_<feature-slug>.md`。
- 任务进入 In Review 后，必须有对应 `05-reviews/` 评审文件链接。
- 阻塞超过 3 天必须在 `06-sync/group/` 发一条状态消息，并由 Main 在 `SYNC_SUMMARY.md` 标注。
