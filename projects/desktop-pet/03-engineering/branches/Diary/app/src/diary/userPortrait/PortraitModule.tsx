import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderCharacterTemplate } from "../characterConfig";
import { getPetAssetForEmotion, iconAssets } from "../petAssets";
import type { CharacterConfig } from "../types";
import type { PortraitService } from "./PortraitService";
import { PortraitServiceError } from "./PortraitService";
import { portraitAssets } from "./portraitAssets";
import type {
  CharacterResonance,
  MoreDiscoveriesResponse,
  PortraitFeedbackValue,
  PortraitNode,
  PortraitNodeCategory,
  PortraitPetReaction,
  PortraitScenario,
  UserPortraitResponse
} from "./types";

type PortraitMode = "main" | "more" | "resonance";
type PortraitPrototypeScene = "desktop" | "main" | "node_focus" | "more" | "discovery_focus" | "resonance";
type PortraitDialog = "reorganize" | "fileaway" | null;
type OrbMarker = "new" | "edited" | "liked" | "has-more" | "unlike" | "required" | null;
type PortraitProgressOverlayState = {
  title: string;
  sub: string;
} | null;
type PortraitScenarioNoticeCopy = {
  title: string;
  body: string;
  tone?: "soft" | "warn";
};

interface PortraitModuleProps {
  service: PortraitService;
  userId: string;
  gameContextId: string;
  characterConfig: CharacterConfig;
  onBack: () => void;
}

interface NodeSlot {
  slotId: string;
  category: PortraitNodeCategory;
  ring: "inner" | "middle" | "outer";
  angle: number;
  variant?: "gold" | "teal" | "coral" | "low-signal";
  size?: "lg" | "sm" | "xs";
  prominent?: boolean;
}

interface MoreSlot {
  slotId: string;
  left: number;
  top: number;
  variant?: "gold" | "teal" | "low-signal";
  size?: "sm" | "xs";
}

const PROTOTYPE_SCENES: Array<{ value: PortraitPrototypeScene; label: string; defaultScenario: PortraitScenario }> = [
  { value: "desktop", label: "桌面入口", defaultScenario: "normal" },
  { value: "main", label: "主星图", defaultScenario: "portrait_ready" },
  { value: "node_focus", label: "节点聚焦", defaultScenario: "node_focus_stable" },
  { value: "more", label: "更多发现", defaultScenario: "more_ready" },
  { value: "discovery_focus", label: "发现聚焦", defaultScenario: "discovery_focus_read" },
  { value: "resonance", label: "角色共鸣", defaultScenario: "resonance_ready" }
];

const PORTRAIT_SCENARIO_GROUPS: Array<{
  label: string;
  options: Array<{ value: PortraitScenario; label: string; scene: PortraitPrototypeScene; note: string }>;
}> = [
  {
    label: "主星图",
    options: [
      { value: "portrait_ready", label: "正常 · 星图就绪", scene: "main", note: "中心头像 + 放射节点 + 新发现入口。" },
      { value: "portrait_no_portrait", label: "首次 / 无画像", scene: "main", note: "中心头像 + 核心空节点，不乱猜。" },
      { value: "portrait_low_data", label: "数据很少", scene: "main", note: "只展示核心节点和弱表达。" },
      { value: "portrait_loading", label: "加载中", scene: "main", note: "桌宠居中跳舞，加载点弹跳。" },
      { value: "portrait_load_failed", label: "加载失败", scene: "main", note: "保留外壳和重试，不展示错误码。" },
      { value: "portrait_too_many_nodes", label: "节点过多", scene: "main", note: "低频节点收进更多发现。" },
      { value: "portrait_pending_discoveries_overflow", label: "待确认过多", scene: "main", note: "只露出最近/重要的新发现。" },
      { value: "portrait_bubble_disabled", label: "气泡关闭", scene: "main", note: "不显示头顶气泡，静默降级。" },
      { value: "portrait_voice_disabled", label: "语音关闭", scene: "main", note: "保留文字，不播放语音。" }
    ]
  },
  {
    label: "节点聚焦",
    options: [
      { value: "node_focus_stable", label: "查看稳定节点", scene: "node_focus", note: "节点亮起，详情卡在画布内展开。" },
      { value: "node_focus_low_signal", label: "低信号节点", scene: "node_focus", note: "弱光 + 不确定表达。" },
      { value: "node_focus_editing", label: "编辑中", scene: "node_focus", note: "显示纸质输入框和保存/取消。" },
      { value: "edit_save_failed", label: "保存失败", scene: "node_focus", note: "保留草稿，角色化提示稍后重试。" },
      { value: "node_focus_liked", label: "已喜欢", scene: "node_focus", note: "节点稳定变亮，印章反馈。" },
      { value: "node_focus_unliked", label: "已不准", scene: "node_focus", note: "节点弱化，出现纠错输入。" },
      { value: "node_focus_consecutive_unlike", label: "连续不准", scene: "node_focus", note: "24 小时最多追问一次，之后静默观察。" },
      { value: "node_focus_deleted", label: "可收起节点", scene: "node_focus", note: "使用收起/摘下文案，软删除边界。" },
      { value: "node_focus_unavailable", label: "节点不可用", scene: "node_focus", note: "保持星图，给轻提示。" }
    ]
  },
  {
    label: "更多发现",
    options: [
      { value: "more_ready", label: "二级星图就绪", scene: "more", note: "仍是星图，不是列表/抽屉。" },
      { value: "more_discoveries_empty", label: "更多发现为空", scene: "more", note: "空二级星图 + 返回路径。" },
      { value: "more_discoveries_load_failed", label: "更多发现加载失败", scene: "more", note: "保留外壳，角色化重试。" },
      { value: "more_duplicate_discovery", label: "重复发现", scene: "more", note: "隐藏或合并重复节点。" },
      { value: "discovery_focus_read", label: "发现聚焦", scene: "discovery_focus", note: "可编辑、反馈、收起、放回主星图。" },
      { value: "discovery_move_to_main_full", label: "主星图已满", scene: "discovery_focus", note: "提示先整理，不静默覆盖。" },
      { value: "discovery_move_conflict", label: "放回冲突", scene: "discovery_focus", note: "提示保留/合并，不直接覆盖。" }
    ]
  },
  {
    label: "角色共鸣",
    options: [
      { value: "resonance_ready", label: "测定完成", scene: "resonance", note: "角色图、共鸣度、共鸣点和测定时间。" },
      { value: "resonance_not_measured", label: "未测过", scene: "resonance", note: "空结果卡 + 开始测定，不显示百分比。" },
      { value: "resonance_insufficient_data", label: "数据不足", scene: "resonance", note: "不显示百分比，提示需要更多线索。" },
      { value: "resonance_measuring", label: "测定中", scene: "resonance", note: "卡片占位 + 扫描/星光动效。" },
      { value: "resonance_failed", label: "测定失败", scene: "resonance", note: "保留旧结果或空态，提供重试。" },
      { value: "resonance_expired", label: "结果过期", scene: "resonance", note: "保留旧结果 + 重新测定提示。" },
      { value: "resonance_user_rejected", label: "用户不认可", scene: "resonance", note: "弱化旧结果，不争辩，给重测入口。" },
      { value: "resonance_character_config_missing", label: "角色资料缺失", scene: "resonance", note: "不伪造角色，入口置灰或占位。" },
      { value: "resonance_authorization_unmet", label: "授权不足", scene: "resonance", note: "提示去设置页打开授权。" },
      { value: "resonance_service_unavailable", label: "服务不可用", scene: "resonance", note: "保留页面状态，稍后重试。" }
    ]
  },
  {
    label: "素材 / AI / 操作边界",
    options: [
      { value: "asset_center_avatar_failed", label: "中心头像失败", scene: "main", note: "使用默认用户 + 桌宠占位。" },
      { value: "asset_character_image_missing", label: "角色图缺失", scene: "resonance", note: "使用剪影/占位卡。" },
      { value: "ai_output_blocked_backend_fields", label: "AI 后台字段拦截", scene: "node_focus", note: "改用模板，不展示字段/JSON/source_id。" },
      { value: "ai_output_wrong_persona", label: "AI 人设不符", scene: "node_focus", note: "回退角色默认短句。" },
      { value: "ai_output_real_personality_judgement", label: "现实人格判断拦截", scene: "resonance", note: "改写为游戏内共鸣。" },
      { value: "user_operation_edit_conflict", label: "编辑版本冲突", scene: "node_focus", note: "保留草稿，提示刷新/合并。" },
      { value: "user_operation_model_overturns_edit", label: "模型试图覆盖用户编辑", scene: "node_focus", note: "用户编辑优先。" },
      { value: "user_operation_deleted_node_reappears", label: "删除节点复现", scene: "main", note: "同类发现必须作为新待确认节点。" },
      { value: "reorganize_failed", label: "重新整理失败", scene: "main", note: "保持原星图，不丢用户编辑内容。" }
    ]
  }
];

