# PM Completed: Memory System Clarification

Date: 2026-05-08
Thread: PM Strategy Thread
Task ID: `T-010` in `TASK_BOARD.md` / user prompt label `T-00Y`
Status: Completed

## Files

Created:

- `01-pm/REQUIREMENT_CLARIFICATION_memory-system.md`
- `01-pm/PRIVACY_BOUNDARY_memory-system.md`

Read-only inputs used:

- `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md`
- `06-sync/group/2026-05-08T19-25-29_main_closeout-desktop-context-memory-frameworks.md`
- `06-sync/SYNC_SUMMARY.md`
- `06-sync/TASK_BOARD.md`
- `00-context/PROJECT_CONTEXT.md`
- `decisions/DECISION_LOG.md`

Not modified:

- `04-research/`
- `02-design/`
- `03-engineering/`
- `06-sync/TASK_BOARD.md`
- `06-sync/SYNC_SUMMARY.md`
- `06-sync/THREAD_REGISTRY.md`
- `decisions/DECISION_LOG.md`

## Summary

PM converted Radar's desktop context memory research and Main Thread's P0 `Context Lite Memory` conclusion into two product artifacts:

- Requirement clarification for what the memory system is, who it serves, what it collects / does not collect, retention strategy, Memory Center requirements, AI scope control, risks, and open questions.
- Privacy boundary defining hard constraints, data collection whitelist, local-vs-cloud boundary, deletion / disable / correction paths, and company business constraints.

Core PM stance:

- P0 memory should make the pet understand the player, game state, and interruption timing.
- P0 should not become a general computer surveillance or Recall-like timeline system.
- First-party game events and user-provided information are the main memory sources.
- Low-sensitive OS context is auxiliary and should remain local-first.
- Memory Center is a trust requirement, while concrete UI design remains owned by Design Prototype Thread.

## Open Questions

- Should low-sensitive OS context be default-on in P0, or default-off with user opt-in?
- What is the minimum first-party `game_event_schema` for MVP?
- Should per-game memory be isolated by default, or can user preferences cross games?
- What default retention should apply to game signal memory: 30 days, 90 days, or game-configured?
- Can cloud LLM process redacted memory summaries, and does that need a separate user-facing toggle?
- Should Main Thread backfill `DECISION_LOG.md` with the P0 collection strategy? The prompt said the decision log contained it, but the file currently does not.

## Questions for Engineering + Design

Engineering:

- Define the minimum event schema for first-party game events, including `sensitivity`, `retention`, `user_visible`, and `memory_writable`.
- Confirm local storage, deletion semantics, and whether tombstones are needed without preserving sensitive content.
- Confirm whether P0 OS context can be implemented with active app / foreground window only, without AX / UIA full text.
- Confirm whether cloud model calls can be restricted to redacted summaries and user-visible memories.

Design:

- Treat Memory Center as a trust surface: view, delete, disable, correct, pause, and explain memory sources.
- Decide how to communicate "采什么 / 不采什么 / 存多久 / 如何删除" without designing a full privacy policy wall.
- Define how users see whether OS context, game memory, and cloud sync are enabled.
- Keep UI design in `02-design/`; PM files only define requirements.

## Whether SYNC_SUMMARY Needs Update

Yes.

Recommended Main Thread updates:

- Mark `T-010` as Done in `06-sync/TASK_BOARD.md`.
- Add the two PM files to `06-sync/SYNC_SUMMARY.md` Latest Decisions / Links / Next Actions.
- Update Open Questions around memory P0 scope, Memory Center, cloud boundary, and per-game memory isolation.
- Consider adding or reconciling the P0 collection strategy decision in `decisions/DECISION_LOG.md`, because the user prompt referenced it but the current file does not contain that row.

## Suggested Next Thread

Design Prototype Thread for Memory Center information architecture, then Engineering Build Thread for the `Context Capture Adapter` and memory data model.
