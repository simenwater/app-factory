import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoloFlow — 为独立创作者打造的客户与项目管理系统",
  description:
    "专为一人公司设计的轻量级 CRM，集成报价、项目追踪与发票生成。AI 自动生成合同草案与客户跟进邮件。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body className="bg-bg text-text antialiased dark:bg-bg-dark dark:text-text-dark">
        <ThemeProvider>
          <Sidebar />
          <main className="min-h-screen lg:pl-64">
            <div className="mx-auto max-w-7xl px-4 py-6 pt-16 lg:px-8 lg:pt-6">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
