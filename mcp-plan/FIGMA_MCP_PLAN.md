# Figma MCP Plan

## MCP Name

Figma MCP

## Use Case

Read design context and support UI implementation alignment when design files need to inform engineering work.

## Why It Matters for AI Product Builder

Design Prototype and Engineering Build need a reliable bridge from design intent to implementation details. Figma MCP can help once design access and permissions are clear.

## Required Setup

- Create a least-privilege `FIGMA_ACCESS_TOKEN` only in a future explicit setup task.
- Expose the token through an environment variable.
- Confirm file permissions and team policy before connecting.

## Suggested Config Snippet

```toml
# Planning example only. Use environment variables for secrets.
[mcp_servers.figma]
command = "figma-mcp"
args = []
env = { FIGMA_ACCESS_TOKEN = "${FIGMA_ACCESS_TOKEN}" }
```

## Security Notes

- Use least-privilege access.
- Do not store real Figma tokens in repository files.
- Do not fetch private design files without explicit user intent.
- Respect design ownership and confidentiality.

## Verification Command

```bash
# Future verification only; do not run during planning.
codex mcp list
```

## When Not To Use

- When a design brief or screenshot is sufficient.
- When the file contains sensitive unreleased product information without approval.
- When Figma access scope cannot be constrained.
