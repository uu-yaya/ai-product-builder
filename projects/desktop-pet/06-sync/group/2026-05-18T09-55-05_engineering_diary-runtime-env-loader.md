# Sync: Diary Runtime Env Loader

Project: `desktop-pet`  
Branch: `Diary` / `user-portrait` integration  
Thread: Engineering Build Thread  
Time: `2026-05-18T09-55-05`

## Context

The local Diary + User Portrait dev API needed a reliable way to read backend LLM/TTS configuration from a local config file, so another machine can pull the code, copy an example env file, fill private credentials locally, and run the demo without committing secrets.

## Changes

- Added a server runtime env loader:
  - `03-engineering/branches/Diary/app/server/runtimeEnv.ts`
- Added a non-secret local template:
  - `03-engineering/branches/Diary/app/.env.local.example`
- Updated Vite dev config to load server runtime env before creating the dev API providers:
  - `03-engineering/branches/Diary/app/vite.config.ts`
- Added redacted LLM readiness diagnostics:
  - `GET /api/diary/llm-status`
- Added tests:
  - `03-engineering/branches/Diary/app/src/diary/__tests__/runtimeEnv.test.ts`
  - updated `configurableDiaryProvider.test.ts`
- Updated docs:
  - `03-engineering/branches/Diary/app/README.md`
  - `03-engineering/branches/Diary/app/.env.minimax.example`

## Local Setup Contract

On a new machine:

```bash
cd /Users/yayauu/ai-product-builder/projects/desktop-pet/03-engineering/branches/Diary/app
cp .env.local.example .env.local
# edit .env.local and fill MINIMAX_API_KEY locally
npm run dev
curl http://127.0.0.1:5175/api/diary/llm-status
```

Real keys must stay in `.env.local` or shell env only. `.env.local` is gitignored.

## Verification

- `npm test` passed: 6 files, 31 tests.
- `npm run build` passed.
