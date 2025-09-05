import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/shared/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadMate - Smart Lead Management & Automation",
  description:
    "LeadMate helps businesses capture, manage, and automate leads with ease. Streamline your workflow, increase conversions, and never miss an opportunity.",
  keywords: [
    "LeadMate",
    "lead management software",
    "CRM alternative",
    "sales automation",
    "customer engagement",
    "business growth",
    "convert leads",
    "lead tracking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
