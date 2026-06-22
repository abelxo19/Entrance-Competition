"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const navigatorItems = [
  { number: 1, state: "answered" },
  { number: 2, state: "answered" },
  { number: 3, state: "answered" },
  { number: 4, state: "answered" },
  { number: 5, state: "current" },
  { number: 6, state: "empty" },
  { number: 7, state: "flagged" },
  { number: 8, state: "empty" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-[#f7f9fc] dark:bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background px-3 py-1.5 text-sm font-semibold text-primary shadow-sm">
            <Trophy className="size-4 text-accent" aria-hidden="true" />
            National Mock Championship · 10,000 ETB Prize
          </div>
          <p className="mb-3 text-sm font-bold uppercase text-secondary">
            The Ultimate Matric Survival Hub
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-normal text-primary sm:text-5xl lg:text-6xl">
            Crack the Matric with a smarter study system.
          </h1>
          <p className="mt-4 text-lg font-semibold text-foreground">
            ማትሪክን ክራክ ማድረጊያ ብቸኛው ዲጂታል መድረክ!
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            High-yield summaries, formula shortcuts, English exam traps, and a
            true-to-life timed mock portal, all built around Ethiopia&apos;s Grade
            12 entrance exam.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/exams">
                Join the Championship
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-background">
              <Link href="/#vault">
                <BookOpenCheck aria-hidden="true" />
                Explore the Study Vault
              </Link>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-secondary" aria-hidden="true" />
              Grades 9-12 distilled
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4 text-secondary" aria-hidden="true" />
              Group discounts available
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -left-3 top-8 hidden h-[82%] w-3 rounded-l-md bg-secondary lg:block" />
          <div className="overflow-hidden rounded-lg border bg-card shadow-[0_22px_60px_rgba(20,43,75,0.14)]">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-secondary">
                  Live Exam Preview
                </p>
                <h2 className="mt-1 font-semibold">National Mock Championship</h2>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-bold text-primary">
                <Clock3 className="size-4" aria-hidden="true" />
                01:18:42
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[150px_1fr]">
              <div className="border-b bg-muted/35 p-4 lg:border-b-0 lg:border-r">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">
                  Questions
                </p>
                <div className="grid grid-cols-4 gap-2 lg:grid-cols-3">
                  {navigatorItems.map((item) => (
                    <div
                      key={item.number}
                      className={
                        item.state === "current"
                          ? "flex aspect-square items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
                          : item.state === "answered"
                            ? "flex aspect-square items-center justify-center rounded-md bg-secondary text-sm font-bold text-secondary-foreground"
                            : item.state === "flagged"
                              ? "flex aspect-square items-center justify-center rounded-md border-2 border-accent bg-background text-sm font-bold"
                              : "flex aspect-square items-center justify-center rounded-md border bg-background text-sm font-semibold text-muted-foreground"
                      }
                    >
                      {item.number}
                    </div>
                  ))}
                </div>
                <div className="mt-6 hidden space-y-2 text-xs text-muted-foreground lg:block">
                  <p>4 answered</p>
                  <p>1 flagged</p>
                  <p>3 remaining</p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    Physics · Question 5
                  </span>
                  <span className="rounded-md bg-accent/20 px-2 py-1 text-xs font-bold text-accent-foreground">
                    Medium
                  </span>
                </div>
                <p className="mt-5 text-xl font-semibold leading-8">
                  A body accelerates uniformly at 4 m/s² for 5 seconds. How far
                  does it travel from rest?
                </p>
                <div className="mt-5 space-y-3">
                  {["25 m", "40 m", "50 m", "80 m"].map((option, index) => (
                    <div
                      key={option}
                      className={
                        index === 2
                          ? "flex items-center gap-3 rounded-md border border-secondary bg-secondary/5 px-4 py-3"
                          : "flex items-center gap-3 rounded-md border bg-background px-4 py-3"
                      }
                    >
                      <span
                        className={
                          index === 2
                            ? "flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground"
                            : "flex size-8 items-center justify-center rounded-full bg-muted text-sm font-bold"
                        }
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {index === 2 ? (
                        <CheckCircle2
                          className="ml-auto size-5 text-secondary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Progress value={62} label="Exam preview progress" />
                  <span className="text-xs font-bold text-muted-foreground">5/8</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
