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
      "Next.js",
      "Tailwind CSS",
      "Styled Components",
      "Framer Motion",
      "CSS Architecture",
      "Redux",
      "Axios",
      "Module Federation",
      "Webpack",
      "Micro-frontend Architecture",
      "Design Systems",
      "Component Libraries",
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
      "Strapi",
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
    title: "Platform & delivery",
    description:
      "Containers, CI/CD, hosting, and performance-focused shipping.",
    skills: [
      "Docker",
      "Kubernetes",
      "GitLab CI/CD",
      "Vercel",
      "Cloudflare",
      "Netlify",
      "Performance Optimization",
    ],
  },
  {
    title: "Collaboration & growth",
    description: "How I work with teams and support other engineers.",
    skills: ["Git", "Jira", "Mentoring & Technical Teaching"],
  },
];

export const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
      aria-labelledby="skills-heading"
    >
      <h2
        id="skills-heading"
        className="text-3xl font-bold mb-8 text-foreground"
      >
        Skills
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <div
            key={category.title}
            className="rounded-xl border border-border/60 bg-muted/20 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {category.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {category.description}
            </p>
            <ul
              className="flex flex-wrap gap-2 list-none p-0 m-0"
              aria-label={`${category.title} skills`}
            >
              {category.skills.map((skill) => (
                <li key={skill}>
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
