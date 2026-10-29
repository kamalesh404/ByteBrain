import { CreateWebWorkerMLCEngine, type MLCEngineInterface, type InitProgressReport } from '@mlc-ai/web-llm';

export interface WebGPUCheckResult {
  supported: boolean;
  error?: string;
}

class AIService {
  private engine: MLCEngineInterface | null = null;
  private initPromise: Promise<void> | null = null;
  private worker: Worker | null = null;
  // Capable 3.8B parameter model running in 4-bit quantization (~1.8-2.3 GB)
  private modelId = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';

  get isInitializing(): boolean {
    return Boolean(this.initPromise);
  }

  get isReady(): boolean {
    return Boolean(this.engine);
  }

  async checkWebGPUSupport(): Promise<WebGPUCheckResult> {
    if (typeof navigator === 'undefined' || !('gpu' in navigator) || !navigator.gpu) {
      return {
        supported: false,
        error: 'WebGPU is not supported in this browser. Please use a modern WebGPU-compatible browser such as Chrome 113+ or Microsoft Edge 113+.',
      };
    }
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        return {
          supported: false,
          error: 'WebGPU is supported by your browser, but no compatible graphics adapter was found. Check your GPU drivers and browser hardware acceleration settings.',
        };
      }
      return { supported: true };
    } catch (err) {
      return {
        supported: false,
        error: `Failed to detect WebGPU adapter: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  async init(onProgress?: (progress: InitProgressReport) => void): Promise<void> {
    if (this.engine) return;
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const gpuCheck = await this.checkWebGPUSupport();
        if (!gpuCheck.supported) {
          throw new Error(gpuCheck.error);
        }

        const worker = new Worker(
          new URL('./worker.ts', import.meta.url),
          { type: 'module' }
        );
        this.worker = worker;

        this.engine = await CreateWebWorkerMLCEngine(worker, this.modelId, {
          initProgressCallback: onProgress,
        });
      } catch (error) {
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }
        this.engine = null;
        console.error('Failed to initialize AI Engine:', error);
        throw error;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  async deleteModelCache(): Promise<boolean> {
    try {
      if (this.engine) {
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }
        this.engine = null;
      }

      if (typeof caches === 'undefined') {
        return false;
      }

      const keys = await caches.keys();
      let deleted = false;
      for (const key of keys) {
        if (
          key.toLowerCase().includes('webllm') ||
          key.toLowerCase().includes('huggingface') ||
          key.toLowerCase().includes('model')
        ) {
          await caches.delete(key);
          deleted = true;
        }
      }
      return deleted;
    } catch (err) {
      console.error('Failed to clear cache', err);
      return false;
    }
  }

  interrupt(): void {
    if (this.engine) {
      this.engine.interruptGenerate();
    }
  }

  async generateResponse(
    userMessage: string,
    contextFilesText?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.engine) {
      throw new Error('AI Engine is not initialized. Please ensure model loading completes before submitting prompts.');
    }

    let prompt = userMessage;
    if (contextFilesText) {
      prompt = `Here is the reference material provided by the user:\n\n${contextFilesText}\n\nBased on the above material, please answer the user's prompt:\n${userMessage}`;
    }

    const messages = [
      {
        role: 'system' as const,
        content:
          "You are ByteBrain, a helpful, precise, and encouraging AI Study Companion. Answer the user's questions clearly. If they provide reference material (notes/PDF text), base your answers strictly on that material.",
      },
      { role: 'user' as const, content: prompt },
    ];

    if (onChunk) {
      const chunks = await this.engine.chat.completions.create({
        messages,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta?.content || '';
        fullResponse += delta;
        onChunk(delta);
      }
      return fullResponse;
    } else {
      const reply = await this.engine.chat.completions.create({
        messages,
      });
      return reply.choices[0]?.message?.content || '';
    }
  }
}

export const aiService = new AIService();
