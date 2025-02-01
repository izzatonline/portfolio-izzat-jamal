"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const DetailsContent = () => (
    <div className="space-y-4">
      {details?.overview && (
        <div>
          <h4 className="font-medium mb-2">Overview</h4>
          <p className="text-sm text-muted-foreground">{details.overview}</p>
        </div>
      )}

      {details?.responsibilities && (
        <div>
          <h4 className="font-medium mb-2">Key Responsibilities</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {details.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
      )}

      {details?.techDetails && (
        <div>
          <h4 className="font-medium mb-2">Tech Stack & Tools</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {details.techDetails.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`
      rounded-lg border bg-card 
      transition-all
      hover:shadow-lg
      dark:shadow-[0_0_15px_rgba(255,255,255,0.07)]
      dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
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
          <div
            className={`relative h-48 ${isWork ? "lg:flex-1 lg:h-auto" : ""}`}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
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

            <p className="text-muted-foreground mb-4">{description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Mobile Expand Button */}
            {details && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? "Show less" : "Show more"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
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
            <div className="hidden lg:block p-6">
              <DetailsContent />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
