import PricingPlan from "@/components/home/PricingPlan";

export default function PricingPlans() {
  const pricingData = [
    {
      title: "Free Trial",
      description: "Perfect for testing our platform",
      price: "$0",
      period: "for 7 days",
      features: ["Only 5 messages per day", "Basic analytics"],
      buttonText: "Start Free Trial",
      isPopular: false,
      href: "/dashboard"
    },
    {
      title: "Monthly",
      description: "Perfect for getting started",
      price: "$29",
      period: "/month",
      features: [
        "250 messages per day",
        "Advanced analytics",
        "Email automation",
        "Priority support",
        "Custom reporting",
      ],
      buttonText: "Get Started",
      isPopular: false,
      href: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_dRmaEX8U331ceUz3V90Ny01" : "",
      priceId: "price_1SBlepF25uPbELdqIlKHP1pw",
    },
    {
      title: "Yearly",
      description: "For serious businesses",
      price: "$299",
      period: "/year",
      features: [
        "250 messages per day",
        "Advanced analytics",
        "Email automation",
        "Priority support",
        "Custom reporting",
        "2 months free",
      ],
      buttonText: "Get Started",
      isPopular: true,
      popularText: "Best Value",
      savings: "Save $49",
      highlightFeatures: ["2 months free"],
      href: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_3cI28rdaj1X84fVgHV0Ny00" : "",
      priceId: "price_1SBlh0F25uPbELdqUy1dSxel"
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
            Choose the plan that works best for your business
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {pricingData.map((plan, index) => (
            <PricingPlan
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              buttonText={plan.buttonText}
              isPopular={plan.isPopular}
              popularText={plan.popularText}
              savings={plan.savings}
              highlightFeatures={plan.highlightFeatures}
              href={plan.href}
              priceId={plan.priceId}
            />
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-16">
          <p className="text-base text-foreground/60">
            Questions?{" "}
            <a href="/contact" className="text-main hover:text-main/80 font-medium">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
