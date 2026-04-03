import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

/**
 * 应用元数据配置
 */
export const metadata: Metadata = {
  title: "BinVisor — Binary Protocol Visualizer",
  description:
    "Visualize binary protocol structures from text specifications. Generate interactive diagrams and export to SVG, PNG, JSON, or Markdown.",
  keywords: [
    "binary protocol",
    "visualizer",
    "network protocol",
    "structure diagram",
    "protocol engineering",
  ],
};

/**
 * 根布局
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
