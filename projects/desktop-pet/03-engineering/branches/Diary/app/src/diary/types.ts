export const PAGE_SIZE_LIMIT = 10;

export const DIARY_ACTIONS = ["reply", "like", "dislike", "favorite", "delete"] as const;
export type DiaryAction = (typeof DIARY_ACTIONS)[number];

export type DiaryEmotion =
  | "excited"
  | "gentle"
  | "comfort"
  | "apology"
  | "quiet"
  | "playful"
  | "thinking"
  | "writing"
  | "sleeping"
  | "sorry";

export type PetAction =
  | "idle"
  | "happy_bounce"
  | "nod"
  | "wave"
  | "shy_hide"
  | "thinking_loop"
  | "sorry_bow"
  | "writing_loop";

export type PetScene =
  | "new_diary_available"
  | "diary_opened"
  | "diary_reply"
  | "diary_deleted"
  | "empty_state"
  | "feedback_liked"
  | "feedback_disliked"
  | "generation_running"
  | "generation_failed";

export type ContentAngle =
  | "game_companion"
  | "daily_observation"
  | "pet_interaction"
  | "solo_theater"
  | "worldbuilding";

export type MailboxStatus = "unread" | "read" | "archived";
export type BubbleStatus = "hidden" | "new" | "opened" | "dismissed";
export type EmptyStateType = "first_empty" | "no_new_today" | "generation_failed" | "quality_blocked";
export type CutoffReason = "night_shutdown" | "long_absence" | "date_reset_deadline" | "next_boot_fallback";
export type GenerationStatus = "generated" | "skipped" | "failed";
export type FeedbackReason = "not_accurate" | "not_like_me" | "wrong_tone" | "too_private" | "boring" | "other";
export type ReplyIntent = "positive" | "negative" | "correction" | "preference" | "casual" | "delete_request";
export type MemoryWriteStatus = "pending" | "written" | "failed";
export type VoiceStyle = "soft" | "happy" | "shy" | "apologetic" | "calm";
export type VoiceMimeType = "audio/mpeg" | "audio/opus" | "audio/aac" | "audio/wav" | "audio/flac";
export type SourceType =
  | "game_event"
  | "game_session"
  | "idip_snapshot"
  | "episode"
  | "highlight_event"
  | "chat_summary"
  | "pet_interaction"
  | "authorized_desktop_context";

export interface CharacterConfig {
  characterConfigId: string;
  characterName: string;
  selfReference: string;
  userAddressing: string;
  tone: string;
  personaVersion: string;
}

export interface DayWindow {
  physiological_day_id: string;
  diary_date: string;
  window_start_at: string;
  window_end_at: string;
  cutoff_reason: CutoffReason;
  triggered_at: string;
  write_delay_buffer_seconds: number;
  effective_session_minutes: number;
}

export interface SourceCandidate {
  source_id: string;
  source_type: SourceType;
  evidence_summary: string;
  quote_eligible?: boolean;
}

export interface DiaryCard {
  diary_id: string;
  diary_date: string;
  visible_date: string;
  title: string;
  summary: string;
  content_angle: ContentAngle;
  mailbox_status: MailboxStatus;
  is_favorited: boolean;
  card_visual_type: "photo_card";
  card_prompt_text: string;
  photo_asset: string;
  source_summary: string;
}

export interface FeedbackState {
  current_value: 0 | 1 | null;
  latest_feedback_at: string | null;
  reason?: FeedbackReason | null;
}

export interface VisualElement {
  type: "stamp" | "sticker" | "paper_clip" | "photo";
  value: string;
  asset_source: "partner_game" | "demo_generated";
}

export interface DiaryReply {
  reply_id: string;
  diary_id: string;
  reply_text: string;
  reply_intent: ReplyIntent;
  created_at: string;
  mapped_feedback_value: 0 | 1 | null;
  long_term_memory_write_status: MemoryWriteStatus;
  memory_source_id: string | null;
  voice_audio_url?: string;
  voice_mime_type?: VoiceMimeType;
  pet_reaction?: PetReaction;
}

export interface PetReaction {
  reaction_id: string;
  diary_id: string | null;
  reply_id: string | null;
  scene: PetScene;
  reaction_text: string;
  emotion: DiaryEmotion;
  action: PetAction;
  should_speak: boolean;
  voice_audio_url?: string;
  voice_mime_type?: VoiceMimeType;
  memory_write_hint: "none" | "positive_feedback" | "negative_feedback" | "correction";
  created_at: string;
}

