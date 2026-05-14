# PM Completed: Diary Flow and I/O Update

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## Changes

- Added swimlane-style Mermaid system flows below each user flow: main view/reply flow, delete flow, and generation failure flow.
- Clarified generation failure behavior, including empty states and desktop-pet reactions.
- Reworked each feature input/output section into field-level tables with English field name, Chinese field name, direction, and explanation.
- Updated confirmed product decisions:
  - daily generation window uses the user's timezone;
  - unread mailbox badge displays unread count;
  - diary replies enter long-term memory;
  - diary detail page does not support user-triggered rewrite.

## Open Questions

- Exact daily generation hour and data settlement window length.
- Whether card stickers/stamps come from each partner game or from the base desktop-pet asset library.

## Questions for Engineering + Design

- Engineering: confirm whether `unread_count`, `empty_state_type`, and `long_term_memory_write_status` fit the current memory/service contract.
- Design: use the three updated system flows and empty-state table as basis for mailbox/list/detail prototype.

## Whether SYNC_SUMMARY needs update

- Yes. Main Thread should summarize this as the latest Diary branch PRD update.
