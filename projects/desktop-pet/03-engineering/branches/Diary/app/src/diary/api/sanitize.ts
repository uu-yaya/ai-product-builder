import { DIARY_ACTIONS, PAGE_SIZE_LIMIT, type DiaryAction } from "../types";

export function clampPageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize < 1) return PAGE_SIZE_LIMIT;
  return Math.min(PAGE_SIZE_LIMIT, Math.floor(pageSize));
}

export function sanitizeAvailableActions(actions: readonly string[]): DiaryAction[] {
  return actions.filter((action): action is DiaryAction => {
    return (DIARY_ACTIONS as readonly string[]).includes(action);
  });
}

export function containsForbiddenPrivateText(text: string): boolean {
  const forbiddenPatterns = [
    /api[_-]?key/i,
    /token/i,
    /password/i,
    /身份证/,
    /手机号/,
    /住址/,
    /窗口标题/,
    /文档名/,
    /聊天正文/,
    /模型错误/,
    /风控原因/
  ];
  return forbiddenPatterns.some((pattern) => pattern.test(text));
}
