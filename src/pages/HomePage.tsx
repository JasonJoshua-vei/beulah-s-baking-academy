// src/pages/HomePage.tsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Button as UiButton } from "@/components/ui/button";
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

/* fallback images */
const fallbackImages = [yummybrownies, mouthwateringcakes, deliciouscupcakes, yummyblondies];

/* motion variants */
const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

let idCounter = 0;
const uniqueId = (prefix = "id") => `${prefix}_${Date.now()}_${idCounter++}`;
const ORDER_FORM_URL = "https://forms.gle/AUT9suo7jX4Svo2Z9";

/* ProductCard */
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

  const handleDragEnd = async () => {
    // snap-back spring
    await controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 28 } });
  };

  return (
    <motion.div variants={itemVariants} className="text-center transform-gpu product-card" whileHover={{ scale: 1.03 }}>
      <motion.div
        animate={controls}
        className="aspect-square bg-card rounded-none mb-4 flex items-center justify-center overflow-hidden shadow-lg cursor-grab"
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

/* HomePage */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // scroll progress
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // parallax offset used for some decorative elements
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 800], [0, -60], { clamp: true });

  // clones & particles
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [clones, setClones] = useState<{ id: string; img: string; x: number; y: number; w: number; h: number }[]>([]);
  const [particles, setParticles] = useState<{ id: string; x: number; y: number; color?: string }[]>([]);

  // GSAP ref
  const gsapRef = useRef<any>(null);

  const getImageSrc = (product: any, index: number) => {
    const candidate = product?.image;
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate;
    return fallbackImages[index % fallbackImages.length];
  };

  const spawnClone = (imgSrc: string, rect: DOMRect) => {
    const id = uniqueId("clone");
    setClones((s) => [...s, { id, img: imgSrc, x: rect.left + window.scrollX, y: rect.top + window.scrollY, w: rect.width, h: rect.height }]);
    setTimeout(() => setClones((s) => s.filter((c) => c.id !== id)), 1000);
  };

  const spawnParticles = (pageX: number, pageY: number) => {
    const colors = ["#f6d3c6", "#d6b89a", "#f0e1d8", "#c9987d"];
    const burstId = uniqueId("burst");
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({ id: `${burstId}_${i}`, x: pageX, y: pageY, color: colors[i % colors.length] }));
    setParticles((s) => [...s, ...newParticles]);
    setTimeout(() => setParticles((s) => s.filter((p) => !newParticles.find((n) => n.id === p.id))), 900);
  };

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
      setTimeout(() => ctx.close().catch(() => {}), 220);
    } catch {}
  };

  const handleProductClick = (e: React.MouseEvent, imgSrc: string) => {
    const target = e.currentTarget as HTMLElement;
    const imgEl = target.querySelector("img");
    const rect = (imgEl as HTMLImageElement)?.getBoundingClientRect ? (imgEl as HTMLImageElement).getBoundingClientRect() : target.getBoundingClientRect();
    spawnClone(imgSrc, rect);
    spawnParticles(rect.left + rect.width / 2 + window.scrollX, rect.top + rect.height / 2 + window.scrollY);
    playClickSound();
  };

  const handleUndo = () => {
    setClones((s) => {
      if (!s.length) return s;
      const next = s.slice(0, s.length - 1);
      setParticles((p) => p.slice(0, Math.max(0, p.length - 8)));
      return next;
    });
  };

  const handleGlobalOrder = () => {
    playClickSound();
    window.open(ORDER_FORM_URL, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    return () => {
      setClones([]);
      setParticles([]);
    };
  }, []);

  // GSAP dynamic import for parallax + reveal
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
          gsap.to(".discover-desserts .parallax-img", {
            yPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: ".discover-desserts", scrub: 0.8, start: "top bottom", end: "bottom top" },
          });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: ".take-a-bite-section", start: "top 80%", end: "bottom 10%" },
          });
          tl.from(".take-a-bite-section .product-card", { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" });
        }, containerRef);
      } catch {
        // GSAP optional
      }
    })();

    return () => {
      try {
        if (ctx) ctx.revert();
      } catch {}
      if (scrollTrigger && scrollTrigger.kill) try { scrollTrigger.kill(); } catch {}
    };
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, productTitle?: string) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  };

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* progress bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 origin-left h-1 z-50 bg-gradient-to-r from-chocolate to-accent" aria-hidden />

      <Hero />

      {/* Discover Desserts: image covers left half on md+; text on right */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background overflow-hidden relative discover-desserts">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative w-full md:h-[100vh] lg:h-[100vh] overflow-hidden"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover desserts that speak the language of love.</h2>
              <p className="text-lg text-muted-foreground mb-6 tracking-wide">SWEET TREATS, BAKED FRESH AT HOME.</p>

              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <UiButton variant="outline" className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50 rounded-none" onClick={() => navigate("/shop")}>
                  Click here to shop
                </UiButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills section — image covers right half on md+; text on left */}
      <section className="py-20 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Skills That Last a Lifetime</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">JOIN OUR ONLINE CERTIFIED COURSES ON BAKING AND MORE</p>

              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 280 }}>
                {/* Learn more uses cream glow variant + sharp corners */}
                <UiButton variant="cream" className="rounded-none" onClick={() => navigate("/courses")}>
                  Learn More <ArrowRight className="ml-2 w-5 h-5" />
                </UiButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative w-full md:h-[100vh] lg:h-[100vh] overflow-hidden"
            >
              <motion.img
                src={Bakingclass}
                alt="Baking class preview"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.03 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                loading="lazy"
                onError={(e) => handleImageError(e, 1, "Skills image")}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/10 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Take a Bite products */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background relative take-a-bite-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Take a bite!</h2>
            <p className="text-muted-foreground">Handcrafted treats and class snippets from our students.</p>
          </motion.div>

          <motion.div ref={gridRef} variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coursesData.products.map((product: any, index: number) => {
              const imgSrc = getImageSrc(product, index);
              return <ProductCard key={product.id || index} product={product} index={index} imgSrc={imgSrc} gridRef={gridRef} onProductClick={handleProductClick} onImageError={handleImageError} />;
            })}
          </motion.div>

          <div className="text-center mt-10">
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -4 }}>
              <UiButton size="lg" className="bg-chocolate hover:bg-chocolate-dark text-cream-50 px-8 py-4 rounded-none" onClick={handleGlobalOrder}>
                Order Now
              </UiButton>
            </motion.div>
          </div>
        </div>

        {/* clones (expanding) */}
        {clones.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, scale: 0.6, x: c.x, y: c.y }} animate={{ opacity: 1, scale: 1.25, x: c.x - c.w * 0.1, y: c.y - c.h * 0.15 }} transition={{ duration: 0.65, ease: "easeOut" }} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", width: c.w, height: c.h, zIndex: 80 }}>
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }} />
          </motion.div>
        ))}

        {/* particles */}
        {particles.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.9 }} animate={{ x: [p.x, p.x + (Math.random() * 160 - 80)], y: [p.y, p.y - (60 + Math.random() * 80)], opacity: [1, 0], scale: [0.9, 0.2] }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: "absolute", left: 0, top: 0, zIndex: 90, pointerEvents: "none" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" fill={p.color || "#f0d6c7"} />
            </svg>
          </motion.div>
        ))}

        {clones.length > 0 && (
          <div className="fixed bottom-6 right-6 z-60">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleUndo} className="bg-white/95 border border-chocolate text-chocolate rounded-none px-4 py-2 shadow-lg backdrop-blur" aria-label="Undo last image spawn">
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
