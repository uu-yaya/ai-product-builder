# AI Trend Radar Thread Sync: Custom Desktop Pet Generation Research

Date: 2026-05-08
Thread: AI Trend Radar Thread
Topic: Codex 自定义桌宠生成实现调研

## Summary

已按最新反馈将调研范围收敛为 Codex / `hatch-pet` 单线分析，输出到：

```text
04-research/IMPLEMENTATION_RESEARCH_custom-desktop-pet-generation-codex.md
```

核心结论：

- Codex / `hatch-pet` 已有清晰的端到端资产流水线：Skill 规划、`$imagegen` 生成、deterministic scripts 拆帧 / 组 atlas / QA / 打包，最终输出 `pet.json` + `spritesheet.webp`。
- 对 `desktop-pet` 的建议是抽象出 `game-character-asset-factory`：用 Skill 固化角色 / 动作生成流程，用脚本保证资产规格和 QA，用可插拔接口接入素材库、引擎导出、审核和协作通知。
- 该方向的核心价值是把“美术手工反复出角色 / 动作资产”的长周期流程，拆成可复用的资产规格、生成提示、校验脚本、打包脚本和人工审核节点。

## Recommended Follow-up

- PM Strategy Thread：把该报告转成“资产生成是否进入 MVP / P1”的需求澄清问题。
- Engineering Build Thread：评估 P0 `sprite/action asset pipeline` 的工程可行性，包括 `asset_contract.json`、动作 taxonomy、QA scripts、engine export bundle。
- Design Prototype Thread：定义角色 / 动作生成的美术验收标准和 preview 体验。

## Safety Notes

- 未写入公司机密、真实玩家数据、内部代号、合作方信息或未脱敏素材。
- 读取 `/Users/yayauu/.codex/skills/hatch-pet/` 和 `$imagegen` skill 均为只读分析，没有修改 `~/.codex/`。
