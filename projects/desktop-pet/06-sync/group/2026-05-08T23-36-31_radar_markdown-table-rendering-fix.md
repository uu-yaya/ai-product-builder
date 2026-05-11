# Radar Sync: Markdown Table Rendering Fix

时间：2026-05-08T23-36-31

线程：AI Trend Radar Thread

## 变更

- 已将 `04-research/PERFORMANCE_METRICS_BEGINNER_GUIDE.md` 源文件恢复为 GFM Markdown pipe table，不再依赖 HTML 预览文件。
- 已移除 `04-research/PERFORMANCE_RESEARCH_desktop-pet-products.md` 中对 `PERFORMANCE_METRICS_BEGINNER_GUIDE.html` 的引用。
- 已更新 `PROJECT_RULES.md` 的 Markdown 渲染规则：本项目研究表格默认使用 GFM pipe table，禁止把 HTML table 写进 `.md`，编辑后用 GFM 渲染器和列数检查验证。

## 验证

- `PERFORMANCE_METRICS_BEGINNER_GUIDE.md`：41 个表格块，列数不一致 0，Pandoc GFM 可识别 41 个 table。
- `PERFORMANCE_RESEARCH_desktop-pet-products.md`：13 个表格块，列数不一致 0，Pandoc GFM 可识别 13 个 table。
- `PERFORMANCE_METRICS_BEGINNER_GUIDE.html` 已不存在。

## 后续规则

以后这类研究文档只修 `.md` 源文件本身；表格类内容使用标准 GFM pipe table，不用 HTML table，也不再为了浏览器预览额外生成 HTML 文件。
