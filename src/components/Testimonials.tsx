"use client";

import React from "react";

const staticTestimonials = [
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

function TestimonialCard({ t }: { t: any }) {
  return (
    <div
      style={{
        padding: "24px",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid var(--border-subtle)",
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
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            border: "1px solid rgba(255,255,255,0.05)",
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

import { useEffect, useState } from "react";
import { ShareExperience } from "./ShareExperience";

export function Testimonials() {
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.testimonials) {
          setDbTestimonials(data.testimonials);
        }
      })
      .catch(err => console.error("Failed to load testimonials", err));
  }, []);

  const allTestimonials = [...dbTestimonials, ...staticTestimonials];
  
  // Split into 3 columns dynamically
  const col1 = allTestimonials.filter((_, i) => i % 3 === 0);
  const col2 = allTestimonials.filter((_, i) => i % 3 === 1);
  const col3 = allTestimonials.filter((_, i) => i % 3 === 2);
  
  // If a column is empty (e.g. less than 3 items total), fall back to some items so it's not blank
  const renderCol1 = col1.length > 0 ? col1 : staticTestimonials;
  const renderCol2 = col2.length > 0 ? col2 : staticTestimonials;
  const renderCol3 = col3.length > 0 ? col3 : staticTestimonials;

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
          animation: scrollUp 25s linear infinite;
        }
        .scroll-track-down {
          animation: scrollDown 25s linear infinite;
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

      <div style={{ textAlign: "center", marginBottom: "60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            margin: "0 auto 24px auto",
          }}
        >
          See why thousands of developers trust Codeship to build their portfolios.
        </p>
        
        <ShareExperience />
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
            {[...renderCol1, ...renderCol1, ...renderCol1, ...renderCol1, ...renderCol1, ...renderCol1, ...renderCol1, ...renderCol1].map((t, i) => (
              <TestimonialCard key={`col1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Middle Column - Scrolls Up */}
        <div style={{ borderRight: "1px solid var(--border-subtle)", padding: "16px", overflow: "hidden" }}>
          <div className="scroll-track-up" style={{ display: "flex", flexDirection: "column" }}>
            {[...renderCol2, ...renderCol2, ...renderCol2, ...renderCol2, ...renderCol2, ...renderCol2, ...renderCol2, ...renderCol2].map((t, i) => (
              <TestimonialCard key={`col2-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Right Column - Scrolls Down */}
        <div style={{ padding: "16px", overflow: "hidden" }}>
          <div className="scroll-track-down" style={{ display: "flex", flexDirection: "column" }}>
            {[...renderCol3, ...renderCol3, ...renderCol3, ...renderCol3, ...renderCol3, ...renderCol3, ...renderCol3, ...renderCol3].map((t, i) => (
              <TestimonialCard key={`col3-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
