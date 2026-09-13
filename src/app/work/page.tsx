import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Globe2 } from "lucide-react";
import Header from "@/components/Header";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case studies | Izzat Jamal",
  description:
    "Design systems, platform SDKs, and interactive experiences: the problems, decisions, and contributions behind Izzat Jamal’s work.",
  alternates: { canonical: "https://izzatjamal.com/work" },
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-8">
        <Link
          href="/"
          className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} aria-hidden /> Back to portfolio
        </Link>
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Selected case studies
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          The thinking behind the build.
        </h1>
        <p className="mb-14 mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A closer look at the problems, decisions, and contributions behind
          shared product foundations and independent experiments.
        </p>
        <div className="space-y-8">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="grid overflow-hidden rounded-xl border bg-card md:grid-cols-2"
            >
              {study.image ? (
                <div className="relative min-h-56 bg-muted">
                  <Image
                    src={study.image}
                    alt={study.imageAlt!}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-5"
                  />
                </div>
              ) : (
                <div className="flex min-h-56 items-center justify-center bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Globe2 size={110} strokeWidth={1} aria-hidden />
                </div>
              )}
              <div className="p-7 sm:p-9">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {study.category}
                </p>
                <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  {study.title}
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {study.summary}
                </p>
                <Link
                  href={`/work/${study.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
                >
                  Read case study
                  <span className="sr-only">: {study.title}</span>
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-muted-foreground">Have a similar challenge?</p>
          <Link
            href="/#services"
            className="mt-2 inline-flex min-h-11 items-center gap-2 font-medium"
          >
            Explore my services <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </main>
    </>
  );
}
