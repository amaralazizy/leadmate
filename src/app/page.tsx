import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TrustSignals from "@/components/home/TrustSignals";

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />
        <FeaturesSection />
        <TrustSignals />
      </div>
    </PageLayout>
  );
}
