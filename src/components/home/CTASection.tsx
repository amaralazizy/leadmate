import { Sparkles, CircleCheckBig } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="bg-gradient-to-br from-dark-card to-gray-900 rounded-3xl p-8 md:p-12 border border-border text-center relative overflow-hidden h-full">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-main opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-main opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-between h-full">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-main/10 border border-main/20 rounded-full text-main font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Join the Future of Customer Support
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block text-main">WhatsApp Experience?</span>
          </h2>

          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-8">
            Join thousands of businesses already using AI to provide exceptional
            customer support. Get early access and exclusive benefits.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-foreground">
            <div className="flex items-center">
              <CircleCheckBig className="inline h-5 w-5 text-main mr-2" /> Free
              trial included{" "}
            </div>
            <div className="flex items-center">
              <CircleCheckBig className="inline h-5 w-5 text-main mr-2" /> No
              credit card required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
