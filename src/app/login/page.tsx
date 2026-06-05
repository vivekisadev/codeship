"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navbar } from "@/components/Navbar";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
    // Set initial mode based on URL
    if (typeof window !== "undefined" && window.location.pathname === "/signup") {
      setIsLogin(false);
    }
  }, [status, router]);

  const toggleAuthMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    if (typeof window !== "undefined") {
      window.history.pushState(null, '', newMode ? '/login' : '/signup');
    }
  };

  const handleLogin = () => {
    toast.loading("Logging you in securely...", {
      id: "login",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: "spin 2s linear infinite" }}
        >
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      ),
    });
    signIn("github", { callbackUrl: "/dashboard" });
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
        }}
      >
        <span className="display-font" style={{ fontWeight: '900', fontSize: '2rem', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
          Codeship
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
      }}
    >
      <Navbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, rotateX: 90, y: 10 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: -90, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ textAlign: "center", transformStyle: "preserve-3d" }}
          >
            <h1
              className="display-font"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              {isLogin ? "Log in to access your dashboard." : "Get started with Codeship today."}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleLogin}
          className="pill-dark"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <FaGithub size={20} /> Continue with GitHub
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login-footer" : "signup-footer"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleAuthMode}
                style={{ 
                  color: "var(--text-primary)", 
                  fontWeight: "600",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit"
                }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
}
