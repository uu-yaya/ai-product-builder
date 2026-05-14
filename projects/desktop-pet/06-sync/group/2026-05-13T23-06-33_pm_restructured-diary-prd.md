# PM Updated: Restructured Diary PRD

## Thread

- Project: `projects/desktop-pet/`
- Thread: PM Strategy Thread
- Branch: `Diary`
- Time: 2026-05-13T23-06-33

## Files

- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`
- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/README.md`

## Summary

按照用户指定结构，将 Diary PRD 重排为更适合 AI/自动化流程继续执行的结构化文档。新版包含：

- 产品背景和目标
- 核心功能模块列表
- 用户流程图（文字版 + Mermaid）
- 每个功能的输入 / 输出
- 接口需求
- 边界条件和异常处理
- 数据结构建议
- 质量验收标准
- 待确认问题

## Confirmed Product Decisions Preserved

- 每天定时生成一篇日记，第二天展示。
- 桌宠头顶日记气泡 + 收信箱红点双入口。
- 点击入口后进入打开信箱过渡动画。
- 列表页为交错相纸 / 拍立得卡片，每页 10 篇，时间倒序。
- 详情页为信纸 + 手账拼贴式图文排版。
- 用户可以回信、喜欢、不喜欢、收藏、软删除。
- 日记必须第一人称、符合角色人设、像真人朋友，不做战绩播报。

## Open Questions

- 每日生成时间窗口按用户所在时区、游戏服务器时区，还是账号时区。
- 未读日记累计多篇时，收信箱红点是否显示数量。
- 回信是否必须进入长期记忆，还是允许用户关闭“回信入长期记忆”。
- 日记详情页是否需要支持用户主动要求“重写这篇”。
- 相纸卡片和贴纸/印章素材由合作游戏提供，还是由桌宠基础素材库提供。

## Questions for Engineering + Design

- Engineering: 评估接口需求中的日记生成、列表、详情、状态更新、回信、反馈、软删除接口。
- Engineering: 确认 `diary_entry`、`diary_reply`、`user_feedback` 的落表和状态流转。
- Design: 基于新版 PRD 生成收信箱、相纸列表、日记详情页和回信体验的 HTML 原型。

## Whether SYNC_SUMMARY Needs Update

Yes. 如果 Diary 支路进入正式跟踪任务，Main Thread 需要同步本次结构化 PRD 版本。
