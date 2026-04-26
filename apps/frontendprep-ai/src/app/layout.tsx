import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FrontendPrep AI — AI 前端面试模拟教练',
  description: '专为前端开发者设计的 AI 面试教练，模拟真实面试场景并提供 CSS/React 代码反馈',
};

/**
 * @description 根布局组件，提供全局 HTML 结构和深色模式初始化
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
                try {
                  var raw = localStorage.getItem('frontendprep-storage');
                  if (raw) {
                    var parsed = JSON.parse(raw);
                    if (parsed.state && parsed.state.darkMode) {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
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
