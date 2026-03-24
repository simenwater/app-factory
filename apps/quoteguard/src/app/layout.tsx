import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuoteGuard — 自由职业者报价与边界管理工具",
  description:
    "帮助自由职业者和小型企业标准化报价、管理客户期望、礼貌拒绝无偿工作请求。",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
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
    <html lang="zh" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased dark:bg-bg-dark dark:text-text-dark">
        <ThemeProvider>
          <main className="mx-auto min-h-screen max-w-lg pb-20">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
