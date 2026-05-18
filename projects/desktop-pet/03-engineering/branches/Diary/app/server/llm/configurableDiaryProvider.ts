import { FallbackLLMProvider } from "../../src/diary/llm/fallbackLLMProvider";
import type { LLMProvider } from "../../src/diary/llm/LLMProvider";
import { buildDiaryDraftPrompt, buildPetReactionPrompt, buildQualityCheckPrompt } from "../../src/diary/llm/prompts";
import type {
  CheckDiaryQualityInput,
  CheckDiaryQualityResponse,
  CharacterConfig,
  ContentAngle,
  DiaryDraft,
  DiaryEmotion,
  GenerateDiaryInput,
  PetAction,
  PetReaction,
  PetReactionInput,
  SynthesizeSpeechInput,
  SynthesizeSpeechResponse,
  VoiceMimeType,
  VoiceStyle
} from "../../src/diary/types";
import { portraitAssets } from "../../src/diary/userPortrait/portraitAssets";
import type {
  CharacterResonance,
  PortraitNode,
  PortraitPetReaction
} from "../../src/diary/userPortrait/types";

const DIARY_LLM_API_KEY_PLACEHOLDER = "${DIARY_LLM_API_KEY}";
const DIARY_LLM_BASE_URL_PLACEHOLDER = "${DIARY_LLM_BASE_URL}";
const DIARY_LLM_MODEL_PLACEHOLDER = "${DIARY_LLM_MODEL}";
const DIARY_REACTION_MODEL_PLACEHOLDER = "${DIARY_REACTION_MODEL}";
const DIARY_TTS_ENDPOINT_PLACEHOLDER = "${DIARY_TTS_ENDPOINT}";
const DIARY_TTS_MODEL_PLACEHOLDER = "${DIARY_TTS_MODEL}";
const MINIMAX_API_KEY_PLACEHOLDER = "${MINIMAX_API_KEY}";
const MINIMAX_GLOBAL_BASE_URL = "https://api.minimax.io/v1";
const MINIMAX_CN_BASE_URL = "https://api.minimaxi.com/v1";
const MINIMAX_GLOBAL_WS_URL = "wss://api.minimax.io/ws/v1/t2a_v2";
const MINIMAX_CN_WS_URL = "wss://api.minimaxi.com/ws/v1/t2a_v2";
const MINIMAX_DEFAULT_MODEL = "MiniMax-M2.7";
const MINIMAX_DEFAULT_TTS_MODEL = "speech-2.8-hd";
const MINIMAX_DEFAULT_TTS_VOICE = "Chinese (Mandarin)_Cute_Spirit";

const allowedEmotions = ["excited", "gentle", "comfort", "apology", "quiet", "playful", "thinking", "writing", "sleeping", "sorry"] as const;
const allowedActions = ["idle", "happy_bounce", "nod", "wave", "shy_hide", "thinking_loop", "sorry_bow", "writing_loop"] as const;
const allowedPortraitActions = ["idle", "happy_bounce", "nod", "wave", "thinking_loop", "sorry_bow", "writing_loop"] as const;
const allowedAngles = ["game_companion", "daily_observation", "pet_interaction", "solo_theater", "worldbuilding"] as const;
const allowedMemoryHints = ["none", "positive_feedback", "negative_feedback", "correction"] as const;
const allowedQualityReasons = ["facts", "persona", "privacy", "repetition", "format"] as const;
const allowedVoiceStyles = ["soft", "happy", "shy", "apologetic", "calm"] as const;
const allowedTtsAudioFormats = ["mp3", "wav", "flac"] as const;
const allowedPortraitRoleKeys = ["warm_mage", "brave_guardian", "tiny_inventor", "quiet_star"] as const;

type LLMProviderKind = "mock" | "chat-completions-compatible";
type AuthMode = "bearer" | "none";
type ResponseFormatMode = "none" | "json_object" | "json_schema";
type TtsProviderKind = "none" | "http-json" | "minimax";
type TtsAudioFormat = (typeof allowedTtsAudioFormats)[number];
type TtsOutputFormat = "hex" | "url";
type FetchLike = typeof fetch;
type WebSocketEventLike = { data?: unknown };
type WebSocketLike = {
  readyState: number;
  addEventListener: (type: "open" | "message" | "error" | "close", listener: (event: WebSocketEventLike) => void) => void;
  send: (data: string) => void;
  close: () => void;
};
type WebSocketConstructorLike = new (url: string, init?: { headers?: Record<string, string> }) => WebSocketLike;

export type ConfigurableDiaryProviderConfig = {
  provider: LLMProviderKind;
  authMode: AuthMode;
  apiKey: string;
  baseUrl: string;
  chatCompletionsUrl?: string;
  diaryModel: string;
  reactionModel: string;
  responseFormat: ResponseFormatMode;
  ttsProvider: TtsProviderKind;
  ttsAuthMode: AuthMode;
  ttsEndpoint: string;
  ttsApiKey: string;
  ttsVoice: string;
  ttsModel?: string;
  ttsAudioFormat?: TtsAudioFormat;
  ttsOutputFormat?: TtsOutputFormat;
};

