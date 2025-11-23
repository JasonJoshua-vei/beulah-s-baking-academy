import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import footerCake from "@/assets/footer-cake.png";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-chocolate-dark to-chocolate text-cream-50 overflow-hidden">
      {/* Wave separator */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-background">
        <svg
          className="absolute bottom-0 w-full h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"
            fill="hsl(var(--chocolate-dark))"
          />
        </svg>
      </div>

      <div className="relative pt-32 pb-12">
        {/* Connect Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                We love to connect with you
              </h2>
              <Button
                variant="outline"
                className="border-cream-50 text-cream-50 hover:bg-cream-50 hover:text-chocolate"
                asChild
              >
                <a
                  href="https://forms.gle/EioB5iiSvTym3yeLA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Further Queries
                </a>
              </Button>
            </div>
            <img
              src={footerCake}
              alt="Delicious chocolate cake slice"
              className="w-48 md:w-64 object-contain drop-shadow-2xl animate-fade-in"
            />
          </div>
        </div>

        {/* Footer Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-cream-50/20 pt-12">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">Beulah Skill Training Academy</h3>
              <p className="text-cream-100 text-sm leading-relaxed mb-4">
<<<<<<< HEAD
                LEARN. BAKE. DELIGHT.
                <br />
                AFFORDABLE ONLINE
                <br />
                CERTIFIED CLASSES
                <br />
                ON BAKING AND MORE
                <br />
                GOVERNMENT
                <br />
                REGISTERED
                <br />
                CERTIFICATES
=======
                Learn. Bake. Delight. Affordable online baking & art classes with government-registered certificates.
>>>>>>> f9960b1 (Hero section changes applied, homepage animation applied)
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-cream-100 text-sm">
                <p>7502699771</p>
                <p>beulah_james2024</p>
                <a
                  href="https://www.instagram.com/beulah_james2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cream-50 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Follow us on Instagram</span>
                </a>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <p className="text-cream-100 text-sm">
                PUDUKKOTTAI, TAMILNADU
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-cream-50/20 text-center text-sm text-cream-100">
            <p>© 2025 Beulah Skill Training Academy — All rights reserved</p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <a href="#" className="hover:text-cream-50 transition-colors">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:text-cream-50 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
