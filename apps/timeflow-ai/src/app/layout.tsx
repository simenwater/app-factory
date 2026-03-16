import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TimeFlow AI - 智能时间线生成工具',
  description: '通过文本描述快速生成美观的时间线图表，专为技术文档和项目汇报设计',
};

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
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors">
        {children}
      </body>
    </html>
  );
}
