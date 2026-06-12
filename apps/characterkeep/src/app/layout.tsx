import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CharacterKeep - AI 角色一致性守护",
  description:
    "AI 助手帮助长篇小说作者保持角色性格一致性，防止人设崩坏",
};

/**
 * @param props - 布局组件属性
 * @param props.children - 子页面内容
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
