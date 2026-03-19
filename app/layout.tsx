import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { MigrationHandler } from "@/components/MigrationHandler";
import { Suspense } from "react";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://obsidian-master.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Obsidian Master - 30일 옵시디언 학습",
  description: "30일 만에 옵시디언을 마스터하는 체계적 학습 트래커",
  applicationName: "Obsidian Master",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Obsidian Master",
    title: "Obsidian Master - 30일 옵시디언 학습",
    description: "30일 만에 옵시디언을 마스터하는 체계적 학습 트래커",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Obsidian Master - 30일 옵시디언 학습 트래커",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Obsidian Master - 30일 옵시디언 학습",
    description: "30일 만에 옵시디언을 마스터하는 체계적 학습 트래커",
    images: ["/twitter-image"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Suspense>
            <Header />
          </Suspense>
          <MigrationHandler />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
