export function buildGenerationPrompt(params: {
  examName: string; subjectName: string; chapterNames: string[];
  difficulty: string; count: number;
}): string {
  return `You are a question paper setter for ${params.examName}.
Generate exactly ${params.count} multiple-choice questions for subject "${params.subjectName}".
Chapters to cover: ${params.chapterNames.join(', ') || 'all chapters'}.
Difficulty: ${params.difficulty} — questions MUST match the real ${params.examName} exam level.

Rules:
- Every question has exactly 4 options and exactly 1 correct answer
- correct_index must be 0 to 3 (index of the correct option)
- Give a short HINT (guidance, NOT the answer) and a brief EXPLANATION
- Questions must be unique, exam-relevant, and varied
- Do NOT repeat the same question pattern

Return ONLY valid JSON in this exact shape:
{"questions":[{"question":"...","options":["a","b","c","d"],"correct_index":0,"hint":"...","explanation":"..."}]}`;
}

export function buildPdfExtractionPrompt(text: string, hasAnswers: boolean): string {
  const answerRule = hasAnswers
    ? '- Detect and set correct_index from the PDF answers (option letter/index)'
    : '- PDF me answers nahi hain, to AI khud correct answer identify karo aur hamesha correct_index bharo';
  return `You are a question bank digitizer. Convert the following exam/quiz text into structured JSON questions.

Rules:
- Extract ALL complete questions you can find
- 4 options each, exactly 1 correct
- Give a short hint and a short explanation for each
- Skip incomplete or unreadable fragments
${answerRule}

Return ONLY valid JSON:
{"questions":[{"question":"...","options":["a","b","c","d"],"correct_index":0,"hint":"...","explanation":"..."}]}

PDF TEXT START:
${text.slice(0, 12000)}
PDF TEXT END`;
}
