import { MessageSquare, Zap, Shield, Clock } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Assistance",
    description:
      "Smart replies that understand your business and provide accurate customer support.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Never miss a customer inquiry with round-the-clock automated responses.",
  },
  {
    icon: MessageSquare,
    title: "Customer Engagement",
    description:
      "Enhance customer relationships with personalized, timely responses.",
  },
  {
    icon: Shield,
    title: "Streamlined Communication",
    description: "Organize and manage all customer conversations in one place.",
  },
];

export default function FeaturesSection() {
  return (
    <div className="mt-24">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}
