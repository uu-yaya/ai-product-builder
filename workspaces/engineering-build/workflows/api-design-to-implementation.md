# API Design to Implementation Workflow

## 1. Purpose

Convert API requirements into engineering-ready implementation plans.

## 2. When to Use

Use when a feature needs new or changed API behavior, request / response contracts, permissions, or backend logic.

## 3. Inputs

- API requirement
- User scenario
- Frontend usage
- Data dependencies
- Permission rules
- Compatibility constraints

## 4. Steps

1. Define scenario, method, endpoint, auth, and permission rules.
2. Specify request parameters, response fields, validation, and error codes.
3. Describe backend logic, data dependencies, transactions, and side effects.
4. Describe frontend usage, loading, error handling, cache, and retry behavior.
5. Identify edge cases and compatibility risks.
6. Define unit, integration, contract, permission, and regression tests.

## 5. Outputs

- API implementation plan
- Request and response schema
- Error code table
- Permission rules
- Backend logic notes
- Frontend usage notes
- Testing plan
- Compatibility risks

## 6. Quality Checklist

- API fields are explicit and typed.
- Error handling is user- and frontend-aware.
- Permissions are not left implicit.
- Backward compatibility is considered.
- Tests cover success, failure, permission, and edge cases.

## 7. Common Mistakes

- Defining only happy-path response.
- Missing permission checks.
- Ignoring old clients or old data.
- Leaving validation rules vague.
- Forgetting frontend loading and error behavior.

## 8. Example Command

请根据 `templates/API_IMPLEMENTATION_PLAN_TEMPLATE.md` 把这个 API 需求转成工程实现计划，包含请求参数、响应字段、错误码、权限规则、后端逻辑、前端使用方式、测试方式和兼容性风险。
