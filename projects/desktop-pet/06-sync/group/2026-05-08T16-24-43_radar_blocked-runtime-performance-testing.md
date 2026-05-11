# 运行时性能实测阻塞

线程：radar

任务 ID：n/a

状态：阻塞

阻塞类型：安全 / 隐私 / 凭据风险 + 缺少必要输入

发生了什么：

- 用户要求 AI Trend Radar Thread 调研桌宠产品，并测试每个产品在 PC 和移动端的运行时 CPU / GPU / 内存占用。
- 我已完成公开来源调研，并检查本地运行时实测条件。
- 本机 `/Applications` 扫描未发现目标桌宠样本已安装。
- 本机未安装 `adb`，因此无法进行 Android 应用性能分析。
- `xcrun xctrace list devices` 执行失败，因为 `xctrace` 不在 PATH / developer tools 中，因此无法进行 iOS 性能分析。
- 我没有下载、安装、启动任何第三方桌宠或移动端伴侣应用，也没有授予相关权限。

为什么停止：

- 运行第三方桌宠可能请求麦克风、屏幕录制、辅助功能、本地文件、网络和 AI 提供方凭据。
- 移动端测试需要真实设备或模拟器、性能分析工具、包标识符，通常还需要一次性账号。
- 在没有安装产品和测试设备的情况下继续，会产生伪造的 CPU / GPU / 内存数字。

已创建 / 未创建文件：

- 已创建：`projects/desktop-pet/04-research/PERFORMANCE_RESEARCH_desktop-pet-products.md`
- 已创建：`projects/desktop-pet/04-research/PERFORMANCE_BENCHMARK_TEMPLATE_desktop-pet-products.csv`
- 未创建：包含每个产品 CPU / GPU / 内存实测数据的原始基准测试 CSV / XLSX。
- 未创建：已安装应用测试日志、移动端 `dumpsys` 日志、iOS Instruments 跟踪文件。

给 Main Thread 的选项：

1. 请求用户批准 P0 样本列表，并允许在测试机上受控下载 / 安装 / 启动这些应用。
2. 请求用户提供基准测试设备：Windows PC、Mac、已配置 `adb` 的 Android 手机、已配置 Xcode / Instruments 的 iPhone。
3. 当前范围保持为公开来源性能调研，运行时实测延后。
4. Radar 完成测试矩阵和评分规则后，将真实基准测试执行交给 Engineering Build Thread。

建议下一步：

请求用户确认 P0 样本列表，并授权使用一次性账号、无真实密钥的受控基准测试。这是最安全路径，因为性能数字必须来自真实运行时测量，而这些应用可能请求敏感桌面 / 移动端权限。

是否需要用户输入：

是。所需输入：批准的产品样本列表、批准的设备 / OS、是否允许安装 / 运行第三方应用，以及确认不会使用真实公司 / 玩家数据或真实 API 密钥。
