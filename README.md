# ByteBrain 🧠

[![CI](https://github.com/kamalesh404/ByteBrain/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/kamalesh404/ByteBrain/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ByteBrain is an in-browser, local-first AI study companion designed for students, researchers, and lifelong learners. It executes large language models directly on your device's graphics processor using WebGPU and WebLLM—providing private, offline-capable study assistance without cloud API subscriptions, backend tracking, or per-token fees.

![ByteBrain UI](public/screenshot.png)

---

## Key Features ✨

- **Local-First AI Execution:** Large language model inference runs on your device using WebGPU and `@mlc-ai/web-llm`. Prompts, notes, and study documents are processed entirely in your browser.
- **Document Text Extraction:** Upload lecture slides, research papers, or syllabus documents in PDF format via `pdfjs-dist`.
- **Image OCR:** Extract text from diagrams, handwritten lecture notes, and textbook screenshots using `tesseract.js`.
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
│              │ (file uploads)            ▼             │
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

## Privacy & Network Disclosure 🔒

ByteBrain is designed with privacy as a foundational principle:

- **What stays strictly local:** Your conversation history, questions, pasted notes, uploaded PDF documents, and uploaded images are processed entirely in browser memory. They are **never** transmitted to an external server or remote AI API.
- **What uses network connectivity:**
  1. **Application Shell:** Loading the static HTML, JavaScript, CSS, and web fonts.
  2. **Model Weights (First Run Only):** ByteBrain fetches the quantized `Phi-3-mini-4k-instruct-q4f16_1-MLC` model weights (~1.8 GB to 2.3 GB) from Hugging Face / MLC CDNs upon the first query. These files are saved to your browser's local CacheStorage and loaded from disk on subsequent visits.
  3. **OCR Trained Data (On Demand):** When an image is uploaded for OCR, Tesseract.js downloads English optical character recognition data (`eng.traineddata.gz`, ~4 MB) from a CDN to browser storage.

---

## Prerequisites & System Requirements

Running large language models in a browser requires modern hardware acceleration:

| Requirement | Specification |
| :--- | :--- |
| **Browser** | Google Chrome 113+, Microsoft Edge 113+, or another Chromium browser with WebGPU enabled. *(Firefox and Safari currently have experimental or incomplete WebGPU implementations.)* |
| **GPU / VRAM** | Dedicated GPU (NVIDIA, AMD, Apple Silicon) with **4 GB+ VRAM** recommended, or modern integrated graphics with sufficient shared unified memory. |
| **Storage** | ~2.5 GB free disk space for the browser CacheStorage (for model weights and runtime assets). |
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
Navigate to `http://localhost:5173`. When you submit your first query or upload a file, ByteBrain will download the quantized model weights. A progress bar will display download status. Once downloaded, all future launches load directly from local cache.

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
