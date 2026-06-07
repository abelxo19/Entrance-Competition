import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject } from "@/types/exam";

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardHeader>
        <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BookOpen className="size-5" aria-hidden="true" />
        </div>
        <CardTitle>{subject.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {subject.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{subject.questionCount} questions</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            {subject.estimatedHours}h
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
