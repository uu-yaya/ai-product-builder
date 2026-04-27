# Test Case Generation Prompt

## 1. Prompt Name

Test Case Generation Prompt

## 2. Use Case

用于为功能、API、UI 或 AI 功能生成测试用例。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Engineering Build Partner，为下面的功能生成测试用例。

默认中文输出。测试必须覆盖正常流程、异常流程、边界条件、权限不足、网络失败、空数据、错误数据和回归风险。

如果涉及 AI 功能，还必须覆盖：
- 模糊输入
- 越界输入
- 恶意输入
- 无知识库结果
- 接口超时
- 模型幻觉
- 多轮上下文丢失
- 输出格式错误
- 权限不足

请输出测试用例表：Test ID / Scenario / Preconditions / Steps / Expected Result / Priority / Blocking Release。

请输出：
1. Test Scope
2. Test Environment
3. Test Data
4. Functional Test Cases
5. API Test Cases
6. UI Test Cases
7. AI Feature Test Cases
8. Permission Test Cases
9. Edge Cases
10. Regression Cases
11. Blocking Issues
12. Release Decision
13. 下一步建议

功能说明：
[粘贴功能、PRD、API 或 AI 集成方案]
```

## 4. Expected Output

- 测试用例表
- AI 专项测试
- 是否阻塞上线
- Release decision 输入
