# PM Updated: Diary ER Diagram

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## Changes

- Added a Mermaid ER diagram for diary module data relationships.
- Clarified core diary-owned data vs referenced external data from memory and character config systems.
- Added relationship notes for user/game context isolation, mailbox summary, character config binding, evidence traceability, replies, feedback, and pet reactions.
- Added field tables for `pet_reaction` and `diary_source_link` so the ER diagram matches the data structure section.

## Open Questions

- Whether Engineering wants `diary_source_link` as a physical join table or as normalized fields derived from `diary_entry.source_ids[]`.

## Questions for Engineering + Design

- Engineering: confirm cardinality and storage ownership for `mailbox_summary`, `diary_source_link`, and `pet_reaction`.
- Design: use `mailbox_summary.unread_count` and `empty_state_type` for mailbox red dot and empty state design.

## Whether SYNC_SUMMARY needs update

- Optional. Main Thread can mention that Diary branch now contains an ER diagram and explicit data relationships.
