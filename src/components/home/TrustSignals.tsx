"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const companies = [
  "Global Tech",
  "Future Systems",
  "Innovate Corp",
  "RapidScale",
  "BlueSky Data",
  "NextLevel",
  "Prime Solutions",
  "Alpha Stream",
];

export default function TrustSignals() {
  return (
    <div className="mt-16 relative overflow-hidden">
      <div className="text-center mb-10">
        <p className="text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-widest">
          Trusted by innovative teams
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {companies.map((company, index) => (
            <span
              key={index}
              className="text-xl md:text-2xl font-bold text-foreground/40 hover:text-foreground/80 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
          {companies.map((company, index) => (
            <span
              key={`duplicate-${index}`}
              className="text-xl md:text-2xl font-bold text-foreground/40 hover:text-foreground/80 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 ml-16">
          {companies.map((company, index) => (
            <span
              key={`marquee2-${index}`}
              className="text-xl md:text-2xl font-bold text-foreground/40 hover:text-foreground/80 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
          {companies.map((company, index) => (
            <span
              key={`marquee2-duplicate-${index}`}
              className="text-xl md:text-2xl font-bold text-foreground/40 hover:text-foreground/80 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm md:text-base text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-main" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-main" />
          <span>Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-main" />
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  );
}
