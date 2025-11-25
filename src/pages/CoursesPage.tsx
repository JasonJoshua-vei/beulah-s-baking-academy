// src/pages/CoursesPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Clock } from "lucide-react";
import coursesData from "@/data/courses.json";

/* Images / assets
   Replace / add these files in your assets folder if they are not present:
   - @/assets/academy-hero.jpg
   - @/assets/book-now.jpg
   - @/assets/course-cake-master-class.jpg
   - @/assets/course-plum-cake-workshop.jpg
   - @/assets/course-brownie-workshop.jpg
   - @/assets/course-spoken-english.jpg
   - @/assets/course-cursive-handwriting.jpg
*/
import academyHero from "@/assets/academy-hero.jpg";
import bookNowImg from "@/assets/book-now.jpg";

/* course-specific images (optional — will be tried, otherwise fallback used) */
import courseCakeMaster from "@/assets/cake-master-class.jpg";
import coursePlumCake from "@/assets/plum-cake-workshop.jpg";
import courseBrownie from "@/assets/hero-brownies.png";
import courseSpoken from "@/assets/spoken-english.jpg";
import courseCursive from "@/assets/cursive-writing.jpg";

/* fallback images (use same palette as other pages) */
import yummyblondies from "@/assets/yummy blondies.png";
import yummybrownies from "@/assets/yummy brownies.jpg";
import deliciouscupcakes from "@/assets/Delicious cupcakes.jpg";
import mouthwateringcakes from "@/assets/mouthwatering-cakes.jpg";

const fallbackImages = [yummybrownies, mouthwateringcakes, deliciouscupcakes, yummyblondies];

const ORDER_FORM_URL = "https://forms.gle/L7r2nXz9SfwBDi9x9";

/**
 * Helper: pick an image for a course by id (try specific assets, else fallback)
 */
