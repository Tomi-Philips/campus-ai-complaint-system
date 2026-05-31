/**
 * Helper to call Grok/Groq API (OpenAI-compatible) using the GROK_API_KEY env variable.
 * Automatically handles Groq (gsk_...) and xAI (xai-...) key prefixes and routes to the correct models.
 * Implements AbortController for custom timeouts and graceful retries.
 */
export async function callGrok(
  messages: Array<{ role: string; content: string }>,
  jsonMode: boolean = false,
  timeoutMs: number = 5000 // 5 seconds default timeout to keep system responsive
): Promise<any> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GROK_API_KEY is not defined in the environment variables');
  }

  // Auto-detect provider
  const isXAI = apiKey.startsWith('xai-');
  const endpoint = isXAI 
    ? 'https://api.x.ai/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';

  // Llama-3.3-70b is extremely accurate, llama-3.1-8b is blazing fast
  const model = isXAI ? 'grok-beta' : 'llama-3.3-70b-versatile';

  console.log(`[AI Server] Calling LLM via ${isXAI ? 'xAI (Grok)' : 'Groq'} using model: ${model}`);

  let attempts = 2; // Try up to 2 times
  let lastError: any = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          response_format: jsonMode ? { type: 'json_object' } : undefined,
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[AI Server] API Call Failed (Attempt ${attempt}/${attempts}): ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`LLM API failed: ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();

    } catch (error: any) {
      clearTimeout(id);
      lastError = error;
      
      const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout') || error.code === 'UND_ERR_CONNECT_TIMEOUT';
      console.warn(`[AI Server] Attempt ${attempt}/${attempts} failed. IsTimeout: ${isTimeout}. Error: ${error.message}`);
      
      if (attempt < attempts) {
        // Wait a short time before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // If we reach here, all attempts failed
  throw lastError || new Error('All attempts to contact LLM API failed');
}
