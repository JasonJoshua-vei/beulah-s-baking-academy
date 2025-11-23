// src/components/ui/ButtonForm.tsx
import React from "react";
import styled from "styled-components";

export const ButtonForm: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => {
  return (
    <StyledWrapper>
      <button {...rest} className="formBtn">{children}</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .formBtn {
    position: relative;
    padding: 12px 20px;
    background: #F7EDE7;
    color: #2b1f17;
    font-weight: 600;
    border-radius: 0; /* sharp corners */
    border: 1px solid rgba(43,31,23,0.06);
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    transition: transform .14s ease, box-shadow .14s ease;
  }
  .formBtn:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 10px 26px rgba(0,0,0,0.12);
  }
`;
export default ButtonForm;
