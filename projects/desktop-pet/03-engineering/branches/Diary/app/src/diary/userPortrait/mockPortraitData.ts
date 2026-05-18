import { demoCharacterConfig } from "../characterConfig";
import { portraitAssets } from "./portraitAssets";
import type {
  CharacterResonance,
  PortraitNode,
  PortraitNodeAction,
  PortraitNodeCategory,
  PortraitNodeRing,
  PortraitNodeStatus,
  PortraitNodeVisualType,
  UserPortraitResponse
} from "./types";

const NOW = "2026-05-16T08:00:00.000Z";

function source(label: string, sourceIds: string[], confidence: "low" | "medium" | "high" | "user_confirmed" = "medium") {
  return {
    label,
    source_ids: sourceIds,
    confidence,
    privacy_boundary: "summary_only" as const
  };
}

function node(input: {
  id: string;
  category: PortraitNodeCategory;
  name: string;
  value: string;
  pet: string;
  label: string;
  sourceIds: string[];
  confidence?: "low" | "medium" | "high" | "user_confirmed";
  ring: PortraitNodeRing;
  x: number;
  y: number;
  visual?: PortraitNodeVisualType;
  status?: PortraitNodeStatus;
  editable?: boolean;
  deletable?: boolean;
  movable?: boolean;
}): PortraitNode {
  const deletableCategories = new Set<PortraitNodeCategory>([
    "dynamic_discovery",
    "stuck_point",
    "recent_achievement",
    "long_term_milestone",
    "social_preference"
  ]);
  const editable = input.editable ?? !["character_resonance", "more_discoveries"].includes(input.category);
  const deletable = input.deletable ?? deletableCategories.has(input.category);
  const actions: PortraitNodeAction[] = input.category === "more_discoveries"
    ? ["focus"]
    : input.category === "character_resonance"
      ? ["focus", "like", "dislike"]
      : ["focus", ...(editable ? ["edit" as const] : []), "like", "dislike", ...(deletable ? ["soft_delete" as const] : [])];

  if (input.movable) {
    actions.push("move_to_main");
  }

  return {
    node_id: input.id,
    category: input.category,
    display_name: input.name,
    value: input.value,
    pet_explanation: input.pet,
    source_summary: source(input.label, input.sourceIds, input.confidence),
    ring: input.ring,
    position: { x: input.x, y: input.y },
    visual_type: input.visual ?? "paper_tag",
    status: input.status ?? "stable",
    editable,
    deletable,
    is_active: true,
    inactive_reason: null,
    available_actions: [...actions],
    node_version: 1,
    updated_at: NOW,
    user_edited_at: input.confidence === "user_confirmed" ? NOW : null
  };
}

