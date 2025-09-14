import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
}: TestimonialCardProps) {
  return (
    <Card className="p-6 flex flex-col items-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300">
      {/* Rating */}
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < rating ? "text-main fill-current" : "text-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-foreground text-lg mb-6 leading-relaxed">
        &quot;{content}&quot;
      </blockquote>

      {/* Author */}
      <div className="border-t border-gray-700 pt-4">
        <div className="font-semibold text-white">{name}</div>
        <div className="text-sm text-foreground">
          {role} at {company}
        </div>
      </div>
    </Card>
  );
}
