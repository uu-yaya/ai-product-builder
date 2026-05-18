import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadServerRuntimeEnv } from "../../../server/runtimeEnv";

describe("loadServerRuntimeEnv", () => {
  it("loads server runtime config from .env.local without leaking unrelated keys", () => {
    const envDir = mkdtempSync(path.join(tmpdir(), "diary-runtime-env-"));
    const target = {} as NodeJS.ProcessEnv;

    try {
      writeFileSync(
        path.join(envDir, ".env.local"),
        [
          "MINIMAX_API_KEY=fake-minimax-key",
          "DIARY_LLM_MODEL=MiniMax-M2.7",
          "VITE_DIARY_API_MODE=http",
          "UNRELATED_SECRET=should-not-load"
        ].join("\n"),
        "utf8"
      );

      const loadedKeys = loadServerRuntimeEnv("development", envDir, target).sort();

      expect(loadedKeys).toEqual(["DIARY_LLM_MODEL", "MINIMAX_API_KEY", "VITE_DIARY_API_MODE"]);
      expect(target.MINIMAX_API_KEY).toBe("fake-minimax-key");
      expect(target.DIARY_LLM_MODEL).toBe("MiniMax-M2.7");
      expect(target.VITE_DIARY_API_MODE).toBe("http");
      expect(target.UNRELATED_SECRET).toBeUndefined();
    } finally {
      rmSync(envDir, { recursive: true, force: true });
    }
  });

  it("does not override explicit shell env values", () => {
    const envDir = mkdtempSync(path.join(tmpdir(), "diary-runtime-env-"));
    const target = { MINIMAX_API_KEY: "shell-value" } as NodeJS.ProcessEnv;

    try {
      writeFileSync(path.join(envDir, ".env.local"), "MINIMAX_API_KEY=file-value\n", "utf8");

      const loadedKeys = loadServerRuntimeEnv("development", envDir, target);

      expect(loadedKeys).toEqual([]);
      expect(target.MINIMAX_API_KEY).toBe("shell-value");
    } finally {
      rmSync(envDir, { recursive: true, force: true });
    }
  });
});