const getCourseImage = (courseId: string, index: number) => {
  const map: Record<string, string | undefined> = {
    // map known course ids to assets (update keys to match your courses.json ids)
    "cake-master-class": courseCakeMaster,
    "plum-cake-workshop": coursePlumCake,
    "brownie-workshop": courseBrownie,
    "spoken-english": courseSpoken,
    "cursive-handwriting": courseCursive,
  };
  const img = map[courseId];
  if (img && typeof img === "string" && img.length > 0) return img;
  return fallbackImages[index % fallbackImages.length];
};

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* page palette variables and small helpers */}
      <style>{`
        :root {
          --cream: #F2E6DC;
          --choco: #2E2622;
          --coco: #4A2C21;
          --mocha: #A18C7B;
        }
        .costaline-font { font-family: 'Costaline', serif; }
        .leansans-regular { font-family: 'Leansans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
        .leansans-bold { font-family: 'Leansans-Bold', sans-serif; font-weight:700; }

        /* Section-level Book Now button (big) */
        .section-book-btn {
          padding: 0.9rem 1.8rem;
          font-size: 0.98rem;
          border-radius: 0;
          border: 2px solid var(--choco);
          background: transparent;
          color: var(--choco);
        }
        .section-book-btn:hover {
          background: var(--choco);
          color: var(--cream);
        }

        /* Final CTA big Book Now button (filled) */
        .booknow-btn {
          padding: 1.1rem 2.2rem;
          font-size: 1.05rem;
          border-radius: 0;
          border: 2px solid var(--choco);
          background: var(--choco);
          color: var(--cream);
        }
        .booknow-btn:hover { opacity: 0.95; }

        /* small grid helpers for course cards with images */
        .course-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
        }

        /* layout for final CTA row (image + action) */
        .final-cta-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 36px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .final-cta-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left hero image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="hidden md:flex items-center justify-center"
            >
              <img
                src={academyHero}
                alt="Academy hero"
                className="w-72 md:w-96 lg:w-[520px] object-contain select-none drop-shadow-2xl"
                draggable={false}
              />
            </motion.div>

            {/* Right text (keeps original copy but now aligned to left on wide screens) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center md:text-left mb-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance costaline-font">
                  Get ready to Bake.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed leansans-regular">
                  At Beulah Skill Academy, we believe every skill has the power to transform
                  confidence, creativity, and everyday life. Created with a passion for accessible
                  learning, we offer short, practical and impactful online courses.
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-center md:text-left text-lg text-muted-foreground mb-4 max-w-2xl"
              >
                Whether you're a beginner or a hobby baker, learn hands-on techniques to bake
                perfect brownies, cupcakes, cakes, and more.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Baking Courses */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-8"
          >
            Courses on Baking
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            {coursesData.bakingCourses.map((course, index) => (
              <div key={course.id} className="space-y-3">
                <img
                  src={getCourseImage(course.id, index)}
                  alt={course.title}
                  className="course-image"
                  onError={(e) => {
                    // fallback to generic fallbackImages if asset path missing
                    (e.currentTarget as HTMLImageElement).src = fallbackImages[index % fallbackImages.length];
                  }}
                />
                <CourseCard
                  title={course.title}
                  duration={course.duration}
                  tag={course.tag}
                  shortDesc={course.shortDesc}
                  delay={index * 0.08}
                />
              </div>
            ))}
          </div>

          {/* Single section-level Book Now for Baking courses */}
          <div className="text-center mt-6">
            <Button
              size="lg"
              className="section-book-btn leansans-bold"
              onClick={() => window.open(ORDER_FORM_URL, "_blank")}
            >
              Book This Batch
            </Button>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              What you'll learn
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chocolate mt-2" />
                <p className="text-lg">Measuring, mixing & baking basics</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chocolate mt-2" />
                <p className="text-lg">Texture, temperature & ingredient control</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chocolate mt-2" />
                <p className="text-lg">Frosting, decorating & presentation tips</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chocolate mt-2" />
                <p className="text-lg">Storage, hygiene & packaging guidance</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              No prior experience needed — just curiosity and love for desserts.
            </p>
            <p className="text-muted-foreground">
              Perfect for – Students, hobby bakers, home bakers-to-be, dessert lovers, gifting
              enthusiasts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Other Courses */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-8"
          >
            Other courses offered
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {coursesData.otherCourses.map((course, index) => (
              <div key={course.id} className="space-y-3">
                <img
                  src={getCourseImage(course.id, index)}
                  alt={course.title}
                  className="course-image"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackImages[index % fallbackImages.length];
                  }}
                />
                <CourseCard
                  title={course.title}
                  duration={course.duration}
                  tag={course.tag}
                  shortDesc={course.shortDesc}
                  delay={index * 0.08}
                />
              </div>
            ))}
          </div>

          {/* Single section-level Book Now for Other courses */}
          <div className="text-center mt-6">
            <Button
              size="lg"
              className="section-book-btn leansans-bold"
              onClick={() => window.open(ORDER_FORM_URL, "_blank")}
            >
              Book Other Courses
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12"
          >
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-chocolate" />
              <h3 className="font-bold mb-2">Personalized correction & feedback</h3>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-chocolate" />
              <h3 className="font-bold mb-2">Progress tracking</h3>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-chocolate" />
              <h3 className="font-bold mb-2">Speed, neatness & confidence building</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - image + single large Book Now (final) */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-cream-300">
        <div className="max-w-7xl mx-auto">
          <div className="final-cta-grid">
            <div>
              <img
                src={bookNowImg}
                alt="Book Now"
                style={{ width: "100%", height: "auto", borderRadius: 12 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackImages[0];
                }}
              />
            </div>

            <div className="text-right md:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Book your course now!</h2>
                <Button
                  size="lg"
                  className="booknow-btn leansans-bold"
                  onClick={() => window.open(ORDER_FORM_URL, "_blank")}
                >
                  Book Now
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
