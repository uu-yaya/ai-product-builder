# Trend Research: 音频派生信号库（A0）

> Branch: `memory-dataset`
> Owner: AI Trend Radar Thread
> Filed at: 2026-05-12
> Reference spec: `01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.10 / §10.3 A0–A3 分级 + `01-pm/branches/memory-dataset/AI_FEATURE_EVALUATION_memory-dataset.md` v2 §3.10
> PM DM trigger: `06-sync/dm/pm-to-radar/2026-05-12T09-13-46_pm_audio-derivation-libraries-radar-research.md`
> Companion deliverables: `TREND_RESEARCH_os-now-playing-api.md`（A1 路径，并存）；`TREND_RESEARCH_browser-tab-detection.md`；`TREND_RESEARCH_local-vlm-feasibility.md`

## 1. 引言

本调研聚焦 **A0 派生信号**（BPM 估算、能量曲线桶化、节拍点事件、静音检测）的开源库可行性，为 PM §3.10.5 "≤200ms 延迟 / <5% 单核 CPU" 估算提供事实底盘。**严格排除**：A1 元数据（另一份调研负责）、A2 歌词识别、A3 声纹 / 语音内容。

**信源结构**：一级源（GitHub README、官方文档、ISMIR 论文、Apple / Microsoft 平台文档）已直接抓取；部分论文 PDF 未拿到详细数字，已标"未取得"。

**实时 vs 批处理界定标准**（本报告采用）：
- 算法**因果性**（causal）：不依赖未来样本
- 单帧推理时间 < hop 周期（44.1 kHz / 512 hop = 11.6 ms）
- 不依赖全曲长度做动态规划

## 2. 总览矩阵

| 库 | 能力覆盖 | 实时性 | 延迟（首拍 / 单帧） | 准确度 | 跨平台 | CPU / 内存 | ARM64 | License | 活跃度 | 是否实时 |
|---|---|---|---|---|---|---|---|---|---|---|
| **aubio** | onset / BPM / 静音阈值 / pitch；能量桶化需自封装 | 因果算法，C 实现 | 单帧 < 11.6 ms（hop 512@44.1k）；首拍稳定 5–10 秒（推测） | OBTAIN 论文称 aubio 为 baseline，但 F-measure 具体数字未取得 | macOS / Win / Linux / iOS（README） | 极低（C），具体数字未取得 | 推测可，未官方声明 | **GPL-3.0** | **低**：v0.4.9 = 2019-02；PyPI 12 个月无新版（Snyk 标 Inactive） | 是 |
| **Essentia (C++)** | BPM / beat / onset / RMS / loudness / 静音；RhythmExtractor2013 streaming 模式 | streaming AlgorithmComposite 类 | 未取得（依赖 RhythmExtractor2013 的累积分析窗） | RhythmExtractor2013 是 multifeature 版本，准确度优于旧版（官方说法） | macOS / Win / Linux；essentia.js 通过 WASM 跨浏览器 | C++ 原生；具体未取得 | 是（MTG 提供 ARM 构建） | **AGPL-3.0**（商用需付费 proprietary license） | 中高（MTG / UPF 持续维护） | 是（streaming 模式） |
| **BTrack** | beat / tempo / onset 检测函数 | 设计目标即实时（causal） | hop 512@44.1k = 11.6 ms / 帧；首拍稳定 ~5 秒（推测） | Stark 2009 DAFx 论文报告了 F-measure，具体数字未抓取 | macOS / Win / Linux / Max external | 极轻（C++） | 推测可 | **GPL-3.0** | **高**：v1.0.7 = 2025-12-31；新增 PyPI 包 `btrack-beat-tracker` | 是 |
| **BeatNet (CRNN + PF)** | beat / downbeat / tempo / meter | 因果 CRNN + particle filter | hop 20 fps ≈ 50 ms（论文）；BeatNet+ 报告"competitive latency"具体 ms 未取得 | ISMIR 2021 SOTA（论文）；BeatNet+ F1 ≥ 原版 | macOS / Win / Linux（PyAudio 需各平台适配） | 中等（PyTorch + madmom 依赖） | PyTorch 在 M1 / M2 可用（CPU / MPS） | **CC-BY-4.0**（代码） | 中（最新成果 BeatNet+ 在 TISMIR 2024-12） | 是（streaming + real-time 两档） |
| **madmom** | beat / downbeat / onset / tempo / chord / key | DBNBeatTrackingProcessor 有 `online=True` | 帧率 100 fps（10 ms hop），但 RNN 推理 + DBN 解码累积延迟较大；首拍稳定数秒 | ISMIR 多年 SOTA（论文） | macOS / Win / Linux | 中等（NumPy / Cython） | **Python 3.10+ 兼容性破损**（GitHub issue #527 / #535），社区 fork `madmom-py3.10-compat` 临时补丁 | **BSD-3-Clause**（宽松） | **低**：PyPI 12 个月无新版（Snyk 标 Inactive）；v0.16.1 = 2018 | 是（online 模式）但**有 Python 部署风险** |
| **librosa** | beat_track（DP）/ plp / onset / RMS / tempo / tempogram | 主要为批处理；`librosa.stream` 仅文件流；PLP 可流式 | beat_track 需全曲做 DP，**不适合实时**；PLP 可缓冲式 | 通用，但实时场景不是设计目标 | macOS / Win / Linux | NumPy / SciPy / Numba | 是（pure Python） | **ISC**（宽松类 BSD） | 高（持续更新到 0.11.x） | **基本否**（仅 PLP 勉强可用） |
| **cpal + 自实现 / DSP 简易能量曲线** | 仅 RMS / energy / 简单 onset；BPM 需自写 | 取决于实现 | 自定，理论 < 1 帧 | 自定 | 全平台 | 极轻 | 是 | Apache-2.0 / MIT | 高 | 是（基础能量 / 静音） |
| **pyAudioAnalysis** | 多种特征 + classifiers | 偏批 / 分析 | 不优化实时 | 一般 | macOS / Win / Linux | 中 | 推测可 | **Apache-2.0** | 中（维护减缓） | 否 |

**注**：上表"未取得"部分多为 CPU 占用绝对数字。开源社区少有标准化跨硬件 benchmark；建议自行用 `psutil` + `time.perf_counter()` 在 M1 / M2 / Intel x86_64 三档实测。

## 3. 与 PM 字段映射小结

| PM 字段 | 直接吐出 | 需二次封装 | 备注 |
|---|---|---|---|
| `bpm_estimate` | aubio (`tempo`) / Essentia (`RhythmExtractor2013`) / BTrack / BeatNet / madmom | librosa（仅批量） | aubio 已知会出现 BPM 倍频 / 半频错（GitHub issue #212） |
| `energy_curve_buckets` | librosa (`rms`) / Essentia (`Loudness / RMS`) / cpal + 自写 | aubio / BTrack / BeatNet（需补层） | 桶化只是 RMS → bin 映射，自封装成本极低 |
| `beat_event` | aubio / Essentia / BTrack / BeatNet / madmom | librosa | BeatNet / madmom 提供 confidence 字段 |
| `silence_signal` | aubio（onset silence_threshold dB） / cpal + 自写 RMS gate | Essentia (`SilenceRate`)；BTrack 无直接接口 | 桌宠场景**最简方案**：RMS 阈值 + hysteresis |

**结论**：单一库内一站式拿到全部 4 个字段的是 **Essentia**（streaming RhythmExtractor + Loudness + SilenceRate）和 **aubio**（onset + tempo + silence_threshold）。其他都需要拼装。

## 4. 接 OS 音频流的工程路径

### 4.1 macOS

| 路径 | 优点 | 缺点 | 适用 |
|---|---|---|---|
| **Core Audio Taps API**（macOS 14.2+，AudioCap / AudioTee 有示例） | 原生、无需用户装虚拟设备、零用户摩擦 | **macOS 14.2 (2023-12) 起才可用**；早期 macOS 仍需 BlackHole 兜底 | 推荐主路径（事实） |
| **BlackHole / Aggregate Device** | 兼容老 macOS；开源 MIT；零额外延迟 | onboarding 痛点：用户需手动装 kext + 建 Aggregate Device | 旧 macOS 兜底 |
| **AVAudioEngine + Tap on output node** | 苹果框架原生 | Tap 仅捕获本进程音频，**不能抓系统输出**（事实 / 推测混合） | 不适用 A0 系统级 |

### 4.2 Windows

| 路径 | 备注 |
|---|---|
| **WASAPI Loopback** (`AUDCLNT_STREAMFLAGS_LOOPBACK`) | 原生支持，无需第三方驱动（事实，Microsoft Learn） |
| miniaudio / portaudio | Windows 端有 WASAPI loopback，可跨平台抽象（事实） |
| Rust `cpal` | **当前 master 已移除 loopback**（GitHub PR #339 后续回退）；需直接用 `wasapi` crate（事实） |

### 4.3 中间层抽象选型建议

| 候选 | 评价 |
|---|---|
| **miniaudio** (C 单头文件) | Windows WASAPI loopback ✓；macOS Tap 支持是 open issue（#875，2024-07）但**尚未合并**（事实） |
| **PortAudio** | 成熟稳定；macOS 系统音频需配合 BlackHole |
| **cpal** (Rust) | Windows loopback 残缺；不推荐作 A0 唯一通道 |
| **sounddevice** (Python) | 仅 PortAudio 封装；同上 |
| **ffmpeg** | 太重，A0 用不上 |

**推荐组合**（推测 / 建议）：
- **macOS 14.2+**：原生 Core Audio Tap（Swift / Objective-C 写一个 helper）
- **macOS < 14.2**：BlackHole + miniaudio / PortAudio 抓
- **Windows 10 / 11**：直接 WASAPI loopback（C++）或 miniaudio
- **跨平台 wrapper**：用 Rust + `wasapi` crate（Win）+ Swift FFI（macOS）或 C++ miniaudio fork（待 Tap 支持合并）

## 5. PM §3.10.5 估算复核

### 5.1 延迟 ≤200 ms

| 库 | 估算 | 评估 |
|---|---|---|
| aubio | 单帧 11.6 ms + 几个 hop 收敛 | **<200 ms 容易满足**（事实，causal C 实现） |
| BTrack | 11.6 ms / 帧；首拍稳定数秒 | **首拍 ≤ 5 秒**（推测，需实测）；稳定后每帧 ≤ 50 ms |
| Essentia streaming | 取决于 RhythmExtractor2013 累积窗 | **首拍可能超 5 秒**（观点）；稳定后帧延迟低 |
| BeatNet | hop ≈ 50 ms（论文）；particle filter 有 buffer | BeatNet+ 报告 "competitive latency"，**具体 ms 未取得** |
| madmom (online) | hop 10 ms；RNN + DBN 解码累积 | 首拍稳定较慢（观点，论文未明确数字） |
| librosa beat_track | 需全曲 DP | **不可能 <200 ms**（事实） |

**结论**：A0 主要瓶颈不是单帧延迟，而是"**首拍稳定时间**"。事实上几乎所有 beat tracker 都需要 3–10 秒累积才能稳态输出 BPM。PM §3.10.5 若只指**事件级延迟**（每个 beat event 从音频帧到信号 ≤ 200 ms），则 aubio / BTrack / Essentia streaming 都能满足；若指**首拍准确度稳态**，需额外加 "warmup 期" 概念。

### 5.2 CPU ≤5% 单核

未取得跨硬件实测数字。建议方法：
- **基准音频**：1 分钟 120 BPM Pop loop（避免提供用户原始数据）
- **三档硬件**：M1（Apple Silicon）/ Intel 12 代 i7 / AMD Ryzen 7
- **指标**：`psutil.Process().cpu_percent(interval=1.0)` 持续 60 秒中位数
- **粗略推测**：aubio / BTrack 单核占用 < 3%；BeatNet / madmom（神经网络）单核 5–15%（观点，需实测）

## 6. 推荐方案

### 6.1 MVP 首选

1. **主力：aubio**（GPL-3.0）+ 简单 RMS 桶化 + silence threshold
   - 优势：单库覆盖 BPM / beat / silence；C 实现 CPU 极低；causal 设计天然实时
   - 风险：GPL-3.0 **传染性**对桌宠商业化是硬约束（详见 §7）；上游维护减缓
   - 适用：先做 A0 原型验证用户感知

2. **备选：BTrack + 自写 RMS**
   - 优势：2025-12 仍活跃；专为 real-time 设计
   - 风险：同 GPL-3.0；不出 BPM 直接出 beat 事件，BPM 需自统计 IBI

### 6.2 升级路径

3. **进阶：BeatNet / BeatNet+**（CC-BY-4.0）
   - 优势：节奏多样性显著好于 aubio；License 友好
   - 风险：PyTorch 部署重，需要打包 ~200MB 模型；CPU 占用预计高于 5% 单核
   - 时机：MVP 验证用户对"节奏陪伴"价值后再切

### 6.3 不推荐

- **Essentia**：AGPL-3.0 对桌宠这种**客户端嵌入**等同传染，需付费 proprietary license（成本未取得，需走 UPF 商务沟通）
- **madmom**：Python 3.10+ 兼容性破损 + 2 年无新版，部署风险高
- **librosa beat_track**：不实时，pass

## 7. 风险 / 长期跟踪

### 7.1 License 风险（**必须法务确认**）

| 库 | License | 桌宠（客户端二进制分发）影响 |
|---|---|---|
| aubio / BTrack | **GPL-3.0** | 链入即传染。若桌宠闭源发布，**理论需替换** |
| Essentia | **AGPL-3.0** | 比 GPL 更激进（涵盖网络服务）；商用需付费 |
| madmom | BSD-3 | 友好 |
| BeatNet | CC-BY-4.0 | 友好（仅需署名）；模型权重也需检查 |
| librosa / cpal | ISC / Apache-2.0 / MIT | 友好 |

**建议**：A0 选 License 友好库（BeatNet / 自实现 + librosa rms / cpal）作长期路线；GPL 库仅做原型。

### 7.2 部署难度

- **C / C++（aubio / BTrack / Essentia）**：需 macOS universal + Windows x86_64 + 可能 Win ARM64 三套构建
- **Python（madmom / BeatNet / librosa）**：桌宠如果用 Electron / Tauri，Python 子进程方案需打包 Python runtime，体积膨胀 100MB+
- **Rust（cpal + 自实现）**：交叉编译最干净；推荐若团队有 Rust 能力

### 7.3 用户感知（onboarding 痛点）

- macOS 14.2 以下用户：必须装 BlackHole + 配 Aggregate Device，**预计 30%+ 用户流失**（推测）
- macOS 14.2 以上用户：Core Audio Tap 需获取系统音频录制权限，**首次弹窗**会触发用户警觉
- Windows：WASAPI loopback 零摩擦
- **建议**：A0 在 onboarding 显式说明"派生级、不存音频、不识别内容"，并给用户 opt-out 开关

### 7.4 长期跟踪信号

- madmom 是否复活（Python 3.12+ 支持）
- miniaudio issue #875（macOS Tap 支持）合并进度
- BeatNet+ 是否出 ONNX / Core ML 版本（降部署成本）

## 8. 参考链接

### 8.1 一级源

- aubio GitHub：https://github.com/aubio/aubio
- aubio 官方文档：https://aubio.org/manual/latest/
- aubio `onset.h`（silence threshold）：https://aubio.org/doc/latest/onset_8h.html
- aubio Snyk 维护报告：https://snyk.io/advisor/python/aubio
- BTrack GitHub：https://github.com/adamstark/BTrack
- BeatNet GitHub：https://github.com/mjhydri/BeatNet
- BeatNet ISMIR 2021 paper：https://archives.ismir.net/ismir2021/paper/000033.pdf
- BeatNet+ TISMIR 2024：https://transactions.ismir.net/articles/10.5334/tismir.198
- BeatNet+ PDF：https://transactions.ismir.net/articles/198/files/6752db4c37a7f.pdf
- madmom GitHub：https://github.com/CPJKU/madmom
- madmom DBNBeatTracker beats.py：https://madmom.readthedocs.io/en/v0.16/modules/features/beats.html
- madmom 维护报告（Snyk）：https://snyk.io/advisor/python/madmom
- madmom Python 3.10+ 兼容性 issue：https://github.com/CPJKU/beat_this/issues/9
- Essentia GitHub：https://github.com/MTG/essentia
- Essentia licensing：https://essentia.upf.edu/licensing_information.html
- Essentia RhythmExtractor streaming：https://essentia.upf.edu/reference/streaming_RhythmExtractor.html
- Essentia streaming_rhythmextractor_multifeature：https://github.com/MTG/essentia/blob/master/src/examples/streaming_rhythmextractor_multifeature.cpp
- essentia.js：https://github.com/MTG/essentia.js
- essentia.js TISMIR paper：https://transactions.ismir.net/articles/10.5334/tismir.111
- librosa.beat.beat_track：https://librosa.org/doc/main/generated/librosa.beat.beat_track.html
- librosa.beat.plp（streaming）：https://librosa.org/doc/main/generated/librosa.beat.plp.html
- librosa.stream：https://librosa.org/doc/main/generated/librosa.stream.html
- librosa real-time onsets issue #1424：https://github.com/librosa/librosa/issues/1424
- OBTAIN paper：https://arxiv.org/abs/1704.02216
- Beat This!（Foscarin 2024）：https://arxiv.org/abs/2407.21658 / https://github.com/CPJKU/beat_this
- Apple Core Audio Taps doc：https://developer.apple.com/documentation/CoreAudio/capturing-system-audio-with-core-audio-taps
- AudioCap sample（macOS 14.4+）：https://github.com/insidegui/AudioCap
- AudioTee CLI：https://github.com/makeusabrew/audiotee
- BlackHole：https://github.com/ExistentialAudio/BlackHole
- Microsoft WASAPI Loopback doc：https://learn.microsoft.com/en-us/windows/win32/coreaudio/loopback-recording
- Application Loopback Audio sample：https://learn.microsoft.com/en-us/samples/microsoft/windows-classic-samples/applicationloopbackaudio-sample/
- miniaudio macOS Tap issue #875：https://github.com/mackron/miniaudio/issues/875
- cpal WASAPI loopback PR #339 / issue #251：https://github.com/RustAudio/cpal/issues/251

### 8.2 二级源（标注用途）

- maxhaesslein "Real Time Beat Prediction with Aubio"（参数调优、hop size 经验值）：https://www.maxhaesslein.de/notes/real-time-beat-prediction-with-aubio/
- WLEDAudioSyncRTBeat（aubio 在桌面音视频联动的实战案例）：https://github.com/zak-45/WLEDAudioSyncRTBeat
- "From Core Audio to LLMs" 博客（Tap API 实践叙述）：https://chisto.com/from-core-audio-to-llms-native-macos-audio-capture-for-ai-powered-tools/

## 9. 事实 / 观点 / 推测分层标注

### 9.1 事实（已直接验证）

- aubio License = GPL-3.0；v0.4.9 = 2019-02；PyPI 12 个月无新版
- BTrack License = GPL-3.0；v1.0.7 = 2025-12-31，活跃
- BeatNet License = CC-BY-4.0；ISMIR 2021；BeatNet+ TISMIR 2024-12
- madmom License = BSD-3；Python 3.10+ 破损；2 年无新版
- Essentia License = AGPL-3.0 双授权；商用付费
- macOS Core Audio Taps 在 14.2（2023-12）引入，14.4+ 有 AudioCap 示例
- Windows WASAPI 原生支持 loopback (`AUDCLNT_STREAMFLAGS_LOOPBACK`)
- Rust cpal 当前 master 不稳定支持 WASAPI loopback
- librosa.beat.beat_track 用全曲 DP，不适合实时；PLP 可流式
- aubio BPM 算法已知会半频 / 倍频（GitHub issue #212）

### 9.2 观点（基于事实推断）

- A0 用 aubio 做 MVP 最快，但 GPL-3.0 长期需替换
- madmom 因维护停滞 + Python 兼容性问题不适合桌宠生产
- Essentia AGPL 对桌宠客户端嵌入是硬约束
- 首拍稳定时间（warmup）比单帧延迟更影响用户感知

### 9.3 推测（无强证据，需实测验证）

- aubio / BTrack 单核 CPU 占用 < 3%
- BeatNet 在 M1 CPU 推理预计 5–15% 单核
- macOS 14.2 以下用户对装 BlackHole 的流失率（预计 30%+）
- BTrack 首拍稳定时间 ~5 秒
- C 库可在 ARM64 上重编译（aubio 未官方声明）

---

## 10. 给 Engineering Build Thread 的接续建议

1. **MVP 路线**：aubio 原型先验证用户对 A0 信号的感知价值；同时评估 BeatNet + cpal 自实现的长期可商用方案。
2. **License 法务前置**：A0 库选定前先过法务（特别是 aubio / Essentia 的 GPL / AGPL 边界）；建议把"License 友好"作为最终选型的必要条件。
3. **OS 接入分平台**：macOS 14.2+ 走 Core Audio Tap；macOS < 14.2 走 BlackHole 兜底（onboarding 必须明确告知用户成本）；Windows 直接 WASAPI loopback。
4. **CPU / 延迟实测**：用本报告 §5 建议的方法（1 分钟 120 BPM Pop loop + psutil + 三档硬件）在 PoC 阶段就完成基线测量；不要等到 MVP 上线再发现 CPU 超标。
5. **字段映射**：`bpm_estimate` 直接采 aubio / Essentia 输出；`energy_curve_buckets` 自封装 RMS → bin；`beat_event` 采 aubio / BTrack 事件；`silence_signal` 用 RMS 阈值 + hysteresis，**不依赖第三方库**。

## 11. 给 PM 的反馈

- **PM §3.10.5 估算**：单帧延迟 ≤200ms **成立**（aubio / BTrack / Essentia streaming 均满足）；CPU ≤5% 单核**对纯 DSP 库成立、对神经网络库（BeatNet / madmom）需实测**。
- **建议在 §3.10.5 新增"首拍稳定时间（warmup）"指标**：默认窗口 5 秒；warmup 内桌宠不应根据 BPM 做反应，避免错乱。
- **A2 / A3 排除项已确认无技术歧义**：本报告所有候选库均能在不涉及内容识别的前提下提供 A0 信号。
