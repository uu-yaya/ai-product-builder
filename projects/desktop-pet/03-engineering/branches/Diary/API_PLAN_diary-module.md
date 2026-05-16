# API Plan: Diary Module

## API Boundary

The frontend calls `DiaryService`; it never mutates diary DOM or local arrays directly for product actions.

| Method | Endpoint Skeleton | Purpose |
|---|---|---|
| `getMailbox` | `GET /api/diary/mailbox?page=1&page_size=10` | List active diaries, reverse chronological |
| `getDiaryDetail` | `GET /api/diary/:diary_id` | Return display-safe detail |
| `updateDiaryState` | `PATCH /api/diary/:diary_id/state` | Read/bubble/favorite idempotent update |
| `submitDiaryReply` | `POST /api/diary/:diary_id/reply` | Save reply, mock memory write, return pet reaction |
| `submitDiaryFeedback` | `POST /api/diary/:diary_id/feedback` | Save latest like/dislike/correction feedback |
| `softDeleteDiary` | `DELETE /api/diary/:diary_id` | Soft delete only |
| `generatePetReaction` | `POST /api/diary/reactions` | Generate short pet reaction |
| `generateDiary` | `POST /api/diary/generate` | Run bounded generation workflow |
| `checkDiaryQuality` | `POST /api/diary/quality-check` | Check facts, persona, privacy, repetition, format |

## Error Policy

UI-facing errors must be sanitized:

- Use `first_empty`, `no_new_today`, `generation_failed`, or `quality_blocked`.
- Do not expose model, provider, API, policy, privacy-hit, or internal error code.
- Preserve user input on reply failure.

## Compatibility Notes

- `page_size` is capped at `10`.
- `available_actions` excludes `rewrite` at type level.
- Soft-deleted diaries are excluded from list/detail and from future evidence reuse.
- `game_context_id` is part of API inputs or derivable from the diary ID in backend storage.
