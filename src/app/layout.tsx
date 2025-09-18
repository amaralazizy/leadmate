import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://leadmate.vercel.app"
  ),
  title: "LeadMate — Smarter WhatsApp Conversations",
  description:
    "LeadMate helps businesses provide AI-powered responses on WhatsApp, improving customer engagement and support.",
  keywords: [
    "LeadMate",
    "WhatsApp AI",
    "customer support automation",
    "AI-powered responses",
    "WhatsApp Business",
    "customer engagement",
    "smart replies",
    "24/7 support",
    "streamlined communication",
  ],
  openGraph: {
    title: "LeadMate — Smarter WhatsApp Conversations",
    description:
      "LeadMate helps businesses provide AI-powered responses on WhatsApp, improving customer engagement and support.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadMate — Smarter WhatsApp Conversations",
    description:
      "LeadMate helps businesses provide AI-powered responses on WhatsApp, improving customer engagement and support.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-bg min-h-screen relative dark`}
      >
        <Analytics />
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              duration={4000}
              expand={true}
              richColors={false}
            />
            <ScrollToTop />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
