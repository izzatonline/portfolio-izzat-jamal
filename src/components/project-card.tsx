"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  Github,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  isWork?: boolean;
  details?: {
    overview?: string;
    responsibilities?: string[];
    techDetails?: string[];
  };
}

export function ProjectCard({
  title,
  description,
  image,
  techStack,
  githubUrl,
  liveUrl,
  isWork,
  details,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isImageOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageOpen]);

  const DetailsContent = () => (
    <div className="space-y-4">
      {details?.overview && (
        <div>
          <h4 className="font-medium mb-2">Overview</h4>
          <p className="text-sm leading-6 text-muted-foreground">
            {details.overview}
          </p>
        </div>
      )}

      {details?.responsibilities && (
        <div>
          <h4 className="font-medium mb-2">Key Responsibilities</h4>
          <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
            {details.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
      )}

      {details?.techDetails && (
        <div>
          <h4 className="font-medium mb-2">Tech Stack & Tools</h4>
          <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
            {details.techDetails.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const ImagePreview = (
    <AnimatePresence>
      {isImageOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
          onClick={() => setIsImageOpen(false)}
        >
          <motion.div
            className="relative h-[86vh] w-full max-w-6xl overflow-hidden rounded-lg bg-background shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setIsImageOpen(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Card
      className={`
        group overflow-hidden bg-background/85 shadow-sm transition-colors hover:border-foreground/30 dark:border-border dark:bg-card dark:hover:border-muted-foreground/45
        ${isWork ? "lg:col-span-3" : ""}
      `}
    >
      <div
        className={`${
          isWork ? "lg:grid lg:grid-cols-2 lg:gap-6 lg:min-h-[600px]" : ""
        }`}
      >
        {/* Main Card Content */}
        <div className={`${isWork ? "lg:flex lg:flex-col" : ""}`}>
          <button
            type="button"
            onClick={() => setIsImageOpen(true)}
            className={`relative block h-56 w-full overflow-hidden border-b bg-muted text-left dark:bg-muted/70 ${
              isWork ? "lg:flex-1 lg:h-auto lg:min-h-[420px]" : ""
            }`}
            aria-label={`View ${title} image`}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes={
                isWork
                  ? "(min-width: 1024px) 50vw, 100vw"
                  : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
              View image
            </span>
          </button>

          <div className="p-5 sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <Badge variant={isWork ? "default" : "secondary"}>
                  {isWork ? "Work" : "Project"}
                </Badge>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground">
                  {title}
                </h3>
              </div>
              <div className="flex gap-2">
                {githubUrl && (
                  <Link
                    href={githubUrl}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {liveUrl && (
                  <Link
                    href={liveUrl}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            <p className="mb-5 text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Mobile Expand Button */}
            {details && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="lg:hidden"
                variant="outline"
                size="sm"
              >
                {isExpanded ? "Show less" : "Show more"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Details Section */}
        {details && (
          <>
            {/* Mobile Details (Expandable) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t">
                      <DetailsContent />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Details (Always Visible) */}
            <div className="hidden border-l p-6 lg:block">
              <DetailsContent />
            </div>
          </>
        )}
      </div>
      {isMounted ? createPortal(ImagePreview, document.body) : null}
    </Card>
  );
}
