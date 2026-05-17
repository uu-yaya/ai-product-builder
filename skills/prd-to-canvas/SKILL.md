---
name: prd-to-canvas
description: 把任意 markdown PRD 转换为可交互的 md-canvas HTML 页面。检测 17 类块、出可视化结构分析、和用户循环确认 checklist、最终一键生成 HTML。
when_to_use: 当用户上传 PRD / markdown 文档，要求"渲染成 canvas"或"转 HTML"，或者直接说 /prd-to-canvas <文件路径>
argument-hint: <path-to-prd.md>
---

# prd-to-canvas

把任何 markdown PRD 转换为 md-canvas 互动 HTML 页面的 skill。md-canvas 是一个单文件 HTML 渲染器：能把 markdown 渲染成可交互的"块"（标题/段落/表格/代码/mermaid/接口契约/Mock/Prompt 实验/Agent 实验/原型预览/callout 等共 17 类）。

你的任务：读用户的 PRD，把它**结构化分析 → 让用户确认 → 重写为 canonical markdown → 生成最终 HTML**。重点是格式转换，不评判内容完整度。

## 工作前必读

按顺序读这两个参考文件，所有具体规则在那里：

1. `./BLOCK_INVENTORY.md` —— 17 类块的检测规则 + MD 重写模板
2. `./WORKFLOW.md` —— 4 phase 详细流程

## 启动前必做：模式选择

每次被调用，**第一件事**是问用户两个问题（用 AskUserQuestion 或同等机制）：

### Q1: 输入范围

| 选项 | 含义 |
| --- | --- |
| 单份 PRD | 走标准 4-phase 流程 |
| 多份 PRD（批量） | 模式 D（本期未实现）→ 提示用户当前 v1 不支持批量，请逐个跑 |

### Q2: agent 模式

| 选项 | 含义 | 何时选 |
| --- | --- | --- |
| **A. 单 agent**（兜底） | 一个 agent 串行干 4 phase 所有事 | 工具不支持子 agent / 想最快 |
| **E. 执行 + 审核**（推荐） | Phase 1 + Phase 4 各跑一个执行 agent 后再起一个审核 agent 用新鲜上下文复查，挡误检/漏检/破坏语气/不合法语法 | 默认推荐——质量更高，慢一倍但用户 checklist 更干净 |

如果用户的环境不支持子 agent 工具（Claude Code 的 Agent 工具 / Codex 子 agent / 等），尝试调用时会失败 → 自动 fallback 到模式 A 并提示用户。

预留但本期未实现：
- 模式 B（fan-out 并行检测）
- 模式 C（每 phase 独立 pipeline agent）
- 模式 D（多 PRD 批量）

把用户的选择记到输出目录的 `decisions.json` 顶部 `mode` 字段，整个 session 沿用。

## 4 Phase 总览

```
PRD.md
   ↓
Phase 1 解析        执行 agent → candidates.json
                    (模式 E) → 审核 agent 复查 → review.json → 合并修正
                                  ↓
Phase 2 覆盖报告    单 agent 聚合 → coverage.json + analysis.html (read-only dashboard)
                                  ↓
Phase 3 决策(对话)   agent 用 AskUserQuestion 按批次问用户:
                      B1 高置信度 keep（默认 accept，不问）
                      B2 简单升级（按 category 一次性问 [全部 accept / 逐个看 / skip]）
                      B3 需用户输入（mermaid_kind / status_codes / discussion_url）逐个问
                      B4 Canvas-only 建议（一次性问是否在 index.html banner 列出）
                    全部决策记到 decisions.json (审计/重放)
                    (循环：用户对某候选选"请审核" → 回 Phase 1 重跑那批)
                                  ↓
Phase 4 生成       执行 agent 重写 → canonical.md
                    (模式 E) → 审核 agent 对比原 PRD + decisions + canonical
                                复查 → rewrite-audit.json → 修正
                                  ↓
                    注入 md-canvas 模板 → index.html
```

每 phase 的 prompt 在 `./prompts/phase{1,2,3,4}-*.md`。模式 E 多两个文件：`phase1-review.md` / `phase4-review.md`。按需读取。

**重要范式**：所有用户输入走对话（AskUserQuestion）。HTML 只用于**只读 dashboard**（analysis.html）和**最终交付**（index.html）。不通过 HTML 收输入——agent 看不见浏览器点击，异步交接 UX 也丑。

## 视觉设计 / DESIGN.md 覆盖

默认所有生成的 HTML 使用 md-canvas 内置"暖 Mac 风"调色板和字体。如果用户想换皮（如对齐某游戏 IP 配色、企业品牌），可放一份 `DESIGN.md`。

