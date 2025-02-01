import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Izzat Jamal",
  description: "Izzat Jamal - Full-Stack Developer",
  icons: {
    icon: [
      {
        url: "/android-chrome.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    shortcut: { url: "/android-chrome.png", type: "image/png" },
    apple: {
      url: "/android-chrome.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            className="![transform:translate3d(0,0,0)] !right-4 sm:!-right-24"
            toastOptions={{
              style: {
                padding: "8px 12px",
                width: "fit-content",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
