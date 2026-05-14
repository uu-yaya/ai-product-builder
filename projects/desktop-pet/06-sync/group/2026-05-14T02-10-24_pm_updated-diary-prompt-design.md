# PM Updated: Diary Prompt Design

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## Changes

- Added a new "Prompt 设计" section under AI behavior contract.
- Defined a general desktop-pet reaction prompt contract that does not hard-code any single character.
- Added `character_config` template for injecting game-specific character background, tone, motifs, and forbidden styles.
- Added scene prompt examples for new diary prompt, diary opening, positive reply, correction/negative reply, deletion success, and no-new-diary empty state.
- Added a Daji-style character config only as an example of how a partner-game character can be configured.

## Open Questions

- Whether each partner game provides approved character config and example lines, or PM/Content prepares the first draft for partner review.

## Questions for Engineering + Design

- Engineering: confirm the JSON output contract can be enforced through structured output or application-side validation.
- Design: align visible reaction text length with speech bubble layout.

## Whether SYNC_SUMMARY needs update

- Optional. Main Thread can mention that Diary branch now includes prompt contract for pet reactions.
