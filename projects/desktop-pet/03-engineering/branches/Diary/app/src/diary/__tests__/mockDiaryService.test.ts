import { describe, expect, it, vi } from "vitest";
import { MockDiaryService } from "../api/mockDiaryService";

const userId = "user_demo";
const gameContextId = "game_ctx_demo";

describe("MockDiaryService", () => {
  it("returns mailbox in reverse chronological order with page size capped at 10", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({
      user_id: userId,
      game_context_id: gameContextId,
      page: 1,
      page_size: 99
    });

    expect(mailbox.pagination.page_size).toBe(10);
    expect(mailbox.items).toHaveLength(10);
    expect(mailbox.items[0].diary_date > mailbox.items[1].diary_date).toBe(true);
  });

  it("marks detail as read through state update", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    const unread = mailbox.items.find((item) => item.mailbox_status === "unread");
    expect(unread).toBeTruthy();

    const update = await service.updateDiaryState(unread!.diary_id, userId, {
      mailbox_status: "read",
      bubble_status: "opened",
      read_at: "2026-05-14T10:00:00+08:00"
    });

    expect(update.mailbox_status).toBe("read");
    expect(update.unread_count).toBe(mailbox.unread_count - 1);
  });

  it("does not expose rewrite in detail actions", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    const detail = await service.getDiaryDetail(mailbox.items[0].diary_id, userId);

    expect(detail.available_actions).toEqual(["reply", "like", "dislike", "favorite", "delete"]);
    expect(detail.available_actions).not.toContain("rewrite");
  });

  it("writes reply into mock memory boundary and returns safe pet reaction", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    const response = await service.submitDiaryReply(mailbox.items[0].diary_id, userId, "写得好可爱，我喜欢");

    expect(response.reply.long_term_memory_write_status).toBe("written");
    expect(response.reply.memory_source_id).toMatch(/^mock_memory_/);
    expect(response.pet_reaction.reaction_text).not.toMatch(/模型|接口|风控|隐私命中/);
  });

  it("passes the current user reply into the pet reaction context", async () => {
    const reactionRequests: Array<Record<string, unknown>> = [];
    vi.stubGlobal("fetch", async (_url: RequestInfo | URL, init?: RequestInit) => {
      reactionRequests.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return new Response(JSON.stringify({
        reaction_id: "reaction_llm",
        diary_id: "diary_1",
        reply_id: "reply_1",
        scene: "diary_reply",
        reaction_text: "小绒听见你的评价啦。",
        emotion: "gentle",
        action: "nod",
        should_speak: true,
        memory_write_hint: "correction",
        created_at: "2026-05-16T12:00:00+08:00"
      }), { status: 200 });
    });

    try {
      const service = new MockDiaryService();
      const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
      await service.submitDiaryReply(mailbox.items[0].diary_id, userId, "这封很可爱，但这里有点不准");

      const context = reactionRequests[0]?.context as Record<string, unknown>;
      expect(context.user_reply_text).toBe("这封很可爱，但这里有点不准");
      expect(context.reply_intent).toBe("correction");
      expect(context.user_reply_is_current_turn).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("routes chat bubble feedback and deletion through mock API boundary", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    const response = await service.submitDiaryReply(mailbox.items[0].diary_id, userId, "这句我喜欢");

    const feedback = await service.submitChatBubbleFeedback("pet_reaction", response.pet_reaction.reaction_id, 1);
    expect(feedback.target_type).toBe("pet_reaction");
    expect(feedback.target_id).toBe(response.pet_reaction.reaction_id);
    expect(feedback.current_feedback.value).toBe(1);
    expect(feedback.current_feedback.source).toBe("bubble_action");

    const hidden = await service.deleteChatBubble("user_reply", response.reply.reply_id);
    expect(hidden.target_type).toBe("user_reply");
    expect(hidden.target_id).toBe(response.reply.reply_id);
    expect(hidden.is_hidden).toBe(true);
  });

  it("soft deletes by deactivating diary and removing it from future list/detail", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    const target = mailbox.items[0];
    const result = await service.softDeleteDiary(target.diary_id, userId);

    expect(result.is_active).toBe(false);
    expect(result.inactive_reason).toBe("user_deleted");
    expect(result.evidence_reuse_allowed).toBe(false);

    const nextMailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    expect(nextMailbox.items.some((item) => item.diary_id === target.diary_id)).toBe(false);
    await expect(service.getDiaryDetail(target.diary_id, userId)).rejects.toThrow();
  });

  it("blocks privacy-risk quality check text", async () => {
    const service = new MockDiaryService();
    const result = await service.checkDiaryQuality({
      diary_draft: {
        title: "不该展示的内容",
        body: ["这里出现了窗口标题和文档名。"],
        content_angle: "daily_observation",
        source_ids: ["src_001"],
        emotion: "gentle"
      },
      source_ids: ["src_001"],
      persona_version: "demo-v1",
      privacy_rules: {
        forbid_real_name: true,
        forbid_private_title: true,
        forbid_third_party_body: true
      },
      recent_diary_summaries: []
    });

    expect(result.quality_result).toBe("fail");
    expect(result.quality_failure_reasons).toContain("privacy");
  });

  it("covers PRD exception scenarios with safe mailbox states", async () => {
    const service = new MockDiaryService();
    const scenarios = [
      ["low_evidence", "no_new_today"],
      ["privacy_blocked", "quality_blocked"],
      ["clock_rollback", "no_new_today"],
      ["future_time_jump", "no_new_today"],
      ["quality_blocked", "quality_blocked"],
      ["no_new_today", "no_new_today"]
    ] as const;

    for (const [scenario, emptyState] of scenarios) {
      service.setScenario(scenario);
      const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });

      expect(mailbox.empty_state_type).toBe(emptyState);
      expect(mailbox.unread_count).toBe(0);
      expect(mailbox.items.every((item) => item.mailbox_status === "read")).toBe(true);
    }

    service.setScenario("generation_failed");
    const failedMailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    expect(failedMailbox.empty_state_type).toBe("generation_failed");
    expect(failedMailbox.items).toHaveLength(0);
  });

  it("simulates feedback and state update write failures through the service boundary", async () => {
    const service = new MockDiaryService();
    const mailbox = await service.getMailbox({ user_id: userId, game_context_id: gameContextId, page: 1, page_size: 10 });
    const target = mailbox.items[0];

    service.setScenario("feedback_fails");
    await expect(service.submitDiaryFeedback(target.diary_id, 1, null, "button")).rejects.toThrow("这次反馈暂时没记好");

    const feedback = await service.submitDiaryFeedback(target.diary_id, 1, null, "button");
    expect(feedback.current_feedback.value).toBe(1);

    service.setScenario("state_update_fails");
    await expect(service.updateDiaryState(target.diary_id, userId, { is_favorited: true })).rejects.toThrow("这枚小贴纸暂时没贴稳");

    const update = await service.updateDiaryState(target.diary_id, userId, { is_favorited: true });
    expect(update.is_favorited).toBe(true);
  });
});
