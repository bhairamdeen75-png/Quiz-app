import { aiClient, AI_MODEL } from './client';
import { buildPdfExtractionPrompt } from './prompts';
import { safeParseQuestions } from './validate';
import type { RawQuestion } from '@/types';

export async function extractQuestionsFromPdfText(
  text: string,
  hasAnswers = true
): Promise<RawQuestion[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await aiClient.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: 'You digitize exam PDFs into structured JSON questions.' },
          { role: 'user', content: buildPdfExtractionPrompt(text, hasAnswers) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,   // extraction me low temperature = accurate
      });
      const questions = safeParseQuestions(completion.choices[0]?.message?.content ?? '');
      if (questions && questions.length > 0) return questions;
    } catch {
      // retry
    }
  }
  throw new Error('PDF se questions extract nahi ho paye');
}
