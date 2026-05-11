# Steam 桌宠性能测试方法论

> 项目：desktop-pet
> 线程：AI Trend Radar Thread
> 范围：Steam 平台（Windows-first）的桌宠 / 桌面 AI 伴侣类产品的性能占用测试方法论
> 适用产品样本：Desktop Mate、VPet-Simulator、Ai Vpet、CielChan、Open LLM Vtuber 等 Steam 上架或 Steam 风格的桌面 overlay 应用
> 最后更新：2026-05-09
> 状态：方法论 V1（公开来源调研 + 工具链整合 + 评判分级）；本机未实测

---

## 0. 一图看懂

测试桌宠性能 = **回答 6 个问题**：

1. 它**自身**消耗了多少 CPU / GPU / 内存 / 显存？
2. 它在**空闲**和**交互**时，资源曲线分别长什么样？
3. 它在**全屏游戏覆盖层**场景下，对宿主游戏的 **FPS / 1% Low / 帧时间**有多少损害？
4. 它启动 / 运行 / 关闭时，是否有**内存泄漏 / CPU 漂移 / 句柄增长**？
5. 它的**网络 / 麦克风 / 屏幕 / 文件**等高敏感访问，是否产生隐性占用？
6. 它的**能耗与发热**（笔记本场景）是否突破日常使用阈值？

> 注意：Steam 桌宠通常以 **Always-on Top + 透明窗口 + 高刷新动画** 形式存在，资源曲线和普通桌面应用差异较大。**不能只看平均 CPU**，必须同时看 P95 / 峰值 / 长时漂移。

---

## 1. 关键性能指标定义

### 1.1 CPU 指标

| 编号 | 指标 | 单位 | 定义 | 采集源 |
|----|----|----|----|----|
| 1.1.1 | CPU 平均占用率 | % | 整个测试场景内进程级 CPU 时间均值 | typeperf `\Process(name)\% Processor Time` 或 Process Explorer |
| 1.1.2 | CPU P95 | % | 95% 时间内 CPU 不超过此值；反映"偶尔卡一下"的概率 | 采样后用 Excel/Python 计算 |
| 1.1.3 | CPU 峰值 | % | 测试期间最高一秒采样值 | 同上 |
| 1.1.4 | 单核占用率 | % | 进程对单一逻辑核心的占用，重点用于检测主线程阻塞 | Windows 任务管理器 / Process Explorer |
| 1.1.5 | 上下文切换 / 秒 | 次 | 反映桌宠内部线程是否过度调度 | `typeperf \Process(name)\Context Switches/sec` |
| 1.1.6 | CPU 漂移 | %/h | 长时稳定性测试中 CPU 平均值的小时级漂移率 | 2h 长跑 + 线性回归 |

> 桌宠特殊性：CPU% 是**所有逻辑核心总和归一化**的值。8 核 16 线程机器上，桌宠跑满 1 个逻辑核 = 任务管理器显示 ~6.25%，但用户体感已经是"主线程被占满"。**必须同时记录单核占用率**。

### 1.2 GPU 指标

| 编号 | 指标 | 单位 | 定义 | 采集源 |
|----|----|----|----|----|
| 1.2.1 | GPU 引擎占用率 | % | GPU 各 Engine（3D / Compute / Copy / Video）的 busy 时间百分比 | `typeperf \GPU Engine(*)\Utilization Percentage` |
| 1.2.2 | GPU 专用显存 | MB | 进程占用的独显 VRAM | `typeperf \GPU Process Memory(*)\Dedicated Usage` |
| 1.2.3 | GPU 共享内存 | MB | 进程从系统 RAM 借用的显存（集显 / WSL / Electron） | `typeperf \GPU Process Memory(*)\Shared Usage` |
| 1.2.4 | GPU Busy (PresentMon) | ms 或 % | 单帧 GPU 真正在干活的时间，用于区分瓶颈是 CPU 还是 GPU | Intel PresentMon 2.x |
| 1.2.5 | 帧时间 Frametime | ms | 单帧从呈递到上屏的耗时 | PresentMon / FrameView / RTSS |
| 1.2.6 | 桌宠帧率 | FPS | 桌宠自身的渲染帧率（很多 2D 桌宠会限制在 15-30 FPS） | RTSS / 应用内显示 |

