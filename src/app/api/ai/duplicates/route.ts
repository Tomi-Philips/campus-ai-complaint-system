import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGrok } from '@/lib/ai/grok';

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing title or description' },
        { status: 400 }
      );
    }

    // 1. Fetch recent complaints from Supabase to check duplicates against
    const supabase = await createClient();
    
    // Fetch the 50 most recent complaints (resolved, pending, or under-review)
    const { data: recentComplaints, error: dbError } = await supabase
      .from('complaints')
      .select('id, title, description, created_at, status')
      .order('created_at', { ascending: false })
      .limit(50);

    if (dbError) {
      console.error('[API Duplicates] Database fetch error:', dbError);
      throw dbError;
    }

    if (!recentComplaints || recentComplaints.length === 0) {
      // No complaints to compare against, so not a duplicate
      return NextResponse.json({
        isDuplicate: false,
        confidence: 0,
        matchId: null
      });
    }

    // 2. Format complaints list for LLM context
    const complaintsList = recentComplaints.map((c, i) => ({
      index: i,
      id: c.id,
      title: c.title,
      description: c.description
    }));

    // 3. Ask Grok to evaluate if this is a duplicate
    const messages = [
      {
        role: 'system',
        content: `You are an AI-powered academic administrator and operations auditor. Your task is to detect duplicates in a university complaint reporting system.

A complaint is a DUPLICATE if and only if it reports the EXACT SAME SPECIFIC INCIDENT or issue (e.g. water leak in Hall C Room 214 on the same day, wifi failure in Science Library 3rd floor at the same time).
Similar but unrelated generic complaints (e.g. a different student complaining about their own grading issue in a different class, or a water leak in Hall D Room 102) are NOT duplicates.

You will be given the "New Complaint" and a list of "Existing Recent Complaints" to compare against.
You must return a raw JSON object with exactly three keys:
1. "isDuplicate": (boolean) true if the new complaint is a duplicate of one of the existing ones, false otherwise.
2. "confidence": (number) A decimal value between 0.0 and 1.0 representing your confidence in this decision.
3. "matchId": (string or null) The "id" of the matching duplicate complaint if isDuplicate is true, otherwise null.

Do not include any explanation or extra text. Return only the raw JSON.`
      },
      {
        role: 'user',
        content: `New Complaint:
Title: "${title}"
Description: "${description}"

Existing Recent Complaints list:
${JSON.stringify(complaintsList, null, 2)}`
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

    return NextResponse.json({
      isDuplicate: parsed.isDuplicate || false,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      matchId: parsed.matchId || null,
      fallback: false
    });

  } catch (error: any) {
    console.warn('[API Duplicates] Groq LLM API failure or Connect Timeout. Triggering graceful fallback (marking as non-duplicate to allow submission):', error.message || error);
    return NextResponse.json({
      isDuplicate: false,
      confidence: 0,
      matchId: null,
      fallback: true,
      warning: 'AI system is in network fallback mode. Duplicate detection bypassed to ensure successful submission.'
    });
  }
}
