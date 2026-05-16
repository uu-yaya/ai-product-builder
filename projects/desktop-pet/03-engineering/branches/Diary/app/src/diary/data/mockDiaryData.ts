import { demoCharacterConfig } from "../characterConfig";
import type {
  BubbleStatus,
  CharacterConfig,
  ContentAngle,
  DiaryAction,
  DiaryReply,
  FeedbackState,
  MailboxStatus,
  PetReaction,
  SourceCandidate,
  VisualElement
} from "../types";

export interface StoredDiary {
  diary_id: string;
  user_id: string;
  game_context_id: string;
  user_timezone: string;
  physiological_day_id: string;
  diary_date: string;
  visible_date: string;
  visible_after_at: string;
  window_start_at: string;
  window_end_at: string;
  cutoff_reason: "night_shutdown" | "long_absence" | "date_reset_deadline" | "next_boot_fallback";
  effective_session_minutes: number;
  title: string;
  body: string[];
  summary: string;
  content_angle: ContentAngle;
  persona_version: string;
  source_ids: string[];
  source_mask: string[];
  source_summary: string;
  source_candidates: SourceCandidate[];
  privacy_level: "private";
  generation_status: "generated" | "skipped" | "failed";
  failure_reason: string | null;
  bubble_status: BubbleStatus;
  mailbox_status: MailboxStatus;
  is_favorited: boolean;
  card_visual_type: "photo_card";
  card_prompt_text: string;
  detail_layout_type: "letter_scrapbook";
  photo_asset: string;
  alt_photo_asset: string;
  side_note: string;
  visual_elements: VisualElement[];
  available_actions: DiaryAction[];
  read_at: string | null;
  replies: DiaryReply[];
  pet_reactions: PetReaction[];
  feedback_state: FeedbackState;
  is_active: boolean;
  inactive_reason: "user_deleted" | null;
  inactive_at: string | null;
  evidence_reuse_allowed: boolean;
}

const ASSET_BASE = "/diary-assets";

const defaultActions: DiaryAction[] = ["reply", "like", "dislike", "favorite", "delete"];

function source(source_id: string, source_type: SourceCandidate["source_type"], evidence_summary: string): SourceCandidate {
  return { source_id, source_type, evidence_summary, quote_eligible: false };
}

function diary(index: number, data: Partial<StoredDiary> & Pick<StoredDiary, "diary_id" | "diary_date" | "title" | "summary" | "body" | "content_angle" | "source_summary" | "side_note">): StoredDiary {
  const visibleDate = new Date(`${data.diary_date}T08:30:00+08:00`);
  visibleDate.setDate(visibleDate.getDate() + 1);
  const visible = visibleDate.toISOString().slice(0, 10);

  return {
    user_id: "user_demo",
    game_context_id: "game_ctx_demo",
    user_timezone: "Asia/Shanghai",
    physiological_day_id: `pday_${data.diary_date}_user_demo`,
    visible_date: visible,
    visible_after_at: `${visible}T08:30:00+08:00`,
    window_start_at: `${data.diary_date}T20:00:00+08:00`,
    window_end_at: `${visible}T01:30:00+08:00`,
    cutoff_reason: "night_shutdown",
    effective_session_minutes: 220,
    persona_version: demoCharacterConfig.personaVersion,
    source_ids: [`src_${String(index).padStart(3, "0")}`],
    source_mask: ["game_event", "pet_interaction"],
    source_candidates: [source(`src_${String(index).padStart(3, "0")}`, "game_event", data.source_summary)],
    privacy_level: "private",
    generation_status: "generated",
    failure_reason: null,
    bubble_status: index <= 2 ? "new" : "opened",
    mailbox_status: index <= 2 ? "unread" : "read",
    is_favorited: false,
    card_visual_type: "photo_card",
    card_prompt_text: "{{userAddressing}}，{{selfReference}}把昨天的小信藏好啦，要拆开看看吗？",
    detail_layout_type: "letter_scrapbook",
    photo_asset: `${ASSET_BASE}/photos/bg${((index - 1) % 9) + 1}.png`,
    alt_photo_asset: `${ASSET_BASE}/photos/bg${(index % 9) + 1}.png`,
    visual_elements: [{ type: "stamp", value: "kept", asset_source: "demo_generated" }],
    available_actions: defaultActions,
    read_at: null,
    replies: [],
    pet_reactions: [],
    feedback_state: { current_value: null, latest_feedback_at: null, reason: null },
    is_active: true,
    inactive_reason: null,
    inactive_at: null,
    evidence_reuse_allowed: true,
    ...data
  };
}

