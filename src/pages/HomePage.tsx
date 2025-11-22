import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/Testimonials";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import coursesData from "@/data/courses.json";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Discover Desserts Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🍰
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Discover desserts that speak the language of love.
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                SWEET TREATS, BAKED FRESH AT HOME.
              </p>
              <Button
                variant="outline"
                className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50"
                onClick={() => navigate("/shop")}
              >
                Click here to shop
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Skills That Last a Lifetime
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                JOIN OUR ONLINE CERTIFIED COURSES ON BAKING AND MORE
              </p>
              <Button
                className="bg-chocolate hover:bg-chocolate-dark text-cream-50"
                onClick={() => navigate("/courses")}
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🧁
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Take a Bite Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Take a bite!</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coursesData.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="aspect-square bg-card rounded-3xl mb-4 flex items-center justify-center text-6xl shadow-lg hover:shadow-xl transition-shadow">
                  {index === 0 ? "🍫" : index === 1 ? "🎂" : index === 2 ? "🧁" : "🍪"}
                </div>
                <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.shortDesc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQAccordion />
    </div>
  );
};

export default HomePage;
