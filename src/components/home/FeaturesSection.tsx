import AnimatedSection from "@/components/animations/AnimatedSection";
import FeatureCard from "./FeatureCard";
import BusinessImpactStats from "@/components/home/BusinessImpactStats";

const features = [
  {
    iconName: "zap",
    title: "Instant Response = More Sales",
    description:
      "Convert 3x more leads with AI responses in under 3 seconds. Studies show 78% of customers buy from the first responder.",
    impact: "3x more conversions",
    className: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    iconName: "clock",
    title: "24/7 Lead Capture",
    description:
      "Never lose another customer to competitors. Capture leads while you sleep and wake up to new business opportunities.",
    impact: "0% missed opportunities",
    className: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    iconName: "dollar-sign",
    title: "Reduce Support Costs",
    description:
      "Automate 80% of customer inquiries. One AI assistant replaces multiple support staff, saving thousands monthly.",
    impact: "60% cost reduction",
    className: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    iconName: "trending-up",
    title: "Scale Without Hiring",
    description:
      "Handle 1000+ conversations simultaneously. Grow your business without the overhead of expanding your team.",
    impact: "Unlimited scalability",
    className: "col-span-1 md:col-span-2 lg:col-span-2",
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
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <AnimatedSection delay={0.2} className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Stop Losing Money to <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-emerald-400">Slow Responses</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Every minute you delay responding costs you customers. LeadMate transforms your business into a 24/7 sales machine.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={0.1 * index}
            />
          ))}
        </div>

        <BusinessImpactStats businessImpacts={businessImpacts} />
      </div>
    </section>
  );
}
