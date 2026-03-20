import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import { DataSync } from "@/components/DataSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "ValuePricer — B2B SaaS Pricing Strategy Tool",
  description:
    "A smart tool that helps technical founders price B2B SaaS products based on value, not cost.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7c3aed",
};

/**
 * @description Root layout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased dark:bg-bg-dark dark:text-text-dark">
        <AuthProvider>
          <ThemeProvider>
            <DataSync />
            <main className="mx-auto min-h-screen max-w-lg pb-20">
              {children}
            </main>
            <BottomNav />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
