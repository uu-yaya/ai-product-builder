# PM Update: Diary Ambiguity Boundaries

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## What Changed

- Expanded `三、AI 形态与能力边界 / 5. 模糊地带与处理策略`.
- Reframed ambiguity as the boundary between fact recording, narrative interpretation, companion expression, and false relationship memory.
- Added product rules for:
  - fact vs emotional narration
  - game emotion signal vs real-world psychological judgment
  - AI inference vs user actual feeling
  - diary generation vs false memory
  - user quote usage
  - highlight vs privacy record
  - failure records
  - screenshot/VLM semantic use
  - user control vs emotional nudging
  - deletion scope
  - unclear deletion intent
  - character persona vs personalization
  - companionship vs dependency
  - diary vs gameplay assistance
  - private diary vs future sharing
  - repeated negative feedback

## Open Questions

- Whether P0 should expose a user-facing explanation for `source_ids[]`, or keep evidence explanation only in backend/QA tooling.
- Whether future share-card scope should be split into a separate PRD.

## Questions for Engineering + Design

- Design: deletion confirmation should make clear that P0 deletes the diary display/retrieval/use-as-evidence, not underlying game events or profile memory.
- Design: negative feedback and “以后别这样写” should be visible enough without interrupting the diary reading experience.
- Engineering: diary generation should enforce source-linked facts and prevent diary results from becoming evidence for future diary generation without independent source support.

## Whether SYNC_SUMMARY Needs Update

- Yes, Main can optionally update `SYNC_SUMMARY.md` to note that the Diary PRD now has an expanded ambiguity and boundary policy section.
