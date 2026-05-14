# PM Updated: Diary Module PRD

## Thread

- Project: `projects/desktop-pet/`
- Thread: PM Strategy Thread
- Branch: `Diary`
- Time: 2026-05-13T22-29-23

## Files

- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/README.md`
- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## Summary

根据用户确认口径，重写 Diary 支路 PRD。新版明确日记是 P0 陪伴能力：每天定时生成一篇，第二天通过桌宠头顶日记小气泡提示；用户进入日记详情页查看，可以直接给桌宠回信；桌宠在打开日记和收到回信后都可以给出符合角色人设的反应。

新版补充了内容模块、写作硬约束、日记生成流程、回信与反馈反哺、软删除、异常处理和 Pass/Fail 质量验收。

## Confirmed Product Decisions

- 日记核心价值：增强桌宠陪伴感优先，其次是游戏成长记录和轻复盘。
- 日记语气：桌宠第一人称写给用户，符合游戏角色人设，像真人朋友，不像系统总结。
- 日记频率：每天定时生成一篇，第二天展示。
- 新日记提示：桌宠头顶出现日记小气泡。
- 用户互动：用户可在日记详情页回信；桌宠需要对打开日记和用户回信做出反应。
- 内容范围：游戏事件、进度、成就、失败；用户与桌宠对话；游戏场景情绪；授权桌面上下文。
- 删除策略：软删除日记，不默认删除来源记忆。

## Open Questions

- 每日定时生成的具体时间窗口应按用户所在时区、游戏服务器时区，还是账号时区。
- 用户未打开前一天日记时，第二天新日记是否覆盖气泡，还是形成未读队列。
- 回信是否必须进入长期记忆，还是允许用户关闭“回信入长期记忆”。
- 日记详情页是否需要支持用户主动要求“重写这篇”。
- 世界观推进由合作游戏提供角色设定配置，还是由桌宠基础人设统一配置。

## Questions for Design + Engineering

- Design: 需要设计日记气泡、日记详情页、回信入口、桌宠反应、删除确认和未读队列。
- Design: 需要定义打开日记和回信后的桌宠反应呈现方式。
- Engineering: 需要确认每日定时生成、结算窗口、质量检查、失败跳过和次日气泡状态。
- Engineering: 需要确认 `diary_entry`、`diary_reply`、`user_feedback`、软删除和来源过滤的落表方式。

## Whether SYNC_SUMMARY Needs Update

Yes. 如果 Diary 支路进入正式跟踪任务，Main Thread 需要把新版 PRD 状态同步到阶段摘要和任务板。
