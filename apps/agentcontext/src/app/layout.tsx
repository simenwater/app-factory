/**
 * @fileoverview 根布局组件
 */

import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DarkModeProvider } from '@/components/DarkModeProvider';

export const metadata: Metadata = {
  title: 'AgentContext - AI 驱动的代理配置文件生成工具',
  description:
    '一键分析 GitHub 仓库，自动生成标准化的 AGENTS.md / CLAUDE.md / copilot-instructions.md 配置文件，让 AI 编码助手准确理解你的项目。',
  keywords: [
    'AGENTS.md',
    'CLAUDE.md',
    'Cursor',
    'Copilot',
    'AI coding',
    'agent context',
    'code analysis',
  ],
};

/**
 * 根布局
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <DarkModeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}
