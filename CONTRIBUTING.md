# Contributing to ByteBrain

Thank you for your interest in improving ByteBrain! ByteBrain is a fully in-browser, privacy-respecting AI study companion built with React, TypeScript, Vite, WebLLM, PDF.js, and Tesseract.js.

We welcome contributions from human developers and coding agents alike. This document outlines how to set up the project, develop features, validate changes, and submit pull requests.

---

## Code of Conduct & Core Principles

1. **Client-Side Privacy First:** ByteBrain runs 100% in the user's browser. We do not introduce server-side logging, analytics, tracking, telemetry, or remote API proxies for user data or documents.
2. **Real Hardware Realities:** ByteBrain depends on WebGPU. Changes should handle failure states gracefully, detect capability cleanly, and provide actionable messages when features cannot run.
3. **Focused, Verifiable Pull Requests:** We value small, focused pull requests with honest testing reports over sweeping speculative changes.
4. **Transparent Collaboration:** When utilizing AI assistants or coding agents, disclose their role transparently and ensure all code is reviewed and understood by a human.

---

## Prerequisites

- **Node.js:** `^20.19.0` or `>=22.0.0` (LTS recommended)
- **npm:** `^10.0.0`
- **WebGPU-Enabled Browser:** Google Chrome 113+, Microsoft Edge 113+, or another Chromium browser with hardware acceleration enabled.
- **Hardware:** A GPU with at least 4 GB of VRAM or shared system memory is recommended to run the quantized 3.8B model smoothly.

---

## Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/kamalesh404/ByteBrain.git
   cd ByteBrain
   ```

2. **Install exact dependencies:**
   ```bash
   npm ci
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your WebGPU-capable browser.

---

## Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server with Hot Module Replacement (HMR). |
| `npm run lint` | Runs ESLint over TypeScript and React files to catch syntax and style errors. |
| `npm run build` | Runs TypeScript compilation check (`tsc -b`) followed by Vite production bundling. |
| `npm run preview` | Serves the production build locally to test production behavior. |

> **Note on Testing:** The repository does not currently include an automated unit or end-to-end test suite. All pull requests must pass `npm run lint` and `npm run build`, followed by manual browser validation. Contributions establishing a test harness (e.g. Vitest) are welcome.

---

## Development Workflow

### 1. Branch Naming
Never work directly on the `master` branch. Branch off `master` with descriptive prefixes:
- `feat/short-description` for new features
- `fix/issue-description` for bug fixes
- `docs/doc-update` for documentation changes
- `chore/task-name` for maintenance, build tooling, or dependencies

### 2. Making Changes
- Keep changes concise and focused on a single issue or improvement.
- Adhere to the existing TypeScript conventions. Avoid `any` casts; use `unknown` with type narrowing.
- Preserve UI responsiveness—heavy CPU or GPU tasks should run inside web workers.
- Avoid introducing external dependencies unless strictly necessary and discussed beforehand.

### 3. Local Verification
Before opening a pull request, run the verification commands and verify they pass with zero errors:
```bash
npm run lint
npm run build
```

Test manually in a WebGPU-enabled browser:
- Test model initialization or verify fallback messaging if WebGPU is unavailable.
- Test PDF upload with both selectable text and empty/scanned documents.
- Test image upload with clear text.
- Verify memory and worker cleanup when clearing cache or closing modals.

---

## Submitting a Pull Request

1. Push your branch to your fork on GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request targeting `kamalesh404/ByteBrain` default branch (`master`).
3. Fill in the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) completely:
   - State the problem solved and link related issues.
   - List exact validation commands executed and their output.
   - Attach screenshots for user-facing changes.
   - Confirm privacy and network impact.
4. Ensure the GitHub Actions CI workflow passes on your pull request.

---

## Reporting Issues

- **Bug Reports:** Open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml). Include your browser version, OS, GPU model, WebGPU status, and reproducible steps. **Never upload private study notes or personal documents in public issues.**
- **Feature Requests:** Open an issue using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml) describing the user problem and expected behavior.
- **Security Vulnerabilities:** Follow our [Security Policy](SECURITY.md). Do not disclose security vulnerabilities publicly on the issue tracker.
