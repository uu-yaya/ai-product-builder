# PM → Radar: VLM 本地推理可行性调研委托

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-12T09-13-46
6. Trigger：`AI_FEATURE_EVALUATION_memory-dataset.md` v2 §3.6.4 "本地优先" 立场 + §3.6.6 "本地推理可用率 ≥70%" 估算 + OQ #5；用户 2026-05-12 同意启动

## 2. 调研问题

1. 2026 年消费级硬件能否在桌面 pet 场景跑动**实时 VLM**（视觉语言模型）做游戏 + 视频陪伴？
   1. 候选模型：Qwen2-VL（7B / 2B）、InternVL2、Llava-Next（7B / 13B）、Florence-2、MiniCPM-V、Phi-3.5-vision、Gemma-3 vision 等；按"开源 + 可商用 + 中文场景表现"筛选。
   2. 每个模型：①最小硬件要求（显存 / 内存）；②推理延迟（单帧 ≤ ?s）；③精度（游戏画面 + 视频画面场景标签）；④量化方案（4-bit / 8-bit / FP16）及对精度的影响；⑤License；⑥更新活跃度。
2. **目标用户硬件分布**（关键问题，影响 PM AI Eval §3.6.6 "本地可用率 ≥70%" 假设是否成立）：
   1. macOS：Apple Silicon（M1 / M2 / M3）的 Neural Engine + 内存分布；Intel Mac 还能不能跑？
   2. Windows：消费级 GPU 分布（GTX 1660 / RTX 3060 / RTX 4060 等）；核显（Intel UHD / AMD Radeon Graphics）能不能跑？
   3. 中国地区桌面 PC 用户的典型硬件（参考 Steam Hardware Survey + 中国 PC OEM 出货数据）。
3. **替代方案对比**：
   1. 专用游戏画面分类器（CNN，小模型）vs 通用 VLM 在游戏场景标签上的精度差异。
   2. 专用视频场景分类器（如 EgoSchema / VideoMAE 等）vs VLM 在视频场景标签上的精度差异。
   3. 替代方案在低配机器上是否更可行？
4. **PM §3.6.6 估算复核**：
   1. 语义标签准确率 ≥75% 是否合理？
   2. 隐私穿透率容忍度 = 0（绝不输出用户身份 / 聊天 / 他人信息）— 哪些模型 / 哪些 prompt 能保证？
   3. 本地推理可用率 ≥70% 在哪种硬件分布下成立？

## 3. 约束条件（必须遵守）

1. **不调研云端 VLM 主路径**（AI Eval §3.6.4 锁定本地优先）；可只用一两段简述云端兜底成本与延迟基线作为对比，不展开。
2. 不调研需要项目自建训练数据 / 自训练模型的方案；仅评估**开箱即用 + Prompt 工程 + 量化部署**的路径。
3. 不调研付费订阅模型（OpenAI GPT-4V / Anthropic Claude Vision 等仅在云端兜底章节做简短对比）。
4. 严守 v2.3 §4.7.2 VLM 共同规则：本地优先 / 短期 buffer ≤60s / 不持久化原图 / 仅语义级输出。
5. 报告**不附**真实游戏 / 视频截图；可用 PM 已批准的合成示例描述。
6. 报告**不输出**任何包含用户可识别身份 / 聊天 / 他人信息的样例。
7. 一律遵循 `projects/desktop-pet/PROJECT_RULES.md`。

## 4. 期望产出

1. 文件：`04-research/branches/memory-dataset/TREND_RESEARCH_local-vlm-feasibility.md`。
2. 结构建议：
   1. 模型候选总览矩阵：模型 × {显存 / 内存 / 延迟 / 精度 / 量化 / License / 活跃度 / 适合场景}。
   2. 硬件门槛章节：macOS Apple Silicon / Intel Mac / Windows GPU / Windows 核显 各档对应能跑的模型。
   3. 用户硬件分布章节：估算中国地区桌面 PC 用户能跑得动 7B / 量化版 VLM 的比例。
   4. 替代方案对比（专用分类器 vs VLM）。
   5. PM 估算复核：§3.6.6 三项指标在调研后是否需要调整。
   6. 推荐选型：MVP 首选 1 个模型 + 备选 1 个；理由。
   7. 事实 / 观点 / 推测分层标注。
   8. **数据空缺**：用户硬件分布、隐私穿透率、量化精度等如果拿不到准确数据，明确标注"未取得 + 建议方法"。

## 5. 信源建议（仅参考）

1. 各模型官方仓库 / 论文 / blog（Qwen / InternVL / Llava / Florence / MiniCPM / Phi-3.5 等）。
2. Hugging Face 模型卡（License / 推理 demo）。
3. Steam Hardware & Software Survey（PC 硬件分布参考）。
4. Apple Silicon 推理 benchmark（mlx / llama.cpp Metal 等）。
5. 中文社区：知乎 / 机器之心 / 量子位 上的 VLM 实测帖。
6. 已有 Radar 产物：`04-research/companion-product-market/` 的 AI 桌宠竞品；`04-research/branches/memory-dataset/TREND_RESEARCH_behavior-signal-libraries.md`（可能含硬件参考）。

## 6. 时限

1. 软目标：1 周（VLM 调研深度较高）；硬截止：10 天。
2. 阻塞或不可行时按协议 §13 写 blocker。

## 7. 不在本次调研范围

1. 工程接入实现 / 推理框架选型（mlx / llama.cpp / vLLM / ONNX Runtime 细节由 Engineering 评估）。
2. 模型训练 / 微调 / 蒸馏。
3. 云端 VLM 服务选型（仅在兜底章节简述）。
4. UI / 视觉。
5. 商业化 / 模型授权谈判。
