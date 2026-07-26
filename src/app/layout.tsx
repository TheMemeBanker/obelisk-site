import type { Metadata } from "next";
import { Geist, Geist_Mono, Audiowide } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const audiowide = Audiowide({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Obelisk — Monument Designs & Crypto",
  description:
    "Obelisk merges monument design with decentralized finance. Built on ancient principles, powered by $PRELODE.",
  metadataBase: new URL("https://obelisk.fund"),
  openGraph: {
    title: "Obelisk — Monument Designs & Crypto",
    description:
      "Encoded in stone. Secured by math. Explore the monument, decode the glyphs, discover $PRELODE.",
    siteName: "Obelisk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Obelisk — Monument Designs & Crypto",
    description:
      "Encoded in stone. Secured by math. Explore the monument, decode the glyphs, discover $PRELODE.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${audiowide.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
