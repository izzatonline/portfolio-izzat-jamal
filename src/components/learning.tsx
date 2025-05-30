import { BookOpen, Code2, Palette, Zap } from "lucide-react";
import Link from "next/link";

export function Learning() {
  const courses = [
    {
      title: "Frontend Masters",
      description:
        "Deep learning of frontend system design, performance, backend with Go and PHP, and system design for backend",
      icon: <Code2 className="h-6 w-6" />,
      url: "https://frontendmasters.com",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Three.js Journey",
      description:
        "Learning Three.js for creating immersive 3D web experiences",
      icon: <Zap className="h-6 w-6" />,
      url: "https://threejs-journey.com",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Animations.dev",
      description: "Mastering web animations and motion design",
      icon: <Palette className="h-6 w-6" />,
      url: "https://animations.dev",
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "CSS for JavaScript Developers",
      description:
        "Continuous learning of advanced CSS techniques and best practices",
      icon: <BookOpen className="h-6 w-6" />,
      url: "https://courses.joshwcomeau.com/css-for-js",
      color: "bg-green-500/10 text-green-500",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold mb-8 text-foreground">
        Current Learning
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <Link
            key={index}
            href={course.url}
            target="_blank"
            className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-foreground/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2 ${course.color}`}>
                {course.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-foreground/80 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
