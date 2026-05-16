import type { DiaryService } from "../../src/diary/api/DiaryService";
import type {
  CheckDiaryQualityInput,
  DiaryStateUpdate,
  GenerateDiaryInput,
  PetReactionInput,
  SynthesizeSpeechInput
} from "../../src/diary/types";

export const diaryApiRoutes = {
  mailbox: "GET /api/diary/mailbox?page=1&page_size=10",
  detail: "GET /api/diary/:diary_id",
  state: "PATCH /api/diary/:diary_id/state",
  reply: "POST /api/diary/:diary_id/reply",
  feedback: "POST /api/diary/:diary_id/feedback",
  softDelete: "DELETE /api/diary/:diary_id",
  reaction: "POST /api/diary/reactions",
  tts: "POST /api/diary/tts",
  generate: "POST /api/diary/generate",
  qualityCheck: "POST /api/diary/quality-check"
} as const;

export function createDiaryApiHandlers(service: DiaryService) {
  return {
    getMailbox: (query: { user_id: string; game_context_id: string; page?: number; page_size?: number }) => {
      return service.getMailbox({
        user_id: query.user_id,
        game_context_id: query.game_context_id,
        page: query.page ?? 1,
        page_size: query.page_size ?? 10
      });
    },
    getDiaryDetail: (params: { diary_id: string; user_id: string }) => {
      return service.getDiaryDetail(params.diary_id, params.user_id);
    },
    updateDiaryState: (params: { diary_id: string; user_id: string; updates: DiaryStateUpdate }) => {
      return service.updateDiaryState(params.diary_id, params.user_id, params.updates);
    },
    submitDiaryReply: (params: { diary_id: string; user_id: string; reply_text: string }) => {
      return service.submitDiaryReply(params.diary_id, params.user_id, params.reply_text);
    },
    submitDiaryFeedback: (params: {
      target_id: string;
      value: 0 | 1;
      reason: Parameters<DiaryService["submitDiaryFeedback"]>[2];
      source: Parameters<DiaryService["submitDiaryFeedback"]>[3];
    }) => {
      return service.submitDiaryFeedback(params.target_id, params.value, params.reason, params.source);
    },
    softDeleteDiary: (params: { diary_id: string; user_id: string }) => {
      return service.softDeleteDiary(params.diary_id, params.user_id);
    },
    generatePetReaction: (input: PetReactionInput) => {
      return service.generatePetReaction(input);
    },
    synthesizeSpeech: (input: SynthesizeSpeechInput) => {
      return service.synthesizeSpeech(input);
    },
    generateDiary: (input: GenerateDiaryInput) => {
      return service.generateDiary(input);
    },
    checkDiaryQuality: (input: CheckDiaryQualityInput) => {
      return service.checkDiaryQuality(input);
    }
  };
}
