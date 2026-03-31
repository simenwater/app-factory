import type { Metadata, Viewport } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceFlow - 语音笔记智能整理",
  description: "将语音笔记智能整理、重写为清晰结构化文本",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6366f1",
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased">
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
