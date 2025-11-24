// "use client";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import TrustSignals from "@/components/home/TrustSignals";
import PricingPlans from "@/components/home/PricingPlans";
import BlogSection from "@/components/home/BlogSection";
import { wisp } from "@/lib/wisp";

export default async function Home() {
  const result = await wisp.getPosts({ limit: 3 });
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <HeroSection />
      </div>

      <TrustSignals />

      <div className="max-w-7xl mx-auto">
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingPlans />
        <FAQSection />
        {/* <BlogSection posts={result.posts} /> */}
        <CTASection />
      </div>
    </PageLayout>
  );
}
