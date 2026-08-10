import { createHash } from 'crypto';
import { aiClient, AI_MODEL } from './client';
import { buildGenerationPrompt } from './prompts';
import { safeParseQuestions } from './validate';
import { createClient } from '@/lib/supabase/server';
import type { RawQuestion } from '@/types';

const BATCH_SIZE = 10;
const MAX_RETRIES = 3;

export async function generateQuestions(params: {
  examId: string; examName: string; subjectId: string; subjectName: string;
  chapterNames: string[]; count: number; difficulty: string;
}): Promise<RawQuestion[]> {
  const supabase = createClient();

  // 1) CACHE CHECK
  const cacheKey = createHash('sha256')
    .update(JSON.stringify([params.examId, params.subjectId, params.chapterNames, params.difficulty, params.count]))
    .digest('hex');
  const { data: cached } = await supabase
    .from('ai_generations').select('response').eq('cache_key', cacheKey).maybeSingle();
  if (cached?.response) return cached.response as RawQuestion[];

  // 2) BATCH GENERATION — chhote batches, parallel nahi (rate limit bachao)
  const batches = Math.ceil(params.count / BATCH_SIZE);
  const all: RawQuestion[] = [];
  for (let i = 0; i < batches; i++) {
    const batch = await generateBatch({
      ...params,
      count: Math.min(BATCH_SIZE, params.count - i * BATCH_SIZE),
    });
    all.push(...batch);
    if (all.length >= params.count) break;
  }
  if (all.length === 0) throw new Error('AI ne koi valid question nahi diya');

  // 3) CACHE SAVE
  await supabase.from('ai_generations').upsert(
    {
      cache_key: cacheKey, exam_id: params.examId, subject_id: params.subjectId,
      chapter_ids: params.chapterNames, difficulty: params.difficulty,
      question_count: all.length, response: all,
    },
    { onConflict: 'cache_key' }
  );

  return all.slice(0, params.count);
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
          { role: 'system', content: 'You are an exam question generator. Respond with JSON only. No markdown, no explanation text outside JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        // ⚠️ response_format HATA diya — Pollinations support nahi karta, error de raha tha
      });
      const content = completion.choices[0]?.message?.content ?? '';
      // JSON ko markdown code block se clean karo
      const cleaned = content.replace(/```json|```/g, '').trim();
      const questions = safeParseQuestions(cleaned);
      if (questions) return questions;
    } catch (err) {
      console.error('Batch attempt failed:', (err as Error)?.message);
    }
  }
  return [];
}
