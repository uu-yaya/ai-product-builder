# Context7 MCP Plan

## MCP Name

Context7

## Use Case

Look up current developer documentation for libraries, frameworks, and APIs.

## Why It Matters for AI Product Builder

It reduces stale implementation advice and helps engineering plans stay aligned with current docs.

## Required Setup

Review the current Context7 setup docs in a separate task. Add only the minimum read-only configuration needed. Do not run setup commands in this planning phase.

## Suggested Config Snippet

```toml
# Planning example only. Do not copy blindly.\n[mcp_servers.context7]\ncommand = "context7-mcp"\nargs = []
```

## Security Notes

Do not add provider tokens unless required. Do not store real credentials in config files.

## Verification Command

```bash
# Future verification only; do not run during planning.\ncodex mcp list
```

## When Not To Use

Do not use when local repo docs or lockfiles already answer the question. Do not use for non-current conceptual explanations.

## AI Product Builder Optimization Extension

## Corrected Suggested Config Snippet

```toml
# Planning example only. Do not copy blindly.
[mcp_servers.context7]
command = "context7-mcp"
args = []
```

## Corrected Verification Command

```bash
# Future verification only; do not run during planning.
codex mcp list
```