const MAIN_NODE_SLOTS: NodeSlot[] = [
  { slotId: "addressing", category: "name", ring: "inner", angle: 0 },
  { slotId: "relationship", category: "relationship", ring: "inner", angle: 72, variant: "teal" },
  { slotId: "goal", category: "current_goal", ring: "inner", angle: 144, variant: "gold" },
  { slotId: "companion", category: "companion_preference", ring: "inner", angle: 216 },
  { slotId: "diary", category: "diary_preference", ring: "inner", angle: 288, variant: "teal" },
  { slotId: "playstyle", category: "play_style", ring: "middle", angle: 0, size: "sm" },
  { slotId: "practice", category: "practice_stage", ring: "middle", angle: 60, variant: "low-signal", size: "sm" },
  { slotId: "mode", category: "mode_preference", ring: "middle", angle: 120, variant: "gold", size: "sm" },
  { slotId: "avoid", category: "avoid_topic", ring: "middle", angle: 180, variant: "teal", size: "sm" },
  { slotId: "stuck", category: "stuck_point", ring: "middle", angle: 240, variant: "low-signal", size: "sm" },
  { slotId: "character-pref", category: "preferred_character", ring: "middle", angle: 300, size: "sm" },
  { slotId: "resonance", category: "character_resonance", ring: "outer", angle: 36, variant: "coral", prominent: true },
  { slotId: "milestone", category: "long_term_milestone", ring: "outer", angle: 108, size: "xs" },
  { slotId: "achievement", category: "recent_achievement", ring: "outer", angle: 180, variant: "gold", size: "xs" },
  { slotId: "more", category: "more_discoveries", ring: "outer", angle: 252, size: "xs" },
  { slotId: "social", category: "social_preference", ring: "outer", angle: 324, size: "xs" }
];

const MORE_SLOTS: MoreSlot[] = [
  { slotId: "m-old-mode", left: 22, top: 28, size: "sm" },
  { slotId: "m-weekday", left: 78, top: 26, size: "sm", variant: "low-signal" },
  { slotId: "m-rare-win", left: 84, top: 60, size: "sm", variant: "gold" },
  { slotId: "m-music", left: 16, top: 60, size: "sm", variant: "teal" },
  { slotId: "m-pet-talk", left: 42, top: 18, size: "xs" },
  { slotId: "m-emoji", left: 60, top: 80, size: "xs", variant: "low-signal" },
  { slotId: "m-old-name", left: 32, top: 80, size: "xs" }
];

const CATEGORY_TITLE: Partial<Record<PortraitNodeCategory, string>> = {
  name: "怎么称呼我",
  relationship: "我们的关系",
  current_goal: "当前目标",
  companion_preference: "陪伴偏好",
  diary_preference: "日记偏好",
  play_style: "玩法风格",
  practice_stage: "练习阶段",
  preferred_character: "偏好角色",
  mode_preference: "模式偏好",
  avoid_topic: "避聊话题",
  stuck_point: "卡点",
  recent_achievement: "近期成就",
  long_term_milestone: "长期里程碑",
  social_preference: "社交偏好",
  character_resonance: "我像哪位角色",
  more_discoveries: "更多发现"
};

