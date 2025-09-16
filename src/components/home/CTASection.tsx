import {
  Sparkles,
  CircleCheckBig,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card } from "../ui/card";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import AnimatedSection from "@/components/animations/AnimatedSection";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <AnimatedSection delay={0.2}>
        <Card className="relative p-8 md:p-12 flex flex-col items-center  hover:shadow-none transition-all duration-300 overflow-hidden z-0">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-main opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 opacity-5 rounded-full blur-3xl"></div>

          <div className="flex flex-col items-center justify-between h-full relative z-10">
            {/* Urgency Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 font-medium mb-6 animate-pulse">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Don't Let Another Lead Slip Away
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">
              Stop Losing <span className="text-red-400">$1,000s</span> Daily
              <span className="block text-main">
                to Slow WhatsApp Responses
              </span>
            </h2>

            <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto mb-8 text-center">
              Every minute you wait, competitors with instant responses are
              stealing your customers. Join{" "}
              <span className="text-main font-semibold">
                2,847 smart businesses
              </span>{" "}
              who've already automated their WhatsApp success.
            </p>

            {/* Value propositions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-4xl">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-green-400 font-bold">
                  89% Revenue Boost
                </div>
                <div className="text-sm text-foreground">
                  Average increase in first 90 days
                </div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-400 font-bold">
                  2.8 Second Response
                </div>
                <div className="text-sm text-foreground">
                  Faster than any human team
                </div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-purple-400 font-bold">5 Minute Setup</div>
                <div className="text-sm text-foreground">
                  Start capturing leads immediately
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <NavigationButton
                href="/signup"
                className="bg-main hover:bg-main/90 text-black font-bold px-12 py-6 text-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </NavigationButton>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-foreground">
              <div className="flex items-center">
                <CircleCheckBig className="inline h-5 w-5 text-main mr-2" />
                7-day free trial
              </div>
              <div className="flex items-center">
                <CircleCheckBig className="inline h-5 w-5 text-main mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CircleCheckBig className="inline h-5 w-5 text-main mr-2" />
                Cancel anytime
              </div>
            </div>

            {/* Urgency footer */}
            <div className="mt-8 text-center">
              <div className="text-sm text-red-400 font-medium">
                ⏰ Limited Time: Get setup in 5 minutes or competitors win your
                next customer
              </div>
            </div>
          </div>
        </Card>
      </AnimatedSection>
    </section>
  );
}
