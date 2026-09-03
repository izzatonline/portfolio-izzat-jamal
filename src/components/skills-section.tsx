import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SkillCategory = {
  title: string;
  description: string;
  skills: string[];
};

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend & UI",
    description:
      "Frameworks, languages, styling, and scalable UI architecture.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "JavaScript (ES6+)",
      "TypeScript",
      "React",
      "React 16/18 Integration",
      "Next.js",
      "React Native",
      "Expo",
      "Tailwind CSS",
      "Styled Components",
      "Framer Motion",
      "CSS Architecture",
      "Redux",
      "Zustand",
      "Axios",
      "Module Federation",
      "Webpack",
      "Micro-frontend Architecture",
      "Thin-host Architecture",
      "Design Systems",
      "Component Libraries",
      "Storybook",
    ],
  },
  {
    title: "Backend, APIs & data",
    description:
      "Services, integrations, and persistence across SQL and document stores.",
    skills: [
      "Node.js",
      "Express",
      "REST API",
      "BFF",
      "Strapi",
      "Supabase",
      "Symfony",
      "PostgreSQL",
      "Prisma",
      "MongoDB",
      "SQL",
      "Python",
      "Go",
      "Third-party Integrations",
      "Analytics Integration",
    ],
  },
  {
    title: "Platform, DX & delivery",
    description:
      "Shared packages, release workflows, observability, and production shipping.",
    skills: [
      "Monorepo Architecture",
      "pnpm",
      "Turborepo",
      "Changesets",
      "Developer Tooling",
      "CLI Tooling",
      "MCP Servers",
      "AI Agent Kits",
      "npm Package Publishing",
      "Docker",
      "Kubernetes",
      "GitLab CI/CD",
      "Vercel",
      "Cloudflare",
      "Netlify",
      "Datadog",
      "OpenTelemetry",
      "Xsolla Metrika",
      "Performance Optimization",
    ],
  },
  {
    title: "Quality & collaboration",
    description: "Testing, validation, design handoff, and team enablement.",
    skills: [
      "Playwright",
      "Jest",
      "React Testing Library",
      "Zod",
      "Figma",
      "Git",
      "Jira",
      "Mentoring & Technical Teaching",
    ],
  },
];

export const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Toolbox
          </p>
          <h2
            id="skills-heading"
            className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl"
          >
            The stack I reach for when the system needs to last
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            I pick boring, proven tools for production systems, and sharper
            platform tooling when teams need to move faster without creating
            drift.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {skillCategories.map((category) => (
            <Card
              key={category.title}
              className="bg-background/85 shadow-sm transition-colors hover:border-foreground/30 dark:border-border dark:bg-card dark:hover:border-muted-foreground/45"
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
                <ul
                  className="mt-5 flex list-none flex-wrap gap-2 p-0"
                  aria-label={`${category.title} skills`}
                >
                  {category.skills.map((skill) => (
                    <li key={skill}>
                      <Badge variant="secondary">{skill}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
