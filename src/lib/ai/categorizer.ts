import { AIClassificationResult } from '@/types/ai-classification.types';

/**
 * Classifies a complaint text into one of the provided categories using Zero-Shot Classification.
 */
export async function classifyComplaint(
  text: string, 
  categories: string[]
): Promise<AIClassificationResult> {
  if (categories.length === 0) {
    return { category: 'Uncategorized', confidence: 0 };
  }

  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, categories })
      });
      if (!response.ok) {
        throw new Error('Failed to classify complaint via server API');
      }
      return await response.json();
    }

    // Server-side: Call Grok/Groq directly to classify
    const { callGrok } = await import('./grok');
    const messages = [
      {
        role: 'system',
        content: `You are an expert university administrator AI. Classify the following student complaint description into exactly one of the provided categories. 
Categories: ${JSON.stringify(categories)}

You must return a raw JSON object with exactly two keys:
1. "category": (string) The exact category name matching one of the options.
2. "confidence": (number) A decimal value between 0.0 and 1.0 representing your classification confidence.

Do not include any extra text, markdown formatting blocks, or explanations. Return only the raw JSON.`
      },
      {
        role: 'user',
        content: `Complaint Description: "${text}"`
      }
    ];

    const result = await callGrok(messages, true);
    const content = result.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }
    
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      category: parsed.category || categories[0],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85
    };
  } catch (error) {
    console.error('[AI] Classification error:', error);
    throw error;
  }
}

