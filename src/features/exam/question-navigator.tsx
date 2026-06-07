"use client";

import { Flag } from "lucide-react";
import { ProgressTracker } from "@/features/exam/progress-tracker";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/exam";

export function QuestionNavigator({
  questions,
  currentQuestion,
  selectedAnswers,
  flaggedQuestions,
  reviewQuestions,
  onSelect,
}: {
  questions: Question[];
  currentQuestion: number;
  selectedAnswers: Record<number, string>;
  flaggedQuestions: number[];
  reviewQuestions: number[];
  onSelect: (questionNumber: number) => void;
}) {
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <aside className="sticky top-20 space-y-4">
      <ProgressTracker
        total={questions.length}
        answered={answeredCount}
        flagged={flaggedQuestions.length}
      />
      <section className="rounded-lg border bg-card p-4" aria-labelledby="question-navigation-heading">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="question-navigation-heading" className="font-semibold">
              Question Bank
            </h2>
            <p className="text-sm text-muted-foreground">
              Select, flag, or revisit.
            </p>
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">
            {questions.length} total
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
          {questions.map((question) => {
            const isCurrent = question.number === currentQuestion;
            const isAnswered = Boolean(selectedAnswers[question.number]);
            const isFlagged = flaggedQuestions.includes(question.number);
            const isReview = reviewQuestions.includes(question.number);

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onSelect(question.number)}
                aria-label={`Go to question ${question.number}${isAnswered ? ", answered" : ", unanswered"}${isFlagged ? ", flagged" : ""}`}
                className={cn(
                  "relative flex aspect-square min-h-10 items-center justify-center rounded-md border text-sm font-bold transition-colors focus-ring",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  !isCurrent && isAnswered && "border-secondary bg-secondary text-secondary-foreground",
                  !isCurrent && isReview && "border-accent bg-accent/25 text-accent-foreground",
                  !isCurrent && !isAnswered && !isReview && "bg-background text-muted-foreground hover:bg-muted",
                  isFlagged && "border-2 border-accent",
                )}
              >
                {question.number}
                {isFlagged ? (
                  <Flag
                    className="absolute -right-1 -top-1 size-3 fill-accent text-accent"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="mt-5 space-y-2 border-t pt-4 text-sm text-muted-foreground">
          <LegendItem label="Current" className="bg-primary" />
          <LegendItem label="Answered" className="bg-secondary" />
          <LegendItem label="Flagged" className="border-2 border-accent" />
          <LegendItem label="Review Needed" className="bg-accent/30" />
          <LegendItem label="Unanswered" className="border bg-background" />
        </div>
      </section>
    </aside>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-3 rounded-sm", className)} aria-hidden="true" />
      {label}
    </div>
  );
}
