import type { CharacterConfig } from "../types";

export const PORTRAIT_PAGE_SIZE_LIMIT = 10;

export type PortraitNodeCategory =
  | "name"
  | "relationship"
  | "current_goal"
  | "companion_preference"
  | "diary_preference"
  | "play_style"
  | "practice_stage"
  | "preferred_character"
  | "mode_preference"
  | "avoid_topic"
  | "stuck_point"
  | "recent_achievement"
  | "long_term_milestone"
  | "social_preference"
  | "character_resonance"
  | "dynamic_discovery"
  | "more_discoveries";

export type PortraitNodeRing = "inner" | "middle" | "outer";
export type PortraitNodeVisualType = "paper_tag" | "polaroid" | "stamp" | "seal" | "pocket";
export type PortraitNodeStatus =
  | "stable"
  | "new_discovery"
  | "recent_update"
  | "user_edited"
  | "liked"
  | "rejected"
  | "low_signal"
  | "required_empty";
export type PortraitNodeAction = "focus" | "edit" | "like" | "dislike" | "soft_delete" | "move_to_main";
export type PortraitFeedbackValue = "like" | "not_accurate";
export type PortraitInactiveReason = "user_deleted";
export type PortraitScenario =
  | "normal"
  | "portrait_ready"
  | "empty"
  | "portrait_no_portrait"
  | "low_data"
  | "portrait_low_data"
  | "load_failed"
  | "portrait_loading"
  | "portrait_load_failed"
  | "portrait_too_many_nodes"
  | "portrait_pending_discoveries_overflow"
  | "portrait_bubble_disabled"
  | "portrait_voice_disabled"
  | "node_focus_stable"
  | "node_focus_low_signal"
  | "node_focus_editing"
  | "node_focus_liked"
  | "node_focus_unliked"
  | "node_focus_consecutive_unlike"
  | "node_focus_deleted"
  | "node_focus_unavailable"
  | "more_ready"
  | "more_empty"
  | "more_discoveries_empty"
  | "more_failed"
  | "more_discoveries_load_failed"
  | "more_duplicate_discovery"
  | "discovery_focus_read"
  | "discovery_move_to_main_full"
  | "discovery_move_conflict"
  | "resonance_ready"
  | "resonance_unmeasured"
  | "resonance_not_measured"
  | "resonance_insufficient"
  | "resonance_insufficient_data"
  | "resonance_measuring"
  | "resonance_failed"
  | "resonance_expired"
  | "resonance_user_rejected"
  | "resonance_character_config_missing"
  | "resonance_authorization_unmet"
  | "resonance_service_unavailable"
  | "asset_missing"
  | "asset_center_avatar_failed"
  | "asset_demo_avatar_failed"
  | "asset_character_image_missing"
  | "ai_output_blocked_backend_fields"
  | "ai_output_wrong_persona"
  | "ai_output_real_personality_judgement"
  | "ai_output_bad_format"
  | "user_operation_edit_conflict"
  | "user_operation_model_overturns_edit"
  | "user_operation_deleted_node_reappears"
  | "edit_save_failed"
  | "reorganize_failed"
  | "consecutive_dislike"
  | "bubble_closed";

export type CharacterResonanceStatus =
  | "ready"
  | "unmeasured"
  | "insufficient_data"
  | "measuring"
  | "failed"
  | "expired"
  | "authorization_unmet"
  | "asset_missing";

export interface PortraitPosition {
  x: number;
  y: number;
}

export interface PortraitSourceSummary {
  label: string;
  source_ids: string[];
  confidence: "low" | "medium" | "high" | "user_confirmed";
  privacy_boundary: "summary_only";
}

export interface PortraitNode {
  node_id: string;
  category: PortraitNodeCategory;
  display_name: string;
  value: string;
  pet_explanation: string;
  source_summary: PortraitSourceSummary;
  ring: PortraitNodeRing;
  position: PortraitPosition;
  visual_type: PortraitNodeVisualType;
  status: PortraitNodeStatus;
  editable: boolean;
  deletable: boolean;
  is_active: boolean;
  inactive_reason: PortraitInactiveReason | null;
  available_actions: PortraitNodeAction[];
  node_version: number;
  updated_at: string;
  user_edited_at: string | null;
}

