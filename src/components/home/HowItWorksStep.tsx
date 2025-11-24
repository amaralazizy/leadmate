"use client";

import { motion } from "framer-motion";
import { Smartphone, Brain, MessageCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
  isLast?: boolean;
}

export default function HowItWorksStep({
  step,
  title,
  description,
  iconName,
  isLast,
}: HowItWorksStepProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap];
  
  return (
    <div className="relative flex flex-col items-center text-center group z-10">
      {/* Connecting Line (Desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-border -z-10">
           <div className="h-full bg-main origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
        </div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: step * 0.2 }}
        viewport={{ once: true }}
        className="relative mb-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-background border-2 border-border flex items-center justify-center shadow-lg group-hover:border-main group-hover:shadow-main/25 transition-all duration-300">
            <Icon className="w-8 h-8 text-muted-foreground group-hover:text-main transition-colors" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-main text-black font-bold text-sm rounded-full flex items-center justify-center border-3 border-background">
            {step}
        </div>
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-main transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-base leading-relaxed max-w-[260px]">
        {description}
      </p>
    </div>
  );
}
