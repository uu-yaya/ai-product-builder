# PM → Radar: 音频派生信号库调研委托

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-12T09-13-46
6. Trigger：`01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.10 新增 audio A0 派生信号 + AI_FEATURE_EVALUATION §3.10；用户 2026-05-12 同意启动

## 2. 调研问题

1. 主流的**实时音频派生信号库**在桌面 pet 场景的可行性：
   1. 候选库：`aubio` / `librosa`（注意 librosa 偏批处理，可能不适合实时） / `Essentia` / `BTrack` / `BeatNet` / `madmom` / 其他你认为合理的开源方案。
   2. 每个库的：①能力覆盖（BPM 实时估算 / 能量曲线桶化 / 节拍点事件 / 静音检测）；②延迟（首拍稳定时间 + 单帧推理时间）；③准确度（与人工节拍标注对比）；④跨平台（macOS / Windows / 是否依赖原生扩展）；⑤CPU 占用 / 内存占用 / 是否支持 ARM64；⑥License；⑦活跃度。
2. 这些库如何接 OS 级系统音频流（macOS CoreAudio / Windows WASAPI）？是否需要中间层（如 ffmpeg / GStreamer）？
3. 与 PM v2.3 §4.10.2 期望字段的映射：哪个库能直接吐 `bpm_estimate` / `energy_curve_buckets` / `beat_event` / `silence_signal`？哪个需要二次封装？
4. PM v2.3.3 §3.10.5 估算"延迟 ≤200ms / CPU 占用 < 5% 单核"，**这个估算是否成立**？哪种硬件 / 哪种采样配置下不成立？

## 3. 约束条件（必须遵守）

1. 仅调研**实时（streaming / online）**算法；批处理 / 离线分析的库不在范围（如 librosa 的 `beat_track` 偏离线，标注为"批处理"即可，不展开）。
2. 严守 PM v2.3 §4.10.6 排除项 + §10.3 A0-A3 分级：
   1. 不调研歌词识别 / 语音识别 / 人声特征 / 声纹 / 风格分类等**内容级**能力。
   2. 不调研需要原始音频持久化的方案。
   3. 不调研麦克风采集方案（属 voice-interaction 分支，不在本次范围）。
3. 不调研需要训练 / 微调的方案；只评估开箱即用 + 配置调参。
4. 不调研云端方案（A0 必须本地）。
5. 一律遵循 `projects/desktop-pet/PROJECT_RULES.md` 与项目级 PRIVACY_BOUNDARY。
6. 报告中**不要**附音频样本 / 不要附用户原始数据。

## 4. 期望产出

1. 文件：`04-research/branches/memory-dataset/TREND_RESEARCH_audio-derivation-libraries.md`（沿用既有分支研究目录结构）。
2. 结构建议：
   1. 总览矩阵：库 × {能力 / 延迟 / 准确度 / 跨平台 / CPU / 内存 / License / 活跃度 / 是否实时}。
   2. 与 PM 字段映射小结：哪些字段能拿到、哪些需要补层。
   3. 接 OS 音频流的工程路径（macOS CoreAudio / Windows WASAPI）。
   4. 推荐方案：MVP 首选 1-2 个库，备选 1 个；理由。
   5. PM 估算复核（§3.10.5 延迟 ≤200ms / CPU ≤5%）：在常见硬件分布下是否成立。
   6. 事实 / 观点 / 推测分层标注。

## 5. 信源建议（仅参考）

1. 各库的 GitHub 仓库（README / benchmarks / issues）。
2. 学术论文（如 BeatNet / madmom 等近年的 SOTA 模型论文）；ISMIR 会议历年节奏检测论文。
3. Apple Developer Documentation（CoreAudio / AVAudioEngine）。
4. Microsoft Learn（WASAPI / Media Foundation）。
5. 同行实测（音乐可视化软件 / 桌面节拍灯软件博客）。

## 6. 时限

1. 软目标：72h 内出初稿；硬截止：1 周。
2. 阻塞或不可行时按协议 §13 写 blocker。

## 7. 不在本次调研范围

1. 工程接入实现（属 Engineering Build Thread）。
2. 内容识别（歌词 / 语音 / 风格）。
3. 麦克风采集（属 voice-interaction 分支）。
4. 模型训练 / 数据采集。
5. UI / 视觉（节拍可视化属 Design Thread）。
