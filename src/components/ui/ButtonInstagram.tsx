// src/components/ui/ButtonInstagram.tsx
import React from "react";
import styled from "styled-components";

type Props = {
  href?: string; // if provided, renders as anchor
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

export const ButtonInstagram: React.FC<Props> = ({ href, onClick, ariaLabel = "Instagram", className }) => {
  // Render anchor if href provided (allows middle-click / open in new tab)
  const inner = (
    <StyledWrapper className={className}>
      <button className="Btn" type="button" onClick={onClick} aria-label={ariaLabel}>
        <span className="svgContainer" aria-hidden>
          <svg
            fill="white"
            className="svgIcon"
            viewBox="0 0 448 512"
            height="1.2em"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            focusable="false"
          >
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8z" />
          </svg>
        </span>
        <span className="BG" aria-hidden />
      </button>
    </StyledWrapper>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} style={{ display: "inline-block" }}>
        {inner}
      </a>
    );
  }

  return inner;
};

const StyledWrapper = styled.div`
  .Btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    position: relative;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    padding: 0;
  }
  .svgContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid rgba(156, 156, 156, 0.35);
    padding: 6px;
    background: rgba(255, 255, 255, 0.02);
    box-sizing: border-box;
  }
  .BG {
    position: absolute;
    content: "";
    inset: 0;
    z-index: -1;
    border-radius: 9px;
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    transition: transform 0.35s ease;
    transform-origin: bottom;
  }
  .Btn:hover .BG {
    transform: rotate(35deg);
  }
  .Btn:hover .svgContainer {
    background-color: rgba(156, 156, 156, 0.14);
    transform: scale(1.03);
  }
`;

export default ButtonInstagram;
