import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/case-studies";

export function CaseStudyHighlights() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              The work behind the offer
            </p>
            <h2
              id="case-studies-heading"
              className="text-3xl font-bold sm:text-4xl"
            >
              Decisions, delivery, and what changed.
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            All case studies <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="flex flex-col border-t border-foreground/20 py-6"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {study.category}
              </p>
              <h3 className="mt-4 text-xl font-semibold leading-snug">
                {study.title}
              </h3>
              <p className="mb-5 mt-3 text-sm leading-6 text-muted-foreground">
                {study.summary}
              </p>
              <Link
                href={`/work/${study.slug}`}
                className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Read case study<span className="sr-only">: {study.title}</span>
                <ArrowRight size={16} aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
