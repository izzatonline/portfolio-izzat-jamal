"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Globe2, X } from "lucide-react";
import "./world-launcher.css";

const MiniGlobe = dynamic(() => import("./world-launcher-globe"), {
  ssr: false,
  loading: () => <Globe2 className="world-launcher-fallback" strokeWidth={1} />,
});

export default function WorldLauncher() {
  const [enabled, setEnabled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    // The small scene is optional: let the portfolio render before loading it.
    const timer = window.setTimeout(() => setEnabled(true), 900);
    return () => window.clearTimeout(timer);
  }, []);
  if (!enabled || dismissed) return null;
  return (
    <aside
      className="world-launcher"
      aria-label="Interactive portfolio shortcut"
    >
      <Link
        href="/explore"
        prefetch={false}
        className="world-launcher-link"
        aria-label="Explore my 3D world"
      >
        <span className="world-launcher-orbit" aria-hidden="true">
          <MiniGlobe />
        </span>
        <span className="world-launcher-label">
          <span className="world-launcher-label-desktop">Explore my world</span>
          <span className="world-launcher-label-mobile">Explore</span>
          <ArrowUpRight size={15} aria-hidden />
        </span>
      </Link>
      <button
        type="button"
        className="world-launcher-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Hide world shortcut"
      >
        <X size={12} aria-hidden />
      </button>
    </aside>
  );
}
