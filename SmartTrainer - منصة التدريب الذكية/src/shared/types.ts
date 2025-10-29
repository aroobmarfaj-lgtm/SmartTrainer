import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const QuestionSchema = z.object({
  id: z.number(),
  category_id: z.number().optional(),
  question: z.string(),
  options: z.array(z.string()),
  correct_answer: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  explanation: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ExamSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  category_id: z.number().optional(),
  duration_minutes: z.number(),
  total_questions: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ExamAttemptSchema = z.object({
  id: z.number(),
  exam_id: z.number(),
  user_id: z.string().optional(),
  score: z.number(),
  total_questions: z.number(),
  correct_answers: z.number(),
  time_taken_minutes: z.number(),
  answers: z.record(z.string(), z.number()),
  completed_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const CreateQuestionSchema = z.object({
  category_id: z.number().optional(),
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correct_answer: z.number().min(0),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  explanation: z.string().optional(),
});

export const CreateExamSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category_id: z.number().optional(),
  duration_minutes: z.number().min(1),
  total_questions: z.number().min(1),
});

export const SubmitExamSchema = z.object({
  exam_id: z.number(),
  answers: z.record(z.string(), z.number()),
  time_taken_minutes: z.number(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Exam = z.infer<typeof ExamSchema>;
export type ExamAttempt = z.infer<typeof ExamAttemptSchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type CreateQuestion = z.infer<typeof CreateQuestionSchema>;
export type CreateExam = z.infer<typeof CreateExamSchema>;
export type SubmitExam = z.infer<typeof SubmitExamSchema>;
