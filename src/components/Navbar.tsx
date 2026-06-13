"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  rightContent?: React.ReactNode;
}

export function Navbar({ rightContent }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Delay logo visibility so the preloader logo can land first
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(true);
    }, 3400); // 1800ms loading + 1400ms fly + 200ms buffer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
        zIndex: 50,
        width: "100%",
        backgroundColor: scrolled ? "var(--background)" : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--border-subtle)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px -8px rgba(0, 0, 0, 0.2)" : "none",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: scrolled ? "12px 24px" : "24px 24px",
          transition: "padding 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <span
            id="navbar-logo"
            className="display-font"
            style={{
              fontWeight: "900",
              fontSize: scrolled ? "1.5rem" : "2rem",
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              opacity: logoVisible ? 1 : 0,
            }}
          >
            Codeship
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeToggle />
          {rightContent}
        </div>
      </motion.nav>
    </div>
  );
}
