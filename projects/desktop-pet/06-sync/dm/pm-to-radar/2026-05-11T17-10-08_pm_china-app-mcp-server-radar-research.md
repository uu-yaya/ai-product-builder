# PM → Radar: 中国流行 app 的 MCP server 公开能力调研委托

## 1. Meta

1. From：PM Strategy Thread
2. To：AI Trend Radar Thread
3. Project：`desktop-pet`
4. Branch：`memory-dataset`
5. Filed at：2026-05-11T17-10-08
6. Trigger：`01-pm/branches/memory-dataset/REQUIREMENT_CLARIFICATION_memory-dataset.md` §13.1 + 用户 2026-05-11 同意启动

## 2. 调研问题

1. 当前**中国主流 C 端娱乐 / 工作 app** 的 MCP server 公开能力清单与稳定性。
2. 覆盖目标 app（用户 2026-05-11 列出 + PM 补充）：
   1. 娱乐：Bilibili、QQ 音乐、网易云音乐、腾讯视频、爱奇艺、优酷、抖音 / 抖音桌面版。
   2. 办公：Microsoft Word / Excel / PowerPoint（中国地区可用版本）、WPS Office、腾讯文档、飞书、钉钉、企业微信。
   3. 日历 / 任务：腾讯日历、企业微信日历、滴答清单、Notion 中国可用情况、番茄 ToDo。
   4. 游戏 launcher：Steam（中国地区）、WeGame、Epic Games（中国地区）。
3. 每个 app：
   1. 是否有**官方 MCP server**？
   2. 是否有**第三方 / 开源 MCP server**？质量如何？
   3. 暴露的字段 / tool 清单（"now playing"、"current document"、"calendar next event"、"recent files" 等）。
   4. 稳定性 / 维护活跃度 / 中国地区可用性 / 是否需要鉴权。
   5. 是否有任何形式的隐私 / 内容获取边界声明。
4. 哪些 app 完全没有 MCP 但有公开 API 可桥接？哪些**根本没有暴露通道**？

## 3. 约束条件（必须遵守）

1. **不**调研逆向 / hook / 爬虫 / 私有协议方案。MCP 之外的"非公开通道"全部不在调研范围。
2. **不**调研需要付费订阅或破解才能拿到的能力。
3. **不**在报告中泄漏 token / 鉴权细节 / 内部 API 文档。
4. 一律遵循 `projects/desktop-pet/PROJECT_RULES.md` 与 `PRIVACY_BOUNDARY_memory-system.md`。
5. 中国地区可用性是硬指标：海外 MCP 但中国地区不可访问的，标注为"中国不可用"，仍可列出做参考。

## 4. 期望产出

1. 文件：`04-research/branches/memory-dataset/TREND_RESEARCH_china-app-mcp-server-capabilities.md`（如目录不存在请新建）。
2. 结构建议：
   1. 总览矩阵：app × {官方MCP / 三方MCP / 公开API / 暴露字段示例 / 稳定性 / 中国可用性 / 桌宠适配优先级}。
   2. 分组小结：娱乐组 / 办公组 / 日历任务组 / 游戏 launcher 组各自结论。
   3. PM 决策建议：哪 3-5 个 app 最适合 MVP 首批集成；理由。
   4. 风险 / 长期跟踪：MCP 生态在中国的发展节奏判断。

## 5. 信源建议（仅参考）

1. 各 app 的官方开发者文档 / 开放平台。
2. MCP 官方生态目录（`mcp.modelcontextprotocol.io` 或同类）。
3. GitHub 中文 MCP server 仓库（搜索 `mcp-server-<app名>`）。
4. 同行实践（Claude Desktop / Cursor / 国内 Agent 项目对中国 app 的接入情况）。

## 6. 时限

1. 软目标：72h 内出初稿；硬截止：1 周。
2. 阻塞或不可行时按协议 §13 写 blocker。

## 7. 不在本次调研范围

1. MCP server 的工程接入实现。
2. 任何"绕过 MCP 读 app 私有数据"的方案。
3. 商业化 / 法务条款评估。
4. UI / 视觉设计。
