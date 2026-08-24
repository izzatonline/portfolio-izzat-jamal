"use client";

import { Check, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const scrollCode = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-muted/60">
      <div className="flex items-center justify-between gap-2 border-b bg-background/60 px-3 py-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {language || "code"}
        </span>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Scroll code left"
            className="h-7 w-7"
            onClick={() => scrollCode("left")}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Scroll code right"
            className="h-7 w-7"
            onClick={() => scrollCode("right")}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Copy code"
            className="h-7 w-7"
            onClick={copyCode}
            size="icon"
            type="button"
            variant="ghost"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={cn(
          "max-w-full overflow-x-scroll overflow-y-hidden overscroll-x-contain",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
        )}
        tabIndex={0}
      >
        <pre className="w-max min-w-full p-5 text-xs leading-6 text-foreground sm:p-6 sm:text-sm">
          <code className="block whitespace-pre font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
