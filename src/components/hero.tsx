"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const scrollToProjects = () => {
    const projectsSection = document.querySelector("#projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 pt-32">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="relative">
          <Image
            src="/images/izzatjamal-cartoon.png"
            alt="Profile"
            width={240}
            height={240}
            className="rounded-full object-cover object-center w-[160px] h-[160px] sm:w-[240px] sm:h-[240px]"
            priority
          />
          <motion.div
            className="absolute -right-12 sm:-right-16 top-1/4 bg-white dark:bg-white rounded-full px-2 sm:px-4 py-1 sm:py-2 shadow-sm border dark:border-black"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <p className="text-xs sm:text-sm text-black dark:text-black">
              Izzat Jamal 👋
            </p>
          </motion.div>
        </div>

        <div className="mt-16 space-y-6">
          <h2 className="text-xl sm:text-2xl font-medium text-muted-foreground">
            Let&apos;s Build Something Together
          </h2>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="text-foreground">Frontend Developer</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Mid-level Frontend Developer at Xsolla with 2 years of experience in
            React, TypeScript, and Design System. Passionate about building
            robust and user-friendly web applications. Known for collaboration,
            initiative, and solving cross-functional issues like performance
            optimization, refactoring, and integration. Currently exploring
            backend development using Go to become a full-stack engineer.
          </p>

          <Button
            size="lg"
            className="mt-8 rounded-full dark:bg-slate-700 dark:hover:bg-slate-600"
            variant="default"
            onClick={scrollToProjects}
          >
            Latest Projects
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
