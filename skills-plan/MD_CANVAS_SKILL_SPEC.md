# md-canvas Skill Spec

> **Status: Draft / WIP.** 当前是基于真实 demo（`projects/desktop-pet/02-design/branches/Diary/md-canvas-demo/`）抽象的雏形，**MD 渲染与回写已基本可用**；评论锚点持久化、协作侧、多文件画布等仍未完善。本 spec 描述当前能力边界与未完成项，作为后续沉淀为正式 Skill 的基准。

## Skill Name

`md-canvas`

## Purpose

把任意 Markdown 文档渲染为一张可阅读、可结构化编辑、可批注的 HTML 画布；
HTML 上的修改可结构化回写为同名 `.md` + diff 报告，必要时附 `.comments.json`。

适用场景：

- PRD / 设计交付 / 工程文档需要在浏览器里被评审、改写、批注
- 不希望评审方直接动源 markdown，但希望把意见以可回写的形式落下来
- 想用同一份源 MD 同时支持"原文阅读"与"交互式编辑"两种形态

## Trigger Scenarios

- 用户在任一 workspace 产出了 Markdown 文档，要求"做一份 HTML 版"以便评审或演示
- 用户希望在 HTML 上拖动 / 删改 / 加批注，并把变更回写到源 MD
- 项目内多个 MD（PRD / 设计 / 工程）需要统一形态展开评审

不适用：

- 想要纯 PDF / 静态分享版（用浏览器打印 + 关闭编辑即可）
- 想要协作多人实时编辑（超出当前 demo 范围，见 Open Items）

## Inputs

| 输入 | 必选 | 说明 |
|---|---|---|
| 源 MD 文件路径 | 必选 | 任意 `.md` |
| Design tokens preset | 可选 | 默认 `workspaces/design-prototype/templates/CLAUDE_EDITORIAL_DESIGN_TOKENS.md` |
| 默认初始模式 | 可选 | `read` / `edit`，默认 `read` |
| 输出目录 | 可选 | 默认 `<doc-parent>/<doc-stem>-canvas/` |

## Workflow

1. 读源 MD，校验基本结构（章节、表格、code fence 等）。
2. 读 design tokens preset，取出 color / typography / spacing / radius 等变量。
3. 选 / 生成 `index.html` 模板（自包含、单文件、内联 MD via `<script type="text/markdown">`）。
4. 把源 MD 注入模板的 `__MARKDOWN_SOURCE_INLINE__` 占位符。
5. 生成 `README.md`：说明如何打开、使用、当前限制。
6. 输出到 `<doc-parent>/<doc-stem>-canvas/`。
7. 不修改源 MD；下载文件由 agent 后续 apply。

## Outputs

- `index.html`：自包含画布，浏览器双击即可打开
- `README.md`：使用说明（含 placeholder / 拖动 / 评论 / Mermaid 等所有交互）
- 用户在画布中操作后可下载：
  - 同名 `.md`（修改后版本；未编辑块沿用 `token.raw`，零编辑下载 → diff 报告显示"没有任何修改"）
  - `<stem>.diff.md`（修改前后 diff：语义块级 + 行级 appendix）
  - `<stem>.comments.json`（若有评论，含锚文本 / 正文 / 回复 / resolved 状态）

## Capabilities（当前 demo 已实现）