> 桌宠特殊性：不少 Live2D / 3D 桌宠默认开启 **VSync 关闭 + 高 FPS**，对集显 / 笔记本独显是隐性负担。要把"桌宠自身 FPS 上限"当作可控变量分别测 30 / 60 / 120 FPS。

### 1.3 内存指标

| 编号 | 指标 | 单位 | 定义 | 采集源 |
|----|----|----|----|----|
| 1.3.1 | 工作集 Working Set | MB | 物理内存中当前实际占用 | `\Process(name)\Working Set` |
| 1.3.2 | 私有字节 Private Bytes | MB | 仅本进程独占的虚拟内存 | `\Process(name)\Private Bytes` |
| 1.3.3 | 内存峰值 | MB | 测试期最高值 | 同上 |
| 1.3.4 | 内存漂移 | MB/h | 2h 内私有字节的小时级线性增长 | 长跑测试 |
| 1.3.5 | 句柄数 / 线程数 | 个 | 反映资源是否回收 | `\Process(name)\Handle Count`、`Thread Count` |
| 1.3.6 | 启动后稳定值 | MB | 启动 60s 后第一次趋稳的内存值 | 冷启动测试 |

> 内存泄漏最常见的判断：**私有字节连续 2h 单调上涨且斜率 > 5 MB/h**。Working Set 可能因 OS 回收波动，**不能单独作为泄漏证据**。

### 1.4 帧率与游戏影响指标（覆盖层场景）

| 编号 | 指标 | 单位 | 定义 | 评判含义 |
|----|----|----|----|----|
| 1.4.1 | 游戏平均 FPS | fps | 宿主游戏的平均帧率 | 总体流畅度 |
| 1.4.2 | 1% Low FPS | fps | 最差 1% 帧的平均帧率 | 反映"卡顿瞬间"的真实体验 |
| 1.4.3 | 0.1% Low FPS | fps | 最差 0.1% 帧的平均帧率 | 极端卡顿（hitching）信号 |
| 1.4.4 | 帧时间 P99 | ms | 99 分位帧时间 | 越接近平均越流畅 |
| 1.4.5 | FPS 下降率 | % | (基线 FPS - 开启桌宠后 FPS) / 基线 FPS | 桌宠对游戏的"伤害值" |
| 1.4.6 | 输入延迟变化 | ms | 桌宠开启前后 Click-to-Photon 延迟差 | 竞技场景关键指标 |

> 行业共识：**1% Low 越接近平均 FPS，体验越平滑**；只看平均 FPS 会掩盖 stutter。Afterburner + RTSS 是免费且额外开销 < 1% 的测试组合。

### 1.5 能耗 / 体验 / 合规指标

| 编号 | 指标 | 单位 | 定义 | 采集源 |
|----|----|----|----|----|
| 1.5.1 | CPU 包功耗 | W | CPU 整体功耗 | HWiNFO / Intel PTU / Ryzen Master |
| 1.5.2 | GPU 功耗 | W | 独显功耗 | HWiNFO / GPU-Z |
| 1.5.3 | 电池放电速率 | W 或 mWh/min | 笔记本拔电状态下电池消耗速度 | Windows `powercfg /batteryreport` |
| 1.5.4 | 风扇转速 / 温度 | RPM / °C | CPU / GPU 温度与风扇噪音 | HWiNFO |
| 1.5.5 | 网络上下行 | KB/s | 桌宠是否常驻联网 | Resource Monitor / Wireshark |
| 1.5.6 | 麦克风 / 屏幕 / 文件访问 | 事件 | 是否申请高敏感权限 | Windows 隐私指示器 / Process Monitor |
| 1.5.7 | 输入冲突 | 次 | 桌宠是否抢键鼠 / 焦点 | 人工录屏 + 计数 |

---

## 2. 评判标准（性能预算分级）

### 2.1 桌宠模式分级

按"功能强度"把桌宠分 5 级，每级有不同预算：

