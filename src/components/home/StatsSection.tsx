import { StatItem } from "@/components/home/StatItem";
import { Card } from "@/components/ui/card";
import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredContainer from "@/components/animations/StaggeredContainer";
import { NavigationButton } from "@/components/JoinWaitlistButton";

const businessStats = [
  {
    number: 89,
    suffix: "%",
    label: "Revenue Increase",
    description:
      "Average revenue growth for businesses using instant WhatsApp responses",
    color: "text-green-400",
  },
  {
    number: 2.8,
    suffix: "s",
    label: "Response Time",
    description: "Lightning-fast AI responses that keep customers engaged",
    color: "text-blue-400",
  },
  {
    number: 95,
    suffix: "%",
    label: "Customer Satisfaction",
    description: "Customers love getting instant, helpful responses 24/7",
    color: "text-purple-400",
  },
  {
    number: 340,
    suffix: "%",
    label: "ROI in 90 Days",
    description: "Return on investment within the first quarter of usage",
    color: "text-main",
  },
];

const urgencyStats = [
  {
    title: "The Cost of Slow Responses",
    stats: [
      {
        value: "80%",
        label: "of customers leave if no response in 30 seconds",
      },
      {
        value: "$75K",
        label: "average annual loss from slow WhatsApp responses",
      },
      { value: "67%", label: "of leads go to competitors who respond first" },
    ],
  },
  {
    title: "The Power of Instant Response",
    stats: [
      {
        value: "3x",
        label: "higher conversion rate with sub-5 second responses",
      },
      { value: "92%", label: "customer retention with 24/7 availability" },
      { value: "60%", label: "reduction in support costs with AI automation" },
    ],
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24">
      <AnimatedSection delay={0.2}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Every Second Counts in Business
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
            Don't let slow responses cost you customers. See the dramatic impact
            of instant WhatsApp automation:
          </p>
        </div>
      </AnimatedSection>

      <Card className="p-8 md:p-12 mb-16 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300">
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {businessStats.map((stat, index) => (
            <StatItem
              key={index}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              color={stat.color}
            />
          ))}
        </StaggeredContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {urgencyStats.map((section, sectionIndex) => (
          <AnimatedSection key={sectionIndex} delay={0.4 + sectionIndex * 0.2}>
            <Card
              className={`p-6 md:p-8 h-full bg-gradient-to-br ${
                sectionIndex === 0
                  ? "from-red-500/10 to-transparent border-red-500/20"
                  : "from-green-500/10 to-transparent border-green-500/20"
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.stats.map((stat, statIndex) => (
                  <div
                    key={statIndex}
                    className="flex items-center justify-between"
                  >
                    <div
                      className={`text-2xl font-bold ${
                        sectionIndex === 0 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-foreground text-right flex-1 ml-4">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.8} className="mt-16 text-center">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            ⚠️ Your Competition Is Already Moving Fast
          </h3>
          <p className="text-lg text-foreground mb-6">
            While you're reading this, your competitors are capturing leads with
            instant responses. Don't let another potential customer slip away.
          </p>
          <NavigationButton
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-4 sm:px-6 sm:py-4 text-sm sm:text-lg w-full sm:w-auto text-center"
          >
            <span className="whitespace-normal">
              Start capturing leads in the next 5 minutes →
            </span>
          </NavigationButton>
        </div>
      </AnimatedSection>
    </section>
  );
}
