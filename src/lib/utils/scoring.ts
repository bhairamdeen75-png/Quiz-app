import type { Question, TestAnswer } from '@/types';

export function computeScore(
  questions: Question[],
  answers: TestAnswer[],
  correctMarks: number,
  negativeMarks: number
) {
  const answerMap = new Map(answers.map((a) => [a.question_id, a]));
  let correct = 0, wrong = 0, skipped = 0, score = 0;

  for (const q of questions) {
    const a = answerMap.get(q.id);
    if (!a || a.user_answer === null) { skipped++; continue; }
    if (a.user_answer === q.correct_index) { correct++; score += correctMarks; }
    else { wrong++; score -= negativeMarks; }
  }

  return {
    score: Math.round(score * 100) / 100,
    maxScore: questions.length * correctMarks,
    correct, wrong, skipped,
    accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0,
  };
}
