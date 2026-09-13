import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe2 } from "lucide-react";
import Header from "@/components/Header";
import { caseStudies } from "@/lib/case-studies";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();
  return {
    title: `${study.title} | Izzat Jamal`,
    description: study.summary,
    alternates: { canonical: `https://izzatjamal.com/work/${study.slug}` },
    openGraph: {
      title: study.title,
      description: study.summary,
      type: "article",
      url: `https://izzatjamal.com/work/${study.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-8">
        <Link
          href="/work"
          className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} aria-hidden /> All case studies
        </Link>
        <article>
          <header>
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              {study.category}
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              {study.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {study.summary}
            </p>
            <dl className="my-9 grid gap-6 border-y py-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  My role
                </dt>
                <dd className="leading-6">{study.role}</dd>
              </div>
              <div>
                <dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Context
                </dt>
                <dd className="leading-6">{study.context}</dd>
              </div>
            </dl>
          </header>
          {study.image ? (
            <figure className="mb-12">
              <Image
                src={study.image}
                alt={study.imageAlt!}
                width={1440}
                height={900}
                sizes="(min-width: 1024px) 960px, 100vw"
                className="h-auto w-full rounded-xl border bg-muted"
                priority
              />
              <figcaption className="mt-3 text-xs text-muted-foreground">
                {study.imageAlt}
              </figcaption>
            </figure>
          ) : (
            <div className="mb-12 flex flex-col items-start gap-5 rounded-xl border bg-emerald-50 p-7 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <Globe2
                  size={52}
                  strokeWidth={1.3}
                  className="shrink-0"
                  aria-hidden
                />
                <p className="max-w-sm text-lg">
                  Five stories, a quiet pond, and a little room to wander.
                </p>
              </div>
              <Link
                href="/explore"
                prefetch={false}
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-emerald-900 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Enter the world <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          )}
          <div className="grid gap-10 md:grid-cols-[170px_minmax(0,1fr)]">
            <aside>
              <nav
                aria-label="Case study sections"
                className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:sticky md:top-28 md:flex-col"
              >
                {[
                  ["challenge", "The challenge"],
                  ["contribution", "My contribution"],
                  ["decisions", "Key decisions"],
                  ["outcome", "What changed"],
                ].map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </aside>
            <div className="min-w-0 space-y-12">
              <section id="challenge" aria-labelledby="challenge-heading">
                <h2
                  id="challenge-heading"
                  className="mb-4 text-2xl font-semibold"
                >
                  The challenge
                </h2>
                <p className="leading-8 text-muted-foreground">
                  {study.challenge}
                </p>
              </section>
              <section id="contribution" aria-labelledby="contribution-heading">
                <h2
                  id="contribution-heading"
                  className="mb-5 text-2xl font-semibold"
                >
                  My contribution
                </h2>
                <ul className="space-y-4">
                  {study.contributions.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 leading-7 text-muted-foreground"
                    >
                      <span
                        className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section id="decisions" aria-labelledby="decisions-heading">
                <h2
                  id="decisions-heading"
                  className="mb-6 text-2xl font-semibold"
                >
                  Key decisions
                </h2>
                <div className="space-y-7">
                  {study.decisions.map((decision, i) => (
                    <div
                      key={decision.title}
                      className="border-l-2 border-primary/25 pl-5"
                    >
                      <p className="mb-2 font-mono text-xs text-muted-foreground">
                        0{i + 1}
                      </p>
                      <h3 className="font-semibold">{decision.title}</h3>
                      <p className="mt-3 leading-7 text-muted-foreground">
                        {decision.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <section id="outcome" aria-labelledby="outcome-heading">
                <h2
                  id="outcome-heading"
                  className="mb-4 text-2xl font-semibold"
                >
                  What changed
                </h2>
                <p className="leading-8 text-muted-foreground">
                  {study.outcome}
                </p>
                <p className="mt-4 leading-8 text-muted-foreground">
                  {study.followThrough}
                </p>
              </section>
              <div className="border-t pt-7">
                <h2 className="mb-4 text-sm font-semibold">
                  Tools & foundations
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {study.stack.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-md bg-muted px-3 py-2 text-xs"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col items-start gap-2">
                  {study.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4"
                    >
                      {link.label}
                      <ArrowRight size={16} aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
        <section className="mt-16 rounded-xl border bg-card p-7 sm:p-9">
          <h2 className="text-2xl font-semibold">Something similar in mind?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Tell me about the product, team, and problem you’re working with. We
            can shape a practical scope together.
          </p>
          <a
            href="mailto:izzat.online@gmail.com?subject=Let%E2%80%99s%20scope%20a%20project"
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Let’s scope your project <ArrowRight size={16} aria-hidden />
          </a>
        </section>
      </main>
    </>
  );
}
