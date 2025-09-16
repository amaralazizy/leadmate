import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredContainer from "@/components/animations/StaggeredContainer";
import FeatureCard from "./FeatureCard";
import BusinessImpactStats from "@/components/home/BusinessImpactStats";

const features = [
  {
    iconName: "zap",
    title: "Instant Response = More Sales",
    description:
      "Convert 3x more leads with AI responses in under 3 seconds. Studies show 78% of customers buy from the first responder.",
    impact: "3x more conversions",
  },
  {
    iconName: "clock",
    title: "24/7 Lead Capture",
    description:
      "Never lose another customer to competitors. Capture leads while you sleep and wake up to new business opportunities.",
    impact: "0% missed opportunities",
  },
  {
    iconName: "dollar-sign",
    title: "Reduce Support Costs by 60%",
    description:
      "Automate 80% of customer inquiries. One AI assistant replaces multiple support staff, saving thousands monthly.",
    impact: "60% cost reduction",
  },
  {
    iconName: "trending-up",
    title: "Scale Without Hiring",
    description:
      "Handle 1000+ conversations simultaneously. Grow your business without the overhead of expanding your team.",
    impact: "Unlimited scalability",
  },
];

const businessImpacts = [
  {
    iconName: "users",
    title: "Customer Retention",
    stat: "92%",
    description: "of customers stay when they get instant responses",
  },
  {
    iconName: "target",
    title: "Lead Conversion",
    stat: "65%",
    description: "higher conversion rate with AI-powered follow-ups",
  },
  {
    iconName: "clock",
    title: "Response Time",
    stat: "2.8s",
    description: "average response time vs 4+ hours manually",
  },
  {
    iconName: "dollar-sign",
    title: "ROI Increase",
    stat: "340%",
    description: "return on investment within first 3 months",
  },
];

export default function FeaturesSection() {
  return (
    <div className="mt-24">
      <AnimatedSection delay={0.2}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop Losing Money to Slow Responses
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
            Every minute you delay responding costs you customers. Here's how
            LeadMate transforms your business:
          </p>
        </div>
      </AnimatedSection>

      <StaggeredContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 mb-20">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            iconName={feature.iconName}
            title={feature.title}
            description={feature.description}
            impact={feature.impact}
          />
        ))}
      </StaggeredContainer>

      <BusinessImpactStats businessImpacts={businessImpacts} />
    </div>
  );
}
