# Phase 0 — Onboarding（环境自检 + 解释 + 引导配置）

**这是 skill 被调用后做的第一件事**，比 pre-flight 参数检查还要早。目的：

- 用户从来没用过这个 skill → 不应该是黑盒。**让用户明确知道**这个 skill 会读哪里、写哪里、需要什么环境
- 环境不完整 → **agent 主动检测**，告诉用户具体缺啥，**逐步引导配置**，不能等到 save 失败才说

## 流程概览

```
agent 被调起
   ↓
Step 1: 一句话解释 + 列两种模式（file 简单 / server 协作）
   ↓
Step 2: 静默跑 5-7 个 read-only 检查命令
   ↓
Step 3: 出环境检查表（✓/⚠/✗）给用户看
   ↓
Step 4: AskUserQuestion 让用户选模式
   ↓
Step 5: 选 server + 有缺 → 逐项 walkthrough（每个改环境命令都征求用户同意）
   ↓
Step 6: 确认 ready，进 Phase 1
```

## Step 1: 解释 skill + 两种模式（要具体）

skill 自我介绍 + 两种模式的**真实工作流**对比。不要光列"支持/不支持"——要让用户看完直接知道选了会发生什么。

向用户输出（按这个结构，可调措辞但内容必须覆盖）：

```
👋 prd-to-canvas

把你的 markdown PRD 转成**可交互的 canvas HTML 页面**——
段落能编辑、接口能渲染成契约块（可发请求测试 + 多 status 响应）、
mermaid 自动画图、能加 Mock / Prompt 实验 / 评论等。

它有两种工作模式，区别主要在"保存到哪 + 队友怎么看到"：

──────────────────────────────────────────────────────────────
📝 file 模式（双击 HTML 用）
──────────────────────────────────────────────────────────────
  · 生成的是一份独立 HTML 文件，浏览器双击就能开
  · 你的编辑保存到**当前浏览器的 localStorage**
  · 关浏览器、换电脑、清缓存 → 编辑可能丢
  · 给队友看：你点"下载"按钮 → 拿到改过的 .md →
    手动发给队友 → 队友手动重生成 → 才能看到
  · 适合: 自己看 / 给老板 demo / 一次性快速看效果

──────────────────────────────────────────────────────────────
🚀 server 模式（本地起 server，浏览器编辑直接进文件 + git）
──────────────────────────────────────────────────────────────
  · 启动一个本地小 server（python3 server.py），浏览器开
    http://localhost:7799 看你所有 PRD
  · Cmd+S → server 直接写源 .md 文件 + 自动 git commit + push
  · 关浏览器 / 换电脑 → git pull 拿最新继续
  · 给队友看：你 push 完，队友 git pull 就有
  · 适合: 团队协作 / 自己跨电脑工作 / 需要历史版本控制

  ⚠ 注意 server 模式不替你配 git——用的是你 terminal 里现有的
    git 配置（remote URL、SSH key、push 权限）。我下面会自检告诉
    你 git 是否配好。
```

如果用户问"我没用过 git 怎么办"——展示这个补充说明：

```
没 git 也能用，会出现三种情况（你可以随时升级）:

  · 没建过 git 仓库:
       Cmd+S 只写 .md 文件，不做 git。内容不丢，但没历史版本
       (=本地草稿模式)

  · 本地 git init 了但没远端仓库:
       Cmd+S 写 .md + 本地 commit，但 push 失败
       本地版本历史在累积，等以后配好远端一次性 push 上去

  · 从工蜂等远端 clone 下来的:
       Cmd+S 写 .md + commit + push，全流程跑通，队友能看到
       (= 推荐的协作姿势)

我会在下面自检告诉你你当前在哪种情况，需要补什么就告诉你具体命令。
```

## Step 2: 环境检查（read-only，静默跑）

跑这些命令，记结果。**全部 read-only，不动用户环境**：

```bash
# Python
python3 --version 2>&1 || python --version 2>&1 || echo "MISSING"

# Flask
python3 -c "import flask; print(flask.__version__)" 2>&1 || echo "MISSING"

# 在 PRD 所在目录跑这些 git 检查（用 PRD 路径的 parent dir）
cd <prd_dir>

# 是否 git 仓库
git rev-parse --git-dir 2>&1 || echo "NOT_A_GIT_REPO"

# 远端
git remote get-url origin 2>&1 || echo "NO_REMOTE"

# 当前分支 + upstream
git rev-parse --abbrev-ref HEAD 2>&1
git rev-parse --abbrev-ref @{u} 2>&1 || echo "NO_UPSTREAM"

# git 身份
git config user.email
git config user.name
```