| 类别 | 能力 |
|---|---|
| 阅读 | 渐入动画、目录滚动高亮、表格 hover、design-token 一致的视觉 |
| 块编辑 | 标题 / 段落 / 列表 / 表格 / 代码 / 引用全部可 contentEditable；占位符方式输入 |
| 结构操作 | 块菜单（上下插入 / 复制 / 删除 / 转 H1-H4 / paragraph / list / quote，convert 是 toggle）、SortableJS 拖动重排 |
| 斜杠菜单 | 空段输入 `/` 弹菜单（17 种块类型，含 11 基础块 + 6 种 callout；方向键 / 输入框搜索）；**空块时原地转换**，非空时插入到当前块之后 |
| 行内格式 | 选中文字浮动工具栏（B / I / 行内代码 / strike / link / 评论 `💬`）+ ⌘B/I/E/K 快捷键 |
| 即时转换 | 行首 `# ` / `## ` / `- ` / `1. ` / `> ` / `---` 自动转块；`**foo** ` 自动加粗；列表项前缀 `[ ] ` / `[x] ` 自动转 GFM task list checkbox |
| Smart Enter | 段落/标题/引用 Enter 拆块；空列表项 Enter 跳出列表；任意块 Shift/Ctrl+Enter 软换行 |
| Smart Backspace | 空块 Backspace 删块（光标跳到上一块末尾）；空列表项 Backspace 只删该项 |
| 表格操作 | 单元格 focus 上方浮 action bar（行列增删）；cell 边缘拖拽改列宽 / 行高（HTML 内有效） |
| 查找替换 | ⌘F 查找；⌘⇧F 切换替换；高亮全文匹配；方向键跳转 |
| 评论批注 | 选中文字 → 加评论 → coral 虚线下划线 + 右侧侧边面板线程（回复 / 解决 / 删除 / 跳锚点）；下载附 `.comments.json` |
| Mermaid | ` ```mermaid ` 代码块自动渲染 SVG；块右上 toolbar 切换 `源码 / 两者 / 图` 三模式 + `+ 详情` 一键生成节点详情副块（自动抽节点 ID 预填）；主题色对齐 design tokens；**节点点击查看详情**：mermaid 原生 `click X "#anchor"` → 锚点跳转 + coral 闪烁；副 ` ```mermaid-detail ` 块（节点 ID → markdown）→ 左下浮出详情面板 |
| **章节折叠** | H1/H2/H3 标题前 `▾` chevron 点击 → 折叠到下一个同级标题；状态 localStorage 持久化；插入新块自动展开父标题 |
| **任务清单** | GFM `- [ ]` / `- [x]` 渲染为 coral 可点击 checkbox；勾选项删除线 + 灰色；序列化时回写正确标记；canvas 内打 `[ ] `/`[x] ` 自动转换 |
| **阅读辅助** | 顶部进度条（coral → amber 渐变，跟随滚动）；返回顶部按钮（滚动 > 600px 出现，平滑滚动） |
| **GFM Callout** | `> [!NOTE/TIP/IMPORTANT/WARNING/CAUTION]` 渲染为彩色块；扩展 `[!discussion](url)` 加"↗ 打开讨论"外链按钮；**canvas 内打字到 `]` 立即变 callout、保留光标**；**斜杠菜单 6 种快捷条目**（`/c` 即可过滤出全部），discussion 自动弹 URL 输入 |
| 持久化 | localStorage 自动暂存正文 + 折叠状态；下次打开"恢复 / 忽略"横幅 |

## Required References

- `workspaces/design-prototype/templates/CLAUDE_EDITORIAL_DESIGN_TOKENS.md`（视觉 token 权威源）
- `workspaces/design-prototype/AGENTS.md`（Required References 章节，约束硬编码色值）
- `projects/desktop-pet/02-design/branches/Diary/md-canvas-demo/`（当前 demo 实现，作为模板抽象的基准）

## Quality Checklist

- 零编辑下载 → `<stem>.diff.md` 报告 "没有任何修改"
- 渲染只使用 design tokens（无硬编码 hex 在 HTML 中）
- 中英文混排正常；中文标点不被首尾换行打散
- mermaid 块自动渲染 SVG；语法错误显示在图区域，不抛 throw
- 表格行列增删后 round-trip 不丢内容；列宽 / 行高 HTML 内有效但不写入 markdown（属预期）
- 评论 `comments.json` 中每条至少含 `id / blockId / anchorText / body / replies / resolved / createdAt`
- 顶层 `<script type="text/markdown">` 内的 `</script>` 已转义

## Guardrails

- **不修改源 MD**：所有"回写"都通过用户下载交付，agent 二次 apply
- **不上传源 MD**：到任何外部服务（CDN 库 OK）
- **不内联硬编码 hex**：必须经 design tokens → CSS 变量
- **不依赖 MCP / 服务器**：单文件 HTML，浏览器 file:// 双击可用
- **不引入大型框架**（React / Vue / 编辑器 lib）：保持单文件分发的轻量优势
- **不破坏 round-trip**：未编辑块的 markdown 必须一字不差

## Open Items（沉淀为正式 Skill 前必须解决 / 决定）

