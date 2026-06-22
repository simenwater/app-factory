import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateGuard — 专业报价守护者",
  description: "AI 助手：自动筛选不合理请求，生成专业报价",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7c3aed",
};

/**
 * @description 根布局 — 提供主题、底部导航和全局样式
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground">
        <ThemeProvider>
          <main className="mx-auto max-w-lg px-4 pb-20 pt-6">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
