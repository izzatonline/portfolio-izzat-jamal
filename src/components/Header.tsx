"use client";

import Link from "next/link";
import { Github, Globe, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const copyEmail = async () => {
    await navigator.clipboard.writeText("izzat.online@gmail.com");
    toast.success("Email copied to clipboard!");
  };

  return (
    <header className="fixed top-0 w-full p-4 backdrop-blur-sm z-50">
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 flex items-center justify-between">
        <div>
          <button
            onClick={copyEmail}
            className="text-sm hover:opacity-70 transition-opacity"
          >
            <span className="sm:inline">izzat.online@gmail.com</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="https://izzatjamal.com"
              className="hover:opacity-70 transition-opacity"
              target="_blank"
              aria-label="Personal website"
            >
              <span className="hidden sm:inline">Website</span>
              <Globe className="h-5 w-5 sm:hidden" aria-hidden />
            </Link>
            <Link
              href="https://www.linkedin.com/in/izzatjamalullail"
              className="hover:opacity-70 transition-opacity"
              target="_blank"
              aria-label="LinkedIn profile"
            >
              <span className="hidden sm:inline">LinkedIn</span>
              <Linkedin className="h-5 w-5 sm:hidden" aria-hidden />
            </Link>
            <Link
              href="https://github.com/izzatonline"
              className="hover:opacity-70 transition-opacity"
              target="_blank"
              aria-label="GitHub profile"
            >
              <span className="hidden sm:inline">Github</span>
              <Github className="h-5 w-5 sm:hidden" aria-hidden />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
