"use client";

import { useEffect } from "react";

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onFlag,
}: {
  onNext: () => void;
  onPrevious: () => void;
  onFlag: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;

      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key.toLowerCase() === "f") onFlag();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFlag, onNext, onPrevious]);
}
