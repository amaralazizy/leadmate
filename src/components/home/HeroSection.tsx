import AnimatedSection from "@/components/animations/AnimatedSection";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import HeroVisual from "./HeroVisual";
import { ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8 text-center lg:text-left z-10">
            <AnimatedSection delay={0.2}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main/10 text-main text-sm font-medium border border-main/20 w-fit mx-auto lg:mx-0 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-main"></span>
                </span>
                Now available for WhatsApp Business
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-foreground leading-[1.1]">
                Never Lose Another Customer to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-emerald-400">
                  Slow Responses
                </span>
          </h1>
        </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto lg:mx-0">
            LeadMate's AI responds to your WhatsApp customers in{" "}
                <span className="text-foreground font-semibold">
                  under 3 seconds
                </span>
                , 24/7. Capture every lead, close more sales, and automate your
                customer support effortlessly.
          </p>
        </AnimatedSection>

        <AnimatedSection
              delay={0.6}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4"
        >
          <NavigationButton
            href="/signup"
                className="bg-main hover:bg-main/90 text-black font-bold px-8 py-6 rounded-2xl text-lg lg:text-xl shadow-lg shadow-main/25 hover:shadow-main/40 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Start Free Trial
                <ArrowRight className="!w-5 !h-5 group-hover:translate-x-1 transition-transform" />
          </NavigationButton>
        </AnimatedSection>

            <AnimatedSection
              delay={0.8}
              className="mt-8 pt-8 border-t border-border/50"
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-2 text-foreground font-bold text-2xl md:text-3xl">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-main" />
                    3s
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Response Time
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-2 text-foreground font-bold text-2xl md:text-3xl">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-main" />
                    24/7
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Availability
              </div>
            </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-2 text-foreground font-bold text-2xl md:text-3xl">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-main" />
                    95%
            </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Satisfaction
              </div>
            </div>
          </div>
        </AnimatedSection>
          </div>

          {/* Right Visual */}
          <AnimatedSection
            delay={0.5}
            direction="left"
            className="relative z-10 hidden lg:block"
          >
            <div className="relative">
              <HeroVisual />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
