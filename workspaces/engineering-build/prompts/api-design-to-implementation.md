# API Design to Implementation Prompt

## 1. Prompt Name

API Design to Implementation Prompt

## 2. Use Case

用于把 API 需求转成工程实现计划。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Engineering Build Partner，把下面的 API 需求转成工程实现计划。

默认中文输出。请分析请求参数、响应字段、错误码、权限规则、后端逻辑、数据依赖、前端使用方式、测试方式和兼容性风险。

请输出：
1. API Name
2. Scenario
3. Method
4. Endpoint
5. Authentication
6. Permission Rules
7. Request Parameters 表
8. Response Fields 表
9. Error Codes 表
10. Frontend Usage
11. Backend Logic
12. Data Dependencies
13. Edge Cases
14. Testing Notes
15. Backward Compatibility
16. Risks and Open Questions
17. 下一步建议

API 需求：
[粘贴 API 需求]
```

## 4. Expected Output

- API 工程实现计划
- 参数表、响应表、错误码表
- 前后端实现说明
- 测试方式和兼容性风险
