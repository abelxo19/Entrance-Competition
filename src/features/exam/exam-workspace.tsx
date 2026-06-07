"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/features/exam/question-card";
import { QuestionNavigator } from "@/features/exam/question-navigator";
import { Timer } from "@/features/exam/timer";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { exams, questions } from "@/lib/data";
import { useExamStore } from "@/store/exam-store";

export function ExamWorkspace() {
  const exam = exams[0];
  const {
    currentQuestion,
    selectedAnswers,
    flaggedQuestions,
    reviewQuestions,
    setCurrentQuestion,
    selectAnswer,
    toggleFlag,
  } = useExamStore();

  const question = questions.find((item) => item.number === currentQuestion) ?? questions[0];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const goNext = useCallback(() => {
    setCurrentQuestion(Math.min(currentQuestion + 1, questions.length));
  }, [currentQuestion, setCurrentQuestion]);

  const goPrevious = useCallback(() => {
    setCurrentQuestion(Math.max(currentQuestion - 1, 1));
  }, [currentQuestion, setCurrentQuestion]);

  const handleFlag = useCallback(() => {
    toggleFlag(currentQuestion);
  }, [currentQuestion, toggleFlag]);

  useKeyboardNavigation({
    onNext: goNext,
    onPrevious: goPrevious,
    onFlag: handleFlag,
  });

  return (
    <main className="min-h-screen bg-muted/35">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon" aria-label="Back to catalog">
                <Link href="/exams">
                  <ArrowLeft aria-hidden="true" />
                </Link>
              </Button>
              <div>
                <p className="text-sm text-muted-foreground">Grade 12 Entrance Exam</p>
                <h1 className="text-lg font-semibold sm:text-xl">{exam.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer minutes={exam.durationMinutes} />
              <Button asChild variant="outline">
                <Link href="/results">
                  <LogOut aria-hidden="true" />
                  Exit
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={progress} label="Exam completion progress" />
            <span className="min-w-fit text-sm font-semibold">
              {answeredCount}/{questions.length}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <QuestionNavigator
          questions={questions}
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
          flaggedQuestions={flaggedQuestions}
          reviewQuestions={reviewQuestions}
          onSelect={setCurrentQuestion}
        />
        <section aria-label="Question workspace">
          <QuestionCard
            question={question}
            selectedOption={selectedAnswers[currentQuestion]}
            isFlagged={flaggedQuestions.includes(currentQuestion)}
            onSelectOption={(optionId) => selectAnswer(currentQuestion, optionId)}
            onToggleFlag={handleFlag}
            onPrevious={goPrevious}
            onNext={goNext}
            canGoPrevious={currentQuestion > 1}
            canGoNext={currentQuestion < questions.length}
          />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Keyboard shortcuts: left/right arrows move between questions, F toggles flag.
          </p>
        </section>
      </div>
    </main>
  );
}
