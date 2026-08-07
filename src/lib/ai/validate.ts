import { z } from 'zod';

export const RawQuestionSchema = z.object({
  question: z.string().min(5),
  options: z.array(z.string()).min(4).max(4),
  correct_index: z.number().int().min(0).max(3),
  hint: z.string().optional(),
  explanation: z.string().optional(),
  chapter: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export const QuestionSetSchema = z.object({
  questions: z.array(RawQuestionSchema).min(1).max(50),
});

export function safeParseQuestions(raw: string): RawQuestion[] | null {
  try {
    const parsed = JSON.parse(raw);
    const result = QuestionSetSchema.safeParse(parsed);
    return result.success ? result.data.questions : null;
  } catch {
    return null;
  }
}
