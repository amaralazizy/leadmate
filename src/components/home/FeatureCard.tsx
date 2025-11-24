"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  zap: Zap,
  clock: Clock,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  users: Users,
  target: Target,
  "message-square": MessageSquare,
  shield: Shield,
};

interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
  impact?: string;
  className?: string;
  delay?: number;
}

export default function FeatureCard({
  iconName,
  title,
  description,
  impact,
  className,
  delay = 0,
}: FeatureCardProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      viewport={{ once: true }}
      className={cn("h-full", className)}
    >
      <Card className="h-full p-6 md:p-8 flex flex-col items-start bg-secondary/5 border-border/40 hover:border-main/50 transition-colors duration-500 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-main/10 blur-[50px] rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:bg-main/20" />
        
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-secondary/50 border border-border/50 text-main mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6" />
        </div>

        {impact && (
          <div className="absolute top-6 right-6 bg-main/10 text-main text-xs font-bold px-3 py-1 rounded-full border border-main/20">
            {impact}
          </div>
        )}

        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          {title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed flex-grow">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}
