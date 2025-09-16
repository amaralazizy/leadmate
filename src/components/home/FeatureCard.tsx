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

export default function FeatureCard({
  iconName,
  title,
  description,
  impact,
}: FeatureCardProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap];
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6 flex flex-col items-start hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300 h-full relative overflow-hidden group">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-main text-black mb-4">
          <Icon className="h-6 w-6" />
        </div>

        {impact && (
          <div className="absolute top-4 right-4 bg-main/20 text-main text-xs font-bold px-2 py-1 rounded-full">
            {impact}
          </div>
        )}

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-main transition-colors">
          {title}
        </h3>
        <p className="text-foreground leading-relaxed flex-grow">
          {description}
        </p>

        <div className="absolute inset-0 bg-gradient-to-br from-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
