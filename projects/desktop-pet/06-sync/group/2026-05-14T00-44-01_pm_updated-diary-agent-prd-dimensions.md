# PM Updated: Diary Agent PRD Dimensions

## Thread

- Project: `projects/desktop-pet/`
- Thread: PM Strategy Thread
- Branch: `Diary`
- Time: 2026-05-14T00-44-01

## Files

- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/DIARY_MODULE_REQUIREMENTS.md`
- Updated: `/Users/yayauu/ai-product-builder/projects/desktop-pet/01-pm/branches/Diary/README.md`

## Summary

根据全局 skill `agent-prd-writer` 的结构与质量清单，补充 Diary PRD 中 LLM/Agent 产品必备维度：

- 目标用户画像
- AI 形态与自主性等级
- In-Scope / Out-of-Scope / 模糊地带
- 能力 / 工具目录
- 模型行为契约与 Good / Bad 示例
- 日记质量检查接口与桌宠反应接口
- 评测集、上线门槛和质量验收
- 成本、延迟与线上观测指标

## Key Product Decisions

- P0 不是开放式自主 Agent，而是 LLM-powered 定时生成工作流 + 嵌入式陪伴回应。
- 每日生成时区默认按用户账号时区或常用登录时区，不按游戏服务器时区作为默认口径。
- 删除、来源关闭、记忆更正等不可逆或高影响动作必须由用户触发，AI 不自动执行。

## Open Questions

- 具体每日生成时点和数据结算窗口长度。
- 未读日记累计多篇时，收信箱红点是否显示数量。
- 回信是否必须进入长期记忆，还是允许用户关闭“回信入长期记忆”。
- 日记详情页是否支持“重写这篇”。
- 相纸卡片和贴纸/印章素材由合作游戏提供，还是由桌宠基础素材库提供。

## Whether SYNC_SUMMARY Needs Update

Yes. 如果 Diary 支路进入正式跟踪任务，Main Thread 需要同步本次 Agent PRD 维度补充。
