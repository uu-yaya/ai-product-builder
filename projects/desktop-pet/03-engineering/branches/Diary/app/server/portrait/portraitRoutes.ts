import type { PortraitService } from "../../src/diary/userPortrait/PortraitService";
import type {
  FeedbackPortraitNodeInput,
  GetMoreDiscoveriesParams,
  GetPortraitParams,
  PortraitNodeUpdatePatch,
  PromoteDiscoveryInput
} from "../../src/diary/userPortrait/types";

export const portraitApiRoutes = {
  portrait: "GET /api/portrait",
  node: "GET /api/portrait/nodes/:node_id",
  updateNode: "PATCH /api/portrait/nodes/:node_id",
  feedbackNode: "POST /api/portrait/nodes/:node_id/feedback",
  softDeleteNode: "DELETE /api/portrait/nodes/:node_id",
  moreDiscoveries: "GET /api/portrait/discoveries?page=1&page_size=10",
  promoteDiscovery: "POST /api/portrait/discoveries/:discovery_id/promote",
  resonance: "GET /api/portrait/resonance",
  reassessResonance: "POST /api/portrait/resonance/reassess",
  reorganize: "POST /api/portrait/reorganize"
} as const;

export function createPortraitApiHandlers(service: PortraitService) {
  return {
    getPortrait: (query: GetPortraitParams) => {
      return service.getPortrait(query);
    },
    getPortraitNode: (params: GetPortraitParams & { node_id: string }) => {
      return service.getPortraitNode(params.node_id, params);
    },
    updatePortraitNode: (params: GetPortraitParams & { node_id: string; patch: PortraitNodeUpdatePatch }) => {
      return service.updatePortraitNode(params.node_id, params, params.patch);
    },
    feedbackPortraitNode: (input: FeedbackPortraitNodeInput) => {
      return service.feedbackPortraitNode(input);
    },
    softDeletePortraitNode: (params: GetPortraitParams & { node_id: string }) => {
      return service.softDeletePortraitNode(params.node_id, params);
    },
    getMoreDiscoveries: (query: GetMoreDiscoveriesParams) => {
      return service.getMoreDiscoveries(query);
    },
    promoteDiscovery: (input: PromoteDiscoveryInput) => {
      return service.promoteDiscovery(input);
    },
    getCharacterResonance: (query: GetPortraitParams) => {
      return service.getCharacterResonance(query);
    },
    reassessCharacterResonance: (input: GetPortraitParams) => {
      return service.reassessCharacterResonance(input);
    },
    reorganizePortrait: (input: GetPortraitParams) => {
      return service.reorganizePortrait(input);
    }
  };
}