export function PortraitModule({
  service,
  userId,
  gameContextId,
  characterConfig,
  onBack
}: PortraitModuleProps) {
  const params = useMemo(() => ({ user_id: userId, game_context_id: gameContextId }), [gameContextId, userId]);
  const [portrait, setPortrait] = useState<UserPortraitResponse | null>(null);
  const [moreDiscoveries, setMoreDiscoveries] = useState<MoreDiscoveriesResponse | null>(null);
  const [mode, setMode] = useState<PortraitMode>("main");
  const [selectedNode, setSelectedNode] = useState<PortraitNode | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<PortraitNode | null>(null);
  const [resonance, setResonance] = useState<CharacterResonance | null>(null);
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [toast, setToast] = useState<PortraitPetReaction | null>(null);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortraitNode | null>(null);
  const [dialog, setDialog] = useState<PortraitDialog>(null);
  const [scenario, setScenario] = useState<PortraitScenario>("portrait_ready");
  const [prototypeOpen, setPrototypeOpen] = useState(false);
  const [focusReactionText, setFocusReactionText] = useState<string | null>(null);
  const focusReactionTimer = useRef<number | null>(null);
  const [isReassessing, setIsReassessing] = useState(false);
  const [progressOverlay, setProgressOverlay] = useState<PortraitProgressOverlayState>(null);

  const activeCharacterConfig = portrait?.character_config ?? characterConfig;

  const showToast = useCallback((reaction: PortraitPetReaction) => {
    setToast(reaction);
    window.setTimeout(() => {
      setToast((current) => (current?.reaction_id === reaction.reaction_id ? null : current));
    }, 2400);
  }, []);

  const clearFocusReaction = useCallback(() => {
    if (focusReactionTimer.current) {
      window.clearTimeout(focusReactionTimer.current);
      focusReactionTimer.current = null;
    }
    setFocusReactionText(null);
  }, []);

  const acknowledgeFocus = useCallback((template: string) => {
    if (focusReactionTimer.current) {
      window.clearTimeout(focusReactionTimer.current);
    }
    setFocusReactionText(template);
    focusReactionTimer.current = window.setTimeout(() => {
      setFocusReactionText(null);
      focusReactionTimer.current = null;
    }, 2600);
  }, []);

  useEffect(() => () => {
    if (focusReactionTimer.current) {
      window.clearTimeout(focusReactionTimer.current);
    }
  }, []);

  useEffect(() => {
    clearFocusReaction();
  }, [clearFocusReaction, mode, selectedDiscovery?.node_id, selectedNode?.node_id]);

  const loadPortrait = useCallback(async () => {
    setLoading(true);
    setInlineError(null);
    try {
      const response = await service.getPortrait(params);
      setPortrait(response);
      setResonance(response.character_resonance);
      setSelectedNode((current) => current ? response.nodes.find((node) => node.node_id === current.node_id) ?? null : null);
    } catch (error) {
      setPortrait(null);
      setInlineError(error instanceof PortraitServiceError ? error.message : "这片星空雾有点大。");
    } finally {
      setLoading(false);
    }
  }, [params, service]);

  const loadMoreDiscoveries = useCallback(async () => {
    setInlineError(null);
    try {
      const response = await service.getMoreDiscoveries({ ...params, page: 1, page_size: 10 });
      setMoreDiscoveries(response);
    } catch (error) {
      setMoreDiscoveries(null);
      setInlineError(error instanceof PortraitServiceError ? error.message : "这只小信封暂时没打开。");
    }
  }, [params, service]);

  useEffect(() => {
    void loadPortrait();
  }, [loadPortrait]);

  function switchScene(nextScene: PortraitPrototypeScene) {
    if (nextScene === "desktop") {
      onBack();
      return;
    }
    const nextScenario = PROTOTYPE_SCENES.find((item) => item.value === nextScene)?.defaultScenario ?? "portrait_ready";
    switchScenario(nextScenario);
  }

  function switchScenario(nextScenario: PortraitScenario) {
    setScenario(nextScenario);
    setSelectedNode(null);
    setSelectedDiscovery(null);
    setEditing(false);
    setEditError(null);
    setInlineError(null);
    clearFocusReaction();
    getPrototypeCapablePortraitService(service)?.setScenario(nextScenario);
    const nextScene = prototypeSceneForScenario(nextScenario);
    if (nextScene === "desktop") {
      onBack();
      return;
    }
    if (nextScenario === "portrait_loading") {
      setMode("main");
      setPortrait(null);
      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        void loadPortrait();
      }, 900);
      return;
    }

    void (async () => {
      setLoading(true);
      try {
        const response = await service.getPortrait(params);
        setPortrait(response);
        setResonance(response.character_resonance);
        if (nextScene === "more" || nextScene === "discovery_focus") {
          setMode("more");
          try {
            const more = await service.getMoreDiscoveries({ ...params, page: 1, page_size: 10 });
            setMoreDiscoveries(more);
            const discovery = nextScene === "discovery_focus" ? more.items[0] ?? null : null;
            setSelectedDiscovery(discovery);
            setEditDraft(renderCopy(discovery?.value ?? "", response.character_config ?? activeCharacterConfig));
          } catch (error) {
            setMoreDiscoveries(null);
            setInlineError(error instanceof PortraitServiceError ? error.message : "这只小信封暂时没打开。");
          }
        } else if (nextScene === "resonance") {
          setMode("resonance");
          setResonance(await service.getCharacterResonance(params));
        } else if (nextScene === "node_focus") {
          setMode("main");
          const node = prototypeFocusNodeForScenario(nextScenario, response.nodes);
          setSelectedNode(node);
          setEditDraft(renderCopy(node?.value ?? "", response.character_config ?? activeCharacterConfig));
          setEditing(shouldStartEditingForScenario(nextScenario));
          if (shouldShowNotAccurateForScenario(nextScenario) && node) {
            setSelectedNode({ ...node, status: "rejected" });
          }
        } else {
          setMode("main");
        }
      } catch (error) {
        setPortrait(null);
        setInlineError(error instanceof PortraitServiceError ? error.message : "这片星空雾有点大。");
      } finally {
        setLoading(false);
      }
    })();
  }

  function openNode(node: PortraitNode) {
    if (node.category === "more_discoveries") {
      setMode("more");
      setSelectedNode(null);
      setSelectedDiscovery(null);
      void loadMoreDiscoveries();
      return;
    }
    if (node.category === "character_resonance") {
      setMode("resonance");
      setSelectedNode(null);
      setSelectedDiscovery(null);
      void service.getCharacterResonance(params).then(setResonance).catch(() => setInlineError("角色共鸣暂时没有测准。"));
      return;
    }
    setSelectedNode(node);
    setSelectedDiscovery(null);
    setEditDraft(renderCopy(node.value, activeCharacterConfig));
    setEditError(null);
    setEditing(node.status === "required_empty");
  }

  async function saveNodeEdit(target: PortraitNode | null, discovery = false) {
    if (!target) return;
    setEditError(null);
    try {
      const response = await service.updatePortraitNode(target.node_id, params, {
        value: editDraft,
        source: "user_edit"
      });
      if (discovery) {
        setMoreDiscoveries((current) => replaceNodeInMoreDiscoveries(current, response.node));
        setSelectedDiscovery(response.node);
      } else {
        setPortrait((current) => replaceNodeInPortrait(current, response.node));
        setSelectedNode(response.node);
      }
      setEditing(false);
      showToast(response.pet_reaction);
      acknowledgeFocus(response.pet_reaction.reaction_text);
    } catch {
      setEditError("这句小绒还没贴牢，先替你留着。");
    }
  }

  async function sendNodeFeedback(node: PortraitNode, value: PortraitFeedbackValue) {
    try {
      const response = await service.feedbackPortraitNode({ ...params, node_id: node.node_id, value });
      const nextNode = { ...node, status: response.current_status };
      setPortrait((current) => replaceNodeInPortrait(current, nextNode));
      setMoreDiscoveries((current) => replaceNodeInMoreDiscoveries(current, nextNode));
      setSelectedNode((current) => current?.node_id === node.node_id ? nextNode : current);
      setSelectedDiscovery((current) => current?.node_id === node.node_id ? nextNode : current);
      showToast(response.pet_reaction);
      acknowledgeFocus(response.pet_reaction.reaction_text);
    } catch {
      setInlineError("这次反馈暂时没记好。");
    }
  }

  async function confirmSoftDelete() {
    if (!deleteTarget) return;
    try {
      const isDiscovery = moreDiscoveries?.items.some((node) => node.node_id === deleteTarget.node_id) ?? false;
      const response = await service.softDeletePortraitNode(deleteTarget.node_id, params);
      if (isDiscovery) {
        setMoreDiscoveries((current) => removeNodeFromMoreDiscoveries(current, deleteTarget.node_id));
        setSelectedDiscovery(null);
      } else {
        setPortrait((current) => removeNodeFromPortrait(current, deleteTarget.node_id));
        setSelectedNode(null);
      }
      setDeleteTarget(null);
      setDialog(null);
      showToast(response.pet_reaction);
      acknowledgeFocus(response.pet_reaction.reaction_text);
    } catch {
      setInlineError("这颗星星暂时收不起来。");
    }
  }

  async function promoteDiscovery(node: PortraitNode) {
    try {
      const response = await service.promoteDiscovery({ ...params, discovery_id: node.node_id });
      showToast(response.pet_reaction);
      acknowledgeFocus(response.pet_reaction.reaction_text);
      setSelectedDiscovery(null);
      await loadPortrait();
      await loadMoreDiscoveries();
    } catch {
      setInlineError("这颗星星暂时贴不回主星图。");
    }
  }

  async function reorganizePortrait() {
    const subtitles = [
      "先把你亲自改过的小星星锁好。",
      "再把最近更重要的节点挪近一点。",
      "最后把不急的发现轻轻收进夹层。"
    ];
    setDialog(null);
    setProgressOverlay({
      title: `${activeCharacterConfig.selfReference}正在重新整理星图`,
      sub: subtitles[0]
    });
    const startedAt = Date.now();
    const subtitleTimer = window.setInterval(() => {
      const index = Math.min(subtitles.length - 1, Math.floor((Date.now() - startedAt) / 760));
      setProgressOverlay((current) => current ? { ...current, sub: subtitles[index] } : current);
    }, 240);
    try {
      const responsePromise = service.reorganizePortrait(params);
      await new Promise((resolve) => window.setTimeout(resolve, 2480));
      const response = await responsePromise;
      setPortrait(response.portrait);
      showToast(response.pet_reaction);
      acknowledgeFocus(response.pet_reaction.reaction_text);
    } catch {
      setInlineError("原来的星图先留着，小绒没排好就不乱动。");
    } finally {
      window.clearInterval(subtitleTimer);
      setProgressOverlay(null);
    }
  }

  async function reassessResonance() {
    const subtitles = [
      "先把这几局的小习惯连起来看看。",
      "再对照你喜欢停留的小片段。",
      "最后把共鸣印章轻轻盖上。"
    ];
    setIsReassessing(true);
    setProgressOverlay({
      title: `${activeCharacterConfig.selfReference}正在重新测定`,
      sub: subtitles[0]
    });
    setResonance((current) => current ? { ...current, status: "measuring" } : current);
    const startedAt = Date.now();
    const subtitleTimer = window.setInterval(() => {
      const index = Math.min(subtitles.length - 1, Math.floor((Date.now() - startedAt) / 760));
      setProgressOverlay((current) => current ? { ...current, sub: subtitles[index] } : current);
    }, 240);
    try {
      const responsePromise = service.reassessCharacterResonance(params);
      await new Promise((resolve) => window.setTimeout(resolve, 2480));
      const response = await responsePromise;
      setResonance({ ...response, feedback_value: null });
      const resonanceNode = portrait?.nodes.find((item) => item.category === "character_resonance");
      if (resonanceNode) {
        setPortrait((current) => replaceNodeInPortrait(current, { ...resonanceNode, status: "stable" }));
      }
      const reaction: PortraitPetReaction = {
        reaction_id: `portrait_resonance_${Date.now()}`,
        scene: "portrait_resonance_reassessed",
        reaction_text: "{{selfReference}}重新盖了一枚共鸣印章。",
        emotion: "writing",
        action: "writing_loop",
        should_speak: true,
        created_at: new Date().toISOString()
      };
      showToast(reaction);
      acknowledgeFocus(reaction.reaction_text);
    } catch {
      setInlineError("这次没测准，小绒先不展示半成品。");
    } finally {
      window.clearInterval(subtitleTimer);
      setIsReassessing(false);
      setProgressOverlay(null);
    }
  }

  function setResonanceFeedback(value: PortraitFeedbackValue) {
    const nextValue = resonance?.feedback_value === value ? null : value;
    setResonance((current) => current ? { ...current, feedback_value: nextValue } : current);
    const node = portrait?.nodes.find((item) => item.category === "character_resonance");
    if (!node) return;
    const optimisticStatus: PortraitNode["status"] = nextValue === "like" ? "liked" : nextValue === "not_accurate" ? "rejected" : "stable";
    setPortrait((current) => replaceNodeInPortrait(current, { ...node, status: optimisticStatus }));
    void service.feedbackPortraitNode({ ...params, node_id: node.node_id, value }).then((response) => {
      const serviceStatus = nextValue ? response.current_status : "stable";
      setPortrait((current) => replaceNodeInPortrait(current, { ...node, status: serviceStatus }));
      acknowledgeFocus(response.pet_reaction.reaction_text);
    }).catch(() => {
      setInlineError("这次反馈暂时没记好。");
    });
  }

  const currentTitle = mode === "more"
    ? "桌宠眼中的我 · 更多发现"
    : mode === "resonance"
      ? "桌宠眼中的我 · 角色共鸣结果"
      : "桌宠眼中的我 · 我的星图";

  const content = (() => {
    if (inlineError && !portrait) {
      return <PortraitExceptionPanel kind="load_failed" characterConfig={activeCharacterConfig} onRetry={() => void loadPortrait()} />;
    }
    if (!portrait) {
      return <PortraitLoading characterConfig={activeCharacterConfig} />;
    }
    if (portrait.nodes.length === 0) {
      return <PortraitExceptionPanel kind="empty" characterConfig={activeCharacterConfig} onRetry={() => void reorganizePortrait()} />;
    }
    if (mode === "more") {
      return (
        <MoreDiscoveriesView
          discoveries={moreDiscoveries}
          characterConfig={activeCharacterConfig}
          focusedNode={selectedDiscovery}
          editing={editing}
          editDraft={editDraft}
          editError={editError}
          error={inlineError}
          focusReactionText={focusReactionText}
          scenarioNotice={moreScenarioNotice(scenario, activeCharacterConfig)}
          onEditDraft={setEditDraft}
          onBack={() => {
            setSelectedDiscovery(null);
            setMode("main");
          }}
          onFocus={(node) => {
            setSelectedDiscovery(node);
            setEditDraft(renderCopy(node.value, activeCharacterConfig));
            setEditError(null);
            setEditing(false);
          }}
          onPromote={(node) => void promoteDiscovery(node)}
          onFeedback={(node, value) => void sendNodeFeedback(node, value)}
          onPetAcknowledge={acknowledgeFocus}
          onStartEdit={() => setEditing(true)}
          onCancelEdit={() => {
            setEditing(false);
            setEditDraft(renderCopy(selectedDiscovery?.value ?? "", activeCharacterConfig));
            setEditError(null);
          }}
          onSaveEdit={() => void saveNodeEdit(selectedDiscovery, true)}
          onAskDelete={(node) => {
            setDeleteTarget(node);
            setDialog("fileaway");
          }}
          onCloseFocus={() => {
            setSelectedDiscovery(null);
            setEditing(false);
            setEditError(null);
          }}
          onRetry={() => void loadMoreDiscoveries()}
        />
      );
    }
    if (mode === "resonance") {
      return (
        <CharacterResonanceView
          resonance={resonance ?? portrait.character_resonance}
          characterConfig={activeCharacterConfig}
          isReassessing={isReassessing}
          onFeedback={setResonanceFeedback}
          onPetAcknowledge={acknowledgeFocus}
          onReassess={() => void reassessResonance()}
        />
      );
    }
    return (
      <PortraitStarMap
        portrait={portrait}
        characterConfig={activeCharacterConfig}
        selectedNode={selectedNode}
        focusReactionText={focusReactionText}
        scenarioNotice={mainScenarioNotice(scenario, activeCharacterConfig)}
        onNode={openNode}
        onRequestReorganize={() => setDialog("reorganize")}
        focusSheet={selectedNode && (
          <FocusCluster
            node={selectedNode}
            characterConfig={activeCharacterConfig}
            editing={editing}
            editDraft={editDraft}
            editError={editError}
            onEditDraft={setEditDraft}
            onStartEdit={() => setEditing(true)}
            onCancelEdit={() => {
              setEditing(false);
              setEditDraft(renderCopy(selectedNode.value, activeCharacterConfig));
              setEditError(null);
            }}
            onSaveEdit={() => void saveNodeEdit(selectedNode)}
            onFeedback={(value) => void sendNodeFeedback(selectedNode, value)}
            onPetAcknowledge={acknowledgeFocus}
            onAskDelete={() => {
              setDeleteTarget(selectedNode);
              setDialog("fileaway");
            }}
            onClose={() => {
              setSelectedNode(null);
              setEditing(false);
              setEditError(null);
            }}
          />
        )}
      />
    );
  })();

  return (
    <>
      <section className="app-window portrait-window portrait-claude-window" aria-label="桌宠眼中的我">
        <header className="app-titlebar">
          <span className="title"><span className="ornament" />{currentTitle}</span>
          <span className="controls">
            <button className="titlebar-btn" aria-label={mode === "main" ? "返回桌面" : "返回主星图"} onClick={() => {
              if (mode === "main") {
                onBack();
              } else {
                setMode("main");
                setSelectedDiscovery(null);
              }
            }}>
              <img src={iconAssets.back} alt="" />
            </button>
            <button className="titlebar-btn" aria-label="关闭" onClick={onBack}>
              <img src={iconAssets.close} alt="" />
            </button>
          </span>
        </header>
        {content}
        {progressOverlay && <PortraitProgressOverlay overlay={progressOverlay} />}
        {toast && <PortraitToast reaction={toast} characterConfig={activeCharacterConfig} />}
        {dialog === "reorganize" && (
          <PortraitDialog title="把这张星图重新排一下？" seal="重新整理" body="小绒会把最近更重要的小星星挪近一些，把不急的收进“更多发现”。你亲自改过的节点会被锁住保护，不会自动删除任何节点，也不会替你确认新发现。" onCancel={() => setDialog(null)} onConfirm={() => void reorganizePortrait()} confirmText="重新整理" />
        )}
        {dialog === "fileaway" && deleteTarget && (
          <PortraitDialog title="把这颗从星图上收起来吗" seal="收起" body="以后小绒不会再拿这颗当作理解你的依据。它只是被收起来，不是被丢掉。" onCancel={() => {
            setDialog(null);
            setDeleteTarget(null);
          }} onConfirm={() => void confirmSoftDelete()} confirmText="从星图上摘下" danger />
        )}
      </section>
      <PortraitProtoSwitcher
        open={prototypeOpen}
        scene={prototypeSceneFromState(mode, selectedNode, selectedDiscovery)}
        scenario={scenario}
        characterConfig={activeCharacterConfig}
        onToggle={() => setPrototypeOpen((current) => !current)}
        onScene={switchScene}
        onScenario={switchScenario}
      />
    </>
  );
}

