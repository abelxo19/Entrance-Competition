import { BarChart3, BookOpenCheck, Brain, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { Card, CardContent } from "@/components/ui/card";
import { SubjectCard } from "@/features/catalog/subject-card";
import { subjects } from "@/lib/data";

const stats = [
  { label: "Practice questions", value: "1,800+" },
  { label: "Mock exams", value: "42" },
  { label: "Subjects covered", value: "6" },
  { label: "Study insights", value: "24/7" },
];

const features = [
  {
    icon: BookOpenCheck,
    title: "Exam-ready workspace",
    description: "Practice with question navigation, flags, review status, and timed sessions.",
  },
  {
    icon: Brain,
    title: "Low-friction learning",
    description: "Clear layouts and focused typography keep attention on the question.",
  },
  {
    icon: BarChart3,
    title: "Performance clarity",
    description: "Track subject trends, strengths, and weaknesses after each attempt.",
  },
  {
    icon: ShieldCheck,
    title: "Accessible by design",
    description: "Keyboard support, high contrast states, and semantic controls are built in.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <main>
        <section className="border-b bg-card">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-background p-5">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold text-primary">Subjects</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">
              Practice across the Ethiopian Grade 12 curriculum.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.slice(0, 6).map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold text-primary">Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal">
                Built for serious preparation without visual noise.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <feature.icon className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
