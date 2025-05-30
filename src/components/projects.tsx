import { ProjectCard } from "./project-card";

export function Projects() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Work Projects */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            title="Publisher Account for Xsolla"
            description="Managing and maintaining the Xsolla Publisher Account; the main tool to configure Xsolla features, as well as to work with analytics and transactions."
            image="/images/publisher-xsolla.png"
            techStack={[
              "React",
              "Redux",
              "React Query",
              "Styled Components",
              "Material UI",
              "TypeScript",
              "Strapi",
              "Node.js",
              "Axios",
              "Tailwind CSS",
              "Vite",
              "Docker",
              "Kubernetes",
              "GitLab CI/CD",
              "Symfony",
            ]}
            liveUrl="https://publisher.xsolla.com"
            isWork={true}
            details={{
              overview:
                "Frontend Developer at Xsolla working on the publisher account system, focusing on performance optimization, component refactoring, and cross-team integrations. Built and maintained a custom CMS using Strapi, handling everything from project setup to deployment.",
              responsibilities: [
                "Custom CMS Development: Built using Strapi – handled project setup, JWT auth, REST APIs, plugins, Docker, Kubernetes, and GitLab CI/CD",
                "Performance & Component Optimization: Refactored Topbar and Sidebar with React.memo and layout-based fetching, improved rendering efficiency",
                "UI/UX Implementation: Created view switcher, dynamic background rendering, and visibility logic for UI elements",
                "API & Third-Party Integration: Handled analytics, scoring APIs, CORS, and acted as entry point for other teams' tools/services",
                "Cross-Team Collaboration: Worked with designers, UX writers, and product managers to deliver scalable solutions",
                "Release Engineering: Managed merge conflicts, test failures, and deployments",
              ],
              techDetails: [
                "Frontend: React, Redux, React Query, Styled Components, Material UI, Xsolla Design System, TypeScript, Tailwind CSS",
                "Backend: Strapi, Node.js, Symfony, REST APIs",
                "DevOps: Docker, Kubernetes, GitLab CI/CD, GitHub Actions",
                "Tools: Axios, Vite, Chrome DevTools, React Profiler",
              ],
            }}
          />
        </div>
      </div>

      {/* Hobby Projects */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-foreground">Hobby</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            title="QuranSlide.com"
            description="Quran slide generator for teachers/preachers"
            image="/images/quran-slide.png"
            techStack={[
              "Next.js",
              "Shadcn UI",
              "Tailwind CSS",
              "Zustand",
              "Quran.com API",
            ]}
            liveUrl="https://quranslide.com"
          />

          <ProjectCard
            title="E-Commerce Website"
            description="E-Commerce Store with Admin Store functionality."
            image="/images/ecommerce-website.png"
            techStack={[
              "Next.js",
              "Tailwind CSS",
              "Shadcn UI",
              "Planetscale",
              "Clerk",
            ]}
            githubUrl="https://github.com/izzatonline/ecommerce-store"
          />

          <ProjectCard
            title="Employee Management App"
            description="CRUD app to manage employees"
            image="/images/emp-management.png"
            techStack={[
              "Next.js",
              "Shadcn UI",
              "Tailwind CSS",
              "Zustand",
              "Supabase",
            ]}
            liveUrl="https://emp-management-app.vercel.app/"
          />
        </div>
      </div>
    </div>
  );
}