export type ConfigurableDiaryProviderStatus = {
  llm_ready: boolean;
  llm_auth_configured: boolean;
  llm_base_url_configured: boolean;
  llm_model_configured: boolean;
  tts_ready: boolean;
  tts_provider_enabled: boolean;
};

type ReactionJson = {
  reaction_text: string;
  emotion: string;
  action: string;
  should_speak: boolean;
  voice_style: string;
  memory_write_hint: string;
};

type PortraitReactionJson = {
  reaction_text: string;
  emotion: string;
  action: string;
  should_speak: boolean;
};

type PortraitResonanceJson = {
  character_name: string;
  role_type: string;
  role_key: string;
  resonance_points: string[];
  pet_explanation: string;
};

export class ConfigurableDiaryProvider implements LLMProvider {
  private readonly fallback = new FallbackLLMProvider();

  constructor(
    private readonly config: ConfigurableDiaryProviderConfig = defaultConfig(),
    private readonly fetchImpl: FetchLike = fetch
  ) {}

  async generateDiaryDraft(input: GenerateDiaryInput): Promise<DiaryDraft> {
    if (!this.canUseModel(this.config.diaryModel)) return this.fallback.generateDiaryDraft(input);

    try {
      const raw = await this.createStructuredChatResponse<Record<string, unknown>>({
        model: this.config.diaryModel,
        schemaName: "diary_draft",
        schema: diaryDraftSchema(input.source_candidates.map((source) => source.source_id)),
        system: "You generate safe, bounded desktop-pet diary drafts. Return only JSON.",
        prompt: buildDiaryDraftPrompt(input),
        maxTokens: 900
      });
      return this.normalizeDiaryDraft(raw, input);
    } catch {
      return this.fallback.generateDiaryDraft(input);
    }
  }

  async checkDiaryQuality(input: CheckDiaryQualityInput): Promise<CheckDiaryQualityResponse> {
    if (!this.canUseModel(this.config.diaryModel)) return this.fallback.checkDiaryQuality(input);

    try {
      const raw = await this.createStructuredChatResponse<Record<string, unknown>>({
        model: this.config.diaryModel,
        schemaName: "diary_quality_check",
        schema: qualityCheckSchema,
        system: "You are a strict safety and quality checker. Return only JSON.",
        prompt: buildQualityCheckPrompt(input),
        maxTokens: 500
      });
      return this.normalizeQuality(raw);
    } catch {
      return this.fallback.checkDiaryQuality(input);
    }
  }

  async generatePetReaction(input: PetReactionInput): Promise<PetReaction> {
    const model = this.config.reactionModel.includes("${") ? this.config.diaryModel : this.config.reactionModel;
    if (!this.canUseModel(model)) return this.fallback.generatePetReaction(input);

    try {
      const raw = await this.createStructuredChatResponse<ReactionJson>({
        model,
        schemaName: "pet_reaction",
        schema: petReactionSchema,
        system: "你生成安全、简短、中文的桌宠反应。最终答案只输出 JSON，不要输出解释。",
        prompt: buildPetReactionPrompt(input),
        maxTokens: 900
      });
      const reaction = this.normalizeReaction(raw, input);
      const voice = await this.createVoiceAudio(reaction.reaction_text, raw.voice_style, reaction.should_speak);
      return { ...reaction, ...voice };
    } catch {
      return this.fallback.generatePetReaction(input);
    }
  }

  async synthesizeSpeech(input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse> {
    const text = safeText(input.text, "", 300);
    if (!text) return { provider: "browser_fallback" };

    const voice = await this.createVoiceAudio(text, input.voice_style ?? "soft", true);
    if (!voice.voice_audio_url) return { provider: "browser_fallback" };

    return {
      provider: this.config.ttsProvider === "minimax" ? "minimax" : "http-json",
      ...voice
    };
  }

  async generatePortraitPetReaction(input: {
    character_config: CharacterConfig;
    fallback: PortraitPetReaction;
    context: Record<string, unknown>;
  }): Promise<PortraitPetReaction> {
    const model = this.config.reactionModel.includes("${") ? this.config.diaryModel : this.config.reactionModel;
    if (!this.canUseModel(model)) return input.fallback;

    try {
      const raw = await this.createStructuredChatResponse<PortraitReactionJson>({
        model,
        schemaName: "portrait_pet_reaction",
        schema: portraitPetReactionSchema,
        system: "你生成安全、简短、中文的用户画像页桌宠反应。最终答案只输出 JSON，不要输出解释。",
        prompt: buildPortraitReactionPrompt(input.character_config, input.context),
        maxTokens: 500
      });
      return this.normalizePortraitReaction(raw, input.fallback);
    } catch {
      return input.fallback;
    }
  }

  async generatePortraitCharacterResonance(input: {
    character_config: CharacterConfig;
    active_nodes: PortraitNode[];
    fallback: CharacterResonance;
  }): Promise<CharacterResonance> {
    const model = this.config.reactionModel.includes("${") ? this.config.diaryModel : this.config.reactionModel;
    if (!this.canUseModel(model)) return input.fallback;
    if (input.fallback.status === "failed" || input.fallback.status === "authorization_unmet" || input.fallback.status === "insufficient_data") {
      return input.fallback;
    }

    try {
      const raw = await this.createStructuredChatResponse<PortraitResonanceJson>({
        model,
        schemaName: "portrait_character_resonance",
        schema: portraitCharacterResonanceSchema,
        system: "你生成安全、游戏语境内的角色共鸣结果。最终答案只输出 JSON，不要输出解释。",
        prompt: buildPortraitResonancePrompt(input.character_config, input.active_nodes),
        maxTokens: 800
      });
      return this.normalizePortraitResonance(raw, input.fallback, input.active_nodes);
    } catch {
      return input.fallback;
    }
  }

  getRuntimeStatus(): ConfigurableDiaryProviderStatus {
    const reactionModel = this.config.reactionModel.includes("${") ? this.config.diaryModel : this.config.reactionModel;
    return {
      llm_ready: this.canUseModel(reactionModel),
      llm_auth_configured: this.hasRequiredAuth(this.config.authMode, this.config.apiKey),
      llm_base_url_configured: Boolean(this.config.baseUrl && !this.config.baseUrl.includes("${")),
      llm_model_configured: Boolean(reactionModel && !reactionModel.includes("${")),
      tts_ready: this.canUseTts(),
      tts_provider_enabled: this.config.ttsProvider !== "none"
    };
  }

  private async createStructuredChatResponse<T>({
    model,
    schemaName,
    schema,
    system,
    prompt,
    maxTokens
  }: {
    model: string;
    schemaName: string;
    schema: Record<string, unknown>;
    system: string;
    prompt: string;
    maxTokens: number;
  }): Promise<T> {
    const body: Record<string, unknown> = {
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `${prompt}\n\nJSON schema:\n${JSON.stringify(schema)}` }
      ],
      temperature: 0.4,
      max_tokens: maxTokens,
      stream: false
    };

