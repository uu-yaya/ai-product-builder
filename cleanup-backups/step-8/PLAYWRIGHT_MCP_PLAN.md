# Playwright MCP Plan

## MCP Name

Playwright

## Use Case

Inspect webpages, capture screenshots, test frontend behavior, and support browser-based competitor research.

## Why It Matters for AI Product Builder

It helps validate implemented UI and observe real web experiences instead of relying only on static descriptions.

## Required Setup

Install and configure only in a separate task. Prefer local or staging URLs for QA. Use public pages only for competitor research.

## Suggested Config Snippet

```toml
# Planning example only.\n[mcp_servers.playwright]\ncommand = "playwright-mcp"\nargs = []
```

## Security Notes

Avoid entering credentials into automated browser sessions unless explicitly approved. Be careful with live forms, purchases, and production actions.

## Verification Command

```bash
# Future verification only; do not run during planning.\ncodex mcp list
```

## When Not To Use

Do not use when static file inspection is sufficient. Do not automate sensitive logged-in workflows without explicit approval.

## AI Product Builder Optimization Extension

## Corrected Suggested Config Snippet

```toml
# Planning example only.
[mcp_servers.playwright]
command = "playwright-mcp"
args = []
```

## Corrected Verification Command

```bash
# Future verification only; do not run during planning.
codex mcp list
```
