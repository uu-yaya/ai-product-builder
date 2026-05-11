# AI Trend Radar Thread Sync: Desktop Context Memory Frameworks Research

Date: 2026-05-08
Thread: AI Trend Radar Thread
Topic: macOS OpenChronicle and Windows counterpart framework stack for desktop-pet memory system

## Summary

已完成 PC 端电脑操作数据 / 记忆系统框架调研，输出到：

```text
04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md
```

核心结论：

- OpenChronicle 不是 Apple 官方 API，而是基于 macOS AX Tree / Accessibility、窗口元数据、可选截图、Markdown、SQLite FTS5、MCP 的开源本地记忆层。
- Windows 有相对框架，但不是单一 OpenChronicle 式官方框架；推荐对标组合是 `Windows Automation API` / `UI Automation` + `SetWinEventHook` / `GetForegroundWindow` + `Windows.Graphics.Capture` + `UserActivity` / Recall integration。
- 文档已补充关键框架 / 函数解释，包括 macOS `Accessibility` / `AX Tree` / `AXUIElement` / `AXObserver`，Windows `Windows Automation API` / `UI Automation` / `AutomationElement` / `WinEvent` / `SetWinEventHook` / `GetForegroundWindow` / `GetWindowTextW` 等。
- Windows 开源参考层可看 OpenRecall、Windrecorder、screenpipe、OpenAdapt，但这些多数偏 screenshot / OCR / audio / training-data capture，不适合直接作为桌宠 MVP 默认采集方案。
- 对 `desktop-pet`，P0 建议采用 `Context Lite Memory`：第一方游戏事件 + 用户主动对话 + 低敏 active app/window title，不默认做 Recall 式后台截图、系统音频监听或键盘输入记录。

## Recommended Follow-up

- PM Strategy Thread：把“记忆系统采什么 / 不采什么 / 存多久 / 用户如何控制”转成需求澄清和隐私边界。
- Engineering Build Thread：设计跨平台 `Context Capture Adapter`，优先支持 macOS active app / Windows foreground window / game event schema。
- Design Prototype Thread：设计 Memory Center，用于展示、删除、禁用、纠错记忆。

## Main Thread Sync Needed

Yes. 建议 Main Thread 在 `SYNC_SUMMARY.md` 中补充一条重要研究产出：

- `04-research/TREND_RESEARCH_desktop-context-memory-frameworks.md` 已完成并校准为框架栈调研，结论建议记忆系统 P0 优先使用 first-party game events + 低敏 OS context，不默认采用全量截图或 Recall 式记录。

## Safety Notes

- 未写入真实玩家数据、公司机密、未脱敏日志、token、API key 或合作方信息。
- 未修改 PM / Design / Engineering 产物。
- 未修改 `06-sync/SYNC_SUMMARY.md`、`TASK_BOARD.md`、`THREAD_REGISTRY.md`。
