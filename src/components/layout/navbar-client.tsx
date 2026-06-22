"use client";

import { ArrowRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#vault", label: "Study Vault" },
  { href: "/#subjects", label: "Subjects" },
  { href: "/#pricing", label: "Pricing" },
];

const portalPrefixes = ["/exams", "/exam", "/results"];

export function NavbarClient({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isPortalRoute = portalPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const portalHref = isAuthenticated ? "/exams" : "/auth/login?next=/exams";
  const portalLabel = isAuthenticated ? "My Portal" : "Enter Portal";
  const showPortalAction = !isAuthenticated || !isPortalRoute;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-white">
              <Image
                src="/alpha-tutor-mark.png"
                alt=""
                width={40}
                height={40}
                className="size-10 object-contain"
                priority
              />
            </span>
            <span className="text-lg text-primary">
              Alpha<span className="font-medium text-foreground">Tutor</span>
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
            {showPortalAction ? (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href={portalHref}>
                  {portalLabel}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </div>

        {isOpen ? (
          <div className="space-y-1 border-t py-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            {showPortalAction ? (
              <Button asChild className="mt-2 w-full">
                <Link href={portalHref} onClick={() => setIsOpen(false)}>
                  {portalLabel}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
