export interface AIClassificationResult {
  category: string;
  confidence: number;
  allScores?: Record<string, number>;
}

export interface AISimilarityResult {
  score: number;
  isDuplicate: boolean;
  matchId?: string;
}

export interface AIModelConfig {
  task: string;
  model: string;
}
