// src/components/Header.tsx
import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonInstagram from "@/components/ui/ButtonInstagram";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu + scroll to top when route changes (ensures new page starts at top)
  useEffect(() => {
    setIsOpen(false);
    // try smooth scroll; fallback to instant
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const links = [
    { to: "/", label: "HOME" },
    { to: "/shop", label: "SHOP" },
    { to: "/courses", label: "COURSES" },
    { to: "/contact", label: "CONTACT" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo: use brand-font (Tovar / Tovar replacement) */}
          <NavLink
            to="/"
            className="text-2xl md:text-3xl font-bold text-chocolate brand-font"
            aria-label="Beulah home"
          >
            Beulah
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-foreground/80 hover:text-chocolate transition-colors relative group all-caps tracking-widest"
                activeClassName="text-chocolate"
              >
                {/* all-caps nav text uses LeanSans regular replacement */}
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-chocolate transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}

            {/* Instagram: use ButtonInstagram wrapped with anchor so it behaves like a link */}
            <a
              href="https://www.instagram.com/beulah_james2024/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-block"
            >
              <ButtonInstagram />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-chocolate"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="md:hidden overflow-hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-4 pt-6 pb-4">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => {
                      setIsOpen(false);
                      // navigate handled by NavLink; scroll-to-top handled by location effect
                    }}
                    className="text-base font-medium text-foreground/80 hover:text-chocolate transition-colors all-caps tracking-widest"
                    activeClassName="text-chocolate"
                  >
                    {link.label}
                  </NavLink>
                ))}

                <a
                  href="https://www.instagram.com/beulah_james2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground/80 hover:text-chocolate transition-colors"
                >
                  <ButtonInstagram />
                  <span className="all-caps">Instagram</span>
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
