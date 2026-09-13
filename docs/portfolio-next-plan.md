# Portfolio improvement roadmap

Status: implementation started with the user’s instruction to begin this roadmap. The first service and case-study stage is implemented locally; deployment is pending.

## Progress

- [x] Add the three service groups to the homepage, with scope, deliverables, and links to relevant work.
- [x] Add Services and Case studies to the main navigation.
- [x] Keep the existing website prices and add a separate enquiry option for specialist work.
- [x] Implement the `/work` index and design-system, platform SDK, and interactive-portfolio case studies.
- [x] Base employer case studies on existing portfolio content and engineering articles, preserving co-leadership and team ownership.
- [ ] Complete a dedicated review on lower-powered devices and record performance measurements for the world.
- [ ] Deploy the reviewed service and case-study changes.
- [ ] Begin the New Zealand explorer with an audience, core task, bounded scope, and content sources.

Implementation entry points: `src/components/services.tsx`, `src/components/case-study-highlights.tsx`, `src/lib/case-studies.ts`, and `src/app/work/`.

## Direction

Keep the main positioning focused on frontend platforms, design systems, and maintainable web and mobile apps. Use interactive experiences to demonstrate craft and personality, while keeping work, services, rates, and contact details directly accessible.

For every service or showcase, explain:

- The client or user problem it solves.
- The concrete deliverables and scope.
- Evidence of relevant experience: a live example, case study, or documented result.

## Service offering

Organize the services into three groups rather than a flat list of technologies.

### Websites and apps

| Offering                              | Positioning and deliverables                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business websites and custom web apps | Clear content, responsive interfaces, product workflows, integrations, and maintainable delivery.                                                           |
| React Native mobile development       | Define the supported scope and show a working example. Explicitly state whether backend integration and app-store submission are included.                  |
| Deployment and maintenance            | Domain configuration, automated deployments, monitoring, and handover. Cloudflare or Netlify are implementation options, selected for project requirements. |

The existing rate card at `/#rates` already covers landing pages, business websites, custom web apps, and maintenance. Keep that entry point and clarify what each package includes.

### Frontend platforms

| Offering                                 | Positioning and deliverables                                                                                                                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React and React Native design systems    | A flagship service: shared design tokens, accessible components, documentation, release workflows, and support for adoption across products. Explain which foundations are shared and which components are platform-specific. |
| SDKs and npm libraries                   | Help teams share reliable functionality through typed APIs, integration examples, documentation, versioning, automated publishing, and upgrade guidance.                                                                      |
| Microfrontend architecture and migration | Help teams assess, introduce, or improve independently deployed frontend applications where team and product requirements justify the complexity. Include migration planning and shared dependency decisions.                 |

Use **Module Federation with Webpack, Rspack, or Vite** as the technical wording, limited to integrations actually supported and demonstrated. The original term “vitepack” needs clarification before being used in public service copy.

Give specialist platform work a **“Let’s scope your project”** call to action. Do not imply that its scope or pricing is interchangeable with the existing website packages.

### Interactive experiences

| Offering                | Positioning and deliverables                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Interactive 3D websites | Memorable, navigable experiences with accessible routes to the underlying content.                   |
| Destination explorers   | Geographic discovery, destination stories, and potentially itinerary planning.                       |
| Educational games       | Small, polished learning experiences with a specific learning objective and understandable feedback. |

## Showcase projects

### 1. Finish the interactive portfolio world

Keep the world as an optional way to explore the portfolio at `/explore`. The classic portfolio remains a direct route to projects, expertise, rates, and contact information.

Current work includes walking and globe views, animated characters, emotes, jumping, mobile joystick movement, and destination navigation. The coffee emote now has a larger mug and dedicated sip motion. The enlarged fishing pond sits in a separate clearing, with automatic navigation to a far-side dock and a viewer-facing fishing pose. These features have been checked locally; deployment is tracked separately.

Next steps:

- [x] Finish and review the larger coffee mug and dedicated sipping animation.
- [x] Finish and review the fishing pond: first completed cast gets a nibble; the second catches a fish and opens a service-rate promotion.
- [x] Keep the promotion dismissible and keep `/#rates` accessible without playing.
- [ ] Review mobile controls, camera transitions, performance, keyboard access, reduced motion, and the fallback when 3D is unavailable.
- [x] Present the world as a portfolio project with a short explanation of its design and engineering decisions.

