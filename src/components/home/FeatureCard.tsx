import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="p-4 flex flex-col items-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300 ">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-main text-main-foreground mx-auto">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-foreground">{description}</p>
    </Card>
  );
}
