// src/pages/HomePage.tsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Button as UiButton } from "@/components/ui/button";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useNavigate } from "react-router-dom";

import freshdesert from "@/assets/shop.jpg";
import Bakingclass from "@/assets/home.jpg";
import coursesData from "@/data/courses.json";

import yummyblondies from "@/assets/yummy blondies.png";
import yummybrownies from "@/assets/yummy brownies.jpg";
import deliciouscupcakes from "@/assets/Delicious cupcakes.jpg";
import mouthwateringcakes from "@/assets/mouthwatering-cakes.jpg";

import ProductCard from "@/components/ProductCard";

/* fallback images */
const fallbackImages = [yummybrownies, mouthwateringcakes, deliciouscupcakes, yummyblondies];

let idCounter = 0;
const uniqueId = (prefix = "id") => `${prefix}_${Date.now()}_${idCounter++}`;
const ORDER_FORM_URL = "https://forms.gle/AUT9suo7jX4Svo2Z9";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 800], [0, -60], { clamp: true });

  const gridRef = useRef<HTMLDivElement | null>(null);
  const [clones, setClones] = useState<{ id: string; img: string; x: number; y: number; w: number; h: number }[]>([]);
  const [particles, setParticles] = useState<{ id: string; x: number; y: number; color?: string }[]>([]);
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
          gsap.to(".discover-desserts .parallax-img", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".discover-desserts", scrub: 0.8, start: "top bottom", end: "bottom top" } });
          const tl = gsap.timeline({ scrollTrigger: { trigger: ".take-a-bite-section", start: "top 80%", end: "bottom 10%" } });
          tl.from(".take-a-bite-section .product-card", { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" });
        }, containerRef);
      } catch {}
    })();
    return () => { try { if (ctx) ctx.revert(); } catch {} if (scrollTrigger && scrollTrigger.kill) try { scrollTrigger.kill(); } catch {} };
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, productTitle?: string) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  };

  return (
    <div className="min-h-screen" ref={containerRef}>
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 origin-left h-1 z-50 bg-gradient-to-r from-chocolate to-accent" aria-hidden />

      <Hero />

      {/* Discover */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background overflow-hidden relative discover-desserts">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative w-full md:h-[100vh] lg:h-[100vh] overflow-hidden">
              <motion.img src={freshdesert} alt="Fresh desserts preview" className="absolute inset-0 w-full h-full object-cover parallax-img rounded-tl-[28px] rounded-bl-[28px]" initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} transition={{ duration: 1.2 }} loading="lazy" onError={(e) => handleImageError(e, 0, "Discover hero")} />
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/10 to-transparent" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }} className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover desserts that speak the language of love.</h2>
              <p className="text-lg text-muted-foreground mb-6 tracking-wide">SWEET TREATS, BAKED FRESH AT HOME.</p>
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <UiButton variant="outline" className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50 rounded-none" onClick={() => navigate("/shop")}>Click here to shop</UiButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Skills That Last a Lifetime</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">JOIN OUR ONLINE CERTIFIED COURSES ON BAKING AND MORE</p>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 280 }}>
                <UiButton variant="cream" className="rounded-none" onClick={() => navigate("/courses")}>Learn More</UiButton>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="relative w-full md:h-[100vh] lg:h-[100vh] overflow-hidden">
              <motion.img src={Bakingclass} alt="Baking class preview" className="absolute inset-0 w-full h-full object-cover rounded-tr-[28px] rounded-br-[28px]" initial={{ scale: 1.03 }} whileInView={{ scale: 1 }} transition={{ duration: 1.2 }} loading="lazy" onError={(e) => handleImageError(e, 1, "Skills image")} />
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate/10 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Take a Bite */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background relative take-a-bite-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Take a bite!</h2>
            <p className="text-muted-foreground">Handcrafted treats and class snippets from our students.</p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="flex gap-6 will-change-transform animate-marquee pause-on-hover" style={{ width: "max-content", alignItems: "flex-start" }} ref={gridRef}>
              {coursesData.products.concat(coursesData.products).map((product: any, index: number) => {
                const imgSrc = getImageSrc(product, index % coursesData.products.length);
                return (
                  <div key={`${product.id}_${index}`} style={{ minWidth: 220, maxWidth: 260 }}>
                    <ProductCard product={product} index={index % coursesData.products.length} imgSrc={imgSrc} gridRef={gridRef} onProductClick={handleProductClick} onImageError={handleImageError} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-10">
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -4 }}>
              <UiButton size="lg" className="bg-chocolate hover:bg-chocolate-dark text-cream-50 px-8 py-4 rounded-none" onClick={handleGlobalOrder}>Order Now</UiButton>
            </motion.div>
          </div>
        </div>

        {/* clones */}
        {clones.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, scale: 0.6, x: c.x, y: c.y }} animate={{ opacity: 1, scale: 1.25, x: c.x - c.w * 0.1, y: c.y - c.h * 0.15 }} transition={{ duration: 0.65, ease: "easeOut" }} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", width: c.w, height: c.h, zIndex: 80 }}>
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }} />
          </motion.div>
        ))}

        {/* particles */}
        {particles.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.9 }} animate={{ x: [p.x, p.x + (Math.random() * 160 - 80)], y: [p.y, p.y - (60 + Math.random() * 80)], opacity: [1, 0], scale: [0.9, 0.2] }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: "absolute", left: 0, top: 0, zIndex: 90, pointerEvents: "none" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="6" fill={p.color || "#f0d6c7"} /></svg>
          </motion.div>
        ))}

        {clones.length > 0 && (
          <div className="fixed bottom-6 right-6 z-60">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleUndo} className="bg-white/95 border border-chocolate text-chocolate rounded-none px-4 py-2 shadow-lg backdrop-blur" aria-label="Undo last image spawn">Undo</motion.button>
          </div>
        )}
      </section>

      {/* Testimonials + FAQ */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <TestimonialsMarquee />
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <FAQAccordion />
        </div>
      </section>

      {/* inline styles copied from your previous file (arch, marquee) */}
      <style>{`
        @keyframes marquee-left { 0% { transform: translateX(0);} 100% { transform: translateX(-50%);} }
        .animate-marquee { display:flex; align-items:center; gap:24px; animation: marquee-left 18s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused !important; }

        .arch-card { position: relative; aspect-ratio: 3 / 4; border-radius: 9999px 9999px 0 0; overflow: hidden; }
        .arch-card::before { content:''; position:absolute; inset:0; border-radius:inherit; border-bottom:none; border:1px solid rgba(0,0,0,0.05); pointer-events:none; z-index:1; }
        .arch-card::after { content:''; position:absolute; left:8px; right:8px; top:6px; height:54%; border-top-left-radius:9999px; border-top-right-radius:9999px; border-bottom-left-radius:0; border-bottom-right-radius:0; border:3px solid rgba(255,255,255,0.55); border-bottom:none; pointer-events:none; z-index:5; box-shadow:0 6px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.12); mix-blend-mode: screen; }
        .arch-decor { position:absolute; left:0; right:0; top:0; height:28%; background: linear-gradient(180deg, rgba(255,255,255,0.06), transparent); z-index:4; pointer-events:none; }
        @media (max-width: 420px) { .arch-card::after { display:none; } }
      `}</style>
    </div>
  );
};

export default HomePage;