export const mockPortraitNodes: PortraitNode[] = [
  node({
    id: "portrait_node_name",
    category: "name",
    name: "称呼",
    value: "{{userAddressing}}",
    pet: "{{selfReference}}会用这个称呼靠近你。要是你想换一个，{{selfReference}}会马上记住。",
    label: "来自你在回信和设置里的称呼偏好",
    sourceIds: ["memory_alias_demo"],
    confidence: "user_confirmed",
    ring: "inner",
    x: 49,
    y: 18,
    visual: "seal"
  }),
  node({
    id: "portrait_node_relationship",
    category: "relationship",
    name: "关系",
    value: "低打扰的陪伴者",
    pet: "{{selfReference}}理解的关系，是安静在旁边，也能在你需要时认真回应。",
    label: "来自日记反馈和桌宠互动摘要",
    sourceIds: ["summary_pet_021", "reply_017"],
    ring: "inner",
    x: 69,
    y: 26
  }),
  node({
    id: "portrait_node_goal",
    category: "current_goal",
    name: "当前目标",
    value: "把每天的小进步留下来",
    pet: "{{selfReference}}看到你会更喜欢被温柔地提醒，而不是被催着完成。",
    label: "来自近期目标摘要",
    sourceIds: ["goal_summary_006"],
    ring: "middle",
    x: 78,
    y: 43,
    status: "recent_update"
  }),
  node({
    id: "portrait_node_companion",
    category: "companion_preference",
    name: "陪伴偏好",
    value: "先听，再轻轻回应",
    pet: "{{selfReference}}会少一点抢话，多一点等你说完。",
    label: "来自回信语气反馈",
    sourceIds: ["reply_013", "reply_018"],
    ring: "middle",
    x: 71,
    y: 62
  }),
  node({
    id: "portrait_node_diary",
    category: "diary_preference",
    name: "日记偏好",
    value: "喜欢具体的小片段",
    pet: "比起大段总结，{{selfReference}}会优先写一个能被想起的瞬间。",
    label: "来自喜欢/收藏状态",
    sourceIds: ["diary_20260513", "feedback_like_002"],
    ring: "outer",
    x: 57,
    y: 76,
    visual: "polaroid",
    status: "liked"
  }),
  node({
    id: "portrait_node_play_style",
    category: "play_style",
    name: "玩法风格",
    value: "谨慎试探，再稳定推进",
    pet: "{{selfReference}}发现你不是不敢冒险，是更喜欢先看清节奏。",
    label: "来自游戏事件摘要",
    sourceIds: ["game_style_044"],
    ring: "middle",
    x: 35,
    y: 75,
    visual: "paper_tag"
  }),
  node({
    id: "portrait_node_practice",
    category: "practice_stage",
    name: "练习阶段",
    value: "正在熟悉新节奏",
    pet: "这不是卡住，是正在长出新的手感。{{selfReference}}会把变化慢慢记下来。",
    label: "来自近七日会话摘要",
    sourceIds: ["session_week_020"],
    ring: "middle",
    x: 20,
    y: 61
  }),
  node({
    id: "portrait_node_preferred_character",
    category: "preferred_character",
    name: "偏好角色",
    value: "偏爱有守护感的角色",
    pet: "{{selfReference}}会先用类型记住，不会把你锁死在某个名字里。",
    label: "来自选择和停留摘要",
    sourceIds: ["role_pref_009"],
    ring: "outer",
    x: 18,
    y: 41,
    visual: "polaroid"
  }),
  node({
    id: "portrait_node_mode",
    category: "mode_preference",
    name: "模式偏好",
    value: "短局、轻目标、可暂停",
    pet: "{{selfReference}}会把容易打断你的安排放轻一点。",
    label: "来自使用时段和模式摘要",
    sourceIds: ["mode_summary_012"],
    ring: "outer",
    x: 28,
    y: 26
  }),
  node({
    id: "portrait_node_avoid",
    category: "avoid_topic",
    name: "避聊话题",
    value: "不展开敏感私人细节",
    pet: "{{selfReference}}只会记边界，不会把不该写的东西放进信里。",
    label: "来自隐私偏好边界",
    sourceIds: ["privacy_boundary_001"],
    confidence: "user_confirmed",
    ring: "inner",
    x: 41,
    y: 31,
    visual: "stamp"
  }),
  node({
    id: "portrait_node_stuck",
    category: "stuck_point",
    name: "卡点",
    value: "容易在最后一步犹豫",
    pet: "{{selfReference}}不会说你拖延，只会提醒你已经走到很近的地方了。",
    label: "来自近期行为摘要",
    sourceIds: ["friction_005"],
    ring: "middle",
    x: 60,
    y: 37,
    status: "low_signal"
  }),
  node({
    id: "portrait_node_recent_win",
    category: "recent_achievement",
    name: "近期成就",
    value: "完成了一次漂亮收尾",
    pet: "{{selfReference}}把它贴在这里，因为这件小事值得被看见。",
    label: "来自 2026-05-13 日记摘要",
    sourceIds: ["diary_20260513"],
    ring: "outer",
    x: 84,
    y: 70,
    visual: "polaroid",
    status: "new_discovery"
  }),
  node({
    id: "portrait_node_milestone",
    category: "long_term_milestone",
    name: "长期里程碑",
    value: "连续整理 12 封小信",
    pet: "{{selfReference}}知道这不只是数量，是你们一起留下来的路标。",
    label: "来自 Diary mailbox 汇总",
    sourceIds: ["mailbox_total_012"],
    ring: "outer",
    x: 82,
    y: 20,
    visual: "seal"
  }),
  node({
    id: "portrait_node_social",
    category: "social_preference",
    name: "社交偏好",
    value: "偏好小范围、熟悉的人",
    pet: "{{selfReference}}会把热闹写成背景，不会把你推到人群中央。",
    label: "来自社交摘要",
    sourceIds: ["social_summary_003"],
    ring: "middle",
    x: 16,
    y: 78
  }),
  node({
    id: "portrait_node_resonance",
    category: "character_resonance",
    name: "我像哪位角色",
    value: "暖光法师型",
    pet: "{{selfReference}}觉得你像会先照亮一小块地方的人。",
    label: "来自画像节点聚合测定",
    sourceIds: ["resonance_001"],
    ring: "inner",
    x: 50,
    y: 86,
    visual: "seal"
  }),
  node({
    id: "portrait_node_dynamic",
    category: "dynamic_discovery",
    name: "动态发现",
    value: "最近更愿意主动表达喜欢",
    pet: "{{selfReference}}看到你在回信里多说了一点点真心话。",
    label: "来自近三次回信摘要",
    sourceIds: ["reply_016", "reply_017", "reply_018"],
    ring: "middle",
    x: 33,
    y: 13,
    status: "new_discovery"
  }),
  node({
    id: "portrait_node_more",
    category: "more_discoveries",
    name: "更多发现",
    value: "还有 7 颗小星星",
    pet: "这些还不急着贴上主星图。{{selfReference}}先放在信封夹层里，等你确认。",
    label: "来自未确认画像发现池",
    sourceIds: ["discovery_pool_001"],
    ring: "outer",
    x: 87,
    y: 48,
    visual: "pocket",
    status: "new_discovery",
    editable: false,
    deletable: false
  })
];