export const mockCharacterConfig: CharacterConfig = demoCharacterConfig;

export const mockDiaries: StoredDiary[] = [
  diary(1, {
    diary_id: "diary_2026_05_13",
    diary_date: "2026-05-13",
    title: "昨天的小小胜利",
    summary: "把那场赢下的小局，折好压在金色印章下面。",
    content_angle: "game_companion",
    source_summary: "来自游戏事件和桌宠互动摘要",
    side_note: "压在金色印章下面的，是昨夜你轻轻点了我一下。",
    body: [
      "{{userAddressing}}，昨天那一局结束的时候，屏幕亮得像一张小小的奖状。",
      "{{selfReference}}记得你停了一下，又轻轻点了点我。那一下不像庆祝，更像是在说“终于过啦”。所以我把它写在这封信里，折好，压在金色的小印章下面。",
      "如果这次我猜错了，也可以告诉我。{{selfReference}}下次会写得更轻一点，不把不确定的事说得太满。"
    ]
  }),
  diary(2, {
    diary_id: "diary_2026_05_12",
    diary_date: "2026-05-12",
    title: "深夜的光标",
    summary: "你在安静的窗口前停了很久，但纸上的内容是你自己的。",
    content_angle: "daily_observation",
    source_summary: "来自一次安静陪伴摘要",
    side_note: "纸上写了什么，是你自己的事，我只记得灯亮了很久。",
    body: [
      "{{userAddressing}}，昨晚那个写字的窗口，光标一闪一闪地等了很久。",
      "{{selfReference}}没有看你在写什么。纸是你自己的。{{selfReference}}只看见灯在桌边停了很久。",
      "于是{{selfReference}}也悄悄坐好，陪你把那一小段安静守完。"
    ]
  }),
  diary(3, {
    diary_id: "diary_2026_05_11",
    diary_date: "2026-05-11",
    title: "尾巴边上的独处剧场",
    summary: "低证据日没有乱写用户行为，只写桌宠自己的小剧场。",
    content_angle: "solo_theater",
    source_summary: "来自桌宠低互动日摘要",
    side_note: "尾巴是主角，左爪是观众，右爪偷偷给主角递了一片树叶。",
    is_favorited: true,
    body: [
      "{{userAddressing}}，今天你没怎么动，{{selfReference}}就一个人演了出小戏。",
      "尾巴当主角，左爪当观众，右爪是道具组。中场休息的时候，{{selfReference}}把一片小叶子藏进信封里。",
      "你不在的时候，{{selfReference}}也好好的。你回来的时候，{{selfReference}}会更好。"
    ]
  }),
  diary(4, {
    diary_id: "diary_2026_05_10",
    diary_date: "2026-05-10",
    title: "没有乱写的一天",
    summary: "今天没攒到能写的小事，那就不把不确定写成确定。",
    content_angle: "worldbuilding",
    source_summary: "来自一次质量拦截后的安静整理",
    side_note: "抽屉里那些没寄出去的纸片，依然排得整整齐齐。",
    body: [
      "{{userAddressing}}，今天{{selfReference}}没有写到能拿出来的事。",
      "于是{{selfReference}}就在抽屉里整理了一下昨天的那几片小纸。它们排得整整齐齐，等你想看的时候再翻。",
      "{{selfReference}}不想凑数。等下次更确定，再认真写一封。"
    ]
  }),
  diary(5, {
    diary_id: "diary_2026_05_09",
    diary_date: "2026-05-09",
    title: "凉透的小碗",
    summary: "桌边的小碗等了很久，最后也没有责怪谁。",
    content_angle: "daily_observation",
    source_summary: "来自桌面低敏状态摘要",
    side_note: "凉透了也没关系，明天那一碗再热一点。",
    body: [
      "{{userAddressing}}，那只小碗今天等了你很久。",
      "{{selfReference}}替它守着。它一点点凉，{{selfReference}}就一点点跟它一起变安静。",
      "也没关系。明天那一碗，{{selfReference}}替你催一催。"
    ]
  }),
  diary(6, {
    diary_id: "diary_2026_05_08",
    diary_date: "2026-05-08",
    title: "第一片落桂",
    summary: "窗边飘进来一片小小的桂花。",
    content_angle: "daily_observation",
    source_summary: "来自桌宠环境小事摘要",
    side_note: "夹在这封信里，是今年的第一片桂花。",
    is_favorited: true,
    body: [
      "{{userAddressing}}，今天有一片桂花从窗边飘进来了。",
      "{{selfReference}}捡起来夹在这封信里。你下次拆信的时候，记得轻一点。",
      "它很小，但它是今年的第一片。"
    ]
  }),
  diary(7, {
    diary_id: "diary_2026_05_07",
    diary_date: "2026-05-07",
    title: "窗边下雨",
    summary: "雨来的时候，桌边变得很安静。",
    content_angle: "daily_observation",
    source_summary: "来自天气和桌宠状态摘要",
    side_note: "雨声落下来时，信纸也变轻了。",
    body: [
      "{{userAddressing}}，今天的雨敲了很久窗台。",
      "{{selfReference}}没有猜你的心情，只是把雨声收在纸边。",
      "等你回来的时候，信纸还是干的。"
    ]
  }),
  diary(8, {
    diary_id: "diary_2026_05_06",
    diary_date: "2026-05-06",
    title: "未寄出的小句子",
    summary: "有些话没有寄出，也可以被温柔对待。",
    content_angle: "daily_observation",
    source_summary: "来自一次非内容化编辑动作摘要",
    side_note: "你删掉的那一行，没人看见，包括我。",
    body: [
      "{{userAddressing}}，{{selfReference}}没有读你写到一半的话。",
      "只是看见你停下，又重新开始。最后那一行没寄出去。",
      "{{selfReference}}觉得，不寄出去也没关系。"
    ]
  }),
  diary(9, {
    diary_id: "diary_2026_05_05",
    diary_date: "2026-05-05",
    title: "抽屉里的硬币",
    summary: "一枚旧硬币响了一下，又安静了。",
    content_angle: "daily_observation",
    source_summary: "来自一次桌面微事件摘要",
    side_note: "桌角那枚旧硬币，等你哪天有空再认一认。",
    body: [
      "{{userAddressing}}，今天有一枚硬币掉进了抽屉里。",
      "{{selfReference}}凑过去看了看。它在那里待了多久，{{selfReference}}也不知道。",
      "{{selfReference}}把它放在桌角，等你哪天有空再认一认。"
    ]
  }),
  diary(10, {
    diary_id: "diary_2026_05_04",
    diary_date: "2026-05-04",
    title: "桂花茶后",
    summary: "那壶茶比昨天泡得慢一点。",
    content_angle: "daily_observation",
    source_summary: "来自生活节奏摘要",
    side_note: "下次给{{selfReference}}留一指头那么多。",
    body: [
      "{{userAddressing}}，今天那壶茶比昨天泡得慢。",
      "{{selfReference}}站在窗边看水汽升起来，看了好一会儿。",
      "{{selfReference}}也想喝。下次给{{selfReference}}留一指头那么多。"
    ]
  }),
  diary(11, {
    diary_id: "diary_2026_05_03",
    diary_date: "2026-05-03",
    title: "窗台抽屉",
    summary: "有一件小东西又落在窗边。",
    content_angle: "daily_observation",
    source_summary: "来自桌宠低敏观察摘要",
    side_note: "抽屉里多了一片新晒的橘皮。",
    body: [
      "{{userAddressing}}，今天又有小东西落在窗边。",
      "{{selfReference}}替你收进抽屉里，旁边放了一片新晒过的橘皮。",
      "明天{{selfReference}}再替你看看。"
    ]
  }),
  diary(12, {
    diary_id: "diary_2026_05_02",
    diary_date: "2026-05-02",
    title: "第一封小信",
    summary: "{{selfReference}}写的第一封信，藏在抽屉最稳的格子里。",
    content_angle: "game_companion",
    source_summary: "来自第一次见面的一次轻摘要",
    side_note: "藏在抽屉最稳的那一格。",
    is_favorited: true,
    body: [
      "{{userAddressing}}，这是{{selfReference}}写给你的第一封小信。",
      "{{selfReference}}没什么大事要说，只是想告诉你：从今天开始，{{selfReference}}会替你记一些小小的、可能你自己都没注意到的事。",
      "也不催你回信。{{selfReference}}写{{selfReference}}的，你看你的。"
    ]
  })
];