| 编号 | 模式 | 典型功能 | 代表产品 |
|----|----|----|----|
| 2.1.A | A 级 — 超轻量 2D | 2D sprite、有限动画、无 AI、无音频 | VPet-Simulator |
| 2.1.B | B 级 — Live2D / 3D 静态 | Live2D 或 3D 角色、点击交互、无 AI | Desktop Mate（基础） |
| 2.1.C | C 级 — 远程 AI 文本 | 角色 + 云端 LLM 聊天 + 可选 TTS | Ai Vpet（云模式） |
| 2.1.D | D 级 — 语音 / 多模态 | ASR + LLM + TTS + 口型同步 | Open LLM Vtuber |
| 2.1.E | E 级 — 本地 AI / 屏幕感知 | 本地 LLM 推理、屏幕截图理解、视觉模型 | CielChan、Clawster |

### 2.2 每级性能预算（推荐评判阈值）

> 以"中低配 Windows 笔记本（i5 / 16GB / 集显）+ 主流网游"为基准。三色门槛：✅ 良好 / ⚠️ 警戒 / ❌ 不可接受。

| 编号 | 模式 | CPU 平均 | CPU P95 | GPU 平均 | 内存 | 游戏 FPS 下降 | 1% Low 下降 |
|----|----|----|----|----|----|----|----|
| 2.2.A | A 级 | ✅ ≤ 1% / ⚠️ 1-3% / ❌ > 3% | ≤ 3% / 3-5% / > 5% | ≤ 2% / 2-5% / > 5% | ≤ 250MB / 250-400MB / > 400MB | ≤ 1% / 1-3% / > 3% | ≤ 2% / 2-5% / > 5% |
| 2.2.B | B 级 | ≤ 2% / 2-5% / > 5% | ≤ 5% / 5-10% / > 10% | ≤ 5% / 5-10% / > 10% | ≤ 400MB / 400-600MB / > 600MB | ≤ 2% / 2-5% / > 5% | ≤ 3% / 3-7% / > 7% |
| 2.2.C | C 级 | ≤ 3% / 3-8% / > 8% | ≤ 8% / 8-15% / > 15% | ≤ 5% / 5-10% / > 10% | ≤ 600MB / 600-900MB / > 900MB | ≤ 3% / 3-7% / > 7% | ≤ 5% / 5-10% / > 10% |
| 2.2.D | D 级 | ≤ 8% / 8-15% / > 15% | ≤ 20% / 20-35% / > 35% | ≤ 8% / 8-15% / > 15% | ≤ 1.0GB / 1.0-1.5GB / > 1.5GB | 不应在游戏中默认开启 | 不应在游戏中默认开启 |
| 2.2.E | E 级 | 单独高资源模式 | 单独高资源模式 | 单独高资源模式 | 视模型而定 | 默认与竞技游戏不兼容 | 默认与竞技游戏不兼容 |

### 2.3 红线（任意一项即判定失败）

1. 启动 60s 后空闲 CPU 仍 > 10%（A/B 级）。
2. 私有字节 2h 漂移 > 50 MB（任意级别）。
3. 全屏游戏覆盖层场景中 1% Low 下降 > 15%（A/B/C 级）。
4. 拔电状态下电池放电速率提升 > 30%（笔记本）。
5. 默认安装即申请麦克风 / 屏幕 / 摄像头权限（任意级别），且无显式开关。
6. 长时稳定性测试出现崩溃 / 句柄数 > 10000 / 线程数 > 200。

---

## 3. 测试环境矩阵

### 3.1 必须覆盖的硬件档位

| 编号 | 档位 | 配置示例 | 用途 |
|----|----|----|----|
| 3.1.1 | 低配集显 | i3-1215U / 8GB / Iris Xe / Win11 | 验证最低门槛、检测 GPU 共享内存压力 |
| 3.1.2 | 主流办公 | i5-1340P / 16GB / Iris Xe / Win11 | Steam 玩家"中位机型"基线 |
| 3.1.3 | 主流游戏台式机 | i5-12400 / 16GB / RTX 3060 / Win11 | 全屏游戏覆盖层主测台 |
| 3.1.4 | 高配独显 | i7-13700K / 32GB / RTX 4070 / Win11 | 上限验证，区分功能瓶颈 vs 硬件瓶颈 |
| 3.1.5 | 笔记本拔电 | 任一笔记本 + 拔电 + 平衡模式 | 能耗 / 发热验证 |

### 3.2 软件基线

