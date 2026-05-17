# DESIGN

prd-to-canvas skill 会读这份文件，把里面的 token 覆盖 md-canvas 默认 CSS variables。
没列的保持默认。整张文件就是几张表格 + 一些说明，规则：

- 表格里 token 列以 `--` 开头的会被 skill 读取
- 任何不以 `--` 开头的行（说明文字、表头、其他章节）会被忽略
- 值必须是合法的 CSS 值（颜色用 `#rrggbb` 或 `rgb(...)` 或具名色；字体用 `"字体名"` 或 stack）

把这份文件放在：

- PRD 同目录 → 只对这一份 PRD 生效
- 项目根 → 对整个项目所有 PRD 生效
- 用 `/prd-to-canvas xxx.md --design my-design.md` → 显式指定

下面是**完整 token 清单**（也是默认值）。直接复制改你要换的几个就行。

---

## 调色板 · 主色系

| token | 默认值 | 说明 |
| --- | --- | --- |
| --canvas | #fffaf0 | 整页背景（暖奶油） |
| --ink | #1a1a1a | 主文字 |
| --on-dark | #f5f5f5 | 深色背景之上的文字 |
| --muted | #6a6a6a | 弱文字 |
| --muted-soft | #9a9a9a | 更弱的辅助文字 |
| --hairline | #e5dcc4 | 边框细线 |

## 调色板 · 强调与功能

| token | 默认值 | 说明 |
| --- | --- | --- |
| --primary | #5d9b4f | 主强调色（按钮、链接、激活态） |
| --primary-active | #4a7e3f | 主强调色按下 |
| --on-primary | #ffffff | 主强调色之上的文字 |
| --accent | #b86d3c | 次强调色 |
| --warning | #d4a017 | 警告（callout-warning / 表单提示） |
| --error | #c64545 | 错误（callout-caution / fetch 失败） |

## 调色板 · 面与卡片

| token | 默认值 | 说明 |
| --- | --- | --- |
| --surface-soft | #faf3e0 | 弱面（callout 背景、辅助区） |
| --surface-card | #ffffff | 卡片（Agent/Prompt 块顶层） |

## 字体

| token | 默认值 | 说明 |
| --- | --- | --- |
| --font-serif | "Source Han Serif SC", Georgia, serif | 标题 |
| --font-sans | "PingFang SC", -apple-system, sans-serif | 正文 |
| --font-mono | "JetBrains Mono", "SF Mono", monospace | 代码 / 编辑器 |

## 间距

| token | 默认值 | 说明 |
| --- | --- | --- |
| --sp-sm | 8px | 小间距（块内元素） |
| --sp-md | 16px | 标准间距（块之间） |
| --sp-lg | 24px | 大间距（章节之间） |

## 圆角

| token | 默认值 | 说明 |
| --- | --- | --- |
| --r-sm | 4px | 小圆角（按钮、tag） |
| --r-md | 8px | 标准圆角（输入框、面） |
| --r-lg | 12px | 大圆角（卡片） |
| --r-xl | 16px | 模态框 |
| --r-pill | 999px | 胶囊形 |

---

## 示例：王者荣耀风（金红）

把上面的 token 改成这样就行：

| token | 值 | 说明 |
| --- | --- | --- |
| --canvas | #1a0f0a | 深底 |
| --ink | #f5e6c8 | 暖白文字 |
| --primary | #d4a017 | 王者金 |
| --primary-active | #b8860b | 金按下 |
| --on-primary | #1a0f0a | 金之上的文字 |
| --accent | #b03030 | 王者红 |
| --warning | #d4a017 | 金 |
| --error | #c64545 | 红 |
| --surface-soft | #2a1a12 | 弱面 |
| --surface-card | #3a2418 | 卡片 |
| --hairline | #5a3a24 | 边线 |
| --muted | #b8a07c | 弱文字 |

## 示例：和平精英风（黄黑）

| token | 值 | 说明 |
| --- | --- | --- |
| --canvas | #0e0e0e | 黑底 |
| --ink | #f5f5f5 | 白文字 |
| --primary | #ffd400 | 主黄 |
| --primary-active | #d4af00 | 按下 |
| --on-primary | #0e0e0e | 黄之上 |
| --accent | #ff6b00 | 橙 |
| --surface-soft | #1c1c1c | 弱面 |
| --surface-card | #2a2a2a | 卡片 |
| --hairline | #3a3a3a | 边线 |
| --muted | #888888 | 弱文字 |

## 示例：腾讯标准蓝

| token | 值 | 说明 |
| --- | --- | --- |
| --primary | #00a4ff | 腾讯蓝 |
| --primary-active | #0084cc | 按下 |
| --accent | #006fc5 | 深蓝 |

---

## 不让你改的（写了也忽略，会给警告）

- CSS 选择器 / 布局规则
- JS 行为
- 块的功能性视觉边色（接口契约块青边、Mock 绿边、Agent 灰边、Prompt 紫边等是功能语义）
- 字号 / 行高（默认做过版式平衡）
- 任何不以 `--` 开头的 CSS 属性

只让 token 替换，圈住影响范围。如果你想做超出 token 范围的定制，请直接 fork md-canvas-template.html 改 CSS，再放在自己的目录下用 `--template` 参数指定。
