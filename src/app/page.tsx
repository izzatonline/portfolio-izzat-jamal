"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";
import { SkillsSection } from "@/components/skills-section";
import { Projects } from "@/components/projects";
import { Hero } from "@/components/hero";
import { Learning } from "@/components/learning";
import { FreelanceRates } from "@/components/freelance-rates";
import { Experience } from "@/components/experience";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen bg-background">
        <Header />

        <main className="flex flex-col gap-24">
          <Hero />

          {/* Skills Section */}
          <SkillsSection />

          <Experience />

          {/* Projects Section */}
          <div id="projects">
            <Projects />
          </div>

          {/* Learning Section */}
          <div id="learning">
            <Learning />
          </div>

          <FreelanceRates />

          {/* Contact Section */}
          <section className="w-full px-4 pb-24 sm:px-8 md:px-16 lg:px-24">
            <Card className="mx-auto max-w-6xl border-foreground/15 bg-foreground text-background shadow-lg dark:border-border dark:bg-card dark:text-foreground">
              <CardContent className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                <div className="max-w-2xl">
                  <p className="mb-3 text-sm font-medium text-background/70 dark:text-accent-foreground">
                    Let&apos;s work together
                  </p>
                  <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">
                    Have a web app, platform, or design system to ship?
                  </h2>
                  <p className="mt-4 text-base leading-7 text-background/75 dark:text-muted-foreground">
                    Send the current workflow, product idea, or engineering
                    problem. I&apos;ll help shape it into a clear build plan.
                  </p>
                </div>
                <Button size="lg" variant="secondary" asChild>
                  <a href="mailto:izzat.online@gmail.com">
                    Email me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t px-4 py-8 text-sm text-muted-foreground sm:px-8 md:px-16 lg:px-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Izzat Jamal. Built in Kuala Lumpur, Malaysia.</p>
            <div className="flex gap-4">
              <Link
                href="https://www.linkedin.com/in/izzatjamalullail"
                className="hover:underline"
                target="_blank"
              >
                LinkedIn
              </Link>
              <Link
                href="https://github.com/izzatonline"
                className="hover:underline"
                target="_blank"
              >
                Github
              </Link>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
