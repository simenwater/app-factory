import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PriceFit AI — 智能 B2B SaaS 定价引擎',
  description: '帮助独立开发者和小团队为 B2B SaaS 产品制定基于价值的定价策略，生成竞品对比矩阵和定价页面文案。',
};

/**
 * @description 根布局组件，支持深色模式
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
