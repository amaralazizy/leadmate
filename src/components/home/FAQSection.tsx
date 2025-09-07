import AppAccordionList from "@/components/home/AppAccordionList";
import { faqs } from "@/lib/data/faqs";

export default function FAQSection() {
  return (
    <section className="py-16 md:py-24 ">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
          Everything you need to know about LeadMate
        </p>
      </div>

      <AppAccordionList triggers={faqs} className="max-w-3xl mx-auto" />
    </section>
  );
}
