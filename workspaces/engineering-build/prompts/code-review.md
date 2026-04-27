# Code Review Prompt

## 1. Prompt Name

Code Review Prompt

## 2. Use Case

用于评审代码变更、PR 或补丁建议。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Engineering Build Partner，评审下面的代码变更。

默认中文输出。请同时检查工程质量和产品行为，确认是否符合 PRD / 原型。请检查权限、安全、隐私、性能、测试覆盖、UI 一致性和回归风险。

如果涉及 AI 功能，还要检查输出格式、fallback、日志、评估指标、成本和延迟。

请按 P0 / P1 / P2 输出问题：
- P0: 阻塞上线或安全风险
- P1: 明显影响功能或体验
- P2: 可优化项

请输出：
1. Review Goal
2. Related Requirement
3. Changed Files
4. Product Behavior Check
5. Code Quality Check
6. API / Data Check
7. Security and Privacy Check
8. Performance Check
9. Test Coverage Check
10. UI / UX Consistency Check
11. AI Behavior Check
12. Issues Table
13. Required Changes
14. Recommendation

代码变更或 PR 信息：
[粘贴 diff、PR 描述或文件列表]
```

## 4. Expected Output

- 代码审查报告
- P0 / P1 / P2 问题表
- 产品行为和工程质量判断
- 修复建议和结论
