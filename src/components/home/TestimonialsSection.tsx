import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner",
    company: "Bella's Bistro",
    content:
      "LeadMate transformed our customer service. We now respond to WhatsApp inquiries instantly, even during rush hours. Customer satisfaction has increased by 40%.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Manager",
    company: "FitZone Gym",
    content:
      "The AI understands our membership packages perfectly. It answers questions about pricing, schedules, and even helps book personal training sessions. Game changer!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Founder",
    company: "Glam Beauty Salon",
    content:
      "Our appointment bookings increased by 60% since using LeadMate. Customers love the instant responses, and I love having my evenings back.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Loved by Business Owners
        </h2>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
          See how LeadMate is helping businesses provide better customer support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      </div>
    </section>
  );
}
