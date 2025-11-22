import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: string;
  shortDesc: string;
  image: string;
  delay?: number;
}

export const ProductCard = ({ title, price, shortDesc, delay = 0 }: ProductCardProps) => {
  const handleOrder = () => {
    window.open("https://forms.gle/AUT9suo7jX4Svo2Z9", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      className="group relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-300 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-chocolate/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="text-6xl">🧁</div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-balance flex-1">{title}</h3>
          <span className="text-2xl font-bold text-chocolate whitespace-nowrap ml-3">{price}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {shortDesc}
        </p>
        
        <Button 
          onClick={handleOrder}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 group-hover:shadow-lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Order Now
        </Button>
      </div>
    </motion.div>
  );
};
