import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextKit — AI 代理配置文件管理器",
  description: "统一、跨平台的 AGENTS.md 生成与管理工具，让 AI 更懂你的项目。",
};

/**
 * @param props - 子组件
 * @returns 根布局
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
