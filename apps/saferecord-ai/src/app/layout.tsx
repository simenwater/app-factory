import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'SafeRecord AI - 永不中断的智能录音',
  description: '专业防中断录音应用，内置 AI 转录，一键访问历史转录文本',
  manifest: '/manifest.json',
};

/**
 * @description 根布局组件，包含主题提供者
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
