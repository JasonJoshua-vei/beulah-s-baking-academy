import { motion } from "framer-motion";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Clock } from "lucide-react";
import coursesData from "@/data/courses.json";

const CoursesPage = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              Get ready to Bake.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At Beulah Skill Academy, we believe every skill has the power to transform
              confidence, creativity, and everyday life. Created with a passion for accessible
              learning, we offer short, practical and impactful online courses.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-lg text-muted-foreground mb-16 max-w-2xl mx-auto"
          >
            Whether you're a beginner or a hobby baker, learn hands-on techniques to bake
            perfect brownies, cupcakes, cakes, and more.
          </motion.p>
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
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Courses on Baking
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {coursesData.bakingCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                title={course.title}
                duration={course.duration}
                tag={course.tag}
                shortDesc={course.shortDesc}
                delay={index * 0.1}
              />
            ))}
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
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Other courses offered
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {coursesData.otherCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                title={course.title}
                duration={course.duration}
                tag={course.tag}
                shortDesc={course.shortDesc}
                delay={index * 0.1}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream-100 to-cream-300">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Book your course now!
            </h2>
            <Button
              size="lg"
              className="bg-chocolate hover:bg-chocolate-dark text-cream-50 text-lg px-12 py-6"
              onClick={() =>
                window.open("https://forms.gle/L7r2nXz9SfwBDi9x9", "_blank")
              }
            >
              Book Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
