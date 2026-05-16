# Test Cases: Diary Module

## Test Scope

| Area | Coverage |
|---|---|
| UI | Desktop entry, mailbox, detail, reply, feedback, favorite, soft delete, empty states |
| API | Typed service methods and sanitized HTTP boundary |
| AI | Bounded generation workflow, fallback provider, quality check |
| Privacy | No raw evidence, no private title/body/error reason in UI-facing content |
| Regression | No rewrite action, page size 10, soft-deleted entries excluded |

## Automated Tests

| Test ID | Scenario | Expected Result | Priority | Blocking Release |
|---|---|---|---|---|
| T-DIARY-001 | Mailbox page size requested as 99 | Service caps `page_size` to 10 | P0 | Yes |
| T-DIARY-002 | Mailbox list load | Items sorted by `diary_date` desc | P0 | Yes |
| T-DIARY-003 | Open unread detail | `updateDiaryState` marks item read and unread count decreases | P0 | Yes |
| T-DIARY-004 | Detail actions | `available_actions` excludes `rewrite` | P0 | Yes |
| T-DIARY-005 | Submit reply | Reply has `long_term_memory_write_status=written` and mock memory ID | P0 | Yes |
| T-DIARY-006 | Soft delete | `is_active=false`, `inactive_reason=user_deleted`, list/detail exclude diary | P0 | Yes |
| T-DIARY-007 | Quality check with private terms | Quality result fails with privacy reason | P0 | Yes |
| T-DIARY-008 | Unknown pet emotion | Falls back to `pet-idle.png` | P0 | Yes |
| T-DIARY-009 | Bounded generation success | Persists only after quality pass | P0 | Yes |
| T-DIARY-010 | Duplicate physiological day | Workflow blocks second active diary | P0 | Yes |
| T-DIARY-011 | Low evidence day | Workflow returns skipped state, no partial diary | P0 | Yes |

## Manual Smoke Checks

| Flow | Result |
|---|---|
| Open desktop entry | Pet + mailbox red dot render, no blank page |
| Open mailbox | 10 cards on page 1, pagination appears for 12 mock diaries |
| Open first card | Detail shows letter sheet, source summary only, no raw evidence |
| Submit reply | Reply appears once and shows mock memory boundary |
| Soft delete | Confirmation appears; after confirm diary disappears from list |

## Commands Run

```bash
npm install
npm run build
npm test
```

Playwright CLI smoke flow was run against:

```text
http://127.0.0.1:5175/
```
