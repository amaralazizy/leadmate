import { Star, CheckCircle2, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  location?: string;
  date?: string;
  platform?: string;
  verified?: boolean;
  avatar?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
  location,
  date,
  platform,
  verified = true,
}: TestimonialCardProps) {
  return (
    <Card className="p-6 flex flex-col h-full hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300 bg-card/50 backdrop-blur-sm">
      {/* Header with Rating and Platform */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < rating ? "text-main fill-current" : "text-gray-600"
              }`}
            />
          ))}
        </div>
        {platform && (
          <div className="flex items-center gap-1 text-xs text-foreground/70">
            <ExternalLink className="h-3 w-3" />
            <span>{platform}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <blockquote className="text-foreground text-base mb-6 leading-relaxed flex-grow">
        &quot;{content}&quot;
      </blockquote>

      {/* Author Section */}
      <div className="border-t border-gray-700/50 pt-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{name}</span>
              {verified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500/20" />
              )}
            </div>
            <div className="text-sm text-foreground/80">
              {role} at {company}
            </div>
          </div>
        </div>

        {/* Location and Date */}
        <div className="flex items-center justify-between text-xs text-foreground/60">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          )}
          {date && <span>{date}</span>}
        </div>
      </div>
    </Card>
  );
}
