"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
            <Target className="size-4 text-secondary" aria-hidden="true" />
            Ethiopian Grade 12 University Entrance Prep
          </div>
          <h1 className="text-4xl font-bold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
            Train for entrance exams with calm, measurable progress.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Practice full exams, review flagged questions, track subject gaps,
            and build the confidence Ethiopian students need before test day.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/exam/demo-2015">
                Open Exam Workspace
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/exams">Browse Exam Catalog</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-lg border bg-card p-4 shadow-sm"
          aria-label="Exam workspace preview"
        >
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Mock Exam 2015</p>
              <h2 className="text-lg font-semibold">Natural Science</h2>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-semibold">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              01:18:42
            </div>
          </div>
          <div className="grid gap-4 py-5 md:grid-cols-[150px_1fr]">
            <div className="grid grid-cols-5 gap-2 md:grid-cols-4">
              {Array.from({ length: 20 }, (_, index) => (
                <div
                  key={index}
                  className={
                    index === 4
                      ? "flex aspect-square items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
                      : index < 4
                        ? "flex aspect-square items-center justify-center rounded-md bg-secondary text-sm font-bold text-secondary-foreground"
                        : index === 8
                          ? "flex aspect-square items-center justify-center rounded-md border-2 border-accent text-sm font-bold"
                          : "flex aspect-square items-center justify-center rounded-md border text-sm font-semibold text-muted-foreground"
                  }
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="rounded-lg border bg-background p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  Question 5
                </span>
                <span className="rounded-md bg-accent/20 px-2 py-1 text-xs font-semibold text-accent-foreground">
                  Medium
                </span>
              </div>
              <p className="text-xl font-semibold">
                Which expression represents the derivative of 3x² + 2x?
              </p>
              <div className="mt-5 space-y-3">
                {["6x + 2", "3x + 2", "6x²", "x + 2"].map((option, index) => (
                  <div
                    key={option}
                    className="flex items-center gap-3 rounded-md border bg-card px-4 py-3"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {index === 0 ? (
                      <CheckCircle2 className="ml-auto size-5 text-secondary" aria-hidden="true" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Progress value={42} label="Preview progress" />
        </motion.div>
      </div>
    </section>
  );
}
