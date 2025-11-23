// src/components/TestimonialsMarquee.tsx
import React, { useRef } from "react";

/* Testimonials seed (moved from page file so this component is self-contained) */
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

export const TestimonialsMarquee: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const items = [...testimonialsSeed, ...testimonialsSeed];

  return (
    <div className="w-full testimonials-wrap">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="flex gap-6 will-change-transform testimonials-marquee pause-on-hover" ref={marqueeRef}>
          {items.map((t, idx) => (
            <div key={`${t.id}_${idx}`} className="testimonial-card flex-shrink-0 p-6 md:p-8" style={{ width: 360 }}>
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

      <div className="mt-6 flex justify-center gap-2">
        {testimonialsSeed.map((_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>

      <style>{`
        :root {
          --cream: #F2E6DC;
          --choco: #2E2622;
          --coco: #4A2C21;
          --mocha: #A18C7B;
        }

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
        .testimonial-location { font-size: 13px; color: var(--coco); opacity: 0.9; }
        .testimonial-name { font-weight: 700; color: var(--choco); }
        .testimonial-role { font-size: 12px; color: var(--coco); opacity: 0.85; }
        .testimonial-rating { font-size: 14px; color: var(--mocha); font-weight: 700; }

        .dot { width:9px; height:9px; background: rgba(46,38,34,0.12); border-radius:999px; display:inline-block; }
        .dot:first-child { background: var(--choco); }

        @media (max-width: 900px) { .testimonial-card { width: 320px; } }
        @media (max-width: 520px) { .testimonial-card { width: 280px; padding: 0 6px; } .testimonials-marquee { animation-duration: 20s; } }
      `}</style>
    </div>
  );
};

export default TestimonialsMarquee;
