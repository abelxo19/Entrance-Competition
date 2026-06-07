import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExamState {
  currentQuestion: number;
  selectedAnswers: Record<number, string>;
  flaggedQuestions: number[];
  reviewQuestions: number[];
  setCurrentQuestion: (questionNumber: number) => void;
  selectAnswer: (questionNumber: number, optionId: string) => void;
  toggleFlag: (questionNumber: number) => void;
  toggleReview: (questionNumber: number) => void;
  reset: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      currentQuestion: 1,
      selectedAnswers: {},
      flaggedQuestions: [7, 18],
      reviewQuestions: [4, 12],
      setCurrentQuestion: (questionNumber) =>
        set({ currentQuestion: questionNumber }),
      selectAnswer: (questionNumber, optionId) =>
        set((state) => ({
          selectedAnswers: {
            ...state.selectedAnswers,
            [questionNumber]: optionId,
          },
        })),
      toggleFlag: (questionNumber) =>
        set((state) => ({
          flaggedQuestions: state.flaggedQuestions.includes(questionNumber)
            ? state.flaggedQuestions.filter((item) => item !== questionNumber)
            : [...state.flaggedQuestions, questionNumber],
        })),
      toggleReview: (questionNumber) =>
        set((state) => ({
          reviewQuestions: state.reviewQuestions.includes(questionNumber)
            ? state.reviewQuestions.filter((item) => item !== questionNumber)
            : [...state.reviewQuestions, questionNumber],
        })),
      reset: () =>
        set({
          currentQuestion: 1,
          selectedAnswers: {},
          flaggedQuestions: [],
          reviewQuestions: [],
        }),
    }),
    {
      name: "ethio-entrance-exam-state",
    },
  ),
);
