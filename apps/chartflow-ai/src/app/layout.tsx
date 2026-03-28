import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChartFlow AI - 文本转图表智能工具',
  description:
    '通过自然语言描述自动生成可视化图表，支持流程图、时序图、ER图、甘特图、思维导图等多种格式',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('chartflow-theme');
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
