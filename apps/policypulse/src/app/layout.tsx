import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "PolicyPulse — 政策风险雷达",
  description:
    "为小型企业主提供实时、易懂的宏观经济与政策风险预警与解读。AI 驱动的政策风险监测平台。",
};

/**
 * @component RootLayout
 * 应用根布局，包含侧边栏和主题切换
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = JSON.parse(localStorage.getItem('policypulse-storage') || '{}');
                if (stored?.state?.settings?.darkMode) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        <ThemeProvider>
          <Sidebar />
          <MobileNav />
          <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
