import OpenAI from 'openai';

// Pollinations — free, OpenAI-compatible
export const aiClient = new OpenAI({
  baseURL: process.env.POLLINATIONS_BASE_URL ?? 'https://gen.pollinations.ai',
  // Pollinations free tier me koi bhi string chal jati hai, lekin real key better hai
  apiKey: process.env.POLLINATIONS_API_KEY || 'pollinations',
  timeout: 45000,           // 45s timeout — Vercel 60s limit ke andar
  maxRetries: 2,
});

// Pollinations ke current models: 'openai', 'mistral', 'llama', 'qwen'...
export const AI_MODEL = process.env.POLLINATIONS_MODEL || 'openai';
