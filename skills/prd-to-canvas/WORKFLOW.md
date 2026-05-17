# WORKFLOW

prd-to-canvas skill 的 4 phase 详细流程 + 每 phase 的 IO 契约。Agent 工作时按这份执行。

## Pre-flight：启动检查

被调用后**第一件事**：

1. **解析参数**：用户给的 PRD 路径（必填）+ 可选 `--design <path>` + 可选 `--out <dir>`
2. **检查 PRD 可读**：路径存在、是 .md / .markdown 文件、能 Read
3. **确定输出目录**：默认 `<prd_dir>/canvas/`，或 `--out` 指定。不存在则创建
4. **检测 DESIGN.md**（按 SKILL.md 中的检测顺序）。结果存入 session state
5. **询问用户两个问题**（用 AskUserQuestion 或同等机制）：
   - **Q1: 输入范围** — 单份 PRD / 多份批量（v1 仅实现单份；多份提示用户当前不支持）
   - **Q2: agent 模式** — A 单 agent / E 执行+审核（默认推荐 E）
6. **试探子 agent 能力**（仅在用户选 E 时）：
   - 尝试调用 Agent / Task 工具
   - 失败 → 提示用户"当前工具不支持子 agent，回退到模式 A"，记录到 session state
7. **初始化 decisions.json 框架**：mode / session_id / prd_path / design_source / iteration: 1 / decisions: []

完成 pre-flight 后才进 Phase 1。

---

## Phase 1 — 解析（检测候选块）

**目标**：从 PRD 中检测所有 17 类块的候选，输出 `candidates.json`。

### 模式 A：单 agent 执行

读 `./prompts/phase1-detect.md`，按指令执行。

**输入**：
- PRD 文件内容（带行号）
- `./BLOCK_INVENTORY.md`（检测规则参考）

**输出**：
- `<out>/candidates.json`（符合 `./schemas/candidates.schema.json`）

### 模式 E：执行 agent + 审核 agent

**Step E1: 执行 agent 干活**

- 同模式 A 跑 `./prompts/phase1-detect.md`，输出初版 `candidates.json`

**Step E2: 审核 agent 复查**

- 起一个子 agent，给它：PRD 全文 + `candidates.json` + `./prompts/phase1-review.md` + `./BLOCK_INVENTORY.md`
- 它输出 `<out>/review.json`（符合 `./schemas/review.schema.json`）

**Step E3: 处理审核结果**

- `verdict: pass` → candidates.json 不动，进 Phase 2
- `verdict: needs_revision` → 主 agent 按 issues + additions + removals 修正 candidates.json，覆盖写入
- 修正后 candidates.json 直接进 Phase 2，**不再触发第二轮审核**（避免无限循环；如果审核 agent 还有意见就让用户在 Phase 3 处理）

### 流式可视化（两模式都做）

边检测边在终端逐行报：

```
[扫描中] <prd_path>  (892 行)
─────────────────────────────────────────
✓ L1-L3      H1                        (high)    标准 MD 语法
✓ L5-L12     P                         (high)
✓ L14-L24    TBL (元信息)              (high)
✓ L26-L40    MERMAID                   (high)
? L42-L58    API-B 候选: /agent/chat   (medium)  缺 4xx/5xx
? L80-L92    PROMPT 候选 (extract)     (medium)  长度 287 字
? L94-L120   CALL-N warning 候选       (low)     emoji ⚠️ 触发
─────────────────────────────────────────
[Phase 1 完成] 共识别 N 个候选（其中 M 个低置信度需用户确认）
```

---

## Phase 2 — 覆盖报告 + 能力地图

**目标**：把 candidates.json 聚合成"能力使用地图"，输出可视化的 `analysis.html`。

**单 agent**（A 和 E 模式都一样，不需要审核）。

**输入**：
- `<out>/candidates.json`
- `./templates/analysis.html`（HTML 模板）
- session state（mode / design_source / etc）

**输出**：
- `<out>/coverage.json`（按 17 类块聚合的统计）
- `<out>/analysis.html`（注入 coverage.json + 注入 DESIGN.md token override 后的最终 HTML）

