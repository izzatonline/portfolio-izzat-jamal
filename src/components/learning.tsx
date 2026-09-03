"use client";

import { BookOpen, Code2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type CourseItem = {
  title: string;
  institution: string;
  duration: string;
  icon: React.ReactNode;
  url: string;
  color: string;
};

const courses: CourseItem[] = [
  {
    title: "Certified Associate in Front-end Development",
    institution: "TalentLabs",
    duration: "Aug 2023 – Dec 2023",
    icon: <GraduationCap className="h-6 w-6" aria-hidden />,
    url: "https://www.talentlabs.io",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Data Science Training Program",
    institution: "360DigiTMG",
    duration: "Apr 2022 – Jun 2022",
    icon: <BookOpen className="h-6 w-6" aria-hidden />,
    url: "https://360digitmg.com",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Go Basics",
    institution: "Frontend Masters",
    duration: "Mar 2025 – Apr 2025",
    icon: <Code2 className="h-6 w-6" aria-hidden />,
    url: "https://frontendmasters.com",
    color: "bg-blue-500/10 text-blue-500",
  },
];

export const Learning = () => {
  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Learning
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
            Courses and continuing practice
          </h2>
        </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.title}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
            aria-label={`${course.title} at ${course.institution} (opens in new tab)`}
          >
            <Card className="h-full bg-background/85 shadow-sm transition-colors hover:border-foreground/30 dark:border-border dark:bg-card dark:hover:border-muted-foreground/45">
              <CardContent className="flex h-full items-start gap-4 p-5">
                <div className={`rounded-lg p-2 ${course.color} shrink-0`}>
                  {course.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-foreground/80 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.institution} · {course.duration}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
};
