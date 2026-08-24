import Link from "next/link";
import Header from "@/components/Header";
import { ThreeBackground } from "@/components/three-background";
import { formatPostDate, getAllBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Izzat Jamal",
  description:
    "Notes on frontend platform engineering, product systems, and building software teams can actually maintain.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <ThreeBackground />
      <div className="relative min-h-screen bg-background/50">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-24 pt-32 sm:px-8">
          <section>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Blog
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              Writing about frontend platform work
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Practical notes from building shared frontend systems, design
              systems, developer tooling, and product platforms.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-lg border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur transition-colors hover:border-foreground/30"
              >
                <p className="text-sm text-muted-foreground">
                  {formatPostDate(post.date)}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                  {post.description}
                </p>
              </Link>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
