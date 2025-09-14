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
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/SplitText";

// gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  //   const heroSplit = new SplitText(".hero", {
  //     type: "chars",
  //     linesClass: "line",
  //   });

  //   useGSAP(() => {
  //     gsap.fromTo(".page>*", {
  //       opacity: 0,
  //       y: 100,
  //       duration: 1,
  //       ease: "power2.inOut",
  //     }, {
  //       opacity: 1,
  //       y: 0,
  //       duration: 1,
  //       ease: "power2.inOut",
  //     },
  //   );
  //   gsap.to("page>*", {
  //     scrollTrigger: "page>*", // start animation when ".box" enters the viewport
  //     opacity: 0,
  //     pin: true,
  //   });
  // }, []);
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
      </div>
    </PageLayout>
  );
}
