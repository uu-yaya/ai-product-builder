# Phase 3 — 决策（对话式）

任务：与用户对话**逐步**确定每个候选的处理方式，最后输出 `decisions.json`。单 agent，用户是决策者。

**关键设计**：**不要**生成 HTML 让用户去浏览器里勾选（那种异步交接 UX 又糟、agent 又看不见点击）。**全程在 agent 对话里完成**，用 `AskUserQuestion`（Claude Code）或同等机制按批次提问。

`analysis.html` 已经在 Phase 2 生成好，让用户作为**只读 dashboard** 参考用（不必看，但有需要可看）。

## 输入

- `<out>/candidates.json`（Phase 1 + review merge 后）
- `<out>/coverage.json`（Phase 2 输出）
- `<out>/analysis.html`（已生成的只读报告，仅供用户参考）
- session state（mode / iteration）

## 输出

`<out>/decisions.json`（符合 `./schemas/decisions.schema.json`）—— 全程记录用户对话中的所有决策，最后写到文件作为审计/重放记录，并供 Phase 4 消费。

## 启动提示

终端先打印：

```
─────────────────────────────────────────
Phase 3 决策（iteration <N>）

PRD 体检报告（只读，可选）:  file://<out>/analysis.html
共 73 个候选，按类别分布：
  · 结构        50 (H/P/UL/TBL 等)
  · 可视化       3 (MERMAID)
  · 标注         6 (CALL-N/CALL-D)
  · 接口         3 (API-B)
  · Canvas-only  8 (Mock/Prompt/Agent/Proto 建议)

我会逐类问你。大多数候选可批量"全部确认"，需要你拍的字段（图类型 / 状态码 body / etc）会单独问。
─────────────────────────────────────────
```

## 批次策略

把候选按以下规则分桶后逐桶处理：

| 桶 | 规则 | 提问方式 |
| --- | --- | --- |
| **B1 已是 canonical** | confidence=high 且 action=keep | 一句话总结："X 个候选已是标准 MD 语法，直接保留" — **默认 accept，不问** |
| **B2 简单升级** | action=upgrade 且 needs_user_input 为空（如 ·→- 列表升级、emoji→callout 但 subtype 在 raw 里能推断） | 按 category 批量问："结构类 Y 个简单格式升级，全部 accept？" → AskUserQuestion 单选 [全部 accept / 逐个看 / 全部 skip] |
| **B3 需用户输入** | action=upgrade/extract 且 needs_user_input 非空（如 mermaid_kind / status_codes_4xx_5xx / discussion_url / callout_subtype） | **逐个问**，每个候选 1 个 AskUserQuestion，prompt 中显示 raw_excerpt + rewrite_preview + 让用户填空缺字段 |
| **B4 Canvas-only 建议** | action=suggest（MOCK/PROMPT/AGENT/PROTO） | 一次性问："Z 个 canvas-only 建议（Mock×3 / Prompt×2 / Agent×1 / Proto×2），要在最终 index.html 顶部 banner 里列出来吗？" |

## 详细每桶流程

### B1: 已是 canonical（高置信度 + keep）

不发 AskUserQuestion。直接在终端报：

```
✓ B1 已 canonical: 50 个（H×25 P×8 UL×6 TBL×7 HR×1 QT×1 CODE×2）
  默认 accept，无需确认。要逐个看吗？(默认 N)
```

如果用户回 Y，遍历 B1 用 AskUserQuestion 逐个问。否则直接 accept 全部，写入 decisions[]。

### B2: 简单升级（自动可推断 subtype）

按 category 分组，每个 category 一次 AskUserQuestion：

```
AskUserQuestion: "结构类有 4 个简单格式升级要采纳吗？"
  options:
    - "全部 accept (推荐)"
    - "逐个看"
    - "全部 skip"
  显示候选清单（精简）:
    · c010 L26-28 UL 升级（·→-）
    · c011 L31-33 UL 升级（·→-）
```

不同 category 分别提问（结构 / 标注 / etc）。

### B3: 需要用户输入（逐个问）

这是耗精力的一类。**每个候选 1 个 AskUserQuestion**。提示内容：

```
AskUserQuestion: "c018 MERMAID 候选 (L49-L55) — 这段流程要画什么图？"
  显示候选信息:
    L49-L55 原文:
      "整体流程：
      ```
      玩家战后回大厅 → 检查段位 → 弹浮窗 → ...
      ```
      （应该图化）"
    
    建议预览（flowchart LR）:
      ```mermaid
      flowchart LR
        A[玩家战后回大厅] --> B{段位 < 黄金?}
        ...
      ```
  options:
    - "accept (flowchart LR)"
    - "改成 flowchart TD（纵向）"
    - "改成 sequenceDiagram"
    - "改成 stateDiagram-v2"
    - "skip（保留 ASCII 不画图）"
```

特别字段处理：

