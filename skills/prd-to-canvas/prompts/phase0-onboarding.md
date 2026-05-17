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

## Step 1: 解释 skill

用 1 句话 + 2 行表格说清楚：

```
prd-to-canvas: 把你的 markdown PRD 转成可交互的 canvas HTML 页面（接口契约 / mermaid / 表格 / 评论 / 等都能渲染成块）。

两种模式可选:

| 模式 | 编辑保存在哪 | 多人协作 | 需要 |
| --- | --- | --- | --- |
| file 模式（简单）| 浏览器 localStorage | 不行（要下载 .md 手动给队友） | 只需 Python（生成 HTML 用）|
| server 模式（推荐）| 直接写源 .md + 自动 git push | 走 git 异步协作 | Python + flask + git 配好能 push |
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

```
AskUserQuestion: "你想用哪种模式？"
  options:
    - "file 模式（简单，单人 demo）"
    - "server 模式（推荐，团队协作）— 我帮你配齐缺的"
    - "先 file 模式跑通，之后再升级 server"
```

如果用户选 file 模式：跳到 **Step 6**。

如果用户选 server 模式：进 Step 5 walkthrough。

## Step 5: server 模式缺啥逐项 walkthrough

对 Step 2 检查中**每一个缺的项**，单独发 AskUserQuestion。**任何会改用户环境的命令都必须先征求同意**——绝不静默 `pip install` / `git config` / 等。

### 缺 Flask

```
AskUserQuestion: "需要装 Flask（python web 框架，server 用）。怎么装？"
  options:
    - "我帮你跑 pip3 install flask"
    - "我自己 pip install"
    - "用 venv（先建 venv，我贴命令给你）"
    - "跳过，先 file 模式"
```

如果用户选第一个，agent 跑 `pip3 install flask` 并等结果，再次验证 `import flask` 成功。

### 不是 git 仓库

```
AskUserQuestion: "<prd_dir> 不是 git 仓库。建一个？"
  options:
    - "是，跑 git init"
    - "不要，先用 file 模式"
    - "我自己处理后回来"
```

### 没 git remote

```
AskUserQuestion: "git 还没配远端仓库。你的工蜂仓库 URL 是？"
  options:
    - "我没有 git 仓库，帮我说怎么在工蜂建一个"
    - "Other（让用户贴 URL，agent 跑 git remote add origin <URL>）"
    - "跳过，先 file 模式"
```

如果用户贴了 URL，agent 跑 `git remote add origin <URL>`，再次验证。

### 没 upstream

```
AskUserQuestion: "当前分支 '<branch>' 没设 upstream。怎么处理？"
  options:
    - "Push 一次同时设 upstream（git push -u origin <branch>，会触发首次推送）"
    - "我自己 terminal 配，跳过"
```

### 没 git 身份

```
AskUserQuestion: "git 没配 user.email / user.name。要设吗？"
  options:
    - "Other（让用户写名字 + 邮箱，agent 跑 git config）"
    - "用全局 git config 已有的（如果有）"
    - "跳过"
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
