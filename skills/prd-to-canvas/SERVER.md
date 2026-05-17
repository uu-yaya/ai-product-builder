# md-canvas server 模式

skill 默认生成的 `index.html` 是单文件，**保存只写浏览器 localStorage**——别人看不见，关浏览器可能丢，需要"下载 → 替换 → 重生成"才能让队友看到。

**server 模式**把 canvas 升级成真编辑器：

- `Cmd+S` 直接写回硬盘上的源 `.md` 文件
- 自动 `git add + commit + pull --rebase + push`
- 队友 `git pull` 就能看到
- 没有"未提交修改"那个误导弹条
- 关浏览器、换电脑、清缓存都不丢

适用场景：**异步多人协作 PRD**（一作多评 / 多人轮改）。冲突走 git 解决。

---

## 前置：你的 git 要先能 push

server **不替你配 git**。它就是个 shell 调用 `git add/commit/pull/push` 的小壳子，**用的全是你 terminal 里现有的 git 配置**（remote URL、SSH key/token、user 身份、当前分支的 upstream）。

如果你 terminal 里下面这条能 work（验证 git push 通路）：

```bash
# macOS / Linux:
cd <你的项目> && git commit --allow-empty -m "test push" && git push

# Windows (PowerShell):
cd <你的项目>; git commit --allow-empty -m "test push"; git push
```

### 🚨 首次使用必看：凭证缓存

**HTTPS 仓库**（github.com / gitlab.com / git.code.tencent.com 等）首次 push 通常会让你输 username + access token。但 server 是个 background 子进程**没 TTY**——git 想交互式问，问不到，sliently 失败。

**解法**：起 server **之前**，先在 terminal 手动跑一次 `git push`（哪怕是 empty commit），输完凭证后 credential helper 会缓存到 `~/.git-credentials`，之后 server 自动 push 才能用。

```bash
git config credential.helper store  # 启用本地缓存（默认很多发行版已有）
git push                            # 让 git 把凭证 prompt 出来，输入完它会自己存
```

server 启动时会**主动跑一次 git push --dry-run --no-prompt** 探测，如果撞凭证问题会在 banner 顶部告诉你具体怎么修。SSH key 仓库一般不撞这个，因为 SSH agent 处理 auth。

那 server 一定能 work。否则先按下面 checklist 配好：

| 缺啥 | 怎么补 |
| --- | --- |
| 不是 git 仓库 | `cd <项目根> && git init` |
| 没远端 | `git remote add origin <your-git-url>`（GitHub / GitLab / 工蜂 / Gitea 都行） |
| 分支没 upstream | `git push -u origin <你的分支名>` |
| 没 SSH key 或 token | 走你 git host 的 SSH key / personal access token 流程 |
| 没 git 身份 | `git config user.email <your-email> && git config user.name <your-name>` |

server 启动时会自动检查上面这些，缺啥会在 terminal 顶部列出来 + 告诉你具体跑啥命令。

## 安装

### macOS / Linux

```bash
python3 -m pip install -r skills/prd-to-canvas/requirements.txt
# 或单独装:  python3 -m pip install flask
```

### Windows（cmd / PowerShell）

```powershell
python -m pip install -r skills\prd-to-canvas\requirements.txt
# 或: python -m pip install flask
# (如果 'python' 不是 Python 3, 用 'py -3' 替换)
```

> 用 `python -m pip` 而不是直接 `pip`，避开 pip 脚本 shebang 在某些挪过的 venv 里失效的问题。

## 日常用

### macOS / Linux

```bash
cd ~/work/ai-product-builder
python3 skills/prd-to-canvas/server.py
```

### Windows

```powershell
cd C:\Users\you\work\ai-product-builder
python skills\prd-to-canvas\server.py
```

懒得每次敲？加 alias / 函数一次永久用：

### macOS / Linux alias

```bash
# 在 ~/.zshrc 或 ~/.bashrc 末尾
alias prd-canvas='cd ~/work/ai-product-builder && python3 skills/prd-to-canvas/server.py'

# 然后
source ~/.zshrc

# 之后任何 terminal 一行启:
prd-canvas
```

