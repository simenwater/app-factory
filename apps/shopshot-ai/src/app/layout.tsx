import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'ShopShot AI - 电商产品图 AI 生成工具',
  description: '一键生成高质量产品图，多角度展示、背景替换、平台规范尺寸',
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
      <body className="min-h-screen pb-20">
        <ThemeProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 pt-4 pb-24">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
