# APB Tool Compatibility

## 1. Purpose

APB 同时支持 **Claude Code** 与 **Codex CLI**，并可在 Mac 与 Windows 之间无缝切换。本文档定义两个工具如何读取 APB 仓库、各自需要的额外配置、以及跨平台同步策略。

根 `AGENTS.md` 与所有方法论文件（`README.md` / `ROADMAP.md` / `memory/` / `workspaces/` / `docs/` / `prompts/` / `projects/` / `skills-plan/` / `mcp-plan/`）**完全工具无关**——纯 markdown + 文件命名约定，两个工具都直接消费。本文档只覆盖工具特定的差异部分。

## 2. Tool Compatibility Matrix

| 维度 | Claude Code | Codex CLI |
|---|---|---|
| 全局配置目录 | `~/.claude/` | `~/.codex/` |
| 全局配置主文件 | `~/.claude/CLAUDE.md`（如有） | `~/.codex/config.toml` |
| 全局规则文件 | `~/.claude/CLAUDE.md` | `~/.codex/AGENTS.md` |
| 项目级规则文件 | `AGENTS.md`（启动时自动叠加） | `AGENTS.md`（启动时自动叠加） |
| 项目级权限配置 | `.claude/settings.json` 中 `permissions.allow` | 无独立项目级权限文件；权限在 config.toml 的 profile 与 approval flow 中处理 |
| Skill 概念 | `~/.agents/skills/` 与 `~/.claude/skills/` 下的 `SKILL.md`（frontmatter `name` / `description` / `path`） | `~/.codex/skills/<name>/` 下的 `SKILL.md` + `agents/openai.yaml`；机制类似但元数据格式不同 |
| Subagents / 子线程 | Task 工具 spawn subagent；可配 `isolation: "worktree"` | subagent / slash command / 多 agent 编排 |
| 自动化任务 | hooks / settings | `~/.codex/automations/<name>/automation.toml` |
| Plugins | 通过 Cowork / marketplace install | `~/.codex/plugins/` + `codex plugin add` |
| MCP | `claude mcp add` / settings | `codex mcp add` / config.toml |
| Worktree 隔离 | 默认开启（subagent 跑在 `.claude/worktrees/<random>/`） | 默认开启（见 `~/.codex/worktrees/`） |
| Sandbox / 写入权限 | settings.json 显式允许 | `sandbox_mode` 4 档：`read-only` / `workspace-write` / `danger-full-access` / `<custom>` |

## 3. Cross-Platform Path Reference

