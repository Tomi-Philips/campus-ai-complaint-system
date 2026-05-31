import { cosineSimilarity } from './embeddings';
import { AISimilarityResult } from '@/types/ai-classification.types';

/**
 * Detects if a new complaint is a duplicate of existing ones using semantic similarity.
 */
export function detectDuplicates(
  newEmbedding: number[],
  existingComplaints: { id: string; embedding: number[] }[],
  threshold: number = 0.85
): AISimilarityResult {
  let bestMatch = { id: '', score: 0 };

  for (const complaint of existingComplaints) {
    if (!complaint.embedding) continue;
    
    const score = cosineSimilarity(newEmbedding, complaint.embedding);
    if (score > bestMatch.score) {
      bestMatch = { id: complaint.id, score };
    }
  }

  return {
    score: bestMatch.score,
    isDuplicate: bestMatch.score >= threshold,
    matchId: bestMatch.id || undefined
  };
}