### Windows PowerShell function

```powershell
# 编辑 PowerShell profile（notepad $PROFILE，没文件就让它创建）
function prd-canvas {
    Set-Location C:\Users\you\work\ai-product-builder
    python skills\prd-to-canvas\server.py
}

# 重启 PowerShell 或: . $PROFILE
# 之后任何 PowerShell 终端:
prd-canvas
```

预期输出：

```
md-canvas server  v0.6.0
  serving:   <your-project-root>
  template:  <your-project-root>/skills/prd-to-canvas/templates/md-canvas.html
  url:       http://localhost:7799/
  PID:       12345
  platform:  darwin
  ...
```

（实际显示的是你当前目录的绝对路径，不是 `<your-project-root>` 字面。）

浏览器自动开 `http://localhost:7799/`，看到当前目录下所有 `.md` 文件的列表。点哪个开哪个。

在 canvas 里编辑 → `Cmd+S`：

```
浏览器右上角依次显示:
  保存中...
  推送中...
  ✓ 已推送（abc1234）
```

如果队友刚好也改了同一文件且 git 自动 merge 失败：

```
  ⚠ 冲突：队友刚也改了，去 terminal:
    git pull --rebase → 解 conflict → git push
```

---

## 命令行参数

```
python3 server.py [--port 7799] [--root /custom/path] [--no-browser]
```

- `--port` 改监听端口（默认 7799）
- `--root` 服务别的目录（默认 cwd）
- `--no-browser` 不自动开浏览器，只打印 URL

---

## 工作原理

```
                     你的电脑
  ┌──────────────────────────────────────────────────────────────┐
  │  浏览器                                                       │
  │      ↑ HTML                ↓ POST /api/save                   │
  │  ┌─────────────────────────────────────────────────────┐     │
  │  │  server.py (Flask)  127.0.0.1:7799                  │     │
  │  │  · GET /            列 .md 文件                       │     │
  │  │  · GET /xxx.md      读 .md + 套模板 → canvas HTML     │     │
  │  │  · POST /api/save   写文件 + git add+commit+push      │     │
  │  └─────────────────────────────────────────────────────┘     │
  │      ↓                                                        │
  │  PRD.md (源文件)                                              │
  │      ↓                                                        │
  │  git push → 你的远端仓库（GitHub / GitLab / 工蜂等）→ 队友 git pull  │
  └──────────────────────────────────────────────────────────────┘
```

server 只监听 `127.0.0.1`，**外网访问不了**。每个 PM 在自己电脑上跑自己的，协作走 git。

---

## file:// 模式 vs server 模式

canvas 模板**双模兼容**：

| 怎么打开 | save 行为 |
| --- | --- |
| `file:///path/to/index.html`（双击文件 / 直接打开 HTML） | 保存到 localStorage（老行为，跟之前一样）|
| `http://localhost:7799/path/to/file.md`（通过 server） | 真的写 .md + git push |

同一份 index.html 在两种模式下都能用，不需要重新生成。

---

## 排错

### 端口被占（最常见的"启动失败"）

如果 startup 报：

```
OSError: [Errno 48] Address already in use
```

或 server 启动后浏览器开 7799 进入的不是 md-canvas 而是别的 app：

**一行修**：加 `--port` 换个：

```bash
# macOS/Linux:
python3 skills/prd-to-canvas/server.py --port 7800

# Windows:
python skills\prd-to-canvas\server.py --port 7800
```

想知道是谁占的：

```bash
# macOS/Linux:
lsof -i :7799

# Windows (PSh):
Get-NetTCPConnection -LocalPort 7799 | Select-Object OwningProcess
```

### `git push` 报权限错

→ 检查你 terminal 里能不能正常 `git push`。server 复用你 terminal 现有的 git config（包括 remote URL、SSH key/token、user 身份），不另搞 auth

### canvas 里 Cmd+S 没反应

→ 看右上角 toast 报错。常见：
- 浏览器开的不是 `http://localhost:7799/...` 而是 `file://...` → 这是 localStorage 模式，没走 server
- server 没在跑 → terminal 看下进程

### 想停 server

→ terminal 里 `Ctrl-C`
