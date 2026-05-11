# NEW_PROJECT_INIT — 新项目启动模板

## 1. Prompt Name

`NEW_PROJECT_INIT`

## 2. 用途

启动一个**全新的 APB 项目**。本模板把以下 5 件事一次性完成：

1. 复制 `_PROJECT_TEMPLATE` → `projects/<slug>/`
2. 填 `00-context/PROJECT_CONTEXT.md`
3. 登记 `06-sync/THREAD_REGISTRY.md`（Main Active + 其他 Idle）
4. 建立 T-001 任务 + 写 `06-sync/SYNC_SUMMARY.md`
5. 在 `decisions/DECISION_LOG.md` 写第一条 Accepted 决策

适用：

- 真实业务方向探索 / 个人产品 / 学习实验 / APB 协议验证 pilot——所有类型都用同一模板
- 跨 runtime 通用（Claude Code / Codex / Cowork）

**注意**：本模板用于**首次 init**。如果项目已存在、想重启 Main Thread，请用 `MAIN_THREAD_START.md`。

---

## 3. 标准启动 7 步

### 步骤 1：终端复制项目骨架（30 秒）

```bash
cd /Users/yayauu/ai-product-builder

# 选定 slug：英文小写短横线
export PROJ_SLUG="<your-slug>"
# 例：game-ai-npc-toolkit / aigc-asset-pipeline / desktop-pet / internal-prd-helper

cp -r projects/_PROJECT_TEMPLATE projects/$PROJ_SLUG

# 验证：应看到 30 文件（含 .gitkeep 占位）
find projects/$PROJ_SLUG -type f | wc -l
ls projects/$PROJ_SLUG
```

### 步骤 2：在脑中（或纸上）回答 7 个前置问题

| # | 字段 | 不知道就写 |
|---|---|---|
| Q1 | 项目中文 / 英文名 | 必填 |
| Q2 | 一句话定义这是什么 | 必填 |
| Q3 | 主要用户 / 次要用户 / 反向用户 | 必填（至少主要用户） |
| Q4 | 北极星目标（含数字最佳） | `TBD by user` |
| Q5 | 核心场景（2–3 个） | `TBD by user` |
| Q6 | 是否真的需要 AI + 候选方案 | `需要 AI；候选方案 TBD by user` |
| Q7 | 主要约束（合规 / 跨平台 / 时间 / 数据） | 必填 |

> **规则**：不确定的字段一律写字面量 `TBD by user`。**不要**写"待补充" / "暂定" / "（占位）"——AI 不识别这些，可能当成已确认值写入。

### 步骤 3：决定项目定性（**关键，不能跳过**）

一句话回答：本项目是 A / B / C / D 哪一类？

| 类别 | 描述 | DECISION_LOG 写法（步骤 5 用） |
|---|---|---|
| A | 个人产品（业余 / 自用） | "定位为个人产品（非工作项目）" |
| B | 公司业务方向探索（工作角色驱动） | "定位为公司业务方向探索（XXX 主题），按 APB Safety Rules 不写入公司机密 / 真实业务数据 / 内部代号 / 合作方信息" |
| C | APB 协议 / 工作流验证 pilot（无业务目标） | "定位为 APB 多线程协议验证 pilot，本项目可在验证完成后归档为参考" |
| D | 学习 / 实验项目（无明确商业目标） | "定位为个人技术学习项目，无商业目标" |

**为什么必须先选**：DECISION_LOG 一旦写错（例如 Q7 说"公司业务"但 Decision 写"个人产品"），后续要走类似 Step 10G 的对齐才能修。**先确定再发 prompt 是最便宜的修复时机**。

### 步骤 4：选 runtime 标签

你**当前**用什么工具发 prompt？

| 工具 | runtime 标签 |
|---|---|
| Cowork（claude.ai 桌面版） | `Cowork(Claude)` |
| Claude Code CLI | `Claude Code` |
| Codex CLI | `Codex` |
| OpenClaw | `OpenClaw` |

