# Project Decision Log

记录本项目的关键架构、范围、AI 方案、设计、工程、上线、合规等决策。
每条决策都要留下推理依据，便于后续线程或新协作者快速理解项目走到这一步的原因。

## 字段说明

- **Date**：决策落地日期，YYYY-MM-DD。
- **Area**：Project Setup / Scope / AI / Design / Engineering / Launch / Risk / Compliance / Other。
- **Decision**：一句话写明做了什么决定。
- **Reason**：为什么这样决定（背景 + 比较过的备选）。
- **Impact**：影响哪些线程 / 哪些产物 / 哪些指标。
- **Status**：Proposed / Accepted / In Effect / Superseded / Rejected。

## 决策表

| Date | Area | Decision | Reason | Impact | Status |
|---|---|---|---|---|---|
| YYYY-MM-DD | Project Setup | Use this project template for APB outputs | Keep project artifacts separate from APB workspace methods | Improves clarity and multi-thread collaboration | Proposed |
| 2026-04-28 | Project Setup | desktop-pet 项目从 `_PROJECT_TEMPLATE` 复制创建，定位为公司业务方向探索（游戏 AI 桌宠 SDK），按 APB Safety Rules 不写入公司机密 / 真实业务数据 / 内部代号 / 合作方信息 | 验证 APB 多线程协议；探索“可赋能多游戏的 AI 桌宠 SDK”产品形态 | 启用全部 5 个工作区目录；Stage = Discovery；所有产物按 `memory/GLOBAL_CONTEXT.md` 的 Safety Notes 脱敏处理 | Accepted |
| 2026-05-09 | Compliance | P0 记忆系统采集策略提议为白名单式 `Context Lite Memory`：first-party game events、用户主动对话 / 反馈、桌宠互动偏好、低敏 active app / window title / idle context；默认不采集 Recall 式后台截图、系统音频、键盘输入、跨 app 全文和 raw OS context 云端上传 | Radar 与 PM 已分别输出技术框架调研、需求澄清和隐私边界；该策略能降低“监控电脑”感知，但仍需用户确认默认开关、保留期、云端 LLM 边界和跨游戏共享策略 | 影响 PM T-001、Design Memory Center、Engineering Context Capture Adapter 与后续隐私评审；在用户确认前不能视为最终上线范围 | Proposed |
| 2026-05-09 | Project Setup | 项目研究文档统一使用 GitHub Flavored Markdown pipe table，不再使用 HTML table 作为 `.md` 表格表达 | Radar 已修复性能研究文档的表格渲染问题，并把规则写入 `PROJECT_RULES.md` §5.1；GFM pipe table 更适合 Codex / GitHub / 本地预览一致渲染 | 影响后续 `04-research/` 表格类产物与跨线程 Markdown 交付规范 | Accepted |

## 维护规则

- 决策提议者可以是任何线程，但 `Accepted` / `In Effect` 状态由 Main Thread 确认。
- 决策被替代时不要删除原条目，新增一行 `Superseded`，并在 Reason 中链到新决策。
- 涉及合规、隐私、内容安全的决策必须在 `Impact` 列注明影响范围。
- 不在本文件写入凭据、真实玩家数据或未脱敏内部资料。
