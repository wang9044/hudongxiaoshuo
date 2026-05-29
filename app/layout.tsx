import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midnight Libary",
  description: "在故事与现实的边界，找到只属于你的那本书。一个沉浸式互动小说阅读平台。",
  keywords: ["互动小说", "故事", "阅读", "沉浸式", "interactive fiction"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
