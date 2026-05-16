# Diary PRD Implementation Audit

Date: 2026-05-15

Scope:

- Source of truth: `01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`
- Audited implementation: `03-engineering/branches/Diary/app/src`, `03-engineering/branches/Diary/app/server`
- This audit checks product/engineering coverage only. PM and Design source files were not modified.

## Executive Summary

The current Diary slice is a strong front-end demo plus typed service boundary. It implements most visible P0 flows in mock mode:

- desktop diary entry
- mailbox list
- diary detail
- reply
- like / dislike
- favorite
- soft delete
- empty/error states
- character config templating
- pet emotion/action asset mapping
- generic LLM provider skeleton with MiniMax preset

It is not yet a complete PRD implementation because several P0 backend/product-system responsibilities are only skeleton or mock:

- physiological day cutoff detection and scheduler
- mounted backend API server
- real persistence repository
- real memory system writes and feedback history
- real evidence query boundary
- real LLM provider wired into runtime API
- production-grade quality/eval gates and observability

## Coverage Legend

| Status | Meaning |
|---|---|
| Done | Implemented in running demo or tested code path |
| Partial | Type/skeleton/mock exists, but production behavior is incomplete |
| Missing | No meaningful implementation found |
| N/A P0 | PRD marks as P1 or future scope |

## P0 Feature Coverage

