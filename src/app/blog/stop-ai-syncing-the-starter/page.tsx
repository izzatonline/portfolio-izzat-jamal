import { BlogPostLayout } from "@/components/blog-post-layout";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("stop-ai-syncing-the-starter");

export const metadata = {
  title: `${post.title} | Izzat Jamal`,
  description: post.description,
};

export default function BlogPostPage() {
  return <BlogPostLayout post={post} />;
}
