"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleLogin = () => {
    toast.loading("Logging you in securely...", { 
      id: "login",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 2s linear infinite" }}>
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      )
    });
    signIn("github", { callbackUrl: '/dashboard' });
  };

  if (status === "loading" || status === "authenticated") {
    return <div style={{ minHeight: '100vh', background: 'var(--background)' }}></div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }} className="display-font">
          <div style={{ background: 'var(--text-primary)', color: 'var(--background)', borderRadius: '8px', padding: '6px' }}>
            <Code2 size={20} strokeWidth={2.5} />
          </div>
          Codeship
        </Link>
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="display-font" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to access your dashboard.</p>
        </div>

        <button 
          onClick={handleLogin}
          className="btn-primary" 
          style={{ width: '100%', padding: '14px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1.05rem', borderRadius: '12px' }}
        >
          <FaGithub size={20} /> Continue with GitHub
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
