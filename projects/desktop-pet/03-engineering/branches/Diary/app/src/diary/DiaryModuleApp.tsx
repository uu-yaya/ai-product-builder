import type { FormEvent, PointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demoCharacterConfig, renderCharacterTemplate } from "./characterConfig";
import { createDiaryService } from "./api/serviceFactory";
import { DiaryServiceError, type DiaryService } from "./api/DiaryService";
import type { MockScenario } from "./api/mockDiaryService";
import { getPetAssetForEmotion, iconAssets, petSceneEmotionMap } from "./petAssets";
import type {
  ChatBubbleKind,
  CharacterConfig,
  DiaryCard,
  DiaryDetail,
  DiaryReply,
  EmptyStateType,
  MailboxResponse,
  PetReaction,
  SynthesizeSpeechInput,
  SynthesizeSpeechResponse,
  VoiceStyle
} from "./types";

const USER_ID = "user_demo";
const GAME_CONTEXT_ID = "game_ctx_demo";

type View = "desktop" | "mailbox" | "detail";
type ChatBubbleFeedbackMap = Record<string, 0 | 1>;
type VoiceInputState = "idle" | "listening";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternativeLike | undefined;
}

interface SpeechRecognitionResultListLike {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResultLike | undefined;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function chatBubbleKey(targetType: ChatBubbleKind, targetId: string): string {
  return `${targetType}:${targetId}`;
}

function estimatedVoiceDurationMs(text: string): number {
  const compactLength = text.replace(/\s+/g, "").length;
  return Math.min(45000, Math.max(3500, compactLength * 360 + 2200));
}

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function loadSpeechSynthesisVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!("speechSynthesis" in window)) return Promise.resolve([]);
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);

  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = finish;
    window.setTimeout(finish, 1000);
  });
}

function selectChineseSpeechVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "zh-cn") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("zh")) ??
    voices.find((voice) => /chinese|mandarin|putonghua|普通话|中文/i.test(voice.name)) ??
    null
  );
}

