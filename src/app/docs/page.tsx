"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navbar } from "@/components/Navbar";
import { ChevronRight, Terminal, Code2, Zap, Settings, ArrowRight } from "lucide-react";

export default function DocsPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Navigation */}
      <Navbar
        rightContent={
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
            Dashboard
          </Link>
        }
      />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px 120px 24px" }}>
        
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: "60px", textAlign: "center" }}
        >
          <motion.h1 variants={itemVariants} className="display-font" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", letterSpacing: "-0.04em", marginBottom: "24px", lineHeight: "1.1" }}>
            Documentation
          </motion.h1>
          <motion.p variants={itemVariants} style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            Learn about why Codeship was built, how it works under the hood, and how to get the most out of it.
          </motion.p>
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: "flex", flexDirection: "column", gap: "60px" }}
        >
          
          {/* Origin Story */}
          <motion.section variants={itemVariants}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                <Zap size={24} />
              </div>
              <h2 className="display-font" style={{ fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.02em" }}>Why Codeship?</h2>
            </div>
            <div className="glass-panel" style={{ padding: "32px", borderRadius: "24px", lineHeight: "1.7", color: "var(--text-secondary)", fontSize: "1.05rem" }}>
              <p style={{ marginBottom: "16px" }}>
                As developers, we spend hours grinding on LeetCode to prepare for interviews and sharpen our skills. But having an empty GitHub contribution graph while working hard on problem-solving is frustrating.
              </p>
              <p>
                Manually copying and pasting solutions, formatting file names, writing commit messages, and pushing to GitHub is tedious. 
                <strong style={{ color: "var(--text-primary)" }}> Codeship was built to eliminate this friction.</strong> It automatically captures your accepted submissions and syncs them to your repository, giving you a beautiful, effortless portfolio of your algorithmic journey.
              </p>
            </div>
          </motion.section>

          {/* Architecture */}
          <motion.section variants={itemVariants}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                <Settings size={24} />
              </div>
              <h2 className="display-font" style={{ fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.02em" }}>How It Works</h2>
            </div>
            <div className="glass-panel" style={{ padding: "32px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.7" }}>
                Codeship uses a hybrid approach, combining a browser extension for capturing client-side events and a Next.js backend for secure data processing.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--foreground)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>1</div>
                  <div>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Event Interception</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>The Chrome Extension injects a script into LeetCode that monitors network requests and DOM changes to detect when a submission is successfully accepted.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--foreground)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>2</div>
                  <div>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Secure Payload Relay</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>The extension gathers the problem details, runtime metrics, and your exact code, then securely relays this payload to our authenticated Next.js API.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--foreground)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>3</div>
                  <div>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>GitHub API Commits</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Our backend utilizes your encrypted Personal Access Token (PAT) to interact with the GitHub REST API, creating or updating files with precision.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Tech Stack */}
          <motion.section variants={itemVariants}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                <Code2 size={24} />
              </div>
              <h2 className="display-font" style={{ fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.02em" }}>Tech Stack</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              
              <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontWeight: "600", fontSize: "1.1rem" }}>Next.js 14</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>App Router for robust serverless APIs and seamless server-side rendering.</p>
              </div>

              <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontWeight: "600", fontSize: "1.1rem" }}>Prisma & PostgreSQL</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Type-safe database operations storing user settings securely.</p>
              </div>

              <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontWeight: "600", fontSize: "1.1rem" }}>Framer Motion</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Fluid, premium animations and layout transitions across the interface.</p>
              </div>

              <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontWeight: "600", fontSize: "1.1rem" }}>Chrome APIs</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Manifest V3 architecture for efficient background processing.</p>
              </div>
              
            </div>
          </motion.section>

          {/* Usage Guide */}
          <motion.section variants={itemVariants}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                <Terminal size={24} />
              </div>
              <h2 className="display-font" style={{ fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.02em" }}>Usage Guide</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: "32px", borderRadius: "24px" }}>
              <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "24px", color: "var(--text-secondary)", fontSize: "1.05rem", margin: 0 }}>
                <li style={{ paddingLeft: "12px" }}>
                  <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>1. Authenticate with GitHub</strong>
                  Log in to the Codeship dashboard using your GitHub account via NextAuth.
                </li>
                <li style={{ paddingLeft: "12px" }}>
                  <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>2. Configure Your Settings</strong>
                  Generate a classic Personal Access Token (PAT) with <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>repo</code> permissions. Enter it in the dashboard along with the name of the repository you want to sync your solutions to.
                </li>
                <li style={{ paddingLeft: "12px" }}>
                  <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>3. Install the Extension</strong>
                  Download and load the Codeship Chrome Extension locally in developer mode (or install from the Chrome Web Store if available).
                </li>
                <li style={{ paddingLeft: "12px" }}>
                  <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>4. Solve Problems</strong>
                  Head over to LeetCode, solve a problem, and hit Submit. Once accepted, Codeship handles the rest automatically in the background!
                </li>
              </ol>
            </div>
          </motion.section>

        </motion.div>
      </main>
    </div>
  );
}
