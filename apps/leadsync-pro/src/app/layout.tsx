import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadSync Pro",
  description:
    "Lead sheet management for jazz and pop musicians — edit, sync, and share with iReal Pro",
  keywords: ["lead sheet", "iReal Pro", "jazz", "chord chart", "music"],
};

/**
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} 根布局
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider>
          <main className="mx-auto max-w-lg pb-20 pt-4">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
