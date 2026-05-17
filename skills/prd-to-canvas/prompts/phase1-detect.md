# Phase 1 — 解析（执行 agent）

你的角色：**执行 agent**。任务是扫描 PRD，输出所有候选块。

## 输入

- PRD 文件路径（pre-flight 已确认可读）
- `./BLOCK_INVENTORY.md`（17 类块检测规则）

## 输出

`<out>/candidates.json`，符合 `./schemas/candidates.schema.json`。

## 执行步骤

### 1. 读 PRD 全文，按行号编号

每行存 `(line_number, text)` pair。后面所有 candidate 的 `line_start` / `line_end` 用这个编号。

### 2. 按检测优先级扫描

按 `./BLOCK_INVENTORY.md` 中"检测优先级 / 歧义解决"章节的顺序：

```
API-A > API-B > MERMAID > CODE > CALL-N/D > QT > TBL > OL/UL > HR > H > P
```

高优先级先匹配，被匹配的行段从后续扫描中排除（避免重复）。

### 3. 对每个 candidate 决定 confidence

| 等级 | 何时给 |
| --- | --- |
| `high` | 标准 MD 语法明确匹配（如 ` ```api ` / `> [!warning]` / GFM 表格） |
| `medium` | 强启发式（如 emoji ⚠️ + 加粗"注意"、ASCII 表格、API-B 完整结构） |
| `low` | 弱启发式（如孤立加粗段落可能是 H3、长第二人称段落可能是 prompt） |

**Phase 3 必须让用户确认 low + medium 的候选**。high 的也要列在 checklist，但默认勾选状态为 accept。

### 4. 对每个 candidate 决定 action

| action | 含义 | 适用 |
| --- | --- | --- |
| `keep` | 已是 canonical 形式，无需改写 | 已有标准 MD 语法的 candidate |
| `upgrade` | MD 语法升级（如 emoji callout → `> [!warning]`、API-B → A 模式） | 启发式候选 |
| `extract` | 从段落中提取（如 prompt 字符串）+ 在 PRD 中替换为 ref | PROMPT 候选等 |
| `suggest` | canvas-only 块，仅给"可在 canvas 里加"建议，**不写 .md** | MOCK / PROMPT / AGENT / PROTO |

### 5. 对每个 candidate 标记 needs_user_input

如果改写需要用户补字段，列出来。常见值：

| 字段名 | 何时需要 |
| --- | --- |
| `status_codes_4xx_5xx` | API-A / API-B 升级时，PRD 只写了 200 |
| `discussion_url` | CALL-D 候选但 PRD 没明确链接 |
| `mermaid_kind` | MERMAID 候选时图类型不明确（flowchart / sequence / state / gantt） |
| `prompt_name` | PROMPT extract 时需要给 prompt 起个名字 |
| `callout_subtype` | CALL-N 候选但语义不明（note / tip / warning / caution） |

### 6. 生成 rewrite_preview（可选）

对 `action: upgrade` / `extract` 的 candidate，生成一段重写预览（200 字以内），让用户在 checklist 看到"改完会变成什么样"。

示例（API-B → A 模式预览）：

````
```api
name: 日记生成接口
method: POST
url: /agent/diary/generate
status: 200
description: <从表格"接口用途"行抄过来>
request: |
  <从原 输入 JSON 块抄过来>
response: |
  <从原 输出 JSON 块抄过来>
# TODO: 补 4xx/5xx
```
````

对 `action: suggest`（canvas-only），不需要 rewrite_preview。

### 7. 给每个 candidate 分配 ID

`c001`, `c002`, ... 按检测顺序（行号升序）编号，左 padding 3 位以上。

### 8. 流式可视化

边检测边在终端报，格式见 WORKFLOW.md 的 Phase 1 流式可视化示例。

### 9. 写入 candidates.json

按 schema 校验后写入 `<out>/candidates.json`。

## 启发式检测细则

参考 `./BLOCK_INVENTORY.md` 每类块的"触发信号"小节。重点：

- **不要漏检 API-B**：完整模式是 heading（含"接口"）+ 紧跟表格（含 method/url 行）+ 配对的请求/响应 JSON。三件缺一不要算 API-B。
- **PROMPT extract 用长度 + 语气**：单个段落 >150 字 + 含"你是 / 你扮演 / 请按 / 你的任务"等 → 候选 extract。短段落不要拆。
- **CALL-N 不要乱升级**：必须有明确语气信号（emoji / 加粗"注意"/ "警告" 字样），不要把所有"提示性段落"都标为 callout。
- **MERMAID 候选要保守**：除非 PRD 明显在用文字描述步骤序列（A → B → C），否则不要 suggest 图化。否则用户会被淹没在选择里。

## 完成后

- 在终端打印 `[Phase 1 完成]` + candidate 总数 + 各 type 分布
- **不要直接进 Phase 2**。等主流程触发（模式 A：直接进；模式 E：先触发 phase1-review）

## 不要做的

- 不要修改 PRD 原文
- 不要在 candidates.json 之外写其他文件
- 不要把同一段内容标成多个 candidate（除非 API-B 内含的表格也想单独算 TBL，那不要——按"被高优先级匹配的行段排除"原则做）
- 不要给 `subtype` 字段瞎填值（不知道就空着，让 Phase 3 让用户拍）
