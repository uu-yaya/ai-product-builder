import type { DiaryService } from "./DiaryService";
import { HttpDiaryClient } from "./httpDiaryClient";
import { MockDiaryService } from "./mockDiaryService";

export function createDiaryService(): DiaryService {
  const mode = import.meta.env.VITE_DIARY_API_MODE;
  if (mode === "http") {
    return new HttpDiaryClient(import.meta.env.VITE_DIARY_API_BASE_URL ?? "/api/diary");
  }
  return new MockDiaryService();
}
