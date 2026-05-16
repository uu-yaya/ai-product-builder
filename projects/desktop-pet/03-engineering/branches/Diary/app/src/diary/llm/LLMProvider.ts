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

export interface LLMProvider {
  generateDiaryDraft(input: GenerateDiaryInput): Promise<DiaryDraft>;
  checkDiaryQuality(input: CheckDiaryQualityInput): Promise<CheckDiaryQualityResponse>;
  generatePetReaction(input: PetReactionInput): Promise<PetReaction>;
  synthesizeSpeech(input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse>;
}

export class LLMProviderError extends Error {
  constructor(message: string, public readonly safeFallbackReason: "provider_unavailable" | "invalid_json" | "timeout" | "blocked") {
    super(message);
    this.name = "LLMProviderError";
  }
}
