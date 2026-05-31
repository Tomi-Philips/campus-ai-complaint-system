import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/ai/embeddings';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
    }

    // Call generateEmbedding which runs in the server context here
    const embedding = await generateEmbedding(text);

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('[API Embeddings] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error during embedding generation' },
      { status: 500 }
    );
  }
}
