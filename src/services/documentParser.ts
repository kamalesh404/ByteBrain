import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Use local worker module provided by pdfjs-dist via Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const parsePDF = async (file: File): Promise<string> => {
  if (file.size === 0) {
    throw new Error('Selected PDF file is empty (0 bytes).');
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  let pdf: Awaited<typeof loadingTask.promise> | null = null;

  try {
    pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? (item as { str: string }).str : ''))
        .filter(Boolean)
        .join(' ');
      if (pageText.trim()) {
        fullText += pageText + '\n\n';
      }
    }

    const trimmed = fullText.trim();
    if (!trimmed) {
      return '[Note: No selectable text found in this PDF. If this is a scanned document, consider saving pages as images and uploading them for OCR text recognition.]';
    }
    return trimmed;
  } finally {
    if (pdf) {
      try {
        await pdf.cleanup();
      } catch (cleanupErr) {
        console.warn('Failed to cleanup PDF document resources:', cleanupErr);
      }
    }

    try {
      await loadingTask.destroy();
    } catch (destroyErr) {
      console.warn('Failed to destroy PDF loading task:', destroyErr);
    }
  }
};

export const parseImage = async (file: File): Promise<string> => {
  if (file.size === 0) {
    throw new Error('Selected image file is empty (0 bytes).');
  }

  // Use object URL to prevent file reading issues in some browsers
  const objectUrl = URL.createObjectURL(file);
  try {
    const result = await Tesseract.recognize(objectUrl, 'eng');
    const text = result.data.text.trim();
    if (!text) {
      return '[Note: OCR did not detect any readable English text in this image.]';
    }
    return text;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
