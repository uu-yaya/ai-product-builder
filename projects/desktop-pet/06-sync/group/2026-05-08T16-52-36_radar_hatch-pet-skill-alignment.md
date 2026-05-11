# AI Trend Radar Thread Sync: Hatch Pet Skill Alignment

Date: 2026-05-08
Thread: AI Trend Radar Thread
Topic: Codex `hatch-pet` skill 对齐复核

## Summary

已复核 `/Users/yayauu/.codex/skills/hatch-pet/SKILL.md`、`scripts/`、`references/`，并修改：

```text
04-research/IMPLEMENTATION_RESEARCH_custom-desktop-pet-generation-codex.md
```

关键修正：

- 明确 base 可由父线程生成和记录，但 base 后的 row-strip visual generation 默认必须交给 subagents；父线程统一负责 manifest、record、mirror、repair、finalize、package。
- 明确 deterministic scripts 只能做拆帧、去背景、QA、组 atlas、打包，不允许用本地脚本伪造 base 或 row visual outputs。
- 修正 `finalize_pet_run.py` 的角色：它是最终编排入口，会串起 extraction、inspection、atlas composition、validation、contact sheet、videos、package。
- 修正 `canonical-base.png` 与 `layout-guides/` 的位置：它们是 run folder 中动态生成的 references，不是 skill 静态资产。
- 补充 row job grounding 规则：除 base 外，每个 row job 都必须附带 manifest 中列出的 input images，包括 canonical base、原始 reference、layout guide。
- 强化 `running-left` 镜像条件：必须视觉检查确认不会破坏 identity、prop、handedness、markings、lighting、direction semantics，并写 decision note。

## Recommended Follow-up

- Engineering Build Thread：如果后续要落地 `game-character-asset-factory`，应优先设计 `asset_request.json`、`generation_jobs.json`、`finalize_asset_run.py` 和 provenance 规则。
- PM Strategy Thread：把“资产生成能力是否进入 desktop-pet MVP / P1”作为需求澄清问题，不要直接默认为 MVP 必备。

## Safety Notes

- 未修改 `/Users/yayauu/.codex/`、`/Users/yayauu/.agents/skills/`、`memory/`、`workspaces/`。
- 未写入公司机密、真实玩家数据、内部代号、合作方信息或未脱敏素材。