**不要**跑任何修改性命令（git add / git config set / pip install）——只读探测。

## Step 3: 检查报告表

把结果整理成 markdown 表格展示给用户：

```
环境检查（针对你的 PRD: <prd_path>）

| 项 | 状态 | 含义 |
| --- | --- | --- |
| Python 3 | ✓ 3.11.5 | 生成 HTML / 跑 server 都需要 |
| Flask | ⚠ 未安装 | server 模式需要（file 模式不需要）|
| Git 仓库 | ✓ /Users/me/work/proj | OK |
| Git remote | ✓ origin = git@git.code.tencent.com:你/项目.git | OK |
| Git upstream | ⚠ 分支 'main' 没设 upstream | server 模式 push 时需要 |
| Git 身份 | ✓ you@tencent.com | OK |

→ 评估:
  · file 模式可立即用 ✓
  · server 模式还差 2 项（Flask + upstream）
```

## Step 4: 问用户选模式

用 AskUserQuestion 同时问 2 个问题（一次 multi-question call）。**每个 option 必须带 description 字段**，告诉用户选了之后实际会发生什么。

### Q1: 工作模式

```
question: "你这次想怎么用？"
header: "工作模式"
options:
  - label: "file 模式（单人 demo / 给老板看）"
    description:
      "Phase 4 生成一份独立 HTML，你双击就能看。编辑存浏览器
       localStorage，给队友看要手动下载 .md 发过去。0 配置 0 依赖
       但不能多人协作。"
  - label: "server 模式（团队协作 / 跨电脑） (推荐)"
    description:
      "起本地 server，Cmd+S 直接写源 .md + 自动 git push。队友
       git pull 就能看到。需要装 Flask + git 配好能 push（我下面
       会检查 + 帮你补齐缺的）。"
  - label: "file 模式跑通，过几天再升级 server"
    description:
      "先 file 模式快速看效果，之后想要团队协作了再回来跑 skill
       升级到 server。零承诺起步。"
```

### Q2: agent 内部模式（如果工具支持子 agent）

仅在用户环境支持子 agent 工具时问这个（Claude Code 通常支持，Codex 看版本）。如果不支持就默认 A 模式，不问。

```
question: "处理 PRD 时用单 agent 还是 执行+审核 双 agent？"
header: "agent 模式"
options:
  - label: "执行 + 审核 (推荐)"
    description:
      "Phase 1 检测块 + Phase 4 重写时各起一个执行 agent 干活，
       再起一个审核 agent 用新鲜上下文复查（挡误检/漏检/破坏语气/
       不合法 YAML）。慢一倍但 checklist 干净、错误少。"
  - label: "单 agent (最快)"
    description:
      "一个 agent 串行干完 4 phase。最快，但容易有误检（把普通段落
       标成 callout 候选之类）。适合小型 PRD 或想快速过一遍。"
```

### 处理结果

- 选 file 模式 → 跳到 **Step 6**，跳过 server 配置
- 选 server 模式：
  - 环境检查全 ✓ → 跳到 Step 6
  - 有缺项 → 进 **Step 5** walkthrough 逐项问怎么补

## Step 5: server 模式缺啥逐项 walkthrough

对 Step 2 检查中**每一个缺的项**，单独发 AskUserQuestion。**任何会改用户环境的命令都必须先征求同意**——绝不静默 `pip install` / `git config` / 等。

每个修复都带详细 description，让用户清楚选了之后 agent 会跑什么命令、产生什么 side-effect。

### 缺 Flask

```
question: "需要装 Flask（server 模式必备的 python web 框架）。怎么装？"
header: "装 Flask"
options:
  - label: "我帮你跑 pip3 install flask"
    description:
      "agent 直接在你 terminal 跑 `pip3 install flask`，装到当前 python
       全局环境。装完会 import 验证一次。如果你用的是系统 python 可能
       需要 sudo / --user，遇到权限报错我会告诉你。"
  - label: "我自己装"
    description:
      "agent 不动你环境，只给你命令。装完回来按继续。"
  - label: "用 venv 隔离"
    description:
      "推荐用 venv 隔离依赖。agent 贴一份 3 行命令：python3 -m venv
       .venv && source .venv/bin/activate && pip install flask。你自己
       跑。后续 server 也要在这个 venv 里跑。"
  - label: "跳过，先用 file 模式"
    description:
      "不装 Flask。skill 退回 file 模式跑完 4 phase 生成 HTML 双击看。
       以后想升级 server 再说。"
```

