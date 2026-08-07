import { createHash } from 'crypto';
import { aiClient, AI_MODEL } from './client';
import { buildGenerationPrompt } from './prompts';
import { safeParseQuestions } from './validate';
import { createClient } from '@/lib/supabase/server';
import type { RawQuestion } from '@/types';

const BATCH_SIZE = 10;          // Vercel 60s limit ke liye chhote batches
const MAX_RETRIES = 2;

export async function generateQuestions(params: {
  examId: string; examName: string; subjectId: string; subjectName: string;
  chapterNames: string[]; count: number; difficulty: string;
}): Promise<RawQuestion[]> {
  const supabase = createClient();

  // 1) CACHE CHECK — same request dobara AI call nahi (cost killer)
  const cacheKey = createHash('sha256')
    .update(JSON.stringify([params.examId, params.subjectId, params.chapterNames, params.difficulty, params.count]))
    .digest('hex');
  const { data: cached } = await supabase
    .from('ai_generations').select('response').eq('cache_key', cacheKey).maybeSingle();
  if (cached?.response) return cached.response as RawQuestion[];

  // 2) BATCH GENERATION — 10-10 questions ke parallel batches
  const batches = Math.ceil(params.count / BATCH_SIZE);
  const tasks = Array.from({ length: batches }, (_, i) =>
    generateBatch({ ...params, count: Math.min(BATCH_SIZE, params.count - i * BATCH_SIZE) })
  );
  const results = (await Promise.all(tasks)).flat();
  if (results.length === 0) throw new Error('AI ne koi valid question nahi diya');

  // 3) CACHE SAVE
  await supabase.from('ai_generations').upsert(
    {
      cache_key: cacheKey, exam_id: params.examId, subject_id: params.subjectId,
      chapter_ids: params.chapterNames, difficulty: params.difficulty,
      question_count: results.length, response: results,
    },
    { onConflict: 'cache_key' }
  );

  return results;
}

async function generateBatch(params: {
  examName: string; subjectName: string; chapterNames: string[];
  difficulty: string; count: number;
}): Promise<RawQuestion[]> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const prompt = buildGenerationPrompt(params);
      const completion = await aiClient.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: 'You are an exam question generator. Always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });
      const content = completion.choices[0]?.message?.content ?? '';
      const questions = safeParseQuestions(content);
      if (questions) return questions;
    } catch {
      // retry
    }
  }
  return [];
}
