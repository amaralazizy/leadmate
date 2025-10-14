"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner",
    company: "Bella's Bistro",
    content:
      "LeadMate transformed our customer service. We now respond to WhatsApp inquiries instantly, even during rush hours. Customer satisfaction has increased by 40%.",
    rating: 5,
    location: "San Francisco, CA",
    date: "2 months ago",
    platform: "Google Reviews",
    verified: true,
  },
  {
    name: "Marcus Rodriguez",
    role: "Manager",
    company: "FitZone Gym",
    content:
      "The AI understands our membership packages perfectly. It answers questions about pricing, schedules, and even helps book personal training sessions. Game changer!",
    rating: 5,
    location: "Austin, TX",
    date: "3 weeks ago",
    platform: "Trustpilot",
    verified: true,
  },
  {
    name: "Priya Patel",
    role: "Founder",
    company: "Glam Beauty Salon",
    content:
      "Our appointment bookings increased by 60% since using LeadMate. Customers love the instant responses, and I love having my evenings back.",
    rating: 5,
    location: "Miami, FL",
    date: "1 month ago",
    platform: "Google Reviews",
    verified: true,
  },
  {
    name: "James Thompson",
    role: "Director",
    company: "Summit Real Estate",
    content:
      "Property inquiries come in 24/7, and LeadMate never misses one. Our lead response time went from hours to seconds. ROI was positive within the first month.",
    rating: 5,
    location: "Denver, CO",
    date: "3 months ago",
    platform: "Capterra",
    verified: true,
  },
  {
    name: "Aisha Mohammed",
    role: "Co-founder",
    company: "TechHub Coworking",
    content:
      "Managing membership inquiries used to take up so much of our time. Now LeadMate handles everything from pricing questions to tour bookings automatically.",
    rating: 5,
    location: "Seattle, WA",
    date: "6 weeks ago",
    platform: "Google Reviews",
    verified: true,
  },
  {
    name: "Carlos Rivera",
    role: "Owner",
    company: "Rivera Auto Repair",
    content:
      "My customers love getting instant quotes and appointment confirmations via WhatsApp. LeadMate has modernized how we do business and increased our bookings by 45%.",
    rating: 5,
    location: "Phoenix, AZ",
    date: "2 weeks ago",
    platform: "Yelp",
    verified: true,
  },
];

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Loved by Business Owners
        </h2>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
          See how LeadMate is helping businesses provide better customer support
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, (-100 * testimonials.length) / 3],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: isPaused ? 1000000 : 10,
                ease: "linear",
              },
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  company={testimonial.company}
                  content={testimonial.content}
                  rating={testimonial.rating}
                  location={testimonial.location}
                  date={testimonial.date}
                  platform={testimonial.platform}
                  verified={testimonial.verified}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
