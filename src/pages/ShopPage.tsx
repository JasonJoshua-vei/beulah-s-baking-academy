import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import coursesData from "@/data/courses.json";

const ShopPage = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
                Homemade Cakes & Brownies
                <br />
                That Taste Like Love.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Indulge in handcrafted cakes, fudgy brownies, and buttery blondies — made in a
                home kitchen with real ingredients and real love.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="text-9xl drop-shadow-2xl">🎂</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Take a bite!
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {coursesData.products.map((product, index) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                shortDesc={product.shortDesc}
                image={product.image}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pre-order Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-cream-300">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Pre-order now</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              At Sweet Treats, every dessert begins in a warm home kitchen — not a factory.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              We believe the best memories come from fresh, flavorful, lovingly baked goodies.
            </p>
            <Button
              size="lg"
              className="bg-chocolate hover:bg-chocolate-dark text-cream-50 text-lg px-12 py-6"
              onClick={() =>
                window.open("https://forms.gle/AUT9suo7jX4Svo2Z9", "_blank")
              }
            >
              Order Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
