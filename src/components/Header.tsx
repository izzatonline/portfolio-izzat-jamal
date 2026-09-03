"use client";

import Link from "next/link";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Github,
  Linkedin,
  Menu,
  Newspaper,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const navItems = [
    {
      href: "/blog",
      label: "Blog",
      icon: Newspaper,
    },
    {
      href: "/#rates",
      label: "Rates",
      icon: BadgeDollarSign,
    },
    {
      href: "/#experience",
      label: "Experience",
      icon: BriefcaseBusiness,
    },
    {
      href: "https://www.linkedin.com/in/izzatjamalullail",
      label: "LinkedIn",
      icon: Linkedin,
      external: true,
    },
    {
      href: "https://github.com/izzatonline",
      label: "GitHub",
      icon: Github,
      external: true,
    },
  ];

  return (
    <header className="fixed top-0 z-50 w-full p-4 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between gap-3 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="min-w-0">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center gap-3 rounded-md transition-opacity hover:opacity-75"
            aria-label="Go to homepage"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary font-semibold tracking-normal text-primary-foreground">
              IJ
            </span>
            <span className="truncate text-sm font-medium text-foreground sm:text-base">
              Izzat Jamal
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex xl:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground xl:h-auto xl:w-auto xl:hover:bg-transparent xl:hover:opacity-70"
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5 xl:hidden" aria-hidden />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
