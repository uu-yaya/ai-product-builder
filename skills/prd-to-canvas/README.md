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
Use the skill at /Users/me/skills/prd-to-canvas to process xxx.md
```

只要 agent 能 Read 文件，都能跑。

---

## 它做什么

4 阶段流程，全程 agent 干活，关键决策点让你确认：

| 阶段 | 你看到什么 |
| --- | --- |
| **1. 解析** | agent 边读 PRD 边吐"发现一块就报一块"（终端流式 + 最后出独立 `analysis.html`） |
| **2. 覆盖报告** | 17 类 md-canvas 块的能力地图：你这份 PRD 用了几类、候选有几类、未用的可以在 canvas 里手动加 |
| **3. 确认 checklist** | 浏览器打开 `checklist.html`，每个候选块一行，你可以"确认升级 / 保留 / 改边界 / 跳过"。改完导出 `decisions.json`，agent 读这份继续 |
| **4. 生成** | 按你的决策重写 → `canonical.md` → 注入 md-canvas 模板 → `index.html` 浏览器打开即可 |

第 3 阶段是**循环**的：你 reject 多少 agent 都会重跑 1+2+3 直到你全部 OK。

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
├── templates/            # 可视化模板（analysis / checklist / md-canvas）
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
├── analysis.html          ← Phase 1/2 报告
├── checklist.html         ← Phase 3 交互
├── decisions.json         ← 你的选择
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
- `01-analysis.html` —— Phase 1/2 出的报告
- `02-decisions.json` —— 用户在 checklist 里勾选的结果
- `03-canonical.md` —— Phase 4 重写
- `04-index.html` —— 最终生成

直接浏览器打开 `04-index.html` 体验最终效果。

---

## 限制

- 不评判 PRD 内容好坏（这是格式转换工具，不是 review 工具）
- 不动你的原始措辞、接口设计、业务字段
- Canvas-only 块（Mock / Prompt / Agent / Prototype）不写 .md，只提示你"可在 canvas 里加"
- 需要本地能跑 Python 3（用来注入 .md 到模板生成 HTML）

---

## License / 反馈

本 skill 是 ai-product-builder 项目的一部分，[相关 issue / PR 走仓库](https://github.com/...)
