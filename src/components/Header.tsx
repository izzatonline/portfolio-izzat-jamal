"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
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
              href="https://www.linkedin.com/in/izzatjamalullail"
              className="hover:opacity-70 transition-opacity"
              target="_blank"
            >
              <span className="hidden sm:inline">LinkedIn</span>
              <Linkedin className="h-5 w-5 sm:hidden" />
            </Link>
            <Link
              href="https://github.com/izzatonline"
              className="hover:opacity-70 transition-opacity"
              target="_blank"
            >
              <span className="hidden sm:inline">Github</span>
              <Github className="h-5 w-5 sm:hidden" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
