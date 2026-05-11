# 05-reviews — 跨线程评审

## 用途

本目录存放跨线程评审、风险检查与问题反馈。任何线程发现其他线程产物的问题时，应在此目录写评审，**不要直接修改对方文件**。

## 应放什么

- Cross-workspace Reviews
- PM Review（PM 视角对设计 / 工程 / 研究的评审）
- Design Review（设计视角评审）
- Engineering Review（工程视角评审）
- Research Review（研究视角评审）
- Launch Review（上线前 Go / No-go 评估）
- Risk Review（专项风险评估，含合规、安全、内容审核、IP）

## 推荐文件命名

- `PM_REVIEW_<feature-slug>.md`
- `DESIGN_REVIEW_<feature-slug>.md`
- `ENGINEERING_REVIEW_<feature-slug>.md`
- `RESEARCH_REVIEW_<topic-slug>.md`
- `LAUNCH_REVIEW_<feature-slug>.md`
- `RISK_REVIEW_<scope-slug>.md`

## 评审写作模板

每份评审建议包含：

1. 评审目标 / 范围
2. 输入资料（链接到具体文件）
3. 检查项与发现
4. 问题清单（按 P0 / P1 / P2 标注）
5. 修复建议与负责人线程
6. Open Questions
7. 后续动作（同步到 `06-sync/group/`）

## 不应放什么

- 直接修改其他线程产物（应由所有者线程修复）。
- 通用评审清单 / 模板（属于 `workspaces/`）。
- 真实玩家数据 / 公司机密。
