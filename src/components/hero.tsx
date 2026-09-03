"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    value: "25+",
    label: "account apps supported",
  },
  {
    value: "React 16/18",
    label: "federated platform work",
  },
  {
    value: "Web + Native",
    label: "design system coverage",
  },
];

export function Hero() {
  const scrollToProjects = () => {
    const projectsSection = document.querySelector("#projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full px-4 pt-32 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div className="max-w-4xl">
          <Badge variant="outline" className="mb-6">
            Available for freelance & consulting
          </Badge>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            I build frontend platforms, design systems, and web apps that teams
            can maintain.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            Senior Frontend Engineer in Kuala Lumpur. I lead Xsolla&apos;s
            Business Accounts platform SDK across shared packages, Module
            Federation, developer tooling, product analytics, observability, and
            cross-platform UI systems.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="mailto:izzat.online@gmail.com">
                Start a project
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToProjects}>
              View work
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden bg-background/85 dark:border-border dark:bg-card">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] border-b bg-muted dark:bg-muted/70">
              <Image
                src="/images/izzatjamal-cartoon.png"
                alt="Izzat Jamal"
                fill
                className="object-contain p-8"
                priority
              />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Izzat Jamal
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Senior Frontend Engineer · Kuala Lumpur, Malaysia
                </p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/blog">Read the blog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="bg-background/80 shadow-none dark:border-border dark:bg-card"
            >
              <CardContent className="p-5">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
