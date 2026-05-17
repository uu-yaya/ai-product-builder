# Phase 3 — 确认 checklist（循环）

任务：生成 checklist.html，等用户在浏览器里勾选 → 接收 decisions.json → 决定循环还是进 Phase 4。单 agent，用户是审核者。

## 输入

- `<out>/candidates.json`
- `<out>/coverage.json`
- `./templates/checklist.html`
- session state（mode / iteration 计数）

## 输出

1. `<out>/checklist.html`（每次 iteration 都重新生成）
2. 等待用户放置 `<out>/decisions.json`
3. 读取 decisions.json → 决定循环或进 Phase 4

## 执行步骤

### 1. 生成 checklist.html

读 `./templates/checklist.html` 模板，注入：

- `__CANDIDATES_JSON_INLINE__` ← JSON.stringify(candidates)
- `__COVERAGE_JSON_INLINE__` ← JSON.stringify(coverage)
- `__SESSION_META_INLINE__` ← `{ session_id, mode, iteration, prd_path, design_source }`（JSON）
- `__DESIGN_OVERRIDE_BLOCK__` ← 同 Phase 2，DESIGN.md 覆盖块（保证视觉一致）

注入完写入 `<out>/checklist.html`。

### 2. 提示用户

终端输出：

```
─────────────────────────────────────────
Phase 3 等待你的确认  (iteration <N>)

请在浏览器打开:  file://<out>/checklist.html

页面顶部有 PRD 信息和能力地图小卡。下面按"必看"/"可选"/"canvas 建议" 3 类
列出所有候选块。每个候选你可以：

  · 确认       — 按 rewrite_preview 升级（高置信度默认勾这个）
  · 跳过       — 不动 PRD 这段（保留原样）
  · 编辑       — 改 boundary / 改类型 / 改字段（如 callout subtype、status code）
  · 请审核     — 让审核 agent 再看一眼（仅模式 E 有效，会重跑 Phase 1+2+3）

页面底部有 [导出决策 JSON]。点了后浏览器下载 decisions.json，把它放到:
  <out>/decisions.json

放好后按回车继续。
─────────────────────────────────────────
```

### 3. 等待 decisions.json

- 用 AskUserQuestion 提示用户"放好了吗？"，或循环检查文件存在 + mtime 变化
- **不要主动推进**。用户没放就一直等

### 4. 校验 decisions.json

读到后按 `./schemas/decisions.schema.json` 校验：

- `mode` 与 session state 一致
- 每个 candidate_id 在 candidates.json 中存在
- 每个 decision 有合法 verdict
- `edit` 类型的 decision 必须有 `boundary_override` 或 `type_override` 或 `user_input` 中至少一项

校验失败 → 报错 + 让用户修后重新放。

### 5. 决定循环还是进 Phase 4

| 条件 | 动作 |
| --- | --- |
| 所有 verdict 都是 `accept` 或 `skip` | **进 Phase 4** |
| 至少一个 `edit`（用户改了字段/类型/边界） | 接受用户的 edit 字段，**进 Phase 4** |
| 至少一个 `request_review`（仅 E 模式有效） | **iteration + 1**，回 Phase 1 对那些 request_review 的 candidate 重跑（执行 agent + 审核 agent）；其他 candidate 保持不变；然后回 Phase 3 出新 checklist |
| iteration >= 5 | 强制进 Phase 4（防死循环）+ 提示用户 |

### 6. 进 Phase 4 前

- 保存 decisions.json 的最终版（按用户 edit 的字段调整 candidates 副本）
- 在终端打印决策汇总：

```
─────────────────────────────────────────
Phase 3 完成 (iteration <N>)

  accept:        38 个
  skip:          12 个
  edit:           6 个
  request_review: 0 个

  即将进 Phase 4 重写...
─────────────────────────────────────────
```

## checklist.html 必须实现的交互

详见 `./templates/checklist.html` 里的 spec 注释。简要：

- 顶部：PRD 信息卡（路径、行数、扫描时间）
- 能力地图（同 analysis.html 的小卡片，让用户上下文一致）
- 候选列表（按 confidence 分组：必看 = low/medium，可选 = high，建议 = canvas-only）
- 每个 candidate 一个折叠卡片
  - 头部：类型 chip + 行号 + raw_excerpt
  - 4 按钮：确认 / 跳过 / 编辑 / 请审核
  - 编辑面板（展开）：boundary 数字框 / type 下拉 / user_input 字段表单
- 全局开关（顶栏切换）：
  - "保留 B 模式接口段"（不升级 A）
  - "在最终 HTML 顶部加 canvas-only 建议提示"
- 底部 [导出决策 JSON] 按钮：构造 decisions.json 触发下载

## 循环时的"差异化重跑"

- 仅 `request_review` 的 candidate 进入新一轮 Phase 1
- 其他 candidate 的 verdict 在 decisions.json 中保留（不要求用户重做）
- 新一轮 Phase 1 只把 review.json 中 issues 转化为对那批 candidate 的修正，merge 后再 Phase 2 → Phase 3
- Phase 3 新 checklist 只让用户对**变化了的 candidate** 重审

## 不要做的

- 不要自作主张过滤 high-confidence 候选不让用户看（用户对一致性敏感）
- 不要在 checklist.html 里执行 PRD 改写（那是 Phase 4 的事）
- 不要在 decisions.json 不完整时强行进 Phase 4
- 不要超过 5 轮 iteration（提示用户：可能需要换模式或手动调整）
