import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Timer } from "@/features/exam/timer";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the initial countdown from minutes", () => {
    const { container } = render(<Timer minutes={2} />);

    expect(container.querySelector("span")?.textContent).toBe("00:02:00");
  });

  it("counts down every second", () => {
    const { container } = render(<Timer minutes={1} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(container.querySelector("span")?.textContent).toBe("00:00:59");
  });
});
