"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function Timer({ minutes = 120 }: { minutes?: number }) {
  const [secondsRemaining, setSecondsRemaining] = useState(minutes * 60);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutesPart = Math.floor((secondsRemaining % 3600) / 60);
  const secondsPart = secondsRemaining % 60;

  return (
    <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-semibold" aria-live="polite">
      <Clock className="size-4 text-primary" aria-hidden="true" />
      <span>
        {hours.toString().padStart(2, "0")}:
        {minutesPart.toString().padStart(2, "0")}:
        {secondsPart.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
