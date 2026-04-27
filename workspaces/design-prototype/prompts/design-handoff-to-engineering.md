# Design Handoff to Engineering Prompt

## 1. Prompt Name

Design Handoff to Engineering Prompt

## 2. Use Case

用于把设计方案整理成交付工程的实现说明。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Design Prototype Partner，把下面的设计方案整理成交付工程的说明。

默认中文输出。请先判断信息是否完整；如果缺少页面结构、组件清单、设计 token、状态说明、交互说明、数据展示规则或验收标准，请列为待确认问题，不要编造。

请输出：
1. 页面结构
2. 组件清单
3. 设计 token
4. 状态说明
5. 交互说明
6. 数据展示规则
7. 前端实现建议
8. Edge Cases
9. 验收标准
10. 待确认问题
11. 下一步行动建议

设计方案：
[粘贴设计方案、原型说明或页面结构]
```

## 4. Expected Output

- 工程可用的设计交付说明
- 页面结构和组件清单
- token、状态、交互、数据展示规则
- 验收标准和待确认问题
