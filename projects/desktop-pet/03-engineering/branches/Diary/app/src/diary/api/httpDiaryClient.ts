import type {
  ChatBubbleDeleteResponse,
  ChatBubbleFeedbackResponse,
  ChatBubbleKind,
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
import { sanitizeAvailableActions } from "./sanitize";
import type { DiaryService, GetMailboxParams } from "./DiaryService";
import { DiaryServiceError } from "./DiaryService";

export class HttpDiaryClient implements DiaryService {
  constructor(private readonly baseUrl = "/api/diary") {}

  async getCharacterConfig() {
    const mailbox = await this.getMailbox({ user_id: "user_demo", game_context_id: "game_ctx_demo", page: 1, page_size: 1 });
    return mailbox.character_config;
  }

  async getMailbox(params: GetMailboxParams): Promise<MailboxResponse> {
    const query = new URLSearchParams({
      user_id: params.user_id,
      game_context_id: params.game_context_id,
      page: String(params.page),
      page_size: String(params.page_size)
    });
    return this.request<MailboxResponse>(`${this.baseUrl}/mailbox?${query}`);
  }

  async getDiaryDetail(diaryId: string, userId: string): Promise<DiaryDetail> {
    const detail = await this.request<DiaryDetail>(`${this.baseUrl}/${encodeURIComponent(diaryId)}?user_id=${encodeURIComponent(userId)}`);
    return { ...detail, available_actions: sanitizeAvailableActions(detail.available_actions) };
  }

  async updateDiaryState(diaryId: string, userId: string, updates: DiaryStateUpdate): Promise<DiaryStateUpdateResponse> {
    return this.request(`${this.baseUrl}/${encodeURIComponent(diaryId)}/state`, {
      method: "PATCH",
      body: JSON.stringify({ user_id: userId, updates })
    });
  }

  async submitDiaryReply(diaryId: string, userId: string, replyText: string): Promise<SubmitReplyResponse> {
    return this.request(`${this.baseUrl}/${encodeURIComponent(diaryId)}/reply`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, reply_text: replyText, created_at: new Date().toISOString() })
    });
  }

  async submitDiaryFeedback(
    targetId: string,
    value: 0 | 1,
    reason: FeedbackReason | null,
    source: "button" | "reply" | "conversation"
  ): Promise<SubmitFeedbackResponse> {
    return this.request(`${this.baseUrl}/${encodeURIComponent(targetId)}/feedback`, {
      method: "POST",
      body: JSON.stringify({ target_type: "diary_entry", target_id: targetId, value, source, reason, at: new Date().toISOString() })
    });
  }

  async submitChatBubbleFeedback(targetType: ChatBubbleKind, targetId: string, value: 0 | 1): Promise<ChatBubbleFeedbackResponse> {
    return this.request(`${this.baseUrl}/chat-bubbles/${encodeURIComponent(targetType)}/${encodeURIComponent(targetId)}/feedback`, {
      method: "POST",
      body: JSON.stringify({ target_type: targetType, target_id: targetId, value, source: "bubble_action", at: new Date().toISOString() })
    });
  }

  async deleteChatBubble(targetType: ChatBubbleKind, targetId: string): Promise<ChatBubbleDeleteResponse> {
    return this.request(`${this.baseUrl}/chat-bubbles/${encodeURIComponent(targetType)}/${encodeURIComponent(targetId)}`, {
      method: "DELETE",
      body: JSON.stringify({ target_type: targetType, target_id: targetId, hidden_at: new Date().toISOString() })
    });
  }

  async softDeleteDiary(diaryId: string, userId: string): Promise<SoftDeleteResponse> {
    return this.request(`${this.baseUrl}/${encodeURIComponent(diaryId)}`, {
      method: "DELETE",
      body: JSON.stringify({
        user_id: userId,
        inactive_reason: "user_deleted",
        inactive_at: new Date().toISOString()
      })
    });
  }

  async generatePetReaction(input: PetReactionInput): Promise<PetReaction> {
    return this.request(`${this.baseUrl}/reactions`, { method: "POST", body: JSON.stringify(input) });
  }

  async synthesizeSpeech(input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse> {
    return this.request(`${this.baseUrl}/tts`, { method: "POST", body: JSON.stringify(input) });
  }

  async generateDiary(input: GenerateDiaryInput): Promise<GenerateDiaryResponse> {
    return this.request(`${this.baseUrl}/generate`, { method: "POST", body: JSON.stringify(input) });
  }

  async checkDiaryQuality(input: CheckDiaryQualityInput): Promise<CheckDiaryQualityResponse> {
    return this.request(`${this.baseUrl}/quality-check`, { method: "POST", body: JSON.stringify(input) });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {})
      }
    });

    if (!response.ok) {
      throw new DiaryServiceError("这封信暂时没有取到，稍后再看。", response.status === 404 ? "not_found" : "network_failed");
    }

    return response.json() as Promise<T>;
  }
}
