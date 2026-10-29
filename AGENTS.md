# Agent Guidelines for ByteBrain

This document defines expectations and operating rules for autonomous coding agents, AI pair programmers, and agentic workflows (including Antigravity, OpenCode, Claude Code, Codex, and others) contributing to the ByteBrain repository.

---

## Operating Principles for Agents

### 1. Inspect Before Modifying
- Always inspect the live file tree, package configurations, Git status, and open pull requests before making changes.
- Respect in-flight work and never duplicate, overwrite, or clobber existing open pull requests (such as PR #1).
- Identify pre-existing failures separately from regressions introduced by your work.

### 2. Strict Branch Isolation
- Never commit directly to the default branch (`master`).
- Always create a task-specific branch (e.g. `feat/ocr-progress`, `fix/webgpu-error-boundary`, `chore/ci-matrix`).
- Never force-push (`--force`), rewrite Git history, delete branches, or change repository settings.

### 3. Focused, High-Integrity Diffs
- Keep diffs minimal, clean, and directly tied to the assigned task.
- Avoid sweeping cosmetic reformatting or unrelated refactoring.
- Maintain documentation integrity: preserve existing comments, licenses, and docstrings unless explicitly tasked to update them.
- Avoid adding new dependencies without explicit human instruction or clear architectural justification.

### 4. Zero Secret and Data Exposure
- Never hardcode, commit, or print API keys, tokens, credentials, or private keys.
- Never upload, commit, or transmit user documents, test PDFs, or private study notes.
- Do not introduce telemetry, remote analytic trackers, third-party backend proxies, or paid API requirements. ByteBrain is strictly client-side local-first.

### 5. Honest Attribution and Transparent Disclosure
- Never impersonate real humans or fabricate contributor attributions.
- Do not create fake stars, artificial commits, or synthetic account activities.
- Disclose AI-assisted work transparently in commit messages and pull request descriptions.
- All agent-generated work must be submitted as a reviewable pull request for human maintainer review. Agents must never merge pull requests autonomously.

### 6. Rigorous Validation and Truthful Reporting
- Always run the repository validation commands before submitting changes:
  ```bash
  npm run lint
  npm test
  npm run build
  ```
- Report exact commands executed and their actual exit codes. Never claim a command passed if it was not run or failed.

---

## Multi-Agent Collaboration Workflow

When multiple agents collaborate on ByteBrain, follow this five-step workflow:

```
┌─────────────┐     ┌───────────────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌────────────────┐
│  1. PLANNER │ ──> │  2. DEVELOPER AGENT   │ ──> │    3. CI     │ ──> │   4. REVIEWER   │ ──> │ 5. MAINTAINER  │
│ Breaks task │     │ Works on task branch  │     │ Runs lint &  │     │ Checks diff &   │     │ Merges PR with │
│ into atomic │     │ Runs local validation │     │ build checks │     │ test evidence   │     │ human consent  │
│ work items  │     │ Submits PR            │     │              │     │                 │     │                │
└─────────────┘     └───────────────────────┘     └──────────────┘     └─────────────────┘     └────────────────┘
```

1. **Planner Agent:** Breaks a feature from [`ROADMAP.md`](ROADMAP.md) into independent, atomic tasks with clear boundaries and acceptance criteria.
2. **Developer Agent:** Implements the specific slice on an isolated branch, verifies with `npm run lint` and `npm run build`, and opens a pull request using the template.
3. **Continuous Integration (CI):** Automates linting and build checks on pull requests.
4. **Reviewer Agent:** Inspects the diff for regressions, architectural consistency, WebGPU error handling, and type safety.
5. **Human Maintainer:** Reviews the pull request, tests locally if necessary, and merges into `master`.

---

## Architecture Reference for Agents

- **Frontend:** React 19 + TypeScript + Vite 8 in `src/`.
- **AI Service (`src/services/ai.ts`):** Wraps `@mlc-ai/web-llm` using `Phi-3-mini-4k-instruct-q4f16_1-MLC`. Manages WebWorker lifecycle, WebGPU capability pre-flight checks, and streaming completions.
- **Worker (`src/services/worker.ts`):** `WebWorkerMLCEngineHandler` instance that offloads LLM compute off the main thread.
- **Document Parser (`src/services/documentParser.ts`):**
  - PDF: Uses `pdfjs-dist` to extract text from pages, properly cleaning up loading tasks.
  - Image OCR: Uses `tesseract.js` with client-side canvas/object URL processing.
- **Cache Management:** Model weights are stored in browser CacheStorage under WebLLM / MLC namespaces. The UI allows users to safely clear this cache via `caches.delete()`.
- **CSS / UI:** Pure CSS styling in `src/App.css` and `src/index.css`. Glassmorphism dark-mode aesthetic with Lucide React icons.

---

## Future Automated Agent Integration

If automated GitHub Actions agent runners (e.g. Claude Code or Codex PR bots) are integrated in the future:
- They must use dedicated bot credentials with least-privilege tokens (`contents: read`, `pull-requests: write`).
- They must never have write access to `master` directly.
- Secrets for external model providers must be stored securely in GitHub Actions secrets and never exposed to untrusted fork PR workflows (`pull_request_target` must be avoided).
