import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — LeadMate",
  description:
    "Get in touch with LeadMate's team. We're here to help with questions about our AI-powered WhatsApp customer support platform.",
  openGraph: {
    title: "Contact Us — LeadMate",
    description:
      "Get in touch with LeadMate's team. We're here to help with questions about our AI-powered WhatsApp customer support platform.",
    images: ["/og-image.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
