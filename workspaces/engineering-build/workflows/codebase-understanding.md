# Codebase Understanding Workflow

## 1. Purpose

Understand a repository from both product and engineering perspectives before planning or changing code.

## 2. When to Use

Use before implementation, refactoring, debugging, code review, or MVP planning in an unfamiliar codebase.

## 3. Inputs

- Repository path
- Product goal or feature area
- Known files or modules
- Current question
- Constraints

## 4. Steps

1. Inspect the directory structure first.
2. Identify the tech stack from manifests, configs, lockfiles, and framework conventions.
3. Locate main entry files, routes, pages, services, API handlers, jobs, and tests.
4. Identify frontend pages, backend APIs, data models, state management, permissions, and AI / Algorithm modules.
5. Map code modules to product-facing features and user flows.
6. Identify risks, unclear ownership, missing tests, and open questions.
7. Output a reading summary before suggesting changes.

## 5. Outputs

- Project overview
- Tech stack
- Directory and entry point summary
- Product-facing feature map
- Engineering architecture notes
- Risks and open questions

## 6. Quality Checklist

- Findings cite actual files or directories.
- Product meaning is explained, not only technical structure.
- Permission and data flows are checked.
- Tests and deployment paths are identified when visible.
- No files are modified during understanding.

## 7. Common Mistakes

- Jumping into code edits before reading structure.
- Ignoring product behavior.
- Missing auth, permissions, and deployment config.
- Treating guesses as facts.
- Skipping tests and risk notes.

## 8. Example Command

请进入 engineering-build 工作区，阅读当前代码仓库，先看目录结构和技术栈，再从产品 + 工程视角解释主要模块、功能、风险和待确认问题，不要修改文件。
