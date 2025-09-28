import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Analytics } from "@vercel/analytics/next";
import {
  OrganizationSchema,
  SoftwareApplicationSchema,
  WebSiteSchema,
  ServiceSchema,
} from "@/components/seo/StructuredData";

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
    process.env.NEXT_PUBLIC_APP_URL || "https://www.leadmate.app"
  ),
  title: {
    default:
      "LeadMate — AI WhatsApp Chatbot for Customer Support & Lead Generation",
    template: "%s | LeadMate",
  },
  description:
    "Transform your WhatsApp customer support with AI automation. LeadMate captures leads, provides 24/7 responses, and automates customer service for small businesses. Start free trial today.",
  keywords: [
    // Primary keywords
    "WhatsApp AI customer support",
    "WhatsApp business automation",
    "AI chatbot for WhatsApp",
    "WhatsApp customer service bot",

    // Long-tail keywords
    "automated WhatsApp customer service",
    "WhatsApp lead capture software",
    "24/7 WhatsApp support bot",
    "small business WhatsApp automation",
    "AI-powered customer engagement",
    "WhatsApp business API integration",
    "customer support automation tool",
    "lead generation WhatsApp bot",
    "intelligent WhatsApp responses",

    // Industry-specific keywords
    "restaurant WhatsApp ordering system",
    "retail WhatsApp customer service",
    "appointment booking WhatsApp bot",
    "service business WhatsApp automation",

    // Feature-based keywords
    "WhatsApp FAQ automation",
    "customer inquiry management",
    "automated lead qualification",
    "WhatsApp conversation automation",
    "business messaging automation",
    "AI customer service assistant",

    // Brand and competitive
    "LeadMate",
    "WhatsApp Business",
    "customer engagement platform",
    "smart replies",
    "streamlined communication",
  ],
  authors: [{ name: "LeadMate Team" }],
  creator: "LeadMate",
  publisher: "LeadMate",
  category: "Business Software",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.leadmate.app",
    siteName: "LeadMate",
    title:
      "LeadMate — AI WhatsApp Chatbot for Customer Support & Lead Generation",
    description:
      "Transform your WhatsApp customer support with AI automation. Capture leads, provide 24/7 responses, and automate customer service for small businesses. Start free trial today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeadMate - AI WhatsApp Customer Support Automation Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@leadmate_app",
    creator: "@leadmate_app",
    title:
      "LeadMate — AI WhatsApp Chatbot for Customer Support & Lead Generation",
    description:
      "Transform your WhatsApp customer support with AI. Automate responses, capture leads, and provide 24/7 customer service for small businesses. Start free trial.",
    images: [
      {
        url: "/twitter-image.png",
        alt: "LeadMate - AI WhatsApp Customer Support Automation",
      },
    ],
  },
  alternates: {
    canonical: "https://www.leadmate.app",
  },
  applicationName: "LeadMate",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    // Add these when you get them from Google Search Console, Bing, etc.
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
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

        {/* SEO Structured Data */}
        <OrganizationSchema
          name="LeadMate"
          description="AI-powered WhatsApp customer support automation platform for small businesses"
          url="https://www.leadmate.app"
          logo="https://www.leadmate.app/logo.png"
        />
        <SoftwareApplicationSchema
          url="https://www.leadmate.app"
          name="LeadMate"
          description="Transform your WhatsApp customer support with AI automation. Capture leads, provide 24/7 responses, and automate customer service for small businesses."
        />
        <WebSiteSchema
          url="https://www.leadmate.app"
          name="LeadMate"
          description="AI WhatsApp Customer Support Automation Platform"
        />
        <ServiceSchema
          url="https://www.leadmate.app"
          name="LeadMate"
          description="Professional WhatsApp AI automation services for small businesses, including lead capture, automated responses, and 24/7 customer support."
        />

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
