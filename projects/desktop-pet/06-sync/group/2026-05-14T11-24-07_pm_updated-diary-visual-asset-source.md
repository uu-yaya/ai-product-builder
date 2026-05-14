# PM Update: Diary Visual Asset Source

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## What Changed

- Closed the remaining visual-asset open question.
- Set the formal product rule: photo-card, sticker, stamp, and character decorative assets are supplied by each partner game.
- Added demo rule: for demo/prototype use, the project may use self-synthesized temporary assets, including GPT Image 2.0 generated assets.
- Added `asset_source` distinction for visual elements:
  - `partner_game` for formal partner-provided assets
  - `demo_generated` for demo-only generated assets
- Replaced `待确认问题` with `已定口径`.

## Open Questions

- None.

## Questions for Engineering + Design

- Design: mark demo-generated visual assets clearly in design handoff so they are not mistaken for final partner assets.
- Engineering: keep `asset_source` available for asset governance and later replacement.

## Whether SYNC_SUMMARY Needs Update

- No required scope change. Main may optionally note that Diary PRD now has no remaining PM open questions.
