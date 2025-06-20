import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContexts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News Term 2 - Báo điện tử RSS",
  description: "Website tin tức RSS với Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="favicon.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
