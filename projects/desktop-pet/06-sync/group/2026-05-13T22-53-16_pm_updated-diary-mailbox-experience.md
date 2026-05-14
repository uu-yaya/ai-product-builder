# PM Updated: Diary Mailbox Experience

## Thread

- Project: `projects/desktop-pet/`
- Thread: PM Strategy Thread
- Branch: `Diary`
- Time: 2026-05-13T22-53-16

## Files

- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`
- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/README.md`

## Summary

补充 Diary PRD 的收信箱体验：采用桌宠头顶日记小气泡 + 收信箱红点双入口；点击后进入打开信箱的过渡动画，再进入日记列表页。列表页按时间倒序，以交错相纸 / 拍立得卡片展示日记，每页 10 篇并带分页器。新日记卡片带红点，并可展示桌宠头像简笔画 + 角色口吻气泡。

详情页补充为“信纸 + 手账拼贴”图文排版，文字为核心，贴纸、印章、桌宠表情、小图标用于增强角色感和收藏感；详情页支持回信、喜欢、不喜欢、收藏、删除，用户回信后桌宠给出符合人设的反应。

## Confirmed Product Decisions

- 采用收信箱双入口方案。
- 日记列表不是普通列表，而是相纸 / 拍立得式卡片墙。
- 列表页每页最多 10 篇，超过后使用分页器。
- 列表页支持收藏、删除、打开详情；喜欢 / 不喜欢主要放在详情页。
- 详情页采用信纸 + 手账拼贴式图文排版，P0 不依赖 AI 生成大图。

## Open Questions

- 相纸卡片和详情页贴纸/印章素材由每个合作游戏提供，还是由桌宠基础素材库提供。
- 未读日记累计多篇时，收信箱红点是否显示数量。
- 收藏日记是否需要单独筛选入口。

## Questions for Design + Engineering

- Design: 需要定义收信箱按钮、红点、打开信箱过渡动画、相纸卡片、详情页信纸手账样式和桌宠气泡文案。
- Engineering: 需要确认 `mailbox_status`、`is_favorited`、卡片分页、未读状态、气泡状态和详情页视觉元素标记的落表方式。

## Whether SYNC_SUMMARY Needs Update

Yes. 如果 Diary 支路进入正式跟踪任务，Main Thread 需要同步本次收信箱体验口径。