| 类别 | 项 | 影响 | 处理建议 |
|---|---|---|---|
| 评论 | 块转类型 / 拖动重排后，评论 coral 锚点丢失视觉 | `COMMENTS` 数据仍在；侧边面板可见，但 canvas 上看不到下划线 | 引入稳定 `data-block-id` + 内容重定位算法 |
| Mermaid journey | hover 显示步骤痛点 / 指标 | 未实现，mermaid journey 步骤没稳定 id | 需要 overlay 重写或 fork mermaid journey 渲染 |
| Mermaid gantt | 按 section / owner 筛选行 | 未实现 | 在 SVG 上加 filter 工具栏 + CSS 隐藏 row |
| Mermaid detail 副块 | 必须与 mermaid 块**相邻**（中间不能隔其他块） | 顺序换了就失效 | 改用稳定 anchor id 关联，而非邻接位置 |
| 表格 | 列宽 / 行高不写入 markdown | 视觉调整只在 HTML 内有效 | 评估是否在 markdown 中以 HTML `<table>` 形式持久化（牺牲 GFM 兼容） |
| 代码 | 无语言高亮（Prism / Shiki） | 长代码段可读性差 | 可作为 P1 加 prism CDN |
| 列表 | 嵌套列表的 Tab/Shift+Tab 缩进未实现 | 多层 list 拖动 / 缩进受限 | 加 Tab 缩进 + 递归序列化 |
| 多文件 | 没有跨 MD 引用 / 多文件画布 | 无法处理 `[[link]]` 关系 | P2 加 manifest，多文件 canvas |
| 图片 | 没有图片拖拽插入 | 评审稿无法夹图 | P1 加 base64 inline OR sidecar 目录 |
| 协作 | 单人本地工具，无实时多端 | 多人评审需口头协调 | **不推荐做**：违背 APB "agent in the loop" 哲学 |
| 主题 | 没有 light / dark / sepia 切换 | mermaid 图永远 cream 背景 | 加 theme toggle + mermaid 二次 init |
| 校验 | 没有 round-trip 自动测试 | 回写质量目测 | 沉淀 skill 时加自检脚本（零编辑生成 + diff 比对） |
| 移动 | 响应式 < 720px 体验略简 | 评审不适合手机 | 可接受，目标场景是桌面 |

## Phased Creation Plan

| Stage | 内容 | 触发 |
|---|---|---|
| **1 · Demo（已完成）** | 单文件 HTML + Python 内联生成；面向 Diary PRD 验证 | 已落在 `projects/desktop-pet/02-design/branches/Diary/md-canvas-demo/` |
| 2 · 抽象 generator | 把内联生成抽成命令行 / Python script，接受任意 `.md` 输入；保留 design tokens preset | 在第二个真实项目（非 Diary）用一次后启动 |
| 3 · 注册为正式 Skill | 把 generator + template 沉淀到 `~/.agents/skills/md-canvas/` 或项目级 `skills/`；写 SKILL.md | Stage 2 跑顺、Open Items 中至少解决评论锚点持久化 |
| 4 · 评估提升为全局 Skill | 跨项目验证、加自检脚本、补 README | Stage 3 运行 ≥ 3 次后 |

> 现阶段不要执行 Stage 2-4：还需在 demo 上继续迭代修边界 case。

## Future Skill Directory Layout

