# ByteBrain Roadmap 🗺️

This document outlines the current state and forward-looking product and technical roadmap for ByteBrain. It separates implemented capabilities from planned milestones to guide human contributors and coding agents.

---

## 🟢 Implemented Features (Current State)

- **In-Browser WebLLM Inference:** Executes `Phi-3-mini-4k-instruct-q4f16_1-MLC` (3.8B quantized model) locally in the user's browser via WebGPU.
- **Web Worker Offloading:** Model execution runs inside dedicated Web Workers (`src/services/worker.ts`), preventing UI thread freezes during generation.
- **Document Text Extraction:**
  - PDF document parsing with `pdfjs-dist` (extracts text per page and manages worker teardown).
  - Image OCR with `tesseract.js` for scanned notes and diagrams.
- **Streaming Responses:** Token-by-token streaming response rendering with markdown formatting.
- **Cache & Storage Management:** Settings modal allowing users to inspect and clear model weights stored in browser CacheStorage.
- **Automated CI:** GitHub Actions workflow validating linting and production build on pull requests and pushes to `master`.
- **Automated Dependency Checks:** Weekly Dependabot updates for npm packages and GitHub Actions.

---

## 🟡 Milestone 1: Reliability & Compatibility (Immediate Priority)

The focus of this milestone is ensuring the application runs consistently across different devices and handles failure modes transparently:

- [x] **Pre-flight WebGPU Check:** Detect `navigator.gpu` and available adapters before launching workers, providing clear diagnostic errors to unsupported browsers.
- [x] **Concurrent Initialization Guard:** Prevent race conditions when multiple prompts or initializations are triggered concurrently.
- [x] **Safe PDF Lifecycle Cleanup:** Clean up document instances and workers after reading PDFs to prevent memory leaks.
- [ ] **Model Download Resumption & Retry:** Implement retry logic with exponential backoff if model weight chunk downloads drop or encounter network timeouts.
- [ ] **Context Window Budgeting:** Calculate input token count against Phi-3-mini's 4k context window and warn users if large documents exceed capacity.
- [ ] **Scanned PDF Fallback:** Automatically route image-only PDF pages through Tesseract.js OCR when no selectable text is extracted.

---

## 🔵 Milestone 2: Study Experience & Grounded Workflows

Expand ByteBrain from a generic chat companion into an indispensable study tool:

- [ ] **Study Modes / Action Buttons:** One-click shortcuts for uploaded materials:
  - *Executive Summary:* Synthesize key concepts from notes into concise bullet points.
  - *Flashcards:* Generate question-and-answer pairs formatted for active recall.
  - *Practice Quiz:* Create multiple-choice and short-answer test questions grounded in the reading.
  - *Glossary / Key Terms:* Extract unfamiliar domain terminology with plain-English definitions.
- [ ] **Multi-File Context Management:** Inspect individual attached files, view their token footprint, and selectively exclude or include files in prompt context.
- [ ] **Chat Session Persistence:** Store recent conversation history locally in IndexedDB with export capabilities (Markdown or JSON).

---

## 🟣 Milestone 3: Accessibility & Contributor Infrastructure

- [x] **Accessible Dialogs & Buttons:** Add keyboard trap/escape listeners and ARIA labels for assistive tech.
- [ ] **Automated Test Harness:**
  - Integrate Vitest for unit testing document parsers and state helpers.
  - Integrate Playwright or Puppeteer with WebGPU flags for smoke testing in CI.
- [ ] **Vite Code Splitting:** Code-split heavy libraries (`pdfjs-dist`, `tesseract.js`) so the initial page bundle stays under 500 kB.
- [ ] **Theme Customization:** User-selectable light/dark/system themes with high-contrast accessibility compliance.
- [ ] **PWA / Offline Mode:** Service worker caching for the static app shell so ByteBrain can launch completely offline once model weights are cached.
