import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import Header from "@/components/Header";
import { ThreeBackground } from "@/components/three-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BlogPost,
  formatPostDate,
  getPostHeadings,
  MarkdownContent,
} from "@/lib/blog";

export function BlogPostLayout({ post }: { post: BlogPost }) {
  const headings = getPostHeadings(post.content);

  return (
    <>
      <ThreeBackground />
      <div className="relative min-h-screen bg-background/50">
        <Header />
        <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pb-24 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:pt-32">
          <article className="min-w-0">
            <div className="-ml-2 mb-8 flex flex-wrap items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to blog
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Home</Link>
              </Button>
            </div>

            <Card className="min-w-0 overflow-hidden border-border/70 bg-background/90 shadow-sm backdrop-blur">
              <CardHeader className="space-y-5 p-5 sm:p-8 lg:p-10">
                <Badge variant="outline" className="w-fit">
                  {formatPostDate(post.date)}
                </Badge>
                <div className="space-y-5">
                  <CardTitle className="max-w-4xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 sm:text-lg">
                    {post.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="min-w-0 p-5 sm:p-8 lg:p-10">
                <MarkdownContent content={post.content} />
              </CardContent>
            </Card>
          </article>

          {headings.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <Card className="border-border/60 bg-background/75 shadow-none backdrop-blur">
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm">On this page</CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-4">
                    <nav className="flex flex-col gap-2">
                      {headings.map((heading) => (
                        <Link
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={
                            heading.level === 3
                              ? "pl-3 text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
                              : "text-sm font-medium leading-6 text-muted-foreground transition-colors hover:text-foreground"
                          }
                        >
                          {heading.text}
                        </Link>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </aside>
          ) : null}
        </main>
      </div>
    </>
  );
}
