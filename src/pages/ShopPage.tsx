// src/pages/ShopPage.tsx
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import coursesData from "@/data/courses.json";

/* fallback / local asset images */
import yummyblondies from "@/assets/yummy blondies.png";
import yummybrownies from "@/assets/yummy brownies.jpg";
import deliciouscupcakes from "@/assets/Delicious cupcakes.jpg";
import mouthwateringcakes from "@/assets/mouthwatering-cakes.jpg";

/* IMPORTANT: using the uploaded hero file path (project provided). 
   Per your instructions, using the local path that was uploaded:
*/
import shopHero from "@/assets/shop-hero.png";

const fallbackImages = [yummybrownies, mouthwateringcakes, deliciouscupcakes, yummyblondies];
const ORDER_FORM_URL = "https://forms.gle/AUT9suo7jX4Svo2Z9";

let idCounter = 0;
const uniqueId = (prefix = "id") => `${prefix}_${Date.now()}_${idCounter++}`;

const ShopPage: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const productsMarqueeRef = useRef<HTMLDivElement | null>(null);
  const [clones, setClones] = useState<{ id: string; img: string; x: number; y: number; w: number; h: number }[]>([]);
  const [particles, setParticles] = useState<{ id: string; x: number; y: number; color?: string }[]>([]);

  // Combine existing products with extra ones (no price for new products)
  const extraProducts = [
    { id: "plum-cake", title: "Plum Cake", shortDesc: "Moist spiced plum cake — perfect for gifting.", image: "" },
    { id: "banana-bread", title: "Banana Bread", shortDesc: "Buttery banana bread with walnuts.", image: "" },
    { id: "truffle", title: "Chocolate Truffle", shortDesc: "Rich bite-sized truffles for chocoholics.", image: "" },
    { id: "lemon-bars", title: "Lemon Bars", shortDesc: "Tangy and sweet lemon squares.", image: "" },
  ];
  const allProducts = [...coursesData.products, ...extraProducts];

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  };

  const handleGlobalOrder = () => {
    playClickSound();
    window.open(ORDER_FORM_URL, "_blank", "noopener,noreferrer");
  };

  const handleUndo = () => {
    setClones((s) => {
      if (!s.length) return s;
      const next = s.slice(0, s.length - 1);
      setParticles((p) => p.slice(0, Math.max(0, p.length - 8)));
      return next;
    });
  };

  useEffect(() => {
    return () => {
      setClones([]);
      setParticles([]);
    };
  }, []);

  return (
    <div className="min-h-screen pt-24" style={{ background: "var(--cream)" }}>
      <style>{`
        :root {
          --cream: #F2E6DC;
          --choco: #2E2622;
          --coco: #4A2C21;
          --mocha: #A18C7B;
        }

        body { background: var(--cream); }
        .costaline-font { font-family: 'Costaline', serif; }
        .leansans-regular { font-family: 'Leansans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
        .leansans-bold { font-family: 'Leansans-Bold', sans-serif; font-weight:700; }

        /* TAKE A BITE marquee (left→right moving leftwards) */
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display:flex;
          gap:24px;
          align-items:flex-start;
          animation: marquee-left 18s linear infinite;
        }
        .pause-on-hover:hover { animation-play-state: paused !important; }

        /* Square product card for All Products carousel */
        .product-square {
          width: 280px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(46,38,34,0.06);
          display:flex;
          flex-direction:column;
          cursor: pointer;
        }
        .product-square img {
          width:100%;
          height: 0;
          padding-bottom: 100%;
          object-fit: cover;
          display:block;
        }
        .product-square .meta {
          padding: 12px 14px;
          background: transparent;
          color: var(--choco);
        }
        .product-square .title {
          font-weight: 700;
          margin-bottom: 6px;
        }
        .product-square .desc {
          font-size: 14px;
          color: rgba(46,38,34,0.75);
        }

        /* arch-card fallback used by ProductCard in Take a bite */
        .arch-card {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 9999px 9999px 0 0;
          overflow: hidden;
          max-width: 260px;
        }
        .arch-card::before {
          content: '';
          position:absolute; inset:0; border-radius:inherit; border-bottom:none;
          border:1px solid rgba(0,0,0,0.05); pointer-events:none; z-index:1;
        }
        .arch-card::after {
          content:''; position:absolute; left:8px; right:8px; top:6px; height:54%;
          border-top-left-radius:9999px;border-top-right-radius:9999px;border-bottom:none;
          border:3px solid rgba(255,255,255,0.55); z-index:5; box-shadow:0 6px 16px rgba(0,0,0,0.06);
        }
        .arch-decor { position:absolute; left:0; right:0; top:0; height:28%; background:linear-gradient(180deg, rgba(255,255,255,0.06), transparent); z-index:4; pointer-events:none; }

        /* responsive tweaks */
        @media (max-width:1100px) {
          .product-square { width: 220px; }
          .animate-marquee { animation-duration: 22s; }
        }
        @media (max-width:640px) {
          .product-square { width: 180px; }
          .animate-marquee { animation-duration: 16s; }
        }

        /* Preorder big button */
        .preorder-order-btn {
          padding: 1.1rem 2.2rem;
          font-size: 1.05rem;
          border-radius: 0;
          border: 2px solid var(--choco);
          background: var(--choco);
          color: var(--cream);
        }
        .preorder-order-btn:hover {
          opacity: 0.95;
        }
      `}</style>

      {/* HERO */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 costaline-font" style={{ color: "var(--coco)", lineHeight: 1.02 }}>
                Homemade Cakes & Brownies
                <br />
                That Taste Like Love.
              </h1>
              <p className="text-lg md:text-xl leansans-regular" style={{ color: "rgba(46,38,34,0.9)" }}>
                Indulge in handcrafted cakes, fudgy brownies, and buttery blondies — made in a home kitchen with real ingredients and real love.
              </p>
            </motion.div>

            {/* animated hero image - bigger and subtle float */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -6 }}
              animate={{ opacity: 1, scale: 1.04, y: -2 }}
              transition={{ duration: 1.1, yoyo: Infinity, ease: "easeInOut" } as any}
              whileHover={{ scale: 1.12, rotate: -2 }}
              className="flex items-center justify-center"
            >
              <img
                src={shopHero}
                alt="Hero cake"
                style={{ width: 420, maxWidth: "90%", transformOrigin: "50% 60%" }}
                draggable={false}
                className="select-none drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TAKE A BITE - marquee (leftwards) */}
      <section className="py-12 px-6 take-a-bite-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold costaline-font" style={{ color: "var(--coco)" }}>Take a bite!</h2>
            <p className="text-muted-foreground">Handcrafted treats and class snippets from our students.</p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="animate-marquee pause-on-hover" ref={gridRef} style={{ width: "max-content", alignItems: "flex-start" }}>
              {coursesData.products.concat(coursesData.products).map((product: any, idx: number) => {
                const img = getImageSrc(product, idx % coursesData.products.length);
                return (
                  <div key={`${product.id}_${idx}`} style={{ minWidth: 220, maxWidth: 260 }}>
                    <ProductCard
                      product={product}
                      index={idx % coursesData.products.length}
                      imgSrc={img}
                      gridRef={gridRef}
                      onProductClick={handleProductClick}
                      onImageError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => handleImageError(e, idx % coursesData.products.length)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* removed local "Order Now" here per request; only Pre-order CTA remains */}
        </div>

        {/* clones & particles (same behavior as homepage) */}
        {clones.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.6, x: c.x, y: c.y }}
            animate={{ opacity: 1, scale: 1.25, x: c.x - c.w * 0.1, y: c.y - c.h * 0.15 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", width: c.w, height: c.h, zIndex: 80 }}
          >
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        ))}

        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.9 }}
            animate={{ x: [p.x, p.x + (Math.random() * 160 - 80)], y: [p.y, p.y - (60 + Math.random() * 80)], opacity: [1, 0], scale: [0.9, 0.2] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 90, pointerEvents: "none" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" fill={p.color || "#f0d6c7"} />
            </svg>
          </motion.div>
        ))}

        {clones.length > 0 && (
          <div className="fixed bottom-6 right-6 z-60">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleUndo} className="bg-white/95 border border-chocolate text-chocolate rounded-none px-4 py-2 shadow-lg backdrop-blur">
              Undo
            </motion.button>
          </div>
        )}
      </section>

      {/* ALL PRODUCTS - square cards in right→left marquee */}
      <section className="py-8 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold costaline-font" style={{ color: "var(--coco)" }}>All Products</h3>
            <p className="text-muted-foreground">Explore more of our handcrafted delights.</p>
          </div>

          <div className="relative overflow-hidden">
            {/* duplicate allProducts to loop seamlessly */}
            <div
              className="animate-marquee pause-on-hover"
              ref={productsMarqueeRef}
              style={{ width: "max-content", alignItems: "center" }}
            >
              {allProducts.concat(allProducts).map((product: any, idx: number) => {
                const imgSrc = getImageSrc(product, idx % allProducts.length);
                return (
                  <div
                    key={`${product.id}_all_${idx}`}
                    style={{ minWidth: 280, maxWidth: 280, marginRight: 20 }}
                    onClick={(e) => handleProductClick(e as any, imgSrc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {}}
                  >
                    <div className="product-square" aria-hidden={false}>
                      {/* image as square using padding-bottom trick */}
                      <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden" }}>
                        <img
                          src={imgSrc}
                          alt={product.title}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => handleImageError(e as any, idx % allProducts.length)}
                          draggable={false}
                        />
                      </div>

                      <div className="meta">
                        <div className="title">{product.title}</div>
                        <div className="desc">{product.shortDesc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRE-ORDER - larger Order Now button */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, var(--cream), #F6ECE3)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 costaline-font">Pre-order now</h2>

            <p className="text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto leansans-regular">
              At Sweet Treats, every dessert begins in a warm home kitchen — not a factory.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto leansans-regular">
              We believe the best memories come from fresh, flavorful, lovingly baked goodies.
            </p>

            <Button size="lg" className="preorder-order-btn leansans-bold" onClick={handleGlobalOrder}>
              Order Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
