import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CommentFlow — 网页协作评论工具',
  description: '让团队直接在网页元素上添加、分享和跟踪评论的协作工具',
};

/**
 * @description 根布局 — 包含暗色模式初始化脚本
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
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors min-h-screen">
        {children}
      </body>
    </html>
  );
}