    if (this.config.responseFormat === "json_object") {
      body.response_format = { type: "json_object" };
    }
    if (this.config.responseFormat === "json_schema") {
      body.response_format = {
        type: "json_schema",
        json_schema: { name: schemaName, strict: true, schema }
      };
    }

    const response = await this.fetchImpl(this.chatCompletionsUrl(), {
      method: "POST",
      headers: this.authHeaders(this.config.authMode, this.config.apiKey),
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error("provider_failed");
    const payload = await response.json();
    const outputText = extractChatContent(payload);
    if (!outputText) throw new Error("invalid_json");
    return parseJsonObject(outputText) as T;
  }

  private normalizeDiaryDraft(raw: Record<string, unknown>, input: GenerateDiaryInput): DiaryDraft {
    const authorizedSourceIds = new Set(input.source_candidates.map((source) => source.source_id));
    const title = safeText(raw.title, "折好的新信", 28);
    const body = Array.isArray(raw.body)
      ? raw.body.map((line) => safeText(line, "", 80)).filter(Boolean).slice(0, 4)
      : [];
    const contentAngle = enumValue(raw.content_angle, allowedAngles, "solo_theater") as ContentAngle;
    const sourceIds = Array.isArray(raw.source_ids)
      ? raw.source_ids.filter((sourceId): sourceId is string => typeof sourceId === "string" && authorizedSourceIds.has(sourceId)).slice(0, 8)
      : [];
    const emotion = enumValue(raw.emotion, allowedEmotions, "gentle") as DiaryEmotion;

    if (containsBlockedText([title, ...body].join("\n")) || body.length === 0) {
      throw new Error("blocked");
    }

    return { title, body, content_angle: contentAngle, source_ids: sourceIds, emotion };
  }

  private normalizeQuality(raw: Record<string, unknown>): CheckDiaryQualityResponse {
    const qualityResult = raw.quality_result === "pass" ? "pass" : "fail";
    const reasons = Array.isArray(raw.quality_failure_reasons)
      ? raw.quality_failure_reasons.filter((reason): reason is (typeof allowedQualityReasons)[number] => isEnum(reason, allowedQualityReasons))
      : [];
    const riskFlags = Array.isArray(raw.risk_flags)
      ? raw.risk_flags.map((flag) => safeText(flag, "", 32)).filter(Boolean).slice(0, 8)
      : reasons;

    return {
      quality_result: qualityResult,
      quality_failure_reasons: reasons,
      rewrite_allowed: false,
      risk_flags: riskFlags
    };
  }

  private normalizeReaction(raw: ReactionJson, input: PetReactionInput): PetReaction {
    const fallbackText = input.scene === "generation_failed"
      ? "信纸好像被收得太深了，晚点再整理。"
      : "收到啦，会轻轻记好。";
    const reactionText = safeText(raw.reaction_text, fallbackText, 48);
    if (containsBlockedText(reactionText)) throw new Error("blocked");

    return {
      reaction_id: `llm_reaction_${Date.now()}`,
      diary_id: input.diary_id ?? null,
      reply_id: input.reply_id ?? null,
      scene: input.scene,
      reaction_text: reactionText,
      emotion: enumValue(raw.emotion, allowedEmotions, "gentle") as DiaryEmotion,
      action: enumValue(raw.action, allowedActions, "nod") as PetAction,
      should_speak: typeof raw.should_speak === "boolean" ? raw.should_speak : true,
      memory_write_hint: enumValue(raw.memory_write_hint, allowedMemoryHints, "none"),
      created_at: new Date().toISOString()
    };
  }

  private normalizePortraitReaction(raw: PortraitReactionJson, fallback: PortraitPetReaction): PortraitPetReaction {
    const reactionText = safeText(raw.reaction_text, fallback.reaction_text, 54);
    if (containsBlockedText(reactionText)) throw new Error("blocked");

    return {
      reaction_id: `llm_portrait_reaction_${Date.now()}`,
      scene: fallback.scene,
      reaction_text: reactionText,
      emotion: safeText(raw.emotion, fallback.emotion, 24),
      action: enumValue(raw.action, allowedPortraitActions, fallback.action),
      should_speak: typeof raw.should_speak === "boolean" ? raw.should_speak : fallback.should_speak,
      created_at: new Date().toISOString()
    };
  }

  private normalizePortraitResonance(
    raw: PortraitResonanceJson,
    fallback: CharacterResonance,
    activeNodes: PortraitNode[]
  ): CharacterResonance {
    const characterName = safeText(raw.character_name, fallback.character_name || "星图同行者", 18);
    const roleType = safeText(raw.role_type, fallback.role_type || "陪伴 / 观察 / 稳定推进", 32);
    const petExplanation = safeText(raw.pet_explanation, fallback.pet_explanation, 90);
    const resonancePoints = Array.isArray(raw.resonance_points)
      ? raw.resonance_points.map((point) => safeText(point, "", 34)).filter(Boolean).slice(0, 3)
      : [];
    const allText = [characterName, roleType, petExplanation, ...resonancePoints].join("\n");
    if (containsBlockedText(allText) || containsRealPersonalityJudgement(allText) || resonancePoints.length === 0) {
      throw new Error("blocked");
    }

    return {
      ...fallback,
      resonance_id: `llm_resonance_${Date.now()}`,
      status: "ready",
      character_name: characterName,
      role_type: roleType,
      role_asset: roleAssetForKey(raw.role_key, fallback.role_asset),
      resonance_points: resonancePoints,
      pet_explanation: petExplanation,
      source_summary: {
        label: "来自当前游戏画像节点的重新测定",
        source_ids: activeNodes.map((node) => node.node_id).slice(0, 8),
        confidence: "medium",
        privacy_boundary: "summary_only"
      },
      feedback_value: null,
      updated_at: new Date().toISOString()
    };
  }

  private async createVoiceAudio(
    text: string,
    voiceStyle: string,
    shouldSpeak: boolean
  ): Promise<Pick<PetReaction, "voice_audio_url" | "voice_mime_type">> {
    if (!shouldSpeak || !this.canUseTts()) return {};

    if (this.config.ttsProvider === "minimax") {
      return this.createMiniMaxVoiceAudio(text, enumValue(voiceStyle, allowedVoiceStyles, "soft") as VoiceStyle);
    }

    return this.createHttpJsonVoiceAudio(text, voiceStyle);
  }

  private async createHttpJsonVoiceAudio(
    text: string,
    voiceStyle: string
  ): Promise<Pick<PetReaction, "voice_audio_url" | "voice_mime_type">> {
    try {
      const response = await this.fetchImpl(this.config.ttsEndpoint, {
        method: "POST",
        headers: this.authHeaders(this.config.ttsAuthMode, this.config.ttsApiKey),
        body: JSON.stringify({
          text,
          style: enumValue(voiceStyle, allowedVoiceStyles, "soft"),
          voice: this.config.ttsVoice
        })
      });
      if (!response.ok) return {};
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const json = await response.json();
        return normalizeVoiceJson(json);
      }
      const mimeType = contentType.includes("audio/") ? contentType.split(";")[0] : "audio/mpeg";
      const audio = Buffer.from(await response.arrayBuffer()).toString("base64");
      return {
        voice_audio_url: `data:${mimeType};base64,${audio}`,
        voice_mime_type: mimeType as PetReaction["voice_mime_type"]
      };
    } catch {
      return {};
    }
  }