### 步骤 5：复制下面整段 Prompt，把 `<...>` 全部替换后发送

````
APB 模式：你是 projects/<PROJ_SLUG>/ 的 Main Thread。

【强制前置】
1. 输出 pwd（必须以 /Users/yayauu/ai-product-builder 开头）。
2. 读取：
   - /Users/yayauu/ai-product-builder/AGENTS.md
   - /Users/yayauu/ai-product-builder/docs/APB_MULTI_THREAD_PROTOCOL.md
   - /Users/yayauu/ai-product-builder/memory/USER_PROFILE.md
   - /Users/yayauu/ai-product-builder/memory/GLOBAL_CONTEXT.md
   - /Users/yayauu/ai-product-builder/projects/<PROJ_SLUG>/PROJECT_RULES.md
   - /Users/yayauu/ai-product-builder/projects/<PROJ_SLUG>/00-context/PROJECT_CONTEXT.md
3. 输出 Will read / Will write / Will not modify（每条用绝对路径）。

【用户提供的初始上下文】
- Q1 项目名: <Q1_中英文名>
- Q2 一句话定义: <Q2>
- Q3 主要用户: <Q3，含主要 / 次要 / 反向>
- Q4 北极星目标: <Q4 具体值 OR 字面 "TBD by user">
- Q5 核心场景: <Q5 具体场景 OR 字面 "TBD by user">
- Q6 AI 必要性候选方案: <Q6 具体方案 OR "需要 AI；候选方案 TBD by user">
- Q7 主要约束: <Q7>
- 项目定性: <步骤 3 选的 A / B / C / D + 一句话>
- runtime: <步骤 4 选的标签>
- 启动日期: <YYYY-MM-DD>

【任务】项目初始化，做以下 5 件事，全部落到对应文件：

1. 改写 projects/<PROJ_SLUG>/00-context/PROJECT_CONTEXT.md：
   - Project Name = <Q1>
   - Project Slug = <PROJ_SLUG>
   - Project Stage = Discovery
   - Owner = uu (Tencent IEG, AI PM)
   - Start Date = <启动日期>
   - Background = 基于 Q2 + Q7 + 项目定性展开 1 段
   - Product Goal = 如 Q4 是 TBD，写"待 PM Thread 通过 T-001 确认"+ 1 句方向；如具体，明确北极星 + 1-2 条业务目标 + 非目标
   - Target Users = 基于 Q3 写主要画像 + 反向用户
   - Core Scenarios = 如 Q5 是 TBD，标 TBD 并给 PM Thread 留 ≥3 个候选方向；如具体，列 2-3 个一句话场景
   - Key Features = 至少 5 条 P0/P1/P2，每条标"(候选，PM Thread 在 T-001 中确认)"
   - AI Capabilities = 严格按 PM Strategy AGENTS.md 的 AI Product Evaluation Principles 列候选方案（Rule-based / Search / RAG / LLM Prompt + Function Calling / Agent / Workflow / Fine-tuning / 推荐系统），每个方案一句话适用边界 + 风险，**不下推荐结论**——把推荐留给 AI_FEATURE_EVALUATION
   - Tech Stack = TBD by user（除非 Q7 已明确）
   - Constraints = 严格按 Q7
   - Open Questions = 至少 7 条，必须覆盖：(1) Q4 北极星指标具体化；(2) Q5 核心场景具体化；(3) AI 方案选择；(4) Tech Stack；(5) Distribution；(6) 数据隐私边界；(7) 商业模式
   - Related Links = 留空 placeholder

2. 在 projects/<PROJ_SLUG>/06-sync/THREAD_REGISTRY.md 把 Main Thread 状态改为 Active，Last Update = <启动日期>，runtime = <runtime 标签>。其他 4 个线程保持 Idle。

