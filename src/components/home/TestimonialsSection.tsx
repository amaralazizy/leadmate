"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import TestimonialCard from "./TestimonialCard";
import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredContainer from "@/components/animations/StaggeredContainer";

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
    <section className="py-24 relative">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <AnimatedSection delay={0.2}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Loved by <span className="text-main">Business Owners</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            See how LeadMate is helping businesses provide better customer
            support around the clock.
          </p>
        </div>
      </AnimatedSection>

      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            role={testimonial.role}
            company={testimonial.company}
            content={testimonial.content}
            rating={testimonial.rating}
          />
        ))}
      </StaggeredContainer>
    </section>
  );
}
