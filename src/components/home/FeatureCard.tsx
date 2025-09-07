import { LucideIcon } from "lucide-react";

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
    <div className="text-center p-6 rounded-2xl bg-dark-card border border-gray-800">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-main text-main-foreground mx-auto">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-foreground">{description}</p>
    </div>
  );
}