export function DiaryModuleApp() {
  const service = useMemo(() => createDiaryService(), []);
  const [view, setView] = useState<View>("desktop");
  const [mailbox, setMailbox] = useState<MailboxResponse | null>(null);
  const [detail, setDetail] = useState<DiaryDetail | null>(null);
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>(demoCharacterConfig);
  const [prototypeOpen, setPrototypeOpen] = useState(false);
  const [prototypeScenario, setPrototypeScenario] = useState<MockScenario>("normal");
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiaryDetail | null>(null);
  const [toast, setToast] = useState<PetReaction | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [hiddenChatBubbles, setHiddenChatBubbles] = useState<Set<string>>(() => new Set());
  const [chatBubbleFeedback, setChatBubbleFeedback] = useState<ChatBubbleFeedbackMap>({});
  const [speakingPetReactionId, setSpeakingPetReactionId] = useState<string | null>(null);
  const [desktopReaction, setDesktopReaction] = useState<PetReaction | null>(null);
  const activeVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeVoiceUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceStopTimerRef = useRef<number | null>(null);
  const voicePlaybackTokenRef = useRef(0);

  useEffect(() => {
    return () => {
      voicePlaybackTokenRef.current += 1;
      activeVoiceAudioRef.current?.pause();
      activeVoiceAudioRef.current = null;
      activeVoiceUtteranceRef.current = null;
      if (voiceStopTimerRef.current !== null) window.clearTimeout(voiceStopTimerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const showToast = useCallback((reaction: PetReaction) => {
    setToast(reaction);
    window.setTimeout(() => setToast((current) => (current?.reaction_id === reaction.reaction_id ? null : current)), 2600);
  }, []);

  const synthesizeSpeech = useCallback(
    async (input: SynthesizeSpeechInput): Promise<SynthesizeSpeechResponse> => service.synthesizeSpeech(input),
    [service]
  );

  const loadMailbox = useCallback(
    async (nextPage = 1, shouldNavigate = false) => {
      setLoading(true);
      setInlineError(null);
      try {
        const response = await service.getMailbox({
          user_id: USER_ID,
          game_context_id: GAME_CONTEXT_ID,
          page: nextPage,
          page_size: 10
        });
        setMailbox(response);
        setCharacterConfig(response.character_config);
        setPage(response.pagination.page);
        if (shouldNavigate) setView("mailbox");
      } catch {
        setInlineError("信箱暂时没有打开，稍后再看。");
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  useEffect(() => {
    void loadMailbox(1, false);
  }, [loadMailbox]);

  useEffect(() => {
    if (!mailbox) return undefined;
    let cancelled = false;
    const scene = mailbox.unread_count > 0 ? "new_diary_available" : "empty_state";

    void service.generatePetReaction({
      scene,
      diary_id: null,
      reply_id: null,
      character_config: characterConfig,
      context: {
        unread_count: mailbox.unread_count,
        total_diaries: mailbox.pagination.total,
        mailbox_state: mailbox.empty_state_type ?? (mailbox.unread_count > 0 ? "has_unread" : "history_only")
      }
    }).then((reaction) => {
      if (!cancelled) setDesktopReaction(reaction);
    }).catch(() => {
      if (!cancelled) setDesktopReaction(null);
    });

    return () => {
      cancelled = true;
    };
  }, [characterConfig, mailbox?.empty_state_type, mailbox?.pagination.total, mailbox?.unread_count, service]);

  function applyPrototypeScenario(nextScenario: MockScenario) {
    setPrototypeScenario(nextScenario);
    setBubbleDismissed(false);
    setDetail(null);
    setReplyDraft("");
    setReplyError(null);
    setHiddenChatBubbles(new Set());
    setChatBubbleFeedback({});
    setDesktopReaction(null);
    stopVoicePlayback();
    getPrototypeCapableService(service)?.setScenario(nextScenario);

    if (nextScenario === "first_empty" || nextScenario === "generation_failed") {
      void loadMailbox(1, true);
      return;
    }

    if (view === "detail") setView("mailbox");
    void loadMailbox(1, view !== "desktop");
  }

  function updatePrototypeCharacterConfig(field: "characterName" | "userAddressing" | "selfReference", value: string) {
    const fallbackValue = demoCharacterConfig[field];
    const nextConfig = { ...characterConfig, [field]: value || fallbackValue };
    setCharacterConfig(nextConfig);
    getPrototypeCapableService(service)?.setCharacterConfig(nextConfig);

    if (view === "mailbox") {
      void loadMailbox(page, false);
    }
  }

  function markMailboxCardAsRead(diaryId: string) {
    setMailbox((current) => {
      if (!current) return current;
      const wasUnread = current.items.some((item) => item.diary_id === diaryId && item.mailbox_status === "unread");

      return {
        ...current,
        unread_count: wasUnread ? Math.max(0, current.unread_count - 1) : current.unread_count,
        items: current.items.map((item) => (
          item.diary_id === diaryId ? { ...item, mailbox_status: "read" } : item
        ))
      };
    });
  }

  function refreshOpeningReaction(diaryDetail: DiaryDetail) {
    void service.generatePetReaction({
      scene: "diary_opened",
      diary_id: diaryDetail.diary_id,
      reply_id: null,
      character_config: characterConfig,
      context: {
        diary_title: diaryDetail.title,
        content_angle: diaryDetail.content_angle
      }
    }).then((openingReaction) => {
      setDetail((current) => (
        current?.diary_id === diaryDetail.diary_id
          ? { ...current, pet_opening_reaction: openingReaction }
          : current
      ));
    }).catch(() => undefined);
  }

  async function openDetail(card: DiaryCard) {
    setLoading(true);
    setInlineError(null);
    try {
      await service.updateDiaryState(card.diary_id, USER_ID, {
        mailbox_status: "read",
        bubble_status: "opened",
        read_at: new Date().toISOString()
      });
      const diaryDetail = await service.getDiaryDetail(card.diary_id, USER_ID);
      markMailboxCardAsRead(card.diary_id);
      setDetail({ ...diaryDetail, mailbox_status: "read" });
      setReplyDraft("");
      setReplyError(null);
      setView("detail");
      refreshOpeningReaction(diaryDetail);
    } catch (error) {
      setInlineError(error instanceof DiaryServiceError ? error.message : "这封信暂时没有取到。");
    } finally {
      setLoading(false);
    }
  }

  async function updateFavorite() {
    if (!detail) return;
    const nextValue = !detail.is_favorited;
    const result = await service.updateDiaryState(detail.diary_id, USER_ID, { is_favorited: nextValue });
    setDetail({ ...detail, is_favorited: result.is_favorited });
    await loadMailbox(page, false);
  }

  async function submitFeedback(value: 0 | 1) {
    if (!detail) return;
    const response = await service.submitDiaryFeedback(detail.diary_id, value, value === 0 ? "not_accurate" : null, "button");
    setDetail({
      ...detail,
      feedback_state: {
        current_value: response.current_feedback.value,
        latest_feedback_at: response.current_feedback.at,
        reason: response.current_feedback.reason
      }
    });
    showToast(response.pet_reaction);
  }

  async function submitReply(event: FormEvent) {
    event.preventDefault();
    if (!detail || !replyDraft.trim()) return;
    setSendingReply(true);
    setInlineError(null);
    setReplyError(null);
    try {
      const response = await service.submitDiaryReply(detail.diary_id, USER_ID, replyDraft.trim());
      const replyWithReaction: DiaryReply = { ...response.reply, pet_reaction: response.pet_reaction };
      const nextReplies = [...detail.replies, replyWithReaction];
      setDetail({
        ...detail,
        replies: nextReplies,
        feedback_state: mergeReplyFeedback(detail.feedback_state, replyWithReaction)
      });
      setReplyDraft("");
      playPetReactionVoice(response.pet_reaction);
    } catch {
      setReplyError("信好像没寄出去，等一下再试。");
    } finally {
      setSendingReply(false);
    }
  }

  async function copyChatBubbleText(text: string) {
    try {
      await window.navigator.clipboard.writeText(text);
    } catch {
      setInlineError("这句话暂时没复制好。");
    }
  }

  async function deleteChatBubble(targetType: ChatBubbleKind, targetId: string) {
    try {
      const result = await service.deleteChatBubble(targetType, targetId);
      setHiddenChatBubbles((current) => {
        const next = new Set(current);
        next.add(chatBubbleKey(result.target_type, result.target_id));
        return next;
      });
    } catch {
      setInlineError("这条气泡暂时收不起来。");
    }
  }

  async function submitChatBubbleFeedback(targetType: ChatBubbleKind, targetId: string, value: 0 | 1) {
    try {
      const result = await service.submitChatBubbleFeedback(targetType, targetId, value);
      setChatBubbleFeedback((current) => ({
        ...current,
        [chatBubbleKey(result.target_type, result.target_id)]: result.current_feedback.value
      }));
    } catch {
      setInlineError("这次反馈暂时没记好。");
    }
  }

  function playUserChatBubbleVoice(text: string, audioUrl?: string) {
    void playVoice(text, audioUrl, null, "soft", "user_reply");
  }

  function playPetReactionVoice(reaction: PetReaction) {
    void playVoice(reaction.reaction_text, reaction.voice_audio_url, reaction.reaction_id, "soft", reaction.scene);
  }

  async function playVoice(
    text: string,
    audioUrl?: string,
    petReactionId?: string | null,
    voiceStyle: VoiceStyle = "soft",
    scene: SynthesizeSpeechInput["scene"] = "manual_playback"
  ) {
    stopVoicePlayback(false);
    const playbackToken = voicePlaybackTokenRef.current;
    setSpeakingPetReactionId(petReactionId ?? null);

    const finishSpeaking = () => {
      if (voicePlaybackTokenRef.current !== playbackToken) return;
      clearVoiceStopTimer();
      activeVoiceAudioRef.current = null;
      setSpeakingPetReactionId((current) => (petReactionId ? (current === petReactionId ? null : current) : null));
    };

    const playBrowserVoice = async () => {
      if (voicePlaybackTokenRef.current !== playbackToken) return;
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        finishSpeaking();
        setInlineError("当前环境暂时不支持语音播放。");
        return;
      }

      const voices = await loadSpeechSynthesisVoices();
      if (voicePlaybackTokenRef.current !== playbackToken) return;

      const utterance = new SpeechSynthesisUtterance(text);
      activeVoiceUtteranceRef.current = utterance;
      utterance.lang = "zh-CN";
      utterance.rate = 1;
      utterance.pitch = 1.08;
      const preferredVoice = selectChineseSpeechVoice(voices);
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onend = () => {
        activeVoiceUtteranceRef.current = null;
        finishSpeaking();
      };
      utterance.onerror = () => {
        activeVoiceUtteranceRef.current = null;
        finishSpeaking();
        setInlineError("当前环境暂时没有可播放的语音。");
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      await waitForNextFrame();
      if (voicePlaybackTokenRef.current !== playbackToken) return;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.resume();
      scheduleVoiceAutoStop(playbackToken, estimatedVoiceDurationMs(text));
    };

    let playableAudioUrl = audioUrl;
    if (!playableAudioUrl) {
      try {
        const synthesized = await synthesizeSpeech({ text, voice_style: voiceStyle, scene });
        if (voicePlaybackTokenRef.current !== playbackToken) return;
        playableAudioUrl = synthesized.voice_audio_url;
      } catch {
        playableAudioUrl = undefined;
      }
    }

    if (playableAudioUrl) {
      const audio = new Audio(playableAudioUrl);
      activeVoiceAudioRef.current = audio;
      audio.onended = finishSpeaking;
      audio.onloadedmetadata = () => {
        if (voicePlaybackTokenRef.current !== playbackToken) return;
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          scheduleVoiceAutoStop(playbackToken, Math.ceil(audio.duration * 1000) + 900);
        }
      };
      audio.onerror = () => {
        if (voicePlaybackTokenRef.current !== playbackToken) return;
        activeVoiceAudioRef.current = null;
        void playBrowserVoice();
      };
      void audio.play().catch(() => {
        if (voicePlaybackTokenRef.current !== playbackToken) return;
        activeVoiceAudioRef.current = null;
        void playBrowserVoice();
      });
      scheduleVoiceAutoStop(playbackToken, estimatedVoiceDurationMs(text));
      return;
    }

    void playBrowserVoice();
  }

  function clearVoiceStopTimer() {
    if (voiceStopTimerRef.current !== null) {
      window.clearTimeout(voiceStopTimerRef.current);
      voiceStopTimerRef.current = null;
    }
  }

  function scheduleVoiceAutoStop(playbackToken: number, delayMs: number) {
    clearVoiceStopTimer();
    voiceStopTimerRef.current = window.setTimeout(() => {
      if (voicePlaybackTokenRef.current !== playbackToken) return;
      activeVoiceAudioRef.current?.pause();
      activeVoiceAudioRef.current = null;
      window.speechSynthesis?.cancel();
      setSpeakingPetReactionId(null);
      clearVoiceStopTimer();
    }, delayMs);
  }

  function stopVoicePlayback(clearIndicator = true) {
    voicePlaybackTokenRef.current += 1;
    clearVoiceStopTimer();
    activeVoiceAudioRef.current?.pause();
    activeVoiceAudioRef.current = null;
    activeVoiceUtteranceRef.current = null;
    window.speechSynthesis?.cancel();
    if (clearIndicator) setSpeakingPetReactionId(null);
  }

  async function confirmSoftDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      const response = await service.softDeleteDiary(deleteTarget.diary_id, USER_ID);
      setDeleteTarget(null);
      setDetail(null);
      showToast(response.pet_reaction);
      await loadMailbox(1, true);
    } catch {
      setInlineError("信好像没收好，等一下再试。");
    } finally {
      setLoading(false);
    }
  }

  const unreadCount = mailbox?.unread_count ?? 0;
  const desktopEmotion = desktopReaction?.emotion ?? (unreadCount > 0 ? petSceneEmotionMap.new_diary_available : "gentle");
  const detailCards = mailbox?.items ?? [];
  const detailIndex = detail ? detailCards.findIndex((card) => card.diary_id === detail.diary_id) : -1;
  const previousDetailCard = detailIndex > 0 ? detailCards[detailIndex - 1] : null;
  const nextDetailCard = detailIndex >= 0 && detailIndex < detailCards.length - 1 ? detailCards[detailIndex + 1] : null;

  return (
    <main className="diary-stage">
      {view === "desktop" && (
        <DesktopEntry
          unreadCount={unreadCount}
          mailboxReady={Boolean(mailbox)}
          characterConfig={characterConfig}
          emotion={desktopEmotion}
          reaction={desktopReaction}
          bubbleDismissed={bubbleDismissed}
          onResolveVoice={(text) => synthesizeSpeech({ text, voice_style: "soft", scene: "desktop_entry" })}
          onDismissBubble={() => setBubbleDismissed(true)}
          onOpenMailbox={() => void loadMailbox(1, true)}
        />
      )}

      {view === "mailbox" && mailbox && (
        mailbox.items.length === 0 ? (
          <EmptyState
            type={mailbox.empty_state_type ?? "first_empty"}
            characterConfig={characterConfig}
            onBack={() => setView("desktop")}
          />
        ) : (
          <MailboxView
            mailbox={mailbox}
            loading={loading}
            characterConfig={characterConfig}
            onBack={() => setView("desktop")}
            onOpenDetail={(card) => void openDetail(card)}
            onPage={(nextPage) => void loadMailbox(nextPage, false)}
          />
        )
      )}

      {view === "detail" && detail && (
        <DiaryDetailView
          detail={detail}
          previousCard={previousDetailCard}
          nextCard={nextDetailCard}
          positionLabel={detailIndex >= 0 && mailbox ? `第 ${detailIndex + 1} / ${mailbox.pagination.total} 封` : null}
          characterConfig={characterConfig}
          replyDraft={replyDraft}
          sendingReply={sendingReply}
          replyError={replyError}
          onBack={() => void loadMailbox(page, true)}
          onOpenAdjacent={(card) => void openDetail(card)}
          onReplyDraft={setReplyDraft}
          onSubmitReply={(event) => void submitReply(event)}
          onFeedback={(value) => void submitFeedback(value)}
          onFavorite={() => void updateFavorite()}
          onAskDelete={() => setDeleteTarget(detail)}
          hiddenChatBubbles={hiddenChatBubbles}
          chatBubbleFeedback={chatBubbleFeedback}
          speakingPetReactionId={speakingPetReactionId}
          onCopyChatBubble={(text) => void copyChatBubbleText(text)}
          onDeleteChatBubble={(targetType, targetId) => void deleteChatBubble(targetType, targetId)}
          onChatBubbleFeedback={(targetType, targetId, value) => void submitChatBubbleFeedback(targetType, targetId, value)}
          onPlayPetReactionVoice={playPetReactionVoice}
          onPlayUserChatBubbleVoice={playUserChatBubbleVoice}
        />
      )}

      {inlineError && <div className="inline-status" role="status">{inlineError}</div>}
      {toast && <PetReactionToast reaction={toast} />}
      <PrototypePanel
        open={prototypeOpen}
        scenario={prototypeScenario}
        characterConfig={characterConfig}
        onToggle={() => setPrototypeOpen((current) => !current)}
        onScenario={applyPrototypeScenario}
        onCharacterConfig={updatePrototypeCharacterConfig}
      />
      {deleteTarget && (
        <DeleteConfirmDialog
          detail={deleteTarget}
          characterConfig={characterConfig}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void confirmSoftDelete()}
        />
      )}
    </main>
  );
}

function DesktopEntry({
  unreadCount,
  mailboxReady,
  characterConfig,
  emotion,
  reaction,
  bubbleDismissed,
  onResolveVoice,
  onDismissBubble,
  onOpenMailbox
}: {
  unreadCount: number;
  mailboxReady: boolean;
  characterConfig: CharacterConfig;
  emotion: string;
  reaction: PetReaction | null;
  bubbleDismissed: boolean;
  onResolveVoice: (text: string) => Promise<SynthesizeSpeechResponse>;
  onDismissBubble: () => void;
  onOpenMailbox: () => void;
}) {
  const bubble = unreadCount > 1
    ? "{{userAddressing}}，有几封小信在等你拆开呢。"
    : unreadCount === 1
      ? "{{userAddressing}}，{{selfReference}}把昨天的小信藏好啦，要拆开看看吗？"
      : "{{userAddressing}}，{{selfReference}}今天不打扰你。";
  const bubbleText = reaction?.reaction_text ?? renderCharacterTemplate(bubble, characterConfig);
  const [desktopSpeaking, setDesktopSpeaking] = useState(false);

  useEffect(() => {
    if (!mailboxReady || bubbleDismissed) return undefined;

    let autoDismissTimer: number | undefined;
    let fallbackTimer: number | undefined;
    let audio: HTMLAudioElement | null = null;
    let cancelled = false;

    const dismissLater = (delay = 1500) => {
      window.clearTimeout(autoDismissTimer);
      autoDismissTimer = window.setTimeout(() => {
        if (!cancelled) onDismissBubble();
      }, delay);
    };

    const finishSpeaking = () => {
      if (cancelled) return;
      setDesktopSpeaking(false);
      dismissLater();
    };

    window.speechSynthesis?.cancel();
    setDesktopSpeaking(true);

    const playBrowserVoice = () => {
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        setDesktopSpeaking(false);
        dismissLater(4200);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(bubbleText);
      utterance.lang = "zh-CN";
      utterance.rate = 1;
      utterance.pitch = 1.08;
      utterance.onend = finishSpeaking;
      utterance.onerror = finishSpeaking;
      window.speechSynthesis.speak(utterance);
      fallbackTimer = window.setTimeout(finishSpeaking, Math.max(3200, bubbleText.length * 180));
    };

    void (async () => {
      try {
        const synthesized = await onResolveVoice(bubbleText);
        if (cancelled) return;
        if (synthesized.voice_audio_url) {
          audio = new Audio(synthesized.voice_audio_url);
          audio.onended = finishSpeaking;
          audio.onerror = playBrowserVoice;
          void audio.play().catch(playBrowserVoice);
          fallbackTimer = window.setTimeout(finishSpeaking, Math.max(4200, bubbleText.length * 220));
          return;
        }
      } catch {
        // Browser TTS is the safe demo fallback when the server-side speech bridge is absent.
      }
      if (!cancelled) playBrowserVoice();
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(autoDismissTimer);
      window.clearTimeout(fallbackTimer);
      audio?.pause();
      window.speechSynthesis?.cancel();
      setDesktopSpeaking(false);
    };
  }, [bubbleDismissed, bubbleText, mailboxReady, onResolveVoice]);

  return (
    <section className="desktop-scene" aria-label="桌宠日记入口">
      <span className="particle" style={{ left: "18%", top: "28%" }} />
      <span className="particle gold" style={{ left: "68%", top: "22%" }} />
      <span className="particle" style={{ left: "82%", top: "48%" }} />
      <span className="particle gold" style={{ left: "36%", top: "60%", animationDelay: "1.5s" }} />
      <span className="particle" style={{ left: "14%", top: "52%", animationDelay: "2s" }} />
      <span className="particle gold" style={{ left: "56%", top: "40%", animationDelay: "2.6s" }} />

      <div className="desktop-mailbox">
        <button className="mailbox-button" onClick={onOpenMailbox} aria-label={unreadCount > 0 ? `打开收信箱，${unreadCount} 封未拆` : "打开收信箱"}>
          <img src={iconAssets.mailbox} alt="" />
          {unreadCount > 0 && <span className="unread-dot">{unreadCount > 12 ? "12+" : unreadCount}</span>}
        </button>
      </div>

      <div className="desk-cluster">
        <div className="bubble-line">
          {mailboxReady && !bubbleDismissed && (
            <div className="pet-bubble-wrap">
              <div className={`diary-bubble ${desktopSpeaking ? "speaking" : ""}`}>
                {desktopSpeaking && (
                  <span className="voice-mark" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                )}
                <span>{bubbleText}</span>
              </div>
            </div>
          )}
        </div>
        <div className="stage-row">
          <button className={`pet-original ${desktopSpeaking ? "is-speaking" : ""}`} onClick={onOpenMailbox} aria-label={`点击${characterConfig.selfReference}进入收信箱`}>
            <img className="pet-img" src={getPetAssetForEmotion(emotion)} alt="" />
            {desktopSpeaking && (
              <span className="pet-voice-waves desktop-voice-waves" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
            <span className="pet-floats" aria-hidden="true">
              <span className="spark s1" />
              <span className="spark s2" />
              <span className="spark s3" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function MailboxView({
  mailbox,
  loading,
  characterConfig,
  onBack,
  onOpenDetail,
  onPage
}: {
  mailbox: MailboxResponse;
  loading: boolean;
  characterConfig: CharacterConfig;
  onBack: () => void;
  onOpenDetail: (card: DiaryCard) => void;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(mailbox.pagination.total / mailbox.pagination.page_size));
  const reactionText = mailbox.unread_count > 0
    ? "「{{userAddressing}}，快拆拆{{selfReference}}给你的新信吧～」"
    : "「{{userAddressing}}今天没新的可拆，要不要翻翻旧的？」";
  const stripEmotion = mailbox.unread_count > 0 ? "excited" : "sleeping";
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);

  return (
    <section className="app-window" data-screen-label="02 Mailbox" aria-label="收信箱">
      <WindowTitle title="收信箱" onClose={onBack} />
      <div className="mb-body">
        <header className="mb-head">
          <div>
            <div className="sub">
              {renderCharacterTemplate(
                `从认识{{userAddressing}}的第一天起，{{selfReference}}已经给{{userAddressing}}写了 ${mailbox.pagination.total} 封信了。${mailbox.unread_count > 0 ? `还有 ${mailbox.unread_count} 封等待{{userAddressing}}开启。` : "全部已拆。"}`,
                characterConfig
              )}
            </div>
          </div>
        </header>

        {mailbox.empty_state_type === "no_new_today" || mailbox.empty_state_type === "quality_blocked" ? (
          <div className="quiet-banner">
            <img className="ico" src={iconAssets.privacy} alt="" />
            <span>
              {mailbox.empty_state_type === "quality_blocked"
                ? renderCharacterTemplate("这一封{{selfReference}}没有写好，就不拿来打扰{{userAddressing}}啦。", characterConfig)
                : renderCharacterTemplate("昨天的事，{{selfReference}}还不敢乱写。等攒到更确定的小事，再认真写给{{userAddressing}}。", characterConfig)}
            </span>
          </div>
        ) : null}

        <div className="mb-pet-strip" aria-hidden="true">
          <div className="pet-mini">
            <img className="pet-img" src={getPetAssetForEmotion(stripEmotion)} alt="" />
          </div>
          <div className="strip-copy">{renderCharacterTemplate(reactionText, characterConfig)}</div>
        </div>

        <div className="mb-grid" role="list" aria-busy={loading}>
          {mailbox.items.map((card, index) => (
            <button
              key={card.diary_id}
              className={`polaroid-card ${index % 2 === 0 ? "tilt-odd" : "tilt-even"} ${card.mailbox_status === "read" ? "read" : ""}`}
              onClick={() => onOpenDetail(card)}
              aria-label={`${card.title} · ${card.diary_date}${card.mailbox_status === "unread" ? " · 未拆" : ""}${card.is_favorited ? " · 已收藏" : ""}`}
            >
              <span className="tape" />
              {card.mailbox_status === "unread" && <span className="stamp-unread">未拆<br />NEW</span>}
              {card.is_favorited && <span className="stamp-fav"><img src={iconAssets.favorite} alt="" /></span>}
              <span className="photo"><img className="photo-img" src={card.photo_asset} alt="" /></span>
              <span className="caption">
                <span className="title">{card.title}</span>
                <span className="date">{card.diary_date}</span>
              </span>
            </button>
          ))}
        </div>

        {pages > 1 && (
          <footer className="mb-foot">
            <div className="page-summary">第 {mailbox.pagination.page} / {pages} 页 · 共 {mailbox.pagination.total} 封</div>
            <div className="mb-paging" role="group" aria-label="分页">
              <button className={`page-btn ${mailbox.pagination.page <= 1 ? "disabled" : ""}`} disabled={mailbox.pagination.page <= 1} onClick={() => onPage(mailbox.pagination.page - 1)} aria-label="上一页">
                <img src={iconAssets.back} alt="" />
              </button>
              {pageNumbers.map((pageNumber) => (
                <button key={pageNumber} className={`page-btn ${pageNumber === mailbox.pagination.page ? "active" : ""}`} onClick={() => onPage(pageNumber)}>
                  {pageNumber}
                </button>
              ))}
              <button className={`page-btn ${!mailbox.pagination.has_next ? "disabled" : ""}`} disabled={!mailbox.pagination.has_next} onClick={() => onPage(mailbox.pagination.page + 1)} aria-label="下一页">
                <img src={iconAssets.next} alt="" />
              </button>
            </div>
          </footer>
        )}
      </div>
    </section>
  );
}

function updateSheetTilt(event: PointerEvent<HTMLElement>) {
  const sheet = event.currentTarget;
  const rect = sheet.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  sheet.classList.add("hovering");
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  sheet.style.setProperty("--sheet-tilt-x", `${(-y * 1.8).toFixed(2)}deg`);
  sheet.style.setProperty("--sheet-tilt-y", `${(x * 1.8).toFixed(2)}deg`);
}

function resetSheetTilt(event: PointerEvent<HTMLElement>) {
  const sheet = event.currentTarget;
  sheet.classList.remove("hovering");
  sheet.style.setProperty("--sheet-tilt-x", "0deg");
  sheet.style.setProperty("--sheet-tilt-y", "0deg");
}

function DiaryDetailView({
  detail,
  previousCard,
  nextCard,
  positionLabel,
  characterConfig,
  replyDraft,
  sendingReply,
  replyError,
  onBack,
  onOpenAdjacent,
  onReplyDraft,
  onSubmitReply,
  onFeedback,
  onFavorite,
  onAskDelete,
  hiddenChatBubbles,
  chatBubbleFeedback,
  speakingPetReactionId,
  onCopyChatBubble,
  onDeleteChatBubble,
  onChatBubbleFeedback,
  onPlayPetReactionVoice,
  onPlayUserChatBubbleVoice
}: {
  detail: DiaryDetail;
  previousCard: DiaryCard | null;
  nextCard: DiaryCard | null;
  positionLabel: string | null;
  characterConfig: CharacterConfig;
  replyDraft: string;
  sendingReply: boolean;
  replyError: string | null;
  onBack: () => void;
  onOpenAdjacent: (card: DiaryCard) => void;
  onReplyDraft: (value: string) => void;
  onSubmitReply: (event: FormEvent) => void;
  onFeedback: (value: 0 | 1) => void;
  onFavorite: () => void;
  onAskDelete: () => void;
  hiddenChatBubbles: Set<string>;
  chatBubbleFeedback: ChatBubbleFeedbackMap;
  speakingPetReactionId: string | null;
  onCopyChatBubble: (text: string) => void;
  onDeleteChatBubble: (targetType: ChatBubbleKind, targetId: string) => void;
  onChatBubbleFeedback: (targetType: ChatBubbleKind, targetId: string, value: 0 | 1) => void;
  onPlayPetReactionVoice: (reaction: PetReaction) => void;
  onPlayUserChatBubbleVoice: (text: string, audioUrl?: string) => void;
}) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseDraftRef = useRef("");
  const [voiceInputState, setVoiceInputState] = useState<VoiceInputState>("idle");
  const [voiceInputError, setVoiceInputError] = useState<string | null>(null);
  const activeFeedback = detail.feedback_state.current_value;
  const latestReplyReaction = [...detail.replies]
    .reverse()
    .find((reply) => reply.pet_reaction && !hiddenChatBubbles.has(chatBubbleKey("pet_reaction", reply.pet_reaction.reaction_id)))
    ?.pet_reaction;
  const deskReaction = latestReplyReaction ?? detail.pet_opening_reaction;
  const deskPetSpeaking = Boolean(speakingPetReactionId && deskReaction.reaction_id === speakingPetReactionId);
  const deskEmotion = sendingReply ? "writing" : deskReaction.emotion;
  const deskAction = sendingReply ? "writing_loop" : deskReaction.action;
  const deskPetClassName = `desk-pet pet-action-${deskAction} ${sendingReply ? "is-writing" : ""} ${deskPetSpeaking ? "is-speaking" : ""} ${latestReplyReaction && !sendingReply && !deskPetSpeaking ? "is-reacting" : ""}`;

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setVoiceInputState("idle");
  }

  function toggleVoiceInput() {
    if (sendingReply) return;
    if (voiceInputState === "listening") {
      stopVoiceInput();
      return;
    }

    setVoiceInputError(null);
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setVoiceInputError("当前环境暂时不支持语音输入。");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      voiceBaseDraftRef.current = replyDraft.trim();
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const spokenText = speechResultText(event).trim();
        if (!spokenText) return;
        const prefix = voiceBaseDraftRef.current;
        const nextDraft = prefix ? `${prefix} ${spokenText}` : spokenText;
        onReplyDraft(nextDraft.slice(0, 140));
      };
      recognition.onerror = () => {
        setVoiceInputError("这次没听清，再点一下试试。");
        setVoiceInputState("idle");
        recognitionRef.current = null;
      };
      recognition.onend = () => {
        setVoiceInputState("idle");
        recognitionRef.current = null;
      };

      recognition.start();
      setVoiceInputState("listening");
    } catch {
      setVoiceInputError("当前环境暂时不支持语音输入。");
      setVoiceInputState("idle");
      recognitionRef.current = null;
    }
  }

  return (
    <section className="app-window detail-window" data-screen-label="03 Diary Detail" aria-label="日记详情">
      <WindowTitle title={`日记 · ${detail.diary_date}`} onClose={onBack} />
      <div className="detail-body">
        <div className="letter-col">
          <article
            className="letter-sheet"
            onPointerEnter={(event) => {
              event.currentTarget.classList.add("hovering");
              updateSheetTilt(event);
            }}
            onPointerMove={updateSheetTilt}
            onPointerLeave={resetSheetTilt}
          >
            <span className="corner-tape tl" aria-hidden="true" />
            <span className="corner-tape tr" aria-hidden="true" />
            <span className="stamp-corner" aria-hidden="true">
              <img src={iconAssets.stamp} alt="" />
            </span>

            <h2 className="ls-title">{detail.title}</h2>
            <div className="ls-meta-row">
              <span className="date-chip">{detail.diary_date}</span>
              <span className="source-chip"><img src={iconAssets.source} alt="" />{detail.source_summary}</span>
            </div>

            <div className="ls-body">
              {detail.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <div className="ls-signoff">—— {characterConfig.selfReference}，于 {detail.diary_date}</div>

            <div className="collage detail-collage" aria-hidden="true">
              <div className="clip-photo tilt-l"><img className="photo-img" src={detail.photo_asset} alt="" /></div>
              <div className="clip-note">{detail.side_note}</div>
              <div className="clip-photo tilt-r"><img className="photo-img" src={detail.alt_photo_asset ?? detail.photo_asset} alt="" /></div>
            </div>

            <div className="letter-actions" role="toolbar" aria-label="日记操作">
              {detail.available_actions.includes("like") && (
                <IconAction actionType="like" active={activeFeedback === 1} label={activeFeedback === 1 ? "取消喜欢" : "喜欢"} icon={iconAssets.like} onClick={() => onFeedback(1)} />
              )}
              {detail.available_actions.includes("dislike") && (
                <IconAction actionType="dislike" active={activeFeedback === 0} label={activeFeedback === 0 ? "取消" : "不喜欢"} icon={iconAssets.dislike} onClick={() => onFeedback(0)} />
              )}
              {detail.available_actions.includes("favorite") && (
                <IconAction actionType="fav" active={detail.is_favorited} label={detail.is_favorited ? "取消收藏" : "收藏"} icon={iconAssets.favorite} onClick={onFavorite} />
              )}
              {detail.available_actions.includes("delete") && (
                <IconAction actionType="danger" label="收起" icon={iconAssets.deleteBin} danger onClick={onAskDelete} />
              )}
            </div>

            <span className="fold" aria-hidden="true" />
          </article>

          <div className={deskPetClassName} aria-hidden="true">
            <div key={sendingReply ? "writing" : deskReaction.reaction_id} className="figure">
              <img className="pet-img" src={getPetAssetForEmotion(deskEmotion)} alt="" />
              {deskPetSpeaking && !sendingReply && (
                <span className="pet-voice-waves" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </div>
          </div>
        </div>

        <aside className="companion-rail">
          <div className="chat-stream">
            {!hiddenChatBubbles.has(chatBubbleKey("pet_reaction", detail.pet_opening_reaction.reaction_id)) && (
              <PetLine
                reaction={detail.pet_opening_reaction}
                feedbackValue={chatBubbleFeedback[chatBubbleKey("pet_reaction", detail.pet_opening_reaction.reaction_id)] ?? null}
                isVoicePlaying={speakingPetReactionId === detail.pet_opening_reaction.reaction_id}
                onCopy={onCopyChatBubble}
                onDelete={onDeleteChatBubble}
                onFeedback={onChatBubbleFeedback}
                onPlayVoice={onPlayPetReactionVoice}
              />
            )}
            {detail.replies.map((reply) => (
              <ReplyLine
                key={reply.reply_id}
                reply={reply}
                characterConfig={characterConfig}
                hiddenChatBubbles={hiddenChatBubbles}
                chatBubbleFeedback={chatBubbleFeedback}
                speakingPetReactionId={speakingPetReactionId}
                onCopy={onCopyChatBubble}
                onDelete={onDeleteChatBubble}
                onFeedback={onChatBubbleFeedback}
                onPlayPetReactionVoice={onPlayPetReactionVoice}
                onPlayUserVoice={onPlayUserChatBubbleVoice}
              />
            ))}
            {sendingReply && <div className="chat-bubble pet sending">{renderCharacterTemplate("{{selfReference}}接到了…", characterConfig)}</div>}
          </div>
          {detail.available_actions.includes("reply") && (
            <form className="reply-composer" onSubmit={onSubmitReply}>
              <div className="head">
                <span className="lbl">给我回信吧{characterConfig.userAddressing}～</span>
                <span className="counter">{replyDraft.length} / 140</span>
              </div>
              <textarea
                value={replyDraft}
                maxLength={140}
                rows={2}
                onChange={(event) => onReplyDraft(event.target.value)}
                placeholder={`写两句给${characterConfig.characterName}...`}
                disabled={sendingReply}
              />
              {(replyError || voiceInputError || voiceInputState === "listening") && (
                <div className={`inline-err ${voiceInputState === "listening" && !replyError && !voiceInputError ? "listening" : ""}`} role="status">
                  {replyError ?? voiceInputError ?? "正在听..."}
                </div>
              )}
              <div className="foot">
                <div className="composer-tools">
                  <button
                    type="button"
                    className={`voice-input-btn ${voiceInputState === "listening" ? "listening" : ""}`}
                    disabled={sendingReply}
                    onClick={toggleVoiceInput}
                    aria-label={voiceInputState === "listening" ? "停止语音输入" : "语音输入"}
                    aria-pressed={voiceInputState === "listening"}
                  >
                    <img src={iconAssets.play} alt="" />
                  </button>
                </div>
                <div className="composer-actions">
                  <button className={`btn btn-primary ${sendingReply ? "loading" : ""}`} disabled={sendingReply || !replyDraft.trim()}>
                    <img src={iconAssets.reply} alt="" />{sendingReply ? "寄出中..." : "寄出"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </aside>
      </div>

      <div className="detail-bottombar">
        <button className="nav-prev" disabled={!previousCard} onClick={() => previousCard && onOpenAdjacent(previousCard)}>
          <img src={iconAssets.back} alt="" />上一封
        </button>
        <div className="detail-position">{positionLabel ?? "第 1 / 1 封"}</div>
        <button className="nav-next" disabled={!nextCard} onClick={() => nextCard && onOpenAdjacent(nextCard)}>
          下一封<img src={iconAssets.next} alt="" />
        </button>
      </div>
    </section>
  );
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const speechWindow = window as WindowWithSpeechRecognition;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function speechResultText(event: SpeechRecognitionEventLike): string {
  let text = "";
  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    text += event.results[index]?.[0]?.transcript ?? "";
  }
  return text;
}

function EmptyState({
  type,
  characterConfig,
  onBack
}: {
  type: EmptyStateType;
  characterConfig: CharacterConfig;
  onBack: () => void;
}) {
  const copy: Record<EmptyStateType, { title: string; body: string; emotion: string }> = {
    first_empty: {
      title: "{{selfReference}}还没写好第一封信",
      body: "{{userAddressing}}，再陪{{selfReference}}待一会儿。等攒到一件小小的事，{{selfReference}}就认真写。",
      emotion: "writing"
    },
    no_new_today: {
      title: "信箱今天是空的",
      body: "昨天的事，{{selfReference}}还不敢乱写。等攒到更确定的小事，再认真写给{{userAddressing}}。",
      emotion: "sleeping"
    },
    generation_failed: {
      title: "信纸被收得太深了",
      body: "{{selfReference}}先把今天这一封封好，等整理好了再拿给{{userAddressing}}看。",
      emotion: "sorry"
    },
    quality_blocked: {
      title: "这一封先不打扰",
      body: "这封信{{selfReference}}没有写好，就不拿来打扰{{userAddressing}}啦。",
      emotion: "sorry"
    }
  };
  const selected = copy[type];
  return (
    <section className="app-window empty-window" aria-label="空状态">
      <WindowTitle title="收信箱 · 静日" onClose={onBack} />
      <div className="empty-panel">
        <img src={getPetAssetForEmotion(selected.emotion)} alt="" />
        <h2>{renderCharacterTemplate(selected.title, characterConfig)}</h2>
        <p>{renderCharacterTemplate(selected.body, characterConfig)}</p>
        <button className="btn-ghost" onClick={onBack}>回到桌面</button>
      </div>
    </section>
  );
}

function WindowTitle({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="app-titlebar">
      <div className="title"><span />{title}<span /></div>
      <button className="titlebar-btn" onClick={onClose} aria-label="关闭">
        <img src={iconAssets.close} alt="" />
      </button>
    </header>
  );
}

function IconAction({
  actionType,
  label,
  icon,
  active = false,
  danger = false,
  onClick
}: {
  actionType: "like" | "dislike" | "fav" | "danger";
  label: string;
  icon: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`icon-btn ${actionType} ${active ? "active" : ""} ${danger ? "danger" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={actionType === "danger" ? undefined : active}
      data-tip={label}
    >
      <img src={icon} alt="" />
    </button>
  );
}

function PetLine({
  reaction,
  variant = "default",
  feedbackValue,
  isVoicePlaying,
  onCopy,
  onDelete,
  onFeedback,
  onPlayVoice
}: {
  reaction: PetReaction;
  variant?: "default" | "reply";
  feedbackValue: 0 | 1 | null;
  isVoicePlaying: boolean;
  onCopy: (text: string) => void;
  onDelete: (targetType: ChatBubbleKind, targetId: string) => void;
  onFeedback: (targetType: ChatBubbleKind, targetId: string, value: 0 | 1) => void;
  onPlayVoice: (reaction: PetReaction) => void;
}) {
  return (
    <div className={`pet-line ${variant === "reply" ? "reply-reaction" : ""} ${reaction.should_speak ? "speaking" : ""}`}>
      <div className="bubble-shell pet">
        <div className="chat-bubble pet">
          {isVoicePlaying && (
            <span className="voice-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          )}
          <span>{reaction.reaction_text}</span>
        </div>
        <ChatBubbleActions
          targetType="pet_reaction"
          targetId={reaction.reaction_id}
          text={reaction.reaction_text}
          canPlay={reaction.should_speak || Boolean(reaction.voice_audio_url)}
          canRate
          feedbackValue={feedbackValue}
          onCopy={onCopy}
          onDelete={onDelete}
          onFeedback={onFeedback}
          onPlayVoice={() => onPlayVoice(reaction)}
        />
      </div>
    </div>
  );
}

function ReplyLine({
  reply,
  characterConfig,
  hiddenChatBubbles,
  chatBubbleFeedback,
  speakingPetReactionId,
  onCopy,
  onDelete,
  onFeedback,
  onPlayPetReactionVoice,
  onPlayUserVoice
}: {
  reply: DiaryReply;
  characterConfig: CharacterConfig;
  hiddenChatBubbles: Set<string>;
  chatBubbleFeedback: ChatBubbleFeedbackMap;
  speakingPetReactionId: string | null;
  onCopy: (text: string) => void;
  onDelete: (targetType: ChatBubbleKind, targetId: string) => void;
  onFeedback: (targetType: ChatBubbleKind, targetId: string, value: 0 | 1) => void;
  onPlayPetReactionVoice: (reaction: PetReaction) => void;
  onPlayUserVoice: (text: string, audioUrl?: string) => void;
}) {
  const userBubbleHidden = hiddenChatBubbles.has(chatBubbleKey("user_reply", reply.reply_id));
  const petReaction = reply.pet_reaction ?? fallbackReplyReaction(reply, characterConfig);
  const petBubbleHidden = hiddenChatBubbles.has(chatBubbleKey("pet_reaction", petReaction.reaction_id));

  return (
    <>
      {!userBubbleHidden && (
        <div className="bubble-shell user">
          <div className="chat-bubble user">{reply.reply_text}</div>
          <ChatBubbleActions
            targetType="user_reply"
            targetId={reply.reply_id}
            text={reply.reply_text}
            canPlay={Boolean(reply.voice_audio_url)}
            canRate={false}
            feedbackValue={null}
            onCopy={onCopy}
            onDelete={onDelete}
            onFeedback={onFeedback}
            onPlayVoice={() => onPlayUserVoice(reply.reply_text, reply.voice_audio_url)}
          />
        </div>
      )}
      {!petBubbleHidden && (
        <PetLine
          reaction={petReaction}
          variant="reply"
          feedbackValue={chatBubbleFeedback[chatBubbleKey("pet_reaction", petReaction.reaction_id)] ?? null}
          isVoicePlaying={speakingPetReactionId === petReaction.reaction_id}
          onCopy={onCopy}
          onDelete={onDelete}
          onFeedback={onFeedback}
          onPlayVoice={onPlayPetReactionVoice}
        />
      )}
    </>
  );
}

function fallbackReplyReaction(reply: DiaryReply, characterConfig: CharacterConfig): PetReaction {
  return {
    reaction_id: `fallback_${reply.diary_id}_${reply.reply_id}`,
    diary_id: reply.diary_id,
    reply_id: reply.reply_id,
    scene: "diary_reply",
    reaction_text: renderCharacterTemplate("{{selfReference}}把这两句也贴在抽屉里了，和那封信一起。", characterConfig),
    emotion: "gentle",
    action: "nod",
    should_speak: true,
    memory_write_hint: "none",
    created_at: reply.created_at
  };
}

function ChatBubbleActions({
  targetType,
  targetId,
  text,
  canPlay,
  canRate,
  feedbackValue,
  onCopy,
  onDelete,
  onFeedback,
  onPlayVoice
}: {
  targetType: ChatBubbleKind;
  targetId: string;
  text: string;
  canPlay: boolean;
  canRate: boolean;
  feedbackValue: 0 | 1 | null;
  onCopy: (text: string) => void;
  onDelete: (targetType: ChatBubbleKind, targetId: string) => void;
  onFeedback: (targetType: ChatBubbleKind, targetId: string, value: 0 | 1) => void;
  onPlayVoice: () => void;
}) {
  return (
    <div className="bubble-actions" role="toolbar" aria-label="气泡操作">
      <button type="button" className="bubble-tool icon-tool" onClick={() => onCopy(text)} aria-label="复制气泡" data-tip="复制">
        <img src={iconAssets.copy} alt="" />
      </button>
      {canPlay && (
        <button type="button" className="bubble-tool icon-tool" onClick={onPlayVoice} aria-label="播放语音" data-tip="播放">
          <img src={iconAssets.play} alt="" />
        </button>
      )}
      {canRate && (
        <>
          <button
            type="button"
            className={`bubble-tool icon-tool ${feedbackValue === 1 ? "active" : ""}`}
            onClick={() => onFeedback(targetType, targetId, 1)}
            aria-label="喜欢这句回复"
            aria-pressed={feedbackValue === 1}
            data-tip="喜欢"
          >
            <img src={iconAssets.like} alt="" />
          </button>
          <button
            type="button"
            className={`bubble-tool icon-tool ${feedbackValue === 0 ? "active" : ""}`}
            onClick={() => onFeedback(targetType, targetId, 0)}
            aria-label="不喜欢这句回复"
            aria-pressed={feedbackValue === 0}
            data-tip="不喜欢"
          >
            <img src={iconAssets.dislike} alt="" />
          </button>
        </>
      )}
      <button type="button" className="bubble-tool icon-tool danger" onClick={() => onDelete(targetType, targetId)} aria-label="删除气泡" data-tip="删除">
        <img src={iconAssets.deleteBin} alt="" />
      </button>
    </div>
  );
}

function PetReactionToast({ reaction }: { reaction: PetReaction }) {
  return (
    <div className="toast" role="status">
      <img src={getPetAssetForEmotion(reaction.emotion)} alt="" />
      <span>{reaction.reaction_text}</span>
    </div>
  );
}

function PrototypePanel({
  open,
  scenario,
  characterConfig,
  onToggle,
  onScenario,
  onCharacterConfig
}: {
  open: boolean;
  scenario: MockScenario;
  characterConfig: CharacterConfig;
  onToggle: () => void;
  onScenario: (scenario: MockScenario) => void;
  onCharacterConfig: (field: "characterName" | "userAddressing" | "selfReference", value: string) => void;
}) {
  const scenarios: Array<{ value: MockScenario; label: string }> = [
    { value: "normal", label: "Normal · 2 unread, history present" },
    { value: "multiple_unread", label: "Many unread (badge 12+)" },
    { value: "no_unread", label: "No unread, history only" },
    { value: "first_empty", label: "First-time empty mailbox" },
    { value: "no_new_today", label: "No new today (quiet banner)" },
    { value: "generation_failed", label: "Generation failed" },
    { value: "quality_blocked", label: "Quality blocked" },
    { value: "reply_fails", label: "Next reply will fail" },
    { value: "delete_fails", label: "Next delete will fail" }
  ];

  return (
    <>
      <button className="proto-tab" aria-expanded={open} onClick={onToggle}>PROTOTYPE ▾</button>
      {open && (
        <aside className="proto-panel" role="region" aria-label="Prototype state controls">
          <h4>State scenarios</h4>
          <div className="row">
            <label htmlFor="prototype-scenario">Scenario</label>
            <select
              id="prototype-scenario"
              value={scenario}
              onChange={(event) => onScenario(event.target.value as MockScenario)}
            >
              {scenarios.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <h4>Character config</h4>
          <div className="row">
            <label htmlFor="prototype-character-name">name</label>
            <input
              id="prototype-character-name"
              type="text"
              value={characterConfig.characterName}
              onChange={(event) => onCharacterConfig("characterName", event.target.value)}
            />
          </div>
          <div className="row">
            <label htmlFor="prototype-user-addressing">userAddressing</label>
            <input
              id="prototype-user-addressing"
              type="text"
              value={characterConfig.userAddressing}
              onChange={(event) => onCharacterConfig("userAddressing", event.target.value)}
            />
          </div>
          <div className="row">
            <label htmlFor="prototype-self-reference">selfReference</label>
            <input
              id="prototype-self-reference"
              type="text"
              value={characterConfig.selfReference}
              onChange={(event) => onCharacterConfig("selfReference", event.target.value)}
            />
          </div>
          <div className="hint">Prototype-only controls. The real app reads characterConfig from the host.</div>
        </aside>
      )}
    </>
  );
}

function DeleteConfirmDialog({
  detail,
  characterConfig,
  onCancel,
  onConfirm
}: {
  detail: DiaryDetail;
  characterConfig: CharacterConfig;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-host" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="dialog">
        <div className="seal">收起这封信</div>
        <h3 id="delete-title">要收起这封信吗？</h3>
        <p>
          收起后，<strong>{detail.title}</strong> 不再展示，也不再作为后续日记的证据。
          {renderCharacterTemplate("{{selfReference}}会尊重{{userAddressing}}的选择。", characterConfig)}
        </p>
        <div className="dialog-actions">
          <button className="btn-ghost" onClick={onCancel}>再看看</button>
          <button className="btn-danger" onClick={onConfirm}><img src={iconAssets.deleteBin} alt="" />收起</button>
        </div>
      </div>
    </div>
  );
}

function mergeReplyFeedback(feedback: DiaryDetail["feedback_state"], reply: DiaryReply): DiaryDetail["feedback_state"] {
  if (reply.mapped_feedback_value === null) return feedback;
  return {
    current_value: reply.mapped_feedback_value,
    latest_feedback_at: reply.created_at,
    reason: reply.reply_intent === "correction" ? "not_accurate" : null
  };
}

type PrototypeCapableDiaryService = DiaryService & {
  setScenario: (scenario: MockScenario) => void;
  setCharacterConfig: (characterConfig: CharacterConfig) => void;
};

function getPrototypeCapableService(service: DiaryService): PrototypeCapableDiaryService | null {
  if ("setScenario" in service && "setCharacterConfig" in service) {
    return service as PrototypeCapableDiaryService;
  }
  return null;
}
