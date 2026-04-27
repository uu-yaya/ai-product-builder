# Recommended Codex Config Plan

## Configuration Goal

This file describes a conservative candidate configuration for `~/.codex/config.toml`. It is a planning artifact only and must not be copied blindly into user-level configuration.

## Why Global Config Matters

A global Codex runtime config keeps model behavior, approval policy, sandbox defaults, memory behavior, profiles, and MCP settings separate from project-specific rules. This avoids bloating project `AGENTS.md` files and makes behavior easier to maintain across repositories.

## Recommended Config Snippet

```toml
# Candidate example only. Keep the current available model if this model is not supported.
model = "gpt-5.5"
model_reasoning_effort = "high"
personality = "pragmatic"

approval_policy = "on-request"
sandbox_mode = "workspace-write"

web_search = "live"

[features]
memories = true
multi_agent = true
personality = true
shell_snapshot = true
codex_hooks = false

[memories]
generate_memories = true
use_memories = true

[agents]
max_threads = 4
max_depth = 1

profile = "daily"

[profiles.daily]
model = "gpt-5.5"
model_reasoning_effort = "medium"
personality = "pragmatic"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[profiles.strategic]
model = "gpt-5.5"
model_reasoning_effort = "high"
personality = "pragmatic"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[profiles.quick]
model = "gpt-5.5"
model_reasoning_effort = "medium"
personality = "friendly"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

## Configuration Notes

- `model`: candidate model only. If the current Codex environment does not support `gpt-5.5`, keep the current available model.
- `model_reasoning_effort`: use `medium` for daily work and `high` for strategic planning or complex architecture tasks.
- `personality`: keep a pragmatic default to avoid over-stylized outputs.
- `approval_policy`: `on-request` keeps risky actions gated.
- `sandbox_mode`: `workspace-write` allows project edits without broad filesystem access.
- `web_search`: live search is useful when the task depends on current information.
- `codex_hooks`: keep disabled at first because hooks can introduce hidden automation risk.
- `agents.max_threads`: start with 4, not 8, to reduce coordination overhead.
- `agents.max_depth`: start with 1 until multi-agent workflows are stable.
- `profiles`: use daily, strategic, and quick modes for different work intensities.

## Risk Notes

- Do not blindly use unknown model names.
- Do not write real tokens into config files.
- Use environment variable placeholders for credentials.
- Do not enable all MCP servers at once.
- Do not enable hooks until the workspace has stable review and rollback practices.

## Future Execution Method

When ready, compare this recommendation with the current Codex documentation and local environment support. Then update `~/.codex/config.toml` manually in a separate, explicit task after reviewing risks.