export const mockMoreDiscoveries: PortraitNode[] = [
  node({
    id: "portrait_discovery_old_mode",
    category: "dynamic_discovery",
    name: "以前常玩的模式",
    value: "曾经常玩排位",
    pet: "{{selfReference}}先把它当作小纸条，等你点头再贴上去。",
    label: "来自历史模式摘要",
    sourceIds: ["mode_history_002"],
    ring: "middle",
    x: 32,
    y: 28,
    status: "new_discovery",
    deletable: true,
    movable: true
  }),
  node({
    id: "portrait_discovery_weekday",
    category: "companion_preference",
    name: "周中习惯",
    value: "夜晚短局",
    pet: "这张纸条提醒{{selfReference}}，不要把关心说得太响。",
    label: "来自时段和会话摘要",
    sourceIds: ["weekday_pattern_004"],
    ring: "middle",
    x: 70,
    y: 33,
    status: "low_signal",
    deletable: true,
    movable: true
  }),
  node({
    id: "portrait_discovery_rare_win",
    category: "recent_achievement",
    name: "罕见高光时刻",
    value: "五杀一次",
    pet: "{{selfReference}}先不把它写成定义，只把这颗亮亮的小星星收好。",
    label: "来自高光事件摘要",
    sourceIds: ["highlight_rare_001"],
    ring: "middle",
    x: 38,
    y: 70,
    status: "recent_update",
    deletable: true,
    movable: true
  }),
  node({
    id: "portrait_discovery_music",
    category: "companion_preference",
    name: "背景音偏好",
    value: "关 BGM",
    pet: "{{selfReference}}会记得有些时候，安静比热闹更适合你。",
    label: "来自设置摘要",
    sourceIds: ["audio_pref_007"],
    ring: "middle",
    x: 68,
    y: 72,
    status: "stable",
    deletable: true,
    movable: true
  }),
  node({
    id: "portrait_discovery_pet_talk",
    category: "diary_preference",
    name: "愿意聊的内容",
    value: "日常碎事",
    pet: "{{selfReference}}发现那些小小的碎事，也会让你们更像真的在一起生活。",
    label: "来自回信摘要",
    sourceIds: ["reply_topic_012"],
    ring: "middle",
    x: 42,
    y: 18,
    status: "stable",
    deletable: true,
    movable: true
  }),
  node({
    id: "portrait_discovery_emoji",
    category: "social_preference",
    name: "表情包偏好",
    value: "浅交流",
    pet: "这颗还很轻，{{selfReference}}先不把它贴得太重。",
    label: "来自互动摘要",
    sourceIds: ["emoji_pref_003"],
    ring: "middle",
    x: 60,
    y: 80,
    status: "low_signal",
    deletable: true,
    movable: true
  }),
  node({
    id: "portrait_discovery_old_name",
    category: "name",
    name: "以前的称呼",
    value: "\"伙计\"",
    pet: "{{selfReference}}只把它当作旧纸条，不会擅自改掉现在的称呼。",
    label: "来自历史称呼摘要",
    sourceIds: ["alias_history_001"],
    confidence: "user_confirmed",
    ring: "middle",
    x: 32,
    y: 80,
    status: "stable",
    deletable: true,
    movable: true
  })
];

export const mockCharacterResonance: CharacterResonance = {
  resonance_id: "resonance_demo_001",
  status: "ready",
  character_name: "暖光法师",
  role_type: "守护 / 支援 / 温柔推进",
  role_asset: portraitAssets.resonanceSweetMage,
  resonance_points: ["先照顾节奏，再推进目标", "喜欢把重要的事写成可回看的小片段", "遇到卡点时会先观察，再做一个稳妥选择"],
  pet_explanation: "{{selfReference}}不是说你只能像这一类角色，而是现在的你有一点点这样的光。等你变了，星图也会跟着换位置。",
  source_summary: source("来自画像节点聚合测定", ["portrait_nodes_active_v1"], "medium"),
  feedback_value: null,
  updated_at: NOW
};

export const mockPortrait: UserPortraitResponse = {
  portrait_id: "portrait_demo_001",
  user_id: "user_demo",
  game_context_id: "game_ctx_demo",
  title: "桌宠眼中的我",
  center: {
    avatar_asset: portraitAssets.centerAvatar,
    fallback_asset: portraitAssets.centerPlaceholder,
    title: "{{userAddressing}}的星图",
    subtitle: "{{selfReference}}轻轻看见的你"
  },
  nodes: mockPortraitNodes,
  more_discovery_count: mockMoreDiscoveries.length,
  new_discovery_count: 3,
  updated_node_count: mockPortraitNodes.filter((node) => node.status === "new_discovery" || node.status === "recent_update").length,
  bubble: {
    bubble_id: "portrait_bubble_demo_001",
    text: "{{userAddressing}}，{{selfReference}}把看见你的地方贴成了一张小星图。",
    emotion: "gentle",
    is_closed: false
  },
  character_config: demoCharacterConfig,
  character_resonance: mockCharacterResonance,
  generated_at: NOW
};
