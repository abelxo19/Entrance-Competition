import { beforeEach, describe, expect, it } from "vitest";
import { useExamStore } from "@/store/exam-store";

describe("useExamStore", () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it("selects answers and toggles flags", () => {
    const store = useExamStore.getState();

    store.selectAnswer(3, "option-b");
    store.toggleFlag(3);

    expect(useExamStore.getState().selectedAnswers[3]).toBe("option-b");
    expect(useExamStore.getState().flaggedQuestions).toContain(3);

    useExamStore.getState().toggleFlag(3);
    expect(useExamStore.getState().flaggedQuestions).not.toContain(3);
  });

  it("resets exam progress", () => {
    const store = useExamStore.getState();

    store.setCurrentQuestion(5);
    store.selectAnswer(5, "option-a");
    store.toggleReview(5);
    store.reset();

    const resetState = useExamStore.getState();
    expect(resetState.currentQuestion).toBe(1);
    expect(resetState.selectedAnswers).toEqual({});
    expect(resetState.reviewQuestions).toEqual([]);
    expect(resetState.flaggedQuestions).toEqual([]);
  });
});