1. Windows 11 / Windows 10 22H2，全部更新。
2. 关闭：杀毒实时扫描（除 Defender 默认）、自动更新、其他后台游戏 / 桌面应用。
3. 显卡驱动：NVIDIA / AMD 最新 WHQL；记录版本号。
4. 电源计划：台式机 → 高性能；笔记本 → 平衡（贴近真实玩家）。
5. 显示器刷新率：60 Hz 与 144 Hz 各测一次（影响动画帧预算）。

### 3.3 干净基线（Clean Baseline）

> 任何性能测试在记录"开桌宠后"的数字前，必须先记录"未开桌宠"的同场景基线。无基线 = 无可比性。

```
基线流程：
1. 重启电脑，等 5 min（让系统进入稳态）
2. 启动游戏 / 浏览器 / 测试场景
3. 录 10 min 基线
4. 启动桌宠，再录 10 min 对照
5. 关闭桌宠，再录 5 min 验证恢复
```

---

## 4. 测试场景设计

### 4.1 必测 8 大场景

| 编号 | 场景 | 时长 | 关注指标 | 备注 |
|----|----|----|----|----|
| 4.1.1 | 冷启动 | 60s | 启动耗时、峰值 CPU / 内存、磁盘 IO、网络突发 | 包括首次启动（含资源解压）和二次启动 |
| 4.1.2 | 可见空闲 | 10 min | CPU 平均 / P95、GPU 平均、内存平台期 | 桌宠可见，不交互 |
| 4.1.3 | 隐藏 / 最小化空闲 | 10 min | 后台 CPU、保留内存、托盘进程 | 验证"假隐藏"是否真省资源 |
| 4.1.4 | 交互突发 | 5 min 脚本 | 动画 CPU / GPU 突发、输入延迟 | 拖拽 / 点击 / 喂食 / 触发动作 |
| 4.1.5 | AI 文本聊天 | 10 条 prompt | CPU / 内存 / 网络、首字延迟、UI 卡顿 | 仅 C/D/E 级 |
| 4.1.6 | 语音 / 多模态 | 5 min | CPU、内存、音频设备占用、TTS / ASR 延迟 | 仅 D/E 级 |
| 4.1.7 | 全屏游戏覆盖层 | 15 min | 游戏 FPS / 1% Low / 帧时间、GPU 引擎、VRAM、输入冲突 | 必测；用主流游戏 |
| 4.1.8 | 长时稳定性 | 2h | 内存漂移、CPU 漂移、句柄 / 线程增长、崩溃恢复 | 必测；最易暴露泄漏 |

### 4.2 推荐"覆盖层"游戏样本

1. **轻负载**：CS2 创意工坊地图、原神 60 FPS 限制 — 用于检测 overlay overhead 本身。
2. **中负载**：APEX、PUBG — 用于检测 GPU 抢占和帧时间影响。
3. **重负载**：Cyberpunk 2077 + 光追 — 用于检测显存 / 共享内存压力。
4. **竞技高 FPS**：Valorant 240 FPS — 用于检测高 FPS 下桌宠是否拖慢上限。

### 4.3 场景脚本化原则

1. 所有交互（拖拽 / 点击 / 输入文本）尽量用 AutoHotkey / Python `pyautogui` 录制，**保证可重放**。
2. AI 聊天用固定 prompt 集（建议 10 条 + 5 条长文本）。
3. 每个场景至少跑 3 次取均值；剔除离群最大 / 最小一次。
4. 场景之间留 60s 冷却（让 OS 回收）。

---

## 5. 工具链（Steam / Windows 桌宠优先）

### 5.1 推荐组合（按职责分层）

