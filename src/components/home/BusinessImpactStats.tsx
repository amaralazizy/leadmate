"use client";

import AnimatedSection from "@/components/animations/AnimatedSection";
import CountUpAnimation from "@/components/animations/CountUpAnimation";
import { Users, Target, Clock, DollarSign, ArrowUpRight } from "lucide-react";

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
      <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden">
        {/* Background with gradient mesh */}
        <div className="absolute inset-0 bg-secondary/10 border border-border/50 backdrop-blur-sm rounded-3xl z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-main/50 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-main/50 to-transparent opacity-50" />

        <div className="relative z-10">
            <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                The Business Impact Numbers Don't Lie
            </h3>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                See what happens when businesses prioritize instant WhatsApp
                responses:
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {businessImpacts.map((impact, index) => {
                const Icon = iconMap[impact.iconName as keyof typeof iconMap];
                // Extract number from stat string for animation if possible
                const num = parseFloat(impact.stat.replace(/[^0-9.]/g, ''));
                const suffix = impact.stat.replace(/[0-9.]/g, '');

                return (
                <div key={index} className="text-center px-4 pt-8 md:pt-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-main/10 rounded-xl mb-4 text-main">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tight">
                         {/* Use CountUp only if we extracted a valid number */}
                         {!isNaN(num) ? (
                            <CountUpAnimation value={num} suffix={suffix} duration={2} />
                         ) : (
                            impact.stat
                         )}
                    </div>
                    <div className="text-foreground text-base font-semibold mb-2 flex items-center justify-center gap-1">
                        {impact.title}
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                    {impact.description}
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
