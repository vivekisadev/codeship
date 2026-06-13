"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { TextShimmer } from "./TextShimmer";

export function Preloader({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "moving" | "done">("loading");
  const logoControls = useAnimationControls();
  const logoRef = useRef<HTMLDivElement>(null);

  const getNavbarLogoRect = useCallback(() => {
    const navLogo = document.getElementById("navbar-logo");
    if (navLogo) return navLogo.getBoundingClientRect();
    return null;
  }, []);

  useEffect(() => {
    // Always start at the top on load/reload
    window.scrollTo(0, 0);

    // Phase 1: Show centered logo for 1.8s
    const timer = setTimeout(async () => {
      setPhase("moving");

      // Wait a frame for navbar to start rendering
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      const navRect = getNavbarLogoRect();
      const preloaderEl = logoRef.current;

      if (navRect && preloaderEl) {
        const preloaderRect = preloaderEl.getBoundingClientRect();

        // Calculate how much to move
        const deltaX = navRect.left + navRect.width / 2 - (preloaderRect.left + preloaderRect.width / 2);
        const deltaY = navRect.top + navRect.height / 2 - (preloaderRect.top + preloaderRect.height / 2);
        const scaleX = navRect.width / preloaderRect.width;
        const scaleY = navRect.height / preloaderRect.height;
        const scale = Math.min(scaleX, scaleY);

        // Animate logo to navbar position
        await logoControls.start({
          x: deltaX,
          y: deltaY,
          scale: scale,
          transition: {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          },
        });
      }

      // Phase 3: Done — hide preloader logo, show navbar logo
      setPhase("done");
    }, 1800);

    return () => clearTimeout(timer);
  }, [logoControls, getNavbarLogoRect]);

  return (
    <>
      {/* Background overlay — fades out when logo starts moving */}
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="preloader-bg"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "var(--background)",
              zIndex: 99998,
            }}
          />
        )}
      </AnimatePresence>

      {/* Flying logo — stays in DOM, animates from center to navbar */}
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="preloader-logo-wrapper"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              pointerEvents: "none",
            }}
          >
            <motion.div
              ref={logoRef}
              animate={logoControls}
              initial={{ scale: 1, x: 0, y: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <TextShimmer
                  className="display-font"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 5rem)",
                    fontWeight: "bold",
                    margin: 0,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Codeship
                </TextShimmer>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content — fades in after logo lands */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: phase === "done" ? 1 : 0,
          y: phase === "done" ? 0 : 15,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
