# Codebase Understanding Prompt

## 1. Prompt Name

Codebase Understanding Prompt

## 2. Use Case

用于阅读代码仓库，并从产品 + 工程视角解释项目结构和风险。

## 3. Copyable Prompt

```text
请作为 AI Product Builder 的 Engineering Build Partner，阅读当前代码仓库并输出代码理解报告。

默认中文输出。请先读取项目结构，不要修改文件。请识别技术栈，并说明前端、后端、API、数据模型、权限、状态管理、AI / Algorithm 模块、构建和测试方式。

请把代码结构转成产品功能理解，说明用户能完成什么任务、核心路径在哪里、哪些模块支撑这些功能。

请输出：
1. Project Overview
2. Tech Stack
3. Directory Structure
4. Main Entry Points
5. Frontend Architecture
6. Backend Architecture
7. API Structure
8. Data Model
9. Authentication and Permission
10. State Management
11. AI / Algorithm Modules
12. Build and Deployment
13. Test Strategy
14. Product-facing Features
15. Risks and Open Questions
16. 下一步建议
```

## 4. Expected Output

- 代码仓库理解报告
- 产品功能映射
- 工程架构说明
- 风险和待确认问题
- 不修改任何文件
