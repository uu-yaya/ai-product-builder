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

## 维护规则

- 决策提议者可以是任何线程，但 `Accepted` / `In Effect` 状态由 Main Thread 确认。
- 决策被替代时不要删除原条目，新增一行 `Superseded`，并在 Reason 中链到新决策。
- 涉及合规、隐私、内容安全的决策必须在 `Impact` 列注明影响范围。
- 不在本文件写入凭据、真实玩家数据或未脱敏内部资料。
