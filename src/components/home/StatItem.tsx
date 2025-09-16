"use client";

import CountUpAnimation from "@/components/animations/CountUpAnimation";
import { motion } from "framer-motion";

type StatItemProps = {
  number: string | number;
  label: string;
  description: string;
  suffix?: string;
  prefix?: string;
  color?: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function StatItem({
  number,
  label,
  description,
  suffix = "",
  prefix = "",
  color = "text-main",
}: StatItemProps) {
  const numericValue = typeof number === "string" ? parseFloat(number) : number;
  const isNumeric = !isNaN(numericValue);

  return (
    <motion.div variants={itemVariants} className="text-center">
      <div className={`text-4xl md:text-5xl font-bold ${color} mb-2`}>
        {isNumeric ? (
          <CountUpAnimation
            value={numericValue}
            suffix={suffix}
            prefix={prefix}
            duration={2}
          />
        ) : (
          `${prefix}${number}${suffix}`
        )}
      </div>
      <div className="text-xl font-semibold text-white mb-2">{label}</div>
      <div className="text-foreground text-sm leading-relaxed">
        {description}
      </div>
    </motion.div>
  );
}
