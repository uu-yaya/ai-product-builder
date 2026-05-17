# Phase 2 — 覆盖报告 + 能力地图

任务：把 candidates.json 聚合成 coverage.json + analysis.html。单 agent，不需要审核。

## 输入

- `<out>/candidates.json`（Phase 1 输出，模式 E 下已经审核 merge 过）
- `./templates/analysis.html`（HTML 模板）
- session state（mode / design_source / DESIGN.md 内容）
- PRD 文件路径 + 总行数

## 输出

1. `<out>/coverage.json`（17 类块聚合统计）
2. `<out>/analysis.html`（注入 coverage + DESIGN 后的可视化报告）

## 执行步骤

### 1. 聚合 candidates → coverage.json

按 type 分组统计：

```json
{
  "version": "1.0",
  "generated_at": "<ISO>",
  "prd_path": "<abs>",
  "prd_total_lines": 892,
  "mode": "E",
  "design_source": "<path or 'default'>",
  "design_overrides_count": 12,
  "total_candidates": 56,
  "by_type": {
    "H":       { "label": "标题 H1-H4",       "count": 8,  "candidate_ids": ["c001", "c003", ...], "category": "structure" },
    "P":       { "label": "段落",             "count": 42, "candidate_ids": [...],                  "category": "structure" },
    "UL":      { "label": "无序列表",         "count": 6,  "candidate_ids": [...],                  "category": "structure" },
    "OL":      { "label": "有序列表",         "count": 1,  "candidate_ids": [...],                  "category": "structure" },
    "TBL":     { "label": "表格",             "count": 5,  "candidate_ids": [...],                  "category": "structure" },
    "QT":      { "label": "引用",             "count": 2,  "candidate_ids": [...],                  "category": "structure" },
    "HR":      { "label": "分隔线",           "count": 0,  "candidate_ids": [],                     "category": "structure" },
    "CODE":    { "label": "普通代码",         "count": 7,  "candidate_ids": [...],                  "category": "structure" },
    "MERMAID": { "label": "Mermaid 图",       "count": 2,  "candidate_ids": [...],                  "category": "visual" },
    "CALL-N":  { "label": "通用 callout",     "count": 0,  "candidate_ids": [],                     "category": "annotation",
                 "subcounts": { "note": 0, "tip": 0, "important": 0, "warning": 2, "caution": 0 } },
    "CALL-D":  { "label": "讨论 callout",     "count": 0,  "candidate_ids": [],                     "category": "annotation" },
    "API-A":   { "label": "接口契约 A 模式",  "count": 0,  "candidate_ids": [],                     "category": "api" },
    "API-B":   { "label": "接口契约 B 模式",  "count": 3,  "candidate_ids": [...],                  "category": "api" },
    "MOCK":    { "label": "接口 Mock 块",     "count": 0,  "candidate_ids": [...],                  "category": "canvas-only", "is_suggestion": true },
    "PROMPT":  { "label": "Prompt 实验块",    "count": 0,  "candidate_ids": [...],                  "category": "canvas-only", "is_suggestion": true },
    "AGENT":   { "label": "Agent 实验块",     "count": 0,  "candidate_ids": [...],                  "category": "canvas-only", "is_suggestion": true },
    "PROTO":   { "label": "原型预览块",       "count": 0,  "candidate_ids": [...],                  "category": "canvas-only", "is_suggestion": true }
  },
  "covered_types": 11,
  "total_types": 17,
  "coverage_pct": 65,
  "candidates_by_confidence": { "high": 38, "medium": 14, "low": 4 },
  "candidates_by_action": { "keep": 42, "upgrade": 8, "extract": 2, "suggest": 4 }
}
```

字段说明：

- `category` 用于 analysis.html 分区展示
- `is_suggestion` 标记 canvas-only 块（图标灰但有"可加 N 个"提示）
- `subcounts` 用于 CALL-N 5 种 subtype 细分
- `coverage_pct` = `covered_types / total_types * 100`（向下取整）；"covered" 定义：`count > 0` OR `candidate_ids.length > 0`

### 2. 生成 analysis.html

读 `./templates/analysis.html` 模板，注入：

- `__COVERAGE_JSON_INLINE__` ← `JSON.stringify(coverage, null, 2)`（安全处理 `</script>` → `<\/script>`）
- `__CANDIDATES_JSON_INLINE__` ← `JSON.stringify(candidates, null, 2)`
- `__DESIGN_OVERRIDE_BLOCK__` ← 如果 DESIGN.md 存在，输出 `<style id="design-overrides">:root { --xxx: ...; }</style>`；否则空字符串
- `__PRD_PATH__` ← PRD 文件路径
- `__GENERATED_AT__` ← ISO 时间戳

注入完写入 `<out>/analysis.html`。

### 3. 终端提示

```
─────────────────────────────────────────
Phase 2 完成

  覆盖率:  11/17 类块 (65%)
  候选总数: 56  (high=38 medium=14 low=4)
  分布:
    structure:    H×8 P×42 UL×6 OL×1 TBL×5 QT×2 HR×0 CODE×7
    visual:       MERMAID×2
    annotation:   CALL-N(warning)×2 CALL-D×0
    api:          API-A×0 API-B×3
    canvas-only:  MOCK 建议×3 PROMPT 建议×2 AGENT 建议×1 PROTO 建议×0

  打开看分析报告:  file://<out>/analysis.html
─────────────────────────────────────────
```

## 不要做的

- 不要在 coverage.json 里加 candidates.json 中没有的 candidate
- 不要在 analysis.html 中执行任何用户交互（那是 Phase 3 的 checklist.html 干的）
- 不要在 analysis.html 里放 PRD 全文（只放统计 + candidate excerpt）
- 不要修改 candidates.json（只读）
