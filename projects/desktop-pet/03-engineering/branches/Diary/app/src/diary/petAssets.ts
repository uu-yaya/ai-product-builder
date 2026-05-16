import type { DiaryEmotion, PetScene } from "./types";

const ASSET_BASE = "/diary-assets";

export const petEmotionAssetMap: Record<DiaryEmotion, string> = {
  excited: `${ASSET_BASE}/pets/pet-wave.png`,
  gentle: `${ASSET_BASE}/pets/pet-idle.png`,
  comfort: `${ASSET_BASE}/pets/pet-shy.png`,
  apology: `${ASSET_BASE}/pets/pet-sorry.png`,
  quiet: `${ASSET_BASE}/pets/pet-sleeping.png`,
  playful: `${ASSET_BASE}/pets/pet-shy.png`,
  thinking: `${ASSET_BASE}/pets/pet-thinking.png`,
  writing: `${ASSET_BASE}/pets/pet-writing.png`,
  sleeping: `${ASSET_BASE}/pets/pet-sleeping.png`,
  sorry: `${ASSET_BASE}/pets/pet-sorry.png`
};

export const petSceneEmotionMap: Record<PetScene, DiaryEmotion> = {
  new_diary_available: "playful",
  diary_opened: "gentle",
  diary_reply: "excited",
  diary_deleted: "gentle",
  empty_state: "quiet",
  feedback_liked: "excited",
  feedback_disliked: "thinking",
  generation_running: "writing",
  generation_failed: "sorry"
};

export function getPetAssetForEmotion(emotion: string | null | undefined): string {
  if (emotion && emotion in petEmotionAssetMap) {
    return petEmotionAssetMap[emotion as DiaryEmotion];
  }
  return `${ASSET_BASE}/pets/pet-idle.png`;
}

export const iconAssets = {
  back: `${ASSET_BASE}/icons/back.png`,
  close: `${ASSET_BASE}/icons/close.png`,
  copy: `${ASSET_BASE}/icons/copy.png`,
  deleteBin: `${ASSET_BASE}/icons/delete-bin.png`,
  diaryBook: `${ASSET_BASE}/icons/diary-book.png`,
  dislike: `${ASSET_BASE}/icons/dislike-mark.png`,
  envelope: `${ASSET_BASE}/icons/envelope.png`,
  favorite: `${ASSET_BASE}/icons/favorite-star.png`,
  like: `${ASSET_BASE}/icons/like-heart.png`,
  mailbox: `${ASSET_BASE}/icons/mailbox.png`,
  next: `${ASSET_BASE}/icons/next.png`,
  play: `${ASSET_BASE}/icons/play.png`,
  privacy: `${ASSET_BASE}/icons/privacy-shield.png`,
  reply: `${ASSET_BASE}/icons/reply-quill.png`,
  source: `${ASSET_BASE}/icons/source-tag.png`,
  stamp: `${ASSET_BASE}/icons/stamp.png`,
  tape: `${ASSET_BASE}/icons/tape.png`
};
