"use client";

import { useState } from "react";
import WaitlistHeader from "@/components/marketing/WaitlistHeader";
import WaitlistBadge from "@/components/marketing/WaitlistBadge";
import WaitlistHero from "@/components/marketing/WaitlistHero";
import WaitlistForm from "@/components/marketing/WaitlistForm";
import WaitlistSuccess from "@/components/marketing/WaitlistSuccess";
import WaitlistSocialProof from "@/components/marketing/WaitlistSocialProof";
import WaitlistFeatures from "@/components/marketing/WaitlistFeatures";
import WaitlistCTA from "@/components/marketing/WaitlistCTA";
import WaitlistFooter from "@/components/marketing/WaitlistFooter";
import ContactForm from "@/components/marketing/ContactForm";
import { toast } from "sonner";

export default function WaitlistPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
    toast.success("You've successfully joined the waitlist");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--color-main)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <WaitlistHeader />

      {/* Main Content */}
      <main className="relative z-10 px-6 pt-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <WaitlistBadge />
          <WaitlistHero />

          {/* Waitlist Form or Success */}
          {!isSubmitted ? (
            <WaitlistForm onSuccess={handleSuccess} />
          ) : (
            <WaitlistSuccess />
          )}

          <WaitlistSocialProof />
          <WaitlistFeatures />
          <WaitlistCTA />
        </div>
      </main>
      {/* Contact Form Section */}
      <ContactForm />

      <WaitlistFooter />
    </div>
  );
}
