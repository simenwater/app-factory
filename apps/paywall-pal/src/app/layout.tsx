import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayWall Pal - Protect Your Time & Get Paid",
  description:
    "AI-powered assistant that identifies free work requests and helps freelancers respond with professional boundaries and paid quotes.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