| PRD Requirement | Status | Evidence | Gap / Notes |
|---|---:|---|---|
| 每个生理日最多生成一篇日记 | Partial | `generationWorkflow.ts` duplicate check; `mockDiaryService.generateDiary()` duplicate check | Requires real repository uniqueness constraint keyed by `user_id + game_context_id + physiological_day_id + is_active`. |
| 生理日不按 00:00 切分，按深夜关机/长离线/05:00 | Partial | `DayWindow`, `CutoffReason` types; mock data carries window fields | Actual cutoff detector/scheduler (`day_window_cutoff`) is not implemented. |
| `MIN_SESSION_TIME=30min` low-evidence behavior | Partial | workflow skips if `effective_session_minutes < 30`; tests cover skip | PRD allows solo theater/worldbuilding when safe; current workflow always skips if no authorized sources or <30 mins. |
| `WRITE_DELAY_BUFFER=180s` | Partial | field exists in `DayWindow`; tests use 180 | No timer/scheduler uses it. |
| Only authorized summaries + source IDs, no raw records | Partial | workflow filters by `consent_snapshot`; prompt asks for summaries/source IDs only; provider filters returned `source_ids` | No real `evidence_query` service yet; no runtime guard proving raw records cannot enter from backend. |
| Bounded workflow: evidence summary -> draft -> quality -> persist | Partial | `generateDiaryForPhysiologicalDay()` implements draft/check/persist after pass | Not mounted into a backend route/job; retry is generic and does not include repair context. |
| Quality check covers facts/persona/privacy/repetition/format | Partial | types/prompt/schema cover five reasons; mock checks privacy/persona/format/repetition/facts partially | Not production-grade; no eval set, no high-risk recall checks, no deterministic pre-check pipeline. |
| LLM failure returns fallback, no half-written diary/internal error | Done/Partial | provider catches and falls back; generation workflow only persists after pass; UI errors are generic | Good skeleton. Production still needs API-level timeout/error mapping and logging redaction. |
| 日记列表倒序，每页 10 篇，分页 | Done | `PAGE_SIZE_LIMIT=10`; `getMailbox()` sorts desc and paginates; UI renders pager; tests cover cap/order | Good for mock/demo. |
| 收信箱红点 / 多篇未读数量 | Done | desktop unread badge from `mailbox.unread_count` | Real host integration still needed for tray/desktop shell. |
| 桌宠头顶新日记气泡 | Done | `DesktopEntry` renders role-text bubble and mailbox button | Current bubble dismissed state is local-only, not service persisted. |
| 打开信箱短过渡动画 | Partial | UI has hover/entry animations | No explicit mailbox-open transition state before navigating. |
| 相纸/拍立得卡片列表 | Done | `MailboxView` polaroid cards with visual assets | Matches demo requirement. |
| 空状态/异常状态不暴露内部原因 | Done | `EmptyState` and `quiet-banner` use generic role copy | Good. |
| 日记详情信纸 + 手账拼贴 | Done | `DiaryDetailView` renders letter sheet, meta chips, collage, actions | Good for demo. |
| 来源摘要轻量展示，不展示 raw evidence | Done | UI displays `source_summary` only | Real API must keep this invariant. |
| 打开详情记录 read_at / 状态回写 | Done | front-end calls `updateDiaryState()` before fetching detail | Mock persists in memory; real API still needed. |
| 打开详情桌宠开场反应 | Done/Partial | calls `generatePetReaction()` and shows chat line / toast | Reaction is mock in running demo; real LLM provider not wired to runtime API yet. |
| 详情页回信 | Done | reply composer calls `submitDiaryReply()` through service | Good for mock/demo. |
| 回信默认进入长期记忆 | Partial | mock sets `long_term_memory_write_status=written`, `memory_source_id=mock_memory_*` | Real memory boundary not implemented. |
| 回信后桌宠即时回应 | Done/Partial | mock returns pet reaction; UI shows desk pet action/chat reaction | Real LLM/TTS not wired into runtime API. |
| 喜欢 / 不喜欢评价 | Done/Partial | service call and mock state update; pet reaction returned | Mock only stores current feedback, not feedback history. |
| 回信映射反馈 | Done/Partial | mock infers positive/negative/correction and updates feedback state | Simple regex only; real intent parser/memory write missing. |
| 收藏 / 取消收藏 | Done | `updateDiaryState(is_favorited)` via service; UI reflects state | Good for mock/demo. |
| 删除确认 | Done | modal explains no longer displayed / used as evidence | Good. |
| 软删除 `is_active=false`, `inactive_reason=user_deleted` | Done/Partial | mock sets flags, archives, filters list/detail; test covers | Needs real DB persistence and retrieval exclusion. |
| 删除后不展示、不检索、不作为后续证据 | Partial | mock filters active diary; generation duplicate ignores inactive | No real retrieval/evidence pipeline exists yet. |
| 详情页不提供 rewrite | Done | `DIARY_ACTIONS` excludes `rewrite`; sanitize filters actions; test covers | Good. |
| `available_actions` never includes `rewrite` | Done | `sanitizeAvailableActions()` and test | Good. |
| Character config controls name/self/user addressing | Done | `characterConfig` type/template; prototype controls are isolated | Formal host-provided config still needed. |
| Pet emotion maps to PNG with fallback | Done | `petEmotionAssetMap`, `getPetAssetForEmotion()` | Good. |
| Pet action/reaction/voice fields | Partial | `PetAction`, CSS action classes, optional `voice_audio_url` | Actual TTS bridge is skeleton only. |
| No real partner game assets generated/referenced | Done | uses demo assets under `diary-assets` | Good for demo. |

## API Coverage

| API Requirement | Status | Evidence | Gap |
|---|---:|---|---|
| mailbox list | Done/Partial | `DiaryService.getMailbox`, `HttpDiaryClient`, `diaryRoutes` handler | No actual server framework route mounted. |
| diary detail | Done/Partial | `getDiaryDetail`, sanitize actions | No actual backend route mounted. |
| state update | Done/Partial | `updateDiaryState` in client/mock/routes | No persistence backend. |
| reply | Done/Partial | `submitDiaryReply` in client/mock/routes | No memory backend or safety processing. |
| feedback | Done/Partial | `submitDiaryFeedback` in client/mock/routes | No feedback history table. |
| soft delete | Done/Partial | `softDeleteDiary` in client/mock/routes/tests | No DB persistence/retrieval enforcement. |
| pet reaction | Partial | service method and provider interface | Runtime app uses mock, not real LLM provider. |
| diary generation | Partial | workflow/provider/mock methods | No job runner/route mount/repository. |
| diary quality check | Partial | provider/mock method | No production evaluator/pre-check pipeline. |

