"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FlagButton } from "@/features/exam/flag-button";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/exam";

export function QuestionCard({
  question,
  selectedOption,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: {
  question: Question;
  selectedOption?: string;
  isFlagged: boolean;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Question {question.number}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{question.subject}</Badge>
              <Badge
                variant={
                  question.difficulty === "Hard"
                    ? "accent"
                    : question.difficulty === "Easy"
                      ? "secondary"
                      : "muted"
                }
              >
                {question.difficulty}
              </Badge>
            </div>
          </div>
          <FlagButton active={isFlagged} onClick={onToggleFlag} />
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-5 sm:p-8">
        <h1 className="text-2xl font-semibold leading-9 tracking-normal sm:text-3xl">
          {question.prompt}
        </h1>

        <fieldset className="space-y-3">
          <legend className="sr-only">Choose one answer</legend>
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-lg border bg-background p-4 text-left transition-colors focus-ring hover:border-primary/50",
                  isSelected && "border-primary bg-primary/5",
                )}
                aria-pressed={isSelected}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold",
                    isSelected && "bg-primary text-primary-foreground",
                  )}
                >
                  {option.label}
                </span>
                <span className="text-base leading-7">{option.value}</span>
                {isSelected ? (
                  <CheckCircle2 className="ml-auto size-5 shrink-0 text-primary" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            Previous
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" disabled={!selectedOption}>
              Save Answer
            </Button>
            <Button type="button" onClick={onNext} disabled={!canGoNext}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
