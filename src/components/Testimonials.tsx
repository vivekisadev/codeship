"use client";

import React from "react";

const testimonials = [
  {
    name: "Julian Weber",
    handle: "@julian.codes",
    text: "Codeship completely automated my portfolio building. I just focus on solving LeetCode problems, and my GitHub gets perfectly formatted commits.",
    avatar: "👨‍💻",
  },
  {
    name: "Clara Vandenberg",
    handle: "@clara.builds",
    text: "I used to manually copy-paste my solutions. That's hours of work saved. It brings structure without feeling restrictive. Not magic, just solid.",
    avatar: "👩‍💻",
  },
  {
    name: "Sofia Romano",
    handle: "@sofia.designs",
    text: "The best part is how it runs completely in the background. I forget it's even there until I check my pristine GitHub graph. Fewer retries, zero friction.",
    avatar: "👩‍🎨",
  },
  {
    name: "Luca Bianchi",
    handle: "@luca.ui",
    text: "Interviewers love seeing my consistent commit history. This extension basically got me my last three interviews. Highly recommend.",
    avatar: "👨‍🎓",
  },
  {
    name: "Matteo Ricci",
    handle: "@matteo.dev",
    text: "It fits perfectly into my existing workflow. No extra tabs to open. Just code, submit, and it's saved reliably every single time.",
    avatar: "👨‍🚀",
  },
  {
    name: "Élodie Martin",
    handle: "@elodie.ui",
    text: "The codebase tracking is flawless. Even when I retry a problem, it updates the same file intelligently. Everything just stays consistent.",
    avatar: "👩‍🚀",
  },
];

// Deterministic arrays for different columns to avoid hydration errors
const col1 = [...testimonials];
const col2 = [...testimonials.slice(2), ...testimonials.slice(0, 2)];
const col3 = [...testimonials.slice(4), ...testimonials.slice(0, 4)];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 4px 24px -12px rgba(0,0,0,0.08)",
        borderRadius: "16px",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "var(--surface-base)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {t.avatar}
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{t.name}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
            {t.handle}
          </div>
        </div>
      </div>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.95rem",
          lineHeight: "1.6",
        }}
      >
        {t.text}
      </p>
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      style={{
        width: "100%",
        padding: "120px 0",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .scroll-track-up {
          animation: scrollUp 40s linear infinite;
        }
        .scroll-track-down {
          animation: scrollDown 40s linear infinite;
        }
        .scroll-track-up:hover, .scroll-track-down:hover {
          animation-play-state: paused;
        }
        
        /* Fade masks for top and bottom */
        .grid-mask {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2
          className="display-font"
          style={{
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Loved by Developers
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          See why thousands of developers trust Codeship to build their portfolios.
        </p>
      </div>

      <div
        className="grid-mask"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          height: "600px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--background)",
        }}
      >
        {/* Left Column - Scrolls Down */}
        <div style={{ borderRight: "1px solid var(--border-subtle)", padding: "16px", overflow: "hidden" }}>
          <div className="scroll-track-down" style={{ display: "flex", flexDirection: "column" }}>
            {[...col1, ...col1].map((t, i) => (
              <TestimonialCard key={`col1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Middle Column - Scrolls Up */}
        <div style={{ borderRight: "1px solid var(--border-subtle)", padding: "16px", overflow: "hidden" }}>
          <div className="scroll-track-up" style={{ display: "flex", flexDirection: "column" }}>
            {[...col2, ...col2].map((t, i) => (
              <TestimonialCard key={`col2-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Right Column - Scrolls Down */}
        <div style={{ padding: "16px", overflow: "hidden" }}>
          <div className="scroll-track-down" style={{ display: "flex", flexDirection: "column" }}>
            {[...col3, ...col3].map((t, i) => (
              <TestimonialCard key={`col3-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
