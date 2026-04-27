# Figma MCP Plan

## MCP Name

Figma

## Use Case

Read design files, inspect components, and align UI implementation or prototype prompts with actual designs.

## Why It Matters for AI Product Builder

It connects design-prototype work with real design artifacts and reduces drift between design and engineering.

## Required Setup

Create a Figma access token in the future and expose it as . Use only files the user explicitly provides or authorizes.

## Suggested Config Snippet

```toml
# Planning example only. Use environment variables for secrets.\n[mcp_servers.figma]\ncommand = "figma-mcp"\nargs = []\nenv = { FIGMA_ACCESS_TOKEN = "" }
```

## Security Notes

Do not expose private design files. Do not store tokens in repo files. Confirm file access scope before reading client or proprietary designs.

## Verification Command

```bash
# Future verification only; do not run during planning.\ncodex mcp list
```

## When Not To Use

Do not use when a textual design brief is enough. Do not use to copy third-party designs.

## AI Product Builder Optimization Extension

## Corrected Required Setup

Create a Figma access token in the future and expose it as `FIGMA_ACCESS_TOKEN`. Use only files the user explicitly provides or authorizes.

## Corrected Suggested Config Snippet

```toml
# Planning example only. Use environment variables for secrets.
[mcp_servers.figma]
command = "figma-mcp"
args = []
env = { FIGMA_ACCESS_TOKEN = "${FIGMA_ACCESS_TOKEN}" }
```

## Corrected Verification Command

```bash
# Future verification only; do not run during planning.
codex mcp list
```
