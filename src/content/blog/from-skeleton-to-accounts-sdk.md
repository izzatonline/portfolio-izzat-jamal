---
title: From a skeleton template to Accounts SDK
description: How we stopped AI-syncing the same frontend into 25 Business Accounts — and what happened after we extracted a real platform library in a week.
date: 2026-08-23
---

# From a skeleton template to Accounts SDK

For a while, the Business Accounts “platform” was a **starter repo**.

Every new account began as a copy of the same skeleton template. Shell, routing, authentication bootstrap, Module Federation hosting, shared pages, store, locales — all of it lived in that template, and then it lived again in every copied application. When something in the chrome had to change, the plan was straightforward: fix it in the skeleton, then **sync the same change into every Business Account**.

With AI, that sync got faster. The review did not.

You still ended up staring at thousands of lines of nearly identical diffs, in nearly identical files, across nearly identical apps — and you still had to check that nothing product-specific had been overwritten. That was the operating model. It was also the bottleneck.

I helped the team get out of it by extracting the shared code into a real library — **Accounts SDK** — in about a week. That week did not finish the platform. It made a platform possible. Everything since then has been about making that platform good enough for the **~25 Business Accounts** we are building toward — a handful live today, many more planned — so product teams ship product, and platform fixes land once.

The live accounts sit under [xsolla.com/accounts](https://xsolla.com/accounts/) — for example [Mobile Games](https://xsolla.com/for/mobile-games/account/). I did not build that marketing page. I own the shared frontend those products run on.

## The template was the platform

A skeleton is a good way to start. It is a bad way to *run* twenty-five production frontends.

Once each Business Account had its own Git history, the copies stopped being copies. Login stayed similar until one vertical needed a custom page. Sidebar items drifted. A polyfill landed in three repos and not the others. Remote-module wiring got forked “just for this account.” The template was still the source of truth on paper. In practice, the source of truth was **whichever repo you happened to be in**.

The cost showed up as coordination, not as a single outage:

- A shell or auth fix was never one merge. It was a campaign.
- “Are we on the latest skeleton?” had no honest answer.
- The people who understood the chrome were reviewing the same change over and over, dressed up as twenty-five pull requests.

That is a team problem, not a typing problem. AI does not fix it. AI **accelerates** it.

## Why “just sync with AI” made it worse

The original approach was: keep the skeleton canonical, then use AI to propagate updates into every account, then code-review the result.

On a small surface, that can work. On a full application — routing, webpack, auth cookies, Redux, locales, federated remotes — a “sync” is a huge, noisy diff. Reviewers cannot hold the product-specific bits and the platform bits in their head at the same time. You either rubber-stamp thousands of lines, or you become the bottleneck for every account.

Two failure modes showed up immediately:

1. **The sync overwrites the wrong thing.** A Business Account had a legitimate customization. The next skeleton pass treated it as drift and stomped it.
2. **The sync does not overwrite enough.** A platform bugfix lands in the template and in some hosts, but not the ones that had already diverged too far for a clean patch.

So we were paying for AI generation *and* for human review of generated sameness, without getting a single shared runtime. Faster copying is not a platform.

The real question was: **what must exist once, and what may exist per account?**

Until that line existed, every sync was a guess.

## One week: cut the library out

I pulled the shared chrome out of the skeleton and into **Accounts SDK** — published packages hosts could import instead of copy.

The first extraction was deliberately not a grand redesign. It was a cut:

- Put shell, APIs, store, UI, and pages behind package boundaries.
- Give Business Accounts a dependency they could bump.
- Stop treating “edit the template and splat it everywhere” as the way platform work ships.

A week is enough to get a **real library in the repo, building, and usable** — not enough to migrate every host or invent every tool we have now. That distinction matters. The team did not need a perfect architecture document. They needed somewhere else to put the next shared fix besides twenty-five copies of `src/`.

That was the unlock. After that week, a platform change could be a version, not a code-sync ritual.

## What that solved for the team

The immediate win was review load.

Instead of reading the same three-thousand-line AI sync in Mobile Games, Web Games, Payment Providers, and the rest, engineers could review **one SDK change** and then a small host bump. Product-specific code stayed in the account repo. Shared behaviour stopped pretending to be product-specific.

It also changed who could help:

- Product teams could stay on product surfaces without re-implementing authentication, routing, or the remote loader.
- Platform work stopped depending on whoever happened to remember which hosts were behind.
- The skeleton could shrink back toward what a starter should be: **structure**, not a second copy of the platform.

We still had fat hosts — applications that owned or forked chrome locally. Extraction did not magically thin them. It gave us a destination: import `PlatformShell`, `bootstrapApp`, routing, polyfills, and the shared remote loader from the SDK. Keep sidebar content, product pages, and which remotes are enabled in the Business Account.

That destination is the customization boundary in one sentence: **if the next account would need the same change, it does not belong in the host.**

## The architecture that had to exist

Once the code lived in packages, the hard problems became visible. They were always there. The template had been hiding them inside copy-paste.

**Thin host vs fat host.** A thin Business Account imports shared chrome from `@accounts-sdk/*`. A fat one still owns that chrome in-tree. New accounts should be born thin. Existing ones migrate. You cannot pretend a starter template is a migration strategy.

**React 16 hosts and React 18 remotes.** The shell has to keep a React 16-compatible host for Module Federation, while newer widgets expect React 18 APIs. That means a shared React singleton, polyfills on `window.React`, and being strict about what the host bundles versus what it provides at runtime. This is not a footnote. It is the tax for keeping one platform across old and new UI.

**A package bump is not adoption.** Installing `@accounts-sdk/platform-shell` does not mean the host mounts `PlatformShell`, registered the store slices, or stopped using a local Projects page. We learned to treat “wired” as a separate step from “upgraded”: preview packages on a merge request, doctor checks, and explicit host-adoption notes so a bump includes the wiring, not only the version number.

**The skeleton is not allowed to become a second platform.** If we grow the starter every time something is shared, we are back to syncing. The template stays a snapshot of how to *start*. The SDK stays the place shared behaviour *lives*. (We are now collapsing the starter into the SDK repo for the same reason: two templates is another sync.)

None of that fitted in the first week. The week bought us the right place to solve it.

## After the week: keep making it fit 25 accounts

Extracting the library stopped the bleeding. It did not finish the job.

Since then I have stayed on this as the key technical owner: not because the SDK should be a personal project, but because a multi-app platform still needs someone who will put the next shared thing in the shared place — and who will help the team move hosts toward that place instead of forking again.

That work looks like this in practice:

- **Thin-host migration** — move routing, Module Federation hosting, polyfills, and token bootstrap into published packages; roll that model through live accounts so product teams keep only product-specific surfaces.
- **Developer tooling** — a Business Accounts CLI, an MCP server, and agent kits so humans and coding agents can scaffold, validate, migrate, and upgrade hosts without another thousand-line sync.
- **Release trains** — versioning, a private registry, preview publishes, and upgrade flows so many hosts can take a platform change safely.
- **Shared chrome, not every shared-looking page** — shell, session, the remote loader, APIs, and design-system primitives belong in the library. We also published pages that looked universal (projects, settings, agreements). That ended the sync, then created a new wait: a UI fix in an account still needed a platform bump. The next cut is a smaller SDK for contracts and capabilities; product pages stay a reference the account can copy and own.
- **Analytics and observability** — one event catalogue and host-adoption rules, plus Datadog / OpenTelemetry, so we are not inventing telemetry once per account.

The CLI and the agents are easy to mistake for the architecture. They are the **interface**. If chrome still lives in each repo, a smarter sync still produces a smarter mess. The library is the architecture. The tools exist so the team can use it without waiting on me to edit every host.

I still get asked to add “one more thing” to the platform. That is the job. The measure of success is not that I write every line. It is that the next Business Account does not need a special copy of the shell, and the next platform fix does not need a twenty-five-way AI review.

## What I would tell a team still syncing a template

If you have many product frontends and one starter repo, AI will make the wrong loop feel productive. You will generate the updates. You will spend your senior time reviewing them. You will still not have a single place where a bug dies for everyone.

Do the extraction even when it is imperfect. One week of a real library beats another quarter of synchronized forks.

Then draw the boundary in public, inside the team: what hosts may customize, what they must import, and how you will know a bump was actually adopted. Grow tooling after that, not before.

That is how we got from a skeleton that pretended to be a platform, to Accounts SDK. The library stopped the twenty-five-way review. The next job is to keep the library *small* — a bumpable unit for chrome and contracts — so product UI can live with the product again.
