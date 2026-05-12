# PM → Radar: 主流"行为信号"获取库调研委托（Mac + Windows）

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-11T17-10-08
6. Trigger：`01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §13.1 + 用户 2026-05-11 同意启动

## 2. 调研问题

1. 当前主流的 PC 行为信号获取库 / OS API 在 macOS 与 Windows 上各有哪些可用方案？
2. 各方案的：①能力覆盖（active app / window title / idle / fullscreen / 派生输入指标 / 快捷键事件流 / UI 文本 snapshot / focused element）；②延迟；③准确率 / 失败模式；④是否需要 root / 辅助功能 / 屏幕录制等高敏权限；⑤是否触发杀软告警 / 应用商店审核风险；⑥是否本地可用、是否需要联网。
3. 本项目桌宠 `Context Lite Memory` 决策下，哪些库适合 P0（派生指标 + active app + window title）、哪些适合 P1（UI 文本 opt-in + 快捷键事件流），哪些**完全不适合**（涉及 keylog / 全屏后台截图）？

## 3. 约束条件（必须遵守）

1. 仅调研已公开、可商用的库 / API；不调研逆向工程 / hook 私有 API / 越狱方案。
2. 不调研、不评估"字符级键盘内容"采集能力 — 这条由 PM 立场硬性排除（详见主文档 §10 L2 / L3）。
3. 报告中**不要**给出"如何绕过权限"类信息。
4. 一律遵循 `projects/desktop-pet/PROJECT_RULES.md` 与 `PRIVACY_BOUNDARY_memory-system.md`。
5. 信源优先级遵循 `00-context/LINKS.md`；一级源（官方文档 / 官方博客）优先，二级源（媒体）作为补充。

## 4. 期望产出

1. 文件：`04-research/branches/memory-dataset/TREND_RESEARCH_behavior-signal-libraries.md`（按既有 `04-research/` 分支规则；如目录不存在请新建）。
2. 结构建议：
   1. macOS 章节：Accessibility (AXUIElement) / NSWorkspace / NSEvent / CGEventTap（限派生用途）/ Screen Capture / IOKit / OpenChronicle 参考。
   2. Windows 章节：UI Automation (UIA) / WinEvent / Graphics Capture / UserActivity / RawInput（仅派生用途）/ Recall API（仅生态参考，不作数据源）。
   3. 每个库附 5 字段表：能力覆盖 / 延迟 / 权限要求 / 风险 / 桌宠适用层级（P0 / P1 / 排除）。
   4. 跨平台对比小结：哪些能力两个平台都有、哪些只在一端有、哪些差异显著。
3. 不要写代码示例（PM 不需要）；只要技术决策依据。

## 5. 信源建议（仅参考，不强制）

1. macOS：Apple Developer Documentation（Accessibility / NSWorkspace / NSEvent / Screen Capture）。
2. Windows：Microsoft Learn（UIA / WinEvent / Graphics Capture / Recall）。
3. 开源对照：OpenChronicle、ActivityWatch、Rize、RescueTime 公开技术博客。
4. 隐私 / 审核风险：杀软厂商对 keylog 的判定规则（Microsoft Defender / Norton 等公开文档）。

## 6. 时限

1. 软目标：72h 内出初稿；硬截止：1 周。
2. 阻塞或不可行时，按 `docs/APB_MULTI_THREAD_PROTOCOL.md` §13 协议写 blocker 消息到 `06-sync/group/`。

## 7. 不在本次调研范围

1. 具体工程实现 / 选型决策（属于 Engineering Build Thread）。
2. 字符级键盘内容采集任何方案。
3. 全桌面持续后台截图任何方案（Recall 形态）。
4. 桌宠 UI / 视觉 / 交互（属于 Design）。
