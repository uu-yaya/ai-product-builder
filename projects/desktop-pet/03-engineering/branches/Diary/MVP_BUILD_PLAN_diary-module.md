# MVP Build Plan: Diary Module

## Requirement Summary

Diary 是桌宠按生理日写给用户的一封第一人称小日记。它基于已授权摘要和 source IDs 生成内容，经过质量检查后展示。用户可在收信箱查看、回信、喜欢、不喜欢、收藏、软删除；这些动作都必须通过 service/API 边界回写。

## MVP Scope

| Area | MVP Delivery |
|---|---|
| Frontend | Desktop Entry, Mailbox, Diary Detail, Reply Composer, Action Toolbar, Delete Confirm, Empty States |
| API boundary | `DiaryService` typed interface plus mock and HTTP adapters |
| Backend skeleton | Route handlers for mailbox/detail/state/reply/feedback/soft delete/reaction/generation/quality check |
| AI workflow | Bounded workflow: evidence summary -> draft -> quality check -> persist/show |
| LLM adapter | `generateDiaryDraft`, `checkDiaryQuality`, `generatePetReaction` |
| Tests | Pagination, read state, reply, feedback, favorite, soft delete, no rewrite, privacy, fallback |

## Non-goals

- No production database.
- No real user/player data.
- No real LLM credential.
- No raw evidence display.
- No UI rewrite action.
- No open-ended autonomous Agent.

## User Flow

1. User sees pet on desktop with mailbox red dot or quiet state.
2. User opens mailbox.
3. Mailbox loads reverse chronological diary cards, 10 per page.
4. User opens diary detail.
5. UI marks diary as read through `updateDiaryState`.
6. User can reply, like, dislike, favorite, or soft-delete through service/API calls.
7. Reply returns a pet reaction; fallback reaction is used on failure.
8. Soft-deleted diaries disappear from mailbox and detail lookup.

## Acceptance Criteria

| Requirement | Implementation Check |
|---|---|
| 每页 10 篇，倒序 | `getMailbox` clamps page size to 10 and sorts by `diary_date` desc |
| 删除只软删除 | `softDeleteDiary` sets inactive fields and filters future list/detail access |
| 不展示 raw evidence | UI only renders `source_summary`; detail response has no raw evidence fields |
| 不提供 rewrite | `available_actions` type excludes `rewrite`; tests assert no rewrite |
| 角色配置可替换 | UI copy uses `characterConfig` and template rendering |
| 人物资产映射 | `petEmotionAssetMap` maps emotion to PNG with idle fallback |
| LLM 失败有 fallback | LLM provider returns safe fallback objects instead of partial diary/internal error |
