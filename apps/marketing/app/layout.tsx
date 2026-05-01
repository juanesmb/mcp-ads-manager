import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jumon — Ad platform access for AI agents",
    template: "%s · Jumon"
  },
  description:
    "Connect paid media accounts once. Give Claude and MCP-ready assistants governed access—without rebuilding OAuth for every copilot vendor.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    siteName: "Jumon",
    type: "website"
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "512x512" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-background antialiased">
        <MarketingHeader />
        {children}
      </body>
    </html>
  );
}
