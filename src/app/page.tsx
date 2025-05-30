"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Image from "next/image";
import { Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SkillsMarquee } from "@/components/skills-marquee";
import { Projects } from "@/components/projects";
import { Hero } from "@/components/hero";
import { Learning } from "@/components/learning";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex flex-col gap-20">
        <Hero />

        {/* Skills Section */}
        <SkillsMarquee />

        {/* Projects Section */}
        <div id="projects">
          <Projects />
        </div>

        {/* Learning Section */}
        <div id="learning">
          <Learning />
        </div>

        {/* Contact Section */}
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 pb-32">
          <div className="text-center max-w-2xl mx-auto">
            <Image
              src="images/handshake-svgrepo-com.svg"
              alt="Handshake"
              width={64}
              height={64}
              className="mx-auto mb-8"
            />
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
              Tell me about your next project
            </h2>
            <div className="flex gap-4 justify-center">
              <Link href="tel:+60199211059" target="_blank">
                <Button
                  size="lg"
                  className="rounded-full dark:bg-slate-700 dark:hover:bg-slate-600"
                  variant="default"
                >
                  Call Me
                  <Phone className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://wa.me/60199211059" target="_blank">
                <Button
                  size="lg"
                  className="rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white border-0"
                  variant="outline"
                >
                  WhatsApp
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-8 text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <p>© 2025 All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              href="https://www.linkedin.com/in/izzatjamalullail"
              className="hover:underline"
              target="_blank"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/izzatonline"
              className="hover:underline"
              target="_blank"
            >
              Github
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
