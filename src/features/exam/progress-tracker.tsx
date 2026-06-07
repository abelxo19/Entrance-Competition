import { CheckCircle2, Flag, ListChecks } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProgressTracker({
  total,
  answered,
  flagged,
}: {
  total: number;
  answered: number;
  flagged: number;
}) {
  const progress = Math.round((answered / total) * 100);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-2xl font-bold">{progress}%</p>
        </div>
        <ListChecks className="size-6 text-primary" aria-hidden="true" />
      </div>
      <Progress value={progress} label="Answered progress" />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-secondary/10 p-3">
          <CheckCircle2 className="mb-1 size-4 text-secondary" aria-hidden="true" />
          <p className="font-semibold">{answered} answered</p>
        </div>
        <div className="rounded-md bg-accent/15 p-3">
          <Flag className="mb-1 size-4 text-accent" aria-hidden="true" />
          <p className="font-semibold">{flagged} flagged</p>
        </div>
      </div>
    </div>
  );
}
