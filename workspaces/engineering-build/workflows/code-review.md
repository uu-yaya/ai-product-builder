# Code Review Workflow

## 1. Purpose

Review code changes for engineering quality, product behavior, security, privacy, performance, tests, and release risk.

## 2. When to Use

Use for PR review, patch review, implementation validation, or release risk assessment.

## 3. Inputs

- Changed files or diff
- Related PRD / prototype / ticket
- API or data model spec
- Test results
- Known risks

## 4. Steps

1. Check whether implementation matches requirement and user path.
2. Check product behavior against PRD / prototype.
3. Check permissions, auth, security, privacy, and sensitive logging.
4. Check API and data compatibility.
5. Check performance and reliability risks.
6. Check test coverage and regression risk.
7. Check UI / UX consistency with design handoff.
8. For AI features, check output format, fallback, logs, evaluation metrics, cost, and latency.
9. Classify issues as P0 / P1 / P2 and recommend approve or request changes.

## 5. Outputs

- Findings by severity
- Product behavior assessment
- Engineering quality assessment
- Security and privacy risks
- Test coverage gaps
- Required changes
- Recommendation

## 6. Quality Checklist

- Findings cite files or behavior.
- Product impact is clear.
- Security and privacy are checked.
- Tests are evaluated.
- Recommendation is explicit.

## 7. Common Mistakes

- Reviewing style only.
- Ignoring product behavior.
- Missing permission issues.
- Missing UI / UX consistency.
- Not checking AI fallback and output format.

## 8. Example Command

请根据 `templates/CODE_REVIEW_TEMPLATE.md` 评审这个 PR，同时检查工程质量和产品行为是否符合 PRD / 原型，并按 P0 / P1 / P2 输出问题。
