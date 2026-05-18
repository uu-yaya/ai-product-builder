# Sync: User Portrait LLM Provider Integration

Project: `desktop-pet`  
Branch: `Diary` / `user-portrait` integration  
Thread: Engineering Build Thread  
Time: `2026-05-18T10-11-24`

## Context

User Portrait needed to use the same backend-side LLM configuration as Diary. The implementation must let other machines pull the code, fill local config files, and run without committing secrets.

## Changes

- Reused the server-side `ConfigurableDiaryProvider` for User Portrait LLM behavior.
- Added portrait-specific LLM methods:
  - `generatePortraitPetReaction`
  - `generatePortraitCharacterResonance`
- Wired the Vite dev API bridge so `/api/portrait` can use LLM output for:
  - node edit reactions
  - like / unlike reactions
  - soft delete reactions
  - discovery promotion reactions
  - reorganize reactions
  - character resonance reassessment
- Added redacted readiness endpoint:
  - `GET /api/portrait/llm-status`
- Kept failure behavior safe:
  - If LLM is unavailable or blocked, the existing mock service response remains the fallback.
  - No API key is written to source files.
  - No browser-side LLM call is introduced.

## Local Setup

Use:

```bash
cd /Users/yayauu/ai-product-builder/projects/desktop-pet/03-engineering/branches/Diary/app
cp .env.local.example .env.local
# fill MINIMAX_API_KEY privately
npm run dev
curl http://127.0.0.1:5175/api/portrait/llm-status
```

## Verification

- `npm test` passed: 6 files, 33 tests.
- `npm run build` passed.
