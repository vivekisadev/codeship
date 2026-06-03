"use client";

import { motion } from "framer-motion";
import {
  Code2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  FileCode2,
  Star,
} from "lucide-react";
import { FaGithub, FaChrome } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import Link from "next/link";
import { useState, useEffect } from "react";
import { InstallModal } from "../components/InstallModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { SolutionGrid } from "@/components/SolutionGrid";
import { useSession } from "next-auth/react";

export default function Home() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled((prev) => {
        if (!prev && window.scrollY > 60) return true;
        if (prev && window.scrollY < 20) return false;
        return prev;
      });
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
    <main className="container" style={{ paddingBottom: "120px" }}>
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: scrolled ? "16px 24px" : "24px 0",
          position: "sticky",
          top: "0",
          zIndex: 50,
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          backgroundColor: scrolled ? "var(--surface-elevated)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px -8px rgba(0, 0, 0, 0.2)" : "none",
          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          margin: scrolled ? "0 -24px" : "0",
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <motion.span layoutId="logo-text" className="display-font" style={{ 
            fontWeight: '900', 
            fontSize: scrolled ? '1.5rem' : '2rem', 
            letterSpacing: '-0.04em', 
            color: 'var(--text-primary)', 
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)' 
          }}>
            Codeship
          </motion.span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeToggle />
          {status === "loading" ? (
            <div style={{ width: "80px" }}></div>
          ) : session ? (
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Log In
              </Link>
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "80px auto 40px auto",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          style={{
            display: "inline-block",
            marginBottom: "24px",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            border: "1px solid var(--border-subtle)",
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            background: "rgba(255,255,255,0.5)",
          }}
        >
          For Software Engineers
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="heading-xl"
          style={{ marginBottom: "24px" }}
        >
          Offer your portfolio a better experience, scale your skills
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            marginBottom: "40px",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
          }}
        >
          Manage algorithms with precision, track solved problems in real-time,
          and collaborate seamlessly—all in one intuitive extension designed for
          engineers.
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{ display: "flex", gap: "16px", justifyContent: "center" }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "-10px",
                right: "-10px",
                bottom: "-10px",
                background:
                  "linear-gradient(90deg, rgba(236,72,153,0.4), rgba(139,92,246,0.4), rgba(96,165,250,0.4), rgba(236,72,153,0.4))",
                backgroundSize: "300% 100%",
                animation: "flowGlow 8s linear infinite",
                filter: "blur(20px)",
                zIndex: -1,
                borderRadius: "var(--radius-full)",
              }}
            ></div>
            <a
              href="/codeship-extension.zip"
              download
              onClick={() => setShowInstallModal(true)}
              className="pill-dark"
              style={{
                padding: "14px 32px",
                fontSize: "1.05rem",
                border: "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaChrome size={24} /> Install Extension
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Massive Dashboard Mockup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginBottom: "120px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="glass-panel"
          style={{
            width: "100%",
            maxWidth: "1100px",
            height: "600px",
            padding: "24px",
            display: "flex",
            gap: "24px",
            overflow: "hidden",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              width: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              borderRight: "1px solid var(--border-subtle)",
              paddingRight: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                marginBottom: "20px",
              }}
            >
              <span className="display-font" style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                Codeship
              </span>
            </div>
            {["Dashboard", "Submissions", "Analytics", "Settings"].map(
              (item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: i === 0 ? "rgba(0,0,0,0.05)" : "transparent",
                    color: i === 0 ? "#000" : "var(--text-secondary)",
                    fontSize: "0.9rem",
                    fontWeight: i === 0 ? "600" : "400",
                  }}
                >
                  {item}
                </div>
              ),
            )}
          </div>
          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Hello Developer!
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              <div className="mockup-card" style={{ padding: "20px" }}>
                <div
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  Problems Solved
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  243
                </div>
              </div>
              <div className="mockup-card" style={{ padding: "20px" }}>
                <div
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  Current Streak
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#ffa116",
                  }}
                >
                  14 Days
                </div>
              </div>
              <div className="mockup-card" style={{ padding: "20px" }}>
                <div
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  Lines Committed
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  8,492
                </div>
              </div>
            </div>
            <div
              className="mockup-card"
              style={{
                flex: 1,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                Recent Submissions
              </div>
              {[
                "Two Sum",
                "Valid Parentheses",
                "Merge Intervals",
                "LRU Cache",
              ].map((prob, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontWeight: "500" }}>{prob}</div>
                  <div
                    style={{
                      color: "var(--success)",
                      fontSize: "0.85rem",
                      background: "rgba(16,185,129,0.1)",
                      padding: "4px 12px",
                      borderRadius: "12px",
                    }}
                  >
                    Accepted
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Workflow Data Flow Graph */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: "80px", position: "relative" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            className="heading-lg"
            style={{ fontSize: "2.5rem", marginBottom: "16px" }}
          >
            Offer your skills a better workflow
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
            A seamless, invisible pipeline from submission to commit.
          </p>
        </div>

        {/* The Node Graph */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            position: "relative",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              zIndex: 2,
            }}
          >
            <div
              className="mockup-card"
              style={{
                padding: "20px",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                width: "160px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 161, 22, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SiLeetcode size={24} color="#ffa116" />
              </div>
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                1. Solve
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-tertiary)",
              paddingBottom: "40px",
            }}
          >
            <ArrowRight size={24} strokeWidth={1.5} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              zIndex: 2,
            }}
          >
            <div
              className="mockup-card"
              style={{
                padding: "20px",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                width: "160px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaChrome size={24} color="#10b981" />
              </div>
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                2. Intercept
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-tertiary)",
              paddingBottom: "40px",
            }}
          >
            <ArrowRight size={24} strokeWidth={1.5} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              zIndex: 2,
            }}
          >
            <div
              className="pill-dark"
              style={{
                padding: "24px 32px",
                borderRadius: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                width: "180px",
                margin: "0",
              }}
            >
              <span className="display-font" style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.04em', color: '#fff' }}>
                Codeship
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-tertiary)",
              paddingBottom: "40px",
            }}
          >
            <ArrowRight size={24} strokeWidth={1.5} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              zIndex: 2,
            }}
          >
            <div
              className="mockup-card"
              style={{
                padding: "20px",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                width: "160px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(17, 24, 39, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaGithub size={24} color="var(--text-primary)" />
              </div>
              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                4. Commit
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Grid 2: 3 Minimal White Cards */}
      <section style={{ marginBottom: "120px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bento-card dotted-bg"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                color: "#f59e0b",
                fontWeight: "bold",
              }}
            >
              <Zap size={16} /> Fast Setup
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Zero Overhead
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                marginBottom: "32px",
              }}
            >
              The extension sits quietly in the background without affecting
              browser speed.
            </p>
            <div className="mockup-card" style={{ marginTop: "auto" }}>
              <div style={{ fontWeight: "bold" }}>Service Worker</div>
              <div
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                Status: Sleeping (0% CPU)
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bento-card dotted-bg"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                color: "#8b5cf6",
                fontWeight: "bold",
              }}
            >
              <SiLeetcode size={16} /> Native
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Native Experience
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                marginBottom: "32px",
              }}
            >
              Works perfectly with the new dynamic LeetCode editor.
            </p>
            <div
              className="mockup-card"
              style={{
                marginTop: "auto",
                background: "#f8fafc",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              def twoSum(self, nums):
              <br />
              &nbsp;&nbsp;return [0, 1]
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bento-card dotted-bg"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                color: "#10b981",
                fontWeight: "bold",
              }}
            >
              <FileCode2 size={16} /> Documentation
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Automated READMEs
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                marginBottom: "32px",
              }}
            >
              Automatically generate rich markdown files for each solution.
            </p>
            <div className="mockup-card" style={{ marginTop: "auto" }}>
              <h4
                style={{ color: "#111", fontSize: "1rem", marginBottom: "4px" }}
              >
                # 1. Two Sum
              </h4>
              <p
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Difficulty: Easy
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial / Metrics Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "120px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "center",
            maxWidth: "800px",
          }}
        >
          <div
            className="mockup-card"
            style={{ width: "250px", padding: "32px", textAlign: "center" }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "24px",
                background: "var(--text-primary)",
                color: "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              V
            </div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Vivek</div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                marginBottom: "16px",
              }}
            >
              Software Engineer
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "16px",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              Algorithms Solved
            </div>
            <div
              className="display-font"
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "var(--text-primary)",
              }}
            >
              400+
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.6",
                color: "var(--text-primary)",
                fontWeight: "500",
              }}
            >
              "Codeship has been a game changer for my portfolio. Before using
              it, remembering to copy-paste solutions was chaotic. With
              Codeship's automated GitHub pushes, I went from an empty repo to a
              highly active open-source profile—without adding any operational
              headaches."
            </p>
          </div>
        </div>
      </motion.section>

      {/* Solution Grid (Animated Simulations) */}
      <SolutionGrid />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--border-subtle)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          <h2 className="heading-lg" style={{ maxWidth: "500px", margin: 0 }}>
            Offer your portfolio a better experience, scale your skills
          </h2>
          <div style={{ maxWidth: "400px" }}>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              Manage algorithms with precision, track solved problems in
              real-time, and collaborate seamlessly—all in one intuitive
              extension.
            </p>
            <div style={{ position: "relative", display: "inline-block", marginTop: "16px" }}>
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "-10px",
                  right: "-10px",
                  bottom: "-10px",
                  background:
                    "linear-gradient(90deg, rgba(236,72,153,0.4), rgba(139,92,246,0.4), rgba(96,165,250,0.4), rgba(236,72,153,0.4))",
                  backgroundSize: "300% 100%",
                  animation: "flowGlow 8s linear infinite",
                  filter: "blur(20px)",
                  zIndex: -1,
                  borderRadius: "var(--radius-full)",
                }}
              ></div>
              <a
                href="/codeship-extension.zip"
                download
                onClick={() => setShowInstallModal(true)}
                className="pill-dark"
                style={{
                  padding: "12px 32px",
                  fontSize: "1rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaChrome size={24} /> Install Extension
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Giant Faded Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="display-font"
          style={{
            fontSize: "20vw",
            fontWeight: "bold",
            color: "var(--text-primary)",
            opacity: 0.03,
            lineHeight: "0.8",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          Codeship
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "60px",
          paddingTop: "40px",
          borderTop: "1px solid var(--border-subtle)",
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            maxWidth: "300px",
            marginBottom: "40px",
          }}
        >
          <span className="display-font" style={{ fontWeight: '900', fontSize: '3rem', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
            Codeship
          </span>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1rem",
              lineHeight: "1.5",
            }}
          >
            Our mission is to offer engineers a better portfolio experience.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "32px",
            fontWeight: "500",
            fontSize: "0.875rem",
          }}
        >
          <Link href="/docs" style={{ color: "var(--text-primary)", textDecoration: "none" }}>
            Documentation
          </Link>
          <Link href="/dashboard" style={{ color: "var(--text-primary)", textDecoration: "none" }}>
            Dashboard
          </Link>
        </div>

        <div
          style={{ display: "flex", gap: "16px", color: "var(--text-primary)" }}
        >
          <a href="https://github.com/vivekisadev/codeship" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "bold" }}>
            GitHub
          </a>
        </div>
      </footer>

      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </main>
  );
}