export interface DiaryDetail {
  diary_id: string;
  title: string;
  body: string[];
  diary_date: string;
  visible_date: string;
  source_summary: string;
  visual_elements: VisualElement[];
  feedback_state: FeedbackState;
  is_favorited: boolean;
  replies: DiaryReply[];
  pet_opening_reaction: PetReaction;
  available_actions: DiaryAction[];
  content_angle: ContentAngle;
  photo_asset: string;
  alt_photo_asset?: string;
  side_note: string;
  mailbox_status: MailboxStatus;
}

export interface MailboxResponse {
  items: DiaryCard[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    has_next: boolean;
  };
  unread_count: number;
  empty_state_type: EmptyStateType | null;
  character_config: CharacterConfig;
}

export interface DiaryStateUpdate {
  mailbox_status?: MailboxStatus;
  bubble_status?: BubbleStatus;
  is_favorited?: boolean;
  read_at?: string;
}

export interface DiaryStateUpdateResponse {
  diary_id: string;
  mailbox_status: MailboxStatus;
  bubble_status: BubbleStatus;
  is_favorited: boolean;
  unread_count: number;
  updated_at: string;
}

export interface SubmitReplyResponse {
  reply: DiaryReply;
  pet_reaction: PetReaction;
}

export interface SubmitFeedbackResponse {
  feedback_id: string;
  target_type: "diary_entry";
  target_id: string;
  current_feedback: {
    value: 0 | 1;
    source: "button" | "reply" | "conversation";
    reason: FeedbackReason | null;
    at: string;
  };
  pet_reaction: PetReaction;
}

export type ChatBubbleKind = "pet_reaction" | "user_reply";

export interface ChatBubbleFeedbackResponse {
  feedback_id: string;
  target_type: ChatBubbleKind;
  target_id: string;
  current_feedback: {
    value: 0 | 1;
    source: "bubble_action";
    at: string;
  };
}

export interface ChatBubbleDeleteResponse {
  target_type: ChatBubbleKind;
  target_id: string;
  is_hidden: true;
  hidden_at: string;
}

export interface SoftDeleteResponse {
  diary_id: string;
  is_active: false;
  inactive_reason: "user_deleted";
  inactive_at: string;
  evidence_reuse_allowed: false;
  unread_count: number;
  pet_reaction: PetReaction;
}

export interface GenerateDiaryInput {
  user_id: string;
  game_context_id: string;
  user_timezone: string;
  day_window: DayWindow;
  consent_snapshot: Record<SourceType, boolean>;
  source_candidates: SourceCandidate[];
  character_config: CharacterConfig;
  recent_diary_summaries: string[];
}

export interface DiaryDraft {
  title: string;
  body: string[];
  content_angle: ContentAngle;
  source_ids: string[];
  emotion: DiaryEmotion;
}

export interface GenerateDiaryResponse {
  diary_id: string | null;
  physiological_day_id: string;
  diary_date: string;
  generation_status: GenerationStatus;
  failure_reason: "insufficient_evidence" | "quality_blocked" | "provider_failed" | "duplicate_day" | null;
  source_ids: string[];
  visible_date: string | null;
  visible_after_at: string | null;
}

export interface CheckDiaryQualityInput {
  diary_draft: DiaryDraft;
  source_ids: string[];
  persona_version: string;
  privacy_rules: {
    forbid_real_name: boolean;
    forbid_private_title: boolean;
    forbid_third_party_body: boolean;
  };
  recent_diary_summaries: string[];
}

export interface CheckDiaryQualityResponse {
  quality_result: "pass" | "fail";
  quality_failure_reasons: Array<"facts" | "persona" | "privacy" | "repetition" | "format">;
  rewrite_allowed: false;
  risk_flags: string[];
}

export interface PetReactionInput {
  scene: PetScene;
  diary_id?: string | null;
  reply_id?: string | null;
  character_config: CharacterConfig;
  context: Record<string, string | number | boolean | null>;
}

export interface SynthesizeSpeechInput {
  text: string;
  voice_style?: VoiceStyle;
  scene?: PetScene | "desktop_entry" | "manual_playback" | "user_reply";
}

export interface SynthesizeSpeechResponse {
  provider: "minimax" | "http-json" | "browser_fallback";
  voice_audio_url?: string;
  voice_mime_type?: VoiceMimeType;
}
