import type {
  CharacterResonance,
  FeedbackPortraitNodeInput,
  GetMoreDiscoveriesParams,
  GetPortraitParams,
  MoreDiscoveriesResponse,
  PortraitFeedbackResponse,
  PortraitNode,
  PortraitNodeUpdatePatch,
  PortraitNodeUpdateResponse,
  PortraitSoftDeleteResponse,
  PromoteDiscoveryInput,
  PromoteDiscoveryResponse,
  ReorganizePortraitResponse,
  UserPortraitResponse
} from "./types";

export interface PortraitService {
  getPortrait(params: GetPortraitParams): Promise<UserPortraitResponse>;
  getPortraitNode(nodeId: string, params: GetPortraitParams): Promise<PortraitNode>;
  updatePortraitNode(nodeId: string, params: GetPortraitParams, patch: PortraitNodeUpdatePatch): Promise<PortraitNodeUpdateResponse>;
  feedbackPortraitNode(input: FeedbackPortraitNodeInput): Promise<PortraitFeedbackResponse>;
  softDeletePortraitNode(nodeId: string, params: GetPortraitParams): Promise<PortraitSoftDeleteResponse>;
  getMoreDiscoveries(params: GetMoreDiscoveriesParams): Promise<MoreDiscoveriesResponse>;
  promoteDiscovery(input: PromoteDiscoveryInput): Promise<PromoteDiscoveryResponse>;
  getCharacterResonance(params: GetPortraitParams): Promise<CharacterResonance>;
  reassessCharacterResonance(params: GetPortraitParams): Promise<CharacterResonance>;
  reorganizePortrait(params: GetPortraitParams): Promise<ReorganizePortraitResponse>;
}

export class PortraitServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "not_found" | "network_failed" | "invalid_request" | "quality_blocked" | "main_full" | "unknown"
  ) {
    super(message);
    this.name = "PortraitServiceError";
  }
}
