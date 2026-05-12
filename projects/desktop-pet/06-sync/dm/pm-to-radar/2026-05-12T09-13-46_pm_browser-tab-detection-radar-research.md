# PM → Radar: 浏览器多 tab 检测调研委托

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-12T09-13-46
6. Trigger：`REQUIREMENT_CLARIFICATION_memory-dataset.md` v2.3.4 §4.7.4 视频类 VLM 浏览器多 tab 场景；用户 2026-05-12 同意启动

## 2. 调研问题

1. 桌面 pet 如何**合规识别浏览器当前 tab 是否为视频 app 白名单内的页面**（如 YouTube / Bilibili / 腾讯视频 / 爱奇艺 / 优酷），用于决定是否启动 VLM 视频陪看？
2. 候选方案对比：
   1. **OS UI Automation API**：
      - macOS Accessibility（`AXUIElement` 查询 Safari / Chrome 的 active tab URL / title）
      - Windows UI Automation（UIA 树查询 Edge / Chrome / Firefox 的 active tab）
      - 各浏览器在 a11y 树上暴露的字段是否包含 URL / 标题？
   2. **浏览器扩展 API**：
      - Chrome / Edge `chrome.tabs.query` 通过扩展拿当前 tab
      - Safari Web Extension API
      - Firefox WebExtensions
      - 优势：合规 / 用户授权清晰；劣势：需要安装扩展
   3. **浏览器原生集成 / 第三方 MCP**：
      - 有没有浏览器开放"当前 tab" 的官方 MCP server？
      - Arc Browser 是否提供更丰富的接口？
   4. **窗口标题文本**：window_title 是否稳定包含 app 标识？（如 "Bilibili - 第三集 - Google Chrome"）
3. **每方案的**：①能否拿到 tab URL 或域名（关键）；②是否需要用户授权 / 每次授权频次；③跨浏览器一致性；④失败模式；⑤是否会触发"读取用户浏览数据"的杀软告警。
4. **核心 PM 约束验证**：能否做到"**只识别 tab 身份（域名 / 标题），不读取页面内容**"？
5. 中国国产浏览器（360 / QQ 浏览器 / 搜狗 / Edge 国内版 / UC）的特殊情况？

## 3. 约束条件（必须遵守）

1. **不调研**注入 JavaScript 到页面 / 修改浏览器二进制 / 浏览器内存 hook 等方案。
2. **不调研**爬取页面内容 / DOM 解析 — 那是 v2.3 §4.11 Playwright 范畴，不在本次。
3. **只识别 tab 身份**（URL 域名 / 页面标题中的 app 标识），**不读取**：页面正文、用户输入、聊天内容、私信、评论、登录信息。
4. 严守 v2.3 §4.11.4 Playwright 排除项 + §4.3 UI 信息边界（不长期存跨 app 全文 UI）。
5. 不调研需要用户登录态 cookie 的方案（那是 Playwright）。
6. 一律遵循 `projects/desktop-pet/PROJECT_RULES.md`。

## 4. 期望产出

1. 文件：`04-research/branches/memory-dataset/TREND_RESEARCH_browser-tab-detection.md`。
2. 结构建议：
   1. 总览矩阵：方案 × {能拿什么 / 授权流程 / 跨浏览器 / 失败模式 / 杀软风险 / 桌宠适用度}。
   2. 各浏览器逐项支持情况：Chrome / Edge / Safari / Firefox / Arc / 国产 4-5 款。
   3. macOS vs Windows 差异。
   4. PM 推荐方案：MVP 首选哪种 / 备选哪种 / 哪种不推荐。
   5. 用户授权流程建议（一次授权 vs 每次提示）。
   6. 与 v2.3.4 §4.7.4 视频类 VLM 依赖链的对接说明。
   7. 事实 / 观点 / 推测分层标注。

## 5. 信源建议（仅参考）

1. Apple Developer（Accessibility API）。
2. Microsoft Learn（UIA）。
3. Chrome / Edge / Safari / Firefox 扩展开发文档。
4. 同行实测：开源工具如 ActivityWatch / RescueTime 怎么识别浏览器 tab。
5. 杀软文档：哪些浏览器交互行为会被标记。
6. 中文社区对国产浏览器扩展支持的实测。

## 6. 时限

1. 软目标：72h；硬截止：1 周。
2. 阻塞或不可行时按协议 §13 写 blocker。

## 7. 不在本次调研范围

1. 抓取页面内容（属 Playwright 范畴）。
2. JS 注入 / 二进制 hook / 内存 hook。
3. 浏览器扩展的具体实现代码。
4. 用户登录态管理（属 Playwright）。
5. UI / 视觉。
6. 与 v2.3 §4.11 Playwright 重叠的能力（如有重叠，明确指出由哪份调研负责）。
