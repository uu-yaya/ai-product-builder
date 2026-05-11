# Project Links — Source Pool

集中维护本项目的信源池与外部链接。所有 URL 仅为**已知主页**入口；具体 RSS / 子频道 / 邮件列表 / Reddit subreddit / YouTube 频道 / X List 在首次使用前由 AI Trend Radar Thread 在本表追加。

## 1. 三大主题映射

| Theme | 主信源（按优先级） |
|---|---|
| AI Agent | OpenAI、Anthropic、Google DeepMind、Microsoft、Hugging Face、GitHub repos、arXiv、Reddit、X/Twitter、机器之心 / 量子位（辅助） |
| AI Coding | OpenAI、Anthropic、GitHub Trending、Microsoft、Hugging Face、The Decoder、VentureBeat、Reddit、X/Twitter、机器之心 / 量子位（辅助） |
| Game AI | Meta AI、NVIDIA、Google DeepMind、GitHub repos、arXiv、Papers with Code、YouTube、Reddit、机器之心（辅助） |
| 横向（AIGC / Tooling / 风险监测） | Stanford AI Index、OECD AI Incidents Monitor、MIT Technology Review、TechCrunch、PaperWeekly（辅助） |

## 2. 信源池（19 个）

### 2.1 Lab / Vendor 官方（一级信源，优先采信）

| Name | Type | URL | Notes |
|---|---|---|---|
| OpenAI | Vendor blog | https://openai.com/news | 模型 / Agent / API 发布 |
| Anthropic | Vendor blog | https://www.anthropic.com/news | 模型 / Claude / 安全研究 |
| Google DeepMind | Lab blog | https://deepmind.google/discover/blog/ | Gemini / 研究论文 |
| Meta AI | Lab blog | https://ai.meta.com/blog/ | Llama / 多模态 / 游戏 AI 研究 |
| Microsoft (AI) | Vendor blog | https://blogs.microsoft.com/ai/ | Copilot / Azure AI / GitHub Copilot |
| NVIDIA | Vendor blog | https://blogs.nvidia.com/ | GPU / Omniverse / 游戏 AI / NIM |
| Hugging Face | Community / Tools | https://huggingface.co/blog | 开源模型、Spaces、工具链 |

### 2.2 代码 / 开源（二级信源，事实导向）

| Name | Type | URL | Notes |
|---|---|---|---|
| GitHub Trending | Aggregator | https://github.com/trending | 看 daily / weekly trending，过滤 AI 相关 |
| GitHub repos | Aggregator | https://github.com/ | 具体仓库 release / discussion，逐条按主题加 |

### 2.3 科技媒体（二级信源，需交叉验证）

| Name | Type | URL | Notes |
|---|---|---|---|
| The Decoder | Tech media | https://the-decoder.com/ | AI 行业聚合 |
| MIT Technology Review | Tech media | https://www.technologyreview.com/ | 深度报道、长线趋势 |
| VentureBeat | Tech media | https://venturebeat.com/category/ai/ | AI 商业化 / 融资 |
| TechCrunch | Tech media | https://techcrunch.com/category/artificial-intelligence/ | 产品发布 / 创业动态 |

### 2.4 社区 / 信号（三级信源，仅作信号，不作事实）

不预先固定具体频道 / subreddit / List。每期由 AI Trend Radar Thread 按主题临时检索；**只有当某个具体源连续 2–3 期持续提供价值时**，才升级写入本表作为固定池。

| Name | Type | URL | Notes |
|---|---|---|---|
| YouTube | Video | https://www.youtube.com/ | 临时检索；具体频道暂不固定 |
| Reddit | Forum | https://www.reddit.com/ | 临时检索；具体 subreddit 暂不固定 |
| X/Twitter | Social | https://x.com/ | 临时检索；具体 List 暂不固定 |

#### 临时检索规则

- 三级信源**只**作为线索发现，不作为事实依据。
- 任何重要结论必须回查官方公告 / 论文 / GitHub repo / 可信媒体后再写入"事实"段。
- 当某个频道 / subreddit / List 连续 2–3 期都有价值时，由 Radar Thread 提议升级为固定池，并在 `decisions/DECISION_LOG.md` 留痕。

### 2.5 学术 / 数据（一级事实信源）

| Name | Type | URL | Notes |
|---|---|---|---|
| arXiv | Preprint | https://arxiv.org/list/cs.AI/recent | cs.AI / cs.CL / cs.LG / cs.SE 滚动浏览 |
| Papers with Code | Aggregator | https://paperswithcode.com/ | 跟踪 SOTA、复现进度 |
| Stanford AI Index | Research index | https://aiindex.stanford.edu/ | 年度 / 季度宏观指标 |

### 2.6 风险 / 安全监测

| Name | Type | URL | Notes |
|---|---|---|---|
| OECD AI Incidents Monitor | Risk DB | https://oecd.ai/en/incidents | AI 事故 / 偏见 / 安全事件库 |

### 2.7 中文辅助观察源（二级 / 三级，不作为一级事实）

| Name | Type | URL | Notes |
|---|---|---|---|
| 机器之心 | Tech media (CN) | https://www.jiqizhixin.com/ | 国内 AI 趋势 / 模型 / 创业动态 |
| 量子位 | Tech media (CN) | https://www.qbitai.com/ | 国内 AI 行业报道 / 产品发布 |
| PaperWeekly | Academic / Community (CN) | https://www.paperweekly.site/ | 论文导读、学术圈讨论 |

#### 中文源使用规则

- 中文媒体用于发现**国内趋势、中文语境、行业讨论**；不替代英文一手来源。
- 关键事实仍需回查官方公告 / 论文 / GitHub repo / 产品文档 / 英文一手来源。
- 中文源**独家报道**（无官方或多源验证）时，Confidence 标 **中 / 低**，不得标高。
- 出现官方或多源（≥1 个英文一级源）验证后，可按对应 Confidence 等级处理。

## 3. 使用规则

- 一级信源（Lab / Vendor / arXiv / Papers with Code / Stanford / OECD）的内容可直接作为事实引用。
- 二级信源（媒体）需与一级信源交叉验证后再写入"事实"段；否则归为"观点 / 报道"。
- 三级信源（YouTube / Reddit / X）仅作为**线索发现**，不能作为事实，必须回到一级信源验证。
- URL 失效或被替换时，新增一行并把旧条目标记为 `Deprecated`，不要直接覆盖。
- 不写入需要鉴权 / 付费墙的内容。
- 不写入真实 token / API key / 个人 cookie。

## 4. 待补充事项

- [ ] GitHub repos：每主题各列 5–10 个长期跟踪仓库（首期执行期间逐步累积，连续命中再固化）。
- [ ] 三级信源（YouTube / Reddit / X）：每期 Radar Thread 临时检索；连续 2–3 期有价值再固化到 §2.4。

（已关闭：中文一级信源问题 — 决议为不设一级，仅作二级 / 三级辅助源，详见 §2.7。）

## 5. 维护规则

- 不写入真实 token、API key、secret。
- 不写入未脱敏的内部链接。
- 链接失效或被替换时，不要直接覆盖旧条目；新增一行并把旧条目标记为 `Deprecated`。
