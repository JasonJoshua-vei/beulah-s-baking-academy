import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Award } from "lucide-react";

interface CourseCardProps {
  title: string;
  duration: string;
  tag?: string;
  shortDesc: string;
  delay?: number;
}

export const CourseCard = ({ title, duration, tag, shortDesc, delay = 0 }: CourseCardProps) => {
  const handleBook = () => {
    window.open("https://forms.gle/L7r2nXz9SfwBDi9x9", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-chocolate/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6">
        {tag && (
          <Badge className="mb-4 bg-accent text-accent-foreground">
            {tag}
          </Badge>
        )}
        
        <h3 className="text-2xl font-bold mb-3 text-balance group-hover:text-chocolate transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {shortDesc}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>Certificate</span>
          </div>
        </div>
        
        <Button 
          onClick={handleBook}
          className="w-full bg-chocolate hover:bg-chocolate-dark text-cream-50 transition-all duration-300 group-hover:shadow-lg"
        >
          Book Now
        </Button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-chocolate to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};
