"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FlagButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border-accent/50",
        active && "bg-accent/20 text-accent-foreground",
      )}
    >
      <Flag className={active ? "fill-accent text-accent" : "text-accent"} aria-hidden="true" />
      {active ? "Flagged" : "Flag Question"}
    </Button>
  );
}
