import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptFlow — AI 编程提示词管理工具',
  description: '面向开发者的 AI 编程提示词工程管理工具，简化 Claude/Cursor 等 AI 编码助手的上下文配置和规范定义',
};

/**
 * @description 根布局组件
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