3. 在 projects/<PROJ_SLUG>/06-sync/TASK_BOARD.md 建立 T-001：
   - Owner: PM Strategy Thread
   - Task: 基于 PROJECT_CONTEXT 输出 <PROJ_SLUG> MVP 的需求澄清 + AI 必要性评估
   - Inputs: 00-context/PROJECT_CONTEXT.md
   - Outputs: 01-pm/REQUIREMENT_CLARIFICATION_<PROJ_SLUG>-mvp.md + 01-pm/AI_FEATURE_EVALUATION_<PROJ_SLUG>-mvp.md
   - Status: Backlog
   - Blockers: (none)

4. 在 projects/<PROJ_SLUG>/06-sync/SYNC_SUMMARY.md 写一段精炼 Current Project State：
   - 阶段：Discovery
   - 主线程持有人：uu via <runtime>
   - 当前焦点：完成需求澄清 + AI 必要性评估
   - Latest Decisions：项目从 _PROJECT_TEMPLATE 创建（指向 decisions/DECISION_LOG.md）
   - Open Questions：摘录 PROJECT_CONTEXT 中的 ≥3 条最关键
   - Active Tasks：T-001
   - Next Actions：调用 PM Strategy Thread 接 T-001
   - Last Updated：<启动日期>

5. 在 projects/<PROJ_SLUG>/decisions/DECISION_LOG.md 追加 1 条 Accepted 决策：
   - Date: <启动日期>
   - Area: Project Setup
   - Decision: <PROJ_SLUG> 项目从 _PROJECT_TEMPLATE 复制创建，<步骤 3 选的项目定性表述>
   - Reason: <为什么启这个项目，1-2 句>
   - Impact: 启用全部 5 个工作区目录；Stage = Discovery；所有产物按 memory/GLOBAL_CONTEXT.md 的 Safety Notes 脱敏处理
   - Status: Accepted

【完成输出】严格按 §7 Standard Thread Completion Sequence 5 字段：
- Files created / updated（绝对路径列表）
- Tasks assigned（T-001 摘要）
- Open questions（PROJECT_CONTEXT 里写下的 7+ 条）
- Whether SYNC_SUMMARY was updated（yes，并指出关键变更点）
- Suggested next thread（应是 PM Strategy Thread，给出 PM_THREAD_START 的填充建议）

【中止条件 / 防编造规则】
- pwd / 文件路径不对 → 立刻停止报告，不要继续
- 任何字段值含 "TBD by user" / "待补充" / "TBD" / "暂定" / "占位" / 含括号说明"候选 / 待澄清" → 一律保留为 Open Question，不要替用户决定
- AI Capabilities 段不要给推荐结论，只列候选方案与适用边界
- 不要触碰 workspaces/ / memory/ / ~/.codex/ / ~/.agents/skills/
- 不写入任何公司内部代号 / 真实合作方名 / 真实玩家数据 / 真实 token / API key / secret
- 项目定性（步骤 3）必须严格按用户给出的 A/B/C/D 写入 DECISION_LOG，不要凭 Q1-Q7 推断改写
````

### 步骤 6：终端验证（30 秒）

```bash
cd /Users/yayauu/ai-product-builder
PROJ_SLUG="<your-slug>"

echo "=== 1. PROJECT_CONTEXT 已填 ==="
head -30 projects/$PROJ_SLUG/00-context/PROJECT_CONTEXT.md

echo "=== 2. THREAD_REGISTRY Main = Active + runtime ==="
grep -E "Main Thread|Active|runtime" projects/$PROJ_SLUG/06-sync/THREAD_REGISTRY.md

echo "=== 3. TASK_BOARD T-001 已建立 ==="
grep -A 5 "T-001" projects/$PROJ_SLUG/06-sync/TASK_BOARD.md

echo "=== 4. SYNC_SUMMARY 有 Current Project State ==="
head -20 projects/$PROJ_SLUG/06-sync/SYNC_SUMMARY.md

echo "=== 5. DECISION_LOG 第一条 ==="
tail -10 projects/$PROJ_SLUG/decisions/DECISION_LOG.md

echo "=== 6. 安全扫描（应 0 匹配）==="
grep -rE "sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}" projects/$PROJ_SLUG/ || echo "✅ 无凭据泄漏"
```

