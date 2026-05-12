# Trend Research: 本地 VLM 可行性（游戏 + 视频陪伴）

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-12
> Reference spec: `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v2 §3.6.4 / §3.6.6 + `REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.7
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-12T09-13-46_pm_local-vlm-feasibility-radar-research.md`
> Companion deliverables: `TREND_RESEARCH_audio-derivation-libraries.md`、`TREND_RESEARCH_browser-tab-detection.md`、`TREND_RESEARCH_os-now-playing-api.md`

## 1. 引言

PM 立场重申：桌宠 `desktop-pet` 锁定 VLM **本地优先**（仅在白名单游戏 / 视频窗口短期 buffer 推理），目标"本地推理可用率 ≥70%"、"语义标签准确率 ≥75%"、"隐私穿透率容忍度 = 0"。本调研为这三项估算提供事实底盘并复核。

**信源**：一级（官方仓库、Hugging Face、Steam Hardware Survey、arXiv）为主，二级（行业媒体、社区实测帖）作交叉验证，三级（YouTube / 论坛）仅作信号。

**"适合桌宠"的判断标准**：
- **延迟**：单帧推理 ≤2s（buffer ≤60s 内可异步处理，但用户感知需 < 3s）
- **显存 / 统一内存**：≤8GB 占用，留出主机游戏 / 视频 / 浏览器空间
- **精度**：场景标签 ≥75%；中文 UI / 中文游戏支持
- **License**：允许商用且无 MAU 上限；不与 Tencent IEG 法务红线冲突

---

## 2. 模型候选总览矩阵

| 模型 | 参数量 | 最小显存（FP16 / INT8 / INT4） | 最小内存 | 单帧延迟（M2 Max / RTX 4060 / Intel UHD） | 精度（场景标签） | 量化方案 | License | 活跃度 | 中文支持 | 适合场景 |
|---|---|---|---|---|---|---|---|---|---|---|
| Qwen2.5-VL-7B | 7B | ~17 GB / ~9 GB / ~5.1 GB (Q5_K_M) / ~4.4 GB (Q4_K_M)（HF 讨论） | 16 GB 推荐 | M2 Max 推断 ~1–2s（基于 8 bit MLX 类比，未取得 VL 专测）/ RTX 4060 8 GB Q4 ~1–1.5s（推测）/ Intel UHD 不推荐 | OCRBench 88.8%；MMBench-EN 高位 | GPTQ-Int4 / AWQ / GGUF Q4 / Q5 / Q8 | **Apache 2.0** | 高（Alibaba 持续迭代，2025-03 论文） | 原生强中文 / 中文 OCR 突出 | MVP 首选；中等以上 GPU |
| Qwen2.5-VL-3B | 3B | ~7 GB / ~4 GB / ~2 GB（推测） | 8 GB | 单帧 <1s（推测） | OCRBench / MMBench 略低于 7B（技术报告） | 同上 | **Qwen Research License**（禁商用） | 高 | 强中文 | ⚠ 商用受限，仅作研发基线 |
| MiniCPM-V 4.5 | 8B | ~16 GB / ~8 GB / ~6 GB int4 | 16 GB | "VideoMME 推理时间仅为 SOTA 的 9.9%"（HF 模型卡） | OpenCompass 77.0；超 GPT-4o-latest / Gemini-2.0 Pro / Qwen2.5-VL 72B（HF & arXiv 2509.18154） | int4（官方 `MiniCPM-V-4_5-int4`）+ GGUF + Ollama | Apache 2.0（多数权重；商用前确认） | 极高（OpenBMB / 清华，2025-09 发版） | 原生强中文（清华团队） | **MVP 强候选**；视频帧 96x 压缩对桌宠场景极契合 |
| LLaVA-NeXT-7B | 7B | 20 GB（arXiv 2406.11823 V100 实测） | 16 GB | 1.01 s / 图（V100）/ RTX 4060 推测 1.5–2s / Intel UHD 不可行 | 通用强，中文一般 | 4-bit（社区） | Llama 2 衍生（受 Meta 700M MAU 条款） | 中（2024 以后 Qwen2.5-VL / MiniCPM-V 抢热度） | 弱-中（依赖底座 LLM） | 备选；不推荐主路径 |
| LLaVA-NeXT-13B | 13B | 40 GB（V100 实测，不可单卡 24 GB） | 32 GB | 1.78 s / 图（V100） | 同 7B + 提升 | 同上 | 同上 | 中 | 同上 | ❌ 桌宠场景不适配 |
| InternVL2 / InternVL3-2B / 4B | 2B–4B | 4–8 GB / 2–4 GB int4（推测） | 8–16 GB | 未取得 VL 专测，推测 <1s 在中端 GPU 上 | OpenGVLab 论文中文榜单领先 | int4 + LMDeploy | MIT（多数版本） | 高（OpenGVLab） | 强中文 | 备选小模型；适合 2B 档硬件 |
| Florence-2-large | 0.77B | <2 GB FP16 | 4 GB | 极低延迟（<200 ms 量级，推测） | COCO Caption CIDEr 135.6（超大模型） | FP16 / OpenVINO 量化 | **MIT** | 中（2024-06 发布后未大改） | 弱（英文为主） | 中文场景标签弱；适合作为"轻量初筛"非主标签 |
| Phi-3.5-vision | 4.2B | ~8 GB FP16 / ~5 GB int8 / ~3 GB int4（推测） | 8 GB | 未取得本地实测专项 | 多语言（含中文）；多图理解强 | bnb int4 / ONNX | MIT | 中（Microsoft 推 Phi-4 系列） | 中（中文在列表但非主） | 备选；Windows / DirectML 路径 |
| Gemma-3 4B | 4B（VLM 起点） | ~8 GB FP16 | 8 GB | SigLIP 视觉编码 + 896×896 输入（HF blog） | 中等 | Q4 / Q8 GGUF | **Gemma Terms**（非 Apache；含 PUP + 单方面终止权） | 高 | 中文 tokenizer 优化（HF blog） | ⚠ License 风险：禁止用途条款会"流转"到下游用户 |

**关键判读**：MVP 主候选 **MiniCPM-V 4.5** 与 **Qwen2.5-VL-7B**；备选 **InternVL3 / Phi-3.5-vision**；Florence-2 仅作初筛；LLaVA-NeXT、Gemma-3 不推荐主路径。

---

## 3. 硬件门槛章节

### 3.1 macOS Apple Silicon

| 档位 | 统一内存 | 能稳定跑的模型（推测，基于公开 token/s 类比） |
|---|---|---|
| M1 8 GB | 8 GB | 仅 Florence-2-large（0.77B）/ InternVL3-2B Q4；7B 类难以兼顾系统其他负载 |
| M1 16 GB / M2 16 GB | 16 GB | Qwen2.5-VL-7B Q4 / MiniCPM-V 4.5 int4 勉强可跑；首次 token 延迟较高 |
| M2 Pro / M3 Pro | 18–36 GB | Qwen2.5-VL-7B Q4–Q5 / MiniCPM-V 4.5 int4 流畅 |
| M3 Max / M4 Max | 36–128 GB | 全候选可跑；MLX 后端比 Ollama 快 30–50%（MLX 实测 blog） |
| M4（Mac mini 16 GB+） | 16–32 GB | 推荐档；M4 NPU 提升明显 |

事实：M2 Air llama 3.1 8B ~18 tok/s；M4 Max vllm-mlx Qwen3-0.6B 可达 ~525 tok/s。VL 实测数据未取得，VL 比 LLM 慢 30–50% 是社区共识 / 推测。

### 3.2 Intel Mac

- Intel Mac 无 Apple Neural Engine，仅 CPU + Intel Iris / UHD iGPU。
- llama.cpp Metal / AVX 路径可勉强跑 2–4B 量化模型，**延迟 5–15s / 帧**（推测）。
- **结论**：桌宠场景**不推荐 Intel Mac 主路径**，应在 onboarding 检测后引导云端兜底或降级到 CNN 初筛。

### 3.3 Windows 消费 GPU

| GPU | VRAM | 能稳定跑 |
|---|---|---|
| GTX 1660（6 GB） | 6 GB | Florence-2 / Phi-3.5-vision int4 勉强；7B VL 不可行 |
| RTX 3060（12 GB） | 12 GB | Qwen2.5-VL-7B Q4 / MiniCPM-V 4.5 int4 可跑；约 23–29 tok/s（通用 Qwen 类比；VL 推测略低） |
| RTX 4060（8 GB） | 8 GB | 7B 必须 Q4；Q4_K_M ~4.4 GB 可装下但留余量小 |
| RTX 4060 Ti / 4070（12–16 GB） | 12–16 GB | 推荐档；Q5 / Q8 可跑 |
| RTX 4090 / 5090 | 24 GB+ | 全候选 FP16 都可跑 |

### 3.4 Windows 核显 / 集显

- Intel iGPU 11 代以上 + ipex-llm 路径可跑 MiniCPM-V / Qwen-VL，但精度 / 延迟妥协（intel/ipex-llm README，ipex-llm 明确支持 MiniCPM-V 与 Qwen-VL）。
- **当前限制**：Ollama 不支持 Qwen2.5-VL（Intel iGPU benchmark blog），需走 ipex-llm 或 OpenVINO。
- Intel Ultra 5 125H 等 NPU 机型可比 CPU 快 30%，功耗 1/3（Intel iGPU benchmark blog）。
- AMD Radeon 核显 / Arc：ROCm Windows 支持仍不完整；**不推荐作 MVP 主路径**。

---

## 4. 用户硬件分布章节

### 4.1 Steam Hardware Survey 2026-04 关键数据

| 项 | 数据 | 信源 |
|---|---|---|
| 简体中文用户占比 | 2026-02 一度冲到 54.60%（异常春节峰，后回落）；2024–2025 基线 ~33–35% | Steam 2026-02 / GamingOnLinux / Statista 2024 |
| Top GPU | RTX 3060 4.15%，RTX 4060 桌面版 4.05%，RTX 4060 移动版 3.98% | Guru3D 2026-04 |
| 16 GB RAM | "16 GB 成为新基线"（事实） | wccftech 2026-03 |
| 中国用户规模 | ~1140 万（2024 数据基线） | Statista |

### 4.2 中国 PC OEM 出货数据（2025）

| OEM | 出货量 | 份额 |
|---|---|---|
| Lenovo | 4.6 M | 40% |
| Huawei | 1.3 M | 11% |
| HP | 1.2 M | 10% |
| 其他 | — | 余 |

（事实：InfotechLead 2026 outlook）

注意：上述份额中**笔记本占比远高于桌面**；桌面 PC 玩家更集中于自组装机 + DIY 渠道，与 Steam 数据有偏差。

### 4.3 能跑动 7B 量化 VLM 的中国玩家比例（估算）

| 硬件档 | Steam 占比（推测，中国切片） | 能跑 7B Q4 VLM |
|---|---|---|
| RTX 3060 / 3060 Ti / 4060 / 4060 Ti / 4070 及以上 | ~30–40%（推测，基于 Top 列表加总） | ✅ |
| GTX 1660 / 1650 / 2060 / 核显 | ~30–40%（推测） | ❌ 仅能跑 2–4B |
| 苹果用户 | 桌宠玩家中占比未取得；macOS Steam 用户约 1.5–2% | M1 / M2 16 GB 以上勉强 ✅ |

**估算结论（推测）**：
- 中国桌面 PC 玩家中**能跑 7B Q4 VLM** 的比例约 **35–45%**
- 能跑 2–4B Q4 VLM 的比例约 **60–75%**
- ⚠ **PM 立场"本地推理可用率 ≥70%" 在仅依赖 7B 模型时不成立**，必须组合 2B / 4B 小模型 + CNN 初筛兜底
- **未取得**：Steam Hardware Survey 中国地区 GPU 切片官方数据；建议方法：通过桌宠自身埋点采集首批 1000 名 beta 用户硬件分布，3 个月内得到真实底盘

---

## 5. 替代方案对比（专用分类器 vs VLM）

| 维度 | CNN 专用分类器 | VLM 通用 |
|---|---|---|
| 模型大小 | 10–100 MB | 1–10 GB |
| 推理时延 | 0.03–0.2 s / 帧（YOLO / Ultralytics） | 1–6 s / 帧（LLaVA-Next 1.01 s / V100；GPT-4o 3.3 s） |
| 准确率（已训练类目） | 80%+；fine-tuned MiniGPT v2 0.959 vs YOLOv8 0.87（picsellia 实测） | 75–90% 视任务 |
| 准确率（未训练类目） | 0%（封闭集） | 中-高（开放词表） |
| 中文 UI 支持 | 需训练数据 | Qwen / MiniCPM 原生强 |
| 隐私 | 输入输出固定，可静态审计 | 输出开放，需 prompt 工程保证 |

**桌宠场景实际研究证据**：
- 195 M 参数多模态视频理解模型，量化到 192 MB，对 FPS 游戏"有趣事件"检测 **>90% 准确**（arXiv 2505.07721 Gameplay Highlights Generation）
- 格斗游戏帧分类 CNN：top-1 80% / top-3 95%（arXiv 2311.15963）

**推荐：混合架构**
1. **CNN 初筛**（10–100 MB，<200 ms / 帧）→ 输出粗类目（gameplay / cutscene / menu / video）
2. **VLM 兜底**（仅在 CNN 置信度低时调用 + 用户允许）→ 输出语义标签

混合架构在低配机器上的可行性显著优于纯 VLM：8 GB 机器也能跑 CNN，VLM 由本地或云端兜底。

---

## 6. PM §3.6.6 估算复核

### 6.1 本地推理可用率 ≥70% — **观点：当前模型矩阵下勉强成立，需依赖小模型 + 混合架构**

| 路径 | 可用率（估算） |
|---|---|
| 仅 Qwen2.5-VL-7B Q4 | ~35–45%（中国桌面玩家） |
| 仅 2–4B 模型 Q4（Qwen2.5-VL-3B / MiniCPM-V-2 / Phi-3.5-vision / InternVL3-2B） | ~60–75% |
| **CNN 初筛 + 2B VLM 兜底 + 云端最终兜底** | **≥85%**（推测，需 onboarding 检测） |

**结论**：≥70% 只在"小模型 + CNN 混合"路径下成立。仅押注 7B VLM **不达标**。

### 6.2 语义标签准确率 ≥75% — **观点：可达，但需 prompt + 任务收敛**

证据：
- Qwen2.5-VL OCRBench 88.8、MMBench-EN 88.6（72B 数；7B 数略低，HF 模型卡）
- MiniCPM-V 4.5 OpenCompass 77.0（8B 模型超 GPT-4o-latest，arXiv 2509.18154）
- 桌宠场景是"封闭标签集"（boss_fight / low_hp / victory_screen / video_watching / idle 等 ~20 类），比开放 VQA 简单

会跌的场景：
- 游戏 UI 严重遮挡 + 中文文字密集（OCR 边界）
- 低光 / 暗色调（FPS / 恐怖游戏）
- 自定义 mod / 中文小众独立游戏 → 模型未见训练样本

**建议**：onboarding 让用户校准 5–10 个 ground-truth 帧 → 形成个人化的本地置信度阈值。

### 6.3 隐私穿透率容忍度 = 0 — **观点：纯 prompt 工程做不到 0，需要架构兜底**

可控手段：
1. **System prompt 显式禁止**：列出"不输出用户名 / 聊天内容 / 他人头像 / 邮箱 / 电话 / 手写文字 / 密码框"
2. **输出 schema 强约束**：仅允许 `{tag: enum, confidence: float}`，禁止自由文本字段
3. **后置过滤**：正则 + 关键词 + 命名实体识别（NER）二次过滤
4. **输入预处理**：白名单窗口 + 关键字段（聊天框 / 输入框）马赛克遮罩
5. **本地优先**：本地推理时即使 prompt 失守，敏感语义也不离开设备

**模型层面**：Qwen / MiniCPM / InternVL 都没有官方"隐私模式"承诺；**零穿透只能在系统架构层面达成，不能靠模型自律**。

---

## 7. 推荐选型

### 7.1 MVP 首选：**MiniCPM-V 4.5**（8B / int4）

优点：
- OpenCompass 77.0，**视频帧 96x 压缩**（6 帧 → 64 tokens），对桌宠"短期 buffer ≤60s"场景天然契合
- 清华 OpenBMB 出品，**原生中文强**，活跃度极高
- 提供官方 int4 GGUF + Ollama + llama.cpp + ipex-llm（Intel iGPU）四条部署路径
- VideoMME 推理时间仅 SOTA 的 9.9%（HF 模型卡）

注意点：
- 仍需 ~6 GB 显存；onboarding 必须检测后告知用户能否本地运行
- 商用 License 需逐版本确认（OpenBMB 主代码仓 Apache 2.0，模型权重可能附加条款）

### 7.2 MVP 备选：**Qwen2.5-VL-7B-Instruct**（Q4_K_M ~4.4 GB）

优点：
- **Apache 2.0**（7B 版，明确无 MAU 上限，HF 模型卡 LICENSE 文件）
- Alibaba 国内服务器友好，国内镜像加速好
- OCRBench 88.8%，中文 OCR 领先
- vLLM / Ollama / MLX / llama.cpp 全栈支持

注意点：
- **3B / 72B 版 License 不同**（3B 仅研究用），不要混用
- 视频帧处理无 MiniCPM 4.5 那种 96x 压缩，对 60s buffer 场景效率略低

### 7.3 Onboarding 必备提示
1. 首次启动检测硬件，明确告知用户"本机能否本地跑 VLM"
2. 不能本地跑时提供三选一：① 关闭 VLM 功能 ② 启用 CNN 初筛 only ③ 同意启用云端兜底
3. 给出"本地推理时延 / 显存占用"实测条，建立信任

---

## 8. 云端兜底简述

PM 立场是本地优先，云端仅作兜底。基线参考（事实，2026-05）：
- Claude Haiku 4.5：$1 / $5 per 1M tokens；图像按 token 计算，典型一张图 ~1500–3000 tokens
- OpenAI GPT-5.2：$1.75 / $14 per 1M tokens
- Qwen-VL-Max：国内 API，价格约 $0.91 / 1M input（aggregator 数据，可能不精确）
- Prompt caching 可降本 90%；batch 处理便宜 50%

**估算**：1000 DAU × 10 次 VLM 调用 / 天 × Qwen-VL-Max 兜底 ≈ 几十美元 / 天数量级（推测），可承受。

云端调用必须遵守 v2.3 §4.7.2：仅传送"语义抽取的中间向量 / 模糊化截图 / 描述文本"，不直传原图。

---

## 9. 风险 / 长期跟踪

| 风险 | 类型 | 缓解 |
|---|---|---|
| 中国大陆使用 Gemma-3 / LLaVA 等海外模型的合规 | License + 出口管制 | 优先选 Qwen / MiniCPM 国产模型 |
| Gemma-3 "Prohibited Use Policy" 流转条款 | License | **不采用 Gemma-3 作主路径** |
| 量化精度损失 | 技术 | 上线前用桌宠真实标签集对比 FP16 / int8 / int4 准确率 |
| 2026 每季度新 SOTA | 迭代速度 | 建立"VLM radar 季度复评"机制；MiniCPM-V 已从 2.6 → 4.5 仅一年 |
| Steam 中国硬件切片不公开 | 数据缺口 | beta 用户首 3 个月埋点收集 |
| Apple M1 8 GB 用户 | 长尾 | onboarding 检测后引导 CNN-only 模式 |
| 隐私穿透"0 容忍" | 架构 | 不能靠模型，必须 schema + 后置过滤 + 白名单窗口 |

---

## 10. 参考链接

- Qwen2.5-VL-7B HF 模型卡：https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct
- Qwen2.5-VL 技术报告：https://arxiv.org/pdf/2502.13923
- Qwen2.5-VL vLLM Recipe：https://docs.vllm.ai/projects/recipes/en/latest/Qwen/Qwen2.5-VL.html
- MiniCPM-V 4.5 HF：https://huggingface.co/openbmb/MiniCPM-V-4_5
- MiniCPM-V 4.5 arXiv：https://arxiv.org/html/2509.18154v1
- MiniCPM-V-4_5-int4：https://huggingface.co/openbmb/MiniCPM-V-4_5-int4
- LLaVA-NeXT 仓库：https://github.com/LLaVA-VL/LLaVA-NeXT
- LLaVA-NeXT 推理成本论文：https://arxiv.org/html/2406.11823v1
- Florence-2-large HF：https://huggingface.co/microsoft/Florence-2-large
- Phi-3.5-mini / vision HF：https://huggingface.co/microsoft/Phi-3.5-mini-instruct
- Gemma 3 HF Blog：https://huggingface.co/blog/gemma3
- Gemma Terms of Use：https://ai.google.dev/gemma/terms
- intel/ipex-llm（含 MiniCPM-V / Qwen-VL iGPU 支持）：https://github.com/intel/ipex-llm
- Intel iGPU VLM Benchmark：https://nikolasent.github.io/hardware/deeplearning/2025/02/09/iGPU-Benchmark-VLM.html
- Steam 2026-04 GPU 榜：https://store.steampowered.com/hwsurvey/videocard/
- Steam 2026-04 趋势：https://www.thefpsreview.com/2026/05/02/trends-from-the-april-2026-steam-hardware-survey/
- Guru3D 2026-04 总结：https://www.guru3d.com/story/steam-survey-april-2026-shows-rtx-3060-still-leading-gpu-market/
- China PC 市场 2026 outlook：https://infotechlead.com/devices/china-pc-market-outlook-2026-forecast-challenges-2025-achievements-and-market-share-leaders-94911
- Apple Silicon Mac 2026 本地 LLM 指南：https://www.sitepoint.com/local-llms-apple-silicon-mac-2026/
- VLM vs CNN（Picsellia）：https://www.picsellia.com/post/vlms-vs-cnns-a-new-era-dawning-in-computer-vision-performance
- 游戏画面 CNN 识别：https://arxiv.org/pdf/2311.15963
- Gameplay Highlights（195 M 参数 90% 准确）：https://arxiv.org/html/2505.07721
- Claude API 定价：https://platform.claude.com/docs/en/about-claude/pricing
- Qwen License 讨论：https://github.com/QwenLM/Qwen/issues/778

---

## 11. 事实 / 观点 / 推测分层标注

### 11.1 事实（有 URL 证据）
- MiniCPM-V 4.5 OpenCompass 77.0、视频压缩 96x、推理时间 SOTA 的 9.9%（arXiv 2509.18154、HF 模型卡）
- Qwen2.5-VL OCRBench 88.8、MMBench-EN 88.6（72B 数）（HF + 技术报告）
- LLaVA-NeXT-7B V100 实测 1.01 s / 图，20 GB 显存（arXiv 2406.11823）
- Florence-2 0.23B / 0.77B 参数、MIT License（HF 模型卡）
- Qwen2.5-VL **7B 是 Apache 2.0，3B 是 Research License（禁商用），72B 是 Qwen License（100M MAU 上限）**（GitHub issue 778 + HF LICENSE）
- Gemma Terms 含 PUP 流转条款 + Google 单方面终止权（Gemma 官方 Terms 页）
- Steam 2026-04：RTX 3060 4.15% 居首，RTX 4060 4.05%（Guru3D）
- Steam 2026-02 简体中文用户峰值 54.60%（春节异常，事实但需谨慎解读）
- 中国 PC 市场 Lenovo 40%、Huawei 11%、HP 10%（InfotechLead 2026）
- Intel ipex-llm 官方支持 MiniCPM-V / Qwen-VL（GitHub README）
- M2 Air llama 3.1 8B 18 tok/s（modelpiper / sitepoint blog）
- CNN（YOLO 类）0.03–0.2 s 推理；VLM（LLaVA-Next）6.2 s / GPT-4o 3.3 s（Picsellia）

### 11.2 观点（基于事实的判断）
- MiniCPM-V 4.5 是当前桌宠 MVP 综合最优选；Qwen2.5-VL-7B 是 License 最稳的备选
- "本地推理可用率 ≥70%"只在"小模型 + CNN 混合"路径下成立
- "隐私穿透率 = 0"不能靠模型 prompt，必须靠系统架构（schema 强约束 + 后置过滤 + 白名单）
- Gemma-3 不应作主路径（License 风险流转）
- 桌宠场景"封闭标签集"比开放 VQA 简单，75% 准确率可达

### 11.3 推测（缺乏直接实测，需 beta 验证）
- 单帧延迟在 RTX 4060 / M2 16 GB 上 ~1–2 s（基于通用 LLM tok/s 类比 VL 慢 30–50%）
- 中国桌面玩家中能跑 7B Q4 VLM 比例 ~35–45%
- 能跑 2–4B Q4 VLM 比例 ~60–75%
- Phi-3.5-vision、InternVL3 在 RTX 3060 上单帧延迟 <1 s

### 11.4 未取得 + 建议方法
- **Steam Hardware Survey 中国地区 GPU 切片官方数据**：建议方法 = 桌宠 beta 首 3 个月埋点
- **Qwen2.5-VL-7B 在 RTX 3060 / M2 Max 的官方实测 tok/s**：建议方法 = 自行用 vLLM + Ollama 跑标准 benchmark
- **中文游戏 UI 上的语义标签准确率**：建议方法 = 选 5 款代表性国服游戏（如 原神 / 永劫 / 王者模拟器 / DNF / LOL）人工标 100 帧做对比

---

## 12. 给 PM 与 Engineering 的接续建议

### 12.1 PM 决策点

1. **§3.6.6 估算修正**：建议把"本地推理可用率 ≥70%" 调整为"**CNN 初筛 + 2–4B VLM 兜底 + 云端最终兜底 三档混合下 ≥85%**"；并把 §3.6.6 第二条"语义标签准确率 ≥75%"在桌宠封闭标签集前提下确认成立。
2. **隐私穿透 0 容忍的实现路径**：从"模型 prompt"改写为"模型 prompt + 输出 schema 强约束 + 后置过滤 + 白名单窗口"四层架构，单层失守可被下层兜底。
3. **License 红线**：Gemma-3 / Qwen2.5-VL-3B / LLaVA-NeXT 不进 MVP；MiniCPM-V 4.5 商用条款需法务核验逐版本权重。

### 12.2 Engineering Build Thread 接续

1. **混合架构**：把"CNN 初筛 + VLM 兜底"作为 VLM 模块的默认架构；CNN 用预训练 MobileNet / EfficientNet 起步即可，10–100 MB 量级。
2. **量化部署**：MiniCPM-V 4.5 走 int4 GGUF + llama.cpp / ipex-llm（Intel iGPU）；Qwen2.5-VL-7B 走 Q4_K_M GGUF + Ollama / MLX；两套并行可降低单一栈风险。
3. **Onboarding 硬件检测**：首启时跑一次 30 秒 benchmark（输出 tok/s + 显存占用），把结果存档作为后续模型选择依据。
4. **云端兜底接入**：仅在用户显式同意 + 输入预处理（关键字段马赛克）后启用；调用频次必须有日志可审计。

### 12.3 后续 Radar 跟踪

- MiniCPM-V 后续版本（5.x / 6.x）与 Qwen2.5-VL 后续版本（3.x）每季度评估
- 中国桌面玩家硬件分布（beta 用户埋点结果）
- 国产小 VLM（如 Skywork-VL / Yi-VL）是否进入候选
- Apple M5 / M6 NPU 对 VLM 推理的实际提升

报告结束。