**coverage.json 结构**：

```json
{
  "version": "1.0",
  "total_blocks": 56,
  "by_type": {
    "H":       { "count": 8,  "lines": [1, 3, 14, ...] },
    "P":       { "count": 42, "lines": [...] },
    "API-B":   { "count": 3,  "candidates": ["c012", "c018", "c023"] },
    "MERMAID": { "count": 2,  "candidates": ["c005", "c014"] },
    "MOCK":    { "count": 0,  "suggestions": 3 },
    "PROMPT":  { "count": 0,  "suggestions": 2 },
    ...
  },
  "covered_types": 11,
  "total_types": 17,
  "design_source": "default",
  "design_overrides_count": 0
}
```

`analysis.html` 在浏览器打开就能看：

- 顶部：PRD 文件名 + 扫描时间 + 用了哪份 DESIGN
- "能力地图" 卡片网格：17 个方格，已用绿、候选半透绿、未用灰
- 候选明细表：按 candidates.json 列出 + 链接到 PRD 行号

**用户操作**：浏览器看完 analysis.html → Phase 3 自动开始（不需要用户在 analysis.html 上点什么）。

---

## Phase 3 — 确认 checklist（循环）

**目标**：让用户对每个 candidate 做裁决，输出 `decisions.json`。

**单 agent**（用户是审核者，不需要 agent 审核）。

### 流程

**Step 1: 主 agent 生成 checklist.html**

- 输入：`candidates.json` + `coverage.json` + `./templates/checklist.html` + session state
- 输出：`<out>/checklist.html`

**Step 2: 提示用户**

终端输出：

```
─────────────────────────────────────────
Phase 3 等待你的确认

请打开:  file://<out>/checklist.html
逐项确认/编辑/跳过，全部完成后点页面底部的 [导出决策 JSON] 下载 decisions.json
然后把下载到的文件放到:  <out>/decisions.json

放好后按回车继续，agent 会读决策文件进 Phase 4。
─────────────────────────────────────────
```

（或如果工具支持，用 AskUserQuestion 让用户输入"已放好"或"还在选"）

**Step 3: 读决策**

读 `<out>/decisions.json`，验证：

- 符合 `./schemas/decisions.schema.json`
- 每个 candidate 都有对应 verdict（accept / skip / edit / request_review）
- `request_review` 的项（仅 E 模式有效）触发本轮 Phase 1 重跑

### 循环条件

| 用户操作 | agent 反应 |
| --- | --- |
| 所有 candidate 都是 accept / skip | **退出循环**，进 Phase 4 |
| 有 edit（用户改了字段） | 直接接受用户的 edit 字段，进 Phase 4 |
| 有 request_review（仅 E 模式） | **iteration + 1，回 Phase 1 重跑**（执行 agent + 审核 agent 重新评估那批 candidate），再回 Phase 3 出新 checklist |
| 用户什么都不做 / 不放 decisions.json | 等待，不主动推进 |

iteration 最多 5 轮，超出后强制进 Phase 4（防死循环）。

### checklist.html 用户能做什么

详见 `./prompts/phase3-checklist.md` 中对 checklist.html 行为的说明。简要：

- 每个 candidate 一个卡片：原文摘要 + 类型 + 行号 + rewrite_preview
- 4 个动作按钮：**确认** / **跳过** / **编辑**（调字段 / 调行号范围 / 调类型） / **请审核**（仅 E 模式）
- 全局开关：保留 B 模式 / 添加 canvas-only 建议
- 底部 [导出决策 JSON] 生成 decisions.json 下载

---

## Phase 4 — 生成 canonical.md + index.html

**目标**：按 decisions.json 重写 PRD → canonical.md → 注入模板 → index.html。

### 模式 A：单 agent 执行

读 `./prompts/phase4-rewrite.md`，按指令执行。

**输入**：
- 原 PRD 文件内容
- `decisions.json`
- `./BLOCK_INVENTORY.md`（重写模板参考）
- `./templates/md-canvas.html`（最终模板）
- DESIGN.md（如有）

