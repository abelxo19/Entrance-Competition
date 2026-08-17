import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";

describe("useKeyboardNavigation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls navigation handlers for arrow keys and flag shortcut", () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const onFlag = vi.fn();

    renderHook(() =>
      useKeyboardNavigation({
        onNext,
        onPrevious,
        onFlag,
      }),
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "f" }));

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onFlag).toHaveBeenCalledTimes(1);
  });

  it("ignores shortcuts while typing in an input", () => {
    const onNext = vi.fn();
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    renderHook(() =>
      useKeyboardNavigation({
        onNext,
        onPrevious: vi.fn(),
        onFlag: vi.fn(),
      }),
    );

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(onNext).not.toHaveBeenCalled();
    input.remove();
  });
});
