import type { CharacterConfig } from "../types";
import { demoCharacterConfig } from "../characterConfig";
import { mockCharacterResonance, mockMoreDiscoveries, mockPortrait, mockPortraitNodes } from "./mockPortraitData";
import { portraitAssets } from "./portraitAssets";
import type { PortraitService } from "./PortraitService";
import { PortraitServiceError } from "./PortraitService";
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
  PortraitPetReaction,
  PortraitScenario,
  PortraitSoftDeleteResponse,
  PromoteDiscoveryInput,
  PromoteDiscoveryResponse,
  ReorganizePortraitResponse,
  UserPortraitResponse
} from "./types";

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso(): string {
  return new Date().toISOString();
}

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class MockPortraitService implements PortraitService {
  private nodes: PortraitNode[] = deepClone(mockPortraitNodes);
  private discoveries: PortraitNode[] = deepClone(mockMoreDiscoveries);
  private resonance: CharacterResonance = deepClone(mockCharacterResonance);
  private characterConfig: CharacterConfig = demoCharacterConfig;
  private scenario: PortraitScenario = "normal";
  private consecutiveDislikes = 0;

  setScenario(scenario: PortraitScenario): void {
    this.scenario = scenario;
    this.nodes = deepClone(mockPortraitNodes);
    this.discoveries = deepClone(mockMoreDiscoveries);
    this.resonance = deepClone(mockCharacterResonance);
    this.consecutiveDislikes = 0;
  }

  setCharacterConfig(characterConfig: CharacterConfig): void {
    this.characterConfig = characterConfig;
  }

  async getPortrait(params: GetPortraitParams): Promise<UserPortraitResponse> {
    this.assertParams(params);
    if (this.isScenario("load_failed", "portrait_load_failed")) {
      throw new PortraitServiceError("星图暂时没有展开。", "network_failed");
    }

    const activeNodes = this.activeNodesForScenario();
    const missingStarterCount = activeNodes.filter((node) => node.status === "required_empty").length;
    return {
      ...deepClone(mockPortrait),
      user_id: params.user_id,
      game_context_id: params.game_context_id,
      nodes: activeNodes,
      more_discovery_count: this.moreDiscoveriesForScenario().length,
      new_discovery_count: [...activeNodes, ...this.moreDiscoveriesForScenario()].filter((node) => node.status === "new_discovery").length,
      updated_node_count: this.entryUpdateCount(activeNodes),
      bubble: this.isScenario("bubble_closed", "portrait_bubble_disabled")
        ? null
        : missingStarterCount > 0
          ? {
            bubble_id: "portrait_bubble_required_starters",
            text: `先把 ${missingStarterCount} 颗基础星星补上吧，{{selfReference}}就能更稳地认识{{userAddressing}}啦。`,
            emotion: "shy",
            is_closed: false
          }
          : { ...mockPortrait.bubble!, is_closed: false },
      character_config: this.characterConfig,
      character_resonance: this.resonanceForScenario(),
      generated_at: nowIso()
    };
  }

  async getPortraitNode(nodeId: string, params: GetPortraitParams): Promise<PortraitNode> {
    this.assertParams(params);
    return deepClone(this.findActiveNode(nodeId));
  }

  async updatePortraitNode(
    nodeId: string,
    params: GetPortraitParams,
    patch: PortraitNodeUpdatePatch
  ): Promise<PortraitNodeUpdateResponse> {
    this.assertParams(params);
    if (this.isScenario("edit_save_failed", "user_operation_edit_conflict")) {
      throw new PortraitServiceError("这张纸条暂时贴不稳。", "network_failed");
    }
    if (!patch.value.trim()) {
      throw new PortraitServiceError("画像纸条不能为空。", "invalid_request");
    }

    const node = this.findActiveNode(nodeId);
    if (!node.editable || !node.available_actions.includes("edit")) {
      throw new PortraitServiceError("这张纸条暂时不能改。", "invalid_request");
    }

    node.value = patch.value.trim().slice(0, 80);
    node.status = "user_edited";
    if (node.available_actions.length === 2 && node.available_actions.includes("focus") && node.available_actions.includes("edit")) {
      node.available_actions = ["focus", "edit", "like", "dislike"];
    }
    node.source_summary = {
      label: "来自你亲自贴上的纸条",
      source_ids: [`user_edit_${node.node_id}`],
      confidence: "user_confirmed",
      privacy_boundary: "summary_only"
    };
    node.node_version += 1;
    node.updated_at = nowIso();
    node.user_edited_at = node.updated_at;

    return {
      node: deepClone(node),
      pet_reaction: this.reaction("portrait_node_edited", "{{selfReference}}记住啦，这张纸条以后按你写的来。", "excited", "happy_bounce")
    };
  }

  async feedbackPortraitNode(input: FeedbackPortraitNodeInput): Promise<PortraitFeedbackResponse> {
    this.assertParams(input);
    const node = this.findActiveNode(input.node_id);
    const wasLiked = node.status === "liked";
    const wasRejected = node.status === "rejected";
    node.status = input.value === "like"
      ? wasLiked ? "stable" : "liked"
      : wasRejected ? "stable" : "rejected";
    node.updated_at = nowIso();
    this.consecutiveDislikes = input.value === "not_accurate"
      ? node.status === "rejected" ? this.consecutiveDislikes + 1 : Math.max(0, this.consecutiveDislikes - 1)
      : 0;

    const reaction = input.value === "like"
      ? node.status === "stable"
        ? this.reaction("portrait_feedback_like_removed", "{{selfReference}}把这颗先放回普通星星里。", "gentle", "nod")
        : this.reaction("portrait_feedback_liked", "{{selfReference}}收到这枚小印章啦，会更相信这张纸条。", "excited", "happy_bounce")
      : node.status === "stable"
        ? this.reaction("portrait_feedback_dislike_removed", "{{selfReference}}知道啦，这颗先不标成不像。", "gentle", "nod")
        : this.consecutiveDislikes >= 2 || this.isScenario("consecutive_dislike", "node_focus_consecutive_unlike")
          ? this.reaction("portrait_feedback_disliked", "{{selfReference}}会把这类判断放轻一点，先不急着贴死。", "thinking", "thinking_loop")
          : this.reaction("portrait_feedback_disliked", "{{selfReference}}知道啦，这张纸条可能还不太准。", "thinking", "thinking_loop");

    return {
      feedback_id: nextId("portrait_feedback"),
      node_id: node.node_id,
      value: input.value,
      current_status: node.status,
      pet_reaction: reaction
    };
  }

  async softDeletePortraitNode(nodeId: string, params: GetPortraitParams): Promise<PortraitSoftDeleteResponse> {
    this.assertParams(params);
    const node = this.findActiveNode(nodeId);
    if (!node.deletable) {
      throw new PortraitServiceError("这张纸条不能从星图上摘下。", "invalid_request");
    }
    const inactiveAt = nowIso();
    node.is_active = false;
    node.inactive_reason = "user_deleted";
    node.updated_at = inactiveAt;

    return {
      node_id: node.node_id,
      is_active: false,
      inactive_reason: "user_deleted",
      inactive_at: inactiveAt,
      evidence_reuse_allowed: false,
      pet_reaction: this.reaction("portrait_node_removed", "{{selfReference}}把它收起来了，不会再拿它判断你。", "gentle", "nod")
    };
  }

  async getMoreDiscoveries(params: GetMoreDiscoveriesParams): Promise<MoreDiscoveriesResponse> {
    this.assertParams(params);
    if (this.isScenario("more_failed", "more_discoveries_load_failed")) {
      throw new PortraitServiceError("夹层暂时翻不开。", "network_failed");
    }

    const pageSize = Math.min(Math.max(Math.floor(params.page_size || 1), 1), 10);
    const page = Math.max(1, Math.floor(params.page || 1));
    const discoveries = this.moreDiscoveriesForScenario();
    const start = (page - 1) * pageSize;
    const items = discoveries.slice(start, start + pageSize);

    return {
      items: deepClone(items),
      pagination: {
        page,
        page_size: pageSize,
        total: discoveries.length,
        has_next: start + pageSize < discoveries.length
      }
    };
  }

  async promoteDiscovery(input: PromoteDiscoveryInput): Promise<PromoteDiscoveryResponse> {
    this.assertParams(input);
    const discovery = this.discoveries.find((node) => node.node_id === input.discovery_id && node.is_active);
    if (!discovery) {
      throw new PortraitServiceError("这张小纸条找不到了。", "not_found");
    }

    const duplicate = this.nodes.find((node) => node.is_active && node.category === discovery.category && node.value === discovery.value);
    if (duplicate) {
      discovery.is_active = false;
      discovery.inactive_reason = "user_deleted";
      duplicate.status = "recent_update";
      duplicate.updated_at = nowIso();
      return {
        status: "duplicate_merged",
        node: deepClone(duplicate),
        pet_reaction: this.reaction("portrait_discovery_promoted", "{{selfReference}}把相似的小纸条合在一起啦。", "gentle", "nod")
      };
    }

    if (this.nodes.filter((node) => node.is_active).length >= 18) {
      return {
        status: "main_full",
        node: null,
        pet_reaction: this.reaction("portrait_discovery_full", "主星图已经有点满了，{{selfReference}}先把它放回夹层。", "thinking", "thinking_loop")
      };
    }

    discovery.is_active = false;
    discovery.inactive_reason = "user_deleted";
    const promoted: PortraitNode = {
      ...deepClone(discovery),
      node_id: discovery.node_id.replace("discovery", "node_promoted"),
      is_active: true,
      inactive_reason: null,
      status: "new_discovery",
      available_actions: ["focus", "edit", "like", "dislike", "soft_delete"],
      updated_at: nowIso()
    };
    this.nodes.push(promoted);

    return {
      status: "promoted",
      node: deepClone(promoted),
      pet_reaction: this.reaction("portrait_discovery_promoted", "{{selfReference}}把这张纸条贴回主星图啦。", "excited", "wave")
    };
  }

  async getCharacterResonance(params: GetPortraitParams): Promise<CharacterResonance> {
    this.assertParams(params);
    return deepClone(this.resonanceForScenario());
  }

  async reassessCharacterResonance(params: GetPortraitParams): Promise<CharacterResonance> {
    this.assertParams(params);
    this.resonance = {
      ...this.resonanceForScenario(),
      status: this.scenario === "resonance_failed" ? "failed" : "measuring",
      updated_at: nowIso()
    };

    if (this.isScenario("resonance_failed", "resonance_service_unavailable")) {
      return deepClone(this.resonance);
    }

    this.resonance = {
      ...deepClone(mockCharacterResonance),
      character_name: "勇气织梦者",
      role_type: "探索 / 支援 / 稳定收尾",
      role_asset: portraitAssets.resonanceBraveFighter,
      resonance_points: ["会先保护节奏，再往前走", "越到收尾越认真", "不喜欢被催，但愿意被温柔提醒"],
      updated_at: nowIso()
    };
    return deepClone(this.resonance);
  }

  async reorganizePortrait(params: GetPortraitParams): Promise<ReorganizePortraitResponse> {
    this.assertParams(params);
    if (this.scenario === "reorganize_failed") {
      throw new PortraitServiceError("星图暂时没整理好。", "network_failed");
    }

    this.nodes = this.nodes.map((node, index) => ({
      ...node,
      position: {
        x: Math.max(12, Math.min(88, node.position.x + (index % 2 === 0 ? 1.5 : -1.5))),
        y: Math.max(12, Math.min(88, node.position.y + (index % 3 === 0 ? -1 : 1)))
      },
      updated_at: nowIso()
    }));

    return {
      portrait: await this.getPortrait(params),
      pet_reaction: this.reaction("portrait_reorganized", "{{selfReference}}把星图轻轻整理了一下，没动你亲自贴过的边界。", "writing", "writing_loop")
    };
  }

  private activeNodesForScenario(): PortraitNode[] {
    if (this.isScenario("empty", "portrait_no_portrait")) return this.emptyStarterNodes();
    if (this.isScenario("low_data", "portrait_low_data")) return this.completedStarterNodes();
    return this.nodes.filter((node) => node.is_active);
  }

  private entryUpdateCount(nodes: PortraitNode[]): number {
    return nodes.filter((node) => node.status === "new_discovery" || node.status === "recent_update").length;
  }

  private completedStarterNodes(): PortraitNode[] {
    const requiredCategories = new Set<PortraitNode["category"]>(["name", "relationship", "diary_preference"]);
    return this.nodes
      .filter((node) => node.is_active && requiredCategories.has(node.category))
      .map((node) => ({
        ...node,
        status: node.status === "new_discovery" || node.status === "required_empty" ? "stable" : node.status,
        available_actions: node.available_actions.filter((action) => action !== "soft_delete" && action !== "move_to_main")
      }));
  }

  private emptyStarterNodes(): PortraitNode[] {
    const requiredCategories = new Set<PortraitNode["category"]>(["name", "relationship", "diary_preference"]);
    return this.nodes
      .filter((node) => node.is_active && requiredCategories.has(node.category))
      .map((node) => {
        if (node.status === "user_edited") return node;
        const sourceLabel = node.category === "name"
          ? "需要你先告诉小绒怎么称呼你"
          : node.category === "relationship"
            ? "需要你先告诉小绒你想要怎样的陪伴关系"
            : "需要你先告诉小绒喜欢怎样的小日记";
        return {
          ...node,
          value: "",
          pet_explanation: "这颗是小绒认识你前最基础的小星星。你亲手写下后，小绒会按你的说法来理解。",
          source_summary: {
            label: sourceLabel,
            source_ids: [],
            confidence: "low",
            privacy_boundary: "summary_only"
          },
          status: "required_empty",
          available_actions: ["focus", "edit"]
        } satisfies PortraitNode;
      });
  }

  private moreDiscoveriesForScenario(): PortraitNode[] {
    if (this.isScenario("more_empty", "more_discoveries_empty", "empty", "portrait_no_portrait", "low_data", "portrait_low_data")) return [];
    return this.discoveries.filter((node) => node.is_active);
  }

  private resonanceForScenario(): CharacterResonance {
    const resonance = deepClone(this.resonance);
    if (this.isScenario("resonance_unmeasured", "resonance_not_measured")) {
      return { ...resonance, status: "unmeasured", character_name: "还没有测定", role_type: "等待星图更完整", role_asset: portraitAssets.resonanceSilhouette, resonance_points: [] };
    }
    if (this.isScenario("resonance_insufficient", "resonance_insufficient_data", "resonance_authorization_unmet", "low_data", "portrait_low_data")) {
      if (this.scenario === "resonance_authorization_unmet") {
        return {
          ...resonance,
          status: "authorization_unmet",
          character_name: "授权还没打开",
          role_type: "需要先到设置页开启授权",
          role_asset: portraitAssets.resonanceSilhouette,
          resonance_points: []
        };
      }
      return { ...resonance, status: "insufficient_data", character_name: "线索还不够", role_type: "先收集更多陪伴片段", role_asset: portraitAssets.resonanceSilhouette, resonance_points: [] };
    }
    if (this.scenario === "resonance_measuring") {
      return { ...resonance, status: "measuring", character_name: "测定中", role_type: "星图正在整理", role_asset: portraitAssets.resonanceSilhouette, resonance_points: [] };
    }
    if (this.isScenario("resonance_failed", "resonance_service_unavailable")) {
      return { ...resonance, status: "failed", character_name: "这次没测准", role_type: "先不展示结果", role_asset: portraitAssets.resonanceSilhouette, resonance_points: [] };
    }
    if (this.isScenario("asset_missing", "asset_character_image_missing", "resonance_character_config_missing")) {
      return { ...resonance, status: "asset_missing", role_asset: portraitAssets.resonanceSilhouette };
    }
    if (this.scenario === "resonance_user_rejected") {
      return { ...resonance, feedback_value: "not_accurate" };
    }
    if (this.scenario === "resonance_expired") {
      return {
        ...resonance,
        status: "expired",
        updated_at: "2026-05-10T08:00:00.000Z"
      };
    }
    return resonance;
  }

  private isScenario(...scenarios: PortraitScenario[]): boolean {
    return scenarios.includes(this.scenario);
  }

  private findActiveNode(nodeId: string): PortraitNode {
    const node = [...this.nodes, ...this.discoveries].find((item) => item.node_id === nodeId && item.is_active);
    if (!node) throw new PortraitServiceError("这张画像纸条找不到了。", "not_found");
    return node;
  }

  private assertParams(params: GetPortraitParams): void {
    if (!params.user_id || !params.game_context_id) {
      throw new PortraitServiceError("画像请求缺少必要边界。", "invalid_request");
    }
  }

  private reaction(
    scene: PortraitPetReaction["scene"],
    reactionText: string,
    emotion: string,
    action: PortraitPetReaction["action"]
  ): PortraitPetReaction {
    return {
      reaction_id: nextId("portrait_reaction"),
      scene,
      reaction_text: reactionText,
      emotion,
      action,
      should_speak: true,
      created_at: nowIso()
    };
  }
}
