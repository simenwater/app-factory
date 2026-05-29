import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceFlow AI - 智能语音笔记",
  description: "AI 语音笔记整理工具：将口语录音自动转化为结构化、可编辑的文本",
};

/**
 * @description 根布局组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
