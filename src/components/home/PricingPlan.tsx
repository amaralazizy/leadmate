import { Check, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PricingPlanProps = {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  popularText?: string;
  savings?: string;
  highlightFeatures?: string[];
  href: string;
  priceId?: string;
};

export default async function PricingPlan({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  isPopular = false,
  popularText,
  savings,
  highlightFeatures = [],
  href,
  priceId,
}: PricingPlanProps) {
  const cardClasses = isPopular
    ? "bg-secondary-background rounded-3xl shadow-xl border-2 border-main p-8 relative transform scale-105 z-10"
    : "bg-secondary-background rounded-3xl shadow-lg border border-border p-8 relative";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) {
  //   return null;
  // }

  return (
    <div className={cardClasses}>
      {isPopular && popularText && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-main text-main-foreground px-5 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
            <Star className="h-4 w-4 mr-1.5" />
            {popularText}
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-base text-foreground/70 mb-6">{description}</p>
        <div className="mb-6">
          <span className="text-5xl font-bold text-foreground">{price}</span>
          <span className="text-lg text-foreground/70 ml-2">{period}</span>
          {savings && (
            <div className="text-sm text-foreground/60 mt-1 font-medium">{savings}</div>
          )}
        </div>
        <Link href={href + (user ? "?prefilled_email="+user.email : "")}>
          <Button className="w-full text-base py-6 rounded-xl font-bold">{buttonText}</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => {
          const isHighlight = highlightFeatures.includes(feature);
          const iconColor = isHighlight
            ? "text-chart-1"
            : isPopular
              ? "text-main"
              : "text-chart-1";
          const textWeight = isHighlight ? "font-semibold" : "";

          return (
            <div key={index} className="flex items-start">
              <Check className={`h-5 w-5 ${iconColor} mr-3 flex-shrink-0 mt-0.5`} />
              <span className={`text-base text-foreground/80 ${textWeight}`}>
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