| 编号 | 层级 | 工具 | 用途 | 是否免费 |
|----|----|----|----|----|
| 5.1.1 | 系统级采样 | Windows `typeperf` | CPU / GPU / 内存 / 句柄 / 线程的进程级长期采样，CSV 输出 | 是 |
| 5.1.2 | 系统级图形 | Performance Monitor (perfmon) | 上述计数器的可视化与回放 | 是 |
| 5.1.3 | 进程级 | Process Explorer (Sysinternals) | 进程树、句柄、线程、GPU 显存、单核占用 | 是 |
| 5.1.4 | 进程级深度 | Process Monitor (Sysinternals) | 文件 / 注册表 / 网络访问审计 | 是 |
| 5.1.5 | 帧率 / 帧时间 | **Intel PresentMon 2.x** | FPS、Frametime、GPU Busy、CPU Busy、延迟、Display Latency；Steam 桌宠测试首选 | 是 |
| 5.1.6 | 帧率 / overlay | MSI Afterburner + RivaTuner Statistics Server | 1% Low / 0.1% Low、帧时间曲线、低开销 overlay | 是 |
| 5.1.7 | NVIDIA 专用 | NVIDIA FrameView | NVIDIA 卡上的 PCAT 兼容采样 | 是 |
| 5.1.8 | AMD 专用 | AMD Radeon Overlay / OCAT | AMD 卡上的帧时间与 overlay 影响 | 是 |
| 5.1.9 | 综合监控 | HWiNFO（已集成 PresentMon） | 一站式 CPU/GPU/温度/功耗/帧率，长时记录 | 是 |
| 5.1.10 | Steam 自带 | Steam 性能监视器（2024+） | 游戏内 FPS / CPU / GPU / 显存 overlay，零配置 | 是 |
| 5.1.11 | 内核级追踪 | Windows Performance Toolkit (WPR + WPA) | ETW 级别全栈分析，定位卡顿根因 | 是 |
| 5.1.12 | 内存泄漏 | VMMap / RAMMap (Sysinternals) | 私有字节细分、堆 / 栈 / 共享 | 是 |
| 5.1.13 | 网络 | Resource Monitor / Wireshark | 桌宠常驻流量与对端 | 是 |
| 5.1.14 | 笔记本能耗 | `powercfg /batteryreport` + HWiNFO | 电池放电、CPU 包功耗 | 是 |

### 5.2 工具选型矩阵

| 编号 | 测试需求 | 首选工具 | 备选 |
|----|----|----|----|
| 5.2.1 | 长时间无人值守 CPU/内存采样 | typeperf + CSV | Performance Monitor |
| 5.2.2 | 游戏内 FPS / 1% Low | MSI Afterburner + RTSS | Steam 性能监视器、PresentMon |
| 5.2.3 | 区分 CPU / GPU 瓶颈 | PresentMon GPU Busy | HWiNFO |
| 5.2.4 | overlay 自身开销验证 | RTSS（最低开销）+ 对照基线 | OCAT |
| 5.2.5 | 内存泄漏定位 | VMMap + WPA | Process Explorer 长时观察 |
| 5.2.6 | 隐性权限 / 文件访问 | Process Monitor + Windows 隐私指示器 | Wireshark |
| 5.2.7 | 笔记本拔电能耗 | powercfg + HWiNFO | Intel PTU |

### 5.3 采集频率建议

1. CPU / 内存 / GPU 计数器：**1 Hz（每秒一次）**，平衡精度与文件大小。
2. 帧时间：**逐帧（PresentMon / RTSS 默认）**，必须不下采样。
3. 能耗 / 温度：**1 Hz**。
4. 单次场景采样总时长：**≥ 600 s**（短于此样本不足，P95 不可信）。

---

## 6. 标准化测试流程（按步骤）

### 6.1 准备阶段

1. 在测试机建立干净 Windows 镜像（或快照），命名 `desktop-pet-bench-baseline-YYYYMMDD`。
2. 安装工具链：PresentMon、HWiNFO、Process Explorer、MSI Afterburner + RTSS、AutoHotkey。
3. 关闭 Windows 自动更新、Xbox Game Bar 默认 overlay、其他第三方 overlay。
4. 创建一次性 Steam 账号 / 一次性 AI 提供方 Key（**禁止使用真实账号**）。
5. 记录基线信息：CPU 型号、GPU 驱动版本、Windows Build、显示器刷新率。

### 6.2 基线采集

1. 重启电脑，等 5 min 稳态。
2. **不启动桌宠**，按场景 4.1.1–4.1.7 顺序各跑一遍，记录"无桌宠"对照数据。
3. 把基线 CSV 命名为 `baseline_<scenario>_<machine>.csv`。

### 6.3 单产品测试

> 每个产品（如 Desktop Mate）独立完整跑一轮以下流程。

