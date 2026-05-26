import React from 'react';

export function Logo({ size = 24, className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="Codeship Logo" 
      width={size} 
      height={size} 
      className={`logo-img ${className}`.trim()} 
      style={{ objectFit: 'contain' }}
    />
  );
}
