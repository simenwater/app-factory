import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeAI Pro — AI-Powered Resume Builder",
  description:
    "Create professional, ATS-optimized resumes in minutes with AI. Multiple templates, PDF & Word export.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

/**
 * @description 根布局组件
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased dark:bg-bg-dark dark:text-text-dark">
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-6 md:pb-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
