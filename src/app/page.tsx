// "use client";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import TrustSignals from "@/components/home/TrustSignals";
import PricingPlans from "@/components/home/PricingPlans";

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 page">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <TrustSignals />
        <CTASection />
        <PricingPlans/>
      </div>
    </PageLayout>
  );
}
