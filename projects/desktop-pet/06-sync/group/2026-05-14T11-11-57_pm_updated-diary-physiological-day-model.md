# PM Update: Diary Physiological Day Model

## Files

- `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## What Changed

- Replaced the unresolved natural-day generation question with a P0 physiological day model.
- Added `生理日切分与生成时机` under the user flow chapter.
- Defined P0 timing parameters:
  - `MIN_SESSION_TIME = 30 mins`
  - `LONG_ABSENCE_LIMIT = 4 hours`
  - `DATE_RESET_DEADLINE = 05:00 AM`
  - `WRITE_DELAY_BUFFER = 180s`
- Updated user flow, feature list, generation interface, data fields, prompt constraints, exception handling, evaluation, latency, and metrics to use physiological day windows.
- Removed the generation-hour/data-window item from `待确认问题`.

## Open Questions

- Whether photo-card and detail-page sticker/stamp assets are provided by each partner game or by the base desktop-pet asset library.

## Questions for Engineering + Design

- Engineering: confirm the reliable source of offline/sleep/idle signals for `LONG_ABSENCE_LIMIT`.
- Engineering: confirm whether shutdown-triggered generation can complete after app exit, or whether next-boot fallback should be the only guaranteed path.
- Design: diary date display should show the physiological day label, not mechanically split deep-night sessions by calendar midnight.

## Whether SYNC_SUMMARY Needs Update

- Yes. Main should note that Diary P0 generation now uses a physiological day model instead of a fixed natural-day schedule.