按 [Claude Code Skills 规范](https://docs.claude.com/en/docs/claude-code/skills) —— **一个 Skill 是一个目录，不是单文件**。`SKILL.md` 是 Claude 读取的入口（含 YAML frontmatter，遵循 progressive disclosure 只放概念 + 最小调用路径），其他详细内容、可复用脚本、模板资产分别拆到 references / scripts / assets 子目录。

```
skills/md-canvas/
├── SKILL.md                      # 入口；YAML frontmatter 决定是否被 Claude 调用
├── references/                   # progressive disclosure：详细规则，按需读
│   ├── CAPABILITIES.md           # 完整交互模型（块菜单、斜杠菜单、评论、mermaid…）
│   ├── SERIALIZATION.md          # round-trip 规则（哪些块走 token.raw、哪些 DOM 重建）
│   ├── INPUTS.md                 # 参数详细说明 + 默认值 + 边界条件
│   ├── EXAMPLES.md               # 典型调用示例（PRD review / design handoff / engineering doc）
│   └── KNOWN_LIMITATIONS.md      # 当前未解决项与 workaround（同步本 spec 的 Open Items）
├── scripts/                      # 可执行工具，agent 通过 Bash 调用
│   ├── generate.py               # 主生成器：source.md + tokens → output dir
│   ├── validate.py               # 自检：零编辑 round-trip diff 必须为空
│   └── apply_edits.py            # 反向：把下载的 *.md / *.diff.md / *.comments.json apply 回源
├── assets/                       # HTML 模板 + design token preset，被 generate.py 内联
│   ├── index.template.html       # 含 __MARKDOWN_SOURCE_INLINE__ 占位符
│   ├── README_TEMPLATE.md        # 输出目录 README 的样板
│   └── presets/                  # design tokens preset 软链或副本
│       └── claude_editorial.md   # → workspaces/design-prototype/templates/CLAUDE_EDITORIAL_DESIGN_TOKENS.md
└── tests/                        # 可选：固定 fixture 跑 round-trip
    ├── fixtures/
    │   ├── simple_prd.md
    │   ├── with_mermaid.md
    │   ├── with_tables.md
    │   ├── with_tasks.md          # GFM task list 校验素材
    │   └── long_prd.md            # 多章节，折叠功能校验素材
    └── run_roundtrip.sh
```

### 各组成职责

**`SKILL.md`** ：YAML frontmatter 决定触发，body 一定要短（< 200 行）。所有详细规则用 `See references/...` 形式延后展开。

**`references/`** ：每个 `.md` 文件专注一个维度，agent 仅在确实需要时再 `Read`。

**`scripts/generate.py`** ：
- CLI 入参：`--source <md>`（必）、`--output <dir>`（默认 `<source_parent>/<stem>-canvas/`）、`--tokens <preset_path>`（默认 claude_editorial）、`--mode read|edit`（默认 read）。
- 内部步骤：读 template → 读 source → 转义 `</script>` → 替换 `__MARKDOWN_SOURCE_INLINE__` → 写 `index.html` + `README.md`。
- 不调用网络、不启动服务、不修改 source。

**`scripts/validate.py`** ：
- 入参：`--canvas <dir>`。
- 用 headless（playwright 或 jsdom）打开 `index.html`，模拟"零编辑 → 触发下载"，把生成的 `.md` 与 source 做严格 diff —— 必须空。
- 失败时 stderr 输出第一个漂移的 block index，方便定位 serializer bug。

**`scripts/apply_edits.py`** ：
- 入参：`--source <md>`、`--edited <downloaded.md>`、`[--comments <comments.json>]`。
- 把 `edited` 覆盖到 `source`；评论写入 `<source_parent>/comments/<stem>.comments.json` 或项目 `06-sync/` 视上下文。
- 默认 dry-run，需要 `--apply` 才真改文件；apply 前打印 unified diff 给用户确认。

**`assets/index.template.html`** ：当前 demo 的 `index.html` 抽掉内联 MD 后的产物，作为模板单元；其中视觉相关的 hex 全部换成 design token 变量。Claude Skills 约定输出用的模板、字体、图标等放 `assets/`。

**`assets/presets/`** ：未来支持多套风格时在这里加 preset；当前只放 claude_editorial。

**`tests/`** ：固定 fixture 测试，CI 友好。最关键的是 `with_tables.md`（表格行列序列化）、`with_mermaid.md`（` ```mermaid ` 不会被改坏）、`with_tasks.md`（GFM task list 勾选状态 round-trip）、`long_prd.md`（章节折叠在多章节文档上不漂移）。

### Stage 3 落地最小集

不必一开始把所有文件都做出来。注册为正式 Skill 时只要：

```
skills/md-canvas/
├── SKILL.md
├── references/
│   ├── CAPABILITIES.md
│   └── SERIALIZATION.md
├── scripts/
│   └── generate.py
└── assets/
    ├── index.template.html
    └── README_TEMPLATE.md
```

`validate.py` / `apply_edits.py` / `tests/` 等 Phase 4 再补。

---

## SKILL.md Draft（入口文件内容）

> 按 [Claude Code Skills 规范](https://docs.claude.com/en/docs/claude-code/skills)：YAML frontmatter（`name` + `description` + 可选 `allowed-tools`），body 走 progressive disclosure。`description` 是 Claude 决定是否调用此 skill 的唯一依据，**必须同时讲清楚"做什么 + 何时用"**，最好含触发关键词。

```md
---
name: md-canvas
description: Turn any Markdown file (PRD, design doc, engineering note, research memo) into a self-contained interactive HTML canvas that supports drag-and-drop block reordering, a slash command menu, an inline formatting toolbar, find-and-replace, sticky-note comments, table cell resizing, inline Mermaid diagram rendering, collapsible H1/H2/H3 sections, interactive GFM task-list checkboxes, GitHub-style alert callouts (`> [!NOTE/TIP/WARNING]` plus custom `[!discussion](url)` for jumping to external comment threads), a reading-progress bar, and a back-to-top button — and exports edits back as a same-named .md plus a diff report and optional comments.json so the source markdown is never mutated in place. Make sure to use this skill whenever the user mentions reviewing a markdown doc, annotating a PRD, creating a "browser version" of a .md, wanting a "Notion-like view" of their markdown, building a review checklist with task boxes, folding long-doc sections, or exporting markdown changes back to a file — even if they don't say "canvas" or "HTML" explicitly. Also use this when the user wants a rich editing surface for any .md without setting up a server or framework. Trigger phrases include: "render markdown as HTML", "interactive canvas", "review a PRD in the browser", "make this doc commentable", "edit markdown visually", "Notion-like view of my .md", "export diff to markdown", "approval checklist in markdown", "collapsible doc sections", "long PRD navigation".
allowed-tools: Read, Write, Bash
---

# md-canvas

Turn any `.md` into a self-contained editable HTML canvas, then round-trip edits and comments back to markdown.

## When to use

- The user hands you a markdown file and asks for an interactive / reviewable form.
- A reviewer wants to comment or rewrite without touching the source `.md`.
- A PRD, design handoff, or engineering doc needs a "click-and-drag" presentation form.

Do NOT use when:

- The user only needs a static HTML preview — recommend `pandoc` or a markdown viewer instead.
- The user wants real-time multi-user collaboration — out of scope.

## Inputs

- `source_md` (required): path to the `.md` to render.
- `design_tokens` (optional): path to a `*_DESIGN_TOKENS.md` file. Defaults to `workspaces/design-prototype/templates/CLAUDE_EDITORIAL_DESIGN_TOKENS.md`.
- `output_dir` (optional): defaults to `<source_md parent>/<stem>-canvas/`.
- `initial_mode` (optional): `read` (default) or `edit`.

## Workflow

1. Read `source_md`. Reject empty files.
2. Read the design tokens file referenced by `design_tokens`.
3. Load the bundled HTML template (see `./assets/index.template.html`).
4. Inline the source into the template's `__MARKDOWN_SOURCE_INLINE__` placeholder. Escape any nested `</script>`.
5. Write `<output_dir>/index.html` (self-contained, single file).
6. Write `<output_dir>/README.md` with usage instructions (see `./assets/README_TEMPLATE.md`).
7. Print the output path. Do NOT open a browser, do NOT start a server.

For details on the canvas's interaction model (block menu, slash menu, comments, mermaid, etc.), see `./CAPABILITIES.md`.

For details on round-trip serialization rules (which blocks survive `token.raw`, which are re-emitted from DOM), see `./SERIALIZATION.md`.

## Outputs

The skill produces two files. Downloads from the browser (handled by the canvas itself) are not skill outputs:

- `<output_dir>/index.html` — self-contained interactive canvas.
- `<output_dir>/README.md` — how to open and use it.

User-side downloads from the canvas (delivered via browser `Save As`, not the skill):

- `<stem>.md` — edited version of the source (same name; user overwrites manually).
- `<stem>.diff.md` — semantic + line-level diff against the original.
- `<stem>.comments.json` — only if comments exist.

## Examples

**Example 1 — review a PRD**

User: 「帮我把 `projects/desktop-pet/01-pm/PRD.md` 做成可批注的 HTML 版本」

Steps you should take:
1. `Read` the source file to confirm it exists and isn't empty.
2. `Bash` run `python scripts/generate.py --source projects/desktop-pet/01-pm/PRD.md`.
3. Confirm the output landed in `projects/desktop-pet/01-pm/PRD-canvas/index.html`.
4. Report the path back. Do NOT open a browser; do NOT start a server.

**Example 2 — apply downloaded edits back**

User: 「我评审完了，这是我下载的 `PRD.md` 和 `PRD.comments.json`，把改动 apply 到源文件吧」

Steps you should take:
1. `Bash` run `python scripts/apply_edits.py --source projects/<…>/PRD.md --edited <downloaded>/PRD.md --comments <downloaded>/PRD.comments.json` — default is dry-run.
2. Show the user the unified diff that prints.
3. Wait for confirmation before re-running with `--apply`.

**Example 3 — when NOT to use this skill**

User: 「帮我把这份 PRD 转成 PDF」

This skill does not produce PDF. Recommend `pandoc` or browser print-to-PDF on the rendered canvas instead.

## Guardrails

- **Never modify the source `.md` from the skill side** — users treat the source as the version-controlled canonical artifact, and unsanctioned writes break their git diff and trust model. The roundtrip flow is: user edits in the canvas → downloads files → agent applies edits in a separate, reviewable pass.
- **Never inline credentials, tokens, or private URLs into the generated HTML** — the canvas is meant to be sharable; treat any non-public string as off-limits.
- **Never inline hardcoded color hexes** — the canvas must reuse the design tokens preset so a future theme swap is one-file. Inline hexes scatter the brand and make swaps impossible.
- **Never depend on a running server** — the output must work via `file://` double-click, because reviewers often open it on a laptop with no toolchain. CDN scripts are OK; localhost is not.
- **Never break round-trip** — untouched blocks must serialize back to their original `token.raw` byte-for-byte, so reviewers can trust that "I didn't change anything in section X" shows as zero diff. If you can't guarantee identity for a block type, fall back to `token.raw` rather than re-emit.

## Quality gate

Run this sanity check after generating:

1. Open the produced HTML, do not edit anything, click "下载".
2. The resulting `<stem>.diff.md` must report "没有任何修改".

If the diff shows changes on a zero-edit pass, the template's serializer drifted — investigate before shipping.
```

> SKILL.md 中的 `./assets/index.template.html`、`./references/CAPABILITIES.md`、`./references/SERIALIZATION.md` 等路径对应"Future Skill Directory Layout"小节里规划的文件。SKILL.md 自己保持精简，详细内容延后到 references。这套拆分在 Phase 3（注册为正式 Skill）执行；现阶段所有内容仍在本 spec 文件里展开，便于迭代。

## Evals（注册为正式 Skill 时同步落地）

md-canvas 是"objectively verifiable"类型的 skill —— 输入 `.md` → 输出 `index.html`，round-trip 行为可程序化校验，符合 skill-creator 推荐的"建评测集"前置条件。当 Phase 3 真正建 `skills/md-canvas/` 目录时，同步建 `skills/md-canvas/evals/evals.json`，初版至少 3 条 + 后续补到 6-8 条。

初版草稿：

```json
{
  "skill_name": "md-canvas",
  "evals": [
    {
      "id": 1,
      "prompt": "把 fixtures/simple_prd.md 做成可批注的 HTML 画布",
      "files": ["fixtures/simple_prd.md"],
      "expected_output": "生成 simple_prd-canvas/index.html + README.md；零编辑下载 → diff 报告必须是「没有任何修改」",
      "assertions": [
        "index.html exists at expected path",
        "README.md exists at expected path",
        "index.html size > 50 KB",
        "round-trip with zero edits produces empty diff",
        "no hardcoded hex colors outside the design tokens block"
      ]
    },
    {
      "id": 2,
      "prompt": "渲染这份含 mermaid 序列图的 PRD",
      "files": ["fixtures/with_mermaid.md"],
      "expected_output": "mermaid 块全部识别并挂上三档 toolbar；下载 .md 后 ```mermaid ... ``` 源码字节级一致",
      "assertions": [
        "every ```mermaid block has data-md-type=code in HTML",
        "round-trip preserves ```mermaid fence exactly",
        "mermaid library script tag present"
      ]
    },
    {
      "id": 3,
      "prompt": "我的 PRD 表格有 8 列，能在 HTML 里改成可拖拽调整列宽吗？",
      "files": ["fixtures/wide_table.md"],
      "expected_output": "表格 cell focus 时 action bar 浮现；列宽 / 行高 HTML 内有效但**不写回 markdown**（这是预期，markdown 没有该语法，需在 README 明确说明）",
      "assertions": [
        "tables get position:relative for cell-edge resize",
        "README mentions the 'widths not preserved in .md' caveat",
        "row/column add/delete buttons present in HTML"
      ]
    },
    {
      "id": 4,
      "prompt": "把这份 spec 转成 PDF",
      "files": [],
      "expected_output": "skill 应当礼貌拒绝 / 推荐替代方案（pandoc 或浏览器打印），不应当生成 canvas",
      "assertions": [
        "skill does not invoke generate.py",
        "response mentions pandoc or browser print",
        "response does not produce HTML"
      ]
    },
    {
      "id": 5,
      "prompt": "我有一份 PRD 想加 approval checklist，让评审人勾选确认项",
      "files": ["fixtures/prd_with_tasks.md"],
      "expected_output": "GFM `- [ ]` / `- [x]` 渲染为可点击 checkbox；勾选后下载 .md 应反映新状态；未勾的保持 `[ ]`",
      "assertions": [
        "every `- [ ]` line renders as an enabled input[type=checkbox]",
        "every `- [x]` line renders as a checked input[type=checkbox]",
        "round-trip after toggling checkboxes emits the new state in markdown",
        "untouched task items preserve original raw bytes"
      ]
    },
    {
      "id": 6,
      "prompt": "我的 PRD 有 1200 多行 60 多个章节，浏览器里能折叠章节吗？",
      "files": ["fixtures/long_prd.md"],
      "expected_output": "H1/H2/H3 标题前 chevron 点击折叠；状态写入 localStorage；刷新后状态保持",
      "assertions": [
        "every h1/h2/h3 has a fold-toggle button with data-skip-serialize='true'",
        "clicking a chevron toggles data-collapsed attribute on the heading section",
        "fold state survives reload via localStorage",
        "folded chevron node never leaks into serialized markdown"
      ]
    },
    {
      "id": 7,
      "prompt": "在空段里输入 /c important 选「重要 callout」后，原空段应该就地变成 callout，而不是在后面新插一块",
      "files": ["fixtures/simple_prd.md"],
      "expected_output": "在空段触发斜杠菜单后选 callout 类型 → 原段落被 replace，DOM 中不存在残留的 `/` 段落；当前块原地变成 callout 块",
      "assertions": [
        "after slash selection, source DOM no longer contains the empty paragraph with `/`",
        "the new callout block occupies the same DOM position as the original empty paragraph",
        "total .md-block count is unchanged (replaced, not appended)",
        "in-place callout has the correct data-md-type and callout class"
      ]
    }
  ]
}
```

`fixtures/` 用 `tests/fixtures/` 下的现成样本（`simple_prd.md` / `with_mermaid.md` / `with_tables.md`）。第 4 条是"should-not-trigger / 拒绝"用例，校验 skill 的边界判断。

跑评测的命令链（Phase 3+）：

```bash
# 1. Aggregate
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name md-canvas

# 2. Review
python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name md-canvas \
  --benchmark <workspace>/iteration-N/benchmark.json
```

不在现阶段执行 —— 待真目录建好后跑。

## Decision Log

- **2026-05-15**: 视觉权威迁到 `workspaces/design-prototype/templates/CLAUDE_EDITORIAL_DESIGN_TOKENS.md`；根 `DESIGN.md` 仅留入口指针
- **2026-05-15**: 决定先做 demo 验证再沉淀 skill；放在 `feat/md-to-canvas-demo` 分支
- **2026-05-16**: MD 渲染 / 编辑 / round-trip / 评论 / mermaid 等基本能力跑通，开始落 spec 草稿；Open Items 留待后续迭代解决
- **2026-05-16**: 按 skill-creator 复查后调整：`template/` → `assets/` 对齐 Claude 约定；description 加 pushy 触发句式 + 更多触发关键词；Guardrails 每条补 "why"；新增 Examples（含拒绝用例）；新增 Evals 草稿
- **2026-05-16**: 加 P0 第一批能力 —— **章节折叠**（H1/H2/H3 chevron，localStorage 持久化；插入新块自动展开父标题；chevron 节点 `data-skip-serialize` 不污染 round-trip）和 **GFM 任务清单**（`- [ ]` / `- [x]` 渲染为可点击 checkbox，序列化时回写状态；canvas 内打 `[ ] `/`[x] ` 自动转换）；Capabilities 表更新；description 加触发关键词（review checklist / folding sections / approval checklist）；新增 2 条 evals（`with_tasks.md` / `long_prd.md`）
- **2026-05-16**: 加 P0 第二批 UX 增强 —— **阅读进度条**（顶部 2px coral→amber 渐变随滚动延伸）、**返回顶部按钮**（滚动 > 600px 出现）、**GFM Callout**（`> [!NOTE/TIP/IMPORTANT/WARNING/CAUTION]` 渲染彩色块 + 自定义扩展 `[!discussion](url)` 跳转外部讨论锚点）；`dataset.calloutMarker` 保留原 marker 字符串，序列化时回写到第一段开头，round-trip 干净；按用户要求**不做 dark mode** —— 留待后续真有团队反馈再加
- **2026-05-16**: callout 加动态识别 —— 在 blockquote 编辑时输入到 `]` 即刻变 callout；`wasActive` 检测保住光标位置与 firstP（即使变 callout 后 marker 被剥光也不会把空段干掉，避免用户失去打字位置）
- **2026-05-16**: callout 加斜杠菜单 6 种快捷条目（`callout-note/tip/important/warning/caution/discussion`），`/c` 一次过滤全部；discussion 自动弹 `prompt` 收 URL；`insertNewBlock` 中 `setupCallouts` 必须先于 `applyPlaceholdersToNewBlock` 跑（否则 placeholder 清空 innerHTML 会把 `[!TYPE]` marker 也擦了导致识别失败）
- **2026-05-16**: 修复"空块斜杠菜单原地转换"bug —— `slashFilter.focus()` 会把 selection 从 contentEditable 段落移到 input，导致 `applySlashChoice` 拿不到原 editable、`/` 没被 strip → 空段检测失败 → 走"插新块"分支。修法：`openSlashMenuAtCaret` 提前把 active editable 缓存到 `slashContext.editable`，`applySlashChoice` 用缓存而非当前 selection；同时给 `convertBlockByRaw` 补 `setupCallouts` / `setupTaskLists` / `setupMermaidBlock`（原 in-place 转换路径漏了这三个 setup，导致原地变出来的 callout / 任务清单 / mermaid 不会被识别）
- **2026-05-16**: Mermaid 节点点击查看详情。两条路径：(A) 原生 `click X "#anchor"` → 拦截 SVG `<a>` 的 hash href → `jumpToCanvasAnchor` 滚到 canvas 内对应 id 并 coral 闪烁；(B) 副 ` ```mermaid-detail ` 块（YAML-ish `key: 缩进 markdown`）→ `parseMermaidDetail` 解析 → 遍历 SVG `g.node / g.actor / g.statediagram-state` 用 id 正则 `^(?:flowchart|state|classGroup|er|sequence|mindmap)-(.+?)(?:-\d+)?$` 抽 key → 命中即挂 click handler → 左下 `#mermaid-detail-panel` 渲染 markdown。副块在 canvas 中 `display: none` 隐藏（class `is-mermaid-detail-source`）。Journey hover / Gantt 筛选标记为 v1 已知未做项
- **2026-05-16**: 修两个 code 块 bug + 加 Mermaid 创建入口。(1) `editableTargetsFor` 把 `pre` 和 `code` 都设 contentEditable → 用户点 pre 的 padding 区时字进 `<pre>`、内层 `<code>` 仍 `:empty` 导致 placeholder 不消失；改为只 `pre > code`，并把 CSS padding 从 `<pre>` 搬到 `<code>` 上。(2) `applyPlaceholdersToNewBlock` 无脑清 code innerHTML 会擦掉 mermaid starter，加 `textContent.trim() === ''` 守卫。(3) slash 菜单加 `Mermaid 图` / `Mermaid 详情副块` 入口；并在 mermaid 块右上 toolbar 加 `+ 详情` 按钮（无邻居 detail 时显示），点击调用 `extractMermaidNodeIds` 从 mermaid 源里正则抽节点 ID（过滤 mermaid 关键词），调用 `buildMermaidDetailTemplate` 预填详情副块，调 `insertNewBlock` 插在 mermaid 块之后；通过 `has-mermaid-detail` class 反映"已配对"状态，按钮 CSS 隐藏
