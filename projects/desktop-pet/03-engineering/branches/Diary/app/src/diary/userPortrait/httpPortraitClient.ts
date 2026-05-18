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
  PortraitScenario,
  UserPortraitResponse
} from "./types";
import type { CharacterConfig } from "../types";
import type { PortraitService } from "./PortraitService";
import { PortraitServiceError } from "./PortraitService";

export class HttpPortraitClient implements PortraitService {
  private scenario: PortraitScenario | null = null;
  private characterConfig: CharacterConfig | null = null;

  constructor(private readonly baseUrl = "/api/portrait") {}

  setScenario(scenario: PortraitScenario): void {
    this.scenario = scenario;
  }

  setCharacterConfig(characterConfig: CharacterConfig): void {
    this.characterConfig = characterConfig;
  }

  async getPortrait(params: GetPortraitParams): Promise<UserPortraitResponse> {
    return this.request<UserPortraitResponse>(`${this.baseUrl}?${this.queryParams(params)}`);
  }

  async getPortraitNode(nodeId: string, params: GetPortraitParams): Promise<PortraitNode> {
    return this.request<PortraitNode>(`${this.baseUrl}/nodes/${encodeURIComponent(nodeId)}?${this.queryParams(params)}`);
  }

  async updatePortraitNode(
    nodeId: string,
    params: GetPortraitParams,
    patch: PortraitNodeUpdatePatch
  ): Promise<PortraitNodeUpdateResponse> {
    return this.request<PortraitNodeUpdateResponse>(`${this.baseUrl}/nodes/${encodeURIComponent(nodeId)}`, {
      method: "PATCH",
      body: JSON.stringify(this.withRuntimeContext({ ...params, patch }))
    });
  }

  async feedbackPortraitNode(input: FeedbackPortraitNodeInput): Promise<PortraitFeedbackResponse> {
    return this.request<PortraitFeedbackResponse>(`${this.baseUrl}/nodes/${encodeURIComponent(input.node_id)}/feedback`, {
      method: "POST",
      body: JSON.stringify(this.withRuntimeContext(input))
    });
  }

  async softDeletePortraitNode(nodeId: string, params: GetPortraitParams): Promise<PortraitSoftDeleteResponse> {
    return this.request<PortraitSoftDeleteResponse>(`${this.baseUrl}/nodes/${encodeURIComponent(nodeId)}`, {
      method: "DELETE",
      body: JSON.stringify(this.withRuntimeContext({ ...params, inactive_reason: "user_deleted" }))
    });
  }

  async getMoreDiscoveries(params: GetMoreDiscoveriesParams): Promise<MoreDiscoveriesResponse> {
    const query = this.queryParams(params);
    query.set("page", String(params.page));
    query.set("page_size", String(params.page_size));
    return this.request<MoreDiscoveriesResponse>(`${this.baseUrl}/discoveries?${query}`);
  }

  async promoteDiscovery(input: PromoteDiscoveryInput): Promise<PromoteDiscoveryResponse> {
    return this.request<PromoteDiscoveryResponse>(`${this.baseUrl}/discoveries/${encodeURIComponent(input.discovery_id)}/promote`, {
      method: "POST",
      body: JSON.stringify(this.withRuntimeContext(input))
    });
  }

  async getCharacterResonance(params: GetPortraitParams): Promise<CharacterResonance> {
    return this.request<CharacterResonance>(`${this.baseUrl}/resonance?${this.queryParams(params)}`);
  }

  async reassessCharacterResonance(params: GetPortraitParams): Promise<CharacterResonance> {
    return this.request<CharacterResonance>(`${this.baseUrl}/resonance/reassess`, {
      method: "POST",
      body: JSON.stringify(this.withRuntimeContext(params))
    });
  }

  async reorganizePortrait(params: GetPortraitParams): Promise<ReorganizePortraitResponse> {
    return this.request<ReorganizePortraitResponse>(`${this.baseUrl}/reorganize`, {
      method: "POST",
      body: JSON.stringify(this.withRuntimeContext(params))
    });
  }

  private queryParams(params: GetPortraitParams): URLSearchParams {
    const query = new URLSearchParams({
      user_id: params.user_id,
      game_context_id: params.game_context_id
    });
    if (this.scenario) query.set("scenario", this.scenario);
    if (this.characterConfig) {
      query.set("character_config_id", this.characterConfig.characterConfigId);
      query.set("character_name", this.characterConfig.characterName);
      query.set("self_reference", this.characterConfig.selfReference);
      query.set("user_addressing", this.characterConfig.userAddressing);
      query.set("tone", this.characterConfig.tone);
      query.set("persona_version", this.characterConfig.personaVersion);
    }
    return query;
  }

  private withRuntimeContext<T extends object>(payload: T): T & { scenario?: PortraitScenario; character_config?: CharacterConfig } {
    return {
      ...payload,
      ...(this.scenario ? { scenario: this.scenario } : {}),
      ...(this.characterConfig ? { character_config: this.characterConfig } : {})
    };
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
      throw new PortraitServiceError("星图暂时没有展开，稍后再看。", response.status === 404 ? "not_found" : "network_failed");
    }

    return response.json() as Promise<T>;
  }
}