### 2. Build a New Zealand explorer after the current world is polished

Treat this as a standalone showcase that demonstrates additional product thinking, not only a change of scenery.

Possible differentiators to choose from:

- Geographic exploration with recognizable locations.
- Destination stories and useful place information.
- A small itinerary-planning workflow.

Next steps:

- [ ] Define the intended audience, main user task, and a small initial scope.
- [ ] Choose a differentiator before building another world.
- [ ] Establish the sources and asset permissions needed for the chosen content.
- [ ] Build a focused working experience and document the decisions behind it.

These differentiators are options to evaluate, not a commitment to build all of them.

### 3. Create an educational game example

- [ ] Pick one audience and one specific learning objective.
- [ ] Build a short, complete interaction with clear instructions and feedback.
- [ ] Explain how the gameplay supports learning; avoid claiming educational results without evidence.
- [ ] Use the example to substantiate the interactive-learning service.

## Repository and domain structure

Use the same domain family with independent repositories and deployments for standalone projects. Repository boundaries and URL structure are separate decisions.

| Project                                           | Repository                            | Proposed address         |
| ------------------------------------------------- | ------------------------------------- | ------------------------ |
| Main portfolio, services, rates, and case studies | Existing portfolio repository         | `izzatjamal.com`         |
| Interactive portfolio world                       | Existing portfolio repository for now | `izzatjamal.com/explore` |
| New Zealand explorer                              | Separate repository and deployment    | `nz.izzatjamal.com`      |
| Educational game                                  | Separate repository and deployment    | `learn.izzatjamal.com`   |

The proposed subdomains are planning suggestions; this document does not provision them.

Subdomains allow standalone projects to have independent releases and hosting configurations. Avoid extracting the existing portfolio world solely to create a separate repository. Revisit that boundary if it becomes a standalone product or needs an independent release lifecycle.

Separate deployments can also be served under paths on the main hostname through reverse-proxy routing. Prefer subdomains for the standalone projects unless a concrete requirement justifies the additional routing and asset-path configuration.

Select Cloudflare or Netlify based on each application's runtime and deployment needs. No hosting migration is required by this plan.

## Case studies and evidence

Implemented locally:

- `/work/cross-platform-design-system` — XUI, based on the existing project description and design-system article.
- `/work/business-accounts-sdk` — platform ownership, thin hosts, packages, and adoption tooling, based on the existing portfolio.
- `/work/interactive-portfolio` — the playable world, controls, navigation, and fishing interaction.

Keep a case study for each significant project on the main portfolio, with a link to its live experience. Each case study should cover:

1. The problem, audience, and constraints.
2. Personal contribution and concrete deliverables.
3. Key design and engineering decisions, including relevant tradeoffs.
4. Results, supported by evidence where available.
5. A live demonstration, suitable screenshots, or public technical material.

Prioritize design-system and SDK case studies because they reinforce the existing specialist positioning. Use only material that can be shared publicly, and avoid inventing metrics or overstating individual ownership of team work.

## Recommended implementation order

1. **Finish the current world.** Complete the ongoing polish, verify usability, and present the result as a coherent showcase.
2. **Strengthen the service descriptions.** Add the three service groups, client-facing deliverables, clear scope, and appropriate calls to action.
3. **Publish strong platform case studies.** Prioritize design systems and SDKs, supported by real experience and evidence.
4. **Build the New Zealand explorer.** Start with a distinct user task and a bounded scope; use a separate repository and proposed subdomain.
5. **Add an educational game example.** Demonstrate a specific learning objective before expanding that offering.

The aim is to balance memorable visuals with the evidence prospective clients need to hire confidently.

## Technical references

- [Module Federation quick start](https://module-federation.io/guide/start/quick-start): separate integrations for Webpack, Rspack, Vite, and other project types.
- [Cloudflare Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/): route a domain or subdomain to a Worker.
- [Netlify rewrites and proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/): route parts of a site to another service when a shared hostname is required.

Recheck the relevant provider documentation when implementing deployment changes.
