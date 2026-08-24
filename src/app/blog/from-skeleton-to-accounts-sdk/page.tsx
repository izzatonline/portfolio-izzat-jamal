import Link from "next/link";
import Header from "@/components/Header";
import { ThreeBackground } from "@/components/three-background";
import {
  formatPostDate,
  getBlogPost,
  MarkdownContent,
} from "@/lib/blog";

const post = getBlogPost("from-skeleton-to-accounts-sdk");

export const metadata = {
  title: `${post.title} | Izzat Jamal`,
  description: post.description,
};

export default function BlogPostPage() {
  return (
    <>
      <ThreeBackground />
      <div className="relative min-h-screen bg-background/50">
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 sm:px-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to blog
          </Link>

          <article className="mt-10 rounded-lg border border-border/60 bg-background/90 p-6 shadow-sm backdrop-blur sm:p-10">
            <p className="text-sm text-muted-foreground">
              {formatPostDate(post.date)}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {post.description}
            </p>

            <div className="mt-10 border-t pt-4">
              <MarkdownContent content={post.content} />
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
