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
            description="Managing and maintaining the publisher account system for Xsolla platform."
            image="/images/publisher-xsolla.png"
            techStack={[
              "React",
              "Redux",
              "React Query",
              "Styled Components",
              "Material UI",
            ]}
            liveUrl="https://publisher.xsolla.com"
            isWork={true}
            details={{
              overview:
                "A frontend developer specializing in optimizing component performance, refactoring complex logic, and integrating third-party services to enhance user experience. Collaborates closely with backend teams, designers, and product managers to build scalable and maintainable solutions.",
              responsibilities: [
                "Performance Optimization: Improved the rendering efficiency of the topbar and sidebar components",
                "Component Refactoring & Logic Enhancement: Refactored complex routing and layout handling logic",
                "Third-Party Integrations: Led the integration of external analytics and validation APIs",
                "Dynamic UI Implementation: Built features such as dynamic visibility logic for UI elements",
                "Code Quality & Maintenance: Standardized constant naming for better clarity",
                "Cross-Team Collaboration: Worked with designers, UX writers, and product managers",
                "Leadership & Coordination: Stepped in as the primary frontend lead for third-party integrations",
              ],
              techDetails: [
                "Frontend: React, Redux, React Query, Styled Components, Material UI, Xsolla Design System",
                "Backend Collaboration: Axios, API integrations, Symfony",
                "Build & Deployment: Vite, Webpack, GitHub Actions",
                "Performance & Debugging: Chrome DevTools, React Profiler",
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
            title="Quran Slide Generator"
            description="Quran slides generator for teachers and preachers."
            image="/images/quran-slide.png"
            techStack={["Next.js", "Shadcn UI", "Quran.com API"]}
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
            description="Add, Store, Edit, and Delete Employee data."
            image="/images/emp-management.png"
            techStack={[
              "Next.js",
              "Tailwind CSS",
              "Shadcn UI",
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
