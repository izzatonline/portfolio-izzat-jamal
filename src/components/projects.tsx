import { ProjectCard } from "./project-card";

export function Projects() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Work Projects */}
      <div className="mx-auto mb-20 max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Selected work
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
            Platform work across real production systems
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The main work I want to be known for: shared account platforms,
            cross-product UI architecture, design systems, and developer
            tooling used by product teams.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            title="Xsolla - Business Accounts Platform & Shared SDK"
            description="Technical leadership and platform ownership for the Business Accounts SDK used by approximately 25 Xsolla account apps, covering shared packages, thin-host migrations, Module Federation, release trains, analytics, observability, and cross-platform design systems."
            image="/images/business-accounts.png"
            techStack={[
              "React",
              "TypeScript",
              "React 16/18",
              "React Native",
              "Module Federation",
              "Webpack",
              "pnpm",
              "Turborepo",
              "Changesets",
              "MCP",
              "AI Agent Kits",
              "BFF",
              "Design Systems",
              "Storybook",
              "Node.js",
              "Xsolla Metrika",
              "Datadog",
              "OpenTelemetry",
              "GitLab CI/CD",
            ]}
            liveUrl="https://xsolla.com/accounts"
            isWork={true}
            details={{
              overview:
                "Key technical leader and owner of the Business Accounts platform SDK used by approximately 25 account apps across xsolla.com/accounts, focused on architecture direction, migrations, shared platform capabilities, and product-team enablement.",
              responsibilities: [
                "Led the Business Accounts SDK monorepo using pnpm and Turborepo, publishing reusable packages for shell infrastructure, APIs, state management, UI, pages, localization, and BFF across the suite",
                "Drove the thin-host model and skeleton template by moving shared routing, Module Federation hosting, polyfills, and authentication bootstrapping into published SDK packages, then rolling that model out across live Business Account applications",
                "Built the Business Accounts CLI, MCP server, and AI agent kits so humans and coding agents can scaffold, validate, migrate, and upgrade hosts without forking platform code",
                "Owned package versioning, GitLab Package Registry publishing, merge-request preview versions, and release-train upgrades with adoption checks so a package bump includes host wiring rather than only a version number",
                "Designed Module Federation host and remote integration across React 16 hosts and React 18 remotes, including runtime remote loading and shared dependency strategies",
                "Built shared product analytics on Xsolla Metrika, including an event catalogue, sidebar instrumentation, and host adoption rules for consistent product telemetry",
                "Co-led the development and migration of a cross-platform design system for React and React Native with multi-theme support across Publisher Account and Business Accounts",
                "Shipped shared platform product surfaces used across accounts, including projects list and switcher, settings, members, agreements, payouts, login, and legal consent",
                "Implemented frontend and backend observability using Datadog RUM and OpenTelemetry, improving error visibility and correlating application behaviour, logs, and performance traces",
                "Mentored engineers and contributed to internal technical education through Xsolla School",
              ],
              techDetails: [
                "Platform SDK: React, TypeScript, Module Federation, Webpack, BFF, shell infrastructure, shared pages, localization, auth bootstrapping",
                "Developer experience: pnpm, Turborepo, Changesets, GitLab Package Registry, preview package versions, release trains, CLI, MCP server, AI agent kits",
                "Product systems: Xsolla Metrika, Datadog RUM, OpenTelemetry, React Native, multi-theme design system, Storybook",
              ],
            }}
          />
          <ProjectCard
            title="Xsolla - Publisher Account"
            description="Product and platform work across Publisher Account over the past two years, shipping account, onboarding, dashboard, self-service, marketing, and platform surfaces for game business users."
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
              "REST APIs",
              "Analytics",
              "GitLab CI/CD",
            ]}
            liveUrl="https://publisher.xsolla.com"
            isWork={true}
            details={{
              overview:
                "Long-running product contribution across Publisher Account, balancing feature delivery, reusable UI architecture, CMS-driven content, third-party integrations, and performance-focused frontend work.",
              responsibilities: [
                "Built and improved user-facing account, onboarding, dashboard, and self-service experiences for publisher workflows",
                "Implemented CMS-driven content patterns and integrations that helped product and marketing teams ship content more consistently",
                "Worked across frontend and backend boundaries using React, TypeScript, Strapi, REST APIs, and deployment workflows",
                "Improved shared layouts and product surfaces through reusable components, code splitting, optimized data fetching, and reliable error handling",
              ],
              techDetails: [
                "Frontend: React, TypeScript, Module Federation, Webpack, Tailwind CSS, Styled Components",
                "CMS and integrations: Strapi, REST APIs, analytics, validation, error handling",
                "Delivery: GitLab CI/CD, performance optimization, product and marketing collaboration",
              ],
            }}
          />
          <ProjectCard
            title="Xsolla - XUI Design System"
            description="Cross-platform design system work for React and React Native applications, with reusable primitives, multi-theme support, Storybook documentation, and adoption across Publisher Account and Business Accounts."
            image="/images/xui-storybook.png"
            techStack={[
              "React",
              "React Native",
              "TypeScript",
              "Storybook",
              "Design Tokens",
              "Component APIs",
              "Multi-theme UI",
              "Styled Components",
              "Package Publishing",
            ]}
            liveUrl="https://xsolla-ui-toolkit-v2.web.app/"
            isWork={true}
            details={{
              overview:
                "Co-led design system development and migration work, creating reusable UI foundations that support consistent product experiences across Xsolla web and mobile surfaces.",
              responsibilities: [
                "Built reusable primitives and component APIs for React and React Native applications",
                "Supported multi-theme adoption across Publisher Account and Business Accounts products",
                "Documented components and usage patterns in Storybook for engineers and designers",
                "Helped migrate product teams toward shared UI foundations to reduce duplicated implementation and improve interface consistency",
              ],
              techDetails: [
                "UI systems: React, React Native, TypeScript, Storybook, design tokens, theming",
                "Architecture: reusable primitives, component APIs, cross-platform package design",
                "Adoption: product migration support, documentation, shared design language",
              ],
            }}
          />
        </div>
      </div>

      {/* Personal projects */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Independent builds
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
            Products and experiments I shipped end to end
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            A mix of mobile apps, dashboards, productivity tools, and public
            products where I owned the product shape, interface, and delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            title="Kiddoly"
            description="React Native and Expo caregiving app for families with special-needs children, including communication boards, mood tracking, potty logs, meal tracking, schedules, reminders, reports, household data, and premium feature gating."
            image="/images/kiddoly-collage.png"
            techStack={[
              "React Native",
              "Expo",
              "TypeScript",
              "Supabase",
              "Mobile UX",
              "Premium Features",
            ]}
            liveUrl="https://testflight.apple.com/join/rK7aASnf"
          />
          <ProjectCard
            title="InspectorGecko"
            description="Crypto intelligence dashboard with market screening, watchlists, alert workflows, AI-assisted coin analysis, and research tooling built around CoinGecko data."
            image="/images/inspectorgecko.png"
            techStack={[
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "CoinGecko API",
              "Dashboards",
              "AI Research",
            ]}
            liveUrl="https://inspectorgecko.netlify.app/"
          />
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
            title="SettleHere"
            description="Malaysia home planner: compare a candidate address with commute times to multiple stops, nearby place search (schools, services, and more), routes on the map, and a location score across categories within 5 km."
            image="/images/settlehere.png"
            techStack={[
              "React",
              "TypeScript",
              "Vite",
              "Tailwind CSS",
              "Google Maps",
              "TanStack Query",
              "Zustand",
              "dnd-kit",
            ]}
            liveUrl="https://settlehere.my"
          />
          <ProjectCard
            title="QuranSlide"
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
    </section>
  );
}
