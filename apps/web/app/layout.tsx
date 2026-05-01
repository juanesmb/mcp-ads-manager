import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jumon",
  description: "MCP Ads Manager",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "512x512" }],
  },
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
