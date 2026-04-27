# API Implementation Plan Template

## 1. API Name

Name the API using a stable English identifier.

## 2. Scenario

Describe the user or system scenario this API supports.

## 3. Method

`GET` / `POST` / `PUT` / `PATCH` / `DELETE`

## 4. Endpoint

```text
/api/example
```

## 5. Authentication

Describe authentication requirements and session/token handling.

## 6. Permission Rules

| Role | Allowed | Restricted | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## 7. Request Parameters

| Field | Type | Required | Description | Example | Validation |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 8. Response Fields

| Field | Type | Description | Example |
| --- | --- | --- | --- |
|  |  |  |  |

## 9. Error Codes

| Code | Scenario | Message | Frontend Handling |
| --- | --- | --- | --- |
|  |  |  |  |

## 10. Frontend Usage

Describe when the frontend calls this API, loading behavior, error behavior, cache, and retry rules.

## 11. Backend Logic

Describe service logic, validation, permission checks, transaction boundaries, and side effects.

## 12. Data Dependencies

| Data | Source | Read / Write | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## 13. Edge Cases

| Case | Expected Behavior | Error / Response |
| --- | --- | --- |
|  |  |  |

## 14. Testing Notes

Describe unit, integration, API contract, permission, and regression tests.

## 15. Backward Compatibility

Describe compatibility with existing clients, old data, cache, pagination, sorting, and default values.
