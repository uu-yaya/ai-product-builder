import { loadEnv } from "vite";

const SERVER_RUNTIME_ENV_PREFIXES = [
  "DIARY_LLM_",
  "DIARY_REACTION_",
  "DIARY_TTS_",
  "MINIMAX_",
  "VITE_DIARY_API_",
  "VITE_PORTRAIT_API_"
] as const;

export function isServerRuntimeEnvKey(key: string): boolean {
  return SERVER_RUNTIME_ENV_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export function loadServerRuntimeEnv(
  mode: string,
  envDir = process.cwd(),
  target: NodeJS.ProcessEnv = process.env
): string[] {
  const env = loadEnv(mode, envDir, "");
  const loadedKeys: string[] = [];

  for (const [key, value] of Object.entries(env)) {
    if (!isServerRuntimeEnvKey(key)) continue;
    if (target[key] !== undefined) continue;
    target[key] = value;
    loadedKeys.push(key);
  }

  return loadedKeys;
}