export interface PortraitCenter {
  avatar_asset: string;
  fallback_asset: string;
  title: string;
  subtitle: string;
}

export interface PortraitBubble {
  bubble_id: string;
  text: string;
  emotion: string;
  is_closed: boolean;
}

export interface CharacterResonance {
  resonance_id: string;
  status: CharacterResonanceStatus;
  character_name: string;
  role_type: string;
  role_asset: string;
  resonance_points: string[];
  pet_explanation: string;
  source_summary: PortraitSourceSummary;
  feedback_value: PortraitFeedbackValue | null;
  updated_at: string | null;
}

export interface UserPortraitResponse {
  portrait_id: string;
  user_id: string;
  game_context_id: string;
  title: string;
  center: PortraitCenter;
  nodes: PortraitNode[];
  more_discovery_count: number;
  new_discovery_count: number;
  updated_node_count: number;
  bubble: PortraitBubble | null;
  character_config: CharacterConfig;
  character_resonance: CharacterResonance;
  generated_at: string;
}

export interface MoreDiscoveriesResponse {
  items: PortraitNode[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    has_next: boolean;
  };
}

export interface PortraitNodeUpdatePatch {
  value: string;
  source: "user_edit";
}

export interface PortraitNodeUpdateResponse {
  node: PortraitNode;
  pet_reaction: PortraitPetReaction;
}

export interface PortraitFeedbackResponse {
  feedback_id: string;
  node_id: string;
  value: PortraitFeedbackValue;
  current_status: PortraitNodeStatus;
  pet_reaction: PortraitPetReaction;
}

export interface PortraitSoftDeleteResponse {
  node_id: string;
  is_active: false;
  inactive_reason: PortraitInactiveReason;
  inactive_at: string;
  evidence_reuse_allowed: false;
  pet_reaction: PortraitPetReaction;
}

export interface PromoteDiscoveryResponse {
  status: "promoted" | "main_full" | "duplicate_merged";
  node: PortraitNode | null;
  pet_reaction: PortraitPetReaction;
}

export interface ReorganizePortraitResponse {
  portrait: UserPortraitResponse;
  pet_reaction: PortraitPetReaction;
}

export interface PortraitPetReaction {
  reaction_id: string;
  scene:
    | "portrait_opened"
    | "portrait_node_edited"
    | "portrait_feedback_liked"
    | "portrait_feedback_like_removed"
    | "portrait_feedback_disliked"
    | "portrait_feedback_dislike_removed"
    | "portrait_node_removed"
    | "portrait_discovery_promoted"
    | "portrait_discovery_full"
    | "portrait_reorganized"
    | "portrait_resonance_reassessed"
    | "portrait_error";
  reaction_text: string;
  emotion: string;
  action: "idle" | "happy_bounce" | "nod" | "wave" | "thinking_loop" | "sorry_bow" | "writing_loop";
  should_speak: boolean;
  created_at: string;
}

export interface GetPortraitParams {
  user_id: string;
  game_context_id: string;
}

export interface GetMoreDiscoveriesParams extends GetPortraitParams {
  page: number;
  page_size: number;
}

export interface FeedbackPortraitNodeInput extends GetPortraitParams {
  node_id: string;
  value: PortraitFeedbackValue;
}

export interface PromoteDiscoveryInput extends GetPortraitParams {
  discovery_id: string;
}

export interface PortraitLLMProvider {
  summarizePortraitEvidence(input: {
    user_id: string;
    game_context_id: string;
    authorized_source_ids: string[];
  }): Promise<unknown>;
  generatePortraitNodes(input: {
    character_config: CharacterConfig;
    evidence_summary: unknown;
  }): Promise<unknown>;
  checkPortraitQuality(input: {
    candidate_nodes: unknown;
    existing_nodes: PortraitNode[];
  }): Promise<{ passed: boolean; sanitized_nodes: PortraitNode[] }>;
  generateCharacterResonance(input: {
    character_config: CharacterConfig;
    active_nodes: PortraitNode[];
  }): Promise<CharacterResonance>;
}
