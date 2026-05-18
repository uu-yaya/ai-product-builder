import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { ConfigurableDiaryProvider } from "./server/llm/configurableDiaryProvider";
import { loadServerRuntimeEnv } from "./server/runtimeEnv";
import { demoCharacterConfig } from "./src/diary/characterConfig";
import { MockPortraitService } from "./src/diary/userPortrait/mockPortraitService";
import type { CharacterConfig, PetReactionInput, PetScene, SynthesizeSpeechInput } from "./src/diary/types";
import type { GetPortraitParams, PortraitNodeUpdatePatch, PortraitPetReaction, PortraitScenario } from "./src/diary/userPortrait/types";

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

      server.middlewares.use("/api/diary/llm-status", (request, response, next) => {
        if (request.method !== "GET") {
          next();
          return;
        }

        sendJson(response, 200, provider.getRuntimeStatus());
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

function portraitDevApiPlugin(): Plugin {
  const service = new MockPortraitService();
  const provider = new ConfigurableDiaryProvider();
  let activeScenario: PortraitScenario | null = null;

  return {
    name: "portrait-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/portrait", async (request, response, next) => {
        const url = mountedApiUrl(request, "/api/portrait");
        const pathname = url.pathname;

        try {
          if (request.method === "GET" && pathname === "/llm-status") {
            sendJson(response, 200, provider.getRuntimeStatus());
            return;
          }

          if (request.method === "GET" && pathname === "/") {
            applyPortraitRuntimeContext(url, {}, service, (scenario) => {
              if (scenario !== activeScenario) {
                service.setScenario(scenario);
                activeScenario = scenario;
              }
            });
            sendJson(response, 200, await service.getPortrait(portraitParamsFrom(url, {})));
            return;
          }

          if (request.method === "GET" && pathname === "/discoveries") {
            applyPortraitRuntimeContext(url, {}, service, (scenario) => {
              if (scenario !== activeScenario) {
                service.setScenario(scenario);
                activeScenario = scenario;
              }
            });
            const params = portraitParamsFrom(url, {});
            sendJson(response, 200, await service.getMoreDiscoveries({
              ...params,
              page: positiveInt(url.searchParams.get("page"), 1),
              page_size: positiveInt(url.searchParams.get("page_size"), 10)
            }));
            return;
          }

          if (request.method === "GET" && pathname === "/resonance") {
            applyPortraitRuntimeContext(url, {}, service, (scenario) => {
              if (scenario !== activeScenario) {
                service.setScenario(scenario);
                activeScenario = scenario;
              }
            });
            sendJson(response, 200, await service.getCharacterResonance(portraitParamsFrom(url, {})));
            return;
          }

          const nodeGetMatch = pathname.match(/^\/nodes\/([^/]+)$/);
          if (nodeGetMatch && request.method === "GET") {
            applyPortraitRuntimeContext(url, {}, service, (scenario) => {
              if (scenario !== activeScenario) {
                service.setScenario(scenario);
                activeScenario = scenario;
              }
            });
            sendJson(response, 200, await service.getPortraitNode(decodeURIComponent(nodeGetMatch[1]), portraitParamsFrom(url, {})));
            return;
          }

          const body = await readObjectBody(request);
          applyPortraitRuntimeContext(url, body, service, (scenario) => {
            if (scenario !== activeScenario) {
              service.setScenario(scenario);
              activeScenario = scenario;
            }
          });
          const characterConfig = portraitCharacterConfigFrom(url, body);

          const nodeMatch = pathname.match(/^\/nodes\/([^/]+)$/);
          if (nodeMatch && request.method === "PATCH") {
            const result = await service.updatePortraitNode(
              decodeURIComponent(nodeMatch[1]),
              portraitParamsFrom(url, body),
              portraitPatchFrom(body)
            );
            sendJson(response, 200, await withPortraitPetReaction(provider, characterConfig, result, {
              action: "node_edit",
              node_id: result.node.node_id,
              node_name: result.node.display_name,
              node_value: result.node.value,
              node_status: result.node.status
            }));
            return;
          }
          if (nodeMatch && request.method === "DELETE") {
            const result = await service.softDeletePortraitNode(decodeURIComponent(nodeMatch[1]), portraitParamsFrom(url, body));
            sendJson(response, 200, await withPortraitPetReaction(provider, characterConfig, result, {
              action: "soft_delete",
              node_id: result.node_id,
              inactive_reason: result.inactive_reason
            }));
            return;
          }

          const feedbackMatch = pathname.match(/^\/nodes\/([^/]+)\/feedback$/);
          if (feedbackMatch && request.method === "POST") {
            const result = await service.feedbackPortraitNode({
              ...portraitParamsFrom(url, body),
              node_id: decodeURIComponent(feedbackMatch[1]),
              value: body.value === "not_accurate" ? "not_accurate" : "like"
            });
            sendJson(response, 200, await withPortraitPetReaction(provider, characterConfig, result, {
              action: "node_feedback",
              node_id: result.node_id,
              feedback_value: result.value,
              node_status: result.current_status
            }));
            return;
          }

          const promoteMatch = pathname.match(/^\/discoveries\/([^/]+)\/promote$/);
          if (promoteMatch && request.method === "POST") {
            const result = await service.promoteDiscovery({
              ...portraitParamsFrom(url, body),
              discovery_id: decodeURIComponent(promoteMatch[1])
            });
            sendJson(response, 200, await withPortraitPetReaction(provider, characterConfig, result, {
              action: "promote_discovery",
              discovery_id: decodeURIComponent(promoteMatch[1]),
              status: result.status,
              node_name: result.node?.display_name ?? null
            }));
            return;
          }

          if (pathname === "/resonance/reassess" && request.method === "POST") {
            const params = portraitParamsFrom(url, body);
            const fallback = await service.reassessCharacterResonance(params);
            const portrait = await service.getPortrait(params);
            sendJson(response, 200, await provider.generatePortraitCharacterResonance({
              character_config: characterConfig,
              active_nodes: portrait.nodes,
              fallback
            }));
            return;
          }

          if (pathname === "/reorganize" && request.method === "POST") {
            const result = await service.reorganizePortrait(portraitParamsFrom(url, body));
            sendJson(response, 200, await withPortraitPetReaction(provider, characterConfig, result, {
              action: "reorganize_portrait",
              active_node_count: result.portrait.nodes.length,
              protected_user_edited_count: result.portrait.nodes.filter((node) => node.status === "user_edited").length
            }));
            return;
          }

          next();
        } catch (error) {
          sendJson(response, 400, {
            error: "portrait_request_failed",
            message: error instanceof Error ? error.message : "星图暂时没有展开，稍后再看。"
          });
        }
      });
    }
  };
}

