"use client";

import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import AnimatedSection from "@/components/animations/AnimatedSection";

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <AnimatedSection delay={0.2}>
        <div className="relative rounded-3xl px-8 py-20 md:p-24 overflow-hidden bg-black text-background text-center isolate">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-main/30 blur-[120px] rounded-full -z-10 mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

          <div className="flex flex-col items-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-white/10 text-main mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Limited availability for new accounts
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-white">
              Ready to Automate Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-emerald-400">
                WhatsApp Sales?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl leading-relaxed">
              Join 2,800+ businesses capturing leads 24/7. Set up your AI agent
              in minutes and never miss a customer again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
              <NavigationButton
                href="/signup"
                className="bg-main hover:bg-main/90 text-black font-bold px-10 py-6 text-xl rounded-2xl shadow-[0_0_40px_-10px_rgba(var(--main),0.6)] hover:shadow-[0_0_60px_-15px_rgba(var(--main),0.8)] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </NavigationButton>
            </div>

            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-white/60 text-base font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-main" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-main" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-main" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
