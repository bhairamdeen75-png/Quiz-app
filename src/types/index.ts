export type QuestionType = 'mcq' | 'true_false' | 'multi_select' | 'integer';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionSource = 'preloaded' | 'ai' | 'pdf';
export type AnswerMode = 'instant' | 'final';
export type TestStatus = 'in_progress' | 'completed' | 'expired';
export type LiveTestStatus = 'upcoming' | 'live' | 'closed';

export interface Exam {
  id: string; slug: string; name: string; description: string | null; icon: string | null;
}

export interface Subject {
  id: string; exam_id: string; name: string; order_no: number;
}

export interface Chapter {
  id: string; subject_id: string; name: string; order_no: number;
}

export interface ExamRule {
  exam_id: string; duration_minutes: number; per_question_seconds: number;
  correct_marks: number; negative_marks: number; total_questions: number;
}

export interface Question {
  id: string; exam_id: string; subject_id: string | null; chapter_id: string | null;
  type: QuestionType; question_text: string; options: string[];
  correct_index: number; correct_value: number | null; hint: string | null; explanation: string | null;
  difficulty: Difficulty; source: QuestionSource; is_approved: boolean;
}

export interface PublicQuestion {
  id: string; type: QuestionType; question_text: string; options: string[]; difficulty: Difficulty;
}

export interface Test {
  id: string; user_id: string; exam_id: string; subject_id: string | null;
  source: QuestionSource; title: string; status: TestStatus;
  question_ids: string[]; answer_mode: AnswerMode; duration_seconds: number;
  started_at: string; completed_at: string | null;
  score: number | null; max_score: number | null;
  correct_count: number | null; wrong_count: number | null;
  skipped_count: number | null; accuracy: number | null;
}

export interface TestAnswer {
  id: string; test_id: string; question_id: string;
  user_answer: number | null; is_correct: boolean | null; time_taken_seconds: number | null;
}

export interface RawQuestion {
  question: string; options: string[]; correct_index: number;
  hint?: string; explanation?: string; chapter?: string; difficulty?: Difficulty;
}

export interface LiveTest {
  id: string;
  exam_id: string;
  test_series_id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  exams?: { slug: string; name: string } | null;
  test_series?: { duration_minutes: number | null; description: string | null } | null;
}

export interface LiveTestAttempt {
  id: string;
  live_test_id: string;
  exam_slug: string;
  user_id: string;
  student_name: string;
  student_class: string | null;
  score: number | null;
  max_score: number | null;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  accuracy: number | null;
  is_ranked: boolean;
  submitted_at: string;
}
