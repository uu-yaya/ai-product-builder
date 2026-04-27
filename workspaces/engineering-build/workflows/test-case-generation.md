# Test Case Generation Workflow

## 1. Purpose

Generate test cases that validate product behavior, engineering correctness, AI behavior, and release readiness.

## 2. When to Use

Use after requirements, API behavior, UI behavior, or AI integration plans are clear enough to test.

## 3. Inputs

- PRD or acceptance criteria
- API implementation plan
- Design handoff or UI behavior
- AI integration plan
- Existing regression risks
- Release criteria

## 4. Steps

1. Define test scope and environment.
2. Create functional tests for normal and abnormal flows.
3. Create API tests for request, response, errors, permissions, and compatibility.
4. Create UI tests for states, interactions, responsiveness, and accessibility basics.
5. Create permission, edge, network failure, empty data, wrong data, and regression tests.
6. Create AI-specific tests for vague input, out-of-scope input, malicious input, no knowledge base result, timeout, hallucination, multi-turn context loss, output format error, and permission denial.
7. Mark priority and whether each case blocks release.

## 5. Outputs

- Test scope
- Test data
- Test case table
- AI feature test cases
- Regression cases
- Blocking issues
- Release decision input

## 6. Quality Checklist

- Normal, abnormal, edge, permission, and regression paths are covered.
- AI-specific failure modes are covered when relevant.
- Expected results are observable.
- Blocking release status is clear.
- Test data avoids sensitive real user data.

## 7. Common Mistakes

- Testing only the happy path.
- Missing permission and empty-state tests.
- Missing AI hallucination and output format tests.
- Writing expected results that cannot be verified.
- Forgetting regression risk.

## 8. Example Command

请根据 `templates/TEST_CASE_TEMPLATE.md` 为这个功能生成测试用例，覆盖正常流程、异常流程、边界条件、权限不足、网络失败、空数据、错误数据、回归风险和 AI 专项测试，并标注是否阻塞上线。
