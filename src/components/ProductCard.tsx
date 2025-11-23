// src/components/ProductCard.tsx
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const ORDER_FORM_URL = "https://forms.gle/AUT9suo7jX4Svo2Z9";

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

/**
 * This component accepts two kinds of usages:
 *
 * 1) Simple usage (legacy / other pages)
 *    <ProductCard title={} price={} shortDesc={} image={} delay={} />
 *
 * 2) Homepage/animated usage
 *    <ProductCard
 *      product={product}
 *      index={index}
 *      imgSrc={imgSrc}
 *      gridRef={gridRef}
 *      onProductClick={handleProductClick}
 *      onImageError={handleImageError}
 *    />
 *
 * The component auto-detects which usage based on presence of `product`.
 */
export type ProductCardProps =
  | {
      // animated/homepage variant
      product: any;
      index: number;
      imgSrc: string;
      gridRef?: React.RefObject<HTMLElement | null>;
      onProductClick?: (e: React.MouseEvent, imgSrc: string) => void;
      onImageError?: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, title?: string) => void;
      // optional: keep simple props undefined
      title?: never;
      price?: never;
      shortDesc?: never;
      image?: never;
      delay?: never;
      variant?: "arch" | "simple";
    }
  | {
      // simple legacy variant
      product?: undefined;
      title: string;
      price: string;
      shortDesc: string;
      image?: string;
      delay?: number;
      // optional props not used in legacy mode
      index?: never;
      imgSrc?: never;
      gridRef?: never;
      onProductClick?: never;
      onImageError?: never;
      variant?: "simple" | "arch";
    };

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  // detect mode
  const isAnimated = !!(props as any).product;

  if (isAnimated) {
    // animated / homepage mode
    const { product, index, imgSrc, gridRef, onProductClick, onImageError, variant } = props as any;
    const controls = useAnimation();

    const handleDragEnd = async () => {
      await controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 28 } });
    };

    const archClass = variant === "simple" ? "" : "arch-card";

    return (
      <motion.div variants={itemVariants} initial="hidden" whileInView="show" className="text-center transform-gpu product-card" whileHover={{ scale: 1.03 }}>
        <motion.div
          animate={controls}
          className={`${archClass} bg-card rounded-none mb-4 flex items-center justify-center overflow-hidden shadow-lg cursor-grab relative`}
          whileHover={{ rotate: -1, y: -6 }}
          whileTap={{ cursor: "grabbing" }}
          transition={{ type: "spring", stiffness: 280 }}
          drag={!!gridRef}
          dragConstraints={gridRef}
          dragMomentum={false}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => window.open(ORDER_FORM_URL, "_blank")}
          onClick={(e: React.MouseEvent) => (onProductClick ? onProductClick(e, imgSrc) : undefined)}
          role="button"
          aria-label={`Open ${product?.title ?? "product"}`}
        >
          {/* decorative arc overlay (keeps arch look) */}
          <span aria-hidden className="arch-decor" />
          <motion.img
            src={imgSrc}
            alt={product?.title ?? "product image"}
            className="w-full h-full object-cover select-none"
            initial={{ scale: 1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4 + (index || 0) * 0.6, repeat: Infinity, ease: "easeInOut" }}
            loading="lazy"
            draggable={false}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              if (onImageError) onImageError(e, index, product?.title);
            }}
          />
        </motion.div>

        <h3 className="font-bold text-lg mb-1">{product?.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product?.shortDesc}</p>
      </motion.div>
    );
  } else {
    // legacy/simple mode
    const { title, price, shortDesc, image, delay = 0, variant } = props as any;

    const handleOrder = () => {
      window.open(ORDER_FORM_URL, "_blank", "noopener,noreferrer");
    };

    // animation props similar to original simple card
    const motionProps = {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true, margin: "-50px" },
      transition: { duration: 0.5, delay },
      whileHover: { scale: 1.05, transition: { duration: 0.3 } },
    } as const;

    const isArch = variant === "arch";

    return (
      <motion.div {...motionProps} className={isArch ? "arch-card bg-card mb-4 flex items-center justify-center overflow-hidden shadow-lg cursor-grab relative" : "group relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"}>
        {/* If arch variant requested in legacy use-case, render image full-bleed inside arch */}
        {isArch ? (
          <>
            <span aria-hidden className="arch-decor" />
            {image ? (
              <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover select-none" />
            ) : (
              <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-300 flex items-center justify-center overflow-hidden">
                <div className="text-6xl">🧁</div>
              </div>
            )}
            <div className="p-4 mt-[calc(100%*0.05)]"> {/* slight spacing below arch for text */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-balance flex-1">{title}</h3>
                <span className="text-lg font-bold text-chocolate whitespace-nowrap ml-2">{price}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{shortDesc}</p>
              <Button onClick={handleOrder} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Now
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-300 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-chocolate/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-6xl">🧁</div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-balance flex-1">{title}</h3>
                <span className="text-2xl font-bold text-chocolate whitespace-nowrap ml-3">{price}</span>
              </div>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{shortDesc}</p>

              <Button onClick={handleOrder} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 group-hover:shadow-lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Now
              </Button>
            </div>
          </>
        )}
      </motion.div>
    );
  }
};

export default ProductCard;
