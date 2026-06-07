export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionStatus = "unanswered" | "answered" | "flagged" | "review";

export interface Subject {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  estimatedHours: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: 12;
  year: number;
  difficulty: Difficulty;
  durationMinutes: number;
  questionCount: number;
  completionRate: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  number: number;
  subject: string;
  difficulty: Difficulty;
  prompt: string;
  options: QuestionOption[];
  answerId: string;
  explanation: string;
}

export interface SubjectResult {
  subject: string;
  score: number;
  total: number;
  trend: "up" | "steady" | "down";
}
