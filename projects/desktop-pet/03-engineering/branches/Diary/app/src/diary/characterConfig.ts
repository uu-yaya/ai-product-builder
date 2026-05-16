import type { CharacterConfig } from "./types";

export const demoCharacterConfig: CharacterConfig = {
  characterConfigId: "char_cfg_demo",
  characterName: "小绒",
  selfReference: "小绒",
  userAddressing: "主人",
  tone: "warm, gentle, low-noise, diary-like",
  personaVersion: "demo-v1"
};

export function renderCharacterTemplate(template: string, characterConfig: CharacterConfig): string {
  return template
    .replaceAll("{{characterName}}", characterConfig.characterName)
    .replaceAll("{{selfReference}}", characterConfig.selfReference)
    .replaceAll("{{userAddressing}}", characterConfig.userAddressing);
}
