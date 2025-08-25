"use client";

import { useState } from "react";
import WaitlistHeader from "@/app/components/WaitlistHeader";
import WaitlistBadge from "@/app/components/WaitlistBadge";
import WaitlistHero from "@/app/components/WaitlistHero";
import WaitlistForm from "@/app/components/WaitlistForm";
import WaitlistSuccess from "@/app/components/WaitlistSuccess";
import WaitlistSocialProof from "@/app/components/WaitlistSocialProof";
import WaitlistFeatures from "@/app/components/WaitlistFeatures";
import WaitlistCTA from "@/app/components/WaitlistCTA";
import WaitlistFooter from "@/app/components/WaitlistFooter";
import ContactForm from "@/app/components/ContactForm";
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
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--color-accent-green)) 1px, transparent 0)`,
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
