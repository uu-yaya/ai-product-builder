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

如果你 terminal 里这一行能 work：

```bash
cd <你的项目> && touch /tmp/x && git add /tmp/x && git commit --allow-empty -m test && git push
```

那 server 一定能 work。否则先按下面 checklist 配好：

| 缺啥 | 怎么补 |
| --- | --- |
| 不是 git 仓库 | `cd <项目根> && git init` |
| 没远端 | `git remote add origin git@git.code.tencent.com:你/项目.git` |
| 分支没 upstream | `git push -u origin <你的分支名>` |
| 没 SSH key 或 token | 走工蜂的 SSH key / personal access token 流程 |
| 没 git 身份 | `git config user.email you@tencent.com && git config user.name '你的名字'` |

server 启动时会自动检查上面这些，缺啥会在 terminal 顶部列出来 + 告诉你具体跑啥命令。

## 安装

第一次：

```bash
pip install -r skills/prd-to-canvas/requirements.txt
# 或单独装:  pip install flask
```

## 日常用

到你的项目根目录跑：

```bash
cd ~/work/ai-product-builder
python3 skills/prd-to-canvas/server.py
```

预期输出：

```
md-canvas server
  serving:   /Users/me/work/ai-product-builder
  template:  /Users/me/work/ai-product-builder/skills/prd-to-canvas/templates/md-canvas.html
  url:       http://localhost:7799/
  (Ctrl-C to stop)
```

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
  │  git push → 工蜂仓库 → 队友 git pull                          │
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

### 端口被占

```
OSError: [Errno 48] Address already in use
```

→ 用 `--port 7798` 之类换一个

### `git push` 报权限错

→ 检查你 terminal 里能不能正常 `git push`。工蜂走 SSH key 或 token，server 用你 terminal 的 git config，不另搞 auth

### canvas 里 Cmd+S 没反应

→ 看右上角 toast 报错。常见：
- 浏览器开的不是 `http://localhost:7799/...` 而是 `file://...` → 这是 localStorage 模式，没走 server
- server 没在跑 → terminal 看下进程

### 想停 server

→ terminal 里 `Ctrl-C`
