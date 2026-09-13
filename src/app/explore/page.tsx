import type { Metadata } from "next";
import WorldExplorer from "@/components/world/world-explorer";

export const metadata: Metadata = {
  title: "Explore my world | Izzat Jamal",
  description:
    "Take a little walk through Izzat Jamal’s world. Discover his story, frontend platforms, projects, and ideas on an interactive 3D planet.",
};

export default function ExplorePage() {
  return <WorldExplorer />;
}
