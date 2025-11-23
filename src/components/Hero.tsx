import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBrownies from "@/assets/hero-brownies.png";
import heroCupcake from "@/assets/hero-cupcake.png";

/**
 * Hero.tsx
 *
 * - fixes: removed duplicate animate props (brownies)
 * - brownies: draggable with snap-back (spring) onRelease
 * - cupcakes: click to spawn multiple flying cupcake clones ("fountain")
 * - sparkles: larger, multiple per spawn point, float idle, flee when cursor is near
 */

type FlyingCupcake = {
  id: string;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  rot: number;
  scale: number;
  delay: number;
};

type Sparkle = {
  id: string;
  baseX: number; // left in px (relative to viewport)
  baseY: number; // top in px
  size: number; // visual scale (1 = normal)
  flee: boolean; // currently fleeing
  dx?: number; // flee offset x
  dy?: number; // flee offset y
};

const uniqueId = (() => {
  let n = 0;
  return (prefix = "id") => `${prefix}_${Date.now()}_${n++}`;
})();

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  // ----- Cursor Tilt Effect -----
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX);
    y.set(offsetY);

    // page coords for sparkles and cupcakes
    setCursor({ x: e.pageX, y: e.pageY });
  };

  // ----- Sparkles: multiple, bigger, flee when cursor near -----
  // Define static sparkle anchor positions relative to the container (percent)
  const sparkleAnchors = [
    { leftPct: 0.08, topPct: 0.12 },
    { leftPct: 0.72, topPct: 0.18 },
    { leftPct: 0.06, topPct: 0.72 },
    { leftPct: 0.78, topPct: 0.78 },
  ];

  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // On mount, populate sparkles (multiple each anchor)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const created: Sparkle[] = [];

    sparkleAnchors.forEach((anchor, ai) => {
      // spawn 3 sparkles per anchor, slight offsets
      for (let i = 0; i < 3; i++) {
        const jitterX = (Math.random() - 0.5) * 40;
        const jitterY = (Math.random() - 0.5) * 40;
        const baseX = rect.left + rect.width * anchor.leftPct + jitterX + window.scrollX;
        const baseY = rect.top + rect.height * anchor.topPct + jitterY + window.scrollY;
        const size = 0.9 + Math.random() * 0.9; // scale 0.9 - 1.8
        created.push({ id: uniqueId(`spark_${ai}_${i}`), baseX, baseY, size, flee: false });
      }
    });

    setSparkles(created);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proximity detection: when cursor near sparkle, set flee true and set dx/dy
  useEffect(() => {
    if (!cursor) return;
    if (!sparkles.length) return;

    const THRESHOLD = 90; // px radius to trigger flee
    const updated = sparkles.map((s) => {
      if (s.flee) return s; // already fleeing
      const dx = (s.baseX ?? 0) - cursor.x;
      const dy = (s.baseY ?? 0) - cursor.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < THRESHOLD) {
        // trigger flee: compute a flee vector away from cursor with some randomness
        const angle = Math.atan2(s.baseY - cursor.y, s.baseX - cursor.x) + (Math.random() - 0.5) * 0.8;
        const fleeDistance = 120 + Math.random() * 140;
        const fx = Math.cos(angle) * fleeDistance;
        const fy = Math.sin(angle) * fleeDistance - (40 + Math.random() * 80); // lift upwards slightly
        // schedule return after a bit
        setTimeout(() => {
          setSparkles((prev) =>
            prev.map((p) => (p.id === s.id ? { ...p, flee: false, dx: undefined, dy: undefined } : p))
          );
        }, 700 + Math.random() * 600);
        return { ...s, flee: true, dx: fx, dy: fy };
      }
      return s;
    });

    // only update if changed
    setSparkles((prev) => {
      // detect any new flees
      const changed = updated.some((u, i) => u.flee !== prev[i]?.flee || u.dx !== prev[i]?.dx || u.dy !== prev[i]?.dy);
      return changed ? updated : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  // Idle float animation variants for sparkles
  const sparkleIdle = {
    y: [0, -12, 0],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
  };

  // ----- Brownies: drag + snap-back -----
  const browniesControls = useAnimation();

  useEffect(() => {
    // initialize visible state (we use controls instead of inline animate prop to avoid duplicates)
    browniesControls.start({ opacity: 1, scale: 1, transition: { duration: 0.9, ease: "easeOut" } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBrownieDragEnd = async (_: any, info: any) => {
    // spring back to origin
    await browniesControls.start({
      x: 0,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 28 },
    });
  };

  // ----- Cupcakes fountain -----
  const [flying, setFlying] = useState<FlyingCupcake[]>([]);
  const CLONES_PER_CLICK = 10;

  const spawnCupcakeFountain = (clickX: number, clickY: number) => {
    const newOnes: FlyingCupcake[] = Array.from({ length: CLONES_PER_CLICK }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 180 + Math.random() * 220;
      const dx = Math.cos(angle) * distance + (Math.random() * 40 - 20);
      const dy = -Math.abs(Math.sin(angle) * (120 + Math.random() * 140)) - (Math.random() * 40);
      const rot = Math.random() * 720 - 360;
      const scale = 0.6 + Math.random() * 0.8;
      const delay = Math.random() * 0.08 * i;
      return {
        id: uniqueId("cupcake"),
        startX: clickX,
        startY: clickY,
        dx,
        dy,
        rot,
        scale,
        delay,
      };
    });

    setFlying((s) => [...s, ...newOnes]);

    const maxRemoval = 1400 + Math.max(...newOnes.map((n) => n.delay * 1000));
    setTimeout(() => {
      setFlying((s) => s.filter((f) => !newOnes.find((n) => n.id === f.id)));
    }, maxRemoval);
  };

  const onCupcakeClick = (e: React.MouseEvent) => {
    const clickPageX = e.pageX;
    const clickPageY = e.pageY;
    spawnCupcakeFountain(clickPageX, clickPageY);
  };

  const onCupcakeKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      const el = e.target as HTMLElement;
      const rect = el.getBoundingClientRect();
      const pageX = rect.left + rect.width / 2 + window.scrollX;
      const pageY = rect.top + rect.height / 2 + window.scrollY;
      spawnCupcakeFountain(pageX, pageY);
    }
  };

  const playPop = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 700 + Math.random() * 200;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start();
      o.stop(now + 0.14);
      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
      }, 200);
    } catch {
      // ignore
    }
  };

  const handleCupcakeAction = (e: React.MouseEvent) => {
    playPop();
    onCupcakeClick(e);
  };

  // Keep body overflow visible while fireworks are active (prevent clipping)
  useEffect(() => {
    if (!flying.length) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "visible";
    return () => {
      document.body.style.overflow = original;
    };
  }, [flying.length]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-visible pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cream-100 to-cream-300" />

      {/* Soft Cream Glow (parallaxed by cursor) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: useTransform(y, [-100, 100], [-10, 10]) }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />
      </motion.div>

      {/* Sparkles: larger & multiple, float idle, flee when close */}
      {sparkles.map((s, idx) => {
        // if fleeing, animate to dx/dy offsets, else idle float
        const left = s.baseX;
        const top = s.baseY;
        return (
          <motion.div
            key={s.id}
            initial={false}
            style={{
              position: "absolute",
              left,
              top,
              width: 40,
              height: 40,
              zIndex: 60,
              pointerEvents: "none",
            }}
            animate={
              s.flee
                ? {
                    x: s.dx ?? 0,
                    y: s.dy ?? -60,
                    scale: 1.2,
                    opacity: [1, 0.85, 0.4],
                    rotate: Math.random() * 45 - 22,
                  }
                : {
                    x: 0,
                    y: [0, -12, 0],
                    scale: s.size,
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 8, 0],
                  }
            }
            transition={
              s.flee
                ? { duration: 0.65, ease: "circOut" }
                : { duration: 4 + (idx % 3), repeat: Infinity, ease: "easeInOut" }
            }
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#d9a86c" strokeWidth="1.5" className="w-full h-full">
              <path d="M12 2l1.8 4.5L18 8.3l-4.1 2.7L12 16l-1.9-5-4.1-2.7 4.2-1.8L12 2z" />
            </svg>
          </motion.div>
        );
      })}

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
              {["Welcome", "to", "Beulah", "Skill", "Training", "Academy"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 * i, ease: "easeOut" }}
                  className={`inline-block mr-2 ${word === "Beulah" || word === "Academy" ? "text-chocolate" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
              Your one-stop destination for desserts and skill-building courses.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-chocolate hover:bg-chocolate-dark text-cream-50 text-lg px-8 py-6 shadow-xl" onClick={() => window.open("https://forms.gle/L7r2nXz9SfwBDi9x9", "_blank")}>
                  Book Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50 text-lg px-8 py-6" onClick={() => navigate("/shop")}>
                  Click here to shop
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div style={{ rotateX, rotateY }} className="relative flex items-center justify-center" aria-hidden>
            {/* Brownies — draggable with controls (no duplicate animate props) */}
            <motion.div
              animate={browniesControls}
              drag={true}
              dragMomentum={false}
              dragElastic={0.12}
              onDragEnd={onBrownieDragEnd}
              initial={{ opacity: 0, scale: 0.98 }}
              className="relative z-10"
              role="button"
              aria-label="Delicious chocolate brownies (draggable)"
              tabIndex={0}
            >
              <motion.img
                src={heroBrownies}
                alt="Delicious chocolate brownies"
                className="w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl select-none"
                draggable={false}
                animate={{ y: [0, -14, 0] }} // float on the img itself (fine to animate child)
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Cupcake — click to spawn fountain */}
            <motion.div
              className="absolute right-0 top-1/2 transform translate-x-8"
              style={{ perspective: 800 }}
              onClick={(e) => { handleCupcakeAction(e as React.MouseEvent); }}
              onKeyDown={onCupcakeKey}
              tabIndex={0}
              role="button"
              aria-label="Click to make cupcakes fly!"
            >
              <motion.img
                src={heroCupcake}
                alt="Beautiful cupcake"
                className="w-40 md:w-48 lg:w-56 object-contain drop-shadow-2xl select-none"
                draggable={false}
                style={{ willChange: "transform" }}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Render flying cupcake clones */}
      {flying.map((f) => {
        const startLeft = f.startX - 30;
        const startTop = f.startY - 30;
        const targetLeft = startLeft + f.dx;
        const targetTop = startTop + f.dy;

        return (
          <motion.img
            key={f.id}
            src={heroCupcake}
            alt=""
            aria-hidden
            initial={{
              opacity: 1,
              left: startLeft,
              top: startTop,
              scale: 0.4,
              rotate: 0,
              position: "absolute",
            }}
            animate={{
              left: targetLeft,
              top: targetTop,
              opacity: [1, 0.95, 0],
              scale: [f.scale, f.scale * 0.9, f.scale * 0.4],
              rotate: f.rot,
            }}
            transition={{
              duration: 0.95,
              delay: f.delay,
              ease: "circOut",
            }}
            style={{
              position: "absolute",
              width: 56,
              height: 56,
              zIndex: 100,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </section>
  );
};

export default Hero;