如果用户选第一个，agent 跑 `pip3 install flask` 并等结果，再次验证 `import flask` 成功。如果失败（权限 / 网络），告诉用户错误并退回第二个选项。

### 不是 git 仓库

```
question: "<prd_dir> 不是 git 仓库。怎么处理？"
header: "git 仓库"
options:
  - label: "在当前目录跑 git init"
    description:
      "agent 跑 `git init`。会创建 .git/ 隐藏目录。从此你这个目录就是
       git 仓库，可以 commit 但还没远端，要进一步 git remote add 才能
       push。我会在下面接着问。"
  - label: "我已经有别的 git 仓库目录，搞错了"
    description:
      "你的 PRD 路径不在 git 仓库里。退出 skill，cd 到正确目录再调
       /prd-to-canvas。"
  - label: "不要 git，直接用 file 模式"
    description:
      "跳过 git 相关检查，跑 file 模式。"
```

### 没 git remote

```
question: "git 仓库没配远端。你的远端仓库 URL（如工蜂）是？"
header: "git remote"
options:
  - label: "我没远端仓库，怎么在工蜂建？"
    description:
      "agent 贴一份工蜂建仓库指引（创建项目 → 取 SSH URL → 回来粘贴）。
       不动你环境。"
  - label: "[让我贴 URL]"
    description:
      "选 Other 然后输入完整 git URL（如 git@git.code.tencent.com:你的名/项目.git）。
       agent 会跑 `git remote add origin <URL>` 注册它。"
  - label: "跳过，先用 file 模式"
    description: "保留无远端状态。Cmd+S 时本地 commit 还会做（情况 2），push 那步会失败。"
```

### 没 upstream

```
question: "当前分支 '<branch>' 没设 upstream（git 不知道 push 推到哪）。怎么办？"
header: "upstream"
options:
  - label: "agent 帮我跑 git push -u origin <branch>"
    description:
      "这条命令会做两件事：1) 设当前分支的 upstream 是 origin/<branch>
       2) 立即把本地 commit 推上去。需要远端仓库存在 + 你有 push 权限。
       推送的内容是你当前所有 unpushed commits。"
  - label: "跳过，我自己 terminal 配"
    description:
      "agent 不动。Cmd+S 时 push 会失败（提示要 set-upstream），但本地
       commit 还会做。"
```

### 没 git 身份

```
question: "git 没配 user.email / user.name。需要设（commit 必须用）。"
header: "git 身份"
options:
  - label: "[让我填 email + 名字]"
    description:
      "选 Other 然后输入 邮箱,名字（逗号分隔）。agent 跑两条命令:
       `git config user.email <你的邮箱>` + `git config user.name <你的名字>`。
       默认设到这个仓库，不动全局 ~/.gitconfig。"
  - label: "用全局已有的"
    description:
      "如果你之前在别的地方设过全局 git config，agent 跳过这步。
       commit 时会用全局值。"
  - label: "跳过"
    description: "commit 时会 prompt 你设。"
```

## Step 6: 确认 ready，进 Phase 1

打印最终状态 + 提示：

```
✓ 环境就绪

  · 模式: server / file
  · 输出会写到: <out>/
  · 跑 server: python3 skills/prd-to-canvas/server.py（要不要现在帮你启）

进 Phase 1 解析 PRD...
```

如果是 server 模式且环境就绪，可选项问用户是否现在起 server：

```
AskUserQuestion: "Phase 4 生成 index.html 后要现在帮你启 server 吗？"
  options:
    - "是，agent 在后台起 server + 自动开浏览器"
    - "否，我自己手动跑 python3 .../server.py"
```

如果选自动起 server：agent 用 `run_in_background: true` 跑 `python3 .../server.py` + 用户在浏览器看效果。

---

## 关键原则

- **每个会改环境的命令必须征求同意**（pip install / git config / git remote add / git push 等）。read-only 命令（version 查询 / status / show）可以静默跑
- **每个错误都给具体修复命令**，不要光抛 stderr
- **用户可以随时选"跳过"**进 file 模式 — 没配 git 也不阻塞 skill 使用
- **不要 over-engineer**：检查 5-7 项就够，不要遍历 git 所有配置
- **环境完美时不啰嗦** — 全 ✓ 就一行"环境就绪 ✓"加进 Step 6 提示

## 不要做的

- 不要静默装 pip 包 / 改 git config / push 到远端
- 不要把 "你必须配好 server 才能用 skill" 当 hard requirement——file 模式必须永远可用
- 不要把这步隐藏在某处自动跳过——**每次调起 skill 都做这步**（如果检测全 ✓，1 句话过即可）
