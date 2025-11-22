import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Sir explained it so well that I understood everything clearly. It's really helpful mom",
    author: "Student Parent",
    role: "Baking Course Graduate",
  },
  {
    text: "Super class mom.... All class exordinary super.... Best part last left 15mins no miss panniten mom....love this class ... very useful mam",
    author: "Course Participant",
    role: "Workshop Attendee",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-cream-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Testimonials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from our baking and art course graduates
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="p-8 bg-card hover:shadow-xl transition-shadow duration-500 border-none">
                <Quote className="w-10 h-10 text-chocolate/20 mb-4" />
                <p className="text-lg mb-6 leading-relaxed text-balance">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-chocolate">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
