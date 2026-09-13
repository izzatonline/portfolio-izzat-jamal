import Link from "next/link";
import { ArrowRight, Boxes, Globe2, MonitorSmartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const groups = [
  {
    number: "01",
    title: "Websites & apps",
    icon: MonitorSmartphone,
    intro:
      "A clear, useful product your customers can use and your team can maintain.",
    offers: [
      {
        title: "Websites & web apps",
        text: "Responsive business websites, dashboards, and custom workflows, from interface to integration and handover.",
      },
      {
        title: "React Native apps",
        text: "Mobile interfaces and connected product flows. Backend work and app-store submission are agreed in the project scope.",
      },
      {
        title: "Deployment & maintenance",
        text: "Domain setup, automated deployments, monitoring, and ongoing updates, with Cloudflare or Netlify where appropriate.",
      },
    ],
    evidence: [
      {
        label: "See Kiddoly and independent builds",
        href: "/#independent-builds",
      },
    ],
    cta: "See website starting rates",
    href: "/#rates",
  },
  {
    number: "02",
    title: "Frontend platforms",
    icon: Boxes,
    intro:
      "Shared foundations that help product teams ship without rebuilding the same things.",
    offers: [
      {
        title: "React & React Native design systems",
        text: "Design tokens, accessible components, web and native foundations, documentation, and a practical adoption plan.",
      },
      {
        title: "SDKs & published libraries",
        text: "Typed APIs, integration examples, npm or private-registry publishing, versioning, and automated release workflows.",
      },
      {
        title: "Microfrontend architecture",
        text: "Module Federation with Webpack, shared dependency decisions, and incremental migrations where independent releases help your team.",
      },
    ],
    evidence: [
      {
        label: "Design-system case study",
        href: "/work/cross-platform-design-system",
      },
      { label: "Platform SDK case study", href: "/work/business-accounts-sdk" },
    ],
    cta: "Let’s scope your platform",
    href: "mailto:izzat.online@gmail.com?subject=Frontend%20platform%20project",
  },
  {
    number: "03",
    title: "Interactive experiences",
    icon: Globe2,
    intro:
      "Give people a reason to explore, learn, and spend a little more time with your story.",
    offers: [
      {
        title: "Interactive 3D websites",
        text: "Playable worlds and guided discovery, with mobile controls and a direct route to the underlying content.",
      },
      {
        title: "Destination explorers",
        text: "Scope a focused prototype around geographic discovery, place stories, or a useful visitor journey.",
      },
      {
        title: "Educational games",
        text: "Start with one audience and one learning objective, then build a short experience with clear feedback.",
      },
    ],
    evidence: [
      { label: "Explore the portfolio world", href: "/explore" },
      { label: "Read how it was built", href: "/work/interactive-portfolio" },
    ],
    cta: "Discuss an interactive project",
    href: "mailto:izzat.online@gmail.com?subject=Interactive%20experience%20project",
  },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <Badge variant="outline" className="mb-4">
            Freelance & consulting
          </Badge>
          <h2
            id="services-heading"
            className="text-3xl font-bold tracking-normal sm:text-4xl"
          >
            What I can help you build.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            From a first website to the foundations behind several products.
            We’ll agree on the problem, deliverables, and handover before the
            build begins.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {groups.map(({ icon: Icon, ...group }) => (
            <article
              key={group.number}
              className={`flex flex-col rounded-xl border bg-card p-6 sm:p-7 ${group.number === "02" ? "border-primary/40 shadow-sm" : "border-border"}`}
            >
              <div className="mb-6 flex items-center justify-between text-muted-foreground">
                <Icon size={24} aria-hidden />
                <span className="font-mono text-xs">{group.number}</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {group.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {group.intro}
              </p>
              <dl className="my-7 space-y-6">
                {group.offers.map((offer) => (
                  <div key={offer.title}>
                    <dt className="text-sm font-semibold">{offer.title}</dt>
                    <dd className="mt-2 text-sm leading-6 text-muted-foreground">
                      {offer.text}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto border-t pt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  See the work
                </p>
                <ul className="space-y-1">
                  {group.evidence.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className="inline-flex min-h-11 items-center gap-2 text-sm underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        {link.label}
                        <ArrowRight
                          size={14}
                          className="shrink-0"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={group.href}
                  className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {group.cta}
                  <ArrowRight size={16} className="shrink-0" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
