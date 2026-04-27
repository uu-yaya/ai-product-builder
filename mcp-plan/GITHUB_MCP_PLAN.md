# GitHub MCP Plan

## MCP Name

GitHub MCP

## Use Case

Support issue, pull request, repository, and code collaboration workflows when project work moves into GitHub-backed execution.

## Why It Matters for AI Product Builder

AI Product Builder needs clean handoff between product decisions, engineering tasks, reviews, and release tracking. GitHub MCP can support that bridge when enabled safely.

## Required Setup

- Create a least-privilege `GITHUB_TOKEN` only in a future explicit setup task.
- Expose the token through an environment variable.
- Never paste the token into planning docs or repository files.

## Suggested Config Snippet

```toml
# Planning example only. Use environment variables for secrets.
[mcp_servers.github]
command = "github-mcp"
args = []
env = { GITHUB_TOKEN = "${GITHUB_TOKEN}" }
```

## Security Notes

- Use least-privilege scopes.
- Rotate tokens if exposed.
- Do not grant write permissions until read-only workflows are validated.
- Do not store real tokens in `config.toml` or repository files.

## Verification Command

```bash
# Future verification only; do not run during planning.
codex mcp list
```

## When Not To Use

- When local git context is enough.
- When token scope cannot be limited.
- When repository access or organization policy is unclear.
