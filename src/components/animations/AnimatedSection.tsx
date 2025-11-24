"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
}: AnimatedSectionProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 30, filter: "blur(10px)" };
      case "down":
        return { opacity: 0, y: -30, filter: "blur(10px)" };
      case "left":
        return { opacity: 0, x: 30, filter: "blur(10px)" };
      case "right":
        return { opacity: 0, x: -30, filter: "blur(10px)" };
      default:
        return { opacity: 0, y: 30, filter: "blur(10px)" };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0, filter: "blur(0px)" };
      case "left":
      case "right":
        return { opacity: 1, x: 0, filter: "blur(0px)" };
      default:
        return { opacity: 1, y: 0, filter: "blur(0px)" };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getFinalPosition()}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Spring-like ease
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
