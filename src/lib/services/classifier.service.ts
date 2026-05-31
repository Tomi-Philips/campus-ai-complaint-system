import { classifyComplaint } from '../ai/categorizer';
import { categoryService } from './category.service';

export interface ClassificationResult {
  categoryId: string | null;
  confidence: number;
}

export const classifierService = {
  /**
   * Classifies a text into one of the existing categories based on Grok/Groq semantic matching.
   */
  async classify(text: string): Promise<ClassificationResult> {
    try {
      // 1. Fetch active categories
      const categories = await categoryService.getActiveCategories();
      
      if (categories.length === 0) {
        console.warn('[AI Classifier] No active categories found for classification');
        return { categoryId: null, confidence: 0 };
      }

      // 2. Extract names and run Grok zero-shot classification
      const categoryNames = categories.map(c => c.name);
      const result = await classifyComplaint(text, categoryNames);

      // 3. Find the matched category ID
      const matchedCategory = categories.find(c => c.name === result.category);

      return {
        categoryId: matchedCategory ? matchedCategory.id : null,
        confidence: result.confidence
      };
    } catch (error) {
      console.error('[AI Classifier] Classification error:', error);
      return { categoryId: null, confidence: 0 };
    }
  }
};

