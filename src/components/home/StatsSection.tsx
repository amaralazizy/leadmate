import { stats } from "@/lib/data/stats";
import { StatItem } from "@/components/home/StatItem";

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="bg-dark-card rounded-3xl p-8 md:p-12 border border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Growing Businesses
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            See the impact LeadMate is making for businesses worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              number={stat.number}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
