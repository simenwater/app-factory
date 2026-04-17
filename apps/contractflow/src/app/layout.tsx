/**
 * @fileoverview 根布局组件
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractFlow - Professional Quotes & Contracts",
  description:
    "Lightweight business management tool for freelancers. Create quotes, contracts, and collect payments effortlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <main className="max-w-lg mx-auto min-h-screen pb-20">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
