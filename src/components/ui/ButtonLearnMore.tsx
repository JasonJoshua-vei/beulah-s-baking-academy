// src/components/ui/ButtonLearnMore.tsx
import React from "react";

export const ButtonLearnMore: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children = "Learn more", className = "", ...rest }) => {
  return (
    <button
      {...rest}
      className={`
        bg-transparent 
        text-[#3e2d27]
        border border-[rgba(62,45,39,0.15)]
        px-[22px] py-[10px]
        rounded-none
        shadow-[0_6px_18px_rgba(238,217,204,0.18)]
        transition-all duration-200
        hover:-translate-y-1
        hover:shadow-[0_18px_40px_rgba(241,224,209,0.36),0_6px_14px_rgba(0,0,0,0.06)]
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ButtonLearnMore;
