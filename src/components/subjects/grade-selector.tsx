"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const GRADES = [
  {
    grade: 9,
    label: "Grade 9",
    description: "Foundation level",
  },
  {
    grade: 10,
    label: "Grade 10",
    description: "Intermediate level",
  },
  {
    grade: 11,
    label: "Grade 11",
    description: "Advanced level",
  },
  {
    grade: 12,
    label: "Grade 12",
    description: "Entrance preparation",
  },
];

interface GradeSelectorProps {
  subjectId: string;
}

export function GradeSelector({ subjectId }: GradeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {GRADES.map((item) => (
        <Link key={item.grade} href={`/subjects/${subjectId}/notes?grade=${item.grade}`}>
          <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="text-muted-foreground" size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
