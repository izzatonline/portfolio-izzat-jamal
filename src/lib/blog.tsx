import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const blogDirectory = path.join(process.cwd(), "src/content/blog");

function slugifyHeading(text: string) {
  return text
    .replace(/[`*_]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return {
      metadata: {},
      content: source,
    };
  }

  const metadata = match[1].split("\n").reduce<Record<string, string>>(
    (acc, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      acc[key] = value;
      return acc;
    },
    {}
  );

  return {
    metadata,
    content: match[2],
  };
}

export function getBlogPost(slug: string): BlogPost {
  const filePath = path.join(blogDirectory, `${slug}.md`);
  const source = fs.readFileSync(filePath, "utf8");
  const { metadata, content } = parseFrontmatter(source);

  return {
    slug,
    title: metadata.title ?? slug,
    description: metadata.description ?? "",
    date: metadata.date ?? "",
    content: content.replace(/^# .+\n+/, ""),
  };
}

export function getAllBlogPosts(): BlogPost[] {
  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => getBlogPost(fileName.replace(/\.md$/, "")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function getPostHeadings(content: string): BlogHeading[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^#{2,3}\s/, "");

      return {
        id: slugifyHeading(text),
        text: text.replace(/[`*_]/g, ""),
        level,
      };
    });
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokenPattern =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="break-words rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        nodes.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {linkMatch[1]}
          </a>
        );
      }
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{renderInline(token.slice(1, -1))}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks: ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const headingText = line.slice(4);
      blocks.push(
        <h3
          key={`h3-${i}`}
          id={slugifyHeading(headingText)}
          className="mb-4 mt-12 scroll-mt-28 text-2xl font-semibold tracking-normal text-foreground"
        >
          {renderInline(headingText)}
        </h3>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const headingText = line.slice(3);
      blocks.push(
        <h2
          key={`h2-${i}`}
          id={slugifyHeading(headingText)}
          className="mb-5 mt-16 scroll-mt-28 text-3xl font-bold tracking-normal text-foreground first:mt-0"
        >
          {renderInline(headingText)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }

      i += 1;

      if (language === "mermaid") {
        continue;
      }

      blocks.push(
        <figure
          key={`code-${i}`}
          className="my-14 w-full min-w-0 max-w-full [&+figure]:mt-20 [&+h2]:mt-20 [&+p]:mt-12"
        >
          <CodeBlock code={codeLines.join("\n")} language={language} />
        </figure>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }

      blocks.push(
        <ul
          key={`ul-${i}`}
          className="my-8 list-disc space-y-3 pl-6 leading-8 text-muted-foreground"
        >
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i += 1;
      }

      blocks.push(
        <ol
          key={`ol-${i}`}
          className="my-8 list-decimal space-y-3 pl-6 leading-8 text-muted-foreground"
        >
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines = [line];
    i += 1;

    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !lines[i].trim().startsWith("- ") &&
      !/^\d+\.\s/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push(
      <p
        key={`p-${i}`}
        className="my-7 leading-9 text-muted-foreground first:mt-0"
      >
        {renderInline(paragraphLines.join(" "))}
      </p>
    );
  }

  return <div className="text-lg">{blocks}</div>;
}
