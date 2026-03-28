import { ProjectCard } from "./project-card";

export function Projects() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Work Projects */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            title="Xsolla — Publisher Account & Design System"
            description="Senior Frontend Engineer work across the publisher account platform, company-wide design system (xsolla-ui-toolkit), micro-frontend architecture, and a custom Strapi CMS—shipping consistent, accessible UI for marketing and platform teams."
            image="/images/publisher-xsolla.png"
            techStack={[
              "React",
              "TypeScript",
              "Module Federation",
              "Webpack",
              "Design Systems",
              "Tailwind CSS",
              "Styled Components",
              "Strapi",
              "Node.js",
              "REST APIs",
              "Docker",
              "Kubernetes",
              "GitLab CI/CD",
            ]}
            liveUrl="https://publisher.xsolla.com"
            isWork={true}
            details={{
              overview:
                "Technical owner of Xsolla’s company-wide design system and contributor to publisher account initiatives—from reusable primitives and theming to CMS-driven content and third-party analytics integrations.",
              responsibilities: [
                "Technical owner of Xsolla’s new company-wide design system (xsolla-ui-toolkit), building scalable primitive components used across web and mobile applications",
                "Designed frontend system architecture for reusable UI primitives, theming, and shared component APIs to support consistent adoption across teams",
                "Led architectural decisions involving Webpack, Module Federation, and shared libraries to enable scalable micro-frontend development",
                "Built systems that enable rapid shipping of marketing and platform features through reusable components and CMS-driven content patterns",
                "Contributed to a new platform initiative expanding publisher account types to include influencers, business accounts, and community-focused profiles",
                "Developed frontend features supporting onboarding flows, conversion paths, and shared account infrastructure",
                "Designed and implemented a custom CMS using Strapi, including data modeling, authentication, REST APIs, and containerized deployment",
                "Integrated third-party analytics and scoring services, ensuring reliable data flow, validation, and error handling",
                "Improved performance and reliability of shared layouts and components through memoization, code splitting, and optimized data fetching",
                "Collaborated closely with design, product, and marketing stakeholders to deliver high-quality, user-facing web experiences",
                "Lecturer and mentor in Xsolla School, teaching CSS from fundamentals to advanced concepts and mentoring engineers throughout a 4-month project-based program",
              ],
              techDetails: [
                "Frontend: React, TypeScript, design systems, Module Federation, Webpack, Tailwind CSS, Styled Components",
                "Platform & CMS: Strapi, Node.js, REST APIs, Docker, Kubernetes, GitLab CI/CD",
                "Integrations: Third-party analytics, scoring services, validation and error handling",
              ],
            }}
          />
        </div>
      </div>

      {/* Personal projects */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-foreground">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            title="SimpleResume"
            description="Privacy-first resume builder and job application tracker—PDF/DOCX export, pipeline analytics (Sankey), offline-first, optional Google Drive sync."
            image="/images/simpleresume.png"
            techStack={[
              "React",
              "TypeScript",
              "Vite",
              "Tailwind CSS",
              "Zustand",
              "React Router",
              "Recharts",
              "D3",
            ]}
            liveUrl="https://simpleresume.xyz/"
          />
          <ProjectCard
            title="Quranslide"
            description="Quran slides generator for teachers and preachers"
            image="/images/quran-slide.png"
            techStack={[
              "Next.js",
              "Shadcn UI",
              "Tailwind CSS",
              "Zustand",
              "quran.com API",
            ]}
            liveUrl="https://www.quranslide.com"
          />
        </div>
      </div>
    </div>
  );
}
