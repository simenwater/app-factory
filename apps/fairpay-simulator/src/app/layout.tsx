import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FairPay Simulator — Smart Compensation Planning',
  description:
    'AI-powered tool for small business owners to generate fair, above-market compensation plans and simulate their impact on profits and employee retention.',
};

/**
 * @description 根布局，包裹整个应用并注入全局样式
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