function PortraitStarMap({
  portrait,
  characterConfig,
  selectedNode,
  focusReactionText,
  scenarioNotice,
  focusSheet,
  onNode,
  onRequestReorganize
}: {
  portrait: UserPortraitResponse;
  characterConfig: CharacterConfig;
  selectedNode: PortraitNode | null;
  focusReactionText: string | null;
  scenarioNotice: PortraitScenarioNoticeCopy | null;
  focusSheet: ReactNode;
  onNode: (node: PortraitNode) => void;
  onRequestReorganize: () => void;
}) {
  const activeNodes = portrait.nodes.filter((node) => node.is_active);
  const nodesByCategory = nodesByCategoryMap(activeNodes);
  const [cameraStyle, setCameraStyle] = useState<CSSProperties | undefined>(undefined);

  useEffect(() => {
    if (!selectedNode) setCameraStyle(undefined);
  }, [selectedNode]);

  function handleNodeClick(node: PortraitNode, event: MouseEvent<HTMLButtonElement>) {
    if (selectedNode) return;
    const body = event.currentTarget.closest(".starmap-body");
    if (body instanceof HTMLElement) {
      setCameraStyle(getCameraStyleFromElement(event.currentTarget, body, 0.32, 0.5, 1.4));
    }
    onNode(node);
  }

  return (
    <div className={`starmap-body ${selectedNode ? "has-focus" : ""}`} data-state="ready">
      <span className="tape-corner tl" />
      <span className="tape-corner tr" />
      <span className="tape-corner bl" />
      <span className="tape-corner br" />
      <ParchmentStars />
      {scenarioNotice && <PortraitScenarioNotice notice={scenarioNotice} />}
      <div className="starmap-canvas" style={cameraStyle}>
        <OrbitLines />
        <div className="center-medallion">
          <div className="medallion-frame">
            <img src={portrait.center.avatar_asset || portrait.center.fallback_asset || portraitAssets.centerAvatar} alt="" />
          </div>
          <div className="medallion-tape" />
          <div className="medallion-stamp">{characterConfig.selfReference}<br />& {characterConfig.userAddressing}</div>
        </div>
        <div className="ghost-marker" aria-hidden="true" />
        {(["inner", "middle", "outer"] as const).map((ring) => (
          <div className={`ring ring-${ring}`} key={ring}>
            {MAIN_NODE_SLOTS.filter((slot) => slot.ring === ring).map((slot) => {
              const node = nodesByCategory.get(slot.category);
              if (!node) return null;
              return (
                <div className="orb-slot" style={{ "--a": `${slot.angle}deg` } as CSSProperties} key={slot.slotId}>
                  <OrbNode
                    node={node}
                    slot={slot}
                    characterConfig={characterConfig}
                    focused={selectedNode?.node_id === node.node_id}
                    related={Boolean(selectedNode && selectedNode.node_id !== node.node_id && isRelated(selectedNode, node))}
                    moreCount={portrait.more_discovery_count}
                    disabled={Boolean(selectedNode)}
                    onClick={(event) => handleNodeClick(node, event)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="focus-cluster">
        {focusSheet}
      </div>
      <div className="focus-explain-bubble">
        <div className="bubble">{selectedNode ? renderCopy(focusReactionText ?? selectedNode.pet_explanation, characterConfig) : ""}</div>
      </div>
      <div className="starmap-center-pet" data-mood={portrait.nodes.length < 8 ? "dance" : "idle"}>
        <div className="pet-bubble-text">{portrait.bubble ? renderCopy(portrait.bubble.text, characterConfig) : renderCharacterTemplate("{{selfReference}}安静地陪你看星图。", characterConfig)}</div>
        <div className="pet-img-wrap" aria-hidden="true">
          <img src={getPetAssetForEmotion(portrait.bubble?.emotion ?? "gentle")} alt="" />
        </div>
        <div className="pet-progress" />
      </div>
      <div className="starmap-header">
        <button className="reorg-btn" onClick={onRequestReorganize}><span className="icn" />重新整理我的星图</button>
      </div>
    </div>
  );
}

function OrbNode({
  node,
  slot,
  characterConfig,
  focused,
  related,
  moreCount,
  disabled,
  onClick
}: {
  node: PortraitNode;
  slot: NodeSlot;
  characterConfig: CharacterConfig;
  focused: boolean;
  related: boolean;
  moreCount: number;
  disabled: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const marker = getMarker(node, slot, moreCount);
  const className = [
    "orb-node",
    slot.variant,
    slot.size ? `size-${slot.size}` : "",
    slot.prominent ? "is-prominent" : "",
    focused ? "is-focused" : "",
    related ? "is-related" : "",
    node.status === "rejected" ? "weakened" : "",
    node.status === "required_empty" ? "needs-input" : ""
  ].filter(Boolean).join(" ");

  return (
    <button className={className} data-node-id={slot.slotId} disabled={disabled} onClick={onClick} aria-label={`${displayNodeTitle(node)}：${renderCopy(node.value, characterConfig)}`}>
      <div className="orb-core" />
      {marker && <span className={`marker ${marker}`}>{marker === "has-more" ? Math.min(moreCount, 9) : null}</span>}
      <span className="orb-label">
        <span className="ribbon">{displayNodeTitle(node)}</span>
        <span className="value-hint">{displayNodeValue(node, characterConfig, slot)}</span>
      </span>
    </button>
  );
}

function FocusCluster({
  node,
  characterConfig,
  editing,
  editDraft,
  editError,
  onEditDraft,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onFeedback,
  onAskDelete,
  onClose,
  onPromote,
  onPetAcknowledge
}: {
  node: PortraitNode;
  characterConfig: CharacterConfig;
  editing: boolean;
  editDraft: string;
  editError: string | null;
  onEditDraft: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onFeedback: (value: PortraitFeedbackValue) => void;
  onAskDelete: () => void;
  onClose: () => void;
  onPromote?: () => void;
  onPetAcknowledge?: (template: string) => void;
}) {
  const [correctionDraft, setCorrectionDraft] = useState("");
  const [correctionVisible, setCorrectionVisible] = useState(node.status === "rejected");
  const renderedValue = renderCopy(node.value, characterConfig).trim();
  const isEmpty = renderedValue.length === 0;

  useEffect(() => {
    setCorrectionVisible(node.status === "rejected");
    setCorrectionDraft("");
  }, [node.node_id, node.status]);

  function handleLike() {
    setCorrectionVisible(false);
    onFeedback("like");
  }

  function handleUnlike() {
    const nextVisible = node.status !== "rejected";
    setCorrectionVisible(nextVisible);
    onFeedback("not_accurate");
  }

  function handleSaveCorrection() {
    const trimmed = correctionDraft.trim();
    setCorrectionVisible(false);
    setCorrectionDraft("");
    onPetAcknowledge?.(trimmed
      ? `{{selfReference}}知道啦，会记得“${trimmed.length > 16 ? `${trimmed.slice(0, 16)}…` : trimmed}”。`
      : "{{selfReference}}知道啦，下次会轻一点看这颗星星。");
  }

  return (
    <>
      <div className="focus-title-strip"><span className="strip-dot" />{displayNodeTitle(node)}</div>
      <div className={`focus-sheet ${editError ? "save-failed" : ""} ${isEmpty ? "is-empty" : ""} ${editing ? "is-editing" : ""}`}>
        <span className="sheet-corner-tape" />
        {editing ? (
          <div className="ft-value edit-mode" style={{ display: "block" }}>
            <textarea className="ft-input" value={editDraft} onChange={(event) => onEditDraft(event.target.value)} maxLength={80} />
            {editError && <div className="portrait-edit-error" role="status">{editError}</div>}
          </div>
        ) : (
          <p className={`ft-value ${isEmpty ? "ft-empty" : ""}`}>{isEmpty ? "还没有写下明确答案" : renderedValue}</p>
        )}
        {!editing && (
          <div className="scrap-row">
            <span className="scrap">{node.source_summary.label}</span>
            <span className="scrap violet">{confidenceCopy(node.source_summary.confidence)}</span>
          </div>
        )}
        <div className="action-toolbar">
          {editing ? (
            <>
              <button className="action-btn" data-tip="取消" aria-label="取消" onClick={onCancelEdit}><img src={iconAssets.close} alt="" /></button>
              <button className="action-btn primary" data-tip="保存" aria-label="保存" onClick={onSaveEdit}><span className="lbl">保存</span></button>
            </>
          ) : (
            <>
              {onPromote && node.available_actions.includes("move_to_main") && <button className="action-btn primary" data-tip="放回主星图" aria-label="放回主星图" onClick={onPromote}><span className="lbl">放回主星图</span></button>}
              {node.available_actions.includes("edit") && <button className={`action-btn ${isEmpty ? "primary" : ""}`} data-tip={isEmpty ? "告诉小绒" : "编辑"} aria-label={isEmpty ? "告诉小绒" : "编辑"} onClick={onStartEdit}>{isEmpty ? <span className="lbl">告诉小绒</span> : <img src={iconAssets.reply} alt="" />}</button>}
              <FeedbackButtons
                activeValue={feedbackValueFromNodeStatus(node.status)}
                canLike={node.available_actions.includes("like")}
                canUnlike={node.available_actions.includes("dislike")}
                onLike={handleLike}
                onUnlike={handleUnlike}
              />
              {node.available_actions.includes("soft_delete") && <button className="action-btn danger" data-tip="从星图上收起" aria-label="收起" onClick={onAskDelete}><img src={iconAssets.deleteBin} alt="" /></button>}
              <button className="action-btn" data-tip="收回聚焦" aria-label="关闭" onClick={onClose}><img src={iconAssets.close} alt="" /></button>
            </>
          )}
        </div>
        <div className={`correction-row ${correctionVisible ? "show" : ""}`}>
          <div className="corr-head">
            <span className="corr-label">告诉{characterConfig.selfReference}哪里不准</span>
          </div>
          <textarea value={correctionDraft} onChange={(event) => setCorrectionDraft(event.target.value)} maxLength={80} placeholder={`比如：${characterConfig.selfReference}把我的习惯看反了...`} />
          <div className="corr-foot">
            <button className="btn btn-ghost" onClick={() => {
              setCorrectionVisible(false);
              setCorrectionDraft("");
            }}>先不写</button>
            <button className="btn btn-primary" onClick={handleSaveCorrection}>记下来</button>
          </div>
        </div>
      </div>
    </>
  );
}

function FeedbackButtons({
  activeValue,
  canLike,
  canUnlike,
  onLike,
  onUnlike
}: {
  activeValue: PortraitFeedbackValue | null;
  canLike: boolean;
  canUnlike: boolean;
  onLike: () => void;
  onUnlike: () => void;
}) {
  return (
    <>
      {canLike && (
        <button
          className={`action-btn ${activeValue === "like" ? "active liked-pop" : ""}`}
          data-tip={activeValue === "like" ? "取消喜欢" : "觉得准确"}
          aria-label="喜欢"
          onClick={onLike}
        >
          <img src={iconAssets.like} alt="" />
        </button>
      )}
      {canUnlike && (
        <button
          className={`action-btn ${activeValue === "not_accurate" ? "active unlike-pop" : ""}`}
          data-tip={activeValue === "not_accurate" ? "取消不像" : "觉得不像"}
          aria-label="不像"
          onClick={onUnlike}
        >
          <img src={iconAssets.dislike} alt="" />
        </button>
      )}
    </>
  );
}

function feedbackValueFromNodeStatus(status: PortraitNode["status"]): PortraitFeedbackValue | null {
  if (status === "liked") return "like";
  if (status === "rejected") return "not_accurate";
  return null;
}

function MoreDiscoveriesView({
  discoveries,
  characterConfig,
  focusedNode,
  editing,
  editDraft,
  editError,
  error,
  focusReactionText,
  scenarioNotice,
  onEditDraft,
  onBack,
  onFocus,
  onPromote,
  onFeedback,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onAskDelete,
  onPetAcknowledge,
  onCloseFocus,
  onRetry
}: {
  discoveries: MoreDiscoveriesResponse | null;
  characterConfig: CharacterConfig;
  focusedNode: PortraitNode | null;
  editing: boolean;
  editDraft: string;
  editError: string | null;
  error: string | null;
  focusReactionText: string | null;
  scenarioNotice: PortraitScenarioNoticeCopy | null;
  onEditDraft: (value: string) => void;
  onBack: () => void;
  onFocus: (node: PortraitNode) => void;
  onPromote: (node: PortraitNode) => void;
  onFeedback: (node: PortraitNode, value: PortraitFeedbackValue) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onAskDelete: (node: PortraitNode) => void;
  onPetAcknowledge: (template: string) => void;
  onCloseFocus: () => void;
  onRetry: () => void;
}) {
  const [cameraStyle, setCameraStyle] = useState<CSSProperties | undefined>(undefined);
  const items = discoveries?.items ?? [];

  useEffect(() => {
    if (!focusedNode) setCameraStyle(undefined);
  }, [focusedNode]);

  function handleDiscoveryFocus(node: PortraitNode, event: MouseEvent<HTMLButtonElement>) {
    if (focusedNode) return;
    const body = event.currentTarget.closest(".starmap-body");
    if (body instanceof HTMLElement) {
      setCameraStyle(getCameraStyleFromElement(event.currentTarget, body, 0.32, 0.5, 1.4));
    }
    onFocus(node);
  }

  if (error && !discoveries) {
    return <PortraitExceptionPanel kind="more_failed" characterConfig={characterConfig} onRetry={onRetry} />;
  }

  return (
    <div className={`starmap-body ${focusedNode ? "has-focus" : ""}`} data-state="ready">
      <span className="tape-corner tl" />
      <span className="tape-corner tr" />
      <span className="tape-corner bl" />
      <span className="tape-corner br" />
      <ParchmentStars />
      {scenarioNotice && <PortraitScenarioNotice notice={scenarioNotice} />}
      <div className="starmap-canvas more-canvas" style={cameraStyle}>
        <div className="orbit-lines">
          <svg viewBox="0 0 1080 704" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {[
              [540, 180, 1.2], [720, 260, 1.2], [720, 460, 1.2], [540, 540, 1.2], [360, 460, 1.2],
              [360, 260, 1.2], [540, 100, 1], [840, 352, 1], [540, 620, 1], [240, 352, 1]
            ].map(([cx, cy, r]) => <circle className="orbit-tick" cx={cx} cy={cy} r={r} key={`${cx}-${cy}`} />)}
          </svg>
        </div>
        {items.length === 0 ? null : items.slice(0, 7).map((node, index) => {
          const slot = MORE_SLOTS[index] ?? MORE_SLOTS[MORE_SLOTS.length - 1];
          const marker = getMarker(node, { category: node.category } as NodeSlot, 0);
          return (
            <button
              key={node.node_id}
              className={["orb-node", slot.size ? `size-${slot.size}` : "size-sm", slot.variant, focusedNode?.node_id === node.node_id ? "is-focused" : "", node.status === "rejected" ? "weakened" : ""].filter(Boolean).join(" ")}
              style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
              data-node-id={slot.slotId}
              disabled={Boolean(focusedNode)}
              onClick={(event) => handleDiscoveryFocus(node, event)}
              aria-label={`${displayNodeTitle(node)}：${renderCopy(node.value, characterConfig)}`}
            >
              <div className="orb-core" />
              {marker && <span className={`marker ${marker}`} />}
              <span className="orb-label"><span className="ribbon">{displayNodeTitle(node)}</span><span className="value-hint">{renderCopy(node.value, characterConfig)}</span></span>
            </button>
          );
        })}
      </div>
      <div className="focus-cluster">
        {focusedNode && (
          <FocusCluster
            node={focusedNode}
            characterConfig={characterConfig}
            editing={editing}
            editDraft={editDraft}
            editError={editError}
            onEditDraft={onEditDraft}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onFeedback={(value) => onFeedback(focusedNode, value)}
            onAskDelete={() => onAskDelete(focusedNode)}
            onClose={onCloseFocus}
            onPromote={() => onPromote(focusedNode)}
            onPetAcknowledge={onPetAcknowledge}
          />
        )}
      </div>
      {items.length > 0 && (
        <div className="starmap-center-pet more-pet-center" data-mood="idle">
          <div className="pet-bubble-text">{renderCharacterTemplate(focusReactionText ?? `这些是{{selfReference}}先收起来的 ${items.length} 颗小发现。你觉得哪一颗重要，{{selfReference}}就把它放回你的星图里。`, characterConfig)}</div>
          <div className="pet-img-wrap"><img src={getPetAssetForEmotion("thinking")} alt="" /></div>
        </div>
      )}
      {items.length === 0 && <PortraitExceptionPanel kind="more_empty" characterConfig={characterConfig} onRetry={onBack} compact hidePet />}
    </div>
  );
}

function CharacterResonanceView({
  resonance,
  characterConfig,
  isReassessing,
  onFeedback,
  onPetAcknowledge,
  onReassess
}: {
  resonance: CharacterResonance;
  characterConfig: CharacterConfig;
  isReassessing: boolean;
  onFeedback: (value: PortraitFeedbackValue) => void;
  onPetAcknowledge: (template: string) => void;
  onReassess: () => void;
}) {
  const ready = resonance.status === "ready" || resonance.status === "expired";
  const expired = resonance.status === "expired";
  const authorizationUnmet = resonance.status === "authorization_unmet";
  const copy = resonanceStateCopy(resonance.status, characterConfig);
  const [correctionVisible, setCorrectionVisible] = useState(resonance.feedback_value === "not_accurate");
  const [correctionDraft, setCorrectionDraft] = useState("");

  useEffect(() => {
    setCorrectionVisible(resonance.feedback_value === "not_accurate");
    setCorrectionDraft("");
  }, [resonance.feedback_value, resonance.resonance_id]);

  function handleLike() {
    setCorrectionVisible(false);
    setCorrectionDraft("");
    onFeedback("like");
  }

  function handleUnlike() {
    const nextVisible = resonance.feedback_value !== "not_accurate";
    setCorrectionVisible(nextVisible);
    onFeedback("not_accurate");
  }

  function handleSaveCorrection() {
    const trimmed = correctionDraft.trim();
    setCorrectionVisible(false);
    setCorrectionDraft("");
    onPetAcknowledge(trimmed
      ? `{{selfReference}}记下这句了，下一次共鸣会把“${trimmed.length > 16 ? `${trimmed.slice(0, 16)}…` : trimmed}”一起放进去。`
      : "{{selfReference}}知道啦，下次会把这枚共鸣印章放轻一点。");
  }

  function handlePrimaryAction() {
    if (authorizationUnmet) {
      onPetAcknowledge("需要先去设置页打开画像和游戏数据授权，{{selfReference}}才能重新测定。");
      return;
    }
    onReassess();
  }

  const primaryLabel = authorizationUnmet
    ? "去设置打开授权"
    : isReassessing || resonance.status === "measuring"
      ? "测定中..."
      : "重新测定";
  const primaryTip = authorizationUnmet
    ? "打开授权"
    : isReassessing || resonance.status === "measuring"
      ? "测定中"
      : "重新测定";

  return (
    <div className="resonance-body" data-resonance={ready ? "completed" : "not_measured"} data-state={resonance.status}>
      <div className="role-polaroid">
        <div className="role-tape" />
        <div className="role-photo">
          <img src={resonance.role_asset || portraitAssets.resonanceSilhouette} alt="" />
        </div>
        <div className="role-cap">
          <div className="role-name">{ready ? resonance.character_name : copy.title}</div>
          <div className="role-type">{ready ? resonance.role_type : copy.subtitle}</div>
        </div>
        <div className="resonance-seal">
          <span className="pct">{ready ? "86%" : "?"}</span>
          <span className="lbl">共鸣</span>
        </div>
      </div>
      <div className="resonance-pet-prompt">
        <div className="prompt-pet">
          <img src={getPetAssetForEmotion("wave")} alt="" />
          <span className="pet-star s1" />
          <span className="pet-star s2" />
          <span className="pet-star s3" />
        </div>
      </div>
      {expired && (
        <div
          className="resonance-expired-prompt"
          aria-label={renderCharacterTemplate("这枚共鸣印章有点久了，{{selfReference}}建议重新测定一次。", characterConfig)}
        >
          <div className="pet-mini"><img src={getPetAssetForEmotion("thinking")} alt="" /></div>
        </div>
      )}
      <article className="resonance-letter">
        <h3 className="rl-title">{ready ? `${resonance.character_name} · 共鸣印章` : copy.title}</h3>
        <p className="rl-explain">{ready ? renderCopy(resonance.pet_explanation, characterConfig) : copy.body}</p>
        {ready && (
          <ul className="rl-points">
            {resonance.resonance_points.map((point, index) => (
              <li key={point}><span className="bullet">{index + 1}</span>{point}</li>
            ))}
          </ul>
        )}
        <div className={`correction-row resonance-correction ${correctionVisible ? "show" : ""}`}>
          <div className="corr-head">
            <span className="corr-label">告诉{characterConfig.selfReference}哪里不像</span>
          </div>
          <textarea value={correctionDraft} onChange={(event) => setCorrectionDraft(event.target.value)} maxLength={96} placeholder="比如：这次不像我，我更常先观察再行动..." />
          <div className="corr-foot">
            <button className="btn btn-ghost" onClick={() => {
              setCorrectionVisible(false);
              setCorrectionDraft("");
            }}>先不写</button>
            <button className="btn btn-primary" onClick={handleSaveCorrection}>告诉小绒</button>
          </div>
        </div>
        <div className="rl-foot">
          <button className="action-btn primary" data-tip={primaryTip} aria-label={primaryLabel} onClick={handlePrimaryAction}>
            <span className="lbl">{primaryLabel}</span>
          </button>
          <FeedbackButtons
            activeValue={resonance.feedback_value}
            canLike={ready}
            canUnlike={ready}
            onLike={handleLike}
            onUnlike={handleUnlike}
          />
          <span className="meta">{ready ? formatMeasuredAt(resonance.updated_at) : authorizationUnmet ? "需要打开授权" : "等待更多线索"}</span>
        </div>
      </article>
      <div className="resonance-pet">
        <div className="pet-mini"><img src={getPetAssetForEmotion("gentle")} alt="" /></div>
        <div className="diary-bubble paper">{ready ? renderCharacterTemplate("{{selfReference}}觉得这只是游戏里的小共鸣，不是给{{userAddressing}}下定义。", characterConfig) : copy.body}</div>
      </div>
    </div>
  );
}

function PortraitProtoSwitcher({
  open,
  scene,
  scenario,
  characterConfig,
  onToggle,
  onScene,
  onScenario
}: {
  open: boolean;
  scene: PortraitPrototypeScene;
  scenario: PortraitScenario;
  characterConfig: CharacterConfig;
  onToggle: () => void;
  onScene: (scene: PortraitPrototypeScene) => void;
  onScenario: (scenario: PortraitScenario) => void;
}) {
  const selectedOption = findPrototypeScenarioOption(scenario);

  return (
    <>
      <button className="proto-tab portrait-proto-tab" aria-expanded={open} onClick={onToggle}>PROTOTYPE ▾</button>
      {open && (
        <aside className="proto-panel portrait-proto-panel" role="region" aria-label="Prototype state controls">
          <h4>State scenarios</h4>
          <div className="row">
            <label htmlFor="portrait-prototype-scene">Scene</label>
            <select
              id="portrait-prototype-scene"
              value={scene}
              onChange={(event) => onScene(event.target.value as PortraitPrototypeScene)}
            >
              {PROTOTYPE_SCENES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <label htmlFor="portrait-prototype-scenario">Scenario</label>
            <select
              id="portrait-prototype-scenario"
              value={scenario}
              onChange={(event) => onScenario(event.target.value as PortraitScenario)}
            >
              {PORTRAIT_SCENARIO_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="proto-scenario-note">
            {selectedOption?.note ?? "场景以 PRD_user-portrait.md 为准；真实应用由后端返回状态。"}
          </div>

          <h4>Character config</h4>
          <div className="row">
            <label>Name</label>
            <input type="text" value={characterConfig.characterName} readOnly />
          </div>
          <div className="row">
            <label>UserAddressing</label>
            <input type="text" value={characterConfig.userAddressing} readOnly />
          </div>
          <div className="row">
            <label>SelfReference</label>
            <input type="text" value={characterConfig.selfReference} readOnly />
          </div>
          <div className="hint">Prototype-only controls. The real app reads scenes, actions, and characterConfig from backend / host.</div>
        </aside>
      )}
    </>
  );
}

function PortraitDialog({
  title,
  seal,
  body,
  confirmText,
  danger = false,
  onCancel,
  onConfirm
}: {
  title: string;
  seal: string;
  body: string;
  confirmText: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="dialog-backdrop active" role="dialog" aria-modal="true">
      <div className="dialog">
        <span className="seal">{seal}</span>
        <h3 className="dlg-title">{title}</h3>
        <p className="dlg-body">{body}</p>
        <div className="dlg-actions">
          <button className="btn btn-ghost" onClick={onCancel}>先不要</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

function PortraitExceptionPanel({
  kind,
  characterConfig,
  onRetry,
  compact = false,
  hidePet = false
}: {
  kind: "empty" | "load_failed" | "more_empty" | "more_failed";
  characterConfig: CharacterConfig;
  onRetry: () => void;
  compact?: boolean;
  hidePet?: boolean;
}) {
  const copy = {
    empty: ["第一次见面的小星图", "{{selfReference}}还没把星图点亮呢，先从怎么称呼你开始，好不好？", "sleeping"],
    load_failed: ["这片星空雾有点大", "这片星空暂时雾有点大，等会儿{{selfReference}}再帮你看。", "sorry"],
    more_empty: ["这里暂时没有小发现", "这里暂时没有收起来的小发现。等{{selfReference}}再认识你一点，会把不急着贴上去的星星先放这里。", "sleeping"],
    more_failed: ["小信封暂时没打开", "这只小信封暂时没打开，等会儿再试。", "sorry"]
  }[kind];
  return (
    <div className={`portrait-exception ${compact ? "compact" : ""} ${hidePet ? "no-pet" : ""}`}>
      {!hidePet && <img src={getPetAssetForEmotion(copy[2])} alt="" />}
      <h3>{copy[0]}</h3>
      <p>{renderCharacterTemplate(copy[1], characterConfig)}</p>
      <div className="portrait-exception-actions"><button className="btn-primary" onClick={onRetry}>{kind.includes("failed") ? "稍后再试" : "知道了"}</button></div>
    </div>
  );
}

function PortraitLoading({ characterConfig }: { characterConfig: CharacterConfig }) {
  const loadingLabel = renderCharacterTemplate("{{selfReference}}正在整理你的小星图。", characterConfig);
  return (
    <div className="starmap-body portrait-loading-stage" data-state="loading" role="status" aria-label={loadingLabel}>
      <div className="portrait-loading-pet" data-mood="dance">
        <div className="pet-img-wrap"><img src={getPetAssetForEmotion("writing")} alt="" /></div>
        <div className="portrait-loading-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function PortraitProgressOverlay({ overlay }: { overlay: NonNullable<PortraitProgressOverlayState> }) {
  return (
    <div className="portrait-process-overlay show" role="status" aria-live="polite">
      <div className="reassess-card">
        <div className="reassess-pet">
          <img src={getPetAssetForEmotion("writing")} alt="" />
          <span className="pet-star s1" />
          <span className="pet-star s2" />
          <span className="pet-star s3" />
          <span className="pet-star s4" />
        </div>
        <div className="reassess-title">{overlay.title}</div>
        <div className="reassess-progress"><span className="reassess-progress-fill" /></div>
        <p className="reassess-sub">{overlay.sub}</p>
      </div>
    </div>
  );
}

function PortraitScenarioNotice({ notice }: { notice: PortraitScenarioNoticeCopy }) {
  return (
    <div className={`portrait-state-note ${notice.tone ?? "soft"}`} role="status">
      <span className="note-gem" />
      <div>
        <strong>{notice.title}</strong>
        <p>{notice.body}</p>
      </div>
    </div>
  );
}

function PortraitToast({ reaction, characterConfig }: { reaction: PortraitPetReaction; characterConfig: CharacterConfig }) {
  return (
    <div className="toast portrait-toast" role="status">
      <img src={getPetAssetForEmotion(reaction.emotion || "wave")} alt="" />
      <span>{renderCopy(reaction.reaction_text, characterConfig)}</span>
    </div>
  );
}

function OrbitLines() {
  const ticks = [
    [540, 210, 1.4], [710, 380, 1.4], [540, 550, 1.4], [370, 380, 1.4],
    [540, 110, 1.2], [810, 380, 1.2], [540, 650, 1.2], [270, 380, 1.2],
    [540, 60, 1.1], [908, 380, 1.1], [540, 700, 1.1], [172, 380, 1.1]
  ];

  return (
    <div className="orbit-lines">
      <svg viewBox="0 0 1080 760" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <circle className="orbit-track gold" cx="540" cy="380" r="170" />
        <circle className="orbit-track violet" cx="540" cy="380" r="270" />
        <ellipse className="orbit-track ink" cx="540" cy="380" rx="370" ry="320" />
        {ticks.map(([cx, cy, r]) => <circle className="orbit-tick" cx={cx} cy={cy} r={r} key={`${cx}-${cy}`} />)}
      </svg>
    </div>
  );
}

function ParchmentStars() {
  const points = [
    [12, 14], [88, 18], [18, 82], [84, 78], [50, 8], [50, 92], [8, 50], [92, 48]
  ];
  return (
    <div className="parchment-stars">
      {points.map(([left, top]) => <span className="tiny" style={{ left: `${left}%`, top: `${top}%` }} key={`${left}-${top}`} />)}
    </div>
  );
}

function getMarker(node: PortraitNode, slot: NodeSlot, moreCount: number): OrbMarker {
  if (slot.category === "more_discoveries") return moreCount > 0 ? "has-more" : null;
  if (node.status === "required_empty") return "required";
  if (node.status === "new_discovery") return "new";
  if (node.status === "user_edited") return "edited";
  if (node.status === "liked") return "liked";
  if (node.status === "rejected") return "unlike";
  return null;
}

function displayNodeTitle(node: PortraitNode): string {
  return CATEGORY_TITLE[node.category] ?? node.display_name;
}

function displayNodeValue(node: PortraitNode, characterConfig: CharacterConfig, slot?: NodeSlot): string {
  if (slot?.category === "character_resonance") return "点开查看共鸣";
  if (node.status === "required_empty") return "待填写";
  return renderCopy(node.value, characterConfig);
}

function nodesByCategoryMap(nodes: PortraitNode[]): Map<PortraitNodeCategory, PortraitNode> {
  return new Map(nodes.map((node) => [node.category, node]));
}

function getCameraStyleFromElement(
  target: HTMLElement,
  body: HTMLElement,
  targetXPct: number,
  targetYPct: number,
  scale: number
): CSSProperties {
  const bodyRect = body.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const orbX = targetRect.left + targetRect.width / 2 - bodyRect.left;
  const orbY = targetRect.top + targetRect.height / 2 - bodyRect.top;
  const targetX = targetXPct * bodyRect.width;
  const targetY = targetYPct * bodyRect.height;
  return {
    transformOrigin: `${orbX}px ${orbY}px`,
    transform: `translate(${targetX - orbX}px, ${targetY - orbY}px) scale(${scale})`
  };
}

function isRelated(selected: PortraitNode, node: PortraitNode): boolean {
  if (selected.category === "current_goal") return ["play_style", "practice_stage"].includes(node.category);
  if (selected.category === "play_style") return ["current_goal", "preferred_character", "character_resonance"].includes(node.category);
  if (selected.category === "diary_preference") return ["recent_achievement", "companion_preference"].includes(node.category);
  return selected.ring === node.ring;
}

function replaceNodeInPortrait(portrait: UserPortraitResponse | null, node: PortraitNode): UserPortraitResponse | null {
  if (!portrait) return portrait;
  return {
    ...portrait,
    nodes: portrait.nodes.map((item) => item.node_id === node.node_id ? node : item)
  };
}

function removeNodeFromPortrait(portrait: UserPortraitResponse | null, nodeId: string): UserPortraitResponse | null {
  if (!portrait) return portrait;
  return {
    ...portrait,
    nodes: portrait.nodes.filter((item) => item.node_id !== nodeId)
  };
}

function replaceNodeInMoreDiscoveries(discoveries: MoreDiscoveriesResponse | null, node: PortraitNode): MoreDiscoveriesResponse | null {
  if (!discoveries) return discoveries;
  return {
    ...discoveries,
    items: discoveries.items.map((item) => item.node_id === node.node_id ? node : item)
  };
}

function removeNodeFromMoreDiscoveries(discoveries: MoreDiscoveriesResponse | null, nodeId: string): MoreDiscoveriesResponse | null {
  if (!discoveries) return discoveries;
  return {
    ...discoveries,
    items: discoveries.items.filter((item) => item.node_id !== nodeId),
    pagination: { ...discoveries.pagination, total: Math.max(0, discoveries.pagination.total - 1) }
  };
}

function renderCopy(template: string, characterConfig: CharacterConfig): string {
  return renderCharacterTemplate(template, characterConfig);
}

function confidenceCopy(confidence: PortraitNode["source_summary"]["confidence"]): string {
  const copy = {
    low: "还在观察",
    medium: "和玩法风格相关",
    high: "比较稳定",
    user_confirmed: "你亲自告诉小绒的"
  };
  return copy[confidence];
}

function formatMeasuredAt(iso: string | null): string {
  if (!iso) return "测定时间待同步";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "测定时间待同步";
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `测定于 ${value.year}-${value.month}-${value.day} ${value.hour}:${value.minute}`;
}

function resonanceStateCopy(status: CharacterResonance["status"], characterConfig: CharacterConfig) {
  const copy = {
    ready: {
      title: "共鸣结果",
      subtitle: "{{selfReference}}把星图上的线索合在一起，盖出了一枚小印章。",
      body: ""
    },
    unmeasured: {
      title: "还没看过你像谁",
      subtitle: "星图还没有盖上共鸣印章。",
      body: "{{selfReference}}还没测过{{userAddressing}}和哪位角色更有共鸣。"
    },
    insufficient_data: {
      title: "再多陪你几局",
      subtitle: "现在测会太像乱猜。",
      body: "现在就下结论太急了，再多陪你几局{{selfReference}}会看得更清楚。"
    },
    authorization_unmet: {
      title: "需要先打开授权",
      subtitle: "去设置页开启画像和游戏数据授权。",
      body: "当前授权不足，{{selfReference}}不能测定角色共鸣。请先到设置页打开相关授权。"
    },
    measuring: {
      title: "对照这张星图",
      subtitle: "纸条正在慢慢对齐。",
      body: "{{selfReference}}正在对照这张星图，稍等一下。"
    },
    failed: {
      title: "这次没测准",
      subtitle: "共鸣印章先不展示。",
      body: "{{selfReference}}先把纸收好，晚点再试。"
    },
    asset_missing: {
      title: "资料还没贴好",
      subtitle: "角色相纸暂时缺席。",
      body: "这位角色的资料还没贴好，{{selfReference}}先不乱猜。"
    },
    expired: {
      title: "旧共鸣结果",
      subtitle: "这枚印章需要重新测定。",
      body: "{{selfReference}}会保留旧结果，但建议重新测定一次。"
    }
  }[status];
  return {
    title: renderCharacterTemplate(copy.title, characterConfig),
    subtitle: renderCharacterTemplate(copy.subtitle, characterConfig),
    body: renderCharacterTemplate(copy.body, characterConfig)
  };
}

function findPrototypeScenarioOption(scenario: PortraitScenario) {
  return PORTRAIT_SCENARIO_GROUPS.flatMap((group) => group.options).find((item) => item.value === scenario);
}

function prototypeSceneForScenario(scenario: PortraitScenario): PortraitPrototypeScene {
  return findPrototypeScenarioOption(scenario)?.scene ?? "main";
}

function prototypeSceneFromState(
  mode: PortraitMode,
  selectedNode: PortraitNode | null,
  selectedDiscovery: PortraitNode | null
): PortraitPrototypeScene {
  if (mode === "resonance") return "resonance";
  if (mode === "more") return selectedDiscovery ? "discovery_focus" : "more";
  if (selectedNode) return "node_focus";
  return "main";
}

function prototypeFocusNodeForScenario(scenario: PortraitScenario, nodes: PortraitNode[]): PortraitNode | null {
  const byCategory = nodesByCategoryMap(nodes.filter((node) => node.is_active));
  const focusCategory: PortraitNodeCategory =
    scenario === "node_focus_low_signal" || scenario === "node_focus_unliked" || scenario === "node_focus_consecutive_unlike"
      ? "stuck_point"
      : scenario === "node_focus_liked"
        ? "diary_preference"
        : scenario === "node_focus_deleted"
          ? "dynamic_discovery"
          : scenario === "ai_output_real_personality_judgement"
            ? "character_resonance"
            : "name";
  const baseNode = byCategory.get(focusCategory) ?? nodes.find((node) => node.is_active) ?? null;
  if (!baseNode) return null;
  if (shouldShowNotAccurateForScenario(scenario)) return { ...baseNode, status: "rejected" };
  if (scenario === "node_focus_liked") return { ...baseNode, status: "liked" };
  if (scenario === "node_focus_low_signal") return { ...baseNode, status: "low_signal" };
  if (scenario === "user_operation_model_overturns_edit") return { ...baseNode, status: "user_edited" };
  return baseNode;
}

function shouldStartEditingForScenario(scenario: PortraitScenario): boolean {
  return ["node_focus_editing", "edit_save_failed", "user_operation_edit_conflict", "ai_output_blocked_backend_fields"].includes(scenario);
}

function shouldShowNotAccurateForScenario(scenario: PortraitScenario): boolean {
  return ["node_focus_unliked", "node_focus_consecutive_unlike"].includes(scenario);
}

function mainScenarioNotice(scenario: PortraitScenario, characterConfig: CharacterConfig): PortraitScenarioNoticeCopy | null {
  const selfReference = characterConfig.selfReference;
  const userAddressing = characterConfig.userAddressing;
  const copy: Partial<Record<PortraitScenario, PortraitScenarioNoticeCopy>> = {
    portrait_low_data: {
      title: "还想多认识你一点",
      body: `现在只留下核心小星星，${selfReference}不会把还没看清的地方写得太肯定。`
    },
    portrait_too_many_nodes: {
      title: "主星图有点满",
      body: `${selfReference}只把最近、重要、常用的节点贴在主星图，其余先收进更多发现。`
    },
    portrait_pending_discoveries_overflow: {
      title: "待确认发现有点多",
      body: `这里只露出最靠近${userAddressing}现在状态的一颗，其余先放在夹层里等你慢慢看。`
    },
    portrait_bubble_disabled: {
      title: "气泡已关闭",
      body: `${selfReference}会安静陪着，不在头顶主动冒泡打扰。`
    },
    portrait_voice_disabled: {
      title: "语音已关闭",
      body: "保留文字提示，不主动播放语音。"
    },
    asset_center_avatar_failed: {
      title: "中心头像暂时没贴上",
      body: "先用默认相纸占位，星图节点仍然可以查看和编辑。",
      tone: "warn"
    },
    user_operation_deleted_node_reappears: {
      title: "被收起的节点不会复活",
      body: "同类内容只会作为新的待确认发现出现，不沿用旧文案。",
      tone: "warn"
    },
    reorganize_failed: {
      title: "这次没有整理成功",
      body: "原来的星图先保持不动，你亲自改过的纸条不会丢。",
      tone: "warn"
    }
  };
  return copy[scenario] ?? null;
}

function moreScenarioNotice(scenario: PortraitScenario, characterConfig: CharacterConfig): PortraitScenarioNoticeCopy | null {
  const selfReference = characterConfig.selfReference;
  const copy: Partial<Record<PortraitScenario, PortraitScenarioNoticeCopy>> = {
    more_duplicate_discovery: {
      title: "相似发现会合并",
      body: `${selfReference}会保留主星图里的那颗，夹层里相似的小纸条不会重复占位。`
    },
    discovery_move_to_main_full: {
      title: "主星图暂时贴满了",
      body: "需要先整理星图，或把低优先级的小星星收进夹层，再把这颗放回去。",
      tone: "warn"
    },
    discovery_move_conflict: {
      title: "这颗和已有节点有点像",
      body: "不会直接覆盖，后端会让你选择保留哪一颗或合并。",
      tone: "warn"
    }
  };
  return copy[scenario] ?? null;
}

type PrototypeCapablePortraitService = PortraitService & {
  setScenario: (scenario: PortraitScenario) => void;
};

function getPrototypeCapablePortraitService(service: PortraitService): PrototypeCapablePortraitService | null {
  if ("setScenario" in service) {
    return service as PrototypeCapablePortraitService;
  }
  return null;
}