1. **冷启动测试** — `typeperf` 启动后再启动桌宠，60s 后停止；记录启动时长。
2. **空闲 10 min** — 桌宠可见、鼠标不在桌宠上、不触发动作。
3. **隐藏 10 min** — 调用桌宠的 hide / 最小化功能。
4. **交互 5 min** — 用 AutoHotkey 脚本固定触发：拖拽 → 点击 → 触发动作 → 喂食。
5. **AI 文本 10 条** — 仅 C/D/E 级。
6. **语音 5 min** — 仅 D/E 级。
7. **全屏游戏覆盖层 15 min** — 用同一段录制好的游戏路径（如 CS2 跑图）。
8. **长时稳定 2h** — 默认场景循环。

### 6.4 数据处理

1. 把所有 CSV 汇总到 `PERFORMANCE_BENCHMARK_TEMPLATE_desktop-pet-products.csv`。
2. 用 Python / Excel 计算：均值、P95、峰值、漂移率、FPS 下降百分比、1% Low 下降百分比。
3. 与第 2 节"评判标准"对比，输出 ✅ / ⚠️ / ❌ 评级。
4. 标注置信度：高（≥ 3 次重复且偏差 < 10%）/ 中（2 次或偏差 10-30%）/ 低（1 次或偏差 > 30%）。

### 6.5 报告输出

1. 每个产品 1 张评分卡（Scorecard），字段：模式分级、各指标评级、红线触发、备注。
2. 跨产品 1 张横向对比表。
3. 关键问题清单（性能、隐私、稳定性、合规）。
4. 给 PM 的"是否可作为 MVP 性能参照"结论。

---

## 7. 统计学约束（避免数据骗自己）

### 7.1 必须遵守的 7 条规则

1. **任何指标至少跑 3 次取均值**；偏差 > 30% 的样本要重测。
2. **平均值不可单独使用**，必须配 P95 + 峰值；游戏场景必须配 1% Low。
3. **基线必须同机同时段采集**；昨天的基线对今天的产品无效（驱动 / 后台进程会变）。
4. **对照样本要等价**：测桌宠 A 用 CS2 跑图 X，那测桌宠 B 也要用 CS2 跑图 X，不可换图。
5. **禁止在采样过程中切换前台窗口**（除非脚本要求）；否则 GPU 计数器会被污染。
6. **第一次启动 vs 二次启动**要分别记录；很多桌宠首次启动会解压资源 / 下载模型。
7. **避免幸存者偏差**：测试机型如果只有高配，结论会过度乐观。3.1 的低配机不可省。

### 7.2 常见错误与对策

| 编号 | 错误 | 对策 |
|----|----|----|
| 7.2.1 | 只看任务管理器读数 | 任务管理器采样频率不固定；改用 typeperf / PresentMon |
| 7.2.2 | overlay 自身吃性能但没扣除 | 先量 RTSS / Steam overlay 自身开销，作为常量扣除 |
| 7.2.3 | 把"驱动占用"算到桌宠头上 | 用 PresentMon GPU Busy 区分 |
| 7.2.4 | 用 5 分钟样本做 P95 判断 | 至少 10 分钟；长时 2 小时 |
| 7.2.5 | 只在台式机测，得出"低开销"结论 | 笔记本拔电场景必须独立测 |
| 7.2.6 | 忽略 Windows DWM / WindowServer 的合成开销 | 用 WPA 看 dwm.exe 的 CPU/GPU 是否被桌宠拉高 |

---

## 8. 风险与边界

### 8.1 测试本身的风险

1. 桌宠可能请求屏幕 / 麦克风 / 辅助功能权限 → **必须用一次性账号 + 测试机 / VM**，禁用真实凭据。
2. AI 桌宠可能上传截图到云端 → **必须先用 Wireshark 审计目的端**，确认目的地后再决定是否继续。
3. 安装包可能携带广告 SDK / 托盘自启动 → **测完必须用 Autoruns 清理并恢复快照**。
4. Steam 创意工坊模组 / 第三方 mod → **不纳入默认基准**，作为单独 P2 边界测试。

### 8.2 方法论本身的局限

1. 公开来源**没有运行时数据**；所有产品的实测必须自行采样，否则只能停留在"系统要求"层面。
2. iOS / 移动端深度插桩受限；Windows 桌宠测试结论**不可外推**到移动 AI 伴侣。
3. AI 提供方路径会改变曲线（云 vs 本地），同一产品不同模式必须**分别建预算**。
4. 不同显卡驱动会让 GPU 计数器口径变化，**跨 GPU 厂商对比要标注驱动版本**。

