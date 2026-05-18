import { demoCharacterConfig, renderCharacterTemplate } from "../characterConfig";
import { mockDiaries, type StoredDiary } from "../data/mockDiaryData";
import type {
  ChatBubbleDeleteResponse,
  ChatBubbleFeedbackResponse,
  ChatBubbleKind,
  CheckDiaryQualityInput,
  CheckDiaryQualityResponse,
  DiaryCard,
  DiaryDetail,
  DiaryDraft,
  DiaryReply,
  DiaryStateUpdate,
  DiaryStateUpdateResponse,
  EmptyStateType,
  FeedbackReason,
  GenerateDiaryInput,
  GenerateDiaryResponse,
  MailboxResponse,
  PetAction,
  PetReaction,
  PetReactionInput,
  ReplyIntent,
  SynthesizeSpeechInput,
  SynthesizeSpeechResponse,
  SubmitFeedbackResponse,
  SubmitReplyResponse
} from "../types";
import { PAGE_SIZE_LIMIT } from "../types";
import { DiaryServiceError, type DiaryService, type GetMailboxParams } from "./DiaryService";
import { clampPageSize, containsForbiddenPrivateText, sanitizeAvailableActions } from "./sanitize";

export type MockScenario =
  | "normal"
  | "multiple_unread"
  | "no_unread"
  | "first_empty"
  | "no_new_today"
  | "low_evidence"
  | "generation_failed"
  | "quality_blocked"
  | "privacy_blocked"
  | "clock_rollback"
  | "future_time_jump"
  | "reply_fails"
  | "feedback_fails"
  | "state_update_fails"
  | "delete_fails";

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso(): string {
  return new Date().toISOString();
}

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class MockDiaryService implements DiaryService {
  private diaries: StoredDiary[];
  private scenario: MockScenario;
  private characterConfig = demoCharacterConfig;

  constructor(options: { scenario?: MockScenario } = {}) {
    this.diaries = deepClone(mockDiaries);
    this.scenario = options.scenario ?? "normal";
    this.applyScenarioState();
  }

  setScenario(scenario: MockScenario): void {
    this.scenario = scenario;
    this.diaries = deepClone(mockDiaries);
    this.applyScenarioState();
  }

  setCharacterConfig(characterConfig: typeof demoCharacterConfig): void {
    this.characterConfig = characterConfig;
  }

  async getCharacterConfig() {
    return this.characterConfig;
  }

  async getMailbox(params: GetMailboxParams): Promise<MailboxResponse> {
    const pageSize = clampPageSize(params.page_size);
    const page = Number.isFinite(params.page) && params.page > 0 ? Math.floor(params.page) : 1;
    const visible = this.activeDiariesForScenario();
    const start = (page - 1) * pageSize;
    const items = visible.slice(start, start + pageSize).map((diary) => this.toCard(diary));
    const total = visible.length;

    return {
      items,
      pagination: {
        page,
        page_size: pageSize,
        total,
        has_next: start + pageSize < total
      },
      unread_count: visible.filter((diary) => diary.mailbox_status === "unread").length,
      empty_state_type: this.emptyStateFor(total),
      character_config: this.characterConfig
    };
  }

  async getDiaryDetail(diaryId: string, _userId = "user_demo"): Promise<DiaryDetail> {
    const diary = this.findActiveDiary(diaryId);
    return this.toDetail(diary);
  }

  async updateDiaryState(diaryId: string, _userId: string, updates: DiaryStateUpdate): Promise<DiaryStateUpdateResponse> {
    if (this.scenario === "state_update_fails") {
      this.scenario = "normal";
      throw new DiaryServiceError("这枚小贴纸暂时没贴稳，等一下再试。", "network_failed");
    }

    const diary = this.findActiveDiary(diaryId);
    diary.mailbox_status = updates.mailbox_status ?? diary.mailbox_status;
    diary.bubble_status = updates.bubble_status ?? diary.bubble_status;
    diary.is_favorited = updates.is_favorited ?? diary.is_favorited;
    diary.read_at = updates.read_at ?? diary.read_at;

    return {
      diary_id: diary.diary_id,
      mailbox_status: diary.mailbox_status,
      bubble_status: diary.bubble_status,
      is_favorited: diary.is_favorited,
      unread_count: this.activeDiaries().filter((entry) => entry.mailbox_status === "unread").length,
      updated_at: nowIso()
    };
  }

  async submitDiaryReply(diaryId: string, _userId: string, replyText: string): Promise<SubmitReplyResponse> {
    if (this.scenario === "reply_fails") {
      this.scenario = "normal";
      throw new DiaryServiceError("信好像没寄出去，等一下再试。", "network_failed");
    }

    const diary = this.findActiveDiary(diaryId);
    const intent = inferReplyIntent(replyText);
    const mappedFeedback = intent === "positive" ? 1 : intent === "negative" || intent === "correction" ? 0 : null;
    const reply: DiaryReply = {
      reply_id: nextId("reply"),
      diary_id: diary.diary_id,
      reply_text: replyText,
      reply_intent: intent,
      created_at: nowIso(),
      mapped_feedback_value: mappedFeedback,
      long_term_memory_write_status: "written",
      memory_source_id: nextId("mock_memory")
    };
    diary.replies.push(reply);

    if (mappedFeedback !== null) {
      diary.feedback_state = {
        current_value: mappedFeedback,
        latest_feedback_at: reply.created_at,
        reason: intent === "correction" ? "not_accurate" : null
      };
    }

    const petReaction = await this.generatePetReaction({
      scene: "diary_reply",
      diary_id: diary.diary_id,
      reply_id: reply.reply_id,
      character_config: this.characterConfig,
      context: {
        reply_intent: intent,
        diary_title: diary.title,
        content_angle: diary.content_angle,
        user_reply_text: reply.reply_text,
        user_reply_is_current_turn: true,
        mapped_feedback_value: mappedFeedback
      }
    });
    diary.pet_reactions.push(petReaction);
    reply.pet_reaction = petReaction;
    return { reply, pet_reaction: petReaction };
  }

  async submitDiaryFeedback(
    targetId: string,
    value: 0 | 1,
    reason: FeedbackReason | null,
    source: "button" | "reply" | "conversation"
  ): Promise<SubmitFeedbackResponse> {
    if (this.scenario === "feedback_fails") {
      this.scenario = "normal";
      throw new DiaryServiceError("这次反馈暂时没记好，等一下再试。", "network_failed");
    }

    const diary = this.findActiveDiary(targetId);
    const at = nowIso();
    diary.feedback_state = { current_value: value, latest_feedback_at: at, reason };
    const petReaction = await this.generatePetReaction({
      scene: value === 1 ? "feedback_liked" : "feedback_disliked",
      diary_id: diary.diary_id,
      reply_id: null,
      character_config: this.characterConfig,
      context: { reason, diary_title: diary.title }
    });

    return {
      feedback_id: nextId("feedback"),
      target_type: "diary_entry",
      target_id: targetId,
      current_feedback: { value, source, reason, at },
      pet_reaction: petReaction
    };
  }

  async submitChatBubbleFeedback(targetType: ChatBubbleKind, targetId: string, value: 0 | 1): Promise<ChatBubbleFeedbackResponse> {
    this.assertKnownChatBubble(targetType, targetId);
    return {
      feedback_id: nextId("bubble_feedback"),
      target_type: targetType,
      target_id: targetId,
      current_feedback: {
        value,
        source: "bubble_action",
        at: nowIso()
      }
    };
  }

  async deleteChatBubble(targetType: ChatBubbleKind, targetId: string): Promise<ChatBubbleDeleteResponse> {
    this.assertKnownChatBubble(targetType, targetId);
    return {
      target_type: targetType,
      target_id: targetId,
      is_hidden: true,
      hidden_at: nowIso()
    };
  }

  async softDeleteDiary(diaryId: string, _userId = "user_demo"): Promise<import("../types").SoftDeleteResponse> {
    if (this.scenario === "delete_fails") {
      this.scenario = "normal";
      throw new DiaryServiceError("信好像没收好，等一下再试。", "network_failed");
    }

    const diary = this.findActiveDiary(diaryId);
    const inactiveAt = nowIso();
    diary.is_active = false;
    diary.inactive_reason = "user_deleted";
    diary.inactive_at = inactiveAt;
    diary.evidence_reuse_allowed = false;
    diary.mailbox_status = "archived";

    const petReaction = await this.generatePetReaction({
      scene: "diary_deleted",
      diary_id: diary.diary_id,
      reply_id: null,
      character_config: this.characterConfig,
      context: { diary_title: diary.title }
    });

    return {
      diary_id: diary.diary_id,
      is_active: false,
      inactive_reason: "user_deleted",
      inactive_at: inactiveAt,
      evidence_reuse_allowed: false,
      unread_count: this.activeDiaries().filter((entry) => entry.mailbox_status === "unread").length,
      pet_reaction: petReaction
    };
  }

  async generatePetReaction(input: PetReactionInput): Promise<PetReaction> {
    if (typeof fetch === "function") {
      try {
        const response = await fetch("/api/diary/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        });
        if (response.ok) {
          return await response.json() as PetReaction;
        }
      } catch {
        // The static mock demo keeps deterministic copy as the no-LLM fallback.
      }
    }

    const reaction = reactionTextFor(input);
    return {
      reaction_id: nextId("reaction"),
      diary_id: input.diary_id ?? null,
      reply_id: input.reply_id ?? null,
      scene: input.scene,
      reaction_text: renderCharacterTemplate(reaction.text, input.character_config),
      emotion: reaction.emotion,
      action: reaction.action,
      should_speak: true,
      memory_write_hint: reaction.memory_write_hint,
      created_at: nowIso()
    };
  }

  async synthesizeSpeech(_input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse> {
    if (typeof fetch === "function") {
      try {
        const response = await fetch("/api/diary/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(_input)
        });
        if (response.ok) {
          return await response.json() as SynthesizeSpeechResponse;
        }
      } catch {
        // The static mock demo keeps browser TTS as the no-backend fallback.
      }
    }
    return { provider: "browser_fallback" };
  }

  async generateDiary(input: GenerateDiaryInput): Promise<GenerateDiaryResponse> {
    const duplicate = this.diaries.some((diary) => diary.physiological_day_id === input.day_window.physiological_day_id && diary.is_active);
    if (duplicate) {
      return this.generationFailure(input, "duplicate_day");
    }

    const authorized = input.source_candidates.filter((source) => input.consent_snapshot[source.source_type]);
    if (input.day_window.effective_session_minutes < 30 || authorized.length === 0) {
      return this.generationFailure(input, "insufficient_evidence");
    }

    const draft: DiaryDraft = {
      title: "折好的新信",
      body: [
        "{{userAddressing}}，这一段生理日里有一件小事被{{selfReference}}折进了信纸。",
        `{{selfReference}}只用了 ${authorized.length} 条已授权摘要，没有偷看不该看的内容。`,
        "如果这封信哪里写得不够准，告诉{{selfReference}}就好。下次会写得更轻一点。"
      ],
      content_angle: "game_companion",
      source_ids: authorized.map((source) => source.source_id),
      emotion: "gentle"
    };

    const quality = await this.checkDiaryQuality({
      diary_draft: draft,
      source_ids: draft.source_ids,
      persona_version: input.character_config.personaVersion,
      privacy_rules: {
        forbid_real_name: true,
        forbid_private_title: true,
        forbid_third_party_body: true
      },
      recent_diary_summaries: input.recent_diary_summaries
    });

    if (quality.quality_result !== "pass") {
      return this.generationFailure(input, "quality_blocked");
    }

    const diary = this.persistGeneratedDiary(input, draft, authorized);
    return {
      diary_id: diary.diary_id,
      physiological_day_id: input.day_window.physiological_day_id,
      diary_date: input.day_window.diary_date,
      generation_status: "generated",
      failure_reason: null,
      source_ids: draft.source_ids,
      visible_date: diary.visible_date,
      visible_after_at: diary.visible_after_at
    };
  }

  async checkDiaryQuality(input: CheckDiaryQualityInput): Promise<CheckDiaryQualityResponse> {
    const allText = [input.diary_draft.title, ...input.diary_draft.body].join("\n");
    const failureReasons: CheckDiaryQualityResponse["quality_failure_reasons"] = [];

    if (!input.diary_draft.title || input.diary_draft.body.length === 0) failureReasons.push("format");
    if (input.source_ids.length === 0 && input.diary_draft.content_angle !== "solo_theater" && input.diary_draft.content_angle !== "worldbuilding") {
      failureReasons.push("facts");
    }
    if (containsForbiddenPrivateText(allText)) failureReasons.push("privacy");
    if (/击杀|死亡|分数|KDA|战报/.test(allText)) failureReasons.push("persona");
    if (input.recent_diary_summaries.some((summary) => summary && allText.includes(summary))) failureReasons.push("repetition");

    const uniqueFailures = Array.from(new Set(failureReasons));
    return {
      quality_result: uniqueFailures.length === 0 ? "pass" : "fail",
      quality_failure_reasons: uniqueFailures,
      rewrite_allowed: false,
      risk_flags: uniqueFailures
    };
  }

  private activeDiariesForScenario(): StoredDiary[] {
    if (this.scenario === "first_empty" || this.scenario === "generation_failed") return [];
    return this.activeDiaries();
  }

  private activeDiaries(): StoredDiary[] {
    return this.diaries
      .filter((diary) => diary.is_active)
      .sort((a, b) => b.diary_date.localeCompare(a.diary_date));
  }

  private emptyStateFor(total: number): EmptyStateType | null {
    if (this.scenario === "first_empty") return "first_empty";
    if (this.scenario === "generation_failed") return "generation_failed";
    if (this.scenario === "quality_blocked" || this.scenario === "privacy_blocked") return "quality_blocked";
    if (
      this.scenario === "no_new_today" ||
      this.scenario === "low_evidence" ||
      this.scenario === "clock_rollback" ||
      this.scenario === "future_time_jump"
    ) return "no_new_today";
    return total === 0 ? "first_empty" : null;
  }

  private findActiveDiary(diaryId: string): StoredDiary {
    const diary = this.diaries.find((entry) => entry.diary_id === diaryId && entry.is_active);
    if (!diary) throw new DiaryServiceError("这封信已经被收起，暂时不再展示。", "not_found");
    return diary;
  }

  private assertKnownChatBubble(targetType: ChatBubbleKind, targetId: string): void {
    const activeDiaries = this.activeDiaries();
    const exists =
      targetType === "user_reply"
        ? activeDiaries.some((diary) => diary.replies.some((reply) => reply.reply_id === targetId))
        : activeDiaries.some((diary) =>
            diary.pet_reactions.some((reaction) => reaction.reaction_id === targetId) ||
            diary.replies.some((reply) => reply.pet_reaction?.reaction_id === targetId) ||
            targetId === `opening_${diary.diary_id}` ||
            targetId.startsWith("reaction_") ||
            targetId.startsWith(`fallback_${diary.diary_id}_`)
          );

    if (!exists) {
      throw new DiaryServiceError("这条气泡已经收起。", "not_found");
    }
  }

  private toCard(diary: StoredDiary): DiaryCard {
    return {
      diary_id: diary.diary_id,
      diary_date: diary.diary_date,
      visible_date: diary.visible_date,
      title: renderCharacterTemplate(diary.title, this.characterConfig),
      summary: renderCharacterTemplate(diary.summary, this.characterConfig),
      content_angle: diary.content_angle,
      mailbox_status: diary.mailbox_status,
      is_favorited: diary.is_favorited,
      card_visual_type: diary.card_visual_type,
      card_prompt_text: renderCharacterTemplate(diary.card_prompt_text, this.characterConfig),
      photo_asset: diary.photo_asset,
      source_summary: diary.source_summary
    };
  }

  private toDetail(diary: StoredDiary): DiaryDetail {
    return {
      diary_id: diary.diary_id,
      title: renderCharacterTemplate(diary.title, this.characterConfig),
      body: diary.body.map((line) => renderCharacterTemplate(line, this.characterConfig)),
      diary_date: diary.diary_date,
      visible_date: diary.visible_date,
      source_summary: diary.source_summary,
      visual_elements: deepClone(diary.visual_elements),
      feedback_state: { ...diary.feedback_state },
      is_favorited: diary.is_favorited,
      replies: deepClone(diary.replies),
      pet_opening_reaction: diary.pet_reactions.find((reaction) => reaction.scene === "diary_opened") ?? {
        reaction_id: `opening_${diary.diary_id}`,
        diary_id: diary.diary_id,
        reply_id: null,
        scene: "diary_opened",
        reaction_text: renderCharacterTemplate("{{selfReference}}期待你的回信哦。", this.characterConfig),
        emotion: "gentle",
        action: "nod",
        should_speak: true,
        memory_write_hint: "none",
        created_at: nowIso()
      },
      available_actions: sanitizeAvailableActions(diary.available_actions),
      content_angle: diary.content_angle,
      photo_asset: diary.photo_asset,
      alt_photo_asset: diary.alt_photo_asset,
      side_note: renderCharacterTemplate(diary.side_note, this.characterConfig),
      mailbox_status: diary.mailbox_status
    };
  }

  private applyScenarioState(): void {
    if (this.scenario === "multiple_unread") {
      this.diaries.forEach((diary) => {
        diary.mailbox_status = "unread";
        diary.bubble_status = "new";
      });
    }

    if (
      this.scenario === "no_unread" ||
      this.scenario === "no_new_today" ||
      this.scenario === "low_evidence" ||
      this.scenario === "quality_blocked" ||
      this.scenario === "privacy_blocked" ||
      this.scenario === "clock_rollback" ||
      this.scenario === "future_time_jump"
    ) {
      this.diaries.forEach((diary) => {
        diary.mailbox_status = "read";
        diary.bubble_status = "opened";
      });
    }
  }

  private generationFailure(input: GenerateDiaryInput, failureReason: GenerateDiaryResponse["failure_reason"]): GenerateDiaryResponse {
    return {
      diary_id: null,
      physiological_day_id: input.day_window.physiological_day_id,
      diary_date: input.day_window.diary_date,
      generation_status: failureReason === "insufficient_evidence" ? "skipped" : "failed",
      failure_reason: failureReason,
      source_ids: [],
      visible_date: null,
      visible_after_at: null
    };
  }

  private persistGeneratedDiary(input: GenerateDiaryInput, draft: DiaryDraft, sources: GenerateDiaryInput["source_candidates"]): StoredDiary {
    const id = nextId("diary");
    const diary: StoredDiary = {
      ...deepClone(mockDiaries[0]),
      diary_id: id,
      physiological_day_id: input.day_window.physiological_day_id,
      diary_date: input.day_window.diary_date,
      visible_date: input.day_window.diary_date,
      visible_after_at: input.day_window.triggered_at,
      window_start_at: input.day_window.window_start_at,
      window_end_at: input.day_window.window_end_at,
      cutoff_reason: input.day_window.cutoff_reason,
      effective_session_minutes: input.day_window.effective_session_minutes,
      title: draft.title,
      body: draft.body,
      summary: draft.body[0] ?? draft.title,
      content_angle: draft.content_angle,
      source_ids: draft.source_ids,
      source_candidates: sources,
      source_summary: "来自已授权事件摘要",
      mailbox_status: "unread",
      bubble_status: "new",
      is_favorited: false,
      read_at: null,
      replies: [],
      pet_reactions: [],
      feedback_state: { current_value: null, latest_feedback_at: null, reason: null },
      is_active: true,
      inactive_reason: null,
      inactive_at: null,
      evidence_reuse_allowed: true
    };
    this.diaries.unshift(diary);
    return diary;
  }
}

function inferReplyIntent(text: string): ReplyIntent {
  if (/删|收起/.test(text)) return "delete_request";
  if (/不准|不像|错|别这样|不是/.test(text)) return "correction";
  if (/不喜欢|讨厌|太满|太私密/.test(text)) return "negative";
  if (/喜欢|可爱|开心|好/.test(text)) return "positive";
  if (/以后|下次|希望/.test(text)) return "preference";
  return "casual";
}

function reactionTextFor(input: PetReactionInput): Pick<PetReaction, "emotion" | "memory_write_hint"> & { text: string; action: PetAction } {
  switch (input.scene) {
    case "new_diary_available":
      return { text: "{{userAddressing}}，{{selfReference}}把昨天的小信藏好啦，要拆开看看吗？", emotion: "playful", action: "shy_hide", memory_write_hint: "none" };
    case "diary_opened":
      return { text: "{{selfReference}}期待你的回信哦。", emotion: "gentle", action: "nod", memory_write_hint: "none" };
    case "diary_reply":
      if (input.context.reply_intent === "correction") {
        return { text: "嗯，{{selfReference}}写偏了。你说的{{selfReference}}记住，下次不这样猜。", emotion: "apology", action: "sorry_bow", memory_write_hint: "correction" };
      }
      if (input.context.reply_intent === "positive") {
        return { text: "{{userAddressing}}喜欢就好，{{selfReference}}开心得要藏不住啦。", emotion: "excited", action: "happy_bounce", memory_write_hint: "positive_feedback" };
      }
      return { text: "{{selfReference}}接到啦，会把这两句和信一起收好。", emotion: "gentle", action: "nod", memory_write_hint: "none" };
    case "feedback_liked":
      return { text: "{{selfReference}}记下了，这一封{{userAddressing}}喜欢。", emotion: "excited", action: "happy_bounce", memory_write_hint: "positive_feedback" };
    case "feedback_disliked":
      return { text: "{{selfReference}}收到了。下次轻一点，不把不确定说满。", emotion: "thinking", action: "thinking_loop", memory_write_hint: "negative_feedback" };
    case "diary_deleted":
      return { text: "好，{{selfReference}}把这封信收起来，不再拿给{{userAddressing}}看。", emotion: "gentle", action: "nod", memory_write_hint: "none" };
    case "generation_failed":
      return { text: "信纸好像被{{selfReference}}收得太深了，晚点再整理。", emotion: "sorry", action: "sorry_bow", memory_write_hint: "none" };
    case "generation_running":
      return { text: "{{selfReference}}正在把小纸片折好。", emotion: "writing", action: "writing_loop", memory_write_hint: "none" };
    case "empty_state":
    default:
      return { text: "今天没有新信也挺好，{{selfReference}}不乱写。", emotion: "quiet", action: "idle", memory_write_hint: "none" };
  }
}

export { PAGE_SIZE_LIMIT };
