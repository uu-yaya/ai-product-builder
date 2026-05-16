import { describe, expect, it } from "vitest";
import { getPetAssetForEmotion, petEmotionAssetMap } from "../petAssets";

describe("pet emotion assets", () => {
  it("maps supported emotions to PNG assets and falls back to idle for unknown emotions", () => {
    expect(petEmotionAssetMap.excited).toContain("pet-wave.png");
    expect(petEmotionAssetMap.apology).toContain("pet-sorry.png");
    expect(getPetAssetForEmotion("not-a-real-emotion")).toContain("pet-idle.png");
  });
});
