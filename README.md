# ByteBrain 🧠

[![CI](https://github.com/kamalesh404/ByteBrain/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/kamalesh404/ByteBrain/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ByteBrain is an in-browser, local-first AI study companion designed for students, researchers, and lifelong learners. It executes large language models directly on your device's graphics processor using WebGPU and WebLLM—providing private study assistance without cloud API subscriptions, backend tracking, or per-token fees.

![ByteBrain UI](public/screenshot.png)

---

## Key Features ✨

- **Local-First AI Execution:** Large language model inference runs on your device using WebGPU and `@mlc-ai/web-llm`. Prompts, notes, and study documents are processed in your browser.
- **Document Text Extraction:** Selecting a PDF extracts selectable text directly in the browser via `pdfjs-dist`.
- **Image OCR:** Selecting an image triggers client-side optical character recognition via `tesseract.js` to extract text from diagrams, notes, and screenshots.
- **Non-blocking Web Worker:** Heavy LLM computations are offloaded to dedicated Web Workers, ensuring the UI remains smooth and responsive during text generation.
- **Cache Management:** Built-in storage settings let you view and clear cached model weights to manage browser disk space.
- **Modern Glassmorphic UI:** Clean, dark-themed responsive interface designed for distraction-free study sessions.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   Browser Window                       │
│                                                        │
│   ┌─────────────────────┐      ┌───────────────────┐   │
│   │   React 19 UI       │ <──> │  AIService Bridge │   │
│   │   (Vite + Lucide)   │      └─────────┬─────────┘   │
│   └──────────┬──────────┘                │             │
│              │ (file attachments)        ▼             │
│              ▼                   ┌─────────────────┐   │
│   ┌─────────────────────┐        │   Web Worker    │   │
│   │ Document Extractors │        │  (@mlc-ai/      │   │
│   │ PDF.js / Tesseract  │        │   web-llm)      │   │
│   └─────────────────────┘        └─────────┬───────┘   │
│                                            │           │
│                                            ▼           │
│                                   ┌────────────────┐   │
│                                   │ WebGPU Device  │   │
│                                   │  Phi-3-mini    │   │
│                                   │ (3.8B q4f16)   │   │
│                                   └────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## Privacy, Network, and Initialization Disclosure 🔒

ByteBrain is designed with privacy as a foundational principle:

- **What stays strictly local:** Your conversation history, questions, pasted notes, uploaded PDF documents, and uploaded images are processed in browser memory. They are **never** transmitted to an external server or remote AI API.
- **Document and image selection:**
  - Selecting a PDF extracts embedded selectable text in-browser using `pdfjs-dist`.
  - Selecting an image triggers client-side OCR via `tesseract.js` and may fetch English language recognition assets (`eng.traineddata.gz`, ~4 MB) from a CDN on first use.
- **Model initialization and downloads:**
  - Attaching documents does **not** download or initialize the language model.
  - Submitting your **first prompt** initializes the AI engine and downloads the quantized `Phi-3-mini-4k-instruct-q4f16_1-MLC` model weights (~1.8 GB to 2.3 GB) from Hugging Face / MLC CDNs if they are not already cached.
  - Later sessions may reuse cached assets from browser CacheStorage, subject to available disk space and browser storage eviction policies.
  - ByteBrain does **not** support offline startup before all required application assets, runtime workers, and model weights have been downloaded and cached.

---

## Prerequisites & System Requirements

Running large language models in a browser requires modern hardware acceleration:

| Requirement | Specification |
| :--- | :--- |
| **Browser** | Google Chrome 113+, Microsoft Edge 113+, or another Chromium browser with WebGPU enabled. *(Firefox and Safari currently have experimental or incomplete WebGPU implementations.)* |
| **GPU / VRAM** | Dedicated GPU (NVIDIA, AMD, Apple Silicon) with **4 GB+ VRAM** recommended, or modern integrated graphics with sufficient shared unified memory. |
| **Storage** | ~2.5 GB free disk space for browser CacheStorage (for model weights and runtime assets). |
| **Node.js** | `^20.19.0` or `>=22.0.0` (for local development). |

---

## Getting Started 🚀

### 1. Clone the repository
```bash
git clone https://github.com/kamalesh404/ByteBrain.git
cd ByteBrain
```

### 2. Install dependencies
```bash
npm ci
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in your browser
Navigate to `http://localhost:5173`.
- **Selecting a PDF** extracts selectable text directly in the browser.
- **Selecting an image** triggers local OCR (downloading OCR language data if not previously cached).
- **Submitting your first prompt** initializes the local AI engine and downloads the model assets if not already cached. A progress indicator will display download and preparation status.
- **Subsequent sessions** may reuse cached assets from browser CacheStorage, subject to available browser storage quotas and cache eviction policies.

---

## Troubleshooting & Known Limitations

- **"WebGPU is not supported" or initialization errors:**
  - Verify that hardware acceleration is enabled in your browser settings (`chrome://settings/system` -> "Use graphics acceleration when available").
  - Visit `chrome://gpu` to confirm WebGPU is listed as "Hardware accelerated".
  - Update your operating system GPU drivers.
- **Download stalls during first initialization:**
  - Model weights are ~1.8-2.3 GB. Ensure you have a stable network connection and sufficient disk space.
  - If a download is interrupted, click the Settings gear icon in the sidebar and choose **"Delete Cache"**, then refresh and try again.
- **Scanned or image-only PDFs:**
  - `pdfjs-dist` extracts embedded selectable text. Scanned documents without text layers will not return text. In these cases, convert the page to an image (`.png` / `.jpg`) and upload it to use OCR text recognition.
- **Context Window Limits:**
  - The model operates with a 4,096-token context window. Uploading very long books or documents in a single prompt may exceed the model's memory window.

---

## Project Scripts

- `npm run dev`: Launch local Vite development server.
- `npm run lint`: Run ESLint checks across TypeScript and React code.
- `npm test`: Run automated concurrency and lifecycle tests with Node's native test runner.
- `npm run build`: Check TypeScript types (`tsc -b`) and produce an optimized production bundle.
- `npm run preview`: Serve the local production bundle for smoke testing.

---

## Roadmap & Contributing

- Check out [`ROADMAP.md`](ROADMAP.md) to see planned features, including study shortcuts (summaries, flashcards, quizzes), test harness setup, and context window budgeting.
- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines, branch conventions, and testing requirements.
- Coding agents and AI pair programmers should refer to [`AGENTS.md`](AGENTS.md).
- To report security issues, refer to [`SECURITY.md`](SECURITY.md).

---

## License

This project is licensed under the [MIT License](LICENSE).
