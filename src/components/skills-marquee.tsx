"use client";

import { motion } from "framer-motion";

const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "MongoDB",
  "Redux",
  "Node.js",
  "Express",
  "Git",
  "Framer Motion",
  "REST API",
  "PostgreSQL",
  "Prisma",
];

export function SkillsMarquee() {
  return (
    <div className="relative flex overflow-hidden py-12 bg-muted">
      {/* Gradient Overlay Left */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />

      {/* First row of skills */}
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...skills, ...skills].map((skill, i) => (
          <span
            key={i}
            className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {skill}
          </span>
        ))}
      </motion.div>

      {/* Gradient Overlay Right */}
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}