  private async createMiniMaxVoiceAudio(
    text: string,
    voiceStyle: VoiceStyle
  ): Promise<Pick<PetReaction, "voice_audio_url" | "voice_mime_type">> {
    if (!this.config.ttsEndpoint.includes("${") && this.config.ttsEndpoint.startsWith("http")) {
      return this.createMiniMaxHttpVoiceAudio(text, voiceStyle);
    }
    return this.createMiniMaxWebSocketVoiceAudio(text, voiceStyle);
  }

  private async createMiniMaxHttpVoiceAudio(
    text: string,
    voiceStyle: VoiceStyle
  ): Promise<Pick<PetReaction, "voice_audio_url" | "voice_mime_type">> {
    try {
      const audioFormat = this.config.ttsAudioFormat ?? "mp3";
      const outputFormat = this.config.ttsOutputFormat ?? "hex";
      const response = await this.fetchImpl(this.minimaxHttpTtsUrl(), {
        method: "POST",
        headers: this.authHeaders(this.config.ttsAuthMode, this.config.ttsApiKey),
        body: JSON.stringify({
          model: this.config.ttsModel ?? MINIMAX_DEFAULT_TTS_MODEL,
          text,
          stream: false,
          language_boost: "Chinese",
          output_format: outputFormat,
          voice_setting: {
            voice_id: this.config.ttsVoice || MINIMAX_DEFAULT_TTS_VOICE,
            speed: speedForVoiceStyle(voiceStyle),
            vol: 1,
            pitch: pitchForVoiceStyle(voiceStyle)
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: audioFormat,
            channel: 1
          }
        })
      });
      if (!response.ok) return {};
      const json = await response.json();
      return normalizeMiniMaxVoiceJson(json, audioFormat);
    } catch {
      return {};
    }
  }

