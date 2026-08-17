import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionNavigator } from "@/features/exam/question-navigator";
import type { Question } from "@/types/exam";

const questions: Question[] = [
  {
    id: "q1",
    number: 1,
    subject: "Math",
    difficulty: "Easy",
    prompt: "Question 1",
    options: [{ id: "a", label: "A", value: "a" }],
    answerId: "a",
    explanation: "Because A.",
  },
  {
    id: "q2",
    number: 2,
    subject: "Math",
    difficulty: "Medium",
    prompt: "Question 2",
    options: [{ id: "b", label: "B", value: "b" }],
    answerId: "b",
    explanation: "Because B.",
  },
];

describe("QuestionNavigator", () => {
  it("renders question buttons with accessible labels", () => {
    render(
      <QuestionNavigator
        questions={questions}
        currentQuestion={1}
        selectedAnswers={{ 1: "a" }}
        flaggedQuestions={[2]}
        reviewQuestions={[]}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Go to question 1, answered" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to question 2, unanswered, flagged" }),
    ).toBeInTheDocument();
  });

  it("calls onSelect when a question is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <QuestionNavigator
        questions={questions}
        currentQuestion={1}
        selectedAnswers={{}}
        flaggedQuestions={[]}
        reviewQuestions={[]}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to question 2, unanswered" }));

    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
