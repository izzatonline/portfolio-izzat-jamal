import { BadgeDollarSign, CheckCircle2, Clock3, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const packages = [
  {
    name: "Landing Page",
    price: "RM 2,500+",
    description:
      "A polished one-page website for a campaign, profile, service, or small business.",
    features: [
      "Responsive design and build",
      "Content sections, gallery, and CTA",
      "Basic SEO and performance pass",
      "Deployment support",
    ],
  },
  {
    name: "Business Website",
    price: "RM 4,500+",
    description:
      "A fuller website for businesses that need clearer content, stronger structure, and more trust signals.",
    features: [
      "Up to 5 core pages or sections",
      "Contact or WhatsApp enquiry flow",
      "CMS or content update guidance",
      "Analytics setup",
    ],
    featured: true,
  },
  {
    name: "Custom Web App",
    price: "RM 7,500+",
    description:
      "A tailored product experience with custom logic, dashboards, auth, integrations, or data flows.",
    features: [
      "Product planning and UI architecture",
      "Reusable React components",
      "API and third-party integrations",
      "Testing and handover notes",
    ],
  },
];

const notes = [
  "Travel, booking, or enquiry website: from RM 3,500",
  "Day rate for focused frontend work: RM 650/day",
  "Maintenance and small updates: from RM 350/month",
];

export function FreelanceRates() {
  return (
    <section
      id="rates"
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
      aria-labelledby="rates-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 gap-2">
              <BadgeDollarSign className="h-4 w-4" aria-hidden />
              Freelance rate card
            </Badge>
            <h2
              id="rates-heading"
              className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl"
            >
              Clear starting rates for web projects
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              These are practical starting points for design, frontend
              development, integrations, deployment, and project handover. Final
              pricing depends on scope, timeline, content readiness, and backend
              complexity.
            </p>
          </div>

          <Card className="bg-background/85 shadow-sm dark:border-border dark:bg-card">
            <CardContent className="p-4 text-sm leading-6 text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Clock3 className="h-4 w-4" aria-hidden />
              Typical timeline
            </div>
            <p>1 to 4 weeks depending on scope and feedback speed.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {packages.map((item) => (
            <Card
              key={item.name}
              className={`bg-background/85 shadow-sm transition-colors dark:bg-card/95 ${
                item.featured
                  ? "border-foreground/30 ring-1 ring-foreground/10 dark:border-primary/60 dark:ring-primary/10"
                  : "border-border dark:border-border"
              }`}
            >
              <CardContent className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {item.featured ? (
                  <Badge variant="default">
                    Popular
                  </Badge>
                ) : null}
              </div>

              <p className="mb-6 text-3xl font-bold text-foreground">
                {item.price}
              </p>

              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {item.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                      aria-hidden
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-muted/50 shadow-none dark:border-border dark:bg-muted/45">
          <CardContent className="grid grid-cols-1 gap-4 p-5 text-sm leading-6 text-muted-foreground md:grid-cols-3">
          {notes.map((note) => (
            <div key={note} className="flex gap-3">
              <Handshake
                className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                aria-hidden
              />
              <span>{note}</span>
            </div>
          ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
