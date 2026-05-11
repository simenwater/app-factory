import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "PrivPDF - 隐私优先的本地 PDF 工具",
  description:
    "完全在浏览器本地运行的 PDF 工具，无需上传文件。支持合并、分割、签名、OCR 等功能。",
};

/**
 * @description 根布局组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