- **status_codes_4xx_5xx**: prompt 提示用户输入文本（让用户在 AskUserQuestion 的 "Other" 选项里贴 401/500 的 body 样本）。或者两步：先问"要补哪些 status?"（多选 401/404/429/500），再针对每个 status 用 AskUserQuestion 问 body
- **discussion_url**: AskUserQuestion 选项给"用 raw_excerpt 里检测到的 URL" / "我手动填别的" / "skip 不升级"
- **callout_subtype**: 选项给 5 种 subtype + skip + 用 raw 里 emoji 推断的默认（前置打勾）
- **mermaid_kind**: 见上例

### B4: Canvas-only 建议

一次性问：

```
AskUserQuestion: "8 个 canvas-only 建议要在最终 HTML 顶部 banner 里列出来吗？"
  显示清单:
    · MOCK ×3 (对应 3 个接口)
    · PROMPT ×3 (3 个人设的 system prompt)
    · AGENT ×1 (教练后端)
    · PROTO ×1 (Figma 链接)
  options:
    - "全部 include (推荐)"
    - "逐类筛选"
    - "都不要"
```

## 全局开关

在最后一桶之后，问 2 个全局开关：

```
AskUserQuestion: "保留 PRD 原有 B 模式接口段（不升级 A）？"
  options:
    - "否：升级为 A 模式 (推荐)"
    - "是：保留 B 模式"

AskUserQuestion: "在最终 index.html 顶部加 canvas-only 块的'可加'提示？"
  options:
    - "是 (推荐)"
    - "否"
```

## 进度持久化（每完成一桶就写一次）

**每完成一桶（B1/B2/B3/B4/global_options）就立刻把当前累积决策写入 `<out>/decisions.partial.json`**（不是 decisions.json）：

```json
{
  "version": "1.0",
  "mode": "E",
  "session_id": "...",
  "iteration": 1,
  "partial": true,
  "completed_buckets": ["B1", "B2"],
  "decisions": [...],
  "global_options": {}
}
```

为啥这么干：

- Agent 死了 / 用户 Ctrl-C / 网络断 / agent 上下文爆了 → 进度全在 disk 上
- 下次 Phase 0 检测到 `decisions.partial.json` 存在 + `partial: true` → 提供"从上次中断处接续"选项（跳过已 complete 的桶，从下一个开始）
- 完成所有 5 桶后才**重命名**为 `decisions.json` 同时设 `partial: false` / 删 `completed_buckets`

具体时机：

| 何时写 partial | completed_buckets 增加 |
| --- | --- |
| B1 完成（用户接受默认或逐个看完）| +"B1" |
| B2 完成（每个 category 都问完或跳过）| +"B2" |
| B3 中每个候选答完一个 | 不增加 completed_buckets（只更新 decisions[]） |
| B3 全部候选答完 | +"B3" |
| B4 完成 | +"B4" |
| global_options 答完 | +"global_options" → 全 5 项齐了 → 写最终 decisions.json + 删 partial |

## 完成后

所有 5 桶 + global_options 全完成后：

1. 把累积 decisions 序列化为最终 `decisions.json`（去掉 `partial` 和 `completed_buckets` 字段，或显式 `partial: false`）
2. 删除 `<out>/decisions.partial.json`（清掉残余进度文件）
3. 准备进 Phase 4

终端打印汇总：

```
─────────────────────────────────────────
Phase 3 完成

  accept:        67
  skip:           3
  edit:           3 (mermaid_kind / status_codes_4xx_5xx)
  
  全局开关:
    add_canvas_only_suggestions:  ✓
    preserve_original_b_mode:      ✗ (升级 A)

  即将进 Phase 4 重写...
─────────────────────────────────────────
```

## 循环 / 重审

如果用户在某个 AskUserQuestion 中选了"逐个看"展开后又改主意，让用户能往回退（提供"返回上一题"选项）。

如果在 E 模式下用户对某个候选不放心，可以选项给"请审核 agent 再看一遍这个候选"——但**不要默认提供这个选项**，只在用户明显犹豫时（多次切换选项 / Other 里写"我不确定"）才弹这个：

```
options 追加:
  - "Other: 我不确定，让审核 agent 再看一眼"
```

如果用户选了 request_review 类决策：**iteration + 1，回 Phase 1 对那批 candidate 重跑**，再回 Phase 3 重审那批（其他已决定的不重审）。iteration 上限 5。

## 关键原则

- **永远不通过 HTML 让用户输入**。HTML 只用于 read-only 展示。所有决策走对话。
- **批量优先**。能一次问 50 个不要问 50 次。只对必须用户输入的字段逐个问。
- **default 默认值**。每个 AskUserQuestion 把推荐选项放第一位，加 "(推荐)" 标签。
- **轻量提示**。每个问题文字不超过 5 行；候选预览不超过 200 字。
- **解释 why**。每个问题告诉用户为什么需要他拍。
- **进度可见**。每桶完成时给个 ✓ + 进度数字。

## 不要做的

- 不要生成 checklist.html 之类的输入页面（已废弃）
- 不要在 decisions.json 不完整时进 Phase 4
- 不要把"逐个看"逻辑做成一定要走完所有 candidate 才能下一桶——用户随时能"剩下的全 accept"跳出
- 不要超过 5 轮 iteration
