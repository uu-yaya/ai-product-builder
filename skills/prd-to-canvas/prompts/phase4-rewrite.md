# Phase 4 — 重写 + 生成（执行 agent）

任务：按 decisions.json 把 PRD 重写为 canonical.md，然后注入模板生成 index.html。

## 输入

- 原 PRD 文件全文
- `<out>/decisions.json`（Phase 3 用户裁决）
- `<out>/candidates.json`（最新版，已 merge 过 review 和 user edits）
- `./BLOCK_INVENTORY.md`（重写模板参考）
- `./templates/md-canvas.html`（最终 HTML 模板）
- DESIGN.md（如有）

## 输出

1. `<out>/canonical.md`（重写后的 PRD）
2. `<out>/index.html`（最终页面）

## 执行步骤

### 1. 加载 decisions.json + candidates.json

按 candidate_id 对齐，得到每个 candidate 的：

- type / line_start / line_end / rewrite_preview
- verdict（accept / skip / edit / request_review）
- user_input / boundary_override / type_override / note

`request_review` 在此 phase 已经被 Phase 3 处理过（会回 Phase 1+2+3）。到 Phase 4 时只剩 accept / skip / edit。

### 2. 构造重写计划

按 candidate 的 line_start 升序排序。对每个：

| verdict | 动作 |
| --- | --- |
| `skip` | 那段行号范围**保持原 PRD 内容不动** |
| `accept` | 那段行号范围**替换为 rewrite_preview**（或按 BLOCK_INVENTORY 重写模板生成） |
| `edit` | 同 accept，但用 `user_input` / `boundary_override` / `type_override` 中的字段覆盖默认值 |

action 为 `extract` 的（PROMPT）：

- 在原位置**保留段落不动**（不要从 PRD 抹掉用户的 prompt 字符串）
- 在 PRD 末尾或最近章节末追加一段说明："此 prompt 的实验可在 canvas 中加 Prompt 块"

action 为 `suggest`（canvas-only：MOCK / AGENT / PROTO）：

- **不要写进 canonical.md**
- 收集起来准备在终端报告 + 在 index.html 顶部插入提示（看 decisions.global_options.add_canvas_only_suggestions）

### 3. 应用重写

**按 line 范围逆序处理**（从大到小），避免每次替换后后续行号偏移：

```
原 PRD lines = [...]
for cand in sorted(plan, key=lambda c: c.line_start, reverse=True):
    if verdict == 'skip': continue
    new_text = build_rewrite(cand)
    lines[line_start:line_end+1] = new_text.split('\n')
```

build_rewrite 按 BLOCK_INVENTORY 每类块的"重写模板"小节生成：

- **API-A**: 拼接 YAML 字段（name/method/url/status + response + 多 status + ...）；status_codes_4xx_5xx 用户没给就标 `<TODO: 4xx 响应样本>`
- **API-B**: 如果 user 选了 `preserve_original_b_mode` 或 verdict=skip → 不动；否则升级为 API-A
- **MERMAID**: 用 user_input.mermaid_kind 选图类型；如果没给，用 `flowchart LR` 兜底
- **CALL-N**: 按 subtype 包 `> [!type] 标题\n> 内容`
- **CALL-D**: 用 user_input.discussion_url 当 URL
- **H/P/UL/OL/TBL/QT/HR/CODE**: 按标准 MD 语法重写（如 emoji bullet → `- `、ASCII 表格 → pipe table、自定义编号 → `1. 2. 3.`）
- **PROMPT**: 不重写（仅追加 canvas 建议提示）

### 4. 验证

写入 canonical.md 前**必须**验证：

- 所有 ```api fence 内的 YAML 能被 parseApiSpecYaml 解析（用本机 node 或类似工具跑一遍）
- 所有 ```mermaid fence 内的语法合法（用 mermaid.parse 或类似工具）
- markdown 整体能被 marked.js 解析（用 node + marked 跑一次 dry-run）

验证失败 → 修对应块再试。2 次失败 → 那块降级为 verbatim 原内容 + 在 issues 记一条。

### 5. 写入 canonical.md

```
<out>/canonical.md
```

### 6. 生成 index.html

读 `./templates/md-canvas.html`，做 3 件事：

1. **注入 markdown**: 替换 `__MARKDOWN_SOURCE_INLINE__` 为 canonical.md 内容
   - **必须先做安全替换**: `re.sub(r'(?i)</script>', '<\\/script>', md_content)` 避免 markdown 里有 `</script>` 字符串提前关闭脚本
2. **注入 DESIGN override**: 如果 session state 有 DESIGN.md，解析所有 `--xxx | value` 表格行 → 生成 `<style id="design-overrides">:root { --xxx: value; ... }</style>` → 追加到模板内**最后一个** `</style>` 之后（即 CSS source order 最后，覆盖默认）
3. **注入 canvas-only 建议提示**（如果 decisions.global_options.add_canvas_only_suggestions = true）:
   - 在 `<body>` 开头插一个小 banner 块，列出 MOCK / PROMPT / AGENT / PROTO 候选建议

写入 `<out>/index.html`。

### 7. 报告完成

```
─────────────────────────────────────────
✓ Phase 4 完成

  canonical.md:  <out>/canonical.md  (X 行)
  index.html:    <out>/index.html    (Y bytes)
  
  应用的改动:
    · API-B → A 模式升级: 3 个接口（c012 / c018 / c023）
    · emoji ⚠️ → callout-warning: 2 段
    · mermaid 候选升级: 1 个 (flowchart)
    · 跳过: 12 个候选保持原样
    · PROMPT extract 标记: 2 处（建议 canvas 里加 Prompt 块）
  
  Canvas-only 建议（可在 canvas 里手动加）:
    · 接口 Mock × 3
    · Prompt 实验 × 2
    · 原型预览 × 1

  打开:  file://<out>/index.html
─────────────────────────────────────────
```

模式 E：先**不要**报告，等 Phase 4 审核通过后再报告。

## 关键原则

- **保留用户原文措辞**。重写只做格式包装（语法升级、字段补全、容器包裹），不要改写用户句子
- **不动接口设计**。method / url / 字段名 / 业务逻辑严格按原 PRD
- **TODO 占位明显**。补的字段（如 4xx 响应）写 `<TODO: 4xx 响应样本，待补>`，便于用户搜
- **空行规则**。每个块之间永远 1 空行；块内不空行；H 之后 1 空行
- **永远不动原 PRD 文件**

## 不要做的

- 不要写 canvas-only 块的 MD 表示
- 不要改 decisions.json 没批准的 candidate
- 不要"顺手"修语法错误（除非是重写目标本身）
- 不要在 index.html 中嵌入 JavaScript 之外的逻辑（用 md-canvas 现有 engine）
- 不要忘记安全替换 `</script>`
