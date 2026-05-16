import { describe, expect, it } from "vitest";
import { FallbackLLMProvider } from "../llm/fallbackLLMProvider";
import { demoCharacterConfig } from "../characterConfig";
import { generateDiaryForPhysiologicalDay, type DiaryGenerationRepository } from "../../../server/diary/generationWorkflow";
import type { DiaryDraft, GenerateDiaryInput } from "../types";

function baseInput(): GenerateDiaryInput {
  return {
    user_id: "user_demo",
    game_context_id: "game_ctx_demo",
    user_timezone: "Asia/Shanghai",
    day_window: {
      physiological_day_id: "pday_test",
      diary_date: "2026-05-13",
      window_start_at: "2026-05-13T22:00:00+08:00",
      window_end_at: "2026-05-14T01:30:00+08:00",
      cutoff_reason: "night_shutdown",
      triggered_at: "2026-05-14T01:30:00+08:00",
      write_delay_buffer_seconds: 180,
      effective_session_minutes: 180
    },
    consent_snapshot: {
      game_event: true,
      game_session: false,
      idip_snapshot: false,
      episode: false,
      highlight_event: false,
      chat_summary: false,
      pet_interaction: true,
      authorized_desktop_context: false
    },
    source_candidates: [
      { source_id: "src_001", source_type: "game_event", evidence_summary: "用户完成一局胜利" }
    ],
    character_config: demoCharacterConfig,
    recent_diary_summaries: []
  };
}

describe("bounded diary generation workflow", () => {
  it("persists only after passing quality check", async () => {
    const repository: DiaryGenerationRepository = {
      hasActiveDiaryForPhysiologicalDay: async () => false,
      persistGeneratedDiary: async (_input, _draft: DiaryDraft) => ({
        diary_id: "diary_generated",
        visible_date: "2026-05-14",
        visible_after_at: "2026-05-14T08:30:00+08:00"
      })
    };

    const result = await generateDiaryForPhysiologicalDay(baseInput(), new FallbackLLMProvider(), repository);
    expect(result.generation_status).toBe("generated");
    expect(result.diary_id).toBe("diary_generated");
    expect(result.source_ids).toEqual(["src_001"]);
  });

  it("does not generate a second active diary for the same physiological day", async () => {
    const repository: DiaryGenerationRepository = {
      hasActiveDiaryForPhysiologicalDay: async () => true,
      persistGeneratedDiary: async () => {
        throw new Error("should not persist duplicate day");
      }
    };

    const result = await generateDiaryForPhysiologicalDay(baseInput(), new FallbackLLMProvider(), repository);
    expect(result.generation_status).toBe("failed");
    expect(result.failure_reason).toBe("duplicate_day");
  });

  it("skips low-evidence days without showing half-written diary", async () => {
    const input = baseInput();
    input.day_window.effective_session_minutes = 10;
    input.source_candidates = [];

    const repository: DiaryGenerationRepository = {
      hasActiveDiaryForPhysiologicalDay: async () => false,
      persistGeneratedDiary: async () => {
        throw new Error("should not persist insufficient evidence");
      }
    };

    const result = await generateDiaryForPhysiologicalDay(input, new FallbackLLMProvider(), repository);
    expect(result.generation_status).toBe("skipped");
    expect(result.failure_reason).toBe("insufficient_evidence");
    expect(result.diary_id).toBeNull();
  });
});
