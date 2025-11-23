import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/Testimonials";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import freshdesert from "@/assets/shop.jpg";
import Bakingclass from "@/assets/home.jpg";
import coursesData from "@/data/courses.json";

import yummyblondies from "@/assets/yummy blondies.png";
import yummybrownies from "@/assets/yummy brownies.jpg";
import deliciouscupcakes from "@/assets/Delicious cupcakes.jpg";
import mouthwateringcakes from "@/assets/mouthwatering-cakes.jpg";

/**
 * HomePage.tsx — Snap-back drag + click clones + particles + GSAP + audio click
 */

/* ---------------------------
   Fallback images (correct)
   --------------------------- */
const fallbackImages = [
  yummybrownies,
  mouthwateringcakes,
  deliciouscupcakes,
  yummyblondies,
];

/* ---------------------------
   Motion Variants
   --------------------------- */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

let idCounter = 0;
const uniqueId = (prefix = "id") => `${prefix}_${Date.now()}_${idCounter++}`;

const ORDER_FORM_URL = "https://forms.gle/AUT9suo7jX4Svo2Z9";

/* ---------------------------
   ProductCard: self-contained card component
   - has its own animation controls to snap back
   - handles click/doubleclick/drag behavior
   --------------------------- */
type ProductCardProps = {
  product: any;
  index: number;
  imgSrc: string;
  gridRef: React.RefObject<HTMLElement | null>;
  onProductClick: (e: React.MouseEvent, imgSrc: string) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, title?: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, index, imgSrc, gridRef, onProductClick, onImageError }) => {
  const controls = useAnimation();

  // When drag ends, animate back to origin with spring
  const handleDragEnd = async (_: any, info: any) => {
    // disable momentum and snap back with spring
    await controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="text-center transform-gpu product-card"
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        animate={controls}
        className="aspect-square bg-card rounded-3xl mb-4 flex items-center justify-center overflow-hidden shadow-lg cursor-grab"
        whileHover={{ rotate: -1, y: -6 }}
        whileTap={{ cursor: "grabbing" }}
        transition={{ type: "spring", stiffness: 280 }}
        drag={true}
        dragConstraints={gridRef}
        dragMomentum={false}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        onDoubleClick={() => window.open(ORDER_FORM_URL, "_blank")}
        onClick={(e) => onProductClick(e as unknown as React.MouseEvent, imgSrc)}
        role="button"
        aria-label={`Open ${product.title}`}
      >
        <motion.img
          src={imgSrc}
          alt={product.title}
          className="w-full h-full object-cover select-none"
          initial={{ scale: 1 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
          loading="lazy"
          draggable={false}
          onError={(e) => onImageError(e, index, product.title)}
        />
      </motion.div>

      <h3 className="font-bold text-lg mb-1">{product.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{product.shortDesc}</p>
    </motion.div>
  );
};

/* ---------------------------
   HomePage component
   --------------------------- */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Scroll progress bar
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // subtle parallax transforms for hero-callout sections
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 600], [0, -40], { clamp: true });

  // Refs & state used for clone placement & particle bursts
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [clones, setClones] = useState<
    { id: string; img: string; x: number; y: number; w: number; h: number }[]
  >([]);
  const [particles, setParticles] = useState<
    { id: string; x: number; y: number; color?: string }[]
  >([]);

  // GSAP timeline reference
  const gsapRef = useRef<any>(null);

  // Helper: decide which image src to use (product.image only if a usable string)
  const getImageSrc = (product: any, index: number) => {
    const candidate = product?.image;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  // Add a clone element (expanding image) positioned at bounding rect of clicked element
  const spawnClone = (imgSrc: string, rect: DOMRect) => {
    const id = uniqueId("clone");
    setClones((s) => [
      ...s,
      { id, img: imgSrc, x: rect.left + window.scrollX, y: rect.top + window.scrollY, w: rect.width, h: rect.height },
    ]);
    // remove after ~900–1000ms (allow animation)
    setTimeout(() => {
      setClones((s) => s.filter((c) => c.id !== id));
    }, 1000);
  };

  // Spawn a burst of small particles at the clicked point (page coords)
  const spawnParticles = (pageX: number, pageY: number) => {
    const colors = ["#f6d3c6", "#d6b89a", "#f0e1d8", "#c9987d"];
    const burstId = uniqueId("burst");
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `${burstId}_${i}`,
      x: pageX,
      y: pageY,
      color: colors[i % colors.length],
    }));
    setParticles((s) => [...s, ...newParticles]);
    setTimeout(() => {
      setParticles((s) => s.filter((p) => !newParticles.find((n) => n.id === p.id)));
    }, 900);
  };

  // Small WebAudio click pop (no files)
  const playClickSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 660;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.02, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start();
      o.stop(now + 0.14);
      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
      }, 200);
    } catch (err) {
      // ignore if blocked until user gesture
    }
  };

  // Handler when a product image is clicked
  const handleProductClick = (e: React.MouseEvent, imgSrc: string) => {
    const target = e.currentTarget as HTMLElement;
    const imgEl = target.querySelector("img");
    const rect = (imgEl as HTMLImageElement)?.getBoundingClientRect
      ? (imgEl as HTMLImageElement).getBoundingClientRect()
      : target.getBoundingClientRect();

    spawnClone(imgSrc, rect);
    spawnParticles(rect.left + rect.width / 2 + window.scrollX, rect.top + rect.height / 2 + window.scrollY);
    playClickSound();
  };

  // Undo — remove last clone + associated particles (if any)
  const handleUndo = () => {
    setClones((s) => {
      if (!s.length) return s;
      const next = s.slice(0, s.length - 1);
      setParticles((p) => p.slice(0, Math.max(0, p.length - 8)));
      return next;
    });
  };

  // Global Order Now (single CTA for all products)
  const handleGlobalOrder = () => {
    playClickSound();
    window.open(ORDER_FORM_URL, "_blank", "noopener,noreferrer");
  };

  // Clean up any lingering clones/particles when component unmounts
  useEffect(() => {
    return () => {
      setClones([]);
      setParticles([]);
    };
  }, []);

  // Init GSAP ScrollTrigger sequences dynamically (no crash if not installed)
  useEffect(() => {
    let ctx: any;
    let scrollTrigger: any;

    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        scrollTrigger = (await import("gsap/ScrollTrigger")).default;
        gsap.registerPlugin(scrollTrigger);
        gsapRef.current = gsap;

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".take-a-bite-section",
              start: "top 80%",
              end: "bottom 10%",
              scrub: false,
            },
          });
          tl.from(".take-a-bite-section .product-card", {
            y: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(".discover-desserts .parallax-img", {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: ".discover-desserts",
              scrub: 0.8,
              start: "top bottom",
              end: "bottom top",
            },
          });
        }, containerRef);
      } catch (err) {
        // GSAP optional — fine without it
      }
    })();

    return () => {
      try {
        if (ctx) ctx.revert();
      } catch {}
      if (scrollTrigger && scrollTrigger.kill) {
        try {
          scrollTrigger.kill();
        } catch {}
      }
    };
  }, []);

  // onError handler for images — swap to fallback and log
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, productTitle?: string) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    if (e.currentTarget.src !== fallback) {
      console.warn(`Image failed to load for "${productTitle || ""}". Falling back to local asset.`, e.currentTarget.src);
      e.currentTarget.src = fallback;
    }
  };

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 origin-left h-1 z-50 bg-gradient-to-r from-chocolate to-accent"
        aria-hidden
      />

      <Hero />

      {/* Discover Desserts Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background overflow-hidden relative discover-desserts">
        <motion.div
          className="pointer-events-none absolute left-8 top-16 opacity-40"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="3" fill="#d6b89a" />
            <circle cx="24" cy="6" r="2" fill="#b88f73" />
            <circle cx="40" cy="16" r="2.5" fill="#f0d6c7" />
            <circle cx="58" cy="10" r="1.8" fill="#e3c3ab" />
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <motion.img
                src={freshdesert}
                alt="Fresh desserts preview"
                className="absolute inset-0 w-full h-full object-cover parallax-img"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                loading="lazy"
                onError={(e) => handleImageError(e, 0, "Discover hero")}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/10 to-transparent" />
              <motion.div style={{ y: yOffset }} className="absolute inset-0 flex items-center justify-center text-8xl pointer-events-none" aria-hidden />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover desserts that speak the language of love.</h2>
              <p className="text-lg text-muted-foreground mb-6 tracking-wide">SWEET TREATS, BAKED FRESH AT HOME.</p>

              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Button variant="outline" className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50" onClick={() => navigate("/shop")}>
                  Click here to shop
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-background relative overflow-hidden">
        <svg className="absolute -top-10 left-0 w-full h-20 opacity-30" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,40 C360,120 1080,0 1440,70 L1440,120 L0,120 Z" fill="#f3e8e3" />
        </svg>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Skills That Last a Lifetime</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">JOIN OUR ONLINE CERTIFIED COURSES ON BAKING AND MORE</p>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 280 }}>
                <Button className="bg-chocolate hover:bg-chocolate-dark text-cream-50" onClick={() => navigate("/courses")}>
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <motion.img src={Bakingclass} alt="Baking class preview" className="absolute inset-0 w-full h-full object-cover" initial={{ scale: 1.03 }} whileInView={{ scale: 1 }} transition={{ duration: 1.2 }} loading="lazy" onError={(e) => handleImageError(e, 1, "Skills image")} />
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-8xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Take a Bite Section with product images + interactions */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background relative take-a-bite-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Take a bite!</h2>
            <p className="text-muted-foreground">Handcrafted treats and class snippets from our students.</p>
          </motion.div>

          {/* product grid */}
          <motion.div ref={gridRef} variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coursesData.products.map((product: any, index: number) => {
              const imgSrc = getImageSrc(product, index);

              return (
                <ProductCard
                  key={product.id || index}
                  product={product}
                  index={index}
                  imgSrc={imgSrc}
                  gridRef={gridRef}
                  onProductClick={handleProductClick}
                  onImageError={handleImageError}
                />
              );
            })}
          </motion.div>

          {/* ONE global order button instead of per-product */}
          <div className="text-center mt-10">
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -4 }}>
              <Button size="lg" className="bg-chocolate hover:bg-chocolate-dark text-cream-50 px-8 py-4" onClick={handleGlobalOrder}>
                Order Now
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Render clones (expanding images spawned on click) */}
        {clones.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.6, x: c.x, y: c.y }}
            animate={{ opacity: 1, scale: 1.25, x: c.x - c.w * 0.1, y: c.y - c.h * 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
              width: c.w,
              height: c.h,
              zIndex: 80,
            }}
          >
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }} />
          </motion.div>
        ))}

        {/* Render lightweight particles bursts */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.9 }}
            animate={{
              x: [p.x, p.x + (Math.random() * 160 - 80)],
              y: [p.y, p.y - (60 + Math.random() * 80)],
              opacity: [1, 0],
              scale: [0.9, 0.2],
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 90,
              pointerEvents: "none",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" fill={p.color || "#f0d6c7"} />
            </svg>
          </motion.div>
        ))}

        {/* Undo Floating Button (appears when clones exist) */}
        {clones.length > 0 && (
          <div className="fixed bottom-6 right-6 z-60">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUndo}
              className="bg-white/95 border border-chocolate text-chocolate rounded-full px-4 py-2 shadow-lg backdrop-blur"
              aria-label="Undo last image spawn"
            >
              Undo
            </motion.button>
          </div>
        )}
      </section>

      {/* Testimonials + FAQ */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Testimonials />
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <FAQAccordion />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
