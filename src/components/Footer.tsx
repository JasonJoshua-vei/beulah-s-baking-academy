// src/components/Footer.tsx
import React from "react";
import { Instagram } from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";
import { motion } from "framer-motion";
import footerCake from "@/assets/footer-cake.png";

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "var(--mocha)" }}>
      {/* Color variables for exact palette */}
      <style>{`
        :root {
          --cream: #F2E6DC;
          --choco: #2E2622;
          --coco: #4A2C21;
          --mocha: #A18C7B;
        }

        .footer-heading {
          font-family: 'Playfair Display', ui-serif, Georgia, 'Times New Roman', Times, serif;
          letter-spacing: 0.02em;
        }

        .footer-wave svg path {
          fill: var(--mocha);
        }

        .footer-subtle { color: rgba(242,230,220,0.9); }
        .footer-muted { color: rgba(242,230,220,0.75); }

        .footer-link:hover { color: var(--cream); text-decoration: underline; }

        /* Button Style (matches HomePage buttons) */
        .footer-button {
          border: 2px solid var(--choco);
          color: var(--choco);
          background: transparent;

          padding: 0.75rem 1.4rem;
          font-size: 1rem;

          border-radius: 0;
          transition: all 160ms ease;
        }
        .footer-button:hover {
          background: var(--choco);
          color: var(--cream);
        }

        @media (min-width: 768px) {
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 2.5rem;
            align-items: start;
          }
        }
      `}</style>

      {/* Wave shape */}
      <div className="absolute inset-x-0 -top-1 pointer-events-none footer-wave" aria-hidden>
        <svg
          className="block w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C240,10 480,110 720,60 C960,10 1200,110 1440,60 L1440,120 L0,120 Z" />
        </svg>
      </div>

      <div className="relative pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Top Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="text-center md:text-left">
              <h2 className="footer-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 footer-subtle">
                We love to connect with you
              </h2>

              <div className="mt-2">
                <UiButton asChild className="footer-button">
                  <a
                    href="https://forms.gle/EioB5iiSvTym3yeLA"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Further queries"
                  >
                    Further Queries
                  </a>
                </UiButton>
              </div>
            </div>

            {/* 🍰 Draggable Cake Image */}
            <motion.div
              className="flex-shrink-0"
              drag
              dragElastic={0.2}
              dragMomentum={false}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 1.05 }}
              onDragEnd={(e, info) => {
                // auto-return handled by animate reset
              }}
              animate={{ x: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
            >
              <img
                src={footerCake}
                alt="Slice of chocolate cake"
                className="w-44 md:w-56 object-contain drop-shadow-2xl select-none pointer-events-none"
                style={{ transform: "translateY(-6px)" }}
                draggable="false"
              />
            </motion.div>
          </div>

          {/* Grid */}
          <div className="footer-grid border-t" style={{ borderColor: "rgba(242,230,220,0.12)" }}>
            {/* About */}
            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--cream)" }}>
                Beulah Skill Training Academy
              </h3>
              <p className="text-sm footer-muted leading-relaxed" style={{ maxWidth: 320 }}>
                LEARN. BAKE. DELIGHT.
                <br />
                AFFORDABLE ONLINE CERTIFIED CLASSES ON BAKING AND MORE
                <br />
                GOVERNMENT REGISTERED CERTIFICATES
              </p>
            </div>

            {/* Contact */}
            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--cream)" }}>
                Contact
              </h3>
              <div className="space-y-2">
                <p className="text-sm footer-subtle">7502699771</p>
                <p className="text-sm footer-subtle">beulah_james2024</p>

                <a
                  href="https://www.instagram.com/beulah_james2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-2 footer-link"
                  aria-label="Follow on Instagram"
                >
                  <Instagram className="w-5 h-5" style={{ color: "var(--cream)" }} />
                  <span className="text-sm footer-subtle">Follow us on Instagram</span>
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--cream)" }}>
                Location
              </h3>
              <p className="text-sm footer-subtle">PUDUKKOTTAI, TAMILNADU</p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-10 pt-8 border-t" style={{ borderColor: "rgba(242,230,220,0.12)" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm footer-subtle">
              <p>© 2025 Beulah Skill Training Academy — All rights reserved</p>
              <div className="flex items-center gap-4">
                <a href="#" className="footer-link text-sm">Privacy Policy</a>
                <span className="text-cream" style={{ opacity: 0.35 }}>|</span>
                <a href="#" className="footer-link text-sm">Terms of Service</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