### 步骤 7：接力到 PM Thread

跑完 Main 之后，看它输出的 Suggested next thread。一般是 PM Strategy Thread。复制 `prompts/thread-start/PM_THREAD_START.md` 中的 Copyable Prompt，把 `<project-slug>` 替换为 `<PROJ_SLUG>`，把 `<task>` 替换为"接 T-001 输出 REQUIREMENT_CLARIFICATION + AI_FEATURE_EVALUATION"。

---

## 4. 防雷指南（来自 desktop-pet / ai-weekly-radar-2026 实战）

| 雷区 | 症状 | 对策 |
|---|---|---|
| **Decision Log 与现实矛盾** | Q7 说"公司业务"但 prompt 写"个人产品" | 步骤 3 必须明确选 A/B/C/D，不要凭模板默认值往下走 |
| **AI 把示例值当真** | "（待补充）"被当成已确认目标写入 PROJECT_CONTEXT | 任何不确定字段一律写字面量 `TBD by user` |
| **runtime 标签错** | 用 Codex 启动但 prompt 里写 `Cowork(Claude)` | 步骤 4 自己核对 |
| **AI Capabilities 提前结论** | Main 在 PROJECT_CONTEXT 阶段就钉死"用 Agent" | 模板规定"不下推荐结论，留给 AI_FEATURE_EVALUATION" |
| **worktree 隔离导致文件不在主仓库** | "Done" 报告说写了但 ls 看不到 | 步骤 1 在主仓库 cp；步骤 6 用 ls 验证 |
| **写入公司机密 / 内部代号** | DECISION_LOG / PROJECT_CONTEXT 出现真实代号 | 步骤 3 选 B 时明确"不写入机密"；中止条件已写死 |
| **多 runtime 抢同一文件** | Codex 与 Claude 同时改 SYNC_SUMMARY | 同一时间只让一个 runtime 持有 Main Thread |

---

## 5. Safety Notes

- 不写真实玩家数据 / 公司机密 / 内部代号 / 合作方名到任何 PROJECT_CONTEXT 字段。
- 不写真实 token / API key / secret，必要时用 `${ENV_VAR}` 占位。
- 公司业务方向项目（步骤 3 选 B）必须明确 "不写入机密" 约束。
- 项目定性一旦写入 DECISION_LOG，调整需新增 Decision Log 记录，不直接覆盖。
- 不修改 `~/.codex/` / `~/.agents/skills/` / `memory/`（除非用户另行明确要求）。
- 不直接配置 MCP；不运行 `codex mcp add` 或等价命令。

---

## 6. Cross References

- `prompts/thread-start/MAIN_THREAD_START.md`：项目已存在时**重启** Main Thread 用此（不是首次 init）
- `prompts/thread-start/PM_THREAD_START.md` / `DESIGN_THREAD_START.md` / `ENGINEERING_THREAD_START.md` / `RADAR_THREAD_START.md`：四类子线程接力
- `docs/APB_MULTI_THREAD_PROTOCOL.md` §13 Blocker Reporting / §14 Tool-Agnostic Agent Runtime
- `docs/APB_MODE.md`：APB Mode 详细行为规则
- `docs/TOOL_COMPATIBILITY.md`：Claude Code / Codex / Cowork 跨工具对照
- `projects/_PROJECT_TEMPLATE/`：本模板复制的源（含 PROJECT_RULES / 8 个子目录骨架）
- `memory/GLOBAL_CONTEXT.md`：用户长期上下文（Active Projects / Constraints / Safety Notes）

---

## 7. Last Updated

2026-04-28（基于 desktop-pet 启动实战 + Step 10K/10L/10M 协议补丁迭代）
