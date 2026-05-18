# Diary Module App Slice

This is a self-contained Vite React TypeScript implementation slice for the desktop-pet Diary module.

## Run

```bash
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5175/
```

## Verify

```bash
npm run build
npm test
```

## API Mode

Default mode uses the local mock adapter:

```bash
npm run dev
```

To point the UI at a future backend:

```bash
VITE_DIARY_API_MODE=http VITE_DIARY_API_BASE_URL=/api/diary npm run dev
```

## LLM Boundary

LLM provider code lives under `server/llm/` and is server-side only. The browser never reads or stores model credentials.

Default mode is safe fallback/mock. To connect a vendor, point the configurable provider at any Chat Completions-compatible endpoint:

```bash
DIARY_LLM_PROVIDER=chat-completions-compatible
DIARY_LLM_AUTH_MODE=bearer
DIARY_LLM_BASE_URL=https://your-vendor.example/v1
DIARY_LLM_API_KEY=${DIARY_LLM_API_KEY}
DIARY_LLM_MODEL=${DIARY_LLM_MODEL}
DIARY_REACTION_MODEL=${DIARY_REACTION_MODEL}
DIARY_LLM_RESPONSE_FORMAT=json_object
```

For keyless local models or an internal gateway, set `DIARY_LLM_AUTH_MODE=none` and leave `DIARY_LLM_API_KEY` unset. For vendors that do not support this request/response shape, put a small backend proxy in front of them and expose `/chat/completions` with the same response shape.

### MiniMax Example

For MiniMax, daily local use only needs one env var:

```bash
MINIMAX_API_KEY=${MINIMAX_API_KEY}
```

There is a non-secret template at `.env.local.example`. Use a private `.env.local` or shell export for the real value; `.env.local` is ignored by git.

Recommended local setup on a new machine:

```bash
cp .env.local.example .env.local
# edit .env.local and replace ${MINIMAX_API_KEY} with the real private key
npm run dev
```

The local dev API reads `.env.local` at startup through `server/runtimeEnv.ts`. Restart `npm run dev` after changing `.env.local`. User Portrait uses the same server-side provider for portrait pet reactions and character-resonance reassessment; it never exposes the key to browser code.

When `MINIMAX_API_KEY` is present, the provider uses these defaults:

```bash
DIARY_LLM_PROVIDER=chat-completions-compatible
DIARY_LLM_AUTH_MODE=bearer
DIARY_LLM_BASE_URL=https://api.minimaxi.com/v1 # for sk-cp keys
DIARY_LLM_MODEL=MiniMax-M2.7
DIARY_REACTION_MODEL=MiniMax-M2.7
DIARY_LLM_RESPONSE_FORMAT=none
DIARY_TTS_PROVIDER=minimax
DIARY_TTS_MODEL=speech-2.8-hd
DIARY_TTS_VOICE="Chinese (Mandarin)_Cute_Spirit"
DIARY_TTS_AUDIO_FORMAT=mp3
```

For non `sk-cp-` keys, the preset defaults to `https://api.minimax.io/v1`. You can always override with `DIARY_LLM_BASE_URL`.

The Vite dev server exposes a local `/api/diary/tts` bridge for the demo, so the browser never receives `MINIMAX_API_KEY`. The MiniMax preset uses the official T2A WebSocket path for short real-time reactions (`wss://api.minimaxi.com/ws/v1/t2a_v2` for `sk-cp-` keys). If MiniMax TTS fails, the UI falls back to browser speech synthesis and does not show internal provider errors.

You only need the longer vars when overriding model, base URL, auth mode, response format, TTS model, voice, or audio format. Keep real MiniMax keys in local shell env or private `.env.local` only. The Vite config loads server-only env values from `.env.local` into the dev API bridge, but only `VITE_*` variables are exposed to browser code.

To verify the local dev API can see server-side LLM config without exposing secrets:

```bash
curl http://127.0.0.1:5175/api/diary/llm-status
curl http://127.0.0.1:5175/api/portrait/llm-status
```

Expected configured shape:

```json
{"llm_ready":true,"llm_auth_configured":true,"llm_base_url_configured":true,"llm_model_configured":true,"tts_ready":true,"tts_provider_enabled":true}
```

Optional voice/TTS can still point at a generic HTTP bridge when a different vendor is used:

```bash
DIARY_TTS_PROVIDER=http-json
DIARY_TTS_AUTH_MODE=bearer
DIARY_TTS_ENDPOINT=${DIARY_TTS_ENDPOINT}
DIARY_TTS_API_KEY=${DIARY_TTS_API_KEY}
DIARY_TTS_VOICE=${DIARY_TTS_VOICE}
```

The TTS bridge may return JSON `{ "audio_url": "https://..." }`, `{ "audio_url": "data:audio/..." }`, or `{ "audio_base64": "...", "mime_type": "audio/mpeg" }`.

Placeholders:

- `${DIARY_LLM_API_KEY}`
- `${DIARY_LLM_BASE_URL}`
- `${DIARY_LLM_MODEL}`
- `${DIARY_REACTION_MODEL}`
- `${DIARY_TTS_ENDPOINT}`
- `${DIARY_TTS_API_KEY}`
- `${DIARY_TTS_MODEL}`
- `${DIARY_TTS_VOICE}`

No real key should be committed.
