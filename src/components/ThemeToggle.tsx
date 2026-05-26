"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 40, height: 40 }} />; // placeholder
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "transparent",
        border: "1px dashed var(--border-subtle)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      aria-label="Toggle Theme"
      className="theme-toggle"
    >
      <div className="icon-wrapper">
        {theme === "dark" ? <MoonStar size={18} /> : <Sun size={18} />}
      </div>
      <style jsx>{`
        .theme-toggle:hover {
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
        .theme-toggle:hover .icon-wrapper {
          transform: rotate(15deg) scale(1.1);
          transition: transform 0.3s ease;
        }
        .icon-wrapper {
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justifyContent: center;
        }
      `}</style>
    </button>
  );
}
