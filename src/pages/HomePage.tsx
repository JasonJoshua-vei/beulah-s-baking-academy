// src/pages/HomePage.tsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Button as UiButton } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import freshdesert from "@/assets/shop.jpg";
import Bakingclass from "@/assets/home.jpg";
import coursesData from "@/data/courses.json";

import yummyblondies from "@/assets/yummy blondies.png";
import yummybrownies from "@/assets/yummy brownies.jpg";
import deliciouscupcakes from "@/assets/Delicious cupcakes.jpg";
import mouthwateringcakes from "@/assets/mouthwatering-cakes.jpg";

/* fallback */
const fallbackImages = [yummybrownies, mouthwateringcakes, deliciouscupcakes, yummyblondies];

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

let idCounter = 0;
const uniqueId = (prefix = "id") => `${prefix}_${Date.now()}_${idCounter++}`;
const ORDER_FORM_URL = "https://forms.gle/AUT9suo7jX4Svo2Z9";

/* ProductCard same as before, but container is now a semi-circular arch */
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
    await controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 28 } });
  };
  return (
    <motion.div
      variants={itemVariants}
      className="text-center transform-gpu product-card"
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        animate={controls}
        className="arch-card bg-card rounded-none mb-4 flex items-center justify-center overflow-hidden shadow-lg cursor-grab relative"
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
        {/* Decorative arc overlay (subtle) */}
        <span aria-hidden className="arch-decor" />
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

/* --- Testimonials data (you can edit later) --- */
const testimonialsSeed = [
  {
    id: "t1",
    name: "Meera K.",
    location: "Chennai",
    text: "Amazing course — learned baking techniques that I still use. The lessons were super clear and fun.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Arjun P.",
    location: "Pudukottai",
    text: "Certificate process was smooth. The hands-on assignments helped me build confidence to bake for customers.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Sahana R.",
    location: "Madurai",
    text: "Affordable and professional. I ordered cakes too — delicious and always on time!",
    rating: 5,
  },
  {
    id: "t4",
    name: "Kavya S.",
    location: "Trichy",
    text: "Tutor was patient and the mini-projects are perfect for beginners. Highly recommended.",
    rating: 5,
  },
  {
    id: "t5",
    name: "Ramesh V.",
    location: "Coimbatore",
    text: "Great mix of theory and practical. Loved the community and the certificate helped my catering business.",
    rating: 5,
  },
];

/* TestimonialsMarquee: right → left continuous marquee, pause-on-hover.
   Styling uses the exact colors you provided:
    - CREAM (#F2E6DC)
    - CHOCO (#2E2622)
    - COCO  (#4A2C21)
    - MOCHA (#A18C7B)
*/
const TestimonialsMarquee: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  // duplicate list to create seamless loop
  const items = [...testimonialsSeed, ...testimonialsSeed];

  // pause on hover using CSS class (no JS needed).
  return (
    <div className="w-full testimonials-wrap">
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex gap-6 will-change-transform testimonials-marquee pause-on-hover"
          ref={marqueeRef}
          aria-hidden={false}
        >
          {items.map((t, idx) => (
            <div
              key={`${t.id}_${idx}`}
              className="testimonial-card flex-shrink-0 p-6 md:p-8"
              style={{ width: 360 /* fixed card width for better loop */ }}
              role="article"
            >
              <div className="testimonial-inner p-5 md:p-6 rounded-xl h-full flex flex-col justify-between">
                <div>
                  <p className="testimonial-text">“{t.text}”</p>
                  <div className="testimonial-location mt-3">{t.location}</div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">Student</div>
                  </div>
                  <div className="testimonial-rating">{Array.from({ length: t.rating }).map((_, i) => "★").join("")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots (optional) - shows number of unique testimonials */}
      <div className="mt-6 flex justify-center gap-2">
        {testimonialsSeed.map((_, i) => (
          <span key={i} className={`dot`} />
        ))}
      </div>

      {/* Inline styles (colors from your palette) */}
      <style>{`
        /* Palette variables */
        :root {
          --cream: #F2E6DC;
          --choco: #2E2622;
          --coco: #4A2C21;
          --mocha: #A18C7B;
        }

        /* marquee animation - right -> left (translate negative) */
        @keyframes testimonials-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .testimonials-marquee {
          display: flex;
          align-items: stretch;
          gap: 20px;
          animation: testimonials-marquee 28s linear infinite;
          padding: 8px 12px;
        }

        .pause-on-hover:hover {
          animation-play-state: paused !important;
        }

        .testimonial-card {
          box-sizing: border-box;
        }

        .testimonial-inner {
          background: linear-gradient(180deg, rgba(246,238,232,0.9), var(--cream));
          border: 1px solid rgba(46,38,34,0.06);
          color: var(--choco);
          box-shadow: 0 10px 30px rgba(46,38,34,0.06);
        }

        .testimonial-text {
          font-size: 15px;
          line-height: 1.5;
          color: var(--choco);
          font-weight: 500;
        }

        .testimonial-location {
          font-size: 13px;
          color: var(--coco);
          opacity: 0.9;
        }

        .testimonial-name {
          font-weight: 700;
          color: var(--choco);
        }

        .testimonial-role {
          font-size: 12px;
          color: var(--coco);
          opacity: 0.85;
        }

        .testimonial-rating {
          font-size: 14px;
          color: var(--mocha);
          font-weight: 700;
        }

        .dot {
          width: 9px;
          height: 9px;
          background: rgba(46,38,34,0.12);
          border-radius: 999px;
          display: inline-block;
        }

        /* slightly emphasize first dot */
        .dot:first-child {
          background: var(--choco);
        }

        /* responsive tweaks */
        @media (max-width: 900px) {
          .testimonial-card { width: 320px; }
        }
        @media (max-width: 520px) {
          .testimonial-card { width: 280px; padding: 0 6px; }
          .testimonials-marquee { animation-duration: 20s; }
        }
      `}</style>
    </div>
  );
};

const TestimonialsCarousel: React.FC = () => {
  // wrapper that uses the marquee component for layout parity with the rest of the page
  return (
    <div>
      <TestimonialsMarquee />
    </div>
  );
};

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
    setClones((s) => [
      ...s,
      {
        id,
        img: imgSrc,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height,
      },
    ]);
    setTimeout(() => setClones((s) => s.filter((c) => c.id !== id)), 1000);
  };

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
    setTimeout(
      () => setParticles((s) => s.filter((p) => !newParticles.find((n) => n.id === p.id))),
      900
    );
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
    const rect = (imgEl as HTMLImageElement)?.getBoundingClientRect
      ? (imgEl as HTMLImageElement).getBoundingClientRect()
      : target.getBoundingClientRect();
    spawnClone(imgSrc, rect);
    spawnParticles(
      rect.left + rect.width / 2 + window.scrollX,
      rect.top + rect.height / 2 + window.scrollY
    );
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

  // GSAP for parallax + reveal
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
            scrollTrigger: {
              trigger: ".discover-desserts",
              scrub: 0.8,
              start: "top bottom",
              end: "bottom top",
            },
          });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".take-a-bite-section",
              start: "top 80%",
              end: "bottom 10%",
            },
          });
          tl.from(".take-a-bite-section .product-card", {
            y: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
          });
        }, containerRef);
      } catch {}
    })();
    return () => {
      try {
        if (ctx) ctx.revert();
      } catch {}
      if (scrollTrigger && scrollTrigger.kill)
        try {
          scrollTrigger.kill();
        } catch {}
    };
  }, []);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    index: number,
    productTitle?: string
  ) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  };

  /*
    TAKE-A-BITE AUTOSCROLL CAROUSEL:
    We render the product list twice inside a wide flex container and animate translateX to create an infinite left→right movement.
    Hover pauses the animation (via CSS).
  */

  return (
    <div className="min-h-screen" ref={containerRef}>
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 origin-left h-1 z-50 bg-gradient-to-r from-chocolate to-accent"
        aria-hidden
      />

      <Hero />

      {/* Discover: image half (left) */}
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
                className="absolute inset-0 w-full h-full object-cover parallax-img rounded-tl-[28px] rounded-bl-[28px]"
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Discover desserts that speak the language of love.
              </h2>
              <p className="text-lg text-muted-foreground mb-6 tracking-wide">
                SWEET TREATS, BAKED FRESH AT HOME.
              </p>
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <UiButton
                  variant="outline"
                  className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50 rounded-none"
                  onClick={() => navigate("/shop")}
                >
                  Click here to shop
                </UiButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills section: image half (right) */}
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Skills That Last a Lifetime
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                JOIN OUR ONLINE CERTIFIED COURSES ON BAKING AND MORE
              </p>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 280 }}>
                <UiButton
                  variant="cream"
                  className="rounded-none"
                  onClick={() => navigate("/courses")}
                >
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
                className="absolute inset-0 w-full h-full object-cover rounded-tr-[28px] rounded-br-[28px]"
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

      {/* Take a Bite: auto-scrolling carousel */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background relative take-a-bite-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Take a bite!</h2>
            <p className="text-muted-foreground">
              Handcrafted treats and class snippets from our students.
            </p>
          </motion.div>

          {/* Carousel wrapper */}
          <div className="relative overflow-hidden">
            {/* We render the product list twice to create a smooth looping marquee */}
            <div
              className="flex gap-6 will-change-transform animate-marquee pause-on-hover"
              style={{ width: "max-content", alignItems: "flex-start" }}
              ref={gridRef}
            >
              {/* first copy (duplicated for infinite marquee) */}
              {coursesData.products.concat(coursesData.products).map((product: any, index: number) => {
                const imgSrc = getImageSrc(
                  product,
                  index % coursesData.products.length
                );
                // constrain width to a fixed tile so marquee looks uniform
                return (
                  <div
                    key={`${product.id}_${index}`}
                    style={{ minWidth: 220, maxWidth: 260 }}
                  >
                    <ProductCard
                      product={product}
                      index={index % coursesData.products.length}
                      imgSrc={imgSrc}
                      gridRef={gridRef}
                      onProductClick={handleProductClick}
                      onImageError={handleImageError}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-10">
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -4 }}>
              <UiButton
                size="lg"
                className="bg-chocolate hover:bg-chocolate-dark text-cream-50 px-8 py-4 rounded-none"
                onClick={handleGlobalOrder}
              >
                Order Now
              </UiButton>
            </motion.div>
          </div>
        </div>

        {/* clones */}
        {clones.map((c) => (
          <motion.div
            key={c.id}
            initial={{
              opacity: 0,
              scale: 0.6,
              x: c.x,
              y: c.y,
            }}
            animate={{
              opacity: 1,
              scale: 1.25,
              x: c.x - c.w * 0.1,
              y: c.y - c.h * 0.15,
            }}
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
            <img
              src={c.img}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 0,
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
            />
          </motion.div>
        ))}

        {/* particles */}
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
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6" cy="6" r="6" fill={p.color || "#f0d6c7"} />
            </svg>
          </motion.div>
        ))}

        {clones.length > 0 && (
          <div className="fixed bottom-6 right-6 z-60">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUndo}
              className="bg-white/95 border border-chocolate text-chocolate rounded-none px-4 py-2 shadow-lg backdrop-blur"
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
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <FAQAccordion />
        </div>
      </section>

      {/* Inline styles for marquee animation + pause on hover + arch card */}
      <style>{`
        /* marquee: translates left; because we duplicated content, it loops seamlessly */
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          align-items: center;
          gap: 24px;
          animation: marquee-left 18s linear infinite;
        }
        /* pause on hover */
        .pause-on-hover:hover {
          animation-play-state: paused !important;
        }

        /* Semi-circular arch container for Take a Bite cards */
        .arch-card {
          position: relative;
          /* tall-ish door/arch feeling */
          aspect-ratio: 3 / 4;
          border-radius: 9999px 9999px 0 0; /* big curve top, flat bottom */
          overflow: hidden;
        }

        /* subtle inner outline (existing) */
        .arch-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border-bottom: none;
          border: 1px solid rgba(0, 0, 0, 0.05);
          pointer-events: none;
          z-index: 1;
        }

        /* NEW: decorative arc border overlay across the arch top.
           We purposely use :after and a border with border-bottom:none so only the top semicircle shows.
           The overlay is inset a little so it reads as a border over the arch.
        */
        .arch-card::after {
          content: '';
          position: absolute;
          left: 8px;
          right: 8px;
          top: 6px;
          height: 54%;
          border-top-left-radius: 9999px;
          border-top-right-radius: 9999px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border: 3px solid rgba(255,255,255,0.55); /* light highlight */
          border-bottom: none;
          pointer-events: none;
          z-index: 5;
          /* subtle shadow to lift the arc */
          box-shadow: 0 6px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.12);
          mix-blend-mode: screen;
        }

        /* optional decorative accent inside arch when images are dark */
        .arch-decor {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 28%;
          background: linear-gradient(180deg, rgba(255,255,255,0.06), transparent);
          z-index: 4;
          pointer-events: none;
        }

        /* ensure the decorative border doesn't show on very small cards */
        @media (max-width: 420px) {
          .arch-card::after { display: none; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