### 检测顺序

按以下顺序找 `DESIGN.md`，找到一个就用一个：

1. 用户调用时显式指定 `--design <path>`
2. PRD 同目录下的 `DESIGN.md`
3. PRD 父目录的 `DESIGN.md`（项目级共享）
4. 都没有 → 用 skill 内置默认（不询问，silent）

在 `analysis.html` 顶部告诉用户用了哪个 + 覆盖了几个 token。

### DESIGN.md 格式

只支持 **CSS custom property token 覆盖**——不让用户改 CSS 选择器 / 布局 / JS 行为，避免破坏 canvas 功能。

格式见 `./templates/DESIGN.example.md`。简单说就是几张表格，每行 `| token | 值 | 说明 |`。

### Phase 4 怎么应用

解析 DESIGN.md 表格里所有 `--xxx` 开头的 token，在 `md-canvas.html` 模板的最后一个 `<style>` 标签里追加：

```html
<style id="design-overrides">
  :root {
    --canvas: #fff8eb;
    --primary: #d4a017;
    /* ... */
  }
</style>
```

CSS source order 决定后定义的优先——这块自动覆盖模板内置的 `:root` 默认值。

### 不让覆盖的东西

不要解析 DESIGN.md 里这些（即便用户写了也忽略 + 给警告）：

- 改 CSS 选择器 / 布局规则
- 改 JS 行为
- 改块的功能性视觉边色（接口契约块青边、Mock 绿边等是功能语义，不该乱改）
- 改字号 / 行高（默认做过版式平衡，乱改易翻车）

只让 token 替换，圈住 blast radius。

## 关键原则

- **永远不覆盖用户原 PRD**。所有输出落在原 PRD 同目录下的 `canvas/` 子目录（或用户指定的输出路径）。
- **PRD 文件名必须传给模板**（关键！）。md-canvas 模板里的 `FILENAME` 常量被用来组 localStorage key（`md-canvas:<FILENAME>:mocks` / `:prompts` / `:agents` / `:b-extras` / `:prototypes`）。如果两份 PRD 共享同一个 FILENAME：
  - 它们的 canvas-only 块状态（Mock / Prompt / Agent / Prototype / B 模式额外 status）**互相污染**
  - 打开新 canvas 时浏览器会弹"检测到本地未提交修改，是否恢复？"——把另一份 PRD 的状态恢复到当前 PRD
  - 浏览器标签页 `<title>` 显示错误的 PRD 名
  
  Phase 4 **必须**用真实 PRD basename 替换 `__PRD_FILENAME__` 和 `__PRD_TITLE__` 占位符。
- **用户语气/措辞保留**。Phase 4 重写只做格式升级（B 模式接口 → A 模式 ```api fence、散落 prompt → Prompt 块建议、emoji 警告 → callout-warning），不动叙述。
- **Canvas-only 块（Mock / Prompt 实验 / Agent 实验 / 原型预览）不写 .md**。只在 Phase 2 报告里告诉用户"这些可以在 canvas 里手动加"。
- **循环修复**。Phase 3 的 checklist 用户可以全部 reject。reject 后重跑 Phase 1+2+3 出新 checklist，直到用户全部确认。
- **不假设外部能力**。如果用户机器没有 node / python，要说明并提供降级方案。

## 输出文件清单

跑完整流程后，用户会在 `<prd-dir>/canvas/` 看到：

| 文件 | 用途 |
| --- | --- |
| `analysis.html` | Phase 2 的可视化报告 + 能力地图（只读 dashboard，可不看） |
| `decisions.json` | Phase 3 对话中用户决策的审计/重放记录 |
| `canonical.md` | Phase 4 重写后的标准 markdown |
| `index.html` | 最终生成的 canvas 页面（用户在浏览器打开就能用） |

## 触发场景

用户可能这样调起：

- `/prd-to-canvas path/to/prd.md` —— 标准 slash
- "用 prd-to-canvas 把这份 PRD 渲染成 canvas" —— 自然语言
- "follow ~/some/path/prd-to-canvas/SKILL.md to handle xxx.md" —— 兜底（不支持 skill 自动注册的工具）

无论哪种触发方式，都按 4 phase 流程跑。

## 不要做的

- 不要评判 PRD 内容好坏（这是格式转换 skill，不是 PRD review skill）
- 不要给 PRD 加章节（除非用户在 Phase 3 明确要求）
- 不要修改用户的接口设计、字段命名、业务逻辑
- 不要把 Mock / Prompt / Agent 实验块的设置写进 .md（这些是 canvas localStorage 状态）
- 不要在用户没确认前直接生成 index.html（必须经过 Phase 3）
