import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://verdikt-kohl.vercel.app"),
  title: "Verdikt — Verify agent deliverables",
  description:
    "Score agent work against a rubric with 0G. Anchor hashes on Hedera. ENS-linked verifier identity.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Verdikt",
    description: "Verify agent deliverables. Verdict on 0G. Proof on Hedera.",
    url: "https://verdikt-kohl.vercel.app",
    siteName: "Verdikt",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
