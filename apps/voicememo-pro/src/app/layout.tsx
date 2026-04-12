import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "VoiceMemo Pro — AI 语音转专业内容",
  description:
    "将语音备忘录或杂乱草稿，通过 AI 一键重写成 LinkedIn 帖子、博客文章、营销邮件等专业内容。支持多种语气风格。",
};

/**
 * @component RootLayout
 * @description 应用根布局
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
                const stored = JSON.parse(localStorage.getItem('voicememo-pro-storage') || '{}');
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
          <Header />
          <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">
            {children}
          </main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
