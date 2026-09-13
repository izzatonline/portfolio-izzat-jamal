export type CaseStudy = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  role: string;
  context: string;
  image?: string;
  imageAlt?: string;
  challenge: string;
  contributions: string[];
  decisions: { title: string; text: string }[];
  outcome: string;
  followThrough: string;
  stack: string[];
  links: { label: string; href: string }[];
};

// Summaries drawn from the existing portfolio and published engineering articles.
export const caseStudies: CaseStudy[] = [
  {
    slug: "cross-platform-design-system",
    category: "Design systems · Xsolla",
    title: "One UI foundation for web and native.",
    summary:
      "Helping product teams adopt a shared visual language without maintaining another component library for every platform.",
    role: "One of two technical leads, working with a small team",
    context: "XUI · Publisher Account and Business Accounts",
    image: "/images/xui-storybook.png",
    imageAlt: "XUI component catalogue in Storybook",
    challenge:
      "Several UI libraries served different products, while a new visual language needed to work across web and React Native. Existing applications included older React versions, so adoption could not depend on every team upgrading its stack first.",
    contributions: [
      "Co-led the initial scope, architecture, development, and migration direction for XUI.",
      "Built reusable primitives and component APIs, with design tokens and product context behind a shared provider.",
      "Supported multi-theme adoption and documented components and usage patterns in Storybook.",
      "Helped product teams move toward shared UI foundations while keeping product layouts and workflows in their applications.",
    ],
    decisions: [
      {
        title: "Share the contract; isolate the platform engines.",
        text: "Components use common layout, text, and interaction primitives. The library produces web and native outputs, while DOM and React Native implementation details stay in the platform engines.",
      },
      {
        title: "Make compatibility part of the design.",
        text: "Keeping the React floor at 16.8 and native dependencies optional allowed existing web hosts to consume the library. The build work belongs in the library rather than a new compiler requirement in every application.",
      },
      {
        title: "Ship a usable foundation, then grow adoption.",
        text: "The initial release focused on tokens, a provider, primitives, and a first set of components. It established a place for product teams to migrate without claiming that every control or host migration was finished.",
      },
    ],
    outcome:
      "The team shipped the initial usable library in about a month. Web and native could consume a shared component contract, and product themes could be expressed through the common token architecture rather than a separate kit.",
    followThrough:
      "Component coverage and product migration continued after the initial release. My role was co-leadership of the foundation and migration work; ongoing ownership belongs to the wider team.",
    stack: [
      "React",
      "React Native",
      "TypeScript",
      "Design tokens",
      "Storybook",
      "Package publishing",
    ],
    links: [
      {
        label: "Read the architecture article",
        href: "/blog/one-design-system-every-product",
      },
      {
        label: "Open the public Storybook",
        href: "https://xsolla-ui-toolkit-v2.web.app/",
      },
    ],
  },
  {
    slug: "business-accounts-sdk",
    category: "Frontend platforms · Xsolla",
    title: "A shared SDK behind a suite of account apps.",
    summary:
      "Moving shared platform behaviour into versioned packages, with tooling that helps applications actually adopt each release.",
    role: "Technical leadership and Business Accounts platform SDK ownership",
    context: "A platform used by approximately 25 account apps",
    image: "/images/business-accounts.png",
    imageAlt: "Xsolla Business Accounts product interface",
    challenge:
      "A suite of account applications needs shared routing, authentication, UI, analytics, and release conventions. Keeping that behaviour in application skeletons makes every upgrade a coordination problem across individual hosts.",
    contributions: [
      "Led the SDK monorepo and reusable packages for shell infrastructure, APIs, state, UI, pages, localization, and BFF capabilities.",
      "Drove the thin-host model by moving shared bootstrapping and Module Federation hosting into published packages.",
      "Built CLI tooling, an MCP server, and agent kits to support scaffolding, validation, migration, and upgrades.",
      "Owned package versioning, preview releases, registry publishing, and release-train adoption checks.",
    ],
    decisions: [
      {
        title: "Keep applications focused on their product.",
        text: "Shared routing, federation hosting, polyfills, and authentication bootstrapping belong in SDK packages. Hosts retain the application-specific configuration and product behaviour.",
      },
      {
        title: "Treat adoption as part of a release.",
        text: "A package version changing does not guarantee that the host is wired correctly. Release workflows and validation cover host integration as well as the dependency version.",
      },
      {
        title: "Work with the fleet that exists.",
        text: "Module Federation integration spans React 16 hosts and React 18 remotes. Runtime loading and shared dependency decisions are part of the platform boundary, alongside incremental host migrations.",
      },
    ],
    outcome:
      "The SDK provides shared platform capabilities across approximately 25 account apps. Product teams have versioned packages and tooling for adopting them, alongside common analytics and observability integrations.",
    followThrough:
      "Platform ownership also includes migrations, documentation, shared product surfaces, and support for product engineers. Release tooling and adoption guidance continue alongside the product work.",
    stack: [
      "React",
      "TypeScript",
      "Webpack",
      "Module Federation",
      "pnpm",
      "Turborepo",
      "Changesets",
      "GitLab CI/CD",
    ],
    links: [
      {
        label: "Read the SDK adoption article",
        href: "/blog/stop-ai-syncing-the-starter",
      },
      { label: "See Business Accounts", href: "https://xsolla.com/accounts" },
    ],
  },
  {
    slug: "interactive-portfolio",
    category: "Interactive experiences · Independent build",
    title: "A little world with a reason to explore.",
    summary:
      "An optional, playable route through my portfolio, with five story locations and a fishing pond in its own clearing.",
    role: "Independent project · experience design and implementation",
    context: "Personal portfolio · browser-based 3D",
    challenge:
      "Make a portfolio enjoyable to explore while keeping projects, expertise, and service rates directly accessible. The same world needs to work with a keyboard or touch controls, without making the game a requirement for reading the content.",
    contributions: [
      "Built a spherical world with walking and overview cameras, story destinations, and a separate fishing activity.",
      "Added an animated explorer with emotes, jumping, and a mobile joystick that runs when pushed beyond its outer ring.",
      "Implemented landmark collision boundaries and navigation that walks around obstacles to reachable arrival points.",
      "Connected a completed fishing interaction to a dismissible invitation to view the existing service rate card.",
    ],
    decisions: [
      {
        title: "Keep the classic portfolio one click away.",
        text: "The world lives on its own route and loads its 3D scene on demand. Visitors can return to the regular portfolio, read destination stories directly, or open the rate card without playing.",
      },
      {
        title: "Build controls around the device.",
        text: "Keyboard movement and touch input feed the same movement system. On mobile, a joystick sits at the bottom right, while a compact destination menu keeps navigation out of the main view.",
      },
      {
        title: "Give interaction a clear sequence.",
        text: "Fishing starts by walking to the far-side dock and turning toward the water. The first completed cast gets a nibble; the second catches a fish and opens the service invitation. Interrupted casts do not advance that sequence.",
      },
    ],
    outcome:
      "The working experience combines story discovery, animated character interactions, and a clear route from exploration to services. Mobile interaction checks, collision and navigation checks, and production build checks support the implementation.",
    followThrough:
      "The next iteration will focus on profiling lower-powered devices and understanding which parts of the experience visitors choose to explore.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "Skeletal animation",
      "Pointer controls",
    ],
    links: [
      { label: "Explore the live world", href: "/explore" },
      { label: "See the service rates", href: "/#rates" },
    ],
  },
];
