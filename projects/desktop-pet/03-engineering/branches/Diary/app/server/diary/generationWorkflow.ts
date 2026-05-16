import type { LLMProvider } from "../../src/diary/llm/LLMProvider";
import type { GenerateDiaryInput, GenerateDiaryResponse } from "../../src/diary/types";

export interface DiaryGenerationRepository {
  hasActiveDiaryForPhysiologicalDay(userId: string, gameContextId: string, physiologicalDayId: string): Promise<boolean>;
  persistGeneratedDiary(input: GenerateDiaryInput, draft: Awaited<ReturnType<LLMProvider["generateDiaryDraft"]>>): Promise<{
    diary_id: string;
    visible_date: string;
    visible_after_at: string;
  }>;
}

export async function generateDiaryForPhysiologicalDay(
  input: GenerateDiaryInput,
  provider: LLMProvider,
  repository: DiaryGenerationRepository
): Promise<GenerateDiaryResponse> {
  const duplicate = await repository.hasActiveDiaryForPhysiologicalDay(
    input.user_id,
    input.game_context_id,
    input.day_window.physiological_day_id
  );

  if (duplicate) return failure(input, "duplicate_day");

  const authorizedSources = input.source_candidates.filter((source) => input.consent_snapshot[source.source_type]);
  if (input.day_window.effective_session_minutes < 30 || authorizedSources.length === 0) {
    return failure(input, "insufficient_evidence", "skipped");
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const draft = await provider.generateDiaryDraft({
      ...input,
      source_candidates: authorizedSources
    });
    const quality = await provider.checkDiaryQuality({
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

    if (quality.quality_result === "pass") {
      const persisted = await repository.persistGeneratedDiary(input, draft);
      return {
        diary_id: persisted.diary_id,
        physiological_day_id: input.day_window.physiological_day_id,
        diary_date: input.day_window.diary_date,
        generation_status: "generated",
        failure_reason: null,
        source_ids: draft.source_ids,
        visible_date: persisted.visible_date,
        visible_after_at: persisted.visible_after_at
      };
    }
  }

  return failure(input, "quality_blocked");
}

function failure(
  input: GenerateDiaryInput,
  reason: GenerateDiaryResponse["failure_reason"],
  status: GenerateDiaryResponse["generation_status"] = "failed"
): GenerateDiaryResponse {
  return {
    diary_id: null,
    physiological_day_id: input.day_window.physiological_day_id,
    diary_date: input.day_window.diary_date,
    generation_status: status,
    failure_reason: reason,
    source_ids: [],
    visible_date: null,
    visible_after_at: null
  };
}
