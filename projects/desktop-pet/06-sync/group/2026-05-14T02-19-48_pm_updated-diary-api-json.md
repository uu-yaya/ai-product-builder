# PM Updated: Diary API JSON Format

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## Changes

- Reworked the API requirements section.
- Each API now keeps a compact table for:
  - interface purpose;
  - call method;
  - data structure requirement.
- Input and output data are now represented as JSON examples for all 9 interfaces.

## Open Questions

- Whether Engineering wants these JSON examples converted into formal OpenAPI / JSON Schema later.

## Questions for Engineering + Design

- Engineering: validate field naming, nullability, and whether nested response objects match service ownership.
- Design: confirm fields needed for card, detail, reaction, empty state, and unread badge rendering.

## Whether SYNC_SUMMARY needs update

- Optional. Main Thread can mention that Diary branch API section now uses JSON input/output examples.
