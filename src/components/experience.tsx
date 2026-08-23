import { BriefcaseBusiness, GraduationCap, Languages } from "lucide-react";

const roles = [
  {
    title: "Frontend Engineer",
    company: "Xsolla",
    period: "Jan 2024 - Present",
    description:
      "Technical leader and owner of the Business Accounts platform SDK used by approximately 25 account apps, leading architecture direction, thin-host migrations, shared packages, CLI and MCP tooling, analytics, release trains, design systems, and observability.",
  },
  {
    title: "Project Engineer",
    company: "Interstate Solutions Sdn. Bhd.",
    period: "Jul 2019 - Mar 2023",
    description:
      "Managed engineering project execution from planning through delivery, coordinating stakeholders, reporting progress, resolving issues, and maintaining quality and timelines.",
  },
  {
    title: "Technical Support Engineer",
    company: "Security Marketing Sdn. Bhd.",
    period: "Jun 2018 - Jun 2019",
    description:
      "Provided technical support, troubleshooting, customer training, and post-installation support for enterprise systems.",
  },
];

const credentials = [
  {
    icon: <GraduationCap className="h-5 w-5" aria-hidden />,
    title: "Mechanical & Manufacturing Engineering",
    detail: "University of New South Wales, Australia - 2018",
  },
  {
    icon: <Languages className="h-5 w-5" aria-hidden />,
    title: "Languages",
    detail: "English - highly proficient. Malay - native speaker.",
  },
];

export function Experience() {
  return (
    <section
      id="experience"
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <BriefcaseBusiness className="h-6 w-6" aria-hidden />
          <h2 id="experience-heading" className="text-3xl font-bold">
            Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {roles.map((role) => (
              <article
                key={`${role.company}-${role.title}`}
                className="rounded-lg border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {role.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {role.company}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.period}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            {credentials.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-border/60 bg-muted/40 p-5"
              >
                <div className="mb-3 flex items-center gap-3 text-foreground">
                  {item.icon}
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.detail}
                </p>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
