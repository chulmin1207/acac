import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "ACAC - AI Creative Automation Center",
  description: "AI 기반 6단계 광고 소재 자동 생성 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-900 transition-colors">
        <ThemeProvider>
          <SessionProvider>
            {children}
            <ThemeToggle />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
