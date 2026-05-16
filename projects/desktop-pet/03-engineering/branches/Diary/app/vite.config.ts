import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { ConfigurableDiaryProvider } from "./server/llm/configurableDiaryProvider";
import { demoCharacterConfig } from "./src/diary/characterConfig";
import type { PetReactionInput, PetScene, SynthesizeSpeechInput } from "./src/diary/types";

function diaryDevApiPlugin(): Plugin {
  const provider = new ConfigurableDiaryProvider();
  return {
    name: "diary-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/diary/tts", async (request, response, next) => {
        if (request.method !== "POST") {
          next();
          return;
        }

        try {
          const body = await readJsonBody(request);
          const result = await provider.synthesizeSpeech(normalizeSpeechBody(body));
          sendJson(response, 200, result);
        } catch {
          sendJson(response, 200, { provider: "browser_fallback" });
        }
      });

      server.middlewares.use("/api/diary/reactions", async (request, response, next) => {
        if (request.method !== "POST") {
          next();
          return;
        }

        try {
          const body = await readJsonBody(request);
          const result = await provider.generatePetReaction(normalizeReactionBody(body));
          sendJson(response, 200, result);
        } catch {
          sendJson(response, 503, { error: "reaction_unavailable" });
        }
      });
    }
  };
}

function normalizeSpeechBody(body: unknown): SynthesizeSpeechInput {
  const payload = typeof body === "object" && body !== null ? body as Record<string, unknown> : {};
  return {
    text: typeof payload.text === "string" ? payload.text.slice(0, 300) : "",
    voice_style: isVoiceStyle(payload.voice_style) ? payload.voice_style : "soft",
    scene: typeof payload.scene === "string" ? payload.scene as SynthesizeSpeechInput["scene"] : "manual_playback"
  };
}

function isVoiceStyle(value: unknown): value is NonNullable<SynthesizeSpeechInput["voice_style"]> {
  return value === "soft" || value === "happy" || value === "shy" || value === "apologetic" || value === "calm";
}

function normalizeReactionBody(body: unknown): PetReactionInput {
  const payload = typeof body === "object" && body !== null ? body as Record<string, unknown> : {};
  const characterConfig = typeof payload.character_config === "object" && payload.character_config !== null
    ? payload.character_config as Partial<typeof demoCharacterConfig>
    : {};

  return {
    scene: isPetScene(payload.scene) ? payload.scene : "diary_reply",
    diary_id: typeof payload.diary_id === "string" ? payload.diary_id : null,
    reply_id: typeof payload.reply_id === "string" ? payload.reply_id : null,
    character_config: {
      ...demoCharacterConfig,
      ...characterConfig,
      characterName: safeShortText(characterConfig.characterName, demoCharacterConfig.characterName),
      selfReference: safeShortText(characterConfig.selfReference, demoCharacterConfig.selfReference),
      userAddressing: safeShortText(characterConfig.userAddressing, demoCharacterConfig.userAddressing),
      tone: safeShortText(characterConfig.tone, demoCharacterConfig.tone),
      personaVersion: safeShortText(characterConfig.personaVersion, demoCharacterConfig.personaVersion)
    },
    context: sanitizeReactionContext(payload.context)
  };
}

function isPetScene(value: unknown): value is PetScene {
  return (
    value === "new_diary_available" ||
    value === "diary_opened" ||
    value === "diary_reply" ||
    value === "diary_deleted" ||
    value === "empty_state" ||
    value === "feedback_liked" ||
    value === "feedback_disliked" ||
    value === "generation_running" ||
    value === "generation_failed"
  );
}

function sanitizeReactionContext(context: unknown): PetReactionInput["context"] {
  if (typeof context !== "object" || context === null) return {};
  return Object.fromEntries(
    Object.entries(context as Record<string, unknown>)
      .filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null)
      .map(([key, value]) => [safeShortText(key, "context", 40), typeof value === "string" ? safeShortText(value, "", 180) : value])
      .slice(0, 12)
  ) as PetReactionInput["context"];
}

function safeShortText(value: unknown, fallback: string, maxLength = 80): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed.slice(0, maxLength) : fallback;
}

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    request.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > 16_384) {
        reject(new Error("request_too_large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

export default defineConfig({
  plugins: [react(), diaryDevApiPlugin()],
  server: {
    port: 5175,
    strictPort: false
  },
  preview: {
    port: 4174,
    strictPort: false
  },
  test: {
    environment: "node",
    globals: true
  }
});
