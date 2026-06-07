import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubjectResult } from "@/types/exam";

export function PerformanceCard({ result }: { result: SubjectResult }) {
  const percentage = Math.round((result.score / result.total) * 100);
  const TrendIcon =
    result.trend === "up" ? ArrowUp : result.trend === "down" ? ArrowDown : Minus;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{result.subject}</CardTitle>
          <span className="flex size-8 items-center justify-center rounded-md bg-muted">
            <TrendIcon className="size-4 text-primary" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{percentage}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.score} of {result.total} correct
        </p>
      </CardContent>
    </Card>
  );
}
