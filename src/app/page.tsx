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
import BlogSection, { BlogPost } from "@/components/home/BlogSection";
import { wisp } from "@/lib/wisp";

export default async function Home() {
  const result = await wisp.getPosts({ limit: 3 });
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
        <BlogSection posts={result.posts  } />
        <CTASection />
        <PricingPlans />
      </div>
    </PageLayout>
  );
}
