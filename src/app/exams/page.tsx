import { Search } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamCard } from "@/features/catalog/exam-card";
import { SubjectCard } from "@/features/catalog/subject-card";
import { exams, subjects } from "@/lib/data";

export default function ExamsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-primary">Exam Catalog</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">
            Find the right practice session for today.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Filter by grade, year, difficulty, and subject to keep preparation precise.
          </p>
        </div>

        <section className="mb-8 rounded-lg border bg-card p-4" aria-label="Exam filters">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_180px_180px]">
            <label className="relative block">
              <span className="sr-only">Search exams</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input className="pl-9" placeholder="Search subject, exam, or year" />
            </label>
            <Select defaultValue="12">
              <SelectTrigger aria-label="Grade selector">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">Grade 12</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger aria-label="Difficulty filter">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-years">
              <SelectTrigger aria-label="Exam year selector">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-years">All years</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2016">2016</SelectItem>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2014">2014</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-normal">Available Exams</h2>
            <p className="text-sm text-muted-foreground">{exams.length} exams</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold tracking-normal">Subject Bank</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