## AI / LLM Coverage

| PRD Requirement | Status | Evidence | Gap |
|---|---:|---|---|
| `generateDiaryDraft(input)` | Partial | `LLMProvider`, `ConfigurableDiaryProvider` | Not wired to running demo/backend route. |
| `checkDiaryQuality(input)` | Partial | provider method/schema | Needs stronger deterministic guards and evals. |
| `generatePetReaction(input)` | Partial | provider method, MiniMax preset, action/voice output | Running UI still uses mock service unless real API is mounted. |
| Structured output and fallback | Done/Partial | JSON schemas, parser, fallback provider | Good skeleton; provider-specific behavior needs integration tests with selected vendor. |
| Prompt avoids fixed role name | Done | prompts consume `character_config` | Good. |
| Safety rules: no model/interface/risk/private reason in UI | Done/Partial | prompt and blocked text regex; UI copy generic | Needs backend log redaction and broader PII checks. |
| Voice/TTS | Partial | optional HTTP JSON TTS bridge and audio playback | No real TTS endpoint configured. |

## Privacy Coverage

| PRD Boundary | Status | Evidence | Gap |
|---|---:|---|---|
| No raw evidence in UI | Done | UI displays `source_summary`, not `source_candidates` | Real API must enforce response shape. |
| No window title/document name/chat body/internal errors | Partial | prompt/regex forbids; UI generic states | Regex is not exhaustive; real privacy filter/eval missing. |
| Deleted diary not reused | Partial | mock flags and active filters | Real evidence retrieval/generation pipeline missing. |
| User reply safety processing | Missing/Partial | reply length cap only in UI | No sanitization/safety layer before memory write. |
| Logs do not leak secrets/data | Partial | no real logging added; env placeholders only | Need logging policy when backend exists. |

## Tests / Verification

Current verification:

- `npm test -- --run` passed: 4 files, 15 tests.
- `npm run build` passed.

Coverage that exists:

- mailbox reverse order and page size cap
- read state update
- no rewrite action
- reply mock memory boundary
- soft delete removal from list/detail
- privacy-risk quality check
- bounded generation duplicate/low-evidence/persist-after-quality
- provider fallback, keyless local adapter, MiniMax preset, fenced JSON parsing
- pet emotion asset fallback

Important missing test coverage:

- real API route integration test
- UI interaction tests for pagination/reply/delete/favorite
- physiological cutoff algorithm tests
- feedback history/latest-wins semantics
- user reply safety/memory write failure
- deleted diary excluded from future evidence query
- generated diary not exposing private raw fields
- LLM quality eval set and privacy/adversarial cases
- TTS bridge contract tests

## Priority Fix List

### P0 Before Backend Demo Can Be Called Complete

1. Mount actual backend API routes or add a dev API server.
2. Wire `ConfigurableDiaryProvider` into `pet reaction`, `generate`, and `quality-check` backend handlers.
3. Add a real repository interface/in-memory implementation for generated diaries, feedback history, replies, soft delete, and source links.
4. Implement `day_window_cutoff` service with tests for night shutdown, long absence, 05:00 cutoff, write delay, and next boot fallback.
5. Add evidence query adapter that accepts only authorized summaries/source IDs and excludes inactive/deleted diaries.
6. Add reply safety processing before long-term memory write.
7. Add route-level tests for all Diary API endpoints.

### P0 Before Production Readiness

1. Add persistent DB constraints for one active diary per physiological day.
2. Add real memory service integration for replies and feedback.
3. Add privacy pre-checks before model call and post-checks after model output.
4. Add eval set runner for PRD quality gates.
5. Add observability counters with redacted logging.
6. Add feedback history instead of only current feedback state.
7. Add host integration for real character config and desktop-pet shell entry/bubble state.

### P1 / Later

1. Time anomaly handling: time reversal easter egg and future time jump guard.
2. Share/export flows, if ever scoped.
3. Production TTS provider integration.
