/**
 * Generates embeddings for a given text using a feature extraction model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/ai/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        throw new Error('Failed to generate embedding from server API');
      }
      const data = await response.json();
      return data.embedding;
    }

    // Dynamic import to prevent modelLoader / transformers from loading in client components
    const { modelLoader } = await import('./model-loader');
    const extractor = await modelLoader.getPipeline(
      'feature-extraction',
      process.env.NEXT_PUBLIC_AI_MODEL_EMBEDDINGS || 'Xenova/all-MiniLM-L6-v2'
    );

    const result = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  } catch (error: any) {
    console.warn('[AI] Embedding generation error. Triggering fallback zero-vector:', error.message || error);
    // Return a standard 384-dimensional zero vector to avoid database insertion/matching failures
    return new Array(384).fill(0);
  }
}


/**
 * Calculates cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  
  return dotProduct / (mA * mB);
}
