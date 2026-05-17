# prd-to-canvas

把任何 markdown PRD 转成可交互的 HTML 页面（md-canvas）。

**输入**: 一份普通 markdown PRD（草稿状态也行）  
**输出**: 一个浏览器打开就能用的 `index.html`，里面有可编辑的标题/表格/接口契约/mermaid/Mock/Prompt 块等

支持任何兼容 [Agent Skills](https://agentskills.io) 的工具：Claude Code / Codex / Cursor / VS Code / GitHub Copilot / Gemini CLI / JetBrains Junie / Block Goose 等 30+ 工具。不支持的工具也能用，看下面"兜底"。

---

## 安装

### Claude Code（个人全局）

```bash
git clone <this-repo> ~/.claude/skills/prd-to-canvas
# 或
cp -r <repo>/skills/prd-to-canvas ~/.claude/skills/
```

调用：

```
/prd-to-canvas path/to/your-prd.md
```

### Claude Code（项目内，团队共享）

```bash
cd <your-project>
mkdir -p .claude/skills
cp -r <skill-repo>/skills/prd-to-canvas .claude/skills/
git add .claude/skills/prd-to-canvas
git commit -m "add prd-to-canvas skill"
```

队友 pull 之后 `/prd-to-canvas` 也能直接用。

### Codex / Cursor / 其他 Agent Skills 兼容工具

放到该工具约定的 skills 路径（详见各工具文档），slash 命令同样自动注册。

### 任何其他工具（兜底）

clone 到任意目录，然后口头让 agent 读：

```
请按照 ~/path/to/prd-to-canvas/SKILL.md 的说明，把 my-prd.md 转成 canvas HTML
```

或：

```
Use the skill at <path-to>/prd-to-canvas to process xxx.md
```

只要 agent 能 Read 文件，都能跑。

---

## 它做什么

4 阶段流程，全程 agent 干活，关键决策点让你确认：

| 阶段 | 你看到什么 |
| --- | --- |
| **0. Onboarding** | agent 第一次启动时自检环境（python / flask / git 配好没等）+ 解释两种模式（file / server）+ 缺啥引导你配。每个会改你环境的命令都会先征求同意。环境完美时 1 句话过 |
| **1. 解析** | agent 边读 PRD 边吐"发现一块就报一块"（终端流式） |
| **2. 覆盖报告** | 17 类 md-canvas 块的能力地图——`analysis.html` 只读 dashboard，按 category 分组 + 侧边栏跳转 |
| **3. 决策（对话）** | agent 在终端按批次问你：大部分一句"全部 accept"过；只有需要你拍的字段（mermaid 图类型 / 接口 4xx/5xx body / 讨论 URL 等）会逐个问。决策记到 `decisions.json` 做审计 |
| **4. 生成** | 按你的决策重写 → `canonical.md` → 注入 md-canvas 模板 → `index.html` 浏览器打开即可 |

第 3 阶段对话过程中，如果你对某个候选明显犹豫，agent 会主动提议"让审核 agent 再看一眼"（仅模式 E），触发那批 candidate 重跑 Phase 1+2+3。最多 5 轮。

---

## md-canvas 能渲染什么块（17 类）

详见 `BLOCK_INVENTORY.md`。摘要：

**MD-native（写进 .md，agent 重写）13 类**: 标题 / 段落 / 列表 / 表格 / 引用 / 分隔线 / 普通代码 / mermaid / 5 种 callout / 讨论 callout / 接口契约 A 模式 / 接口契约 B 模式

**Canvas-only（不写 .md，本地建）4 类**: 接口 Mock / Prompt 实验 / Agent 实验 / 原型预览

---

## 文件结构

```
prd-to-canvas/
├── SKILL.md              # Agent Skills 标准入口
├── README.md             # 你正在看的这份
├── BLOCK_INVENTORY.md    # 17 类块的检测规则 + 重写模板
├── WORKFLOW.md           # 4 phase 详细流程
├── templates/            # 可视化模板（analysis / md-canvas）+ DESIGN.example.md
├── prompts/              # 4 个 phase 的独立 prompt 指令
├── schemas/              # decisions.json 等数据格式契约
└── examples/             # 完整跑通的示例（输入 → 中间产物 → 输出）
```

---

## 输出落哪

默认输出在 `<原 PRD 目录>/canvas/`：

```
your-prd.md                ← 你原来的（永远不动）
canvas/
├── analysis.html          ← Phase 2 报告（只读 dashboard）
├── decisions.json         ← Phase 3 对话决策的审计/重放记录
├── canonical.md           ← Phase 4 重写
└── index.html             ← 最终成品，浏览器双击打开
```

如果你想换路径：

```
/prd-to-canvas your-prd.md --out ./public/
```

---

## 例子

`examples/ai-coach-demo/` 里有一份"新手陪练 AI 教练"半结构化 PRD 的完整跑通：

- `00-raw-prd.md` —— 输入（PM 草稿状态的原稿）
- `01-candidates.json` —— Phase 1 执行 agent 检测到的 73 个候选
- `01-review.json` —— Phase 1 审核 agent 复查（模式 E）
- `02-coverage.json` —— Phase 2 聚合统计
- `02-analysis.html` —— Phase 2 只读 dashboard（浏览器打开看 PRD 体检）
- `03-decisions.json` —— Phase 3 对话决策的审计记录
- `04-canonical.md` —— Phase 4 重写
- `04-rewrite-audit.json` —— Phase 4 审核（模式 E）
- `04-index.html` —— 最终成品

直接浏览器打开 `04-index.html` 体验最终效果，或先看 `02-analysis.html` 了解 agent 怎么"体检"PRD。

---

## 限制

- 不评判 PRD 内容好坏（这是格式转换工具，不是 review 工具）
- 不动你的原始措辞、接口设计、业务字段
- Canvas-only 块（Mock / Prompt / Agent / Prototype）不写 .md，只提示你"可在 canvas 里加"
- 需要本地能跑 Python 3（用来注入 .md 到模板生成 HTML）

---

## License / 反馈

本 skill 是 ai-product-builder 项目的一部分，[相关 issue / PR 走仓库](https://github.com/...)
