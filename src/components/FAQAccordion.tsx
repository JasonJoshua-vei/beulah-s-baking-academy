import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are the certificates government-registered?",
    answer: "Yes, we offer government-registered certificates for all our courses.",
  },
  {
    question: "How do the online classes work?",
    answer: "Our online classes are conducted via video conferencing with live instruction, demonstrations, and Q&A sessions. You'll receive course materials in advance and can interact with instructors in real-time.",
  },
  {
    question: "Can I order baked goods without taking a course?",
    answer: "Absolutely! You can order our homemade cakes, brownies, and other treats directly through our shop page. We deliver fresh, lovingly-baked goods made with real ingredients.",
  },
  {
    question: "What is the duration of most courses?",
    answer: "Most of our workshops are 1-day intensive sessions, with our comprehensive Cake Master Class spanning 2 days. Language courses like Spoken English run for 1 month.",
  },
  {
    question: "Are prior baking ingredients for the courses?",
    answer: "No prior experience is needed! Our courses are designed for beginners through advanced learners. We provide ingredient lists and basic techniques, then build your skills step by step.",
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a transparent refund policy. If you need to cancel your course booking, please contact us at least 48 hours in advance for a full refund. For custom orders of baked goods, cancellations must be made 24 hours before delivery.",
  },
];

export const FAQAccordion = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our courses and services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left text-lg hover:text-chocolate transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
