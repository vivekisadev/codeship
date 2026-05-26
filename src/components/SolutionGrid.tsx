"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Code2, Play, GitCommit, LineChart, CheckCircle2, Copy, Terminal, MousePointer2, Image as ImageIcon, Sparkles, Activity } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// --- Quadrant 1: Real-time Code Capture ---
// Simulates a user clicking "Submit" on LeetCode and the extension capturing it
function CaptureAnimation() {
  const [state, setState] = useState<"idle" | "clicking" | "loading" | "success">("idle");

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setState("idle");
        await new Promise((r) => setTimeout(r, 1000));
        setState("clicking");
        await new Promise((r) => setTimeout(r, 500));
        setState("loading");
        await new Promise((r) => setTimeout(r, 1500));
        setState("success");
        await new Promise((r) => setTimeout(r, 2000));
      }
    };
    sequence();
  }, []);

  return (
    <div style={{ width: "100%", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: "240px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        
        {/* Mock LeetCode Editor Header */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "60px", height: "24px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }} />
            <motion.div
              animate={{ scale: state === "clicking" ? 0.95 : 1, background: state === "loading" ? "rgba(34, 197, 94, 0.2)" : "rgba(34, 197, 94, 0.1)" }}
              style={{ width: "70px", height: "24px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "#22c55e", fontSize: "0.7rem", fontWeight: "bold" }}
            >
              {state === "loading" ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Play size={10} /></motion.div> : "Submit"}
            </motion.div>
          </div>
        </div>
        
        {/* Mock Code Area */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ width: "80%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
          <div style={{ width: "60%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
          <div style={{ width: "90%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
        </div>

        {/* Success Toast Overlap */}
        <AnimatePresence>
          {state === "success" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)", padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            >
              <CheckCircle2 color="#22c55e" size={20} />
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#22c55e" }}>Accepted</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Codeship captured solution</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Mouse Cursor */}
        <motion.div
          animate={{
            x: state === "idle" ? 40 : 80,
            y: state === "idle" ? 80 : 15,
            scale: state === "clicking" ? 0.9 : 1
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ position: "absolute", zIndex: 10 }}
        >
          <MousePointer2 fill="#fff" stroke="#000" size={20} />
        </motion.div>
      </div>
    </div>
  );
}

// --- Quadrant 2: Format & Sanitize ---
// Simulates messy code snapping into clean formatted code
function FormatAnimation() {
  const [formatted, setFormatted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFormatted(f => !f);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "260px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "16px", position: "relative", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--text-secondary)" }}>
          <Terminal size={16} />
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>Solution.py</span>
          
          <motion.div 
            animate={{ opacity: formatted ? 1 : 0, scale: formatted ? 1 : 0.8 }}
            style={{ marginLeft: "auto", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "2px 8px", borderRadius: "10px", fontSize: "0.65rem", fontWeight: "bold" }}
          >
            Formatted
          </motion.div>
        </div>

        {/* Code Lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: formatted ? "12px" : "8px" }}>
          <motion.div layout style={{ width: formatted ? "40%" : "60%", height: "6px", background: formatted ? "#c4b5fd" : "rgba(255,255,255,0.2)", borderRadius: "4px", marginLeft: formatted ? "0" : "10px" }} />
          <motion.div layout style={{ width: formatted ? "80%" : "90%", height: "6px", background: formatted ? "#93c5fd" : "rgba(255,255,255,0.2)", borderRadius: "4px", marginLeft: formatted ? "20px" : "0" }} />
          <motion.div layout style={{ width: formatted ? "60%" : "40%", height: "6px", background: formatted ? "#86efac" : "rgba(255,255,255,0.2)", borderRadius: "4px", marginLeft: formatted ? "20px" : "30px" }} />
          <motion.div layout style={{ width: formatted ? "50%" : "70%", height: "6px", background: formatted ? "#fca5a5" : "rgba(255,255,255,0.2)", borderRadius: "4px", marginLeft: formatted ? "40px" : "5px" }} />
          <motion.div layout style={{ width: formatted ? "30%" : "50%", height: "6px", background: formatted ? "#c4b5fd" : "rgba(255,255,255,0.2)", borderRadius: "4px", marginLeft: formatted ? "0" : "15px" }} />
        </div>

        {/* Scanning Line overlay */}
        <AnimatePresence>
          {!formatted && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)", boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)", zIndex: 10 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Quadrant 3: Automated GitHub Sync ---
// Simulates a GitHub commit history with a new commit sliding in
function SyncAnimation() {
  const [commits, setCommits] = useState([
    { id: 1, text: "Valid Parentheses", time: "2 hrs ago" },
    { id: 2, text: "Merge Two Sorted Lists", time: "5 hrs ago" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCommits(prev => {
        if (prev.length >= 3) return [{ id: 1, text: "Valid Parentheses", time: "2 hrs ago" }, { id: 2, text: "Merge Two Sorted Lists", time: "5 hrs ago" }];
        return [{ id: Date.now(), text: "Two Sum", time: "just now", isNew: true }, ...prev];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "260px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "16px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--text-primary)" }}>
          <FaGithub size={18} />
          <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>LeetCode-Solutions</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
          {/* Vertical timeline line */}
          <div style={{ position: "absolute", left: "11px", top: "10px", bottom: "10px", width: "2px", background: "var(--border-subtle)", zIndex: 0 }} />
          
          <AnimatePresence initial={false}>
            {commits.map((commit, idx) => (
              <motion.div
                key={commit.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: (commit as any).isNew ? "#10b981" : "var(--surface-elevated)", border: "2px solid var(--background)", display: "flex", alignItems: "center", justifyContent: "center", color: (commit as any).isNew ? "#fff" : "var(--text-secondary)" }}>
                  <GitCommit size={14} />
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: (commit as any).isNew ? "#10b981" : "var(--text-primary)" }}>Add solution: {commit.text}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>Committed {commit.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// --- Quadrant 4: Analytics Pipeline ---
// Simulates a dashboard counter incrementing and a tiny line chart updating
function AnalyticsAnimation() {
  const [count, setCount] = useState(400);
  const [dataPoints, setDataPoints] = useState([20, 30, 25, 40, 35, 50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c >= 405 ? 400 : c + 1);
      setDataPoints(prev => {
        if (prev.length > 8) return [20, 30, 25, 40, 35, 50];
        return [...prev, prev[prev.length-1] + Math.random() * 20 - 5];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxData = Math.max(...dataPoints);
  const pathData = dataPoints.map((val, i) => `${(i / (dataPoints.length - 1)) * 100},${100 - (val / maxData) * 100}`).join(" L ");

  return (
    <div style={{ width: "100%", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "240px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        
        {/* Metric Card */}
        <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Problems Solved</div>
            <div className="display-font" style={{ fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.span key={count} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {count}
              </motion.span>
              <motion.div key={`badge-${count}`} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: "0.7rem", padding: "2px 6px", borderRadius: "8px" }}>
                +1
              </motion.div>
            </div>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
            <Activity size={20} />
          </div>
        </div>

        {/* Chart Card */}
        <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "16px", height: "80px", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", position: "absolute", top: "8px", left: "16px" }}>Consistency Graph</div>
          <svg width="100%" height="40" preserveAspectRatio="none" style={{ position: "absolute", bottom: "10px", left: 0, right: 0, padding: "0 16px", overflow: "visible" }}>
            <motion.path 
              d={`M 0,${100 - (dataPoints[0] / maxData) * 100} L ${pathData}`}
              fill="none" stroke="#3b82f6" strokeWidth="2"
              initial={{ pathLength: 0.8 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
        </div>

      </div>
    </div>
  );
}

// --- Quadrant 5: LinkedIn Image Post Simulation (Bottom Row, Spans 2 cols) ---
function LinkedinAnimation() {
  const [step, setStep] = useState<"code" | "transforming" | "image" | "posted">("code");
  
  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStep("code");
        await new Promise(r => setTimeout(r, 2000));
        setStep("transforming");
        await new Promise(r => setTimeout(r, 1500));
        setStep("image");
        await new Promise(r => setTimeout(r, 1500));
        setStep("posted");
        await new Promise(r => setTimeout(r, 3000));
      }
    };
    sequence();
  }, []);

  return (
    <div style={{ width: "100%", height: "260px", display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", position: "relative" }}>
      
      {/* 1. Code Window */}
      <motion.div 
        animate={{ opacity: step === "code" || step === "transforming" ? 1 : 0.4, scale: step === "code" || step === "transforming" ? 1 : 0.95 }}
        style={{ width: "240px", height: "180px", background: "#1e1e1e", borderRadius: "8px", border: "1px solid #333", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", position: "relative" }}
      >
        <div style={{ display: "flex", gap: "6px", padding: "8px", borderBottom: "1px solid #333", background: "#252526" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ width: "40%", height: "6px", background: "#569cd6", borderRadius: "4px" }} />
          <div style={{ width: "70%", height: "6px", background: "#ce9178", borderRadius: "4px", marginLeft: "10px" }} />
          <div style={{ width: "50%", height: "6px", background: "#4ec9b0", borderRadius: "4px", marginLeft: "10px" }} />
          <div style={{ width: "80%", height: "6px", background: "#dcdcaa", borderRadius: "4px", marginLeft: "20px" }} />
          <div style={{ width: "60%", height: "6px", background: "#c586c0", borderRadius: "4px", marginLeft: "20px" }} />
          <div style={{ width: "30%", height: "6px", background: "#9cdcfe", borderRadius: "4px", marginLeft: "10px" }} />
        </div>

        {/* Transforming Scanner */}
        <AnimatePresence>
          {step === "transforming" && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, ease: "linear" }}
              style={{ position: "absolute", left: 0, right: 0, height: "100%", background: "linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.2) 90%, rgba(16, 185, 129, 0.8) 100%)", zIndex: 10, borderBottom: "2px solid #10b981" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Arrow & Magic Wand */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "var(--border-subtle)" }}>
        <motion.div animate={{ color: step === "transforming" || step === "image" ? "#10b981" : "var(--border-subtle)", scale: step === "transforming" ? 1.2 : 1 }}>
          <Sparkles size={24} />
        </motion.div>
        <div style={{ width: "40px", height: "2px", background: "currentColor", position: "relative" }}>
          <div style={{ position: "absolute", right: "-2px", top: "-4px", borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "5px solid currentColor" }} />
        </div>
      </div>

      {/* 3. Generated Image / LinkedIn Post */}
      <div style={{ position: "relative", width: "240px", height: "200px" }}>
        {/* The Beautiful Image Output */}
        <motion.div
          animate={{ 
            opacity: step === "image" || step === "posted" ? 1 : 0, 
            y: step === "posted" ? 10 : 0,
            scale: step === "posted" ? 0.8 : 1,
            zIndex: step === "posted" ? 1 : 10
          }}
          transition={{ duration: 0.5, ease: "backOut" }}
          style={{ position: "absolute", top: "10px", left: 0, right: 0, height: "140px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid rgba(255,255,255,0.1)" }}
        >
          <div style={{ width: "70%", height: "60%", background: "rgba(0,0,0,0.4)", borderRadius: "8px", backdropFilter: "blur(4px)", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
             <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }} />
             <div style={{ width: "60%", height: "4px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }} />
             <div style={{ width: "80%", height: "4px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }} />
          </div>
          <div style={{ position: "absolute", bottom: "8px", right: "12px", fontSize: "0.6rem", fontWeight: "bold", color: "#fff", opacity: 0.8 }}>Codeship</div>
        </motion.div>

        {/* The LinkedIn Feed Mockup that catches the image */}
        <motion.div
          animate={{ opacity: step === "posted" ? 1 : 0, y: step === "posted" ? 0 : 20 }}
          style={{ position: "absolute", top: 0, left: "-20px", right: "-20px", bottom: 0, background: "#fff", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px", zIndex: 0 }}
        >
          {/* Post Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#cbd5e1" }} />
            <div>
              <div style={{ width: "60px", height: "8px", background: "#94a3b8", borderRadius: "4px", marginBottom: "4px" }} />
              <div style={{ width: "40px", height: "6px", background: "#cbd5e1", borderRadius: "3px" }} />
            </div>
            <FaLinkedin color="#0077b5" size={16} style={{ marginLeft: "auto" }} />
          </div>
          {/* Post Text */}
          <div style={{ width: "90%", height: "6px", background: "#e2e8f0", borderRadius: "3px" }} />
          <div style={{ width: "70%", height: "6px", background: "#e2e8f0", borderRadius: "3px" }} />
          
          {/* The image lands inside here (simulated visually via the image moving down and scaling) */}
          
          {/* Success Overlay */}
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: step === "posted" ? 1 : 0 }} transition={{ delay: 0.3, type: "spring" }}
            style={{ position: "absolute", bottom: "-10px", right: "-10px", background: "#22c55e", color: "#fff", padding: "6px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)" }}
          >
            <Check size={12} /> Posted automatically
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}

// --- Main Grid Component ---
export function SolutionGrid() {
  const quadrants = [
    {
      title: "Real-time Code Capture",
      desc: "Automatically detects successful LeetCode submissions and extracts raw code instantly.",
      animation: <CaptureAnimation />
    },
    {
      title: "Format & Sanitize",
      desc: "Refines raw messy code into beautifully structured files tailored to your repository.",
      animation: <FormatAnimation />
    },
    {
      title: "Automated GitHub Sync",
      desc: "Securely pushes formatted solutions directly to your linked repository.",
      animation: <SyncAnimation />
    },
    {
      title: "Analytics Pipeline",
      desc: "Routes your submission data into our dashboard to track overall algorithmic progress.",
      animation: <AnalyticsAnimation />
    }
  ];

  return (
    <section style={{ width: "100%", padding: "120px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ textAlign: "center", marginBottom: "60px", maxWidth: "700px" }}>
        <h2 className="display-font" style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: "bold", marginBottom: "16px" }}>
          Built for Code That Actually Ships
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Codeship orchestrates your solutions into an observable, deterministic pipeline, automating the entire portfolio building process.
        </p>
      </div>

      <div style={{
        width: "100%", maxWidth: "1000px", 
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid var(--border-subtle)",
        borderLeft: "1px solid var(--border-subtle)"
      }}>
        {/* Top 4 Quadrants (2x2) */}
        {quadrants.map((q, idx) => (
          <div key={idx} style={{
            padding: "40px",
            borderRight: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", flexDirection: "column",
            background: "rgba(255,255,255,0.01)"
          }}>
            <div style={{ flex: 1, marginBottom: "40px" }}>
              {q.animation}
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>{q.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>{q.desc}</p>
            </div>
          </div>
        ))}
        
        {/* Bottom Row (LinkedIn Integration - Spans 2 Columns) */}
        <div style={{
            gridColumn: "span 2",
            padding: "40px",
            borderRight: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", flexDirection: "column",
            background: "rgba(255,255,255,0.01)"
          }}>
            <div style={{ flex: 1, marginBottom: "40px" }}>
              <LinkedinAnimation />
            </div>
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>Automated LinkedIn Showcasing</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Select a beautiful theme and instantly convert your solved code into a stunning image graphic. Codeship automatically posts it to your LinkedIn feed to build your personal brand effortlessly.
              </p>
            </div>
        </div>

      </div>
    </section>
  );
}
