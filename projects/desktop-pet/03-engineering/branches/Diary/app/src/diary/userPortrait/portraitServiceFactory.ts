import type { PortraitService } from "./PortraitService";
import { HttpPortraitClient } from "./httpPortraitClient";
import { MockPortraitService } from "./mockPortraitService";

export function createPortraitService(): PortraitService {
  const mode = import.meta.env.VITE_PORTRAIT_API_MODE;
  if (mode === "mock") {
    return new MockPortraitService();
  }
  if (mode === "http" || import.meta.env.DEV) {
    return new HttpPortraitClient(import.meta.env.VITE_PORTRAIT_API_BASE_URL ?? "/api/portrait");
  }
  return new MockPortraitService();
}
