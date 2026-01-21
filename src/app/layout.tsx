import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Coding Companion",
  description: "An interactive workspace for code exploration, planning, and improvement.",
  metadataBase: new URL("https://agentic-dfaf083c.vercel.app")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface text-foreground`}>{children}</body>
    </html>
  );
}