---

## 9. 推荐下一步（接 Engineering Build Thread）

| 编号 | 行动 | 负责线程 | 优先级 | 输入 |
|----|----|----|----|----|
| 9.1 | 用本方法论改造 `PERFORMANCE_BENCHMARK_TEMPLATE_desktop-pet-products.csv` 的列结构 | AI Trend Radar | P0 | 本文件 + 现有模板 |
| 9.2 | 申请 1 台中低配 Windows 笔记本 + 1 台游戏台式机作为测试基线 | PM + Engineering | P0 | 预算审批 |
| 9.3 | 跑 P0 产品（VPet-Simulator、Desktop Mate、Ai Vpet）3 次完整流程 | Engineering Build | P0 | 测试机就绪 + 一次性账号 |
| 9.4 | 用 PresentMon + RTSS 验证 desktop-pet 自身原型在游戏覆盖场景的 FPS 损害 | Engineering Build | P0 | desktop-pet 原型 |
| 9.5 | 把 2.2 的预算阈值写入 PRD / SRS 的"性能验收标准" | PM Strategy | P0 | 本文件 + 客户场景 |
| 9.6 | 将"性能预算"作为开发者 SDK 的接入契约 | Engineering Build | P1 | 接入方需求 |

---

## 10. 关键参考来源

1. [Intel PresentMon 官方文档](https://github.com/GameTechDev/PresentMon) — GPU Busy、Frametime、CPU Busy 指标定义。
2. [Intel PresentMon 使用指南（TechSpot）](https://www.techspot.com/article/2723-intel-presentmon/) — Steam / 桌面应用场景示例。
3. [HWiNFO 集成 PresentMon 公告](https://videocardz.com/newz/hwinfo-7-63-integrates-presentmon-adds-framerate-frametime-and-gpu-busy-metrics) — 一站式监控方案。
4. [NVIDIA FrameView 用户指南](https://images.nvidia.com/content/geforce/technologies/frameview/frameview-1-4-user-guide-web-version.pdf) — N 卡平台帧率与功耗采集。
5. [Microsoft typeperf 文档](https://learn.microsoft.com/en-ie/windows-server/administration/windows-commands/typeperf) — Windows 进程级计数器命令行采样。
6. [Microsoft DirectX GPU 任务管理器](https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/) — GPU Engine / 显存计数器原理。
7. [Microsoft Windows 性能排查](https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-performance-problems-in-windows) — Performance Monitor 使用。
8. [Steam 性能监视器评测（XDA）](https://www.xda-developers.com/steams-new-performance-monitor-worth-using/) — Steam 自带 overlay 的可用性与开销。
9. [1% Low / Frame Time 行业说明（Overclock.net）](https://www.overclock.net/threads/recording-of-the-average-and-1-low-fps-in-games.1798204/) — 1% Low / 0.1% Low 计算口径。
10. [Steam Overlay FPS Counter 性能影响讨论（Vulkan 例）](https://steamcommunity.com/groups/SteamClientBeta/discussions/0/1862741954438850481/) — overlay 自身开销的真实案例。
11. 项目内：[`PERFORMANCE_RESEARCH_desktop-pet-products.md`](./PERFORMANCE_RESEARCH_desktop-pet-products.md) — 竞品矩阵与系统要求。
12. 项目内：[`PERFORMANCE_METRICS_BEGINNER_GUIDE.md`](./PERFORMANCE_METRICS_BEGINNER_GUIDE.md) — 指标小白学习文档（与本文件互补）。

---

## 11. Open Questions（待 PM / Engineering 确认）

1. desktop-pet MVP 是否承诺"游戏覆盖场景下 1% Low 损害 ≤ 3%"？
2. AI 模式是否默认关闭，由用户主动开启？
3. 测试机预算与采购周期？是否使用 Tencent IEG 内部测试机房？
4. 是否需要在 Steam 上线前做第三方独立性能评测（如 GamersNexus 风格）？
5. 隐私 / 权限红线由谁审签（法务 / 安全 / PM）？
