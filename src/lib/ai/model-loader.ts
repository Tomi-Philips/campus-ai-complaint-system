// Configuration for Next.js environment
// Polyfill for Transformers.js in Next.js client components
if (typeof process === 'undefined') {
  (globalThis as any).process = { env: {} };
} else if (!process.env) {
  (process as any).env = {};
}

let pipeline: any = null;
let env: any = null;

async function loadTransformers() {
  if (!pipeline) {
    const transformers = await import('@xenova/transformers');
    pipeline = transformers.pipeline;
    env = transformers.env;

    if (typeof window !== 'undefined') {
      // Client-side configuration
      env.allowLocalModels = false;
      // env.useBrowserCache = true;
    }
  }
  return { pipeline, env };
}

type PipelineType = 'zero-shot-classification' | 'feature-extraction';


class ModelLoader {
  private static instance: ModelLoader;
  private pipelines: Map<string, any> = new Map();
  private loading: Map<string, Promise<any>> = new Map();

  private constructor() {}

  public static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  public async getPipeline(task: PipelineType, model: string) {
    const key = `${task}-${model}`;
    
    if (this.pipelines.has(key)) {
      return this.pipelines.get(key);
    }

    if (this.loading.has(key)) {
      return this.loading.get(key);
    }

    const loadPromise = (async () => {
      try {
        const { pipeline } = await loadTransformers();
        console.log(`[AI] Loading model: ${model} for task: ${task}...`);
        const p = await pipeline(task, model);
        this.pipelines.set(key, p);
        console.log(`[AI] Model loaded successfully: ${model}`);
        return p;

      } catch (error) {
        console.error(`[AI] Failed to load model ${model}:`, error);
        throw error;
      } finally {
        this.loading.delete(key);
      }
    })();

    this.loading.set(key, loadPromise);
    return loadPromise;
  }
}

export const modelLoader = ModelLoader.getInstance();
