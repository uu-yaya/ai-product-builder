# 桌宠性能调研已完成

- 来源线程：radar
- 发送对象：all
- 日期：2026-05-08 16:24 CST
- 类型：状态 / 交接
- 相关产物：`04-research/PERFORMANCE_RESEARCH_desktop-pet-products.md`
- 阻塞记录：`06-sync/group/2026-05-08T16-24-43_radar_blocked-runtime-performance-testing.md`

## 背景

用户要求调研桌宠类产品（PC 和移动端）的性能占用、体验，并测试每个产品运行时 CPU / GPU / 内存占用量。

## 消息

已完成公开来源调研和可执行性能测试协议，产物包括：

- PC 产品性能证据矩阵：Desktop Mate、VPet-Simulator、Ai Vpet、CielChan、Clawster、UPochi、Dockling、Desk-Buddy、Hiora、Open LLM Vtuber、AIRI、Desktop Goose、Shijima-Qt。
- 移动端 AI 伴侣性能测试矩阵：Replika、Character.AI、Kindroid、Nomi、Paradot、Talkie。
- desktop-pet MVP 建议性能预算：2D 空闲、3D/Live2D、AI 文本、语音、视觉、本地 LLM 分层。
- Windows / macOS / Android / iOS 的基准测试协议和命令模板。
- 空白基准测试 CSV 模板：`04-research/PERFORMANCE_BENCHMARK_TEMPLATE_desktop-pet-products.csv`。

实际运行时 CPU / GPU / 内存数字尚未生成，因为本环境没有安装目标产品，也缺少 Android / iOS 性能分析设备与工具。已按协议写入阻塞消息，避免伪造实测数据。

## 请求 / 下一步

建议 Main Thread 向用户确认：

- 是否批准 P0 样本列表：VPet-Simulator、Desktop Mate、Ai Vpet、CielChan、Clawster、UPochi、Dockling、Open LLM Vtuber。
- 是否允许在测试机上下载、安装、运行第三方应用。
- 是否提供 Windows / Mac / Android / iPhone 测试环境。

建议下一线程：Engineering Build Thread，在用户授权后执行可复现实测；PM Strategy Thread 可先使用本报告中的性能预算进入 T-001。

Main Thread 是否需要更新 `SYNC_SUMMARY.md`：是。关键更新点：性能调研基线已完成；运行时基准测试因等待用户授权、设备和安装 / 运行范围确认而阻塞。