  private async createMiniMaxWebSocketVoiceAudio(
    text: string,
    voiceStyle: VoiceStyle
  ): Promise<Pick<PetReaction, "voice_audio_url" | "voice_mime_type">> {
    try {
      const WebSocketCtor = (globalThis as { WebSocket?: WebSocketConstructorLike }).WebSocket;
      if (!WebSocketCtor) return {};

      const audioFormat = this.config.ttsAudioFormat ?? "mp3";
      const audioHex = await new Promise<string>((resolve, reject) => {
        let audio = "";
        let settled = false;
        const timeout = setTimeout(() => settle(null), 20000);
        const ws = new WebSocketCtor(this.minimaxWebSocketTtsUrl(), {
          headers: this.authHeaders(this.config.ttsAuthMode, this.config.ttsApiKey)
        });

        const settle = (value: string | null) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          try { ws.close(); } catch {
            // The speech fallback should not leak transport errors to the UI.
          }
          if (value) {
            resolve(value);
          } else {
            reject(new Error("tts_failed"));
          }
        };

        ws.addEventListener("message", (event) => {
          const payload = parseJsonObject(String(event.data ?? "{}")) as Record<string, unknown>;
          const baseResp = payload.base_resp;
          if (typeof baseResp === "object" && baseResp !== null) {
            const statusCode = (baseResp as { status_code?: unknown }).status_code;
            if (typeof statusCode === "number" && statusCode !== 0) {
              settle(null);
              return;
            }
          }

          if (payload.event === "connected_success") {
            ws.send(JSON.stringify({
              event: "task_start",
              model: this.config.ttsModel ?? MINIMAX_DEFAULT_TTS_MODEL,
              voice_setting: {
                voice_id: this.config.ttsVoice || MINIMAX_DEFAULT_TTS_VOICE,
                speed: speedForVoiceStyle(voiceStyle),
                vol: 1,
                pitch: pitchForVoiceStyle(voiceStyle),
                english_normalization: false
              },
              audio_setting: {
                sample_rate: 32000,
                bitrate: 128000,
                format: audioFormat,
                channel: 1
              }
            }));
            return;
          }

          if (payload.event === "task_started") {
            ws.send(JSON.stringify({ event: "task_continue", text }));
            return;
          }

          const data = payload.data;
          if (typeof data === "object" && data !== null) {
            const audioPart = (data as { audio?: unknown }).audio;
            if (typeof audioPart === "string") audio += audioPart;
          }

          if (payload.is_final === true) {
            ws.send(JSON.stringify({ event: "task_finish" }));
            settle(audio || null);
          }
        });
        ws.addEventListener("error", () => settle(null));
        ws.addEventListener("close", () => {
          if (!settled && audio) settle(audio);
        });
      });

      return normalizeMiniMaxVoiceJson({ data: { audio: audioHex }, base_resp: { status_code: 0 } }, audioFormat);
    } catch {
      return {};
    }
  }

  private chatCompletionsUrl(): string {
    if (this.config.chatCompletionsUrl && !this.config.chatCompletionsUrl.includes("${")) {
      return this.config.chatCompletionsUrl;
    }
    return `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  }

  private minimaxHttpTtsUrl(): string {
    if (this.config.ttsEndpoint && !this.config.ttsEndpoint.includes("${")) {
      return this.config.ttsEndpoint;
    }
    return `${this.config.baseUrl.replace(/\/$/, "")}/t2a_v2`;
  }

  private minimaxWebSocketTtsUrl(): string {
    if (this.config.ttsEndpoint && !this.config.ttsEndpoint.includes("${")) {
      return this.config.ttsEndpoint;
    }
    return this.config.baseUrl.includes("api.minimaxi.com") ? MINIMAX_CN_WS_URL : MINIMAX_GLOBAL_WS_URL;
  }

  private canUseModel(model: string): boolean {
    return Boolean(
        this.config.provider === "chat-completions-compatible" &&
        this.hasRequiredAuth(this.config.authMode, this.config.apiKey) &&
        this.config.baseUrl &&
        !this.config.baseUrl.includes("${") &&
        model &&
        !model.includes("${")
    );
  }

  private canUseTts(): boolean {
    if (!this.hasRequiredAuth(this.config.ttsAuthMode, this.config.ttsApiKey)) return false;
    if (this.config.ttsProvider === "minimax") {
      const ttsUrl = this.config.ttsEndpoint && !this.config.ttsEndpoint.includes("${")
        ? this.config.ttsEndpoint
        : this.minimaxWebSocketTtsUrl();
      return Boolean(this.config.baseUrl && !this.config.baseUrl.includes("${") && !ttsUrl.includes("${"));
    }
    return Boolean(
      this.config.ttsProvider === "http-json" &&
        this.config.ttsEndpoint &&
        !this.config.ttsEndpoint.includes("${")
    );
  }

  private hasRequiredAuth(authModeValue: AuthMode, apiKey: string): boolean {
    return authModeValue === "none" || Boolean(apiKey && !apiKey.includes("${"));
  }

  private authHeaders(authModeValue: AuthMode, apiKey: string): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authModeValue === "bearer") {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    return headers;
  }
}

function extractChatContent(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0];
  if (typeof first !== "object" || first === null) return null;
  const message = (first as { message?: unknown }).message;
  if (typeof message !== "object" || message === null) return null;
  const content = (message as { content?: unknown }).content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => typeof part === "object" && part !== null && "text" in part ? (part as { text: unknown }).text : "")
      .filter((part): part is string => typeof part === "string")
      .join("")
      .trim() || null;
  }
  return null;
}

function normalizeVoiceJson(payload: unknown): Pick<PetReaction, "voice_audio_url" | "voice_mime_type"> {
  if (typeof payload !== "object" || payload === null) return {};
  const audioUrl = (payload as { audio_url?: unknown }).audio_url;
  const audioBase64 = (payload as { audio_base64?: unknown }).audio_base64;
  const mimeType = (payload as { mime_type?: unknown }).mime_type;
  const safeMime = typeof mimeType === "string" && mimeType.startsWith("audio/") ? mimeType as VoiceMimeType : "audio/mpeg";

  if (typeof audioUrl === "string" && (audioUrl.startsWith("http") || audioUrl.startsWith("data:audio/"))) {
    return { voice_audio_url: audioUrl, voice_mime_type: safeMime };
  }
  if (typeof audioBase64 === "string") {
    return { voice_audio_url: `data:${safeMime};base64,${audioBase64}`, voice_mime_type: safeMime };
  }
  return {};
}

function normalizeMiniMaxVoiceJson(payload: unknown, audioFormat: TtsAudioFormat): Pick<PetReaction, "voice_audio_url" | "voice_mime_type"> {
  if (typeof payload !== "object" || payload === null) return {};
  const baseResp = (payload as { base_resp?: unknown }).base_resp;
  if (typeof baseResp === "object" && baseResp !== null) {
    const statusCode = (baseResp as { status_code?: unknown }).status_code;
    if (typeof statusCode === "number" && statusCode !== 0) return {};
  }

  const data = (payload as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return normalizeVoiceJson(payload);

  const audio = (data as { audio?: unknown }).audio;
  if (typeof audio !== "string" || audio.length === 0) return {};

  const mimeType = mimeForAudioFormat(audioFormat);
  if (audio.startsWith("http") || audio.startsWith("data:audio/")) {
    return { voice_audio_url: audio, voice_mime_type: mimeType };
  }

  const audioBase64 = isHexPayload(audio)
    ? Buffer.from(audio, "hex").toString("base64")
    : audio;

  return {
    voice_audio_url: `data:${mimeType};base64,${audioBase64}`,
    voice_mime_type: mimeType
  };
}

function isHexPayload(value: string): boolean {
  return value.length % 2 === 0 && /^[0-9a-f]+$/i.test(value);
}

function mimeForAudioFormat(format: TtsAudioFormat): VoiceMimeType {
  if (format === "wav") return "audio/wav";
  if (format === "flac") return "audio/flac";
  return "audio/mpeg";
}

function speedForVoiceStyle(style: VoiceStyle): number {
  if (style === "happy") return 1.05;
  if (style === "shy" || style === "apologetic") return 0.92;
  return 1;
}

function pitchForVoiceStyle(style: VoiceStyle): number {
  if (style === "happy") return 1;
  if (style === "shy") return -1;
  return 0;
}

function parseJsonObject(outputText: string): unknown {
  const trimmed = stripReasoningText(outputText).trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }

    const candidates = jsonObjectCandidates(trimmed);
    for (let index = candidates.length - 1; index >= 0; index -= 1) {
      try {
        return JSON.parse(candidates[index]);
      } catch {
        // Keep looking for the final valid JSON object; reasoning models may echo schemas first.
      }
    }
    throw new Error("invalid_json");
  }
}

function stripReasoningText(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/gi, "")
    .trim();
}

function jsonObjectCandidates(text: string): string[] {
  const candidates: string[] = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        candidates.push(text.slice(start, index + 1));
        start = -1;
      }
      if (depth < 0) {
        depth = 0;
        start = -1;
      }
    }
  }

  return candidates;
}

function enumValue<T extends readonly string[]>(value: unknown, allowed: T, fallback: T[number]): T[number] {
  return isEnum(value, allowed) ? value : fallback;
}

function isEnum<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function safeText(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLength);
}

function containsBlockedText(text: string): boolean {
  return /api[_ -]?key|token|模型|接口|风控|隐私命中|窗口标题|文档名|聊天正文|内部错误|error code/i.test(text);
}

function containsRealPersonalityJudgement(text: string): boolean {
  return /人格障碍|心理诊断|抑郁|焦虑症|政治倾向|宗教信仰|现实人格|真实人格/i.test(text);
}

function roleAssetForKey(value: unknown, fallback: string): string {
  const roleKey = enumValue(value, allowedPortraitRoleKeys, "quiet_star");
  if (roleKey === "warm_mage") return portraitAssets.resonanceSweetMage;
  if (roleKey === "brave_guardian") return portraitAssets.resonanceBraveFighter;
  if (roleKey === "tiny_inventor") return portraitAssets.resonanceTinyInventor;
  return fallback || portraitAssets.resonanceSilhouette;
}

function buildPortraitReactionPrompt(characterConfig: CharacterConfig, context: Record<string, unknown>): string {
  return JSON.stringify({
    task: "为用户画像页生成桌宠短反应。只谈当前游戏内画像、节点反馈、编辑、收起、更多发现或角色共鸣；不要提模型、接口、置信度、来源原文或隐私命中。",
    character_config: publicCharacterConfig(characterConfig),
    context: sanitizePromptContext(context),
    constraints: [
      "中文，1 句话，最多 36 个汉字",
      "像桌宠陪伴，不像后台系统提示",
      "用户 unlike / 不准时要温和接受，不要争辩",
      "不要复刻任何官方角色台词",
      "不要输出现实人格、心理诊断、政治、宗教、健康推断"
    ]
  }, null, 2);
}

function buildPortraitResonancePrompt(characterConfig: CharacterConfig, activeNodes: PortraitNode[]): string {
  return JSON.stringify({
    task: "根据当前游戏画像节点生成一个游戏化角色共鸣结果。结果是趣味共鸣，不是现实人格判断。",
    character_config: publicCharacterConfig(characterConfig),
    portrait_nodes: activeNodes
      .filter((node) => node.is_active && node.status !== "required_empty")
      .map((node) => ({
        category: node.category,
        display_name: node.display_name,
        value: node.value,
        status: node.status
      }))
      .slice(0, 12),
    role_key_options: allowedPortraitRoleKeys,
    constraints: [
      "character_name 必须是原创称号，不要使用真实游戏官方角色名",
      "role_type 只描述游戏内陪伴/玩法风格",
      "resonance_points 给 2-3 条，每条最多 24 个汉字",
      "pet_explanation 用桌宠视角解释，最多 60 个汉字",
      "不要输出百分比、置信度、后端字段、来源 ID、模型信息",
      "不要输出现实人格、心理诊断、政治、宗教、健康推断"
    ]
  }, null, 2);
}

function publicCharacterConfig(characterConfig: CharacterConfig) {
  return {
    characterName: safeText(characterConfig.characterName, "桌宠", 24),
    selfReference: safeText(characterConfig.selfReference, "小伙伴", 24),
    userAddressing: safeText(characterConfig.userAddressing, "主人", 24),
    tone: safeText(characterConfig.tone, "温柔、轻快", 80),
    personaVersion: safeText(characterConfig.personaVersion, "demo", 40)
  };
}

function sanitizePromptContext(context: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(context)
      .filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null)
      .map(([key, value]) => [safeText(key, "context", 40), typeof value === "string" ? safeText(value, "", 140) : value])
      .slice(0, 16)
  );
}

function defaultConfig(): ConfigurableDiaryProviderConfig {
  const useMiniMaxPreset = process.env.DIARY_LLM_PRESET === "minimax" || Boolean(process.env.MINIMAX_API_KEY);
  const miniMaxApiKey = process.env.DIARY_LLM_API_KEY ?? process.env.MINIMAX_API_KEY ?? "";
  return {
    provider: providerKind(process.env.DIARY_LLM_PROVIDER, useMiniMaxPreset),
    authMode: authMode(process.env.DIARY_LLM_AUTH_MODE),
    apiKey: miniMaxApiKey || (useMiniMaxPreset ? MINIMAX_API_KEY_PLACEHOLDER : DIARY_LLM_API_KEY_PLACEHOLDER),
    baseUrl: process.env.DIARY_LLM_BASE_URL ?? (useMiniMaxPreset ? miniMaxBaseUrl(miniMaxApiKey) : DIARY_LLM_BASE_URL_PLACEHOLDER),
    chatCompletionsUrl: process.env.DIARY_LLM_CHAT_COMPLETIONS_URL,
    diaryModel: process.env.DIARY_LLM_MODEL ?? (useMiniMaxPreset ? MINIMAX_DEFAULT_MODEL : DIARY_LLM_MODEL_PLACEHOLDER),
    reactionModel: process.env.DIARY_REACTION_MODEL ?? (useMiniMaxPreset ? MINIMAX_DEFAULT_MODEL : DIARY_REACTION_MODEL_PLACEHOLDER),
    responseFormat: responseFormatMode(process.env.DIARY_LLM_RESPONSE_FORMAT, useMiniMaxPreset),
    ttsProvider: ttsProviderKind(process.env.DIARY_TTS_PROVIDER, useMiniMaxPreset),
    ttsAuthMode: authMode(process.env.DIARY_TTS_AUTH_MODE),
    ttsEndpoint: process.env.DIARY_TTS_ENDPOINT ?? DIARY_TTS_ENDPOINT_PLACEHOLDER,
    ttsApiKey: process.env.DIARY_TTS_API_KEY ?? process.env.DIARY_LLM_API_KEY ?? process.env.MINIMAX_API_KEY ?? (useMiniMaxPreset ? MINIMAX_API_KEY_PLACEHOLDER : DIARY_LLM_API_KEY_PLACEHOLDER),
    ttsVoice: process.env.DIARY_TTS_VOICE ?? (useMiniMaxPreset ? MINIMAX_DEFAULT_TTS_VOICE : "default"),
    ttsModel: process.env.DIARY_TTS_MODEL ?? (useMiniMaxPreset ? MINIMAX_DEFAULT_TTS_MODEL : DIARY_TTS_MODEL_PLACEHOLDER),
    ttsAudioFormat: ttsAudioFormat(process.env.DIARY_TTS_AUDIO_FORMAT),
    ttsOutputFormat: ttsOutputFormat(process.env.DIARY_TTS_OUTPUT_FORMAT)
  };
}

function miniMaxBaseUrl(apiKey: string): string {
  return apiKey.startsWith("sk-cp-") ? MINIMAX_CN_BASE_URL : MINIMAX_GLOBAL_BASE_URL;
}

function providerKind(value: string | undefined, useMiniMaxPreset = false): LLMProviderKind {
  if (value === "chat-completions-compatible") return "chat-completions-compatible";
  if (value === "mock") return "mock";
  if (useMiniMaxPreset) return "chat-completions-compatible";
  return "mock";
}

function authMode(value: string | undefined): AuthMode {
  return value === "none" ? "none" : "bearer";
}

function responseFormatMode(value: string | undefined, useMiniMaxPreset = false): ResponseFormatMode {
  if (value === "none" || value === "json_schema" || value === "json_object") return value;
  if (useMiniMaxPreset) return "none";
  return "json_object";
}

function ttsProviderKind(value: string | undefined, useMiniMaxPreset = false): TtsProviderKind {
  if (value === "minimax") return "minimax";
  if (value === "http-json") return "http-json";
  if (useMiniMaxPreset) return "minimax";
  return "none";
}

function ttsAudioFormat(value: string | undefined): TtsAudioFormat {
  return isEnum(value, allowedTtsAudioFormats) ? value : "mp3";
}

function ttsOutputFormat(value: string | undefined): TtsOutputFormat {
  return value === "url" ? "url" : "hex";
}

function stringEnumSchema(values: readonly string[]) {
  return { type: "string", enum: values };
}

function baseObjectSchema(properties: Record<string, unknown>, required: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    properties,
    required
  };
}

function diaryDraftSchema(sourceIds: string[]) {
  return baseObjectSchema({
    title: { type: "string", minLength: 1, maxLength: 28 },
    body: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: { type: "string", minLength: 1, maxLength: 80 }
    },
    content_angle: stringEnumSchema(allowedAngles),
    source_ids: {
      type: "array",
      maxItems: 8,
      items: sourceIds.length > 0 ? { type: "string", enum: sourceIds } : { type: "string" }
    },
    emotion: stringEnumSchema(allowedEmotions)
  }, ["title", "body", "content_angle", "source_ids", "emotion"]);
}

const qualityCheckSchema = baseObjectSchema({
  quality_result: { type: "string", enum: ["pass", "fail"] },
  quality_failure_reasons: {
    type: "array",
    maxItems: 5,
    items: stringEnumSchema(allowedQualityReasons)
  },
  rewrite_allowed: { type: "boolean", const: false },
  risk_flags: {
    type: "array",
    maxItems: 8,
    items: { type: "string", maxLength: 32 }
  }
}, ["quality_result", "quality_failure_reasons", "rewrite_allowed", "risk_flags"]);

const petReactionSchema = baseObjectSchema({
  reaction_text: { type: "string", minLength: 1, maxLength: 48 },
  emotion: stringEnumSchema(allowedEmotions),
  action: stringEnumSchema(allowedActions),
  should_speak: { type: "boolean" },
  voice_style: stringEnumSchema(allowedVoiceStyles),
  memory_write_hint: stringEnumSchema(allowedMemoryHints)
}, ["reaction_text", "emotion", "action", "should_speak", "voice_style", "memory_write_hint"]);

const portraitPetReactionSchema = baseObjectSchema({
  reaction_text: { type: "string", minLength: 1, maxLength: 54 },
  emotion: stringEnumSchema(allowedEmotions),
  action: stringEnumSchema(allowedPortraitActions),
  should_speak: { type: "boolean" }
}, ["reaction_text", "emotion", "action", "should_speak"]);

const portraitCharacterResonanceSchema = baseObjectSchema({
  character_name: { type: "string", minLength: 1, maxLength: 18 },
  role_type: { type: "string", minLength: 1, maxLength: 32 },
  role_key: stringEnumSchema(allowedPortraitRoleKeys),
  resonance_points: {
    type: "array",
    minItems: 2,
    maxItems: 3,
    items: { type: "string", minLength: 1, maxLength: 34 }
  },
  pet_explanation: { type: "string", minLength: 1, maxLength: 90 }
}, ["character_name", "role_type", "role_key", "resonance_points", "pet_explanation"]);
