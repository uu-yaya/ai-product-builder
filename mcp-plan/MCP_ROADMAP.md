# MCP Roadmap

## Role of MCP

MCP connects Codex to external tools and data sources such as documentation, GitHub, Figma, and browser automation. It should be used when local context is insufficient or fresh external context is required.

## Why Not Enable Everything at Once

- Each MCP adds setup, permission, token, and security surface area.
- Too many tools can make agent behavior harder to predict.
- Gradual rollout makes it easier to verify value and isolate failures.

## Recommended Priority

### Phase 1: Developer Docs

- Context7 MCP
- Goal: help Codex check current developer documentation.

### Phase 2: GitHub

- GitHub MCP
- Goal: issue, PR, and code collaboration.

### Phase 3: Design

- Figma MCP
- Goal: read design files and align UI implementation with prototypes.

### Phase 4: Browser

- Playwright MCP
- Goal: competitor webpage research and frontend page checks.

## MCP Uses

| MCP | Use |
| --- | --- |
| Context7 | Current library and framework documentation |
| GitHub | Issues, PRs, repository metadata, review workflows |
| Figma | Design file inspection and UI implementation alignment |
| Playwright | Browser inspection, screenshots, frontend QA, competitor page checks |

## Required Tokens and Environment Variables

| MCP | Environment Variable |
| --- | --- |
| Context7 | Usually none or provider-specific key if required |
| GitHub | `GITHUB_TOKEN` |
| Figma | `FIGMA_ACCESS_TOKEN` |
| Playwright | Usually none for local browser automation |

## Risks

- Token leakage if secrets are pasted into config files.
- Excessive permissions if tokens are too broad.
- Tool overuse when local files are enough.
- Browser automation may interact with live websites unexpectedly.

## Verification Method

- Verify one MCP at a time.
- Use a read-only query first.
- Confirm no token values are printed.
- Confirm the tool produces useful output for a real workflow before adding the next MCP.
