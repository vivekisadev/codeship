"use client";

import { motion } from "framer-motion";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TextShimmer({ children, className = "", style = {} }: TextShimmerProps) {
  return (
    <motion.div
      className={className}
      style={{
        display: "inline-block",
        background: "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%)",
        backgroundSize: "200% auto",
        color: "transparent",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        ...style
      }}
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
