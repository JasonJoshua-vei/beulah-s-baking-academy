import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We'd love to hear from you! Reach out for course inquiries, custom orders, or just
              to say hello.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-chocolate mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <a
                    href="tel:7502699771"
                    className="text-muted-foreground hover:text-chocolate transition-colors"
                  >
                    7502699771
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-chocolate mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Instagram</h3>
                  <a
                    href="https://www.instagram.com/beulah_james2024/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-chocolate transition-colors"
                  >
                    @beulah_james2024
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-chocolate mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Location</h3>
                  <p className="text-muted-foreground">Pudukkottai, Tamil Nadu</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full bg-chocolate hover:bg-chocolate-dark text-cream-50"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/beulah_james2024/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Follow Us on Instagram
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-card p-8 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4">Send us a message</h3>
              <p className="text-muted-foreground mb-6">
                For detailed inquiries, please fill out our contact form:
              </p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() =>
                  window.open("https://forms.gle/EioB5iiSvTym3yeLA", "_blank")
                }
              >
                Open Contact Form
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-br from-cream-100 to-cream-300 p-12 rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your baking journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Book a course or place an order today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-chocolate hover:bg-chocolate-dark text-cream-50"
                onClick={() =>
                  window.open("https://forms.gle/L7r2nXz9SfwBDi9x9", "_blank")
                }
              >
                Book a Course
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream-50"
                onClick={() =>
                  window.open("https://forms.gle/AUT9suo7jX4Svo2Z9", "_blank")
                }
              >
                Order Treats
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
