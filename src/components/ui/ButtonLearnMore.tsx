// src/components/ui/ButtonLearnMore.tsx
import React from "react";

export const ButtonLearnMore: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children = "Learn more", ...rest }) => {
  return (
    <button {...rest} className="learnMoreBtn">
      {children}
      <style jsx>{`
        .learnMoreBtn{
          background: transparent;
          color: #3e2d27;
          border: 1px solid rgba(62,45,39,0.15);
          padding: 10px 22px;
          border-radius: 0; /* sharp corners */
          box-shadow: 0 6px 18px rgba(238,217,204,0.18);
          transition: transform .16s ease, box-shadow .16s ease;
        }
        .learnMoreBtn:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(241,224,209,0.36), 0 6px 14px rgba(0,0,0,0.06);
          /* subtle cream glow */
          box-shadow: 0 18px 40px rgba(241,224,209,0.36), 0 6px 14px rgba(0,0,0,0.06), 0 0 24px rgba(241,224,209,0.18);
        }
      `}</style>
    </button>
  );
};

export default ButtonLearnMore;
