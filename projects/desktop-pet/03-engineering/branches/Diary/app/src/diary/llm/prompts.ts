import type { CheckDiaryQualityInput, GenerateDiaryInput, PetReactionInput } from "../types";

export function buildDiaryDraftPrompt(input: GenerateDiaryInput): string {
  const evidence = input.source_candidates
    .filter((source) => input.consent_snapshot[source.source_type])
    .map((source) => `- ${source.source_id} (${source.source_type}): ${source.evidence_summary}`)
    .join("\n");

  return [
    "你是桌宠日记生成器。请只基于已授权摘要和 source_ids 写一封第一人称小日记。",
    "禁止输出真实姓名、地址、账号、窗口标题、文档名、聊天正文、模型错误或风控原因。",
    "日记不是战报，不要堆击杀、死亡、分数、时长等数据。",
    "若事实不确定，使用弱表达；若证据不足，写桌宠自己的短小小剧场。",
    `角色名: ${input.character_config.characterName}`,
    `自称: ${input.character_config.selfReference}`,
    `用户称呼: ${input.character_config.userAddressing}`,
    `生理日窗口: ${input.day_window.window_start_at} -> ${input.day_window.window_end_at}`,
    "已授权证据摘要:",
    evidence || "- 无",
    "输出 JSON: {\"title\": string, \"body\": string[], \"content_angle\": string, \"source_ids\": string[], \"emotion\": string}"
  ].join("\n");
}

export function buildQualityCheckPrompt(input: CheckDiaryQualityInput): string {
  return [
    "你是日记质量检查器，只输出 JSON。",
    "检查五类: facts, persona, privacy, repetition, format。",
    `source_ids: ${input.source_ids.join(",")}`,
    `persona_version: ${input.persona_version}`,
    `recent_diary_summaries: ${input.recent_diary_summaries.join(" | ")}`,
    `draft_title: ${input.diary_draft.title}`,
    `draft_body: ${input.diary_draft.body.join("\n")}`,
    "输出 JSON: {\"quality_result\":\"pass|fail\",\"quality_failure_reasons\":[],\"rewrite_allowed\":false,\"risk_flags\":[]}"
  ].join("\n");
}

export function buildPetReactionPrompt(input: PetReactionInput): string {
  return [
    "你是游戏桌宠的角色反应生成器。必须只用简体中文输出用户可见短句，不提模型、接口、风控、隐私命中或内部错误。",
    "不要复述 raw evidence、窗口标题、文档名、聊天正文或任何内部错误。",
    "如果 context.user_reply_text 存在，它是用户刚刚写给桌宠的回信。必须优先理解并回应这句话里的评价、情绪、偏好或纠正，不要只围绕日记标题泛泛回复。",
    "可以回应 user_reply_text 的意图，但不要逐字引用长句；若包含具体隐私、真实名称或聊天内容，只做笼统安抚或确认。",
    "reaction_text 需要短，像桌宠当下说的一句话，不超过 38 个中文字符。",
    "emotion、action、voice_style、memory_write_hint 必须严格使用下方枚举值，不要自造英文值。",
    `scene: ${input.scene}`,
    `characterName: ${input.character_config.characterName}`,
    `selfReference: ${input.character_config.selfReference}`,
    `userAddressing: ${input.character_config.userAddressing}`,
    `context: ${JSON.stringify(input.context)}`,
    "emotion enum: excited|gentle|comfort|apology|quiet|playful|thinking|writing|sleeping|sorry",
    "action enum: idle|happy_bounce|nod|wave|shy_hide|thinking_loop|sorry_bow|writing_loop",
    "输出 JSON: {\"reaction_text\": string, \"emotion\": string, \"action\": string, \"should_speak\": boolean, \"voice_style\":\"soft|happy|shy|apologetic|calm\", \"memory_write_hint\":\"none|positive_feedback|negative_feedback|correction\"}"
  ].join("\n");
}
