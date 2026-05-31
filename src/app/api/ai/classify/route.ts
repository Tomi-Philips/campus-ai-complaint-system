import { NextRequest, NextResponse } from 'next/server';
import { callGrok } from '@/lib/ai/grok';

/**
 * Fallback keyword-matching heuristic used when downstream Grok/Groq APIs fail due to network timeouts.
 * Case-insensitive matching aligns input with registered categories via highly targeted weights.
 */
function localKeywordClassify(text: string, categories: string[]): string {
  const cleanText = text.toLowerCase();
  let bestCategory = categories[0];
  let maxScore = -1;

  // Rich mapping dictionary covering typical campus complaints categories
  const mappings: Record<string, string[]> = {
    'it': ['wifi', 'wi-fi', 'internet', 'network', 'portal', 'account', 'login', 'email', 'password', 'website', 'system', 'connection', 'offline', 'tech', 'software', 'router'],
    'facility': ['water', 'leak', 'heater', 'pipe', 'leakage', 'flood', 'bathroom', 'shower', 'dorm', 'hostel', 'room', 'toilet', 'broken', 'repair', 'maintenance', 'light', 'bulb', 'electricity', 'power', 'plug', 'door', 'lock', 'window', 'fan', 'ac', 'air conditioning'],
    'academic': ['grade', 'grading', 'marks', 'exam', 'attendance', 'lecture', 'class', 'course', 'professor', 'teacher', 'assignment', 'syllabus', 'curriculum', 'schedule', 'timetable', 'test'],
    'food': ['food', 'cafeteria', 'canteen', 'lunch', 'chicken', 'meal', 'dine', 'dining', 'kitchen', 'raw', 'undercooked', 'hygiene', 'safety', 'breakfast', 'dinner', 'plate', 'water'],
    'security': ['safe', 'safety', 'security', 'danger', 'suspicious', 'night', 'dark', 'patrol', 'guard', 'threat', 'emergency', 'lock', 'gate', 'stolen', 'theft', 'robbery', 'assault'],
    'finance': ['payment', 'tuition', 'fee', 'charge', 'double', 'refund', 'money', 'bank', 'card', 'transaction', 'bursar', 'scholarship', 'billing', 'receipt', 'invoice']
  };

  for (const category of categories) {
    const catLower = category.toLowerCase();
    let score = 0;

    // Exact direct matching adds high weight
    if (cleanText.includes(catLower)) {
      score += 10;
    }

    // Dictionary keywords matching
    for (const [key, keywords] of Object.entries(mappings)) {
      if (catLower.includes(key)) {
        for (const kw of keywords) {
          if (cleanText.includes(kw)) {
            score += 2;
          }
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export async function POST(req: NextRequest) {
  let text = '';
  let categories: string[] = [];

  try {
    const body = await req.json();
    text = body.text;
    categories = body.categories;

    if (!text || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Missing complaint text or categories array' },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert university administrator AI. Classify the following student complaint description into exactly one of the provided categories. 
Categories to choose from: ${JSON.stringify(categories)}

You must return a raw JSON object with exactly two keys:
1. "category": (string) The exact category name matching one of the options provided.
2. "confidence": (number) A decimal value between 0.0 and 1.0 representing your classification confidence.

Do not include any extra text, markdown formatting blocks (like \`\`\`json), or explanations. Return only the raw JSON string.`
      },
      {
        role: 'user',
        content: `Complaint Description: "${text}"`
      }
    ];

    // Attempt Grok API call (5 seconds timeout per attempt)
    const result = await callGrok(messages, true, 5000);
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from LLM');
    }

    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Case-insensitive robust matching to align exactly with the registered category name
    const llmCategory = parsed.category || '';
    const matchedCategoryName = categories.find(
      c => c.toLowerCase().trim() === llmCategory.toLowerCase().trim()
    ) || categories[0];

    return NextResponse.json({
      category: matchedCategoryName,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
      fallback: false
    });

  } catch (error: any) {
    console.warn('[API Classify] Downstream LLM error or Connect Timeout. Triggering local keyword fallback...', error.message || error);

    if (categories && categories.length > 0 && text) {
      const fallbackCategory = localKeywordClassify(text, categories);
      console.log(`[API Classify Fallback] Classified as "${fallbackCategory}" (confidence: 0.60)`);
      
      return NextResponse.json({
        category: fallbackCategory,
        confidence: 0.60,
        fallback: true,
        warning: 'AI system is currently in network fallback mode. Categorization completed via local heuristics.'
      });
    }

    return NextResponse.json(
      { error: error.message || 'Internal Server Error during classification' },
      { status: 500 }
    );
  }
}
