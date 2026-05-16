import type {
  ChatBubbleDeleteResponse,
  ChatBubbleFeedbackResponse,
  ChatBubbleKind,
  CharacterConfig,
  CheckDiaryQualityInput,
  CheckDiaryQualityResponse,
  DiaryDetail,
  DiaryStateUpdate,
  DiaryStateUpdateResponse,
  FeedbackReason,
  GenerateDiaryInput,
  GenerateDiaryResponse,
  MailboxResponse,
  PetReaction,
  PetReactionInput,
  SoftDeleteResponse,
  SynthesizeSpeechInput,
  SynthesizeSpeechResponse,
  SubmitFeedbackResponse,
  SubmitReplyResponse
} from "../types";

export interface GetMailboxParams {
  user_id: string;
  game_context_id: string;
  page: number;
  page_size: number;
}

export interface DiaryService {
  getCharacterConfig(): Promise<CharacterConfig>;
  getMailbox(params: GetMailboxParams): Promise<MailboxResponse>;
  getDiaryDetail(diaryId: string, userId: string): Promise<DiaryDetail>;
  updateDiaryState(diaryId: string, userId: string, updates: DiaryStateUpdate): Promise<DiaryStateUpdateResponse>;
  submitDiaryReply(diaryId: string, userId: string, replyText: string): Promise<SubmitReplyResponse>;
  submitDiaryFeedback(
    targetId: string,
    value: 0 | 1,
    reason: FeedbackReason | null,
    source: "button" | "reply" | "conversation"
  ): Promise<SubmitFeedbackResponse>;
  submitChatBubbleFeedback(targetType: ChatBubbleKind, targetId: string, value: 0 | 1): Promise<ChatBubbleFeedbackResponse>;
  deleteChatBubble(targetType: ChatBubbleKind, targetId: string): Promise<ChatBubbleDeleteResponse>;
  softDeleteDiary(diaryId: string, userId: string): Promise<SoftDeleteResponse>;
  generatePetReaction(input: PetReactionInput): Promise<PetReaction>;
  synthesizeSpeech(input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse>;
  generateDiary(input: GenerateDiaryInput): Promise<GenerateDiaryResponse>;
  checkDiaryQuality(input: CheckDiaryQualityInput): Promise<CheckDiaryQualityResponse>;
}

export class DiaryServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "not_found" | "network_failed" | "invalid_request" | "quality_blocked" | "unknown"
  ) {
    super(message);
    this.name = "DiaryServiceError";
  }
}
