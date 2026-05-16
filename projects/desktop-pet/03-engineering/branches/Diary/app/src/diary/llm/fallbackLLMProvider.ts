import { renderCharacterTemplate } from "../characterConfig";
import type {
  CheckDiaryQualityInput,
  CheckDiaryQualityResponse,
  DiaryDraft,
  GenerateDiaryInput,
  PetReaction,
  PetReactionInput,
  SynthesizeSpeechInput,
  SynthesizeSpeechResponse
} from "../types";
import type { LLMProvider } from "./LLMProvider";

function nowIso(): string {
  return new Date().toISOString();
}

export class FallbackLLMProvider implements LLMProvider {
  async generateDiaryDraft(input: GenerateDiaryInput): Promise<DiaryDraft> {
    const sourceIds = input.source_candidates
      .filter((source) => input.consent_snapshot[source.source_type])
      .map((source) => source.source_id);

    return {
      title: "折好的新信",
      body: [
        "{{userAddressing}}，这一段时间里，有一件小事被{{selfReference}}折进了信纸。",
        "{{selfReference}}只用那些被允许的小摘要，不把不该看的东西写进来。",
        "如果这封信写得不够准，就轻轻告诉{{selfReference}}。下次会写得更稳一点。"
      ],
      content_angle: sourceIds.length > 0 ? "game_companion" : "solo_theater",
      source_ids: sourceIds,
      emotion: sourceIds.length > 0 ? "gentle" : "quiet"
    };
  }

  async checkDiaryQuality(input: CheckDiaryQualityInput): Promise<CheckDiaryQualityResponse> {
    const text = [input.diary_draft.title, ...input.diary_draft.body].join("\n");
    const riskFlags: string[] = [];
    if (/token|api[_-]?key|窗口标题|文档名|聊天正文|模型错误|风控原因/i.test(text)) riskFlags.push("privacy");
    if (/击杀|死亡|分数|KDA|战报/.test(text)) riskFlags.push("persona");
    if (input.diary_draft.body.length === 0) riskFlags.push("format");

    return {
      quality_result: riskFlags.length === 0 ? "pass" : "fail",
      quality_failure_reasons: riskFlags as CheckDiaryQualityResponse["quality_failure_reasons"],
      rewrite_allowed: false,
      risk_flags: riskFlags
    };
  }

  async generatePetReaction(input: PetReactionInput): Promise<PetReaction> {
    const fallbackText = input.scene === "generation_failed"
      ? "信纸好像被{{selfReference}}收得太深了，晚点再整理。"
      : "{{selfReference}}收到啦，会轻轻记好。";

    return {
      reaction_id: `fallback_reaction_${Date.now()}`,
      diary_id: input.diary_id ?? null,
      reply_id: input.reply_id ?? null,
      scene: input.scene,
      reaction_text: renderCharacterTemplate(fallbackText, input.character_config),
      emotion: input.scene === "generation_failed" ? "sorry" : "gentle",
      action: input.scene === "generation_failed" ? "sorry_bow" : "nod",
      should_speak: true,
      memory_write_hint: "none",
      created_at: nowIso()
    };
  }

  async synthesizeSpeech(_input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse> {
    return { provider: "browser_fallback" };
  }
}
