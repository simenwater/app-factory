import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentScope — AI 编码代理流量监控",
  description:
    "轻量级 AI 编码代理流量监控工具：实时查看编码助手发送给模型的完整请求和响应",
  keywords: ["AI", "coding agent", "monitoring", "proxy", "Claude Code", "Codex"],
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
