import { ArrowRight, BarChart3, Calendar, Timer } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Exam } from "@/types/exam";

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="leading-7">{exam.title}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{exam.subject}</p>
          </div>
          <Badge
            variant={
              exam.difficulty === "Easy"
                ? "secondary"
                : exam.difficulty === "Hard"
                  ? "accent"
                  : "muted"
            }
          >
            {exam.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" aria-hidden="true" />
            {exam.year}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="size-4" aria-hidden="true" />
            {exam.durationMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="size-4" aria-hidden="true" />
            {exam.questionCount} Qs
          </span>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Student completion</span>
            <span className="font-semibold">{exam.completionRate}%</span>
          </div>
          <Progress value={exam.completionRate} label={`${exam.title} completion`} />
        </div>
        <Button asChild className="w-full">
          <Link href={`/exam/${exam.id}`}>
            Start exam
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
