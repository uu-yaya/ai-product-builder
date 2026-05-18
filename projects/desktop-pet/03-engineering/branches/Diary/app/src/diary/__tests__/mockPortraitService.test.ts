import { describe, expect, it } from "vitest";
import { MockPortraitService } from "../userPortrait/mockPortraitService";

const params = { user_id: "user_demo", game_context_id: "game_ctx_demo" };

describe("MockPortraitService", () => {
  it("returns a complete portrait star map with discovery counts", async () => {
    const service = new MockPortraitService();
    const portrait = await service.getPortrait(params);

    expect(portrait.title).toBe("桌宠眼中的我");
    expect(portrait.nodes.length).toBeGreaterThanOrEqual(17);
    expect(portrait.more_discovery_count).toBeGreaterThan(0);
    expect(portrait.new_discovery_count).toBeGreaterThan(0);
    expect(portrait.updated_node_count).toBe(
      portrait.nodes.filter((node) => node.status === "new_discovery" || node.status === "recent_update").length
    );
  });

  it("persists user-edited nodes with user confirmed source boundary", async () => {
    const service = new MockPortraitService();
    const response = await service.updatePortraitNode("portrait_node_goal", params, {
      value: "先把今天的一小步完成",
      source: "user_edit"
    });

    expect(response.node.value).toBe("先把今天的一小步完成");
    expect(response.node.status).toBe("user_edited");
    expect(response.node.source_summary.privacy_boundary).toBe("summary_only");
    expect(response.node.source_summary.confidence).toBe("user_confirmed");
  });

  it("soft deletes nodes without leaving them in the active portrait", async () => {
    const service = new MockPortraitService();
    const deleted = await service.softDeletePortraitNode("portrait_node_stuck", params);
    const portrait = await service.getPortrait(params);

    expect(deleted.is_active).toBe(false);
    expect(deleted.inactive_reason).toBe("user_deleted");
    expect(deleted.evidence_reuse_allowed).toBe(false);
    expect(portrait.nodes.some((node) => node.node_id === "portrait_node_stuck")).toBe(false);
  });

  it("exposes portrait node actions from the PRD-backed service boundary", async () => {
    const service = new MockPortraitService();
    const portrait = await service.getPortrait(params);
    const nameNode = portrait.nodes.find((node) => node.node_id === "portrait_node_name");
    const dynamicNode = portrait.nodes.find((node) => node.node_id === "portrait_node_dynamic");
    const discoveries = await service.getMoreDiscoveries({ ...params, page: 1, page_size: 10 });

    expect(nameNode?.available_actions).toEqual(["focus", "edit", "like", "dislike"]);
    expect(nameNode?.deletable).toBe(false);
    expect(dynamicNode?.available_actions).toContain("soft_delete");
    expect(discoveries.items[0].available_actions).toContain("move_to_main");
    expect(discoveries.items[0].available_actions).toContain("soft_delete");
  });

  it("promotes one discovery back to the main star map through the service boundary", async () => {
    const service = new MockPortraitService();
    const discoveries = await service.getMoreDiscoveries({ ...params, page: 1, page_size: 10 });
    const promoted = await service.promoteDiscovery({ ...params, discovery_id: discoveries.items[0].node_id });

    expect(promoted.status).toMatch(/promoted|main_full|duplicate_merged/);
    expect(promoted.pet_reaction.should_speak).toBe(true);
  });

  it("supports exception scenarios for the prototype board", async () => {
    const service = new MockPortraitService();
    service.setScenario("low_data");
    const portrait = await service.getPortrait(params);
    service.setScenario("more_empty");
    const discoveries = await service.getMoreDiscoveries({ ...params, page: 1, page_size: 10 });

    expect(portrait.nodes.map((node) => node.category)).toEqual(["name", "relationship", "diary_preference"]);
    expect(portrait.nodes.every((node) => node.status !== "required_empty")).toBe(true);
    expect(portrait.nodes.every((node) => node.value.length > 0)).toBe(true);
    expect(portrait.more_discovery_count).toBe(0);
    expect(portrait.new_discovery_count).toBe(0);
    expect(portrait.updated_node_count).toBe(0);
    expect(discoveries.items).toHaveLength(0);
  });

  it("shows required starter nodes instead of a blank page for first-time portraits", async () => {
    const service = new MockPortraitService();
    service.setScenario("portrait_no_portrait");
    const portrait = await service.getPortrait(params);

    expect(portrait.nodes.map((node) => node.category)).toEqual(["name", "relationship", "diary_preference"]);
    expect(portrait.nodes.every((node) => node.status === "required_empty")).toBe(true);
    expect(portrait.nodes.every((node) => node.value === "")).toBe(true);
    expect(portrait.nodes.every((node) => node.available_actions.join(",") === "focus,edit")).toBe(true);
    expect(portrait.bubble?.text).toContain("基础星星");
  });

  it("keeps expired and authorization-blocked resonance states distinct", async () => {
    const service = new MockPortraitService();

    service.setScenario("resonance_expired");
    const expired = await service.getCharacterResonance(params);
    expect(expired.status).toBe("expired");
    expect(expired.resonance_points.length).toBeGreaterThan(0);

    service.setScenario("resonance_authorization_unmet");
    const blocked = await service.getCharacterResonance(params);
    expect(blocked.status).toBe("authorization_unmet");
    expect(blocked.character_name).toContain("授权");
    expect(blocked.resonance_points).toHaveLength(0);
  });
});
