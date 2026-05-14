# PM Completed: Diary Module Requirements

## Thread

- Project: `projects/desktop-pet/`
- Thread: PM Strategy Thread
- Branch: `Diary`
- Time: 2026-05-13T21-36-09

## Files

- Created: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/README.md`
- Created: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`

## Summary

基于当前 `memory-dataset` 数据需求规格，完成日记模块 PM 需求稿。内容覆盖日记生成时机、呈现时机、生成方式、异常处理、用户评价、用户删除、关键数据字段、优先级和验收口径。

## Open Questions

- 日记能力在完整产品路线中属于首版核心体验，还是首版后的增强体验。
- 用户是否需要直接编辑日记正文，还是只支持评价、删除和重新生成。
- 每日回顾默认开启还是由用户主动开启。
- 删除日记时是否需要提供“同时删除相关来源记忆”的明确选项。
- 是否需要分享卡片；如需要，分享内容是否必须生成单独的脱敏版本。

## Questions for Engineering + Design

- Engineering: 确认 `diary_entry`、`user_feedback`、`is_active`、`inactive_reason`、来源失效和删除 tombstone 的落表方式。
- Engineering: 确认日记生成任务状态，以及 `skipped` / `failed` 的重试和回退行为。
- Design: 定义日记入口、轻提醒、反馈入口、删除确认和空状态。
- Design: 定义来源摘要和隐私状态的表达方式，避免暴露敏感原始内容。

## Whether SYNC_SUMMARY Needs Update

Yes. 如果 Diary 支路进入正式跟踪任务，Main Thread 需要把本产物加入阶段摘要和任务板。

## Suggested Next Thread

- Design Prototype Thread：日记入口、轻提醒、反馈/删除控件和空状态。
- Engineering Build Thread：在交互状态与优先级确认后，设计生成任务、数据落表、反馈写回和删除链路。
