# Launch Readiness Check Prompt

## 1. Prompt Name

Launch Readiness Check Prompt

## 2. Use Case

用于上线前检查并输出 Go / No-go 建议。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Engineering Build Partner，对下面的功能做上线前检查。

默认中文输出。请检查产品、设计、前端、后端、AI、数据、QA、安全、埋点、监控、灰度和回滚。

请标注上线阻塞项、修复优先级，并输出 Go / No-go 建议。

请输出：
1. Product Checklist
2. Design Checklist
3. Frontend Checklist
4. Backend Checklist
5. AI Checklist
6. Data Checklist
7. QA Checklist
8. Security Checklist
9. Analytics Checklist
10. Monitoring Checklist
11. Gray Release Notes
12. Rollback Plan
13. Go / No-go Decision
14. Blocking Issues
15. 下一步建议

上线对象：
[粘贴功能说明、测试结果、实现摘要或发布计划]
```

## 4. Expected Output

- 上线检查报告
- 阻塞项和优先级
- 灰度和回滚建议
- Go / No-go 决策
