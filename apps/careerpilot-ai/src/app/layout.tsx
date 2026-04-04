/**
 * @fileoverview 应用根布局 — 包含主题、导航和全局样式
 */
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CareerPilot AI - Smart Resume Optimizer & Job Tracker",
  description:
    "AI-powered resume optimization, JD matching analysis, and job application tracking for job seekers.",
  manifest: "/manifest.json",
};

/**
 * @param props - 页面子组件
 * @returns 应用根 HTML 结构
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