**输出**：
- `<out>/canonical.md`（重写后的 PRD）
- `<out>/index.html`（注入 canonical.md + DESIGN override 后的最终页面）

### 模式 E：执行 agent + 审核 agent

**Step E1: 执行 agent 写 canonical.md**

- 同模式 A 跑 `./prompts/phase4-rewrite.md`

**Step E2: 审核 agent 复查**

- 起子 agent，给它：原 PRD + decisions.json + canonical.md + `./prompts/phase4-review.md`
- 它输出 `<out>/rewrite-audit.json`（符合 `./schemas/rewrite-audit.schema.json`）

**Step E3: 处理审核结果**

- `verdict: pass` → 进 HTML 生成
- `verdict: needs_revision` → 主 agent 按 issues 修正 canonical.md，**最多重审 1 次**（避免死循环）。第 2 次仍 needs_revision 则上报给用户 + 仍进 HTML 生成（标记 "审核未完全通过" 在 index.html 顶部）

### HTML 生成（两模式共用）

1. 读 `./templates/md-canvas.html`
2. 把 canonical.md 内容（HTML-escape `</script>`）替换 `__MARKDOWN_SOURCE_INLINE__`
3. 若 DESIGN.md 存在，解析其 token 表 → 生成 `<style id="design-overrides">:root { ... }</style>` → 追加到模板内最后一个 `</style>` 之后
4. 写入 `<out>/index.html`

### 完成提示

```
─────────────────────────────────────────
✓ 完成

  canonical.md:  <out>/canonical.md
  index.html:    <out>/index.html
  
  打开:  file://<out>/index.html
  
  在 canvas 里你还可以手动加这些块（PRD 中检测到的 canvas-only 候选）：
    · 接口 Mock × 3
    · Prompt 实验 × 2
    · 原型预览 × 1
─────────────────────────────────────────
```

---

## 错误处理

| 失败 | 兜底 |
| --- | --- |
| PRD 文件读不到 | 报错退出 |
| 输出目录无写权限 | 报错 + 让用户指定 `--out` |
| Phase 1 candidates.json schema 不合法 | 重跑 1 次，仍失败则报错 |
| Phase 1 审核 agent 调用失败（模式 E） | 自动 fallback 到模式 A 跑完本 phase，提示用户 |
| Phase 3 用户超时 5 分钟未交 decisions.json | 提示等待，不主动推进 |
| Phase 4 canonical.md 中 YAML 语法错 | 让执行 agent 重写那块；2 次失败则跳过那块（保留为普通段落）+ 报告 |
| DESIGN.md 格式错（token 不以 `--` 开头） | 忽略错误 token + 给警告，继续用其他 token |
| mermaid 语法错 | 重写时把该块降级为普通 code block（带 lang=mermaid）+ 报告 |

---

## 不要做的

- 不要在 Phase 1 直接重写 PRD（重写只在 Phase 4 做，且只写 canonical.md，不动原文）
- 不要在 Phase 3 自作主张跳过用户确认（即使 candidates 都是 high confidence）
- 不要让 Phase 4 重写超出 decisions.json 范围
- 不要写 canvas-only 块（MOCK/PROMPT/AGENT/PROTO）的 MD 表示
- 不要修改 SKILL.md / BLOCK_INVENTORY.md / WORKFLOW.md / prompts/ / schemas/ / templates/ 自身（这些是 skill 本体）

---

## 输出文件总览

```
<out>/
├── candidates.json          # Phase 1 执行输出
├── review.json              # Phase 1 审核输出（仅 E 模式）
├── coverage.json            # Phase 2 输出
├── analysis.html            # Phase 2 可视化报告
├── checklist.html           # Phase 3 用户交互页
├── decisions.json           # Phase 3 用户输出
├── canonical.md             # Phase 4 重写产物
├── rewrite-audit.json       # Phase 4 审核输出（仅 E 模式）
└── index.html               # Phase 4 最终页面
```

PRD 原文件**绝对不动**。
