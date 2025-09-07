import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FAQItemProps = {
  triggers: {
    question: string;
    answer: string;
  }[],
  className?: string;
}

export default function AppAccordionList({ triggers, className }: FAQItemProps) {
  return (
    <Accordion type="single" collapsible className={cn("w-full max-w-xl", className)}>
      {triggers.map((trigger, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{trigger.question}</AccordionTrigger>
          <AccordionContent className="bg-background text-foreground">{trigger.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
