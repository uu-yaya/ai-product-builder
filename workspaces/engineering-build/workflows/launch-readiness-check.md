# Launch Readiness Check Workflow

## 1. Purpose

Check whether a feature is ready to launch and identify blockers, rollout risks, and rollback plan.

## 2. When to Use

Use before merging, releasing, enabling a feature flag, starting gray release, or announcing availability.

## 3. Inputs

- PRD acceptance criteria
- Design handoff
- Implementation summary
- Test results
- Monitoring and analytics plan
- Rollout and rollback plan

## 4. Steps

1. Check product acceptance.
2. Check design acceptance.
3. Check frontend behavior.
4. Check backend behavior.
5. Check AI behavior and fallback.
6. Check data migration and compatibility.
7. Check QA results and blocking issues.
8. Check security, privacy, analytics, monitoring, and alerting.
9. Check gray release and rollback plan.
10. Output Go / No-go recommendation.

## 5. Outputs

- Product checklist
- Design checklist
- Frontend checklist
- Backend checklist
- AI checklist
- Data checklist
- Security checklist
- Analytics checklist
- Monitoring checklist
- Gray release and rollback plan
- Go / No-go decision

## 6. Quality Checklist

- Blocking items are explicit.
- Rollback plan has trigger and validation.
- Monitoring and analytics are included.
- Security and privacy are checked.
- Go / No-go decision is justified.

## 7. Common Mistakes

- Treating tests passing as enough for launch.
- Missing monitoring and rollback.
- Missing analytics verification.
- Missing design acceptance.
- Launching AI features without fallback.

## 8. Example Command

请根据 `templates/LAUNCH_CHECKLIST_TEMPLATE.md` 做上线前检查，覆盖产品、设计、前端、后端、AI、数据、QA、安全、埋点、监控、灰度和回滚，并输出 Go / No-go 建议。
