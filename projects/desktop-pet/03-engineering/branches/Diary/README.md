# Diary Engineering Branch

## Goal

把 Diary 模块从 PM PRD 与 Claude Design HTML handoff 工程化为可运行、可测试、可迁移的前端切片，并预留后端 API 与 LLM 接入边界。

## Current Status

| Item | Status |
|---|---|
| PM PRD | Read-only input: `01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md` |
| Design handoff | Read-only input: `02-design/branches/Diary/` and `03-engineering/branches/Diary/design-handoff/` |
| Real app source | Not found in current APB workspace |
| Engineering implementation | `app/` contains an isolated Vite React TypeScript slice |

## Implementation Boundary

Because no existing desktop-pet app source tree is present in this workspace, this branch creates a self-contained implementation slice under:

```text
projects/desktop-pet/03-engineering/branches/Diary/app/
```

The slice is designed to migrate into a future real host app by moving:

- `src/diary/components/`
- `src/diary/api/`
- `src/diary/llm/`
- `server/diary/`
- `server/llm/`

## Scope

- Restore the Claude Design visual direction in a real React frontend.
- Replace inline prototype state with a typed `DiaryService` boundary.
- Keep a mock adapter so the demo works without backend or LLM keys.
- Add backend API skeletons for mailbox, detail, state update, reply, feedback, soft delete, pet reaction, generation, and quality check.
- Add LLM provider adapters for diary draft, quality check, and pet reaction.
- Use only env placeholders such as `${DIARY_LLM_API_KEY}`, `${DIARY_LLM_BASE_URL}`, and `${DIARY_LLM_MODEL}`.
- Cover UI/API/AI/privacy/regression behavior with tests.

## Non-goals

- Do not modify PM PRD or Design source files.
- Do not implement production auth, database migrations, real scheduler, or real memory-system persistence.
- Do not call a live LLM from the browser.
- Do not expose raw evidence, window titles, document names, chat bodies, internal errors, model names, or policy reasons in UI.
- Do not add a user-facing "rewrite this diary" action.

## Safety Notes

- Soft delete means `is_active=false`, `inactive_reason=user_deleted`, and `evidence_reuse_allowed=false`.
- `available_actions` is constrained to `reply | like | dislike | favorite | delete`.
- Character name, user addressing, self reference, and tone come from `characterConfig`.
- Pet PNG selection goes through `petEmotionAssetMap`; unknown emotions fall back to `pet-idle.png`.
