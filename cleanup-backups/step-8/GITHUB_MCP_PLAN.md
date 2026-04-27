# GitHub MCP Plan

## MCP Name

GitHub

## Use Case

Inspect issues, pull requests, repository metadata, reviews, and collaboration context.

## Why It Matters for AI Product Builder

It supports product-engineering workflows that involve issues, PR reviews, CI status, and release coordination.

## Required Setup

Create a least-privilege  in the future and expose it as an environment variable. Do not paste the token into any file.

## Suggested Config Snippet

```toml
# Planning example only. Use environment variables for secrets.\n[mcp_servers.github]\ncommand = "github-mcp"\nargs = []\nenv = { GITHUB_TOKEN = "" }
```

## Security Notes

Use least privilege. Avoid broad organization tokens. Never print token values. Prefer read-only scopes unless write actions are explicitly needed.

## Verification Command

```bash
# Future verification only; do not run during planning.\ncodex mcp list
```

## When Not To Use

Do not use for local code questions that can be answered from the checked-out repository. Do not use write actions without explicit approval.

## AI Product Builder Optimization Extension

## Corrected Required Setup

Create a least-privilege `GITHUB_TOKEN` in the future and expose it as an environment variable. Do not paste the token into any file.

## Corrected Suggested Config Snippet

```toml
# Planning example only. Use environment variables for secrets.
[mcp_servers.github]
command = "github-mcp"
args = []
env = { GITHUB_TOKEN = "${GITHUB_TOKEN}" }
```

## Corrected Verification Command

```bash
# Future verification only; do not run during planning.
codex mcp list
```
