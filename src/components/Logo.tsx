import React from 'react';

export function Logo({ size = 24, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Code Brackets */}
      <path d="M7 6L2 12L7 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6L22 12L17 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Abstract Sail / Boat Bow cutting through */}
      <path d="M13 2L10 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