async function withPortraitPetReaction<T extends { pet_reaction: PortraitPetReaction }>(
  provider: ConfigurableDiaryProvider,
  characterConfig: CharacterConfig,
  result: T,
  context: Record<string, unknown>
): Promise<T> {
  return {
    ...result,
    pet_reaction: await provider.generatePortraitPetReaction({
      character_config: characterConfig,
      fallback: result.pet_reaction,
      context
    })
  };
}

function mountedApiUrl(request: IncomingMessage, mountPath: string): URL {
  const url = new URL(request.url || "/", "http://localhost");
  if (url.pathname.startsWith(mountPath)) {
    url.pathname = url.pathname.slice(mountPath.length) || "/";
  }
  return url;
}

function applyPortraitRuntimeContext(
  url: URL,
  body: Record<string, unknown>,
  service: MockPortraitService,
  setScenario: (scenario: PortraitScenario) => void
) {
  const scenario = portraitScenarioFrom(body.scenario ?? url.searchParams.get("scenario"));
  if (scenario) setScenario(scenario);

  service.setCharacterConfig(portraitCharacterConfigFrom(url, body));
}

function portraitCharacterConfigFrom(url: URL, body: Record<string, unknown>): CharacterConfig {
  return {
    characterConfigId: safeShortText(bodyCharacterValue(body, "characterConfigId") ?? url.searchParams.get("character_config_id"), demoCharacterConfig.characterConfigId),
    characterName: safeShortText(bodyCharacterValue(body, "characterName") ?? url.searchParams.get("character_name"), demoCharacterConfig.characterName),
    selfReference: safeShortText(bodyCharacterValue(body, "selfReference") ?? url.searchParams.get("self_reference"), demoCharacterConfig.selfReference),
    userAddressing: safeShortText(bodyCharacterValue(body, "userAddressing") ?? url.searchParams.get("user_addressing"), demoCharacterConfig.userAddressing),
    tone: safeShortText(bodyCharacterValue(body, "tone") ?? url.searchParams.get("tone"), demoCharacterConfig.tone),
    personaVersion: safeShortText(bodyCharacterValue(body, "personaVersion") ?? url.searchParams.get("persona_version"), demoCharacterConfig.personaVersion)
  };
}

function bodyCharacterValue(body: Record<string, unknown>, key: keyof CharacterConfig): unknown {
  const value = body.character_config;
  if (typeof value !== "object" || value === null) return null;
  return (value as Partial<CharacterConfig>)[key];
}

function portraitScenarioFrom(value: unknown): PortraitScenario | null {
  return typeof value === "string" && value.length > 0 && value.length < 100 ? value as PortraitScenario : null;
}

function portraitParamsFrom(url: URL, body: Record<string, unknown>): GetPortraitParams {
  return {
    user_id: safeShortText(body.user_id ?? url.searchParams.get("user_id"), "demo-user"),
    game_context_id: safeShortText(body.game_context_id ?? url.searchParams.get("game_context_id"), "demo-game-context")
  };
}

function portraitPatchFrom(body: Record<string, unknown>): PortraitNodeUpdatePatch {
  const patch = typeof body.patch === "object" && body.patch !== null ? body.patch as Record<string, unknown> : {};
  return {
    value: typeof patch.value === "string" ? patch.value.slice(0, 120) : "",
    source: "user_edit"
  };
}

async function readObjectBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const body = await readJsonBody(request);
  return typeof body === "object" && body !== null ? body as Record<string, unknown> : {};
}

function positiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
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

export default defineConfig(({ mode }) => {
  loadServerRuntimeEnv(mode);

  return {
    plugins: [react(), diaryDevApiPlugin(), portraitDevApiPlugin()],
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
  };
});
