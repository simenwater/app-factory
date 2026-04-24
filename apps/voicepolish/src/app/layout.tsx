import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "VoicePolish — 语音笔记润色工具",
  description:
    "一键录音转文字，AI 自动润色成邮件、推文或博客草稿，让语音笔记真正可用。",
};

/**
 * @component RootLayout
 * 应用根布局，包含侧边栏、移动端导航和主题切换
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = JSON.parse(localStorage.getItem('voicepolish-storage') || '{}');
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
