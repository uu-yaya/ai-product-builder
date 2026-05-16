import { describe, expect, it } from "vitest";
import { ConfigurableDiaryProvider } from "../../../server/llm/configurableDiaryProvider";
import { demoCharacterConfig } from "../characterConfig";

describe("ConfigurableDiaryProvider", () => {
  it("falls back without configured env credentials", async () => {
    const provider = new ConfigurableDiaryProvider({
      provider: "mock",
      authMode: "bearer",
      apiKey: "${DIARY_LLM_API_KEY}",
      baseUrl: "${DIARY_LLM_BASE_URL}",
      diaryModel: "${DIARY_LLM_MODEL}",
      reactionModel: "${DIARY_REACTION_MODEL}",
      responseFormat: "json_object",
      ttsProvider: "none",
      ttsAuthMode: "bearer",
      ttsEndpoint: "${DIARY_TTS_ENDPOINT}",
      ttsApiKey: "${DIARY_TTS_API_KEY}",
      ttsVoice: "${DIARY_TTS_VOICE}",
    });

    const reaction = await provider.generatePetReaction({
      scene: "diary_reply",
      diary_id: "diary_1",
      reply_id: "reply_1",
      character_config: demoCharacterConfig,
      context: { reply_intent: "positive", diary_title: "昨天的小小胜利" }
    });

    expect(reaction.reaction_text).not.toMatch(/模型|接口|风控|隐私命中/);
    expect(reaction.action).toBe("nod");
  });

  it("maps structured chat-completions JSON into a pet reaction plan", async () => {
    const fetchImpl = async () => new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            reaction_text: "主人喜欢就好，小绒转一圈。",
            emotion: "excited",
            action: "happy_bounce",
            should_speak: true,
            voice_style: "happy",
            memory_write_hint: "positive_feedback"
          })
        }
      }]
    }), { status: 200 });

    const provider = new ConfigurableDiaryProvider({
      provider: "chat-completions-compatible",
      authMode: "bearer",
      apiKey: "test-key",
      baseUrl: "https://example.test/v1",
      diaryModel: "test-diary-model",
      reactionModel: "test-reaction-model",
      responseFormat: "json_object",
      ttsProvider: "none",
      ttsAuthMode: "bearer",
      ttsEndpoint: "${DIARY_TTS_ENDPOINT}",
      ttsApiKey: "${DIARY_TTS_API_KEY}",
      ttsVoice: "${DIARY_TTS_VOICE}",
    }, fetchImpl);

    const reaction = await provider.generatePetReaction({
      scene: "diary_reply",
      diary_id: "diary_1",
      reply_id: "reply_1",
      character_config: demoCharacterConfig,
      context: { reply_intent: "positive", diary_title: "昨天的小小胜利" }
    });

    expect(reaction.reaction_text).toBe("主人喜欢就好，小绒转一圈。");
    expect(reaction.emotion).toBe("excited");
    expect(reaction.action).toBe("happy_bounce");
    expect(reaction.should_speak).toBe(true);
    expect(reaction.voice_audio_url).toBeUndefined();
  });

  it("supports keyless local chat-completions adapters", async () => {
    let authorizationHeader: string | null = "not-called";
    const fetchImpl = async (_url: RequestInfo | URL, init?: RequestInit) => {
      authorizationHeader = new Headers(init?.headers).get("authorization");
      return new Response(JSON.stringify({
        choices: [{
          message: {
            content: JSON.stringify({
              reaction_text: "收到啦，小绒点点头。",
              emotion: "gentle",
              action: "nod",
              should_speak: false,
              voice_style: "soft",
              memory_write_hint: "none"
            })
          }
        }]
      }), { status: 200 });
    };

    const provider = new ConfigurableDiaryProvider({
      provider: "chat-completions-compatible",
      authMode: "none",
      apiKey: "${DIARY_LLM_API_KEY}",
      baseUrl: "http://127.0.0.1:11434/v1",
      diaryModel: "local-diary-model",
      reactionModel: "local-reaction-model",
      responseFormat: "json_object",
      ttsProvider: "none",
      ttsAuthMode: "none",
      ttsEndpoint: "${DIARY_TTS_ENDPOINT}",
      ttsApiKey: "${DIARY_TTS_API_KEY}",
      ttsVoice: "${DIARY_TTS_VOICE}",
    }, fetchImpl);

    const reaction = await provider.generatePetReaction({
      scene: "diary_reply",
      diary_id: "diary_1",
      reply_id: "reply_1",
      character_config: demoCharacterConfig,
      context: { reply_intent: "positive", diary_title: "昨天的小小胜利" }
    });

    expect(authorizationHeader).toBeNull();
    expect(reaction.action).toBe("nod");
  });

  it("parses fenced JSON from vendors without response_format support", async () => {
    const fetchImpl = async () => new Response(JSON.stringify({
      choices: [{
        message: {
          content: "```json\n{\"reaction_text\":\"小绒听见啦，会挥挥爪。\",\"emotion\":\"playful\",\"action\":\"wave\",\"should_speak\":true,\"voice_style\":\"happy\",\"memory_write_hint\":\"none\"}\n```"
        }
      }]
    }), { status: 200 });

    const provider = new ConfigurableDiaryProvider({
      provider: "chat-completions-compatible",
      authMode: "bearer",
      apiKey: "test-key",
      baseUrl: "https://api.minimax.io/v1",
      diaryModel: "MiniMax-M2.7",
      reactionModel: "MiniMax-M2.7",
      responseFormat: "none",
      ttsProvider: "none",
      ttsAuthMode: "bearer",
      ttsEndpoint: "${DIARY_TTS_ENDPOINT}",
      ttsApiKey: "${DIARY_TTS_API_KEY}",
      ttsVoice: "${DIARY_TTS_VOICE}",
    }, fetchImpl);

    const reaction = await provider.generatePetReaction({
      scene: "diary_reply",
      diary_id: "diary_1",
      reply_id: "reply_1",
      character_config: demoCharacterConfig,
      context: { reply_intent: "casual", diary_title: "昨天的小小胜利" }
    });

    expect(reaction.emotion).toBe("playful");
    expect(reaction.action).toBe("wave");
  });

  it("uses the one-env MiniMax preset when MINIMAX_API_KEY is present", async () => {
    const previousEnv = {
      MINIMAX_API_KEY: process.env.MINIMAX_API_KEY,
      DIARY_LLM_PROVIDER: process.env.DIARY_LLM_PROVIDER,
      DIARY_LLM_BASE_URL: process.env.DIARY_LLM_BASE_URL,
      DIARY_LLM_MODEL: process.env.DIARY_LLM_MODEL,
      DIARY_REACTION_MODEL: process.env.DIARY_REACTION_MODEL,
      DIARY_LLM_RESPONSE_FORMAT: process.env.DIARY_LLM_RESPONSE_FORMAT,
      DIARY_TTS_PROVIDER: process.env.DIARY_TTS_PROVIDER,
      DIARY_TTS_ENDPOINT: process.env.DIARY_TTS_ENDPOINT,
      DIARY_TTS_MODEL: process.env.DIARY_TTS_MODEL,
      DIARY_TTS_VOICE: process.env.DIARY_TTS_VOICE
    };
    const requestUrls: string[] = [];
    const authorizationHeaders: Array<string | null> = [];
    const requestBodies: Array<Record<string, unknown>> = [];

    try {
      process.env.MINIMAX_API_KEY = "sk-cp-minimax-test-key";
      delete process.env.DIARY_LLM_PROVIDER;
      delete process.env.DIARY_LLM_BASE_URL;
      delete process.env.DIARY_LLM_MODEL;
      delete process.env.DIARY_REACTION_MODEL;
      delete process.env.DIARY_LLM_RESPONSE_FORMAT;
      process.env.DIARY_TTS_PROVIDER = "none";
      delete process.env.DIARY_TTS_ENDPOINT;
      delete process.env.DIARY_TTS_MODEL;
      delete process.env.DIARY_TTS_VOICE;

      const fetchImpl = async (url: RequestInfo | URL, init?: RequestInit) => {
        requestUrls.push(String(url));
        authorizationHeaders.push(new Headers(init?.headers).get("authorization"));
        requestBodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
        return new Response(JSON.stringify({
          choices: [{
            message: {
              content: "{\"reaction_text\":\"小绒收到啦。\",\"emotion\":\"gentle\",\"action\":\"nod\",\"should_speak\":true,\"voice_style\":\"soft\",\"memory_write_hint\":\"none\"}"
            }
          }]
        }), { status: 200 });
      };

      const provider = new ConfigurableDiaryProvider(undefined, fetchImpl);
      const reaction = await provider.generatePetReaction({
        scene: "diary_reply",
        diary_id: "diary_1",
        reply_id: "reply_1",
        character_config: demoCharacterConfig,
        context: { reply_intent: "casual", diary_title: "昨天的小小胜利" }
      });

      expect(requestUrls).toEqual([
        "https://api.minimaxi.com/v1/chat/completions"
      ]);
      expect(authorizationHeaders).toEqual(["Bearer sk-cp-minimax-test-key"]);
      expect(requestBodies[0].model).toBe("MiniMax-M2.7");
      expect(requestBodies[0].response_format).toBeUndefined();
      expect(reaction.voice_audio_url).toBeUndefined();
    } finally {
      restoreEnv(previousEnv);
    }
  });

  it("exposes MiniMax TTS through the provider speech adapter", async () => {
    let requestUrl = "";
    let requestBody: Record<string, unknown> = {};
    const fetchImpl = async (url: RequestInfo | URL, init?: RequestInit) => {
      requestUrl = String(url);
      requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response(JSON.stringify({
        data: { audio: "fffbee" },
        base_resp: { status_code: 0, status_msg: "" }
      }), { status: 200 });
    };

    const provider = new ConfigurableDiaryProvider({
      provider: "mock",
      authMode: "bearer",
      apiKey: "${DIARY_LLM_API_KEY}",
      baseUrl: "https://api.minimax.io/v1",
      diaryModel: "${DIARY_LLM_MODEL}",
      reactionModel: "${DIARY_REACTION_MODEL}",
      responseFormat: "none",
      ttsProvider: "minimax",
      ttsAuthMode: "bearer",
      ttsEndpoint: "https://api.minimax.io/v1/t2a_v2",
      ttsApiKey: "test-minimax-key",
      ttsVoice: "Chinese (Mandarin)_Cute_Spirit",
      ttsModel: "speech-2.8-hd",
      ttsAudioFormat: "mp3",
      ttsOutputFormat: "hex"
    }, fetchImpl);

    const voice = await provider.synthesizeSpeech({
      text: "小绒期待你的回信哦。",
      voice_style: "happy",
      scene: "desktop_entry"
    });

    expect(requestUrl).toBe("https://api.minimax.io/v1/t2a_v2");
    expect(requestBody.text).toBe("小绒期待你的回信哦。");
    expect(requestBody.model).toBe("speech-2.8-hd");
    expect(requestBody.voice_setting).toMatchObject({ voice_id: "Chinese (Mandarin)_Cute_Spirit", speed: 1.05 });
    expect(requestBody.audio_setting).toMatchObject({ format: "mp3", sample_rate: 32000 });
    expect(voice.provider).toBe("minimax");
    expect(voice.voice_audio_url).toMatch(/^data:audio\/mpeg;base64,/);
  });
});

function restoreEnv(values: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}
