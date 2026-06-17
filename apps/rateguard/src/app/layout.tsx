import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateGuard - AI 定价助手",
  description:
    "帮助自由职业者和小企业主自动定价与筛选客户，避免被低价压榨",
};

/**
 * RootLayout - 应用根布局
 * @param props.children - 子组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
