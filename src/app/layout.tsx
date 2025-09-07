import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-bg min-h-screen relative`}
      >
        {/* Global Background Pattern */}
        <AuthProvider>
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton theme="dark" />
          {children}
        </AuthProvider>
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-main) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </body>
    </html>
  );
}
