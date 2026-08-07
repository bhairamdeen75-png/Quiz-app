import OpenAI from 'openai';

// Pollinations = OpenAI-compatible → sirf base URL badla, SDK wahi OpenAI ka
export const aiClient = new OpenAI({
  baseURL: process.env.POLLINATIONS_BASE_URL ?? 'https://gen.pollinations.ai',
  apiKey: process.env.POLLINATIONS_API_KEY,
});

export const AI_MODEL = process.env.POLLINATIONS_MODEL ?? 'openai';
