"use client";

import AnimatedSection from "@/components/animations/AnimatedSection";
import { Users, Target, Clock, DollarSign } from "lucide-react";

const iconMap = {
  users: Users,
  target: Target,
  clock: Clock,
  "dollar-sign": DollarSign,
};

interface BusinessImpact {
  iconName: string;
  title: string;
  stat: string;
  description: string;
}

interface BusinessImpactStatsProps {
  businessImpacts: BusinessImpact[];
}

export default function BusinessImpactStats({
  businessImpacts,
}: BusinessImpactStatsProps) {
  return (
    <AnimatedSection delay={0.4}>
      <div className="bg-gradient-to-r from-main/10 to-blue-500/10 border border-main/20 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            The Business Impact Numbers Don't Lie
          </h3>
          <p className="text-foreground text-lg">
            See what happens when businesses prioritize instant WhatsApp
            responses:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessImpacts.map((impact, index) => {
            const Icon = iconMap[impact.iconName as keyof typeof iconMap];
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-main/20 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-main" />
                </div>
                <div className="text-3xl font-bold text-main mb-2">
                  {impact.stat}
                </div>
                <div className="text-white font-semibold mb-1">
                  {impact.title}
                </div>
                <div className="text-sm text-foreground/80">
                  {impact.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
