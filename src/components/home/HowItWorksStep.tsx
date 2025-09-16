"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Smartphone, Brain, MessageCircle, TrendingUp } from "lucide-react";

const iconMap = {
  smartphone: Smartphone,
  brain: Brain,
  "message-circle": MessageCircle,
  "trending-up": TrendingUp,
};

interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function HowItWorksStep({
  step,
  title,
  description,
  iconName,
}: HowItWorksStepProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap];
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6 flex flex-col items-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300 h-full relative group">
        {/* Step Number */}
        <div className="absolute -top-3 -right-3 inline-flex items-center justify-center w-8 h-8 bg-main text-black font-bold text-sm rounded-full border-2 border-background">
          {step}
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-main/20 border border-main/30 rounded-2xl mx-auto mb-6 group-hover:bg-main/30 transition-colors">
          <Icon className="h-8 w-8 text-main" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-3 text-center group-hover:text-main transition-colors">
          {title}
        </h3>
        <p className="text-foreground leading-relaxed text-center text-sm">
          {description}
        </p>

        <div className="absolute inset-0 bg-gradient-to-br from-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
      </Card>
    </motion.div>
  );
}
