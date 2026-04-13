import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ConfigSync AI - 跨 AI 助手配置文件管理",
  description: "为开发者提供跨 AI 编码助手的标准化项目配置文件生成与管理工具",
};

/**
 * 应用根布局
 * @param props - 子组件
 * @returns JSX 元素
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