| 资源 | Mac | Windows |
|---|---|---|
| Codex 全局配置 | `~/.codex/config.toml` | `%USERPROFILE%\.codex\config.toml` |
| Codex 全局规则 | `~/.codex/AGENTS.md` | `%USERPROFILE%\.codex\AGENTS.md` |
| Codex Skills | `~/.codex/skills/` | `%USERPROFILE%\.codex\skills\` |
| Codex automations | `~/.codex/automations/` | `%USERPROFILE%\.codex\automations\` |
| Codex worktrees | `~/.codex/worktrees/` | `%USERPROFILE%\.codex\worktrees\` |
| Claude Code 全局 | `~/.claude/` | `%USERPROFILE%\.claude\` |
| Claude Code Skills | `~/.agents/skills/` | `%USERPROFILE%\.agents\skills\` |
| APB 项目本身 | `/Users/yayauu/ai-product-builder/` | `C:\Users\<user>\ai-product-builder\`（建议同名） |

APB 仓库本身完全跨平台——只要 `git clone` 到 Windows，所有 markdown 直接生效，无需任何 OS 适配。

## 4. How Each Tool Reads APB Files

| APB 文件 / 目录 | Claude Code 行为 | Codex 行为 |
|---|---|---|
| 根 `AGENTS.md` | 启动时自动读取并叠加到上下文 | 启动时自动读取，与 `~/.codex/AGENTS.md` 合并 |
| `README.md` / `ROADMAP.md` | 仅当 prompt 引用时读取 | 同左 |
| `memory/*.md` | 仅当 prompt 引用时读取 | 同左 |
| `workspaces/*/AGENTS.md` | 工作区内启动时叠加 | 同左 |
| `docs/APB_MODE.md` / `docs/APB_MULTI_THREAD_PROTOCOL.md` | prompt 引用时读取 | 同左 |
| `prompts/thread-start/*.md` | 用户复制粘贴启动新线程 | 同左（启动 Codex subagent / slash command 时复用） |
| `skills-plan/*` | 决策文档；具体 Skill 名（`writing-prds` 等）匹配 Claude Code 的 SKILL.md | 决策文档；Codex 不识别 Lenny / `~/.agents/skills/` 下的 Skill 名（详见 `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md` 顶部 Codex Note） |
| `mcp-plan/*` | 决策文档；实际配置走 `claude mcp add` | 决策文档；实际配置走 `codex mcp add` |
| `projects/*` | 项目产物；线程读 `00-context/` / `06-sync/SYNC_SUMMARY.md` 等 | 同左 |
| `.claude/settings.json` | **仅 Claude Code 读取**（项目级权限白名单） | Codex 完全忽略，不会冲突 |

## 5. Codex-Specific Setup Quick Reference

### 当前 Mac 已知状态（Step 10L 落地时观测到）

通过用户执行 `grep -E "(sandbox|approval|model)" ~/.codex/config.toml` 确认：

- `model = "gpt-5.5"`：✅ 与 `global-config-plan/CONFIG_TOML_RECOMMENDATION.md` 推荐一致
- `model_reasoning_effort = "xhigh"`：⚠️ 极高推理强度（成本 / 延迟权衡需用户评估）
- `approval_mode = "approve"`：出现 2 次，说明含多 profile，每个都设了
- `notify-approval.sh` 钩子：已接通知脚本
- `sandbox_mode`：❌ **未在顶层显式设置**（推荐设为 `workspace-write`）

其他字段（profile 块、agents 块、MCP 列表）尚未审计；建议下次跑 `grep -nE "(sandbox|approval|model|profile|\[)" ~/.codex/config.toml` 完整审计。

### Codex 推荐补丁（Mac，写入 `~/.codex/config.toml`）

```toml
# 在第一个 [profile.xxx] 之前的全局段加：
sandbox_mode = "workspace-write"
```

完整模板参考 `global-config-plan/CONFIG_TOML_RECOMMENDATION.md`。

> ⚠️ APB 不会自动写入 `~/.codex/`；按 `AGENTS.md` Safety Rules，用户全局配置必须由用户亲自应用。

### 项目级 vs 用户级 AGENTS.md 优先级

Codex 启动时叠加顺序：

```
~/.codex/AGENTS.md       （全局规则，应用于所有项目）
+ <cwd>/AGENTS.md        （项目级规则，APB 根 AGENTS.md）
+ <cwd>/<sub>/AGENTS.md  （工作区级规则，按需）
```

后者覆盖前者。APB 项目级规则优先于全局 Codex 规则——这是预期行为。

## 6. Claude Code-Specific Setup Quick Reference

### 项目级权限文件位置

| 类型 | 路径 |
|---|---|
| 主仓库共享设置 | `/Users/yayauu/ai-product-builder/.claude/settings.json` |
| 个人本地覆盖 | `/Users/yayauu/ai-product-builder/.claude/settings.local.json`（如存在） |
| Worktree 内独立设置 | `/Users/yayauu/ai-product-builder/.claude/worktrees/<name>/.claude/settings.local.json` |

### Worktree 隔离的注意事项

Claude Code 在 `Task` / subagent 调用时默认开启 worktree 隔离——子 agent 在 `.claude/worktrees/<random>/` 跑，写入的文件不在主仓库可见。Step 10K 的 `ai-weekly-radar-2026` 项目首跑就遇到这个问题。

修复方式：

- **回流**：`git -C /Users/yayauu/ai-product-builder merge --ff-only claude/<worktree-branch>` 把 worktree 分支 merge 回主分支；或 `cp -r .claude/worktrees/<name>/projects/<slug> projects/`。
- **避免**：以后启动子 agent 时不传 `isolation: "worktree"` 参数；或使用 Cowork（默认在主 worktree 跑）。

### Worktree 内 settings.local.json 不继承主设置

Worktree 内的 `.claude/settings.local.json` 是独立的——不会自动继承主仓库 `.claude/settings.json` 的 `permissions.allow`。Step 10K 已经在 `cleanup-backups/step-10k-blocker-reporting/worktree_settings.local.json.bak` 留了一份合并好 WebSearch + WebFetch 白名单的版本，需要时直接 `cp` 到 worktree 即可。

## 7. Cross-Platform Sync Strategies

### 方案 X（推荐）：dotfiles git repo

把 `~/.codex/` 的关键文件做成独立 dotfiles repo：

```bash
cd ~/.codex
git init
cat > .gitignore <<'EOF'
sessions/
.tmp/
vendor_imports/
worktrees/
plugins/cache/
*.snapshot.config.toml
*.back.config.toml
EOF
git add config.toml AGENTS.md automations/ skills/
git commit -m "feat: initial codex dotfiles snapshot"
git remote add origin https://github.com/<your-private-repo>/codex-dotfiles.git
git push -u origin main
```

Windows 上：`git clone` 到 `%USERPROFILE%\.codex\`（先备份已有内容到 `~/.codex.bak.<date>`）。两边以后只需 `git pull` 同步。

**优点**：版本可追溯，回滚简单，Mac/Windows 一致。
**缺点**：需要管理一个新 repo。

### 方案 Y：云盘自动同步

把 `~/.codex/config.toml` + `~/.codex/AGENTS.md` 软链接到 iCloud / OneDrive / Syncthing 目录。
**风险**：`sessions/` 与 `worktrees/` 可能与本地冲突，必须排除。

### 方案 Z：手动同步

变更后 `scp` / 邮件 / 钉钉发送 `config.toml` + `AGENTS.md`。
**适合**：不常切换机器；**风险**：易忘。

## 8. Coexistence Strategy: Claude Code + Codex 同时使用

| 场景 | 推荐工具 |
|---|---|
| 设计 / Figma 集成（已有 Codex Figma 插件链路） | Codex |
| 强工作区隔离的实验 | Claude Code（worktree 隔离反而是优点） |
| 长会话深度推理 + 多 agent 编排 | Codex（gpt-5.5 + xhigh） |
| 与 Cowork 配合的多线程 | Cowork（基于 Claude）+ 直接在主仓库工作 |
| 跨平台移动场景 | 两者都装；APB 仓库共享 |
| Windows 端日常 | Codex（Claude Code 在 Windows 上历史支持也 OK，但 Codex 更原生） |

**关键认知**：APB 仓库是**单一真相源**——无论用哪个工具，所有产物都落到同一个 git repo。Tool 切换不影响知识连续性。

## 9. Verification Checklist (Mac 已检查)

| 项 | 状态 |
|---|---|
| `~/.codex/config.toml` 存在 | ✅ |
| `~/.codex/AGENTS.md` 存在 | ✅ |
| Codex automations 已配置（`daily-bug-scan` / `daily-ai-knowledgebase-sync`） | ✅ |
| Codex 自定义 skills 已加载（`figma` / `doc` / `jupyter-notebook` / `notion-knowledge-capture` / `notion-meeting-intelligence` 等） | ✅ |
| Codex plugins 已加载（`vercel` / `build-web-apps` 等） | ✅ |
| Claude Code 主仓库 `.claude/settings.json` 含 27 条 WebSearch + WebFetch 白名单 | ✅（Step 10K 时确认） |
| `sandbox_mode = "workspace-write"` 显式设置 | ❌ **待用户确认**（顶层未见此字段） |
| Windows `~/.codex/` 同步 | ⏳ **TBD by user** |
| APB 项目级 `AGENTS.md` 在 Codex 启动时被识别 | ⏳ 待 Codex 在 APB cwd 真实跑过验证 |

## 10. TBD / Open Questions

- 你 Mac `~/.codex/config.toml` 的所有 `[profile.*]` 段当前 `sandbox_mode` / `approval_policy` 状态（建议跑 `grep -nE "(sandbox|approval|model|profile|\[)" ~/.codex/config.toml` 完整审计后回填本节）。
- 你 Windows 上是否已有 `~/.codex/`，如有当前内容是什么。
- Codex 在 APB 仓库内启动时，是否会读取 `.claude/settings.json`（应不会，但首次跑需要观察）。
- Codex Skills（`~/.codex/skills/<name>/SKILL.md`）的 frontmatter 字段是否与 `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md` 假设的 Claude Code Skill 字段（`name` / `description` / `path`）兼容；如不兼容，需要为 Codex 单独写一份 `EXISTING_CODEX_SKILLS_REUSE_STRATEGY.md`。

## 11. References

- `global-config-plan/CONFIG_TOML_RECOMMENDATION.md`：Codex `~/.codex/config.toml` 完整推荐配置
- `global-config-plan/GLOBAL_AGENTS_RECOMMENDATION.md`：Codex `~/.codex/AGENTS.md` 候选规则
- `skills-plan/EXISTING_SKILLS_REUSE_STRATEGY.md`：Claude Code Skill 重用策略（顶部含 Codex Note）
- `mcp-plan/MCP_ROADMAP.md`：MCP 接入路线图（Context7 / GitHub / Figma / Playwright，跨工具适用）

## 12. Last Updated

2026-04-28（Step 10L Tool-Agnostic Refactor 落地）
