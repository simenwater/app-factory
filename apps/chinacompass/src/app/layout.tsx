import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChinaCompass — 中国出海企业全球合规AI助手",
  description:
    "为中国出海企业提供全球市场合规AI助手，实时监控目标国家政策变化，提供中文解读和合规建议，降低出海风险。",
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
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Sidebar />
        <MobileNav />
        <main className="md:ml-64 min-h-screen pt-14 md:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
