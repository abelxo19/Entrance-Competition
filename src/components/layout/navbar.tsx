import { BookOpen, GraduationCap, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/exams", label: "Exam Catalog" },
  { href: "/exam/demo-2015", label: "Workspace" },
  { href: "/results", label: "Results" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg">
            Ethio<span className="text-primary">Entrance</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/exams">
              <BookOpen aria-hidden="true" />
              Start Practice
            </Link>
          </Button>
          <Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
